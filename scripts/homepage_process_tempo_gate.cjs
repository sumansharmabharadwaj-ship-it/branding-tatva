const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "cinematic-recovery-audit");

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForAttribute(page, locator, name, expected, timeoutMs = 2_500) {
  const deadline = Date.now() + timeoutMs;
  let actual = null;
  while (Date.now() < deadline) {
    actual = await locator.getAttribute(name);
    if (actual === expected) return;
    await page.waitForTimeout(60);
  }
  throw new Error(`${name} resolved to ${actual}, expected ${expected}`);
}

async function selectedStage(processScene) {
  return processScene
    .locator('.project-journey__rail [role="tab"][aria-selected="true"]')
    .getAttribute("id");
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "no-preference",
  });

  await context.addInitScript(() => {
    try {
      window.sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
      window.localStorage.setItem(
        "bt-consent",
        JSON.stringify({
          analytics: false,
          marketing: false,
          decidedAt: "2026-08-17T00:00:00.000Z",
          version: 1,
        }),
      );
    } catch {}
  });

  const page = await context.newPage();
  page.setDefaultTimeout(7_000);
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.evaluate(() =>
    Promise.race([
      document.fonts.ready,
      new Promise((resolve) => window.setTimeout(resolve, 2_000)),
    ]),
  );

  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 9_000 });
  }

  const processScene = page.locator('[data-home-v4-chapter="process"]').first();
  assert((await processScene.count()) === 1, "working-method chapter missing");
  await processScene.scrollIntoViewIfNeeded();
  await page.waitForTimeout(520);

  const managed = await processScene
    .locator('[data-project-journey="true"]')
    .getAttribute("data-process-tempo-managed");
  assert(managed === "true", "working-method tempo director did not attach");

  const initial = await selectedStage(processScene);
  await page.waitForTimeout(3_050);
  const firstAdvance = await selectedStage(processScene);
  assert(firstAdvance && firstAdvance !== initial, "working-method scene did not advance within the first reading beat");

  await processScene.locator('[data-project-journey="true"]').dispatchEvent("pointerdown", {
    bubbles: true,
    pointerType: "mouse",
  });
  const heldStage = await selectedStage(processScene);
  await page.waitForTimeout(4_800);
  assert(
    (await selectedStage(processScene)) === heldStage,
    "manual interaction did not hold the working-method scene",
  );

  const guide = page.locator("[data-guided-controls]");
  assert((await guide.count()) === 1, "guided controls missing during working-method audit");
  const guideToggle = guide.locator("button").first();
  const guideStep = (await guide.locator("strong").textContent()) || "";
  assert(
    guideStep.startsWith("06/"),
    `guided controls did not recognize the working-method scene: ${guideStep}`,
  );

  await guideToggle.dispatchEvent("click");
  await waitForAttribute(page, guide, "data-guide-mode", "guided");

  await guideToggle.dispatchEvent("click");
  await waitForAttribute(page, guide, "data-guide-mode", "paused");

  const pausedStage = await selectedStage(processScene);
  await page.waitForTimeout(6_200);
  assert(
    (await selectedStage(processScene)) === pausedStage,
    "guided pause did not freeze the working-method sequence",
  );

  await guideToggle.dispatchEvent("click");
  await waitForAttribute(page, guide, "data-guide-mode", "guided");
  await page.waitForTimeout(3_050);
  assert(
    (await selectedStage(processScene)) !== pausedStage,
    "working-method sequence did not resume after Continue",
  );

  await processScene.screenshot({
    path: path.join(OUTPUT, "desktop-1280x800-process-tempo.png"),
  });

  fs.writeFileSync(
    path.join(OUTPUT, "process-tempo-report.json"),
    JSON.stringify(
      {
        commit: process.env.AUDIT_COMMIT || "local",
        firstAdvanceMs: 3_050,
        manualHoldObservedMs: 4_800,
        guidedPauseObservedMs: 6_200,
        resumed: true,
      },
      null,
      2,
    ),
  );

  await context.close();
  await browser.close();
  process.stdout.write("Working-method tempo gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
