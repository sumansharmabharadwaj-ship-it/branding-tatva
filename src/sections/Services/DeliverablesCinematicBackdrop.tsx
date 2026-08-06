"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Turns the generated paper archive into a quiet moving environment.
 * The explorer itself owns the chapter's primary interaction, so this
 * layer only supplies a small camera drift and a passing edge-light.
 * Both effects use transforms and opacity; reduced motion receives the
 * complete, legible still without an abbreviated animation state.
 */
export function DeliverablesCinematicBackdrop({ image }: { image: string }) {
  const prefersReducedMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["2.5%", "-2.5%"]);
  const y = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.09]);
  const edgeLightX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const edgeLightOpacity = useTransform(scrollYProgress, [0, 0.52, 1], [0.07, 0.17, 0.09]);

  return (
    <div ref={frameRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-[-7%]"
        style={prefersReducedMotion ? undefined : { x, y, scale }}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          quality={88}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </motion.div>

      {/* The light follows the paper edges rather than washing the whole
          frame. It is intentionally quieter than the document unfold in
          DeliverablesExplorer. */}
      <motion.div
        className="pointer-events-none absolute inset-[-10%]"
        style={{
          x: prefersReducedMotion ? "0%" : edgeLightX,
          opacity: prefersReducedMotion ? 0.1 : edgeLightOpacity,
          background:
            "linear-gradient(112deg, transparent 35%, rgba(239,226,197,0.34) 49%, rgba(239,226,197,0.08) 55%, transparent 68%)",
          mixBlendMode: "screen",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,15,15,0.48) 0%, rgba(12,15,15,0.08) 40%, rgba(12,15,15,0.42) 100%)",
        }}
      />
    </div>
  );
}
