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

async function waitForText(locator, expected, label, timeoutMs = 5_000) {
  const deadline = Date.now() + timeoutMs;
  let copy = "";

  while (Date.now() < deadline) {
    copy = (await locator.textContent()) || "";
    if (copy.includes(expected)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`${label}: expected "${expected}" in "${copy.slice(0, 260)}"`);
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

async function assertTouchTargets(locator, minimum, label) {
  const boxes = await locator.evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        text: (node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
        width: rect.width,
        height: rect.height,
      };
    }),
  );

  for (const box of boxes) {
    assert(
      box.width >= minimum && box.height >= minimum,
      `${label}: target "${box.text}" is ${box.width.toFixed(1)}×${box.height.toFixed(1)}`,
    );
  }
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

  const guide = page.locator("[data-guided-controls]");
  if ((await guide.count()) > 0) {
    await guide.evaluateAll((nodes) => {
      nodes.forEach((node) => {
        node.style.display = "none";
      });
    });
  }

  const chapter = page.locator('[data-home-v4-chapter="evidence"]').first();
  const scene = chapter.locator(".evidence-cinematic").first();
  assert((await scene.count()) === 1, `${viewport.name}: Evidence scene missing`);

  await chapter.scrollIntoViewIfNeeded();
  await page.waitForTimeout(760);

  const headline = (await scene.getByRole("heading", { level: 2 }).textContent()) || "";
  assert(
    headline.includes("Decisions first."),
    `${viewport.name}: Evidence proposition missing`,
  );

  const tabs = scene.getByRole("tab");
  assert((await tabs.count()) === 5, `${viewport.name}: expected five project files`);
  await assertTouchTargets(tabs, 40, `${viewport.name}: Evidence project tabs`);
  await assertNoOverflow(page, `${viewport.name}/evidence`);

  const dossier = scene.locator(".evidence-cinematic__dossier");
  const media = scene.locator(".evidence-cinematic__media");
  await waitForText(
    dossier,
    "Engagement moved from 0.71% to 2.81%",
    `${viewport.name}: first evidence trail is incomplete`,
  );

  assert(
    (await scene.getByRole("button", { name: /Inspect the project file/i }).count()) === 1,
    `${viewport.name}: project-file action missing`,
  );

  await scene.screenshot({
    path: path.join(OUTPUT, `${viewport.name}-evidence-dr-haley.png`),
    animations: "disabled",
  });

  const myShopTab = scene.getByRole("tab", { name: /MyShopInEurope/i });
  await myShopTab.click();
  await waitForText(
    media,
    "Craft over price",
    `${viewport.name}: MyShopInEurope media state did not update`,
  );
  await waitForText(
    dossier,
    "Indian craft, origin, and wellness heritage",
    `${viewport.name}: MyShopInEurope decision trail did not update`,
  );

  if (viewport.name.startsWith("desktop")) {
    await scene.screenshot({
      path: path.join(OUTPUT, `${viewport.name}-evidence-myshop.png`),
      animations: "disabled",
    });
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

  process.stdout.write("Moving proof-room evidence captured.\n");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
