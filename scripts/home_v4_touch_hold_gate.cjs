const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "homepage-v4-audit");

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForHome(page) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) await veil.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  await page.waitForSelector("[data-home-v4]", { timeout: 12_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(420);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });
  const page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForHome(page);

  const tatva = page.locator('[data-home-v4-chapter="tatva"]');
  await tatva.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  assert((await tatva.getAttribute("data-tatva-tempo-managed")) === "true", "Tatva tempo director is not mounted on touch");

  const force = tatva.locator('.tatva-pressure-lab__copy .tatva-pressure-lab__force').nth(2);
  await force.tap();
  await page.waitForTimeout(220);
  const selectedStatus = await tatva.locator('.tatva-pressure-lab__status').textContent();
  assert(selectedStatus && !/complete system/i.test(selectedStatus), `Tatva tap did not create an omission: ${selectedStatus}`);

  // Cross the component's full 16-second manual-reading boundary. Touch must
  // remain visitor-led even after the internal timer would otherwise become
  // eligible to rotate again.
  await page.waitForTimeout(17_200);
  const afterHoldStatus = await tatva.locator('.tatva-pressure-lab__status').textContent();
  assert(afterHoldStatus === selectedStatus, `Tatva changed after the touch hold expired: ${selectedStatus} → ${afterHoldStatus}`);

  await tatva.screenshot({
    path: path.join(OUTPUT, "mobile-390x844-tatva-after-full-hold.png"),
    animations: "disabled",
  });

  fs.writeFileSync(
    path.join(OUTPUT, "home-v4-touch-hold-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), selectedStatus, afterHoldStatus }, null, 2),
  );

  await context.close();
  await browser.close();
  process.stdout.write("Homepage V4 touch-hold gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
