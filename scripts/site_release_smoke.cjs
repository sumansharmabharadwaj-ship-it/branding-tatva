const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "site-release-audit");
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
];
const ROUTES = ["/", "/services", "/work", "/insights", "/about", "/contact"];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isExpectedBrowserNoise(text) {
  return (
    /Failed to load resource.*(mp4|webm|mp3|png|jpg|jpeg|svg|woff2?)/i.test(text) ||
    /_vercel\/(insights|speed-insights)/i.test(text) ||
    /net::ERR_ABORTED/i.test(text)
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
    if (message.type() === "error" && !isExpectedBrowserNoise(message.text())) {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

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
      insightLinks: new Set(Array.from(document.querySelectorAll('a[href^="/insights/"]')).map((node) => node.getAttribute("href"))).size,
      telephoneLinks: document.querySelectorAll('a[href="tel:+918447725381"]').length,
      whatsappLinks: document.querySelectorAll('a[href^="https://wa.me/918447725381"]').length,
      contactSchedulePath: Boolean(document.querySelector('a[href="#call"]') && document.getElementById("call")),
      contactWritePath: Boolean(document.querySelector('a[href="#write"]') && document.getElementById("write")),
      currentPhoneVisible: mainText.includes("+91 84477 25381"),
      currentDurationVisible: /\b(?:30|thirty)[ -]minutes?\b/i.test(mainText),
      staleDurationVisible: /\b(?:20|twenty)[ -]minutes?\b/i.test(mainText),
    };
  }, route);

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
  if (route === "/work") assert(result.workLinks >= 1, `${viewport.name}/work: no case-study routes found`);
  if (route === "/insights") assert(result.insightLinks >= 1, `${viewport.name}/insights: no article routes found`);
  assert(errors.length === 0, `${viewport.name}${route}: browser errors:\n${errors.join("\n")}`);

  await page.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-${route === "/" ? "home" : route.slice(1)}.png`),
    fullPage: false,
  });

  await context.close();
  return result;
}

async function firstDynamicRoute(browser, sourceRoute, selector) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const page = await context.newPage();
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
  await context.close();
  return result;
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
  const routeResults = [];
  try {
    for (const viewport of VIEWPORTS) {
      for (const route of ROUTES) {
        routeResults.push(await auditRoute(browser, viewport, route));
      }
    }
    const caseStudy = await firstDynamicRoute(browser, "/work", 'a[href^="/work/"]');
    const insight = await firstDynamicRoute(browser, "/insights", 'a[href^="/insights/"]');
    const release = await releaseFingerprint();
    fs.writeFileSync(
      path.join(OUTPUT, "report.json"),
      JSON.stringify({
        commit: process.env.AUDIT_COMMIT || "local",
        generatedAt: new Date().toISOString(),
        routeResults,
        caseStudy,
        insight,
        release,
      }, null, 2),
    );
  } finally {
    await browser.close();
  }
  console.log("Integrated Branding Tatva release smoke passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
