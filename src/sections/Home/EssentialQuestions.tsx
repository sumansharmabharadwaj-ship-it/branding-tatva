"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";

export type HomeQuestion = {
  question: string;
  answer: string;
};

const ACCENTS = ["#C6A97A", "#8FAE83", "#4E6A69", "#B85A34", "#D4B99A"];

export function EssentialQuestions({ items }: { items: readonly HomeQuestion[] }) {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex] ?? items[0];

  if (!active) return null;
  const accent = ACCENTS[activeIndex % ACCENTS.length];

  return (
    <section className="relative isolate overflow-hidden bg-[#162019] py-24 text-ivory sm:py-32 lg:py-40">
      <BackgroundVideo
        video="/videos/higgsfield-forest-light-vivid.mp4"
        poster="/images/higgsfield-forest-light-vivid-poster.jpg"
        imagePosition="50% 48%"
        parallax
      />
      <div className="absolute inset-0 bg-[linear-gradient(104deg,rgba(17,29,21,.95)_0%,rgba(17,29,21,.78)_48%,rgba(17,29,21,.62)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_42%,rgba(198,169,122,.17),transparent_34%)]" />

      <Container className="relative max-w-[92rem]">
        <div className="grid gap-14 lg:grid-cols-[0.76fr_1.24fr] lg:items-start lg:gap-20">
          <div>
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.3em] text-sandstone">Scene eight · the clearing</p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(3rem,6.2vw,6.5rem)] font-normal leading-[0.89] tracking-[-0.05em] text-ivory">
              The final hesitation deserves the same clarity as the first idea.
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-relaxed text-ivory/70 sm:text-base">
              Open the question that still sits between interest and action. Each answer makes the working relationship, scope, and next step easier to inspect.
            </p>

            <div className="relative mt-10 h-64 overflow-hidden rounded-[1.7rem] border border-ivory/12 bg-soil/44 p-5 backdrop-blur-2xl sm:h-72 sm:p-7">
              <svg viewBox="0 0 520 260" className="h-full w-full" aria-hidden="true">
                {[102, 76, 50].map((radius, index) => (
                  <motion.circle
                    key={radius}
                    cx="260"
                    cy="130"
                    r={radius}
                    fill="none"
                    stroke={index === 2 ? accent : "rgba(244,239,230,.18)"}
                    strokeWidth={index === 2 ? 3.5 : 2}
                    animate={{
                      opacity: index === 2 ? [0.45, 0.95, 0.45] : 0.65,
                      scale: index === 2 && !reduce ? [0.94, 1.04, 0.94] : 1,
                    }}
                    transition={{ duration: 3.8, repeat: index === 2 ? Infinity : 0, ease: "easeInOut" }}
                  />
                ))}
                {items.map((_, index) => {
                  const angle = -Math.PI / 2 + (index / items.length) * Math.PI * 2;
                  const x = 260 + Math.cos(angle) * 104;
                  const y = 130 + Math.sin(angle) * 104;
                  const selected = index === activeIndex;
                  return (
                    <motion.g key={`${x}-${y}`}>
                      <line x1="260" y1="130" x2={x} y2={y} stroke="rgba(244,239,230,.12)" strokeWidth="1.5" />
                      <motion.circle
                        cx={x}
                        cy={y}
                        r={selected ? 9 : 6}
                        animate={{ fill: selected ? accent : "rgba(244,239,230,.30)", scale: selected && !reduce ? [0.9, 1.18, 0.9] : 1 }}
                        transition={{ duration: selected ? 2.8 : 0.4, repeat: selected ? Infinity : 0 }}
                      />
                    </motion.g>
                  );
                })}
                <motion.circle cx="260" cy="130" r="16" animate={{ fill: accent }} transition={{ duration: 0.45 }} />
              </svg>
              <div className="absolute inset-x-0 bottom-4 text-center text-[0.54rem] uppercase tracking-[0.2em] text-ivory/38">
                Uncertainty becomes a usable question
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-ivory/14 bg-soil/66 p-5 shadow-2xl backdrop-blur-2xl sm:p-7 lg:p-9">
            <div className="space-y-3" role="tablist" aria-label="Essential questions">
              {items.map((item, index) => {
                const selected = index === activeIndex;
                return (
                  <button
                    key={item.question}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`home-answer-${index}`}
                    onClick={() => setActiveIndex(index)}
                    className={`group relative w-full overflow-hidden rounded-[1.25rem] border px-5 py-5 text-left transition-colors duration-500 sm:px-6 ${
                      selected
                        ? "border-ivory/24 bg-ivory/[0.08]"
                        : "border-ivory/8 bg-black/10 hover:border-ivory/18 hover:bg-ivory/[0.04]"
                    }`}
                  >
                    <motion.span
                      className="absolute inset-y-0 left-0 w-1 origin-bottom"
                      animate={{ backgroundColor: ACCENTS[index % ACCENTS.length], scaleY: selected ? 1 : 0.12, opacity: selected ? 1 : 0.3 }}
                      transition={{ duration: 0.45 }}
                    />
                    <span className="flex items-start gap-5">
                      <span className="pt-1 text-[0.54rem] uppercase tracking-[0.2em] text-ivory/34">0{index + 1}</span>
                      <span className="font-display text-[clamp(1.6rem,3vw,3rem)] leading-[1.02] tracking-[-0.025em] text-ivory">
                        {item.question}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 min-h-[16rem] rounded-[1.4rem] border border-ivory/10 bg-[#101813]/82 p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  id={`home-answer-${activeIndex}`}
                  key={active.question}
                  role="tabpanel"
                  initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, y: -12, filter: "blur(6px)" }}
                  transition={{ duration: reduce ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-[0.56rem] uppercase tracking-[0.22em]" style={{ color: accent }}>
                    The clear answer
                  </p>
                  <p className="mt-5 max-w-3xl font-display text-[clamp(2rem,4vw,4rem)] leading-[1.02] tracking-[-0.035em] text-ivory">
                    {active.answer}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/12 pt-6">
              <p className="text-sm text-ivory/54">The complete scope and timeline become specific after the first diagnosis.</p>
              <Link href="/services" className="link-underline text-sm text-ivory/74 hover:text-ivory">
                Open all service questions
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
