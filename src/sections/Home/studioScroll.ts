/** Return null when there is no authored scroll runway (compact layouts). */
export function studioProgress(top: number, height: number, viewport: number): number | null {
  const runway = height - viewport;
  return runway > 1 ? Math.min(1, Math.max(0, -top / runway)) : null;
}

/** A small deadband prevents trackpad jitter from flashing adjacent scenes. */
export function studioStep(progress: number, previous: number, count: number): number {
  const next = Math.min(count - 1, Math.floor(progress * count));
  const deadband = 0.015;
  if (next > previous && progress < (previous + 1) / count + deadband) return previous;
  if (next < previous && progress > previous / count - deadband) return previous;
  return next;
}
