#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = (
  process.env.PREVIEW_URL ||
  "https://branding-tatva-git-august-8-isolated-suman22.vercel.app"
).replace(/\/$/, "");
const OUTPUT_DIR = path.resolve(
  process.env.SEO_OUTPUT_DIR || "artifacts/seo-metadata-runtime-gate",
);
const PRODUCTION_HOST = "brandingtatva.com";
const PRIMARY_ROUTES = [
  "/",
  "/services",
  "/work",
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

  await page.goto(`${BASE_URL}/work`, {
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

  return unique(routes);
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
    const structuredData = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    ).flatMap((script) => {
      try {
        const parsed = JSON.parse(script.textContent || "null");
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    });
    const schemaTypes = structuredData.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const value = entry["@type"];
      return Array.isArray(value) ? value : [value].filter(Boolean);
    });

    return {
      title: document.title,
      description: attribute('meta[name="description"]'),
      canonical: attribute('link[rel="canonical"]', "href"),
      robots: attribute('meta[name="robots"]'),
      ogTitle: attribute('meta[property="og:title"]'),
      ogDescription: attribute('meta[property="og:description"]'),
      ogImage: attribute('meta[property="og:image"]'),
      ogUrl: attribute('meta[property="og:url"]'),
      twitterCard: attribute('meta[name="twitter:card"]'),
      twitterTitle: attribute('meta[name="twitter:title"]'),
      twitterDescription: attribute('meta[name="twitter:description"]'),
      h1Count: document.querySelectorAll("h1").length,
      schemaTypes,
    };
  });

  const headers = response?.headers() || {};
  const failures = [];
  if (!metadata.title || metadata.title.length < 8) {
    failures.push("missing or weak title");
  }
  if (!metadata.description || metadata.description.length < 40) {
    failures.push("missing or weak description");
  }
  if (!metadata.canonical) {
    failures.push("missing canonical");
  } else if (!metadata.canonical.includes(PRODUCTION_HOST)) {
    failures.push("canonical is not on the production domain");
  } else {
    const expectedPath = route === "/" ? "" : route.replace(/\/$/, "");
    try {
      const canonicalUrl = new URL(metadata.canonical);
      if (canonicalUrl.pathname.replace(/\/$/, "") !== expectedPath) {
        failures.push(
          `canonical path ${canonicalUrl.pathname} does not match ${route}`,
        );
      }
    } catch {
      failures.push("invalid canonical URL");
    }
  }
  if (!metadata.ogTitle || !metadata.ogDescription || !metadata.ogImage) {
    failures.push("incomplete Open Graph metadata");
  }
  if (
    !metadata.twitterCard ||
    !metadata.twitterTitle ||
    !metadata.twitterDescription
  ) {
    failures.push("incomplete Twitter metadata");
  }
  if (metadata.h1Count !== 1) {
    failures.push(`expected one H1, found ${metadata.h1Count}`);
  }
  if (
    route.startsWith("/insights/") &&
    !metadata.schemaTypes.some(
      (type) => type === "Article" || type === "BlogPosting",
    )
  ) {
    failures.push("Insight guide is missing Article or BlogPosting schema");
  }
  if (
    route.startsWith("/work/") &&
    !metadata.schemaTypes.some((type) =>
      ["Article", "CreativeWork", "CaseStudy", "WebPage"].includes(type),
    )
  ) {
    failures.push("case study is missing applicable structured data");
  }

  const isPreview = new URL(BASE_URL).hostname.endsWith(".vercel.app");
  const robotsDirectives = `${metadata.robots} ${headers["x-robots-tag"] || ""}`.toLowerCase();
  if (isPreview && !robotsDirectives.includes("noindex")) {
    failures.push("preview is not explicitly noindex");
  }

  return {
    route,
    status: response?.status() ?? 0,
    xRobotsTag: headers["x-robots-tag"] || "",
    ...metadata,
    failures,
    passed: failures.length === 0,
  };
}

async function main() {
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

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
