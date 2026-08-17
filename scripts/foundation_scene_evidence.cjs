const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "cinematic-recovery-audit");
const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "mobile-390x844", width: 390, height: 844, touch: true },
];
fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 9_000 });
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(260);
}

async function hideGuide(page) {
  const guide = page.locator("[data-guided-controls]");
  if ((await guide.count()) === 0) return;
  await guide.evaluateAll((nodes) => {
    nodes.forEach((node) => {
      node.style.display = "none";
    });
  });
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  assert(
    dimensions.document <= dimensions.viewport + 2 && dimensions.body <= dimensions.viewport + 2,
    `${label}: horizontal overflow viewport=${dimensions.viewport}, document=${dimensions.document}, body=${dimensions.body}`,
  );
}

async function capture(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "no-preference",
    hasTouch: Boolean(viewport.touch),
  });

  await context.addInitScript(() => {
    try {
      window.sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });

  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page);
  await hideGuide(page);

  const chapter = page.locator('[data-home-v4-chapter="foundation"]').first();
  const wrapper = chapter.locator('section[aria-labelledby="brand-foundation-title"]').first();
  const cards = wrapper.locator("[data-foundation-layer]");
  const finalCopy = wrapper.locator("[data-final-copy]");

  assert((await wrapper.count()) === 1, `${viewport.name}: Foundation wrapper missing`);
  assert((await cards.count()) === 4, `${viewport.name}: expected four Foundation layers`);
  assert((await finalCopy.count()) === 1, `${viewport.name}: Foundation conclusion missing`);

  await chapter.scrollIntoViewIfNeeded();
  await page.waitForTimeout(520);
  await assertNoOverflow(page, `${viewport.name}/foundation`);

  if (viewport.name.startsWith("desktop")) {
    const geometry = await wrapper.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const cards = Array.from(node.querySelectorAll("[data-foundation-layer]"));
      const finalCopy = node.querySelector("[data-final-copy]");
      return {
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
        viewport: window.innerHeight,
        visibleCards: cards.filter((card) => {
          const cardRect = card.getBoundingClientRect();
          return Number(getComputedStyle(card).opacity) > 0.5 && cardRect.height > 40;
        }).length,
        finalOpacity: finalCopy ? Number(getComputedStyle(finalCopy).opacity) : 0,
      };
    });

    assert(
      geometry.height <= geometry.viewport * 1.02 && geometry.height >= geometry.viewport * 0.98,
      `${viewport.name}: Foundation height ${geometry.height}px is outside the one-screen target`,
    );
    assert(
      geometry.top >= -2 && geometry.bottom <= geometry.viewport + 2,
      `${viewport.name}: Foundation frame escapes the viewport (${JSON.stringify(geometry)})`,
    );
    assert(
      geometry.visibleCards === 4,
      `${viewport.name}: only ${geometry.visibleCards} Foundation layers are visible in the film frame`,
    );
    assert(
      geometry.finalOpacity > 0.55,
      `${viewport.name}: Foundation conclusion remained hidden in the film frame`,
    );

    await chapter.screenshot({
      path: path.join(OUTPUT, `${viewport.name}-foundation-one-screen.png`),
      animations: "disabled",
    });
  } else {
    await wrapper.screenshot({
      path: path.join(OUTPUT, `${viewport.name}-foundation-static.png`),
      animations: "disabled",
    });

    const visibleCards = await cards.evaluateAll((nodes) =>
      nodes.filter((node) => {
        const style = getComputedStyle(node);
        return Number(style.opacity) > 0.5 && node.getBoundingClientRect().height > 80;
      }).length,
    );
    assert(visibleCards === 4, `${viewport.name}: mobile Foundation does not expose all four layers`);
  }

  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of VIEWPORTS) {
      await capture(browser, viewport);
    }
  } finally {
    await browser.close();
  }

  process.stdout.write("Foundation excavation evidence captured.\n");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
