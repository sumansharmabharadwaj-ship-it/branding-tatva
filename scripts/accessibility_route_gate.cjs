#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");

const BASE_URL = (
  process.env.PREVIEW_URL ||
  "https://branding-tatva-git-homepage-cinematic-recovery-suman22.vercel.app"
).replace(/\/$/, "");
const OUTPUT_DIR = path.resolve(
  process.env.ACCESSIBILITY_OUTPUT_DIR || "artifacts/accessibility-route-gate",
);
const PRIMARY_ROUTES = [
  "/",
  "/services",
  "/work",
  "/insights",
  "/about",
  "/contact",
];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, reducedMotion: "no-preference" },
  { name: "mobile", width: 390, height: 844, reducedMotion: "reduce" },
];
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function safeName(route) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
}

async function discoverRepresentativeRoutes(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto(`${BASE_URL}/insights`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    const insightRoute = await page
      .locator('a[href^="/insights/"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href") || "")
          .find((href) => /^\/insights\/[a-z0-9-]+\/?$/.test(href)),
      );

    await page.goto(`${BASE_URL}/work`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    const workRoute = await page
      .locator('a[href^="/work/"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href") || "")
          .find(
            (href) =>
              /^\/work\/[a-z0-9-]+\/?$/.test(href) &&
              !href.startsWith("/work/studies/"),
          ),
      );

    return unique([insightRoute, workRoute]);
  } finally {
    await context.close();
  }
}

async function auditRoute(context, route, viewport) {
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message || String(error)));

  try {
    const response = await page.goto(`${BASE_URL}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    await page.locator("body").waitFor({ state: "visible", timeout: 15_000 });
    await page.waitForTimeout(900);

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .analyze();
    const violations = results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        html: node.html,
        failureSummary: node.failureSummary,
      })),
    }));

    const screenshot = path.join(
      OUTPUT_DIR,
      `${safeName(route)}-${viewport.name}.png`,
    );
    await page.screenshot({ path: screenshot, fullPage: true });

    const status = response?.status() ?? 0;
    const failures = [];
    if (status < 200 || status >= 400) failures.push(`HTTP ${status}`);
    if (pageErrors.length) failures.push(`${pageErrors.length} uncaught page error(s)`);
    if (violations.length) {
      failures.push(
        `${violations.length} WCAG A/AA violation group(s): ${violations
          .map((violation) => violation.id)
          .join(", ")}`,
      );
    }

    return {
      route,
      viewport: viewport.name,
      status,
      finalUrl: page.url(),
      pageErrors,
      violations,
      screenshot,
      failures,
      passed: failures.length === 0,
    };
  } finally {
    await page.close();
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const routeResults = [];

  try {
    const representativeRoutes = await discoverRepresentativeRoutes(browser);
    const routes = unique([...PRIMARY_ROUTES, ...representativeRoutes]);

    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: viewport.reducedMotion,
      });
      for (const route of routes) {
        routeResults.push(await auditRoute(context, route, viewport));
      }
      await context.close();
    }

    const failures = routeResults.flatMap((result) =>
      result.failures.map(
        (detail) => `${result.route} (${result.viewport}): ${detail}`,
      ),
    );
    const report = {
      result: failures.length ? "failed" : "passed",
      checkedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      wcagTags: WCAG_TAGS,
      routes: routeResults,
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
