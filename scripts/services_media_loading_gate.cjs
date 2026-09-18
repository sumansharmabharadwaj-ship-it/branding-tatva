const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-experience-audit");
// The closing Strategy Room scene now arrives on the valley-first-light
// film (the procedural strategy-room render and the root-system opening
// film both retired with the nine-chapter composition). The trailing dot
// keeps the video needle from also matching its own poster.
const STRATEGY_ROOM_POSTER = "pexels-valley-first-light-poster";
const STRATEGY_ROOM_VIDEO = "pexels-valley-first-light.";
const CHAPTER_COUNT = 9;

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServices(page) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) await veil.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  await page.waitForFunction(
    (expected) => Number(document.documentElement.dataset.servicesChapterCount || 0) === expected,
    CHAPTER_COUNT,
    { timeout: 20_000 },
  );
  await page.waitForTimeout(900);
}

function matching(requests, needle) {
  return requests.filter((url) => decodeURIComponent(url).includes(needle));
}

async function standardMotion(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });
  const page = await context.newPage();
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));

  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForServices(page);

  // The opening resolves on the CSS canopy field with zero film: no video
  // file may enter the initial waterfall at all.
  const initialVideoRequests = matching(requests, "/videos/");
  const initialPosterRequests = matching(requests, STRATEGY_ROOM_POSTER);
  const initialClosingVideoRequests = matching(requests, STRATEGY_ROOM_VIDEO);
  assert(initialVideoRequests.length === 0, "A video entered the initial request waterfall of the filmless opening");
  assert(initialPosterRequests.length === 0, "Strategy-room poster entered the initial request waterfall");
  assert(initialClosingVideoRequests.length === 0, "Strategy-room video entered the initial request waterfall");

  await page.locator("#book").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1_400);

  const afterPosterRequests = matching(requests, STRATEGY_ROOM_POSTER);
  const afterClosingVideoRequests = matching(requests, STRATEGY_ROOM_VIDEO);
  assert(afterPosterRequests.length > 0, "Strategy-room poster never became eligible near the closing scene");
  assert(afterClosingVideoRequests.length > 0, "Strategy-room video never became eligible near the closing scene");

  await context.close();
  return {
    initialVideoRequests: initialVideoRequests.length,
    initialPosterRequests: initialPosterRequests.length,
    initialClosingVideoRequests: initialClosingVideoRequests.length,
    afterPosterRequests: afterPosterRequests.length,
    afterClosingVideoRequests: afterClosingVideoRequests.length,
  };
}

async function reducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });
  const page = await context.newPage();
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));

  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForServices(page);
  await page.locator("#book").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1_100);

  const closingVideoRequests = matching(requests, STRATEGY_ROOM_VIDEO);
  const posterRequests = matching(requests, STRATEGY_ROOM_POSTER);
  assert(closingVideoRequests.length === 0, "Reduced-motion visit requested the Strategy-room video");
  assert(posterRequests.length > 0, "Reduced-motion visit failed to load the Strategy-room still near the scene");

  await context.close();
  return {
    closingVideoRequests: closingVideoRequests.length,
    posterRequests: posterRequests.length,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  let standard;
  let reduced;
  try {
    standard = await standardMotion(browser);
    reduced = await reducedMotion(browser);
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(OUTPUT, "services-media-loading-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), standard, reduced }, null, 2),
  );
  process.stdout.write("Services media-loading gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
