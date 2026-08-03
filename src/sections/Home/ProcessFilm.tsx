"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import type { ProcessStage } from "@/data/process";

const PATH_POINTS = [
  { x: 54, y: 222 },
  { x: 162, y: 122 },
  { x: 268, y: 184 },
  { x: 378, y: 86 },
  { x: 484, y: 150 },
  { x: 594, y: 58 },
] as const;

export function ProcessFilm({
  stages,
  elementColor,
}: {
  stages: ProcessStage[];
  elementColor: (element: string) => string;
}) {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = stages[activeIndex] ?? stages[0];

  if (!active) return null;

  const accent = elementColor(active.element);
  const completed = activeIndex / Math.max(1, stages.length - 1);

  return (
    <section className="relative isolate overflow-hidden bg-[#101813] py-24 text-ivory sm:py-32 lg:py-40">
      <BackgroundVideo
        video="/videos/pixabay-roots-stream.mp4"
        poster="/images/pixabay-roots-stream-poster.jpg"
        imagePosition="50% 55%"
        parallax
      />
      <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(12,23,16,.96)_0%,rgba(12,23,16,.82)_52%,rgba(12,23,16,.66)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_46%,rgba(198,169,122,.13),transparent_34%)]" />

      <Container className="relative max-w-[92rem]">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.3em] text-sandstone">Scene seven · the movement</p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(3rem,6.2vw,6.5rem)] font-normal leading-[0.89] tracking-[-0.05em] text-ivory">
              A brand becomes coherent one decision at a time.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-ivory/70 sm:text-base lg:justify-self-end">
            Each movement inherits the one before it. The sequence protects the position from becoming a deck, the expression from becoming decoration, and the work from losing its meaning in execution.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-[1.8rem] border border-ivory/12 bg-soil/58 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
            <p className="text-[0.58rem] uppercase tracking-[0.22em] text-ivory/38">Move through the project</p>
            <div className="mt-5 space-y-3" role="tablist" aria-label="Explore the project process">
              {stages.map((stage, index) => {
                const selected = index === activeIndex;
                const color = elementColor(stage.element);
                return (
                  <button
                    key={stage.stage}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveIndex(index)}
                    className={`group relative w-full overflow-hidden rounded-[1.2rem] border px-5 py-4 text-left transition-colors duration-500 ${
                      selected
                        ? "border-ivory/24 bg-ivory/[0.08]"
                        : "border-ivory/8 bg-black/10 hover:border-ivory/18 hover:bg-ivory/[0.04]"
                    }`}
                  >
                    <motion.span
                      className="absolute inset-y-0 left-0 w-1 origin-bottom"
                      animate={{ backgroundColor: color, scaleY: selected ? 1 : 0.14, opacity: selected ? 1 : 0.3 }}
                      transition={{ duration: 0.45 }}
                    />
                    <span className="flex items-center justify-between gap-4">
                      <span>
                        <span className="block text-[0.54rem] uppercase tracking-[0.2em] text-ivory/34">0{index + 1}</span>
                        <span className="mt-1 block font-display text-2xl text-ivory">{stage.stage}</span>
                      </span>
                      <span className="text-[0.54rem] uppercase tracking-[0.16em]" style={{ color }}>
                        {stage.element}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-ivory/14 bg-[#101813]/78 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 lg:p-10">
            <div className="relative min-h-[21rem] overflow-hidden rounded-[1.45rem] border border-ivory/10 bg-black/14 px-4 py-6 sm:min-h-[24rem] sm:px-7">
              <svg viewBox="0 0 650 280" className="absolute inset-x-3 top-4 h-[17rem] w-[calc(100%-1.5rem)]" aria-hidden="true">
                <path
                  d="M54 222 C108 172 116 122 162 122 C208 122 220 184 268 184 C316 184 330 86 378 86 C426 86 440 150 484 150 C528 150 546 78 594 58"
                  fill="none"
                  stroke="rgba(244,239,230,.14)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M54 222 C108 172 116 122 162 122 C208 122 220 184 268 184 C316 184 330 86 378 86 C426 86 440 150 484 150 C528 150 546 78 594 58"
                  fill="none"
                  stroke={accent}
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={false}
                  animate={{ pathLength: completed, opacity: 0.95 }}
                  transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
                {PATH_POINTS.map((point, index) => {
                  const reached = index <= activeIndex;
                  const color = elementColor(stages[index]?.element ?? "Space");
                  return (
                    <g key={`${point.x}-${point.y}`}>
                      <circle cx={point.x} cy={point.y} r="12" fill="#111914" stroke="rgba(244,239,230,.22)" strokeWidth="2" />
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        animate={{ fill: reached ? color : "rgba(244,239,230,.18)", scale: index === activeIndex ? 1.35 : 1 }}
                        transition={{ duration: 0.45 }}
                      />
                    </g>
                  );
                })}
              </svg>

              <div className="relative z-10 flex min-h-[21rem] items-end sm:min-h-[24rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.stage}
                    initial={reduce ? false : { opacity: 0, y: 22, filter: "blur(9px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduce ? undefined : { opacity: 0, y: -14, filter: "blur(7px)" }}
                    transition={{ duration: reduce ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-3xl rounded-[1.25rem] border border-ivory/10 bg-soil/76 p-5 backdrop-blur-xl sm:p-7"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[0.56rem] uppercase tracking-[0.22em] text-ivory/36">Movement 0{activeIndex + 1}</p>
                      <span className="rounded-full border border-ivory/12 px-3 py-1 text-[0.54rem] uppercase tracking-[0.16em]" style={{ color: accent }}>
                        {active.element}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.88] tracking-[-0.05em] text-ivory">
                      {active.stage}
                    </h3>
                    <p className="mt-5 text-sm leading-relaxed text-ivory/68 sm:text-base">{active.description}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-5 border-t border-ivory/12 pt-6">
              <p className="max-w-2xl font-display text-2xl leading-tight text-ivory/82 sm:text-3xl">
                Every decision should remember the one that came before it.
              </p>
              <LinkButton href="/services">See how the scope is built</LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
