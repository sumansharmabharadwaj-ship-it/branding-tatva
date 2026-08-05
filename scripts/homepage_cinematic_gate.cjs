const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "cinematic-recovery-audit");
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "short-desktop-1440x700", width: 1440, height: 700 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "mobile-390x844", width: 390, height: 844 },
];

const EXPECTED_CHAPTERS = [
  "opening",
  "diagnosis",
  "evidence",
  "studio",
  "paths",
  "framework",
  "elements",
  "process",
  "questions",
  "invitation",
];

const EXPECTED_RENDERED_LINKS = [
  "/contact",
  "/work",
  "/about",
  "/services#desire",
  "/services#situation",
  "/services#offerings",
  "/services#health",
];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function auditViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(3400);

  const chapterIds = await page
    .locator("[data-home-chapter]")
    .evaluateAll((nodes) =>
      nodes
        .map((node) => node.getAttribute("data-home-chapter"))
        .filter((value) => Boolean(value)),
    );

  assert(
    EXPECTED_CHAPTERS.every((id) => chapterIds.includes(id)),
    `${viewport.name}: missing homepage chapters. Found ${chapterIds.join(", ")}`,
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
    const section = page.locator(`[data-home-chapter="${id}"]`).first();
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(430);

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
            text: (heading.textContent || "").trim().slice(0, 100),
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
      result.sectionHeight > 40,
      `${viewport.name}/${id}: section collapsed to ${result.sectionHeight}px`,
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

  const studio = page.locator('[data-home-chapter="studio"]').first();
  await studio.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const studioText = (await studio.textContent()) || "";
  assert(
    studioText.includes("One mind. Three disciplines."),
    `${viewport.name}: studio proposition missing`,
  );
  assert(
    studioText.includes("Make it usable"),
    `${viewport.name}: studio third discipline missing`,
  );

  const paths = page.locator('[data-home-chapter="paths"]').first();
  await paths.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const pathsText = (await paths.textContent()) || "";
  assert(
    pathsText.includes("The path decides what to build next"),
    `${viewport.name}: paths proposition missing`,
  );
  assert(
    pathsText.includes("Build the foundation"),
    `${viewport.name}: path one missing`,
  );
  assert(
    pathsText.includes("Reposition the system"),
    `${viewport.name}: path two missing`,
  );
  assert(
    pathsText.includes("Create consistency"),
    `${viewport.name}: path three missing`,
  );

  const invitation = page.locator('[data-home-chapter="invitation"]').first();
  await invitation.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const invitationText = (await invitation.textContent()) || "";
  assert(
    invitationText.includes(
      "Some things only become visible once everything else goes quiet.",
    ),
    `${viewport.name}: invitation quote missing`,
  );

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

  await page.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-full.png`),
    fullPage: true,
  });
  await studio.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-studio.png`),
  });
  await paths.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-paths.png`),
  });
  await invitation.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-invitation.png`),
  });

  const actionableErrors = consoleErrors.filter(
    (error) =>
      !/Failed to load resource.*(mp4|webm|mp3|jpg|png)/i.test(error) &&
      !/net::ERR_ABORTED/i.test(error),
  );
  assert(
    actionableErrors.length === 0,
    `${viewport.name}: browser errors:\n${actionableErrors.join("\n")}`,
  );

  await context.close();
  return {
    viewport: viewport.name,
    chapters: chapterIds,
    mediaBudget,
    consoleErrors: actionableErrors,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const viewport of VIEWPORTS) {
      results.push(await auditViewport(browser, viewport));
    }
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

  console.log(`Cinematic recovery gate passed for ${VIEWPORTS.length} viewports.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
