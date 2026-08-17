const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-experience-audit");
const STRATEGY_ROOM_POSTER = "bt-services-strategy-room-poster";
const STRATEGY_ROOM_VIDEO = "bt-services-strategy-room";
const HERO_VIDEO = "bt-services-hero-root-system";

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServices(page) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) await veil.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  const chapterDeadline = Date.now() + 12_000;
  while (
    Date.now() < chapterDeadline &&
    (await page.locator("html").getAttribute("data-services-chapter-count")) !== "13"
  ) {
    await page.waitForTimeout(40);
  }
  assert(
    (await page.locator("html").getAttribute("data-services-chapter-count")) === "13",
    "Services chapter runtime did not activate",
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

  const initialHeroRequests = matching(requests, HERO_VIDEO);
  const initialPosterRequests = matching(requests, STRATEGY_ROOM_POSTER);
  const initialClosingVideoRequests = matching(requests, STRATEGY_ROOM_VIDEO);
  assert(initialHeroRequests.length > 0, "Opening Services film did not enter the initial request set");
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
    initialHeroRequests: initialHeroRequests.length,
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
