#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const failures = [];

function requireText(file, patterns) {
  const source = read(file);
  for (const [label, pattern] of patterns) {
    if (!pattern.test(source)) failures.push(`${file}: missing ${label}`);
  }
}

requireText("src/lib/searchVisibility.ts", [
  ["production-only index switch", /VERCEL_ENV\s*===\s*["']production["']/],
  ["preview disallow", /disallow:\s*["']\/["']/],
  ["Google crawler rule", /Googlebot/],
  ["Bing crawler rule", /Bingbot/],
  ["OpenAI search crawler rule", /OAI-SearchBot/],
  ["user-requested ChatGPT crawler rule", /ChatGPT-User/],
]);

requireText("src/app/layout.tsx", [
  ["shared search robots metadata", /searchRobotsMetadata\(\)/],
  ["truthful Organization schema", /"@type":\s*"Organization"/],
  ["verified entity fact source", /entityFacts/],
]);

requireText("src/app/insights/[slug]/page.tsx", [
  ["preview-safe article robots metadata", /robots:\s*searchRobotsMetadata\(\)/],
  ["visible-source citation boundary", /sources\.length\s*>\s*0/],
]);

requireText("src/app/robots.ts", [
  ["central crawler rules", /searchCrawlerRules\(\)/],
  ["canonical sitemap", /sitemap\.xml/],
]);

requireText("src/app/sitemap.ts", [
  ["editorial policy route", /editorial-policy/],
  ["canonical insight registry", /insightPosts/],
]);

requireText("public/llms.txt", [
  ["editorial policy disclosure", /Editorial and evidence policy/i],
  ["canonical insight feed", /insights\/feed\.xml/],
]);

requireText("src/lib/releaseContract.ts", [
  ["August 8 branch", /august-8-isolated/],
  ["August 8 review alias", /branding-tatva-git-august-8-isolated-suman22\.vercel\.app/],
]);

requireText("vercel.json", [
  ["August 8 deployment alias", /branding-tatva-git-august-8-isolated-suman22\.vercel\.app/],
]);

if (failures.length) {
  console.error(JSON.stringify({ result: "failed", failures }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      result: "passed",
      contract:
        "Preview-safe indexing, search/AI crawler access, entity claims, editorial transparency and August 8 release identity are aligned.",
    },
    null,
    2,
  ),
);
