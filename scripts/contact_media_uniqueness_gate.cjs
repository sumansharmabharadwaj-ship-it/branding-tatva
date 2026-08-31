const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = process.cwd();
const sourceFiles = [
  "src/app/contact/page.tsx",
  "src/components/ContactPathways.tsx",
];
const source = sourceFiles
  .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
  .join("\n");

function fail(message) {
  console.error(`[contact-media] ${message}`);
  process.exitCode = 1;
}

const forbiddenSources = [
  "/videos/pexels-",
  "/videos/pixabay-",
  "bt-contact-fog-sunrise",
  "bt-contact-three-paths-waterpaper",
  "bt-contact-moss-stream",
  "bt-contact-valley-first-light",
];

for (const forbidden of forbiddenSources) {
  if (source.includes(forbidden)) {
    fail(`legacy footage is still referenced: ${forbidden}`);
  }
}

const expectedFilms = [
  "bt-contact-original-hero.mp4",
  "bt-contact-original-pathways.mp4",
  "bt-contact-original-book.mp4",
  "bt-contact-original-speak.mp4",
  "bt-contact-original-write-card.mp4",
  "bt-contact-original-write-scene.mp4",
  "bt-contact-original-call.mp4",
  "bt-contact-original-gratitude.mp4",
];

const expectedPosters = expectedFilms.map((film) => film.replace(/\.mp4$/, "-poster.jpg"));
const desktopReferences = [
  ...source.matchAll(/\/videos\/generated\/(bt-contact-original-[a-z-]+\.mp4)/g),
]
  .map((match) => match[1])
  .filter((file) => !file.includes("-mobile"));
const posterReferences = [
  ...source.matchAll(/\/images\/generated\/(bt-contact-original-[a-z-]+-poster\.jpg)/g),
].map((match) => match[1]);

if (desktopReferences.length !== expectedFilms.length) {
  fail(`expected ${expectedFilms.length} desktop film placements, found ${desktopReferences.length}`);
}
if (new Set(desktopReferences).size !== desktopReferences.length) {
  fail("a desktop film is assigned to more than one Contact placement");
}
const posterReferenceCounts = posterReferences.reduce((counts, poster) => {
  counts.set(poster, (counts.get(poster) || 0) + 1);
  return counts;
}, new Map());
if (posterReferenceCounts.size !== expectedPosters.length) {
  fail(`expected ${expectedPosters.length} unique poster placements, found ${posterReferenceCounts.size}`);
}
for (const [poster, count] of posterReferenceCounts) {
  const expectedCount = poster === "bt-contact-original-hero-poster.jpg" ? 2 : 1;
  if (count !== expectedCount) {
    fail(`${poster} is referenced ${count} times; expected ${expectedCount}`);
  }
}

for (const film of expectedFilms) {
  if (!desktopReferences.includes(film)) fail(`missing film placement: ${film}`);
}
for (const poster of expectedPosters) {
  if (!posterReferences.includes(poster)) fail(`missing poster placement: ${poster}`);
}

const hashes = new Map();
for (const film of expectedFilms) {
  const absolutePath = path.join(root, "public/videos/generated", film);
  if (!fs.existsSync(absolutePath)) {
    fail(`missing media file: ${film}`);
    continue;
  }

  const buffer = fs.readFileSync(absolutePath);
  if (buffer.length < 50_000) fail(`media file is unexpectedly small: ${film}`);

  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  if (hashes.has(hash)) {
    fail(`${film} duplicates ${hashes.get(hash)} byte-for-byte`);
  } else {
    hashes.set(hash, film);
  }

  const audioStreams = execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "a",
      "-show_entries",
      "stream=index",
      "-of",
      "csv=p=0",
      absolutePath,
    ],
    { encoding: "utf8" },
  ).trim();
  if (audioStreams) fail(`ambient film must not contain audio: ${film}`);
}

for (const poster of expectedPosters) {
  const absolutePath = path.join(root, "public/images/generated", poster);
  if (!fs.existsSync(absolutePath)) fail(`missing poster file: ${poster}`);
}

if (!process.exitCode) {
  console.log(
    `[contact-media] ${expectedFilms.length} unique Contact films and ${expectedPosters.length} unique posters verified.`,
  );
}
