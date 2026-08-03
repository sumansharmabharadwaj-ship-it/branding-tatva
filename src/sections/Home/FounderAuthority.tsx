"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";

const LENSES = [
  {
    id: "psychology",
    number: "01",
    title: "Psychology",
    degree: "M.A. Clinical Psychology",
    words: ["Attention", "Association", "Choice", "Memory"],
    question: "What does the audience notice before conscious reasoning begins?",
    consequence: "Brand decisions begin with how people perceive, categorise, trust, and remember.",
    accent: "#8FAE83",
  },
  {
    id: "language",
    number: "02",
    title: "Literature",
    degree: "B.A. English Literature",
    words: ["Framing", "Narrative", "Metaphor", "Tone"],
    question: "Which language makes the same offer feel ordinary, valuable, familiar, or distinct?",
    consequence: "Words shape the frame through which price, quality, character, and relevance are understood.",
    accent: "#C6A97A",
  },
  {
    id: "strategy",
    number: "03",
    title: "Brand strategy",
    degree: "Applied across real client work",
    words: ["Position", "System", "Expression", "Recognition"],
    question: "Which decision should every later decision reinforce?",
    consequence: "The work turns perception and language into a market system people can recognise and use.",
    accent: "#B85A34",
  },
] as const;

type LensId = (typeof LENSES)[number]["id"];

export function FounderAuthority() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState<LensId>(LENSES[0].id);
  const active = LENSES.find((lens) => lens.id === activeId) ?? LENSES[0];
  const activeIndex = LENSES.findIndex((lens) => lens.id === active.id);

  return (
    <section className="relative isolate overflow-hidden bg-soil py-24 text-ivory sm:py-32 lg:py-40">
      <BackgroundVideo
        video="/videos/higgsfield-idea-sketch.mp4"
        poster="/images/higgsfield-idea-sketch.jpg"
        imagePosition="50% 48%"
        push
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(22,18,15,.94)_0%,rgba(22,18,15,.78)_48%,rgba(22,18,15,.62)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,rgba(198,169,122,.16),transparent_34%)]" />

      <Container className="relative max-w-[88rem]">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.3em] text-sandstone">Why Suman</p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(3rem,6.2vw,6.6rem)] font-normal leading-[0.9] tracking-[-0.045em] text-ivory">
              Attention becomes language. Language becomes a decision. The decision becomes memory.
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-relaxed text-ivory/72 sm:text-base">
              Branding Tatva combines the study of human behaviour, the discipline of language, and the commercial structure required to make both usable in the market.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton href="/about">See how the disciplines converge</LinkButton>
              <LinkButton href="/work" variant="secondary" className="border-ivory/25 text-ivory hover:bg-ivory/10">
                See the decisions in practice
              </LinkButton>
            </div>
          </div>

          <div className="rounded-[2rem] border border-ivory/14 bg-soil/60 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
            <div className="grid gap-3 sm:grid-cols-3" role="tablist" aria-label="Explore Suman's interdisciplinary method">
              {LENSES.map((lens) => {
                const selected = lens.id === active.id;
                return (
                  <button
                    key={lens.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveId(lens.id)}
                    className={`rounded-[1.25rem] border px-4 py-4 text-left transition-colors duration-400 ${
                      selected ? "border-ivory/25 bg-ivory/[0.09]" : "border-ivory/8 bg-black/10 hover:border-ivory/18 hover:bg-ivory/[0.05]"
                    }`}
                  >
                    <span className="block text-[0.58rem] uppercase tracking-[0.2em] text-ivory/38">{lens.number}</span>
                    <span className="mt-2 block font-display text-2xl text-ivory">{lens.title}</span>
                    <span className="mt-2 block text-[0.68rem] leading-relaxed text-ivory/48">{lens.degree}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative mt-5 min-h-[31rem] overflow-hidden rounded-[1.6rem] border border-ivory/10 bg-[#141713]/78 p-6 sm:p-8">
              <svg viewBox="0 0 760 360" className="pointer-events-none absolute inset-x-0 top-0 h-[18rem] w-full opacity-75" aria-hidden="true">
                <path d="M112 70 C230 70 246 180 372 180" fill="none" stroke="rgba(244,239,230,.16)" strokeWidth="1.3" />
                <path d="M112 180 C230 180 246 180 372 180" fill="none" stroke="rgba(244,239,230,.16)" strokeWidth="1.3" />
                <path d="M112 290 C230 290 246 180 372 180" fill="none" stroke="rgba(244,239,230,.16)" strokeWidth="1.3" />
                <path d="M372 180 C500 180 530 180 650 180" fill="none" stroke="rgba(244,239,230,.18)" strokeWidth="1.3" />
                {LENSES.map((lens, index) => {
                  const y = 70 + index * 110;
                  const path = `M112 ${y} C230 ${y} 246 180 372 180`;
                  return (
                    <g key={lens.id}>
                      <motion.path
                        d={path}
                        fill="none"
                        stroke={lens.accent}
                        strokeLinecap="round"
                        strokeWidth="2.2"
                        initial={false}
                        animate={{ pathLength: activeIndex === index ? 1 : 0.12, opacity: activeIndex === index ? 0.95 : 0.16 }}
                        transition={{ duration: reduce ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <motion.circle cx="112" cy={y} r="6" animate={{ fill: lens.accent, opacity: activeIndex === index ? 1 : 0.3, scale: activeIndex === index ? 1.2 : 0.8 }} />
                    </g>
                  );
                })}
                <motion.circle
                  cx="372"
                  cy="180"
                  r="14"
                  animate={{ fill: active.accent, scale: reduce ? 1 : [0.92, 1.12, 0.92] }}
                  transition={{ fill: { duration: 0.5 }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                />
                <motion.path
                  d="M372 180 C500 180 530 180 650 180"
                  fill="none"
                  stroke={active.accent}
                  strokeLinecap="round"
                  strokeWidth="2.2"
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  transition={{ duration: reduce ? 0 : 0.8 }}
                />
                <motion.circle cx="650" cy="180" r="8" animate={{ fill: active.accent }} />
              </svg>

              <div className="relative z-10 grid gap-5 pt-52 sm:grid-cols-[0.8fr_1.2fr] sm:items-end">
                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.22em] text-ivory/38">The active lens</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {active.words.map((word, index) => (
                      <motion.span
                        key={`${active.id}-${word}`}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reduce ? 0 : index * 0.06 }}
                        className="rounded-full border border-ivory/12 bg-ivory/[0.05] px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-ivory/64"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(9px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduce ? undefined : { opacity: 0, y: -12, filter: "blur(6px)" }}
                    transition={{ duration: reduce ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="font-display text-[clamp(1.9rem,3.8vw,3.8rem)] leading-[1.02] tracking-[-0.03em] text-ivory">
                      {active.question}
                    </p>
                    <p className="mt-5 text-sm leading-relaxed text-ivory/66 sm:text-base">{active.consequence}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
