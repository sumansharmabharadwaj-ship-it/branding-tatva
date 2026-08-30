const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = (process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const OUTPUT_DIR = path.join(process.cwd(), "about-resolution-audit");
const MOCK_VIDEO_PATH = process.env.ABOUT_MEMORY_MOCK_VIDEO || "";
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900, interactive: true },
  { name: "short-desktop-1024x600", width: 1024, height: 600, interactive: false },
  { name: "tablet-1023x768", width: 1023, height: 768, interactive: false, touch: true },
  { name: "mobile-390x844", width: 390, height: 844, interactive: false, touch: true },
  { name: "reduced-desktop-1440x900", width: 1440, height: 900, interactive: false, reducedMotion: "reduce" },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) await loader.waitFor({ state: "detached", timeout: 10_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
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
    const response = await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    assert(response?.ok(), `${viewport.name}: /about returned ${response?.status()}`);
    await waitForPrelude(page);
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
        await scene.screenshot({ path: path.join(OUTPUT_DIR, `${viewport.name}-route-${index + 1}.png`) });
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

      if (viewport.name === "mobile-390x844") {
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
      }
    }

    assert(pageErrors.length === 0, `${viewport.name}: page errors ${JSON.stringify(pageErrors)}`);
    await scene.screenshot({ path: path.join(OUTPUT_DIR, `${viewport.name}.png`) });
    return { viewport: viewport.name, mode: viewport.interactive ? "interactive" : "static" };
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
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
