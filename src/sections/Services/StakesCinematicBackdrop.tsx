"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * A restrained cinematic treatment for the positioning chapter.
 *
 * The source image already carries the teaching idea: several similar
 * stones dissolve into category fog while one materially distinctive
 * surface becomes legible. Motion stays subordinate to the interactive
 * comparison above it. A small scroll-linked camera drift creates depth;
 * no blur or filter animation is needed, so the section remains cheap to
 * composite and reduced-motion visitors receive the complete still.
 */
export function StakesCinematicBackdrop({ image }: { image: string }) {
  const prefersReducedMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-3.5%", "3.5%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.11]);
  const mineralLight = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.23, 0.13]);

  return (
    <div ref={frameRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-[-7%]"
        style={prefersReducedMotion ? undefined : { y, scale }}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          quality={90}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </motion.div>

      {/* The generated mineral seam receives a quiet light catch as the
          visitor crosses the chapter. This is a composited gradient, not
          a filter, and never competes with WeakBrandingCost's primary
          focus-pull interaction. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: prefersReducedMotion ? 0.16 : mineralLight,
          background:
            "radial-gradient(circle at 72% 46%, rgba(216,186,126,0.45) 0%, rgba(216,186,126,0.12) 13%, transparent 34%)",
          mixBlendMode: "screen",
        }}
      />

      {/* A cool vignette ties the still to the neighbouring charcoal and
          mist chapters while preserving the image's real stone texture. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,15,17,0.32) 0%, transparent 34%, transparent 66%, rgba(12,15,17,0.46) 100%)",
        }}
      />
    </div>
  );
}
