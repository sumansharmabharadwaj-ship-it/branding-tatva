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

async function clickAnimatedControl(locator) {
  await locator.waitFor({ state: "visible", timeout: 5_000 });
  // The play affordance intentionally pulses with a perpetual scale animation
  // while its discovery hint is visible. Playwright's normal click waits for
  // geometric stability that this control is designed never to reach; a real
  // pointer can still activate it, so use the same hit target without that
  // inapplicable stability precondition.
  await locator.click({ force: true });
}

async function waitForAttribute(page, locator, name, expected, timeoutMs = 2_500) {
  const deadline = Date.now() + timeoutMs;
  let actual = null;
  while (Date.now() < deadline) {
    actual = await locator.getAttribute(name);
    if (actual === expected) return;
    await page.waitForTimeout(60);
  }
  throw new Error(`${name} resolved to ${actual}, expected ${expected}`);
}

async function waitForTextPrefix(page, locator, prefix, timeoutMs = 2_500) {
  const deadline = Date.now() + timeoutMs;
  let actual = "";
  while (Date.now() < deadline) {
    actual = (await locator.textContent()) || "";
    if (actual.startsWith(prefix)) return;
    await page.waitForTimeout(60);
  }
  throw new Error(`text resolved to ${JSON.stringify(actual)}, expected prefix ${JSON.stringify(prefix)}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
      localStorage.setItem(
        "bt-consent",
        JSON.stringify({
          analytics: false,
          marketing: false,
          decidedAt: "2026-08-17T00:00:00.000Z",
          version: 1,
        }),
      );
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
  assert(openingRate >= 0.85 && openingRate <= 0.87, `Opening video playback rate is ${openingRate}, expected about 0.86x`);

  const play = guide.getByRole("button", { name: "Play guided journey" });
  const guidedStartedAt = Date.now();
  await clickAnimatedControl(play);
  await waitForAttribute(page, guide, "data-guide-mode", "guided");
  await waitForTextPrefix(page, guide.locator("strong"), "02/", 4_800);
  const firstAdvanceMs = Date.now() - guidedStartedAt;
  assert(firstAdvanceMs >= 2_800 && firstAdvanceMs <= 4_800, `First guided chapter advance took ${firstAdvanceMs}ms`);

  // Restart from the opening, begin the guide again, and interrupt during the
  // first automatic transition. Real input must win before the guide settles.
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForHome(page);
  const freshGuide = page.locator("[data-guided-controls]");
  await clickAnimatedControl(freshGuide.getByRole("button", { name: "Play guided journey" }));
  await page.waitForTimeout(3_380);
  const beforeManual = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 520);
  await waitForAttribute(page, freshGuide, "data-guide-mode", "manual", 450);
  await page.waitForTimeout(180);
  const afterManual = await page.evaluate(() => scrollY);
  assert(afterManual > beforeManual + 35, `Manual wheel moved only ${afterManual - beforeManual}px while interrupting guided mode`);
  await page.waitForTimeout(850);
  assert((await freshGuide.getAttribute("data-guide-mode")) === "manual", "Guided mode resumed after manual interruption");

  // Pause is a real comfort state: ambient video must stop, not merely freeze
  // the progress ring while media keeps decoding behind it.
  await clickAnimatedControl(freshGuide.getByRole("button", { name: "Play guided journey" }));
  await waitForAttribute(page, freshGuide, "data-guide-mode", "guided");
  await clickAnimatedControl(freshGuide.getByRole("button", { name: "Pause guided journey" }));
  await page.waitForTimeout(320);
  assert((await freshGuide.getAttribute("data-guide-mode")) === "paused", "Pause control did not publish paused mode");
  const playingWhilePaused = await page.locator("[data-home-v4] video").evaluateAll((videos) => videos.filter((video) => !video.paused && !video.ended).length);
  assert(playingWhilePaused === 0, `${playingWhilePaused} homepage videos remained active while the guided view was paused`);

  await clickAnimatedControl(freshGuide.getByRole("button", { name: "Explore the homepage manually" }));
  const processChapter = page.locator('[data-home-v4-chapter="process"]');
  await processChapter.scrollIntoViewIfNeeded();
  await page.waitForTimeout(550);
  const processJourney = processChapter.locator('[data-project-journey="true"]');
  assert((await processJourney.count()) === 1, "Process journey is missing from its Home chapter");
  assert(
    (await processJourney.getAttribute("data-process-tempo-managed")) === "true",
    "Process tempo director is not mounted",
  );
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
