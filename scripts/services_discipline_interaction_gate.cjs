// Exercise the real explorer and illustration with synchronous focus events,
// as the browser delivers them before a keyboard selection rerenders.
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

function mount(name, { saved = null, reduced = false, index = 0 } = {}) {
  const slots = [], effects = [], cleanups = [], focused = [], tracked = [], listeners = new Map();
  let cursor = 0, tree, motionReduced = reduced, outputIndex = index;
  const jsx = (type, props, key) => ({ type, props, key });
  const window = {
    localStorage: { getItem: () => saved },
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(callback);
    },
    removeEventListener(type, callback) { listeners.get(type)?.delete(callback); },
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
    'framer-motion': { useInView: () => true, motion: new Proxy({}, { get: (_, key) => `motion.${key}` }) },
    'lucide-react': { RotateCcw: 'rotate-icon' },
    '@/components/Container': { Container: 'container' },
    '@/components/Reveal': { Reveal: 'reveal' },
    './DisciplineOutput': { DisciplineOutput: 'discipline-output' },
    '@/hooks/useHydratedReducedMotion': { useHydratedReducedMotion: () => motionReduced },
    '@/lib/analytics': { track: (event, detail) => tracked.push({ event, detail }), trackRuntimeIssue() {} },
  };
  for (const name of ['ServiceDisciplineExplorer', 'DisciplineOutput']) {
    modules[`./${name}.module.css`] = { default: new Proxy({}, { get: (_, key) => key }) };
  }
  function load(relative) {
    const exports = {};
    const source = fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');
    vm.runInNewContext(ts.transpileModule(source, {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText, {
      exports, window,
      require(name) { assert(name in modules, `Unexpected dependency: ${name}`); return modules[name]; },
    });
    return exports;
  }
  modules['@/data/services'] = load('src/data/services.ts');
  const journey = modules['@/lib/servicesJourney'] = load('src/lib/servicesJourney.ts');
  const component = load(`src/sections/Services/${name}.tsx`);
  function find(predicate) { const node = nodes(tree).find(predicate); assert(node, 'Expected rendered control'); return node; }
  function render() {
    cursor = 0; tree = component[name]({ index: outputIndex });
    nodes(tree).filter(node => node.props?.role === 'tab').forEach(node => {
      node.props.ref({ focus(options) {
        assert.equal(options.preventScroll, true); focused.push(node.props.id);
        node.props.onFocus();
      } });
    });
  }
  const api = {
    find, tracked, focused,
    active: () => find(node => node.props?.role === 'tab' && node.props['aria-selected']).props['data-service-discipline-index'],
    key(key) {
      const tab = find(node => node.props?.role === 'tab' && node.props['aria-selected']);
      let prevented = false;
      tab.props.onKeyDown({ key, preventDefault() { prevented = true; } }); render(); return prevented;
    },
    select(value) { find(node => node.type === 'select').props.onChange({ target: { value } }); render(); },
    announce(situation) { listeners.get(journey.SERVICES_SITUATION_EVENT)?.forEach(callback => callback({ detail: { situation } })); render(); },
    clear() { listeners.get(journey.SERVICES_SITUATION_CLEARED_EVENT)?.forEach(callback => callback({})); render(); },
    setReduced(value) { motionReduced = value; render(); },
    setIndex(value) { outputIndex = value; render(); },
    replay() { find(node => node.type === 'button').props.onClick(); render(); },
    unmount() { cleanups.forEach(cleanup => cleanup?.()); assert([...listeners.values()].every(set => set.size === 0)); },
    get tree() { return tree; },
  };
  render(); effects.splice(0).forEach(effect => cleanups.push(effect())); render();
  return api;
}

for (const reduced of [false, true]) {
  const h = mount('ServiceDisciplineExplorer', { saved: 'ongoing', reduced });
  assert.equal(h.active(), 1);
  const order = nodes(h.tree).filter(node => node.props?.role === 'tab').map(node => node.props['data-service-discipline-index']);
  assert.deepEqual(order, [1, 4, 2, 5, 3, 0]);
  assert.equal(h.key('ArrowRight'), true);
  assert.equal(h.active(), 4);
  assert.equal(h.tracked.length, 1, 'Selection plus synchronous focus produces one event');
  assert.equal(h.focused.at(-1), 'service-discipline-tab-4');
  h.select('3');
  assert.equal(h.active(), 3, 'Phone selection reaches the same desktop panel');
  h.announce('ongoing');
  assert.equal(h.active(), 3, 'Repeated route announcements preserve the discipline being read');
  h.select('3');
  assert.equal(h.tracked.length, 2, 'Repeated choices remain a no-op');
  for (const value of ['NaN', '-1', '99', '1.5']) h.select(value);
  assert.equal(h.active(), 3, 'Invalid selector values leave the current illustration intact');
  assert.equal(h.tracked.length, 2);
  h.setReduced(!reduced);
  assert.equal(h.active(), 3, 'Motion preference changes preserve the current discipline');
  h.announce('reposition');
  assert.equal(h.active(), 0);
  h.key('End'); assert.equal(h.active(), 2);
  assert.equal(h.tracked.length, 3);
  h.key('Home'); assert.equal(h.active(), 0);
  assert.equal(h.tracked.length, 4);
  assert.equal(h.key('Tab'), false);
  const focused = h.focused.length;
  h.clear();
  assert.equal(h.active(), 0);
  assert.equal(h.focused.length, focused, 'Clearing a route never steals focus');
  const copies = nodes(h.tree).filter(node => node.props?.['data-discipline-copy']);
  assert.equal(copies.filter(node => node.props['data-active']).length, 1);
  copies.forEach(node => {
    assert.equal(node.props.inert, !node.props['data-active']);
    assert.equal(node.props['aria-hidden'], !node.props['data-active']);
  });
  h.unmount();
}

const art = mount('DisciplineOutput', { index: 3 });
const replayButton = () => art.find(node => node.type === 'button');
const scene = () => art.find(node => node.props?.role === 'img');
const replayIdentity = { type: replayButton().type, key: replayButton().key };
const initialSceneKey = scene().key;
art.replay();
assert.notEqual(scene().key, initialSceneKey, 'Explicit replay starts a fresh illustration');
const playedSceneKey = scene().key;
art.setReduced(true);
assert.deepEqual({ type: replayButton().type, key: replayButton().key }, replayIdentity, 'The focused replay control stays mounted');
assert.equal(replayButton().props['aria-disabled'], true);
assert.equal(replayButton().props.disabled, undefined, 'Native disabling cannot drop focus');
assert.equal(scene().props['data-animate'], false);
art.replay();
assert.equal(scene().key, playedSceneKey, 'Reduced motion replay is inert');
art.setReduced(false); art.replay();
assert.notEqual(scene().key, playedSceneKey);
for (let index = 0; index < 6; index++) {
  art.setIndex(index);
  assert.equal(nodes(art.tree).filter(node => node.props?.className === 'title' && node.props['data-active']).length, 1);
  assert.equal(scene().props['data-animate'], true);
}
for (const invalid of [NaN, -1, 6, 1.5]) {
  art.setIndex(invalid);
  assert.match(scene().props['aria-label'], /shared wordmark/);
  assert.match(textOf(scene()), /The position/);
  const title = art.find(node => node.props?.className === 'title' && node.props['data-active']);
  assert.equal(textOf(title), 'One position. Every expression.', 'Fallback title, description and drawing agree');
}
art.unmount();
console.log('Services discipline interactions: one event per choice, route order, phone selection, stable reading, replay focus, reduced motion and cleanup passed.');
