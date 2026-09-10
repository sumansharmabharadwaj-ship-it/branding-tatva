const clamp = (value: number) => Math.min(1, Math.max(0, value));

function easeBetween(value: number, start: number, end: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

/** Native section progress, from its first appearance to its final departure.
 * At 0.5 the section meets the viewport top: preserve the approved composition
 * throughout the reading interval. Position alone owns every reversible pose.
 */
export function invitationMotionAt(progress: number, compact = false) {
  const p = Number.isFinite(progress) ? clamp(progress) : 0.5;
  const arrival = 1 - easeBetween(p, 0.12, 0.5);
  const departure = easeBetween(p, 0.74, 1);
  const noteArrival = 1 - easeBetween(p, 0.18, 0.48);

  return {
    cameraScale: 1 + arrival * (compact ? 0.055 : 0.12) + departure * (compact ? 0.012 : 0.022),
    cameraY: arrival * (compact ? 12 : 30) - departure * (compact ? 4 : 10),
    thankYouX: compact ? 0 : -44 * arrival,
    thankYouY: arrival * (compact ? 6 : 10),
    makingRoomX: compact ? 0 : 38 * arrival,
    makingRoomY: arrival * (compact ? 8 : 14),
    makingRoomScale: 1 - arrival * (compact ? 0.015 : 0.035),
    noteY: noteArrival * (compact ? 6 : 8),
  };
}
