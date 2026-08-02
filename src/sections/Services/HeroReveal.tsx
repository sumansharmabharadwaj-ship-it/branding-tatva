"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";

// The awakening (film script, scene one): the page begins in forest
// darkness — near black with a breath of green, never pure void — with
// the aspen scene and the masthead both hidden inside it. Scrolling
// breaks the light: the veil is driven by scroll position, so the
// visitor's own movement wakes the forest and reveals the headline
// only once the light arrives. A slower time-based wake runs in
// parallel as the floor, so a visitor who simply waits still sees the
// page open (the veil takes whichever of the two is clearer at any
// moment). The veil sits above the masthead deliberately — the title
// is revealed WITH the scene, per the script's "only then" beat.
// Opacity only, one composited layer; removed entirely under reduced
// motion so the page is immediately readable.
export function HeroReveal() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Scroll wake: darkness fully broken after ~420px of intent.
  const scrollVeil = useTransform(scrollY, [0, 420], [0.93, 0]);
  // Time wake: the forest opens on its own over ~5.5s for the patient.
  const timeVeil = useMotionValue(0.93);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const controls = animate(timeVeil, 0, { duration: 4.2, delay: 1.3, ease: [0.22, 1, 0.36, 1] });
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
