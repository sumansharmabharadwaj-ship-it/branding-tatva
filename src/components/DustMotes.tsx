"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";


// A handful of soft drifting light specks over the main hero — the kind
// of dust visible in a sunbeam through trees, which the reference photo
// already implies. Fixed, deterministic positions/timings (no Math.random
// at render) so there's nothing for SSR/CSR to disagree on. Kept to a
// handful of very low-opacity, slow-moving points; the goal is ambient
// texture that most visitors never consciously notice, not decoration
// that competes with the headline. Skipped entirely under reduced-motion.

const MOTES = [
  { left: "12%", size: 4, duration: 18, delay: 0 },
  { left: "24%", size: 3, duration: 22, delay: 3 },
  { left: "41%", size: 5, duration: 16, delay: 6 },
  { left: "58%", size: 3, duration: 24, delay: 1 },
  { left: "72%", size: 4, duration: 19, delay: 9 },
  { left: "86%", size: 3, duration: 21, delay: 4 },
];

export function DustMotes() {
  const prefersReducedMotion = useHydratedReducedMotion();
  if (prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="dust-mote"
          style={{
            left: m.left,
            width: m.size,
            height: m.size,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
