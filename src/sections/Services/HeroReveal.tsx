"use client";

import { motion, useReducedMotion } from "framer-motion";

// The hero's cinematic reveal, per direct integration direction: the
// scene fades in from near black over the first beats, so the shaft of
// sunlight is the first thing the eye resolves and the rays gradually
// illuminate the frame. The masthead's own Reveal is delayed to land
// at the brightest moment — the light revealing the brand rather than
// text sitting on a video. Opacity only; skipped under reduced motion.
export function HeroReveal() {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 bg-black"
      initial={{ opacity: 0.94 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
