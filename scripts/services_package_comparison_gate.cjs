// Exercise the real native-scroll controller with a deterministic frame clock.
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
  emit(name, event = {}) { this.listeners.get(name)?.forEach(callback => callback(event)); }
}

function mount(initialIndex = 0, reducedMotion = false) {
  const frames = new Map(), timers = new Map();
  let sequence = 0, layoutReads = 0, active = initialIndex;
  let width = 360, cardWidth = 320, scrollWidth = 1080;
  const lefts = [0, 336, 672];
  const moves = [], selections = [];
  const track = new Events();
  track.scrollLeft = 0;
  Object.defineProperties(track, {
    clientWidth: { get() { layoutReads++; return width; } },
    scrollWidth: { get() { layoutReads++; return scrollWidth; } },
  });
  track.scrollTo = options => {
    moves.push(options);
    if (options.behavior === 'instant') track.scrollLeft = options.left;
  };
  const cards = lefts.map((_, index) => ({
    get offsetLeft() { layoutReads++; return lefts[index]; },
    get clientWidth() { layoutReads++; return cardWidth; },
    contains: node => node?.cardIndex === index,
  }));
  let observer;
  class ResizeObserver {
    connected = true;
    constructor(callback) { this.callback = callback; observer = this; }
    observe() {}
    disconnect() { this.connected = false; }
  }
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src/sections/Services/packageComparisonScroll.ts'), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports, ResizeObserver, window: {
    requestAnimationFrame: callback => { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: callback => { timers.set(++sequence, callback); return sequence; },
    clearTimeout: id => timers.delete(id),
  } });
  const controller = exports.bindPackageComparisonScroll(track, cards, {
    initialIndex, reducedMotion, onActive: index => { active = index; selections.push(index); },
  });
  function paint() {
    const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback());
  }
  return {
    controller, track, moves, selections, frames, timers, observer, paint,
    get active() { return active; }, get reads() { return layoutReads; },
    scroll(left) { track.scrollLeft = left; track.emit('scroll'); },
    settle() { const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback()); },
    resize(nextWidth, nextCardWidth, nextLefts, nextScrollWidth) {
      width = nextWidth; cardWidth = nextCardWidth; scrollWidth = nextScrollWidth;
      lefts.splice(0, lefts.length, ...nextLefts); observer.callback(); paint();
    },
  };
}

// A choice stays chosen while passing the intervening package. The previous
// onScroll implementation replaced activeIndex with each intermediate card.
const navigation = mount();
navigation.controller.goTo(2);
navigation.scroll(100);
navigation.paint();
assert.equal(navigation.active, 2, 'Intermediate scroll must not overwrite the requested package');
navigation.track.emit('scrollend');
assert.equal(navigation.active, 2, 'An old scrollend must not cancel a newer target');
navigation.controller.goTo(1);
navigation.controller.goTo(2);
assert.equal(navigation.moves.at(-1).left, 652, 'Rapid navigation should reach the last requested card');
navigation.scroll(652);
navigation.track.emit('scrollend');
assert.equal(navigation.active, 2);
assert.equal(navigation.timers.size, 0);
navigation.controller.dispose();

const swipe = mount();
const measured = swipe.reads;
for (let i = 0; i < 100; i++) swipe.scroll(i * 3);
assert.equal(swipe.frames.size, 1, 'A scroll burst queues one update');
swipe.paint();
assert.equal(swipe.reads, measured, 'Scrolling reuses cached card geometry');
assert.equal(swipe.active, 1);
swipe.controller.goTo(2);
swipe.track.emit('pointerdown');
assert.equal(swipe.active, 1, 'Touching the deck takes control from the animated request');
assert.equal(swipe.moves.at(-1).behavior, 'instant');
swipe.scroll(0); swipe.paint(); swipe.settle();
assert.equal(swipe.active, 0, 'Reverse swiping updates the selected package');
swipe.controller.dispose();

const resizing = mount(2);
assert.equal(resizing.track.scrollLeft, 652, 'Mount at the selected package');
resizing.resize(400, 360, [0, 376, 752], 1200);
assert.equal(resizing.track.scrollLeft, 732);
assert.equal(resizing.active, 2, 'Rotation preserves the selected package');
const moveCount = resizing.moves.length;
resizing.observer.callback(); resizing.paint();
assert.equal(resizing.moves.length, moveCount, 'Expanding card height must not recenter the deck');
resizing.resize(1100, 350, [0, 375, 750], 1100);
assert.equal(resizing.track.scrollLeft, 0);
assert.equal(resizing.active, 2, 'Desktop columns keep the selected package');
resizing.resize(360, 320, [0, 336, 672], 1080);
assert.equal(resizing.track.scrollLeft, 652, 'Returning to mobile restores the same card');
resizing.controller.dispose();

const keyboard = mount();
let prevented = 0;
const key = (key, target = keyboard.track) => keyboard.track.emit('keydown', { key, target, preventDefault: () => prevented++ });
key('End'); assert.equal(keyboard.active, 2);
key('ArrowLeft'); assert.equal(keyboard.active, 1);
key('Home'); assert.equal(keyboard.active, 0);
key('End', { cardIndex: 1 });
assert.equal(keyboard.active, 0, 'Keys inside links and details remain native');
assert.equal(prevented, 3);
keyboard.track.emit('focusin', { target: { cardIndex: 2 } });
assert.equal(keyboard.track.scrollLeft, 652, 'Focused card content is fully brought into view');
assert.equal(keyboard.moves.at(-1).behavior, 'instant');
keyboard.controller.goTo(0);
keyboard.controller.setReducedMotion(true);
assert.equal(keyboard.active, 0);
assert.equal(keyboard.track.scrollLeft, 0, 'Reduced motion settles the pending choice immediately');
keyboard.controller.goTo(1);
assert.equal(keyboard.moves.at(-1).behavior, 'instant');
keyboard.scroll(100); keyboard.observer.callback();
keyboard.controller.dispose(); keyboard.observer.callback();
assert.equal(keyboard.frames.size, 0);
assert.equal(keyboard.timers.size, 0);
assert.equal(keyboard.observer.connected, false);
assert.ok([...keyboard.track.listeners.values()].every(listeners => listeners.size === 0));

const fallback = mount();
fallback.controller.goTo(2);
fallback.scroll(316); fallback.paint(); fallback.settle();
assert.equal(fallback.active, 1, 'A canceled browser scroll settles to the actual card without scrollend support');
fallback.controller.dispose();
console.log('Package comparison passed: rapid choices, native swipes, one update per frame, cached geometry, resize and desktop return, keyboard focus, reduced motion, interrupted scrolling, and cleanup.');
