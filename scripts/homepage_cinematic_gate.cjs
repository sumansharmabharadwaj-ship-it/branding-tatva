const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "cinematic-recovery-audit");
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "desktop-1280x800", width: 1280, height: 800 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "portrait-tablet-768x1024", width: 768, height: 1024 },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
  { name: "mobile-360x800", width: 360, height: 800, touch: true },
];

const EXPECTED_CHAPTERS = [
  "opening",
  "recognition",
  "cost",
  "foundation",
  "paths",
  "process",
  "evidence",
  "tatva",
  "studio",
  "decision",
  "invitation",
];

const EXPECTED_RENDERED_LINKS = [
  "/contact",
  "/work",
  "/about",
  "#recognition",
  "#cost",
  "#foundation",
  "#evidence",
];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function expectedMissingAsset(url) {
  return (
    /\/(videos|audio)\//i.test(url) ||
    /\/_vercel\/insights\//i.test(url) ||
    /\/_vercel\/speed-insights\//i.test(url)
  );
}

function expectedAbortedPrefetch(item) {
  return (
    /net::ERR_ABORTED/i.test(item.error) &&
    /[?&]_rsc=/.test(item.url) &&
    item.url.startsWith(BASE_URL)
  );
}

async function waitForHref(page, locator, expected, timeoutMs = 2500) {
  const deadline = Date.now() + timeoutMs;
  let actual = null;

  while (Date.now() < deadline) {
    actual = await locator.getAttribute("href");
    if (actual === expected) return actual;
    await page.waitForTimeout(90);
  }

  throw new Error(`href resolved to ${actual}, expected ${expected}`);
}

async function waitForPrelude(page, viewportName) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 9_000 });
  }
  await page.waitForTimeout(260);

  assert(
    (await page.locator("[data-page-load-veil]").count()) === 0,
    `${viewportName}: loader did not clear`,
  );
}

async function settleConsent(page, viewportName) {
  const banner = page.getByRole("dialog", { name: "Your choice about measurement" });
  if ((await banner.count()) === 0) return;

  const essentialOnly = banner.getByRole("button", { name: "Essential only" });
  assert(
    (await essentialOnly.count()) === 1,
    `${viewportName}: consent banner did not expose the essential-only choice`,
  );
  await essentialOnly.click();
  await banner.waitFor({ state: "detached", timeout: 2_500 });
}

async function auditViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "no-preference",
    hasTouch: Boolean(viewport.touch),
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedResponses = [];
  const failedRequests = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedResponses.push({ status: response.status(), url: response.url() });
    }
  });
  page.on("requestfailed", (request) => {
    failedRequests.push({
      url: request.url(),
      error: request.failure()?.errorText || "request failed",
    });
  });

  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  await waitForPrelude(page, viewport.name);
  await settleConsent(page, viewport.name);

  const chapterIds = await page
    .locator("[data-home-v4-chapter]")
    .evaluateAll((nodes) =>
      nodes
        .map((node) => node.getAttribute("data-home-v4-chapter"))
        .filter((value) => Boolean(value)),
    );

  assert(
    EXPECTED_CHAPTERS.every((id) => chapterIds.includes(id)),
    `${viewport.name}: missing V4 chapters. Found ${chapterIds.join(", ")}`,
  );
  assert(
    new Set(chapterIds).size === EXPECTED_CHAPTERS.length,
    `${viewport.name}: duplicate or unexpected V4 chapter markers: ${chapterIds.join(", ")}`,
  );

  const renderedHrefs = await page.locator("a[href]").evaluateAll((nodes) =>
    nodes
      .map((node) => node.getAttribute("href"))
      .filter((value) => Boolean(value)),
  );

  for (const href of EXPECTED_RENDERED_LINKS) {
    assert(
      renderedHrefs.includes(href),
      `${viewport.name}: rendered DOM is missing link ${href}`,
    );
  }

  for (const id of EXPECTED_CHAPTERS) {
    const section = page.locator(`[data-home-v4-chapter="${id}"]`).first();
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(540);

    const result = await section.evaluate((element) => {
      const viewportWidth = window.innerWidth;
      const documentWidth = document.documentElement.scrollWidth;
      const visibleHeadings = Array.from(
        element.querySelectorAll("h1, h2, h3, p[role='text']"),
      )
        .filter((heading) => {
          const style = window.getComputedStyle(heading);
          const rect = heading.getBoundingClientRect();
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity || "1") > 0.02 &&
            rect.width > 0 &&
            rect.height > 0
          );
        })
        .map((heading) => {
          const rect = heading.getBoundingClientRect();
          return {
            text: (heading.textContent || "").trim().slice(0, 110),
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
          };
        });

      return {
        viewportWidth,
        documentWidth,
        sectionHeight: element.getBoundingClientRect().height,
        visibleHeadings,
      };
    });

    assert(
      result.documentWidth <= result.viewportWidth + 2,
      `${viewport.name}/${id}: horizontal overflow ${result.documentWidth}px > ${result.viewportWidth}px`,
    );
    assert(
      result.sectionHeight >= Math.min(280, viewport.height * 0.45),
      `${viewport.name}/${id}: scene collapsed to ${result.sectionHeight}px`,
    );

    for (const heading of result.visibleHeadings) {
      assert(
        heading.left >= -3 && heading.right <= result.viewportWidth + 3,
        `${viewport.name}/${id}: clipped heading "${heading.text}" at ${heading.left}..${heading.right}`,
      );
      assert(
        heading.height > 8,
        `${viewport.name}/${id}: collapsed heading "${heading.text}"`,
      );
    }
  }

  const opening = page.locator('[data-home-v4-chapter="opening"]').first();
  const openingText = (await opening.textContent()) || "";
  assert(
    openingText.includes("Before your brand is seen"),
    `${viewport.name}: V4 opening proposition missing`,
  );
  assert(
    openingText.includes("Strategy before styling"),
    `${viewport.name}: opening proof is missing`,
  );

  const recognition = page.locator('[data-home-v4-chapter="recognition"]').first();
  await recognition.scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  assert(
    ((await recognition.textContent()) || "").includes("Most inconsistency begins"),
    `${viewport.name}: recognition proposition missing`,
  );

  const cost = page.locator('[data-home-v4-chapter="cost"]').first();
  await cost.scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  assert(
    ((await cost.textContent()) || "").includes("Marketing becomes expensive"),
    `${viewport.name}: hidden-cost proposition missing`,
  );

  const paths = page.locator('[data-home-v4-chapter="paths"]').first();
  await paths.scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const pathsText = (await paths.textContent()) || "";
  assert(pathsText.includes("Build the foundation"), `${viewport.name}: path one missing`);
  assert(pathsText.includes("Reposition the system"), `${viewport.name}: path two missing`);
  assert(pathsText.includes("Create consistency"), `${viewport.name}: path three missing`);

  const pathDestinations = [
    { tab: /Build the foundation/i, href: "/services#desire" },
    { tab: /Reposition the system/i, href: "/services#situation" },
    { tab: /Create consistency/i, href: "/services#offerings" },
  ];
  const activePathLink = paths.locator(".paths-cinematic__focus > a");

  for (const destination of pathDestinations) {
    await paths.getByRole("tab", { name: destination.tab }).click();
    try {
      await waitForHref(page, activePathLink, destination.href);
    } catch (error) {
      throw new Error(`${viewport.name}: ${destination.tab} ${error.message}`);
    }
  }

  const studio = page.locator('[data-home-v4-chapter="studio"]').first();
  await studio.scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const studioText = (await studio.textContent()) || "";
  assert(
    studioText.includes("One mind. Three disciplines."),
    `${viewport.name}: studio proposition missing`,
  );
  assert(
    studioText.includes("Make it usable"),
    `${viewport.name}: studio third discipline missing`,
  );

  const invitation = page.locator('[data-home-v4-chapter="invitation"]').first();
  await invitation.scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const invitationText = (await invitation.textContent()) || "";
  assert(
    invitationText.includes(
      "Some things only become visible once everything else goes quiet.",
    ),
    `${viewport.name}: invitation quote missing`,
  );

  if (!viewport.touch) {
    await opening.scrollIntoViewIfNeeded();
    await page.waitForTimeout(320);

    const guide = page.locator("[data-guided-controls]");
    assert((await guide.count()) === 1, `${viewport.name}: guided-view controls missing`);
    const guideToggle = guide.locator("button").first();
    await guideToggle.click();
    assert(
      (await guideToggle.getAttribute("aria-pressed")) === "true",
      `${viewport.name}: guided view did not start`,
    );
    await page.mouse.move(viewport.width - 80, viewport.height / 2);
    await page.mouse.wheel(0, 180);
    await page.waitForTimeout(160);
    assert(
      (await guideToggle.getAttribute("aria-pressed")) === "false",
      `${viewport.name}: manual scroll did not override guided view`,
    );
  }

  if (viewport.name === "desktop-1440x900") {
    const askTrigger = page.getByRole("button", { name: "Ask Tatva" });
    await askTrigger.click();

    const askPanel = page.getByRole("dialog", {
      name: "Ask Tatva private strategy guide",
    });
    await askPanel.waitFor({ state: "visible", timeout: 2_500 });
    await askPanel.getByRole("button", { name: "People misunderstand us" }).click();

    const strategyReply = askPanel.getByText(/The brand needs one defensible position/);
    await strategyReply.waitFor({ state: "visible", timeout: 2_500 });
    assert(
      (await askPanel.getByRole("link", { name: "Explore Foundation" }).getAttribute("href")) ===
        "#foundation",
      `${viewport.name}: Ask Tatva did not connect its diagnosis to Foundation`,
    );
    assert(
      (await askPanel.getByRole("button", { name: "What can the brand own?" }).count()) === 1,
      `${viewport.name}: Ask Tatva did not continue with a relevant prompt`,
    );

    await page.keyboard.press("Escape");
    await page.waitForTimeout(40);
    assert(
      (await askTrigger.getAttribute("aria-expanded")) === "false",
      `${viewport.name}: Ask Tatva did not close with Escape`,
    );
  }

  const clearDiagram = page.locator("#decision").first();
  const geometry = await clearDiagram.evaluate((element) => {
    const label = Array.from(element.querySelectorAll("p")).find((node) =>
      (node.textContent || "").includes("Clear enough to begin"),
    );
    if (!label) return null;
    const rect = label.getBoundingClientRect();
    const parent = label.parentElement?.getBoundingClientRect();
    return parent
      ? {
          contained:
            rect.left >= parent.left - 1 &&
            rect.right <= parent.right + 1 &&
            rect.top >= parent.top - 1 &&
            rect.bottom <= parent.bottom + 1,
        }
      : null;
  });
  assert(geometry?.contained !== false, `${viewport.name}: central decision text escapes its geometry`);

  const mediaBudget = await page.evaluate(() => ({
    playing: Array.from(document.querySelectorAll("video")).filter(
      (video) => !video.paused && !video.ended,
    ).length,
    limit: window.innerWidth < 768 ? 1 : 2,
  }));
  assert(
    mediaBudget.playing <= mediaBudget.limit,
    `${viewport.name}: ${mediaBudget.playing} videos playing; limit is ${mediaBudget.limit}`,
  );

  if (viewport.name === "desktop-1440x900" || viewport.name === "mobile-390x844") {
    await page.screenshot({
      path: path.join(OUTPUT, `${viewport.name}-full.png`),
      fullPage: true,
    });
  }

  await opening.screenshot({ path: path.join(OUTPUT, `${viewport.name}-opening.png`) });
  await paths.screenshot({ path: path.join(OUTPUT, `${viewport.name}-paths.png`) });
  await invitation.screenshot({ path: path.join(OUTPUT, `${viewport.name}-invitation.png`) });

  const actionableErrors = consoleErrors.filter(
    (error) =>
      !/^Failed to load resource:/i.test(error) &&
      !/_vercel\/(insights|speed-insights)/i.test(error) &&
      !/net::ERR_ABORTED/i.test(error),
  );
  const actionableResponses = failedResponses.filter(
    ({ url }) => !expectedMissingAsset(url),
  );
  const actionableRequests = failedRequests.filter(
    (item) => !expectedMissingAsset(item.url) && !expectedAbortedPrefetch(item),
  );

  assert(
    actionableErrors.length === 0 &&
      actionableResponses.length === 0 &&
      actionableRequests.length === 0,
    `${viewport.name}: browser/network errors:\n${[
      ...actionableErrors,
      ...actionableResponses.map(({ status, url }) => `${status} ${url}`),
      ...actionableRequests.map(({ error, url }) => `${error} ${url}`),
    ].join("\n")}`,
  );

  await context.close();
  return {
    viewport: viewport.name,
    chapters: chapterIds,
    mediaBudget,
    consoleErrors: actionableErrors,
    failedResponses: actionableResponses,
    failedRequests: actionableRequests,
  };
}

async function auditReducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);

  assert(
    (await page.locator("[data-page-load-veil]").count()) === 0,
    "reduced motion: loader should be skipped",
  );
  assert(
    (await page.locator("[data-guided-controls]").count()) === 0,
    "reduced motion: guided autoplay controls should be absent",
  );
  assert(
    (await page.locator("[data-home-v4-chapter]").count()) === EXPECTED_CHAPTERS.length,
    "reduced motion: complete scene content is missing",
  );

  const copy = (await page.locator("body").textContent()) || "";
  assert(copy.includes("Before your brand is seen"), "reduced motion: opening copy missing");
  assert(copy.includes("Build the foundation"), "reduced motion: paths content missing");

  await context.close();
  return { reducedMotion: true };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const viewport of VIEWPORTS) {
      results.push(await auditViewport(browser, viewport));
    }
    results.push(await auditReducedMotion(browser));
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(OUTPUT, "report.json"),
    JSON.stringify(
      {
        commit: process.env.AUDIT_COMMIT || "local",
        generatedAt: new Date().toISOString(),
        results,
      },
      null,
      2,
    ),
  );

  console.log(`Branding Tatva V4 gate passed for ${VIEWPORTS.length} viewports plus reduced motion.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
