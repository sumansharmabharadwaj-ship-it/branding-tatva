const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-audit");

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function scrollScene(page, selector, progress) {
  await page.evaluate(
    ({ selector, progress }) => {
      const scene = document.querySelector(selector);
      if (!(scene instanceof HTMLElement)) return;
      const viewport = window.innerHeight;
      const top = scene.getBoundingClientRect().top + window.scrollY;
      const start = top - viewport * 0.84;
      const end = top + scene.offsetHeight - viewport * 0.16;
      window.scrollTo({ top: Math.max(0, start + (end - start) * progress), behavior: "auto" });
    },
    { selector, progress },
  );
  await page.waitForTimeout(650);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });

  await context.addInitScript(() => {
    try {
      window.sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
      window.localStorage.removeItem("branding-tatva-services-situation");
      window.localStorage.removeItem("branding-tatva-visitor-situation");
    } catch {}
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('[data-services-scroll-root][data-services-scroll-ready="true"]', {
    timeout: 12_000,
  });

  const desire = page.locator("#desire");
  assert((await desire.count()) === 1, "Package path scene is missing");

  await scrollScene(page, "#desire", 0.05);
  const earlyPreviewButton = desire.locator('button[data-package-preview="true"]').first();
  const earlyPreview = await earlyPreviewButton.textContent();
  assert(Boolean(earlyPreview), "Early package preview did not activate");
  assert(
    /Starting with an idea/i.test(earlyPreview || ""),
    `Package preview began at unexpected path: ${earlyPreview}`,
  );
  assert(
    (await earlyPreviewButton.getAttribute("aria-pressed")) === "false",
    "Passive package preview is incorrectly marked as a committed choice",
  );

  await scrollScene(page, "#desire", 0.94);
  const latePreviewButton = desire.locator('button[data-package-preview="true"]').first();
  const latePreview = await latePreviewButton.textContent();
  assert(Boolean(latePreview), "Late package preview did not activate");
  assert(
    /Needing ongoing consistency/i.test(latePreview || ""),
    `Package preview ended at unexpected path: ${latePreview}`,
  );
  assert(earlyPreview !== latePreview, "A short scroll did not change the package path");

  await latePreviewButton.click();
  await page.waitForTimeout(220);
  assert(
    (await latePreviewButton.getAttribute("aria-pressed")) === "true",
    "Explicit package choice is not marked pressed",
  );
  assert(
    (await latePreviewButton.getAttribute("data-package-preview")) === null,
    "Explicit package choice is still marked as a passive preview",
  );

  await desire.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-package-path-committed.png"),
    animations: "disabled",
  });

  fs.writeFileSync(
    path.join(OUTPUT, "services-package-progress-report.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        earlyPreview,
        latePreview,
        committed: true,
      },
      null,
      2,
    ),
  );

  await context.close();
  await browser.close();
  process.stdout.write("Services package progress gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
