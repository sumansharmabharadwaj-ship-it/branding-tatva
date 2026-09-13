const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "homepage-v4-audit");
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "desktop-1280x800", width: 1280, height: 800 },
  { name: "tablet-1024x768", width: 1024, height: 768, touch: true },
  { name: "tablet-768x1024", width: 768, height: 1024, touch: true },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
  { name: "mobile-360x800", width: 360, height: 800, touch: true },
];
const CHAPTER_ORDER = [
  "opening",
  "recognition",
  "cost",
  "foundation",
  "paths",
  "process",
  "evidence",
  "tatva",
  "studio",
  "decision",
  "invitation",
];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForHome(page) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) await veil.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  await page.waitForSelector("[data-home-v4]", { timeout: 12_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(520);
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
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForHome(page);

  const chapterMetrics = await page.locator("[data-home-v4-chapter]").evaluateAll((nodes) =>
    nodes.map((node) => {
      const bounds = node.getBoundingClientRect();
      return {
        id: node.getAttribute("data-home-v4-chapter"),
        height: bounds.height,
        viewports: bounds.height / innerHeight,
        top: bounds.top + scrollY,
      };
    }),
  );

  assert(chapterMetrics.length === CHAPTER_ORDER.length, `${viewport.name}: expected ${CHAPTER_ORDER.length} chapters, found ${chapterMetrics.length}`);
  assert(
    chapterMetrics.map((chapter) => chapter.id).join("|") === CHAPTER_ORDER.join("|"),
    `${viewport.name}: V4 chapter order drifted`,
  );

  const geometry = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    viewportHeight: innerHeight,
    viewportWidth: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  const totalScrollViewports = geometry.scrollHeight / geometry.viewportHeight;

  if (viewport.width >= 821) {
    const cost = chapterMetrics.find((chapter) => chapter.id === "cost");
    const tatva = chapterMetrics.find((chapter) => chapter.id === "tatva");
    assert(cost && cost.viewports <= 1.92, `${viewport.name}: Hidden Cost consumes ${cost?.viewports.toFixed(2)} viewports`);
    assert(tatva && tatva.viewports <= 1.75, `${viewport.name}: compressed Tatva still consumes ${tatva?.viewports.toFixed(2)} viewports`);
  }

  assert(
    geometry.documentWidth <= geometry.viewportWidth + 2,
    `${viewport.name}: horizontal overflow ${geometry.documentWidth}px > ${geometry.viewportWidth}px`,
  );

  await context.close();
  return {
    viewport: viewport.name,
    ...geometry,
    totalScrollViewports: Number(totalScrollViewports.toFixed(3)),
    averageChapterViewports: Number((chapterMetrics.reduce((sum, chapter) => sum + chapter.viewports, 0) / chapterMetrics.length).toFixed(3)),
    chapters: chapterMetrics.map((chapter) => ({
      id: chapter.id,
      height: Number(chapter.height.toFixed(1)),
      viewports: Number(chapter.viewports.toFixed(3)),
      top: Number(chapter.top.toFixed(1)),
    })),
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const viewport of VIEWPORTS) results.push(await inspect(browser, viewport));
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(OUTPUT, "home-v4-density-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), commit: process.env.AUDIT_COMMIT || "local", results }, null, 2),
  );
  process.stdout.write("Homepage V4 density report recorded across six viewport profiles.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
