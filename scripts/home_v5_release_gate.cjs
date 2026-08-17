const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "homepage-v5-audit");
const CHAPTERS = ["opening", "recognition", "foundation", "process", "evidence", "studio", "decision", "invitation"];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function inspectViewport(browser, viewport, label) {
  const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 90_000 });
  await page.waitForSelector("[data-home-v5]", { timeout: 15_000 });

  const report = await page.evaluate((expected) => {
    const chapters = [...document.querySelectorAll("[data-home-v5-chapter]")];
    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      chapters: chapters.map((chapter) => {
        const rect = chapter.getBoundingClientRect();
        const shell = chapter.querySelector(".home-v5-shell");
        const shellRect = shell?.getBoundingClientRect();
        const video = chapter.querySelector("video");
        return {
          id: chapter.id,
          dataId: chapter.getAttribute("data-home-v5-chapter"),
          height: Math.round(rect.height),
          widthOverflow: chapter.scrollWidth - chapter.clientWidth,
          shellTop: shellRect ? Math.round(shellRect.top - rect.top) : null,
          shellBottom: shellRect ? Math.round(shellRect.bottom - rect.top) : null,
          video: video?.currentSrc || null,
          duration: video && Number.isFinite(video.duration) ? Number(video.duration.toFixed(2)) : null,
        };
      }),
      expected,
    };
  }, CHAPTERS);

  assert(report.documentOverflow <= 1, `${label} has ${report.documentOverflow}px horizontal document overflow`);
  assert(report.chapters.length === CHAPTERS.length, `${label} rendered ${report.chapters.length} chapters instead of ${CHAPTERS.length}`);
  assert(report.chapters.map((chapter) => chapter.dataId).join(",") === CHAPTERS.join(","), `${label} chapter order changed`);

  for (const chapter of report.chapters) {
    assert(chapter.id === chapter.dataId, `${label} chapter ${chapter.dataId} has mismatched id ${chapter.id}`);
    assert(chapter.widthOverflow <= 1, `${label} ${chapter.id} has ${chapter.widthOverflow}px horizontal overflow`);
    if (viewport.width >= 761) {
      assert(Math.abs(chapter.height - viewport.height) <= 2, `${label} ${chapter.id} is ${chapter.height}px instead of one ${viewport.height}px screen`);
      assert(chapter.shellTop === null || chapter.shellTop >= -1, `${label} ${chapter.id} shell begins outside its scene`);
      assert(chapter.shellBottom === null || chapter.shellBottom <= chapter.height + 1, `${label} ${chapter.id} shell is clipped below the scene`);
    } else {
      assert(chapter.height >= viewport.height, `${label} ${chapter.id} is shorter than the mobile viewport`);
      assert(chapter.shellBottom === null || chapter.shellBottom <= chapter.height + 1, `${label} ${chapter.id} mobile shell is clipped`);
    }
  }

  const videoReports = report.chapters.filter((chapter) => chapter.video);
  const videoSources = videoReports.map((chapter) => chapter.video);
  assert(videoReports.length === 7, `${label} expected seven film chapters, found ${videoReports.length}`);
  assert(new Set(videoSources).size === videoSources.length, `${label} repeats a homepage film source`);
  for (const chapter of videoReports) {
    assert(chapter.video.includes("/videos/home-v5-"), `${label} ${chapter.id} does not use its dedicated V5 film`);
    assert((chapter.duration || 0) >= 14.5, `${label} ${chapter.id} film is only ${chapter.duration}s`);
  }

  for (const id of ["recognition", "foundation", "process", "decision"]) {
    const chapter = page.locator(`#${id}`);
    const tabs = chapter.getByRole("tab");
    const count = await tabs.count();
    assert(count >= 3, `${label} ${id} exposes only ${count} choices`);
    for (let index = 0; index < count; index += 1) {
      await tabs.nth(index).click();
      assert((await tabs.nth(index).getAttribute("aria-selected")) === "true", `${label} ${id} choice ${index + 1} did not activate`);
    }
  }

  const guide = page.locator(".ask-tatva");
  await guide.locator(".ask-tatva__trigger").click();
  const input = guide.locator("#ask-tatva-input");
  await input.fill("The business has changed");
  await input.press("Enter");
  await page.waitForTimeout(150);
  assert((await guide.locator('.ask-tatva__message[data-role="guide"]').count()) >= 2, `${label} Ask Tatva did not answer`);
  await page.keyboard.press("Escape");
  assert(!(await guide.evaluate((node) => node.classList.contains("is-open"))), `${label} Ask Tatva did not close with Escape`);

  await page.screenshot({ path: path.join(OUTPUT, `${label}.png`), fullPage: true, animations: "disabled" });
  await context.close();
  return report;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const desktop = await inspectViewport(browser, { width: 1365, height: 936 }, "desktop-1365x936");
  const mobile = await inspectViewport(browser, { width: 390, height: 844 }, "mobile-390x844");
  await browser.close();
  fs.writeFileSync(path.join(OUTPUT, "home-v5-release-report.json"), JSON.stringify({ desktop, mobile }, null, 2));
  process.stdout.write("Homepage V5 release gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
