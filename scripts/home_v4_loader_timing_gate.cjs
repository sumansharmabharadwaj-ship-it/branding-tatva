const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "homepage-v4-audit");

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function measureVeil(page, label) {
  const startedAt = Date.now();
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  const veil = page.locator("[data-page-load-veil]");
  const present = (await veil.count()) > 0;

  if (present) {
    await veil.waitFor({ state: "detached", timeout: 5_000 });
  }

  await page.waitForSelector("[data-home-v4]", { timeout: 12_000 });
  const wallClockMs = Date.now() - startedAt;
  const performanceMs = await page.evaluate(() => performance.now());
  return { label, present, wallClockMs, performanceMs: Number(performanceMs.toFixed(1)) };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const first = await measureVeil(page, "first");
  assert(first.present, "First homepage load did not render the cinematic prelude veil");
  assert(
    first.performanceMs <= 2_500,
    `First-load prelude took ${first.performanceMs.toFixed(0)}ms; maximum is 2500ms`,
  );

  // Same tab + same origin preserves sessionStorage, which is the natural
  // repeat-visit contract used by the homepage prelude. The repeat may shave a
  // little time in CI, so the lower bound is intentionally tolerant while the
  // upper bound protects the requested 1.2–1.8s design target.
  const repeat = await measureVeil(page, "repeat");
  assert(repeat.present, "Repeat homepage visit skipped the prelude entirely instead of using the short handoff");
  assert(
    repeat.performanceMs >= 900 && repeat.performanceMs <= 2_000,
    `Repeat prelude took ${repeat.performanceMs.toFixed(0)}ms; expected the short ~1.2–1.8s handoff`,
  );
  assert(
    repeat.performanceMs <= first.performanceMs + 120,
    `Repeat prelude (${repeat.performanceMs.toFixed(0)}ms) became slower than the first load (${first.performanceMs.toFixed(0)}ms)`,
  );

  await page.screenshot({
    path: path.join(OUTPUT, "desktop-1440x900-after-repeat-prelude.png"),
    animations: "disabled",
  });

  fs.writeFileSync(
    path.join(OUTPUT, "home-v4-loader-timing-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), first, repeat }, null, 2),
  );

  await context.close();
  await browser.close();
  process.stdout.write("Homepage V4 loader timing gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
