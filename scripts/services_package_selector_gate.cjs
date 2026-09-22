// Run the actual selector handlers with a controlled hook lifecycle and native
// event timing. Layout and animation appearance still require browser review.
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

function mount({ saved, hash = '', reduced = false, storageBlocked = false } = {}) {
  const slots = [], effects = [], cleanups = [], focused = [], tracked = [];
  const listeners = new Map(), storage = new Map();
  if (saved) storage.set('branding-tatva:services-situation', saved);
  let cursor = 0, tree, region = 'uk';
  const jsx = (type, props, key) => ({ type, props, key });
  const window = {
    location: { hash },
    localStorage: {
      getItem(key) { if (storageBlocked) throw Error('Blocked'); return storage.get(key) ?? null; },
      setItem(key, value) { if (storageBlocked) throw Error('Blocked'); storage.set(key, value); },
      removeItem(key) { storage.delete(key); },
    },
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) { listeners.get(type)?.delete(listener); },
    dispatchEvent(event) { listeners.get(event.type)?.forEach(listener => listener(event)); },
  };
  const modules = {
    react: {
      useState(initial) {
        const index = cursor++;
        if (!(index in slots)) slots[index] = initial;
        return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
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
    'framer-motion': { useInView: () => true },
    '@/hooks/useHydratedReducedMotion': { useHydratedReducedMotion: () => reduced },
    '@/lib/analytics': { track: (...args) => tracked.push(args), trackRuntimeIssue() {} },
    '@/components/PricingProvider': { usePricing: () => ({ region }) },
    '@/components/RegionSelector': { RegionSelector: 'region-selector' },
    '@/sections/Services/PackageComparisonDeck': { PackageComparisonDeck: 'comparison-deck' },
    './PackageSelector.module.css': { default: new Proxy({}, { get: (_, key) => key }) },
  };
  function load(relative) {
    const exports = {};
    const source = fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');
    vm.runInNewContext(ts.transpileModule(source, {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText, {
      exports, window,
      CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options?.detail; } },
      require(name) { assert(name in modules, `Unexpected import: ${name}`); return modules[name]; },
    });
    return exports;
  }
  for (const name of ['services', 'projects', 'pricing']) modules[`@/data/${name}`] = load(`src/data/${name}.ts`);
  const journey = modules['@/lib/servicesJourney'] = load('src/lib/servicesJourney.ts');
  const component = load('src/sections/Services/PackageSelector.tsx');
  function render() {
    cursor = 0;
    tree = component.PackageSelector();
    nodes(tree).filter(node => node.props?.id?.startsWith('package-brand-')).forEach(node => {
      node.props.ref({ focus(options) { assert.equal(options.preventScroll, true); focused.push(node.props.id); } });
    });
  }
  function find(predicate, root = tree) { const node = nodes(root).find(predicate); assert(node, 'Expected rendered control'); return node; }
  const api = {
    render, focused, tracked, journey, listeners,
    choice: slug => find(node => node.props?.id === `package-${slug}`),
    card: () => find(node => node.props?.['data-active'] === true),
    details() { return find(node => node.type === 'details', api.card()); },
    status: () => textOf(find(node => node.props?.role === 'status')),
    compare: () => nodes(tree).find(node => node.type === 'comparison-deck'),
    choose(slug) { api.choice(slug).props.onClick(); render(); },
    toggleScope(open) { api.details().props.onToggle({ currentTarget: { open } }); render(); },
    toggleCompare() { find(node => node.type === 'button' && /Compare all three|Return to selection/.test(textOf(node))).props.onClick(); render(); },
    announce(situation) { journey.publishServicesSituation(situation, 'services'); render(); },
    hash(value) { window.location.hash = value; window.dispatchEvent({ type: 'hashchange' }); render(); },
    clear() { journey.clearServicesSituation(); render(); },
    setRegion(value) { region = value; render(); },
    key(slug, key) { let prevented = false; api.choice(slug).props.onKeyDown({ key, preventDefault() { prevented = true; } }); render(); return prevented; },
    unmount() { cleanups.forEach(cleanup => cleanup?.()); assert([...listeners.values()].every(set => set.size === 0)); },
    get tree() { return tree; },
  };
  render(); effects.splice(0).forEach(effect => cleanups.push(effect())); render();
  return api;
}

for (const reduced of [false, true]) {
  const h = mount({ reduced });
  assert.equal(h.tree.props['data-animate'], !reduced);
  assert.equal(h.card().props['data-engagement-card'], 'brand-beginning');
  h.choose('brand-clarity');
  assert.match(h.status(), /Full Brand System selected/);
  h.toggleScope(true);
  h.announce('reposition');
  assert.equal(h.details().props.open, true, 'Repeated route preserves expanded scope');
  assert.match(h.status(), /selected/, 'Repeated route preserves explicit choice feedback');
  h.choose('brand-clarity');
  assert.equal(h.details().props.open, true, 'Reselecting the same choice preserves scope');
  h.toggleCompare();
  h.announce('reposition');
  assert.equal(h.compare().props.initialPackage, 'brand-clarity', 'Repeated route preserves comparison');
  h.setRegion('in');
  assert.equal(h.compare().props.region, 'in', 'Price market changes preserve comparison');
  h.toggleCompare();
  assert.equal(h.details().props.open, true, 'Returning from comparison restores expanded scope');

  // A native toggle can arrive after another selection but before its paint.
  const outgoingToggle = h.details().props.onToggle;
  h.choice('brand-partnership').props.onClick();
  outgoingToggle({ currentTarget: { open: true } });
  h.render();
  assert.equal(h.details().props.open, false, 'Late outgoing toggle cannot expand a different package');
  assert.match(h.status(), /Brand Partnership selected/);
  assert.equal(h.key('brand-partnership', 'ArrowRight'), true);
  assert.equal(h.card().props['data-engagement-card'], 'brand-beginning');
  assert.equal(h.focused.at(-1), 'package-brand-beginning');
  h.key('brand-beginning', 'End');
  assert.equal(h.focused.at(-1), 'package-brand-partnership');
  h.key('brand-partnership', 'Home');
  assert.equal(h.focused.at(-1), 'package-brand-beginning');
  assert.equal(h.key('brand-beginning', 'Tab'), false, 'Native tab navigation stays native');
  assert.equal(h.key('brand-beginning', 'ArrowDown'), false, 'Vertical arrow scrolling stays native');
  for (const card of nodes(h.tree).filter(node => node.props?.['data-engagement-card'])) {
    assert.equal(card.props.inert, !card.props['data-active']);
    assert.equal(card.props['aria-hidden'], !card.props['data-active']);
  }
  h.toggleCompare();
  h.announce('ongoing');
  assert.equal(h.compare(), undefined, 'A different route opens its recommendation');
  assert.match(h.status(), /Brand Partnership matches/);
  h.hash('#package-brand-clarity');
  assert.equal(h.card().props['data-engagement-card'], 'brand-clarity');
  assert.match(h.status(), /Full Brand System selected/);
  h.clear();
  assert.equal(h.card().props['data-engagement-card'], 'brand-beginning');
  assert.match(h.status(), /^Select the condition/);
  h.unmount();
}

const linked = mount({ saved: 'ongoing', hash: '#package-brand-clarity' });
assert.equal(linked.card().props['data-engagement-card'], 'brand-clarity', 'Explicit deep link wins over saved choice');
linked.unmount();
const restored = mount({ saved: 'ongoing' });
assert.match(restored.status(), /Brand Partnership matches/);
restored.unmount();
const blocked = mount({ storageBlocked: true });
blocked.choose('brand-partnership');
assert.match(blocked.status(), /Brand Partnership selected/);
blocked.unmount();
console.log('Services package selector gate passed: stable views, delayed toggles, keyboard, deep links, pricing, reset, reduced motion and cleanup.');
