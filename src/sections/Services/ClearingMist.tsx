"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Scroll-controlled atmosphere for the FAQ chapter — the piece that
// turns a tall section into a guided descent: an extra mist wash sits
// over the whole scene, densest as the visitor enters and thinning as
// they move down through the questions, so the fog literally clears as
// the answers accumulate, arriving at Book Call in the clearest air on
// the page. Scroll-linked (the visitor's own progress performs it),
// opacity-only on a constant-blur layer, and absent entirely under
// reduced motion — the section's static haze layers already carry the
// atmosphere there.
export function ClearingMist() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.9, 0.5, 0.05]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        background:
          "linear-gradient(180deg, rgba(206,215,222,0.13) 0%, rgba(206,215,222,0.07) 45%, rgba(206,215,222,0.02) 100%)",
        
      }}
    />
  );
}
