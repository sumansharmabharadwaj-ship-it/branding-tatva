"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { MediaSlot } from "@/components/MediaSlot";
import { brandStudies } from "@/data/brandStudies";

// Brand studies — the Work page's teaching layer. Renowned brands from
// the US, UK and Canada dissected through the same vocabulary the rest
// of the site uses (distinctive assets, architecture, verbal identity,
// codes, ritual). CRITICAL FRAMING: these are independent analyses of
// the public record and must never read as client work — the framing
// line under the heading carries that in visitor facing copy, and the
// section sits visually distinct from the real client sequence above it
// (numbered editorial rows, no project card chrome, no outcome stats).
// One study opens at a time only after the visitor asks for depth. Brand,
// region, lens and premise all stay visible while closed, so nothing a
// study claims is hidden behind an interaction.
export function BrandStudies() {
  const [open, setOpen] = useState(-1);
  const prefersReducedMotion = useHydratedReducedMotion();

  return (
    <section className="bg-soil py-20 sm:py-28">
      <Container className="max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ivory/70">Brand studies</p>
          <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory sm:text-display-md">
            Lessons from brands the whole world already knows.
          </h2>
          <p className="mt-4 max-w-xl text-base text-ivory/90">
            Independent dissections of the public record, written as study. Each brand below earned its place in
            memory through a specific mechanism, and each study names it.
          </p>
        </Reveal>

        <div className="mt-12">
          {brandStudies.map((study, i) => {
            const isOpen = open === i;
            const panelId = `study-panel-${study.slug}`;
            return (
              <Reveal key={study.slug} delay={Math.min(i * 0.06, 0.2)}>
                <article className="border-t border-ivory/15">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group grid w-full grid-cols-[2.5rem_1fr_2.5rem] items-start gap-4 py-8 text-left transition-colors duration-500 hover:bg-ivory/[0.03] sm:gap-6"
                    >
                      <span className="pt-2 font-display text-sm text-ivory/50" aria-hidden="true">
                        0{i + 1}
                      </span>
                      <span>
                        <span className="block font-display text-2xl font-normal text-ivory sm:text-3xl">
                          {study.brand}
                        </span>
                        <span className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full border border-ivory/20 px-3 py-1 text-xs text-ivory/70">
                            {study.region}
                          </span>
                          <span className="rounded-full border border-[#A0A690]/40 px-3 py-1 text-xs text-[#A0A690]">
                            {study.lens}
                          </span>
                        </span>
                        <span className="mt-4 block max-w-xl text-base leading-relaxed text-ivory/85">
                          {study.premise}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-2 flex h-8 w-8 items-center justify-center rounded-full border border-ivory/25 text-lg leading-none text-ivory/70 transition-all duration-500 group-hover:border-[#A0A690]/70 group-hover:text-[#A0A690]"
                        style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                      >
                        +
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        key="panel"
                        initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="relative overflow-hidden rounded-2xl">
                          {/* This study's own approved footage. Empty until
                              a clip is approved per file, and the panel
                              reads as designed with nothing in it. */}
                          <MediaSlot fill={study.media?.card} scrim={0.88} parallax={false} />
                          <div className="relative grid gap-8 pb-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16 lg:px-6">
                            <div className="space-y-5 lg:col-start-2">
                              {study.observations.map((obs) => (
                                <div key={obs.title}>
                                  <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">
                                    {obs.title}
                                  </p>
                                  <p className="mt-1.5 max-w-2xl text-[0.95rem] leading-relaxed text-ivory/90">
                                    {obs.text}
                                  </p>
                                </div>
                              ))}
                              <p className="mt-7 border-l-2 border-[#A0A690]/60 pl-4 font-display text-lg italic text-ivory sm:text-xl">
                                {study.lesson}
                              </p>
                              <Link
                                href={`/work/studies/${study.slug}`}
                                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#A0A690] underline decoration-[#A0A690]/40 underline-offset-4 transition-colors hover:text-ivory"
                              >
                                Read the full study
                                <span aria-hidden="true">→</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </Reveal>
            );
          })}
          <div className="h-px bg-ivory/15" aria-hidden="true" />
        </div>

        {/* The bridge: the studies teach the mechanisms, the Services
            journey applies them. One link, closing the argument. */}
        <Reveal delay={0.1}>
          <div className="mt-16 border-t border-ivory/15 pt-8">
            <p className="max-w-xl text-base text-ivory/90">
              The same mechanisms scale down. The Services journey applies them to brands still earning their place
              in memory.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#A0A690] underline decoration-[#A0A690]/40 underline-offset-4 transition-colors hover:text-ivory"
            >
              Walk the journey
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
