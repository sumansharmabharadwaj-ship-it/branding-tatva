import type { Variants, Transition } from "framer-motion";

// Answer panel expand/collapse — height animates (not just opacity) so
// the questions below actually shift out of the way instead of the
// answer overlapping them.
export const answerVariants: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
};

export const answerTransition: Transition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] };

// The "+" toggle rotates into an "×" when its question is open, rather
// than swapping icons — one glyph, one continuous motion.
export const TOGGLE_ROTATION = { closed: "rotate(0deg)", open: "rotate(45deg)" };
