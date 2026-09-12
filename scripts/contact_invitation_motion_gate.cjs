#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/lib/contactInvitationMotion.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { invitationMotionAt, invitationBotanyAt, invitationLetterAt } = context.exports;
const pose = (p, compact = false) => JSON.parse(JSON.stringify(invitationMotionAt(p, compact)));
const resting = {
  cameraScale: 1, cameraY: 0, cameraRotate: 0,
  windowX: 0, windowTop: 0, windowBottom: 0, windowRadius: 0,
  thankYouX: 0, thankYouY: 0, thankYouScale: 1, thankYouRotate: 0, thankYouRotateY: 0,
  makingRoomX: 0, makingRoomY: 0, makingRoomScale: 1, makingRoomRotate: 0, makingRoomRotateY: 0,
  noteY: 0, firstNoteClip: 0, secondNoteClip: 0, invitationY: 0, invitationOpacity: 1, signatureY: 0, signatureOpacity: 1, bookingOrbit: 1,
};

function assertCameraCoverage(current, width, height, compact) {
  const originX = width / 2;
  const originY = (height + 12) * 0.72 - 6;
  const radians = current.cameraRotate * Math.PI / 180;
  // Invert the actual camera transform at every corner of the aperture.
  // Curved corners show less of the image, so this is a conservative bound.
  for (const cx of [width * current.windowX / 100, width * (1 - current.windowX / 100)]) {
    for (const cy of [height * current.windowTop / 100, height * (1 - current.windowBottom / 100)]) {
      const dx = cx - originX;
      const dy = cy - originY - current.cameraY;
      const x = (Math.cos(radians) * dx + Math.sin(radians) * dy) / current.cameraScale + originX;
      const y = (-Math.sin(radians) * dx + Math.cos(radians) * dy) / current.cameraScale + originY;
      assert.ok(x >= -6 && x <= width + 6 && y >= -6 && y <= height + 6, "The opening camera must cover every visible edge.");
      for (const pointerX of compact ? [0] : [-8, 0, 8]) {
        for (const pointerY of compact ? [0] : [-6, 0, 6]) {
          assert.ok(x - pointerX >= -12 && x - pointerX <= width + 12 && y - pointerY >= -12 && y - pointerY <= height + 12, "Pointer depth must never expose an empty image edge, including during scroll.");
        }
      }
    }
  }
}

for (const compact of [false, true]) {
  for (const p of [0.86, 0.92, 1, NaN, Infinity]) assert.deepEqual(pose(p, compact), resting, "The film must end in the approved readable composition.");
  assert.deepEqual(pose(-1, compact), pose(0, compact));
  assert.deepEqual(pose(2, compact), pose(1, compact));
  const forward = [];
  for (let step = 0; step <= 1000; step++) {
    const current = pose(step / 1000, compact);
    forward.push(current);
    assert.ok(Object.values(current).every(Number.isFinite));
    assert.ok(current.cameraScale >= 1 && current.cameraScale <= (compact ? 1.26 : 1.48));
    assert.ok(current.windowX >= 0 && current.windowX <= 32 && current.windowTop >= 0 && current.windowBottom >= 0 && current.windowTop + current.windowBottom < 60, "The panorama must keep a substantial landscape visible throughout its transition.");
    for (const opacity of [current.invitationOpacity, current.signatureOpacity, current.bookingOrbit]) assert.ok(opacity >= 0 && opacity <= 1);
    assert.ok(current.firstNoteClip >= 0 && current.firstNoteClip <= current.secondNoteClip && current.secondNoteClip <= 100, "The two notes must reveal in reading order at full contrast.");
    assert.ok(1 - current.secondNoteClip / 100 >= current.invitationOpacity - 1e-9 && current.invitationOpacity >= current.signatureOpacity, "The note, invitation and signature must appear in reading order.");
    if (current.firstNoteClip < 100) {
      assert.ok(current.makingRoomY < (compact ? 4 : 8), "The oversized headline must clear the supporting copy before it appears.");
      for (let i = 0; i < 11; i++) assert.ok(Object.values(invitationLetterAt(step / 1000, i, compact)).every(value => value === 0), "Letter folding must finish before the first note opens.");
    }
    if (compact) assert.equal(Math.abs(current.thankYouX) + Math.abs(current.makingRoomX) + Math.abs(current.cameraRotate), 0, "Compact screens must avoid sideways text travel and camera roll.");
    for (const [w, h] of compact ? [[320, 822], [390, 844]] : [[1280, 720], [1363, 936], [2560, 1440]]) assertCameraCoverage(current, w, h, compact);
    if (step) for (const key of Object.keys(current)) assert.ok(Math.abs(current[key] - forward[step - 1][key]) < 2, `A discontinuity appeared in ${key}.`);
  }
  for (let step = 1000; step >= 0; step--) assert.deepEqual(pose(step / 1000, compact), forward[step], "Reverse scroll must rewind the same film.");
}
assert.ok(pose(0.14).cameraScale > 1.4 && pose(0.14).makingRoomScale > 1.4, "The opening must retain the explicitly requested dramatic scale change.");
assert.ok(pose(0.4).windowX < pose(0.14).windowX && pose(0.7).windowX === 0, "The narrow landscape must open to full bleed.");
assert.ok(pose(0.48).windowX < 5 && pose(0.48).windowTop > 14, "The landscape must open sideways into a panorama before filling the screen vertically.");
assert.equal(pose(0.54).thankYouX, 0);
assert.ok(pose(0.54).makingRoomX > 0, "The second headline should follow the first.");
assert.equal(pose(0.7).bookingOrbit, 0, "The booking emphasis belongs to the completed invitation, not the opening shot.");

// New foreground and typography must resolve before the reading hold, never
// depend on elapsed time, and retrace the same intermediate shots backwards.
for (const compact of [false, true]) {
  const shots = [];
  for (let step = 0; step <= 1000; step++) {
    const p = step / 1000;
    const branches = invitationBotanyAt(p);
    const letters = Array.from({ length: 11 }, (_, i) => invitationLetterAt(p, i, compact));
    const shot = JSON.parse(JSON.stringify({ branches, letters }));
    shots.push(shot);
    assert.ok(Object.values(branches).every(Number.isFinite));
    assert.ok(branches.leftX <= 0 && branches.rightX >= 0, "Branches must part toward their own edges, away from the contact actions.");
    assert.ok(branches.opacity >= 0 && branches.opacity <= 1);
    for (const letter of letters) {
      assert.ok(Object.values(letter).every(Number.isFinite));
      if (compact) assert.ok(letter.y <= 12 && Math.abs(letter.rotate) <= 2, "Phone typography must stay inside its compact reading area.");
      if (p >= 0.7) assert.ok(Object.values(letter).every(value => value === 0), "All letters must resolve before the invitation is fully revealed.");
    }
    if (step) {
      assert.ok(branches.leftX <= shots[step - 1].branches.leftX && branches.rightX >= shots[step - 1].branches.rightX, "Foreground travel must never lurch back toward the reading area.");
    }
    if (p >= 0.86) assert.deepEqual(shot, shots[860], "The final reading hold must stay still.");
  }
  for (let step = 1000; step >= 0; step--) {
    const p = step / 1000;
    assert.deepEqual(JSON.parse(JSON.stringify({ branches: invitationBotanyAt(p), letters: Array.from({ length: 11 }, (_, i) => invitationLetterAt(p, i, compact)) })), shots[step]);
  }
}
console.log("[contact-invitation] 2,002 reversible film poses verified: camera coverage, type depth, reading order, and compact bounds.");
console.log("[contact-invitation] Botanical passage and 11-letter unfolding verified in both directions, including compact bounds and the final reading hold.");
