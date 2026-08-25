const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(
  path.join(root, "src/sections/HomeV4/HomeV4Experience.tsx"),
  "utf8",
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const sequence = [
  "<V4OpeningScene />",
  "<HomeBrandHealthCheck />",
  "<V4HiddenCostScene />",
  'data-home-v4-chapter="evidence"',
  'data-home-v4-chapter="paths"',
  'data-home-v4-chapter="process"',
  'data-home-v4-chapter="studio"',
  'data-home-v4-chapter="decision"',
  'data-home-v4-chapter="invitation"',
];

let previous = -1;
for (const marker of sequence) {
  const index = source.indexOf(marker);
  assert(index > previous, `Homepage chapter order is missing or drifted at ${marker}.`);
  previous = index;
}

for (const removed of [
  "V4RecognitionScene",
  "BrandFoundationScene",
  "TatvaSystemLab",
  "HomeInsightsPreview",
  "HomeV4ProcessTempo",
  "HomeV4ScrollCamera",
  "HomeV4HeaderDirector",
]) {
  assert(!source.includes(removed), `${removed} restored a removed chapter or competing runtime.`);
}

console.log("Homepage conversion sequence gate passed: one focused nine-chapter journey verified.");
