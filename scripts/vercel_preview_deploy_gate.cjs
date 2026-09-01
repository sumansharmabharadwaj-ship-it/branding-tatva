const { spawnSync } = require("node:child_process");
const assert = require("node:assert/strict");

const CONTROLLED_PREVIEW_BRANCH = "august-8-isolated";
const DEPLOY_MARKER = /\[deploy\]/i;
const RELEASE_MANIFEST = "vercel-preview-release.json";
const RELEVANT_PATHS = [
  "src",
  "public",
  "scripts",
  "package.json",
  "pnpm-lock.yaml",
  "next.config.ts",
  "postcss.config.mjs",
  "tsconfig.json",
  "vercel.json",
  ".github",
];

function shouldIgnoreControlledPreview({
  branch,
  message,
  releaseManifestChanged,
}) {
  return (
    branch === CONTROLLED_PREVIEW_BRANCH &&
    (!DEPLOY_MARKER.test(message) || !releaseManifestChanged)
  );
}

function runSelfTest() {
  assert.equal(
    shouldIgnoreControlledPreview({
      branch: CONTROLLED_PREVIEW_BRANCH,
      message: "Refine the services copy",
      releaseManifestChanged: true,
    }),
    true,
  );
  assert.equal(
    shouldIgnoreControlledPreview({
      branch: CONTROLLED_PREVIEW_BRANCH,
      message: "Publish the audited site [deploy]",
      releaseManifestChanged: false,
    }),
    true,
  );
  assert.equal(
    shouldIgnoreControlledPreview({
      branch: CONTROLLED_PREVIEW_BRANCH,
      message: "Publish the audited site [deploy]",
      releaseManifestChanged: true,
    }),
    false,
  );
  assert.equal(
    shouldIgnoreControlledPreview({
      branch: "main",
      message: "Publish the audited site",
      releaseManifestChanged: false,
    }),
    false,
  );
  console.log("Vercel preview deployment gate passed.");
}

function pathChanged(path) {
  const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA || "HEAD^";
  const result = spawnSync(
    "git",
    ["diff", "--quiet", previousSha, "HEAD", "--", path],
    { stdio: "inherit" },
  );

  if (result.status === 0) return false;
  if (result.status === 1) return true;

  console.warn(
    `Could not verify whether ${path} changed. Ignoring this preview build to protect the build allowance.`,
  );
  return false;
}

function preserveRelevantChangeCheck() {
  const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA || "HEAD^";
  const result = spawnSync(
    "git",
    ["diff", "--quiet", previousSha, "HEAD", "--", ...RELEVANT_PATHS],
    { stdio: "inherit" },
  );

  if (result.status === 0) {
    console.log("No website changes detected. Ignoring this build.");
    process.exit(0);
  }

  if (result.status !== 1) {
    console.warn("The change check was inconclusive. Continuing the build safely.");
  }

  process.exit(1);
}

if (process.argv.includes("--self-test")) {
  runSelfTest();
  process.exit(0);
}

const branch = process.env.VERCEL_GIT_COMMIT_REF || "";
const message = process.env.VERCEL_GIT_COMMIT_MESSAGE || "";
const releaseManifestChanged =
  branch === CONTROLLED_PREVIEW_BRANCH && pathChanged(RELEASE_MANIFEST);

if (
  shouldIgnoreControlledPreview({
    branch,
    message,
    releaseManifestChanged,
  })
) {
  console.log(
    `Ignoring ${CONTROLLED_PREVIEW_BRANCH}. A preview requires [deploy] and a ${RELEASE_MANIFEST} update in the same commit.`,
  );
  process.exit(0);
}

if (branch === CONTROLLED_PREVIEW_BRANCH) {
  console.log(
    `Deliberate preview release detected through ${RELEASE_MANIFEST}. Continuing the build.`,
  );
  process.exit(1);
}

preserveRelevantChangeCheck();
