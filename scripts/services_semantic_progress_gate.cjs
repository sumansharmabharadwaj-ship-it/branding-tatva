const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-experience-audit");
const SERVICES_SITUATION_KEY = "branding-tatva-services-situation";
const HOME_SITUATION_KEY = "branding-tatva-visitor-situation";

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  }
  await page.waitForFunction(
    () => document.documentElement.dataset.servicesExperience === "active",
    undefined,
    { timeout: 12_000 },
  );
  await page.waitForFunction(
    () => Number(document.documentElement.dataset.servicesChapterCount || 0) === 13,
    undefined,
    { timeout: 4_000 },
  );
  await page.waitForTimeout(260);
}

async function clearSelections(page) {
  await page.evaluate(
    ({ servicesKey, homeKey }) => {
      localStorage.removeItem(servicesKey);
      localStorage.removeItem(homeKey);
    },
    { servicesKey: SERVICES_SITUATION_KEY, homeKey: HOME_SITUATION_KEY },
  );
}

async function scrollSceneToProgress(page, selector, progress) {
  await page.evaluate(
    ({ selector, progress }) => {
      const scene = document.querySelector(selector);
      if (!(scene instanceof HTMLElement)) return;
      const viewport = window.innerHeight;
      const bounds = scene.getBoundingClientRect();
      const absoluteTop = bounds.top + window.scrollY;
      const desiredTop = viewport - progress * (viewport + scene.offsetHeight);
      window.scrollTo({ top: Math.max(0, absoluteTop - desiredTop), behavior: "auto" });
    },
    { selector, progress },
  );
  await page.waitForTimeout(680);
}

async function scrollMotionTrack(page, selector, progress) {
  await page.evaluate(
    ({ selector, progress }) => {
      const track = document.querySelector(selector);
      if (!(track instanceof HTMLElement)) return;
      const viewport = window.innerHeight;
      const bounds = track.getBoundingClientRect();
      const absoluteTop = bounds.top + window.scrollY;
      const start = absoluteTop - viewport * 0.76;
      const end = absoluteTop + track.offsetHeight - viewport * 0.38;
      window.scrollTo({ top: Math.max(0, start + (end - start) * progress), behavior: "auto" });
    },
    { selector, progress },
  );
  await page.waitForTimeout(680);
}

async function reloadClean(page) {
  await clearSelections(page);
  await page.reload({ waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  await waitForPrelude(page);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });

  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
      localStorage.removeItem("branding-tatva-services-situation");
      localStorage.removeItem("branding-tatva-visitor-situation");
    } catch {}
  });

  const page = await context.newPage();
  const browserErrors = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto(`${BASE_URL}/services`, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await page.evaluate(() => document.fonts.ready);
  await waitForPrelude(page);

  const situation = page.locator("#situation");
  assert((await situation.count()) === 1, "Situation scene is missing");

  await scrollSceneToProgress(page, "#situation", 0.08);
  const earlySituationButton = situation.locator('button[data-situation-preview="true"]').first();
  const earlySituation = await earlySituationButton.textContent();
  const earlyStored = await page.evaluate((key) => localStorage.getItem(key), SERVICES_SITUATION_KEY);

  await scrollSceneToProgress(page, "#situation", 0.92);
  const lateSituationButton = situation.locator('button[data-situation-preview="true"]').first();
  const lateSituation = await lateSituationButton.textContent();
  const lateStored = await page.evaluate((key) => localStorage.getItem(key), SERVICES_SITUATION_KEY);

  assert(Boolean(earlySituation), "Early Situation preview did not appear");
  assert(Boolean(lateSituation), "Late Situation preview did not appear");
  assert(earlySituation !== lateSituation, "Situation preview did not change with scroll");
  assert(earlyStored === null && lateStored === null, "Passive Situation preview persisted a choice");
  assert(/ongoing consistency/i.test(lateSituation || ""), `Unexpected late Situation preview: ${lateSituation}`);

  await lateSituationButton.click();
  await page.waitForTimeout(220);
  const committedSituation = await page.evaluate((key) => localStorage.getItem(key), SERVICES_SITUATION_KEY);
  assert(committedSituation === "ongoing", `Committed Situation is ${committedSituation}, expected ongoing`);
  assert(
    (await lateSituationButton.getAttribute("aria-pressed")) === "true",
    "Committed Situation is not marked pressed",
  );

  await situation.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-situation-committed.png"),
    animations: "disabled",
  });

  await reloadClean(page);

  const desire = page.locator("#desire");
  assert((await desire.count()) === 1, "Package path scene is missing");

  await scrollSceneToProgress(page, "#desire", 0.05);
  const earlyPackageButton = desire.locator('button[data-package-preview="true"]').first();
  const earlyPackage = await earlyPackageButton.textContent();

  await scrollSceneToProgress(page, "#desire", 0.95);
  const latePackageButton = desire.locator('button[data-package-preview="true"]').first();
  const latePackage = await latePackageButton.textContent();

  assert(/Starting with an idea/i.test(earlyPackage || ""), `Unexpected first package path: ${earlyPackage}`);
  assert(/Needing ongoing consistency/i.test(latePackage || ""), `Unexpected last package path: ${latePackage}`);
  assert(earlyPackage !== latePackage, "Package path did not change with scroll");
  assert(
    (await latePackageButton.getAttribute("aria-pressed")) === "false",
    "Passive package preview is incorrectly marked committed",
  );

  await latePackageButton.click();
  await page.waitForTimeout(220);
  assert(
    (await latePackageButton.getAttribute("aria-pressed")) === "true",
    "Explicit package choice is not marked pressed",
  );
  assert(
    (await latePackageButton.getAttribute("data-package-preview")) === null,
    "Explicit package choice is still marked as a passive preview",
  );

  await desire.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-package-committed.png"),
    animations: "disabled",
  });

  const verifiedOutcome = page.locator('#verified-outcome [data-verified-outcome-phase]');
  assert((await verifiedOutcome.count()) === 1, "Verified outcome progression is missing");

  await scrollSceneToProgress(page, "#verified-outcome", 0.08);
  const proofEarly = await verifiedOutcome.getAttribute("data-verified-outcome-phase");
  await scrollSceneToProgress(page, "#verified-outcome", 0.56);
  const proofMiddle = await verifiedOutcome.getAttribute("data-verified-outcome-phase");
  await scrollSceneToProgress(page, "#verified-outcome", 0.92);
  const proofLate = await verifiedOutcome.getAttribute("data-verified-outcome-phase");

  assert(proofEarly === "0", `Verified proof began at beat ${proofEarly}`);
  assert(proofMiddle === "1", `Verified proof middle resolved to beat ${proofMiddle}`);
  assert(proofLate === "2", `Verified proof ended at beat ${proofLate}`);

  await page.locator("#verified-outcome").screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-verified-outcome-result.png"),
    animations: "disabled",
  });

  const stakes = page.locator("#stakes");
  const stakesStory = stakes.locator('[data-stakes-scroll-story="true"]');
  assert((await stakesStory.count()) === 1, "Positioning cost story is missing");

  await scrollSceneToProgress(page, "#stakes", 0.04);
  const earlyFocus = await stakesStory.getAttribute("data-stakes-focus");
  const earlyStep = await stakesStory.getAttribute("data-stakes-step");

  await scrollSceneToProgress(page, "#stakes", 0.96);
  const lateFocus = await stakesStory.getAttribute("data-stakes-focus");
  const lateStep = await stakesStory.getAttribute("data-stakes-step");

  assert(earlyFocus === "generic", `Positioning story began in ${earlyFocus}`);
  assert(lateFocus === "distinct", `Positioning story ended in ${lateFocus}`);
  assert(earlyStep !== lateStep, "Positioning story did not advance its causal beat");

  await stakes.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-positioning-distinct.png"),
    animations: "disabled",
  });

  const education = page.locator("#education");
  const perceptionTrack = education.locator('[data-perception-desktop-track="true"]');
  const perceptionProof = education.locator('[data-perception-desktop-proof="true"]');
  assert((await perceptionTrack.count()) === 1, "Perception track is missing");
  assert((await perceptionProof.count()) === 1, "Perception proof companion is missing");

  await scrollMotionTrack(page, '[data-perception-desktop-track="true"]', 0.02);
  const earlyPerception = await perceptionProof
    .locator("[data-perception-proof-state]")
    .getAttribute("data-perception-proof-state");

  await scrollMotionTrack(page, '[data-perception-desktop-track="true"]', 0.99);
  const latePerception = await perceptionProof
    .locator("[data-perception-proof-state]")
    .getAttribute("data-perception-proof-state");

  assert(earlyPerception === "Unknown", `Perception ladder began at ${earlyPerception}`);
  assert(latePerception === "Preferred", `Perception ladder ended at ${latePerception}`);

  await education.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-perception-preferred.png"),
    animations: "disabled",
  });

  const formControl = page.locator("#audit input, #health input, #imagine input, #book input").first();
  assert((await formControl.count()) === 1, "No Services form control was found for comfort verification");
  await formControl.scrollIntoViewIfNeeded();
  await formControl.focus();
  await page.waitForTimeout(260);

  const formComfort = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Jump to section"]');
    return {
      state: document.documentElement.dataset.servicesFormInteraction,
      navOpacity: nav instanceof HTMLElement ? Number(getComputedStyle(nav).opacity) : null,
      playingVideos: Array.from(document.querySelectorAll("#main-content video")).filter(
        (video) => !video.paused && !video.ended,
      ).length,
    };
  });

  assert(formComfort.state === "true", "Form interaction state was not published");
  if (formComfort.navOpacity !== null) {
    assert(formComfort.navOpacity < 0.1, `Section navigation opacity is ${formComfort.navOpacity}`);
  }
  assert(formComfort.playingVideos === 0, `${formComfort.playingVideos} Services videos kept playing during form focus`);
  assert(browserErrors.length === 0, `Browser errors:\n${browserErrors.join("\n")}`);

  fs.writeFileSync(
    path.join(OUTPUT, "services-semantic-progress-report.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        situation: { earlySituation, lateSituation, committedSituation },
        package: { earlyPackage, latePackage, committed: true },
        proof: { proofEarly, proofMiddle, proofLate },
        positioning: { earlyFocus, lateFocus, earlyStep, lateStep },
        perception: { earlyPerception, latePerception },
        formComfort,
      },
      null,
      2,
    ),
  );

  await context.close();
  await browser.close();
  process.stdout.write("Services semantic progress gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
