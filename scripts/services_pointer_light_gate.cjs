// Run the actual pointer effect with a controlled frame clock. This checks
// work per paint rather than wall-clock timing in a shared build environment.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const vm = require("node:vm");

class Events {
  listeners = new Map();
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(callback);
  }
  removeEventListener(type, callback) { this.listeners.get(type)?.delete(callback); }
  emit(type, event = {}) { this.listeners.get(type)?.forEach((callback) => callback(event)); }
}

const frames = new Map();
let frameId = 0;
let reads = 0;
let reduced = false;
let bounds = { left: 20, top: 40 };
let dispose;
const section = new Events();
section.getBoundingClientRect = () => { reads++; return bounds; };
const layer = { parentElement: section, dataset: {} };
const pool = { parentElement: layer, style: {} };
const finePointer = new Events();
finePointer.matches = true;
const document = new Events();
document.hidden = false;
document.documentElement = { dataset: {} };
const moduleExports = {};
const sourcePath = process.argv[2] || path.resolve(__dirname, "../src/sections/Services/ServicesPointerLight.tsx");
const compiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
vm.runInNewContext(compiled, {
  exports: moduleExports, document,
  window: { matchMedia: (query) => query.includes("pointer") ? finePointer : { matches: reduced } },
  requestAnimationFrame: (callback) => { frames.set(++frameId, callback); return frameId; },
  cancelAnimationFrame: (id) => frames.delete(id),
  require: (id) => {
    if (id === "react") return { useRef: () => ({ current: pool }), useEffect: (effect) => { dispose = effect(); } };
    if (id === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null };
    if (id === "@/hooks/useHydratedReducedMotion") return { useHydratedReducedMotion: () => reduced };
    throw new Error(`Unexpected import ${id}`);
  },
});
const mount = () => moduleExports.ServicesPointerLight({});
const move = (clientX, clientY, pointerType = "mouse") => section.emit("pointermove", { clientX, clientY, pointerType });
function paint() {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback());
}

mount();
for (let i = 0; i < 100; i++) move(i, i + 20);
assert.equal(reads, 0, "Pointer events must defer geometry reads until paint");
assert.equal(frames.size, 1, "A burst of pointer events should queue one frame");
bounds = { left: 30, top: 60 }; // Scrolling may move the section before paint.
paint();
assert.equal(reads, 1);
assert.equal(pool.style.translate, "69px 59px", "Use the latest pointer and current section bounds");
assert.equal(layer.dataset.pointerLightAwake, "true");
assert.equal(frames.size, 0, "The light should idle without a perpetual frame loop");

move(200, 250);
section.emit("pointerleave");
paint();
assert.equal(reads, 1, "Leaving the section must cancel queued work");
assert.equal(layer.dataset.pointerLightAwake, undefined);
move(200, 250);
paint();
assert.equal(reads, 2, "Reentering must schedule again after cancellation");

move(300, 350);
document.hidden = true;
document.emit("visibilitychange");
paint();
move(300, 350);
assert.equal(reads, 2);
assert.equal(frames.size, 0);
assert.equal(layer.dataset.pointerLightAwake, undefined);
document.hidden = false;
document.emit("visibilitychange");
assert.equal(frames.size, 0, "Returning to the tab waits for a fresh pointer position");

finePointer.matches = false;
finePointer.emit("change");
move(200, 200);
assert.equal(frames.size, 0);
finePointer.matches = true;
finePointer.emit("change");
move(200, 200, "touch");
assert.equal(frames.size, 0, "Touch must preserve native page gestures");
move(210, 230);
paint();
assert.equal(reads, 3);

move(250, 250);
dispose();
reduced = true;
mount();
paint();
move(300, 300);
assert.equal(frames.size, 0);
assert.equal(reads, 3, "Reduced motion must detach the pointer effect");
assert.equal(layer.dataset.pointerLightAwake, undefined);
reduced = false;
mount();
move(300, 300);
paint();
assert.equal(reads, 4);
dispose();
assert.equal(section.listeners.get("pointermove").size, 0);
assert.equal(finePointer.listeners.get("change").size, 0);
assert.equal(document.listeners.get("visibilitychange").size, 0);
console.log("Services pointer light passed: one geometry read per paint, current coordinates, leave and return, hidden tabs, pointer changes, touch, reduced motion, and cleanup.");
