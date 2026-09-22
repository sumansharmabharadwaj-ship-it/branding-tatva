// Check the actual boundary controller's geometry, work budget and cleanup.
// This is deterministic lifecycle coverage, not a browser/FPS measurement.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../src/app/services/servicesSceneDissolves.ts'), 'utf8');
const loaded = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: loaded.exports });
const { createServicesSceneDissolves } = loaded.exports;

const work = [];
function layer(kind, end, rest, top, height = 120) {
  let opacity = String(rest);
  const element = {
    dataset: { servicesDissolve: kind, servicesDissolveEnd: String(end), servicesDissolveRest: String(rest) },
    isConnected: true, top, height,
    style: {
      get opacity() { return opacity; },
      set opacity(value) { work.push('write'); opacity = value; },
    },
    getBoundingClientRect() { work.push('read'); return { top: this.top, height: this.height }; },
  };
  return element;
}
const arrival = layer('arrival', 0.15, 1, 950);
const departure = layer('departure', 0.46, 0.28, 980);
const constant = layer('arrival', 1, 1, 400);
const clear = layer('departure', 0, 0.28, 400);
const far = layer('departure', 0.62, 0.4, 5000);
const groups = [[arrival, departure, constant, clear], [far]];
const controller = createServicesSceneDissolves(groups.map(elements => ({
  querySelectorAll: selector => {
    assert.equal(selector, '[data-services-dissolve]');
    return elements;
  },
})));
let bounds = [{ top: 0, bottom: 1000 }, { top: 4000, bottom: 6000 }];
function paint(reduced = false) {
  work.length = 0;
  const measurements = controller.measure(1000, bounds, reduced);
  assert(!work.includes('write'), 'Measurement phase leaves styles untouched');
  controller.paint(measurements);
  const firstWrite = work.indexOf('write');
  assert(firstWrite < 0 || !work.slice(firstWrite).includes('read'), 'All layout reads precede opacity writes');
}

paint();
assert.equal(Number(arrival.style.opacity), 1);
assert.equal(Number(departure.style.opacity), 0);
assert.equal(Number(clear.style.opacity), 0);
assert.equal(work.filter(item => item === 'read').length, 2, 'Distant and constant layers use zero geometry reads');
assert.equal(far.style.opacity, '0.4');

arrival.top = 575; departure.top = 680;
paint();
assert.equal(Number(arrival.style.opacity), 0.575, 'Arrival halfway between its original 95% and 20% offsets');
assert.equal(Number(departure.style.opacity), 0.23, 'Departure timing includes layer height');
paint();
assert(!work.includes('write'), 'Repeated geometry causes no duplicate style mutations');

arrival.top = 200; departure.top = 380;
paint();
assert.equal(Number(arrival.style.opacity), 0.15);
assert.equal(Number(departure.style.opacity), 0.46);
arrival.top = -2000; departure.top = -2000;
paint();
assert.equal(Number(arrival.style.opacity), 0.15, 'Direct jumps clamp at the final appearance');
assert.equal(Number(departure.style.opacity), 0.46);

arrival.top = 575; departure.top = 680;
paint();
assert.equal(Number(arrival.style.opacity), 0.575, 'Reverse scrolling follows geometry without stale state');
assert.equal(Number(departure.style.opacity), 0.23);
paint(true);
assert(!work.includes('read'), 'Reduced motion performs zero boundary layout measurements');
assert.equal(Number(arrival.style.opacity), 1);
assert.equal(Number(departure.style.opacity), 0.28);
assert.equal(Number(clear.style.opacity), 0.28);
paint(true);
assert.equal(work.length, 0, 'Settled reduced motion causes zero reads or writes');
paint();
assert.equal(Number(departure.style.opacity), 0.23, 'Full motion resumes at the current position');

bounds = [{ top: -6000, bottom: -4000 }, { top: 0, bottom: 2000 }];
far.top = 680;
paint();
assert.equal(work.filter(item => item === 'read').length, 1, 'Only the new nearby chapter is measured');
assert.equal(Number(far.style.opacity), 0.31);
far.isConnected = false;
paint();
assert(!work.includes('read'), 'Detached layers cause no layout work');
controller.dispose();
assert.equal(arrival.style.opacity, '1');
assert.equal(departure.style.opacity, '0.28');
assert.equal(far.style.opacity, '0.4');

console.log('Services scene dissolves: timing, reverse scroll, direct jumps, read/write batching, reduced motion, distant layers and cleanup passed.');
