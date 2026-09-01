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
const studioSynthesisStyles = read("src/app/home-v4-studio-synthesis-final.css");
const process = read("src/sections/Process/RootSystem.tsx");
const projectFile = read("src/sections/Home/ProjectFile.tsx");
const processStyles = read("src/app/home-v4-process-living-final.css");
const evidence = read("src/sections/Home/EvidenceWall.tsx");
const evidenceStyles = read("src/app/home-v4-evidence-cinematic-final.css");
const paths = read("src/sections/Home/PathsCinematicChapter.tsx");
const cost = read("src/sections/HomeV4/HomeV4Scenes.tsx");
const costStyles = read("src/app/home-v4-cost-film-final.css");
const seamDirector = read("src/sections/HomeV4/HomeV4SeamDirector.tsx");
const homeInterface = read("src/sections/HomeV4/HomeV4Interface.tsx");
const sceneRhythm = read("src/app/home-v4-scene-rhythm.css");
const mediaDirector = read("src/sections/HomeV4/HomeV4MediaDirector.tsx");
const backgroundVideo = read("src/components/BackgroundVideo.tsx");
const videoBreak = read("src/components/VideoBreak.tsx");
const videoFadeIn = read("src/hooks/useVideoFadeIn.ts");
const questions = read("src/sections/Home/HomeQuestionsScene.tsx");
const finalInvitation = read("src/sections/Home/FinalInvitation.tsx");
const experience = read("src/sections/HomeV4/HomeV4Experience.tsx");
const v4Scenes = read("src/sections/HomeV4/HomeV4Scenes.tsx");
const experienceUpgrade = read("src/app/home-v4-experience-upgrade.css");
const homepageReconstruction = read("src/app/home-v4-homepage-reconstruction.css");
const mediaContinuity = read("src/app/home-v4-media-continuity.css");
const decisionStyles = read("src/app/home-v4-decision-depth.css");
const questionsStyles = read("src/app/home-v4-questions-editorial-final.css");
const invitationStyles = read("src/app/home-v4-invitation-living-final.css");
const chapterJumpStyles = read("src/app/home-v4-chapter-jump-final.css");
const homePage = read("src/app/page.tsx");

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
assert(mediaDirector.includes('trackRuntimeIssue("media_playback_failed"'), "Homepage media playback failures are silent.");
assert(mediaDirector.includes('error.name === "AbortError"'), "Expected playback interruptions are reported as failures.");
assert(mediaDirector.includes("playbackAttempts.delete(video)"), "Successful playback does not reset the bounded failure attempt.");
assert(mediaDirector.includes("attempt > 1"), "Failed homepage media can enter an unbounded retry loop.");
assert(mediaDirector.includes("constrainedConnection"), "Media recovery ignores visitor data constraints.");
assert(mediaDirector.includes("recoveryTimers.forEach"), "Media recovery timers survive the homepage lifecycle.");
assert(mediaDirector.includes("function scheduleSync"), "Homepage media updates are not coalesced to the display frame.");
assert(mediaDirector.includes("viewportProfileDirty ||="), "Resize bursts repeat homepage media layout reads.");
assert(mediaDirector.includes("if (document.hidden)"), "Hidden tabs can retain homepage media until animation frames resume.");
assert(mediaDirector.includes("cancelAnimationFrame(syncFrame)"), "Scheduled homepage media work survives teardown.");
assert(mediaContinuity.includes('data-home-media-state="playing"'), "Ready homepage films have no visual arrival state.");
assert(mediaContinuity.includes('data-home-media-state="failed"'), "Failed homepage films have no calm visual fallback.");
assert(mediaContinuity.includes("prefers-reduced-motion: reduce"), "Homepage film continuity ignores reduced motion.");
assert(mediaDirector.includes("const mediaToPause"), "Homepage media arbitration lacks an explicit outgoing phase.");
assert(mediaDirector.includes("const mediaToPlay"), "Homepage media arbitration lacks an explicit incoming phase.");
assert(
  mediaDirector.indexOf("mediaToPause.forEach") < mediaDirector.indexOf("mediaToPlay.forEach"),
  "Homepage media can start an incoming film before releasing the outgoing film.",
);
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
assert(diagnostic.includes('<p aria-live="polite" aria-atomic="true">'), "Diagnostic selection implications are not announced.");
assert(diagnostic.includes("event.currentTarget.closest('[role=\"radiogroup\"]')"), "Diagnostic arrow-key focus is not scoped to the active radio group.");
assert(diagnostic.includes("options?.[nextIndex]?.focus({ preventScroll: true })"), "Diagnostic selected radio does not receive focus before the selection render.");
assert(diagnostic.includes('event.pointerType !== "mouse"'), "Diagnostic hover preview can consume touch gestures.");
assert(diagnostic.includes("orbitPointerBoundsRef.current ?? target.getBoundingClientRect()") && diagnostic.includes("orbitPointerFrameRef.current = window.requestAnimationFrame"), "Diagnostic landscape can restore layout reads and writes on every pointer event.");
assert(diagnostic.includes("window.cancelAnimationFrame(orbitPointerFrameRef.current)"), "Diagnostic landscape can leave a scheduled motion frame behind.");
assert(!diagnostic.includes("<video"), "Diagnostic restored a short generated film instead of visitor-driven still motion.");
assert(diagnostic.includes("bt-home-brand-diagnostic-flowerwater-v1.png"), "Diagnostic living landscape has no stable still-art base.");
assert(!diagnostic.includes("void video.play()"), "Diagnostic film bypasses the shared one-film playback budget.");
assert(diagnostic.includes("active.choices[selected].centre"), "Diagnostic choice does not reveal the strategic implication before continuing.");
assert(diagnosticStyles.includes(".brand-orbit__result:focus-visible"), "Focused diagnostic result has no visible treatment.");
assert(diagnosticStyles.includes(".brand-orbit__result-action a:focus-visible"), "Diagnostic result links have no explicit focus treatment.");
assert(diagnosticStyles.includes(".brand-orbit__result-action button:focus-visible"), "Diagnostic result buttons have no explicit focus treatment.");
assert(diagnosticStyles.includes("white-space:normal"), "Diagnostic effort promise cannot wrap on narrow screens.");
assert(diagnosticStyles.includes("button.is-selected::after"), "Touch selections lose their strongest diagnostic commitment cue.");
assert(!diagnosticStyles.includes("infinite"), "Diagnostic scenery restored a perpetual CSS motion loop.");
assert(!studio.includes("useScroll") && !studio.includes("useMotionValueEvent"), "Studio restored an unbounded global scroll timeline.");
assert(studio.includes('window.addEventListener("scroll", scheduleScrollStage'), "Studio disciplines no longer respond to desktop page travel.");
assert(studio.includes('manualModeRef.current === "focus"'), "Studio scroll can replace a keyboard-focused discipline.");
assert(studio.includes('event.pointerType !== "mouse"'), "Studio hover preview can consume touch gestures.");
assert(studio.includes("if (reducedMotion || !eligible.matches) return;"), "Studio scroll stages ignore motion or viewport eligibility.");
assert(studio.includes("const [committedIndex, setCommittedIndex]"), "Studio previews have no stable committed discipline.");
assert(studio.includes("methodLensIndexRef.current + offset") && studio.includes("data-method-match={matched"), "Studio scroll no longer begins from or preserves the lens matched to the working method.");
assert(studio.includes("aria-selected={committed}") && studio.includes("tabIndex={committed ? 0 : -1}"), "Studio hover changes the selected tab or keyboard stop.");
assert(studio.includes('aria-live={manualModeRef.current === "focus" ? "polite" : "off"}'), "Studio scroll or pointer previews can interrupt assistive reading.");
assert(studio.includes('data-home-selection-direction={selectionDirectionRef.current}'), "Studio reading motion still inherits unrelated page-scroll direction.");
assert(studio.includes("const scrollOffsetRef = useRef(0)"), "Studio cannot distinguish forward and backward runway travel across wrapped lens indices.");
assert(studio.includes('className="studio-film__strategist"') && studio.includes('href="/about"'), "Studio no longer makes its founder-led authorship actionable.");
assert(studio.includes('src="/images/suman-sharma-studio-portrait.webp"'), "Studio founder handoff has lost Suman's real portrait.");
assert(studio.includes("playbackRate: 0.74") && studio.includes("playbackRate: 0.72") && studio.includes("playbackRate: 0.76") && studio.includes("data-home-playback-rate={active.playbackRate}"), "Studio films lost their discipline-specific calm playback pace.");
assert(experienceUpgrade.includes('.studio-film__strategist:is(:hover, :focus-visible)'), "Studio founder handoff has no pointer or keyboard response.");
assert(studioSynthesisStyles.includes('button[data-studio-state="committed"]'), "Studio previews erase the visitor's committed visual anchor.");
assert(/height:\s*138svh\s*!important/.test(studioStyles), "Studio has no bounded three-stage scroll runway.");
assert(/#studio > \.studio-film\s*\{[^}]*position:\s*sticky\s*!important/s.test(studioStyles), "Studio film does not hold its one-screen composition while disciplines change.");
assert(process.includes("const FINE_POINTER_QUERY"), "Working method has no fine-pointer motion boundary.");
assert(process.includes('event.pointerType !== "mouse" || prefersReducedMotion'), "Working-method light can consume touch gestures or ignore reduced motion.");
assert(process.includes("pointerLightBoundsRef.current ?? target.getBoundingClientRect()") && process.includes("pointerLightFrameRef.current = window.requestAnimationFrame"), "Working-method light can restore layout reads and writes on every pointer event.");
assert(process.includes("window.cancelAnimationFrame(pointerLightFrameRef.current)"), "Working-method light can leave a scheduled motion frame behind.");
assert(process.includes('document.addEventListener("visibilitychange", syncVisibility)'), "Working method can advance in a hidden tab.");
assert(process.includes("selectorEngaged ||"), "Working method does not yield while its controls are engaged.");
assert(process.includes('event.pointerType !== "mouse"'), "Working method hover preview can consume touch gestures.");
assert(process.includes('data-method-motion={ambientMotion ? "ambient" : "held"}'), "Working method does not expose its motion state.");
assert(process.includes('aria-live={selectorEngaged ? "polite" : "off"}'), "Ambient method changes can interrupt assistive reading.");
assert(process.includes("const displayed = active === index"), "Working-method preview has no separate visual state.");
assert(process.includes("const committed = committedStage === index"), "Working-method previews replace the committed tab state.");
assert(process.includes("aria-selected={committed}"), "Working-method hover changes assistive selection state.");
assert(process.includes("tabIndex={committed ? 0 : -1}"), "Working-method hover moves the keyboard tab stop.");
assert(process.includes("setActive(committedStage)"), "Working-method hover does not restore the visitor's committed decision.");
assert(process.includes('rememberSelectionDirection(next, "forward")'), "Working-method ambient wrap can read as a backward visitor choice.");
assert(process.includes('data-home-selection-direction={selectionDirectionRef.current}'), "Working-method reading motion still inherits unrelated page-scroll direction.");
assert(process.includes("data-path-entry-stage=") && process.includes("data-path-entry={pathEntry"), "Working method no longer distinguishes the visitor's original path entry from later exploration.");
assert(process.includes('href="#studio"') && process.includes("chooseStage(active, true)"), "Working method can leave without committing the decision the visitor is currently reading.");
assert(!process.includes("void video.play()") && !process.includes("video.pause()"), "Working method bypasses the shared one-film playback budget.");
assert(process.includes('preload="none"') && process.includes('data-home-playback-rate="0.72"'), "Working-method film does not yield loading and pace to the homepage media director.");
assert(processStyles.includes("@keyframes decisionFlowBeat"), "Working method has no bounded stage pulse.");
assert(processStyles.includes("scaleY(var(--decision-progress))"), "Working method rail does not show decision progress.");
assert(evidence.includes('event.pointerType === "mouse"'), "Selected-work hover can consume touch gestures.");
assert(evidence.includes("onFocus={() => choose(index)}"), "Selected-work cases do not preview from keyboard focus.");
assert(evidence.includes("const committed = index === committedIndex"), "Selected-work previews replace the committed tab state.");
assert(evidence.includes("aria-selected={committed}"), "Selected-work hover changes assistive selection state.");
assert(evidence.includes("tabIndex={committed ? 0 : -1}"), "Selected-work hover moves the keyboard tab stop.");
assert(evidence.includes('publishServicesSituation(activeSituation, "home_evidence")'), "Selected work cannot identify its path handoff as evidence led.");
assert(evidence.includes("EVIDENCE_META[project.slug]?.type"), "Selected-work index does not distinguish measured performance from delivered systems.");
assert(evidence.includes('dynamic(\n  () => loadProjectFile()') && evidence.includes("projectFileRequested ?"), "The project-file overlay is bundled before a visitor expresses intent to inspect it.");
assert(evidence.includes("onPointerEnter={prepareProjectFile}") && evidence.includes("onFocus={prepareProjectFile}"), "The deferred project file is not prepared for pointer and keyboard intent.");
assert(!evidence.includes('import { ProjectFile } from'), "The project-file overlay returned to the initial homepage bundle.");
assert(evidenceStyles.includes("var(--project-accent)"), "Selected-work cases have lost their individual visual signals.");
assert(cost.includes("ambientCompleteRef.current = true"), "Hidden cost no longer resolves its ambient story after one pass.");
assert(cost.includes('document.addEventListener("visibilitychange", syncVisibility)'), "Hidden cost can advance while its tab is hidden.");
assert(cost.includes('data-cost-motion={ambientSequencing ? "sequencing" : "held"}'), "Hidden cost does not expose whether its sequence is active or held.");
assert(cost.includes('amount: 0.55, margin: "0px"'), "Hidden-cost sequencing begins before the scene is readable.");
assert(cost.includes('if (event.pointerType === "mouse") setInteractionHeld(true)'), "Hidden-cost consequences keep changing while visitors examine them.");
assert(cost.includes('if (event.pointerType !== "mouse") return;'), "Hidden-cost hover preview can consume touch gestures.");
assert(cost.includes("onFocus={() => choose(index)}"), "Hidden-cost stages do not commit from keyboard focus.");
assert(cost.includes("sequencePaused") && cost.includes("aria-label={sequenceAction}"), "Hidden-cost ambient sequencing gives visitors no explicit playback control.");
assert(cost.includes("aria-selected={committed}") && cost.includes("tabIndex={committed ? 0 : -1}"), "Hidden-cost hover preview replaces the committed keyboard selection.");
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
assert(mediaDirector.includes("const MIN_PLAYBACK_RATE = 0.65") && mediaDirector.includes("Math.max(MIN_PLAYBACK_RATE, requested)"), "Homepage media director overrides intentionally slow cinematic footage.");
assert(backgroundVideo.includes("data-home-playback-rate={safePlaybackRate}"), "Background films do not publish their authored pace to the homepage media director.");
assert(paths.includes('data-home-playback-rate="0.82"'), "Service-path film has lost its calm authored pace.");
assert(paths.includes("const displayed = index === activeIndex"), "Service-path preview has no separate visual state.");
assert(paths.includes('type CarriedPathSource = "diagnostic" | "evidence" | null'), "Service paths cannot preserve the source of a carried recommendation.");
assert(paths.includes('data-proof-origin={carriedFrom === "evidence" && !isPreviewing ? "evidence" : "case"}'), "Evidence reasoning can remain attached to an unrelated path preview.");
assert(paths.includes("aria-selected={committed}"), "Service-path hover replaces the committed recommendation.");
assert(paths.includes("tabIndex={committed ? 0 : -1}"), "Service-path hover moves the keyboard tab stop.");
assert(videoFadeIn.includes("playbackManagedExternally = false") && videoFadeIn.includes("if (!playbackManagedExternally)"), "Reusable video fade-in cannot yield playback without losing cleanup ownership.");
assert(
  backgroundVideo.includes("!prefersReducedMotion && !livingStill") &&
    backgroundVideo.includes("managedByHomepage,") &&
    backgroundVideo.includes('managedByHomepage ? "none"') &&
    backgroundVideo.includes('posterPriority ? "metadata" : "none"'),
  "Homepage FAQ film or offscreen chapters still issue competing playback or preload commands.",
);
assert(questions.includes("managedByHomepage"), "Homepage FAQ does not opt into shared playback ownership.");
assert(questions.includes("Bring this {active.label.toLowerCase()} question to Suman"), "Practical answers no longer name the question carried into the invitation.");
assert(questions.includes("const displayed = index === activeIndex"), "Practical-answer preview has no separate visual state.");
assert(questions.includes("const committed = index === committedIndex"), "Practical-answer previews replace the committed tab state.");
assert(questions.includes("aria-selected={committed}"), "Practical-answer hover changes assistive selection state.");
assert(questions.includes("tabIndex={committed ? 0 : -1}"), "Practical-answer hover moves the keyboard tab stop.");
assert(finalInvitation.includes('calendlyHrefForServicesPackage(`${site.calendlyUrl}/30min`, selectedPackage)'), "Closing invitation adds an avoidable page or calendar choice before the exact session.");
assert(finalInvitation.includes('event="calendar_opened"'), "Direct homepage booking intent is not measured as a calendar open.");
assert(finalInvitation.includes('target="_blank"') && finalInvitation.includes('rel="noopener noreferrer"'), "Closing invitation does not disclose a safe external calendar handoff.");
assert(finalInvitation.includes("servicesContactHrefForSituation(selectedSituation, \"write\")"), "Closing invitation has lost its lower-pressure writing route.");
assert(finalInvitation.includes("consultation.preparation"), "Closing invitation does not reduce preparation anxiety before booking.");
assert(finalInvitation.includes("`${questionChoice.label} question carried`"), "Closing invitation no longer confirms the visitor's carried question.");
assert(finalInvitation.includes('className="final-invitation__carried-question"') && finalInvitation.includes("clipPath: prefersReducedMotion || inView"), "Carried question no longer resolves with the invitation handoff.");
assert(finalInvitation.includes('event.pointerType !== "mouse" || prefersReducedMotion'), "Closing booking response can consume touch gestures or ignore reduced motion.");
assert(finalInvitation.includes('"--invitation-cta-x"') && finalInvitation.includes('"--invitation-cta-y"'), "Closing booking response has lost its bounded pointer position.");
assert(finalInvitation.includes("bookingCtaBoundsRef.current ?? target.getBoundingClientRect()") && finalInvitation.includes("window.requestAnimationFrame"), "Closing booking response can restore layout reads and writes on every pointer event.");
assert(finalInvitation.includes("window.cancelAnimationFrame(bookingCtaFrameRef.current)"), "Closing booking response can leave a scheduled motion frame behind.");
assert(finalInvitation.includes("onPointerCancel") && finalInvitation.includes("onFocus"), "Closing booking response can remain stranded or displace keyboard focus.");
assert(invitationStyles.includes("var(--invitation-cta-x, 0px)") && invitationStyles.includes("calc(var(--invitation-cta-y, 0px) - 2px)"), "Closing booking response is no longer coupled to the CTA transform.");
assert(finalInvitation.includes("const activeCallStep = previewCallStep ?? committedCallStep"), "Closing invitation conversation steps have lost their reversible preview state.");
assert(finalInvitation.includes('event.pointerType === "mouse"') && finalInvitation.includes("chooseCallStep(index, false)"), "Closing invitation conversation preview can consume touch gestures.");
assert(finalInvitation.includes("function resetCallStepThread()") && finalInvitation.includes("setQuestionChoice(detail?.choice ?? null);\n      resetCallStepThread();") && finalInvitation.includes("setStudioLens(detail?.lens ?? null);\n      resetCallStepThread();"), "New carried context can leave the closing conversation stranded on an older step.");
assert(finalInvitation.includes("onCallStepKeyDown") && finalInvitation.includes('aria-selected={committedCallStep === index}') && finalInvitation.includes('tabIndex={committedCallStep === index ? 0 : -1}'), "Closing invitation conversation steps have lost their keyboard selection contract.");
assert(finalInvitation.includes("duration: prefersReducedMotion ? 0 : 0.36"), "Closing invitation conversation detail ignores reduced motion.");
assert(videoBreak.includes("managedByHomepage = false") && videoBreak.includes('managedByHomepage ? "none"'), "Closing film cannot yield playback to the homepage controller.");
assert(experience.includes("managedByHomepage") && experience.includes("homePlaybackRate={0.84}"), "Closing invitation film does not use the shared calm playback contract.");
assert(decisionStyles.includes(".home-v4-chapter--decision + .home-v4-handoff--mist"), "Closing chapter seam no longer matches the rendered mist handoff.");
assert(!decisionStyles.includes(".home-v4-chapter--decision + .home-v4-handoff--light"), "Closing chapter seam still targets the retired light handoff.");
assert(questionsStyles.includes("rgba(216,209,193,.96)"), "Practical answers no longer resolve into the invitation's silver exposure.");
assert(experience.includes("rgba(217,201,170,0.34) 0%"), "Closing film no longer carries the practical-answer warmth across the cut.");
assert(homePage.includes('import "./home-v4-chapter-jump-final.css"'), "The final compact chapter-arrival layer is not mounted.");
assert(chapterJumpStyles.includes("@media (max-width: 1023px)"), "Chapter arrival clearance ends before the compact guide switches to its desktop rail.");
for (const target of ["#opening", "#brand-diagnostic", "#cost", "#evidence", "#paths", "#process", "#studio", "#decision", "#invitation"]) {
  assert(chapterJumpStyles.includes(target), `Compact chapter arrival is missing ${target}.`);
}
assert(chapterJumpStyles.includes("env(safe-area-inset-top, 0px)"), "Compact chapter arrival ignores device cut-outs.");
assert(chapterJumpStyles.includes("@media (max-width: 359px)"), "Narrow phones no longer receive a fitted chapter guide.");
assert(chapterJumpStyles.includes("max-height: 560px"), "Short phones no longer receive a compact chapter sheet.");
assert(chapterJumpStyles.includes("max-height: 420px"), "Very short phones retain a summary that crowds out chapter choices.");
assert(chapterJumpStyles.includes("min-height: 2.75rem"), "Compact chapter choices have fallen below the 44px touch target.");
assert(!homeInterface.includes("GuidedView") && !homeInterface.includes("LivingCursor"), "Removed homepage-only controls remain bundled beside the active seam primitive.");
assert(!v4Scenes.includes("V4RecognitionScene") && !v4Scenes.includes("RECOGNITION_STATES"), "The retired recognition chapter remains bundled beside the active opening and cost scenes.");
assert(!homeInterface.includes("useMotionValue") && !homeInterface.includes("useLenis"), "Dormant homepage control runtimes still pull client-side motion or scroll ownership into chapter seams.");
assert(!mediaDirector.includes("HOME_GUIDE_MODE_EVENT") && !mediaDirector.includes("guideMode"), "Homepage media still listens for the removed autoplay guide.");
assert(pacing.includes("CINEMATIC_MOTION_QUERY"), "Homepage scenes have lost their shared fine-pointer motion boundary.");
assert(pacing.includes("if (!homeRoot || prefersReducedMotion)"), "Homepage motion direction ignores the reduced-motion boundary.");
assert(pacing.includes("if (!cinematicMotion.matches)") && pacing.includes("clearCinematicMotion(true)"), "Homepage camera motion has escaped compact viewports.");
assert(pacing.includes('homeRoot.dataset.homeScrollDirection = "forward"') && pacing.includes("preserveDirection"), "Compact homepage scrolling no longer publishes a reversible direction signal.");
assert(pacing.includes('homeRoot.dataset.homeMotion = "live"'), "Homepage camera variables have no explicit live state.");
assert(pacing.includes('event.pointerType !== "mouse"'), "Homepage camera can consume touch gestures.");
assert(pacing.includes("window.requestAnimationFrame(renderCinematicMotion)"), "Homepage camera writes are no longer frame bounded.");
assert(pacing.includes('"--home-velocity-y"') && pacing.includes("smoothedVelocity > 0.01"), "Homepage camera no longer responds to speed with bounded decay.");
assert(experienceUpgrade.includes('@media (min-width: 901px)') && experienceUpgrade.includes('(prefers-reduced-motion: no-preference)'), "Homepage camera styles have escaped their viewport or motion boundary.");
assert(experienceUpgrade.includes('transform: scaleX(var(--home-page-progress))'), "Homepage has lost its quiet journey progress signal.");
assert(homepageReconstruction.includes("--home-frame-right"), "Homepage reconstruction no longer protects the chapter-rail lane.");
assert(!homepageReconstruction.includes("@media (min-width: 1101px)"), "Homepage reconstruction restored a second studio-runway owner.");
assert(!homepageReconstruction.includes("home-v4-opening__"), "Homepage reconstruction modified the preserved opening.");
assert(!homepageReconstruction.includes("data-home-scene-observed"), "Homepage reconstruction restored a second scene-motion owner.");
assert(!homepageReconstruction.includes("data-home-scene-state"), "Homepage reconstruction restored duplicate scene-state choreography.");
assert(homepageReconstruction.includes('html[data-motion="reduced"] body .home-v4 #studio'), "The in-site reduced-motion control no longer collapses the studio runway.");
assert(mediaDirector.includes('if (!openingVideo) video.preload = "none";'), "Offscreen homepage film is initialized before it nears the viewport.");
assert(mediaDirector.includes('rootMargin: "0px"'), "Homepage playback admits films before they enter the visible viewport.");
assert(mediaDirector.includes('rootMargin: "55% 0px"'), "The next homepage film is not warmed before its chapter arrives.");
assert(mediaDirector.includes('video.dataset.homeMediaAdmission = admitted'), "Homepage film admission does not expose a deterministic state.");
assert(mediaDirector.includes("playbackPriority(videoB) - playbackPriority(videoA)"), "Foreground homepage films cannot take priority over obscured ambient media.");
assert(mediaDirector.includes('video.dataset.homeMediaState = "failed"'), "Failed homepage film cannot yield cleanly to its poster.");
assert(mediaDirector.includes("record.removedNodes.forEach"), "Replaced homepage films remain tracked after leaving the scene.");
assert(mediaDirector.includes("cleanups.get(video)?.()"), "Replaced homepage films retain observers or playback listeners.");
assert(projectFile.includes('data-home-media-priority="10"'), "Opened project footage cannot claim the foreground film budget.");
assert(projectFile.includes('preload="none"') && !projectFile.includes(".play()"), "Project-file footage bypasses shared loading or playback ownership.");

console.log("Homepage runtime quality gate passed: atomic reading planes, one-film playback, bounded telemetry, and transition recovery verified.");
