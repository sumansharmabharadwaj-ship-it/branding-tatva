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
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  }
  await page.waitForFunction(
    () => document.documentElement.dataset.servicesExperience === "active",
    undefined,
    { timeout: 12_000 },
  );
  await page.waitForTimeout(220);
}

async function scrollY(page) {
  return page.evaluate(() => window.scrollY);
}

async function maxScroll(page) {
  return page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight));
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });

  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });

  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(`${BASE_URL}/services`, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await page.evaluate(() => document.fonts.ready);
  await waitForServices(page);

  const initial = await scrollY(page);
  await page.mouse.wheel(0, 540);
  await page.waitForTimeout(360);
  const afterWheel = await scrollY(page);
  assert(afterWheel > initial + 80, `Mouse wheel produced only ${afterWheel - initial}px of downward movement`);
  assert(afterWheel < initial + 1800, `Mouse wheel caused an excessive ${afterWheel - initial}px jump`);

  await page.mouse.wheel(0, -360);
  await page.waitForTimeout(340);
  const afterReverse = await scrollY(page);
  assert(afterReverse < afterWheel - 40, "Wheel reversal did not immediately return control");

  await page.keyboard.press("PageDown");
  await page.waitForTimeout(360);
  const afterPageDown = await scrollY(page);
  assert(afterPageDown > afterReverse + 180, "Page Down was blocked or produced no meaningful movement");

  await page.keyboard.press("Space");
  await page.waitForTimeout(360);
  const afterSpace = await scrollY(page);
  assert(afterSpace > afterPageDown + 160, "Space-bar scrolling was blocked");

  await page.keyboard.press("Home");
  await page.waitForTimeout(420);
  const afterHome = await scrollY(page);
  assert(afterHome < 40, `Home stopped at ${afterHome}px instead of returning to the opening`);

  await page.keyboard.press("End");
  await page.waitForTimeout(520);
  const endPosition = await scrollY(page);
  const maximum = await maxScroll(page);
  assert(maximum - endPosition < 80, `End stopped ${maximum - endPosition}px above the page end`);

  // Programmatic positioning is the browser-equivalent contract used by a
  // dragged scrollbar thumb. It must settle exactly where requested and the
  // chapter observer must update without snapping elsewhere.
  const midpoint = Math.round(maximum * 0.48);
  await page.evaluate((top) => window.scrollTo({ top, behavior: "auto" }), midpoint);
  await page.waitForTimeout(420);
  const afterScrollbarPosition = await scrollY(page);
  assert(
    Math.abs(afterScrollbarPosition - midpoint) < 36,
    `Direct scroll positioning drifted ${afterScrollbarPosition - midpoint}px`,
  );
  const midpointChapter = await page.evaluate(
    () => document.documentElement.dataset.servicesActiveChapter || null,
  );
  assert(Boolean(midpointChapter), "Active chapter did not update after direct scroll positioning");

  await page.goto(`${BASE_URL}/services#education`, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await page.evaluate(() => document.fonts.ready);
  await waitForServices(page);
  const educationOffset = await page.locator("#education").evaluate((node) => node.getBoundingClientRect().top);
  assert(
    Math.abs(educationOffset) < 180,
    `Direct #education anchor landed ${educationOffset}px from the intended scene`,
  );

  await page.goto(`${BASE_URL}/services#authority`, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await page.evaluate(() => document.fonts.ready);
  await waitForServices(page);
  await page.reload({ waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  await waitForServices(page);
  const authorityOffset = await page.locator("#authority").evaluate((node) => node.getBoundingClientRect().top);
  assert(
    authorityOffset < 240 && authorityOffset > -260,
    `Refresh inside Authority restored at an unusable offset of ${authorityOffset}px`,
  );

  await page.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-native-inputs.png"),
    fullPage: false,
    animations: "disabled",
  });

  assert(pageErrors.length === 0, `Browser errors:\n${pageErrors.join("\n")}`);

  const result = {
    generatedAt: new Date().toISOString(),
    initial,
    afterWheel,
    afterReverse,
    afterPageDown,
    afterSpace,
    afterHome,
    endPosition,
    maximum,
    afterScrollbarPosition,
    midpointChapter,
    educationOffset,
    authorityOffset,
  };
  fs.writeFileSync(
    path.join(OUTPUT, "services-native-input-report.json"),
    JSON.stringify(result, null, 2),
  );

  await context.close();
  await browser.close();
  process.stdout.write("Services native-input gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
