#!/usr/bin/env node

const { execFileSync } = require("node:child_process");

const PREVIEW_URL = (
  process.env.PREVIEW_URL ||
  "https://branding-tatva-git-homepage-cinematic-recovery-suman22.vercel.app"
).replace(/\/$/, "");
const REPOSITORY =
  process.env.GITHUB_REPOSITORY ||
  "sumansharmabharadwaj-ship-it/branding-tatva";
const BRANCH = process.env.CANONICAL_BRANCH || "homepage-cinematic-recovery";
const TIMEOUT_MS = Number(process.env.GATE_TIMEOUT_MS || 12 * 60 * 1000);
const POLL_MS = Number(process.env.GATE_POLL_MS || 15 * 1000);
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 20 * 1000);
const token = process.env.GITHUB_TOKEN;
const bypassSecret = (process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "").trim();
const explicitDeployableSha = (process.env.EXPECTED_DEPLOYABLE_SHA || "").trim();

// This mirrors vercel.json's ignoreCommand. Workflow-only commits must never
// make the source gate wait for a deployment Vercel was correctly told to skip.
const DEPLOYABLE_PATHS = [
  "src",
  "public",
  "package.json",
  "pnpm-lock.yaml",
  "next.config.ts",
  "postcss.config.mjs",
  "tsconfig.json",
  "vercel.json",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function protectionHeaders() {
  if (!bypassSecret) return {};
  return {
    "x-vercel-protection-bypass": bypassSecret,
    "x-vercel-set-bypass-cookie": "true",
  };
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
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      body,
    };
  } finally {
    clearTimeout(timer);
  }
}

function localDeployableHead() {
  try {
    const sha = execFileSync(
      "git",
      ["log", "-1", "--format=%H", "--", ...DEPLOYABLE_PATHS],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return sha || null;
  } catch {
    return null;
  }
}

async function githubDeployableHead() {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const candidates = [];

  for (const deployablePath of DEPLOYABLE_PATHS) {
    const query = new URLSearchParams({
      sha: BRANCH,
      path: deployablePath,
      per_page: "1",
    });
    const result = await requestJson(
      `https://api.github.com/repos/${REPOSITORY}/commits?${query}`,
      { headers },
    );
    const commit = Array.isArray(result.body) ? result.body[0] : null;
    if (!result.ok || !commit?.sha) continue;
    const date =
      commit.commit?.committer?.date ||
      commit.commit?.author?.date ||
      "1970-01-01T00:00:00.000Z";
    candidates.push({ sha: commit.sha, date, path: deployablePath });
  }

  candidates.sort((left, right) => Date.parse(right.date) - Date.parse(left.date));
  if (!candidates[0]?.sha) {
    throw new Error(
      `Unable to resolve the latest deployable commit for ${REPOSITORY}#${BRANCH}.`,
    );
  }
  return { sha: candidates[0].sha, source: "github-path-history" };
}

async function currentDeployableHead() {
  if (explicitDeployableSha) {
    return { sha: explicitDeployableSha, source: "environment" };
  }

  const local = localDeployableHead();
  if (local) return { sha: local, source: "local-git-history" };
  return githubDeployableHead();
}

async function routeStatus(pathname) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${PREVIEW_URL}${pathname}`, {
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "branding-tatva-release-gate",
        ...protectionHeaders(),
      },
    });
    const authRedirected = response.url.includes("vercel.com/sso-api");
    return {
      pathname,
      status: response.status,
      ok:
        response.status >= 200 &&
        response.status < 400 &&
        !authRedirected,
      finalUrl: response.url,
      authRedirected,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function inspect() {
  const expected = await currentDeployableHead();
  const previewHeaders = protectionHeaders();
  const verification = await requestJson(`${PREVIEW_URL}/api/verification`, {
    headers: previewHeaders,
  });
  const release = await requestJson(`${PREVIEW_URL}/api/release`, {
    headers: previewHeaders,
  });

  const deployedHead =
    verification.body?.runtime?.commit || release.body?.commit || null;
  const deployedBranch =
    verification.body?.runtime?.branch || release.body?.branch || null;
  const alias =
    verification.body?.permanentReviewAlias ||
    release.body?.permanentReviewAlias ||
    null;
  const backlog =
    verification.body?.canonicalBacklog ||
    release.body?.canonicalBacklog ||
    null;
  const accessBlocked = [verification.status, release.status].some((status) =>
    [401, 403].includes(status),
  );
  const authRedirected = [verification.finalUrl, release.finalUrl].some((url) =>
    String(url || "").includes("vercel.com/sso-api"),
  );

  const sourceMatches =
    verification.ok &&
    release.ok &&
    !authRedirected &&
    deployedHead === expected.sha &&
    deployedBranch === BRANCH &&
    alias === `${PREVIEW_URL}/` &&
    backlog === "docs/MASTER_PENDING_WORK.md";

  return {
    checkedAt: new Date().toISOString(),
    previewUrl: PREVIEW_URL,
    repository: REPOSITORY,
    canonicalBranch: BRANCH,
    expectedHead: expected.sha,
    expectedHeadSource: expected.source,
    deployedHead,
    deployedBranch,
    alias,
    backlog,
    verificationStatus: verification.status,
    releaseStatus: release.status,
    bypassConfigured: Boolean(bypassSecret),
    accessBlocked,
    authRedirected,
    sourceMatches,
  };
}

function terminalAccessReason(result) {
  if (!result?.accessBlocked && !result?.authRedirected) return null;
  if (!result.bypassConfigured) {
    return (
      "The permanent preview is protected, but the " +
      "VERCEL_AUTOMATION_BYPASS_SECRET repository secret is not configured. " +
      "Source verification cannot authenticate and will not waste twelve minutes polling."
    );
  }
  return (
    "The permanent preview rejected the configured Vercel automation bypass. " +
    "Rotate or re-authorize VERCEL_AUTOMATION_BYPASS_SECRET before rerunning the gate."
  );
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

      const accessReason = terminalAccessReason(last);
      if (accessReason) {
        lastError = accessReason;
        break;
      }
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
          reason:
            lastError ||
            "Permanent alias did not converge to the canonical deployable source before timeout.",
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
