const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-audit");
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900, mediaLimit: 2 },
  { name: "tablet-1024x768", width: 1024, height: 768, mediaLimit: 2 },
  { name: "mobile-390x844", width: 390, height: 844, mediaLimit: 1, touch: true },
  {
    name: "reduced-motion-1440x900",
    width: 1440,
    height: 900,
    mediaLimit: 0,
    reducedMotion: "reduce",
  },
];

const EXPECTED_SCENES = [
  "opening",
  "situation",
  "offerings",
  "desire",
  "verified-outcome",
  "authority",
  "stakes",
  "education",
  "deliverables",
  "imagine",
  "health",
  "audit",
  "book",
];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function expectedMissingAsset(url) {
  return (
    /\/(videos|audio)\//i.test(url) ||
    /\/_vercel\/(insights|speed-insights)\//i.test(url)
  );
}

async function waitForPrelude(page) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 9_000 });
  }
  await page.waitForTimeout(260);
}

async function scrollSceneToProgress(page, selector, progress) {
  await page.evaluate(
    ({ selector, progress }) => {
      const scene = document.querySelector(selector);
      if (!(scene instanceof HTMLElement)) return;
      const viewport = window.innerHeight;
      const top = scene.getBoundingClientRect().top + window.scrollY;
      const target = top - viewport * 0.84 + progress * (scene.offsetHeight + viewport * 0.68);
      window.scrollTo({ top: Math.max(0, target), behavior: "auto" });
    },
    { selector, progress },
  );
  await page.waitForTimeout(520);
}

async function auditViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: viewport.reducedMotion || "no-preference",
    hasTouch: Boolean(viewport.touch),
  });

  await context.addInitScript(() => {
    try {
      window.sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });

  const page = await context.newPage();
  const consoleErrors = [];
  const failedResponses = [];
  const failedRequests = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) failedResponses.push({ status: response.status(), url: response.url() });
  });
  page.on("requestfailed", (request) => {
    failedRequests.push({ url: request.url(), error: request.failure()?.errorText || "request failed" });
  });

  await page.goto(`${BASE_URL}/services`, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await page.evaluate(() => document.fonts.ready);
  await waitForPrelude(page);
  await page.waitForSelector('[data-services-scroll-root][data-services-scroll-ready="true"]', {
    timeout: 12_000,
  });

  const structure = await page.evaluate(() => {
    const root = document.querySelector("[data-services-scroll-root]");
    const scenes = Array.from(document.querySelectorAll("[data-services-scene]"));
    const documentWidth = document.documentElement.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const legacyNavigation = Array.from(document.querySelectorAll('nav[aria-label="Jump to section"]')).map(
      (node) => getComputedStyle(node).display,
    );
    const desktopProgress = document.querySelector('[data-services-progress="desktop"]');
    const mobileProgress = document.querySelector('[data-services-progress="mobile"]');
    return {
      rootReady: root?.getAttribute("data-services-scroll-ready"),
      scenes: scenes.map((scene) => scene.getAttribute("data-services-scene")),
      documentWidth,
      viewportWidth,
      scrollHeight,
      viewportHeight,
      legacyNavigation,
      desktopProgressDisplay: desktopProgress ? getComputedStyle(desktopProgress).display : null,
      mobileProgressDisplay: mobileProgress ? getComputedStyle(mobileProgress).display : null,
    };
  });

  assert(structure.rootReady === "true", `${viewport.name}: scroll director did not initialise`);
  for (const scene of EXPECTED_SCENES) {
    assert(structure.scenes.includes(scene), `${viewport.name}: missing Services scene ${scene}`);
  }
  assert(
    structure.documentWidth <= structure.viewportWidth + 2,
    `${viewport.name}: horizontal overflow ${structure.documentWidth}px > ${structure.viewportWidth}px`,
  );
  assert(
    structure.legacyNavigation.every((display) => display === "none"),
    `${viewport.name}: legacy full-width section navigation is still visible`,
  );

  if (viewport.width >= 900 && !viewport.touch) {
    assert(structure.desktopProgressDisplay !== "none", `${viewport.name}: desktop chapter rail is hidden`);
    assert(structure.mobileProgressDisplay === "none", `${viewport.name}: mobile dial is visible on desktop`);
  } else {
    assert(structure.mobileProgressDisplay !== "none", `${viewport.name}: mobile chapter dial is hidden`);
  }

  const beforeWheel = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 620);
  await page.waitForTimeout(420);
  const afterWheel = await page.evaluate(() => window.scrollY);
  assert(afterWheel > beforeWheel + 40, `${viewport.name}: native wheel scrolling did not respond immediately`);

  const offerings = page.locator("#offerings");
  assert((await offerings.count()) === 1, `${viewport.name}: offerings scene missing`);
  const offeringMetrics = await offerings.evaluate((section) => {
    const stage = section.querySelector("[data-services-sticky-stage]");
    return {
      height: section.getBoundingClientRect().height,
      viewport: window.innerHeight,
      stagePosition: stage ? getComputedStyle(stage).position : null,
      tabCount: section.querySelectorAll('[role="tab"]').length,
    };
  });
  assert(offeringMetrics.tabCount === 6, `${viewport.name}: expected six Services disciplines`);

  if (viewport.width >= 900 && viewport.reducedMotion !== "reduce") {
    const ratio = offeringMetrics.height / offeringMetrics.viewport;
    assert(ratio >= 1.45 && ratio <= 1.9, `${viewport.name}: offerings scroll range is ${ratio.toFixed(2)} viewports`);
    assert(offeringMetrics.stagePosition === "sticky", `${viewport.name}: offerings visual stage is not sticky`);

    await scrollSceneToProgress(page, "#offerings", 0.08);
    const earlyTab = await offerings.locator('[role="tab"][aria-selected="true"]').getAttribute("id");
    await scrollSceneToProgress(page, "#offerings", 0.9);
    const lateTab = await offerings.locator('[role="tab"][aria-selected="true"]').getAttribute("id");
    assert(earlyTab !== lateTab, `${viewport.name}: scroll did not advance the active Services discipline`);
    assert(lateTab === "service-discipline-tab-5", `${viewport.name}: final Services discipline did not resolve`);
  }

  if (viewport.reducedMotion === "reduce") {
    assert(offeringMetrics.stagePosition !== "sticky", `${viewport.name}: reduced motion retained a sticky scroll scene`);
  }

  await page.locator("#health").scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const media = await page.evaluate(() => ({
    playing: Array.from(document.querySelectorAll("video")).filter(
      (video) => !video.paused && !video.ended,
    ).length,
    managed: document.querySelectorAll('video[data-services-media-managed="true"]').length,
  }));
  assert(media.playing <= viewport.mediaLimit, `${viewport.name}: ${media.playing} videos playing; limit is ${viewport.mediaLimit}`);
  if (viewport.reducedMotion !== "reduce") {
    assert(media.managed > 0, `${viewport.name}: media conductor did not register Services videos`);
  }

  const totalScrollViewports = structure.scrollHeight / structure.viewportHeight;
  const meaningfulStates = EXPECTED_SCENES.length + offeringMetrics.tabCount;
  const explorationDensity = meaningfulStates / totalScrollViewports;

  await page.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-services-full.png`),
    fullPage: true,
  });
  await offerings.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-services-disciplines.png`),
  });

  const actionableErrors = consoleErrors.filter(
    (error) =>
      !/^Failed to load resource:/i.test(error) &&
      !/_vercel\/(insights|speed-insights)/i.test(error) &&
      !/net::ERR_ABORTED/i.test(error),
  );
  const actionableResponses = failedResponses.filter(({ url }) => !expectedMissingAsset(url));
  const actionableRequests = failedRequests.filter(({ url }) => !expectedMissingAsset(url));

  assert(
    actionableErrors.length === 0 && actionableResponses.length === 0 && actionableRequests.length === 0,
    `${viewport.name}: browser/network errors:\n${[
      ...actionableErrors,
      ...actionableResponses.map(({ status, url }) => `${status} ${url}`),
      ...actionableRequests.map(({ error, url }) => `${error} ${url}`),
    ].join("\n")}`,
  );

  await context.close();
  return {
    viewport: viewport.name,
    sceneCount: structure.scenes.length,
    meaningfulStates,
    totalScrollHeight: structure.scrollHeight,
    totalScrollViewports: Number(totalScrollViewports.toFixed(2)),
    explorationDensity: Number(explorationDensity.toFixed(3)),
    offeringsRangeViewports: Number((offeringMetrics.height / offeringMetrics.viewport).toFixed(2)),
    media,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const viewport of VIEWPORTS) {
      results.push(await auditViewport(browser, viewport));
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(OUTPUT, "services-scroll-report.json"),
    JSON.stringify(
      {
        commit: process.env.AUDIT_COMMIT || "local",
        generatedAt: new Date().toISOString(),
        results,
      },
      null,
      2,
    ),
  );

  process.stdout.write(`Services scroll gate passed for ${VIEWPORTS.length} viewport profiles.\n`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
