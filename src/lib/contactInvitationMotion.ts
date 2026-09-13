const clamp = (value: number) => Math.min(1, Math.max(0, value));

function easeBetween(value: number, start: number, end: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

/** Foreground branches pass the camera faster than the distant landscape. */
export function invitationBotanyAt(progress: number) {
  const p = Number.isFinite(progress) ? clamp(progress) : 1;
  const passage = easeBetween(p, 0.12, 0.76);
  const leftPassage = easeBetween(p, 0.1, 0.7);
  const rightPassage = easeBetween(p, 0.18, 0.78);
  return {
    leftX: -4 - leftPassage * 74,
    rightX: 4 + rightPassage * 74,
    leftY: leftPassage * 32,
    rightY: rightPassage * 32,
    scale: 1 + passage * 0.15,
    leftRotate: -leftPassage * 8,
    rightRotate: rightPassage * 8,
    opacity: 1 - passage * 0.24,
    frame: easeBetween(p, 0.38, 0.82),
  };
}

/** A bounded response to scroll direction and speed, confined to the opening.
 * Supporting copy and the final invitation never inherit this extra movement.
 */
export function invitationMomentumAt(progress: number, velocity: number, compact = false) {
  const p = Number.isFinite(progress) ? clamp(progress) : 1;
  const speed = Number.isFinite(velocity) ? Math.max(-1, Math.min(1, velocity)) : 0;
  const opening = easeBetween(p, 0.1, 0.24) * (1 - easeBetween(p, 0.42, 0.6));
  const flex = speed * opening;
  return {
    leftRotate: flex * (compact ? 1.1 : 4.5),
    rightRotate: -flex * (compact ? 0.8 : 3),
    leftY: flex * (compact ? 3 : 10),
    rightY: -flex * (compact ? 2 : 7),
  };
}

/** A travelling fold, rather than a timed animation, so every letter rewinds. */
export function invitationLetterAt(progress: number, index: number, compact = false) {
  const p = Number.isFinite(progress) ? clamp(progress) : 1;
  const delay = Math.min(10, Math.max(0, index)) * 0.018;
  const fold = 1 - easeBetween(p, 0.12 + delay, 0.38 + delay);
  return {
    y: fold * (compact ? 12 : 30),
    rotateX: fold * (compact ? 36 : 68),
    rotate: fold * (index % 2 ? -1 : 1) * (compact ? 2 : 5),
  };
}

/** Three reversible beats: a narrow landscape opens into a panorama before
 * the full invitation. Type travels through depth; the last 14% is a reading hold.
 * Short screens use the same sequence during native entry without pinning.
 */
export function invitationMotionAt(progress: number, compact = false) {
  const p = Number.isFinite(progress) ? clamp(progress) : 1;
  const camera = 1 - easeBetween(p, 0.04, 0.78);
  const opening = 1 - easeBetween(p, 0.16, 0.58);
  const panorama = easeBetween(p, 0.16, 0.42) * (1 - easeBetween(p, 0.42, 0.7));
  const thanks = 1 - easeBetween(p, 0.16, 0.54);
  const room = 1 - easeBetween(p, 0.22, 0.62);
  const note = 1 - easeBetween(p, 0.56, 0.75);
  const invitation = 1 - easeBetween(p, 0.68, 0.82);
  const invitationLead = 1 - easeBetween(p, 0.66, 0.77);
  const invitationReply = 1 - easeBetween(p, 0.73, 0.83);
  const signature = 1 - easeBetween(p, 0.78, 0.86);
  const arc = easeBetween(p, 0.14, 0.36) * (1 - easeBetween(p, 0.36, 0.64));

  return {
    cameraScale: 1 + camera * (compact ? 0.26 : 0.48),
    cameraX: compact ? 0 : -24 * arc,
    cameraY: camera * (compact ? 24 : 48),
    cameraRotate: compact ? 0 : -4 * camera,
    windowX: opening * (compact ? 19 : 32),
    windowTop: opening * 13 + panorama * (compact ? 8 : 16),
    windowBottom: opening * 12 + panorama * (compact ? 7 : 14),
    windowRadius: opening * 220 + panorama * 32,
    thankYouX: compact ? 0 : -130 * thanks,
    thankYouY: thanks * (compact ? 22 : 40),
    thankYouScale: 1 + thanks * (compact ? 0.08 : 0.35),
    thankYouRotate: compact ? 0 : -7 * thanks,
    thankYouRotateY: compact ? 0 : -24 * thanks,
    makingRoomX: compact ? 0 : 115 * room,
    makingRoomY: room * (compact ? 38 : 98),
    makingRoomScale: 1 + room * (compact ? 0.12 : 0.5),
    makingRoomRotate: compact ? 0 : 5 * room,
    makingRoomRotateY: compact ? 0 : 20 * room,
    noteY: note * (compact ? 12 : 26),
    // Both lines reveal at full contrast, after the headline clears them.
    firstNoteClip: 100 * (1 - easeBetween(p, 0.56, 0.69)),
    secondNoteClip: 100 * (1 - easeBetween(p, 0.61, 0.75)),
    invitationY: invitation * (compact ? 8 : 18),
    invitationLeadClip: invitationLead * 100,
    invitationReplyClip: invitationReply * 100,
    promiseStroke: easeBetween(p, 0.8, 0.86),
    signatureY: signature * (compact ? 5 : 9),
    signatureClip: signature * 100,
    bookingOrbit: easeBetween(p, 0.72, 0.86),
  };
}
