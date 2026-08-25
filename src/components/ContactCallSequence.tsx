"use client";

import { useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useContactSceneStage } from "@/hooks/useContactSceneStage";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { EASE_AIR } from "@/lib/motion";
import { consultation } from "@/data/site";

const STEPS = [
  {
    compact: "Where the brand stands",
    full: consultation.fullSteps[0],
  },
  {
    compact: "What shapes perception",
    full: consultation.fullSteps[1],
  },
  {
    compact: "The clearest next step",
    full: consultation.fullSteps[2],
  },
] as const;

/** The first call assembles as a three-part ledger instead of fading in. */
export function ContactCallSequence() {
  const sequenceRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const isSequenceVisible = useInView(sequenceRef, { amount: 0.2 });
  const { activeIndex, choose, scrollYProgress } = useContactSceneStage({
    count: STEPS.length,
    target: sequenceRef,
    reducedMotion: prefersReducedMotion,
  });
  const drawnRaw = useTransform(scrollYProgress, [0.04, 0.96], [0, 1]);
  const drawn = useSpring(drawnRaw, { stiffness: 130, damping: 27, mass: 0.32 });

  return (
    <div
      ref={sequenceRef}
      data-contact-call-sequence
      className="relative mt-5 sm:mt-9"
    >
      <span
        aria-hidden="true"
        className="absolute left-[16.5%] right-[16.5%] top-[1.65rem] h-px bg-white/12 sm:top-8 lg:hidden"
      />
      <motion.span
        aria-hidden="true"
        className="absolute left-[16.5%] right-[16.5%] top-[1.65rem] h-px origin-left bg-sandstone/65 sm:top-8 lg:hidden"
        style={{ scaleX: prefersReducedMotion ? 1 : drawn }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-5 left-[1.55rem] top-5 hidden w-px bg-white/12 lg:block"
      />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-5 left-[1.55rem] top-5 z-10 hidden w-px origin-top bg-sandstone/65 lg:block"
        style={{ scaleY: prefersReducedMotion ? 1 : drawn }}
      />

      <ol className="relative z-10 grid grid-cols-3 gap-1.5 sm:gap-3 lg:grid-cols-1">
        {STEPS.map((step, index) => {
          const active = activeIndex === index;
          return (
            <li key={step.full} className="relative min-w-0">
              <button
                type="button"
                aria-label={step.full}
                aria-current={active ? "step" : undefined}
                onClick={() => choose(index)}
                onFocus={() => choose(index)}
                onMouseEnter={() => choose(index)}
                className={`group relative flex min-h-[6.75rem] w-full flex-col items-center gap-2 overflow-hidden rounded-xl border px-2 py-3 text-center transition-[border-color,color,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sandstone sm:min-h-20 sm:flex-row sm:items-start sm:gap-4 sm:rounded-2xl sm:px-4 sm:py-4 sm:text-left lg:min-h-0 lg:items-center lg:py-3 ${
                  active
                    ? "border-white/20 text-ivory"
                    : "border-white/10 text-ivory/64 hover:border-white/16 hover:text-ivory/88"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="contact-call-active-step"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl bg-white/[0.095] shadow-[0_16px_50px_rgba(0,0,0,0.14)] backdrop-blur-xl"
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE_AIR }}
                  />
                ) : null}
                <motion.span
                  aria-hidden="true"
                  className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sandstone/30 bg-soil/35 font-display text-sm leading-none text-sandstone"
                >
                  {active && isSequenceVisible && !prefersReducedMotion ? (
                    <motion.span
                      className="absolute -inset-1 rounded-full border border-sandstone/45"
                      animate={{ scale: [0.82, 1.38], opacity: [0, 0.45, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  ) : null}
                  {String(index + 1).padStart(2, "0")}
                </motion.span>
                <p className="relative z-10 text-[0.68rem] leading-[1.25] sm:text-sm sm:leading-relaxed">
                  <span className="sm:hidden">{step.compact}</span>
                  <span className="hidden sm:inline">{step.full}</span>
                </p>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
