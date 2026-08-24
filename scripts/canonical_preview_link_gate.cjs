#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const CANONICAL_PREVIEW =
  "https://branding-tatva-git-august-8-isolated-suman22.vercel.app";
const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".cjs",
  ".mjs",
  ".json",
  ".md",
  ".txt",
  ".yml",
  ".yaml",
  ".css",
  ".html",
]);
const SKIP_DIRECTORIES = new Set([
  ".git",
  ".github",
  ".next",
  "docs",
  "node_modules",
  "artifacts",
]);
const BRANDING_TATVA_VERCEL_URL =
  /https:\/\/[A-Za-z0-9.-]*branding-tatva[A-Za-z0-9.-]*\.vercel\.app(?:\/[A-Za-z0-9_./?=&%#-]*)?/g;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && SKIP_DIRECTORIES.has(entry.name)) return [];
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    return [absolute];
  });
}

const violations = [];
for (const file of walk(ROOT)) {
  if (!TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(BRANDING_TATVA_VERCEL_URL)) {
    const url = match[0].replace(/[.,;:)'"\]]+$/, "");
    if (url.startsWith(CANONICAL_PREVIEW)) continue;
    const line = source.slice(0, match.index).split("\n").length;
    violations.push({
      file: path.relative(ROOT, file).replaceAll(path.sep, "/"),
      line,
      url,
    });
  }
}

if (violations.length) {
  console.error(
    JSON.stringify(
      {
        result: "failed",
        canonicalPreview: CANONICAL_PREVIEW,
        violations,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      result: "passed",
      canonicalPreview: CANONICAL_PREVIEW,
      message: "No obsolete Branding Tatva Vercel URLs remain in tracked text source.",
    },
    null,
    2,
  ),
);
