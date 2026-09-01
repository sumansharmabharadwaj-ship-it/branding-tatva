const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function fail(message) {
  console.error(`MEDIA SEARCH GATE: FAIL\n${message}`);
  process.exit(1);
}

const sourceFiles = walk(SRC).filter((file) => file.endsWith(".tsx"));
let videoCount = 0;
const videoFailures = [];

for (const file of sourceFiles) {
  const source = fs
    .readFileSync(file, "utf8")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
  const matches = source.matchAll(/<(?:motion\.)?video\b/g);

  for (const match of matches) {
    videoCount += 1;
    const start = match.index ?? 0;
    const openingContext = source.slice(start, start + 900);
    const closing = source.indexOf("</video>", start);
    const fullContext = source.slice(start, closing >= 0 ? closing + 8 : start + 1200);
    const decorative = /aria-hidden\s*=\s*(?:"true"|\{true\})/.test(openingContext);
    const captions = /<track[\s\S]*?kind\s*=\s*["']captions["']/.test(fullContext);
    const transcript = /data-transcript-id\s*=/.test(openingContext);

    if (!decorative && !(captions && transcript)) {
      const line = source.slice(0, start).split("\n").length;
      videoFailures.push(
        `${path.relative(ROOT, file)}:${line} must be decorative (aria-hidden) or provide captions and data-transcript-id`,
      );
    }
  }
}

if (videoFailures.length > 0) fail(videoFailures.join("\n"));

const mediaMode = fs.readFileSync(path.join(SRC, "lib", "mediaMode.ts"), "utf8");
for (const prefix of ['"/videos/generated/"', '"/videos/higgsfield-"']) {
  if (!mediaMode.includes(prefix)) {
    fail(`Synthetic motion classification is missing ${prefix}.`);
  }
}

const videoBreak = fs.readFileSync(path.join(SRC, "components", "VideoBreak.tsx"), "utf8");
if (!videoBreak.includes('cameraPush ? "hero" : "subtle"')) {
  fail("Synthetic closing films no longer receive the hero living-image treatment.");
}

const termsPage = fs.readFileSync(path.join(SRC, "app", "terms", "page.tsx"), "utf8");
if (
  !termsPage.includes("bt-terms-commitment-paper-v2.webp") ||
  !termsPage.includes("<LivingImage")
) {
  fail("Terms no longer carries its own interactive agreement image.");
}

const caseStudyExperience = fs.readFileSync(
  path.join(SRC, "sections", "Work", "CaseStudyExperience.tsx"),
  "utf8",
);
for (const required of [
  "const livingStill = usesLivingStill(src);",
  'intensity="hero"',
  'intensity="cinematic"',
]) {
  if (!caseStudyExperience.includes(required)) {
    fail(`Case-study heroes can restore synthetic looping media: missing ${required}.`);
  }
}

for (const relative of [
  "components/CinematicCardMedia.tsx",
  "components/ElementRowBackground.tsx",
  "components/FeaturedWorkHero.tsx",
  "sections/Hero/index.tsx",
  "sections/Process/JourneyStage.tsx",
  "sections/Threshold/ThresholdPanel.tsx",
]) {
  const component = fs.readFileSync(path.join(SRC, relative), "utf8");
  if (!component.includes("usesLivingStill") || !component.includes("<LivingImage")) {
    fail(`${relative} can bypass the shared synthetic-media treatment.`);
  }
}

const dataSources = walk(path.join(SRC, "data"))
  .filter((file) => file.endsWith(".ts"))
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");
const heroImages = (dataSources.match(/heroImage\??\s*:/g) ?? []).length;
const heroAlts = (dataSources.match(/heroImageAlt\??\s*:/g) ?? []).length;

if (heroImages !== heroAlts || heroImages < 29) {
  fail(`Insight hero image coverage is incomplete: ${heroImages} images, ${heroAlts} alt descriptions.`);
}

const sitemap = fs.readFileSync(path.join(SRC, "app", "sitemap.ts"), "utf8");
for (const required of [
  "getCaseStudySearchMedia",
  "getInsightSearchMedia",
  "CORE_ROUTE_SEARCH_IMAGES",
  "images: [media.url]",
]) {
  if (!sitemap.includes(required)) fail(`sitemap.ts is missing ${required}.`);
}

const workPage = fs.readFileSync(path.join(SRC, "app", "work", "[slug]", "page.tsx"), "utf8");
for (const required of [
  '"@type": "ImageObject"',
  "contentUrl: media.url",
  "caption: media.caption",
  "creditText: media.creditText",
  "evidenceAlt={media.alt}",
]) {
  if (!workPage.includes(required)) fail(`Case-study media metadata is missing ${required}.`);
}

console.log(
  `MEDIA SEARCH GATE: PASS (${videoCount} decorative/transcript-safe videos, ${heroImages - 1} insight images, 5 case-study images)`,
);
