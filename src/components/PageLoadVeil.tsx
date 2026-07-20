"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

// A short, confident arrival — not a spinner, but not a five-beat story
// either. An earlier version cycled through all five elements' own
// poetic lines one at a time (~5s total): reads as impressive in
// isolation, but on every single hard load it started to feel like the
// site was making someone sit through a pitch before letting them in.
// The mark itself already carries the five-element idea (five bars,
// five colors, the same skyline motif as LogoMark) — it doesn't need a
// guided tour of what each one means before the wordmark's allowed to
// land. One breath: the bars rise, the wordmark settles in right behind
// them, the curtain opens. Under two seconds, on a bold solid ground
// instead of a busy one.
//
// Lives in the root layout, which Next.js keeps mounted across
// client-side navigations, so this only plays once per hard load, never
// on internal link clicks. Skipped entirely for reduced-motion, since a
// sequence like this is itself exactly the kind of motion some users
// specifically want to avoid.

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
  const [brandVisible, setBrandVisible] = useState(false);
  const [visible, setVisible] = useState(!prefersReducedMotion);
  // A hard, animation-independent removal that always wins — see the
  // note in the exit transition below for why this can't just rely on
  // AnimatePresence's own onExitComplete.
  const [removed, setRemoved] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timers = [
      setTimeout(() => setBrandVisible(true), 500),
      setTimeout(() => setVisible(false), 1250),
      setTimeout(() => setRemoved(true), 2000),
    ];
    return () => timers.forEach(clearTimeout);
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

          <div className="flex items-end" style={{ gap: BAR_GAP }}>
            {BARS.map((bar, i) => (
              <motion.div
                key={bar.color}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.45, delay: i * 0.055, ease: EASE }}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
