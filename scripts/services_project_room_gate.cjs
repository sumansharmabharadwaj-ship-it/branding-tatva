const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";
const OUTPUT_DIR = path.join(process.cwd(), "services-project-room-audit");

const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "mobile-390x844", width: 390, height: 844 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForPrelude(page) {
  const veil = page.locator("[data-page-load-veil]");
  if ((await veil.count()) > 0) {
    await veil.waitFor({ state: "detached", timeout: 10_000 }).catch(() => {});
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(420);
}

async function assertTouchTargets(locator, minimum, label) {
  const targets = await locator.evaluateAll((nodes) =>
    nodes
      .filter((node) => {
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
      })
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          text: (node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100),
          width: rect.width,
          height: rect.height,
        };
      }),
  );

  for (const target of targets) {
    assert(
      target.width >= minimum && target.height >= minimum,
      `${label}: ${JSON.stringify(target.text)} is ${target.width.toFixed(1)}×${target.height.toFixed(1)}, expected at least ${minimum}×${minimum}`,
    );
  }
}

async function waitForText(locator, expected, label, timeout = 8000) {
  const deadline = Date.now() + timeout;
  let value = "";
  while (Date.now() < deadline) {
    value = ((await locator.textContent().catch(() => "")) || "").replace(/\s+/g, " ");
    if (value.includes(expected)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(value.slice(0, 260))}`);
}

async function auditViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !/Failed to load resource/.test(message.text())) {
      consoleErrors.push(message.text());
    }
  });

  await page.goto(`${BASE_URL}/services`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await waitForPrelude(page);

  const desire = page.locator("#desire");
  await desire.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const choiceButtons = desire.locator('button[aria-pressed]').filter({
    hasText: /Starting with an idea|Feeling unclear or inconsistent|Needing ongoing consistency/,
  });
  assert((await choiceButtons.count()) === 3, `${viewport.name}: expected three situation choices`);
  await assertTouchTargets(choiceButtons, 44, `${viewport.name}: package choices`);

  const clarityChoice = desire.getByRole("button", { name: /Feeling unclear or inconsistent/i }).first();
  await clarityChoice.click();
  assert((await clarityChoice.getAttribute("aria-pressed")) === "true", `${viewport.name}: selected situation is not pressed`);

  const room = desire.locator('[data-project-room="true"]');
  await room.waitFor({ state: "visible", timeout: 8_000 });
  assert((await room.getAttribute("data-project-room-tab")) === "brief", `${viewport.name}: Project Room does not open on the brief`);
  await waitForText(room, "Full Brand System", `${viewport.name}: Project Room title`);
  await waitForText(room, "Business situation", `${viewport.name}: business situation`);
  await waitForText(room, "Core decision", `${viewport.name}: core decision`);
  await waitForText(room, "Projects begin at", `${viewport.name}: localized investment label`);

  const roomTabs = room.getByRole("tablist", { name: "Full Brand System project room" }).getByRole("tab");
  assert((await roomTabs.count()) === 4, `${viewport.name}: expected four Project Room chapters`);
  await assertTouchTargets(roomTabs, 44, `${viewport.name}: Project Room chapter tabs`);

  if (viewport.width < 1024) {
    const roomBox = await room.boundingBox();
    assert(roomBox, `${viewport.name}: Project Room has no layout box`);
    assert(
      roomBox.height <= viewport.height - 10,
      `${viewport.name}: Project Room is ${roomBox.height.toFixed(1)}px tall inside a ${viewport.height}px viewport`,
    );
  }

  const routeTab = room.getByRole("tab", { name: "The route", exact: true });
  await routeTab.click();
  assert((await routeTab.getAttribute("aria-selected")) === "true", `${viewport.name}: route chapter is not selected`);
  assert((await room.getAttribute("data-project-room-tab")) === "route", `${viewport.name}: room state did not switch to route`);
  for (const phase of ["Discover", "Define", "Design", "Develop", "Deliver", "Evolve"]) {
    await waitForText(room, phase, `${viewport.name}: phase ${phase}`);
  }
  await waitForText(room, "Client input", `${viewport.name}: client input`);
  await waitForText(room, "Timeline policy", `${viewport.name}: timeline policy`);

  await routeTab.focus();
  await routeTab.press("End");
  const investmentTab = room.getByRole("tab", { name: "Investment", exact: true });
  assert((await investmentTab.getAttribute("aria-selected")) === "true", `${viewport.name}: End key did not select Investment`);
  assert((await room.getAttribute("data-project-room-tab")) === "investment", `${viewport.name}: keyboard state did not reach investment`);
  await waitForText(room, "Localized investment", `${viewport.name}: localized investment`);
  assert(
    (await room.getByRole("link", { name: "Request a scoped quotation", exact: true }).count()) === 1,
    `${viewport.name}: quotation path is missing`,
  );

  await investmentTab.press("Home");
  const briefTab = room.getByRole("tab", { name: "The brief", exact: true });
  assert((await briefTab.getAttribute("aria-selected")) === "true", `${viewport.name}: Home key did not return to the brief`);

  const scopeTab = room.getByRole("tab", { name: "What arrives", exact: true });
  await scopeTab.click();
  await waitForText(room, "Included deliverables", `${viewport.name}: included deliverables`);
  await waitForText(room, "Quoted separately where relevant", `${viewport.name}: separate additions`);
  const roomText = ((await room.textContent()) || "").replace(/\s+/g, " ");
  for (const deliverable of [
    "Everything in Foundation",
    "Full brand audit & repositioning",
    "Voice & messaging alignment across channels",
    "Campaign concept & visual direction",
    "Website content structure",
    "3 months of async support",
  ]) {
    assert(roomText.includes(deliverable), `${viewport.name}: missing real deliverable ${deliverable}`);
  }
  for (const addition of ["Production", "Media", "Printing", "Development", "Travel", "Licensing"]) {
    assert(roomText.includes(addition), `${viewport.name}: missing separately quoted addition ${addition}`);
  }

  const comparisonToggle = desire.locator('button[aria-label="Compare all three side by side"]');
  await assertTouchTargets(comparisonToggle, 44, `${viewport.name}: comparison toggle`);
  await comparisonToggle.click();
  assert((await comparisonToggle.getAttribute("aria-pressed")) === "true", `${viewport.name}: comparison did not open`);
  assert((await room.count()) === 0, `${viewport.name}: Project Room remains mounted over comparison mode`);
  for (const packageName of ["Foundation", "Full Brand System", "Brand Partnership"]) {
    assert(
      (await desire.getByRole("link", { name: new RegExp(`Start with ${packageName}`, "i") }).count()) === 1,
      `${viewport.name}: comparison is missing ${packageName}`,
    );
  }

  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert(
    widths.html <= widths.viewport + 2 && widths.body <= widths.viewport + 2,
    `${viewport.name}: horizontal overflow ${JSON.stringify(widths)}`,
  );
  assert(consoleErrors.length === 0, `${viewport.name}: runtime errors ${JSON.stringify(consoleErrors.slice(0, 8))}`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  await page.screenshot({
    path: path.join(OUTPUT_DIR, `project-room-${viewport.name}.png`),
    animations: "disabled",
  });

  await context.close();
  return {
    viewport: viewport.name,
    choices: 3,
    chapters: 4,
    phases: 6,
    deliverables: 6,
    separateAdditions: 6,
    comparisonPackages: 3,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const viewport of VIEWPORTS) {
      results.push(await auditViewport(browser, viewport));
    }
  } finally {
    await browser.close();
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "project-room-audit.json"),
    JSON.stringify({ baseUrl: BASE_URL, generatedAt: new Date().toISOString(), results }, null, 2),
  );
  console.log(`Project Room gate passed for ${results.length} viewports.`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
