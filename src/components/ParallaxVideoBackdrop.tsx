"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "./BackgroundVideo";

// Same scroll-linked drift VideoBreak's own `parallax` prop already uses
// (useScroll + useTransform against the section's own bounds) — pulled
// out standalone for sections built on a plain <section>/Container
// rather than VideoBreak's quote-card layout, so text-heavy sections can
// still get real camera movement instead of a static backdrop. 1.16
// overscan matches VideoBreak's own rest scale, keeping the ±8%
// vertical drift from ever revealing an edge.
export function ParallaxVideoBackdrop({
  video,
  poster,
  imagePosition = "center",
}: {
  video: string;
  poster: string;
  imagePosition?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={prefersReducedMotion ? undefined : { y: mediaY, scale: 1.16 }}
      >
        <BackgroundVideo video={video} poster={poster} imagePosition={imagePosition} />
      </motion.div>
    </div>
  );
}
