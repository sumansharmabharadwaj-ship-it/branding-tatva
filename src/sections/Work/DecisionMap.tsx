"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ElementGlyph } from "@/components/ElementGlyph";
import { projects } from "@/data/projects";
import { WORK, EASE_ORGANIC } from "@/sections/Work/palette";

// Work Page 2.0 decision map — the five elements annotating real
// decisions rather than becoming the page subject. Each element is a
// question a brand has to answer; focusing a question reveals the one
// real project where that exact decision was made, with a line pulled
// from that project's own recorded data. Reduced motion renders every
// example in a linear sequence instead of a switching panel.
const MAP = [
  {
    slug: "earth",
    question: "What is true?",
    decision: "Positioning and category choice",
    projectSlug: "myshopineurope",
  },
  {
    slug: "water",
    question: "What is experienced?",
    decision: "Customer journey and service cues",
    projectSlug: "executive-springboard",
  },
  {
    slug: "fire",
    question: "What earns attention?",
    decision: "Expression and distinctive assets",
    projectSlug: "herbalcart",
  },
  {
    slug: "air",
    question: "What frames value?",
    decision: "Verbal identity and narrative",
    projectSlug: "plaxonic-content-portfolio",
  },
  {
    slug: "space",
    question: "What gets remembered?",
    decision: "Recognition and mental availability",
    projectSlug: "dr-haley-nutrition",
  },
] as const;

function proofLine(projectSlug: string) {
  const p = projects.find((pr) => pr.slug === projectSlug);
  if (!p) return null;
  const line = (p.reflection ?? p.hook ?? p.closingQuote ?? p.outcome).split(/(?<=\.)\s/)[0];
  return { project: p, line };
}

export function DecisionMap() {
  const [active, setActive] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const entries = MAP.map((m) => ({ ...m, proof: proofLine(m.projectSlug) }));
  const current = entries[active];

  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: WORK.mist }}>
      <Container className="max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.moss }}>
            Decision map
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal" style={{ color: WORK.charcoal }}>
            Five questions every remembered brand has answered.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: WORK.wood }}>
            Each question below was answered inside a real engagement. The elements annotate the decisions; the
            projects prove them.
          </p>
        </Reveal>

        {prefersReducedMotion ? (
          // Linear sequence — every example visible, zero switching.
          <div className="mt-10 space-y-8">
            {entries.map((entry) =>
              entry.proof ? (
                <div key={entry.slug} className="border-t pt-6" style={{ borderColor: WORK.stone }}>
                  <p className="flex items-center gap-3 font-display text-xl" style={{ color: WORK.charcoal }}>
                    <ElementGlyph slug={entry.slug} className="h-5 w-5" style={{ color: WORK.moss }} />
                    {entry.question}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: WORK.moss }}>{entry.decision}</p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: WORK.wood }}>
                    {entry.proof.line}
                  </p>
                  <Link href={`/work/${entry.proof.project.slug}`} className="link-underline mt-2 inline-block text-sm" style={{ color: WORK.forest }}>
                    {entry.proof.project.title}
                  </Link>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            <div role="tablist" aria-label="Brand decisions" className="flex flex-col">
              {entries.map((entry, i) => {
                const isActive = active === i;
                return (
                  <button
                    key={entry.slug}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group relative flex items-center gap-4 border-t py-5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 last:border-b"
                    style={{ borderColor: WORK.stone + "88", outlineColor: WORK.moss }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="decision-line"
                        aria-hidden="true"
                        className="absolute inset-y-3 left-0 w-[2px] rounded-full"
                        style={{ backgroundColor: WORK.moss }}
                        transition={{ duration: 0.35, ease: EASE_ORGANIC }}
                      />
                    )}
                    <ElementGlyph
                      slug={entry.slug}
                      className="ml-4 h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: isActive ? WORK.forest : WORK.stone }}
                    />
                    <span>
                      <span className="block font-display text-xl font-normal" style={{ color: isActive ? WORK.charcoal : WORK.wood }}>
                        {entry.question}
                      </span>
                      <span className="mt-0.5 block text-xs uppercase tracking-[0.12em]" style={{ color: isActive ? WORK.moss : WORK.stone }}>
                        {entry.decision}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[280px]">
              <AnimatePresence mode="wait">
                {current.proof && (
                  <motion.div
                    key={current.slug}
                    role="tabpanel"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE_ORGANIC }}
                    className="overflow-hidden rounded-2xl"
                    style={{ backgroundColor: WORK.cream }}
                  >
                    {current.proof.project.cardImage && (
                      <div className="relative aspect-[5/2] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={current.proof.project.cardImage}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 sm:p-8">
                      <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: WORK.moss }}>
                        Answered inside
                      </p>
                      <p className="mt-1 font-display text-2xl font-normal" style={{ color: WORK.charcoal }}>
                        {current.proof.project.title}
                      </p>
                      <p className="mt-3 max-w-lg text-sm leading-relaxed" style={{ color: WORK.wood }}>
                        {current.proof.line}
                      </p>
                      <Link
                        href={`/work/${current.proof.project.slug}`}
                        className="link-underline mt-4 inline-flex items-center gap-2 text-sm font-medium"
                        style={{ color: WORK.forest }}
                      >
                        See the project <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
