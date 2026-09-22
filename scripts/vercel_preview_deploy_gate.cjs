const { spawnSync } = require("node:child_process");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const CONTROLLED_PREVIEW_BRANCH = "august-8-isolated";
const TRIGGER_MESSAGE = /^Request release (\d+) through Git integration \[deploy\] \[release:\1\](?:\s|$)/;
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

function shouldIgnoreControlledPreview({ branch, message, manifestRelease }) {
  if (branch !== CONTROLLED_PREVIEW_BRANCH) return false;
  const trigger = TRIGGER_MESSAGE.exec(message);
  return !trigger || Number(trigger[1]) !== Number(manifestRelease);
}

function runSelfTest() {
  const check = (message, manifestRelease = 514) => shouldIgnoreControlledPreview({
    branch: CONTROLLED_PREVIEW_BRANCH, message, manifestRelease,
  });
  // A source request arriving while the trigger was enabled must never build.
  assert.equal(check("Improve Services [deploy] [release:514]"), true);
  assert.equal(check("Request release 514 through Git integration [deploy] [release:514]"), false);
  assert.equal(check("Request release 513 through Git integration [deploy] [release:513]"), true);
  assert.equal(check("Request release 514 through Git integration [deploy] [release:513]"), true);
  assert.equal(check("Return august preview to controlled mode"), true);
  assert.equal(check("Retry [deploy] [release:514]"), true);
  assert.equal(shouldIgnoreControlledPreview({ branch: "main", message: "Publish the audited site" }), false);
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
const manifest = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), RELEASE_MANIFEST), "utf8"),
);
if (shouldIgnoreControlledPreview({ branch, message, manifestRelease: manifest.release })) {
  console.log(
    `Ignoring ${CONTROLLED_PREVIEW_BRANCH}. Only the workflow trigger for the current ${RELEASE_MANIFEST} release can build.`,
  );
  process.exit(0);
}

if (branch === CONTROLLED_PREVIEW_BRANCH) {
  console.log(
    `Deliberate preview release detected through ${RELEASE_MANIFEST} release ${manifest.release}. Continuing the build.`,
  );
  process.exit(1);
}

preserveRelevantChangeCheck();
