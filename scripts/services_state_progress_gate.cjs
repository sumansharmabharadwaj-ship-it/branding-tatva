const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-audit");
const SITUATION_STORAGE_KEY = "branding-tatva-services-situation";

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  }
  await page.waitForTimeout(260);
}

async function scrollServicesScene(page, selector, progress) {
  await page.evaluate(
    ({ selector, progress }) => {
      const scene = document.querySelector(selector);
      if (!(scene instanceof HTMLElement)) return;
      const viewport = window.innerHeight;
      const top = scene.getBoundingClientRect().top + window.scrollY;
      const start = top - viewport * 0.84;
      const end = top + scene.offsetHeight - viewport * 0.16;
      window.scrollTo({ top: Math.max(0, start + (end - start) * progress), behavior: "auto" });
    },
    { selector, progress },
  );
  await page.waitForTimeout(650);
}

async function scrollMotionTrack(page, selector, progress) {
  await page.evaluate(
    ({ selector, progress }) => {
      const track = document.querySelector(selector);
      if (!(track instanceof HTMLElement)) return;
      const viewport = window.innerHeight;
      const top = track.getBoundingClientRect().top + window.scrollY;
      const start = top - viewport * 0.76;
      const end = top + track.offsetHeight - viewport * 0.38;
      window.scrollTo({ top: Math.max(0, start + (end - start) * progress), behavior: "auto" });
    },
    { selector, progress },
  );
  await page.waitForTimeout(650);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });

  await context.addInitScript(() => {
    try {
      window.sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
      window.localStorage.removeItem("branding-tatva-services-situation");
      window.localStorage.removeItem("branding-tatva-visitor-situation");
    } catch {}
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  await waitForPrelude(page);
  await page.waitForSelector('[data-services-scroll-root][data-services-scroll-ready="true"]', {
    timeout: 12_000,
  });

  const situation = page.locator("#situation");
  assert((await situation.count()) === 1, "Situation scene is missing");

  await scrollServicesScene(page, "#situation", 0.08);
  const earlyPreview = await situation
    .locator('button[data-situation-preview="true"]')
    .first()
    .textContent();
  const earlyStored = await page.evaluate((key) => localStorage.getItem(key), SITUATION_STORAGE_KEY);

  await scrollServicesScene(page, "#situation", 0.88);
  const latePreviewButton = situation.locator('button[data-situation-preview="true"]').first();
  const latePreview = await latePreviewButton.textContent();
  const lateStored = await page.evaluate((key) => localStorage.getItem(key), SITUATION_STORAGE_KEY);

  assert(Boolean(earlyPreview), "Early Situation preview did not activate");
  assert(Boolean(latePreview), "Late Situation preview did not activate");
  assert(earlyPreview !== latePreview, "A short scroll did not change the Situation preview");
  assert(earlyStored === null && lateStored === null, "Passive scrolling committed a Situation choice");
  assert(
    /ongoing consistency/i.test(latePreview || ""),
    `Final Situation preview resolved to unexpected copy: ${latePreview}`,
  );

  await latePreviewButton.click();
  await page.waitForTimeout(200);
  const committed = await page.evaluate((key) => localStorage.getItem(key), SITUATION_STORAGE_KEY);
  assert(committed === "ongoing", `Explicit Situation selection stored ${committed}, expected ongoing`);
  assert(
    (await latePreviewButton.getAttribute("aria-pressed")) === "true",
    "Explicit Situation selection is not marked pressed",
  );

  await situation.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-situation-committed.png"),
    animations: "disabled",
  });

  const education = page.locator("#education");
  const track = education.locator('[data-perception-desktop-track="true"]');
  const proof = education.locator('[data-perception-desktop-proof="true"]');
  assert((await track.count()) === 1, "Desktop perception track is missing");
  assert((await proof.count()) === 1, "Desktop perception proof companion is missing");

  await scrollMotionTrack(page, '[data-perception-desktop-track="true"]', 0.04);
  const earlyState = await proof.locator("[data-perception-proof-state]").getAttribute("data-perception-proof-state");
  const earlyActive = await education
    .locator('[data-perception-active="true"]')
    .first()
    .textContent();

  await scrollMotionTrack(page, '[data-perception-desktop-track="true"]', 0.98);
  const lateState = await proof.locator("[data-perception-proof-state]").getAttribute("data-perception-proof-state");
  const lateActive = await education
    .locator('[data-perception-active="true"]')
    .first()
    .textContent();

  assert(earlyState === "Unknown", `Perception ladder began at ${earlyState}, expected Unknown`);
  assert(lateState === "Preferred", `Perception ladder ended at ${lateState}, expected Preferred`);
  assert(earlyActive !== lateActive, "Perception ladder did not change its active rung");

  await education.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-perception-preferred.png"),
    animations: "disabled",
  });

  await context.close();
  await browser.close();

  fs.writeFileSync(
    path.join(OUTPUT, "services-state-progress-report.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        situation: { earlyPreview, latePreview, committed },
        perception: { earlyState, lateState },
      },
      null,
      2,
    ),
  );

  process.stdout.write("Services state-progress gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
