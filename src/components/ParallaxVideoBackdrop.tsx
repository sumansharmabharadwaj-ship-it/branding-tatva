"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BackgroundVideo } from "./BackgroundVideo";

// Same scroll-linked drift VideoBreak's own `parallax` prop already uses
// (useScroll + useTransform against the section's own bounds) — pulled
// out standalone for sections built on a plain <section>/Container
// rather than VideoBreak's quote-card layout, so text-heavy sections can
// still get real camera movement instead of a static backdrop.
//
// Two layers of motion, not one: the outer layer drifts vertically with
// scroll position (±12%, stronger than VideoBreak's own ±8% — direct
// feedback that an earlier, subtler version read as static); the inner
// layer runs a slow continuous zoom breathing independent of scroll, so
// the section still feels alive even while the reader is paused reading
// rather than actively scrolling. 1.28-1.36 scale range is sized to
// cover the ±12% drift with margin (needs >=1.24 to never reveal an
// edge) plus the breathing itself, on the inner layer specifically so
// the two motions compose instead of one overwriting the other's
// transform.
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
  const prefersReducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={prefersReducedMotion ? undefined : { y: mediaY }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.28 }}
          animate={prefersReducedMotion ? undefined : { scale: [1.28, 1.36, 1.28] }}
          transition={prefersReducedMotion ? undefined : { duration: 26, repeat: Infinity, ease: "easeInOut" }}
        >
          <BackgroundVideo video={video} poster={poster} imagePosition={imagePosition} />
        </motion.div>
      </motion.div>
    </div>
  );
}
