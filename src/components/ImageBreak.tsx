"use client";

import { motion, useReducedMotion } from "framer-motion";

// A full-bleed photographic interlude between two text passages, so long
// text stretches never go more than a viewport or so without a real
// visual moment. The image scales gently in as it enters view, an
// unhurried settle rather than a snap, and holds an optional short line
// of overlay text.

export function ImageBreak({
  image,
  quote,
  height = "70vh",
}: {
  image: string;
  quote?: string;
  height?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden bg-soil" style={{ height }}>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(39,34,30,0.45) 0%, rgba(39,34,30,0.1) 40%, rgba(39,34,30,0.1) 60%, rgba(39,34,30,0.45) 100%), url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        initial={prefersReducedMotion ? undefined : { scale: 1.12 }}
        whileInView={prefersReducedMotion ? undefined : { scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      />
      {quote && (
        <div className="relative flex h-full items-center justify-center px-6 text-center">
          <p className="max-w-xl font-display text-2xl italic text-ivory sm:text-3xl">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
