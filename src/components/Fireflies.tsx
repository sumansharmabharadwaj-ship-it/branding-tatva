"use client";

import { useReducedMotion } from "framer-motion";

// Warm, wandering glow points for the About hero's forest backdrop —
// a livelier, greener cousin of DustMotes (which drifts straight up in
// a sunbeam); these wander and pulse like real fireflies scattered
// through the tree trunks. Fixed positions/timings, no Math.random at
// render, same reasoning as DustMotes: nothing for SSR/CSR to disagree
// on. Skipped entirely under reduced motion.
const FIREFLIES = [
  { left: "8%", top: "62%", size: 5, duration: 7, delay: 0 },
  { left: "18%", top: "40%", size: 4, duration: 9, delay: 1.4 },
  { left: "27%", top: "70%", size: 6, duration: 8, delay: 2.8 },
  { left: "72%", top: "35%", size: 5, duration: 7.5, delay: 0.6 },
  { left: "81%", top: "58%", size: 4, duration: 9.5, delay: 3.6 },
  { left: "90%", top: "44%", size: 5, duration: 8.5, delay: 2 },
  { left: "14%", top: "22%", size: 3, duration: 10, delay: 5 },
  { left: "86%", top: "24%", size: 3, duration: 9, delay: 4.2 },
];

export function Fireflies() {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {FIREFLIES.map((f, i) => (
        <span
          key={i}
          className="firefly"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
