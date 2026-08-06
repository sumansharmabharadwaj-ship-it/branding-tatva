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

async function waitForChangedText(page, selector, previousText, label) {
  await page
    .waitForFunction(
      ({ selector: query, before }) => {
        const node = document.querySelector(query);
        return Boolean(node && node.textContent && node.textContent.replace(/\s+/g, " ").trim() !== before);
      },
      { selector, before: previousText },
      { timeout: 3_000 },
    )
    .catch(() => {
      throw new Error(`${label}: active evidence text did not change`);
    });
}

async function narrativePanelContent(panel) {
  return panel.evaluate((node) => {
    const directParagraphs = Array.from(node.children).filter((child) => child.tagName === "P");
    return {
      label: directParagraphs[0]?.querySelector("span")?.textContent?.replace(/\s+/g, " ").trim() || "",
      title: node.querySelector(":scope > h3")?.textContent?.replace(/\s+/g, " ").trim() || "",
      body: directParagraphs[directParagraphs.length - 1]?.textContent?.replace(/\s+/g, " ").trim() || "",
      ariaLabel: node.getAttribute("aria-label") || "",
    };
  });
}

function assertCompleteNarrative(content, label) {
  assert(content.label.length >= 4, `${label}: chapter label is empty or truncated, value=${content.label}`);
  assert(content.title.length >= 12, `${label}: chapter title is empty or truncated, value=${content.title}`);
  assert(content.body.length >= 35, `${label}: chapter body is empty or truncated, length=${content.body.length}`);
  assert(
    content.ariaLabel.includes(content.label) && content.ariaLabel.includes(content.title),
    `${label}: region label does not describe the visible chapter, aria-label=${content.ariaLabel}`,
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
  const signatureImageAlt = (await signatureDeck.locator("img").getAttribute("alt")) || "";
  assert(
    signatureImageAlt !== "Performance evidence diagram" && signatureImageAlt.endsWith("performance evidence diagram"),
    `work/mobile-narratives: mobile performance evidence lost its project-specific alt text, alt=${signatureImageAlt}`,
  );

  const signatureButtons = signatureDeck
    .getByRole("group", { name: "Choose a performance case-study beat" })
    .getByRole("button");
  assert((await signatureButtons.count()) === 6, "work/mobile-narratives: performance deck does not expose six beats");
  const signaturePanel = signatureDeck.locator("#mobile-signature-beat");
  const signatureBefore = ((await signaturePanel.textContent()) || "").replace(/\s+/g, " ").trim();
  assert(signatureBefore.length >= 45, "work/mobile-narratives: first performance beat has no meaningful evidence copy");
  await signatureButtons.last().click();
  await waitForChangedText(page, "#mobile-signature-beat", signatureBefore, "work/mobile-narratives: performance deck");
  assert(
    (await signaturePanel.textContent())?.includes("Verified result"),
    "work/mobile-narratives: performance deck did not reach the verified result",
  );
  assert(
    (await signatureButtons.last().getAttribute("aria-pressed")) === "true",
    "work/mobile-narratives: performance deck did not expose the selected beat",
  );

  const systemBoard = page.locator('[data-mobile-system-project-board="true"]');
  await systemBoard.waitFor({ state: "visible", timeout: 8_000 });
  assert(
    (await page.locator("#mobile-system-step").count()) === 1,
    "work/mobile-narratives: system-board marker is missing or duplicated",
  );
  const systemButtons = systemBoard
    .getByRole("group", { name: "Choose a system-building case-study stage" })
    .getByRole("button");
  assert((await systemButtons.count()) === 3, "work/mobile-narratives: system board does not expose three stages");
  const systemPanel = systemBoard.locator("#mobile-system-project-panel");
  const systemBefore = ((await systemPanel.textContent()) || "").replace(/\s+/g, " ").trim();
  await systemButtons.nth(1).click();
  await waitForChangedText(page, "#mobile-system-project-panel", systemBefore, "work/mobile-narratives: system board");
  const systemText = (await systemPanel.textContent()) || "";
  assert(
    systemText.includes("The strategic choice") && systemText.includes("origin"),
    "work/mobile-narratives: system board did not switch to ORIGIN",
  );

  const decisionButtons = page.locator('ul[aria-label="Decision artefacts"] button[aria-expanded]');
  assert((await decisionButtons.count()) === 7, "work/mobile-narratives: decision archive does not expose seven artefacts");
  await decisionButtons.first().click();
  await page.waitForTimeout(260);
  assert(
    (await visibleCount(decisionButtons)) === 1,
    "work/mobile-narratives: unrelated decision cards remain visible during inspection",
  );
  await decisionButtons.first().click();
  await page.waitForTimeout(180);
  assert(
    (await visibleCount(decisionButtons)) === 7,
    "work/mobile-narratives: decision archive did not restore after closing the artefact",
  );

  const labHeading = page.getByRole("heading", { name: "Concept studies: the method, demonstrated in the open." });
  const labSection = labHeading.locator("xpath=ancestor::section[1]");
  await labHeading.scrollIntoViewIfNeeded();
  const labButtons = labSection.locator('button[aria-expanded]');
  assert((await labButtons.count()) === 4, "work/mobile-narratives: Lab does not expose four dossiers when closed");
  await labButtons.first().click();
  await page.waitForTimeout(900);
  assert(
    (await visibleCount(labButtons)) === 1,
    "work/mobile-narratives: unrelated Lab covers remain visible after opening a dossier",
  );

  const studiesHeading = page.getByRole("heading", { name: "Lessons from brands the whole world already knows." });
  const studiesSection = studiesHeading.locator("xpath=ancestor::section[1]");
  await studiesHeading.scrollIntoViewIfNeeded();
  const studyButtons = studiesSection.locator('button[aria-expanded]');
  assert((await studyButtons.count()) === 5, "work/mobile-narratives: Brand Studies does not expose five studies when closed");
  await studyButtons.first().click();
  await page.waitForTimeout(700);
  assert(
    (await visibleCount(studyButtons)) === 1,
    "work/mobile-narratives: unrelated study covers remain visible after opening one lesson",
  );

  const closeStudy = studiesSection.getByRole("button", { name: "Close study" });
  await closeStudy.click();
  await page.waitForTimeout(180);
  assert(
    (await visibleCount(studyButtons)) === 5,
    "work/mobile-narratives: study covers did not return after closing the lesson",
  );
  const focusedLabel = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || "");
  assert(
    focusedLabel === "Open Coca Cola public-record study",
    `work/mobile-narratives: study focus did not return to its cover, active=${focusedLabel}`,
  );

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
  assert(
    (await page.locator("#mobile-case-study-deck-panel").count()) === 1,
    "case/mobile-narratives: mobile chapter panel is missing or duplicated",
  );

  const buttons = deck.getByRole("group", { name: "Choose a case-study chapter" }).getByRole("button");
  const chapterCount = await buttons.count();
  assert(chapterCount >= 6, `case/mobile-narratives: expected at least six chapters, found ${chapterCount}`);

  const firstButtonLabel = (await buttons.first().getAttribute("aria-label")) || "";
  assert(
    firstButtonLabel.includes("Starting condition"),
    `case/mobile-narratives: chapter controls lost their descriptive labels, first=${firstButtonLabel}`,
  );

  const originalNarrative = page.locator('[data-mobile-narrative-original-case="true"]');
  const originalNav = page.locator('[data-mobile-narrative-original-nav="true"]');
  assert(
    (await visibleCount(originalNarrative)) === 0,
    "case/mobile-narratives: original long-form corridor remains visible",
  );
  assert((await visibleCount(originalNav)) === 0, "case/mobile-narratives: original desktop chapter navigation remains visible");

  const chapterPanel = deck.locator("#mobile-case-study-deck-panel");
  const firstContent = await narrativePanelContent(chapterPanel);
  assertCompleteNarrative(firstContent, "case/mobile-narratives: first chapter");
  const firstText = ((await chapterPanel.textContent()) || "").replace(/\s+/g, " ").trim();

  const targetIndex = Math.min(2, chapterCount - 1);
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await buttons.nth(targetIndex).click();
  await waitForChangedText(page, "#mobile-case-study-deck-panel", firstText, "case/mobile-narratives: chapter deck");
  await page.waitForTimeout(120);
  const scrollAfter = await page.evaluate(() => window.scrollY);
  assert(
    Math.abs(scrollAfter - scrollBefore) <= 8,
    `case/mobile-narratives: selecting a compact chapter invoked the hidden desktop scroll, before=${scrollBefore}, after=${scrollAfter}`,
  );

  const nextContent = await narrativePanelContent(chapterPanel);
  assertCompleteNarrative(nextContent, "case/mobile-narratives: selected chapter");
  assert(
    firstContent.title !== nextContent.title && firstContent.body !== nextContent.body,
    "case/mobile-narratives: chapter selection changed only the counter, not the evidence",
  );
  assert(
    (await buttons.nth(targetIndex).getAttribute("aria-pressed")) === "true",
    "case/mobile-narratives: mobile chapter control did not expose aria-pressed=true",
  );

  const originalButtons = originalNav.getByRole("button");
  assert(
    (await originalButtons.nth(targetIndex).getAttribute("aria-current")) === "step",
    "case/mobile-narratives: compact chapter selection did not synchronise the hidden desktop state",
  );

  await assertNoOverflow(page, "case/mobile-narratives");
  assert(pageErrors.length === 0, `case/mobile-narratives: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await auditWorkMobile(browser);
    await auditCaseStudyMobile(browser);
    console.log(
      JSON.stringify(
        {
          baseUrl: BASE_URL,
          mobileNarrativeGate: "passed",
          checked: [
            "first-screen project proof",
            "project-specific performance evidence alt text",
            "six-beat performance deck",
            "three-state system board",
            "focused decision artefact",
            "focused Lab dossier",
            "focused public brand study",
            "study close and focus return",
            "complete selectable project chapters",
            "chapter scroll stability",
            "hidden desktop state synchronisation",
            "mobile overflow",
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
