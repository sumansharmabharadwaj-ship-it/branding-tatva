const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = (process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const OUTPUT_DIR = process.env.ABOUT_AUDIT_OUTPUT_DIR
  ? path.resolve(process.env.ABOUT_AUDIT_OUTPUT_DIR)
  : path.join(process.cwd(), "about-resolution-audit");
const MOCK_VIDEO_PATH = process.env.ABOUT_MEMORY_MOCK_VIDEO || "";
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900, interactive: true },
  { name: "short-desktop-1024x600", width: 1024, height: 600, interactive: false },
  { name: "tablet-1023x768", width: 1023, height: 768, interactive: false, touch: true },
  { name: "zoom-equivalent-720x450", width: 720, height: 450, interactive: false },
  { name: "mobile-390x844", width: 390, height: 844, interactive: false, touch: true, mobileNavigation: true },
  { name: "narrow-mobile-320x568", width: 320, height: 568, interactive: false, touch: true, mobileNavigation: true },
  { name: "reduced-desktop-1440x900", width: 1440, height: 900, interactive: false, reducedMotion: "reduce" },
  { name: "reduced-mobile-320x568", width: 320, height: 568, interactive: false, touch: true, reducedMotion: "reduce" },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function resolveChromiumExecutable() {
  const configured = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
  if (configured) {
    assert(fs.existsSync(configured), `Configured Playwright executable does not exist: ${configured}`);
    return configured;
  }

  const bundled = chromium.executablePath();
  if (fs.existsSync(bundled)) return bundled;

  const cacheRoot = path.join(os.homedir(), ".cache", "ms-playwright");
  if (!fs.existsSync(cacheRoot)) return undefined;

  const entries = fs.readdirSync(cacheRoot, { withFileTypes: true });
  const newestCachedExecutable = (pattern, executableName) => entries
    .filter((entry) => entry.isDirectory() && pattern.test(entry.name))
    .sort((left, right) => Number(right.name.split("-").at(-1)) - Number(left.name.split("-").at(-1)))
    .map((entry) => path.join(cacheRoot, entry.name, "chrome-linux", executableName))
    .find((candidate) => fs.existsSync(candidate));

  return newestCachedExecutable(/^chromium_headless_shell-\d+$/, "headless_shell")
    || newestCachedExecutable(/^chromium-\d+$/, "chrome");
}

async function waitForPrelude(page) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) await loader.waitFor({ state: "detached", timeout: 10_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}

async function readChapterHeadingClearance(page, id) {
  return page.evaluate((chapterId) => {
    const target = document.getElementById(chapterId);
    const heading = target?.querySelector("h2");
    const header = document.querySelector("[data-site-header]");
    const headerBar = header?.querySelector(".site-header__bar");
    if (!target || !heading || !header || !headerBar) return null;

    const headerPadding = Number.parseFloat(getComputedStyle(header).paddingTop) || 0;
    return {
      chapterTop: target.getBoundingClientRect().top,
      headingTop: heading.getBoundingClientRect().top,
      headerClearance: headerPadding + headerBar.getBoundingClientRect().height,
    };
  }, id);
}

async function auditViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: Boolean(viewport.touch),
    reducedMotion: viewport.reducedMotion || "no-preference",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  if (MOCK_VIDEO_PATH && fs.existsSync(MOCK_VIDEO_PATH)) {
    const videoBody = fs.readFileSync(MOCK_VIDEO_PATH);
    await page.route("**/videos/**", (route) => route.fulfill({ status: 200, contentType: "video/mp4", body: videoBody }));
  }

  try {
    const response = await page.goto(`${BASE_URL}/about#about-founder-led`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    assert(response?.ok(), `${viewport.name}: /about returned ${response?.status()}`);
    await waitForPrelude(page);
    const founderAnchorAlignment = await readChapterHeadingClearance(page, "about-founder-led");
    assert(founderAnchorAlignment, `${viewport.name}: founder-led chapter has no measurable heading geometry`);
    assert(
      founderAnchorAlignment.headingTop >= founderAnchorAlignment.headerClearance - 1,
      `${viewport.name}: founder-led heading is covered at ${founderAnchorAlignment.headingTop}px by a ${founderAnchorAlignment.headerClearance}px header`,
    );
    const founderScene = page.locator('[data-scroll-story="about-founder-led"]');
    await founderScene.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const founderInteractive = viewport.width >= 821
      && viewport.height > 620
      && !viewport.touch
      && !viewport.reducedMotion;
    const founderMode = await founderScene.evaluate((node) => {
      const interactive = node.querySelector('[class*="sheetCamera"]');
      const fallback = node.querySelector('[class*="staticExperience"]');
      return {
        interactive: getComputedStyle(interactive).display !== "none",
        static: getComputedStyle(fallback).display !== "none",
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });
    assert(founderMode.interactive === founderInteractive, `${viewport.name}: founder-led chapter rendered the wrong mode`);
    assert(founderMode.static !== founderInteractive, `${viewport.name}: founder-led fallback visibility is incorrect`);
    assert(founderMode.documentWidth <= founderMode.viewportWidth + 2, `${viewport.name}: founder-led chapter causes horizontal overflow`);

    if (founderInteractive) {
      const founderTabs = founderScene.locator('[role="tablist"] [role="tab"]');
      assert((await founderTabs.count()) === 4, `${viewport.name}: founder-led record does not expose four decisions`);
      await founderTabs.first().click();
      await founderTabs.first().press("End");
      await page.waitForFunction(() => {
        const record = document.querySelector('[data-record-stage="4"]');
        if (!record) return false;
        const values = (getComputedStyle(record).clipPath.match(/-?\d*\.?\d+/g) || []).map(Number);
        return values.length > 0 && values.every((value) => Math.abs(value) < 0.5);
      }, undefined, { timeout: 3_000 });
      const finalFounderState = await founderScene.evaluate((root) => ({
        focusId: document.activeElement?.id,
        selected: Array.from(root.querySelectorAll('[role="tablist"] [role="tab"]')).map((tab) => tab.getAttribute("aria-selected")),
        promise: root.querySelector('[class*="recordedOutput"][data-final="true"]')?.textContent?.replace(/\s+/g, " ").trim(),
        servicesHref: root.querySelector('a[href="/services#study"]')?.getAttribute("href"),
      }));
      assert(finalFounderState.focusId === "direct-stage-3", `${viewport.name}: End did not focus the final founder-led decision`);
      assert(finalFounderState.selected.join(",") === "false,false,false,true", `${viewport.name}: End did not select Application`);
      assert(finalFounderState.promise?.includes("You never brief the thinking twice."), `${viewport.name}: final direct-access promise is missing`);
      assert(finalFounderState.promise?.includes("Every decision connected."), `${viewport.name}: final continuity promise is incomplete`);
      assert(finalFounderState.servicesHref === "/services#study", `${viewport.name}: founder-led services path is missing`);
    } else {
      const staticFounder = founderScene.locator('[class*="staticExperience"]:visible');
      assert((await staticFounder.locator("ol > li").count()) === 4, `${viewport.name}: static founder-led record is incomplete`);
      const staticPromiseText = await staticFounder.locator('[class*="staticPromise"]').textContent();
      assert(
        staticPromiseText?.includes("You never brief the thinking twice."),
        `${viewport.name}: static direct-access promise is missing`,
      );
      assert(
        (await staticFounder.locator('a[href="/services#study"]').count()) === 1,
        `${viewport.name}: static founder-led services path is missing`,
      );
    }
    await page.screenshot({ path: path.join(OUTPUT_DIR, `founder-led-${viewport.name}.png`) });

    await page.goto(`${BASE_URL}/about#about-system`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await waitForPrelude(page);
    const resolutionAnchorAlignment = await readChapterHeadingClearance(page, "about-system");
    assert(resolutionAnchorAlignment, `${viewport.name}: brand-system chapter has no measurable heading geometry`);
    assert(
      resolutionAnchorAlignment.headingTop >= resolutionAnchorAlignment.headerClearance - 1,
      `${viewport.name}: brand-system heading is covered at ${resolutionAnchorAlignment.headingTop}px by a ${resolutionAnchorAlignment.headerClearance}px header`,
    );
    const scene = page.locator('[data-scroll-story="about-resolution-threshold"]');
    await scene.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const mode = await scene.evaluate((node) => {
      const interactive = node.querySelector('[class*="interactiveExperience"]');
      const fallback = node.querySelector('[class*="staticExperience"]');
      return {
        interactive: getComputedStyle(interactive).display !== "none",
        static: getComputedStyle(fallback).display !== "none",
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });
    assert(mode.interactive === viewport.interactive, `${viewport.name}: rendered the wrong closing-record mode`);
    assert(mode.static !== viewport.interactive, `${viewport.name}: fallback visibility does not match the intended mode`);
    assert(mode.documentWidth <= mode.viewportWidth + 2, `${viewport.name}: horizontal overflow ${mode.documentWidth}px`);

    if (viewport.interactive) {
      const buttons = scene.locator('[role="tablist"] [role="tab"]');
      assert((await buttons.count()) === 3, `${viewport.name}: expected three closing routes`);
      const routeResults = [];
      for (let index = 0; index < 3; index += 1) {
        await buttons.nth(index).click();
        await page.waitForTimeout(700);
        const geometry = await scene.evaluate(() => {
          const sheet = document.querySelector("#about-resolution-record");
          const active = sheet?.querySelector('article[data-state="active"]');
          const content = Array.from(active?.querySelectorAll("small, span, p, h3, dt, dd") || []);
          const sheetBox = sheet?.getBoundingClientRect();
          const bounds = content.map((node) => node.getBoundingClientRect());
          return {
            selected: Array.from(document.querySelectorAll('[data-scroll-story="about-resolution-threshold"] [role="tablist"] [role="tab"]')).map((button) => button.getAttribute("aria-selected")),
            hidden: Array.from(sheet?.querySelectorAll("article") || []).map((article) => article.getAttribute("aria-hidden")),
            sheet: sheetBox && { top: sheetBox.top, right: sheetBox.right, bottom: sheetBox.bottom, left: sheetBox.left },
            content: {
              top: Math.min(...bounds.map((box) => box.top)),
              right: Math.max(...bounds.map((box) => box.right)),
              bottom: Math.max(...bounds.map((box) => box.bottom)),
              left: Math.min(...bounds.map((box) => box.left)),
            },
          };
        });
        const contained =
          geometry.content.top >= geometry.sheet.top - 1 &&
          geometry.content.right <= geometry.sheet.right + 1 &&
          geometry.content.bottom <= geometry.sheet.bottom + 1 &&
          geometry.content.left >= geometry.sheet.left - 1;
        routeResults.push({ route: index + 1, contained, geometry });
        await page.screenshot({ path: path.join(OUTPUT_DIR, `${viewport.name}-route-${index + 1}.png`) });
        assert(geometry.selected[index] === "true", `${viewport.name}: route ${index + 1} did not become selected`);
        assert(geometry.hidden.filter((value) => value === "false").length === 1, `${viewport.name}: more than one record is exposed`);
      }
      const clippedRoutes = routeResults.filter((result) => !result.contained);
      assert(
        clippedRoutes.length === 0,
        `${viewport.name}: record content is clipped ${JSON.stringify(clippedRoutes)}`,
      );

      await buttons.nth(0).click();
      await buttons.nth(0).press("End");
      const keyboardState = await scene.evaluate((root) => ({
        focusId: document.activeElement?.id,
        selected: Array.from(root.querySelectorAll('[role="tablist"] [role="tab"]')).map((tab) => tab.getAttribute("aria-selected")),
        exposedRecords: root.querySelectorAll('#about-resolution-record article[aria-hidden="false"]').length,
        panelLabelledBy: root.querySelector("#about-resolution-record")?.getAttribute("aria-labelledby"),
      }));
      assert(keyboardState.focusId === "about-resolution-path-2", `${viewport.name}: End did not focus the final route`);
      assert(keyboardState.selected.join(",") === "false,false,true", `${viewport.name}: End did not select the final route`);
      assert(keyboardState.exposedRecords === 1, `${viewport.name}: keyboard selection exposed multiple records`);
      assert(keyboardState.panelLabelledBy === "about-resolution-path-2", `${viewport.name}: panel label did not follow keyboard selection`);
    } else {
      const cards = scene.locator('[class*="staticPaths"] article:visible');
      assert((await cards.count()) === 3, `${viewport.name}: complete three-route fallback is missing`);
      for (const card of await cards.all()) {
        const box = await card.boundingBox();
        assert(box && box.width > 0 && box.height > 0, `${viewport.name}: fallback route has no readable box`);
      }

      const fallbackGeometry = await scene.evaluate((root) => {
        const cards = Array.from(root.querySelectorAll('[class*="staticPaths"] article'))
          .filter((card) => card.getClientRects().length > 0);
        const contentContained = cards.every((card) => {
          const cardBox = card.getBoundingClientRect();
          return Array.from(card.querySelectorAll("small, h3, p, strong, a")).every((node) => {
            const box = node.getBoundingClientRect();
            return box.top >= cardBox.top - 1 &&
              box.right <= cardBox.right + 1 &&
              box.bottom <= cardBox.bottom + 1 &&
              box.left >= cardBox.left - 1;
          });
        });
        const actions = root.querySelector("[data-about-resolution-actions]")?.getBoundingClientRect();
        return {
          contentContained,
          actionsVisible: Boolean(actions && actions.width > 0 && actions.height > 0),
        };
      });
      assert(fallbackGeometry.contentContained, `${viewport.name}: fallback text escapes its reading record`);
      assert(fallbackGeometry.actionsVisible, `${viewport.name}: closing actions are not reachable`);

      const firstRouteLink = scene.locator('[class*="staticPaths"] a:visible').first();
      await firstRouteLink.focus();
      // Reduced motion clamps an existing `transition: all` to 0.01ms. Let
      // that single style frame settle before checking the final focus ring.
      await page.waitForTimeout(20);
      const focusState = await firstRouteLink.evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          focusVisible: node.matches(":focus-visible"),
          outlineWidth: Number.parseFloat(style.outlineWidth) || 0,
          hasHalo: style.boxShadow !== "none",
        };
      });
      assert(
        focusState.focusVisible && (focusState.outlineWidth >= 2 || focusState.hasHalo),
        `${viewport.name}: fallback route has no visible keyboard focus ring`,
      );

      if (viewport.mobileNavigation) {
        await page.locator("#about-system").scrollIntoViewIfNeeded();
        await page.waitForTimeout(700);
        const chooser = page.getByRole("button", { name: /Choose About chapter/ });
        assert(await chooser.isVisible(), `${viewport.name}: mobile chapter chooser is not visible`);
        const collision = await page.evaluate(() => {
          const controls = document.querySelector('[class*="mobileChapterControls"]')?.getBoundingClientRect();
          const consent = document.querySelector(".consent-notice")?.getBoundingClientRect();
          return controls && consent ? consent.top - controls.bottom : null;
        });
        assert(collision === null || collision > 0, `${viewport.name}: consent banner overlaps the chapter chooser`);
        await chooser.click();
        assert((await chooser.getAttribute("aria-expanded")) === "true", `${viewport.name}: chapter chooser did not open`);
        assert((await page.locator('#about-mobile-chapter-list a[tabindex="0"]').count()) === 8, `${viewport.name}: complete chapter list is not keyboard available`);
        await chooser.press("Escape");
        await page.waitForTimeout(50);
        assert((await chooser.getAttribute("aria-expanded")) === "false", `${viewport.name}: Escape did not close the chapter chooser`);
        assert(await chooser.evaluate((node) => document.activeElement === node), `${viewport.name}: Escape did not restore chapter-chooser focus`);

        const protectedEndingSpace = await scene.evaluate((node) => {
          const inner = node.querySelector('[class*="inner"]');
          const actions = node.querySelector("[data-about-resolution-actions]");
          if (!(inner instanceof HTMLElement) || !(actions instanceof HTMLElement)) return null;
          const paddingBottom = Number.parseFloat(getComputedStyle(inner).paddingBottom);
          const actionBottom = actions.getBoundingClientRect().bottom;
          const innerBottom = inner.getBoundingClientRect().bottom;
          return { paddingBottom, trailingSpace: innerBottom - actionBottom };
        });
        assert(protectedEndingSpace, `${viewport.name}: final action geometry is unavailable`);
        assert(protectedEndingSpace.paddingBottom >= 124, `${viewport.name}: mobile closing clearance is too small`);
        assert(protectedEndingSpace.trailingSpace >= 120, `${viewport.name}: final actions do not retain usable trailing space`);

        await chooser.click();
        await page.locator('#about-mobile-chapter-list a[href="#about-philosophy"]').click();
        await page.waitForFunction(() => {
          const heading = document.querySelector("#about-philosophy h2");
          const header = document.querySelector("[data-site-header]");
          const headerBar = header?.querySelector(".site-header__bar");
          if (!heading || !header || !headerBar) return false;
          const headerPadding = Number.parseFloat(getComputedStyle(header).paddingTop) || 0;
          const headerClearance = headerPadding + headerBar.getBoundingClientRect().height;
          return heading.getBoundingClientRect().top >= headerClearance - 1;
        }, undefined, { timeout: 3_000 });
        const chooserAnchorAlignment = await readChapterHeadingClearance(page, "about-philosophy");
        assert(chooserAnchorAlignment, `${viewport.name}: about-philosophy has no measurable heading geometry`);
        assert(
          chooserAnchorAlignment.headingTop >= chooserAnchorAlignment.headerClearance - 1,
          `${viewport.name}: about-philosophy heading is covered at ${chooserAnchorAlignment.headingTop}px by a ${chooserAnchorAlignment.headerClearance}px header`,
        );
        assert(page.url().endsWith("/about#about-philosophy"), `${viewport.name}: chapter choice did not update the URL hash`);
        assert(
          await page.locator("#about-philosophy h2").evaluate((node) => document.activeElement === node),
          `${viewport.name}: chapter choice did not move focus to its heading`,
        );
        await page.screenshot({ path: path.join(OUTPUT_DIR, `chapter-navigation-${viewport.name}.png`) });
      }
    }

    assert(pageErrors.length === 0, `${viewport.name}: page errors ${JSON.stringify(pageErrors)}`);
    await page.locator("#about-resolution").evaluate((node) => {
      node.scrollIntoView({ behavior: "instant", block: "start" });
    });
    await page.waitForFunction(() => {
      const heading = document.querySelector("#about-resolution h2");
      const header = document.querySelector("[data-site-header]");
      const headerBar = header?.querySelector(".site-header__bar");
      if (!heading || !header || !headerBar) return false;
      const headerPadding = Number.parseFloat(getComputedStyle(header).paddingTop) || 0;
      const headerClearance = headerPadding + headerBar.getBoundingClientRect().height;
      return heading.getBoundingClientRect().top >= headerClearance - 1;
    }, undefined, { timeout: 3_000 });
    await page.waitForFunction(() => {
      const controls = document.querySelector("[data-about-mobile-chapter-controls]");
      if (!controls || getComputedStyle(controls).display === "none") return true;
      const summary = controls.querySelector('button[aria-controls="about-mobile-chapter-list"]');
      return summary?.getAttribute("aria-label")?.includes("The next move");
    }, undefined, { timeout: 3_000 });
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${viewport.name}.png`) });
    return {
      viewport: viewport.name,
      mode: viewport.interactive ? "interactive" : "static",
      anchorTop: resolutionAnchorAlignment.chapterTop,
      headerClearance: resolutionAnchorAlignment.headerClearance,
      founderLedMode: founderInteractive ? "interactive" : "static",
      founderLedAnchorTop: founderAnchorAlignment.chapterTop,
    };
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const executablePath = resolveChromiumExecutable();
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
  try {
    const results = [];
    const failures = [];
    for (const viewport of VIEWPORTS) {
      try {
        results.push(await auditViewport(browser, viewport));
      } catch (error) {
        failures.push({ viewport: viewport.name, error: String(error) });
      }
    }
    const report = { results, failures };
    fs.writeFileSync(path.join(OUTPUT_DIR, "results.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    assert(failures.length === 0, `About resolution rendered gate failed ${JSON.stringify(failures)}`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
