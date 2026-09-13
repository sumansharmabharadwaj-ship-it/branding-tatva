const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "cinematic-recovery-audit");
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 9_000 });
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(260);
}

async function waitForText(locator, expected, label, timeoutMs = 5_000) {
  const deadline = Date.now() + timeoutMs;
  let copy = "";

  while (Date.now() < deadline) {
    copy = (await locator.textContent()) || "";
    if (copy.includes(expected)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`${label}: expected "${expected}" in "${copy.slice(0, 240)}"`);
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  assert(
    dimensions.document <= dimensions.viewport + 2 && dimensions.body <= dimensions.viewport + 2,
    `${label}: horizontal overflow viewport=${dimensions.viewport}, document=${dimensions.document}, body=${dimensions.body}`,
  );
}

async function assertTouchTargets(locator, minimum, label) {
  const boxes = await locator.evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        text: (node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
        width: rect.width,
        height: rect.height,
      };
    }),
  );

  for (const box of boxes) {
    assert(
      box.width >= minimum && box.height >= minimum,
      `${label}: target "${box.text}" is ${box.width.toFixed(1)}×${box.height.toFixed(1)}`,
    );
  }
}

async function capture(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "no-preference",
    hasTouch: Boolean(viewport.touch),
  });

  await context.addInitScript(() => {
    try {
      window.sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });

  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page);

  const guide = page.locator("[data-guided-controls]");
  if ((await guide.count()) > 0) {
    await guide.evaluateAll((nodes) => {
      nodes.forEach((node) => {
        node.style.display = "none";
      });
    });
  }

  const chapter = page.locator('[data-home-v4-chapter="decision"]').first();
  const scene = chapter.locator(".questions-cinematic").first();
  assert((await scene.count()) === 1, `${viewport.name}: Decision scene missing`);

  await chapter.scrollIntoViewIfNeeded();
  await page.waitForTimeout(760);

  const headline = (await scene.getByRole("heading", { level: 2 }).textContent()) || "";
  assert(
    headline.includes("Five practical doubts."),
    `${viewport.name}: Decision proposition missing`,
  );

  const tabs = scene.getByRole("tab");
  assert((await tabs.count()) === 5, `${viewport.name}: expected five Decision tabs`);
  await assertTouchTargets(tabs, 40, `${viewport.name}: Decision tabs`);
  await assertNoOverflow(page, `${viewport.name}/decision`);

  const panel = scene.locator("#questions-cinematic-panel");
  await waitForText(
    panel,
    "Discovery → positioning → audience",
    `${viewport.name}: Scope state is incomplete`,
  );

  await scene.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-decision-scope.png`),
    animations: "disabled",
  });

  if (viewport.name.startsWith("desktop")) {
    await scene.getByRole("tab", { name: /Implementation/i }).click();
    await waitForText(
      panel,
      "Strategy → website → content → campaigns",
      `${viewport.name}: Implementation state did not update`,
    );
    await scene.screenshot({
      path: path.join(OUTPUT, `${viewport.name}-decision-implementation.png`),
      animations: "disabled",
    });
  }

  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of VIEWPORTS) {
      await capture(browser, viewport);
    }
  } finally {
    await browser.close();
  }

  process.stdout.write("Decision clarity-compass evidence captured.\n");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
