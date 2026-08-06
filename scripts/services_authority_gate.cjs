const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-audit");

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  }
  await page.waitForTimeout(240);
}

async function inspect(browser, profile) {
  const context = await browser.newContext({
    viewport: { width: profile.width, height: profile.height },
    reducedMotion: profile.reducedMotion,
    hasTouch: Boolean(profile.touch),
  });

  await context.addInitScript(() => {
    try {
      window.sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  await waitForPrelude(page);

  const authority = page.locator("#authority");
  assert((await authority.count()) === 1, `${profile.name}: #authority is missing`);
  await authority.scrollIntoViewIfNeeded();
  await page.waitForTimeout(620);

  const metrics = await authority.evaluate((section) => {
    const wrapper = section.querySelector("[data-authority-scroll-mode]");
    const stage = wrapper?.firstElementChild;
    const documentWidth = document.documentElement.scrollWidth;
    return {
      mode: wrapper?.getAttribute("data-authority-scroll-mode"),
      wrapperHeight: wrapper?.getBoundingClientRect().height || 0,
      stagePosition: stage instanceof HTMLElement ? getComputedStyle(stage).position : null,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      documentWidth,
      visibleDesktopLayers: Array.from(section.querySelectorAll("[data-authority-desktop-layer]"))
        .filter((node) => {
          const bounds = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return bounds.width > 0 && bounds.height > 0 && style.display !== "none";
        }).length,
      mobileDeckVisible: Array.from(section.querySelectorAll("[data-authority-mobile-deck]"))
        .some((node) => {
          const bounds = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return bounds.width > 0 && bounds.height > 0 && style.display !== "none";
        }),
    };
  });

  assert(
    metrics.documentWidth <= metrics.viewportWidth + 2,
    `${profile.name}: horizontal overflow ${metrics.documentWidth}px > ${metrics.viewportWidth}px`,
  );

  const range = metrics.wrapperHeight / metrics.viewportHeight;
  if (profile.expectedMode === "compressed-sticky") {
    assert(metrics.mode === "compressed-sticky", `${profile.name}: expected compressed-sticky, received ${metrics.mode}`);
    assert(range >= 2.05 && range <= 2.35, `${profile.name}: Authority range is ${range.toFixed(2)} viewports`);
    assert(metrics.stagePosition === "sticky", `${profile.name}: Authority stage is not sticky`);
    assert(metrics.visibleDesktopLayers === 5, `${profile.name}: expected five visible Authority layers`);
  } else {
    assert(metrics.mode === "static", `${profile.name}: expected static mode, received ${metrics.mode}`);
    assert(metrics.stagePosition !== "sticky", `${profile.name}: static Authority stage is still sticky`);
    if (typeof profile.maxRangeViewports === "number") {
      assert(
        range <= profile.maxRangeViewports,
        `${profile.name}: static Authority scene consumes ${range.toFixed(2)} viewports`,
      );
    }
    if (profile.expectDesktopLayers) {
      assert(
        metrics.visibleDesktopLayers === 5,
        `${profile.name}: complete desktop Authority system is not visible at rest`,
      );
    }
  }

  await authority.screenshot({
    path: path.join(OUTPUT, `${profile.name}-authority.png`),
    animations: "disabled",
  });

  await context.close();
  return {
    profile: profile.name,
    mode: metrics.mode,
    rangeViewports: Number(range.toFixed(2)),
    stagePosition: metrics.stagePosition,
    visibleDesktopLayers: metrics.visibleDesktopLayers,
    mobileDeckVisible: metrics.mobileDeckVisible,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    results.push(
      await inspect(browser, {
        name: "desktop-1440x900",
        width: 1440,
        height: 900,
        reducedMotion: "no-preference",
        expectedMode: "compressed-sticky",
      }),
    );
    results.push(
      await inspect(browser, {
        name: "reduced-motion-1440x900",
        width: 1440,
        height: 900,
        reducedMotion: "reduce",
        expectedMode: "static",
        maxRangeViewports: 2,
        expectDesktopLayers: true,
      }),
    );
    results.push(
      await inspect(browser, {
        name: "mobile-390x844",
        width: 390,
        height: 844,
        reducedMotion: "no-preference",
        touch: true,
        expectedMode: "static",
      }),
    );
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(OUTPUT, "services-authority-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
  );

  process.stdout.write("Services Authority gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
