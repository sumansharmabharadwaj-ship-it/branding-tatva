"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { ELEMENT_HEX } from "@/lib/sectionWash";
import { MobileStakesDeck } from "@/sections/Services/MobileStakesDeck";

// A qualitative comparison grounded in the same mental availability,
// distinctive asset, and category-memory vocabulary used throughout
// the site. No invented statistics and no fabricated client story.
const WEAK = [
  "Competes mainly on price, since nothing else distinguishes it.",
  "Gets reintroduced to the market every time it advertises.",
  "Marketing spend replaces recognition instead of building on it.",
  "Blends into whichever category it happens to sit in.",
] as const;

const STRONG = [
  "Commands a price built on more than the lowest bid.",
  "Gets recognized before it gets explained.",
  "Marketing spend compounds instead of starting over each time.",
  "Owns a specific position inside its category, rather than one more listing in it.",
] as const;

// These four observations previously occupied a separate chapter. They
// remain here as the causal trail into the comparison, without another
// full-viewport shell repeating the same lesson.
const STARTS_HERE = [
  "Identity commissioned before positioning",
  "Constant reinvention",
  "Marketing asked to fix positioning",
  "Skipping the audit",
] as const;

const SCENE_PROGRESS_EVENT = "bt:services-scene-progress";
const MANUAL_HOLD_MS = 12000;

type FocusMode = "generic" | "distinct";
type ServicesProgressDetail = {
  id?: string;
  progress?: number;
};

export function WeakBrandingCost() {
  // Desktop keeps the material focus-pull metaphor, but the entire scene now
  // advances semantically as well: the cause index changes, the market
  // consequence changes, and focus transfers from generic to distinct.
  // Mobile retains its compact stateful deck instead of inheriting a pin.
  const focusRef = useRef<HTMLDivElement>(null);
  const manualUntilRef = useRef(0);
  const prefersReducedMotion = useHydratedReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusMode, setFocusMode] = useState<FocusMode>("generic");
  const { scrollYProgress } = useScroll({ target: focusRef, offset: ["start 0.95", "start 0.35"] });
  const blurPx = useTransform(scrollYProgress, [0, 1], [7, 1.5]);
  const filter = useTransform(blurPx, (blur) => `blur(${Math.round(blur)}px) saturate(0.85)`);

  useEffect(() => {
    if (prefersReducedMotion) return;

    function onSceneProgress(event: Event) {
      const detail = (event as CustomEvent<ServicesProgressDetail>).detail;
      if (detail?.id !== "stakes" || typeof detail.progress !== "number") return;
      if (Date.now() < manualUntilRef.current) return;

      const nextIndex = Math.min(
        STARTS_HERE.length - 1,
        Math.max(0, Math.floor(detail.progress * STARTS_HERE.length)),
      );
      const nextMode: FocusMode = detail.progress < 0.52 ? "generic" : "distinct";
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
      setFocusMode((current) => (current === nextMode ? current : nextMode));
    }

    window.addEventListener(SCENE_PROGRESS_EVENT, onSceneProgress as EventListener);
    return () => {
      window.removeEventListener(SCENE_PROGRESS_EVENT, onSceneProgress as EventListener);
    };
  }, [prefersReducedMotion]);

  function chooseFocus(mode: FocusMode) {
    manualUntilRef.current = Date.now() + MANUAL_HOLD_MS;
    setFocusMode(mode);
  }

  const activeCause = STARTS_HERE[activeIndex] ?? STARTS_HERE[0];
  const activeConsequence =
    focusMode === "generic"
      ? (WEAK[activeIndex] ?? WEAK[0])
      : (STRONG[activeIndex] ?? STRONG[0]);

  return (
    <Container className="max-w-5xl">
      <div
        data-stakes-scroll-story="true"
        data-stakes-focus={focusMode}
        data-stakes-step={activeIndex}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:items-end lg:gap-16">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">The stakes</p>
            <h2 className="mt-2 text-display-sm font-display font-normal text-ivory sm:text-display-md">
              What weak branding actually costs.
            </h2>
            <p className="mt-4 max-w-xl text-base text-ivory/90">
              The same budget buys two very different futures. Positioning decides which one a brand is paying for.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="hidden lg:block">
            <div data-stakes-desktop-origins="true">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/70">
                Where the weak column begins
              </p>
              <ol className="mt-3">
                {STARTS_HERE.map((item, index) => {
                  const active = index === activeIndex;
                  return (
                    <motion.li
                      key={item}
                      data-stakes-cause-active={active ? "true" : "false"}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: 14, filter: "blur(3px)" }}
                      animate={{
                        opacity: prefersReducedMotion || active ? 1 : 0.45,
                        x: active && !prefersReducedMotion ? 5 : 0,
                        filter: "blur(0px)",
                      }}
                      whileInView={prefersReducedMotion ? undefined : { opacity: active ? 1 : 0.45, x: active ? 5 : 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.42,
                        delay: prefersReducedMotion ? 0 : index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-baseline gap-3 border-b border-ivory/15 py-2.5"
                    >
                      <span className={`font-display text-sm ${active ? "text-sandstone" : "text-ivory/55"}`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={`text-sm ${active ? "text-ivory" : "text-ivory/65"}`}>{item}</span>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </Reveal>
        </div>

        <div className="mt-8 hidden overflow-hidden rounded-2xl border border-ivory/14 bg-[rgba(16,20,22,0.56)] p-5 backdrop-blur-md lg:block sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ivory/10 pb-4">
            <div>
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.17em] text-ivory/48">
                Cause {String(activeIndex + 1).padStart(2, "0")} / {String(STARTS_HERE.length).padStart(2, "0")}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={activeCause}
                  className="mt-1 font-display text-xl font-normal text-ivory sm:text-2xl"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -5 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeCause}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-full border border-ivory/12 bg-black/10 p-1" role="group" aria-label="Compare generic and distinct positioning">
              <button
                type="button"
                aria-pressed={focusMode === "generic"}
                onClick={() => chooseFocus("generic")}
                className={`min-h-10 rounded-full px-4 text-[0.6rem] font-medium uppercase tracking-[0.13em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone ${
                  focusMode === "generic" ? "bg-[#B85A34]/18 text-ivory" : "text-ivory/48 hover:text-ivory"
                }`}
              >
                Generic
              </button>
              <button
                type="button"
                aria-pressed={focusMode === "distinct"}
                onClick={() => chooseFocus("distinct")}
                className={`min-h-10 rounded-full px-4 text-[0.6rem] font-medium uppercase tracking-[0.13em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#52756F] ${
                  focusMode === "distinct" ? "bg-[#52756F]/22 text-ivory" : "text-ivory/48 hover:text-ivory"
                }`}
              >
                Distinct
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${focusMode}-${activeIndex}`}
              className="grid gap-3 pt-4 sm:grid-cols-[auto_1fr] sm:items-start"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="mt-1 h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: focusMode === "generic" ? ELEMENT_HEX.earth : ELEMENT_HEX.water,
                  boxShadow: `0 0 14px ${focusMode === "generic" ? ELEMENT_HEX.earth : ELEMENT_HEX.water}88`,
                }}
                aria-hidden="true"
              />
              <div>
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.15em] text-ivory/45">
                  {focusMode === "generic" ? "What the market receives" : "What changes when the position holds"}
                </p>
                <p className="mt-1 max-w-3xl text-base leading-relaxed text-ivory/90">{activeConsequence}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 grid grid-cols-4 gap-2" aria-hidden="true">
            {STARTS_HERE.map((item, index) => (
              <span key={item} className="h-px overflow-hidden bg-ivory/10">
                <motion.span
                  className="block h-full origin-left"
                  style={{ backgroundColor: focusMode === "generic" ? ELEMENT_HEX.earth : ELEMENT_HEX.water }}
                  animate={{ scaleX: index <= activeIndex ? 1 : 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            ))}
          </div>
        </div>

        <MobileStakesDeck origins={STARTS_HERE} generic={WEAK} distinct={STRONG} />

        <div
          data-stakes-desktop-comparison="true"
          className="mt-8 hidden gap-6 lg:grid lg:grid-cols-2"
        >
          <Reveal delay={0.06}>
            <motion.div
              data-stakes-desktop-card="generic"
              data-stakes-card-active={focusMode === "generic" ? "true" : "false"}
              className="h-full"
              animate={{
                opacity: prefersReducedMotion || focusMode === "generic" ? 1 : 0.48,
                scale: prefersReducedMotion || focusMode === "generic" ? 1 : 0.965,
                y: prefersReducedMotion || focusMode === "generic" ? 0 : 10,
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard glowColor={ELEMENT_HEX.earth} className="group h-full">
                <motion.div
                  ref={focusRef}
                  className="h-full rounded-2xl border-t-2 p-6 backdrop-blur-md transition-[filter] duration-500 group-hover:!filter-none sm:p-7"
                  style={{
                    borderColor: ELEMENT_HEX.earth,
                    backgroundColor: "rgba(24,25,26,0.6)",
                    filter: prefersReducedMotion ? "none" : filter,
                  }}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/70">
                    Positioned generically
                  </p>
                  <ul data-stakes-list="generic" className="mt-5 space-y-3.5">
                    {WEAK.map((item, index) => (
                      <motion.li
                        key={item}
                        initial={prefersReducedMotion ? false : { opacity: 0, filter: "blur(4px)" }}
                        animate={{
                          opacity: prefersReducedMotion || index === activeIndex ? 1 : 0.55,
                          filter: "blur(0px)",
                        }}
                        whileInView={prefersReducedMotion ? undefined : { opacity: index === activeIndex ? 1 : 0.55, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: index * 0.04 }}
                        className="text-[0.95rem] leading-relaxed text-ivory/90"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </TiltCard>
            </motion.div>
          </Reveal>

          <Reveal delay={0.14}>
            <motion.div
              data-stakes-desktop-card="distinct"
              data-stakes-card-active={focusMode === "distinct" ? "true" : "false"}
              className="h-full"
              animate={{
                opacity: prefersReducedMotion || focusMode === "distinct" ? 1 : 0.48,
                scale: prefersReducedMotion || focusMode === "distinct" ? 1 : 0.965,
                y: prefersReducedMotion || focusMode === "distinct" ? 0 : 10,
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard glowColor={ELEMENT_HEX.water} className="h-full">
                <div
                  className="h-full rounded-2xl border-t-2 p-6 backdrop-blur-md sm:p-7"
                  style={{ borderColor: ELEMENT_HEX.water, backgroundColor: "rgba(24,25,26,0.6)" }}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/70">
                    Positioned distinctly
                  </p>
                  <ul data-stakes-list="distinct" className="mt-5 space-y-3.5">
                    {STRONG.map((item, index) => (
                      <motion.li
                        key={item}
                        animate={{ opacity: prefersReducedMotion || index === activeIndex ? 1 : 0.55 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: index * 0.04 }}
                        className="text-[0.95rem] leading-relaxed text-ivory/90"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
