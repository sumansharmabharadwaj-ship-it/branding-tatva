const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "insights-browser-audit");
const EXPECTED_GUIDES = Number(process.env.INSIGHTS_EXPECTED_GUIDES || "29");
const TOPICS = [
  "positioning",
  "customer-experience",
  "distinctive-brand",
  "brand-messaging",
  "brand-memory",
];
const ARTICLES = [
  {
    kind: "sourced",
    slug: "brand-positioning-statement-examples-why-generic",
    expectSources: true,
  },
  {
    kind: "unsourced",
    slug: "competitor-research-brand-strategy-without-copying-category",
    expectSources: false,
  },
];
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
];

const runState = {
  commit: process.env.AUDIT_COMMIT || "local",
  generatedAt: new Date().toISOString(),
  explorer: [],
  topics: [],
  articles: [],
};

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function writeFailure(error) {
  fs.writeFileSync(
    path.join(OUTPUT, "failure.json"),
    JSON.stringify(
      {
        ...runState,
        failedAt: new Date().toISOString(),
        error: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      },
      null,
      2,
    ),
  );
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) {
    await veil.waitFor({ state: "detached", timeout: 9000 }).catch(() => {});
  }
  await page.waitForTimeout(250);
}

async function goto(page, pathname) {
  const response = await page.goto(`${BASE_URL}${pathname}`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  assert(response && response.status() < 400, `${pathname}: returned ${response?.status()}`);
  await settle(page);
}

async function explorerAudit(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: Boolean(viewport.touch),
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  try {
    await goto(page, "/insights");

    const input = page.getByPlaceholder("Search positioning, messaging, memory");
    const liveCount = page.locator('#insights-library [aria-live="polite"]');
    const articleLinks = page.locator('#insights-library a[href^="/insights/"]:not([href^="/insights/topic/"])');

    assert(await input.isVisible(), `${viewport.name}: Insights search input is not visible`);
    assert((await liveCount.textContent())?.trim() === `${EXPECTED_GUIDES} essays`,
      `${viewport.name}: expected ${EXPECTED_GUIDES} essays initially, found ${(await liveCount.textContent())?.trim()}`);
    assert(await articleLinks.count() === EXPECTED_GUIDES,
      `${viewport.name}: expected ${EXPECTED_GUIDES} article cards, found ${await articleLinks.count()}`);

    await input.fill("recall");
    await page.waitForFunction(
      ({ expected }) => {
        const text = document.querySelector('#insights-library [aria-live="polite"]')?.textContent || "";
        const count = Number.parseInt(text, 10);
        return Number.isFinite(count) && count > 0 && count < expected;
      },
      { expected: EXPECTED_GUIDES },
    );
    const searchCount = Number.parseInt((await liveCount.textContent()) || "0", 10);
    assert(searchCount > 0 && searchCount < EXPECTED_GUIDES,
      `${viewport.name}: search did not narrow the library (${searchCount})`);
    assert(await articleLinks.count() === searchCount,
      `${viewport.name}: live count and rendered search results disagree`);

    await page.getByRole("button", { name: "Clear the view" }).click();
    await page.waitForFunction(
      ({ expected }) => document.querySelectorAll('#insights-library a[href^="/insights/"]:not([href^="/insights/topic/"])').length === expected,
      { expected: EXPECTED_GUIDES },
    );

    const memoryButton = page.getByRole("button", { name: "Brand Memory" });
    await memoryButton.click();
    assert(await memoryButton.getAttribute("aria-pressed") === "true",
      `${viewport.name}: Brand Memory filter does not expose its selected state`);
    await page.waitForFunction(
      ({ expected }) => {
        const text = document.querySelector('#insights-library [aria-live="polite"]')?.textContent || "";
        const count = Number.parseInt(text, 10);
        return Number.isFinite(count) && count > 0 && count < expected;
      },
      { expected: EXPECTED_GUIDES },
    );
    const topicCount = Number.parseInt((await liveCount.textContent()) || "0", 10);
    assert(await articleLinks.count() === topicCount,
      `${viewport.name}: topic count and rendered results disagree`);

    await page.getByRole("button", { name: "Clear the view" }).click();
    await input.focus();
    assert(await input.evaluate((element) => element === document.activeElement),
      `${viewport.name}: search input cannot receive keyboard focus`);

    const width = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    assert(width.document <= width.viewport + 3,
      `${viewport.name}: Insights archive has horizontal overflow (${width.document} > ${width.viewport})`);

    const screenshot = `${viewport.name}-insights-explorer.png`;
    await page.screenshot({ path: path.join(OUTPUT, screenshot), fullPage: false });

    const result = {
      viewport: viewport.name,
      initialCount: EXPECTED_GUIDES,
      searchCount,
      brandMemoryCount: topicCount,
      horizontalOverflow: Math.max(0, width.document - width.viewport),
      screenshot,
    };
    runState.explorer.push(result);
    return result;
  } finally {
    await context.close();
  }
}

async function topicAudit(browser, topicSlug) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const pathname = `/insights/topic/${topicSlug}`;

  try {
    await goto(page, pathname);
    const result = await page.evaluate((route) => {
      const articleLinks = Array.from(document.querySelectorAll('main a[href^="/insights/"]'))
        .map((node) => node.getAttribute("href") || "")
        .filter((href) => /^\/insights\/[^/]+$/.test(href) && !href.endsWith(".xml"));
      return {
        route,
        h1Count: document.querySelectorAll("main h1").length,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
        articleCount: new Set(articleLinks).size,
        viewportWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
      };
    }, pathname);

    assert(result.h1Count === 1, `${pathname}: expected one H1, found ${result.h1Count}`);
    assert(result.canonical.includes(pathname), `${pathname}: canonical mismatch (${result.canonical})`);
    assert(result.articleCount > 0, `${pathname}: no article links found`);
    assert(result.documentWidth <= result.viewportWidth + 3,
      `${pathname}: horizontal overflow ${result.documentWidth} > ${result.viewportWidth}`);
    runState.topics.push(result);
    return result;
  } finally {
    await context.close();
  }
}

async function articleAudit(browser, article, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: Boolean(viewport.touch),
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const pathname = `/insights/${article.slug}`;

  try {
    await goto(page, pathname);

    const result = await page.evaluate(({ route, expectSources }) => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      const parsed = scripts.flatMap((script) => {
        try {
          const value = JSON.parse(script.textContent || "null");
          return value ? [value] : [];
        } catch {
          return [];
        }
      });
      const graph = parsed.flatMap((value) => Array.isArray(value?.["@graph"]) ? value["@graph"] : [value]);
      const posting = graph.find((value) => value?.["@type"] === "BlogPosting");
      const breadcrumb = graph.find((value) => value?.["@type"] === "BreadcrumbList");
      const faq = graph.find((value) => value?.["@type"] === "FAQPage");
      const sourceLinks = Array.from(document.querySelectorAll("#research-sources a[target='_blank']"));
      const relatedLinks = Array.from(document.querySelectorAll('main a[href^="/insights/"]'))
        .map((node) => node.getAttribute("href") || "")
        .filter((href) => /^\/insights\/[^/]+$/.test(href) && href !== route);
      const visible = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
      };
      const robots = [
        document.querySelector('meta[name="robots"]')?.getAttribute("content") || "",
        document.querySelector('meta[name="googlebot"]')?.getAttribute("content") || "",
      ].filter(Boolean).join(", ");

      return {
        route,
        expectSources,
        h1Count: document.querySelectorAll("main h1").length,
        h1Visible: visible("main h1"),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content") || "",
        ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute("content") || "",
        ogType: document.querySelector('meta[property="og:type"]')?.getAttribute("content") || "",
        twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content") || "",
        twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute("content") || "",
        breadcrumbNavLinks: document.querySelectorAll('nav[aria-label="Breadcrumb"] a').length,
        postingPresent: Boolean(posting),
        postingAuthor: posting?.author?.name || "",
        postingPublisherId: posting?.publisher?.["@id"] || "",
        citationCount: Array.isArray(posting?.citation) ? posting.citation.length : 0,
        breadcrumbSchemaItems: Array.isArray(breadcrumb?.itemListElement) ? breadcrumb.itemListElement.length : 0,
        faqSchemaItems: Array.isArray(faq?.mainEntity) ? faq.mainEntity.length : 0,
        sourceSectionPresent: Boolean(document.getElementById("research-sources")),
        sourceLinkCount: sourceLinks.length,
        sourceLinksValid: sourceLinks.every((link) => {
          const href = link.getAttribute("href") || "";
          const rel = link.getAttribute("rel") || "";
          return /^https:\/\//.test(href) && rel.includes("noopener") && rel.includes("noreferrer");
        }),
        relatedLinkCount: new Set(relatedLinks).size,
        faqDetailsCount: document.querySelectorAll("#frequent-questions details").length,
        robots,
        viewportWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
      };
    }, { route: pathname, expectSources: article.expectSources });

    assert(result.h1Count === 1 && result.h1Visible,
      `${viewport.name}${pathname}: one visible H1 was not rendered`);
    assert(result.canonical.includes(pathname),
      `${viewport.name}${pathname}: canonical mismatch (${result.canonical})`);
    assert(result.ogTitle.length >= 20 && result.ogDescription.length >= 70 && result.ogType === "article",
      `${viewport.name}${pathname}: Open Graph article metadata is incomplete`);
    assert(result.twitterCard === "summary_large_image" && result.twitterTitle.length >= 20,
      `${viewport.name}${pathname}: Twitter metadata is incomplete`);
    assert(result.breadcrumbNavLinks >= 3 && result.breadcrumbSchemaItems >= 4,
      `${viewport.name}${pathname}: breadcrumb navigation or schema is incomplete`);
    assert(result.postingPresent && result.postingAuthor === "Suman Sharma" && result.postingPublisherId.includes("#organization"),
      `${viewport.name}${pathname}: BlogPosting author or publisher schema is incomplete`);
    assert(result.faqDetailsCount > 0 && result.faqSchemaItems === result.faqDetailsCount,
      `${viewport.name}${pathname}: FAQ markup and rendered questions disagree`);
    assert(result.relatedLinkCount > 0,
      `${viewport.name}${pathname}: related-reading links are missing`);
    assert(/index/i.test(result.robots) && /follow/i.test(result.robots) && /max-image-preview:large/i.test(result.robots),
      `${viewport.name}${pathname}: Googlebot preview/index directives are incomplete (${result.robots})`);
    assert(result.documentWidth <= result.viewportWidth + 3,
      `${viewport.name}${pathname}: horizontal overflow ${result.documentWidth} > ${result.viewportWidth}`);

    if (article.expectSources) {
      assert(result.sourceSectionPresent && result.sourceLinkCount > 0,
        `${viewport.name}${pathname}: visible Research sources are missing`);
      assert(result.sourceLinksValid,
        `${viewport.name}${pathname}: source links are missing secure external-link attributes`);
      assert(result.citationCount === result.sourceLinkCount,
        `${viewport.name}${pathname}: structured citations (${result.citationCount}) do not match visible source links (${result.sourceLinkCount})`);
    } else {
      assert(!result.sourceSectionPresent && result.sourceLinkCount === 0 && result.citationCount === 0,
        `${viewport.name}${pathname}: unsourced guide exposes invented source or citation markup`);
    }

    const firstFaq = page.locator("#frequent-questions details").first();
    const firstSummary = firstFaq.locator("summary");
    await firstSummary.focus();
    await page.keyboard.press("Enter");
    assert(await firstFaq.getAttribute("open") !== null,
      `${viewport.name}${pathname}: FAQ cannot be opened from the keyboard`);

    const screenshot = `${viewport.name}-${article.kind}-${article.slug}.png`;
    await page.screenshot({ path: path.join(OUTPUT, screenshot), fullPage: false });
    const audited = { ...result, kind: article.kind, viewport: viewport.name, screenshot };
    runState.articles.push(audited);
    return audited;
  } finally {
    await context.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of VIEWPORTS) {
      await explorerAudit(browser, viewport);
    }
    for (const topic of TOPICS) {
      await topicAudit(browser, topic);
    }
    for (const article of ARTICLES) {
      for (const viewport of VIEWPORTS) {
        await articleAudit(browser, article, viewport);
      }
    }
    fs.writeFileSync(path.join(OUTPUT, "report.json"), JSON.stringify(runState, null, 2));
  } finally {
    await browser.close();
  }
  console.log(
    `Insights browser gate passed: ${EXPECTED_GUIDES} guides, ${TOPICS.length} topics, responsive sourced/unsourced articles, search, filters, metadata, schema, keyboard FAQ, and reduced motion.`,
  );
})().catch((error) => {
  writeFailure(error);
  console.error(error);
  process.exit(1);
});
