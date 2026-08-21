const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const motionTokens = read("src/lib/motion.ts");
const loader = read("src/components/PageLoadVeil.tsx");
const videoHook = read("src/hooks/useVideoFadeIn.ts");
const backgroundVideo = read("src/components/BackgroundVideo.tsx");
const home = read("src/app/page.tsx");
const about = read("src/app/about/page.tsx");
const work = read("src/app/work/page.tsx");
const insights = read("src/app/insights/page.tsx");
const contact = read("src/app/contact/page.tsx");
const credentialMap = read("src/sections/About/CredentialStrategyMap.tsx");
const processRiver = read("src/sections/Work/WorkEngagementMap.tsx");
const knowledgeAtlas = read("src/sections/Insights/KnowledgeAtlas.tsx");
const contactSequence = read("src/sections/Contact/ContactDecisionSequence.tsx");

for (const token of ["micro", "focus", "reveal", "scene", "signature"]) {
  assert(motionTokens.includes(`${token}:`), `Shared motion token ${token} is missing.`);
}

assert(loader.includes("branding-tatva-identity-seen"), "First-visit loader session guard is missing.");
assert(loader.includes("branding-tatva-tatva-mark.png"), "Approved identity mark is missing from the loader.");
assert(loader.includes("Strategy before styling"), "Approved loader thesis is missing.");
assert(loader.includes("}, 1180)"), "Loader completion budget changed beyond the approved first-visit sequence.");
assert(!loader.includes("progress"), "A simulated loader progress counter returned.");

const playbackRate = Number(videoHook.match(/playbackRate\s*=\s*([0-9.]+)/)?.[1]);
assert(playbackRate >= 1.08 && playbackRate <= 1.15, "Ambient video pacing falls outside the 1.08–1.15 brief.");
assert(videoHook.includes("IntersectionObserver"), "Offscreen video pausing is missing.");
assert(backgroundVideo.includes("useReducedMotion"), "Reduced-motion poster fallback is missing.");

assert(home.includes("<CredentialStrategyMap compact"), "Homepage signature strategy teaser is missing.");
assert(about.includes("<CredentialStrategyMap"), "About degree-to-strategy sequence is missing.");
assert(work.includes("<WorkServicesJourney"), "Work decision journey is missing.");
assert(insights.includes("<KnowledgeAtlas"), "Insights knowledge atlas is missing.");
assert(contact.includes("<ContactDecisionSequence"), "Contact decision sequence is missing.");

for (const [name, source] of [
  ["credential strategy map", credentialMap],
  ["process river", processRiver],
  ["knowledge atlas", knowledgeAtlas],
  ["contact decision sequence", contactSequence],
]) {
  assert(source.includes("useReducedMotion"), `${name} lacks a reduced-motion state.`);
  assert(source.includes('role="tab"'), `${name} lacks keyboard-readable tab semantics.`);
}

console.log("Motion Bible gate passed: pacing, loader, media behavior, page signatures, interaction semantics, and reduced-motion states are present.");
