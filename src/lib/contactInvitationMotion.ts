const clamp = (value: number) => Math.min(1, Math.max(0, value));

function easeBetween(value: number, start: number, end: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

/** Three reversible beats: a narrow landscape, oversized type moving through
 * depth, then the approved open invitation. The last 14% is a reading hold.
 * Short screens use the same sequence during native entry without pinning.
 */
export function invitationMotionAt(progress: number, compact = false) {
  const p = Number.isFinite(progress) ? clamp(progress) : 1;
  const camera = 1 - easeBetween(p, 0.04, 0.78);
  const opening = 1 - easeBetween(p, 0.16, 0.7);
  const thanks = 1 - easeBetween(p, 0.2, 0.64);
  const room = 1 - easeBetween(p, 0.28, 0.72);
  const note = 1 - easeBetween(p, 0.5, 0.76);
  const invitation = 1 - easeBetween(p, 0.58, 0.82);
  const signature = 1 - easeBetween(p, 0.65, 0.86);

  return {
    cameraScale: 1 + camera * (compact ? 0.26 : 0.48),
    cameraY: camera * (compact ? 24 : 48),
    cameraRotate: compact ? 0 : -4 * camera,
    windowX: opening * (compact ? 19 : 32),
    windowTop: opening * 13,
    windowBottom: opening * 12,
    windowRadius: opening * 220,
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
    noteOpacity: 1 - note,
    invitationY: invitation * (compact ? 8 : 18),
    invitationOpacity: 1 - invitation,
    signatureY: signature * (compact ? 5 : 9),
    signatureOpacity: 1 - signature,
  };
}
