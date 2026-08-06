const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-page-audit");

const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900, touch: false, screenshots: true },
  { name: "tablet-1024x768", width: 1024, height: 768, touch: true, screenshots: false },
  { name: "mobile-390x844", width: 390, height: 844, touch: true, screenshots: true },
];

const SECTION_IDS = [
  "situation",
  "offerings",
  "desire",
  "authority",
  "education",
  "imagine",
  "health",
  "audit",
  "book",
];

const GENERATED_POSTERS = [
  { section: "hero", fragment: "bt-services-hero-root-system-poster" },
  { section: "offerings", fragment: "bt-services-strategy-topography-poster" },
  { section: "desire", fragment: "bt-services-package-current-poster" },
  { section: "education", fragment: "bt-services-perception-ascent-poster" },
  { section: "health", fragment: "bt-services-health-reflection-poster" },
  { section: "book", fragment: "bt-services-strategy-room-poster" },
];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assetMayBeMissing(value = "") {
  return (
    /\/(videos|audio)\//i.test(value) ||
    /\/_vercel\/(insights|speed-insights)\//i.test(value)
  );
}

function calendlyMayBeUnavailable(value = "") {
  return /calendly\.com|assets\.calendly\.com/i.test(value);
}

function expectedAbortedPrefetch(item) {
  return (
    /net::ERR_ABORTED/i.test(item.error) &&
    /[?&]_rsc=/.test(item.url) &&
    item.url.startsWith(BASE_URL)
  );
}

function attachDiagnostics(page) {
  const consoleErrors = [];
  const failedResponses = [];
  const failedRequests = [];

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    consoleErrors.push({ text: message.text(), url: message.location().url || "" });
  });
  page.on("pageerror", (error) => consoleErrors.push({ text: error.message, url: "" }));
  page.on("response", (response) => {
    if (response.status() >= 400) failedResponses.push({ status: response.status(), url: response.url() });
  });
  page.on("requestfailed", (request) => {
    failedRequests.push({
      url: request.url(),
      error: request.failure()?.errorText || "request failed",
    });
  });

  return { consoleErrors, failedResponses, failedRequests };
}

function assertDiagnosticsClean(diagnostics, label) {
  const consoleErrors = diagnostics.consoleErrors.filter(
    (item) =>
      !assetMayBeMissing(item.url) &&
      !assetMayBeMissing(item.text) &&
      !calendlyMayBeUnavailable(item.url) &&
      !calendlyMayBeUnavailable(item.text),
  );
  const failedResponses = diagnostics.failedResponses.filter(
    (item) => !assetMayBeMissing(item.url) && !calendlyMayBeUnavailable(item.url),
  );
  const failedRequests = diagnostics.failedRequests.filter(
    (item) =>
      !assetMayBeMissing(item.url) &&
      !calendlyMayBeUnavailable(item.url) &&
      !expectedAbortedPrefetch(item),
  );

  assert(consoleErrors.length === 0, `${label}: console errors ${JSON.stringify(consoleErrors.slice(0, 8))}`);
  assert(failedResponses.length === 0, `${label}: failed responses ${JSON.stringify(failedResponses.slice(0, 8))}`);
  assert(failedRequests.length === 0, `${label}: failed requests ${JSON.stringify(failedRequests.slice(0, 8))}`);
}

async function waitForPrelude(page, label) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) {
    await veil.waitFor({ state: "detached", timeout: 10_000 }).catch(() => {});
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(420);
  assert((await veil.count()) === 0, `${label}: page-load veil did not clear`);
}

async function waitForCount(locator, expected, label, timeoutMs = 6_000) {
  const deadline = Date.now() + timeoutMs;
  let actual = await locator.count();

  while (Date.now() < deadline) {
    actual = await locator.count();
    if (actual === expected) return;
    await new Promise((resolve) => setTimeout(resolve, 90));
  }

  throw new Error(`${label}: found ${actual}, expected ${expected}`);
}

async function waitForVisibleText(locator, text, label, timeoutMs = 8_000) {
  const deadline = Date.now() + timeoutMs;
  let current = "";

  while (Date.now() < deadline) {
    current = (await locator.textContent().catch(() => "")) || "";
    if (current.includes(text) && (await locator.isVisible().catch(() => false))) return;
    await new Promise((resolve) => setTimeout(resolve, 90));
  }

  throw new Error(`${label}: expected visible text ${JSON.stringify(text)}, received ${JSON.stringify(current.slice(0, 240))}`);
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  assert(
    dimensions.document <= dimensions.viewport + 2 && dimensions.body <= dimensions.viewport + 2,
    `${label}: horizontal overflow viewport=${dimensions.viewport}, document=${dimensions.document}, body=${dimensions.body}`,
  );
}

async function assertBrokenImagesAbsent(page, label) {
  const broken = await page.locator("img").evaluateAll((images) =>
    images
      .filter((image) => image.complete && image.currentSrc && image.naturalWidth === 0)
      .map((image) => image.currentSrc),
  );
  assert(broken.length === 0, `${label}: broken images ${broken.join(", ")}`);
}

async function assertTouchTargets(locator, minimum, label) {
  const boxes = await locator.evaluateAll((nodes) =>
    nodes
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
      })
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          text: (node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100),
          width: rect.width,
          height: rect.height,
        };
      }),
  );

  for (const box of boxes) {
    assert(
      box.width >= minimum && box.height >= minimum,
      `${label}: target ${JSON.stringify(box.text)} is ${box.width.toFixed(1)}×${box.height.toFixed(1)}, minimum ${minimum}×${minimum}`,
    );
  }
}

async function visibleCount(locator) {
  return locator.evaluateAll((nodes) =>
    nodes.filter((node) => {
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    }).length,
  );
}

async function scrollTo(page, locator, label) {
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(620);
  await assertNoOverflow(page, label);
  await assertBrokenImagesAbsent(page, label);
}

async function captureViewport(page, fileName) {
  await page.waitForTimeout(180);
  await page.screenshot({
    path: path.join(OUTPUT, fileName),
    animations: "disabled",
  });
}

async function captureAt(page, locator, fileName, label) {
  await scrollTo(page, locator, label);
  await captureViewport(page, fileName);
}

async function ancestorSection(locator) {
  return locator.locator("xpath=ancestor::section[1]");
}

function posterLocator(scope, fragment) {
  return scope.locator(`img[src*="${fragment}"], img[srcset*="${fragment}"]`);
}

async function assertGeneratedPosters(page, label) {
  const scopes = {
    hero: page.locator("main section").first(),
    offerings: page.locator("#offerings"),
    desire: page.locator("#desire"),
    education: page.locator("#education"),
    health: page.locator("#health"),
    book: page.locator("#book"),
  };

  for (const spec of GENERATED_POSTERS) {
    const scope = scopes[spec.section];
    assert(scope, `${label}: unknown poster scope ${spec.section}`);
    await scrollTo(page, scope, `${label}/${spec.section}-poster`);
    const images = posterLocator(scope, spec.fragment);
    assert((await images.count()) >= 1, `${label}: generated poster ${spec.fragment} is missing from ${spec.section}`);
  }
}

async function auditServicesViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const diagnostics = attachDiagnostics(page);
  const label = `services/${viewport.name}`;

  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page, label);

  assert((await page.title()).includes("Services"), `${label}: incorrect page title`);
  const h1 = page.getByRole("heading", { level: 1 }).first();
  await h1.waitFor({ state: "visible", timeout: 8_000 });
  assert(
    ((await h1.textContent()) || "").includes("The work begins wherever recognition is breaking down"),
    `${label}: Services proposition is missing`,
  );
  const hero = page.locator("main section").first();
  const heroText = (await hero.textContent()) || "";
  assert(heroText.includes("0.71%") && heroText.includes("2.81%"), `${label}: proof is missing from the opening scene`);
  await assertNoOverflow(page, `${label}/opening`);
  const heroBox = await hero.boundingBox();
  assert(
    heroBox && heroBox.height >= viewport.height - 2,
    `${label}: opening scene is ${heroBox?.height ?? 0}px tall for a ${viewport.height}px viewport`,
  );

  for (const id of SECTION_IDS) {
    assert((await page.locator(`#${id}`).count()) === 1, `${label}: #${id} is missing or duplicated`);
  }

  const jumpNav = page.locator('nav[aria-label="Jump to section"]');
  assert((await visibleCount(jumpNav)) === 1, `${label}: exactly one section guide should be visible near the opening`);

  if (viewport.screenshots) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(320);
    await captureViewport(page, `services-${viewport.name}-opening.png`);
  }

  // Situation: the visitor can place themselves, the state is
  // accessible, and the choice reveals the real package value.
  const situation = page.locator("#situation");
  await scrollTo(page, situation, `${label}/situation`);
  const situationButtons = situation.locator('button[aria-pressed]');
  await waitForCount(situationButtons, 3, `${label}: situation choices`);
  await assertTouchTargets(situationButtons, 40, `${label}: situation choices`);
  const ideaChoice = situation.getByRole("button", { name: /I am beginning with an idea/i }).first();
  await ideaChoice.click();
  assert((await ideaChoice.getAttribute("aria-pressed")) === "true", `${label}: situation choice did not become pressed`);
  await waitForVisibleText(situation, "Foundation", `${label}: situation recommendation`);
  assert((await situation.getByRole("link", { name: /See the full package/i }).count()) === 1, `${label}: situation-to-package path is missing`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-situation.png`);

  // Offerings: all six disciplines remain visible and the original
  // terrain film has a complete reduced-motion frame.
  const offerings = page.locator("#offerings");
  await scrollTo(page, offerings, `${label}/offerings`);
  const offeringCards = offerings.locator(".spotlight-card");
  await waitForCount(offeringCards, 6, `${label}: offerings`);
  const offeringColors = await offeringCards.evaluateAll((nodes) =>
    nodes.map((node) => node.style.getPropertyValue("--card-color").trim()),
  );
  assert(
    offeringColors.length === 6 && offeringColors.every(Boolean),
    `${label}: one or more offering rows have no discipline accent ${JSON.stringify(offeringColors)}`,
  );
  for (const service of [
    "Brand Strategy & Identity",
    "Content Strategy",
    "Social Media Marketing",
    "Website Development",
    "Content Creation",
    "Marketing Strategy",
  ]) {
    assert(((await offerings.textContent()) || "").includes(service), `${label}: offering ${service} is missing`);
  }
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-offerings.png`);

  // Package decision: select a real scope, require an accessible pressed
  // state, then prove the side-by-side comparison is functional.
  const desire = page.locator("#desire");
  await scrollTo(page, desire, `${label}/desire`);
  const packageCards = desire
    .locator("button")
    .filter({ hasText: /Starting with an idea|Feeling unclear or inconsistent|Needing ongoing consistency/ });
  await waitForCount(packageCards, 3, `${label}: package cards`);
  await assertTouchTargets(packageCards, 40, `${label}: package cards`);
  const unclearChoice = desire.locator("button").filter({ hasText: "Feeling unclear or inconsistent" }).first();
  await unclearChoice.click();
  assert(
    (await unclearChoice.getAttribute("aria-pressed")) === "true",
    `${label}: package cards do not expose their selected state with aria-pressed`,
  );
  await waitForVisibleText(desire, "Full Brand System", `${label}: package recommendation`);
  await waitForVisibleText(desire, "Projects begin at", `${label}: package price framing`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-package-recommendation.png`);

  const compareButton = desire.getByRole("button", { name: "Compare all three side by side", exact: true });
  await compareButton.click();
  assert((await compareButton.getAttribute("aria-pressed")) === "true", `${label}: comparison did not expose its pressed state`);
  for (const name of ["Foundation", "Full Brand System", "Brand Partnership"]) {
    assert((await desire.getByRole("link", { name: new RegExp(`Start with ${name}`, "i") }).count()) === 1, `${label}: comparison is missing ${name}`);
  }
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-package-comparison.png`);

  const verifiedHeading = page.getByRole("heading", { level: 2, name: /eight weeks of exactly this work/i }).first();
  const verifiedSection = await ancestorSection(verifiedHeading);
  await scrollTo(page, verifiedSection, `${label}/verified-outcome`);
  const verifiedText = (await verifiedSection.textContent()) || "";
  assert(verifiedText.includes("104%") && verifiedText.includes("The decision"), `${label}: verified outcome is incomplete`);
  assert((await verifiedSection.getByRole("link", { name: /See the full decision trail/i }).count()) === 1, `${label}: proof does not connect to its case study`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-verified-outcome.png`);

  const authority = page.locator("#authority");
  await captureAt(
    page,
    authority,
    `services-${viewport.name}-authority.png`,
    `${label}/authority`,
  ).catch((error) => {
    if (viewport.screenshots) throw error;
  });
  const authorityText = (await authority.textContent()) || "";
  for (const layer of ["Foundation", "Experience", "Expression", "Voice", "Presence"]) {
    assert(authorityText.includes(layer), `${label}: authority layer ${layer} is missing`);
  }

  const stakesHeading = page.getByRole("heading", { level: 2, name: /What weak branding actually costs/i }).first();
  const stakesSection = await ancestorSection(stakesHeading);
  await scrollTo(page, stakesSection, `${label}/stakes`);
  const stakesText = (await stakesSection.textContent()) || "";
  assert(stakesText.includes("Positioned generically") && stakesText.includes("Positioned distinctly"), `${label}: stakes comparison is incomplete`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-stakes.png`);

  // Education: all four rungs are complete under reduced motion and can
  // still be inspected through a real expanded state.
  const education = page.locator("#education");
  await scrollTo(page, education, `${label}/education`);
  const rungButtons = education.locator('button[aria-expanded]');
  await waitForCount(rungButtons, 4, `${label}: perception rungs`);
  await assertTouchTargets(rungButtons, 40, `${label}: perception rungs`);
  const remembered = education.locator("button").filter({ hasText: "Remembered" }).first();
  await remembered.click();
  assert((await remembered.getAttribute("aria-expanded")) === "true", `${label}: perception rung did not expand`);
  await waitForVisibleText(education, "The brand comes to mind unprompted", `${label}: perception implication`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-education.png`);

  // Deliverables: every real item is reachable, filters are touch-safe,
  // and selecting one changes the practical explanation panel.
  const deliverablesHeading = page.getByRole("heading", { level: 2, name: "What you actually leave with.", exact: true });
  const deliverablesSection = await ancestorSection(deliverablesHeading);
  await scrollTo(page, deliverablesSection, `${label}/deliverables`);
  const scopeFilters = deliverablesSection.getByRole("group", { name: "Filter by scope group" }).getByRole("button");
  await waitForCount(scopeFilters, 6, `${label}: deliverable filters`);
  await assertTouchTargets(scopeFilters, 40, `${label}: deliverable filters`);
  const deliverableButtons = deliverablesSection.locator('ul[aria-label="Deliverables"] button');
  await waitForCount(deliverableButtons, 14, `${label}: deliverables`);
  await assertTouchTargets(deliverableButtons, 40, `${label}: deliverables`);
  const voiceDeliverable = deliverablesSection.getByRole("button", { name: "Voice & messaging alignment", exact: true });
  await voiceDeliverable.click();
  assert((await voiceDeliverable.getAttribute("aria-pressed")) === "true", `${label}: deliverable did not become selected`);
  const deliverablePanel = deliverablesSection.locator('[aria-live="polite"]');
  for (const labelText of ["What it is", "Why it matters", "How it gets used"]) {
    await waitForVisibleText(deliverablePanel, labelText, `${label}: deliverable detail ${labelText}`);
  }
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-deliverables.png`);

  // Imagine Your Brand: two real choices must produce a complete map
  // before any form is needed.
  const imagine = page.locator("#imagine");
  await scrollTo(page, imagine, `${label}/imagine`);
  const situationStones = imagine.getByRole("group", { name: "Your situation" }).getByRole("button");
  const changeStones = imagine.getByRole("group", { name: "The change you want" }).getByRole("button");
  await waitForCount(situationStones, 6, `${label}: project-map situations`);
  await waitForCount(changeStones, 6, `${label}: project-map changes`);
  await assertTouchTargets(situationStones, 40, `${label}: project-map situations`);
  await assertTouchTargets(changeStones, 40, `${label}: project-map changes`);
  const launchStone = imagine.getByRole("button", { name: /Launching something new/i }).first();
  const positionStone = imagine.getByRole("button", { name: /A clearer position/i }).first();
  await launchStone.click();
  await positionStone.click();
  assert((await launchStone.getAttribute("aria-pressed")) === "true", `${label}: project-map situation is not pressed`);
  assert((await positionStone.getAttribute("aria-pressed")) === "true", `${label}: project-map change is not pressed`);
  const projectMap = imagine.locator('[aria-live="polite"]');
  await waitForVisibleText(projectMap, "The path that fits", `${label}: project map`);
  assert(
    /Foundation|Full Brand System|Brand Partnership/.test((await projectMap.textContent()) || ""),
    `${label}: project map has no real package recommendation`,
  );
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-project-map.png`);

  // Health check: an answer advances visibly and Back remains available.
  const health = page.locator("#health");
  await scrollTo(page, health, `${label}/health`);
  const firstQuestionButtons = health.locator('button[aria-pressed]');
  await waitForCount(firstQuestionButtons, 4, `${label}: health-check first question`);
  await assertTouchTargets(firstQuestionButtons, 40, `${label}: health-check answers`);
  const clearPositioning = health.getByRole("button", { name: "Clear and written down somewhere", exact: true });
  await clearPositioning.click();
  await waitForVisibleText(health, "How consistent does your brand look across channels?", `${label}: health-check second question`);
  assert((await health.getByRole("button", { name: "Back", exact: true }).count()) === 1, `${label}: health check cannot go back`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-health-check.png`);

  // Audit: five useful checks are public and every consent input is
  // present before the optional unlock action.
  const audit = page.locator("#audit");
  await scrollTo(page, audit, `${label}/audit`);
  const auditItems = audit.locator("ol > li");
  await waitForCount(auditItems, 5, `${label}: public recognition checks`);
  const firstName = audit.getByLabel("First name", { exact: true });
  const email = audit.getByLabel("Email", { exact: true });
  const business = audit.getByLabel("Business name, optional", { exact: true });
  const consent = audit.getByRole("checkbox");
  assert((await firstName.getAttribute("required")) !== null, `${label}: audit first name is not required`);
  assert((await email.getAttribute("required")) !== null, `${label}: audit email is not required`);
  assert((await consent.getAttribute("required")) !== null, `${label}: audit consent is not required`);
  assert((await business.getAttribute("required")) === null, `${label}: optional business name became required`);
  const auditSubmit = audit.getByRole("button", { name: "Open the full audit", exact: true });
  await assertTouchTargets(auditSubmit, 40, `${label}: audit submit`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-recognition-audit.png`);

  // Strategy Room: the final chapter owns the full viewport, retains
  // the generated arrival frame, and starts with touch-safe choices.
  const book = page.locator("#book");
  await scrollTo(page, book, `${label}/book`);
  assert((await jumpNav.count()) === 0, `${label}: fixed section navigation remains over the Strategy Room`);
  assert((await book.getByRole("heading", { level: 2, name: /Open the strategy room/i }).count()) === 1, `${label}: Strategy Room heading is missing`);
  const strategyChoices = book.locator('button[data-strategy-control="true"]');
  await waitForCount(strategyChoices, 6, `${label}: Strategy Room opening choices`);
  await assertTouchTargets(strategyChoices, 40, `${label}: Strategy Room choices`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-strategy-room.png`);

  await assertGeneratedPosters(page, label);
  await assertBrokenImagesAbsent(page, label);
  assertDiagnosticsClean(diagnostics, label);

  await context.close();
  return {
    viewport: viewport.name,
    indexedSections: SECTION_IDS.length,
    offerings: 6,
    packageChoices: 3,
    perceptionRungs: 4,
    deliverables: 14,
    projectMapChoices: 12,
    healthQuestions: 4,
    publicAuditChecks: 5,
    strategyRoomQuestions: 3,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const viewport of VIEWPORTS) {
      results.push(await auditServicesViewport(browser, viewport));
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(OUTPUT, "services-page-audit.json"),
    JSON.stringify({ baseUrl: BASE_URL, generatedAt: new Date().toISOString(), results }, null, 2),
  );
  console.log(`Services page gate passed for ${results.length} viewports.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
