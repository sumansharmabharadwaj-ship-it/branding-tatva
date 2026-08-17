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
const routeFiles = [
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/glossary/page.tsx",
  "src/app/glossary/[term]/page.tsx",
];

const references = routeFiles.map((file) => {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const films = [...source.matchAll(/\/videos\/[^"'\s)]+\.mp4/g)].map((match) => match[0]);
  assert(films.length === 1, `${file} should expose one route-specific opening film, found ${films.length}`);
  return { file, film: films[0] };
});

const films = references.map(({ film }) => film);
assert(new Set(films).size === films.length, "A utility route repeats another utility opening film");
assert(!films.some((film) => /pexels-(studio-morning-light|dandelion-release)/.test(film)), "A retired short shared loop returned");

const report = references.map(({ file, film }) => {
  const video = path.join(root, "public", film);
  const poster = path.join(
    root,
    "public",
    film.replace("/videos/", "/images/").replace(/\.mp4$/, "-poster.jpg"),
  );
  assert(fs.existsSync(video) && fs.statSync(video).size > 50_000, `${film} is missing its film`);
  assert(fs.existsSync(poster) && fs.statSync(poster).size > 2_000, `${film} is missing its poster`);

  const mp4 = fs.readFileSync(video);
  assert(mp4.subarray(0, 64).includes(Buffer.from("ftyp")), `${film} is not a valid MP4 container`);
  assert(mp4.includes(Buffer.from("moov")), `${film} has no playable moov atom`);
  const duration = durationSeconds(mp4, film);
  assert(duration >= 16, `${film} is only ${duration.toFixed(2)} seconds; short-loop footage is not allowed`);
  return { route: file, film, duration: Number(duration.toFixed(2)) };
});

process.stdout.write(`${JSON.stringify({ utilityMediaGate: "passed", films: report }, null, 2)}\n`);
