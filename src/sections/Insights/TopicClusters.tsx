"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { pillars } from "@/data/glossary";
import { blogPosts } from "@/data/blog";

// Insights rebuild, per the governing bible: the five content pillars
// as a topic explorer, each opening into its real supporting
// questions, its glossary terms defined in plain language, and the
// real article inside that pillar where one exists. The accordion
// follows the bible's own accessible pattern — aria-expanded on the
// button, hidden on the panel — so assistive technology and keyboards
// get exactly what pointers get. Reading stays primary: one pillar
// open at a time, no motion beyond a quiet height reveal.
export function TopicClusters() {
  const [open, setOpen] = useState<string | null>(pillars[0].id);
  const prefersReducedMotion = useReducedMotion();

  return (
    <Container className="max-w-5xl">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Topic clusters</p>
        <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory">
          Five pillars, and the questions each one answers.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/80">
          The glossary lives inside the pillars: every term defined in plain language, next to the questions it helps
          answer.
        </p>
      </Reveal>
      <div className="mt-10">
        {pillars.map((pillar) => {
          const isOpen = open === pillar.id;
          const article = pillar.articleSlug ? blogPosts.find((p) => p.slug === pillar.articleSlug) : undefined;
          return (
            <div key={pillar.id} className="border-t border-ivory/15">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`pillar-${pillar.id}`}
                onClick={() => setOpen(isOpen ? null : pillar.id)}
                className="group flex w-full items-baseline justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
              >
                <span className="font-display text-xl font-normal text-ivory transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                  {pillar.name}
                </span>
                <span
                  aria-hidden="true"
                  className={`text-xl font-light transition-transform duration-300 ${isOpen ? "rotate-45 text-sandstone" : "text-ivory/50"}`}
                >
                  +
                </span>
              </button>
              <div id={`pillar-${pillar.id}`} hidden={!isOpen}>
                {isOpen && (
                  <motion.div
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="grid gap-8 pb-8 lg:grid-cols-[1fr_1.2fr]"
                  >
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/60">
                        Questions this pillar answers
                      </p>
                      <ul className="mt-3 space-y-2">
                        {pillar.questions.map((q) => (
                          <li key={q} className="text-sm leading-relaxed text-ivory/85 before:mr-2 before:content-['·']">
                            {q}
                          </li>
                        ))}
                      </ul>
                      {article && (
                        <Link
                          href={`/insights/${article.slug}`}
                          className="link-underline mt-4 inline-flex items-center gap-2 text-sm text-sandstone transition-colors duration-300 hover:text-ivory"
                        >
                          Read: {article.title} <span aria-hidden="true">→</span>
                        </Link>
                      )}
                    </div>
                    <dl className="space-y-4">
                      {pillar.terms.map((t) => (
                        <div key={t.term} className="rounded-xl border border-ivory/12 p-4" style={{ backgroundColor: "rgba(244,239,230,0.04)" }}>
                          <dt className="font-display text-lg font-normal text-ivory">{t.term}</dt>
                          <dd className="mt-1 text-sm leading-relaxed text-ivory/80">{t.definition}</dd>
                        </div>
                      ))}
                    </dl>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
        <div className="h-px bg-ivory/15" aria-hidden="true" />
      </div>
    </Container>
  );
}
