const fs = require("node:fs");
const path = require("node:path");

/*
 * Type floor gate.
 *
 * The same wrong value (0.56rem, about 8.96px) independently produced sub-9px
 * READING text in three separate files: the Home hero eyebrow, the Services
 * audit status region, and the Contact phone number. In every case a mobile
 * override also made the type smaller on the smallest screens, so fixing the
 * base rule alone looked correct and changed nothing where it mattered.
 *
 * Two floors, matching the tokens in src/app/globals.css:
 *   --text-reading-min  0.7rem  anything a visitor has to read
 *   --text-label-min    0.5rem  genuine small-caps treatment
 *
 * A declaration under the reading floor passes only if its own rule also sets
 * `text-transform: uppercase` (a real small-caps label) or carries an explicit
 * `type-floor-ok` comment stating why. Nothing may go under the label floor.
 */

const ROOT = path.resolve(__dirname, "..");
const SOURCE_ROOTS = ["src"];
const SKIP_PATHS = [`${path.sep}qa${path.sep}`, "node_modules", ".next"];

const READING_MIN_REM = 0.7;
const LABEL_MIN_REM = 0.5;
const ROOT_PX = 16;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (SKIP_PATHS.some((skip) => full.includes(skip))) continue;
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(css|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

// smallest length in a declaration value, in rem (handles clamp/min/max)
function smallestRem(value) {
  let smallest = null;
  for (const match of value.matchAll(/(-?\d*\.?\d+)\s*(rem|px)\b/g)) {
    const raw = Number.parseFloat(match[1]);
    if (!Number.isFinite(raw)) continue;
    const rem = match[2] === "px" ? raw / ROOT_PX : raw;
    if (smallest === null || rem < smallest) smallest = rem;
  }
  return smallest;
}

// the CSS rule block containing an index: back to its `{`, forward to its `}`
function enclosingBlock(text, index) {
  let depth = 0;
  let start = 0;
  for (let i = index; i >= 0; i -= 1) {
    if (text[i] === "}") depth += 1;
    else if (text[i] === "{") {
      if (depth === 0) { start = i; break; }
      depth -= 1;
    }
  }
  depth = 0;
  let end = text.length;
  for (let i = start + 1; i < text.length; i += 1) {
    if (text[i] === "{") depth += 1;
    else if (text[i] === "}") {
      if (depth === 0) { end = i; break; }
      depth -= 1;
    }
  }
  return text.slice(start, end);
}

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

let violations = [];

for (const file of SOURCE_ROOTS.flatMap((dir) => walk(path.join(ROOT, dir)))) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);

  if (file.endsWith(".css")) {
    for (const match of text.matchAll(/font-size\s*:\s*([^;}]+)/g)) {
      const rem = smallestRem(match[1]);
      if (rem === null || rem >= READING_MIN_REM) continue;
      const block = enclosingBlock(text, match.index);
      const isLabel = /text-transform\s*:\s*uppercase/.test(block);
      const excused = /type-floor-ok/.test(block);
      if (rem < LABEL_MIN_REM) {
        violations.push({ rel, line: lineOf(text, match.index), rem,
          why: `below the label floor (${LABEL_MIN_REM}rem); nothing may be this small` });
      } else if (!isLabel && !excused) {
        violations.push({ rel, line: lineOf(text, match.index), rem,
          why: `below the reading floor (${READING_MIN_REM}rem) and the rule is not uppercase` });
      }
    }
  } else {
    // Tailwind arbitrary sizes: text-[0.62rem]
    for (const match of text.matchAll(/text-\[(\d*\.?\d+)(rem|px)\]/g)) {
      const rem = match[2] === "px" ? Number.parseFloat(match[1]) / ROOT_PX : Number.parseFloat(match[1]);
      if (rem >= READING_MIN_REM) continue;
      const around = text.slice(Math.max(0, match.index - 260), match.index + 260);
      const isLabel = /uppercase/.test(around);
      const excused = /type-floor-ok/.test(around);
      if (rem < LABEL_MIN_REM) {
        violations.push({ rel, line: lineOf(text, match.index), rem,
          why: `below the label floor (${LABEL_MIN_REM}rem); nothing may be this small` });
      } else if (!isLabel && !excused) {
        violations.push({ rel, line: lineOf(text, match.index), rem,
          why: `below the reading floor (${READING_MIN_REM}rem) and no uppercase treatment nearby` });
      }
    }
  }
}

/*
 * Baseline. This rule arrived long after the type did, and there are hundreds of
 * pre-existing declarations below the floor across files owned by different
 * people. Failing on all of them would make the gate unrunnable and it would be
 * switched off within a day, which protects nothing.
 *
 * So the baseline grandfathers what already existed and the gate fails only on
 * NEW violations. That is the part that matters: the floor cannot be breached
 * again. The recorded count is printed on every run so the debt stays visible
 * and can be burned down deliberately. Remove entries as they are fixed; never
 * regenerate the file to make a failure disappear.
 */
const BASELINE_PATH = path.join(__dirname, "type-floor-baseline.json");
const key = (v) => `${v.rel}:${v.line}`;

let baseline = new Set();
if (fs.existsSync(BASELINE_PATH)) {
  baseline = new Set(JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")).entries);
}

if (process.argv.includes("--write-baseline")) {
  fs.writeFileSync(
    BASELINE_PATH,
    `${JSON.stringify({ recorded: violations.length, entries: violations.map(key).sort() }, null, 2)}\n`,
  );
  console.log(`Baseline written: ${violations.length} pre-existing declaration(s) recorded.`);
  process.exit(0);
}

const grandfathered = violations.filter((v) => baseline.has(key(v)));
violations = violations.filter((v) => !baseline.has(key(v)));

if (violations.length > 0) {
  console.error(`Type floor gate failed: ${violations.length} NEW declaration(s) below the floor.\n`);
  for (const v of violations.sort((a, b) => a.rem - b.rem)) {
    console.error(`  ${v.rel}:${v.line}  ${v.rem}rem (${(v.rem * ROOT_PX).toFixed(1)}px)`);
    console.error(`      ${v.why}`);
  }
  console.error(`\nRaise it to var(--text-reading-min), or if it is genuinely a short`);
  console.error(`uppercase label, keep it uppercase and at or above ${LABEL_MIN_REM}rem.`);
  console.error(`Deliberate exceptions: add a "type-floor-ok: <reason>" comment in the rule.`);
  process.exit(1);
}

console.log(
  `Type floor gate passed: no new reading text below the floor` +
    (grandfathered.length > 0
      ? ` (${grandfathered.length} pre-existing, recorded in type-floor-baseline.json).`
      : "."),
);
