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
requireText(gratitude, "data-contact-gratitude-bloom", "gratitude bloom is missing");
requireText(gratitude, "data-contact-gratitude-complete", "gratitude completion state is missing");
requireText(callSequence, "data-contact-call-step", "call sequence no longer exposes its active step");
requireText(form, "data-contact-form-completion", "written enquiry no longer exposes completion progress");
requireText(rail, "data-active-index", "chapter rail no longer exposes its film index");
requireText(page, 'className="contact-footer-afterglow"', "gratitude no longer hands light into the footer");

const cssContracts = [
  ["contact-hero-matte-open-top", "hero aperture is missing"],
  ["contact-signal-reveal", "hero signal no longer resolves once"],
  ["contact-pathway-splice", "pathway light splice is missing"],
  ["contact-footer-afterglow", "closing afterglow is missing"],
  ['html[data-motion="reduced"]', "explicit reduced-motion styling is missing"],
  ["@media (prefers-reduced-motion: reduce)", "system reduced-motion styling is missing"],
  ["@media (max-width: 639px) and (max-height: 820px)", "short-phone fit protection is missing"],
];

for (const [expected, message] of cssContracts) requireText(css, expected, message);

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

if (!process.exitCode) {
  console.log("[contact-cinema] cinematic motion, interaction and reduced-motion contracts verified.");
}
