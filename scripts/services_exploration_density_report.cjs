const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-experience-audit");

// Conservative semantic-state budget from docs/SERVICES_SCROLL_MAP.md.
// This deliberately excludes ambient parallax, hover polish, progress lines,
// and decorative transitions. A state counts only when the visitor learns a
// new idea, reaches a new decision state, or receives a new useful result.
const STATE_BUDGET = [
  ["services-opening", 3],
  ["situation", 3],
  ["offerings", 6],
  ["desire", 3],
  ["verified-outcome", 3],
  ["authority", 5],
  ["stakes", 4],
  ["education", 4],
  ["deliverables", 5],
  ["imagine", 3],
  ["health", 5],
  ["audit", 2],
  ["book", 1],
];

const MEANINGFUL_STATES = STATE_BUDGET.reduce((sum, [, states]) => sum + states, 0);
fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function inspect(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: Boolean(viewport.touch),
  });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) await veil.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  await page.waitForFunction(
    (expected) => Number(document.documentElement.dataset.servicesChapterCount || 0) === expected,
    13,
    { timeout: 12_000 },
  );
  await page.waitForTimeout(420);

  const chapterIds = await page.locator("[data-services-scroll-scene]").evaluateAll((nodes) => nodes.map((node) => node.id));
  assert(chapterIds.length === STATE_BUDGET.length, `${viewport.name}: expected ${STATE_BUDGET.length} chapters, found ${chapterIds.length}`);
  for (const [id] of STATE_BUDGET) {
    assert(chapterIds.includes(id), `${viewport.name}: state budget chapter #${id} is missing from the runtime`);
  }

  const geometry = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    viewportHeight: innerHeight,
    viewportWidth: innerWidth,
  }));
  const scrollViewports = geometry.scrollHeight / Math.max(1, geometry.viewportHeight);
  const explorationDensity = MEANINGFUL_STATES / scrollViewports;
  const pixelsPerState = geometry.scrollHeight / MEANINGFUL_STATES;
  const viewportFractionsPerState = scrollViewports / MEANINGFUL_STATES;

  await context.close();
  return {
    viewport: viewport.name,
    ...geometry,
    meaningfulStates: MEANINGFUL_STATES,
    scrollViewports: Number(scrollViewports.toFixed(3)),
    explorationDensity: Number(explorationDensity.toFixed(3)),
    pixelsPerState: Number(pixelsPerState.toFixed(1)),
    viewportFractionsPerState: Number(viewportFractionsPerState.toFixed(3)),
  };
}

(async () => {
  assert(MEANINGFUL_STATES === 47, `Semantic state budget changed unexpectedly: ${MEANINGFUL_STATES}`);
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    results.push(await inspect(browser, { name: "desktop-1440x900", width: 1440, height: 900 }));
    results.push(await inspect(browser, { name: "tablet-1024x768", width: 1024, height: 768, touch: true }));
    results.push(await inspect(browser, { name: "mobile-390x844", width: 390, height: 844, touch: true }));
  } finally {
    await browser.close();
  }

  const report = {
    generatedAt: new Date().toISOString(),
    commit: process.env.AUDIT_COMMIT || "local",
    semanticStateBudget: Object.fromEntries(STATE_BUDGET),
    meaningfulStates: MEANINGFUL_STATES,
    results,
  };
  fs.writeFileSync(
    path.join(OUTPUT, "services-exploration-density-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(`Services exploration density recorded from ${MEANINGFUL_STATES} semantic states.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
