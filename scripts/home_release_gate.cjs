const { chromium } = require("playwright");
const fs = require("fs");

const profiles = [
  { name: "mobile-320", viewport: { width: 320, height: 568 }, capture: false },
  { name: "mobile-375", viewport: { width: 375, height: 667 }, capture: false },
  { name: "mobile-390", viewport: { width: 390, height: 844 }, capture: true },
  { name: "mobile-430", viewport: { width: 430, height: 932 }, capture: false },
  { name: "tablet-768", viewport: { width: 768, height: 1024 }, capture: false },
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

const criticalFilmChapters = ["elements", "process"];
const cycleProfiles = new Set(["mobile-390", "desktop-1440"]);
const cycleDurations = {
  diagnosis: 6800,
  evidence: 6800,
  studio: 6800,
  paths: 6500,
  framework: 5200,
  elements: 5400,
  process: 6200,
  questions: 7800,
};

const analyticsRequest = (url) =>
  url.includes("/_vercel/insights") || url.includes("/_vercel/speed-insights");

function intersectionArea(a, b) {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
}

async function scrollChapter(page, index) {
  const locator = page.locator("[data-home-chapter]").nth(index);
  await locator.evaluate((element) => {
    const top = window.scrollY + element.getBoundingClientRect().top;
    window.scrollTo({ top, behavior: "instant" });
  });
  await page.waitForTimeout(1250);
  return locator;
}

async function chapterFingerprint(page, chapterId) {
  return page.evaluate((id) => {
    const chapter = document.querySelector(`[data-home-chapter="${id}"]`);
    if (!(chapter instanceof HTMLElement)) return null;
    const compact = (value) => value?.replace(/\s+/g, " ").trim() || null;

    if (id === "diagnosis" || id === "studio" || id === "framework") {
      return compact(
        Array.from(chapter.querySelectorAll('button[aria-pressed="true"]'))
          .map((button) => button.textContent)
          .join(" | "),
      );
    }

    if (id === "evidence") {
      return compact(chapter.querySelector('[aria-live="polite"]')?.textContent);
    }

    if (id === "paths") {
      const cards = Array.from(chapter.querySelectorAll("li > a"));
      const active = cards
        .map((card) => ({
          text: compact(card.textContent),
          opacity: Number.parseFloat(getComputedStyle(card.parentElement).opacity || "0"),
        }))
        .sort((a, b) => b.opacity - a.opacity)[0];
      return active?.text || null;
    }

    if (id === "elements") {
      const active = Array.from(chapter.querySelectorAll('[aria-hidden="false"]')).find(
        (element) => element instanceof HTMLElement && element.textContent?.trim(),
      );
      return compact(active?.textContent);
    }

    if (id === "process") {
      return compact(chapter.querySelector('[role="tab"][aria-selected="true"]')?.textContent);
    }

    if (id === "questions") {
      return compact(chapter.querySelector('button[aria-expanded="true"]')?.textContent);
    }

    return null;
  }, chapterId);
}

(async () => {
  fs.mkdirSync("visual-audit", { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = {
    generatedAt: new Date().toISOString(),
    commit: process.env.AUDIT_COMMIT || process.env.GITHUB_SHA || null,
    captures: [],
    mediaProbes: [],
    autoplayCycles: [],
    cinemaMenu: null,
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
        expectedLocalAnalyticsFailure: analyticsRequest(response.url()),
      });
    });

    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const text = message.text();
      const expected =
        text.startsWith("Failed to load resource:") ||
        text.includes("/_vercel/insights") ||
        text.includes("/_vercel/speed-insights");
      report.consoleErrors.push({ profile: profile.name, text, expected });
    });

    page.on("pageerror", (error) => {
      report.pageErrors.push({ profile: profile.name, text: error.message });
    });

    await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2600);
    await page.waitForFunction(
      () => document.querySelectorAll("[data-home-chapter]").length >= 10,
      null,
      { timeout: 10000 },
    );

    const chapters = await page.locator("[data-home-chapter]").evaluateAll((elements) =>
      elements.map((element, index) => ({
        index,
        id: element.getAttribute("data-home-chapter") || `chapter-${index + 1}`,
      })),
    );

    const chapterIds = chapters.map((chapter) => chapter.id);
    if (JSON.stringify(chapterIds) !== JSON.stringify(expectedChapters)) {
      report.failures.push({
        profile: profile.name,
        chapter: "document",
        type: "chapter-sequence",
        detail: `Expected ${expectedChapters.join(", ")}; received ${chapterIds.join(", ")}`,
      });
    }

    for (const chapter of chapters) {
      await scrollChapter(page, chapter.index);
      if (profile.capture) await page.waitForTimeout(1250);

      const safe = chapter.id.replace(/[^a-z0-9_-]+/gi, "-").toLowerCase();
      const screenshotPath = profile.capture
        ? `visual-audit/${profile.name}-${String(chapter.index + 1).padStart(2, "0")}-${safe}.png`
        : null;
      if (screenshotPath) await page.screenshot({ path: screenshotPath, fullPage: false });

      const state = await page.evaluate(({ chapterId }) => {
        const rectFor = (element) => {
          if (!(element instanceof HTMLElement)) return null;
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          if (
            style.display === "none" ||
            style.visibility === "hidden" ||
            Number.parseFloat(style.opacity || "1") <= 0.025 ||
            box.width <= 1 ||
            box.height <= 1
          ) {
            return null;
          }
          return {
            left: box.left,
            top: box.top,
            right: box.right,
            bottom: box.bottom,
            width: box.width,
            height: box.height,
          };
        };

        const rectBySelector = (selector) => rectFor(document.querySelector(selector));
        const fixed = {
          ladder: rectBySelector("[data-chapter-ladder]"),
          mobileExplore: rectBySelector("[data-chapter-ladder-mobile] > button"),
          cinema: rectBySelector("[data-auto-journey-control]"),
          audio: rectBySelector("[data-ambient-audio-control]"),
        };

        const overlapPairs = [];
        const entries = Object.entries(fixed).filter(([, value]) => value);
        for (let i = 0; i < entries.length; i += 1) {
          for (let j = i + 1; j < entries.length; j += 1) {
            const [aName, a] = entries[i];
            const [bName, b] = entries[j];
            if (!a || !b) continue;
            const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
            const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
            if (width * height > 16) overlapPairs.push(`${aName}:${bName}`);
          }
        }

        const chapter = document.querySelector(`[data-home-chapter="${chapterId}"]`);
        const heading = chapter?.querySelector("h1, h2, [role=heading]");
        const headingBox = rectFor(heading);
        const headingOverflow = Boolean(
          headingBox && (headingBox.left < -1 || headingBox.right > window.innerWidth + 1),
        );

        const protectedElements = chapter
          ? Array.from(
              chapter.querySelectorAll(
                'h1, h2, [role="tabpanel"], [aria-live="polite"], a[href], button[aria-pressed="true"], button[aria-expanded="true"]',
              ),
            )
              .map((element) => ({
                tag: element.tagName.toLowerCase(),
                text: element.textContent?.replace(/\s+/g, " ").trim().slice(0, 80) || "",
                rect: rectFor(element),
              }))
              .filter((entry) => entry.rect)
          : [];

        const controlContentOverlaps = [];
        for (const [controlName, controlRect] of Object.entries(fixed)) {
          if (!controlRect) continue;
          if (window.innerWidth < 768 && controlName === "mobileExplore") continue;
          for (const entry of protectedElements) {
            const contentRect = entry.rect;
            const width = Math.max(
              0,
              Math.min(controlRect.right, contentRect.right) -
                Math.max(controlRect.left, contentRect.left),
            );
            const height = Math.max(
              0,
              Math.min(controlRect.bottom, contentRect.bottom) -
                Math.max(controlRect.top, contentRect.top),
            );
            if (width * height > 180) {
              controlContentOverlaps.push(
                `${controlName}:${entry.tag}:${entry.text || "unlabelled"}`,
              );
            }
          }
        }

        const visibleVideos = Array.from(document.querySelectorAll("video")).filter((video) => {
          const box = video.getBoundingClientRect();
          const style = getComputedStyle(video);
          return (
            box.width > 1 &&
            box.height > 1 &&
            box.bottom > 0 &&
            box.top < window.innerHeight &&
            style.visibility !== "hidden" &&
            Number.parseFloat(style.opacity || "1") > 0.025
          );
        });

        return {
          scrollY: Math.round(window.scrollY),
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          headingOverflow,
          headingRect: headingBox,
          fixed,
          overlapPairs,
          controlContentOverlaps,
          visibleVideos: visibleVideos.length,
          playingVideos: visibleVideos.filter((video) => !video.paused && !video.ended).length,
          totalPlayingVideos: Array.from(document.querySelectorAll("video")).filter(
            (video) => !video.paused && !video.ended,
          ).length,
        };
      }, { chapterId: chapter.id });

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
      if (state.headingOverflow) {
        report.failures.push({
          profile: profile.name,
          chapter: chapter.id,
          type: "heading-overflow",
          detail: JSON.stringify(state.headingRect),
        });
      }
      for (const detail of state.overlapPairs) {
        report.failures.push({
          profile: profile.name,
          chapter: chapter.id,
          type: "fixed-control-overlap",
          detail,
        });
      }
      for (const detail of state.controlContentOverlaps) {
        report.failures.push({
          profile: profile.name,
          chapter: chapter.id,
          type: "fixed-control-content-overlap",
          detail,
        });
      }
      if (state.totalPlayingVideos > 3) {
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
      await page.waitForTimeout(1500);
      const video = chapter.locator("video").first();
      if ((await video.count()) === 0) {
        report.failures.push({
          profile: profile.name,
          chapter: chapterId,
          type: "missing-critical-video",
          detail: "No video element was mounted after the chapter entered view",
        });
        continue;
      }

      const probe = await video.evaluate(async (element) => {
        const start = element.currentTime;
        let playError = null;
        try {
          await element.play();
        } catch (error) {
          playError =
            error instanceof Error
              ? { name: error.name, message: error.message }
              : { name: "Unknown", message: String(error) };
        }
        await new Promise((resolve) => setTimeout(resolve, 900));
        return {
          src: element.currentSrc || element.src,
          readyState: element.readyState,
          paused: element.paused,
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
      if (!probe.advanced || probe.paused || probe.playError || probe.mediaError) {
        report.failures.push({
          profile: profile.name,
          chapter: chapterId,
          type: "critical-video-not-playing",
          detail: JSON.stringify(probe),
        });
      }
    }

    if (cycleProfiles.has(profile.name)) {
      for (const [chapterId, duration] of Object.entries(cycleDurations)) {
        const index = chapters.findIndex((chapter) => chapter.id === chapterId);
        if (index < 0) continue;
        await scrollChapter(page, index);
        const before = await chapterFingerprint(page, chapterId);
        await page.waitForTimeout(duration);
        const after = await chapterFingerprint(page, chapterId);
        const changed = Boolean(before && after && before !== after);
        report.autoplayCycles.push({
          profile: profile.name,
          chapter: chapterId,
          before,
          after,
          changed,
        });
        if (!changed) {
          report.failures.push({
            profile: profile.name,
            chapter: chapterId,
            type: "autoplay-cycle-stalled",
            detail: JSON.stringify({ before, after }),
          });
        }
      }
    }

    if (profile.name === "mobile-390") {
      const idleJourneyVisible = await page
        .locator('[data-auto-journey-control][aria-pressed="false"]')
        .isVisible()
        .catch(() => false);
      const exploreButton = page.locator("[data-chapter-ladder-mobile] > button");
      await exploreButton.click();
      await page.getByRole("button", { name: "Cinema and sound" }).click();
      await page.waitForTimeout(450);
      const menuVisible = await page.locator("#mobile-cinema-controls").isVisible().catch(() => false);
      const globalAudioVisible = await page
        .locator("[data-ambient-audio-control]")
        .isVisible()
        .catch(() => false);
      report.cinemaMenu = { idleJourneyVisible, menuVisible, globalAudioVisible };
      if (idleJourneyVisible || !menuVisible || globalAudioVisible) {
        report.failures.push({
          profile: profile.name,
          chapter: "cinema-controls",
          type: "mobile-cinema-menu",
          detail: JSON.stringify(report.cinemaMenu),
        });
      }
      if (menuVisible) {
        await page.screenshot({
          path: "visual-audit/mobile-390-cinema-menu.png",
          fullPage: false,
        });
      }
    }

    await context.close();
  }

  for (const response of report.failedResponses) {
    if (response.expectedLocalAnalyticsFailure) continue;
    report.failures.push({
      profile: response.profile,
      chapter: "runtime",
      type: "failed-response",
      detail: `${response.status} ${response.url}`,
    });
  }
  for (const entry of report.consoleErrors) {
    if (entry.expected) continue;
    report.failures.push({
      profile: entry.profile,
      chapter: "runtime",
      type: "console-error",
      detail: entry.text,
    });
  }
  for (const entry of report.pageErrors) {
    report.failures.push({
      profile: entry.profile,
      chapter: "runtime",
      type: "page-error",
      detail: entry.text,
    });
  }

  fs.writeFileSync("visual-audit/report.json", JSON.stringify(report, null, 2));
  const lines = [
    "# Branding Tatva homepage release-gate audit",
    "",
    `- Commit: ${report.commit ?? "unknown"}`,
    `- Viewports tested: ${profiles.length}`,
    `- Chapters per viewport: ${expectedChapters.length}`,
    `- Chapter checks: ${report.captures.length}`,
    `- Critical media probes: ${report.mediaProbes.length}`,
    `- Autoplay cycle probes: ${report.autoplayCycles.length}`,
    `- Failures: ${report.failures.length}`,
    "",
    "## Critical media probes",
    "",
    ...report.mediaProbes.map(
      (probe) =>
        `- ${probe.profile} / ${probe.chapter}: ${probe.advanced && !probe.paused ? "PASS" : "FAIL"} | ${probe.src}`,
    ),
    "",
    "## Autoplay cycles",
    "",
    ...report.autoplayCycles.map(
      (probe) =>
        `- ${probe.profile} / ${probe.chapter}: ${probe.changed ? "PASS" : "FAIL"}`,
    ),
    "",
    "## Failures",
    "",
    ...(report.failures.length
      ? report.failures.map(
          (failure) =>
            `- ${failure.profile} / ${failure.chapter} / ${failure.type}: ${failure.detail}`,
        )
      : ["- None"]),
    "",
  ];
  fs.writeFileSync("visual-audit/report.md", lines.join("\n"));
  console.log(lines.join("\n"));

  await browser.close();
  if (report.failures.length) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
