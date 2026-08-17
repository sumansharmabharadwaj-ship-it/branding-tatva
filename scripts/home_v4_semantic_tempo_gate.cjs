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

async function activeRecognition(page) {
  return page
    .locator('[data-home-v4-chapter="recognition"] .home-v4-recognition__choices button[aria-pressed="true"]')
    .textContent();
}

async function tatvaStatus(page) {
  return page.locator('[data-home-v4-chapter="tatva"] .tatva-pressure-lab__status').textContent();
}

async function desktopAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: false });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForHome(page);

  const recognition = page.locator('[data-home-v4-chapter="recognition"]');
  await recognition.scrollIntoViewIfNeeded();
  await page.waitForTimeout(480);
  assert((await recognition.getAttribute("data-recognition-tempo-managed")) === "true", "Desktop Recognition tempo director is not mounted");
  const recognitionBefore = await activeRecognition(page);
  await page.waitForTimeout(1_700);
  const recognitionAfter = await activeRecognition(page);
  assert(Boolean(recognitionBefore) && Boolean(recognitionAfter), "Recognition active-state copy is missing");
  assert(recognitionBefore !== recognitionAfter, `Recognition did not change inside the first semantic beat: ${recognitionBefore}`);

  const recognitionButtons = recognition.locator('.home-v4-recognition__choices button');
  const manualRecognition = recognitionButtons.nth(2);
  await manualRecognition.click();
  const manualRecognitionLabel = await activeRecognition(page);
  await page.waitForTimeout(2_900);
  const heldRecognition = await activeRecognition(page);
  assert(manualRecognitionLabel === heldRecognition, `Recognition auto-rotation fought a manual choice: ${manualRecognitionLabel} → ${heldRecognition}`);

  const tatva = page.locator('[data-home-v4-chapter="tatva"]');
  await tatva.scrollIntoViewIfNeeded();
  await page.waitForTimeout(520);
  assert((await tatva.getAttribute("data-tatva-tempo-managed")) === "true", "Desktop Tatva tempo director is not mounted");
  assert((await tatva.locator('.tatva-pressure-lab').count()) === 1, "Compressed Tatva pressure lab is missing");
  assert((await tatva.locator('[data-elements-carousel="true"]').count()) === 0, "Legacy full-screen element carousel still bloats the Tatva chapter");
  assert((await tatva.locator('.tatva-observatory').count()) === 0, "Legacy Tatva observatory still bloats the Tatva chapter");

  const tatvaBefore = await tatvaStatus(page);
  await page.waitForTimeout(1_550);
  const tatvaAfter = await tatvaStatus(page);
  assert(/Complete system/i.test(tatvaBefore || ""), `Tatva did not begin as the complete system: ${tatvaBefore}`);
  assert(!/Complete system/i.test(tatvaAfter || ""), `Tatva did not demonstrate an omitted force inside the first beat: ${tatvaAfter}`);

  const manualForce = tatva.locator('.tatva-pressure-lab__copy .tatva-pressure-lab__force').nth(3);
  await manualForce.click();
  const manualTatva = await tatvaStatus(page);
  await page.waitForTimeout(2_800);
  const heldTatva = await tatvaStatus(page);
  assert(manualTatva === heldTatva, `Tatva auto-progression fought a manual force selection: ${manualTatva} → ${heldTatva}`);

  await tatva.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-compressed-tatva.png"),
    animations: "disabled",
  });

  await context.close();
  return { recognitionBefore, recognitionAfter, manualRecognitionLabel, heldRecognition, tatvaBefore, tatvaAfter, manualTatva, heldTatva };
}

async function mobileAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForHome(page);

  const recognition = page.locator('[data-home-v4-chapter="recognition"]');
  await recognition.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const recognitionBefore = await activeRecognition(page);
  await page.waitForTimeout(5_000);
  const recognitionAfter = await activeRecognition(page);
  assert(recognitionBefore === recognitionAfter, `Touch Recognition changed without a tap: ${recognitionBefore} → ${recognitionAfter}`);

  const tatva = page.locator('[data-home-v4-chapter="tatva"]');
  await tatva.scrollIntoViewIfNeeded();
  await page.waitForTimeout(520);
  const tatvaBefore = await tatvaStatus(page);
  await page.waitForTimeout(5_000);
  const tatvaAfter = await tatvaStatus(page);
  assert(tatvaBefore === tatvaAfter, `Touch Tatva changed without a tap: ${tatvaBefore} → ${tatvaAfter}`);

  const touchForce = tatva.locator('.tatva-pressure-lab__copy .tatva-pressure-lab__force').nth(1);
  await touchForce.tap();
  const afterTap = await tatvaStatus(page);
  assert(!/Complete system/i.test(afterTap || ""), "Touch Tatva force selection did not change the pressure model");

  await tatva.screenshot({
    path: path.join(OUTPUT, "mobile-390x844-tatva-tap-led.png"),
    animations: "disabled",
  });
  await context.close();
  return { recognitionBefore, recognitionAfter, tatvaBefore, tatvaAfter, afterTap };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  let desktop;
  let mobile;
  try {
    desktop = await desktopAudit(browser);
    mobile = await mobileAudit(browser);
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(OUTPUT, "home-v4-semantic-tempo-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), desktop, mobile }, null, 2),
  );
  process.stdout.write("Homepage V4 semantic-tempo gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
