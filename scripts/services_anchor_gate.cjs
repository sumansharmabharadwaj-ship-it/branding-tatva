const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-experience-audit");
// Deep chapters of the nine-part composition a visitor actually arrives at
// by link: #proof carries the verified outcome (and receives the /work
// redirect); the former stakes and deliverables chapters folded into their
// neighbours when the page compressed to nine scenes.
const TARGETS = ["proof", "education", "audit"];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServices(page) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) await veil.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  await page.waitForFunction(
    () => Number(document.documentElement.dataset.servicesChapterCount || 0) === 9,
    undefined,
    { timeout: 20_000 },
  );
  await page.waitForTimeout(320);
}

async function inspect(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: Boolean(viewport.touch),
  });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });
  const page = await context.newPage();
  const results = [];

  for (const id of TARGETS) {
    await page.goto(`${BASE_URL}/services#${id}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await waitForServices(page);
    const target = page.locator(`#${id}`);
    assert((await target.count()) === 1, `${viewport.name}: #${id} target is missing`);

    const geometry = await target.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      return {
        top: bounds.top,
        scrollMarginTop: getComputedStyle(node).scrollMarginTop,
        activeId: document.documentElement.dataset.servicesActiveChapterId || null,
      };
    });

    // services-anchor-contract.css zeroes every chapter's scroll margin on
    // purpose: each scene is a full viewport composition with its own top
    // clearance, so a direct link must put the frame at the viewport edge —
    // header clearance would expose the previous chapter as a broken seam.
    assert(
      Math.abs(geometry.top) <= 2,
      `${viewport.name}: #${id} landed at ${geometry.top.toFixed(1)}px; expected the chapter frame at the viewport edge`,
    );
    assert(geometry.activeId === id, `${viewport.name}: #${id} landed with active chapter ${geometry.activeId}`);
    results.push({ id, ...geometry });
  }

  await context.close();
  return { viewport: viewport.name, results };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const reports = [];
  try {
    reports.push(await inspect(browser, { name: "desktop-1440x900", width: 1440, height: 900 }));
    reports.push(await inspect(browser, { name: "mobile-390x844", width: 390, height: 844, touch: true }));
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(OUTPUT, "services-anchor-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), reports }, null, 2),
  );
  process.stdout.write("Services anchor gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
