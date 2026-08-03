"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementSlug } from "@/lib/sectionWash";

// Suman's board, the Tatva growth wave: each element PERFORMS its
// nature as its stage arrives, instead of only crossfading in. Earth
// grows roots, water rises, fire ignites, air sweeps the frame, space
// reveals a constellation. Every choreography is transform, opacity,
// or pathLength only — the motion budget's midground layer, quiet
// enough that the stage's own text stays the loudest thing on screen.
// The overlay mounts fresh on each activation (the parent renders it
// only while its stage is active), so the entrance replays every time
// a visitor returns to the stage. Pure decoration: hidden from
// assistive tech, absent under reduced motion.
const EASE = [0.22, 1, 0.36, 1] as const;

// A small branching root system, drawn downward. Hand-authored paths
// (six strokes) rather than generated — the site's own motif style.
const ROOTS = [
  "M120 0 C118 40 108 70 84 104 C70 124 52 138 30 148",
  "M120 0 C122 44 132 78 158 110 C172 127 192 140 214 148",
  "M120 0 C119 30 114 58 100 84",
  "M120 0 C121 34 128 64 144 92",
  "M84 104 C76 118 62 128 44 134",
  "M158 110 C168 122 182 130 198 134",
];

// Constellation for Space: nine stars and the line that binds them.
const STARS = [
  [12, 64], [52, 22], [96, 48], [146, 12], [188, 44],
  [232, 26], [268, 66], [214, 92], [120, 96],
] as const;

export function ElementSignature({ slug, color }: { slug: ElementSlug; color: string }) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  if (slug === "earth") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <svg viewBox="0 0 240 150" className="h-40 w-auto opacity-50 sm:h-52" fill="none">
          {ROOTS.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke={color}
              strokeWidth={i < 2 ? 2.2 : 1.4}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 + i * 0.18 }}
            />
          ))}
        </svg>
      </div>
    );
  }

  if (slug === "water") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* The water table rising through the frame. */}
        <motion.div
          className="absolute inset-x-0 bottom-0"
          style={{ height: "38%", background: `linear-gradient(180deg, transparent 0%, ${color}2e 30%, ${color}52 100%)`, transformOrigin: "bottom" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2.4, ease: EASE, delay: 0.3 }}
        />
        {/* The crest: a thin light line breathing at the waterline. */}
        <motion.div
          className="absolute inset-x-0"
          style={{ bottom: "38%", height: 1.5, backgroundColor: `${color}b0` }}
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: [0, 0.9, 0.6], scaleX: 1 }}
          transition={{ duration: 2.4, ease: EASE, delay: 0.5 }}
        />
      </div>
    );
  }

  if (slug === "fire") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Ignition bloom behind the text column. */}
        <motion.div
          className="absolute left-[8%] top-1/2 h-[70%] w-[46%] -translate-y-1/2 rounded-full"
          style={{ background: `radial-gradient(ellipse at center, ${color}40 0%, transparent 68%)`, filter: "blur(14px)" }}
          initial={{ opacity: 0, scale: 0.55 }}
          animate={{ opacity: [0, 1, 0.55], scale: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.3, times: [0, 0.5, 1] }}
        />
        {/* Three embers lifting off, then a soft endless flicker. */}
        {[26, 34, 30].map((left, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ left: `${left}%`, bottom: "18%", backgroundColor: color, boxShadow: `0 0 10px 2px ${color}80` }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.9, 0], y: -140 - i * 40 }}
            transition={{ duration: 2.4 + i * 0.7, ease: "easeOut", delay: 0.6 + i * 0.5, repeat: Infinity, repeatDelay: 2.5 }}
          />
        ))}
      </div>
    );
  }

  if (slug === "air") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Wind: three long strokes sweeping through the frame, then
            returning on a slow breath. */}
        {[22, 46, 68].map((top, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-[38%]"
            style={{ top: `${top}%`, background: `linear-gradient(90deg, transparent, ${color}90 40%, transparent)` }}
            initial={{ x: "-45%", opacity: 0 }}
            animate={{ x: "290%", opacity: [0, 0.9, 0] }}
            transition={{ duration: 3.4 + i * 0.5, ease: "easeInOut", delay: 0.3 + i * 0.55, repeat: Infinity, repeatDelay: 3.5 }}
          />
        ))}
      </div>
    );
  }

  // space — the constellation resolves.
  return (
    <div aria-hidden="true" className="pointer-events-none absolute right-[6%] top-[14%] hidden opacity-70 sm:block">
      <svg viewBox="0 0 280 110" className="w-64 lg:w-80" fill="none">
        <motion.polyline
          points={STARS.map(([x, y]) => `${x},${y}`).join(" ")}
          stroke={color}
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2.4, ease: EASE, delay: 0.8 }}
        />
        {STARS.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 2.4 : 1.5}
            fill="#F4EFE6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.75], scale: 1 }}
            transition={{ duration: 0.72, ease: EASE, delay: 0.35 + i * 0.14 }}
          />
        ))}
      </svg>
    </div>
  );
}
