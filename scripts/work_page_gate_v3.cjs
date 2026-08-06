const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "cinematic-recovery-audit");

const WORK_VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "desktop-1280x800", width: 1280, height: 800 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "portrait-tablet-768x1024", width: 768, height: 1024, touch: true },
  { name: "mobile-430x932", width: 430, height: 932, touch: true },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
  { name: "mobile-360x800", width: 360, height: 800, touch: true },
];

const CASE_VIEWPORTS = [
  { name: "case-desktop-1024x768", width: 1024, height: 768 },
  { name: "case-mobile-390x844", width: 390, height: 844, touch: true },
];

const PROJECTS = [
  { slug: "dr-haley-nutrition", title: "Dr. Haley Nutrition", hasMetrics: true },
  { slug: "myshopineurope", title: "MyShopInEurope", hasMetrics: false },
  { slug: "executive-springboard", title: "Executive Springboard", hasMetrics: false },
  { slug: "herbalcart", title: "HerbalCart", hasMetrics: false },
  { slug: "plaxonic-content-portfolio", title: "Plaxonic.com Content Portfolio", hasMetrics: true },
];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assetMayBeMissing(value = "") {
  return /\/(videos|audio)\//i.test(value) || /\/_vercel\/(insights|speed-insights)\//i.test(value);
}

function expectedAbortedPrefetch(item) {
  return /net::ERR_ABORTED/i.test(item.error) && /[?&]_rsc=/.test(item.url) && item.url.startsWith(BASE_URL);
}

function attachDiagnostics(page) {
  const diagnostics = { consoleErrors: [], failedResponses: [], failedRequests: [] };

  page.on("console", (message) => {
    if (message.type() === "error") {
      diagnostics.consoleErrors.push({ text: message.text(), url: message.location().url || "" });
    }
  });
  page.on("pageerror", (error) => diagnostics.consoleErrors.push({ text: error.message, url: "" }));
  page.on("response", (response) => {
    if (response.status() >= 400) diagnostics.failedResponses.push({ status: response.status(), url: response.url() });
  });
  page.on("requestfailed", (request) => {
    diagnostics.failedRequests.push({
      url: request.url(),
      error: request.failure()?.errorText || "request failed",
    });
  });

  return diagnostics;
}

function assertDiagnosticsClean(diagnostics, label) {
  const consoleErrors = diagnostics.consoleErrors.filter(
    (item) => !assetMayBeMissing(item.url) && !assetMayBeMissing(item.text),
  );
  const failedResponses = diagnostics.failedResponses.filter((item) => !assetMayBeMissing(item.url));
  const failedRequests = diagnostics.failedRequests.filter(
    (item) => !assetMayBeMissing(item.url) && !expectedAbortedPrefetch(item),
  );

  assert(consoleErrors.length === 0, `${label}: console errors ${JSON.stringify(consoleErrors.slice(0, 6))}`);
  assert(failedResponses.length === 0, `${label}: failed responses ${JSON.stringify(failedResponses.slice(0, 6))}`);
  assert(failedRequests.length === 0, `${label}: failed requests ${JSON.stringify(failedRequests.slice(0, 6))}`);
}

async function waitForPrelude(page, label) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) await loader.waitFor({ state: "detached", timeout: 9_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(320);
  assert((await loader.count()) === 0, `${label}: page-load veil did not clear`);
}

async function waitForCount(page, locator, expected, label, timeoutMs = 4_000) {
  const deadline = Date.now() + timeoutMs;
  let actual = await locator.count();

  while (Date.now() < deadline) {
    actual = await locator.count();
    if (actual === expected) return;
    await page.waitForTimeout(90);
  }

  throw new Error(`${label}: found ${actual}, expected ${expected}`);
}

async function waitForText(page, locator, expected, label, timeoutMs = 4_000) {
  const deadline = Date.now() + timeoutMs;
  let text = (await locator.textContent()) || "";

  while (Date.now() < deadline) {
    text = (await locator.textContent()) || "";
    if (text.includes(expected)) return text;
    await page.waitForTimeout(90);
  }

  throw new Error(`${label}: expected text "${expected}"; received "${text.slice(0, 160)}"`);
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
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        text: (node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
        width: rect.width,
        height: rect.height,
      };
    }),
  );

  for (const box of boxes) {
    assert(
      box.width >= minimum && box.height >= minimum,
      `${label}: target "${box.text}" is ${box.width.toFixed(1)}×${box.height.toFixed(1)}, minimum ${minimum}×${minimum}`,
    );
  }
}

async function captureLocator(page, locator, fileName) {
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(280);
  await locator.screenshot({ path: path.join(OUTPUT, fileName), animations: "disabled" });
}

async function auditWorkViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: Boolean(viewport.touch),
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const diagnostics = attachDiagnostics(page);
  const label = `work/${viewport.name}`;

  await page.goto(`${BASE_URL}/work`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page, label);

  assert((await page.title()).includes("Work"), `${label}: incorrect page title`);
  const h1 = page.getByRole("heading", { level: 1 }).first();
  await h1.waitFor({ state: "visible", timeout: 8_000 });
  assert(((await h1.textContent()) || "").includes("decisions are visible"), `${label}: Work proposition missing`);
  await assertNoOverflow(page, label);

  const heroTabs = page.getByRole("tab");
  await waitForCount(page, heroTabs, 5, `${label}: hero project tabs`);
  await assertTouchTargets(heroTabs, 40, `${label}: hero project tabs`);

  const heroPanel = page.locator("#hero-project-preview");
  await page.getByRole("tab", { name: /MyShopInEurope/i }).click();
  const heroText = await waitForText(page, heroPanel, "MyShopInEurope", `${label}: project-preview change`);
  assert(heroText.includes("Strategic system"), `${label}: active hero metadata did not change`);

  const filters = page.getByRole("group", { name: "Filter work by business problem" });
  const filterButtons = filters.getByRole("button");
  await waitForCount(page, filterButtons, 6, `${label}: Work filters`);
  await assertTouchTargets(filterButtons, 40, `${label}: Work filters`);

  const listItems = page.locator('#index [role="list"] [role="listitem"]');
  await filters.getByRole("button", { name: "Clarity", exact: true }).click();
  await waitForCount(page, listItems, 2, `${label}: Clarity filter result count`);
  const clarityText = (await listItems.allTextContents()).join(" ");
  assert(clarityText.includes("MyShopInEurope"), `${label}: Clarity is missing MyShopInEurope`);
  assert(clarityText.includes("HerbalCart"), `${label}: Clarity is missing HerbalCart`);
  assert(!clarityText.includes("Dr. Haley Nutrition"), `${label}: Clarity still shows Dr. Haley Nutrition`);

  const allFilter = filters.getByRole("button", { name: "All work", exact: true });
  await allFilter.click();
  await waitForCount(page, listItems, 5, `${label}: All-work result count`);
  await allFilter.focus();
  await page.keyboard.press("Tab");
  const focusedText = await page.evaluate(() => document.activeElement?.textContent?.trim() || "");
  assert(/Clarity/i.test(focusedText), `${label}: filter keyboard order is not logical`);

  const decisionButtons = page.locator('ul[aria-label="Decision artefacts"] button[aria-expanded]');
  await waitForCount(page, decisionButtons, 7, `${label}: decision fragments`);
  assert((await page.locator("#find-relevant-proof").count()) === 1, `${label}: case-study selector missing`);
  assert(
    (await page.getByRole("link", { name: /Discuss the brand problem/i }).count()) >= 1,
    `${label}: final conversion action missing`,
  );
  assert(
    (await page.getByRole("heading", { name: "Every brand is visible. Let's make yours unforgettable." }).count()) === 0,
    `${label}: generic global footer pitch duplicates the tailored Work ending`,
  );

  await page.locator('#index a[href="/work/dr-haley-nutrition"]').first().click();
  await page.waitForURL("**/work/dr-haley-nutrition", { timeout: 12_000 });
  assert(
    ((await page.getByRole("heading", { level: 1 }).first().textContent()) || "").includes("Dr. Haley Nutrition"),
    `${label}: project navigation did not reach the case study`,
  );
  await page.goBack({ waitUntil: "domcontentloaded" });
  await page.waitForURL("**/work", { timeout: 12_000 });
  await waitForPrelude(page, `${label}/back`);
  assert(
    ((await page.getByRole("heading", { level: 1 }).first().textContent()) || "").includes("decisions are visible"),
    `${label}: browser Back did not restore the Work page`,
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await assertNoOverflow(page, `${label}/after-back`);
  await assertBrokenImagesAbsent(page, label);

  if (viewport.name === "desktop-1440x900" || viewport.name === "mobile-390x844") {
    await page.screenshot({
      path: path.join(OUTPUT, `work-${viewport.name}-opening.png`),
      animations: "disabled",
    });
    await captureLocator(page, page.locator("#index"), `work-${viewport.name}-index.png`);
    await captureLocator(page, page.locator("#find-relevant-proof"), `work-${viewport.name}-selector.png`);

    await decisionButtons.first().click();
    await page.waitForTimeout(220);
    const decisionsSection = page
      .getByRole("heading", { name: "Seven decisions, kept small enough to inspect." })
      .locator("xpath=ancestor::section[1]");
    await captureLocator(page, decisionsSection, `work-${viewport.name}-decisions.png`);

    const finalHeading = page.getByRole("heading", {
      name: "Bring the part of the brand that no longer makes sense.",
    });
    const finalSection = finalHeading.locator("xpath=ancestor::section[1]");
    await captureLocator(page, finalSection, `work-${viewport.name}-final.png`);

    await finalSection.evaluate((section) => section.scrollIntoView({ block: "start", behavior: "instant" }));
    await page.waitForTimeout(520);
    const collision = await page.evaluate(() => {
      const header = document.querySelector("header");
      const heading = [...document.querySelectorAll("h2")].find((node) =>
        node.textContent?.includes("Bring the part of the brand that no longer makes sense."),
      );
      if (!header || !heading) return null;
      const headerRect = header.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      const horizontalOverlap =
        headerRect.left < headingRect.right && headerRect.right > headingRect.left;
      const verticalOverlap =
        headerRect.top < headingRect.bottom && headerRect.bottom > headingRect.top;
      return {
        horizontalOverlap,
        verticalOverlap,
        header: { top: headerRect.top, bottom: headerRect.bottom },
        heading: { top: headingRect.top, bottom: headingRect.bottom },
      };
    });
    assert(collision, `${label}: final-scene collision geometry was unavailable`);
    assert(
      !(collision.horizontalOverlap && collision.verticalOverlap),
      `${label}: fixed header overlaps final-scene heading ${JSON.stringify(collision)}`,
    );
    await page.screenshot({
      path: path.join(OUTPUT, `work-${viewport.name}-final-viewport.png`),
      animations: "disabled",
    });

    const labHeading = page.getByRole("heading", {
      name: "Concept studies: the method, demonstrated in the open.",
    });
    const labSection = labHeading.locator("xpath=ancestor::section[1]");
    const labButtons = labSection.locator('button[aria-expanded]');
    await waitForCount(page, labButtons, 4, `${label}: Lab dossiers`);
    await assertTouchTargets(labButtons, 40, `${label}: Lab dossier controls`);
    const labText = (await labSection.textContent()) || "";
    assert(labText.includes("Zero clients are implied"), `${label}: Lab honesty framing is missing`);
    await captureLocator(page, labSection, `work-${viewport.name}-lab-closed.png`);
    await labButtons.first().click();
    await page.waitForTimeout(260);
    assert((await labButtons.first().getAttribute("aria-expanded")) === "true", `${label}: Lab dossier did not open`);
    await captureLocator(page, labSection, `work-${viewport.name}-lab-open.png`);

    const studiesHeading = page.getByRole("heading", {
      name: "Lessons from brands the whole world already knows.",
    });
    const studiesSection = studiesHeading.locator("xpath=ancestor::section[1]");
    const studyButtons = studiesSection.locator('button[aria-expanded]');
    await waitForCount(page, studyButtons, 5, `${label}: independent brand studies`);
    await assertTouchTargets(studyButtons, 40, `${label}: brand-study controls`);
    const studiesText = (await studiesSection.textContent()) || "";
    assert(
      studiesText.includes("Independent dissections of the public record"),
      `${label}: independent-analysis framing is missing`,
    );
    await captureLocator(page, studiesSection, `work-${viewport.name}-studies-closed.png`);
    await studyButtons.first().click();
    await page.waitForTimeout(260);
    assert((await studyButtons.first().getAttribute("aria-expanded")) === "true", `${label}: brand study did not open`);
    await captureLocator(page, studiesSection, `work-${viewport.name}-studies-open.png`);

    const authorshipHeading = page.getByRole("heading", {
      name: "One practice. One point of view. Every decision led directly.",
    });
    const authorshipSection = authorshipHeading.locator("xpath=ancestor::section[1]");
    assert((await authorshipSection.locator('img[alt="Suman Sharma"]').count()) === 1, `${label}: founder portrait is missing`);
    await captureLocator(page, authorshipSection, `work-${viewport.name}-authorship.png`);
  }

  if (viewport.name === "mobile-360x800") {
    const header = page.locator("header");
    const soundControl = header.locator("[data-ambient-audio-toggle]");
    await waitForCount(page, soundControl, 1, `${label}: header sound control`);
    await assertTouchTargets(soundControl, 36, `${label}: header sound control`);
    await captureLocator(page, header, "work-mobile-360x800-header.png");
  }

  assertDiagnosticsClean(diagnostics, label);
  await context.close();
  return { viewport: viewport.name, heroTabs: 5, filters: 6, projects: 5, clarityResults: 2, decisionFragments: 7 };
}

async function auditCaseRoutes(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: Boolean(viewport.touch),
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const diagnostics = attachDiagnostics(page);
  const results = [];

  for (const project of PROJECTS) {
    const label = `${viewport.name}/${project.slug}`;
    await page.goto(`${BASE_URL}/work/${project.slug}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await waitForPrelude(page, label);

    const h1 = page.getByRole("heading", { level: 1 }).first();
    await h1.waitFor({ state: "visible", timeout: 8_000 });
    assert(((await h1.textContent()) || "").includes(project.title), `${label}: project H1 missing`);

    for (const id of ["result", "story", "system", "outcome-summary"]) {
      assert((await page.locator(`#${id}`).count()) === 1, `${label}: #${id} is missing`);
    }

    assert(
      (await page.getByRole("link", { name: /Discuss this brand problem/i }).count()) === 1,
      `${label}: contextual case-study CTA missing`,
    );
    assert((await page.locator('a[href^="/services#"]').count()) >= 2, `${label}: service connections missing`);
    assert((await page.locator('a[href^="/work/"]').count()) >= 2, `${label}: previous/next project navigation is incomplete`);

    const resultText = (await page.locator("#result").textContent()) || "";
    assert(resultText.includes("Evidence before explanation"), `${label}: result-first framing missing`);
    if (!project.hasMetrics) {
      assert(resultText.includes("No performance metric is claimed"), `${label}: evidence boundary is missing`);
    }

    await page.locator("#story").scrollIntoViewIfNeeded();
    await page.waitForTimeout(360);
    await assertNoOverflow(page, label);
    await assertBrokenImagesAbsent(page, label);

    if (viewport.name === "case-desktop-1024x768" && project.slug === "dr-haley-nutrition") {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: path.join(OUTPUT, "work-case-dr-haley-desktop-hero.png"),
        animations: "disabled",
      });
      await captureLocator(page, page.locator("#result"), "work-case-dr-haley-desktop-result.png");
      await captureLocator(page, page.locator("#story"), "work-case-dr-haley-desktop-story.png");
    }

    if (viewport.name === "case-mobile-390x844" && project.slug === "myshopineurope") {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: path.join(OUTPUT, "work-case-myshop-mobile-hero.png"),
        animations: "disabled",
      });
      await captureLocator(page, page.locator("#result"), "work-case-myshop-mobile-result.png");
      await captureLocator(page, page.locator("#story"), "work-case-myshop-mobile-story.png");
    }

    results.push({ route: project.slug, viewport: viewport.name });
  }

  assertDiagnosticsClean(diagnostics, viewport.name);
  await context.close();
  return results;
}

async function auditReducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const diagnostics = attachDiagnostics(page);

  await page.goto(`${BASE_URL}/work`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page, "work/reduced-motion");
  await page.getByText("Signature project", { exact: true }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);

  const mainText = (await page.locator("main").textContent()) || "";
  assert(
    mainText.includes("without autoplay or scroll-controlled grading"),
    "work/reduced-motion: static flagship fallback is missing",
  );
  assert((await page.locator("main video").count()) === 0, "work/reduced-motion: autoplaying media remains in the Work page");
  await assertNoOverflow(page, "work/reduced-motion");

  await page.goto(`${BASE_URL}/work/dr-haley-nutrition`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page, "case/reduced-motion");
  assert((await page.locator("main video").count()) === 0, "case/reduced-motion: project video did not fall back to its poster");
  assert(
    (await page.locator("#result").count()) === 1 &&
      (await page.locator("#story").count()) === 1 &&
      (await page.locator("#outcome-summary").count()) === 1,
    "case/reduced-motion: case-study content is incomplete",
  );
  await assertNoOverflow(page, "case/reduced-motion");
  await page.screenshot({
    path: path.join(OUTPUT, "work-reduced-motion-mobile.png"),
    animations: "disabled",
  });

  assertDiagnosticsClean(diagnostics, "reduced-motion");
  await context.close();
  return { viewport: "390x844", autoplayingMainVideos: 0 };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const report = {
    baseUrl: BASE_URL,
    commit: process.env.AUDIT_COMMIT || null,
    generatedAt: new Date().toISOString(),
    workViewports: [],
    caseRoutes: [],
    reducedMotion: null,
  };

  try {
    for (const viewport of WORK_VIEWPORTS) report.workViewports.push(await auditWorkViewport(browser, viewport));
    for (const viewport of CASE_VIEWPORTS) report.caseRoutes.push(...(await auditCaseRoutes(browser, viewport)));
    report.reducedMotion = await auditReducedMotion(browser);
    fs.writeFileSync(path.join(OUTPUT, "work-page-audit.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    report.failure = error instanceof Error ? error.message : String(error);
    fs.writeFileSync(path.join(OUTPUT, "work-page-audit.json"), JSON.stringify(report, null, 2));
    throw error;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
