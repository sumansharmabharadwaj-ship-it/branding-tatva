#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const BASE_URL = (
  process.env.SEO_BASE_URL ||
  process.env.PREVIEW_URL ||
  "https://brandingtatva.com"
).replace(/\/$/, "");
const OUTPUT_DIR = path.resolve(
  process.env.SEO_OUTPUT_DIR || "artifacts/seo-metadata-runtime-gate",
);
const PRODUCTION_ORIGIN = "https://brandingtatva.com";
const SERVICE_ROUTES = ["/brand-positioning", "/brand-audit", "/brand-messaging"];
const PRIMARY_ROUTES = [
  "/",
  "/services",
  ...SERVICE_ROUTES,
  "/insights",
  "/about",
  "/contact",
];

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function discoverRepresentativeRoutes(page) {
  const routes = [];

  await page.goto(`${BASE_URL}/insights`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  routes.push(
    await page.locator('a[href^="/insights/"]').evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href") || "")
        .find((href) => /^\/insights\/[a-z0-9-]+\/?$/.test(href)),
    ),
  );

  await page.goto(`${BASE_URL}/services`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  routes.push(
    await page.locator('a[href^="/work/"]').evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href") || "")
        .find(
          (href) =>
            /^\/work\/[a-z0-9-]+\/?$/.test(href) &&
            !href.startsWith("/work/studies/"),
        ),
    ),
  );

  if (routes.some((route) => !route)) {
    throw new Error("Could not discover both an Insight guide and a project record");
  }
  return unique(routes);
}

function parseStructuredData(scripts) {
  const schemaTypes = [];
  const errors = [];
  function visit(value) {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== "object") return;
    const types = value["@type"];
    schemaTypes.push(...(Array.isArray(types) ? types : [types]).filter(Boolean));
    if (value["@graph"]) visit(value["@graph"]);
  }
  scripts.forEach((source, index) => {
    try {
      visit(JSON.parse(source));
    } catch {
      errors.push(`invalid JSON-LD in script ${index + 1}`);
    }
  });
  return { schemaTypes: unique(schemaTypes), structuredDataErrors: errors };
}

// Header directives can target individual crawlers. Preserve that scope across
// comma-separated directives without confusing max-snippet etc. with a crawler.
function googleHeaderDirectives(value) {
  let agent = "";
  const directives = [];
  for (let part of value.toLowerCase().split(",")) {
    part = part.trim();
    const prefix = part.match(/^([\w*-]+):\s*(.*)$/);
    if (prefix && !["max-snippet", "max-image-preview", "max-video-preview", "unavailable_after"].includes(prefix[1])) {
      agent = prefix[1];
      part = prefix[2];
    }
    if (!agent || agent === "*" || agent === "googlebot") directives.push(part);
  }
  return directives;
}

function validateMetadata({ route, status, finalUrl, headers = {}, metadata, baseUrl = BASE_URL }) {
  const failures = [];
  const schemaTypes = metadata.schemaTypes || [];
  if (status !== 200) failures.push(`expected HTTP 200, received ${status}`);
  const normalizedPath = (value) => value.replace(/\/$/, "") || "/";
  if (finalUrl) {
    const final = new URL(finalUrl);
    if (final.origin !== new URL(baseUrl).origin || normalizedPath(final.pathname) !== normalizedPath(route)) {
      failures.push("navigation redirected away from the expected page");
    }
  }
  failures.push(...(metadata.structuredDataErrors || []));
  if (!metadata.title || metadata.title.length < 8) failures.push("missing or weak title");
  if (!metadata.description || metadata.description.length < 40) failures.push("missing or weak description");
  if (!metadata.canonical) {
    failures.push("missing canonical");
  } else {
    try {
      const canonical = new URL(metadata.canonical);
      if (canonical.origin !== PRODUCTION_ORIGIN || canonical.username || canonical.password) {
        failures.push("canonical is not on the HTTPS production origin");
      }
      if (normalizedPath(canonical.pathname) !== normalizedPath(route) || canonical.search || canonical.hash) {
        failures.push(`canonical does not match the clean path ${route}`);
      }
    } catch {
      failures.push("invalid canonical URL");
    }
  }
  if (!metadata.ogTitle || !metadata.ogDescription || !metadata.ogImage) failures.push("incomplete Open Graph metadata");
  if (!metadata.twitterCard || !metadata.twitterTitle || !metadata.twitterDescription) failures.push("incomplete Twitter metadata");
  if (metadata.h1Count !== 1) failures.push(`expected one H1, found ${metadata.h1Count}`);
  if (/^\/insights\/[^/]+\/?$/.test(route) && !schemaTypes.some((type) => ["Article", "BlogPosting"].includes(type))) {
    failures.push("Insight guide is missing Article or BlogPosting schema");
  }
  if (route.startsWith("/work/") && !schemaTypes.some((type) => ["Article", "CreativeWork", "CaseStudy", "WebPage"].includes(type))) {
    failures.push("case study is missing applicable structured data");
  }
  if (SERVICE_ROUTES.includes(normalizedPath(route)) && !schemaTypes.includes("Service")) {
    failures.push("service page is missing Service schema");
  }
  const robotHeaders = Object.entries(headers)
    .filter(([key]) => key.toLowerCase() === "x-robots-tag")
    .flatMap(([, value]) => Array.isArray(value) ? value : [value]);
  const directives = [
    ...(metadata.robots || "").toLowerCase().split(","),
    ...(metadata.googlebot || "").toLowerCase().split(","),
    ...robotHeaders.flatMap(googleHeaderDirectives),
  ].map((value) => value.trim());
  const noindex = directives.includes("noindex") || directives.includes("none");
  const nofollow = directives.includes("nofollow") || directives.includes("none");
  const origin = new URL(baseUrl);
  if (origin.origin === PRODUCTION_ORIGIN) {
    if (noindex) failures.push("production page blocks Google indexing");
    if (nofollow) failures.push("production page blocks following links");
  } else if (origin.hostname.endsWith(".vercel.app") && !noindex) {
    failures.push("preview is not explicitly noindex");
  }
  return failures;
}

function duplicateValues(results, field) {
  const values = results.reduce((map, result) => {
    const value = result[field];
    if (!value) return map;
    map[value] ??= [];
    map[value].push(result.route);
    return map;
  }, {});

  return Object.entries(values)
    .filter(([, routes]) => routes.length > 1)
    .map(([value, routes]) => ({ value, routes }));
}

async function inspectRoute(page, route) {
  const response = await page.goto(`${BASE_URL}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  await page.locator("body").waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForTimeout(400);

  const metadata = await page.evaluate(() => {
    const attribute = (selector, name = "content") =>
      document.querySelector(selector)?.getAttribute(name) || "";
    const allMeta = (name) => Array.from(document.querySelectorAll(`meta[name="${name}" i]`))
      .map((element) => element.getAttribute("content") || "").join(",");

    return {
      title: document.title,
      description: attribute('meta[name="description"]'),
      canonical: attribute('link[rel="canonical"]', "href"),
      robots: allMeta("robots"),
      googlebot: allMeta("googlebot"),
      ogTitle: attribute('meta[property="og:title"]'),
      ogDescription: attribute('meta[property="og:description"]'),
      ogImage: attribute('meta[property="og:image"]'),
      ogUrl: attribute('meta[property="og:url"]'),
      twitterCard: attribute('meta[name="twitter:card"]'),
      twitterTitle: attribute('meta[name="twitter:title"]'),
      twitterDescription: attribute('meta[name="twitter:description"]'),
      h1Count: document.querySelectorAll("h1").length,
      structuredData: Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map((script) => script.textContent || ""),
    };
  });

  Object.assign(metadata, parseStructuredData(metadata.structuredData));
  delete metadata.structuredData;
  const headers = response?.headers() || {};
  // Scope starts again for each header field; a joined string can accidentally
  // assign a generic noindex field to the previous field's named crawler.
  headers["x-robots-tag"] = response
    ? (await response.headersArray()).filter(({ name }) => name.toLowerCase() === "x-robots-tag").map(({ value }) => value)
    : [];
  const status = response?.status() ?? 0;
  const failures = validateMetadata({ route, status, finalUrl: page.url(), headers, metadata });

  return {
    route,
    status,
    xRobotsTag: headers["x-robots-tag"],
    ...metadata,
    failures,
    passed: failures.length === 0,
  };
}

async function main() {
  const { chromium } = require("playwright");
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  try {
    const representativeRoutes = await discoverRepresentativeRoutes(page);
    const routes = unique([...PRIMARY_ROUTES, ...representativeRoutes]);
    const results = [];
    for (const route of routes) results.push(await inspectRoute(page, route));

    const duplicates = {
      titles: duplicateValues(results, "title"),
      descriptions: duplicateValues(results, "description"),
      canonicals: duplicateValues(results, "canonical"),
    };
    const failures = results.flatMap((result) =>
      result.failures.map((detail) => `${result.route}: ${detail}`),
    );
    for (const [field, groups] of Object.entries(duplicates)) {
      if (groups.length) failures.push(`duplicate ${field}: ${JSON.stringify(groups)}`);
    }

    const report = {
      result: failures.length ? "failed" : "passed",
      checkedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      results,
      duplicates,
      failures,
    };
    fs.writeFileSync(
      path.join(OUTPUT_DIR, "report.json"),
      JSON.stringify(report, null, 2),
    );
    console.log(JSON.stringify(report, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await context.close();
    await browser.close();
  }
}

module.exports = { PRIMARY_ROUTES, SERVICE_ROUTES, parseStructuredData, validateMetadata };

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
