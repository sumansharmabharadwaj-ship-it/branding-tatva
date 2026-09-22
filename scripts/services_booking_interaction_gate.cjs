// Drive real StrategyRoomCTA handlers with controlled effect, ref, timer, and
// presence lifecycles. No calendar is loaded and no booking is submitted.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

function textOf(node) {
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node !== 'object') return String(node);
  return textOf(node.props?.children);
}

function mount(reducedMotion = false) {
  const slots = [], effects = new Map(), frames = new Map(), timers = new Map(), listeners = new Map();
  const focused = [], moves = [], dialogMoves = [], events = [], tracked = [];
  let cursor = 0, sequence = 0, tree, present = true, elements = new Map(), pendingEffects = [];
  let rendered = [];
  const document = { body: { style: { overflow: '' } }, activeElement: null, querySelector: () => null };
  class Element {
    constructor(node) { this.node = node; this.isConnected = true; this.inert = false; }
    closest() { return this.inert ? this : null; }
    focus(options) {
      assert.equal(options?.preventScroll, true, 'Programmatic focus must preserve reading position');
      document.activeElement = this;
      focused.push(this.node.props['aria-label'] ?? textOf(this.node));
    }
    getBoundingClientRect() { return { bottom: 1100, top: 1000 }; }
    getClientRects() { return [{}]; }
    querySelectorAll() { return []; }
    scrollTo(options) { dialogMoves.push(options); }
  }
  const window = {
    innerHeight: 800, scrollY: 3000,
    localStorage: { getItem: () => null },
    requestAnimationFrame(callback) { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout(callback) { timers.set(++sequence, callback); return sequence; },
    clearTimeout: id => timers.delete(id),
    scrollTo(options) { moves.push(options); window.scrollY = options.top; },
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener: (name, callback) => listeners.get(name)?.delete(callback),
    dispatchEvent(event) { events.push(event); listeners.get(event.type)?.forEach(callback => callback(event)); },
  };
  const jsx = (type, props, key) => ({ type, props, key });
  const sameDeps = (a, b) => a?.length === b?.length && a.every((value, index) => Object.is(value, b[index]));
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
    },
    useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial }; },
    useCallback(callback, deps) {
      const index = cursor++;
      if (!slots[index] || !sameDeps(slots[index].deps, deps)) slots[index] = { callback, deps };
      return slots[index].callback;
    },
    useEffect(create, deps) {
      const index = cursor++;
      if (!effects.has(index) || !sameDeps(effects.get(index).deps, deps)) pendingEffects.push({ index, create, deps });
    },
  };
  const modules = {
    react, 'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    'react-dom': { createPortal: children => jsx('portal', { children }) },
    'next/link': { default: 'link' },
    'framer-motion': {
      AnimatePresence: 'presence', motion: new Proxy({}, { get: (_, name) => `motion.${name}` }),
      useIsPresent: () => present,
    },
    'lucide-react': new Proxy({}, { get: (_, name) => `icon.${name}` }),
    '@/components/Container': { Container: 'container' },
    '@/components/CalendlyEmbed': { CalendlyEmbed: 'calendar' },
    '@/components/SmoothScrollProvider': { useLenis: () => null },
    '@/data/services': { packages: [] },
    '@/data/site': { consultation: { minutes: 30, steps: ['Describe', 'Question', 'Decide'] }, site: { calendlyUrl: 'https://example.invalid/calendar' } },
    '@/data/entityFacts': { entityFacts: { delivery: { regions: ['UK', 'India'] } } },
    '@/hooks/useHydratedReducedMotion': { useHydratedReducedMotion: () => reducedMotion },
    '@/lib/servicesJourney': {
      SERVICES_SITUATION_EVENT: 'situation', SERVICES_RECOGNITION_AUDIT_EVENT: 'audit', SERVICES_SITUATION_STORAGE_KEY: 'situation',
      SITUATION_TO_PACKAGE: {}, isServicesSituation: () => false, readCompletedHomeDiagnosis: () => null, recognitionAuditGuidance: () => '',
    },
    '@/lib/analytics': { track: (name, detail) => tracked.push({ name, detail }) },
  };
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src/sections/Services/StrategyRoomCTA.tsx'), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, {
    exports, window, document, HTMLElement: Element,
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    require(name) { assert(name in modules, `Unexpected import: ${name}`); return modules[name]; },
  });

  function walk(node, key = 'root') {
    if (Array.isArray(node)) return node.flatMap((child, index) => walk(child, `${key}/${child?.key ?? index}`));
    if (!node || typeof node !== 'object') return [];
    const identity = `${key}:${typeof node.type === 'function' ? node.type.name : node.type}:${node.key ?? ''}`;
    return [{ node, identity }, ...walk(node.props.children, `${identity}/children`)];
  }
  function detach(entry) {
    if (typeof entry.cleanup === 'function') entry.cleanup();
    else if (typeof entry.ref === 'function') entry.ref(null);
    else if (entry.ref) entry.ref.current = null;
  }
  function render() {
    cursor = 0; pendingEffects = [];
    tree = exports.StrategyRoomCTA();
    rendered = walk(tree);
    const next = new Map();
    for (const { node, identity } of rendered) {
      const old = elements.get(identity);
      next.set(identity, old ?? { dom: new Element(node), ref: null });
    }
    for (const [identity, old] of elements) {
      if (!next.has(identity)) { old.dom.isConnected = false; detach(old); }
    }
    for (const { node, identity } of rendered) {
      const entry = next.get(identity);
      entry.dom.node = node;
      if (entry.ref !== node.props.ref) {
        detach(entry);
        entry.ref = node.props.ref;
        entry.cleanup = typeof entry.ref === 'function' ? entry.ref(entry.dom) : undefined;
        if (entry.ref && typeof entry.ref !== 'function') entry.ref.current = entry.dom;
      }
    }
    elements = next;
    for (const { index, create, deps } of pendingEffects) {
      effects.get(index)?.cleanup?.();
      effects.set(index, { deps, cleanup: create() });
    }
  }
  function find(predicate) {
    const found = rendered.find(({ node }) => predicate(node));
    assert(found, 'Expected rendered booking control');
    return found.node;
  }
  const api = {
    window, document, focused, moves, dialogMoves, events, tracked, frames, timers, render, find,
    click(label, focusOnClick = true) {
      const node = find(node => (node.type === 'button' || node.type === 'motion.button') && (node.props['aria-label'] ?? textOf(node)) === label);
      const identity = rendered.find(entry => entry.node === node).identity;
      const button = elements.get(identity).dom;
      if (focusOnClick) document.activeElement = button;
      node.props.onClick({ currentTarget: button }); render();
    },
    paint() { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()); },
    settle() { const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback()); },
    finishExit() { find(node => node.type === 'presence' && node.props.onExitComplete).props.onExitComplete(); render(); },
    emit(type, props = {}) { window.dispatchEvent({ type, ...props }); render(); },
    presence(node, isPresent) { present = isPresent; return node.type(node.props); },
    unmount() {
      for (const entry of elements.values()) { entry.dom.isConnected = false; detach(entry); }
      for (const effect of effects.values()) effect.cleanup?.();
    },
    get listenerCount() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0); },
  };
  render();
  return api;
}

function finishBrief(h) {
  h.click('Add a short brief');
  h.click('Getting positioning right'); h.paint();
  h.click('Positioning and identity'); h.paint();
}

const direct = mount();
direct.click('Choose a time'); direct.paint();
assert.equal(direct.document.body.style.overflow, 'hidden');
assert.equal(direct.focused.at(-1), 'Close scheduling calendar');
assert.equal(direct.find(node => node.type === 'calendar').props.onReady, undefined, 'Calendar readiness cannot reset focus or scroll');
const modal = direct.find(node => node.key === 'strategy-calendar-dialog');
direct.emit('keydown', { key: 'Escape' });
assert.equal(direct.document.body.style.overflow, 'hidden', 'Scroll remains locked throughout the exit animation');
let prevented = false;
direct.emit('keydown', { key: 'Tab', preventDefault() { prevented = true; } });
assert(prevented, 'Tab cannot enter the background during the modal exit');
assert.equal(direct.presence(modal, false).props.inert, true, 'Exiting calendar controls leave the interaction order');
direct.finishExit(); direct.paint();
assert.equal(direct.document.body.style.overflow, '');
assert.equal(direct.focused.at(-1), 'Choose a time');
assert.equal(direct.window.scrollY, 3000);
direct.unmount();

const skipped = mount();
skipped.click('Add a short brief');
skipped.click('Getting positioning right');
skipped.click('Skip the brief and view times'); skipped.paint();
assert.equal(skipped.focused.at(-1), 'Close scheduling calendar', 'A queued brief focus cannot steal modal focus');
skipped.click('Close scheduling calendar'); skipped.finishExit(); skipped.paint();
assert.equal(skipped.focused.at(-1), 'Choose a time', 'A removed skip button falls back to current availability');
assert.equal(skipped.window.scrollY, 3000);
skipped.click('Continue the brief'); skipped.paint();
assert(skipped.find(node => typeof node.type === 'function' && node.key === 'focus'), 'Skipping preserves the first answer');
skipped.unmount();

const completed = mount();
finishBrief(completed);
assert.equal(completed.timers.size, 1);
completed.click('Choose a time', false); completed.paint(); completed.settle();
assert.equal(completed.moves.length, 0, 'The completed-note reveal cannot scroll behind the calendar');
completed.click('Close scheduling calendar'); completed.finishExit(); completed.paint(); completed.settle();
assert.equal(completed.focused.at(-1), 'Choose a time', 'Touch activation returns to its trigger even if the browser never focused it');
assert.equal(completed.moves.length, 0, 'Closing cannot revive the cancelled reveal');
completed.click('Change answers'); completed.paint();
assert.equal(completed.focused.at(-1), 'Question 1 of 2', 'Restart moves focus off the removed result controls');
completed.unmount();

for (const type of ['pointerdown', 'wheel', 'touchstart', 'touchmove']) {
  const h = mount(); finishBrief(h); h.emit(type); h.settle();
  assert.equal(h.moves.length, 0, `${type} cancels the delayed result reveal`);
  h.unmount();
}
const keyboard = mount(); finishBrief(keyboard); keyboard.emit('keydown', { key: 'Tab' }); keyboard.settle();
assert.equal(keyboard.moves.length, 0, 'Keyboard navigation cancels the delayed reveal'); keyboard.unmount();

const reduced = mount(true); finishBrief(reduced); reduced.settle();
assert.equal(reduced.moves[0].behavior, 'instant');
const ready = reduced.find(node => typeof node.type === 'function' && node.key === 'ready');
assert.equal(ready.props.transition.duration, 0);
assert.equal(reduced.presence(ready, false).props.inert, true);
assert.equal(reduced.presence(ready, false).props['aria-hidden'], true);
reduced.unmount();

const rapid = mount();
rapid.click('Choose a time'); rapid.paint();
rapid.click('Close scheduling calendar'); rapid.finishExit();
rapid.click('Choose a time'); rapid.paint();
assert.equal(rapid.focused.at(-1), 'Close scheduling calendar', 'Reopening cancels stale return focus');
assert.equal(rapid.document.body.style.overflow, 'hidden');
rapid.unmount(); rapid.paint(); rapid.settle();
assert.equal(rapid.document.body.style.overflow, '');
assert.equal(rapid.frames.size + rapid.timers.size + rapid.listenerCount, 0, 'Route exit cleans up focus, scrolling, and listeners');

console.log('Services booking: direct, skipped, completed, interrupted, reduced-motion, and rapid-close focus paths passed.');
