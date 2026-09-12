const clamp = (value: number) => Math.min(1, Math.max(0, value));

function easeBetween(value: number, start: number, end: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

/** Entry and exit each cover one viewport of native scroll. A taller section
 * holds 0.5 throughout its extra reading space. Position alone owns every pose.
 */
export function invitationMotionAt(progress: number, compact = false) {
  const p = Number.isFinite(progress) ? clamp(progress) : 0.5;
  const arrival = 1 - easeBetween(p, 0.12, 0.5);
  const departure = easeBetween(p, 0.74, 1);
  const thankYouArrival = 1 - easeBetween(p, 0.08, 0.42);
  const makingRoomArrival = 1 - easeBetween(p, 0.16, 0.46);
  const noteArrival = 1 - easeBetween(p, 0.23, 0.48);
  const invitationArrival = 1 - easeBetween(p, 0.27, 0.49);
  const signatureArrival = 1 - easeBetween(p, 0.31, 0.5);

  return {
    cameraScale: 1 + arrival * (compact ? 0.055 : 0.12) + departure * (compact ? 0.012 : 0.022),
    cameraY: arrival * (compact ? 12 : 30) - departure * (compact ? 4 : 10),
    thankYouX: compact ? 0 : -44 * thankYouArrival,
    thankYouY: thankYouArrival * (compact ? 6 : 10),
    makingRoomX: compact ? 0 : 38 * makingRoomArrival,
    makingRoomY: makingRoomArrival * (compact ? 8 : 14),
    makingRoomScale: 1 - makingRoomArrival * (compact ? 0.015 : 0.035),
    noteY: noteArrival * (compact ? 6 : 8),
    invitationY: invitationArrival * (compact ? 4 : 6),
    signatureY: signatureArrival * (compact ? 3 : 5),
  };
}
