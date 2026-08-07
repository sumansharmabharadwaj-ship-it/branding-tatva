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
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 9_000 });
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  assert((await loader.count()) === 0, "work/mobile-index: page-load veil did not clear");
}

async function boxesFor(list, preview) {
  const listBox = await list.boundingBox();
  const previewBox = await preview.boundingBox();
  assert(listBox, "work/mobile-index: selector deck has no measurable box");
  assert(previewBox, "work/mobile-index: active evidence frame has no measurable box");
  return { listBox, previewBox };
}

async function assertNoOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  assert(
    dimensions.document <= dimensions.viewport + 2 && dimensions.body <= dimensions.viewport + 2,
    `work/mobile-index: horizontal overflow ${JSON.stringify(dimensions)}`,
  );
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await page.goto(`${BASE_URL}/work`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await waitForPrelude(page);

    const index = page.locator("#index");
    const selector = index.getByRole("list", { name: "Filtered projects" });
    const preview = index.locator("#active-work-preview");
    const buttons = selector.getByRole("button");

    await selector.waitFor({ state: "visible", timeout: 8_000 });
    await selector.scrollIntoViewIfNeeded();
    await preview.waitFor({ state: "visible", timeout: 8_000 });

    const buttonCount = await buttons.count();
    assert(buttonCount === 5, `work/mobile-index: expected five project controls, found ${buttonCount}`);

    const { listBox, previewBox } = await boxesFor(selector, preview);
    assert(
      listBox.y + listBox.height <= previewBox.y + 2,
      `work/mobile-index: selector is not immediately before its evidence ${JSON.stringify({ listBox, previewBox })}`,
    );
    assert(
      listBox.height <= 230,
      `work/mobile-index: selector deck is too tall for a compact mobile control, height=${listBox.height}`,
    );

    const layout = await selector.evaluate((node) => {
      const styles = window.getComputedStyle(node);
      return {
        display: styles.display,
        columns: styles.gridTemplateColumns.split(" ").filter(Boolean).length,
      };
    });
    assert(layout.display === "grid", `work/mobile-index: selector is not a grid, display=${layout.display}`);
    assert(layout.columns === 2, `work/mobile-index: expected two selector columns at 390px, found ${layout.columns}`);

    const buttonHeights = await buttons.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().height));
    assert(
      buttonHeights.every((height) => height >= 44 && height <= 68),
      `work/mobile-index: controls fall outside the compact touch target range ${JSON.stringify(buttonHeights)}`,
    );

    const beforeText = ((await preview.textContent()) || "").replace(/\s+/g, " ").trim();
    await buttons.last().click();
    const previewDeadline = Date.now() + 4_000;
    let previewChanged = false;
    while (Date.now() < previewDeadline) {
      const nextText = ((await preview.textContent()) || "").replace(/\s+/g, " ").trim();
      if (nextText && nextText !== beforeText) {
        previewChanged = true;
        break;
      }
      await page.waitForTimeout(80);
    }
    assert(previewChanged, "work/mobile-index: active evidence did not change after selection");

    assert(
      (await buttons.last().getAttribute("aria-pressed")) === "true",
      "work/mobile-index: selected project control did not expose aria-pressed=true",
    );

    const afterPreview = index.locator("#active-work-preview");
    const afterBoxes = await boxesFor(selector, afterPreview);
    assert(
      afterBoxes.listBox.y + afterBoxes.listBox.height <= afterBoxes.previewBox.y + 2,
      "work/mobile-index: selector/evidence proximity broke after changing projects",
    );

    await assertNoOverflow(page);
    assert(pageErrors.length === 0, `work/mobile-index: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "work-mobile-index-control-390x844.png"),
      fullPage: false,
    });

    console.log(
      JSON.stringify(
        {
          baseUrl: BASE_URL,
          mobileIndexControlGate: "passed",
          checked: [
            "five project controls",
            "selector before active evidence",
            "two-column 390px layout",
            "compact touch-target heights",
            "active evidence changes after selection",
            "aria-pressed state",
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
