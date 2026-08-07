const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "insights-authority-audit");
const EXPECTED_MIN_GUIDES = Number(process.env.INSIGHTS_EXPECTED_MIN || "22");
const INDEX_VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "short-desktop-1280x720", width: 1280, height: 720 },
  { name: "tablet-768x1024", width: 768, height: 1024, touch: true },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pathnameFor(value) {
  try {
    return new URL(value, BASE_URL).pathname;
  } catch {
    return value;
  }
}

function expectedNetworkFailure(url, detail = "") {
  const pathname = pathnameFor(url);
  return (
    /^\/(?:videos|audio)\//i.test(pathname) ||
    /\/_vercel\/(?:insights|speed-insights)(?:\/|$)/i.test(pathname) ||
    /(?:va\.vercel-scripts\.com|vitals\.vercel-insights\.com)/i.test(url) ||
    /net::ERR_ABORTED/i.test(detail)
  );
}

function actionableConsoleError(text) {
  // Chromium's generic resource error omits the URL. Response and request
  // listeners below retain the URL and decide whether the failure is an
  // intentionally omitted media file or a real route, script, image, or CSS bug.
  return !/^Failed to load resource:/i.test(text) &&
    !/_vercel\/(insights|speed-insights)/i.test(text) &&
    !/net::ERR_ABORTED/i.test(text);
}

async function waitForPage(page) {
  await page.evaluate(() => document.fonts.ready);
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) {
    await veil.waitFor({ state: "detached", timeout: 9000 }).catch(() => {});
  }
  await page.waitForTimeout(250);
}

async function auditIndex(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: Boolean(viewport.touch),
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error" && actionableConsoleError(message.text())) {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() < 400) return;
    const url = response.url();
    if (!expectedNetworkFailure(url)) {
      errors.push(`response: ${response.status()} ${url}`);
    }
  });
  page.on("requestfailed", (request) => {
    const detail = request.failure()?.errorText || "request failed";
    const url = request.url();
    if (!expectedNetworkFailure(url, detail)) {
      errors.push(`request: ${detail} ${url}`);
    }
  });

  const response = await page.goto(`${BASE_URL}/insights`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  assert(response && response.status() < 400, `${viewport.name}: /insights returned ${response?.status()}`);
  await waitForPage(page);

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const h1s = Array.from(document.querySelectorAll("h1")).filter((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden";
    });
    const links = Array.from(document.querySelectorAll('a[href^="/insights/"]'))
      .map((node) => node.getAttribute("href"))
      .filter(
        (href) =>
          typeof href === "string" &&
          /^\/insights\/[^/]+$/.test(href) &&
          !href.endsWith(".xml"),
      );
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
    const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map((node) => node.textContent || "");
    return {
      viewportWidth: window.innerWidth,
      scrollWidth: doc.scrollWidth,
      h1Count: h1s.length,
      guideLinks: [...new Set(links)],
      canonical,
      jsonLd,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
    };
  });

  assert(metrics.scrollWidth <= metrics.viewportWidth + 2,
    `${viewport.name}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.viewportWidth}px`);
  assert(metrics.h1Count === 1, `${viewport.name}: expected one visible H1, found ${metrics.h1Count}`);
  assert(metrics.title.length >= 20 && metrics.title.length <= 75,
    `${viewport.name}: title length ${metrics.title.length} is outside 20-75`);
  assert(metrics.description.length >= 80 && metrics.description.length <= 180,
    `${viewport.name}: meta description length ${metrics.description.length} is outside 80-180`);
  assert(metrics.guideLinks.length >= EXPECTED_MIN_GUIDES,
    `${viewport.name}: expected at least ${EXPECTED_MIN_GUIDES} unique guide links, found ${metrics.guideLinks.length}`);
  assert(/insights/i.test(metrics.canonical),
    `${viewport.name}: canonical does not identify /insights (${metrics.canonical})`);
  assert(metrics.jsonLd.some((value) => /CollectionPage|ItemList|Blog/i.test(value)),
    `${viewport.name}: CollectionPage, ItemList, or Blog structured data missing`);
  assert(errors.length === 0, `${viewport.name}: browser errors:\n${errors.join("\n")}`);

  await page.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-insights-index.png`),
    fullPage: true,
  });

  await context.close();
  return {
    viewport: viewport.name,
    guideCount: metrics.guideLinks.length,
    firstLinks: metrics.guideLinks.slice(0, 8),
    title: metrics.title,
    canonical: metrics.canonical,
  };
}

async function auditArticles(browser, guideLinks) {
  const links = guideLinks.slice(0, Math.min(8, guideLinks.length));
  const results = [];

  for (const href of links) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const response = await page.goto(`${BASE_URL}${href}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    assert(response && response.status() < 400, `${href}: returned ${response?.status()}`);
    await waitForPage(page);

    const article = await page.evaluate(() => {
      const doc = document.documentElement;
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
      const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map((node) => node.textContent || "");
      const internalLinks = Array.from(document.querySelectorAll('main a[href^="/"]'))
        .map((node) => node.getAttribute("href"))
        .filter(Boolean);
      const h1 = document.querySelector("main h1");
      const body = document.querySelector("main");
      return {
        viewportWidth: window.innerWidth,
        scrollWidth: doc.scrollWidth,
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
        canonical,
        jsonLd,
        h1: (h1?.textContent || "").trim(),
        h1Count: document.querySelectorAll("main h1").length,
        bodyTextLength: (body?.textContent || "").replace(/\s+/g, " ").trim().length,
        internalLinks: [...new Set(internalLinks)],
        hasTime: Boolean(document.querySelector("time")),
      };
    });

    assert(article.scrollWidth <= article.viewportWidth + 2,
      `${href}: horizontal overflow ${article.scrollWidth}px > ${article.viewportWidth}px`);
    assert(article.h1Count === 1 && article.h1.length > 10, `${href}: missing unique article H1`);
    assert(article.title.length >= 20 && article.title.length <= 80,
      `${href}: title length ${article.title.length} is outside 20-80`);
    assert(article.description.length >= 70 && article.description.length <= 190,
      `${href}: description length ${article.description.length} is outside 70-190`);
    assert(article.canonical.includes(href), `${href}: canonical mismatch (${article.canonical})`);
    assert(article.jsonLd.some((value) => /Article|BlogPosting/i.test(value)),
      `${href}: Article or BlogPosting structured data missing`);
    assert(article.bodyTextLength >= 1200, `${href}: rendered article is unexpectedly short (${article.bodyTextLength} chars)`);
    assert(article.internalLinks.length >= 3, `${href}: fewer than three internal links`);
    assert(article.hasTime || article.jsonLd.some((value) => /datePublished/i.test(value)),
      `${href}: visible date or datePublished schema missing`);

    results.push({
      href,
      title: article.title,
      canonical: article.canonical,
      internalLinks: article.internalLinks.length,
      bodyTextLength: article.bodyTextLength,
    });
    await context.close();
  }

  return results;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const indexResults = [];
  try {
    for (const viewport of INDEX_VIEWPORTS) {
      indexResults.push(await auditIndex(browser, viewport));
    }
    const articleResults = await auditArticles(browser, indexResults[0].firstLinks);
    fs.writeFileSync(
      path.join(OUTPUT, "report.json"),
      JSON.stringify({
        commit: process.env.AUDIT_COMMIT || "local",
        generatedAt: new Date().toISOString(),
        expectedMinimumGuides: EXPECTED_MIN_GUIDES,
        indexResults,
        articleResults,
      }, null, 2),
    );
  } finally {
    await browser.close();
  }
  console.log("Insights authority gate passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
