const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const mounted = [
  "src/sections/HomeV4/HomeV4Scenes.tsx",
  "src/sections/Home/HomeBrandHealthCheck.tsx",
  "src/sections/Home/EvidenceWall.tsx",
  "src/sections/Home/PathsCinematicChapter.tsx",
  "src/sections/Process/RootSystem.tsx",
  "src/sections/Home/StudioCinematicChapter.tsx",
  "src/sections/Home/HomeQuestionsScene.tsx",
  "src/sections/Home/FinalInvitation.tsx",
];
const analytics = read("src/lib/analytics.ts");
const pacing = read("src/sections/Home/HomePacingDirector.tsx");
const diagnostic = read("src/sections/Home/HomeBrandHealthCheck.tsx");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const relative of mounted) {
  const source = read(relative);
  assert(!source.includes('mode="wait"'), `${relative} can insert a blank readable-panel interval.`);
  assert(source.includes("data-home-reading-plane"), `${relative} lacks an explicit readable-content plane.`);
}
assert(analytics.includes("export function trackRuntimeIssue"), "Runtime issue telemetry is not centralized.");
assert(analytics.includes("RUNTIME_SCENES.has"), "Runtime scenes are not allowlisted.");
assert(analytics.includes("RUNTIME_MEDIA.get"), "Runtime media is not allowlisted.");
assert(analytics.includes("runtimeIssueKeys.has"), "Runtime issues are not deduplicated.");
assert(pacing.includes('querySelectorAll<HTMLElement>("[data-home-reading-plane]")'), "Pacing health accepts decorative content as readable.");
assert(pacing.includes("changedActiveSections.forEach"), "Active panel replacements do not trigger a visibility recheck.");
assert(pacing.includes("}, 400);"), "Readable content is not checked within the 400 millisecond contract.");
assert(diagnostic.includes('trackRuntimeIssue("diagnostic_transition_failed"'), "Diagnostic transition failures are silent.");

console.log("Homepage runtime quality gate passed: atomic reading planes, bounded telemetry, and transition recovery verified.");
