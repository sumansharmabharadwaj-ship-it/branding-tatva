const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-experience-audit");
const TARGETS = ["verified-outcome", "stakes", "deliverables"];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServices(page) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) await veil.waitFor({ state: "detached", timeout: 9_000 }).catch(() => {});
  await page.waitForFunction(
    () => Number(document.documentElement.dataset.servicesChapterCount || 0) === 13,
    undefined,
    { timeout: 12_000 },
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

    const minimum = viewport.width < 768 ? 50 : 60;
    const maximum = viewport.width < 768 ? 125 : 145;
    assert(
      geometry.top >= minimum && geometry.top <= maximum,
      `${viewport.name}: #${id} landed at ${geometry.top.toFixed(1)}px; expected readable header clearance ${minimum}-${maximum}px`,
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
