"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BREAK_OVERLAY_GRADIENT } from "@/lib/media";

// The video counterpart to ImageBreak: a full-bleed cinematic moment, but
// with real motion in the shot itself rather than a static photograph.
// Muted, looping, and silent by design, it's atmosphere rather than
// promotional footage. Reduced-motion users get the poster frame only,
// same as a photo would show.

export function VideoBreak({
  src,
  poster,
  quote,
  height = "70vh",
  imagePosition = "center",
}: {
  src: string;
  poster: string;
  quote?: string;
  height?: string;
  imagePosition?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden bg-soil" style={{ height }}>
      {prefersReducedMotion ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `${BREAK_OVERLAY_GRADIENT}, url(${poster})`,
            backgroundSize: "cover",
            backgroundPosition: imagePosition,
          }}
        />
      ) : (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: imagePosition }}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: BREAK_OVERLAY_GRADIENT }}
          />
        </>
      )}

      {quote && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative flex h-full items-center justify-center px-6 text-center"
        >
          <p
            className="max-w-xl px-6 font-display text-2xl italic text-ivory sm:text-3xl"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
          >
            &ldquo;{quote}&rdquo;
          </p>
        </motion.div>
      )}
    </div>
  );
}
