"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// The 2026 loading page, rebuilt to Suman's attached cairn-at-sunrise
// board: the full scene IS the loading page — snow peaks at first
// light, fog seas in the valleys, the stacked stones with the scarf in
// the wind — and it has to read as ALIVE, per direct instruction
// ("the birds must be flying and it should be live, the mountains and
// wind blowing everything"). The still is the attached art itself;
// life comes from layered motion that costs nothing to start: the
// scene breathes (a slow drift-and-settle), two fog banks slide
// through the valleys, and a small flock of birds crosses the sky by
// the sun. SkyLife's shared bird layer is deliberately NOT reused
// here — its first spawn arrives 2.5 to 9 seconds after mount, which
// is after this veil has already left; the flock here is hand placed
// at the board's own positions and mid-flight from the first frame.
// Same discipline as every prior version: short total budget, Framer
// Motion only, mounted in the root layout so it plays once per hard
// load and never on client navigations, skipped entirely under
// reduced motion. The rAF elapsed-time counter drives the LOADING
// line so a throttled tab still lands on exactly 100.

const EASE = [0.22, 0.61, 0.36, 1] as const;
const COUNTER_DURATION_MS = 1700;

// The flock near the sun, matching the board's composition (upper
// right, loose formation). Fixed values, no randomness — this renders
// on the server too, and hydration must match.
const BIRDS = [
  { left: 84, top: 25, scale: 1, drift: -70, bob: 1.5 },
  { left: 88, top: 28, scale: 0.85, drift: -55, bob: 1.7 },
  { left: 91.5, top: 24.5, scale: 0.75, drift: -62, bob: 1.4 },
  { left: 94, top: 30, scale: 0.9, drift: -48, bob: 1.8 },
  { left: 89, top: 33.5, scale: 0.6, drift: -58, bob: 1.6 },
] as const;

export function PageLoadVeil() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(!prefersReducedMotion);
  // A hard, animation-independent removal that always wins — see the
  // note on the exit transition below.
  const [removed, setRemoved] = useState(prefersReducedMotion);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timers = [
      setTimeout(() => setVisible(false), 1950),
      setTimeout(() => setRemoved(true), 2700),
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
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-100 overflow-hidden"
          style={{ backgroundColor: "#1B1B1B" }}
          aria-hidden="true"
        >
          {/* The scene itself, breathing: a slow settle from a slight
              push-in plus a small lateral drift — the "wind" read at
              the scale of the whole frame. Runs longer than the veil
              lives so the motion never visibly stops. */}
          <motion.img
            src="/images/loading-cairn-sunrise.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.07, x: 0 }}
            animate={{ scale: 1.01, x: -8 }}
            transition={{ duration: 4.5, ease: "linear" }}
          />

          {/* Two fog banks sliding through the valley band — the same
              soft radial sheets the Services mist chapters use, sized
              and placed for this composition's fog seas. Pure
              transform motion, mid-flight from the first frame. */}
          <motion.div
            className="absolute left-[-20%] top-[48%] h-[34%] w-[85%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(226,226,220,0.22) 0%, rgba(226,226,220,0.07) 50%, transparent 74%)",
              filter: "blur(6px)",
            }}
            initial={{ x: -30 }}
            animate={{ x: 40 }}
            transition={{ duration: 6, ease: "linear" }}
          />
          <motion.div
            className="absolute right-[-24%] top-[56%] h-[30%] w-[80%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(214,218,214,0.18) 0%, rgba(214,218,214,0.05) 52%, transparent 76%)",
              filter: "blur(7px)",
            }}
            initial={{ x: 30 }}
            animate={{ x: -45 }}
            transition={{ duration: 6, ease: "linear" }}
          />

          {/* The flock by the sun — in the frame and already flying at
              first paint: each bird glides slowly left while its wings
              bob on their own rhythm. */}
          {BIRDS.map((b, i) => (
            <motion.span
              key={i}
              className="absolute"
              style={{ left: `${b.left}%`, top: `${b.top}%` }}
              initial={{ x: 0 }}
              animate={{ x: b.drift }}
              transition={{ duration: 5, ease: "linear" }}
            >
              <motion.span
                className="block"
                animate={{ y: [0, -3.5, 0] }}
                transition={{ duration: b.bob, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
              >
                <svg width={16 * b.scale} height={7 * b.scale} viewBox="0 0 18 8" fill="none" style={{ display: "block" }}>
                  <path
                    d="M1 5 Q 5 1 9 4.6 Q 13 1 17 5"
                    stroke="rgba(38,34,29,0.8)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.span>
            </motion.span>
          ))}

          {/* LOADING, exactly as the board sets it: the spaced label
              over a hairline track whose leading edge carries a warm
              glow, low in the frame, over the sunlit rock. */}
          <div className="absolute inset-x-0 bottom-[13%] flex flex-col items-center gap-4">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="font-body text-[0.68rem] font-medium uppercase tracking-[0.5em] text-ivory/90"
              style={{ textShadow: "0 1px 12px rgba(20,17,14,0.6)" }}
            >
              Loading
            </motion.span>
            <span className="relative block h-px w-[19rem] overflow-visible sm:w-[26rem]">
              <span className="absolute inset-0" style={{ backgroundColor: "rgba(242,240,232,0.35)" }} />
              <span
                className="absolute inset-y-0 left-0"
                style={{ width: `${progress}%`, backgroundColor: "rgba(242,240,232,0.9)", transition: "width 80ms linear" }}
              />
              <span
                className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full"
                style={{
                  left: `${progress}%`,
                  backgroundColor: "#F3E7CB",
                  boxShadow: "0 0 16px 5px rgba(235,217,180,0.9), 0 0 40px 12px rgba(198,169,122,0.5)",
                  transition: "left 80ms linear",
                }}
              />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
