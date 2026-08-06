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
  assert((await loader.count()) === 0, "work/lab-a11y: page-load veil did not clear");
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

async function assertNoOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  assert(
    dimensions.document <= dimensions.viewport + 2 && dimensions.body <= dimensions.viewport + 2,
    `work/lab-a11y: horizontal overflow ${JSON.stringify(dimensions)}`,
  );
}

async function assertSelectedAndFocused(page, tabs, index, label) {
  await page.waitForFunction(
    ({ tabIndex }) => {
      const tablist = Array.from(document.querySelectorAll('[role="tablist"]')).find((node) =>
        (node.getAttribute("aria-label") || "").endsWith("strategy phases"),
      );
      const tab = tablist?.querySelectorAll('[role="tab"]')[tabIndex];
      return Boolean(tab && tab.getAttribute("aria-selected") === "true" && document.activeElement === tab);
    },
    { tabIndex: index },
    { timeout: 3_000 },
  ).catch(() => {
    throw new Error(`work/lab-a11y: ${label} did not select and focus tab ${index + 1}`);
  });

  const tabStops = await tabs.evaluateAll((nodes) => nodes.map((node) => node.tabIndex));
  assert(
    tabStops.every((tabIndex, candidateIndex) => tabIndex === (candidateIndex === index ? 0 : -1)),
    `work/lab-a11y: ${label} broke roving tab stops ${JSON.stringify(tabStops)}`,
  );
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

    const dossierGrid = page.locator('[aria-label="Concept study dossiers"]');
    const section = dossierGrid.locator("xpath=ancestor::section[1]");
    await dossierGrid.scrollIntoViewIfNeeded();

    const covers = dossierGrid.locator("button[aria-expanded]");
    assert((await covers.count()) === 4, "work/lab-a11y: expected four concept dossier covers");

    const originCover = covers.last();
    const originControl = await originCover.getAttribute("aria-controls");
    assert(originControl, "work/lab-a11y: origin dossier cover has no aria-controls target");

    await originCover.click();
    const closeButton = section.getByRole("button", { name: "Close dossier" });
    await closeButton.waitFor({ state: "visible", timeout: 5_000 });
    assert((await visibleCount(covers)) === 1, "work/lab-a11y: unrelated dossier covers remain visible on mobile");

    const tablist = section.locator('[role="tablist"][aria-label$="strategy phases"]');
    const tabs = tablist.getByRole("tab");
    await tablist.waitFor({ state: "visible", timeout: 5_000 });
    assert((await tabs.count()) === 3, "work/lab-a11y: expected three strategy phase tabs");

    await page.waitForTimeout(80);
    const initialTabStops = await tabs.evaluateAll((nodes) => nodes.map((node) => node.tabIndex));
    assert(
      JSON.stringify(initialTabStops) === JSON.stringify([0, -1, -1]),
      `work/lab-a11y: initial roving tab stops are incorrect ${JSON.stringify(initialTabStops)}`,
    );

    await tabs.first().focus();
    await tabs.first().press("ArrowRight");
    await assertSelectedAndFocused(page, tabs, 1, "ArrowRight");

    await tabs.nth(1).press("End");
    await assertSelectedAndFocused(page, tabs, 2, "End");

    await tabs.last().press("Home");
    await assertSelectedAndFocused(page, tabs, 0, "Home");

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "work-lab-keyboard-390x844.png"),
      fullPage: false,
    });

    await closeButton.click();
    await page.waitForFunction(
      ({ controlledId }) => {
        const active = document.activeElement;
        return Boolean(active && active.getAttribute("aria-controls") === controlledId);
      },
      { controlledId: originControl },
      { timeout: 4_000 },
    ).catch(() => {
      throw new Error("work/lab-a11y: closing the dossier did not restore focus to its originating cover");
    });

    assert((await visibleCount(covers)) === 4, "work/lab-a11y: dossier covers did not return after closing");
    await assertNoOverflow(page);
    assert(pageErrors.length === 0, `work/lab-a11y: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);

    console.log(
      JSON.stringify(
        {
          baseUrl: BASE_URL,
          labAccessibilityGate: "passed",
          checked: [
            "fourth dossier mobile focus mode",
            "three phase tabs",
            "ArrowRight navigation",
            "Home and End navigation",
            "roving tab stops",
            "close-focus restoration",
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
