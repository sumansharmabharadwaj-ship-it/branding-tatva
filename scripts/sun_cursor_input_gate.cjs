#!/usr/bin/env node
// Exercise the actual cursor component's registered input handlers without
// pretending that a desktop browser's narrow iframe is a touch device.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

class Events {
  listeners = new Map();
  addEventListener(name, fn, options) {
    const list = this.listeners.get(name) ?? [];
    list.push({ fn, options });
    this.listeners.set(name, list);
  }
  removeEventListener(name, fn) {
    this.listeners.set(name, (this.listeners.get(name) ?? []).filter((item) => item.fn !== fn));
  }
  emit(name, event = {}) { for (const { fn } of this.listeners.get(name) ?? []) fn(event); }
  count() { return [...this.listeners.values()].reduce((count, list) => count + list.length, 0); }
}

class Element {
  dataset = {};
  textContent = "";
  interactive = false;
  attributes = {};
  style = { removeProperty(key) { delete this[key]; } };
  classes = new Set();
  classList = {
    add: (name) => this.classes.add(name),
    remove: (name) => this.classes.delete(name),
    contains: (name) => this.classes.has(name),
    toggle: (name, value) => value ? this.classes.add(name) : this.classes.delete(name),
  };
  closest() { return this.interactive ? this : null; }
  getAttribute(name) { return this.attributes[name] ?? null; }
  getBoundingClientRect() { return { width: this.textContent.length * 8, height: 28 }; }
}

const compiled = ts.transpileModule(
  fs.readFileSync(path.join(__dirname, "../src/components/SparkCursor.tsx"), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
).outputText;

function mount({ fine = false, reduced = false, pref = "full" } = {}) {
  const root = new Element();
  const sun = new Element();
  const label = new Element();
  const window = new Events();
  const document = new Events();
  const media = Object.assign(new Events(), { matches: fine });
  const os = Object.assign(new Events(), { matches: reduced });
  const timers = new Map();
  const frames = new Map();
  let serial = 0;
  let refIndex = 0;
  let cleanup;
  Object.assign(window, {
    innerWidth: 390, innerHeight: 844,
    visualViewport: { width: 390, height: 844, offsetLeft: 0, offsetTop: 0 },
    matchMedia: (query) => query.includes("any-pointer") ? media : os,
    setTimeout: (fn, ms) => { const id = ++serial; timers.set(id, { fn, ms }); return id; },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame: (fn) => { const id = ++serial; frames.set(id, fn); return id; },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  Object.assign(document, { documentElement: root, visibilityState: "visible", elementFromPoint: () => null });
  const context = {
    exports: {}, window, document, Element, HTMLElement: Element,
    MutationObserver: class { observe() {} disconnect() {} },
    require(name) {
      if (name === "react") return { useEffect: (fn) => { cleanup = fn(); }, useRef: () => ({ current: [sun, label][refIndex++] }) };
      if (name === "@/components/MotionPreference") return { useMotionPreference: () => ({ pref }) };
      if (name === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null, Fragment: "fragment" };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  };
  vm.runInNewContext(compiled, context);
  context.exports.SparkCursor();
  function pointer(name, type = "touch", extra = {}) {
    window.emit(name, {
      pointerType: type, pointerId: 1, isPrimary: true, clientX: 180, clientY: 300,
      target: new Element(), preventDefault() { throw new Error("Native input must remain untouched"); },
      ...extra,
    });
  }
  return { root, sun, label, window, document, media, os, timers, frames, pointer, cleanup };
}

const touch = mount();
assert.equal(touch.root.classList.contains("sun-cursor-active"), false, "Do not hide a native pointer before input.");
touch.pointer("pointerdown");
assert.equal(touch.sun.style.opacity, "1", "A phone's primary contact must show the sun.");
assert.equal(touch.sun.dataset.pointer, "touch");
assert.ok(touch.sun.style.transform.includes("180px, 268px"), "Place the sun above the finger.");
assert.equal(touch.root.classList.contains("sun-cursor-active"), false, "Touch must never replace the native cursor.");
touch.pointer("pointermove", "touch", { clientX: 388, clientY: 5 });
assert.ok(touch.sun.style.transform.includes("366px, 24px"), "Keep the glow within narrow screen edges.");
touch.pointer("pointerup");
touch.document.emit("pointerout", { pointerType: "touch", relatedTarget: null });
assert.equal(touch.sun.style.opacity, "1", "A tap's pointerout must preserve its release glow.");
assert.equal(touch.timers.size, 1);
const timer = [...touch.timers.values()][0];
assert.ok(timer.ms >= 300 && timer.ms <= 800, "The release glow must be brief.");
timer.fn();
assert.equal(touch.sun.style.opacity, "0");

touch.pointer("pointerdown");
touch.pointer("pointercancel");
touch.pointer("pointermove");
assert.equal(touch.sun.style.opacity, "0", "Native scroll cancellation must retire the glow.");
touch.pointer("pointerdown");
touch.pointer("pointerdown", "touch", { pointerId: 2, isPrimary: false });
assert.equal(touch.sun.style.opacity, "0", "Pinch gestures must hide single-finger feedback.");
touch.pointer("pointerup", "touch", { pointerId: 2 });
touch.pointer("pointermove");
assert.equal(touch.sun.style.opacity, "0", "Finishing a pinch must not resurrect a stale pointer.");
touch.pointer("pointerup");
touch.pointer("pointerdown", "pen");
assert.equal(touch.sun.style.opacity, "1", "Pen contact receives the same feedback.");
touch.window.emit("scroll");
assert.equal(touch.sun.style.opacity, "0");

const hybrid = mount({ fine: true });
hybrid.pointer("pointerdown");
hybrid.pointer("pointerup");
const button = new Element();
button.interactive = true;
button.dataset.cursorLabel = "Choose a time";
hybrid.pointer("pointermove", "mouse", { target: button });
assert.equal(hybrid.sun.dataset.pointer, "mouse");
assert.equal(hybrid.root.classList.contains("sun-cursor-active"), true, "A tablet's connected mouse should get the desktop sun.");
assert.equal(hybrid.label.textContent, "Choose a time");
assert.equal(hybrid.timers.size, 0, "A stale touch timer must not hide a newly connected mouse.");
hybrid.window.emit("keydown", { key: "Tab" });
assert.equal(hybrid.root.classList.contains("sun-cursor-active"), false);
assert.equal(hybrid.sun.style.opacity, "0");
hybrid.pointer("pointermove", "mouse");
assert.equal(hybrid.sun.style.opacity, "1");
hybrid.document.visibilityState = "hidden";
hybrid.document.emit("visibilitychange");
assert.equal(hybrid.sun.style.opacity, "0", "Backgrounding must clear the pointer.");

for (const settings of [{ reduced: true }, { pref: "reduced" }]) {
  const reduced = mount(settings);
  reduced.pointer("pointerdown");
  reduced.pointer("pointermove", "mouse");
  assert.equal(reduced.sun.style.opacity, "0", "Respect both motion controls.");
  reduced.cleanup();
}
touch.pointer("pointerdown");
touch.os.matches = true;
touch.os.emit("change");
assert.equal(touch.sun.style.opacity, "0", "Changing the OS setting mid-gesture must clear feedback.");

for (const fixture of [touch, hybrid]) {
  for (const name of ["pointerdown", "pointermove", "pointerup", "pointercancel", "scroll"]) {
    assert.ok(fixture.window.listeners.get(name).every(({ options }) => options.passive), `${name} must be passive.`);
  }
  fixture.cleanup();
  assert.equal(fixture.window.count() + fixture.document.count() + fixture.media.count() + fixture.os.count(), 0);
  assert.equal(fixture.timers.size + fixture.frames.size, 0, "Cleanup must leave no timers or frames behind.");
}
console.log("Sun cursor input gate passed: touch, pen, hybrid mouse, native gestures, motion settings and cleanup.");
