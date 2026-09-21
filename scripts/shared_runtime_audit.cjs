#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = (
  process.env.PREVIEW_URL ||
  "https://branding-tatva-git-august-8-isolated-suman22.vercel.app"
).replace(/\/$/, "");
const OUTPUT_DIR = path.resolve(
  process.env.AUDIT_OUTPUT_DIR || "artifacts/shared-runtime-audit",
);

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function failure(check, detail) {
  return `${check}: ${detail}`;
}

async function visibleLinkLabels(page, selector = "a[href]") {
  return page.locator(selector).evaluateAll((links) =>
    links
      .filter((link) => {
        const style = window.getComputedStyle(link);
        const rect = link.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity || 1) > 0 &&
          rect.width > 0 &&
          rect.height > 0
        );
      })
      .map((link) =>
        (
          link.getAttribute("aria-label") ||
          link.textContent ||
          ""
        )
          .replace(/\s+/g, " ")
          .trim(),
      )
      .filter(Boolean),
  );
}

async function auditDesktopNavigation(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const failures = [];
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message || String(error)));

  try {
    const response = await page.goto(`${BASE_URL}/`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    await page.locator("header").first().waitFor({ state: "visible", timeout: 15_000 });

    const before = await page.locator("header").first().boundingBox();
    const labels = await visibleLinkLabels(page, "header a[href]");
    const normalized = labels.map((label) => label.toLowerCase());
    for (const expected of ["work", "services", "about", "insights"]) {
      if (!normalized.some((label) => label.includes(expected))) {
        failures.push(failure("desktop navigation", `missing visible ${expected} link`));
      }
    }
    if (!normalized.some((label) => /book|session|call|contact/.test(label))) {
      failures.push(failure("desktop navigation", "missing a visible booking or contact action"));
    }

    await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
    await page.waitForTimeout(500);
    const after = await page.locator("header").first().boundingBox();
    const headerState = await page.locator("header").first().evaluate((header) => {
      const style = window.getComputedStyle(header);
      return {
        position: style.position,
        visibility: style.visibility,
        display: style.display,
        opacity: Number(style.opacity || 1),
      };
    });

    if (!after || headerState.display === "none" || headerState.visibility === "hidden" || headerState.opacity < 0.1) {
      failures.push(failure("desktop navigation", "header disappears after scrolling"));
    }
    if (!before || !after) {
      failures.push(failure("desktop navigation", "header geometry could not be measured"));
    }
    if (!["fixed", "sticky"].includes(headerState.position)) {
      failures.push(failure("desktop navigation", `header position is ${headerState.position}, expected fixed or sticky`));
    }
    if (pageErrors.length) {
      failures.push(failure("desktop navigation", `${pageErrors.length} uncaught page error(s)`));
    }

    return {
      status: response?.status() ?? 0,
      visibleLabels: unique(labels),
      before,
      after,
      headerState,
      pageErrors,
      failures,
      passed: failures.length === 0,
    };
  } finally {
    await context.close();
  }
}

async function auditMobileMenu(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const failures = [];

  try {
    await page.goto(`${BASE_URL}/`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    const trigger = page
      .locator(
        'header button[aria-label*="menu" i], header button[aria-controls], header button:has-text("Menu")',
      )
      .first();
    await trigger.waitFor({ state: "visible", timeout: 15_000 });
    const beforeExpanded = await trigger.getAttribute("aria-expanded");
    await trigger.click();
    await page.waitForTimeout(250);
    const afterExpanded = await trigger.getAttribute("aria-expanded");
    const menuLabels = await visibleLinkLabels(page, "header a[href], nav a[href]");
    const bodyOverflow = await page.locator("body").evaluate((body) => window.getComputedStyle(body).overflow);

    if (beforeExpanded === "true") {
      failures.push(failure("mobile menu", "menu starts expanded"));
    }
    if (afterExpanded !== "true") {
      failures.push(failure("mobile menu", `aria-expanded is ${afterExpanded || "missing"} after opening`));
    }
    if (!menuLabels.some((label) => /book|session|call|contact/i.test(label))) {
      failures.push(failure("mobile menu", "booking or contact action is not visible while open"));
    }
    if (!menuLabels.some((label) => /work/i.test(label)) || !menuLabels.some((label) => /services/i.test(label))) {
      failures.push(failure("mobile menu", "primary route links are not visible while open"));
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    const closedExpanded = await trigger.getAttribute("aria-expanded");
    if (closedExpanded === "true") {
      failures.push(failure("mobile menu", "Escape does not close the menu"));
    }

    return {
      beforeExpanded,
      afterExpanded,
      closedExpanded,
      bodyOverflow,
      visibleLabels: unique(menuLabels),
      failures,
      passed: failures.length === 0,
    };
  } finally {
    await context.close();
  }
}

async function auditReducedMotionMedia(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const failures = [];
  const routes = [];

  try {
    for (const route of ["/", "/services", "/work"]) {
      await page.goto(`${BASE_URL}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      await page.waitForTimeout(900);
      const media = await page.evaluate(() => {
        const videos = Array.from(document.querySelectorAll("video"));
        return {
          totalVideos: videos.length,
          activeVideos: videos.filter((video) => !video.paused && !video.ended).length,
          autoplayVideos: videos.filter((video) => video.autoplay).length,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        };
      });
      routes.push({ route, ...media });
      if (!media.reducedMotion) {
        failures.push(failure("reduced motion", `${route} does not detect reduced-motion preference`));
      }
      if (media.activeVideos > 1) {
        failures.push(failure("reduced motion", `${route} has ${media.activeVideos} active videos; maximum is one`));
      }
    }

    return { routes, failures, passed: failures.length === 0 };
  } finally {
    await context.close();
  }
}

async function auditContact(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const failures = [];

  try {
    await page.goto(`${BASE_URL}/contact`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    await page.locator("main").waitFor({ state: "visible", timeout: 15_000 });
    const contact = await page.evaluate(() => {
      const hrefs = Array.from(document.querySelectorAll("a[href]"), (link) => link.getAttribute("href") || "");
      const text = (document.body.innerText || "").replace(/\s+/g, " ");
      return {
        telLinks: hrefs.filter((href) => href.startsWith("tel:")),
        whatsappLinks: hrefs.filter((href) => /wa\.me|whatsapp/i.test(href)),
        hasForm: Boolean(document.querySelector("form")),
        hasCalendly: Boolean(
          document.querySelector('iframe[src*="calendly" i], a[href*="calendly" i], [data-calendly]'),
        ),
        hasThirtyMinuteCopy: /30\s*(?:minute|min)/i.test(text),
        hasPrivacyReassurance: /privacy|confidential|not shared|never shared/i.test(text),
      };
    });

    if (!contact.telLinks.some((href) => href.replace(/[^+\d]/g, "") === "+918447725381")) {
      failures.push(failure("contact", "canonical tap-to-call link is missing"));
    }
    if (!contact.whatsappLinks.some((href) => href.replace(/\D/g, "").includes("918447725381"))) {
      failures.push(failure("contact", "canonical WhatsApp link is missing"));
    }
    if (!contact.hasForm) failures.push(failure("contact", "written enquiry form is missing"));
    if (!contact.hasCalendly) failures.push(failure("contact", "Calendly booking path is missing"));
    if (!contact.hasThirtyMinuteCopy) failures.push(failure("contact", "30-minute duration is not visible"));
    if (!contact.hasPrivacyReassurance) failures.push(failure("contact", "privacy reassurance is not visible"));

    return { ...contact, failures, passed: failures.length === 0 };
  } finally {
    await context.close();
  }
}

async function auditInsights(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const failures = [];

  try {
    await page.goto(`${BASE_URL}/insights`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    const guideHrefs = unique(
      await page.locator('a[href^="/insights/"]').evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href") || "")
          .filter((href) => /^\/insights\/[a-z0-9-]+\/?$/.test(href)),
      ),
    );
    if (guideHrefs.length < 22) {
      failures.push(failure("insights", `archive exposes ${guideHrefs.length} unique guide links; expected at least 22`));
    }

    const articleHref = guideHrefs[0];
    if (articleHref) {
      await page.goto(`${BASE_URL}${articleHref}`, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      await page.locator("article, main").first().waitFor({ state: "visible", timeout: 15_000 });
      const article = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        const structured = scripts.flatMap((script) => {
          try {
            const parsed = JSON.parse(script.textContent || "null");
            return Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            return [];
          }
        });
        const types = structured.flatMap((entry) => {
          if (!entry || typeof entry !== "object") return [];
          const value = entry["@type"];
          return Array.isArray(value) ? value : [value].filter(Boolean);
        });
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
        const hrefs = Array.from(document.querySelectorAll("a[href]"), (link) => link.getAttribute("href") || "");
        return {
          canonical,
          structuredTypes: types,
          hasArticleSchema: types.includes("Article") || types.includes("BlogPosting"),
          hasBreadcrumbSchema: types.includes("BreadcrumbList"),
          hasRelatedGuide: hrefs.some((href) => /^\/insights\/[a-z0-9-]+\/?$/.test(href)),
          hasCommercialNextStep: hrefs.some((href) => ["/work", "/services", "/contact"].some((route) => href.startsWith(route))),
        };
      });
      if (!article.canonical.includes(articleHref)) {
        failures.push(failure("insights", `article canonical does not match ${articleHref}`));
      }
      if (!article.hasArticleSchema) failures.push(failure("insights", "article schema is missing"));
      if (!article.hasBreadcrumbSchema) failures.push(failure("insights", "breadcrumb schema is missing"));
      if (!article.hasRelatedGuide) failures.push(failure("insights", "related guide path is missing"));
      if (!article.hasCommercialNextStep) failures.push(failure("insights", "article has no contextual path to Work, Services, or Contact"));

      return {
        guideCount: guideHrefs.length,
        articleHref,
        article,
        failures,
        passed: failures.length === 0,
      };
    }

    return {
      guideCount: guideHrefs.length,
      articleHref: null,
      article: null,
      failures,
      passed: failures.length === 0,
    };
  } finally {
    await context.close();
  }
}

async function auditAbout(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const failures = [];

  try {
    await page.goto(`${BASE_URL}/about`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    const about = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll("img"));
      const hrefs = Array.from(document.querySelectorAll("a[href]"), (link) => link.getAttribute("href") || "");
      const text = (document.body.innerText || "").replace(/\s+/g, " ");
      return {
        hasPortrait: images.some((image) => /suman|portrait|founder|strategist/i.test(`${image.alt} ${image.src}`)),
        hasPsychology: /psychology|attention|association|memory|choice/i.test(text),
        hasLanguage: /language|framing|narrative|metaphor|tone/i.test(text),
        hasNextStep: hrefs.some((href) => ["/work", "/services", "/contact"].some((route) => href.startsWith(route))),
      };
    });

    if (!about.hasPortrait) failures.push(failure("about", "founder portrait is not discoverable"));
    if (!about.hasPsychology) failures.push(failure("about", "applied psychology is not expressed"));
    if (!about.hasLanguage) failures.push(failure("about", "applied language discipline is not expressed"));
    if (!about.hasNextStep) failures.push(failure("about", "page has no path to Work, Services, or Contact"));

    return { ...about, failures, passed: failures.length === 0 };
  } finally {
    await context.close();
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    const checks = {
      desktopNavigation: await auditDesktopNavigation(browser),
      mobileMenu: await auditMobileMenu(browser),
      reducedMotionMedia: await auditReducedMotionMedia(browser),
      contact: await auditContact(browser),
      insights: await auditInsights(browser),
      about: await auditAbout(browser),
    };
    const failures = Object.entries(checks).flatMap(([name, result]) =>
      result.failures.map((detail) => `${name}: ${detail}`),
    );
    const report = {
      result: failures.length ? "failed" : "passed",
      checkedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      checks,
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
