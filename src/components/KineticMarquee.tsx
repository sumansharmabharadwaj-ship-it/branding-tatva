"use client";

import { motion, useReducedMotion } from "framer-motion";

// A slow, continuous horizontal drift of tracked-out text, the kind of
// chapter divider used between sections instead of a plain rule. Reduced
// motion users get it static, since the words still read fine without
// the drift.

export function KineticMarquee({ text }: { text: string }) {
  const prefersReducedMotion = useReducedMotion();
  const items = Array.from({ length: 6 });

  return (
    <div className="overflow-hidden border-y border-border bg-soil py-4">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap font-body text-xs font-medium uppercase tracking-[0.4em] text-ivory/50"
        animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {items.map((_, i) => (
          <span key={i}>{text}</span>
        ))}
      </motion.div>
    </div>
  );
}
