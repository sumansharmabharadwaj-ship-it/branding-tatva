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
const COUNTER_DURATION_MS = 2400;

// The flock near the sun, matching the board's composition (upper
// right, loose formation). Fixed values, no randomness — this renders
// on the server too, and hydration must match. First version drifted
// each bird a few dozen pixels with a gentle bob — direct feedback
// that the page read as static. The flock now genuinely flies: each
// bird crosses a real stretch of sky during the veil's life, wings
// visibly beating (a scaleY flap at distant-bird cadence), with a
// slight descent so the paths feel individual rather than mechanical.
const BIRDS = [
  { left: 86, top: 25, scale: 1.35, fly: -300, fall: 14, flap: 0.42 },
  { left: 90, top: 28, scale: 1.1, fly: -250, fall: 8, flap: 0.36 },
  { left: 93, top: 24, scale: 0.95, fly: -270, fall: 18, flap: 0.46 },
  { left: 96, top: 30, scale: 1.2, fly: -230, fall: 6, flap: 0.4 },
  { left: 91, top: 33.5, scale: 0.8, fly: -260, fall: 12, flap: 0.34 },
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
      setTimeout(() => setVisible(false), 2750),
      setTimeout(() => setRemoved(true), 3500),
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
            initial={{ scale: 1.12, x: 0 }}
            animate={{ scale: 1.02, x: -16 }}
            transition={{ duration: 4, ease: "linear" }}
          />

          {/* Two fog banks sliding through the valley band — the same
              soft radial sheets the Services mist chapters use, sized
              and placed for this composition's fog seas. Pure
              transform motion, mid-flight from the first frame. */}
          <motion.div
            className="absolute left-[-20%] top-[46%] h-[36%] w-[85%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(228,228,222,0.34) 0%, rgba(228,228,222,0.1) 50%, transparent 74%)",
              filter: "blur(6px)",
            }}
            initial={{ x: -70 }}
            animate={{ x: 90 }}
            transition={{ duration: 4.5, ease: "linear" }}
          />
          <motion.div
            className="absolute right-[-24%] top-[55%] h-[32%] w-[80%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(216,220,216,0.28) 0%, rgba(216,220,216,0.08) 52%, transparent 76%)",
              filter: "blur(7px)",
            }}
            initial={{ x: 70 }}
            animate={{ x: -100 }}
            transition={{ duration: 4.5, ease: "linear" }}
          />
          {/* A low, near sheet crossing the whole frame — the wind made
              visible at the foreground plane. */}
          <motion.div
            className="absolute bottom-[4%] left-[-30%] h-[22%] w-[120%]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(222,226,220,0.2) 30%, rgba(222,226,220,0.08) 65%, transparent 100%)",
              filter: "blur(9px)",
            }}
            initial={{ x: -60 }}
            animate={{ x: 130 }}
            transition={{ duration: 4, ease: "linear" }}
          />

          {/* The flock by the sun — in the frame and already flying at
              first paint: each bird glides slowly left while its wings
              bob on their own rhythm. */}
          {BIRDS.map((b, i) => (
            <motion.span
              key={i}
              className="absolute"
              style={{ left: `${b.left}%`, top: `${b.top}%` }}
              initial={{ x: 0, y: 0 }}
              animate={{ x: b.fly, y: b.fall }}
              transition={{ duration: 4, ease: "linear" }}
            >
              {/* Wing beat: the whole glyph compresses and opens on a
                  distant-bird cadence — unmistakable flight, still just
                  a silhouette. */}
              <motion.span
                className="block"
                style={{ transformOrigin: "50% 60%" }}
                animate={{ scaleY: [1, 0.25, 1], y: [0, -2.5, 0] }}
                transition={{ duration: b.flap, repeat: Infinity, ease: "easeInOut", delay: i * 0.13 }}
              >
                <svg width={18 * b.scale} height={8 * b.scale} viewBox="0 0 18 8" fill="none" style={{ display: "block" }}>
                  <path
                    d="M1 5 Q 5 1 9 4.6 Q 13 1 17 5"
                    stroke="rgba(38,34,29,0.85)"
                    strokeWidth="1.5"
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
