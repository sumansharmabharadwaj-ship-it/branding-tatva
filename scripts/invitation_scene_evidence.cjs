const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "cinematic-recovery-audit");
const CASES = [
  {
    name: "desktop-1440x900-invitation-default",
    width: 1440,
    height: 900,
    situation: null,
    expectedHeadline: "Let’s find the idea your business should be remembered for.",
    expectedAction: "Enter the strategy room",
  },
  {
    name: "desktop-1440x900-invitation-outgrown",
    width: 1440,
    height: 900,
    situation: "outgrown",
    expectedHeadline: "Give growth a system strong enough to hold it.",
    expectedAction: "Enter the system room",
  },
  {
    name: "mobile-390x844-invitation-default",
    width: 390,
    height: 844,
    touch: true,
    situation: null,
    expectedHeadline: "Let’s find the idea your business should be remembered for.",
    expectedAction: "Enter the strategy room",
  },
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

async function capture(browser, testCase) {
  const context = await browser.newContext({
    viewport: { width: testCase.width, height: testCase.height },
    reducedMotion: "no-preference",
    hasTouch: Boolean(testCase.touch),
  });

  await context.addInitScript((situation) => {
    try {
      window.sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
      if (situation) window.localStorage.setItem("bt-situation", situation);
      else window.localStorage.removeItem("bt-situation");
    } catch {}
  }, testCase.situation);

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

  const chapter = page.locator('[data-home-v4-chapter="invitation"]').first();
  const invitation = chapter.locator(".final-invitation").first();
  assert((await invitation.count()) === 1, `${testCase.name}: final invitation missing`);

  await chapter.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);

  const quote = (await chapter.locator('p[role="text"]').first().textContent()) || "";
  assert(
    quote.includes("Some things only become visible once everything else goes quiet."),
    `${testCase.name}: closing quote missing`,
  );

  const headline = (await invitation.getByRole("heading", { level: 2 }).textContent()) || "";
  assert(
    headline.trim() === testCase.expectedHeadline,
    `${testCase.name}: headline resolved to "${headline.trim()}"`,
  );

  const primaryAction = invitation.getByRole("link", { name: testCase.expectedAction });
  assert((await primaryAction.count()) === 1, `${testCase.name}: primary invitation action missing`);
  const actionBox = await primaryAction.boundingBox();
  assert(
    actionBox && actionBox.width >= 44 && actionBox.height >= 44,
    `${testCase.name}: primary action is smaller than 44px`,
  );

  const map = invitation.locator(".final-invitation__map");
  const mapDisplay = await map.evaluate((node) => window.getComputedStyle(node).display);
  if (testCase.touch) {
    assert(mapDisplay === "none", `${testCase.name}: desktop map should be hidden on touch layout`);
    assert(
      (await invitation.locator(".final-invitation__mobile-trail > div").count()) === 3,
      `${testCase.name}: mobile decision trail is incomplete`,
    );
  } else {
    assert(mapDisplay !== "none", `${testCase.name}: next-move map should be visible on desktop`);
    assert(
      (await invitation.locator(".final-invitation__node").count()) === 3,
      `${testCase.name}: desktop next-move map is incomplete`,
    );
  }

  await assertNoOverflow(page, testCase.name);
  await chapter.screenshot({
    path: path.join(OUTPUT, `${testCase.name}.png`),
    animations: "disabled",
  });

  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const testCase of CASES) {
      await capture(browser, testCase);
    }
  } finally {
    await browser.close();
  }

  process.stdout.write("Final invitation evidence captured.\n");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
