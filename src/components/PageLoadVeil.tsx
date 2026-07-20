"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { elements } from "@/data/elements";

// A short arrival sequence over the very first paint, instead of a flat
// fade — and one that actually says something, since this is a brand
// built on a philosophy (Tatva: element) rather than just a wordmark.
// The five bars are the same skyline motif as LogoMark, rising in the
// same order as data/elements.ts (earth, water, fire, air, space), so one
// bar is always the "right" one to spotlight for whichever element gets
// picked below.
//
// Sequence: the bars rise → one of the five elements' own poetic line
// (data/elements.ts, already written for the Home page's Five Elements
// section — not new copy invented for this) appears alone, its matching
// bar brightening while the other four dim → the element's name resolves
// underneath it → both fade into the site's own wordmark and tagline →
// the whole thing opens like a curtain, reusing the same clip-path
// technique as ClipReveal elsewhere on the site.
//
// The element is chosen once per hard load with Math.random(), inside an
// effect rather than in the initial render, so server and first-client
// render agree (nothing text-bearing renders while stage is still
// "bars") and there's no hydration mismatch — it's just a different one
// of the five each time someone lands on the site.
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

type Stage = "bars" | "line" | "name" | "brand";

export function PageLoadVeil() {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("bars");
  const [visible, setVisible] = useState(!prefersReducedMotion);
  // A hard, animation-independent removal that always wins — see the
  // note in the exit transition below for why this can't just rely on
  // AnimatePresence's own onExitComplete.
  const [removed, setRemoved] = useState(prefersReducedMotion);
  const [elementIndex, setElementIndex] = useState(0);

  useEffect(() => {
    setElementIndex(Math.floor(Math.random() * elements.length));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timers = [
      setTimeout(() => setStage("line"), 650),
      setTimeout(() => setStage("name"), 1400),
      setTimeout(() => setStage("brand"), 2000),
      setTimeout(() => setVisible(false), 2550),
      setTimeout(() => setRemoved(true), 3300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion]);

  if (removed) return null;

  const element = elements[elementIndex];
  const philosophyVisible = stage === "line" || stage === "name";
  const nameVisible = stage === "name";
  const brandVisible = stage === "brand";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ clipPath: "inset(0% 0 0% 0)" }}
          exit={{ clipPath: "inset(0% 0 100% 0)" }}
          transition={{ duration: 0.75, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-100 flex flex-col items-center justify-center gap-8 overflow-hidden bg-soil"
          aria-hidden="true"
        >
          <div className="paper-grain" style={{ opacity: 0.08 }} />

          <div className="flex items-end" style={{ gap: BAR_GAP }}>
            {BARS.map((bar, i) => (
              <motion.div
                key={bar.color}
                initial={{ scaleY: 0 }}
                animate={{
                  scaleY: 1,
                  opacity: philosophyVisible ? (i === elementIndex ? 1 : 0.3) : 0.92,
                }}
                transition={{
                  scaleY: { duration: 0.55, delay: i * 0.08, ease: EASE },
                  opacity: { duration: 0.4, ease: EASE },
                }}
                style={{
                  width: BAR_WIDTH,
                  height: bar.height,
                  backgroundColor: bar.color,
                  borderRadius: 5,
                  transformOrigin: "bottom",
                }}
              />
            ))}
          </div>

          <div className="relative flex min-h-[7rem] w-full max-w-xs flex-col items-center justify-center px-6 text-center sm:max-w-sm">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: philosophyVisible ? 1 : 0, y: philosophyVisible ? 0 : 8 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="font-display text-lg italic leading-snug text-ivory/85 sm:text-xl"
              >
                &ldquo;{element.poetic}&rdquo;
              </motion.p>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: nameVisible ? 1 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.35em] text-ivory/70"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: element.color }}
                  aria-hidden="true"
                />
                {element.name}
              </motion.span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: brandVisible ? 1 : 0, y: brandVisible ? 0 : 10 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span className="font-body text-[0.65rem] font-bold uppercase tracking-[0.4em] text-ivory/70">
                {site.name}
              </span>
              <span className="mt-2 max-w-xs text-center text-xs text-ivory/40">
                {site.tagline}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
