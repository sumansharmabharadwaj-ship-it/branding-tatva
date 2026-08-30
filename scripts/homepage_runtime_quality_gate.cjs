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
const studioStyles = read("src/app/home-v4-studio-living-final.css");
const process = read("src/sections/Process/RootSystem.tsx");
const processStyles = read("src/app/home-v4-process-living-final.css");
const evidence = read("src/sections/Home/EvidenceWall.tsx");
const evidenceStyles = read("src/app/home-v4-evidence-cinematic-final.css");
const cost = read("src/sections/HomeV4/HomeV4Scenes.tsx");
const costStyles = read("src/app/home-v4-cost-film-final.css");
const seamDirector = read("src/sections/HomeV4/HomeV4SeamDirector.tsx");
const homeInterface = read("src/sections/HomeV4/HomeV4Interface.tsx");
const sceneRhythm = read("src/app/home-v4-scene-rhythm.css");
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
assert(diagnostic.includes('event.pointerType !== "mouse"'), "Diagnostic hover preview can consume touch gestures.");
assert(diagnostic.includes('preload="none"'), "Diagnostic film is preloaded before the shared media director admits it.");
assert(!diagnostic.includes("void video.play()"), "Diagnostic film bypasses the shared one-film playback budget.");
assert(diagnostic.includes("active.choices[selected].centre"), "Diagnostic choice does not reveal the strategic implication before continuing.");
assert(diagnosticStyles.includes(".brand-orbit__result:focus-visible"), "Focused diagnostic result has no visible treatment.");
assert(diagnosticStyles.includes(".brand-orbit__result-action a:focus-visible"), "Diagnostic result links have no explicit focus treatment.");
assert(diagnosticStyles.includes(".brand-orbit__result-action button:focus-visible"), "Diagnostic result buttons have no explicit focus treatment.");
assert(!diagnosticStyles.includes("infinite"), "Diagnostic scenery restored a perpetual CSS motion loop.");
assert(!studio.includes("useScroll") && !studio.includes("useMotionValueEvent"), "Studio restored an unbounded global scroll timeline.");
assert(studio.includes('window.addEventListener("scroll", scheduleScrollStage'), "Studio disciplines no longer respond to desktop page travel.");
assert(studio.includes('manualModeRef.current === "focus"'), "Studio scroll can replace a keyboard-focused discipline.");
assert(studio.includes('event.pointerType !== "mouse"'), "Studio hover preview can consume touch gestures.");
assert(studio.includes("if (reducedMotion || !eligible.matches) return;"), "Studio scroll stages ignore motion or viewport eligibility.");
assert(/height:\s*148svh\s*!important/.test(studioStyles), "Studio has no bounded three-stage scroll runway.");
assert(/#studio > \.studio-film\s*\{[^}]*position:\s*sticky\s*!important/s.test(studioStyles), "Studio film does not hold its one-screen composition while disciplines change.");
assert(process.includes("const FINE_POINTER_QUERY"), "Working method has no fine-pointer motion boundary.");
assert(process.includes('document.addEventListener("visibilitychange", syncVisibility)'), "Working method can advance in a hidden tab.");
assert(process.includes("selectorEngaged ||"), "Working method does not yield while its controls are engaged.");
assert(process.includes('event.pointerType !== "mouse"'), "Working method hover preview can consume touch gestures.");
assert(process.includes('data-method-motion={ambientMotion ? "ambient" : "held"}'), "Working method does not expose its motion state.");
assert(process.includes('aria-live={selectorEngaged ? "polite" : "off"}'), "Ambient method changes can interrupt assistive reading.");
assert(processStyles.includes("@keyframes decisionFlowBeat"), "Working method has no bounded stage pulse.");
assert(processStyles.includes("scaleY(var(--decision-progress))"), "Working method rail does not show decision progress.");
assert(evidence.includes('event.pointerType === "mouse"'), "Selected-work hover can consume touch gestures.");
assert(evidence.includes("onFocus={() => choose(index)}"), "Selected-work cases do not preview from keyboard focus.");
assert(evidence.includes("EVIDENCE_META[project.slug]?.type"), "Selected-work index does not distinguish measured performance from delivered systems.");
assert(evidenceStyles.includes("var(--project-accent)"), "Selected-work cases have lost their individual visual signals.");
assert(cost.includes("ambientCompleteRef.current = true"), "Hidden cost no longer resolves its ambient story after one pass.");
assert(cost.includes('document.addEventListener("visibilitychange", syncVisibility)'), "Hidden cost can advance while its tab is hidden.");
assert(cost.includes('data-cost-motion={ambientSequencing ? "sequencing" : "held"}'), "Hidden cost does not expose whether its sequence is active or held.");
assert(cost.includes('if (event.pointerType !== "mouse") return;'), "Hidden-cost hover preview can consume touch gestures.");
assert(cost.includes("onFocus={() => choose(index)}"), "Hidden-cost stages do not commit from keyboard focus.");
assert(costStyles.includes("scaleX(var(--cost-progress))"), "Hidden cost has lost its accumulating memory trace.");
assert(costStyles.includes('button[data-cost-state="past"]'), "Hidden cost no longer distinguishes remembered stages from upcoming stages.");
assert(seamDirector.includes('window.addEventListener("scroll", schedule'), "Homepage seams no longer respond to visitor-controlled scroll.");
assert(seamDirector.includes("ELIGIBLE_QUERY") && seamDirector.includes("prefersReducedMotion"), "Homepage seams ignore viewport, pointer, or motion boundaries.");
assert(seamDirector.includes('data-home-handoff-preserve="true"'), "Homepage seam motion can spill into the preserved opening.");
assert(!seamDirector.includes('window.addEventListener("pointermove"'), "Homepage seams restored a competing pointer camera.");
const handoffSource = homeInterface.slice(homeInterface.indexOf("export function SceneHandoff"));
assert(!handoffSource.includes("repeat: Infinity"), "Hidden chapter seams still run perpetual animation loops.");
assert(sceneRhythm.includes('.home-v4[data-seam-ready="true"] .home-v4-handoff'), "Homepage seam artwork can render without an active scroll owner.");
assert(/function mediaBudget\(\)\s*\{\s*return 1;\s*\}/.test(mediaDirector), "Homepage can play more than one ambient film at once.");
assert(mediaDirector.includes('if (!openingVideo) video.preload = "none";'), "Offscreen homepage film is initialized before it nears the viewport.");
assert(mediaDirector.includes('rootMargin: "0px"'), "Homepage playback admits films before they enter the visible viewport.");
assert(mediaDirector.includes('rootMargin: "55% 0px"'), "The next homepage film is not warmed before its chapter arrives.");
assert(mediaDirector.includes('video.dataset.homeMediaAdmission = admitted'), "Homepage film admission does not expose a deterministic state.");
assert(mediaDirector.includes('video.dataset.homeMediaState = "failed"'), "Failed homepage film cannot yield cleanly to its poster.");
assert(mediaDirector.includes("record.removedNodes.forEach"), "Replaced homepage films remain tracked after leaving the scene.");
assert(mediaDirector.includes("cleanups.get(video)?.()"), "Replaced homepage films retain observers or playback listeners.");

console.log("Homepage runtime quality gate passed: atomic reading planes, one-film playback, bounded telemetry, and transition recovery verified.");
