#!/usr/bin/env node
// Run the real provider effects against controlled layout/font/timer fixtures.
// This checks hash recovery behavior; it does not emulate a mobile browser.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const compiled = ts.transpileModule(
  fs.readFileSync(path.join(__dirname, "../src/components/SmoothScrollProvider.tsx"), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
).outputText;

function mount({ pathname = "/about", hydrated = true, reduced = true, hash = "#about-system", missing = false, malformed = false } = {}) {
  const effects = [];
  const timers = new Map();
  const listeners = new Map();
  const fonts = [];
  const scrolls = [];
  let serial = 0;
  let top = 300;
  const root = {};
  const target = {
    getBoundingClientRect: () => ({ top }),
    scrollIntoView: (options) => scrolls.push({ ...options }),
  };
  const window = {
    location: { hash },
    getComputedStyle: (node) => node === root ? { scrollPaddingTop: "12px" } : { scrollMarginTop: "96px" },
    setTimeout: (fn) => { const id = ++serial; timers.set(id, fn); return id; },
    clearTimeout: (id) => timers.delete(id),
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name, fn) => { if (listeners.get(name) === fn) listeners.delete(name); },
  };
  const document = {
    documentElement: root,
    querySelector: () => {
      if (malformed) throw new SyntaxError("Malformed fragment");
      return missing ? null : target;
    },
    fonts: { ready: { then: (fn) => fonts.push(fn) } },
  };
  const context = {
    exports: {}, window, document,
    require(name) {
      if (name === "react") return {
        createContext: () => ({ Provider: () => null }),
        useContext: () => null,
        useEffect: (fn) => effects.push(fn),
        useState: (value) => [value, () => {}],
      };
      if (name === "next/navigation") return { usePathname: () => pathname };
      if (name === "@/hooks/useHydratedReducedMotion") return { useHydratedMotionPreference: () => ({ hydrated, prefersReducedMotion: reduced }) };
      if (name === "gsap") return { default: { registerPlugin() {} } };
      if (name === "gsap/ScrollTrigger") return { ScrollTrigger: {} };
      if (name === "lenis") return { default: class { constructor() { throw new Error("Primary journeys must retain native scrolling"); } } };
      if (name === "react/jsx-runtime") return { jsx: () => null };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  };
  vm.runInNewContext(compiled, context);
  context.exports.SmoothScrollProvider({ children: null });
  const cleanups = effects.map((fn) => fn());
  return {
    timers, listeners, scrolls,
    setTop: (value) => { top = value; },
    settleFonts: () => fonts.splice(0).forEach((fn) => fn()),
    emit: (name, event = {}) => listeners.get(name)?.(event),
    tick: () => {
      const pending = timers.entries().next().value;
      if (!pending) return;
      timers.delete(pending[0]);
      pending[1]();
    },
    cleanup: () => cleanups.forEach((fn) => fn?.()),
  };
}

const arrival = mount();
assert.equal(arrival.scrolls.length, 1, "A reduced-motion About fragment must align after hydration.");
assert.equal(arrival.scrolls[0].behavior, "instant", "Document smooth-scroll CSS must never animate recovery.");
assert.equal(arrival.scrolls[0].block, "start");
arrival.setTop(108);
arrival.tick();
arrival.settleFonts();
assert.equal(arrival.scrolls.length, 1, "Respect the anchor margin and root padding once settled.");
assert.equal(arrival.timers.size, 0);
arrival.cleanup();
assert.equal(arrival.listeners.size, 0);

const fontShift = mount();
fontShift.settleFonts();
assert.equal(fontShift.scrolls.length, 2, "A late font shift must recover the requested chapter.");
assert.equal(fontShift.timers.size, 1, "Font readiness and the existing retry must share one pending timer.");
fontShift.cleanup();
assert.equal(fontShift.timers.size, 0, "Unmount must clear every pending retry.");

const unmounted = mount();
unmounted.cleanup();
unmounted.settleFonts();
assert.equal(unmounted.scrolls.length, 1, "Late font readiness must do nothing after unmount.");

for (const [name, event] of [
  ["wheel", {}], ["touchstart", {}],
  ...["PageDown", "PageUp", "Home", "End", " ", "ArrowDown", "ArrowUp"].map((key) => ["keydown", { key }]),
]) {
  const manual = mount();
  manual.emit(name, event);
  manual.settleFonts();
  manual.tick();
  assert.equal(manual.scrolls.length, 1, `${name} ${event.key ?? ""} must keep the visitor in control.`);
  assert.equal(manual.timers.size, 0);
  manual.cleanup();
}

const navigation = mount();
navigation.emit("keydown", { key: "Tab" });
navigation.settleFonts();
assert.equal(navigation.scrolls.length, 2, "Ordinary focus navigation must not cancel pending layout recovery.");
navigation.cleanup();

const unsettled = mount();
for (let tick = 0; tick < 12; tick += 1) unsettled.tick();
assert.equal(unsettled.scrolls.length, 6, "Recovery must stop retrying on a persistently shifting layout.");
assert.equal(unsettled.timers.size, 0);
unsettled.cleanup();

for (const options of [
  { pathname: "/" }, { pathname: "/contact" }, { hydrated: false },
  { reduced: false }, { hash: "" }, { missing: true }, { malformed: true },
]) {
  const ignored = mount(options);
  ignored.settleFonts();
  ignored.tick();
  assert.equal(ignored.scrolls.length, 0, `Recovery must leave this state alone: ${JSON.stringify(options)}`);
  ignored.cleanup();
  assert.equal(ignored.timers.size, 0);
  assert.equal(ignored.listeners.size, 0);
}

console.log("Reduced-motion hash gate passed: chapter alignment, font shifts, native input priority, bounded retries and cleanup.");
