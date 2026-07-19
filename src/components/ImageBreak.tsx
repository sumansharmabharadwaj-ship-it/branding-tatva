"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BREAK_OVERLAY_GRADIENT } from "@/lib/media";
import { useLazyMount } from "@/hooks/useLazyMount";

// A full-bleed photographic interlude between two text passages, so long
// text stretches never go more than a viewport or so without a real
// visual moment. The image scales gently in as it enters view, an
// unhurried settle rather than a snap, and holds an optional short line
// of overlay text.

type QuoteVariant = "center" | "left";

export function ImageBreak({
  image,
  quote,
  height = "70vh",
  imagePosition = "center",
  overlayGradient = BREAK_OVERLAY_GRADIENT,
  quoteVariant = "center",
}: {
  image: string;
  quote?: string;
  height?: string;
  imagePosition?: string;
  overlayGradient?: string;
  quoteVariant?: QuoteVariant;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [ref, shouldLoad] = useLazyMount();

  return (
    <div ref={ref} data-cursor-media className="relative overflow-hidden bg-soil" style={{ height }}>
      <motion.div
        className="absolute inset-0"
        style={{ backgroundImage: shouldLoad ? undefined : overlayGradient }}
        initial={prefersReducedMotion ? undefined : { scale: 1.12 }}
        whileInView={prefersReducedMotion ? undefined : { scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {shouldLoad && (
          <>
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: imagePosition }}
            />
            <div className="absolute inset-0" style={{ backgroundImage: overlayGradient }} />
          </>
        )}
      </motion.div>
      {quote && quoteVariant === "left" && (
        <div className="relative flex h-full items-end px-6 pb-12 sm:px-12 sm:pb-16">
          <p
            className="max-w-md font-display text-2xl italic text-ivory sm:text-3xl"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
          >
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      )}
      {quote && quoteVariant === "center" && (
        <div className="relative flex h-full items-center justify-center px-6 text-center">
          <p
            className="max-w-xl px-6 font-display text-2xl italic text-ivory sm:text-3xl"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
          >
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
