"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { brandStudies } from "@/data/brandStudies";

const STUDY_ACCENTS = ["#D9C4A4", "#9AB8C7", "#C7AE68", "#9EBB9B", "#C68F78"] as const;
const CARD_SPANS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
] as const;

// The teaching layer is deliberately separated from client evidence.
// These five studies analyse the public record with zero implied client
// relationship. On phones, selecting one study temporarily hides the
// unrelated covers so the chosen lesson hands directly into its evidence.
// Tablets and larger screens retain the complete editorial gallery.
export function BrandStudies() {
  const [open, setOpen] = useState(-1);
  const prefersReducedMotion = useHydratedReducedMotion();
  const openPanelRef = useRef<HTMLDivElement>(null);
  const coverRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (open < 0 || !openPanelRef.current || !window.matchMedia("(max-width: 767px)").matches) return;
    const frame = window.requestAnimationFrame(() => {
      openPanelRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, prefersReducedMotion]);

  function closeStudy(index: number) {
    setOpen(-1);
    window.requestAnimationFrame(() => coverRefs.current[index]?.focus());
  }

  return (
    <section className="relative scroll-mt-32 overflow-hidden py-14 sm:py-24" style={{ backgroundColor: "#071A20" }}>
      <BackgroundVideo
        video="/videos/work-studies-film-v2.mp4"
        poster="/images/work-studies-film-v2-poster.jpg"
        parallax
        playbackRate={0.84}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[#071A20]/82" />
      <Container className="relative max-w-6xl">
        {/* This framing is factual orientation, not decorative motion.
            Keeping it immediately visible prevents direct jumps or fast
            scrolls from leaving a large empty deep-water panel. */}
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#9AB8C7]">Brand studies</p>
            <h2 className="mt-2 max-w-2xl text-display-sm font-display font-normal text-ivory sm:text-display-md">
              Lessons from brands the whole world already knows.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/80">
              Independent dissections of the public record, written as study. Each brand below earned its place in
              memory through a specific mechanism, and each study names it.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.17em] text-[#9AB8C7]">
              Evidence boundary
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["05", "Public studies"],
                ["00", "Client claims"],
                ["03", "Mechanisms each"],
              ].map(([value, label]) => (
                <div key={label} className="border-l border-white/10 pl-3 first:border-l-0 first:pl-0">
                  <p className="font-display text-2xl text-ivory">{value}</p>
                  <p className="mt-1 text-[0.58rem] uppercase leading-snug tracking-[0.1em] text-ivory/50">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-ivory/55">
              Analysis, teaching, and application. No engagement, endorsement, or affiliation is implied.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:gap-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-12" aria-label="Independent brand-study mechanisms">
          {brandStudies.map((study, index) => {
            const isOpen = open === index;
            const panelId = `study-panel-${study.slug}`;
            const accent = STUDY_ACCENTS[index] ?? STUDY_ACCENTS[0];

            return (
              <Fragment key={study.slug}>
                <article
                  className={`min-w-0 ${open >= 0 && !isOpen ? "hidden md:block" : ""} ${CARD_SPANS[index] ?? "lg:col-span-4"}`}
                >
                  <h3 className="h-full">
                    <button
                      ref={(element) => {
                        coverRefs.current[index] = element;
                      }}
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      aria-label={`${isOpen ? "Close" : "Open"} ${study.brand} public-record study`}
                      className={`group relative flex w-full flex-col overflow-hidden rounded-[1.35rem] border p-4 text-left transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 sm:min-h-[17rem] sm:p-6 ${
                        isOpen ? "min-h-[7.5rem]" : "min-h-[11.5rem]"
                      }`}
                      style={{
                        borderColor: isOpen ? accent : "rgba(255,255,255,0.12)",
                        background: `radial-gradient(circle at 88% 10%, ${accent}20, transparent 36%), linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))`,
                        boxShadow: isOpen ? `0 26px 90px ${accent}18` : "0 22px 70px rgba(0,0,0,0.16)",
                        outlineColor: accent,
                      }}
                    >
                      <span className="flex items-start justify-between gap-5">
                        <span>
                          <span className="font-display text-sm" style={{ color: accent }} aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="mt-1.5 block font-display text-3xl font-normal text-ivory sm:mt-2 sm:text-4xl">
                            {study.brand}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg transition-transform duration-500"
                          style={{
                            borderColor: accent + "66",
                            color: accent,
                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          }}
                        >
                          +
                        </span>
                      </span>

                      <span className="mt-2.5 flex flex-wrap gap-2 sm:mt-3">
                        <span className="rounded-full border border-white/15 px-2.5 py-1 text-[0.58rem] text-ivory/60 sm:px-3 sm:text-[0.62rem]">
                          {study.region}
                        </span>
                        <span className="rounded-full border px-2.5 py-1 text-[0.58rem] sm:px-3 sm:text-[0.62rem]" style={{ borderColor: accent + "66", color: accent }}>
                          {study.lens}
                        </span>
                      </span>

                      <span className={`max-w-xl text-[0.82rem] leading-relaxed text-ivory/72 sm:mt-4 sm:block sm:text-sm ${isOpen ? "hidden" : "mt-3 line-clamp-2 block"}`}>
                        {study.premise}
                      </span>

                      {!isOpen && (
                        <span className="mt-auto block pt-3 sm:hidden">
                          <span className="block text-[0.56rem] font-medium uppercase tracking-[0.12em] text-ivory/42">
                            Three mechanisms
                          </span>
                          <span className="mt-1.5 block line-clamp-2 text-xs leading-relaxed text-ivory/68">
                            {study.observations.map((observation) => observation.title).join(" · ")}
                          </span>
                        </span>
                      )}

                      <span className="mt-auto hidden pt-6 sm:block">
                        <span className="block text-[0.6rem] font-medium uppercase tracking-[0.13em] text-ivory/45">
                          The mechanism is visible in
                        </span>
                        <span className="mt-3 grid grid-cols-3 gap-2">
                          {study.observations.map((observation, observationIndex) => (
                            <span key={observation.title} className="min-w-0 rounded-xl border border-white/10 bg-black/10 p-3">
                              <span className="font-display text-xs" style={{ color: accent }} aria-hidden="true">
                                {String(observationIndex + 1).padStart(2, "0")}
                              </span>
                              <span className="mt-1 block line-clamp-3 text-[0.66rem] font-medium uppercase leading-snug tracking-[0.08em] text-ivory/72">
                                {observation.title}
                              </span>
                            </span>
                          ))}
                        </span>
                      </span>
                    </button>
                  </h3>
                </article>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      ref={openPanelRef}
                      id={panelId}
                      role="region"
                      aria-label={`${study.brand} public-record study`}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="scroll-mt-32 overflow-hidden rounded-[1.55rem] border md:col-span-2 lg:col-span-12"
                      style={{
                        borderColor: accent + "55",
                        background: `radial-gradient(circle at 12% 0%, ${accent}20, transparent 34%), #0A242B`,
                      }}
                    >
                      <div className="grid gap-7 border-b border-white/10 p-5 sm:p-7 lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: accent }}>
                              Memory mechanism · {study.lens}
                            </p>
                            <button
                              type="button"
                              onClick={() => closeStudy(index)}
                              className="shrink-0 rounded-full border px-3 py-1.5 text-[0.56rem] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                              style={{ borderColor: accent + "66", color: accent, outlineColor: accent }}
                            >
                              Close study
                            </button>
                          </div>
                          <p className="mt-3 font-display text-4xl font-normal text-ivory sm:text-5xl">{study.brand}</p>
                          <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/70">{study.premise}</p>
                          <blockquote className="mt-6 border-l-2 pl-4 font-display text-xl italic leading-relaxed text-ivory sm:mt-7 sm:pl-5 sm:text-2xl" style={{ borderColor: accent }}>
                            {study.lesson}
                          </blockquote>
                          <Link
                            href={`/work/studies/${study.slug}`}
                            className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline decoration-current/40 underline-offset-4 transition-colors hover:text-ivory sm:mt-7"
                            style={{ color: accent }}
                          >
                            Read the full study <span aria-hidden="true">→</span>
                          </Link>
                        </div>

                        <ol className="grid gap-3">
                          {study.observations.map((observation, observationIndex) => (
                            <li key={observation.title} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[2.4rem_1fr] sm:p-5">
                              <span className="font-display text-lg" style={{ color: accent }} aria-hidden="true">
                                {String(observationIndex + 1).padStart(2, "0")}
                              </span>
                              <div>
                                <p className="text-[0.62rem] font-medium uppercase tracking-[0.15em] text-ivory/65">
                                  {observation.title}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-ivory/78">{observation.text}</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="p-5 sm:p-7">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                          <div>
                            <p className="text-[0.56rem] font-medium uppercase tracking-[0.16em]" style={{ color: accent }}>
                              Transfer the lesson
                            </p>
                            <p className="mt-1 font-display text-2xl font-normal text-ivory sm:text-3xl">
                              Three applications for a growing brand.
                            </p>
                          </div>
                          <p className="text-[0.6rem] uppercase tracking-[0.12em] text-ivory/45">Teaching, never client proof</p>
                        </div>
                        <ol className="mt-5 grid gap-3 lg:grid-cols-3">
                          {study.applications.map((application, applicationIndex) => (
                            <li key={application} className="rounded-2xl border border-white/10 bg-black/10 p-4 sm:p-5">
                              <span className="font-display text-sm" style={{ color: accent }} aria-hidden="true">
                                {String(applicationIndex + 1).padStart(2, "0")}
                              </span>
                              <p className="mt-3 text-sm leading-relaxed text-ivory/72">{application}</p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Fragment>
            );
          })}
        </div>

        <div className="mt-12 grid gap-5 border-t border-white/10 pt-7 sm:mt-16 sm:pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-xl text-base leading-relaxed text-ivory/75">
            The same mechanisms scale down. The Services journey applies them to brands still earning their place
            in memory.
          </p>
          <Link
            href="/services"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#9AB8C7] underline decoration-[#9AB8C7]/40 underline-offset-4 transition-colors hover:text-ivory"
          >
            Walk the journey <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
