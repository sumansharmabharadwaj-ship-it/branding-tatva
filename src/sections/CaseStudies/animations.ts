import type { Variants, Transition } from "framer-motion";

// Grid tiles fade/scale/rise in on mount and on every filter change
// (popLayout mode lets the ones leaving animate out without shoving the
// survivors around mid-exit). The stagger only covers the first four
// tiles (i % 4) — past that it would just make a long "all work" grid
// take visibly longer to finish settling for no real benefit.
//
// Alternating a slight rotation by index (clockwise/counter-clockwise)
// on top of the rise-and-settle gives the mosaic a sense of tiles
// arriving from slightly different depths instead of every tile
// playing the exact same motion in lockstep — kept small (1.5deg) so
// it reads as considered rather than crooked.
export function tileVariants(index: number): Variants {
  const direction = index % 2 === 0 ? 1 : -1;
  return {
    initial: { opacity: 0, scale: 0.97, y: 24, rotate: direction * 1.5 },
    animate: { opacity: 1, scale: 1, y: 0, rotate: 0 },
    exit: { opacity: 0, scale: 0.97, y: 24, rotate: direction * 1.5 },
  };
}

export function tileTransition(index: number): Transition {
  return { duration: 0.35, delay: (index % 4) * 0.05, ease: [0.16, 1, 0.3, 1] };
}
