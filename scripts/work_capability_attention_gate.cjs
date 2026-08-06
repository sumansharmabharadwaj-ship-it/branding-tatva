const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT_DIR = path.join(process.cwd(), "cinematic-recovery-audit");

const ROUTES = [
  { id: "clarity", project: "MyShopInEurope", slug: "myshopineurope", capabilities: 6, packageName: "Full Brand System" },
  { id: "recognition", project: "Dr. Haley Nutrition", slug: "dr-haley-nutrition", capabilities: 5, packageName: "Full Brand System" },
  { id: "consistency", project: "Plaxonic.com Content Portfolio", slug: "plaxonic-content-portfolio", capabilities: 4, packageName: "Brand Partnership" },
  { id: "launch", project: "HerbalCart", slug: "herbalcart", capabilities: 5, packageName: "Foundation" },
  { id: "marketing", project: "Executive Springboard", slug: "executive-springboard", capabilities: 6, packageName: "Brand Partnership" },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page, label) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) await loader.waitFor({ state: "detached", timeout: 9_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(420);
  assert((await loader.count()) === 0, `${label}: page-load veil did not clear`);
}

async function movePointerInside(page, locator) {
  const box = await locator.boundingBox();
  assert(box, "work/capability-attention: waystone has no measurable box");
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
}

async function detailIsOpen(button) {
  return button.locator("[data-waystone-details]").evaluate((node) => {
    const style = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return Number.parseFloat(style.opacity) > 0.8 && rect.height > 6;
  });
}

async function waitForRoute(page, route) {
  await page.waitForFunction(
    ({ id, project, slug, capabilities, packageName }) => {
      const selected = document.querySelector(`[data-waystone-id="${id}"]`);
      const proof = document.querySelector("[data-recommended-proof]");
      const mobileMap = document.querySelector("[data-mobile-capability-map]");
      const projectLink = proof?.querySelector(`a[href="/work/${slug}"]`);
      const serviceLink = proof?.querySelector('a[href="/services#desire"]');
      const proofText = proof?.textContent?.replace(/\s+/g, " ") || "";

      return Boolean(
        selected?.getAttribute("aria-pressed") === "true" &&
          proofText.includes(project) &&
          proofText.includes(`${capabilities} capabilities`) &&
          proofText.includes(packageName) &&
          projectLink &&
          serviceLink &&
          mobileMap?.getAttribute("data-active-capability-count") === String(capabilities),
      );
    },
    route,
    { timeout: 4_000 },
  );
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert(
    dimensions.document <= dimensions.viewport + 2 && dimensions.body <= dimensions.viewport + 2,
    `${label}: horizontal overflow ${JSON.stringify(dimensions)}`,
  );
}

async function auditInteractiveAttention(browser) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await page.goto(`${BASE_URL}/work`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await waitForPrelude(page, "work/capability-attention");

    const section = page.locator("#find-relevant-proof");
    const group = section.getByRole("group", { name: "Choose the brand problem you are trying to fix" });
    const stones = group.getByRole("button");

    await section.scrollIntoViewIfNeeded();
    const outsideFocus = section.getByRole("link", { name: "See the work behind this problem" });
    assert((await stones.count()) === 5, "work/capability-attention: expected five buyer-problem stones");

    const recognition = group.locator('[data-waystone-id="recognition"]');
    await recognition.focus();
    await movePointerInside(page, recognition);
    await page.mouse.move(2, 2);
    await page.waitForTimeout(560);
    assert(
      await recognition.evaluate((node) => document.activeElement === node),
      "work/capability-attention: pointer leave displaced keyboard focus",
    );
    assert(await detailIsOpen(recognition), "work/capability-attention: pointer leave collapsed the focused stone");

    const consistency = group.locator('[data-waystone-id="consistency"]');
    await movePointerInside(page, consistency);
    await consistency.focus();
    await outsideFocus.focus();
    await page.waitForTimeout(560);
    assert(await detailIsOpen(consistency), "work/capability-attention: focus leave collapsed the hovered stone");

    for (const route of ROUTES) {
      const stone = group.locator(`[data-waystone-id="${route.id}"]`);
      await stone.click();
      await waitForRoute(page, route);
      const pressedCount = await stones.evaluateAll(
        (nodes) => nodes.filter((node) => node.getAttribute("aria-pressed") === "true").length,
      );
      assert(pressedCount === 1, `work/capability-attention: ${route.id} left ${pressedCount} selected stones`);
    }

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    await section.screenshot({
      path: path.join(OUTPUT_DIR, "work-capability-selector-1280x800.png"),
      animations: "disabled",
    });

    await assertNoOverflow(page, "work/capability-attention");
    assert(pageErrors.length === 0, `work/capability-attention: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);
  } finally {
    await context.close();
  }
}

async function auditReducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await page.goto(`${BASE_URL}/work`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await waitForPrelude(page, "work/capability-attention-reduced-motion");

    const section = page.locator("#find-relevant-proof");
    const group = section.getByRole("group", { name: "Choose the brand problem you are trying to fix" });
    const stones = group.getByRole("button");
    await section.scrollIntoViewIfNeeded();

    for (let index = 0; index < (await stones.count()); index += 1) {
      assert(
        await detailIsOpen(stones.nth(index)),
        `work/capability-attention-reduced-motion: stone ${index + 1} hides its teaching line`,
      );
    }

    await group.locator('[data-waystone-id="marketing"]').click();
    await waitForRoute(page, ROUTES[4]);
    const proof = section.locator('[data-recommended-proof]');
    const mobileMap = section.locator('[data-mobile-capability-map]');
    const order = await Promise.all([
      proof.evaluate((node) => Number.parseInt(window.getComputedStyle(node.parentElement).order || "0", 10)),
      mobileMap.evaluate((node) => Number.parseInt(window.getComputedStyle(node.parentElement).order || "0", 10)),
    ]);
    assert(order[0] < order[1], `work/capability-attention-reduced-motion: proof does not precede capability detail ${JSON.stringify(order)}`);

    await assertNoOverflow(page, "work/capability-attention-reduced-motion");
    assert(pageErrors.length === 0, `work/capability-attention-reduced-motion: page exceptions ${JSON.stringify(pageErrors.slice(0, 6))}`);
  } finally {
    await context.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await auditInteractiveAttention(browser);
    await auditReducedMotion(browser);
    console.log(
      JSON.stringify(
        {
          baseUrl: BASE_URL,
          capabilityAttentionGate: "passed",
          checked: [
            "focus survives pointer leave",
            "hover survives focus leave",
            "five buyer-problem recommendations",
            "project and service links",
            "capability counts",
            "single selected state",
            "reduced-motion teaching lines",
            "mobile proof ordering",
            "overflow",
            "page exceptions",
          ],
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
