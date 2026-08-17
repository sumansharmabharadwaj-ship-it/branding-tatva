const fs = require("node:fs");
const path = require("node:path");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function durationSeconds(buffer, label) {
  const marker = buffer.indexOf(Buffer.from("mvhd"));
  assert(marker >= 0, `${label} has no movie header`);
  const version = buffer.readUInt8(marker + 4);
  if (version === 1) {
    return Number(buffer.readBigUInt64BE(marker + 28)) / buffer.readUInt32BE(marker + 24);
  }
  return buffer.readUInt32BE(marker + 20) / buffer.readUInt32BE(marker + 16);
}

const root = process.cwd();
const sourceFiles = [
  "src/app/work/page.tsx",
  "src/sections/Work/WorkOpening.tsx",
  "src/sections/Work/WorkIndex.tsx",
  "src/sections/Work/ProjectStoryWall.tsx",
  "src/sections/Work/SystemFlagship.tsx",
  "src/sections/Work/DecisionEvidenceGallery.tsx",
  "src/sections/Work/CapabilityMap.tsx",
  "src/sections/Work/TatvaLab.tsx",
  "src/sections/CaseStudies/BrandStudies.tsx",
  "src/sections/Work/Authorship.tsx",
  "src/sections/Footer/index.tsx",
  "src/components/SeasonalCalendarPanel.tsx",
];

const references = sourceFiles.flatMap((file) => {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  return [...source.matchAll(/\/videos\/[^"'\s)]+\.mp4/g)].map((match) => match[0]);
});
const films = [...new Set(references)];

assert(films.length === 12, `Expected 12 distinct Work-route films, found ${films.length}`);
assert(references.length === films.length, "The Work route repeats a film source");

for (const film of films) {
  const video = path.join(root, "public", film);
  const poster = path.join(root, "public", film.replace("/videos/", "/images/").replace(/\.mp4$/, "-poster.jpg"));
  assert(fs.existsSync(video) && fs.statSync(video).size > 50_000, `${film} is missing its film`);
  assert(fs.existsSync(poster) && fs.statSync(poster).size > 2_000, `${film} is missing its poster`);

  const mp4 = fs.readFileSync(video);
  assert(mp4.subarray(0, 64).includes(Buffer.from("ftyp")), `${film} is not a valid MP4 container`);
  assert(mp4.includes(Buffer.from("moov")), `${film} has no playable moov atom`);
  const duration = durationSeconds(mp4, film);
  assert(duration >= 16, `${film} is only ${duration.toFixed(2)} seconds; short-loop footage is not allowed`);
}

process.stdout.write(`Work media release gate passed: ${films.length} distinct films, all at least 16 seconds.\n`);
