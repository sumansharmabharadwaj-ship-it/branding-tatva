// Read real project data and exercise the component's event handlers. This
// gate checks reading state and chart semantics, rather than browser layout.
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
function textOf(node) {
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node == null || typeof node === 'boolean') return '';
  return typeof node === 'object' ? textOf(node.props?.children) : String(node);
}

function mount({ saved = null, reduced = false, storageBlocked = false } = {}) {
  const slots = [], effects = [], cleanups = [], focused = [], tracked = [], observers = [];
  const listeners = new Map();
  let cursor = 0, tree, motionReduced = reduced, disposed = false, lateWrites = 0;
  const jsx = (type, props, key) => ({ type, props, key });
  const window = {
    localStorage: { getItem() { if (storageBlocked) throw Error('Blocked'); return saved; } },
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(callback);
    },
    removeEventListener(type, callback) { listeners.get(type)?.delete(callback); },
  };
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  const modules = {
    react: {
      useState(initial) {
        const index = cursor++;
        if (!(index in slots)) slots[index] = initial;
        return [slots[index], value => {
          if (disposed) lateWrites++;
          slots[index] = typeof value === 'function' ? value(slots[index]) : value;
        }];
      },
      useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial }; },
      useEffect(effect, deps) {
        const index = cursor++;
        assert.equal(deps.length, 0, 'Update this harness if effect dependencies change');
        if (!(index in slots)) { slots[index] = true; effects.push(effect); }
      },
    },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'next/link': { default: 'link' },
    '@/components/Container': { Container: 'container' },
    '@/hooks/useHydratedReducedMotion': { useHydratedReducedMotion: () => motionReduced },
    '@/lib/analytics': { track: (...args) => tracked.push(args), trackRuntimeIssue() {} },
    './VerifiedOutcome.module.css': { default: new Proxy({}, { get: (_, name) => name }) },
  };
  function load(relative) {
    const exports = {};
    const source = fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');
    vm.runInNewContext(ts.transpileModule(source, {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText, {
      exports, window, IntersectionObserver,
      require(name) { assert(name in modules, `Unexpected dependency: ${name}`); return modules[name]; },
    });
    return exports;
  }
  for (const name of ['services', 'projects']) modules[`@/data/${name}`] = load(`src/data/${name}.ts`);
  const journey = modules['@/lib/servicesJourney'] = load('src/lib/servicesJourney.ts');
  const component = load('src/sections/Services/VerifiedOutcome.tsx');
  function find(predicate, root = tree) { const node = nodes(root).find(predicate); assert(node, 'Expected rendered element'); return node; }
  function render() {
    cursor = 0; tree = component.VerifiedOutcome();
    find(node => node.props?.['data-evidence-card']).props.ref.current = {};
    nodes(tree).filter(node => node.props?.role === 'tab').forEach(node => node.props.ref({
      focus(options) { assert.equal(options.preventScroll, true); focused.push(node.props.id); },
    }));
  }
  function emit(type, detail) { listeners.get(type)?.forEach(callback => callback({ detail })); render(); }
  const api = {
    find, focused, observers, tracked,
    card: () => find(node => node.props?.['data-evidence-card']),
    tab: index => find(node => node.props?.id === `evidence-tab-${index}`),
    panel: () => find(node => node.props?.role === 'tabpanel' && node.props['data-active'] === 'true'),
    choose(index) { api.tab(index).props.onClick(); render(); },
    key(index, key) { let prevented = false; api.tab(index).props.onKeyDown({ key, preventDefault() { prevented = true; } }); render(); return prevented; },
    announce(detail) { emit(journey.SERVICES_SITUATION_EVENT, detail); },
    clear() { emit(journey.SERVICES_SITUATION_CLEARED_EVENT); },
    setReduced(value) { motionReduced = value; render(); },
    enter() { observers.filter(observer => !observer.disconnected).forEach(observer => observer.callback([{ isIntersecting: true }])); render(); },
    unmount() {
      disposed = true; cleanups.forEach(cleanup => cleanup?.());
      assert([...listeners.values()].every(set => set.size === 0));
      assert(observers.every(observer => observer.disconnected));
    },
    get tree() { return tree; },
    get lateWrites() { return lateWrites; },
  };
  render(); effects.splice(0).forEach(effect => cleanups.push(effect())); render();
  return api;
}

function checkMonths(h) {
  const months = nodes(h.tree).filter(node => node.props?.className === 'month');
  assert.equal(months.length, 2);
  const expected = [
    { month: 'December 2025', posts: 23, followers: 111 },
    { month: 'January 2026', posts: 12, followers: 126 },
  ];
  months.forEach((month, index) => {
    const heading = h.find(node => node.props?.id === month.props['aria-labelledby'], month);
    assert.equal(textOf(heading), expected[index].month, 'Each month has a readable group name');
    for (const [key, label, maximum] of [['posts', 'Posts', 23], ['followers', 'New followers', 126]]) {
      const measure = h.find(node => node.props?.['data-evidence-measure'] === key, month);
      assert.equal(textOf(measure), `${label}${expected[index][key]}`, 'Exact counts remain visible alongside their units');
      const bar = h.find(node => node.props?.className === 'barTrack', measure);
      assert.equal(String(bar.props['aria-hidden']), 'true', 'Decorative bars never duplicate the spoken counts');
      const width = Number.parseFloat(bar.props.children.props.style.width);
      assert(Math.abs(width - expected[index][key] / maximum * 100) < 0.001, 'Months share the same scale for each measure');
    }
  });
}

for (const reduced of [false, true]) {
  const h = mount({ saved: 'ongoing', reduced });
  checkMonths(h);
  h.enter();
  assert.equal(h.card().props['data-animate'], reduced ? 'false' : 'true');
  assert(h.observers.every(observer => observer.disconnected), 'Entrance stops observing after the first arrival');
  assert.equal(h.key(0, 'End'), true);
  assert.equal(h.focused.at(-1), 'evidence-tab-2');
  assert.match(textOf(h.panel()), /126 new followers from 12 posts/);
  const panelKey = h.panel().key;
  h.announce({ situation: 'idea', origin: 'services_package' });
  assert.equal(h.card().props['data-proof-route'], 'idea');
  assert.equal(h.card().props['data-evidence-step'], 2, 'A route change preserves the kind of evidence being read');
  assert.equal(h.panel().key, panelKey, 'Route changes keep the focused reading container mounted');
  assert.match(textOf(h.panel()), /four quarters/);
  assert.equal(h.find(node => node.props?.className === 'record').props.href, '/work/myshopineurope');
  h.announce({ situation: 'reposition', origin: 'services_package' });
  assert.match(textOf(h.panel()), /five formats ready to shoot/);
  assert.match(textOf(h.find(node => node.props?.className === 'discuss')), /Discuss Full Brand System/);
  for (const invalid of [undefined, {}, { situation: 'unknown' }]) h.announce(invalid);
  assert.equal(h.card().props['data-proof-route'], 'reposition', 'Invalid announcements leave the case being read intact');
  const focusCount = h.focused.length;
  h.setReduced(!reduced); h.setReduced(reduced);
  assert.equal(h.focused.length, focusCount, 'Motion changes never move focus');
  assert.equal(h.card().props['data-evidence-step'], 2);
  h.clear();
  assert.equal(h.card().props['data-proof-route'], 'default');
  assert.match(textOf(h.find(node => node.props?.className === 'discuss')), /Book a brand diagnosis/);
  assert.equal(h.find(node => node.props?.className === 'record').props.href, '/work/dr-haley-nutrition');
  checkMonths(h);
  assert.equal(h.key(2, 'ArrowRight'), true);
  assert.equal(h.focused.at(-1), 'evidence-tab-0');
  assert.equal(h.key(0, 'ArrowLeft'), true);
  assert.equal(h.focused.at(-1), 'evidence-tab-2');
  assert.equal(h.key(2, 'Home'), true);
  assert.equal(h.key(0, 'Tab'), false);
  assert.equal(h.key(0, 'ArrowDown'), false, 'Vertical scrolling remains native');
  for (const panel of nodes(h.tree).filter(node => node.props?.role === 'tabpanel')) {
    const active = panel.props['data-active'] === 'true';
    assert.equal(panel.props.inert, !active);
    assert.equal(panel.props['aria-hidden'], !active);
    assert.equal(panel.props.tabIndex, active ? 0 : -1);
  }
  h.unmount(); h.announce({ situation: 'idea' });
  assert.equal(h.lateWrites, 0, 'Unmount releases route listeners');
}
const blocked = mount({ storageBlocked: true });
checkMonths(blocked); blocked.unmount();
console.log('Services verified outcome: readable chart values, shared scales, route reset, stable reading, keyboard, reduced motion and cleanup passed.');
