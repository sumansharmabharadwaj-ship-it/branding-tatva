"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

// A short arrival sequence over the very first paint, instead of a flat
// fade. The five bars are the same skyline motif as LogoMark, just given
// the entrance that mark's own fixed-size favicon context never had room
// for: each one rises from the baseline in its element's color, the
// wordmark settles in below once they've landed, then the whole thing
// opens like a curtain to reveal the page underneath — reusing the same
// clip-path technique as ClipReveal elsewhere on the site, so the "one
// motion language" rule holds even here. Lives in the root layout, which
// Next.js keeps mounted across client-side navigations, so this only
// plays once per hard load, never on internal link clicks. Skipped
// entirely for reduced-motion, since a sequence like this is itself
// exactly the kind of motion some users specifically want to avoid.

const BARS = [
  { color: "#B85A34", height: 34 }, // earth — clay
  { color: "#24394D", height: 48 }, // water — indigo
  { color: "#C28A28", height: 64 }, // fire — ochre
  { color: "#5C6B4A", height: 48 }, // air — sage
  { color: "#AD6F5C", height: 34 }, // space — dusty rose (soil itself would vanish against this dark veil)
];
const BAR_WIDTH = 10;
const BAR_GAP = 6;
const EASE = [0.22, 0.61, 0.36, 1] as const;

export function PageLoadVeil() {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<"bars" | "word" | "hold" | "exit">("bars");
  const [visible, setVisible] = useState(!prefersReducedMotion);
  // A hard, animation-independent removal that always wins — see the
  // note in the exit transition below for why this can't just rely on
  // AnimatePresence's own onExitComplete.
  const [removed, setRemoved] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timers = [
      setTimeout(() => setStage("word"), 750),
      setTimeout(() => setStage("hold"), 1350),
      setTimeout(() => setStage("exit"), 1750),
      setTimeout(() => setVisible(false), 2500),
      setTimeout(() => setRemoved(true), 3100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion]);

  if (removed) return null;

  const barsUp = stage !== "bars";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ clipPath: "inset(0% 0 0% 0)" }}
          exit={{ clipPath: "inset(0% 0 100% 0)" }}
          transition={{ duration: 0.75, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 overflow-hidden bg-soil"
          aria-hidden="true"
        >
          <div className="paper-grain" style={{ opacity: 0.08 }} />

          <div className="flex items-end" style={{ gap: BAR_GAP }}>
            {BARS.map((bar, i) => (
              <motion.div
                key={bar.color}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: barsUp ? 1 : 0 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: EASE,
                }}
                style={{
                  width: BAR_WIDTH,
                  height: bar.height,
                  backgroundColor: bar.color,
                  borderRadius: 5,
                  transformOrigin: "bottom",
                  opacity: 0.92,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: stage === "word" || stage === "hold" || stage === "exit" ? 1 : 0,
              y: stage === "word" || stage === "hold" || stage === "exit" ? 0 : 10,
            }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col items-center"
          >
            <span className="font-body text-[0.65rem] font-bold uppercase tracking-[0.4em] text-ivory/70">
              {site.name}
            </span>
            <span className="mt-2 max-w-xs text-center text-xs text-ivory/40">
              {site.tagline}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
