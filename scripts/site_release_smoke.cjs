const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "site-release-audit");
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
];
const FALLBACK_ROUTES = [
  "/",
  "/about",
  "/services",
  "/insights",
  "/contact",
  "/blog",
  "/glossary",
  "/editorial-policy",
  "/privacy",
  "/terms",
];
const RUN_STATE = {
  commit: process.env.AUDIT_COMMIT || "local",
  generatedAt: new Date().toISOString(),
  routeResults: [],
  routeManifest: [],
  caseStudy: null,
  insight: null,
  release: null,
};

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

function evidenceName(route) {
  if (route === "/") return "home";
  return route.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-");
}

async function discoverPublicRoutes() {
  const response = await fetch(`${BASE_URL}/sitemap.xml`, { cache: "no-store" });
  if (!response.ok) return FALLBACK_ROUTES;

  const xml = await response.text();
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)]
    .map((match) => pathnameFor(match[1]))
    .filter((route) => route.startsWith("/") && !route.startsWith("/api/") && !route.startsWith("/qa/"));
  return routes.length ? [...new Set([...FALLBACK_ROUTES, ...routes])].sort() : FALLBACK_ROUTES;
}

function isExpectedNetworkFailure(url, detail = "") {
  const pathname = pathnameFor(url);
  return (
    /^\/(?:videos|audio)\//i.test(pathname) ||
    /\/_vercel\/(?:insights|speed-insights)(?:\/|$)/i.test(pathname) ||
    /(?:va\.vercel-scripts\.com|vitals\.vercel-insights\.com)/i.test(url) ||
    /net::ERR_ABORTED/i.test(detail)
  );
}

function isExpectedBrowserNoise(text) {
  return (
    /^Failed to load resource:/i.test(text) ||
    /_vercel\/(?:insights|speed-insights)/i.test(text) ||
    /net::ERR_ABORTED/i.test(text)
  );
}

function writeFailureReport(error) {
  fs.writeFileSync(
    path.join(OUTPUT, "failure.json"),
    JSON.stringify(
      {
        ...RUN_STATE,
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
  await page.waitForTimeout(300);
}

async function auditRoute(browser, viewport, route) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: Boolean(viewport.touch),
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];

  page.on("console", (message) => {
    const text = message.text();
    if (message.type() === "error" && !isExpectedBrowserNoise(text)) {
      errors.push(`console: ${text}`);
    }
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() < 400) return;
    const url = response.url();
    if (!isExpectedNetworkFailure(url)) {
      errors.push(`response: ${response.status()} ${url}`);
    }
  });
  page.on("requestfailed", (request) => {
    const detail = request.failure()?.errorText || "request failed";
    const url = request.url();
    if (!isExpectedNetworkFailure(url, detail)) {
      errors.push(`request: ${detail} ${url}`);
    }
  });

  try {
    const response = await page.goto(`${BASE_URL}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    assert(response && response.status() < 400, `${viewport.name}${route}: returned ${response?.status()}`);
    await settle(page);

    const result = await page.evaluate((currentRoute) => {
      const root = document.documentElement;
      const main = document.querySelector("main");
      const visibleH1s = Array.from(document.querySelectorAll("main h1, #main-content h1")).filter((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
      });
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
      const description = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
      const focusables = main
        ? Array.from(main.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'))
            .filter((node) => {
              const rect = node.getBoundingClientRect();
              const style = getComputedStyle(node);
              return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
            }).length
        : 0;
      const mainText = (main?.textContent || "").replace(/\s+/g, " ").trim();
      const hashLinks = main
        ? Array.from(main.querySelectorAll('a[href^="#"]')).map((node) => node.getAttribute("href") || "")
        : [];
      const brokenHashLinks = hashLinks.filter((href) => {
        if (!href || href === "#") return true;
        return !document.getElementById(href.slice(1));
      });
      const articleLinks = Array.from(document.querySelectorAll('a[href^="/insights/"]'))
        .map((node) => node.getAttribute("href") || "")
        .filter((href) => /^\/insights\/[^/]+$/.test(href) && !href.endsWith(".xml"));
      const headerWordmark = document.querySelector(".site-header__wordmark");

      return {
        route: currentRoute,
        viewportWidth: window.innerWidth,
        documentWidth: root.scrollWidth,
        mainPresent: Boolean(main),
        h1Count: visibleH1s.length,
        title: document.title,
        canonical,
        description,
        skipLink: Boolean(document.querySelector('a[href="#main-content"]')),
        focusables,
        brokenHashLinks,
        contactForm: Boolean(document.querySelector('form[action], main form, #main-content form')),
        workLinks: new Set(Array.from(document.querySelectorAll('a[href^="/work/"]')).map((node) => node.getAttribute("href"))).size,
        insightLinks: new Set(articleLinks).size,
        telephoneLinks: document.querySelectorAll('a[href="tel:+918447725381"]').length,
        whatsappLinks: document.querySelectorAll('a[href^="https://wa.me/918447725381"]').length,
        contactSchedulePath: Boolean(document.querySelector('a[href="#call"]') && document.getElementById("call")),
        contactWritePath: Boolean(document.querySelector('a[href="#write"]') && document.getElementById("write")),
        currentPhoneVisible: mainText.includes("+91 84477 25381"),
        currentDurationVisible: /\b(?:30|thirty)[ -]minutes?\b/i.test(mainText),
        staleDurationVisible: /\b(?:20|twenty)[ -]minutes?\b/i.test(mainText),
        headerWordmarkClipped: headerWordmark
          ? headerWordmark.scrollWidth > headerWordmark.clientWidth + 1
          : false,
      };
    }, route);

    const browserErrors = [...new Set(errors)];
    const evidencePath = path.join(OUTPUT, `${viewport.name}-${evidenceName(route)}.png`);
    await page.screenshot({ path: evidencePath, fullPage: false });

    const audited = { ...result, browserErrors, evidencePath: path.basename(evidencePath) };
    RUN_STATE.routeResults.push(audited);

    assert(result.mainPresent, `${viewport.name}${route}: main landmark missing`);
    assert(result.documentWidth <= result.viewportWidth + 3,
      `${viewport.name}${route}: horizontal overflow ${result.documentWidth}px > ${result.viewportWidth}px`);
    assert(result.h1Count === 1, `${viewport.name}${route}: expected one visible H1, found ${result.h1Count}`);
    assert(result.title.length >= 10, `${viewport.name}${route}: document title is too short`);
    assert(result.description.length >= 50, `${viewport.name}${route}: meta description is too short`);
    assert(result.skipLink, `${viewport.name}${route}: skip link missing`);
    assert(result.focusables >= 2, `${viewport.name}${route}: too few focusable destinations`);
    assert(result.brokenHashLinks.length === 0,
      `${viewport.name}${route}: broken in-page destinations ${result.brokenHashLinks.join(", ")}`);
    if (viewport.name.startsWith("mobile-")) {
      assert(!result.headerWordmarkClipped,
        `${viewport.name}${route}: header wordmark is horizontally clipped`);
    }
    if (route !== "/") {
      assert(result.canonical.includes(route), `${viewport.name}${route}: canonical mismatch (${result.canonical})`);
    }
    if (route === "/contact") {
      assert(result.contactForm, `${viewport.name}/contact: contact form missing`);
      assert(result.telephoneLinks >= 1, `${viewport.name}/contact: direct telephone link missing`);
      assert(result.whatsappLinks >= 1, `${viewport.name}/contact: direct WhatsApp link missing`);
      assert(result.contactSchedulePath, `${viewport.name}/contact: schedule path does not reach #call`);
      assert(result.contactWritePath, `${viewport.name}/contact: written-enquiry path does not reach #write`);
      assert(result.currentPhoneVisible, `${viewport.name}/contact: public phone number is not visible`);
      assert(result.currentDurationVisible, `${viewport.name}/contact: 30-minute duration is not visible`);
      assert(!result.staleDurationVisible, `${viewport.name}/contact: stale 20-minute duration is still visible`);
    }
    if (route === "/insights") assert(result.insightLinks >= 27, `${viewport.name}/insights: expected at least 27 guide routes, found ${result.insightLinks}`);
    assert(browserErrors.length === 0, `${viewport.name}${route}: browser errors:\n${browserErrors.join("\n")}`);

    return audited;
  } finally {
    await context.close();
  }
}

async function firstDynamicRoute(browser, sourceRoute, selector) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  try {
    const response = await page.goto(`${BASE_URL}${sourceRoute}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    assert(response && response.status() < 400, `${sourceRoute}: returned ${response?.status()}`);
    await settle(page);
    const href = await page.locator(selector).first().getAttribute("href");
    assert(href, `${sourceRoute}: no dynamic destination found for ${selector}`);
    const destination = await page.goto(`${BASE_URL}${href}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    assert(destination && destination.status() < 400, `${href}: returned ${destination?.status()}`);
    await settle(page);
    const result = await page.evaluate((pathName) => ({
      pathName,
      h1Count: document.querySelectorAll("main h1, #main-content h1").length,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
      bodyLength: (document.querySelector("main")?.textContent || "").replace(/\s+/g, " ").trim().length,
    }), href);
    assert(result.h1Count === 1, `${href}: expected one H1, found ${result.h1Count}`);
    assert(result.canonical.includes(href), `${href}: canonical mismatch (${result.canonical})`);
    assert(result.bodyLength >= 600, `${href}: rendered body is unexpectedly short (${result.bodyLength})`);
    return result;
  } finally {
    await context.close();
  }
}

async function releaseFingerprint() {
  const response = await fetch(`${BASE_URL}/api/release`, { cache: "no-store" });
  assert(response.ok, `/api/release returned ${response.status}`);
  const data = await response.json();
  assert(data.experience === "branding-tatva-homepage-v4", `Unexpected release experience: ${data.experience}`);
  return data;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const routes = await discoverPublicRoutes();
    RUN_STATE.routeManifest = routes;
    for (const viewport of VIEWPORTS) {
      for (const route of routes) {
        await auditRoute(browser, viewport, route);
      }
    }
    RUN_STATE.caseStudy = await firstDynamicRoute(browser, "/", 'a[href^="/work/"]');
    RUN_STATE.insight = await firstDynamicRoute(
      browser,
      "/insights",
      'a[href^="/insights/"]:not([href^="/insights/topic/"]):not([href="/insights/feed.xml"]):not([href="/insights/rss.xml"])',
    );
    RUN_STATE.release = await releaseFingerprint();
    fs.writeFileSync(path.join(OUTPUT, "report.json"), JSON.stringify(RUN_STATE, null, 2));
  } finally {
    await browser.close();
  }
  console.log("Integrated Branding Tatva release smoke passed.");
})().catch((error) => {
  writeFailureReport(error);
  console.error(error);
  process.exit(1);
});
