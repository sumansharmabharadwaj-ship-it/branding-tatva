#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = (
  process.env.PREVIEW_URL ||
  "https://branding-tatva-git-homepage-cinematic-recovery-suman22.vercel.app"
).replace(/\/$/, "");
const OUTPUT_DIR = path.resolve(
  process.env.SMOKE_OUTPUT_DIR || "artifacts/canonical-site-smoke",
);

const ROUTES = ["/", "/services", "/work", "/insights", "/about", "/contact"];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
];

function sanitizeRoute(route) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
}

async function inspectRoute(page, route, viewport) {
  const pageErrors = [];
  const consoleErrors = [];
  const onPageError = (error) => pageErrors.push(error.message || String(error));
  const onConsole = (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  };
  page.on("pageerror", onPageError);
  page.on("console", onConsole);

  const response = await page.goto(`${BASE_URL}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  await page.locator("body").waitFor({ state: "visible", timeout: 15_000 });
  await page.locator("h1").first().waitFor({ state: "attached", timeout: 15_000 });
  await page.waitForTimeout(900);

  const audit = await page.evaluate(() => {
    const visible = (element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || 1) > 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const nameFor = (element) =>
      (
        element.getAttribute("aria-label") ||
        element.getAttribute("title") ||
        element.textContent ||
        ""
      )
        .replace(/\s+/g, " ")
        .trim();

    const unnamedControls = Array.from(
      document.querySelectorAll("button, a[href], input, select, textarea"),
    )
      .filter((element) => visible(element))
      .filter((element) => {
        if (element instanceof HTMLInputElement && element.type === "hidden") return false;
        if (nameFor(element)) return false;
        if (element instanceof HTMLInputElement && element.getAttribute("placeholder")) return false;
        return true;
      })
      .slice(0, 12)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        className: String(element.className || "").slice(0, 120),
      }));

    return {
      title: document.title,
      h1Count: document.querySelectorAll("h1").length,
      mainCount: document.querySelectorAll("main").length,
      horizontalOverflow: Math.max(
        0,
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
      bodyTextLength: (document.body.innerText || "").replace(/\s+/g, " ").trim().length,
      unnamedControls,
    };
  });

  const screenshot = path.join(
    OUTPUT_DIR,
    `${sanitizeRoute(route)}-${viewport.name}.png`,
  );
  await page.screenshot({ path: screenshot, fullPage: true });

  page.off("pageerror", onPageError);
  page.off("console", onConsole);

  const status = response?.status() ?? 0;
  const failures = [];
  if (status < 200 || status >= 400) failures.push(`HTTP ${status}`);
  if (audit.h1Count !== 1) failures.push(`expected one H1, found ${audit.h1Count}`);
  if (audit.mainCount < 1) failures.push("missing main landmark");
  if (audit.horizontalOverflow > 2) {
    failures.push(`horizontal overflow ${audit.horizontalOverflow}px`);
  }
  if (audit.bodyTextLength < 120) failures.push("page body is unexpectedly sparse");
  if (audit.unnamedControls.length) {
    failures.push(`${audit.unnamedControls.length} visible controls lack an accessible name`);
  }
  if (pageErrors.length) failures.push(`${pageErrors.length} uncaught page errors`);

  return {
    route,
    viewport: viewport.name,
    status,
    finalUrl: page.url(),
    ...audit,
    pageErrors,
    consoleErrors: consoleErrors.slice(0, 20),
    screenshot,
    failures,
    passed: failures.length === 0,
  };
}

async function inspectDiscovery(context) {
  const feed = await context.request.get(`${BASE_URL}/insights/rss.xml`);
  const feedText = await feed.text();
  const legacyIndex = await context.request.get(`${BASE_URL}/blog`, {
    maxRedirects: 0,
  });
  const legacyArticle = await context.request.get(
    `${BASE_URL}/blog/brand-positioning-guide`,
    { maxRedirects: 0 },
  );

  const report = {
    feed: {
      status: feed.status(),
      contentType: feed.headers()["content-type"] || "",
      hasRssRoot: /<rss\b/.test(feedText),
      itemCount: (feedText.match(/<item>/g) || []).length,
    },
    legacyIndex: {
      status: legacyIndex.status(),
      location: legacyIndex.headers().location || "",
    },
    legacyArticle: {
      status: legacyArticle.status(),
      location: legacyArticle.headers().location || "",
    },
  };

  const failures = [];
  if (report.feed.status !== 200) failures.push(`RSS returned ${report.feed.status}`);
  if (!/application\/(?:rss\+xml|xml)/i.test(report.feed.contentType)) {
    failures.push(`RSS content type is ${report.feed.contentType || "missing"}`);
  }
  if (!report.feed.hasRssRoot || report.feed.itemCount < 22) {
    failures.push(`RSS exposes ${report.feed.itemCount} items; expected at least 22`);
  }
  if (![301, 302, 307, 308].includes(report.legacyIndex.status)) {
    failures.push(`/blog returned ${report.legacyIndex.status} instead of a redirect`);
  }
  if (![301, 302, 307, 308].includes(report.legacyArticle.status)) {
    failures.push(`/blog/[slug] returned ${report.legacyArticle.status} instead of a redirect`);
  }

  return { ...report, failures, passed: failures.length === 0 };
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: viewport.name === "mobile" ? "reduce" : "no-preference",
        colorScheme: "light",
      });
      const page = await context.newPage();
      for (const route of ROUTES) {
        results.push(await inspectRoute(page, route, viewport));
      }
      await context.close();
    }

    const discoveryContext = await browser.newContext();
    const discovery = await inspectDiscovery(discoveryContext);
    await discoveryContext.close();

    const failures = results.flatMap((result) =>
      result.failures.map((failure) => `${result.route} (${result.viewport}): ${failure}`),
    );
    failures.push(...discovery.failures.map((failure) => `discovery: ${failure}`));

    const report = {
      result: failures.length ? "failed" : "passed",
      checkedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      routes: results,
      discovery,
      failures,
    };
    fs.writeFileSync(
      path.join(OUTPUT_DIR, "report.json"),
      JSON.stringify(report, null, 2),
    );
    console.log(JSON.stringify(report, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
