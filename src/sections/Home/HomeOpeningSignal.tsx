"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLenis } from "@/components/SmoothScrollProvider";

const STATES = [
  {
    label: "Seen",
    line: "The brand enters the field of view.",
  },
  {
    label: "Understood",
    line: "The audience can name what it means.",
  },
  {
    label: "Remembered",
    line: "The meaning survives after the encounter ends.",
  },
] as const;

export function HomeOpeningSignal() {
  const lenis = useLenis();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(prefersReducedMotion ? 2 : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveIndex(2);
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % STATES.length);
    }, 2700);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  function enterDiagnosis() {
    const target = document.querySelector<HTMLElement>("[data-home-chapter='diagnosis']");
    if (!target) return;

    if (lenis && !prefersReducedMotion) {
      lenis.scrollTo(target, { offset: -72, duration: 1.05 });
      return;
    }

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  const active = STATES[activeIndex] ?? STATES[2];

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[24] px-4 sm:bottom-7 sm:px-7">
      <div className="mx-auto flex w-full max-w-[96rem] items-end justify-between gap-5">
        <div className="hidden max-w-sm rounded-2xl border border-ivory/14 bg-soil/44 px-4 py-3 text-left shadow-[0_18px_55px_rgba(0,0,0,0.24)] backdrop-blur-md sm:block">
          <div className="flex items-center gap-2" aria-label="Seen, understood, remembered">
            {STATES.map((state, index) => {
              const selected = index === activeIndex;
              return (
                <div key={state.label} className="contents">
                  <motion.span
                    className="text-[0.55rem] font-medium uppercase tracking-[0.16em]"
                    animate={{
                      color: selected ? "#F4EFE6" : "rgba(244,239,230,0.34)",
                      opacity: selected ? 1 : 0.62,
                    }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
                  >
                    {state.label}
                  </motion.span>
                  {index < STATES.length - 1 && (
                    <span className="relative h-px min-w-5 flex-1 overflow-hidden bg-ivory/12">
                      {selected && !prefersReducedMotion && (
                        <motion.span
                          className="absolute inset-y-0 left-0 bg-sandstone"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.7, ease: "linear" }}
                        />
                      )}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={active.label}
              className="mt-2 text-[0.66rem] leading-relaxed text-ivory/55"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 5, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4, filter: "blur(2px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              {active.line}
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={enterDiagnosis}
          className="pointer-events-auto ml-auto flex items-center gap-3 rounded-full border border-ivory/16 bg-soil/48 px-4 py-3 text-left text-ivory shadow-[0_18px_55px_rgba(0,0,0,0.24)] backdrop-blur-md transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-sandstone/55 hover:bg-soil/64 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-sandstone/45">
            <motion.span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-sandstone"
              animate={prefersReducedMotion ? undefined : { y: [-5, 5, -5], opacity: [0.35, 1, 0.35] }}
              transition={prefersReducedMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          <span>
            <span className="block text-[0.5rem] font-medium uppercase tracking-[0.17em] text-ivory/42">
              Chapter 02
            </span>
            <span className="mt-0.5 block font-display text-sm leading-none text-ivory sm:text-base">
              Find the gap
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
