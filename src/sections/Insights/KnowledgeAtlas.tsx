"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { Container } from "@/components/Container";
import { ElementGlyph } from "@/components/ElementGlyph";
import type { InsightElement } from "@/data/insights";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { EASE_AIR, MOTION_DISTANCE, MOTION_DURATION } from "@/lib/motion";

type AtlasTopic = {
  slug: string;
  element: InsightElement;
  name: string;
  eyebrow: string;
  description: string;
  count: number;
  color: string;
  promise: string;
  guide: {
    slug: string;
    title: string;
    readingTime: string;
  };
  proof: {
    slug: string;
    title: string;
    hook: string;
  };
  engagement: {
    slug: string;
    name: string;
    forWho: string;
  };
};

export function KnowledgeAtlas({ topics }: { topics: AtlasTopic[] }) {
  const [activeSlug, setActiveSlug] = useState(topics[0]?.slug ?? "");
  const prefersReducedMotion = useHydratedReducedMotion();
  const titleId = useId();
  const active = topics.find((topic) => topic.slug === activeSlug) ?? topics[0];

  if (!active) return null;

  return (
    <section className="relative overflow-hidden bg-soil py-20 text-ivory sm:py-28" aria-labelledby={titleId}>
      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sandstone">Knowledge atlas</p>
            <h2 id={titleId} className="mt-4 max-w-xl font-display text-display-md font-normal">
              Five routes through one brand system.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-ivory/70 lg:justify-self-end">
            Choose the part carrying the strain. The atlas reveals its question, the available guide set and the adjacent territory it touches.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[1.75rem] border border-ivory/12 bg-[#10151A]/88 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-ivory/12 p-5 sm:p-7 lg:border-b-0 lg:border-r">
            <div className="grid gap-2" role="tablist" aria-labelledby={titleId}>
              {topics.map((topic, index) => {
                const selected = topic.slug === active.slug;
                return (
                  <button
                    key={topic.slug}
                    id={`${titleId}-tab-${topic.slug}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${titleId}-panel`}
                    onClick={() => setActiveSlug(topic.slug)}
                    className={`group grid min-h-16 grid-cols-[2.75rem_1fr_auto] items-center gap-3 rounded-xl border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-200 focus-ring-halo ${
                      selected
                        ? "translate-x-1 border-ivory/28 bg-ivory/[0.1]"
                        : "border-transparent bg-transparent hover:translate-x-0.5 hover:border-ivory/12 hover:bg-ivory/[0.045]"
                    }`}
                  >
                    <ElementGlyph slug={topic.element} className="h-6 w-6" strokeWidth={1.25} style={{ color: topic.color }} />
                    <span>
                      <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ivory/42">
                        0{index + 1} · {topic.eyebrow}
                      </span>
                      <span className="mt-1 block font-display text-xl text-ivory">{topic.name}</span>
                    </span>
                    <span className="text-xs text-ivory/42">{topic.count}</span>
                    <span className="sr-only"> essays. {topic.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id={`${titleId}-panel`}
            role="tabpanel"
            aria-labelledby={`${titleId}-tab-${active.slug}`}
            className="relative min-h-[38rem] p-6 sm:p-9 lg:p-12"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.slug}
                initial={prefersReducedMotion ? false : { opacity: 0, y: MOTION_DISTANCE.content }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -MOTION_DISTANCE.near }}
                transition={{ duration: prefersReducedMotion ? 0 : MOTION_DURATION.reveal, ease: EASE_AIR }}
                className="flex min-h-[31rem] flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: active.color }}>
                    {active.eyebrow} path
                  </p>
                  <ElementGlyph slug={active.element} className="h-10 w-10 opacity-55" strokeWidth={1.05} style={{ color: active.color }} />
                </div>
                <h3 className="mt-8 max-w-2xl font-display text-[clamp(3rem,7vw,6.8rem)] font-normal leading-[0.92] text-ivory">
                  {active.name}
                </h3>
                <p className="mt-7 max-w-xl text-base leading-7 text-ivory/68">{active.description}</p>
                <p className="mt-4 max-w-xl font-display text-xl leading-7 text-ivory/92">{active.promise}</p>

                <div className="mt-9 grid gap-3 sm:grid-cols-3" aria-label={`${active.name} decision route`}>
                  {[
                    {
                      label: "Read",
                      title: active.guide.title,
                      detail: active.guide.readingTime,
                      href: `/insights/${active.guide.slug}`,
                    },
                    {
                      label: "See the decision",
                      title: active.proof.title,
                      detail: active.proof.hook,
                      href: `/work/${active.proof.slug}`,
                    },
                    {
                      label: "Choose the path",
                      title: active.engagement.name,
                      detail: active.engagement.forWho,
                      href: `/work#service-${active.engagement.slug}`,
                    },
                  ].map((route, index) => (
                    <motion.div
                      key={route.label}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: MOTION_DISTANCE.near }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : MOTION_DURATION.focus,
                        delay: prefersReducedMotion ? 0 : 0.12 + index * 0.07,
                        ease: EASE_AIR,
                      }}
                    >
                      <Link
                        href={route.href}
                        className="group flex h-full min-h-44 flex-col rounded-2xl border border-ivory/12 bg-ivory/[0.045] p-4 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-ivory/28 hover:bg-ivory/[0.08] focus-ring-halo sm:p-5"
                      >
                        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em]" style={{ color: active.color }}>
                          0{index + 1} · {route.label}
                        </span>
                        <span className="mt-3 font-display text-xl leading-6 text-ivory">{route.title}</span>
                        <span className="mt-auto pt-5 text-xs leading-5 text-ivory/52">{route.detail}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-5 border-t border-ivory/12 pt-6">
                  <p className="text-sm text-ivory/52">{active.count} {active.count === 1 ? "essay" : "essays"} in this route</p>
                  <Link href={`/insights/topic/${active.slug}`} className="text-xs font-semibold uppercase tracking-[0.16em] text-ivory underline decoration-ivory/25 underline-offset-8 transition hover:decoration-ivory/70 focus-ring-halo">
                    View the full reading path
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
