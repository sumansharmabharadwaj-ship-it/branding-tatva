"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Tertiary environmental life (direct creative direction: "the
// environment exists independently of the visitor"). Distant birds
// cross the sky at irregular intervals — never on a fixed clock, never
// on the same path twice. Randomness in timing, altitude, speed, scale,
// direction, and opacity, because nature never behaves mechanically.
//
// Motion hierarchy: this is the smallest layer, above the footage
// (primary) and wind/mist drift (secondary). It spawns at most a few
// silhouettes at a time and stays deliberately easy to miss — the point
// is that visitors DISCOVER it, not that it performs.
//
// All spawning happens post-mount inside useEffect, so SSR renders an
// empty layer and hydration can never mismatch on random values.
// Renders nothing under reduced motion.

type Bird = {
  id: number;
  top: number; // vh-relative % within the layer
  duration: number; // seconds to cross
  scale: number;
  opacity: number;
  rtl: boolean;
  flock: number; // small vertical offset for companions
};

// Interval ranges (ms) between spawn events. "rare" = one solitary
// silhouette every long while (Positioning's lone bird above the
// clouds); "occasional" = a sky that is quietly inhabited (FAQ,
// Book Call, Hero).
const INTERVALS = {
  rare: [26000, 55000],
  occasional: [11000, 28000],
} as const;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function SkyLife({
  density = "occasional",
  // Highest altitude band the birds may use, as % from the layer top —
  // keeps them in the sky portion of a composition instead of crossing
  // through foreground subject matter.
  band = [8, 42] as readonly [number, number],
  // Silhouette color — near-black by default; pass a pale tint for
  // scenes where the sky itself is dark.
  color = "rgba(20,24,20,0.8)",
  // Force one solitary bird per event (Positioning's leadership bird);
  // otherwise events occasionally bring 2-3 companions.
  solitary = false,
}: {
  density?: keyof typeof INTERVALS;
  band?: readonly [number, number];
  color?: string;
  solitary?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [birds, setBirds] = useState<Bird[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const spawn = () => {
      if (cancelled) return;
      const count = solitary ? 1 : Math.random() < 0.6 ? 1 : Math.random() < 0.75 ? 2 : 3;
      const rtl = Math.random() < 0.5;
      const baseTop = rand(band[0], band[1]);
      const duration = rand(19, 34);
      const made: Bird[] = Array.from({ length: count }, (_, i) => ({
        id: nextId.current++,
        top: baseTop + (i === 0 ? 0 : rand(-4, 4)),
        duration: duration * rand(0.96, 1.05),
        scale: rand(0.5, 1) * (solitary ? 0.7 : 1),
        opacity: rand(0.3, 0.6),
        rtl,
        flock: i,
      }));
      setBirds((prev) => [...prev, ...made]);
      // Retire each bird just after its crossing completes.
      made.forEach((b) => {
        setTimeout(() => {
          if (!cancelled) setBirds((prev) => prev.filter((p) => p.id !== b.id));
        }, (b.duration + 1) * 1000);
      });
      const [lo, hi] = INTERVALS[density];
      timer = setTimeout(spawn, rand(lo, hi));
    };

    // First appearance arrives on its own quiet schedule too — never
    // instantly on section entry.
    timer = setTimeout(spawn, rand(2500, 9000));
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [prefersReducedMotion, density, solitary, band]);

  if (prefersReducedMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {birds.map((b) => (
        <span
          key={b.id}
          className={b.rtl ? "sky-cross-rtl" : "sky-cross-ltr"}
          style={{
            position: "absolute",
            top: `${b.top}%`,
            left: 0,
            right: 0,
            animationDuration: `${b.duration}s`,
            opacity: b.opacity,
          }}
        >
          <span className="sky-bob" style={{ display: "inline-block", animationDelay: `${b.flock * 0.7}s` }}>
            <svg
              width={18 * b.scale}
              height={8 * b.scale}
              viewBox="0 0 18 8"
              fill="none"
              style={{ display: "block" }}
            >
              {/* A distant-bird glyph: two soft wing arcs, no detail —
                  at this scale anything more literal reads as clip art. */}
              <path
                d="M1 5 Q 5 1 9 4.6 Q 13 1 17 5"
                stroke={color}
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
