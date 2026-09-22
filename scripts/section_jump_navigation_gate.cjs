// Exercise the actual chapter navigation handlers and lifecycle. Browser
// rendering and device scrolling still need hosted acceptance checks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

function nodes(node) {
  if (Array.isArray(node)) return node.flatMap(nodes);
  if (!node || typeof node !== 'object') return [];
  return [node, ...nodes(node.props?.children)];
}
class Events {
  listeners = new Map();
  addEventListener(name, callback, options) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Map());
    this.listeners.get(name).set(callback, options);
  }
  removeEventListener(name, callback) { this.listeners.get(name)?.delete(callback); }
  emit(name, detail = {}) {
    for (const [callback, options] of this.listeners.get(name) ?? []) {
      callback({ type: name, ...detail });
      if (options?.once) this.removeEventListener(name, callback);
    }
  }
  get count() { return [...this.listeners.values()].reduce((sum, callbacks) => sum + callbacks.size, 0); }
}

function mount({ pathname = '/services', guidedMobile = true, reduced = false, desktopMode } = {}) {
  const slots = [], cleanups = [], pendingEffects = [], observers = [], dom = new Map();
  const frames = new Map(), timers = new Map(), work = [];
  const window = new Events(), document = new Events();
  const originalHistory = { __NA: true, tree: ['route', 'services'] };
  let cursor = 0, sequence = 0, tree, dirty = false, present = true;
  window.location = { hash: '#first' };
  window.history = { state: originalHistory, pushState(state, _, hash) {
    work.push({ kind: 'history', state, hash }); window.location.hash = hash; this.state = state;
  } };
  window.requestAnimationFrame = callback => { frames.set(++sequence, callback); return sequence; };
  window.cancelAnimationFrame = id => frames.delete(id);
  window.setTimeout = callback => { timers.set(++sequence, callback); return sequence; };
  window.clearTimeout = id => timers.delete(id);
  window.matchMedia = () => ({ matches: false });
  window.innerHeight = 800;
  class Element extends Events {
    attrs = new Map(); dataset = {}; target = ''; parent = null;
    constructor(id) { super(); this.id = id; }
    getAttribute(name) { return this.attrs.get(name) ?? null; }
    setAttribute(name, value) { this.attrs.set(name, value); }
    removeAttribute(name) { this.attrs.delete(name); }
    hasAttribute(name) { return this.attrs.has(name); }
    contains(target) { return target === this || Boolean(target?.parent && this.contains(target.parent)); }
    matches() { return Boolean(this.keyboardFocus); }
    querySelector() { return this.heading ?? null; }
    querySelectorAll() { return []; }
    getBoundingClientRect() { return { top: 0, bottom: 800, height: 800 }; }
    focus(options) {
      assert.equal(options?.preventScroll, true, 'Programmatic focus cannot move the document');
      document.activeElement?.emit('blur'); document.activeElement = this;
      work.push({ kind: 'focus', id: this.id });
    }
    scrollIntoView(options) { work.push({ kind: 'scroll', id: this.id, ...options }); }
  }
  const destinations = new Map(['first', 'second', 'third'].map(id => [id, new Element(id)]));
  const main = new Element('main-content'), action = new Element('action'), heading = new Element('action-heading');
  action.parent = main; action.heading = heading; heading.parent = action;
  main.querySelectorAll = () => [action];
  document.documentElement = new Element('root');
  document.getElementById = id => id === main.id ? main : destinations.get(id) ?? null;
  document.querySelectorAll = () => [];
  document.querySelector = selector => destinations.get(selector.slice(1)) ?? null;
  class Observer {
    targets = new Set();
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.disconnected = true; this.targets.clear(); }
  }
  const jsx = (type, props, key) => ({ type, props, key });
  const modules = {
    react: {
      useState(initial) {
        const index = cursor++;
        if (!(index in slots)) slots[index] = initial;
        return [slots[index], value => {
          const next = typeof value === 'function' ? value(slots[index]) : value;
          if (!Object.is(next, slots[index])) { slots[index] = next; dirty = true; }
        }];
      },
      useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial }; },
      useEffect(effect, deps) {
        const index = cursor++;
        if (slots[index] && deps.every((value, at) => Object.is(value, slots[index][at]))) return;
        slots[index] = deps;
        pendingEffects.push(() => { cleanups[index]?.(); cleanups[index] = effect(); });
      },
    },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'framer-motion': { AnimatePresence: 'presence', useIsPresent: () => present, motion: new Proxy({}, { get: (_, name) => `motion.${name}` }) },
    'lucide-react': { ArrowDownRight: 'arrow', List: 'list', X: 'close' },
    'next/navigation': { usePathname: () => pathname },
    '@/hooks/useHydratedReducedMotion': { useHydratedReducedMotion: () => reduced },
  };
  const component = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/components/SectionJumpNav.tsx'), 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports: component.exports, window, document, IntersectionObserver: Observer, MutationObserver: Observer,
    require(name) { assert(name in modules, `Unexpected dependency ${name}`); return modules[name]; },
  });
  const items = ['first', 'second', 'third'].map(label => ({ href: `#${label}`, label }));
  function bind(node, parent = null, location = 'root') {
    if (Array.isArray(node)) { node.forEach((child, index) => bind(child, parent, `${location}.${index}`)); return; }
    if (!node || typeof node !== 'object') return;
    const id = node.props?.id ?? node.props?.href ?? location;
    const element = dom.get(location) ?? new Element(id); dom.set(location, element);
    element.parent = parent; node.element = element;
    if (typeof node.props?.ref === 'function') node.props.ref(element);
    else if (node.props?.ref) node.props.ref.current = element;
    bind(node.props?.children, element, `${location}.children`);
  }
  function render() {
    let passes = 0;
    do {
      assert(++passes < 10, 'Effects settle without a render loop');
      cursor = 0; dirty = false;
      tree = component.exports.SectionJumpNav({ items, guidedMobile, desktopMode }); bind(tree);
      pendingEffects.splice(0).forEach(effect => effect());
    } while (dirty);
  }
  function find(predicate, root = tree) { const match = nodes(root).find(predicate); assert(match, 'Expected chapter control'); return match; }
  const mobile = () => find(node => node.props?.['data-section-jump-nav-mobile']);
  const trigger = () => find(node => node.props?.['data-section-jump-nav-trigger']);
  const menu = () => find(node => node.props?.['data-section-jump-mobile-menu']);
  const link = (href, mode = 'mobile') => find(node => node.type === 'a' && node.props.href === href,
    mode === 'mobile' ? menu() : find(node => node.props?.['data-section-jump-nav-desktop-mode']));
  const api = {
    work, document, window, destinations, originalHistory, trigger, menu, mobile, link,
    render,
    flush() { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback()); render(); },
    open() { trigger().props.onClick(); render(); this.flush(); work.length = 0; },
    click(href, overrides = {}, mode = 'mobile') {
      const node = link(href, mode);
      const event = { currentTarget: node.element, button: 0, detail: 1, defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; }, ...overrides };
      node.props.onClick(event); render(); return event;
    },
    snapshot() { return JSON.stringify({ expanded: trigger().props['aria-expanded'], label: trigger().props['aria-label'], hash: window.location.hash, work }); },
    exiting(menuNode) { present = false; const rendered = menuNode.type(menuNode.props); present = true; return rendered; },
    yieldToAction() {
      observers.filter(observer => !observer.disconnected && observer.targets.has(action)).forEach(observer => {
        observer.callback([{ target: action, isIntersecting: true, intersectionRatio: 1 }]);
      }); render();
    },
    dispose() {
      cleanups.forEach(cleanup => cleanup?.());
      assert.equal(frames.size + timers.size + window.count + document.count, 0, 'Navigation releases listeners and pending work');
      assert(observers.every(observer => observer.disconnected));
    },
  };
  render(); api.flush(); api.flush(); work.length = 0;
  return api;
}

for (const pathname of ['/services', '/', '/work/example']) {
  const h = mount({ pathname }); h.open();
  for (const event of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }]) {
    const before = h.snapshot(); h.click('#second', event);
    assert.equal(h.snapshot(), before, 'Modified gestures leave this tab untouched');
  }
  for (const mode of ['mobile', 'desktop']) {
    const link = h.link('#second', mode);
    link.element.target = '_blank'; const before = h.snapshot(); h.click('#second', {}, mode);
    assert.equal(h.snapshot(), before, 'A new browsing context leaves the current chapter unchanged');
    link.element.target = ''; link.element.setAttribute('download', ''); h.click('#second', {}, mode);
    assert.equal(h.snapshot(), before, 'Download links retain browser behaviour');
    link.element.removeAttribute('download');
    h.click('#second', { ctrlKey: true }, mode);
    assert.equal(h.snapshot(), before);
  }
  const outgoing = h.menu();
  assert.equal(h.click('#second').defaultPrevented, true);
  assert.equal(h.window.history.state, h.originalHistory, 'Chapter history preserves the router state');
  assert.equal(h.work.find(item => item.kind === 'scroll').behavior, 'smooth');
  assert.equal(h.document.activeElement, h.destinations.get('second'), 'Pointer selection transfers focus to the destination');
  assert(h.work.findIndex(item => item.kind === 'focus') < h.work.findIndex(item => item.kind === 'scroll'));
  assert.equal(h.exiting(outgoing).props.inert, true, 'Closing animation cannot retain interactive links');
  assert.equal(h.exiting(outgoing).props['aria-hidden'], true);
  assert.equal(h.mobile().props['data-section-jump-moving'], 'true');
  h.window.emit('wheel'); h.render();
  assert.equal(h.mobile().props['data-section-jump-moving'], 'false', 'Manual scrolling releases the destination cue');
  const destination = h.destinations.get('second');
  assert.equal(destination.getAttribute('tabindex'), '-1');
  destination.emit('blur'); assert.equal(destination.getAttribute('tabindex'), null);
  h.open(); h.click('#second');
  assert(!h.work.some(item => item.kind === 'history'), 'Repeated chapter choices avoid duplicate history');
  h.dispose();
}

for (const reduced of [false, true]) {
  for (const detail of [0, 1]) {
    const h = mount({ reduced }); h.open();
    h.destinations.get('second').setAttribute('tabindex', '0');
    h.click('#second', { detail });
    assert.equal(h.work.find(item => item.kind === 'scroll').behavior, reduced || detail === 0 ? 'instant' : 'smooth');
    h.destinations.get('second').emit('blur');
    assert.equal(h.destinations.get('second').getAttribute('tabindex'), '0', 'Existing destination focus semantics survive navigation');
    h.dispose();
  }
}
const missing = mount(); missing.open(); missing.destinations.delete('second');
assert.equal(missing.click('#second').defaultPrevented, false, 'Unavailable destinations preserve the native href');
assert.equal(missing.work.length, 0); missing.dispose();

const fallback = mount({ guidedMobile: false }); fallback.open();
assert.equal(fallback.click('#second').defaultPrevented, false, 'Unguided navigation retains native anchor handling');
assert.equal(fallback.work.length, 0); fallback.dispose();

const focus = mount(); focus.open();
focus.document.activeElement = focus.link('#second').element;
focus.yieldToAction();
assert.equal(focus.document.activeElement.id, 'action-heading', 'A disappearing guide transfers focus to the visible action heading');
assert.equal(focus.mobile().props.inert, true);
focus.document.activeElement.emit('blur');
assert.equal(focus.document.activeElement.getAttribute('tabindex'), null, 'Temporary yield focus attributes are restored');
focus.dispose();

const escape = mount(); escape.open();
escape.document.emit('keydown', { key: 'Escape' }); escape.render();
assert.equal(escape.document.activeElement, escape.trigger().element);
assert.equal(escape.trigger().props['aria-expanded'], false); escape.dispose();

const keyboard = mount();
keyboard.trigger().element.keyboardFocus = true; keyboard.open();
assert.equal(keyboard.document.activeElement, keyboard.link('#first').element, 'Keyboard opening focuses the current chapter');
let prevented = false;
keyboard.link('#first').props.onKeyDown({ key: 'End', preventDefault() { prevented = true; } });
assert.equal(prevented, true);
assert.equal(keyboard.document.activeElement, keyboard.link('#third').element);
assert.equal(keyboard.work.find(item => item.kind === 'scroll').behavior, 'instant', 'Menu keys cannot inherit page smooth scrolling');
assert.equal(keyboard.window.location.hash, '#first', 'Arrow navigation moves focus without selecting a chapter');
keyboard.dispose();
console.log('Chapter navigation: native link gestures, router history, destination focus, exit accessibility, reduced motion, fallback links, yielding and cleanup passed.');
