"use client";

import { useRef } from "react";
import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useContactSceneStage } from "@/hooks/useContactSceneStage";
import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
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
    compact: "The decision to take",
    full: "You identify the brand decision that deserves attention first.",
  },
] as const;

function CallStepNumber({ index, progress, reducedMotion }: {
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const ink = useTransform(progress, (value) =>
    Math.min(1, Math.max(0, value * STEPS.length - index + 0.5)),
  );

  return (
    <span aria-hidden="true" data-contact-call-number>
      <svg viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" opacity="0.18" />
        <motion.circle
          data-contact-call-ink
          cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" transform="rotate(-90 20 20)"
          style={{ pathLength: reducedMotion ? 1 : ink }}
        />
      </svg>
      <span>{String(index + 1).padStart(2, "0")}</span>
    </span>
  );
}

/** The first call assembles as a three-part ledger instead of fading in. */
export function ContactCallSequence() {
  const sequenceRef = useRef<HTMLDivElement>(null);
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const reducedMotion = !hydrated || prefersReducedMotion;
  const { activeIndex, choose, stageProgress } = useContactSceneStage({
    count: STEPS.length,
    target: sequenceRef,
    reducedMotion,
  });
  const progress = useSpring(stageProgress, { stiffness: 130, damping: 27, mass: 0.32 });
  const drawn = useTransform(progress, [0.5 / STEPS.length, 1 - 0.5 / STEPS.length], [0, 1]);

  return (
    <div
      ref={sequenceRef}
      data-contact-call-sequence
      data-contact-call-motion={reducedMotion ? "reduced" : "full"}
      data-contact-call-timeline="shared"
      className="relative mt-5 sm:mt-9"
    >
      <span
        aria-hidden="true"
        className="absolute left-[16.5%] right-[16.5%] top-[1.65rem] h-px bg-soil/12 sm:top-8 lg:hidden"
      />
      <motion.span
        aria-hidden="true"
        className="absolute left-[16.5%] right-[16.5%] top-[1.65rem] h-px origin-left bg-clay/60 sm:top-8 lg:hidden"
        data-contact-call-trace="horizontal"
        style={{ scaleX: reducedMotion ? 1 : drawn }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-5 left-[1.55rem] top-5 hidden w-px bg-soil/12 lg:block"
      />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-5 left-[1.55rem] top-5 z-10 hidden w-px origin-top bg-clay/60 lg:block"
        data-contact-call-trace="vertical"
        style={{ scaleY: reducedMotion ? 1 : drawn }}
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
                data-contact-call-step={index}
                onClick={() => choose(index)}
                onFocus={() => choose(index)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") choose(index);
                }}
                onKeyDown={(event) => {
                  let next: number;
                  if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index + 1;
                  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index - 1;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = STEPS.length - 1;
                  else return;
                  event.preventDefault();
                  const buttons = sequenceRef.current?.querySelectorAll<HTMLButtonElement>("[data-contact-call-step]");
                  buttons?.[(next + STEPS.length) % STEPS.length]?.focus({ preventScroll: true });
                }}
                className={`group relative flex min-h-[6.75rem] w-full flex-col items-center gap-2 overflow-hidden rounded-xl border px-2 py-3 text-center transition-[border-color,color,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay sm:min-h-20 sm:flex-row sm:items-start sm:gap-4 sm:rounded-2xl sm:px-4 sm:py-4 sm:text-left lg:min-h-0 lg:items-center lg:py-3 ${
                  active
                    ? "border-soil/16 text-soil"
                    : "border-soil/10 bg-white/25 text-soil/62 backdrop-blur-sm hover:border-soil/14 hover:text-soil/85"
                }`}
              >
                <motion.span
                  aria-hidden="true"
                  data-contact-call-wash
                  className="pointer-events-none absolute inset-0"
                  initial={false}
                  animate={{ opacity: active ? 1 : 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.38, ease: EASE_AIR }}
                />
                <CallStepNumber index={index} progress={progress} reducedMotion={reducedMotion} />
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
