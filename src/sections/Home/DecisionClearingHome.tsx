"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";

const QUESTIONS = [
  {
    question: "What does branding actually include?",
    answer:
      "Positioning, audience, identity, voice, experience, content, and the consistency that allows recognition to build. The exact mix depends on where the business is losing clarity.",
  },
  {
    question: "Can this begin before a logo or website exists?",
    answer:
      "Yes. That is usually the strongest beginning. Position, audience, promise, and language can be decided before visual expression starts multiplying assumptions.",
  },
  {
    question: "Can an established brand keep what already works?",
    answer:
      "Yes. Repositioning is an act of judgment, rather than demolition. Existing equity, familiar assets, and trusted language stay when they still support the present business.",
  },
  {
    question: "How long does the work take?",
    answer:
      "The timeline follows scope. A focused positioning engagement moves faster than a complete brand system. The first conversation establishes the real boundary before a quotation or schedule is proposed.",
  },
  {
    question: "Can strategy become an actual website, content, and campaign?",
    answer:
      "Yes. Strategy only becomes valuable once it reaches the market. The work can continue into web direction, content systems, messaging, and implementation where the scope calls for it.",
  },
] as const;

const CALL_STEPS = [
  "Where the brand stands",
  "What currently feels unclear",
  "The first honest diagnosis",
  "A possible next step",
] as const;

export function DecisionClearingHome() {
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative isolate overflow-hidden bg-[#eef0e8] py-24 text-soil sm:py-32 lg:py-40">
      <BackgroundVideo
        video="/videos/higgsfield-forest-light-vivid.mp4"
        poster="/images/higgsfield-forest-light-vivid-poster.jpg"
        imagePosition="50% 48%"
        parallax
      />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(242,240,232,.93)_0%,rgba(242,240,232,.79)_52%,rgba(242,240,232,.62)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_77%_42%,rgba(143,174,131,.22),transparent_34%)]" />

      <Container className="relative max-w-[92rem]">
        <div className="grid gap-14 lg:grid-cols-[0.76fr_1.24fr] lg:items-start lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.3em] text-clay">Scene eight · risk removal</p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(3rem,6vw,6.3rem)] font-normal leading-[0.9] tracking-[-0.05em] text-soil">
              Interest becomes action once uncertainty has somewhere to go.
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-relaxed text-soil/66 sm:text-base">
              Open the question that would otherwise follow you into the booking form. The useful answer should arrive before the sales conversation.
            </p>

            <div className="mt-10 rounded-[1.7rem] border border-white/55 bg-white/54 p-6 shadow-elevation-lg backdrop-blur-2xl sm:p-7">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-soil/42">The first conversation</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {CALL_STEPS.map((step, index) => (
                  <div key={step} className="rounded-[1.1rem] border border-soil/10 bg-white/44 px-4 py-4">
                    <span className="text-[0.54rem] uppercase tracking-[0.18em] text-clay">0{index + 1}</span>
                    <p className="mt-2 font-display text-xl leading-tight text-soil">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <LinkButton href="/contact">Book a Brand Strategy Session</LinkButton>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/55 bg-white/58 p-5 shadow-elevation-lg backdrop-blur-2xl sm:p-7 lg:p-9">
            <div className="space-y-3">
              {QUESTIONS.map((item, index) => {
                const open = index === openIndex;
                return (
                  <div key={item.question} className={`overflow-hidden rounded-[1.35rem] border transition-colors duration-400 ${open ? "border-soil/18 bg-white/68" : "border-soil/9 bg-white/34"}`}>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`home-answer-${index}`}
                      onClick={() => setOpenIndex(index)}
                      className="flex min-h-16 w-full items-center gap-5 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="text-[0.56rem] uppercase tracking-[0.18em] text-clay">0{index + 1}</span>
                      <span className="flex-1 font-display text-[clamp(1.5rem,2.8vw,2.8rem)] leading-[1.02] tracking-[-0.025em] text-soil">
                        {item.question}
                      </span>
                      <motion.span
                        aria-hidden="true"
                        className="relative h-8 w-8 shrink-0 rounded-full border border-soil/14"
                        animate={{ rotate: open ? 45 : 0, backgroundColor: open ? "rgba(184,90,52,.10)" : "rgba(255,255,255,.20)" }}
                        transition={{ duration: reduce ? 0 : 0.35 }}
                      >
                        <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-soil" />
                        <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-soil" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={`home-answer-${index}`}
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: reduce ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="border-t border-soil/9 px-5 pb-6 pt-5 sm:px-6">
                            <p className="max-w-3xl text-sm leading-[1.8] text-soil/66 sm:text-base">{item.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-soil/10 pt-7">
              <p className="max-w-xl text-sm leading-relaxed text-soil/56">
                A complete Services FAQ covers scope, collaboration, timeline, implementation, and results in greater detail.
              </p>
              <LinkButton href="/services" variant="secondary">Explore Services</LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
