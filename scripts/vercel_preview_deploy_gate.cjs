const { spawnSync } = require("node:child_process");
const assert = require("node:assert/strict");

const CONTROLLED_PREVIEW_BRANCH = "august-8-isolated";
const DEPLOY_MARKER = /\[deploy\]/i;
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

function shouldIgnoreControlledPreview({ branch, message }) {
  return branch === CONTROLLED_PREVIEW_BRANCH && !DEPLOY_MARKER.test(message);
}

function runSelfTest() {
  assert.equal(
    shouldIgnoreControlledPreview({
      branch: CONTROLLED_PREVIEW_BRANCH,
      message: "Refine the services copy",
    }),
    true,
  );
  assert.equal(
    shouldIgnoreControlledPreview({
      branch: CONTROLLED_PREVIEW_BRANCH,
      message: "Publish the audited site [deploy]",
    }),
    false,
  );
  assert.equal(
    shouldIgnoreControlledPreview({
      branch: "main",
      message: "Publish the audited site",
    }),
    false,
  );
  console.log("Vercel preview deployment gate passed.");
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

if (shouldIgnoreControlledPreview({ branch, message })) {
  console.log(
    `Ignoring ${CONTROLLED_PREVIEW_BRANCH} until a commit message includes [deploy].`,
  );
  process.exit(0);
}

if (branch === CONTROLLED_PREVIEW_BRANCH) {
  console.log("Deliberate preview release detected. Continuing the build.");
  process.exit(1);
}

preserveRelevantChangeCheck();
