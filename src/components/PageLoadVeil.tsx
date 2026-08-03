"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/Logo";
import { site } from "@/data/site";

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
// on the server too, and hydration must match. Two earlier versions
// taught the register: a subtle drift read as static, and a hard
// scaleY squash-flap read as mechanical. Natural distant flight needs
// three things this version carries: the wing SILHOUETTE morphs
// between real up and down strokes (path interpolation, never a
// squash), each bird rides a slightly curved glide with easing rather
// than a straight constant-speed line, and every bird carries its own
// cadence and phase so the flock never beats in unison.
const WING_UP = "M1 5.5 Q 5 1.5 9 5 Q 13 1.5 17 5.5";
const WING_DOWN = "M1 3.5 Q 5 7 9 4.5 Q 13 7 17 3.5";
const BIRDS = [
  { left: 86, top: 25, scale: 1.35, fly: -240, fall: 16, flap: 0.72 },
  { left: 90, top: 28, scale: 1.1, fly: -200, fall: 9, flap: 0.62 },
  { left: 93, top: 24, scale: 0.95, fly: -220, fall: 20, flap: 0.8 },
  { left: 96, top: 30, scale: 1.2, fly: -185, fall: 7, flap: 0.68 },
  { left: 91, top: 33.5, scale: 0.8, fly: -210, fall: 13, flap: 0.58 },
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
          transition={{ duration: 0.72, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-100 overflow-hidden"
          style={{ backgroundColor: "#1B1B1B" }}
          aria-hidden="true"
        >
          {/* The scarf's wind: an SVG turbulence field displacing a
              second, masked copy of the scene over the fabric region —
              the cloth genuinely ripples instead of sitting frozen in
              the still. SMIL drives the turbulence so it needs no JS
              per frame; the soft radial mask feathers the displaced
              region into the untouched base so no seam shows. */}
          <svg width="0" height="0" aria-hidden="true" className="absolute">
            <filter id="veil-wind" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.006 0.018" numOctaves="2" seed="7" result="noise">
                {/* Slower, shallower sway — cloth in a breeze, never
                    jelly. */}
                <animate
                  attributeName="baseFrequency"
                  dur="3.8s"
                  values="0.006 0.018;0.009 0.026;0.006 0.018"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="13" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>

          {/* The scene itself, breathing: a slow settle from a slight
              push-in plus a small lateral drift — the "wind" read at
              the scale of the whole frame. Base image and the displaced
              scarf copy live inside ONE animated wrapper so they stay
              pixel aligned through the drift. */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.09, x: 0 }}
            animate={{ scale: 1.015, x: -12 }}
            transition={{ duration: 4.5, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/loading-cairn-sunrise.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/loading-cairn-sunrise.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                filter: "url(#veil-wind)",
                maskImage: "radial-gradient(ellipse 26% 22% at 59% 68%, rgba(0,0,0,1) 45%, transparent 78%)",
                WebkitMaskImage: "radial-gradient(ellipse 26% 22% at 59% 68%, rgba(0,0,0,1) 45%, transparent 78%)",
              }}
            />
          </motion.div>

          {/* Two fog banks sliding through the valley band — the same
              soft radial sheets the Services mist chapters use, sized
              and placed for this composition's fog seas. Pure
              transform motion, mid-flight from the first frame. */}
          {/* Fog as wide, low sheets rather than round blobs — feathered
              horizontal gradients, gentle eased travel with a slight
              rise, so the banks breathe through the valleys instead of
              sliding past like smudges. */}
          <motion.div
            className="absolute left-[-25%] top-[50%] h-[24%] w-[100%]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(228,228,222,0.2) 25%, rgba(228,228,222,0.09) 60%, transparent 100%)",
              filter: "blur(10px)",
            }}
            initial={{ x: -45, y: 4 }}
            animate={{ x: 60, y: -4 }}
            transition={{ duration: 5.5, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-28%] top-[58%] h-[22%] w-[95%]"
            style={{
              background:
                "linear-gradient(270deg, transparent 0%, rgba(218,222,218,0.17) 28%, rgba(218,222,218,0.07) 62%, transparent 100%)",
              filter: "blur(11px)",
            }}
            initial={{ x: 50, y: -3 }}
            animate={{ x: -70, y: 5 }}
            transition={{ duration: 5.5, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[4%] left-[-30%] h-[20%] w-[120%]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(222,226,220,0.13) 30%, rgba(222,226,220,0.05) 65%, transparent 100%)",
              filter: "blur(12px)",
            }}
            initial={{ x: -50 }}
            animate={{ x: 90 }}
            transition={{ duration: 5, ease: "easeInOut" }}
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
              animate={{ x: b.fly, y: [0, b.fall * 0.35, b.fall] }}
              transition={{
                x: { duration: 5, ease: [0.3, 0.55, 0.6, 1] },
                y: { duration: 5, ease: "easeInOut", times: [0, 0.55, 1] },
              }}
            >
              <svg width={18 * b.scale} height={9 * b.scale} viewBox="0 0 18 9" fill="none" style={{ display: "block" }}>
                {/* The wing stroke itself morphs between up and down
                    beats — a real silhouette change, the way distant
                    birds actually read. */}
                <motion.path
                  d={WING_UP}
                  animate={{ d: [WING_UP, WING_DOWN, WING_UP] }}
                  transition={{ duration: b.flap, repeat: Infinity, ease: "easeInOut", delay: i * 0.19 }}
                  stroke="rgba(38,34,29,0.8)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </motion.span>
          ))}

          {/* The brand itself, over the open sky — direct feedback that
              the scene alone read as a page without content. Monogram,
              wordmark, gold divider, and the brand line arrive as one
              quiet block in the sky's negative space, leaving the
              cairn and the LOADING beat exactly where the board put
              them. */}
          <motion.div
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
            className="absolute inset-x-0 top-[13%] flex flex-col items-center text-center"
          >
            <LogoMark size={64} light />
            <span
              className="mt-4 font-display text-xl font-medium uppercase tracking-[0.4em] text-ivory sm:text-2xl"
              style={{ textShadow: "0 1px 14px rgba(20,17,14,0.55)" }}
            >
              {site.name}
            </span>
            <span aria-hidden="true" className="mt-4 flex items-center gap-1.5">
              <span className="h-px w-10" style={{ backgroundColor: "rgba(198,169,122,0.75)" }} />
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "#C6A97A" }} />
              <span className="h-px w-10" style={{ backgroundColor: "rgba(198,169,122,0.75)" }} />
            </span>
            <span
              className="mt-3 font-body text-[0.62rem] uppercase tracking-[0.32em] text-ivory/80"
              style={{ textShadow: "0 1px 10px rgba(20,17,14,0.5)" }}
            >
              {site.tagline}
            </span>
          </motion.div>

          {/* LOADING, exactly as the board sets it: the spaced label
              over a hairline track whose leading edge carries a warm
              glow, low in the frame, over the sunlit rock. */}
          <div className="absolute inset-x-0 bottom-[13%] flex flex-col items-center gap-4">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.72, ease: EASE, delay: 0.2 }}
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
