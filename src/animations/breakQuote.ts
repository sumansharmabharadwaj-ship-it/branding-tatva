import type { TargetAndTransition, Transition } from "framer-motion";

// The fade-and-rise entrance shared by all three of VideoBreak's quote
// layouts (statement/left/center) — previously the same three-property
// object copy-pasted once per variant.
export const BREAK_QUOTE_INITIAL: TargetAndTransition = { opacity: 0, y: 12 };
export const BREAK_QUOTE_ANIMATE: TargetAndTransition = { opacity: 1, y: 0 };
export const BREAK_QUOTE_TRANSITION: Transition = { duration: 1.2 };
