const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "homepage-v4-audit");

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForHome(page) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) await veil.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  await page.waitForSelector("[data-home-v4]", { timeout: 12_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(420);
}

async function selectedProcessTab(page) {
  return page.locator('.project-journey__rail [role="tab"][aria-selected="true"]').textContent();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForHome(page);

  const guide = page.locator("[data-guided-controls]");
  assert((await guide.count()) === 1, "Live V4 guided controls are missing");
  assert((await guide.getAttribute("data-guide-mode")) === "manual", "Homepage did not begin in manual mode");

  const openingVideo = page.locator('[data-home-v4-chapter="opening"] video').first();
  await openingVideo.waitFor({ state: "attached", timeout: 5_000 });
  await page.waitForTimeout(450);
  const openingRate = await openingVideo.evaluate((video) => video.playbackRate);
  assert(openingRate >= 1.29 && openingRate <= 1.31, `Opening video playback rate is ${openingRate}, expected about 1.30x`);

  const play = guide.getByRole("button", { name: "Play guided journey" });
  const guidedStartedAt = Date.now();
  await play.click();
  await page.waitForFunction(() => document.querySelector("[data-guided-controls]")?.getAttribute("data-guide-mode") === "guided");
  await page.waitForFunction(
    () => (document.querySelector("[data-guided-controls] strong")?.textContent || "").startsWith("02/"),
    undefined,
    { timeout: 4_800 },
  );
  const firstAdvanceMs = Date.now() - guidedStartedAt;
  assert(firstAdvanceMs >= 2_800 && firstAdvanceMs <= 4_800, `First guided chapter advance took ${firstAdvanceMs}ms`);

  // Restart from the opening, begin the guide again, and interrupt during the
  // first automatic transition. Real input must win before the guide settles.
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForHome(page);
  const freshGuide = page.locator("[data-guided-controls]");
  await freshGuide.getByRole("button", { name: "Play guided journey" }).click();
  await page.waitForTimeout(3_380);
  const beforeManual = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 520);
  await page.waitForFunction(() => document.querySelector("[data-guided-controls]")?.getAttribute("data-guide-mode") === "manual", undefined, { timeout: 450 });
  await page.waitForTimeout(180);
  const afterManual = await page.evaluate(() => scrollY);
  assert(afterManual > beforeManual + 35, `Manual wheel moved only ${afterManual - beforeManual}px while interrupting guided mode`);
  await page.waitForTimeout(850);
  assert((await freshGuide.getAttribute("data-guide-mode")) === "manual", "Guided mode resumed after manual interruption");

  // Pause is a real comfort state: ambient video must stop, not merely freeze
  // the progress ring while media keeps decoding behind it.
  await freshGuide.getByRole("button", { name: "Play guided journey" }).click();
  await page.waitForFunction(() => document.querySelector("[data-guided-controls]")?.getAttribute("data-guide-mode") === "guided");
  await freshGuide.getByRole("button", { name: "Pause guided journey" }).click();
  await page.waitForTimeout(320);
  assert((await freshGuide.getAttribute("data-guide-mode")) === "paused", "Pause control did not publish paused mode");
  const playingWhilePaused = await page.locator("[data-home-v4] video").evaluateAll((videos) => videos.filter((video) => !video.paused && !video.ended).length);
  assert(playingWhilePaused === 0, `${playingWhilePaused} homepage videos remained active while the guided view was paused`);

  await freshGuide.getByRole("button", { name: "Explore the homepage manually" }).click();
  const process = page.locator('[data-home-v4-chapter="process"]');
  await process.scrollIntoViewIfNeeded();
  await page.waitForTimeout(550);
  assert((await process.getAttribute("data-process-tempo-managed")) === "true", "Process tempo director is not mounted");
  const processBefore = await selectedProcessTab(page);
  await page.waitForTimeout(1_950);
  const processAfter = await selectedProcessTab(page);
  assert(Boolean(processBefore) && Boolean(processAfter), "Process selected-state copy is missing");
  assert(processBefore !== processAfter, `Process did not advance inside the first pacing beat: ${processBefore}`);

  const playingNearProcess = await page.locator("[data-home-v4] video").evaluateAll((videos) => videos.filter((video) => !video.paused && !video.ended).length);
  assert(playingNearProcess <= 2, `${playingNearProcess} homepage videos are playing on desktop; budget is 2`);
  assert(pageErrors.length === 0, `Browser errors:\n${pageErrors.join("\n")}`);

  await page.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-guided-pacing.png"),
    animations: "disabled",
  });

  const report = {
    generatedAt: new Date().toISOString(),
    openingRate,
    firstAdvanceMs,
    beforeManual,
    afterManual,
    playingWhilePaused,
    processBefore,
    processAfter,
    playingNearProcess,
  };
  fs.writeFileSync(path.join(OUTPUT, "home-v4-pacing-report.json"), JSON.stringify(report, null, 2));

  await context.close();

  const reducedContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForHome(reducedPage);
  assert((await reducedPage.locator("[data-guided-controls]").count()) === 0, "Reduced-motion homepage still renders guided autoplay controls");
  const reducedPlaying = await reducedPage.locator("[data-home-v4] video").evaluateAll((videos) => videos.filter((video) => !video.paused && !video.ended).length);
  assert(reducedPlaying === 0, `${reducedPlaying} homepage videos are playing under reduced motion`);
  await reducedContext.close();

  await browser.close();
  process.stdout.write("Homepage V4 pacing gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
