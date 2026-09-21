const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const source = fs.readFileSync("src/sections/Home/invitationScroll.ts", "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { invitationStep } = context.exports;

// A jittering trackpad crosses the nominal boundary repeatedly without
// changing the reader's step until it has actually left the small deadband.
for (const [previous, samples, expected] of [
  [0, [.332, .335, .33, .34], 0],
  [1, [.335, .33, .325, .34], 1],
  [1, [.665, .67, .66, .675], 1],
  [2, [.665, .67, .66, .675], 2],
]) {
  let current = previous;
  for (const progress of samples) current = invitationStep(progress, current, 3);
  assert.equal(current, expected);
}
assert.equal(invitationStep(.36, 0, 3), 1);
assert.equal(invitationStep(.3, 1, 3), 0);
assert.equal(invitationStep(.7, 1, 3), 2);
assert.equal(invitationStep(.64, 2, 3), 1);
assert.equal(invitationStep(1.1, 0, 3), 2);
assert.equal(invitationStep(-.1, 2, 3), 0);
assert.equal(invitationStep(NaN, 1, 3), 1);
console.log("Invitation scroll gate passed: stable boundaries, forward/reverse handoffs, large jumps and invalid samples.");
