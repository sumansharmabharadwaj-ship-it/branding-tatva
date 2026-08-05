const { chromium } = require("playwright");
const fs = require("fs");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = "services-audit";

const profiles = [
  { name: "mobile-390", viewport: { width: 390, height: 844 }, captures: true },
  { name: "tablet-768", viewport: { width: 768, height: 1024 }, captures: false },
  { name: "desktop-1440", viewport: { width: 1440, height: 900 }, captures: true },
];

const expectedSections = [
  "opening",
  "diagnose",
  "capabilities",
  "packages",
  "proof",
  "process",
  "health",
  "questions",
  "book",
];

function record(failures, profile, check, detail) {
  failures.push({ profile, check, detail });
}

async function probeVideo(video) {
  return video.evaluate(async (element) => {
    const start = element.currentTime;
    let playError = null;
    try {
      await Promise.race([
        element.play(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Media play timed out after 5 seconds")), 5000),
        ),
      ]);
    } catch (error) {
      playError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 850));
    const end = element.currentTime;
    return {
      src: element.currentSrc || element.src,
      readyState: element.readyState,
      start,
      end,
      advanced: end > start + 0.05 || (element.loop && start > 0.25 && end < start - 0.25),
      playError,
      mediaError: element.error ? { code: element.error.code, message: element.error.message } : null,
    };
  });
}

async function captureSection(page, profile, id) {
  const section = page.locator(`#${id}`);
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUTPUT}/${profile}-${id}.png`, fullPage: false });
}

(async () => {
  fs.rmSync(OUTPUT, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const report = {
    generatedAt: new Date().toISOString(),
    commit: process.env.AUDIT_COMMIT || process.env.GITHUB_SHA || null,
    profiles: [],
    media: [],
    interactions: [],
    failures,
  };

  for (const profile of profiles) {
    const context = await browser.newContext({
      viewport: profile.viewport,
      deviceScaleFactor: 1,
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const consoleErrors = [];
    const pageErrors = [];
    const failedResponses = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400 && !response.url().includes("/_vercel/")) {
        failedResponses.push({ status: response.status(), url: response.url() });
      }
    });

    await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1400);

    const root = page.locator("[data-services-reframe]");
    if ((await root.count()) !== 1) {
      record(failures, profile.name, "root", "Expected exactly one Services reframe root.");
    }

    const sections = await root.locator("section[id]").evaluateAll((elements) =>
      elements.map((element) => element.id),
    );
    if (JSON.stringify(sections) !== JSON.stringify(expectedSections)) {
      record(
        failures,
        profile.name,
        "section-sequence",
        `Expected ${expectedSections.join(", ")}; received ${sections.join(", ")}`,
      );
    }

    const geometry = await page.evaluate(() => {
      const heading = document.querySelector("[data-services-reframe] h1");
      const headingRect = heading?.getBoundingClientRect();
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        headingVisible: Boolean(
          headingRect &&
            headingRect.width > 1 &&
            headingRect.height > 1 &&
            headingRect.left >= -1 &&
            headingRect.right <= window.innerWidth + 1,
        ),
        playingVideos: Array.from(document.querySelectorAll("video")).filter(
          (video) => !video.paused && !video.ended,
        ).length,
      };
    });

    if (geometry.overflow) {
      record(
        failures,
        profile.name,
        "horizontal-overflow",
        `${geometry.documentWidth}px document in ${geometry.viewportWidth}px viewport`,
      );
    }
    if (!geometry.headingVisible) {
      record(failures, profile.name, "hero-heading", "The H1 is missing, clipped, or outside the viewport.");
    }
    if (geometry.playingVideos > 2) {
      record(failures, profile.name, "video-budget", `${geometry.playingVideos} videos playing on first paint.`);
    }

    const heroVideo = page.locator("#opening video").first();
    if ((await heroVideo.count()) !== 1) {
      record(failures, profile.name, "hero-media", "Hero film is missing.");
    } else {
      const probe = await probeVideo(heroVideo);
      report.media.push({ profile: profile.name, section: "opening", ...probe });
      if (!probe.advanced || probe.mediaError || probe.playError) {
        record(failures, profile.name, "hero-media", JSON.stringify(probe));
      }
    }

    const scenarioButtons = page.getByRole("group", {
      name: "Choose the closest business situation",
    }).getByRole("button");
    const expectedRecommendations = ["Foundation", "Full Brand System", "Brand Partnership"];
    for (let index = 0; index < expectedRecommendations.length; index += 1) {
      await scenarioButtons.nth(index).click();
      await page.waitForTimeout(180);
      const heading = await page
        .locator('aside[aria-label="Recommended starting scope"] h3')
        .textContent();
      const passed = heading?.trim() === expectedRecommendations[index];
      report.interactions.push({
        profile: profile.name,
        interaction: `scenario-${index + 1}`,
        result: heading?.trim() || null,
        passed,
      });
      if (!passed) {
        record(
          failures,
          profile.name,
          `scenario-${index + 1}`,
          `Expected ${expectedRecommendations[index]}, received ${heading}`,
        );
      }
    }

    const regionSelect = page.locator("#services-region");
    await regionSelect.selectOption("in");
    await page.waitForTimeout(120);
    const indiaPrices = await page.locator("#packages article").allTextContents();
    const indiaPassed = indiaPrices.some((text) => text.includes("₹"));
    report.interactions.push({ profile: profile.name, interaction: "pricing-india", passed: indiaPassed });
    if (!indiaPassed) record(failures, profile.name, "pricing-india", "INR pricing did not render.");

    await regionSelect.selectOption("uk");
    await page.waitForTimeout(120);
    const ukPrices = await page.locator("#packages article").allTextContents();
    const ukPassed = ukPrices.some((text) => text.includes("£"));
    report.interactions.push({ profile: profile.name, interaction: "pricing-uk", passed: ukPassed });
    if (!ukPassed) record(failures, profile.name, "pricing-uk", "GBP pricing did not render.");

    const healthButtons = page.getByRole("group", { name: "Brand health statements" }).getByRole("button");
    for (let index = 0; index < 4; index += 1) await healthButtons.nth(index).click();
    await page.waitForTimeout(180);
    const healthScore = await page.locator("#health aside > div strong").first().textContent();
    const healthPassed = healthScore?.trim() === "4";
    report.interactions.push({
      profile: profile.name,
      interaction: "health-check",
      result: healthScore?.trim() || null,
      passed: healthPassed,
    });
    if (!healthPassed) {
      record(failures, profile.name, "health-check", `Expected score 4, received ${healthScore}`);
    }

    const secondQuestion = page.locator("#questions article").nth(1).getByRole("button");
    await secondQuestion.click();
    const faqPassed = (await secondQuestion.getAttribute("aria-expanded")) === "true";
    report.interactions.push({ profile: profile.name, interaction: "faq", passed: faqPassed });
    if (!faqPassed) record(failures, profile.name, "faq", "The selected question did not open.");

    const contactLinks = await page.locator('a[href^="/contact?package="]').count();
    if (contactLinks < 5) {
      record(failures, profile.name, "conversion-links", `Only ${contactLinks} contextual contact links were rendered.`);
    }

    await page.locator("#book").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    const closingVideo = page.locator("#book video").first();
    if ((await closingVideo.count()) !== 1) {
      record(failures, profile.name, "closing-media", "Closing film is missing.");
    } else {
      const probe = await probeVideo(closingVideo);
      report.media.push({ profile: profile.name, section: "book", ...probe });
      if (!probe.advanced || probe.mediaError || probe.playError) {
        record(failures, profile.name, "closing-media", JSON.stringify(probe));
      }
    }

    if (profile.captures) {
      for (const id of ["opening", "diagnose", "packages", "proof", "health", "book"]) {
        await captureSection(page, profile.name, id);
      }
    }

    if (consoleErrors.length) {
      record(failures, profile.name, "console-errors", consoleErrors.join(" | "));
    }
    if (pageErrors.length) {
      record(failures, profile.name, "page-errors", pageErrors.join(" | "));
    }
    if (failedResponses.length) {
      record(failures, profile.name, "failed-responses", JSON.stringify(failedResponses));
    }

    report.profiles.push({
      name: profile.name,
      viewport: profile.viewport,
      sections,
      geometry,
      consoleErrors,
      pageErrors,
      failedResponses,
    });

    await context.close();
  }

  // The visible form says three questions. Intercept delivery so this
  // verifies client validation and the success transition without
  // requiring a live Resend key inside CI.
  const contactContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const contactPage = await contactContext.newPage();
  contactPage.setDefaultTimeout(10000);
  await contactPage.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, requestId: "services-release-gate" }),
    });
  });
  await contactPage.goto(`${BASE_URL}/contact`, { waitUntil: "domcontentloaded" });
  await contactPage.getByLabel("Name").fill("Services QA");
  await contactPage.getByLabel("Email").fill("qa@example.com");
  await contactPage
    .getByLabel("What are you building, and what feels unclear?")
    .fill("A valid three-field enquiry used to verify that hidden optional details no longer block submission.");
  await contactPage.getByRole("button", { name: "Send enquiry" }).click();
  const success = await contactPage.getByText("Thank you, that's in.").isVisible().catch(() => false);
  report.interactions.push({ profile: "contact-mobile", interaction: "three-field-form", passed: success });
  if (!success) {
    record(failures, "contact-mobile", "three-field-form", "The visible three-field enquiry did not reach its success state.");
  }
  await contactContext.close();

  await browser.close();

  fs.writeFileSync(`${OUTPUT}/report.json`, JSON.stringify(report, null, 2));
  const markdown = [
    "# Branding Tatva Services release gate",
    "",
    `- Commit: ${report.commit || "unknown"}`,
    `- Responsive profiles: ${profiles.length}`,
    `- Expected sections: ${expectedSections.length}`,
    `- Media probes: ${report.media.length}`,
    `- Interaction probes: ${report.interactions.length}`,
    `- Failures: ${failures.length}`,
    "",
    "## Failures",
    ...(failures.length
      ? failures.map((failure) => `- ${failure.profile} / ${failure.check}: ${failure.detail}`)
      : ["- None"]),
    "",
  ].join("\n");
  fs.writeFileSync(`${OUTPUT}/summary.md`, markdown);
  console.log(markdown);

  if (failures.length) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
