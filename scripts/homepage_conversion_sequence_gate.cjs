const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const experience = read("src/sections/HomeV4/HomeV4Experience.tsx");
const scenes = read("src/sections/HomeV4/HomeV4Scenes.tsx");
const interfaceSource = read("src/sections/HomeV4/HomeV4Interface.tsx");
const mediaDirector = read("src/sections/HomeV4/HomeV4MediaDirector.tsx");
const evidenceWall = read("src/sections/Home/EvidenceWall.tsx");
const evidenceDepth = read("src/app/home-v4-evidence-depth.css");
const page = read("src/app/page.tsx");
const refinement = read("src/app/home-v4-refinement.css");
const consentManager = read("src/components/ConsentManager.tsx");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const sequence = [
  "<V4OpeningScene />",
  "<V4RecognitionScene />",
  "<V4HiddenCostScene />",
  'id="foundation"',
  'data-home-v4-chapter="paths"',
  'id="process"',
  'id="evidence"',
  'id="tatva"',
  'data-home-v4-chapter="studio"',
  'id="decision"',
  'id="invitation"',
];

let previous = -1;
for (const marker of sequence) {
  const index = experience.indexOf(marker);
  assert(index > previous, `Homepage chapter order is missing or drifted at ${marker}.`);
  previous = index;
}

assert(
  (experience.match(/<SceneHandoff motif=/g) || []).length === 10,
  "Every homepage chapter transition must keep one quiet handoff.",
);
for (const runtime of [
  "<HomeV4MediaDirector />",
  "<HomeV4HeaderDirector />",
  "<LivingCursor />",
  "<GuidedView />",
  "<HomePacingDirector />",
]) {
  assert(experience.includes(runtime), `Homepage runtime is missing ${runtime}.`);
}
assert(!experience.includes("HomeV4ProcessTempo"), "The working method must keep the visitor's chosen stage instead of restoring automatic selection.");

for (const marker of [
  'href="#recognition"',
  "Find the gap in your brand",
  'href="#evidence"',
  "See recorded proof",
  "Audience psychology · brand systems",
  "Strategy led directly by Suman",
]) {
  assert(scenes.includes(marker), `Opening decision path is missing ${marker}.`);
}

for (const staleInstruction of [
  "The page is alive before you touch it",
  "Watch the conditions change, or choose the one that sounds familiar.",
  "Open the evidence",
]) {
  assert(!scenes.includes(staleInstruction), `Homepage restored competing instruction copy: ${staleInstruction}`);
}

assert((scenes.match(/<h1\b/g) || []).length === 1, "Homepage opening must contain exactly one h1.");
for (const mediaMarker of ["muted", "autoPlay", "loop", "playsInline"]) {
  assert(scenes.includes(mediaMarker), `Homepage films are missing ${mediaMarker}.`);
}
assert(interfaceSource.includes("useHydratedReducedMotion"), "Homepage controls ignore reduced motion.");
assert(interfaceSource.includes('aria-label="Guided homepage controls"'), "Guided journey has no accessible name.");
assert(interfaceSource.includes('aria-pressed={mode === "guided"}'), "Guided journey does not expose its state.");
assert(mediaDirector.includes("IntersectionObserver"), "Homepage media no longer follows viewport admission.");
assert(
  evidenceWall.includes('exit={prefersReducedMotion ? undefined : { opacity: 0.78'),
  "Evidence media transition can fall through to a blank project frame.",
);
assert(
  evidenceWall.includes('exit={prefersReducedMotion ? undefined : { opacity: 0.8'),
  "Evidence dossier transition can fall through to a blank decision record.",
);
assert(
  (evidenceWall.match(/<AnimatePresence mode="sync" initial=\{false\}>/g) || []).length === 2,
  "Evidence media and dossier must crossfade concurrently without a wait-mode blank gap.",
);
assert(
  evidenceDepth.includes("grid-column: 1;") && evidenceDepth.includes("grid-column: 2;"),
  "Evidence crossfade layers must share stable grid cells while both files are mounted.",
);

assert(page.includes('import "./home-v4-refinement.css";'), "Homepage refinement layer is not mounted.");
assert(
  page.indexOf('home-v4-refinement.css') > page.indexOf('home-v4-screen-fit.css'),
  "Homepage refinement must load after the restored screen-fit layer.",
);
for (const cssMarker of [
  "text-wrap: balance",
  ":focus-visible",
  'data-guide-hint="visible"',
  ".home-v4 #evidence .evidence-cinematic__shell",
  "grid-template-rows: auto auto minmax(0, 1fr)",
  "position: relative !important",
  "padding-block: 0 !important",
  "overflow: clip !important",
  "@media (max-width: 560px)",
  "@media (prefers-reduced-motion: reduce)",
]) {
  assert(refinement.includes(cssMarker), `Homepage refinement is missing ${cssMarker}.`);
}
assert(!/\b(?:click here|learn more)\b/i.test(scenes), "Homepage contains a generic action label.");
assert(
  !consentManager.includes('matchMedia("(min-width: 1024px)")'),
  "The homepage privacy control can still cover compact-screen calls to action.",
);
assert(
  refinement.includes('.consent-notice[data-consent-compact="true"]') &&
    refinement.includes("width: 3rem !important") &&
    refinement.includes("left: auto !important"),
  "The scrolled homepage privacy control does not dock into its compact safe area.",
);
assert(
  refinement.includes(
    'html[data-consent-banner-compact="true"]',
  ) && refinement.includes("margin-right: 4rem"),
  "The short-laptop cost action does not reserve room for the compact privacy control.",
);
assert(
  refinement.includes("@media (min-width: 561px) and (max-width: 820px)") &&
    refinement.includes("min-width: 5.25rem") &&
    refinement.includes(".home-v4-guide__status"),
  "The 200%-zoom homepage guide can still expand across the reading area.",
);

console.log("Homepage source gate passed: eleven ordered chapters, clear opening decisions, restrained guidance, readable motion, and reduced-motion ownership verified.");
