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
  await page.waitForTimeout(240);
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
  await page.evaluate(() => document.fonts.ready);
  await waitForPrelude(page);

  const guide = page.locator("[data-guided-controls]");
  if ((await guide.count()) > 0) {
    const manualButton = guide.locator("button").nth(1);
    if ((await manualButton.count()) > 0) await manualButton.click();
  }

  const framework = page.locator('[aria-labelledby="tatva-framework-title"]').first();
  const pressureLab = page.locator('[aria-labelledby="tatva-system-lab-title"]').first();

  assert((await framework.count()) === 1, `${viewport.name}: Tatva framework missing`);
  assert((await pressureLab.count()) === 1, `${viewport.name}: Tatva pressure lab missing`);

  await framework.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const frameworkCopy = (await framework.textContent()) || "";
  assert(
    frameworkCopy.includes("Five forces. One recognisable brand."),
    `${viewport.name}: Tatva framework proposition missing`,
  );
  await framework.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-tatva-framework.png`),
  });

  await pressureLab.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const pressureCopy = (await pressureLab.textContent()) || "";
  assert(
    pressureCopy.includes("Remove one force. Watch recognition lose its shape."),
    `${viewport.name}: Tatva pressure proposition missing`,
  );
  await pressureLab.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-tatva-pressure.png`),
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

  process.stdout.write("Tatva observatory evidence captured.\n");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
