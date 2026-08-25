const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, ".next/server/app/index.html");
if (!fs.existsSync(htmlPath)) throw new Error("Build output missing. Run pnpm build before this rendered gate.");

function latestMtime(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).reduce((latest, entry) => {
    const absolute = path.join(directory, entry.name);
    return Math.max(latest, entry.isDirectory() ? latestMtime(absolute) : fs.statSync(absolute).mtimeMs);
  }, 0);
}

const htmlMtime = fs.statSync(htmlPath).mtimeMs;
const sourceMtime = Math.max(latestMtime(path.join(root, "src")), fs.statSync(path.join(root, "package.json")).mtimeMs);
if (htmlMtime < sourceMtime) throw new Error("Build output is stale relative to the current source. Run pnpm build again.");

const html = fs.readFileSync(htmlPath, "utf8");
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const expected = ["opening", "diagnostic", "cost", "evidence", "paths", "process", "studio", "decision", "invitation"];
const chapters = [...html.matchAll(/data-home-v4-chapter="([^"]+)"/g)].map((match) => match[1]);
assert(JSON.stringify(chapters) === JSON.stringify(expected), `Rendered chapter order drifted: ${chapters.join(", ")}`);
const runtimeChapters = [...html.matchAll(/data-home-chapter="([^"]+)"/g)].map((match) => match[1]);
assert(JSON.stringify(runtimeChapters) === JSON.stringify(expected), `Runtime chapter order drifted: ${runtimeChapters.join(", ")}`);

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
assert(duplicates.length === 0, `Rendered duplicate IDs: ${duplicates.join(", ")}`);
assert(ids.filter((id) => id === "studio").length === 1, "Studio anchor must be unique.");

const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => Number(match[1]));
assert(headings.filter((level) => level === 1).length === 1, "Homepage must contain exactly one h1.");
for (let index = 1; index < headings.length; index += 1) {
  assert(headings[index] <= headings[index - 1] + 1, `Heading outline skips from h${headings[index - 1]} to h${headings[index]}.`);
}

const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
assert(images.every((tag) => /\balt="[^"]*"/i.test(tag)), "A rendered homepage image lacks alt text.");
const videos = [...html.matchAll(/<video\b[^>]*>/gi)].map((match) => match[0]);
assert(videos.every((tag) => /\baria-hidden="true"/i.test(tag)), "A decorative homepage video is exposed to assistive technology.");
assert(!/<video\b[^>]*\bautoplay\b/i.test(html), "A homepage film restored unreliable native autoplay.");
assert(!html.includes("assets.calendly.com"), "Calendly loads before booking intent.");
for (const href of ["/contact#call", "/contact#write", "#evidence"]) {
  assert(html.includes(`href="${href}"`), `Rendered conversion handoff is missing ${href}.`);
}
assert(!/\b(?:click here|learn more)\b/i.test(html), "Homepage contains a generic link label.");

const cssHrefs = [...new Set([...html.matchAll(/href="([^"]+\.css)"/g)].map((match) => match[1]))];
const cssBytes = cssHrefs.reduce((total, href) => {
  const relative = href.replace(/^\/_next\/static\//, "");
  return total + fs.statSync(path.join(root, ".next/static", relative)).size;
}, 0);
assert(cssBytes <= 520_000, `Homepage CSS budget exceeded: ${cssBytes.toLocaleString()} bytes.`);

console.log(`Rendered homepage gate passed: nine ordered chapters, unique IDs, heading and media semantics, conversion handoffs, deferred scheduling, and ${cssBytes.toLocaleString()} CSS bytes verified.`);
