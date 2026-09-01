const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(
  path.join(root, "src/sections/HomeV4/HomeV4Experience.tsx"),
  "utf8",
);
const pageSource = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf8");
const jumpNavSource = fs.readFileSync(path.join(root, "src/components/SectionJumpNav.tsx"), "utf8");
const openingSource = fs.readFileSync(path.join(root, "src/sections/HomeV4/HomeV4Scenes.tsx"), "utf8");
const mountedChapterSources = [
  "src/sections/HomeV4/HomeV4Scenes.tsx",
  "src/sections/Home/HomeBrandHealthCheck.tsx",
  "src/sections/Home/EvidenceWall.tsx",
  "src/sections/Home/PathsCinematicChapter.tsx",
  "src/sections/Process/RootSystem.tsx",
  "src/sections/Home/StudioCinematicChapter.tsx",
  "src/sections/Home/HomeQuestionsScene.tsx",
  "src/sections/Home/FinalInvitation.tsx",
].map((file) => fs.readFileSync(path.join(root, file), "utf8"));
const mountedChapterSource = mountedChapterSources.join("\n");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const sequence = [
  "<V4OpeningScene />",
  "<HomeBrandHealthCheck />",
  "<V4HiddenCostScene />",
  'data-home-v4-chapter="evidence"',
  'data-home-v4-chapter="paths"',
  'data-home-v4-chapter="process"',
  'data-home-v4-chapter="studio"',
  'data-home-v4-chapter="decision"',
  'data-home-v4-chapter="invitation"',
];

let previous = -1;
for (const marker of sequence) {
  const index = source.indexOf(marker);
  assert(index > previous, `Homepage chapter order is missing or drifted at ${marker}.`);
  previous = index;
}

assert(source.includes("<HomeV4SceneRhythm />"), "Homepage chapters have lost their shared arrival rhythm.");
assert(!source.includes("<HomeV4SeamDirector />"), "Homepage restored a decorative seam runtime between chapters.");
assert(!source.includes("<SceneHandoff "), "Homepage restored a layout-bearing handoff between chapters.");

for (const removed of [
  "V4RecognitionScene",
  "BrandFoundationScene",
  "TatvaSystemLab",
  "HomeInsightsPreview",
  "HomeV4ProcessTempo",
  "HomeV4ScrollCamera",
  "HomeV4HeaderDirector",
]) {
  assert(!source.includes(removed), `${removed} restored a removed chapter or competing runtime.`);
}

for (const marker of [
  "<SectionJumpNav",
  "hideOnFirst",
  "hideOnLast",
  'desktopMode="rail"',
  'tone="light"',
  "guidedMobile",
  'home-v4-experience-upgrade.css',
  'home-v4-scene-rhythm.css',
]) {
  assert(pageSource.includes(marker), `Homepage wayfinding is missing ${marker}.`);
}

assert(
  pageSource.indexOf('home-v4-scene-rhythm.css') >
    pageSource.indexOf('home-v4-homepage-reconstruction.css'),
  "Homepage arrival rhythm must load after the shared layout owner.",
);

assert(
  mountedChapterSource.includes("3 choices · about 30 seconds · instant direction"),
  "Homepage diagnostic does not explain its effort and immediate value.",
);

assert(
  !pageSource.includes('showActiveLabel={false}'),
  "Homepage hides the current chapter name from its desktop rail.",
);

for (const marker of [
  "activeItem?.label",
  "dismissFromKeyboard",
  "dismissFromOutside",
  "data-section-jump-tone",
  "data-section-jump-progress",
  "data-section-jump-yielding",
  "data-section-jump-desktop-yielding",
  "mobileYielding",
  "IntersectionObserver",
  "document.activeElement",
  "focusMobileChapter",
  "focusMobileDestination",
  "focusDesktopChapter",
  "chooseMobile",
  "data-section-jump-moving",
  "Moving to chapter",
  'behavior: prefersReducedMotion ? "auto" : "smooth"',
  "window.history.pushState",
  'role="status"',
  "AnimatePresence",
  'data-section-jump-mobile-menu="true"',
  'data-section-jump-menu-summary="true"',
  "max-height: 620px",
  "Continue to chapter",
  "scrollIntoView",
  "showActiveLabel",
]) {
  assert(jumpNavSource.includes(marker), `Homepage wayfinding interaction is missing ${marker}.`);
}

assert(
  (mountedChapterSource.match(/data-section-jump-yield="true"/g) || []).length === 7,
  "Every intermediate homepage chapter must expose one primary action that can dismiss the mobile guide.",
);

assert(
  openingSource.includes('href="#brand-diagnostic"') && openingSource.includes("Diagnose my brand"),
  "Opening no longer gives the interactive diagnosis a clear first-screen entry.",
);
assert(
  openingSource.includes('href="#evidence"') && openingSource.includes("Inspect the client evidence"),
  "Opening no longer keeps verified evidence one action away.",
);

for (const retiredStylesheet of [
  "home-v4-health.css",
  "home-v4-decision-depth.css",
  "home-v4-invitation-depth.css",
  "home-v4-screen-fit.css",
  "home-v4-seamless-scenes.css",
  "home-v4-continuous-fit.css",
]) {
  assert(
    !pageSource.includes(retiredStylesheet),
    `Retired homepage stylesheet restored: ${retiredStylesheet}.`,
  );
}

for (const href of [
  "#opening",
  "#brand-diagnostic",
  "#cost",
  "#evidence",
  "#paths",
  "#process",
  "#studio",
  "#decision",
  "#invitation",
]) {
  assert(pageSource.includes(`href: "${href}"`), `Homepage wayfinding is missing ${href}.`);
}

for (const [index, marker] of [
  'data-home-chapter="opening"',
  "02 · Brand diagnostic",
  "<span>03</span>",
  "04 · Selected work",
  "<span>05</span>",
  "06 · The method",
  "07 · The thinking behind the work",
  "08 · Before we work together",
  "09 · Begin",
].entries()) {
  assert(
    mountedChapterSources.some((chapter) => chapter.includes(marker)),
    `Visible chapter ${String(index + 1).padStart(2, "0")} is missing its canonical label.`,
  );
}

console.log("Homepage conversion sequence gate passed: one focused nine-chapter journey verified.");
