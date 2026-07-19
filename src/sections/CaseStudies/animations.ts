import type { Variants, Transition } from "framer-motion";

// Grid tiles fade/scale in on mount and on every filter change (popLayout
// mode lets the ones leaving animate out without shoving the survivors
// around mid-exit). The stagger only covers the first four tiles
// (i % 4) — past that it would just make a long "all work" grid take
// visibly longer to finish settling for no real benefit.
export const tileVariants: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
};

export function tileTransition(index: number): Transition {
  return { duration: 0.35, delay: (index % 4) * 0.05, ease: [0.16, 1, 0.3, 1] };
}
