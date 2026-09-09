#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function fail(message) {
  console.error(`[contact-cinema] ${message}`);
  process.exitCode = 1;
}

function requireText(source, expected, message) {
  if (!source.includes(expected)) fail(message);
}

function forbidPattern(source, pattern, message) {
  if (pattern.test(source)) fail(message);
}

function requirePattern(source, pattern, message) {
  if (!pattern.test(source)) fail(message);
}

const scene = read("src/components/ContactCinematicScene.tsx");
const pathwayFilm = read("src/components/ContactPathwayFilm.tsx");
const pathways = read("src/components/ContactPathways.tsx");
const gratitude = read("src/components/ContactGratitude.tsx");
const backgroundVideo = read("src/components/BackgroundVideo.tsx");
const callSequence = read("src/components/ContactCallSequence.tsx");
const form = read("src/components/ContactForm.tsx");
const rail = read("src/components/ContactChapterRail.tsx");
const page = read("src/app/contact/page.tsx");
const css = read("src/app/contact/contact-cinematic.css");

const sceneContracts = [
  ["SCENE_EXPOSURE", "scene-specific exposure pulls are missing"],
  ["useMotionValueEvent(playbackLift", "scroll-responsive playback is missing"],
  ['data-contact-playback=', "playback mode is no longer inspectable"],
  ['data-contact-scene-exposure="true"', "scene exposure layer is missing"],
  ['data-contact-focus-pull=', "chapter focus pull is missing"],
  ['filter: hasReadingFocus ? "blur(0px)" : contentFocus', "focused controls no longer resolve sharply"],
];

for (const [expected, message] of sceneContracts) requireText(scene, expected, message);

requirePattern(
  pathwayFilm,
  /camera:\s*"folio"\s*\|\s*"conversation"\s*\|\s*"letter"/,
  "pathway camera contract must keep three distinct signatures",
);

for (const camera of ["folio", "conversation", "letter"]) {
  requireText(pathways, `camera: "${camera}"`, `pathway does not assign its ${camera} camera`);
  requireText(css, `data-contact-pathway-camera="${camera}"`, `pathway camera styling is missing: ${camera}`);
}

requireText(pathways, "<AnimatePresence", "pathway changes no longer use a cinematic cut");
requireText(pathways, "data-contact-pathway-shot", "pathway shot boundary is missing");
requireText(gratitude, "data-contact-gratitude-ledger", "gratitude acknowledgement ledger is missing");
requireText(gratitude, "data-contact-gratitude-statement", "gratitude closing statement is missing");
requireText(gratitude, "data-contact-gratitude-complete", "gratitude completion state is missing");
requireText(gratitude, "data-contact-gratitude-settled", "gratitude completion no longer resolves into a resting state");
requireText(gratitude, "COMPLETION_SETTLE_MS", "gratitude completion no longer pauses before resolving");
requireText(gratitude, "SCROLL_RECEIVE_THRESHOLDS", "gratitude no longer unfolds through native scroll");
requireText(
  gratitude,
  "const SCROLL_RECEIVE_THRESHOLDS = [0.24, 0.34, 0.44, 0.52] as const;",
  "gratitude scroll thresholds no longer finish inside the closing scene's usable range",
);
requireText(gratitude, 'useMotionValueEvent(sequenceProgress, "change"', "gratitude scroll sequence is missing");
requireText(gratitude, "data-contact-gratitude-receipt", "gratitude scroll receipt is no longer visible");
requireText(gratitude, "lastReceivedNote", "gratitude response no longer follows the received sequence");
requireText(gratitude, "visitedNotesRef", "gratitude response no longer preserves receipt order");
requireText(gratitude, "sequenceFocusNote", "gratitude sequence no longer carries one acknowledgement into focus");
requireText(gratitude, "scrollFocusNote", "gratitude focus no longer follows reverse scrolling");
requireText(gratitude, "REVISIT_ENTER_PROGRESS", "gratitude reverse scroll no longer has a stable re-entry threshold");
requireText(gratitude, "REVISIT_EXIT_PROGRESS", "gratitude reverse scroll no longer has a stable resting threshold");
requireText(gratitude, 'useMotionValueEvent(sequenceScrollProgress, "change"', "gratitude reverse playback no longer follows raw scroll direction");
requireText(gratitude, "visualActiveNote", "gratitude manual and scroll focus no longer share one visual state");
requireText(gratitude, "data-contact-gratitude-sequence-focus", "gratitude sequence focus is no longer inspectable");
requireText(gratitude, 'data-contact-gratitude-scroll-scrub="bidirectional"', "gratitude no longer declares its bidirectional scroll contract");
requireText(gratitude, "LayoutGroup", "gratitude sequence no longer shares one moving focus treatment");
requireText(gratitude, 'layoutId="contact-gratitude-focus-baton"', "gratitude focus no longer travels between acknowledgements");
requireText(gratitude, "data-contact-gratitude-focus-baton", "gratitude focus baton is no longer inspectable");
requireText(gratitude, 'layoutId="contact-gratitude-reading-head"', "gratitude reading head no longer travels with the shared focus baton");
requireText(gratitude, "data-contact-gratitude-reading-head", "gratitude travelling reading head is no longer inspectable");
requireText(gratitude, 'data-contact-gratitude-scroll-spine="continuous"', "gratitude acknowledgements no longer share one continuous scroll spine");
requireText(gratitude, "data-contact-gratitude-scroll-spine-settled", "gratitude scroll spine no longer settles before the final handoff");
requireText(gratitude, "data-contact-gratitude-note-active", "gratitude active acknowledgement state is no longer inspectable");
requireText(gratitude, "data-contact-gratitude-note-label", "gratitude active label no longer carries the travelling focus cue");
requireText(gratitude, "const spineSettled = completionSettled && !isRevisiting && activeNote === null;", "gratitude scroll spine no longer re-energizes during intentional inspection");
requirePattern(
  gratitude,
  /const sequenceFocusNote = completionSettled && !isRevisiting \? null : scrollFocusNote;\s*const visualActiveNote = activeNote \?\? sequenceFocusNote;/,
  "gratitude sequence focus no longer scrubs backwards while preserving the final resting state",
);
requirePattern(
  gratitude,
  /data-contact-gratitude-sequence-focus=\{[\s\S]*?sequenceFocusNote === null[\s\S]*?String\(sequenceFocusNote \+ 1\)/,
  "gratitude sequence focus state is no longer exposed on the closing scene",
);
requirePattern(
  gratitude,
  /const signalScale = useTransform\(\s*sequenceProgress,\s*\[0\.1, SCROLL_RECEIVE_THRESHOLDS\[NOTES\.length - 1\]\],\s*\[0, 1\],\s*\);/,
  "gratitude progress cue no longer completes with the fourth acknowledgement",
);
requirePattern(
  gratitude,
  /scaleX: allNotesVisited \? 1 : signalScale/,
  "gratitude completion state no longer guarantees a full progress cue",
);
requireText(gratitude, "data-contact-gratitude-response-phase", "gratitude response phases are no longer inspectable");
requirePattern(
  gratitude,
  /const responseIndex =[\s\S]*?completionSettled[\s\S]*?RESPONSES\.length - 1/,
  "gratitude resolves before the final acknowledgement has time to land",
);
requirePattern(
  gratitude,
  /setIsRevisiting\(\s*!reducedMotion && sequenceScrollProgress\.get\(\) <= REVISIT_ENTER_PROGRESS,\s*\);\s*setCompletionSettled\(true\)/,
  "gratitude completion no longer preserves an intentional reverse gesture during its final hold",
);
requireText(gratitude, "announcedResponse", "gratitude activation announcement is missing");
requirePattern(
  gratitude,
  /<p className="sr-only" aria-live="off">\s*\{activeResponse\}/,
  "gratitude current response must remain readable without an unsolicited announcement",
);
requireText(gratitude, 'setAnnouncedResponse(nextSelectedNote === null ? "" : NOTES[index].response)', "gratitude hover and scroll must not create unsolicited live announcements");
requireText(gratitude, 'data-contact-gratitude-flow="continuous"', "gratitude pointer flow is no longer continuous");
requireText(gratitude, 'data-contact-gratitude-receipt="scroll-or-activation"', "gratitude receipt no longer supports scroll and deliberate inspection");
requireText(gratitude, "data-contact-gratitude-next-ready", "gratitude completion no longer hands off to the next step");
requireText(gratitude, "data-contact-gratitude-primary", "gratitude primary route is no longer addressable");
requireText(gratitude, "data-contact-gratitude-progress-beat", "gratitude progress count no longer carries direction between acknowledgements");
requireText(gratitude, '<AnimatePresence initial={false} mode="wait">', "gratitude progress count no longer resolves one beat before the next");
requireText(gratitude, 'data-contact-gratitude-response-direction="vertical"', "gratitude response no longer follows the vertical reading path");
requireText(gratitude, "data-contact-gratitude-response-beat", "gratitude response no longer carries a directional masked handoff");
requireText(gratitude, "data-contact-gratitude-ledger-status-beat", "gratitude completion status no longer settles as a finite beat");
requireText(gratitude, 'event.key === "ArrowDown"', "gratitude arrow-key choreography is missing");
requireText(gratitude, "selectedNote", "gratitude click and touch selection no longer persists");
requirePattern(
  gratitude,
  /const handleNoteSelect[\s\S]*?visitedNotesRef\.current \| \(1 << index\)[\s\S]*?setVisitedNotes\(nextVisitedNotes\)/,
  "manual gratitude receipt no longer shares the ordered state",
);
requireText(backgroundVideo, "loop = true", "background films must keep a safe default loop contract");
requireText(backgroundVideo, "loop={loop}", "background films can no longer hold their final frame");
requireText(page, "loop={false}", "gratitude film must settle instead of exposing its loop boundary");
requireText(callSequence, "data-contact-call-step", "call sequence no longer exposes its active step");
requireText(form, "data-contact-form-completion", "written enquiry no longer exposes completion progress");
requireText(form, "activeRequiredField", "written enquiry no longer follows the active required field");
requireText(form, "data-contact-required-field", "required fields no longer expose their writing sequence");
requireText(rail, "data-active-index", "chapter rail no longer exposes its film index");
requireText(rail, "--contact-chapter-progress", "chapter rail no longer follows continuous journey progress");
requireText(rail, 'data-contact-chapter-progress="continuous"', "continuous chapter progress is no longer inspectable");
requireText(page, 'className="contact-footer-afterglow"', "gratitude no longer hands light into the footer");

const cssContracts = [
  ["contact-hero-matte-open-top", "hero aperture is missing"],
  ["contact-signal-reveal", "hero signal no longer resolves once"],
  ["contact-pathway-splice", "pathway light splice is missing"],
  ["contact-footer-afterglow", "closing afterglow is missing"],
  ['data-contact-gratitude-next-ready="true"', "gratitude completion handoff styling is missing"],
  ["[data-contact-gratitude-note]:focus-visible", "gratitude keyboard focus no longer uses the calm inset treatment"],
  ["[data-contact-gratitude-scroll-spine]", "gratitude scroll spine no longer has reduced-motion protection"],
  ["[data-contact-gratitude-note-label]", "gratitude label motion and reduced-motion protection are missing"],
  ["[data-contact-gratitude-reading-head]", "gratitude reading head styling or reduced-motion protection is missing"],
  ["[data-contact-gratitude-response-beat]", "gratitude response beat lacks reduced-motion protection"],
  ["[data-contact-gratitude-ledger-status-beat]", "gratitude completion status lacks reduced-motion protection"],
  ["[data-contact-gratitude-progress-beat]", "gratitude progress beat lacks reduced-motion protection"],
  ['html[data-motion="reduced"]', "explicit reduced-motion styling is missing"],
  ["@media (prefers-reduced-motion: reduce)", "system reduced-motion styling is missing"],
  ["@media (max-width: 359px)", "ultra-narrow phone protection is missing"],
  ["@media (max-width: 639px) and (max-height: 820px)", "short-phone fit protection is missing"],
  ["[data-contact-film] .contact-hero-film", "short-phone hero frame protection is missing"],
  ["[data-contact-film] [data-contact-hero-intro]", "short-phone hero copy protection is missing"],
  ["[data-contact-film] [data-contact-hero-direct] > span", "ultra-narrow direct routes no longer shed their redundant prompt"],
  ["width: calc(100vw - 1rem)", "ultra-narrow chapter dock fit protection is missing"],
  ["grid-template-columns: repeat(2, minmax(0, 1fr))", "short-phone hero choices no longer share one row"],
];

for (const [expected, message] of cssContracts) requireText(css, expected, message);

requireText(page, "data-contact-hero-intro", "Contact hero introduction is no longer addressable for short-phone fit");
requireText(page, "data-contact-hero-direct", "Contact hero direct routes are missing from the full layout");

forbidPattern(
  css,
  /contact-hero-signal-line[^}]*animation:[^;]*infinite/s,
  "hero signal must resolve once instead of looping like a GIF",
);
forbidPattern(
  callSequence,
  /repeat:\s*Infinity/,
  "call sequence must use finite arrival motion",
);
forbidPattern(
  gratitude,
  /repeat:\s*Infinity/,
  "gratitude motion must resolve instead of looping like a GIF",
);

if (!process.exitCode) {
  console.log("[contact-cinema] cinematic motion, interaction and reduced-motion contracts verified.");
}
