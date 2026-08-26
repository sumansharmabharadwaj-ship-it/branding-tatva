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
  "src/sections/Process/VerticalJourney.tsx",
  "src/sections/Home/StudioCinematicChapter.tsx",
  "src/sections/Home/HomeQuestionsScene.tsx",
  "src/sections/Home/FinalInvitation.tsx",
];
const analytics = read("src/lib/analytics.ts");
const pacing = read("src/sections/Home/HomePacingDirector.tsx");
const diagnostic = read("src/sections/Home/HomeBrandHealthCheck.tsx");
const diagnosticStyles = read("src/app/home-v4-orbit-redesign.css");
const studio = read("src/sections/Home/StudioCinematicChapter.tsx");
const mediaDirector = read("src/sections/HomeV4/HomeV4MediaDirector.tsx");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const relative of mounted) {
  const source = read(relative);
  assert(!source.includes('mode="wait"'), `${relative} can insert a blank readable-panel interval.`);
  assert(source.includes("data-home-reading-plane"), `${relative} lacks an explicit readable-content plane.`);
  assert(!/\bautoPlay\b\s*=|\bautoPlay\b(?=\s|>)/.test(source), `${relative} restored native autoplay instead of explicit playback ownership.`);
}
assert(analytics.includes("export function trackRuntimeIssue"), "Runtime issue telemetry is not centralized.");
assert(analytics.includes("RUNTIME_SCENES.has"), "Runtime scenes are not allowlisted.");
assert(analytics.includes("RUNTIME_MEDIA.get"), "Runtime media is not allowlisted.");
assert(analytics.includes("runtimeIssueKeys.has"), "Runtime issues are not deduplicated.");
assert(pacing.includes('querySelectorAll<HTMLElement>("[data-home-reading-plane]")'), "Pacing health accepts decorative content as readable.");
assert(pacing.includes("changedActiveSections.forEach"), "Active panel replacements do not trigger a visibility recheck.");
assert(pacing.includes("}, 400);"), "Readable content is not checked within the 400 millisecond contract.");
assert(pacing.includes("function forceReadableFallback"), "Missing homepage content is observed but not recovered.");
assert(pacing.includes('section.dataset.homeSceneRecovery = "forced"'), "Scene recovery does not expose a deterministic state.");
assert(pacing.includes("effectiveOpacity *= Number(style.opacity || 1)"), "Scene visibility ignores a hidden ancestor opacity.");
assert(pacing.includes("section.getAnimations({ subtree: true })"), "Scene recovery leaves stranded descendant animations running.");
assert(pacing.includes("const recoveryNodes = new Set<HTMLElement>([section])"), "Scene recovery ignores hidden reading-plane ancestors.");
assert(pacing.includes('node.style.setProperty("opacity", "1", "important")'), "Scene recovery does not force a readable final opacity.");
assert(pacing.includes('node.style.setProperty("transform", "none", "important")'), "Scene recovery can leave content translated outside the viewport.");
assert(pacing.includes('trackRuntimeIssue("scene_visibility_recovered"'), "Recovered homepage scenes are not measurable.");
assert(pacing.includes('window.location.hostname.endsWith(".vercel.app")'), "Failure injection is not confined to Vercel previews.");
assert(pacing.includes('get("qa-home-scene-recovery") === "ancestor"'), "The deployed recovery probe is not explicit and deterministic.");
assert(pacing.includes('section.dataset.homeSceneRecoveryProbe = "injected"'), "The recovery probe does not expose auditable injection evidence.");
assert(diagnostic.includes('trackRuntimeIssue("diagnostic_transition_failed"'), "Diagnostic transition failures are silent.");
assert(diagnostic.includes('aria-valuetext={done ? "Complete"'), "Diagnostic progress lacks an explicit spoken completion state.");
assert(diagnostic.includes('aria-labelledby="brand-orbit-result-title"'), "Diagnostic result focus target lacks an accessible label.");
assert(diagnostic.includes('id="brand-orbit-result-title"'), "Diagnostic result label is missing.");
assert(diagnostic.includes("event.currentTarget.closest('[role=\"radiogroup\"]')"), "Diagnostic arrow-key focus is not scoped to the active radio group.");
assert(diagnostic.includes("options?.[nextIndex]?.focus({ preventScroll: true })"), "Diagnostic selected radio does not receive focus before the selection render.");
assert(diagnosticStyles.includes(".brand-orbit__result:focus-visible"), "Focused diagnostic result has no visible treatment.");
assert(diagnosticStyles.includes(".brand-orbit__result-action a:focus-visible"), "Diagnostic result links have no explicit focus treatment.");
assert(diagnosticStyles.includes(".brand-orbit__result-action button:focus-visible"), "Diagnostic result buttons have no explicit focus treatment.");
assert(!studio.includes("useScroll") && !studio.includes("useMotionValueEvent"), "Studio choices must remain visitor-controlled rather than changing during scroll entry.");
assert(/function mediaBudget\(\)\s*\{\s*return 1;\s*\}/.test(mediaDirector), "Homepage can play more than one ambient film at once.");
assert(mediaDirector.includes('if (!openingVideo) video.preload = "none";'), "Offscreen homepage film is initialized before it nears the viewport.");

console.log("Homepage runtime quality gate passed: atomic reading planes, one-film playback, bounded telemetry, and transition recovery verified.");
