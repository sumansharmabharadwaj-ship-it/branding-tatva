"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/Logo";
import { site } from "@/data/site";

// The 2026 loading page, rebuilt to Suman's attached design: a real
// mountain scene under a warm shaft of light, the interlocked BT
// monogram arriving first, the spaced serif wordmark beneath it, a
// thin gold divider, the brand line, and a LOADING beat at the foot —
// a hairline progress track with a glowing gold leading edge and a
// ticking percentage. Same discipline as every prior version: ~2s
// total budget, Framer Motion only, mounted in the root layout so it
// plays once per hard load and never on client navigations, and
// skipped entirely under reduced motion. The same rAF elapsed-time
// counter drives both the percentage and the line, so a throttled tab
// still lands on exactly 100.

const EASE = [0.22, 0.61, 0.36, 1] as const;
const COUNTER_DURATION_MS = 1450;

export function PageLoadVeil() {
  const prefersReducedMotion = useReducedMotion();
  const [brandVisible, setBrandVisible] = useState(false);
  const [visible, setVisible] = useState(!prefersReducedMotion);
  // A hard, animation-independent removal that always wins — see the
  // note on the exit transition below.
  const [removed, setRemoved] = useState(prefersReducedMotion);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timers = [
      setTimeout(() => setBrandVisible(true), 350),
      setTimeout(() => setVisible(false), 1600),
      setTimeout(() => setRemoved(true), 2300),
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
          className="pointer-events-none fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#1B1B1B" }}
          aria-hidden="true"
        >
          {/* The mountain scene — a real peak from the site's own
              photography, breathing very slightly, under a charcoal
              grade that keeps the mark the brightest thing on screen. */}
          <motion.img
            src="/images/own-jagged-peaks-wide.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.55 }}
            transition={{ duration: 1.8, ease: EASE }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(27,27,27,0.55) 0%, rgba(27,27,27,0.35) 45%, rgba(27,27,27,0.7) 100%)",
            }}
          />
          {/* The warm shaft of light from the board — one soft diagonal
              gradient, never a spotlight effect. */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(215deg, rgba(198,169,122,0.22) 0%, transparent 42%)",
            }}
          />
          <div className="paper-grain" style={{ opacity: 0.12 }} />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            className="relative flex flex-col items-center"
          >
            <LogoMark size={88} light />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: brandVisible ? 1 : 0, y: brandVisible ? 0 : 8 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mt-6 flex flex-col items-center"
            >
              <span className="font-display text-lg font-medium uppercase tracking-[0.38em] text-ivory sm:text-xl">
                {site.name}
              </span>
              {/* The gold divider with its centered node. */}
              <span className="mt-4 flex items-center gap-1.5" aria-hidden="true">
                <span className="h-px w-10" style={{ backgroundColor: "rgba(198,169,122,0.7)" }} />
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "#C6A97A" }} />
                <span className="h-px w-10" style={{ backgroundColor: "rgba(198,169,122,0.7)" }} />
              </span>
              <span className="mt-4 font-body text-[0.62rem] uppercase tracking-[0.32em] text-ivory/60">
                Revealing essence. Creating impact.
              </span>
            </motion.div>
          </motion.div>

          {/* The loading beat — label, hairline track with a glowing
              gold leading edge, percentage. */}
          <div className="absolute bottom-12 flex flex-col items-center gap-3 sm:bottom-16">
            <span className="font-body text-[0.6rem] uppercase tracking-[0.4em] text-ivory/55">Loading</span>
            <span className="relative block h-px w-56 overflow-visible sm:w-64" aria-hidden="true">
              <span className="absolute inset-0" style={{ backgroundColor: "rgba(242,240,232,0.18)" }} />
              <span
                className="absolute inset-y-0 left-0"
                style={{ width: `${progress}%`, backgroundColor: "#C6A97A", transition: "width 80ms linear" }}
              />
              <span
                className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${progress}%`,
                  backgroundColor: "#EBD9B4",
                  boxShadow: "0 0 12px 3px rgba(198,169,122,0.85)",
                  transition: "left 80ms linear",
                }}
              />
            </span>
            <span className="font-body text-[0.62rem] tabular-nums tracking-[0.3em] text-ivory/60">{progress} %</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
