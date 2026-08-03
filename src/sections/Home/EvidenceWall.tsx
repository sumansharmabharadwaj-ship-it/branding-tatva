"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";
import { SITUATION_KEY } from "@/sections/Home/VisitorRecognition";
import { track } from "@/lib/analytics";

const FEATURED_SLUGS = ["dr-haley-nutrition", "myshopineurope", "executive-springboard"] as const;

const SITUATION_TO_PROJECT: Record<string, (typeof FEATURED_SLUGS)[number]> = {
  idea: "myshopineurope",
  inconsistent: "executive-springboard",
  outgrown: "dr-haley-nutrition",
};

const PHASES = [
  { key: "challenge", label: "Observation", prompt: "What was visibly wrong" },
  { key: "insight", label: "Diagnosis", prompt: "What the surface evidence concealed" },
  { key: "strategy", label: "Decision", prompt: "The governing choice" },
  { key: "execution", label: "Application", prompt: "How the decision became visible" },
  { key: "outcome", label: "Outcome", prompt: "What can be verified" },
] as const;

type PhaseKey = (typeof PHASES)[number]["key"];

function shorten(value: string | undefined, max = 300) {
  if (!value) return "This layer is documented in the full case study.";
  if (value.length <= max) return value;
  const cut = value.slice(0, max).lastIndexOf(" ");
  return `${value.slice(0, cut > 0 ? cut : max).trim()}…`;
}

export function EvidenceWall() {
  const featured = useMemo(
    () => FEATURED_SLUGS.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean),
    [],
  );
  const [selectedSlug, setSelectedSlug] = useState<(typeof FEATURED_SLUGS)[number]>(FEATURED_SLUGS[0]);
  const [activePhase, setActivePhase] = useState<PhaseKey>("challenge");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      const situation = window.localStorage.getItem(SITUATION_KEY);
      const matched = situation ? SITUATION_TO_PROJECT[situation] : undefined;
      if (matched && featured.some((project) => project?.slug === matched)) setSelectedSlug(matched);
    } catch {}
  }, [featured]);

  const selected = featured.find((project) => project?.slug === selectedSlug) ?? featured[0];
  if (!selected) return null;

  const currentPhase = PHASES.find((phase) => phase.key === activePhase) ?? PHASES[0];
  const phaseText = selected[activePhase];
  const primaryStat = selected.stats?.[0];

  function chooseProject(slug: string) {
    setSelectedSlug(slug as (typeof FEATURED_SLUGS)[number]);
    setActivePhase("challenge");
    track("evidence_case_selected", { project: slug, page: "home" });
  }

  return (
    <section className="relative overflow-hidden bg-[#171411] py-20 text-ivory sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 8% 15%, rgba(184,90,52,0.13), transparent 30%), radial-gradient(circle at 88% 80%, rgba(212,185,154,0.09), transparent 32%)",
        }}
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sandstone/50 to-transparent" />

      <Container className="relative max-w-[94rem]">
        <Reveal>
          <div className="grid gap-8 border-b border-ivory/10 pb-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-sandstone">Case investigation</p>
              <h2 className="mt-4 max-w-xl font-display text-[clamp(2.8rem,6vw,5.8rem)] font-normal leading-[0.94]">
                Do not admire the result. Inspect the decision.
              </h2>
            </div>
            <div className="lg:justify-self-end">
              <p className="max-w-xl text-base leading-relaxed text-ivory/62 sm:text-lg">
                A portfolio shows what was made. Evidence shows what was noticed, refused, changed, and verified.
              </p>
              <Link
                href="/work"
                className="mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-sandstone transition-colors hover:text-ivory"
              >
                Explore the complete archive <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-8 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-12">
          <div className="space-y-3" role="tablist" aria-label="Select a case investigation">
            {featured.map((project, index) => {
              if (!project) return null;
              const active = project.slug === selected.slug;
              return (
                <Reveal key={project.slug} delay={index * 0.05}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => chooseProject(project.slug)}
                    className={`group relative w-full overflow-hidden rounded-2xl border px-5 py-5 text-left transition-all duration-500 ${
                      active
                        ? "border-sandstone/45 bg-ivory/[0.07]"
                        : "border-ivory/10 bg-transparent hover:border-ivory/25 hover:bg-ivory/[0.025]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-1 transition-transform duration-500"
                      style={{ backgroundColor: project.accent, transform: active ? "scaleY(1)" : "scaleY(0.2)" }}
                    />
                    <span className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/35">
                      File {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-2 block font-display text-2xl text-ivory">{project.title}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-ivory/50">{project.hook}</span>
                  </button>
                </Reveal>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-ivory/12 bg-[#211d19] shadow-[0_42px_120px_-55px_rgba(0,0,0,0.9)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.slug}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-[20rem] overflow-hidden lg:min-h-[34rem]">
                    {selected.cardImage && (
                      <Image
                        src={selected.cardImage}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: selected.cardImagePosition ?? "center" }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#211d19] via-[#211d19]/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#211d19]/75" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ivory/55">{selected.industry}</p>
                      <h3 className="mt-2 font-display text-4xl text-ivory sm:text-5xl">{selected.title}</h3>
                      {primaryStat ? (
                        <div className="mt-6 inline-flex items-end gap-3 rounded-2xl border border-ivory/15 bg-[#171411]/70 px-4 py-3 backdrop-blur-sm">
                          <span className="font-display text-3xl text-sandstone sm:text-4xl">{primaryStat.value}</span>
                          <span className="max-w-40 pb-1 text-xs leading-snug text-ivory/60">{primaryStat.label}</span>
                        </div>
                      ) : (
                        <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/68">{selected.reflection}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex min-h-[34rem] flex-col p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-wrap gap-2" role="tablist" aria-label={`${selected.title} investigation layers`}>
                      {PHASES.map((phase, index) => {
                        const active = activePhase === phase.key;
                        return (
                          <button
                            key={phase.key}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setActivePhase(phase.key)}
                            className={`relative min-h-11 rounded-full border px-4 text-[0.66rem] font-medium uppercase tracking-[0.16em] transition-all duration-300 ${
                              active
                                ? "border-sandstone bg-sandstone text-soil"
                                : "border-ivory/15 text-ivory/55 hover:border-ivory/35 hover:text-ivory"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")} {phase.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative mt-8 flex-1">
                      <div aria-hidden="true" className="absolute bottom-0 left-[5px] top-1 w-px bg-gradient-to-b from-sandstone/70 via-sandstone/20 to-transparent" />
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${selected.slug}-${activePhase}`}
                          initial={prefersReducedMotion ? undefined : { opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={prefersReducedMotion ? undefined : { opacity: 0, x: -10 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                          className="pl-8"
                        >
                          <span aria-hidden="true" className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-[#211d19] bg-sandstone shadow-[0_0_22px_rgba(212,185,154,0.7)]" />
                          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-sandstone">{currentPhase.prompt}</p>
                          <h4 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">{currentPhase.label}</h4>
                          <p className="mt-6 max-w-2xl text-base leading-[1.8] text-ivory/72">{shorten(phaseText)}</p>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 border-t border-ivory/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-md text-xs leading-relaxed text-ivory/40">
                        Claims shown here are drawn from documented project records. No invented outcomes or decorative metrics.
                      </p>
                      <Link
                        href={`/work/${selected.slug}`}
                        onClick={() => track("evidence_case_opened", { project: selected.slug, page: "home" })}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-sandstone/55 px-5 text-xs font-medium uppercase tracking-[0.16em] text-sandstone transition-colors hover:bg-sandstone hover:text-soil"
                      >
                        Open the full case <span className="ml-2" aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Reveal delay={0.1} className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-ivory/10 bg-ivory/10 sm:grid-cols-3">
          {["What was noticed", "What was decided", "What changed"].map((label, index) => (
            <div key={label} className="bg-[#171411] px-6 py-5">
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/35">0{index + 1}</p>
              <p className="mt-2 font-display text-xl text-ivory">{label}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
