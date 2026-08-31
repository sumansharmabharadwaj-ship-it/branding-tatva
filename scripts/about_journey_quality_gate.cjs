const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const runtime = read("src/components/AboutCinematicRuntime.tsx");
const videoWarden = read("src/components/VideoWarden.tsx");
const splitHero = read("src/components/AboutSplitHero.tsx");
const header = read("src/layouts/Header/index.tsx");
const aboutPage = read("src/app/about/page.tsx");
const globalStyles = read("src/app/globals.css");
const anchorContract = read("src/app/about/about-anchor-contract.css");
const visualizer = read("src/hooks/useScrollDrivenVisualizer.ts");
const smoothScroll = read("src/components/SmoothScrollProvider.tsx");
const runtimeStyles = read("src/components/AboutCinematicRuntime.module.css");
const consent = read("src/components/ConsentManager.tsx");
const origin = read("src/sections/About/FounderFieldNotes.tsx");
const atlas = read("src/sections/About/BrandSignalAtlas.tsx");
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
  aboutPage.includes('import "./about-anchor-contract.css";') &&
    (aboutPage.match(/data-about-chapter=/g) || []).length === 8,
  "The complete About chapter set no longer loads its anchor-alignment contract.",
);
assert(
  aboutPage.includes("data-reading-scene") &&
    /\[data-about-film-scene\]\[data-reading-scene\] \[data-about-film-plane\]\s*\{[^}]*opacity:\s*calc\(0\.93 \+ var\(--scene-focus\) \* 0\.07\);/.test(globalStyles),
  "The copy dense origin chapter can fade below its protected reading exposure.",
);
assert(
  /id="about-convergence"[^>]*data-reading-scene/.test(aboutPage),
  "The copy dense synthesis chapter can fade below the protected reading exposure.",
);
assert(
  /id="about-system"[^>]*data-reading-scene/.test(aboutPage),
  "The copy dense brand-system chapter can fade below the protected reading exposure.",
);
assert(
  /id="about-principles"[^>]*data-reading-scene/.test(aboutPage),
  "The copy dense working-standards chapter can fade below the protected reading exposure.",
);
assert(
  /id="about-founder-led"[^>]*data-reading-scene/.test(aboutPage),
  "The copy dense founder-led chapter can fade below the protected reading exposure.",
);
assert(
  /id="about-evidence"[^>]*data-reading-scene/.test(aboutPage),
  "The copy dense evidence chapter can fade below the protected reading exposure.",
);
assert(
  /id="about-resolution"[^>]*data-reading-scene/.test(aboutPage),
  "The copy dense closing chapter can fade below the protected reading exposure.",
);
assert(
  /\[data-about-chapter\]\s*\{[^}]*scroll-margin-top:\s*clamp\(5\.75rem,\s*10svh,\s*6\.5rem\);/.test(anchorContract) &&
    /@media \(max-width:\s*430px\)[\s\S]*?\[data-about-chapter\]\s*\{[^}]*scroll-margin-top:\s*calc\(5rem \+ env\(safe-area-inset-top,\s*0px\)\);/.test(anchorContract),
  "About chapter hashes can settle beneath the fixed header in a responsive state.",
);
assert(
  smoothScroll.includes("if (!hydrated || !prefersReducedMotion || !window.location.hash) return;") &&
    smoothScroll.includes('target.scrollIntoView({ behavior: "auto", block: "start" })') &&
    smoothScroll.includes("document.fonts?.ready?.then(alignHashWithoutMotion)") &&
    smoothScroll.includes('window.addEventListener("wheel", cancelHashRecovery, { passive: true })'),
  "Reduced-motion About deep links no longer recover their fixed-header-safe position after hydration.",
);

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
  runtime.includes("className={styles.mobileChapterProgress}") &&
    /\.mobileChapterProgress b\s*\{[^}]*transform:\s*scaleX\(var\(--navigator-progress\)\);/.test(runtimeStyles),
  "The mobile About navigator no longer exposes continuous journey progress.",
);
assert(
  videoWarden.includes('document.addEventListener("play", enforcePlaybackBudget, true)') &&
    videoWarden.includes('document.removeEventListener("play", enforcePlaybackBudget, true)') &&
    videoWarden.includes("cancelAnimationFrame(frame)") &&
    videoWarden.includes("arbitrate();") &&
    /window\.addEventListener\("scroll", schedule, \{ passive: true \}\);\s*\/\/ Autoplay[\s\S]*?enforcePlaybackBudget\(\);/.test(videoWarden),
  "Adjacent About films can briefly decode together instead of handing playback over atomically.",
);
assert(
  (splitHero.match(/data-video-warden-group=\{ABOUT_HERO_VIDEO_GROUP\}/g) || []).length === 2 &&
    videoWarden.includes("const primaryGroup = primary?.dataset.videoWardenGroup;") &&
    videoWarden.includes("video.dataset.videoWardenGroup === primaryGroup"),
  "The About hero background and foreground films can no longer share their composed playback scene.",
);
assert(
  runtime.includes("const mobileNavigatorActive = navigatorActive;") &&
    runtime.includes("disabled={activeChapter === CHAPTERS.length - 1}") &&
    runtime.includes("disabled={activeChapter === 0}"),
  "The mobile About navigator no longer preserves its 08 / 08 ending state with safe previous and next boundaries.",
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
  runtime.includes("const THREAD_ACTIVE_FRAME_MS = 32;") &&
    runtime.includes("const THREAD_IDLE_FRAME_MS = 64;") &&
    runtime.includes("now - lastThreadPaintAt >= threadFrameInterval") &&
    runtime.includes("lastThreadPaintAt = performance.now()") &&
    runtime.includes("const responseBlend = 1 - Math.pow(0.82, frameElapsed / (1000 / 60))") &&
    runtime.includes("velocityValue !== previousVelocityValue") &&
    runtime.includes("pointerXValue !== previousPointerXValue") &&
    runtime.includes("if ((Math.abs(smoothedVelocity) > 0.0002 || pointerSettling) && !document.hidden)"),
  "The living About thread can monopolise every display frame while the visitor is reading.",
);
assert(
  runtime.includes('root.dataset.aboutFilm = "true"') &&
    runtime.includes("delete root.dataset.aboutFilm") &&
    /html\[data-about-film="true"\] \.gradient-mesh\s*\{[^}]*animation-play-state:\s*paused;/.test(globalStyles),
  "The global fixed mesh can keep compositing beneath the entire About film.",
);
assert(
  splitHero.includes("const heroInView = useInView(ref") &&
    splitHero.includes("data-about-hero-active={heroInView}") &&
    /\[data-about-hero-active="false"\] \.hero-fog,[\s\S]*?\[data-about-hero-active="false"\] \.card-float\s*\{[^}]*animation-play-state:\s*paused;/.test(globalStyles),
  "The About hero can keep its decorative animation stack running far off-screen.",
);
assert(
  header.includes('pathname.startsWith("/about") ? "#795A43"'),
  "The persistent About header can expose a low-contrast booking action over its ivory surface.",
);
assert(
  /data-scene-active="false"[^}]*\.frameShift i\s*\{[^}]*animation-play-state:\s*paused;/.test(pointOfViewStyles) &&
    /data-scene-active="false"[^}]*\.coreHalo\s*\{[^}]*animation-play-state:\s*paused;/.test(convergenceStyles) &&
    /data-scene-active="false"[^}]*\.core::before\s*\{[^}]*animation-play-state:\s*paused;/.test(atlasStyles),
  "Off-screen About chapters can keep their ambient CSS loops running.",
);
assert(
  origin.includes("when a founder is beginning") &&
    origin.includes("a capable business is difficult to") &&
    origin.includes("every channel has started to sound different"),
  "The first post-hero chapter no longer connects Suman's formative fields to a buyer's situation.",
);
assert(
  !origin.includes('className={styles.recordSlot} aria-live="polite"') &&
    origin.includes('role="tabpanel"') &&
    origin.includes("aria-labelledby={`origin-field-${activeIndex}`}"),
  "The origin record can announce its full animated contents instead of relying on its labelled tab relationship.",
);
assert(
  !atlas.includes('className={styles.recordSlot} aria-live="polite"') &&
    atlas.includes('role="tabpanel"') &&
    atlas.includes("aria-labelledby={`brand-surface-${selectedSurface}`}"),
  "The brand-system record can announce its full animated contents instead of relying on its labelled tab relationship.",
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
  [".headerAside > p:first-child", 0.8],
  [".fieldRail button small", 0.55],
  [".fieldRail button em", 0.58],
  [".portrait figcaption strong", 0.58],
  [".synthesisSeal span", 0.55],
  [".cardTopline small,\n.credential > span,\n.application > span", 0.58],
  [".credential p", 0.7],
  [".credential small", 0.6],
  [".application p", 0.78],
  [".recordCard footer", 0.58],
  [".progressRail", 0.55],
  [".staticExperience small", 0.55],
];

for (const [selector, minimum] of protectedOriginType) {
  const size = fontSizeRem(originStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}
assert(
  originStyles.includes("--origin-navigation-gutter:") &&
    originStyles.includes("padding-right: var(--origin-navigation-gutter);") &&
    /@media \(max-width: 900px\)[\s\S]*?padding-right:\s*0;/.test(originStyles),
  "The desktop About chapter navigator can overlap the origin reading frame or leave a mobile gutter behind.",
);

const protectedPointOfViewType = [
  [".stageRail small", 0.58],
  [".ambientSequence", 0.58],
  [".signalStage > small", 0.58],
  [".signalStage > div span", 0.58],
  [".recordKicker", 0.58],
  [".record dt,\n.proofRecord > span", 0.58],
  [".record dd", 0.72],
  [".proofRecord p", 0.76],
  [".proofRecord small", 0.58],
  [".recognitionLine", 0.58],
  [".staticLedgerHead small", 0.55],
  [".staticIndex small,\n.staticProof > small", 0.55],
  [".staticLedger article > p", 0.74],
  [".staticProof > p", 0.72],
  [".staticProof > a", 0.58],
];

for (const [selector, minimum] of protectedPointOfViewType) {
  const size = fontSizeRem(pointOfViewStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}
assert(
  /@media \(min-width: 981px\) and \(max-width: 1180px\)[\s\S]*?\.shell\s*\{\s*padding-right:/.test(pointOfViewStyles),
  "The point-of-view chapter does not reserve room for the desktop chapter navigator at compact widths.",
);
assert(
  pointOfViewStyles.includes("scroll-snap-type: inline mandatory;") &&
    pointOfViewStyles.includes("scroll-snap-align: start;"),
  "The touch recognition ledger lost its deliberate card-by-card resting points.",
);
assert(
  pointOfViewStyles.includes(':global(html[data-consent-banner="visible"]) .root') &&
    pointOfViewStyles.includes("padding-bottom: clamp(4.2rem, 7svh, 5rem);"),
  "The point-of-view record can fall beneath the visible consent notice.",
);

const protectedAtlasType = [
  [".headerAside > p:first-child", 0.76],
  [".stageReadout", 0.6],
  [".core small", 0.55],
  [".surfaceNodes button small", 0.6],
  [".surfaceNodes button em", 0.58],
  [".recordTopline small", 0.6],
  [".record > p", 0.76],
  [".record dt", 0.6],
  [".recordFoot", 0.58],
  [".touchRail button small", 0.6],
  [".touchRail button strong", 0.6],
  [".touchRecordIndex small", 0.6],
  [".touchRecord > p", 0.76],
  [".touchTest small", 0.6],
  [".staticCore small", 0.6],
  [".staticAtlas li small", 0.6],
  [".staticAtlas li p", 0.74],
];

for (const [selector, minimum] of protectedAtlasType) {
  const size = fontSizeRem(atlasStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}

const protectedConvergenceType = [
  [".disciplineHeading small", 0.6],
  [".discipline > p", 0.76],
  [".discipline li span", 0.58],
  [".thread button small", 0.58],
  [".thread button strong", 0.58],
  [".signalCore small", 0.58],
  [".outputs span", 0.58],
  [".outputs p", 0.7],
  [".tabs button span", 0.58],
  [".mobileSynthesis > ol > li > div p", 0.76],
  [".mobileResolution small", 0.58],
];

for (const [selector, minimum] of protectedConvergenceType) {
  const size = fontSizeRem(convergenceStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}
assert(
  convergenceStyles.includes("--convergence-navigation-gutter:") &&
    convergenceStyles.includes("padding-right: var(--convergence-navigation-gutter);") &&
    /@media \(max-width: 900px\)[\s\S]*?padding-right:\s*0;/.test(convergenceStyles),
  "The chapter spine can overlap the Synthesis reading frame or leave a mobile gutter behind.",
);
assert(
  convergenceStyles.includes(".signalCore") &&
    convergenceStyles.includes("pointer-events: none;") &&
    convergenceStyles.includes('.thread[data-thread="2"] button { translate:') &&
    convergenceStyles.includes('.thread[data-thread="3"] button { translate:'),
  "The centre seal can block the interactive Synthesis pairings.",
);

assert(
  atlasStyles.includes("--atlas-navigation-gutter:") &&
    atlasStyles.includes("var(--atlas-navigation-gutter)") &&
    /@media \(max-width: 980px\)[\s\S]*?padding:\s*6\.8rem 0 3\.7rem;/.test(atlasStyles),
  "The brand atlas chapter spine can overlap its record or leave a touch-layout gutter behind.",
);

const protectedEvidenceType = [
  [".caseIdentity small, .caseIdentity em", 0.6],
  [".recordBasis strong", 0.78],
  [".pathStep > span", 0.6],
  [".outcome small", 0.64],
  [".caseControls button em", 0.6],
  [".caseLink", 0.6],
  [".staticTrace", 0.7],
  [".staticResolution span", 0.58],
];

for (const [selector, minimum] of protectedEvidenceType) {
  const size = fontSizeRem(evidenceStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}
assert(
  evidenceStyles.includes('html[data-consent-banner="visible"]') &&
    evidenceStyles.includes(".caseLink { right: clamp(14rem, 18vw, 16rem);") &&
    evidenceStyles.includes(".proofResolution { display: none;"),
  "The evidence case action can settle beneath the consent notice.",
);

const protectedStandardsType = [
  [".instrumentTopline", 0.6],
  [".gateTrack button small", 0.6],
  [".gateTrack button em", 0.58],
  [".testStatement span,\n.testResult dt,\n.testStamp small", 0.6],
  [".testResult dd", 0.76],
  [".instrumentFooter > div span", 0.58],
  [".verdict", 0.58],
];

for (const [selector, minimum] of protectedStandardsType) {
  const size = fontSizeRem(standardsStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}
assert(
  standardsStyles.includes(':global(html[data-consent-banner="visible"]) .root') &&
    standardsStyles.includes("padding-bottom: calc(clamp(4.75rem, 8svh, 5.75rem) + env(safe-area-inset-bottom, 0px));") &&
    standardsStyles.includes(':global(html[data-consent-banner="visible"]) .instrumentFooter') &&
    standardsStyles.includes("padding-right: clamp(13rem, 18vw, 15.5rem);"),
  "The Working Standards evidence-policy action can settle beneath the consent notice.",
);

const protectedWorkingDirectlyType = [
  [".headerAside > p", 0.76],
  [".headerAside > div", 0.6],
  [".sheetHeader span", 0.6],
  [".stageRail button small", 0.6],
  [".decision p", 0.78],
  [".sheetFooter > div span", 0.58],
  [".continuityVerdict", 0.58],
  [".sheetFooter > a", 0.6],
];

for (const [selector, minimum] of protectedWorkingDirectlyType) {
  const size = fontSizeRem(workingDirectlyStyles, selector);
  assert(size >= minimum, `${selector} fell below the protected ${minimum}rem reading floor.`);
}
assert(
  workingDirectlyStyles.includes(':global(html[data-consent-banner="visible"]) .sheetFooter') &&
    workingDirectlyStyles.includes("padding-right: clamp(13rem, 18vw, 15.5rem);"),
  "The founder-led engagement action can settle beneath the consent notice.",
);

console.log(
  "About journey quality gate passed: persistent chapter orientation, destination relationships, and readable evidence labels verified.",
);
