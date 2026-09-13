const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "cinematic-recovery-audit");

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function openingVisibility(page) {
  return page.locator('[data-home-v4-chapter="opening"]').evaluate((opening) => {
    const headline = opening.querySelector("h1");
    const signal = opening.querySelector(".home-v4-opening__signal");
    const headlineStyle = headline ? window.getComputedStyle(headline) : null;
    const signalStyle = signal ? window.getComputedStyle(signal) : null;
    return {
      headlineOpacity: headlineStyle ? Number(headlineStyle.opacity) : 0,
      signalOpacity: signalStyle ? Number(signalStyle.opacity) : 0,
      ready: document.documentElement.dataset.homePreludeReady,
    };
  });
}

async function firstVisit(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.evaluate(() => {
    try {
      window.sessionStorage.removeItem("branding-tatva-v4-prelude-seen");
    } catch {}
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);

  const loader = page.locator("[data-page-load-veil]");
  assert((await loader.count()) === 1, "first visit: prelude was not mounted");
  await page.waitForTimeout(260);

  const covered = await openingVisibility(page);
  assert(covered.ready !== "true", "first visit: opening reported ready while prelude was present");
  assert(
    covered.signalOpacity <= 0.08,
    `first visit: opening signal was visible behind prelude (${covered.signalOpacity})`,
  );

  await page.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-prelude-present.png"),
    animations: "disabled",
  });

  await loader.waitFor({ state: "detached", timeout: 5_000 });
  await page.waitForFunction(
    () => document.documentElement.dataset.homePreludeReady === "true",
    undefined,
    { timeout: 2_000 },
  );
  await page.waitForTimeout(760);

  const revealed = await openingVisibility(page);
  assert(revealed.ready === "true", "first visit: prelude-ready attribute was not published");
  assert(
    revealed.headlineOpacity >= 0.92,
    `first visit: opening headline did not resolve (${revealed.headlineOpacity})`,
  );
  assert(
    revealed.signalOpacity >= 0.65,
    `first visit: opening signal did not resolve (${revealed.signalOpacity})`,
  );

  await page.locator('[data-home-v4-chapter="opening"]').screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-prelude-handoff-opening.png"),
    animations: "disabled",
  });

  await context.close();
}

async function repeatVisit(browser) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "no-preference",
  });
  await context.addInitScript(() => {
    try {
      window.sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });
  const page = await context.newPage();
  const startedAt = Date.now();
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 3_000 });
  }
  const elapsed = Date.now() - startedAt;
  assert(elapsed < 2_600, `repeat visit: prelude held for ${elapsed}ms`);
  await page.waitForFunction(
    () => document.documentElement.dataset.homePreludeReady === "true",
    undefined,
    { timeout: 2_000 },
  );
  await context.close();
}

async function reducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForTimeout(260);
  assert(
    (await page.locator("[data-page-load-veil]").count()) === 0,
    "reduced motion: prelude should be absent",
  );
  await page.waitForFunction(
    () => document.documentElement.dataset.homePreludeReady === "true",
    undefined,
    { timeout: 2_000 },
  );
  const revealed = await openingVisibility(page);
  assert(revealed.headlineOpacity >= 0.92, "reduced motion: opening headline is hidden");
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await firstVisit(browser);
    await repeatVisit(browser);
    await reducedMotion(browser);
  } finally {
    await browser.close();
  }

  process.stdout.write("Prelude-to-opening handoff verified.\n");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
