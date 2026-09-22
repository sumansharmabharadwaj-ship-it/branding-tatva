// Deterministic checks for the native Services anchor recovery window.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

class Events {
  listeners = new Map();
  addEventListener(name, callback, options) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Map());
    this.listeners.get(name).set(callback, options);
  }
  removeEventListener(name, callback) { this.listeners.get(name)?.delete(callback); }
  emit(name, event = {}) { this.listeners.get(name)?.forEach((_, callback) => callback(event)); }
  get count() { return [...this.listeners.values()].reduce((sum, entries) => sum + entries.size, 0); }
}

function compile(relativePath) {
  return ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
}

function mount() {
  const window = new Events(), document = new Events(), timers = new Map(), moves = [];
  let timerId = 0, releases = 0, reads = 0;
  window.scrollY = 0;
  window.innerHeight = 800;
  window.location = { hash: '#audit' };
  window.setTimeout = callback => { timers.set(++timerId, callback); return timerId; };
  window.clearTimeout = id => timers.delete(id);
  window.scrollTo = options => { moves.push(options); window.scrollY = options.top; };
  window.getComputedStyle = element => ({ scrollMarginTop: `${element.margin ?? 0}px`, scrollPaddingTop: `${element.padding ?? 0}px` });
  document.documentElement = { scrollHeight: 6000, padding: 0 };
  document.scrollingElement = document.documentElement;
  document.hidden = false;
  const exports = {};
  vm.runInNewContext(compile('src/app/services/servicesAnchorRecovery.ts'), { exports, window, document });
  const recovery = exports.bindServicesAnchorRecovery(() => releases++);
  return {
    recovery, window, document, timers, moves,
    get releases() { return releases; }, get reads() { return reads; },
    target(top, margin = 0) {
      return {
        top, margin, isConnected: true,
        getBoundingClientRect() { reads++; return { top: this.top - window.scrollY }; },
      };
    },
    tick() {
      const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback());
    },
    finish() { for (let i = 0; i < 8 && timers.size; i++) this.tick(); assert.equal(timers.size, 0); },
  };
}

const direct = mount();
direct.document.documentElement.padding = 56;
const chapter = direct.target(1200, 24);
direct.recovery.start(chapter); direct.tick();
assert.equal(direct.window.scrollY, 1120, 'Anchor recovery respects both CSS scroll margin and padding');
chapter.top += 60;
direct.tick();
assert.equal(direct.window.scrollY, 1180, 'A late layout shift is repaired during arrival');
direct.finish();
assert.equal(direct.moves.length, 2, 'Aligned chapters avoid redundant scroll writes');
assert.equal(direct.reads, 6, 'Recovery is bounded even with repeated layout checks');
assert.equal(direct.releases, 1, 'The active chapter returns to measured scrolling after recovery');
assert(direct.moves.every(move => move.behavior === 'instant'), 'Recovery never starts a competing animation');
direct.recovery.dispose();

for (const name of ['wheel', 'pointerdown', 'touchstart', 'touchmove']) {
  const h = mount();
  const listenerOptions = [...h.window.listeners.get(name).values()][0];
  assert.equal(listenerOptions.capture, true);
  assert.equal(listenerOptions.passive, true);
  h.recovery.start(h.target(1800)); h.tick();
  h.window.scrollY = 900;
  h.window.emit(name);
  h.finish();
  assert.equal(h.window.scrollY, 900, `${name} leaves the visitor's position alone`);
  assert.equal(h.moves.length, 1, `${name} cancels all delayed scroll corrections`);
  assert.equal(h.releases, 1);
  h.window.emit(name);
  assert.equal(h.releases, 1, 'Idle input cannot repeatedly publish chapter changes');
  h.recovery.dispose();
}

for (const key of ['Tab', 'Enter', 'Escape', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']) {
  const h = mount();
  h.recovery.start(h.target(1200));
  h.window.emit('keydown', { key }); h.finish();
  assert.equal(h.moves.length, 0, `${key} takes control before the first recovery frame`);
  h.recovery.dispose();
}

const replaced = mount();
replaced.recovery.start(replaced.target(1000));
replaced.recovery.start(replaced.target(3000));
assert.equal(replaced.timers.size, 1, 'Rapid links leave one recovery timer');
replaced.finish();
assert.equal(replaced.moves.length, 1);
assert.equal(replaced.window.scrollY, 3000, 'Only the latest chapter link is aligned');
replaced.recovery.dispose();

const bottom = mount();
bottom.recovery.start(bottom.target(5900)); bottom.finish();
assert.equal(bottom.window.scrollY, 5200, 'Short final sections respect the document scroll limit');
assert.equal(bottom.moves.length, 1, 'Bottom clamping cannot keep rewriting scroll');
assert.equal(bottom.releases, 1, 'An unreachable top cannot keep the chapter selection locked');
bottom.recovery.dispose();

const hidden = mount();
hidden.recovery.start(hidden.target(2000));
hidden.document.hidden = true; hidden.document.emit('visibilitychange');
hidden.document.hidden = false; hidden.document.emit('visibilitychange'); hidden.finish();
assert.equal(hidden.moves.length, 0, 'Returning to a tab cannot replay an old anchor correction');
hidden.recovery.start(hidden.target(3500)); hidden.tick();
assert.equal(hidden.window.scrollY, 3500, 'A fresh chapter request still works after returning');
hidden.recovery.dispose();

const removed = mount();
const detached = removed.target(2000); detached.isConnected = false;
removed.recovery.start(detached); removed.finish();
assert.equal(removed.reads, 0, 'Detached chapters are never measured');
assert.equal(removed.releases, 1);
removed.recovery.dispose();

const disposed = mount();
disposed.recovery.start(disposed.target(2000)); disposed.recovery.dispose();
assert.equal(disposed.timers.size, 0);
assert.equal(disposed.window.count + disposed.document.count, 0, 'Unmount removes every input listener');
disposed.recovery.start(disposed.target(3000)); disposed.finish();
assert.equal(disposed.moves.length, 0);
assert.equal(disposed.releases, 0, 'Unmount cannot publish a new chapter state');

// Mount the real shared provider for Services in both preference modes. Its
// route exception must leave recovery to ServicesExperienceRuntime alone.
for (const prefersReducedMotion of [false, true]) {
  const h = mount(); h.recovery.dispose();
  const modules = {
    react: {
      createContext: () => ({ Provider: 'provider' }), useContext: () => null,
      useState: initial => [initial, () => {}], useEffect: effect => effect(),
    },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
    'next/navigation': { usePathname: () => '/services' },
    lenis: {}, gsap: { default: { registerPlugin() {} } }, 'gsap/ScrollTrigger': { ScrollTrigger: {} },
    '@/hooks/useHydratedReducedMotion': { useHydratedMotionPreference: () => ({ hydrated: true, prefersReducedMotion }) },
  };
  const exports = {};
  vm.runInNewContext(compile('src/components/SmoothScrollProvider.tsx'), {
    exports, window: h.window, document: h.document, require: name => modules[name],
  });
  exports.SmoothScrollProvider({ children: null });
  assert.equal(h.timers.size + h.window.count + h.document.count, 0, 'Services has one anchor owner in either motion mode');
}

console.log('Services anchor recovery: deep links, layout shifts, manual interruption, visibility, bounds, and motion ownership passed.');
