const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT_DIR = path.join(process.cwd(), "cinematic-recovery-audit");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) await loader.waitFor({ state: "detached", timeout: 9_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  assert((await loader.count()) === 0, "work/study-context: page-load veil did not clear");
}

async function visibleCount(locator) {
  return locator.evaluateAll((nodes) =>
    nodes.filter((node) => {
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    }).length,
  );
}

async function inViewport(locator) {
  return locator.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.top >= -1 && rect.bottom <= window.innerHeight + 1;
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await page.goto(`${BASE_URL}/work`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await waitForPrelude(page);

    const gallery = page.locator('[aria-label="Independent brand-study mechanisms"]');
    const covers = gallery.locator('button[aria-expanded]');
    assert((await covers.count()) === 5, "work/study-context: expected five public studies");

    const cover = covers.last();
    await cover.scrollIntoViewIfNeeded();
    const panelId = await cover.getAttribute("aria-controls");
    assert(panelId, "work/study-context: fifth study cover has no controlled panel");

    await cover.evaluate((node) => {
      const original = node.scrollIntoView.bind(node);
      node.dataset.contextScrollCalls = "0";
      node.scrollIntoView = (options) => {
        node.dataset.contextScrollCalls = String(Number(node.dataset.contextScrollCalls || "0") + 1);
        original(options);
      };
    });

    await cover.click();
    const panel = page.locator(`#${panelId}`);
    await panel.waitFor({ state: "visible", timeout: 4_000 });
    assert((await visibleCount(covers)) === 1, "work/study-context: unrelated study covers remain visible");
    assert((await cover.getAttribute("aria-expanded")) === "true", "work/study-context: fifth study did not open");

    const panelText = ((await panel.textContent()) || "").replace(/\s+/g, " ").trim();
    assert(
      panelText.includes("Memory mechanism") && panelText.includes("Three applications for a growing brand"),
      "work/study-context: fifth study panel is incomplete",
    );

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "work-brand-study-fifth-open-390x844.png"),
      fullPage: false,
    });

    await panel.getByRole("button", { name: "Close study" }).click();
    await page.waitForFunction(
      () => {
        const buttons = document.querySelectorAll('[aria-label="Independent brand-study mechanisms"] button[aria-expanded]');
        const last = buttons[buttons.length - 1];
        return last?.dataset.contextScrollCalls === "1";
      },
      undefined,
      { timeout: 3_000 },
    );

    assert((await visibleCount(covers)) === 5, "work/study-context: study covers did not return after closing");
    assert((await cover.getAttribute("aria-expanded")) === "false", "work/study-context: fifth study did not close");
    assert(
      await cover.evaluate((node) => document.activeElement === node),
      "work/study-context: focus did not return to the fifth study cover",
    );
    assert(await inViewport(cover), "work/study-context: focused fifth study cover remained outside the viewport");

    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    assert(
      dimensions.document <= dimensions.viewport + 2 && dimensions.body <= dimensions.viewport + 2,
      `work/study-context: horizontal overflow ${JSON.stringify(dimensions)}`,
    );
    assert(pageErrors.length === 0, `work/study-context: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);

    console.log(
      JSON.stringify(
        {
          baseUrl: BASE_URL,
          brandStudyContextGate: "passed",
          checked: [
            "fifth study focus mode",
            "complete study evidence",
            "close context restoration",
            "exact-cover focus return",
            "cover restoration",
            "mobile overflow",
            "page exceptions",
          ],
        },
        null,
        2,
      ),
    );
  } finally {
    await context.close();
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
