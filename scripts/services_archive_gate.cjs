const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-experience-audit");

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServices(page) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) await veil.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  await page.waitForFunction(
    (expected) => Number(document.documentElement.dataset.servicesChapterCount || 0) === expected,
    13,
    { timeout: 12_000 },
  );
  await page.waitForTimeout(300);
}

async function scrollScene(page, progress) {
  await page.evaluate((progress) => {
    const scene = document.querySelector("#deliverables");
    if (!(scene instanceof HTMLElement)) return;
    const viewport = innerHeight;
    const top = scene.getBoundingClientRect().top + scrollY;
    const desiredTop = viewport - progress * (viewport + scene.offsetHeight);
    scrollTo({ top: Math.max(0, top - desiredTop), behavior: "auto" });
  }, progress);
  await page.waitForTimeout(700);
}

async function selectedGroup(page) {
  return page.locator('[role="tablist"][aria-label="Deliverable scope drawers"] [role="tab"][aria-selected="true"]').textContent();
}

async function desktopAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: false });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForServices(page);

  const explorer = page.locator('#deliverables [data-deliverables-explorer="drawers"]');
  assert((await explorer.count()) === 1, "Desktop archive explorer is missing");
  await page.waitForFunction(
    (selector) => Boolean(document.querySelector(selector)),
    '[data-deliverables-scroll-controlled="true"]',
  );

  await scrollScene(page, 0.03);
  const early = await selectedGroup(page);
  await scrollScene(page, 0.97);
  const late = await selectedGroup(page);
  assert(/Foundation/i.test(early || ""), `Desktop archive began at ${early}`);
  assert(/Continuity/i.test(late || ""), `Desktop archive ended at ${late}`);

  const expression = page.getByRole("tab", { name: /Expression drawer/i });
  await expression.click();
  await scrollScene(page, 0.08);
  const held = await selectedGroup(page);
  assert(/Expression/i.test(held || ""), `Desktop scroll fought a manual archive choice: ${held}`);

  await page.locator("#deliverables").screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-archive-expression-held.png"),
    animations: "disabled",
  });
  await context.close();
  return { early, late, held };
}

async function touchAudit(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForServices(page);

  const explorer = page.locator('#deliverables [data-deliverables-explorer="drawers"]');
  assert((await explorer.getAttribute("data-deliverables-scroll-controlled")) === "false", "Touch archive incorrectly enabled scroll preview");

  await scrollScene(page, 0.03);
  const early = await selectedGroup(page);
  await scrollScene(page, 0.97);
  const afterTravel = await selectedGroup(page);
  assert(/Foundation/i.test(early || ""), `Touch archive began at ${early}`);
  assert(/Foundation/i.test(afterTravel || ""), `Touch scrolling changed the drawer to ${afterTravel}`);

  const activation = page.getByRole("tab", { name: /Activation drawer/i });
  await activation.click();
  const selected = await selectedGroup(page);
  assert(/Activation/i.test(selected || ""), `Touch drawer selection failed: ${selected}`);

  await page.locator("#deliverables").screenshot({
    path: path.join(OUTPUT, "mobile-390x844-archive-activation.png"),
    animations: "disabled",
  });
  await context.close();
  return { early, afterTravel, selected };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  let desktop;
  let touch;
  try {
    desktop = await desktopAudit(browser);
    touch = await touchAudit(browser);
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(OUTPUT, "services-archive-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), desktop, touch }, null, 2),
  );
  process.stdout.write("Services archive gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
