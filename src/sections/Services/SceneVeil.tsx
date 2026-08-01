"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Scene dissolve, second generation. The first version was a static
// gradient of the previous chapter's mood color at the top of each
// section — spatial continuity only. This one is scroll-linked: the
// veil is fully present while the boundary sits low in the viewport
// (the previous scene still holding the frame) and releases as the
// visitor travels into the chapter — the old scene letting go rather
// than a painted-on band. Opacity-only on a static gradient; under
// reduced motion it simply stays at full strength as the original
// static dissolve.
export function SceneVeil({ color, heightClass = "h-[16vh]" }: { color: string; heightClass?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.2"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 ${heightClass}`}
      style={{
        opacity: prefersReducedMotion ? undefined : opacity,
        background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
      }}
    />
  );
}
