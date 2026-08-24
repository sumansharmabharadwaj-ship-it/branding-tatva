"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// The departure half of the scene dissolve system. SceneVeil (the
// arrival half) makes every chapter open wearing the previous
// chapter's color and release it as the visitor travels in; this makes
// every chapter CLOSE by anticipating the next one — a gradient of the
// NEXT chapter's mood color that fades in over the last stretch of the
// scene as the boundary approaches the viewport. Together the two
// halves give every boundary a bidirectional cross-dissolve: the next
// scene begins before the previous one has fully ended, and no cut is
// ever a cut. Scroll-linked, opacity-only; under reduced motion it
// rests as a moderate static blend so the color journey survives
// without the scrub.
export function SceneHandoff({ color, heightClass = "h-[12vh]" }: { color: string; heightClass?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.98", "end 0.5"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 0.46]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 ${heightClass}`}
      style={{
        opacity: prefersReducedMotion ? 0.28 : opacity,
        background: `linear-gradient(0deg, ${color} 0%, transparent 100%)`,
      }}
    />
  );
}
