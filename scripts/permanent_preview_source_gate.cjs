#!/usr/bin/env node

const PREVIEW_URL = (
  process.env.PREVIEW_URL ||
  "https://branding-tatva-git-homepage-cinematic-recovery-suman22.vercel.app"
).replace(/\/$/, "");
const REPOSITORY = process.env.GITHUB_REPOSITORY ||
  "sumansharmabharadwaj-ship-it/branding-tatva";
const BRANCH = process.env.CANONICAL_BRANCH || "homepage-cinematic-recovery";
const TIMEOUT_MS = Number(process.env.GATE_TIMEOUT_MS || 12 * 60 * 1000);
const POLL_MS = Number(process.env.GATE_POLL_MS || 15 * 1000);
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 20 * 1000);
const token = process.env.GITHUB_TOKEN;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "branding-tatva-release-gate",
        ...(options.headers || {}),
      },
    });
    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { raw: text.slice(0, 500) };
    }
    return { ok: response.ok, status: response.status, body };
  } finally {
    clearTimeout(timer);
  }
}

async function currentBranchHead() {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const result = await requestJson(
    `https://api.github.com/repos/${REPOSITORY}/branches/${encodeURIComponent(BRANCH)}`,
    { headers },
  );
  if (!result.ok || !result.body?.commit?.sha) {
    throw new Error(
      `Unable to resolve ${REPOSITORY}#${BRANCH}: HTTP ${result.status}`,
    );
  }
  return result.body.commit.sha;
}

async function routeStatus(pathname) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${PREVIEW_URL}${pathname}`, {
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "branding-tatva-release-gate" },
    });
    return {
      pathname,
      status: response.status,
      ok: response.status >= 200 && response.status < 400,
      finalUrl: response.url,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function inspect() {
  const expectedHead = await currentBranchHead();
  const verification = await requestJson(`${PREVIEW_URL}/api/verification`);
  const release = await requestJson(`${PREVIEW_URL}/api/release`);

  const deployedHead = verification.body?.runtime?.commit || release.body?.commit || null;
  const deployedBranch =
    verification.body?.runtime?.branch || release.body?.branch || null;
  const alias =
    verification.body?.permanentReviewAlias ||
    release.body?.permanentReviewAlias ||
    null;
  const backlog =
    verification.body?.canonicalBacklog || release.body?.canonicalBacklog || null;

  const sourceMatches =
    verification.ok &&
    release.ok &&
    deployedHead === expectedHead &&
    deployedBranch === BRANCH &&
    alias === `${PREVIEW_URL}/` &&
    backlog === "docs/MASTER_PENDING_WORK.md";

  return {
    checkedAt: new Date().toISOString(),
    previewUrl: PREVIEW_URL,
    repository: REPOSITORY,
    canonicalBranch: BRANCH,
    expectedHead,
    deployedHead,
    deployedBranch,
    alias,
    backlog,
    verificationStatus: verification.status,
    releaseStatus: release.status,
    sourceMatches,
  };
}

async function main() {
  const started = Date.now();
  let last = null;
  let lastError = null;

  while (Date.now() - started < TIMEOUT_MS) {
    try {
      last = await inspect();
      lastError = null;
      process.stdout.write(`${JSON.stringify(last)}\n`);
      if (last.sourceMatches) break;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      process.stderr.write(`[preview-source-gate] ${lastError}\n`);
    }
    await sleep(POLL_MS);
  }

  if (!last?.sourceMatches) {
    process.stderr.write(
      `${JSON.stringify(
        {
          result: "failed",
          reason: lastError || "Permanent alias did not converge to the canonical branch head before timeout.",
          last,
        },
        null,
        2,
      )}\n`,
    );
    process.exit(1);
  }

  const requiredRoutes = [
    "/",
    "/services",
    "/work",
    "/insights",
    "/about",
    "/contact",
  ];
  const routes = [];
  for (const pathname of requiredRoutes) {
    routes.push(await routeStatus(pathname));
  }

  const failedRoutes = routes.filter((route) => !route.ok);
  const report = {
    result: failedRoutes.length ? "failed" : "passed",
    source: last,
    routes,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (failedRoutes.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
