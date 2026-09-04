const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, ".next/server/app/index.html");
if (!fs.existsSync(htmlPath)) {
  throw new Error("Build output missing. Run pnpm build before this rendered gate.");
}

function latestMtime(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).reduce((latest, entry) => {
    const absolute = path.join(directory, entry.name);
    return Math.max(latest, entry.isDirectory() ? latestMtime(absolute) : fs.statSync(absolute).mtimeMs);
  }, 0);
}

const htmlMtime = fs.statSync(htmlPath).mtimeMs;
const sourceMtime = Math.max(
  latestMtime(path.join(root, "src")),
  fs.statSync(path.join(root, "package.json")).mtimeMs,
);
if (htmlMtime < sourceMtime) {
  throw new Error("Build output is stale relative to the current source. Run pnpm build again.");
}

const html = fs.readFileSync(htmlPath, "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const expected = [
  "opening",
  "recognition",
  "cost",
  "foundation",
  "paths",
  "process",
  "evidence",
  "tatva",
  "studio",
  "decision",
  "invitation",
];
const chapters = [...html.matchAll(/data-home-v4-chapter="([^"]+)"/g)].map((match) => match[1]);
assert(
  JSON.stringify(chapters) === JSON.stringify(expected),
  `Rendered chapter order drifted: ${chapters.join(", ")}`,
);

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
assert(duplicates.length === 0, `Rendered duplicate IDs: ${duplicates.join(", ")}`);

const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => Number(match[1]));
assert(headings.filter((level) => level === 1).length === 1, "Homepage must contain exactly one h1.");
for (let index = 1; index < headings.length; index += 1) {
  assert(
    headings[index] <= headings[index - 1] + 1,
    `Heading outline skips from h${headings[index - 1]} to h${headings[index]}.`,
  );
}

const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
assert(images.every((tag) => /\balt="[^"]*"/i.test(tag)), "A rendered homepage image lacks alt text.");
const videos = [...html.matchAll(/<video\b[^>]*>/gi)].map((match) => match[0]);
assert(videos.every((tag) => /\bmuted/i.test(tag)), "A homepage film can start with sound.");
assert(videos.every((tag) => /\bplaysinline/i.test(tag)), "A homepage film can escape inline playback.");
assert(!html.includes("assets.calendly.com"), "Calendly loads before booking intent.");

for (const href of ["#recognition", "#cost", "#foundation", "#evidence", "#process", "#invitation"]) {
  assert(html.includes(`href="${href}"`), `Rendered decision path is missing ${href}.`);
}
for (const label of ["Find the gap in your brand", "See recorded proof", "Talk with Suman"]) {
  assert(html.includes(label), `Rendered homepage is missing ${label}.`);
}
assert(!/\b(?:click here|learn more)\b/i.test(html), "Homepage contains a generic action label.");

const cssHrefs = [...new Set([...html.matchAll(/href="([^"]+\.css)"/g)].map((match) => match[1]))];
const cssFiles = cssHrefs.map((href) => href.replace(/^\/_next\/static\//, ""));
const cssBytes = cssFiles.reduce(
  (total, relative) => total + fs.statSync(path.join(root, ".next/static", relative)).size,
  0,
);
const cssText = cssFiles
  .map((relative) => fs.readFileSync(path.join(root, ".next/static", relative), "utf8"))
  .join("\n");
for (const marker of [
  ".home-v4-guide",
  ".home-v4-cursor",
  "text-wrap:balance",
  "outline:2px solid #ead6bc",
]) {
  assert(cssText.includes(marker), `Rendered homepage CSS is missing ${marker}.`);
}
assert(cssBytes <= 600_000, `Homepage CSS budget exceeded: ${cssBytes.toLocaleString()} bytes.`);

console.log(
  `Rendered homepage gate passed: eleven ordered chapters, unique IDs, heading and media semantics, clear decision handoffs, and ${cssBytes.toLocaleString()} CSS bytes verified.`,
);
