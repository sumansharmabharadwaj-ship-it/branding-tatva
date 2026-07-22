"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

// A short, confident arrival — not a spinner, but not a five-beat story
// either. An earlier version cycled through all five elements' own
// poetic lines one at a time (~5s total): reads as impressive in
// isolation, but on every single hard load it started to feel like the
// site was making someone sit through a pitch before letting them in.
// A second version cut that down to five flat bars just rising in a
// row — safe, but the philosophy it's meant to carry was reduced to a
// generic loading-bar shape with the right colors, nothing more.
//
// This version keeps the same ~2s budget and the same restraint (no
// per-element copy, no guided tour), but gives each element an actual
// beat: as its own bar settles, its own color blooms behind it in a
// soft glow — five separate, brief announcements instead of one flat
// motion — and once all five have landed, a thin stroke draws itself
// around the whole mark, the visual argument for "five parts, one
// brand" instead of just stating it. Everything here is Framer Motion
// animating plain SVG shapes (rect height/y, and rect pathLength for
// the frame stroke) — no new dependency. This project already had one
// real incident where a GSAP-hydration-dependent load animation caused
// an 8+ second render delay; a page-blocking, every-single-visit
// animation is the wrong place to introduce a new toolkit's risk, so
// the craft comes from choreography, not new machinery.
//
// Lives in the root layout, which Next.js keeps mounted across
// client-side navigations, so this only plays once per hard load, never
// on internal link clicks. Skipped entirely for reduced-motion, since a
// sequence like this is itself exactly the kind of motion some users
// specifically want to avoid.

const BARS = [
  { color: "#B85A34", x: 4, height: 34 }, // earth — clay
  { color: "#24394D", x: 20, height: 48 }, // water — indigo
  { color: "#C28A28", x: 36, height: 64 }, // fire — ochre
  { color: "#5C6B4A", x: 52, height: 48 }, // air — sage
  { color: "#AD6F5C", x: 68, height: 34 }, // space — dusty rose (soil itself would vanish against this dark veil)
];
const BAR_WIDTH = 10;
const MARK_WIDTH = 82;
const MARK_HEIGHT = 68;
const BASELINE = 64;
const EASE = [0.22, 0.61, 0.36, 1] as const;

// How long the counter takes to reach 100 — the same window the rest of
// the veil's own choreography (bars, frame, brand line) plays out over,
// so "100" lands right as everything else has already settled rather
// than racing ahead of or trailing behind it.
const COUNTER_DURATION_MS = 1450;

export function PageLoadVeil() {
  const prefersReducedMotion = useReducedMotion();
  const [barsSettled, setBarsSettled] = useState(false);
  const [frameDrawn, setFrameDrawn] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);
  const [visible, setVisible] = useState(!prefersReducedMotion);
  // A hard, animation-independent removal that always wins — see the
  // note in the exit transition below for why this can't just rely on
  // AnimatePresence's own onExitComplete.
  const [removed, setRemoved] = useState(prefersReducedMotion);
  // The small numeric counter next to the brand line — voyeurverite.com
  // and trionn.com both pair their own loading screens with a ticking
  // percentage; this is that same beat, synced to COUNTER_DURATION_MS
  // instead of running as its own independent timer. Driven by rAF
  // (elapsed-time-based, not tick-count-based) so a throttled/backgrounded
  // tab still lands on exactly 100 rather than stalling partway — the
  // same lesson AnimatedStat.tsx already learned the hard way for its
  // own count-up.
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timers = [
      setTimeout(() => setBarsSettled(true), 700),
      setTimeout(() => setFrameDrawn(true), 750),
      setTimeout(() => setBrandVisible(true), 900),
      setTimeout(() => setVisible(false), 1450),
      setTimeout(() => setRemoved(true), 2100),
    ];

    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / COUNTER_DURATION_MS) * 100));
      setProgress(pct);
      if (pct < 100) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  if (removed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ clipPath: "inset(0% 0 0% 0)" }}
          exit={{ clipPath: "inset(0% 0 100% 0)" }}
          transition={{ duration: 0.65, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 overflow-hidden bg-soil"
          aria-hidden="true"
        >
          <div className="paper-grain" style={{ opacity: 0.1 }} />

          <div className="relative" style={{ width: MARK_WIDTH, height: MARK_HEIGHT + 4 }}>
            {BARS.map((bar, i) => (
              <motion.div
                key={`glow-${bar.color}`}
                className="absolute rounded-full"
                style={{
                  left: bar.x - 12,
                  bottom: 0,
                  width: BAR_WIDTH + 24,
                  height: BAR_WIDTH + 24,
                  backgroundColor: bar.color,
                  filter: "blur(11px)",
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={barsSettled ? { opacity: [0, 0.55, 0], scale: [0.6, 1.5, 1.5] } : undefined}
                transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
              />
            ))}
            <svg
              width={MARK_WIDTH}
              height={MARK_HEIGHT + 4}
              viewBox={`0 0 ${MARK_WIDTH} ${MARK_HEIGHT + 4}`}
              fill="none"
              className="relative"
            >
              {BARS.map((bar, i) => (
                <motion.rect
                  key={bar.color}
                  x={bar.x}
                  width={BAR_WIDTH}
                  rx={5}
                  fill={bar.color}
                  opacity={0.92}
                  initial={{ height: 0, y: BASELINE }}
                  animate={{ height: bar.height, y: BASELINE - bar.height }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
                />
              ))}
              {/* The unifying stroke: five separate bars settle first,
                  each announcing its own element; only once all five have
                  landed does this frame draw itself around them, the
                  visual argument for "one brand" instead of just five
                  colors sitting next to each other. */}
              <motion.rect
                x={1}
                y={1}
                width={MARK_WIDTH - 2}
                height={MARK_HEIGHT + 2}
                rx={10}
                stroke="#F4EFE6"
                strokeOpacity={0.32}
                strokeWidth={1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: frameDrawn ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: brandVisible ? 1 : 0, y: brandVisible ? 0 : 8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center"
          >
            <span className="font-body text-[0.65rem] font-bold uppercase tracking-[0.4em] text-ivory/70">
              {site.name}
            </span>
            <span className="mt-2 max-w-xs text-center text-xs text-ivory/40">
              {site.tagline}
            </span>
          </motion.div>

          {/* The numeric counter voyeurverite.com and trionn.com both
              pair with their own loading screens — placed in a corner
              rather than beside the mark so it reads as a separate,
              secondary beat instead of competing with the brand line
              for attention. */}
          <div className="pointer-events-none absolute bottom-6 left-6 flex items-baseline gap-2 font-body text-[0.65rem] tracking-[0.3em] text-ivory/40 sm:bottom-8 sm:left-8">
            <span>LOADING</span>
            <span className="tabular-nums text-ivory/70">{progress}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
