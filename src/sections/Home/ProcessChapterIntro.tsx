"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/Container";

const BEATS = [
  {
    number: "01",
    label: "Question",
    line: "What must the market understand before anything is designed?",
  },
  {
    number: "02",
    label: "Decode",
    line: "Which audience tension and category pattern are actually shaping perception?",
  },
  {
    number: "03",
    label: "Architect",
    line: "What single position can every later choice inherit?",
  },
  {
    number: "04",
    label: "Signal",
    line: "How should the strategy sound, look, and behave so it can be recognised twice?",
  },
  {
    number: "05",
    label: "Influence",
    line: "Where must the brand become useful, visible, and easy to choose?",
  },
  {
    number: "06",
    label: "Compound",
    line: "Which signals deserve to be repeated until recognition starts earning on its own?",
  },
] as const;

const ROTATE_MS = 4200;
const MANUAL_PAUSE_MS = 14000;

export function ProcessChapterIntro() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const rootRef = useRef<HTMLDivElement>(null);
  const pauseUntilRef = useRef(0);
  const inView = useInView(rootRef, { amount: 0.45 });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || !inView) return;

    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current || document.hidden) return;
      setActiveIndex((current) => (current + 1) % BEATS.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [inView, prefersReducedMotion]);

  function choose(index: number) {
    pauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
    setActiveIndex(index);
  }

  const active = BEATS[activeIndex];

  return (
    <div
      ref={rootRef}
      className="relative isolate overflow-hidden border-y border-ivory/10 bg-soil py-12 sm:py-16"
      onPointerEnter={() => {
        pauseUntilRef.current = Date.now() + 7000;
      }}
      onFocusCapture={() => {
        pauseUntilRef.current = Date.now() + MANUAL_PAUSE_MS;
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(184,90,52,0.16), transparent 68%)" }}
        animate={
          prefersReducedMotion || !inView
            ? undefined
            : { x: [0, 80, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 16, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-[8%] -z-10 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(92,107,74,0.17), transparent 70%)" }}
        animate={
          prefersReducedMotion || !inView
            ? undefined
            : { x: [0, -65, 0], y: [0, 38, 0], scale: [1.05, 0.94, 1.05] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 19, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <Container className="relative max-w-[90rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-sandstone">
              The working method
            </p>
            <h2 className="mt-3 max-w-xl font-display text-[clamp(2rem,4vw,3.65rem)] font-normal leading-[1.05] text-ivory">
              How a project moves, without decorating uncertainty.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-ivory/68 sm:text-base">
              Six decisions. Each one gives the next something solid to inherit, so the final brand feels coherent rather than merely finished.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-ivory/12 bg-ivory/[0.045] p-5 backdrop-blur-md sm:p-7">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ivory/45">
                  Decision in focus
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.label}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-2"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs tracking-[0.16em] text-sandstone/75">{active.number}</span>
                      <p className="font-display text-3xl font-normal leading-none text-ivory sm:text-4xl">
                        {active.label}
                      </p>
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/68">
                      {active.line}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.span
                aria-hidden="true"
                className="hidden h-16 w-16 shrink-0 rounded-full border border-dashed border-sandstone/40 sm:block"
                animate={
                  prefersReducedMotion || !inView
                    ? undefined
                    : { rotate: 360, scale: [1, 1.08, 1] }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                      }
                }
              />
            </div>

            <div className="mt-7 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {BEATS.map((beat, index) => {
                const selected = index === activeIndex;
                return (
                  <button
                    key={beat.label}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => choose(index)}
                    className="group relative overflow-hidden rounded-xl border px-2 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
                    style={{
                      borderColor: selected ? "rgba(212,185,154,0.55)" : "rgba(244,239,230,0.1)",
                      backgroundColor: selected ? "rgba(244,239,230,0.075)" : "rgba(244,239,230,0.02)",
                    }}
                  >
                    <span className="block text-[0.55rem] tracking-[0.14em] text-sandstone/65">
                      {beat.number}
                    </span>
                    <span className="mt-1 block text-[0.62rem] font-medium uppercase tracking-[0.09em] text-ivory/70 sm:text-[0.66rem]">
                      {beat.label}
                    </span>
                    {selected && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-px origin-left bg-sandstone"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: prefersReducedMotion ? 0 : ROTATE_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
