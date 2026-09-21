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
  assert((await loader.count()) === 0, "work/decision-context: page-load veil did not clear");
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

async function assertTriggerInView(trigger, label) {
  const rect = await trigger.evaluate((node) => {
    const box = node.getBoundingClientRect();
    return { top: box.top, bottom: box.bottom, height: box.height, viewport: window.innerHeight };
  });

  assert(
    rect.top >= -1 && rect.bottom <= rect.viewport + 1,
    `work/decision-context: ${label} trigger escaped the viewport ${JSON.stringify(rect)}`,
  );
}

async function waitForAttribute(locator, name, expected, label, timeout = 3_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if ((await locator.getAttribute(name)) === expected) return;
    await locator.page().waitForTimeout(70);
  }
  throw new Error(`work/decision-context: ${label} did not reach ${name}=${expected}`);
}

async function assertNoOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  assert(
    dimensions.document <= dimensions.viewport + 2 && dimensions.body <= dimensions.viewport + 2,
    `work/decision-context: horizontal overflow ${JSON.stringify(dimensions)}`,
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

    const archive = page.locator('ul[aria-label="Decision artefacts"]');
    const triggers = archive.locator('button[aria-expanded]');
    assert((await triggers.count()) === 7, "work/decision-context: expected seven decision artefacts");

    const trigger = triggers.last();
    await trigger.scrollIntoViewIfNeeded();
    const controlledId = await trigger.getAttribute("aria-controls");
    assert(controlledId, "work/decision-context: seventh decision trigger has no controlled panel");

    await trigger.evaluate((node) => {
      const original = node.scrollIntoView.bind(node);
      node.dataset.contextScrollCalls = "0";
      node.scrollIntoView = (options) => {
        node.dataset.contextScrollCalls = String(Number(node.dataset.contextScrollCalls || "0") + 1);
        original(options);
      };
    });

    await trigger.click();
    await page.locator(`#${controlledId}`).waitFor({ state: "attached", timeout: 3_000 });
    await waitForAttribute(trigger, "data-context-scroll-calls", "1", "open context restoration");

    assert((await visibleCount(triggers)) === 1, "work/decision-context: unrelated decisions remain visible after opening the seventh");
    assert((await trigger.getAttribute("aria-expanded")) === "true", "work/decision-context: seventh decision did not open");
    assert(
      await trigger.evaluate((node) => document.activeElement === node),
      "work/decision-context: focus left the seventh decision trigger after opening",
    );
    await assertTriggerInView(trigger, "open");

    const panel = page.locator(`#${controlledId}`);
    const panelText = ((await panel.textContent()) || "").replace(/\s+/g, " ").trim();
    assert(
      panelText.includes("The decision") && panelText.includes("Why it mattered") && panelText.includes("Where it appeared"),
      "work/decision-context: expanded decision evidence is incomplete",
    );

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "work-decision-seventh-open-390x844.png"),
      fullPage: false,
    });

    await trigger.click();
    await waitForAttribute(trigger, "data-context-scroll-calls", "2", "close context restoration");

    assert((await visibleCount(triggers)) === 7, "work/decision-context: archive did not restore after closing the seventh decision");
    assert((await trigger.getAttribute("aria-expanded")) === "false", "work/decision-context: seventh decision did not close");
    assert(
      await trigger.evaluate((node) => document.activeElement === node),
      "work/decision-context: focus left the seventh decision trigger after closing",
    );
    await assertTriggerInView(trigger, "closed");
    await assertNoOverflow(page);
    assert(pageErrors.length === 0, `work/decision-context: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);

    console.log(
      JSON.stringify(
        {
          baseUrl: BASE_URL,
          decisionContextGate: "passed",
          checked: [
            "seventh artefact focus mode",
            "open context restoration",
            "close context restoration",
            "focus retention",
            "complete decision evidence",
            "archive restoration",
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
