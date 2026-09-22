// Exercise the real effects together with asynchronous media events. A video
// being paused by the shared warden must never restart its neighbour in a loop.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function fixture({ reduced = false, compact = false, servicesFirst = false } = {}) {
  const tasks = new Map();
  const microtasks = [];
  const observers = [];
  const mutations = [];
  const cleanups = [];
  const renders = [];
  let taskId = 0;
  const enqueue = (callback) => { tasks.set(++taskId, callback); return taskId; };
  const cancel = (id) => tasks.delete(id);
  function flush() {
    let steps = 0;
    while (microtasks.length || tasks.size) {
      assert.ok(++steps < 150, "Playback failed to settle: neighbouring films keep restarting");
      if (microtasks.length) microtasks.shift()();
      else {
        const [id, callback] = tasks.entries().next().value;
        tasks.delete(id);
        callback();
      }
    }
  }
  class Events {
    listeners = new Map();
    addEventListener(type, callback) {
      if (!this.listeners.has(type)) this.listeners.set(type, new Set());
      this.listeners.get(type).add(callback);
    }
    removeEventListener(type, callback) { this.listeners.get(type)?.delete(callback); }
    emit(type, event = {}) {
      for (const callback of [...(this.listeners.get(type) ?? [])]) callback({ type, ...event });
    }
  }
  class Element extends Events {
    dataset = {};
    isConnected = true;
    querySelectorAll() { return []; }
    matches() { return false; }
  }
  class Video extends Element {
    paused = true;
    plays = 0;
    constructor(top, height) {
      super();
      this.rect = { top, bottom: top + height, height, width: 1200 };
    }
    getBoundingClientRect() { return this.rect; }
    play() {
      this.plays++;
      if (this.paused) {
        this.paused = false;
        enqueue(() => {
          document.emit("play", { target: this });
          this.emit("play", { target: this });
        });
      }
      return Promise.resolve();
    }
    pause() { this.paused = true; }
  }
  const first = new Video(-200, 1000);
  const second = new Video(800, 1000);
  const root = new Element();
  const children = new Set([first, second]);
  root.querySelectorAll = () => [...children].filter((node) => node instanceof Video);
  root.contains = (node) => children.has(node);
  const document = new Events();
  document.hidden = false;
  document.documentElement = new Element();
  document.body = root;
  document.activeElement = null;
  document.getElementById = () => root;
  document.querySelectorAll = root.querySelectorAll;
  document.querySelector = () => null;
  const window = new Events();
  window.innerHeight = 1000;
  window.setTimeout = enqueue;
  window.clearTimeout = cancel;
  const mediaQuery = new Events();
  mediaQuery.matches = compact;
  window.matchMedia = () => mediaQuery;
  class IntersectionObserver {
    targets = new Set();
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.targets.clear(); this.disconnected = true; }
  }
  class MutationObserver {
    constructor(callback) { this.callback = callback; mutations.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  function mount(relative, exported) {
    const source = fs.readFileSync(path.resolve(__dirname, "..", relative), "utf8");
    const compiled = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const exports = {};
    const refs = [], effects = [];
    let refIndex = 0, effectIndex = 0;
    vm.runInNewContext(compiled, {
      exports, document, window, navigator: {}, Element, HTMLVideoElement: Video,
      IntersectionObserver, MutationObserver,
      queueMicrotask: (callback) => microtasks.push(callback),
      requestAnimationFrame: enqueue, cancelAnimationFrame: cancel,
      require: (id) => {
        if (id === "react") return {
          useRef(initial) { return refs[refIndex++] ??= { current: initial }; },
          useEffect(effect, deps) {
            const index = effectIndex++;
            const previous = effects[index];
            if (previous && deps.length === previous.deps.length && deps.every((value, i) => Object.is(value, previous.deps[i]))) return;
            previous?.cleanup?.();
            effects[index] = { deps, cleanup: effect() };
          },
        };
        if (id === "@/hooks/useHydratedReducedMotion") return { useHydratedReducedMotion: () => reduced };
        throw new Error(`Unexpected import: ${id}`);
      },
    });
    const render = () => { refIndex = 0; effectIndex = 0; exports[exported](); };
    renders.push(render);
    cleanups.push(() => effects.forEach(effect => effect.cleanup?.()));
    render();
  }
  const components = [
    ["src/components/VideoWarden.tsx", "VideoWarden"],
    ["src/app/services/ServicesMediaDirector.tsx", "ServicesMediaDirector"],
  ];
  for (const [file, name] of servicesFirst ? components.toReversed() : components) mount(file, name);
  flush();
  function intersect(ratios = [0.8, 0.2]) {
    for (const observer of observers) observer.callback([first, second]
      .filter((video) => observer.targets.has(video))
      .map((video) => ({ target: video, isIntersecting: ratios[video === first ? 0 : 1] > 0,
        intersectionRatio: ratios[video === first ? 0 : 1], boundingClientRect: video.rect })));
    flush();
  }
  function mutate(addedNodes = [], removedNodes = []) {
    for (const observer of mutations) if (!observer.disconnected) observer.callback([{ addedNodes, removedNodes }]);
    flush();
  }
  function cleanup() { for (const dispose of cleanups.toReversed()) dispose?.(); }
  return { first, second, root, document, window, children, observers, Element,
    intersect, mutate, flush, cleanup,
    setReduced(value) { reduced = value; renders.forEach(render => render()); flush(); },
  };
}

for (const profile of [
  { compact: false, servicesFirst: false },
  { compact: true, servicesFirst: false },
  { compact: false, servicesFirst: true },
  { compact: true, servicesFirst: true },
]) {
  const f = fixture(profile);
  f.intersect();
  assert.equal(f.first.paused, false, "The dominant visible film should play");
  assert.equal(f.second.paused, true, "The neighbouring film should yield");
  const settledPlays = f.first.plays + f.second.plays;
  f.flush();
  assert.equal(f.first.plays + f.second.plays, settledPlays);

  // Reverse the scroll direction and hand the screen back to the first film.
  f.first.rect = { top: -1000, bottom: 0, height: 1000, width: 1200 };
  f.second.rect = { top: 0, bottom: 1000, height: 1000, width: 1200 };
  f.intersect([0, 1]);
  assert.equal(f.second.paused, false);
  assert.equal(f.first.paused, true);
  f.first.rect = { top: 0, bottom: 1000, height: 1000, width: 1200 };
  f.second.rect = { top: 1000, bottom: 2000, height: 1000, width: 1200 };
  f.intersect([1, 0]);
  assert.equal(f.first.paused, false);
  assert.equal(f.second.paused, true);

  const field = new f.Element();
  field.matches = () => true;
  f.children.add(field);
  f.document.activeElement = field;
  f.root.emit("focusin", { target: field });
  f.mutate();
  assert.equal(f.first.paused, true, "DOM changes must preserve the reading pause");
  const pausedPlays = f.first.plays;
  f.mutate();
  assert.equal(f.first.plays, pausedPlays, "The warden must avoid requests while a field is focused");
  // A background component can finish loading and request play independently.
  f.first.play();
  f.first.emit("loadedmetadata");
  f.flush();
  assert.equal(f.first.paused, true, "A late autoplay request must respect the reading pause");
  f.document.activeElement = null;
  f.root.emit("focusout");
  f.flush();
  assert.equal(f.first.paused, false);

  const modal = (active, source) => f.window.emit("bt:services-modal-interaction", { detail: { active, source } });
  modal(true, "booking");
  modal(true, "preferences");
  modal(false, "booking");
  f.mutate();
  assert.equal(f.first.paused, true, "A second open modal should retain the pause");
  modal(false, "preferences");
  f.flush();
  assert.equal(f.first.paused, false);
  modal(true, "brief");
  modal(true, "calendar");
  f.setReduced(true);
  f.intersect([1, 0]);
  f.setReduced(false);
  f.intersect([1, 0]);
  assert.equal(f.first.paused, true, "Returning to full motion must preserve the open calendar pause");
  assert.equal(f.document.documentElement.dataset.servicesFormInteraction, "true");
  modal(false, "brief");
  f.flush();
  assert.equal(f.first.paused, true, "The calendar still owns its pause after the brief closes");
  modal(false, "calendar");
  f.flush();
  assert.equal(f.first.paused, false, "Playback resumes only after the final interaction closes");
  f.document.hidden = true;
  f.document.emit("visibilitychange");
  f.flush();
  assert.equal(f.first.paused, true);
  f.document.hidden = false;
  f.document.emit("visibilitychange");
  f.flush();
  assert.equal(f.first.paused, false);

  f.children.delete(f.second);
  f.second.isConnected = false;
  f.mutate([], [f.second]);
  assert.ok(f.observers.every((observer) => !observer.targets.has(f.second)), "Detached films must be released");
  assert.equal(f.second.dataset.servicesMediaManaged, undefined);
  f.children.add(f.second);
  f.second.isConnected = true;
  f.mutate([f.second]);
  assert.ok(f.observers.filter(observer => !observer.disconnected).every((observer) => observer.targets.has(f.second)), "Returning films must register again");
  f.intersect([1, 0]);
  assert.equal(f.first.paused, false);
  f.root.emit("focusout");
  f.cleanup();
  f.flush();
  assert.equal(f.document.documentElement.dataset.servicesFormInteraction, undefined, "Deferred focus work must stop after unmount");
}

const reduced = fixture({ reduced: true });
reduced.intersect();
const reducedPlays = reduced.first.plays + reduced.second.plays;
reduced.mutate();
assert.equal(reduced.first.plays + reduced.second.plays, reducedPlays, "Reduced motion should prevent new playback requests");
assert.equal(reduced.first.paused, true);
assert.equal(reduced.second.paused, true);
reduced.cleanup();
console.log("Services media coordination passed: bounded playback, forward and reverse handoffs, focus, overlapping modals, visibility, reduced motion, and cleanup.");
