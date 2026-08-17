const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = process.cwd();
const mediaSource = fs.readFileSync(path.join(root, "src/data/insightMedia.ts"), "utf8");
const slugs = [...mediaSource.matchAll(/^\s{2}"([^"]+)": media\(/gm)].map((match) => match[1]);
assert(slugs.length === 29, `Expected 29 dedicated guide films, found ${slugs.length}`);
assert(new Set(slugs).size === slugs.length, "The guide media registry contains a repeated slug");

const archiveNames = ["opening", "featured", "paths", "guide", "library", "notes"].map(
  (name) => `archive-${name}`,
);
const topicNames = ["earth", "water", "fire", "air", "space"].flatMap((element) =>
  ["intro", "library", "next"].map((chapter) => `topic-${element}-${chapter}`),
);
const names = [...slugs, ...archiveNames, ...topicNames];
assert(names.length === 50, `Expected 50 Insights films, found ${names.length}`);
assert(new Set(names).size === names.length, "The Insights film inventory repeats a destination name");

for (const name of names) {
  const video = path.join(root, "public/videos/insights", `${name}.mp4`);
  const poster = path.join(root, "public/images/insights", `${name}-poster.jpg`);
  assert(fs.existsSync(video) && fs.statSync(video).size > 50_000, `${name} is missing its encoded film`);
  assert(fs.existsSync(poster) && fs.statSync(poster).size > 2_000, `${name} is missing its poster`);
  const duration = Number(
    execFileSync("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=nw=1:nk=1",
      video,
    ], { encoding: "utf8" }).trim(),
  );
  assert(duration >= 15.75, `${name} is only ${duration.toFixed(2)} seconds long`);
}

const archivePage = fs.readFileSync(path.join(root, "src/app/insights/page.tsx"), "utf8");
const explorer = fs.readFileSync(path.join(root, "src/components/InsightsExplorer.tsx"), "utf8");
for (const name of archiveNames) {
  const source = name === "archive-library" ? explorer : archivePage;
  assert(source.includes(`/videos/insights/${name}.mp4`), `Insights archive does not use ${name}`);
}

const topicPage = fs.readFileSync(path.join(root, "src/app/insights/topic/[topic]/page.tsx"), "utf8");
assert(topicPage.includes("topic-${topic.element}-${chapter}.mp4"), "Topic hubs do not select element-specific films");

process.stdout.write("Insights media uniqueness gate passed: 29 guides, 6 archive films, and 15 topic films.\n");
