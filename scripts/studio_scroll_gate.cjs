const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const source = fs.readFileSync("src/sections/Home/studioScroll.ts", "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { studioProgress, studioStep } = context.exports;

assert.equal(studioProgress(0, 900, 900), null);
assert.equal(studioProgress(-100, 700, 900), null);
assert.equal(studioProgress(90, 2160, 900), 0);
assert.equal(studioProgress(-630, 2160, 900), .5);
assert.equal(studioProgress(-2000, 2160, 900), 1);
for (const [progress, previous, expected] of [
  [0, 0, 0], [.33, 0, 0], [.34, 0, 0], [.36, 0, 1],
  [.325, 1, 1], [.30, 1, 0], [.67, 1, 1], [.70, 1, 2],
  [.66, 2, 2], [.64, 2, 1], [1, 0, 2], [0, 2, 0],
]) assert.equal(studioStep(progress, previous, 3), expected);
const component = fs.readFileSync("src/sections/Home/StudioCinematicChapter.tsx", "utf8");
assert.ok(component.includes('focused.matches(":focus-visible")'), "Keyboard focus must own the panel");
assert.ok(component.includes('section.removeEventListener("focusout", schedule)'), "Clean up focus listener");
assert.ok(component.includes('prefersReducedMotion || !desktopMotion'), "Compact portrait must remain still");
const css = fs.readFileSync("src/app/home-v4-studio-scroll.css", "utf8");
assert.ok(css.includes('html[data-motion="reduced"]'), "Respect the site preference");
assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), "Respect the OS preference");
console.log("Studio scroll gate passed: reversible progression, boundary deadband, collapsed-runway guard, keyboard ownership and motion fallbacks.");
