const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const runtime = read("src/components/AboutCinematicRuntime.tsx");
const visualizer = read("src/hooks/useScrollDrivenVisualizer.ts");
const runtimeStyles = read("src/components/AboutCinematicRuntime.module.css");
const consent = read("src/components/ConsentManager.tsx");
const origin = read("src/sections/About/FounderFieldNotes.tsx");
const pointOfView = read("src/sections/About/PointOfView.tsx");
const convergence = read("src/sections/About/Convergence.tsx");
const evidence = read("src/sections/About/Evidence.tsx");
const standards = read("src/sections/About/Behaviours.tsx");
const workingDirectly = read("src/sections/About/WorkingDirectly.tsx");
const originStyles = read("src/sections/About/FounderFieldNotes.module.css");
const pointOfViewStyles = read("src/sections/About/PointOfView.module.css");
const atlasStyles = read("src/sections/About/BrandSignalAtlas.module.css");
const convergenceStyles = read("src/sections/About/Convergence.module.css");
const evidenceStyles = read("src/sections/About/Evidence.module.css");
const standardsStyles = read("src/sections/About/Behaviours.module.css");
const workingDirectlyStyles = read("src/sections/About/WorkingDirectly.module.css");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function fontSizeRem(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const declaration = source.match(new RegExp(`${escaped}\\s*\\{[^}]*font-size:\\s*([0-9.]+)rem`));
  assert(declaration, `Missing rem font size for: ${selector}`);
  return Number(declaration[1]);
}

assert(
  runtime.includes('data-state={index < activeChapter ? "passed" : index === activeChapter ? "active" : "waiting"}'),
  "About chapter spine no longer distinguishes passed, active, and waiting chapters.",
);
assert(
  runtime.includes("aria-controls={chapter.id}"),
  "About chapter controls no longer expose their destination relationship.",
);
assert(
  runtime.includes('window.addEventListener("popstate", restoreChapterFromHistory)') &&
    runtime.includes('window.removeEventListener("popstate", restoreChapterFromHistory)'),
  "About browser Back and Forward no longer restore chapter position.",
);
assert(
  runtime.includes('window.history.pushState({ aboutChapter: chapter.id }, "", nextHash)'),
  "Explicit About chapter journeys no longer create a browser-history entry.",
);
assert(
  runtime.includes('href={`#${chapter.id}`}') && runtime.includes("event.preventDefault();"),
  "Desktop About chapters no longer expose native hash links before cinematic enhancement.",
);
assert(
  runtime.includes("goToChapter(index, event.detail === 0)"),
  "Keyboard activation of a desktop About chapter no longer moves focus to its destination.",
);
assert(
  runtime.includes('id="about-mobile-chapter-list"') &&
    runtime.includes("aria-expanded={mobileMenuOpen}") &&
    runtime.includes("tabIndex={mobileMenuOpen ? 0 : -1}"),
  "Mobile visitors can no longer open and keyboard through the complete About chapter list.",
);
assert(
  runtime.includes('if (event.key !== "Escape") return;') &&
    runtime.includes("mobileMenuButtonRef.current?.focus()"),
  "The mobile About chapter chooser no longer closes and returns focus on Escape.",
);
assert(
  runtime.includes('document.addEventListener("pointerdown", closeOnOutsidePointer)') &&
    runtime.includes('document.removeEventListener("pointerdown", closeOnOutsidePointer)') &&
    runtime.includes('window.addEventListener("scroll", closeOnScroll, { passive: true })') &&
    runtime.includes('window.removeEventListener("scroll", closeOnScroll)'),
  "The mobile About chapter chooser no longer yields when attention leaves it.",
);
assert(
  consent.includes('root.dataset.consentBanner = "visible"') &&
    /:global\(html\[data-consent-banner="visible"\]\) \.mobileChapterControls\s*\{[^}]*bottom:\s*calc\(/.test(runtimeStyles),
  "The mobile About chapter chooser can collide with the unresolved consent banner.",
);
assert(
  runtime.includes("if (lenis && !reducedMotion)"),
  "About chapter history no longer hands restoration to the active scroll runtime.",
);
assert(
  origin.includes("when a founder is beginning") &&
    origin.includes("existing brand\n              feels difficult to explain") &&
    origin.includes("recognition needs steadier continuity"),
  "The first post-hero chapter no longer connects Suman's formative fields to a buyer's situation.",
);
assert(
  visualizer.includes("previewingRef.current || manualChoiceRef.current") &&
    visualizer.includes('window.addEventListener("wheel", releaseManualChoice, { passive: true })') &&
    visualizer.includes('window.addEventListener("touchstart", releaseManualChoice, { passive: true })') &&
    visualizer.includes('window.addEventListener("keydown", releaseManualChoiceFromKeyboard)') &&
    visualizer.includes("target.current?.contains(event.target)") &&
    visualizer.includes("setActiveIndex(manualChoiceIndexRef.current)"),
  "Shared About visualizers no longer protect an explicit choice until genuine scroll movement resumes.",
);
for (const [name, component, handler] of [
  ["origin", origin, "onPointerDown={() => visualizer.choose(index)}"],
  ["point of view", pointOfView, "onPointerDown={() => sequence.choose(index)}"],
  ["convergence", convergence, "onPointerDown={() => visualizer.choose(index)}"],
  ["evidence", evidence, "onPointerDown={() => sequence.choose(index)}"],
  ["standards", standards, "onPointerDown={() => sequence.choose(index)}"],
  ["founder-led", workingDirectly, "onPointerDown={() => sequence.choose(index)}"],
]) {
  assert(
    component.includes(handler),
    `The ${name} scene can mistake an intentional pointer press for a temporary preview.`,
  );
}
assert(
  /\.chapterSpine li\[data-active="true"\] a\s*\{[^}]*width:\s*min\(/.test(runtimeStyles),
  "The active desktop About chapter no longer keeps its label exposed.",
);
assert(
  /\.chapterSpine li\[data-active="true"\] a strong\s*\{[^}]*opacity:\s*1;[^}]*transform:\s*translateX\(0\);/.test(runtimeStyles),
  "The active desktop About chapter label can collapse back into an unlabeled number.",
);

const protectedNavigatorType = [
  [".chapterSpine a span", 0.55],
  [".mobileChapterControls small", 0.55],
];

for (const [selector, minimum] of protectedNavigatorType) {
  const size = fontSizeRem(runtimeStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}

const protectedOriginType = [
  [".fieldRail button small", 0.55],
  [".fieldRail button em", 0.55],
  [".portrait figcaption strong", 0.55],
  [".synthesisSeal span", 0.55],
  [".cardTopline small,\n.credential > span,\n.application > span", 0.55],
  [".recordCard footer", 0.55],
  [".progressRail", 0.55],
  [".staticExperience small", 0.55],
];

for (const [selector, minimum] of protectedOriginType) {
  const size = fontSizeRem(originStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}

const protectedPointOfViewType = [
  [".stageRail small", 0.55],
  [".ambientSequence", 0.55],
  [".signalStage > small", 0.55],
  [".signalStage > div span", 0.55],
  [".recordKicker", 0.55],
  [".record dt,\n.proofRecord > span", 0.55],
  [".proofRecord small", 0.55],
  [".recognitionLine", 0.55],
  [".staticLedgerHead small", 0.55],
  [".staticIndex small,\n.staticProof > small", 0.55],
  [".staticProof > a", 0.55],
];

for (const [selector, minimum] of protectedPointOfViewType) {
  const size = fontSizeRem(pointOfViewStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}

const protectedAtlasType = [
  [".core small", 0.55],
  [".surfaceNodes button small", 0.55],
  [".surfaceNodes button em", 0.55],
  [".recordTopline small", 0.55],
  [".record dt", 0.55],
  [".recordFoot", 0.55],
  [".touchRail button small", 0.55],
  [".touchRail button strong", 0.55],
  [".touchRecordIndex small", 0.55],
  [".touchTest small", 0.55],
  [".staticCore small", 0.55],
  [".staticAtlas li small", 0.55],
];

for (const [selector, minimum] of protectedAtlasType) {
  const size = fontSizeRem(atlasStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}

const protectedConvergenceType = [
  [".disciplineHeading small", 0.55],
  [".discipline li span", 0.55],
  [".thread button small", 0.55],
  [".thread button strong", 0.55],
  [".signalCore small", 0.55],
  [".outputs span", 0.55],
  [".tabs button span", 0.55],
  [".mobileResolution small", 0.55],
];

for (const [selector, minimum] of protectedConvergenceType) {
  const size = fontSizeRem(convergenceStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}

const protectedEvidenceType = [
  [".caseIdentity small, .caseIdentity em", 0.55],
  [".recordBasis strong", 0.78],
  [".pathStep > span", 0.6],
  [".outcome small", 0.58],
  [".caseControls button em", 0.55],
  [".caseLink", 0.6],
  [".staticTrace", 0.7],
  [".staticResolution span", 0.58],
];

for (const [selector, minimum] of protectedEvidenceType) {
  const size = fontSizeRem(evidenceStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}

const protectedStandardsType = [
  [".instrumentTopline", 0.55],
  [".gateTrack button small", 0.55],
  [".gateTrack button em", 0.55],
  [".testStatement span,\n.testResult dt,\n.testStamp small", 0.55],
  [".testResult dd", 0.7],
  [".instrumentFooter > div span", 0.55],
  [".verdict", 0.55],
];

for (const [selector, minimum] of protectedStandardsType) {
  const size = fontSizeRem(standardsStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}

const protectedWorkingDirectlyType = [
  [".headerAside > div", 0.56],
  [".stageRail button small", 0.55],
  [".sheetFooter > div span", 0.55],
  [".continuityVerdict", 0.55],
];

for (const [selector, minimum] of protectedWorkingDirectlyType) {
  const size = fontSizeRem(workingDirectlyStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}

console.log(
  "About journey quality gate passed: persistent chapter orientation, destination relationships, and readable evidence labels verified.",
);
