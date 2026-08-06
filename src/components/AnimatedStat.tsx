"use client";

// Evidence numbers must be correct at every frame. The surrounding card
// and section may reveal with restrained motion, but the value itself is
// never rolled from zero or temporarily replaced by an intermediate
// number. This keeps screenshots, reduced motion, throttled tabs, fast
// scrolling, and assistive technology aligned with the verified claim.
export function AnimatedStat({ value }: { value: string }) {
  return <span>{value}</span>;
}
