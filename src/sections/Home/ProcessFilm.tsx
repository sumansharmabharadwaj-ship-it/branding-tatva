"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import type { ProcessStage } from "@/data/process";

export function ProcessFilm({
  stages,
  elementColors,
}: {
  stages: ProcessStage[];
  elementColors: Record<string, string>;
}) {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = stages[activeIndex] ?? stages[0];

  if (!active || !active.video || !active.poster) return null;
  const colorFor = (element: string) => elementColors[element] ?? "#C6A97A";
  const activeColor = colorFor(active.element);

  return (
    <section className="relative isolate overflow-hidden bg-[#101813] py-24 text-ivory sm:py-32 lg:py-40">
      <BackgroundVideo
        video="/videos/pixabay-roots-stream.mp4"
        poster="/images/pixabay-roots-stream-poster.jpg"
        imagePosition="50% 55%"
        parallax
      />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(13,23,16,.96)_0%,rgba(13,23,16,.83)_48%,rgba(13,23,16,.68)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_48%,rgba(198,169,122,.12),transparent_36%)]" />

      <Container className="relative max-w-[92rem]">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.3em] text-sandstone">Scene seven · the work moves</p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(3rem,6.1vw,6.5rem)] font-normal leading-[0.89] tracking-[-0.05em] text-ivory">
              Every decision should remember the one that came before it.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-ivory/70 sm:text-base lg:justify-self-end">
            The process is a chain of consequences. A weak question produces a weak position. A weak position forces expression to improvise. The sequence protects the meaning before it reaches the market.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-[1.8rem] border border-ivory/12 bg-soil/58 p-5 backdrop-blur-2xl sm:p-7">
            <p className="text-[0.58rem] uppercase tracking-[0.22em] text-ivory/38">Follow the six movements</p>
            <div className="mt-5 space-y-2" role="tablist" aria-label="Choose a project stage">
              {stages.map((stage, index) => {
                const selected = index === activeIndex;
                const color = colorFor(stage.element);
                return (
                  <button
                    key={stage.stage}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveIndex(index)}
                    className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-[1.15rem] border px-4 py-4 text-left transition-colors duration-400 ${
                      selected
                        ? "border-ivory/22 bg-ivory/[0.08]"
                        : "border-ivory/8 bg-black/10 hover:border-ivory/17 hover:bg-ivory/[0.04]"
                    }`}
                  >
                    <motion.span
                      className="absolute inset-y-0 left-0 w-1 origin-bottom"
                      animate={{ backgroundColor: color, scaleY: selected ? 1 : 0.14, opacity: selected ? 1 : 0.3 }}
                      transition={{ duration: 0.45 }}
                    />
                    <span className="text-[0.56rem] uppercase tracking-[0.18em] text-ivory/34">0{index + 1}</span>
                    <span className="font-display text-2xl text-ivory sm:text-3xl">{stage.stage}</span>
                    <span className="ml-auto text-[0.52rem] uppercase tracking-[0.16em]" style={{ color }}>
                      {stage.element}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-ivory/14 bg-[#101813]/76 shadow-2xl backdrop-blur-2xl">
            <div className="relative min-h-[26rem] overflow-hidden sm:min-h-[34rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.stage}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, scale: 1.04, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, scale: 1.02, filter: "blur(7px)" }}
                  transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <BackgroundVideo video={active.video} poster={active.poster} imagePosition="center" push />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,12,.12),rgba(10,16,12,.30)_44%,rgba(10,16,12,.95)_100%)]" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-10">
                <p className="text-[0.58rem] uppercase tracking-[0.22em]" style={{ color: activeColor }}>
                  Movement 0{activeIndex + 1} · {active.element}
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`copy-${active.stage}`}
                    initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduce ? undefined : { opacity: 0, y: -12, filter: "blur(6px)" }}
                    transition={{ duration: reduce ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="mt-3 font-display text-[clamp(3.2rem,7vw,7.4rem)] font-normal leading-[0.84] tracking-[-0.055em] text-ivory">
                      {active.stage}
                    </h3>
                    <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ivory/72 sm:text-base">{active.description}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="relative h-36 overflow-hidden rounded-[1.35rem] border border-ivory/10 bg-black/12 px-4 py-5 sm:h-44 sm:px-7">
                <svg viewBox="0 0 800 160" className="h-full w-full" aria-hidden="true">
                  <path d="M58 104 C174 34 252 142 356 82 C466 18 552 124 742 48" fill="none" stroke="rgba(244,239,230,.14)" strokeWidth="3" strokeLinecap="round" />
                  <motion.path
                    d="M58 104 C174 34 252 142 356 82 C466 18 552 124 742 48"
                    fill="none"
                    stroke={activeColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    animate={{ pathLength: (activeIndex + 1) / stages.length }}
                    transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {stages.map((stage, index) => {
                    const points = [
                      [58, 104],
                      [194, 78],
                      [326, 95],
                      [466, 59],
                      [592, 79],
                      [742, 48],
                    ];
                    const [x, y] = points[index] ?? [58 + index * 130, 80];
                    const reached = index <= activeIndex;
                    return (
                      <g key={stage.stage}>
                        <circle cx={x} cy={y} r="11" fill="#101813" stroke="rgba(244,239,230,.28)" strokeWidth="2" />
                        <motion.circle
                          cx={x}
                          cy={y}
                          r="6"
                          animate={{ fill: reached ? colorFor(stage.element) : "rgba(244,239,230,.18)", scale: index === activeIndex ? [0.9, 1.2, 0.9] : 1 }}
                          transition={{ fill: { duration: 0.4 }, scale: { duration: 2.4, repeat: index === activeIndex ? Infinity : 0 } }}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-7 grid gap-7 border-t border-ivory/12 pt-7 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.22em] text-ivory/38">Where the sequence ends</p>
                  <p className="mt-3 max-w-3xl font-display text-[clamp(1.8rem,3.3vw,3.4rem)] leading-[1.02] text-ivory">
                    Recognition begins compounding because every later expression still carries the original decision.
                  </p>
                </div>
                <LinkButton href="/services">See what the work includes</LinkButton>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
