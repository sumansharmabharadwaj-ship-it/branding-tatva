#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/lib/contactInvitationMotion.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { invitationMotionAt } = context.exports;
const pose = (progress, compact = false) => JSON.parse(JSON.stringify(invitationMotionAt(progress, compact)));

const resting = {
  cameraScale: 1, cameraY: 0,
  thankYouX: 0, thankYouY: 0,
  makingRoomX: 0, makingRoomY: 0, makingRoomScale: 1,
  noteY: 0, invitationY: 0, signatureY: 0,
};

for (const compact of [false, true]) {
  for (const progress of [0.5, 0.6, 0.74, NaN, Infinity]) {
    assert.deepEqual(pose(progress, compact), resting, "Reading and restored-hash poses must match the approved composition.");
  }
  assert.deepEqual(pose(-1, compact), pose(0, compact));
  assert.deepEqual(pose(2, compact), pose(1, compact));

  const forward = [];
  for (let step = 0; step <= 1000; step += 1) {
    const progress = step / 1000;
    const current = pose(progress, compact);
    forward.push(current);
    assert.ok(Object.values(current).every(Number.isFinite));
    assert.ok(current.cameraScale >= 1 && current.cameraScale <= (compact ? 1.055 : 1.12));
    assert.ok(current.makingRoomScale >= 0.965 && current.makingRoomScale <= 1);
    if (compact) assert.equal(Math.abs(current.thankYouX) + Math.abs(current.makingRoomX), 0, "Phone text must stay inside its horizontal bounds.");
    // The 12px paragraph gap stays open even while the note is travelling.
    assert.ok(current.noteY <= 8);
    assert.ok(12 + current.invitationY - current.noteY >= 4, "The note must not touch the invitation as they settle.");
    assert.ok(18 - current.signatureY >= 13, "The signature must not touch the stationary actions.");
    // Model the smallest scene's 72% camera origin and its 6px overscan.
    const sceneHeight = compact ? 820 : 800;
    const topCover = 6 + sceneHeight * 0.72 * (current.cameraScale - 1) - current.cameraY;
    const bottomCover = 6 + sceneHeight * 0.28 * (current.cameraScale - 1) + current.cameraY;
    assert.ok(topCover >= 0 && bottomCover >= 0, "Camera travel must never expose an unpainted edge.");
    if (step > 0) {
      for (const key of Object.keys(current)) {
        assert.ok(Math.abs(current[key] - forward[step - 1][key]) < 0.2, `Abrupt motion in ${key}.`);
      }
    }
  }
  for (let step = 1000; step >= 0; step -= 1) {
    assert.deepEqual(pose(step / 1000, compact), forward[step], "Scrolling back must retrace exactly, without a one-shot gate.");
  }
}
assert.ok(pose(0.25).cameraScale > pose(0.25, true).cameraScale, "Touch motion must have a lighter amplitude.");
assert.ok(pose(0.25).thankYouX < 0 && pose(0.25).makingRoomX > 0, "Headline lines must converge from opposite sides.");
assert.equal(pose(0.42).thankYouX, 0, "The opening thanks settles first.");
assert.ok(pose(0.42).makingRoomX > 0 && pose(0.46).noteY > 0 && pose(0.49).signatureY > 0, "The following lines should resolve in reading order.");
console.log("[contact-invitation] 2,002 scroll poses verified: reversible, bounded, responsive, stable reading frame.");
