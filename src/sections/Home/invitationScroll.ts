/** Keep a reading step stable while a trackpad hovers near its boundary. */
export function invitationStep(progress: number, previous: number, count: number): number {
  if (!Number.isFinite(progress)) return previous;
  const clamped = Math.min(1, Math.max(0, progress));
  const next = Math.min(count - 1, Math.floor(clamped * count));
  const deadband = 0.015;
  if (next > previous && clamped < (previous + 1) / count + deadband) return previous;
  if (next < previous && clamped > previous / count - deadband) return previous;
  return next;
}
