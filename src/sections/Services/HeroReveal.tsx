"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";

// The awakening now reveals Branding Tatva's original root-system film
// rather than hiding a generic background for several seconds. A short
// scroll-linked veil and a faster time-based wake work in parallel, so the
// visitor receives immediate feedback while the scene still feels directed.
// The title remains part of the reveal, but comprehension is never held
// hostage by atmosphere. Opacity only, one composited layer; removed entirely
// under reduced motion so the page is immediately readable.
export function HeroReveal() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // One small gesture reveals the defining visual event.
  const scrollVeil = useTransform(scrollY, [0, 260], [0.86, 0]);
  // A still visitor receives the complete opening in roughly 2.4 seconds.
  const timeVeil = useMotionValue(0.86);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const controls = animate(timeVeil, 0, {
      duration: 2.15,
      delay: 0.25,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [prefersReducedMotion, timeVeil]);

  const veil = useTransform([scrollVeil, timeVeil], (values: number[]) => Math.min(values[0], values[1]));

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20"
      style={{ opacity: veil, backgroundColor: "#080D0B" }}
    />
  );
}
