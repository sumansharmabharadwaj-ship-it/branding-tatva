const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE_URL = (process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const OUTPUT_DIR = path.join(process.cwd(), "about-memory-audit");
const TRIPS = Number(process.env.ABOUT_MEMORY_TRIPS || 4);
const WARMUP_TRIPS = Number(process.env.ABOUT_MEMORY_WARMUPS || 1);
const ENFORCE = process.env.ABOUT_MEMORY_ENFORCE !== "0";
const MAX_NODE_SLOPE = Number(process.env.ABOUT_MEMORY_MAX_NODE_SLOPE || 240);
const MAX_NODE_GROWTH = Number(process.env.ABOUT_MEMORY_MAX_NODE_GROWTH || 850);
const MAX_LISTENER_GROWTH = Number(process.env.ABOUT_MEMORY_MAX_LISTENER_GROWTH || 24);
const MOCK_VIDEO_PATH = process.env.ABOUT_MEMORY_MOCK_VIDEO || "";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function linearSlope(values) {
  if (values.length < 2) return 0;
  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((sum, value) => sum + value, 0) / n;
  let numerator = 0;
  let denominator = 0;
  for (let index = 0; index < n; index += 1) {
    const x = index - xMean;
    numerator += x * (values[index] - yMean);
    denominator += x * x;
  }
  return denominator ? numerator / denominator : 0;
}

async function waitForPrelude(page, label) {
  const loader = page.locator("[data-page-load-veil]");
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: "detached", timeout: 10_000 }).catch(() => {});
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  assert((await loader.count()) === 0, `${label}: page-load veil did not clear`);
}

async function waitForPathname(page, pathname, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (new URL(page.url()).pathname === pathname) return;
    await page.waitForTimeout(100);
  }
  throw new Error(`about/memory: route did not reach ${pathname}; current=${page.url()}`);
}

async function clickRoute(page, pathname) {
  const routeLink = page.locator(`a[href="${pathname}"]:visible`).first();
  await routeLink.waitFor({ state: "visible", timeout: 8_000 });

  // Next's client router changes location without a document load. Playwright's
  // waitForURL waits for the load state by default and can therefore time out
  // after an otherwise successful SPA transition. Dispatching the anchor's
  // native click from inside the page preserves Next's client-router event
  // while avoiding Playwright's viewport actionability check after the probe
  // intentionally scrolls the long About page to its final chapter.
  await routeLink.evaluate((node) => node.click());
  await waitForPathname(page, pathname);

  await page.locator("main#main-content").waitFor({ state: "visible", timeout: 10_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(450);
}

async function visitAboutAndReturn(page, label) {
  await clickRoute(page, "/about");
  assert(new URL(page.url()).pathname === "/about", `${label}: About route did not open`);

  // Exercise every mounted About chapter, including the closing video and
  // scroll-linked effects, rather than measuring only the first viewport.
  await page.evaluate(() => {
    const target = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const lenis = window.__lenisInstance;
    if (lenis?.scrollTo) lenis.scrollTo(target, { immediate: true });
    else window.scrollTo(0, target);
  });
  await page.waitForTimeout(650);

  await clickRoute(page, "/work");
  assert(new URL(page.url()).pathname === "/work", `${label}: Work route did not return`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
}

async function forceCollection(client, page) {
  await page.waitForTimeout(250);
  for (let pass = 0; pass < 3; pass += 1) {
    await client.send("HeapProfiler.collectGarbage");
    await page.waitForTimeout(120);
  }
}

async function detachedDomCount(client) {
  try {
    const result = await client.send("DOM.getDetachedDomNodes", { includeWhitespace: "none" });
    return Array.isArray(result.detachedNodes) ? result.detachedNodes.length : null;
  } catch {
    return null;
  }
}

async function heapUsed(client) {
  try {
    const result = await client.send("Performance.getMetrics");
    return result.metrics.find((metric) => metric.name === "JSHeapUsedSize")?.value ?? null;
  } catch {
    return null;
  }
}

async function sampleMemory(client, page, label) {
  await forceCollection(client, page);
  const counters = await client.send("Memory.getDOMCounters");
  const routeState = await page.evaluate(() => ({
    pathname: location.pathname,
    videos: document.querySelectorAll("video").length,
    sources: document.querySelectorAll("video source").length,
    nodes: document.querySelectorAll("*").length,
  }));
  return {
    label,
    ...counters,
    detachedDomTrees: await detachedDomCount(client),
    jsHeapUsedSize: await heapUsed(client),
    routeState,
  };
}

(async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--js-flags=--expose-gc"],
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await client.send("Performance.enable");
    await client.send("DOM.enable");
    await client.send("HeapProfiler.enable");

    if (MOCK_VIDEO_PATH && fs.existsSync(MOCK_VIDEO_PATH)) {
      const videoBody = fs.readFileSync(MOCK_VIDEO_PATH);
      await page.route("**/videos/**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "video/mp4",
          body: videoBody,
          headers: {
            "accept-ranges": "bytes",
            "cache-control": "public, max-age=3600",
          },
        });
      });
    }

    await page.goto(`${BASE_URL}/work`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await waitForPrelude(page, "about/memory");

    for (let trip = 0; trip < WARMUP_TRIPS; trip += 1) {
      await visitAboutAndReturn(page, `warmup-${trip + 1}`);
    }

    const samples = [await sampleMemory(client, page, "baseline")];
    for (let trip = 0; trip < TRIPS; trip += 1) {
      await visitAboutAndReturn(page, `measured-${trip + 1}`);
      samples.push(await sampleMemory(client, page, `after-${trip + 1}`));
    }

    const nodeValues = samples.map((sample) => sample.nodes);
    const listenerValues = samples.map((sample) => sample.jsEventListeners);
    const documentValues = samples.map((sample) => sample.documents);
    const detachedValues = samples
      .map((sample) => sample.detachedDomTrees)
      .filter((value) => typeof value === "number");
    const increments = nodeValues.slice(1).map((value, index) => value - nodeValues[index]);

    const summary = {
      baseUrl: BASE_URL,
      warmupTrips: WARMUP_TRIPS,
      measuredTrips: TRIPS,
      enforced: ENFORCE,
      thresholds: {
        maxNodeSlopePerTrip: MAX_NODE_SLOPE,
        maxTotalNodeGrowth: MAX_NODE_GROWTH,
        maxListenerGrowth: MAX_LISTENER_GROWTH,
      },
      result: {
        nodeSlopePerTrip: Number(linearSlope(nodeValues).toFixed(2)),
        totalNodeGrowth: nodeValues.at(-1) - nodeValues[0],
        maxSingleTripNodeGrowth: Math.max(...increments),
        listenerGrowth: listenerValues.at(-1) - listenerValues[0],
        documentGrowth: documentValues.at(-1) - documentValues[0],
        detachedDomTreeGrowth:
          detachedValues.length === samples.length
            ? detachedValues.at(-1) - detachedValues[0]
            : null,
      },
      samples,
      pageErrors,
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, "about-route-memory.json"),
      JSON.stringify(summary, null, 2),
    );
    console.log(JSON.stringify(summary, null, 2));

    assert(pageErrors.length === 0, `about/memory: page exceptions ${JSON.stringify(pageErrors.slice(0, 8))}`);
    if (ENFORCE) {
      assert(
        summary.result.nodeSlopePerTrip <= MAX_NODE_SLOPE,
        `about/memory: retained-node slope ${summary.result.nodeSlopePerTrip} exceeds ${MAX_NODE_SLOPE} nodes/trip`,
      );
      assert(
        summary.result.totalNodeGrowth <= MAX_NODE_GROWTH,
        `about/memory: total retained-node growth ${summary.result.totalNodeGrowth} exceeds ${MAX_NODE_GROWTH}`,
      );
      assert(
        summary.result.listenerGrowth <= MAX_LISTENER_GROWTH,
        `about/memory: listener growth ${summary.result.listenerGrowth} exceeds ${MAX_LISTENER_GROWTH}`,
      );
    }
  } finally {
    await context.close();
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
