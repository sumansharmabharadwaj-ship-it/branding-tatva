"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect } from "react";
import { animate, motion, useMotionValue, useScroll, useTransform } from "framer-motion";

// The opening now reveals Branding Tatva's original root-system film
// immediately enough to signal that the page is alive. A short scroll-linked
// veil and a faster time-based wake run in parallel: one small gesture causes
// a substantial visual response, while a visitor who pauses still receives
// the complete scene without waiting through an ornamental blackout.
// Opacity only, one composited layer; removed for reduced motion.
export function HeroReveal() {
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollY } = useScroll();
  // The defining visual event becomes clear within a modest first gesture.
  const scrollVeil = useTransform(scrollY, [0, 260], [0.86, 0]);
  // The film also opens on its own in roughly 2.4 seconds.
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
      style={{ opacity: veil, backgroundColor: "#0A0F0B" }}
    />
  );
}
