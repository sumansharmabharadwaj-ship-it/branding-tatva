const fs = require("node:fs");
const path = require("node:path");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function mp4DurationSeconds(buffer, label) {
  const marker = buffer.indexOf(Buffer.from("mvhd"));
  assert(marker >= 0, `${label} has no movie header`);

  const version = buffer.readUInt8(marker + 4);
  if (version === 1) {
    const timescale = buffer.readUInt32BE(marker + 24);
    const duration = Number(buffer.readBigUInt64BE(marker + 28));
    return duration / timescale;
  }

  const timescale = buffer.readUInt32BE(marker + 16);
  const duration = buffer.readUInt32BE(marker + 20);
  return duration / timescale;
}

const root = process.cwd();
const sourceFiles = [
  "src/app/about/page.tsx",
  ...fs
    .readdirSync(path.join(root, "src/sections/About"))
    .filter((name) => name.endsWith(".tsx"))
    .map((name) => `src/sections/About/${name}`),
  "src/components/MeadowClosing.tsx",
  "src/components/SeasonalCalendarPanel.tsx",
];

const refs = sourceFiles.flatMap((file) => {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  return [...source.matchAll(/\/videos\/[^"'\s)]+\.mp4/g)].map((match) => ({ file, video: match[0] }));
});

assert(refs.length === 16, `Expected 16 About-route films, found ${refs.length}`);
assert(new Set(refs.map(({ video }) => video)).size === refs.length, "The About route repeats a film source");

for (const { file, video } of refs) {
  const absolute = path.join(root, "public", video);
  assert(fs.existsSync(absolute), `${file} references missing film ${video}`);
  assert(fs.statSync(absolute).size > 50_000, `${video} is too small to be a cinematic film`);

  const mp4 = fs.readFileSync(absolute);
  assert(mp4.subarray(0, 64).includes(Buffer.from("ftyp")), `${video} is not a valid MP4 container`);
  assert(mp4.includes(Buffer.from("moov")), `${video} has no playable moov atom`);

  const duration = mp4DurationSeconds(mp4, video);
  assert(duration >= 16, `${video} is only ${duration.toFixed(2)} seconds; short-loop footage is not allowed`);
}

process.stdout.write(`About media release gate passed: ${refs.length} unique films, all at least 16 seconds.\n`);
