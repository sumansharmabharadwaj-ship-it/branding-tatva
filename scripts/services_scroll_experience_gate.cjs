const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-audit");
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900, touch: false },
  { name: "tablet-1024x768", width: 1024, height: 768, touch: true },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
];

fs.mkdirSync(OUTPUT, { recursive: true });

// The directed composition as of "Services opens clean and every chapter
// visibly performs" (798c8ad2): nine chapters. The former stakes,
// deliverables, imagine, and health chapters were folded into their
// neighbours, and the verified outcome now lives at #proof (where /work
// redirects) while keeping its scene key.
const EXPECTED_CHAPTERS = [
  { id: "services-opening", scene: "opening" },
  { id: "situation", scene: "situation" },
  { id: "offerings", scene: "offerings" },
  { id: "desire", scene: "desire" },
  { id: "proof", scene: "verified-outcome" },
  { id: "authority", scene: "authority" },
  { id: "education", scene: "education" },
  { id: "audit", scene: "audit" },
  { id: "book", scene: "book" },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) {
    await veil.waitFor({ state: "detached", timeout: 10_000 }).catch(() => {});
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(420);
}

async function noHorizontalOverflow(page, label) {
  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert(
    widths.document <= widths.viewport + 2 && widths.body <= widths.viewport + 2,
    `${label}: horizontal overflow ${JSON.stringify(widths)}`,
  );
}

async function selectedTabIndex(tabs) {
  return tabs.evaluateAll((nodes) =>
    nodes.findIndex((node) => node.getAttribute("aria-selected") === "true"),
  );
}

async function visible(locator) {
  return (await locator.count()) > 0 && (await locator.first().isVisible());
}

// Scene progress is (viewportHeight - top) / (viewportHeight + height); solve
// for the scroll position that puts a scene at the requested progress. The
// discipline sequence is story-progress-led, so the gate drives it the same
// way a visitor does: by moving the page.
async function scrollSceneToProgress(page, id, target) {
  await page.evaluate(
    ({ id, target }) => {
      const scene = document.getElementById(id);
      if (!scene) return;
      const rect = scene.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const viewportHeight = window.innerHeight;
      window.scrollTo({
        top: Math.max(0, top - viewportHeight + target * (viewportHeight + rect.height)),
        behavior: "instant",
      });
    },
    { id, target },
  );
}

async function assertChapterContract(page, sceneCount, label) {
  await page.waitForFunction(
    (expected) => Number(document.documentElement.dataset.servicesChapterCount) === expected,
    sceneCount,
    { timeout: 15_000 },
  );

  const chapters = await page.locator("[data-services-scroll-scene]").evaluateAll((nodes) =>
    nodes.map((node) => ({
      id: node.id,
      label: node.getAttribute("data-services-chapter-label"),
      scene: node.getAttribute("data-services-scroll-scene"),
    })),
  );

  assert(chapters.length === sceneCount, `${label}: chapter metadata count drifted from scene count`);
  assert(chapters.every((chapter) => chapter.label), `${label}: a directed scene has no chapter label`);
  EXPECTED_CHAPTERS.forEach((expected, index) => {
    const actual = chapters[index];
    assert(
      actual && actual.id === expected.id && actual.scene === expected.scene,
      `${label}: chapter ${index + 1} is ${actual ? `${actual.id}/${actual.scene}` : "missing"}; expected ${expected.id}/${expected.scene}`,
    );
  });

  return chapters;
}

async function assertWayfinding(page, viewport, label, sceneCount) {
  const rail = page.locator('[data-section-jump-nav-desktop-mode="rail"]');
  const bar = page.locator('[data-section-jump-nav-desktop-mode="bar"]');
  const mobile = page.locator('[data-section-jump-nav-mobile="true"]');

  if (viewport.width >= 1024) {
    await page.waitForFunction(
      (expected) =>
        document.querySelectorAll('[data-section-jump-nav-desktop-mode="rail"] a[href^="#"]').length === expected,
      sceneCount,
      { timeout: 15_000 },
    );
    assert(await visible(rail), `${label}: compact desktop chapter rail is not visible`);
    assert(!(await visible(bar)), `${label}: full-width bottom chapter bar is still visible`);
    assert(!(await visible(mobile)), `${label}: mobile chapter dial is visible beside the desktop rail`);
    assert(
      (await rail.locator('a[href^="#"]').count()) === sceneCount,
      `${label}: desktop rail does not expose all ${sceneCount} chapters`,
    );

    // The rail animates in; give the entrance time to settle before
    // measuring, otherwise a mid-transition bounding box reads as the rail
    // escaping the viewport.
    await page
      .waitForFunction(
        () => {
          const node = document.querySelector('[data-section-jump-nav-desktop-mode="rail"]');
          if (!node) return false;
          const bounds = node.getBoundingClientRect();
          return bounds.top >= -2 && bounds.bottom <= window.innerHeight + 2;
        },
        undefined,
        { timeout: 15_000 },
      )
      .catch(() => {});
    const geometry = await rail.first().evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      return {
        width: bounds.width,
        rightGap: window.innerWidth - bounds.right,
        top: bounds.top,
        bottom: bounds.bottom,
      };
    });
    assert(geometry.width <= 80, `${label}: chapter rail is ${geometry.width.toFixed(1)}px wide`);
    assert(geometry.rightGap <= 28, `${label}: chapter rail drifted ${geometry.rightGap.toFixed(1)}px from the edge`);
    assert(geometry.top >= -2 && geometry.bottom <= viewport.height + 2, `${label}: chapter rail exceeds the viewport`);
  } else {
    assert(!(await visible(rail)), `${label}: desktop chapter rail is visible on mobile`);
    assert(!(await visible(bar)), `${label}: bottom chapter bar is visible on mobile`);
    assert(await visible(mobile), `${label}: compact mobile chapter dial is missing`);

    const trigger = mobile.locator("button").last();
    await trigger.click();
    // The guided dial lists a continue-to-next-chapter quick action above
    // the full chapter list, so the menu is judged by chapter coverage
    // rather than raw anchor count.
    await page
      .waitForFunction(
        (expectedIds) => {
          const hrefs = new Set(
            Array.from(
              document.querySelectorAll('[data-section-jump-nav-mobile="true"] a[href^="#"]'),
            ).map((node) => node.getAttribute("href")),
          );
          return expectedIds.every((id) => hrefs.has(`#${id}`));
        },
        EXPECTED_CHAPTERS.map((chapter) => chapter.id),
        { timeout: 15_000 },
      )
      .catch(() => {});
    const menuHrefs = await mobile
      .locator('a[href^="#"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
    for (const chapter of EXPECTED_CHAPTERS) {
      assert(
        menuHrefs.includes(`#${chapter.id}`),
        `${label}: mobile chapter menu is missing #${chapter.id}`,
      );
    }
    await trigger.click();
  }
}

async function assertFinalArrivalOwnsViewport(page, label) {
  await page.locator("#book").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const visibleGuides = await page.locator('nav[aria-label="Jump to section"]').evaluateAll((nodes) =>
    nodes.filter((node) => {
      const style = getComputedStyle(node);
      const bounds = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.05 && bounds.width > 0 && bounds.height > 0;
    }).length,
  );
  assert(visibleGuides === 0, `${label}: ${visibleGuides} fixed chapter guides remain in the strategy room`);
}

async function auditViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page);

  const label = `services-scroll/${viewport.name}`;
  await page.waitForFunction(() => document.documentElement.dataset.servicesExperience === "active");

  const sceneCount = await page.locator("[data-services-scroll-scene]").count();
  assert(
    sceneCount === EXPECTED_CHAPTERS.length,
    `${label}: expected ${EXPECTED_CHAPTERS.length} directed scenes, found ${sceneCount}`,
  );
  const chapters = await assertChapterContract(page, sceneCount, label);
  await assertWayfinding(page, viewport, label, sceneCount);

  const metrics = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    scrollViewports: document.documentElement.scrollHeight / window.innerHeight,
    activeChapter: document.documentElement.dataset.servicesActiveChapter || null,
    activeChapterId: document.documentElement.dataset.servicesActiveChapterId || null,
    chapterCount: Number(document.documentElement.dataset.servicesChapterCount || 0),
    chapterProgress: getComputedStyle(document.documentElement)
      .getPropertyValue("--services-chapter-progress")
      .trim(),
  }));

  assert(metrics.scrollViewports <= 19, `${label}: ${metrics.scrollViewports.toFixed(2)} scroll viewports is still padded`);
  assert(metrics.activeChapter, `${label}: active chapter was not published`);
  assert(metrics.activeChapterId, `${label}: active chapter ID was not published`);
  assert(metrics.chapterCount === sceneCount, `${label}: published chapter count is ${metrics.chapterCount}`);
  assert(metrics.chapterProgress, `${label}: chapter progress was not published`);

  const hero = page.locator('[data-services-hero-scene="true"]');
  assert((await hero.count()) === 1, `${label}: Services hero director is missing`);
  assert((await hero.locator('[data-services-hero-heading="true"]').count()) === 1, `${label}: hero heading is not directed`);
  assert((await hero.locator('[data-services-hero-aperture="true"]').count()) === 1, `${label}: hero aperture is missing`);
  const heroStart = await hero.evaluate((node) => ({
    phase: node.getAttribute("data-services-hero-phase"),
    scale: getComputedStyle(node).getPropertyValue("--services-hero-scale").trim(),
  }));

  const beforeScroll = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => window.scrollBy({ top: 320, behavior: "instant" }));
  await page.waitForTimeout(160);
  const afterScroll = await page.evaluate(() => window.scrollY);
  assert(afterScroll > beforeScroll + 250, `${label}: native scroll did not respond immediately`);
  const heroAfter = await hero.evaluate((node) => ({
    phase: node.getAttribute("data-services-hero-phase"),
    scale: getComputedStyle(node).getPropertyValue("--services-hero-scale").trim(),
  }));
  assert(
    heroAfter.phase !== heroStart.phase || heroAfter.scale !== heroStart.scale,
    `${label}: the first gesture did not change the hero composition`,
  );

  const offerings = page.locator("#offerings");
  await offerings.scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const tabs = offerings.getByRole("tab");
  assert((await tabs.count()) === 6, `${label}: the service explorer should expose six disciplines`);

  const journey = offerings.locator('[data-services-discipline-journey="true"]');
  assert((await journey.count()) === 1, `${label}: the service-discipline journey is missing`);

  // All six disciplines now resolve inside one stable stage; the former
  // 1.7-viewport sticky runway is retired. Scene story progress, not
  // internal travel, advances the sequence.
  let journeyRange = null;
  if (viewport.width >= 1024) {
    journeyRange = await journey.evaluate((node) => node.getBoundingClientRect().height / window.innerHeight);
    assert(
      journeyRange >= 0.9 && journeyRange <= 1.3,
      `${label}: discipline stage uses ${journeyRange.toFixed(2)} viewports; expected one stable stage`,
    );
  }

  await scrollSceneToProgress(page, "offerings", 0.4);
  await page.waitForTimeout(520);
  const firstSelected = await selectedTabIndex(tabs);

  await scrollSceneToProgress(page, "offerings", 0.72);
  await page.waitForTimeout(520);
  const advancedSelected = await selectedTabIndex(tabs);
  assert(advancedSelected !== firstSelected, `${label}: scroll progress did not advance the discipline sequence`);

  // Let the runtime's velocity smoothing come to rest before the manual
  // gesture, the way a visitor's tap lands on a settled page — a click
  // issued mid-settle can miss the moving tab entirely.
  await page.waitForFunction(
    () =>
      new Promise((resolve) => {
        const initial = window.scrollY;
        setTimeout(() => resolve(window.scrollY === initial), 220);
      }),
    undefined,
    { timeout: 15_000 },
  );
  const websiteTab = offerings.getByRole("tab", { name: "Website Development", exact: true });
  await websiteTab.click();
  await page.waitForTimeout(180);
  assert((await websiteTab.getAttribute("aria-selected")) === "true", `${label}: manual service choice failed`);
  // A manual choice holds for 14 seconds against scroll-led progression;
  // driving the scene to a different story position must leave it selected.
  await scrollSceneToProgress(page, "offerings", 0.55);
  await page.waitForTimeout(520);
  assert(
    (await websiteTab.getAttribute("aria-selected")) === "true",
    `${label}: automatic progression fought the visitor's manual choice`,
  );

  const authority = page.locator("#authority");
  await authority.scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  if (viewport.width >= 1024) {
    const authorityRange = await authority.locator(":scope > div").first().evaluate((node) => {
      const height = node.getBoundingClientRect().height;
      return height / window.innerHeight;
    });
    // Authority resolves inside one viewport: the shared services camera
    // assembles its layers during entry rather than holding a sticky runway.
    assert(
      authorityRange >= 0.9 && authorityRange <= 1.2,
      `${label}: Authority uses ${authorityRange.toFixed(2)} viewports; expected one settled viewport`,
    );
  }

  const education = page.locator("#education");
  await education.scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  const laterProgress = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--services-chapter-progress").trim(),
  );
  assert(laterProgress && laterProgress !== metrics.chapterProgress, `${label}: chapter progress did not advance`);

  const playingVideos = await page.locator("video").evaluateAll((videos) =>
    videos.filter((video) => !video.paused && !video.ended).length,
  );
  const videoLimit = viewport.width < 768 ? 1 : 2;
  assert(playingVideos <= videoLimit, `${label}: ${playingVideos} videos playing; limit ${videoLimit}`);

  await noHorizontalOverflow(page, label);
  await page.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-offerings.png`),
    fullPage: false,
    animations: "disabled",
  });

  await assertFinalArrivalOwnsViewport(page, label);

  await context.close();
  return {
    viewport: viewport.name,
    ...metrics,
    sceneCount,
    chapterIds: chapters.map((chapter) => chapter.id),
    playingVideos,
    videoLimit,
    journeyRange,
  };
}

async function auditReducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page);

  const authority = page.locator("#authority > div").first();
  const authorityRange = await authority.evaluate(
    (node) => node.getBoundingClientRect().height / window.innerHeight,
  );
  assert(
    authorityRange < 2.05,
    `services-scroll/reduced: Authority retained a ${authorityRange.toFixed(2)}-viewport scroll cage`,
  );

  const journey = page.locator('[data-services-discipline-journey="true"]');
  const journeyPosition = await journey.locator(":scope > div").evaluate((node) =>
    getComputedStyle(node).position,
  );
  assert(journeyPosition !== "sticky", "services-scroll/reduced: service journey remained sticky");

  const playingVideos = await page.locator("video").evaluateAll((videos) =>
    videos.filter((video) => !video.paused && !video.ended).length,
  );
  assert(playingVideos === 0, `services-scroll/reduced: ${playingVideos} videos are still playing`);
  await noHorizontalOverflow(page, "services-scroll/reduced");
  await context.close();
  return { authorityRange, journeyPosition, playingVideos };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  let reducedMotion;

  try {
    for (const viewport of VIEWPORTS) {
      results.push(await auditViewport(browser, viewport));
    }
    reducedMotion = await auditReducedMotion(browser);
  } finally {
    await browser.close();
  }

  const report = {
    generatedAt: new Date().toISOString(),
    commit: process.env.AUDIT_COMMIT || "local",
    results,
    reducedMotion,
  };
  fs.writeFileSync(path.join(OUTPUT, "services-scroll-report.json"), JSON.stringify(report, null, 2));
  console.log("Services scroll-compression gate passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
