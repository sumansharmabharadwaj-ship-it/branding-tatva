const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(
  path.join(root, "src/sections/HomeV4/HomeV4Experience.tsx"),
  "utf8",
);
const mountedChapterSources = [
  "src/sections/HomeV4/HomeV4Scenes.tsx",
  "src/sections/Home/HomeBrandHealthCheck.tsx",
  "src/sections/Home/EvidenceWall.tsx",
  "src/sections/Home/PathsCinematicChapter.tsx",
  "src/sections/Process/RootSystem.tsx",
  "src/sections/Home/StudioCinematicChapter.tsx",
  "src/sections/Home/HomeQuestionsScene.tsx",
  "src/sections/Home/FinalInvitation.tsx",
].map((file) => fs.readFileSync(path.join(root, file), "utf8"));

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

for (const [index, marker] of [
  'data-home-chapter="opening"',
  "02 · Brand diagnostic",
  "<span>03</span>",
  "04 · Selected work",
  "<span>05</span>",
  "06 · The method",
  "07 · The thinking behind the work",
  "08 · Before we work together",
  "09 · Begin",
].entries()) {
  assert(
    mountedChapterSources.some((chapter) => chapter.includes(marker)),
    `Visible chapter ${String(index + 1).padStart(2, "0")} is missing its canonical label.`,
  );
}

console.log("Homepage conversion sequence gate passed: one focused nine-chapter journey verified.");
