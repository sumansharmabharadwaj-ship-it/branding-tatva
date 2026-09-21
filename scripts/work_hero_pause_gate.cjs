const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT_DIR = path.join(process.cwd(), "cinematic-recovery-audit");
const ROTATION_WINDOW_MS = 3_250;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page, label) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) await loader.waitFor({ state: "detached", timeout: 9_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(420);
  assert((await loader.count()) === 0, `${label}: page-load veil did not clear`);
}

async function selectedIndex(tabs) {
  return tabs.evaluateAll((nodes) => nodes.findIndex((node) => node.getAttribute("aria-selected") === "true"));
}

async function previewState(stage) {
  return stage.evaluate((node) => ({
    pointerPaused: node.dataset.pointerPaused,
    focusPaused: node.dataset.focusPaused,
    manualPaused: node.dataset.manualPaused,
    inView: node.dataset.previewInView,
    hydrated: node.dataset.previewHydrated,
    reduced: node.dataset.previewReduced,
    rotationEnabled: node.dataset.rotationEnabled,
    active: Array.from(node.querySelectorAll('[role="tab"]')).findIndex(
      (tab) => tab.getAttribute("aria-selected") === "true",
    ),
  }));
}

async function waitForSelectionChange(page, tabs, stage, previous, label) {
  const enableDeadline = Date.now() + 2_500;
  let enabled = false;
  while (Date.now() < enableDeadline) {
    enabled = (await stage.getAttribute("data-rotation-enabled")) === "true";
    if (enabled) break;
    await page.waitForTimeout(70);
  }

  if (!enabled) {
    const state = await previewState(stage);
    throw new Error(`${label}: automatic preview never became eligible; state=${JSON.stringify(state)}`);
  }

  const changeDeadline = Date.now() + ROTATION_WINDOW_MS + 1_500;
  while (Date.now() < changeDeadline) {
    const next = await selectedIndex(tabs);
    if (next >= 0 && next !== previous) return next;
    await page.waitForTimeout(70);
  }

  const state = await previewState(stage);
  throw new Error(`${label}: automatic preview did not resume; state=${JSON.stringify(state)}`);
}

async function assertStableSelection(page, tabs, expected, label) {
  await page.waitForTimeout(ROTATION_WINDOW_MS);
  const actual = await selectedIndex(tabs);
  assert(actual === expected, `${label}: preview rotated from ${expected} to ${actual}`);
}

async function movePointerInside(page, stage) {
  const box = await stage.boundingBox();
  assert(box, "work/hero-pause: preview stage has no measurable box");
  await page.mouse.move(box.x + box.width * 0.5, box.y + Math.min(box.height * 0.35, 220));
}

async function movePointerOutside(page) {
  await page.mouse.move(2, 2);
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert(
    dimensions.document <= dimensions.viewport + 2 && dimensions.body <= dimensions.viewport + 2,
    `${label}: horizontal overflow ${JSON.stringify(dimensions)}`,
  );
}

async function auditInteractivePause(browser) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await page.goto(`${BASE_URL}/work`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await waitForPrelude(page, "work/hero-pause");

    const stage = page.locator('[data-work-preview-stage="true"]');
    const tabs = stage.getByRole("tab");
    const toggle = stage.locator('[data-work-preview-toggle="true"]');
    const outsideFocus = page.getByRole("link", { name: "Explore the evidence" });

    await stage.waitFor({ state: "visible", timeout: 8_000 });
    assert((await tabs.count()) === 5, "work/hero-pause: expected five project tabs");
    assert((await toggle.getAttribute("aria-label")) === "Pause automatic project preview", "work/hero-pause: initial pause control is incorrect");
    assert((await toggle.getAttribute("aria-pressed")) === "false", "work/hero-pause: preview starts manually paused");

    const initial = await selectedIndex(tabs);
    assert(initial >= 0, "work/hero-pause: no selected project tab");

    await tabs.nth(initial).focus();
    await page.waitForTimeout(100);
    await movePointerInside(page, stage);
    await movePointerOutside(page);
    await assertStableSelection(page, tabs, initial, "work/hero-pause: focus pause after pointer leave");

    await movePointerInside(page, stage);
    await outsideFocus.focus();
    await page.waitForTimeout(100);
    const hovered = await selectedIndex(tabs);
    await assertStableSelection(page, tabs, hovered, "work/hero-pause: hover pause after focus leaves");

    await movePointerOutside(page);
    await waitForSelectionChange(page, tabs, stage, hovered, "work/hero-pause");

    await toggle.click();
    await movePointerOutside(page);
    await outsideFocus.focus();
    await page.waitForTimeout(120);
    assert((await toggle.getAttribute("aria-pressed")) === "true", "work/hero-pause: manual pause did not expose aria-pressed=true");
    assert((await toggle.getAttribute("aria-label")) === "Resume automatic project preview", "work/hero-pause: manual pause did not expose a resume label");
    const manuallyPaused = await selectedIndex(tabs);
    await assertStableSelection(page, tabs, manuallyPaused, "work/hero-pause: manual pause");

    await toggle.click();
    await movePointerOutside(page);
    await outsideFocus.focus();
    await page.waitForTimeout(120);
    assert((await toggle.getAttribute("aria-pressed")) === "false", "work/hero-pause: manual resume did not clear aria-pressed");
    const resumedAfterManual = await waitForSelectionChange(
      page,
      tabs,
      stage,
      manuallyPaused,
      "work/hero-pause: manual resume",
    );

    await tabs.nth(resumedAfterManual).focus();
    await tabs.nth(resumedAfterManual).press("ArrowRight");
    const arrowSelected = (resumedAfterManual + 1) % 5;
    assert((await selectedIndex(tabs)) === arrowSelected, "work/hero-pause: ArrowRight did not select the next project");
    assert(
      await tabs.nth(arrowSelected).evaluate((node) => document.activeElement === node),
      "work/hero-pause: ArrowRight did not move focus to the selected project",
    );
    assert((await toggle.getAttribute("aria-pressed")) === "true", "work/hero-pause: keyboard selection did not pause automatic rotation");

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    await stage.screenshot({
      path: path.join(OUTPUT_DIR, "work-hero-pause-desktop-1280x800.png"),
      animations: "disabled",
    });

    await assertNoOverflow(page, "work/hero-pause");
    assert(pageErrors.length === 0, `work/hero-pause: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);
  } finally {
    await context.close();
  }
}

async function auditReducedMotion(browser) {
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
    await waitForPrelude(page, "work/hero-pause-reduced-motion");

    const stage = page.locator('[data-work-preview-stage="true"]');
    const tabs = stage.getByRole("tab");
    const toggle = stage.locator('[data-work-preview-toggle="true"]');
    const initial = await selectedIndex(tabs);

    assert(await toggle.isDisabled(), "work/hero-pause-reduced-motion: preview toggle is enabled");
    assert(
      (await toggle.getAttribute("aria-label")) === "Project preview is static in reduced-motion mode",
      "work/hero-pause-reduced-motion: static-state label is missing",
    );
    await assertStableSelection(page, tabs, initial, "work/hero-pause-reduced-motion");
    await assertNoOverflow(page, "work/hero-pause-reduced-motion");
    assert(pageErrors.length === 0, `work/hero-pause-reduced-motion: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);
  } finally {
    await context.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await auditInteractivePause(browser);
    await auditReducedMotion(browser);
    console.log(
      JSON.stringify(
        {
          baseUrl: BASE_URL,
          heroPauseGate: "passed",
          checked: [
            "focus pause survives pointer leave",
            "hover pause survives focus leave",
            "automatic resume",
            "manual pause and resume",
            "ArrowRight selection and focus",
            "keyboard selection pauses autoplay",
            "reduced-motion static state",
            "overflow",
            "page exceptions",
          ],
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
