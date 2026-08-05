const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });

  const snapshots = [];
  for (let index = 0; index < 18; index += 1) {
    await page.waitForTimeout(250);
    snapshots.push(
      await page.evaluate(() => {
        const veil = document.querySelector("[data-page-load-veil]");
        const style = veil ? window.getComputedStyle(veil) : null;
        return {
          at: Math.round(performance.now()),
          count: document.querySelectorAll("[data-page-load-veil]").length,
          state: veil?.getAttribute("data-page-load-state") || null,
          opacity: style?.opacity || null,
          phaseCopy:
            veil?.querySelector("p")?.textContent?.trim() || null,
          sessionSeen:
            window.sessionStorage.getItem("branding-tatva-v4-prelude-seen"),
          homeMounted: document.documentElement.classList.contains("home-v4-mounted"),
          nextRootChildren: document.body.children.length,
        };
      }),
    );
  }

  console.log("V4 loader snapshots:", JSON.stringify(snapshots, null, 2));
  if (errors.length) console.log("V4 loader browser errors:", errors.join("\n"));

  await context.close();
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
