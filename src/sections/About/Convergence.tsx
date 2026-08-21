"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

const METHOD_STAGES = [
  {
    number: "01",
    field: "Psychology",
    title: "Attention",
    question: "What earns a first look without borrowing urgency?",
    decision: "Choose the signal the audience can recognise quickly and process comfortably.",
    accent: "#d4b99a",
  },
  {
    number: "02",
    field: "Language",
    title: "Meaning",
    question: "Which words make the value easier to understand and repeat?",
    decision: "Shape one clear promise, then give every message the same verbal centre.",
    accent: "#9db3c1",
  },
  {
    number: "03",
    field: "Brand Strategy & Systems",
    title: "Memory",
    question: "Which distinctive cues can stay coherent as the business grows?",
    decision: "Connect position, expression and repetition so each encounter strengthens the last.",
    accent: "#a9b69f",
  },
] as const;

export function Convergence() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const active = METHOD_STAGES[activeIndex];

  function handleTabKey(index: number, event: KeyboardEvent<HTMLButtonElement>) {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % METHOD_STAGES.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + METHOD_STAGES.length) % METHOD_STAGES.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = METHOD_STAGES.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section
      className="relative flex min-h-svh items-center overflow-hidden py-[clamp(5.5rem,10svh,8rem)]"
      aria-labelledby="about-method-title"
      data-about-scene="method"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 72% 36%, rgba(157,179,193,0.12), transparent 34%), radial-gradient(circle at 18% 72%, rgba(212,185,154,0.11), transparent 32%)",
        }}
      />

      <Container className="relative w-full max-w-7xl">
        <header className="grid gap-5 border-b border-ivory/12 pb-[clamp(1.25rem,3svh,2.25rem)] lg:grid-cols-[minmax(0,0.72fr)_minmax(24rem,1.28fr)] lg:items-end lg:gap-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-sandstone">The method</p>
            <p className="mt-3 text-sm leading-relaxed text-ivory/60">Two fields become one practical decision system.</p>
          </div>
          <h2
            id="about-method-title"
            className="max-w-[16ch] font-display text-[clamp(2.5rem,min(5.2vw,8svh),5.4rem)] font-normal leading-[0.94] tracking-[-0.035em] text-ivory"
          >
            From human attention to a brand people can <em className="font-normal text-sandstone">remember.</em>
          </h2>
        </header>

        <div className="mt-[clamp(1.25rem,3.5svh,2.75rem)] grid gap-5 lg:grid-cols-[minmax(15rem,0.62fr)_minmax(0,1.38fr)] lg:items-stretch">
          <div
            role="tablist"
            aria-label="Psychology and language method stages"
            className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1"
          >
            {METHOD_STAGES.map((stage, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={stage.number}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`about-method-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="about-method-panel"
                  tabIndex={isActive ? 0 : -1}
                  data-cursor-label={stage.number}
                  className="group flex min-w-0 items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                  style={{
                    borderColor: isActive ? `${stage.accent}88` : "rgba(244,239,230,0.1)",
                    backgroundColor: isActive ? `${stage.accent}12` : "rgba(244,239,230,0.025)",
                    transform: isActive ? "translateX(4px)" : "translateX(0)",
                  }}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => handleTabKey(index, event)}
                >
                  <span className="text-[0.58rem] font-semibold tracking-[0.16em] text-ivory/40">{stage.number}</span>
                  <span className="min-w-0">
                    <strong className="block truncate text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ivory/50">
                      {stage.field}
                    </strong>
                    <span className="mt-1 block font-display text-xl text-ivory">{stage.title}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="about-method-panel"
            role="tabpanel"
            aria-labelledby={`about-method-tab-${activeIndex}`}
            className="relative min-w-0 overflow-hidden rounded-[clamp(1.25rem,2.4vw,2rem)] border border-ivory/12 bg-[rgba(9,15,16,0.58)] p-[clamp(1.25rem,2.5vw,2.25rem)] shadow-[0_30px_90px_rgba(0,0,0,0.2)] backdrop-blur-md"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.number}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}
                className="grid h-full gap-[clamp(1.25rem,3svh,2.25rem)]"
              >
                <div className="grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-8">
                  <div>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em]" style={{ color: active.accent }}>
                      {active.field} · {active.title}
                    </p>
                    <p className="mt-3 max-w-[19ch] font-display text-[clamp(1.8rem,3vw,3.1rem)] leading-[1.02] text-ivory">
                      {active.question}
                    </p>
                  </div>
                  <div className="border-l border-ivory/12 pl-5 md:pl-8">
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-ivory/40">Project decision</p>
                    <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-ivory/82">{active.decision}</p>
                  </div>
                </div>

                <div className="grid gap-3 border-t border-ivory/10 pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <div>
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-ivory/40">Ethical boundary</p>
                    <p className="mt-2 max-w-[54ch] text-xs leading-relaxed text-ivory/65">
                      Clarity over pressure. The work supports informed, reversible choice and leaves misleading urgency outside the system.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                    <a
                      href="https://www.apa.org/ethics/code"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sandstone underline decoration-sandstone/35 underline-offset-4 hover:text-ivory"
                    >
                      APA ethics code
                    </a>
                    <a
                      href="https://www.gov.uk/government/publications/online-choice-architecture-how-digital-design-can-harm-competition-and-consumers"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sandstone underline decoration-sandstone/35 underline-offset-4 hover:text-ivory"
                    >
                      Choice architecture guidance
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <footer className="mt-[clamp(1.1rem,2.8svh,2rem)] flex flex-col gap-3 border-t border-ivory/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-xs leading-relaxed text-ivory/58">
            Recorded application: a sharper publishing decision moved Dr. Haley Nutrition&apos;s engagement rate from 0.71% to 2.81%.
          </p>
          <Link
            href="/work/dr-haley-nutrition"
            className="shrink-0 text-sm font-medium text-sandstone underline decoration-sandstone/35 underline-offset-4 transition-colors hover:text-ivory"
          >
            Read the documented decision <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </Container>
    </section>
  );
}
