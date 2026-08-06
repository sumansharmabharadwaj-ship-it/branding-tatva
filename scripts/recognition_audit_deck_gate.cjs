const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-page-audit");
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900, touch: false },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) {
    await veil.waitFor({ state: "detached", timeout: 10_000 }).catch(() => {});
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(320);
}

async function waitForText(locator, expected, label, timeoutMs = 6_000) {
  const deadline = Date.now() + timeoutMs;
  let current = "";

  while (Date.now() < deadline) {
    current = (await locator.textContent().catch(() => "")) || "";
    if (current.includes(expected) && (await locator.isVisible().catch(() => false))) return;
    await new Promise((resolve) => setTimeout(resolve, 90));
  }

  throw new Error(`${label}: expected ${JSON.stringify(expected)} in ${JSON.stringify(current.slice(0, 260))}`);
}

async function assertTouchTargets(locator, minimum, label) {
  const boxes = await locator.evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        label: node.getAttribute("aria-label") || (node.textContent || "").trim(),
        width: rect.width,
        height: rect.height,
      };
    }),
  );

  for (const box of boxes) {
    assert(
      box.width >= minimum && box.height >= minimum,
      `${label}: ${JSON.stringify(box.label)} is ${box.width.toFixed(1)}×${box.height.toFixed(1)}`,
    );
  }
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

async function assertMobileHeaderClear(page, viewport, label) {
  if (viewport.width > 760) return;
  await page.waitForTimeout(420);
  const banner = page.getByRole("banner").first();
  const box = await banner.boundingBox();
  assert(
    !box || box.y + box.height <= 2,
    `${label}: global header overlaps the audit at y=${box?.y ?? 0}, height=${box?.height ?? 0}`,
  );
}

async function capture(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const label = `recognition-audit/${viewport.name}`;

  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page);

  const audit = page.locator("#audit");
  await audit.scrollIntoViewIfNeeded();
  await page.waitForTimeout(620);
  await assertMobileHeaderClear(page, viewport, label);

  const deck = audit.locator('[data-recognition-audit-deck="true"]');
  assert((await deck.count()) === 1, `${label}: recognition deck is missing`);

  const tabs = deck.getByRole("tablist", { name: "Brand recognition checks" }).getByRole("tab");
  assert((await tabs.count()) === 5, `${label}: expected five public check tabs`);
  await assertTouchTargets(tabs, 40, `${label}: check tabs`);

  const panel = deck.getByRole("tabpanel");
  await waitForText(
    panel,
    "One sentence says what the brand stands for",
    `${label}: first check`,
  );

  const score = audit.locator('[data-recognition-score="true"]');
  await waitForText(score, "0 / 5", `${label}: initial score`);
  await waitForText(score, "0 considered", `${label}: initial completion`);

  const holds = panel.getByRole("button", { name: "Holds true", exact: true });
  const gap = panel.getByRole("button", { name: "Needs work", exact: true });
  await assertTouchTargets(holds, 40, `${label}: holds answer`);
  await assertTouchTargets(gap, 40, `${label}: gap answer`);
  await holds.click();
  assert((await holds.getAttribute("aria-pressed")) === "true", `${label}: Holds true did not become pressed`);
  await waitForText(score, "1 / 5", `${label}: score after first answer`);
  await waitForText(score, "1 considered", `${label}: completion after first answer`);

  const distinctiveTab = deck.getByRole("tab", { name: /A stranger could pick your brand out of a lineup/i });
  await distinctiveTab.click();
  await waitForText(panel, "logo covered", `${label}: third check did not replace the panel`);
  const thirdGap = panel.getByRole("button", { name: "Needs work", exact: true });
  await thirdGap.click();
  assert((await thirdGap.getAttribute("aria-pressed")) === "true", `${label}: Needs work did not become pressed`);
  await waitForText(score, "2 considered", `${label}: completion after second answer`);

  const next = deck.getByRole("button", { name: "Next check", exact: true });
  const previous = deck.getByRole("button", { name: "Previous check", exact: true });
  await assertTouchTargets(next, 40, `${label}: next control`);
  await assertTouchTargets(previous, 40, `${label}: previous control`);
  await next.click();
  await waitForText(panel, "Colors, type, and voice", `${label}: next control`);

  await tabs.first().focus();
  await page.keyboard.press("End");
  assert((await tabs.nth(4).getAttribute("aria-selected")) === "true", `${label}: End did not select the last public check`);
  await waitForText(panel, "Buyers mention the brand unprompted", `${label}: keyboard navigation`);
  await previous.click();
  await waitForText(panel, "Colors, type, and voice", `${label}: previous control`);
  await assertMobileHeaderClear(page, viewport, `${label}/after-interaction`);

  const firstName = audit.getByLabel("First name", { exact: true });
  const email = audit.getByLabel("Email", { exact: true });
  const business = audit.getByLabel("Business name, optional", { exact: true });
  const consent = audit.getByRole("checkbox");
  assert((await firstName.getAttribute("required")) !== null, `${label}: first name is not required`);
  assert((await email.getAttribute("required")) !== null, `${label}: email is not required`);
  assert((await consent.getAttribute("required")) !== null, `${label}: consent is not required`);
  assert((await business.getAttribute("required")) === null, `${label}: business name became required`);

  await assertNoOverflow(page, label);
  await audit.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-recognition-audit-deck.png`),
    animations: "disabled",
  });

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

  process.stdout.write("Recognition Audit deck passed desktop and mobile interaction checks.\n");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
