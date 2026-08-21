const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => {
  console.error(`HOME BIBLE GATE: ${message}`);
  process.exitCode = 1;
};
const expect = (condition, message) => {
  if (!condition) fail(message);
};

const page = read("src/app/page.tsx");
const recognition = read("src/sections/Home/RecognitionMirror.tsx");
const services = read("src/sections/Home/HomeServicesPreview.tsx");
const health = read("src/sections/Home/HomeHealthCheck.tsx");
const insights = read("src/sections/Home/HomeInsightsPreview.tsx");
const selectedWork = read("src/sections/Home/SelectedWorkPinned.tsx");

const requiredOrder = [
  "<CinematicHero",
  "<RecognitionMirror />",
  "<ElementsSection",
  "<SelectedWorkPinned",
  "<ProcessSection",
  "<HomeServicesPreview />",
  "<HomeHealthCheck />",
  "<HomeInsightsPreview />",
];
let previousIndex = -1;
for (const token of requiredOrder) {
  const index = page.indexOf(token);
  expect(index > previousIndex, `Homepage scene is missing or out of order: ${token}`);
  previousIndex = index;
}

for (const [source, token] of [
  [recognition, 'id="recognition-mirror"'],
  [services, 'id="ways-to-work"'],
  [health, 'id="brand-health-check"'],
  [insights, 'id="thinking"'],
]) {
  expect(source.includes(token), `Required scene anchor is missing: ${token}`);
  expect(source.includes("min-h-svh"), `Scene does not carry the one-screen minimum: ${token}`);
  expect(!source.includes("pin: true"), `Forbidden pin:true found in ${token}`);
}

expect(health.includes('resultHref="/work#services"'), "Health Check must route to the merged Work + Services page.");
expect(page.includes('href="/contact"'), "Hero must expose a direct enquiry action.");
expect(page.includes('href="/work"'), "Hero must expose a proof action.");
expect(insights.includes('href="/insights"'), "Insights preview must link to the canonical Insights hub.");

const falseProof = [
  "The same process that took one client",
  "5 real client engagements",
  "Everything below actually happened",
  "verified after launch",
];
for (const claim of falseProof) {
  expect(!page.includes(claim) && !selectedWork.includes(claim), `Unverified Homepage proof remains: ${claim}`);
}

const media = [
  ["public/videos/higgsfield-element-earth.mp4", "public/images/higgsfield-element-earth.jpg"],
  ["public/videos/cinematic-waterlight.mp4", "public/images/cinematic-waterlight-poster.jpg"],
];
for (const pair of media) {
  for (const file of pair) expect(fs.existsSync(path.join(root, file)), `Required media asset is missing: ${file}`);
}

if (!process.exitCode) console.log("HOME BIBLE GATE: passed");
