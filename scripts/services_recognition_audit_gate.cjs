// Exercise the component's real event handlers with controlled requests and
// animation frames. This gate does not send email or claim browser layout QA.
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
  const slots = [], cleanups = [], requests = [], published = [], tracked = [], focused = [];
  const frames = new Map();
  let cursor = 0, frameId = 0, disposed = false, lateWrites = 0, present = true, tree, heading;
  const jsx = (type, props, key) => ({ type, props, key });
  const sameDeps = (a, b) => a?.length === b?.length && a.every((value, index) => Object.is(value, b[index]));
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], value => {
        if (disposed) lateWrites++;
        slots[index] = typeof value === 'function' ? value(slots[index]) : value;
      }];
    },
    useRef(initial) {
      const index = cursor++;
      return slots[index] ??= { current: initial };
    },
    useCallback(callback, deps) {
      const index = cursor++;
      if (!slots[index] || !sameDeps(slots[index].deps, deps)) slots[index] = { callback, deps };
      return slots[index].callback;
    },
    useEffect(effect, deps) {
      const index = cursor++;
      if (!slots[index] || !sameDeps(slots[index], deps)) {
        slots[index] = deps;
        cleanups.push(effect());
      }
    },
  };
  const modules = {
    react,
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'next/image': { default: 'image' },
    'framer-motion': {
      AnimatePresence: 'presence',
      motion: new Proxy({}, { get: (_, name) => `motion.${name}` }),
      useIsPresent: () => present,
    },
    'lucide-react': new Proxy({}, { get: (_, name) => `icon.${name}` }),
    '@/hooks/useHydratedReducedMotion': { useHydratedReducedMotion: () => reducedMotion },
    '@/lib/analytics': { track: event => tracked.push(event) },
    '@/lib/motionTokens': { motionTokens: { durationFast: 0.22, easeOrganic: [0.16, 1, 0.3, 1] } },
    '@/lib/servicesJourney': {
      publishServicesRecognitionAudit: (score, total) => published.push({ score, total }),
      recognitionAuditGuidance: () => 'Completed guidance',
    },
    './RecognitionAudit.module.css': { default: new Proxy({}, { get: (_, name) => name }) },
  };
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src/sections/Services/RecognitionAudit.tsx'), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports, require(name) { assert(name in modules, `Unexpected import: ${name}`); return modules[name]; },
    AbortController,
    requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
    fetch: (url, options) => new Promise(resolve => requests.push({ url, options, resolve })),
  });

  function nodes(node) {
    if (Array.isArray(node)) return node.flatMap(child => nodes(child));
    if (!node || typeof node !== 'object') return [];
    return [node, ...nodes(node.props?.children)];
  }
  function find(predicate) {
    const node = nodes(tree).find(predicate);
    assert(node, 'Expected rendered control');
    return node;
  }
  function dom(label) {
    return {
      label, isConnected: true, inert: false,
      closest() { return this.inert ? {} : null; },
      focus(options) { assert.equal(options.preventScroll, true); focused.push(label); },
    };
  }
  function render() {
    cursor = 0;
    tree = exports.RecognitionAudit();
    const next = find(node => node.type === 'motion.h3' || node.type === 'h3');
    const identity = `${next.type}:${next.key ?? 'form'}`;
    if (identity !== heading?.identity) {
      if (heading) { heading.dom.isConnected = false; heading.ref(null); }
      heading = { identity, dom: dom(textOf(next)), ref: next.props.ref };
      next.props.ref(heading.dom);
    }
    for (const tab of nodes(tree).filter(node => node.props?.role === 'tab')) {
      tab.props.ref(dom(tab.props['aria-label']));
    }
  }
  const api = {
    requests, published, tracked, focused, frames, render, find,
    get heading() { return heading.dom; },
    get lateWrites() { return lateWrites; },
    question() { return find(node => node.props?.role === 'tabpanel').props['aria-label']; },
    button(label) { return find(node => node.type === 'button' && textOf(node) === label); },
    click(label) {
      const button = api.button(label);
      assert(!button.props.disabled, `${label} is disabled`);
      button.props.onClick(); render();
    },
    tab(number) { return find(node => node.props?.role === 'tab' && node.props['aria-label'].startsWith(`Question ${number}`)); },
    form() { return find(node => node.props?.['data-recognition-audit-form'] === 'true'); },
    fill() {
      for (const [name, value] of [['firstName', 'Test'], ['email', 'audit@example.invalid'], ['business', 'Example']]) {
        find(node => node.type === 'input' && node.props.name === name).props.onChange({ target: { value } });
      }
      find(node => node.type === 'input' && node.props.type === 'checkbox').props.onChange({ target: { checked: true } });
      render();
    },
    paint() {
      const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback());
    },
    resolve(index, ok = true, data = {}) { requests[index].resolve({ ok, json: async () => data }); },
    unmount() {
      disposed = true;
      heading.dom.isConnected = false;
      cleanups.forEach(cleanup => cleanup?.());
    },
    presence(node, isPresent) { present = isPresent; return node.type(node.props); },
  };
  render();
  return api;
}

function completePrivate(h) {
  for (let index = 1; index <= 5; index++) {
    assert.equal(h.question(), `Question ${index}`);
    h.click(index === 2 ? 'Needs attention' : 'Already holds');
    if (index < 5) {
      assert.equal(h.published.length, 0, 'Partial answers remain private progress');
      h.click('Next question');
    }
  }
  assert.deepEqual(h.published, [{ score: 4, total: 5 }]);
  h.click('Continue check');
}

const event = { preventDefault() {} };

async function run() {
  const normal = mount();
  completePrivate(normal);
  normal.paint();
  assert.match(normal.focused.at(-1), /Keep all ten/);
  await normal.form().props.onSubmit(event);
  assert.equal(normal.requests.length, 0, 'Consent is required before any request');
  normal.fill();
  const submit = normal.form().props.onSubmit;
  const pending = submit(event);
  await submit(event);
  assert.equal(normal.requests.length, 1, 'Same-render duplicate submits send once');
  const request = normal.requests[0];
  assert.equal(request.url, '/api/newsletter');
  assert.deepEqual(JSON.parse(request.options.body), {
    email: 'audit@example.invalid', firstName: 'Test', business: 'Example', consent: true, source: 'recognition-audit',
  });
  normal.render();
  assert.equal(normal.form().props['aria-busy'], true);
  normal.resolve(0); await pending; normal.render(); normal.paint();
  assert.equal(normal.question(), 'Question 6', 'Successful unlock opens six, beyond the old private bound');
  assert.equal(normal.tracked.length, 1);
  assert.match(normal.focused.at(-1), /pricing signals/);
  for (let index = 6; index <= 10; index++) {
    normal.click('Already holds');
    if (index < 10) {
      assert.equal(normal.published.length, 1, 'The full score waits for all ten answers');
      normal.click('Next question');
    }
  }
  assert.deepEqual(normal.published.at(-1), { score: 9, total: 10 });
  normal.unmount();

  const returned = mount();
  completePrivate(returned); returned.fill();
  const returningRequest = returned.form().props.onSubmit(event); returned.render();
  returned.click('Back to question five');
  returned.tab(2).props.onClick(); returned.render(); returned.paint();
  const focusCount = returned.focused.length;
  returned.resolve(0); await returningRequest; returned.render(); returned.paint();
  assert.equal(returned.question(), 'Question 2', 'Late success preserves the visitor’s chosen question');
  assert.equal(returned.focused.length, focusCount, 'Late success does not steal focus');
  assert.equal(returned.button('Needs attention').props['aria-pressed'], true, 'Earlier answers survive unlocking');
  returned.click('Open questions six to ten');
  assert.equal(returned.question(), 'Question 6');
  returned.unmount();

  const failed = mount();
  completePrivate(failed); failed.fill();
  const failure = failed.form().props.onSubmit(event);
  failed.resolve(0, false, { error: 'Please try again.' }); await failure; failed.render();
  const alert = failed.find(node => node.props?.role === 'alert');
  assert.equal(textOf(alert), 'Please try again.');
  assert.equal(failed.form().props['aria-describedby'], alert.props.id);
  assert.equal(failed.find(node => node.props?.name === 'email').props.value, 'audit@example.invalid');
  const retry = failed.form().props.onSubmit(event);
  assert.equal(failed.requests.length, 2, 'Failure releases the request lock for retry');
  failed.resolve(1); await retry; failed.render();
  assert.equal(failed.question(), 'Question 6');
  failed.unmount();

  const leaving = mount();
  const question = leaving.find(node => typeof node.type === 'function' && node.type.name === 'QuestionPanel');
  assert.equal(leaving.presence(question, true).props.inert, false);
  assert.equal(leaving.presence(question, false).props.inert, true);
  assert.equal(leaving.presence(question, false).props['aria-hidden'], true);
  completePrivate(leaving);
  const exitingForm = leaving.presence(leaving.form(), false);
  assert.equal(exitingForm.props.inert, true);
  assert.equal(exitingForm.props['aria-hidden'], true);
  assert.equal(exitingForm.props.onSubmit, undefined, 'Exiting forms cannot resubmit during their fade');
  leaving.unmount();

  const keyboard = mount(true);
  keyboard.tab(1).props.onKeyDown({ key: 'End', preventDefault() {} }); keyboard.render();
  keyboard.tab(5).props.onKeyDown({ key: 'Home', preventDefault() {} }); keyboard.render();
  assert.equal(keyboard.frames.size, 1, 'Rapid navigation leaves a single focus frame');
  keyboard.paint();
  assert.equal(keyboard.question(), 'Question 1');
  assert.equal(keyboard.focused.at(-1), 'Question 1');
  const panel = keyboard.find(node => typeof node.type === 'function' && node.type.name === 'QuestionPanel');
  assert.equal(panel.props.transition.duration, 0, 'Reduced motion removes transition time');
  keyboard.tab(3).props.onClick(); keyboard.render();
  keyboard.unmount();
  assert.equal(keyboard.frames.size, 0, 'Unmount cancels queued focus');

  const abandoned = mount();
  completePrivate(abandoned); abandoned.fill();
  const abandonedRequest = abandoned.form().props.onSubmit(event);
  abandoned.unmount();
  assert.equal(abandoned.requests[0].options.signal.aborted, true);
  abandoned.resolve(0); await abandonedRequest;
  assert.equal(abandoned.lateWrites, 0, 'A request finishing after unmount cannot update state');
  assert.equal(abandoned.tracked.length, 0, 'Abandoned requests cannot fire success analytics');
  console.log('Services recognition audit: request races, privacy, focus, transitions, and reduced motion passed.');
}

run().catch(error => { console.error(error); process.exitCode = 1; });
