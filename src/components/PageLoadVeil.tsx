"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { elements } from "@/data/elements";

// A short arrival sequence over the very first paint — the opening shot
// of the site, not a spinner. Built as three overlapping ideas:
//
// 1. Atmosphere first, mark second. A cool slate fog (.veil-fog —
//    deliberately the one cooler-toned moment on an otherwise warm site,
//    see the palette note below) drifts behind everything, and the five
//    bars rise out of a blur rather than snapping in at full focus, so
//    the opening beat feels like something resolving out of mist rather
//    than a UI element appearing.
// 2. It shows all five, not one. This is a brand built on Tatva —
//    element — as its organizing idea, and the loading screen is the
//    one moment every visitor sees before anything else, so it walks
//    through all five in the same order as data/elements.ts: each
//    element's own bar brightens while the other four dim, its poetic
//    line and name land together, holds a beat, then the next element
//    takes over. Once all five have had their moment, they resolve
//    together into the site's own wordmark — a beam of light sweeping
//    across it once, the way a title card catches light in an opening
//    sequence.
// 3. It leaves the same way every other section on the site enters —
//    ClipReveal's curtain-wipe clip-path, so the transition into the
//    Hero underneath uses the site's one motion language instead of a
//    bespoke exit found nowhere else.
//
// Palette note: every other dark, cinematic moment on the site (Footer,
// TexturedDark, the Hero's own scrim) sits on the same warm soil brown.
// This is the one place that's deliberately cooler — charcoal/slate
// instead — so the site's very first frame doesn't repeat the same tone
// everything after it will also use.
//
// Total run time (~4.6s) is longer than a typical loading spinner would
// justify — that's deliberate here specifically because this sequence
// is the one place the site's whole five-element premise gets stated
// directly, once, before a single card or heading has to imply it.

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

const BARS_RISE_MS = 700;
const PER_ELEMENT_MS = 560;
const CYCLE_MS = BARS_RISE_MS + elements.length * PER_ELEMENT_MS; // when the last element's beat ends
const BRAND_MS = CYCLE_MS + 150;
const SWEEP_MS = BRAND_MS + 150;
const HIDE_MS = SWEEP_MS + 550;
const REMOVE_MS = HIDE_MS + 750;

type Stage = "cycle" | "brand" | "sweep";

export function PageLoadVeil() {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("cycle");
  const [cycleIndex, setCycleIndex] = useState(-1); // -1: bars still rising, nothing lit yet
  const [visible, setVisible] = useState(!prefersReducedMotion);
  // A hard, animation-independent removal that always wins — see the
  // note in the exit transition below for why this can't just rely on
  // AnimatePresence's own onExitComplete.
  const [removed, setRemoved] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    elements.forEach((_, i) => {
      timers.push(setTimeout(() => setCycleIndex(i), BARS_RISE_MS + i * PER_ELEMENT_MS));
    });
    timers.push(
      setTimeout(() => setStage("brand"), BRAND_MS),
      setTimeout(() => setStage("sweep"), SWEEP_MS),
      setTimeout(() => setVisible(false), HIDE_MS),
      setTimeout(() => setRemoved(true), REMOVE_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion]);

  if (removed) return null;

  const activeElement = cycleIndex >= 0 ? elements[cycleIndex] : null;
  const cycling = stage === "cycle" && activeElement !== null;
  const brandVisible = stage === "brand" || stage === "sweep";
  // A rough 0-1 sense of "how far in" for the progress rail, independent
  // of exactly which stage we're in — the bars rising counts as the
  // first fifth, each element after that fills another fraction, brand
  // is full.
  const progress =
    stage !== "cycle" ? 1 : ((cycleIndex + 1) / elements.length) * (elements.length / (elements.length + 1));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ clipPath: "inset(0% 0 0% 0)" }}
          exit={{ clipPath: "inset(0% 0 100% 0)" }}
          transition={{ duration: 0.75, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-100 flex flex-col items-center justify-center gap-8 overflow-hidden"
          style={{
            background: "radial-gradient(circle at 50% 42%, #26292E 0%, #16140F 75%)",
          }}
          aria-hidden="true"
        >
          <div className="veil-fog" />
          <div className="paper-grain" style={{ opacity: 0.14 }} />

          <div className="flex items-end" style={{ gap: BAR_GAP }}>
            {BARS.map((bar, i) => (
              <motion.div
                key={bar.color}
                initial={{ scaleY: 0, filter: "blur(5px)" }}
                animate={{
                  scaleY: 1,
                  filter: "blur(0px)",
                  opacity: cycling ? (i === cycleIndex ? 1 : 0.3) : 0.92,
                }}
                transition={{
                  scaleY: { duration: 0.6, delay: i * 0.08, ease: EASE },
                  filter: { duration: 0.6, delay: i * 0.08, ease: EASE },
                  opacity: { duration: 0.35, ease: EASE },
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

          <div className="relative flex min-h-[7rem] w-full max-w-xs flex-col items-center justify-center overflow-hidden px-6 text-center sm:max-w-sm">
            {/* All five elements' lines stay mounted the whole time,
                stacked in the same slot and cross-faded by opacity —
                the same always-mounted pattern used everywhere else on
                the site for a hover/state swap, rather than an
                AnimatePresence key-swap that depends on its exit
                animation actually finishing before the next one mounts. */}
            {elements.map((el, i) => (
              <motion.div
                key={el.slug}
                animate={{ opacity: cycling && cycleIndex === i ? 1 : 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <p className="font-display text-lg italic leading-snug text-ivory/85 sm:text-xl">
                  &ldquo;{el.poetic}&rdquo;
                </p>
                <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.35em] text-ivory/70">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: el.color }}
                    aria-hidden="true"
                  />
                  {el.name}
                </span>
              </motion.div>
            ))}

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

            {/* A single beam catching the wordmark once it lands, the
                way a title card catches light in an opening sequence —
                not a repeating shimmer, just one pass. */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-1/4"
              style={{
                background:
                  "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
              }}
              initial={{ x: "-140%" }}
              animate={{ x: stage === "sweep" ? "340%" : "-140%" }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />
          </div>

          {/* Progress reads through the same five-element bars rather
              than a separate bar bolted on underneath — each element's
              turn fills the rail a little further, so "how far along
              is this" and "what is this actually about" are the same
              visual instead of two competing ones. */}
          <div
            className="absolute bottom-10 h-px bg-ivory/15 sm:bottom-12"
            style={{ width: BAR_WIDTH * BARS.length + BAR_GAP * (BARS.length - 1) }}
          >
            <motion.div
              className="h-full bg-ivory/60"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
