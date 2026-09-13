"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Image from "next/image";
import { motion } from "framer-motion";
import { BREAK_OVERLAY_GRADIENT, toSvh } from "@/lib/media";
import { EASE_AIR } from "@/lib/motion";
import { useLazyMount } from "@/hooks/useLazyMount";
import { useRevealTrigger } from "@/hooks/useRevealTrigger";

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
  const prefersReducedMotion = useHydratedReducedMotion();
  const [ref, shouldLoad] = useLazyMount();
  const [revealRef, revealed] = useRevealTrigger();

  return (
    <div ref={ref} data-cursor-media className="relative overflow-hidden bg-soil" style={{ height: toSvh(height) }}>
      <motion.div
        ref={revealRef}
        className="absolute inset-0"
        style={{ backgroundImage: shouldLoad ? undefined : overlayGradient }}
        initial={prefersReducedMotion ? undefined : { scale: 1.12 }}
        animate={prefersReducedMotion ? undefined : revealed ? { scale: 1 } : undefined}
        transition={{ duration: 2.4, ease: EASE_AIR }}
      >
        {shouldLoad && (
          <>
            {/* priority, not next/image's default lazy loading — this tag
                only mounts once useLazyMount (already IntersectionObserver
                + Lenis-scroll hardened) says it's needed, so a second,
                independent native lazy-load gate on top of that is pure
                redundancy, and confirmed unreliable on its own: an image
                scrolled fully past can still never fire it. */}
            <Image
              src={image}
              alt=""
              fill
              priority
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
