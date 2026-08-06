const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT = path.join(process.cwd(), "services-scroll-audit");
const PROFILES = [
  {
    name: "desktop-1440x900",
    width: 1440,
    height: 900,
    reducedMotion: "no-preference",
    expectSticky: true,
  },
  {
    name: "short-desktop-1440x700",
    width: 1440,
    height: 700,
    reducedMotion: "no-preference",
    expectSticky: false,
  },
  {
    name: "mobile-390x844",
    width: 390,
    height: 844,
    reducedMotion: "no-preference",
    hasTouch: true,
    expectSticky: false,
  },
  {
    name: "reduced-motion-1440x900",
    width: 1440,
    height: 900,
    reducedMotion: "reduce",
    expectSticky: false,
  },
];

fs.mkdirSync(OUTPUT, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function inspect(browser, profile) {
  const context = await browser.newContext({
    viewport: { width: profile.width, height: profile.height },
    reducedMotion: profile.reducedMotion,
    hasTouch: Boolean(profile.hasTouch),
  });

  await context.addInitScript(() => {
    try {
      window.sessionStorage.setItem("branding-tatva-v4-prelude-seen", "true");
    } catch {}
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('[data-services-scroll-root][data-services-scroll-ready="true"]', {
    timeout: 12_000,
  });

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('[data-services-scene="opening"]');
    const heroCopy = hero?.querySelector("[data-services-hero-copy]");
    const stakes = document.querySelector('[data-services-scene="stakes"]');
    const stakesStage = stakes
      ? Array.from(stakes.children).find(
          (child) =>
            child instanceof HTMLElement &&
            child.classList.contains("relative") &&
            Boolean(child.querySelector('[data-stakes-scroll-story="true"]')),
        )
      : null;

    const documentWidth = document.documentElement.scrollWidth;
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      documentWidth,
      heroHeight: hero?.getBoundingClientRect().height || 0,
      heroCopyPosition:
        heroCopy instanceof HTMLElement ? getComputedStyle(heroCopy).position : null,
      stakesHeight: stakes?.getBoundingClientRect().height || 0,
      stakesStagePosition:
        stakesStage instanceof HTMLElement ? getComputedStyle(stakesStage).position : null,
      heroTitle: hero?.querySelector("h1")?.textContent || "",
      stakesTitle: stakes?.querySelector("h2")?.textContent || "",
    };
  });

  assert(
    metrics.documentWidth <= metrics.viewportWidth + 2,
    `${profile.name}: horizontal overflow ${metrics.documentWidth}px > ${metrics.viewportWidth}px`,
  );
  assert(metrics.heroTitle.includes("recognition is breaking down"), `${profile.name}: Services hero proposition missing`);
  assert(metrics.stakesTitle.includes("weak branding actually costs"), `${profile.name}: Stakes proposition missing`);

  const heroRange = metrics.heroHeight / metrics.viewportHeight;
  const stakesRange = metrics.stakesHeight / metrics.viewportHeight;

  if (profile.expectSticky) {
    assert(metrics.heroCopyPosition === "sticky", `${profile.name}: hero copy frame is not sticky`);
    assert(heroRange >= 1.05 && heroRange <= 1.24, `${profile.name}: hero range is ${heroRange.toFixed(2)} viewports`);
    assert(metrics.stakesStagePosition === "sticky", `${profile.name}: positioning comparison stage is not sticky`);
    assert(stakesRange >= 1.18 && stakesRange <= 1.4, `${profile.name}: Stakes range is ${stakesRange.toFixed(2)} viewports`);
  } else {
    assert(metrics.heroCopyPosition !== "sticky", `${profile.name}: hero retained desktop sticky choreography`);
    assert(metrics.stakesStagePosition !== "sticky", `${profile.name}: Stakes retained desktop sticky choreography`);
  }

  const hero = page.locator('[data-services-scene="opening"]');
  const stakes = page.locator('[data-services-scene="stakes"]');
  await hero.screenshot({
    path: path.join(OUTPUT, `${profile.name}-services-opening.png`),
    animations: "disabled",
  });
  await stakes.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await stakes.screenshot({
    path: path.join(OUTPUT, `${profile.name}-services-stakes.png`),
    animations: "disabled",
  });

  await context.close();
  return {
    profile: profile.name,
    heroRange: Number(heroRange.toFixed(2)),
    heroCopyPosition: metrics.heroCopyPosition,
    stakesRange: Number(stakesRange.toFixed(2)),
    stakesStagePosition: metrics.stakesStagePosition,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const profile of PROFILES) {
      results.push(await inspect(browser, profile));
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(OUTPUT, "services-cinematic-stage-report.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
  );

  process.stdout.write("Services cinematic-stage gate passed.\n");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
