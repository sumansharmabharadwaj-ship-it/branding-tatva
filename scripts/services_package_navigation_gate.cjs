// Exercise the real link handoff without browser navigation or external data.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

function mount({ runtime = true, destination = true, chapter = true, hash = '' } = {}) {
  const steps = [], history = [], events = [], focused = [];
  const routerState = { __NA: true, tree: ['services'] };
  let selected = 0;
  const window = {
    location: { hash },
    history: {
      state: routerState,
      pushState(state, title, nextHash) {
        assert.equal(state, routerState, 'Next router state survives the fragment update');
        history.push(nextHash); window.location.hash = nextHash; steps.push('history');
      },
    },
    dispatchEvent(event) { events.push(event); steps.push('settle'); },
  };
  const document = {
    documentElement: { dataset: { servicesExperience: runtime ? 'active' : undefined } },
    getElementById(id) {
      if (id === 'desire') return chapter ? {} : null;
      return destination ? { focus(options) {
        assert.equal(options.preventScroll, true, 'Focus never causes a second scroll');
        focused.push(id); steps.push('focus');
      } } : null;
    },
  };
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src/sections/Services/servicesPackageNavigation.ts'), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports, window, document,
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
  });
  return {
    history, events, focused, steps,
    get selected() { return selected; },
    activate(slug = 'brand-beginning', options = {}) {
      const event = {
        defaultPrevented: false, button: 0, detail: 1,
        metaKey: false, ctrlKey: false, shiftKey: false, altKey: false,
        currentTarget: { target: '', hasAttribute: () => false },
        preventDefault() { this.defaultPrevented = true; steps.push('prevent'); },
        ...options,
      };
      exports.followServicesPackageLink(event, slug, () => { selected++; steps.push('select'); });
      return event;
    },
  };
}

for (const slug of ['brand-beginning', 'brand-clarity', 'brand-partnership']) {
  for (const detail of [0, 1]) {
    const h = mount();
    assert.equal(h.activate(slug, { detail }).defaultPrevented, true);
    assert.equal(h.selected, 1);
    assert.deepEqual(h.history, [`#package-${slug}`]);
    assert.deepEqual(h.focused, [`package-${slug}`]);
    assert.equal(h.events[0].type, 'bt:services-anchor-settle');
    assert.equal(h.events[0].detail.id, 'desire');
    assert.deepEqual(h.steps, ['select', 'prevent', 'history', 'settle', 'focus']);
    h.activate(slug, { detail });
    assert.equal(h.history.length, 1, 'Repeated destination activation creates no duplicate history entry');
    assert.equal(h.events.length, 2, 'A repeated link can still return to its chapter');
  }
}

for (const options of [
  { metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true },
  { button: 1 }, { button: 2 }, { defaultPrevented: true },
  { currentTarget: { target: '_blank', hasAttribute: () => false } },
  { currentTarget: { target: 'preview', hasAttribute: () => false } },
  { currentTarget: { target: '', hasAttribute: name => name === 'download' } },
]) {
  const h = mount();
  const event = h.activate('brand-clarity', options);
  assert.equal(event.defaultPrevented, options.defaultPrevented ?? false);
  assert.equal(h.selected, 0, 'A native browser gesture never changes the current page choice');
  assert.deepEqual(h.steps, [], 'Native gestures never scroll, focus, or rewrite current history');
}
for (const options of [{ runtime: false }, { destination: false }, { chapter: false }]) {
  const h = mount(options);
  assert.equal(h.activate().defaultPrevented, false, 'Partial hydration keeps the real href usable');
  assert.equal(h.selected, 1);
  assert.deepEqual(h.steps, ['select']);
}
const self = mount();
assert.equal(self.activate('brand-clarity', { currentTarget: { target: '_SELF', hasAttribute: () => false } }).defaultPrevented, true);
console.log('Services package navigation: native gestures, focus handoff, history, repeated links and hydration fallback passed.');
