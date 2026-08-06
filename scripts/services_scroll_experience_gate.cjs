const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-audit");
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900, touch: false },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
];

fs.mkdirSync(OUTPUT, { recursive: true });

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
  assert(sceneCount >= 13, `${label}: expected at least 13 directed scenes, found ${sceneCount}`);
  assert(
    (await page.locator('[data-services-scroll-scene] > [data-services-scene-signal="true"]').count()) === sceneCount,
    `${label}: every scene must carry one continuity signal`,
  );

  const metrics = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    scrollViewports: document.documentElement.scrollHeight / window.innerHeight,
    activeChapter: document.documentElement.dataset.servicesActiveChapter || null,
    chapterProgress: getComputedStyle(document.documentElement)
      .getPropertyValue("--services-chapter-progress")
      .trim(),
  }));

  assert(metrics.scrollViewports <= 19, `${label}: ${metrics.scrollViewports.toFixed(2)} scroll viewports is still padded`);
  assert(metrics.activeChapter, `${label}: active chapter was not published`);
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
  const firstSelected = await selectedTabIndex(tabs);

  const journey = offerings.locator('[data-services-discipline-journey="true"]');
  assert((await journey.count()) === 1, `${label}: the service-discipline journey is missing`);

  let journeyRange = null;
  if (viewport.width >= 1024) {
    journeyRange = await journey.evaluate((node) => node.getBoundingClientRect().height / window.innerHeight);
    assert(
      journeyRange >= 1.62 && journeyRange <= 1.78,
      `${label}: service ecosystem uses ${journeyRange.toFixed(2)} viewports; expected about 1.7`,
    );

    await journey.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const travel = Math.max(0, node.getBoundingClientRect().height - window.innerHeight);
      window.scrollTo({ top: top + travel * 0.58, behavior: "instant" });
    });
    await page.waitForTimeout(520);
  } else {
    await page.waitForTimeout(4_200);
  }

  const advancedSelected = await selectedTabIndex(tabs);
  assert(advancedSelected !== firstSelected, `${label}: the service ecosystem did not advance`);

  const websiteTab = offerings.getByRole("tab", { name: "Website Development", exact: true });
  await websiteTab.click();
  assert((await websiteTab.getAttribute("aria-selected")) === "true", `${label}: manual service choice failed`);
  await page.waitForTimeout(4_200);
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
    assert(
      authorityRange >= 2.05 && authorityRange <= 2.3,
      `${label}: Authority uses ${authorityRange.toFixed(2)} viewports; expected the compressed 2.2 range`,
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
  const videoLimit = viewport.width < 768 ? 2 : 3;
  assert(playingVideos <= videoLimit, `${label}: ${playingVideos} videos playing; limit ${videoLimit}`);

  await noHorizontalOverflow(page, label);
  await page.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-offerings.png`),
    fullPage: false,
    animations: "disabled",
  });

  await context.close();
  return {
    viewport: viewport.name,
    ...metrics,
    sceneCount,
    playingVideos,
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
