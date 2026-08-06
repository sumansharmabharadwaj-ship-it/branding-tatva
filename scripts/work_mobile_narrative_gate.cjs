const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page, label) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) await loader.waitFor({ state: "detached", timeout: 9_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  assert((await loader.count()) === 0, `${label}: page-load veil did not clear`);
}

async function visibleCount(locator) {
  return locator.evaluateAll((nodes) =>
    nodes.filter((node) => {
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    }).length,
  );
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

async function auditWorkMobile(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(`${BASE_URL}/work`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page, "work/mobile-narratives");

  const heroPanel = page.locator("#hero-project-preview");
  await heroPanel.waitFor({ state: "visible", timeout: 8_000 });
  const heroTop = await heroPanel.evaluate((node) => node.getBoundingClientRect().top);
  assert(heroTop < 844 * 0.96, `work/mobile-narratives: project proof begins too late, top=${heroTop}`);

  const signatureDeck = page.locator('[data-mobile-signature-deck="true"]');
  await signatureDeck.waitFor({ state: "visible", timeout: 8_000 });
  const signatureButtons = signatureDeck.getByRole("group", { name: "Choose a performance case-study beat" }).getByRole("button");
  assert((await signatureButtons.count()) === 6, "work/mobile-narratives: performance deck does not expose six beats");
  await signatureButtons.last().click();
  const signaturePanel = signatureDeck.locator("#mobile-signature-beat");
  assert((await signaturePanel.textContent())?.includes("Verified result"), "work/mobile-narratives: performance deck did not reach the verified result");

  const systemBoard = page.locator('[data-mobile-system-project-board="true"]');
  await systemBoard.waitFor({ state: "visible", timeout: 8_000 });
  assert((await page.locator("#mobile-system-step").count()) === 1, "work/mobile-narratives: system-board marker is missing or duplicated");
  const systemButtons = systemBoard.getByRole("group", { name: "Choose a system-building case-study stage" }).getByRole("button");
  assert((await systemButtons.count()) === 3, "work/mobile-narratives: system board does not expose three stages");
  await systemButtons.nth(1).click();
  const systemPanel = systemBoard.locator("#mobile-system-project-panel");
  const systemText = (await systemPanel.textContent()) || "";
  assert(systemText.includes("The strategic choice") && systemText.includes("origin"), "work/mobile-narratives: system board did not switch to ORIGIN");

  const labHeading = page.getByRole("heading", { name: "Concept studies: the method, demonstrated in the open." });
  const labSection = labHeading.locator("xpath=ancestor::section[1]");
  await labHeading.scrollIntoViewIfNeeded();
  const labButtons = labSection.locator('button[aria-expanded]');
  assert((await labButtons.count()) === 4, "work/mobile-narratives: Lab does not expose four dossiers when closed");
  await labButtons.first().click();
  await page.waitForTimeout(900);
  assert((await visibleCount(labButtons)) === 1, "work/mobile-narratives: unrelated Lab covers remain visible after opening a dossier");

  const studiesHeading = page.getByRole("heading", { name: "Lessons from brands the whole world already knows." });
  const studiesSection = studiesHeading.locator("xpath=ancestor::section[1]");
  await studiesHeading.scrollIntoViewIfNeeded();
  const studyButtons = studiesSection.locator('button[aria-expanded]');
  assert((await studyButtons.count()) === 5, "work/mobile-narratives: Brand Studies does not expose five studies when closed");
  await studyButtons.first().click();
  await page.waitForTimeout(700);
  assert((await visibleCount(studyButtons)) === 1, "work/mobile-narratives: unrelated study covers remain visible after opening one lesson");

  await assertNoOverflow(page, "work/mobile-narratives");
  assert(pageErrors.length === 0, `work/mobile-narratives: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);
  await context.close();
}

async function auditCaseStudyMobile(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(`${BASE_URL}/work/myshopineurope`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page, "case/mobile-narratives");
  await page.locator("#story").scrollIntoViewIfNeeded();

  const deck = page.locator('[data-mobile-case-study-deck="true"]');
  await deck.waitFor({ state: "visible", timeout: 8_000 });
  const buttons = deck.getByRole("group", { name: "Choose a case-study chapter" }).getByRole("button");
  const chapterCount = await buttons.count();
  assert(chapterCount >= 6, `case/mobile-narratives: expected at least six chapters, found ${chapterCount}`);

  const originalNarrative = page.locator('[data-mobile-narrative-original-case="true"]');
  assert((await visibleCount(originalNarrative)) === 0, "case/mobile-narratives: original long-form corridor remains visible");

  const firstText = (await deck.locator("#mobile-case-study-deck-panel").textContent()) || "";
  await buttons.nth(Math.min(2, chapterCount - 1)).click();
  await page.waitForTimeout(180);
  const nextText = (await deck.locator("#mobile-case-study-deck-panel").textContent()) || "";
  assert(firstText !== nextText, "case/mobile-narratives: chapter selection did not change the active evidence");

  await assertNoOverflow(page, "case/mobile-narratives");
  assert(pageErrors.length === 0, `case/mobile-narratives: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await auditWorkMobile(browser);
    await auditCaseStudyMobile(browser);
    console.log(JSON.stringify({
      baseUrl: BASE_URL,
      mobileNarrativeGate: "passed",
      checked: [
        "first-screen project proof",
        "six-beat performance deck",
        "three-state system board",
        "focused Lab dossier",
        "focused public brand study",
        "selectable project chapter deck",
        "mobile overflow",
        "page exceptions",
      ],
    }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
