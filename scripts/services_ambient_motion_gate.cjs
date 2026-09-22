// Exercise the real ambient and scroll effects with deterministic visibility,
// observer delivery, and animation frames. This does not measure device FPS.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

class Events {
  listeners = new Map();
  addEventListener(name, callback) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set());
    this.listeners.get(name).add(callback);
  }
  removeEventListener(name, callback) { this.listeners.get(name)?.delete(callback); }
  emit(name, props = {}) { this.listeners.get(name)?.forEach(callback => callback({ type: name, ...props })); }
  get count() { return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0); }
}

const frames = new Map(), timers = new Map(), mutations = [], intersections = [], resizes = [], events = [];
let sequence = 0, reads = 0, clock = 0;
const window = new Events(), document = new Events(), query = new Events();
window.scrollY = 0; window.innerHeight = 1000; window.location = { hash: '' };
window.requestAnimationFrame = callback => { frames.set(++sequence, callback); return sequence; };
window.cancelAnimationFrame = id => frames.delete(id);
window.setTimeout = callback => { timers.set(++sequence, callback); return sequence; };
window.clearTimeout = id => timers.delete(id);
window.dispatchEvent = event => events.push(event);
window.matchMedia = () => query; query.matches = false;
class Element {
  dataset = {};
  isConnected = true;
  style = { values: new Map(), setProperty(key, value) { this.values.set(key, value); }, removeProperty(key) { this.values.delete(key); } };
  constructor(id = '', index = 0) { this.id = id; this.index = index; }
  compareDocumentPosition(other) { return this.index < other.index ? 4 : 2; }
  getBoundingClientRect() {
    reads++;
    const top = this.index * 1000 - window.scrollY;
    return { top, bottom: top + 1000, height: 1000 };
  }
  querySelector() { return null; }
  querySelectorAll() { return []; }
  setAttribute() {}
  removeAttribute() {}
  append() {}
  appendChild() {}
  remove() {}
}
const root = new Element(), thread = new Element(); root.scrollHeight = 3000;
const scenes = [new Element('services-opening'), new Element('situation', 1), new Element('desire', 2)];
scenes[1].dataset.servicesScene = 'situation'; scenes[2].dataset.servicesScene = 'desire';
const packageChoice = new Element('package-brand-clarity');
packageChoice.closest = selector => selector === '[data-services-scroll-scene="desire"]' ? scenes[2] : null;
const fields = new Set([new Element('near'), new Element('far')]);
const [near, far] = fields;
root.querySelector = () => scenes[0];
root.querySelectorAll = selector => selector === '[data-living-gradient]' ? [...fields] : scenes.slice(1);
root.contains = element => fields.has(element);
document.documentElement = new Element();
document.hidden = false;
document.getElementById = id => id === 'main-content' ? root : id === packageChoice.id ? packageChoice : scenes.find(scene => scene.id === id) ?? null;
document.scrollingElement = root;
window.getComputedStyle = () => ({ scrollMarginTop: '24px', scrollPaddingTop: '56px' });
window.scrollTo = ({ top }) => { window.scrollY = top; };
document.querySelector = () => thread;
document.createElement = () => new Element();
class MutationObserver {
  constructor(callback) { this.callback = callback; mutations.push(this); }
  observe(target, options) { this.target = target; this.options = options; }
  disconnect() { this.disconnected = true; }
}
class IntersectionObserver {
  targets = new Set();
  constructor(callback) { this.callback = callback; intersections.push(this); }
  observe(target) { this.targets.add(target); }
  unobserve(target) { this.targets.delete(target); }
  disconnect() { this.targets.clear(); this.disconnected = true; }
}
class ResizeObserver {
  constructor(callback) { this.callback = callback; resizes.push(this); }
  observe() {}
  disconnect() { this.disconnected = true; }
}
const globals = {
  window, document, MutationObserver, IntersectionObserver, ResizeObserver,
  Node: { DOCUMENT_POSITION_FOLLOWING: 4 }, performance: { now: () => clock },
  CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
};
function load(relative, require = () => { throw new Error('Unexpected dependency'); }) {
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { ...globals, exports, require });
  return exports;
}
const recovery = load('src/app/services/servicesAnchorRecovery.ts');
function mount(file, name) {
  let cleanup;
  const component = load(file, id => {
    if (id === 'react') return { useEffect: effect => { cleanup = effect(); } };
    if (id === './servicesAnchorRecovery') return recovery;
    if (id === '@/hooks/useHydratedReducedMotion') return { useHydratedReducedMotion: () => query.matches };
    throw new Error(`Unexpected dependency: ${id}`);
  });
  component[name]();
  return { dispose: () => cleanup(), refresh() { cleanup(); component[name](); } };
}
const ambient = mount('src/app/services/ServicesAmbientMotion.tsx', 'ServicesAmbientMotion');
const runtime = mount('src/app/services/ServicesExperienceRuntime.tsx', 'ServicesExperienceRuntime');
function paint() { clock += 16; const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()); }
function mutate(target, attribute) {
  for (const observer of mutations) {
    if (!observer.disconnected && observer.target === target && (!attribute || observer.options.attributeFilter?.includes(attribute))) observer.callback([]);
  }
}
function intersect() {
  for (const observer of intersections) if (!observer.disconnected) {
    observer.callback([...observer.targets].map(target => ({ target, isIntersecting: target === near })));
  }
}
function progressEvents() { return events.filter(event => event.type === 'bt:services-scene-progress'); }

intersect();
assert.equal(near.dataset.servicesGradientMotion, 'running');
assert.equal(far.dataset.servicesGradientMotion, 'paused');
assert.equal(scenes[0].dataset.servicesAmbient, 'running');
document.documentElement.dataset.servicesFormInteraction = 'true';
mutate(document.documentElement, 'data-services-form-interaction');
assert.equal(near.dataset.servicesGradientMotion, 'paused', 'Fields pause before the next paint when booking opens');
assert(scenes.every(scene => scene.dataset.servicesAmbient === 'paused'), 'Atmosphere pauses during form interaction');
paint();
assert(scenes.every(scene => scene.dataset.servicesAmbient === 'paused'), 'Scroll paints cannot restart an interaction pause');
document.documentElement.dataset.servicesFormInteraction = 'false';
mutate(document.documentElement, 'data-services-form-interaction'); paint();
assert.equal(near.dataset.servicesGradientMotion, 'running');
assert.equal(far.dataset.servicesGradientMotion, 'paused', 'Distant fields remain paused after booking closes');
assert.equal(scenes[0].dataset.servicesAmbient, 'running');

window.scrollY = 120; window.emit('scroll'); window.emit('scroll');
assert.equal(frames.size, 1, 'Scroll events share one frame');
assert.equal(timers.size, 1, 'Scroll settling has one timer');
document.hidden = true; document.emit('visibilitychange');
assert.equal(frames.size + timers.size, 0, 'Hiding cancels queued animation and settling work');
assert.equal(near.dataset.servicesGradientMotion, 'paused');
assert(scenes.every(scene => scene.dataset.servicesAmbient === 'paused'));
const hiddenReads = reads;
window.scrollY = 1600; window.emit('scroll'); window.emit('resize'); paint();
assert.equal(reads, hiddenReads, 'Hidden scroll/resize events perform no layout measurements');
assert.equal(frames.size + timers.size, 0);
const previousEvents = progressEvents().length;
document.hidden = false; document.emit('visibilitychange'); paint();
const restored = progressEvents().slice(previousEvents);
assert(restored.length > 0);
assert(restored.every(event => event.detail.velocity === 0), 'Restored position cannot become a synthetic high-speed scroll');
window.scrollY = 1500; window.emit('scroll'); paint();
assert.equal(progressEvents().at(-1).detail.direction, 'up', 'Reverse scrolling resumes immediately');

query.matches = true; query.emit('change'); ambient.refresh(); intersect(); paint();
assert.equal(near.dataset.servicesGradientMotion, 'paused');
assert(scenes.every(scene => scene.dataset.servicesAmbient === 'paused'));
assert.equal(scenes[1].style.values.get('--services-content-y'), '0px');
query.matches = false; query.emit('change'); ambient.refresh(); intersect(); paint();
assert.equal(near.dataset.servicesGradientMotion, 'running');
assert.equal(scenes[1].dataset.servicesAmbient, 'running');

// The selected package is a real deep link; the scene coordinator must find
// its enclosing chapter on direct entry as well as browser hash navigation.
window.location.hash = '#package-brand-clarity';
runtime.refresh();
assert.equal(document.documentElement.dataset.servicesActiveChapterId, 'desire');
const pendingTimers = [...timers.values()]; timers.clear(); pendingTimers.forEach(callback => callback()); paint();
assert.equal(window.scrollY, 1920, 'Package entry uses the chapter header clearance');
window.emit('wheel'); paint();
assert.equal(timers.size, 0, 'Manual scroll immediately releases package recovery');
window.location.hash = '#situation'; window.emit('hashchange');
assert.equal(document.documentElement.dataset.servicesActiveChapterId, 'situation');
window.location.hash = '#package-brand-clarity'; window.emit('hashchange');
assert.equal(document.documentElement.dataset.servicesActiveChapterId, 'desire', 'Back or forward to a package restores its chapter');
window.location.hash = '#package-missing'; window.emit('hashchange'); paint();
assert.equal(timers.size, 0, 'Unknown package fragments cannot leave recovery running');

fields.delete(far); mutate(root);
assert.equal(far.dataset.servicesGradientMotion, undefined);
assert(intersections.every(observer => !observer.targets.has(far)), 'Detached gradients release their observers');
runtime.dispose(); ambient.dispose();
assert.equal(frames.size + timers.size + window.count + document.count + query.count, 0);
assert(mutations.every(observer => observer.disconnected));
assert(resizes.every(observer => observer.disconnected));
assert.equal(near.dataset.servicesGradientMotion, undefined);
console.log('Services ambient motion: interaction pauses, hidden work, neutral resume, reverse scroll, reduced motion, package deep links, and cleanup passed.');
