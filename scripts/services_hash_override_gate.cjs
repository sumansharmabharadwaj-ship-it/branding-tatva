const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-experience-audit");

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/services#stakes`, { waitUntil: "domcontentloaded", timeout: 90_000 });
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
  await page.waitForTimeout(80);

  const anchorY = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 640);
  await page.waitForTimeout(180);
  const manualY = await page.evaluate(() => scrollY);
  assert(manualY > anchorY + 80, `Manual wheel moved only ${manualY - anchorY}px away from the hash target`);

  await page.waitForTimeout(900);
  const settledY = await page.evaluate(() => scrollY);
  assert(
    settledY >= manualY - 90,
    `Delayed hash recovery pulled the visitor backward by ${(manualY - settledY).toFixed(1)}px`,
  );

  await page.keyboard.press("PageDown");
  await page.waitForTimeout(180);
  const keyboardY = await page.evaluate(() => scrollY);
  assert(keyboardY > settledY + 120, "Page Down did not take control after hash entry");
  await page.waitForTimeout(650);
  const keyboardSettledY = await page.evaluate(() => scrollY);
  assert(
    keyboardSettledY >= keyboardY - 90,
    `A delayed hash retry fought keyboard scrolling by ${(keyboardY - keyboardSettledY).toFixed(1)}px`,
  );

  const report = { generatedAt: new Date().toISOString(), anchorY, manualY, settledY, keyboardY, keyboardSettledY };
  fs.writeFileSync(path.join(OUTPUT, "services-hash-override-report.json"), JSON.stringify(report, null, 2));

  await context.close();
  await browser.close();
  process.stdout.write("Services hash-override gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
