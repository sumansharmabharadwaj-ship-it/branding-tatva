const { chromium } = require("playwright");
const fs = require("fs");

const profiles = [
  { name: "mobile-320", viewport: { width: 320, height: 568 }, capture: false },
  { name: "mobile-375", viewport: { width: 375, height: 667 }, capture: false },
  { name: "mobile-390", viewport: { width: 390, height: 844 }, capture: true },
  { name: "mobile-430", viewport: { width: 430, height: 932 }, capture: false },
  { name: "tablet-768", viewport: { width: 768, height: 1024 }, capture: true },
  { name: "desktop-1024", viewport: { width: 1024, height: 768 }, capture: false },
  { name: "desktop-1280", viewport: { width: 1280, height: 800 }, capture: false },
  { name: "desktop-1440", viewport: { width: 1440, height: 900 }, capture: true },
  { name: "desktop-1920", viewport: { width: 1920, height: 1080 }, capture: false },
];

const expectedChapters = [
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

const interactionProfiles = new Set(["mobile-390", "desktop-1440"]);
const criticalFilmChapters = ["opening", "framework", "invitation"];
const analyticsRequest = (url) =>
  url.includes("/_vercel/insights") || url.includes("/_vercel/speed-insights");

async function scrollChapter(page, index) {
  const locator = page.locator("[data-home-chapter]").nth(index);
  await locator.evaluate((element) => {
    const top = window.scrollY + element.getBoundingClientRect().top;
    window.scrollTo({ top, behavior: "instant" });
  });
  await page.waitForTimeout(650);
  return locator;
}

function compact(value) {
  return value?.replace(/\s+/g, " ").trim() || null;
}

async function clickAndCompare(page, selector, panelSelector, index) {
  const buttons = page.locator(selector);
  if ((await buttons.count()) <= index) return { passed: false, detail: `${selector} missing index ${index}` };

  const before = compact(await page.locator(panelSelector).textContent());
  await buttons.nth(index).click();
  await page.waitForTimeout(420);
  const after = compact(await page.locator(panelSelector).textContent());

  return {
    passed: Boolean(before && after && before !== after),
    detail: before === after ? `${panelSelector} did not change` : null,
  };
}

(async () => {
  fs.rmSync("visual-audit-v2", { recursive: true, force: true });
  fs.mkdirSync("visual-audit-v2", { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const report = {
    generatedAt: new Date().toISOString(),
    commit: process.env.AUDIT_COMMIT || process.env.GITHUB_SHA || null,
    captures: [],
    mediaProbes: [],
    interactions: [],
    failedResponses: [],
    consoleErrors: [],
    pageErrors: [],
    failures: [],
  };

  for (const profile of profiles) {
    const context = await browser.newContext({
      viewport: profile.viewport,
      deviceScaleFactor: 1,
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();

    page.on("response", (response) => {
      if (response.status() < 400) return;
      report.failedResponses.push({
        profile: profile.name,
        status: response.status(),
        url: response.url(),
        expected: analyticsRequest(response.url()),
      });
    });

    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const text = message.text();
      report.consoleErrors.push({
        profile: profile.name,
        text,
        expected:
          text.startsWith("Failed to load resource:") ||
          text.includes("/_vercel/insights") ||
          text.includes("/_vercel/speed-insights"),
      });
    });

    page.on("pageerror", (error) => {
      report.pageErrors.push({ profile: profile.name, text: error.message });
    });

    await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1600);
    await page.waitForFunction(
      () => document.querySelectorAll("[data-home-chapter]").length === 10,
      null,
      { timeout: 10000 },
    );

    const chapters = await page.locator("[data-home-chapter]").evaluateAll((elements) =>
      elements.map((element, index) => ({
        index,
        id: element.getAttribute("data-home-chapter") || `chapter-${index + 1}`,
      })),
    );

    const ids = chapters.map((chapter) => chapter.id);
    if (JSON.stringify(ids) !== JSON.stringify(expectedChapters)) {
      report.failures.push({
        profile: profile.name,
        chapter: "document",
        type: "chapter-sequence",
        detail: `Expected ${expectedChapters.join(", ")}; received ${ids.join(", ")}`,
      });
    }

    for (const chapter of chapters) {
      await scrollChapter(page, chapter.index);
      if (profile.capture) await page.waitForTimeout(450);

      const screenshotPath = profile.capture
        ? `visual-audit-v2/${profile.name}-${String(chapter.index + 1).padStart(2, "0")}-${chapter.id}.png`
        : null;
      if (screenshotPath) await page.screenshot({ path: screenshotPath, fullPage: false });

      const state = await page.evaluate((chapterId) => {
        const chapter = document.querySelector(`[data-home-chapter="${chapterId}"]`);
        const heading = chapter?.querySelector("h1, h2, [role=heading]");
        const chapterRect = chapter?.getBoundingClientRect();
        const headingRect = heading?.getBoundingClientRect();

        const visibleButtons = chapter
          ? Array.from(chapter.querySelectorAll("button, summary, a[href]")).filter((element) => {
              if (!(element instanceof HTMLElement)) return false;
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return (
                rect.width > 1 &&
                rect.height > 1 &&
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                Number.parseFloat(style.opacity || "1") > 0.04
              );
            })
          : [];

        const unlabeledControls = visibleButtons.filter((element) => {
          const label =
            element.getAttribute("aria-label") ||
            element.getAttribute("title") ||
            element.textContent?.replace(/\s+/g, " ").trim();
          return !label;
        }).length;

        const playingVideos = Array.from(document.querySelectorAll("video")).filter(
          (video) => !video.paused && !video.ended,
        );

        return {
          horizontalOverflow:
            document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          headingMissing: !heading,
          headingOverflow: Boolean(
            headingRect &&
              (headingRect.left < -1 || headingRect.right > window.innerWidth + 1),
          ),
          headingRect: headingRect
            ? {
                left: headingRect.left,
                right: headingRect.right,
                width: headingRect.width,
                height: headingRect.height,
              }
            : null,
          chapterHeight: chapterRect?.height || 0,
          unlabeledControls,
          totalPlayingVideos: playingVideos.length,
          visibleTextLength: chapter?.textContent?.replace(/\s+/g, " ").trim().length || 0,
        };
      }, chapter.id);

      report.captures.push({
        profile: profile.name,
        chapter: chapter.id,
        path: screenshotPath,
        ...state,
      });

      if (state.horizontalOverflow) {
        report.failures.push({
          profile: profile.name,
          chapter: chapter.id,
          type: "horizontal-overflow",
          detail: `${state.documentWidth}px document inside ${state.viewportWidth}px viewport`,
        });
      }
      if (state.headingMissing) {
        report.failures.push({
          profile: profile.name,
          chapter: chapter.id,
          type: "missing-heading",
          detail: "Chapter has no h1 or h2",
        });
      }
      if (state.headingOverflow) {
        report.failures.push({
          profile: profile.name,
          chapter: chapter.id,
          type: "heading-overflow",
          detail: JSON.stringify(state.headingRect),
        });
      }
      if (state.chapterHeight < Math.min(320, profile.viewport.height * 0.4)) {
        report.failures.push({
          profile: profile.name,
          chapter: chapter.id,
          type: "collapsed-chapter",
          detail: `${Math.round(state.chapterHeight)}px high`,
        });
      }
      if (state.visibleTextLength < 30) {
        report.failures.push({
          profile: profile.name,
          chapter: chapter.id,
          type: "empty-chapter",
          detail: `${state.visibleTextLength} visible characters`,
        });
      }
      if (state.unlabeledControls > 0) {
        report.failures.push({
          profile: profile.name,
          chapter: chapter.id,
          type: "unlabeled-controls",
          detail: `${state.unlabeledControls} interactive controls have no accessible label`,
        });
      }
      if (state.totalPlayingVideos > 2) {
        report.failures.push({
          profile: profile.name,
          chapter: chapter.id,
          type: "active-video-budget",
          detail: `${state.totalPlayingVideos} videos playing`,
        });
      }
    }

    for (const chapterId of criticalFilmChapters) {
      const index = chapters.findIndex((chapter) => chapter.id === chapterId);
      if (index < 0) continue;
      const chapter = await scrollChapter(page, index);
      await page.waitForTimeout(700);
      const video = chapter.locator("video").first();

      if ((await video.count()) === 0) {
        report.failures.push({
          profile: profile.name,
          chapter: chapterId,
          type: "missing-critical-video",
          detail: "No film exists in the chapter",
        });
        continue;
      }

      const probe = await video.evaluate(async (element) => {
        const start = element.currentTime;
        let playError = null;
        try {
          await element.play();
        } catch (error) {
          playError = error instanceof Error ? error.message : String(error);
        }
        await new Promise((resolve) => setTimeout(resolve, 700));
        return {
          src: element.currentSrc || element.src,
          readyState: element.readyState,
          start,
          end: element.currentTime,
          advanced: element.currentTime > start + 0.05,
          playError,
          mediaError: element.error
            ? { code: element.error.code, message: element.error.message }
            : null,
        };
      });

      report.mediaProbes.push({ profile: profile.name, chapter: chapterId, ...probe });
      if (!probe.advanced || probe.playError || probe.mediaError) {
        report.failures.push({
          profile: profile.name,
          chapter: chapterId,
          type: "critical-video-playback",
          detail: JSON.stringify(probe),
        });
      }
    }

    if (interactionProfiles.has(profile.name)) {
      const diagnosisResult = await clickAndCompare(
        page,
        "[data-diagnosis-option]",
        ".home-reframe__diagnosis-panel",
        1,
      );
      report.interactions.push({ profile: profile.name, name: "diagnosis", ...diagnosisResult });
      if (!diagnosisResult.passed) {
        report.failures.push({
          profile: profile.name,
          chapter: "diagnosis",
          type: "interaction",
          detail: diagnosisResult.detail,
        });
      }

      const projectResult = await clickAndCompare(
        page,
        "[data-project-option]",
        "[data-project-panel]",
        2,
      );
      report.interactions.push({ profile: profile.name, name: "evidence", ...projectResult });
      if (!projectResult.passed) {
        report.failures.push({
          profile: profile.name,
          chapter: "evidence",
          type: "interaction",
          detail: projectResult.detail,
        });
      }

      const tatvaResult = await clickAndCompare(
        page,
        "[data-tatva-option]",
        "[data-tatva-panel]",
        3,
      );
      report.interactions.push({ profile: profile.name, name: "elements", ...tatvaResult });
      if (!tatvaResult.passed) {
        report.failures.push({
          profile: profile.name,
          chapter: "elements",
          type: "interaction",
          detail: tatvaResult.detail,
        });
      }

      const questionDetails = page.locator("#questions details").nth(1);
      await questionDetails.locator("summary").click();
      await page.waitForTimeout(200);
      const questionOpen = await questionDetails.getAttribute("open");
      const questionResult = {
        passed: questionOpen !== null,
        detail: questionOpen === null ? "FAQ did not open" : null,
      };
      report.interactions.push({ profile: profile.name, name: "questions", ...questionResult });
      if (!questionResult.passed) {
        report.failures.push({
          profile: profile.name,
          chapter: "questions",
          type: "interaction",
          detail: questionResult.detail,
        });
      }
    }

    await context.close();
  }

  const reducedContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await reducedPage.waitForTimeout(800);
  const reducedState = await reducedPage.evaluate(() => ({
    visibleVideos: Array.from(document.querySelectorAll("video")).filter((video) => {
      const style = getComputedStyle(video);
      const rect = video.getBoundingClientRect();
      return style.display !== "none" && rect.width > 1 && rect.height > 1;
    }).length,
    chapters: document.querySelectorAll("[data-home-chapter]").length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
  if (reducedState.visibleVideos > 0 || reducedState.chapters !== 10 || reducedState.overflow) {
    report.failures.push({
      profile: "reduced-motion",
      chapter: "document",
      type: "reduced-motion-composition",
      detail: JSON.stringify(reducedState),
    });
  }
  await reducedContext.close();

  await browser.close();

  const unexpectedResponses = report.failedResponses.filter((item) => !item.expected);
  const unexpectedConsoleErrors = report.consoleErrors.filter((item) => !item.expected);
  if (unexpectedResponses.length) {
    report.failures.push({
      profile: "all",
      chapter: "network",
      type: "failed-responses",
      detail: JSON.stringify(unexpectedResponses.slice(0, 20)),
    });
  }
  if (unexpectedConsoleErrors.length) {
    report.failures.push({
      profile: "all",
      chapter: "runtime",
      type: "console-errors",
      detail: JSON.stringify(unexpectedConsoleErrors.slice(0, 20)),
    });
  }
  if (report.pageErrors.length) {
    report.failures.push({
      profile: "all",
      chapter: "runtime",
      type: "page-errors",
      detail: JSON.stringify(report.pageErrors.slice(0, 20)),
    });
  }

  fs.writeFileSync("visual-audit-v2/report.json", JSON.stringify(report, null, 2));

  const summary = [
    "# Branding Tatva homepage release-gate audit v3",
    "",
    `- Commit: ${report.commit || "unknown"}`,
    `- Viewports tested: ${profiles.length}`,
    `- Chapter checks: ${report.captures.length}`,
    `- Critical media probes: ${report.mediaProbes.length}`,
    `- Interaction probes: ${report.interactions.length}`,
    `- Failures: ${report.failures.length}`,
    "",
    "## Interaction checks",
    ...report.interactions.map(
      (item) => `- ${item.profile} / ${item.name}: ${item.passed ? "PASS" : "FAIL"}`,
    ),
    "",
    "## Failures",
    ...(report.failures.length
      ? report.failures.map(
          (failure) =>
            `- ${failure.profile} / ${failure.chapter} / ${failure.type}: ${failure.detail}`,
        )
      : ["- None"]),
    "",
  ].join("\n");

  fs.writeFileSync("visual-audit-v2/report.md", summary);
  console.log(summary);

  if (report.failures.length) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
