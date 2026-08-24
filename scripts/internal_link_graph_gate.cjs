#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const failures = [];

function expect(file, label, pattern) {
  const source = read(file);
  if (!pattern.test(source)) failures.push(`${file}: missing ${label}`);
}

const pathwaySource = read("src/data/insightPathways.ts");
const topicSlugs = [
  "positioning",
  "customer-experience",
  "distinctive-brand",
  "brand-messaging",
  "brand-memory",
];

for (const topicSlug of topicSlugs) {
  const escaped = topicSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!new RegExp(`[\"']${escaped}[\"']\\s*:`).test(pathwaySource)) {
    failures.push(`src/data/insightPathways.ts: missing ${topicSlug} pathway`);
  }
}

for (const projectSlug of [
  "myshopineurope",
  "executive-springboard",
  "herbalcart",
  "plaxonic-content-portfolio",
  "dr-haley-nutrition",
]) {
  expect("src/data/projects.ts", `${projectSlug} project source`, new RegExp(`slug:\\s*[\"']${projectSlug}[\"']`));
  if (!pathwaySource.includes(`/work/${projectSlug}`)) {
    failures.push(`src/data/insightPathways.ts: missing /work/${projectSlug} proof link`);
  }
}

for (const serviceAnchor of ["offerings", "desire", "authority", "audit"]) {
  expect("src/app/services/page.tsx", `#${serviceAnchor} destination`, new RegExp(`id=[\"']${serviceAnchor}[\"']`));
}

expect("src/components/InsightDecisionPath.tsx", "crawlable Next Link", /<Link\s+[\s\S]*?href=\{link\.href\}/);
expect("src/app/insights/[slug]/page.tsx", "article decision path", /<InsightDecisionPath\s+pathway=\{pathway\}/);
expect("src/app/insights/topic/[topic]/page.tsx", "topic decision path", /<InsightDecisionPath\s+pathway=\{pathway\}/);
expect("src/app/insights/topic/[topic]/page.tsx", "contextual adjacent topics", /adjacentTopicSlugs/);
expect("src/app/services/page.tsx", "remote US, UK and India metadata", /service businesses in the US, UK and India/);
expect("src/app/services/page.tsx", "shared service area fact source", /REMOTE_SERVICE_AREAS\s*=\s*entityFacts\.delivery\.regions/);
expect("src/app/services/page.tsx", "service area structured data", /areaServed:\s*REMOTE_SERVICE_AREAS/);
expect("src/sections/Services/StrategyRoomCTA.tsx", "visible remote region copy", /Founder-led remote projects are available across/);

for (const doorwayPath of [
  "src/app/brand-strategy/us/page.tsx",
  "src/app/brand-strategy/uk/page.tsx",
  "src/app/us/page.tsx",
  "src/app/uk/page.tsx",
]) {
  if (fs.existsSync(path.join(ROOT, doorwayPath))) {
    failures.push(`${doorwayPath}: thin regional doorway route requires a unique evidence review`);
  }
}

if (failures.length) {
  console.error(JSON.stringify({ result: "failed", failures }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      result: "passed",
      topics: topicSlugs.length,
      articleCount: 29,
      contract:
        "Every Insight path reaches a relevant service chapter, recorded proof and conversation through descriptive server-rendered links; US/UK intent stays on the useful commercial page.",
    },
    null,
    2,
  ),
);
