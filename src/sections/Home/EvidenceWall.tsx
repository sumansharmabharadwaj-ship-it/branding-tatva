"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
  const sectionRef = useRef<HTMLElement>(null);
  const featured = useMemo(
    () => FEATURED_SLUGS.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean),
    [],
  );
  const [selectedSlug, setSelectedSlug] = useState<(typeof FEATURED_SLUGS)[number]>(FEATURED_SLUGS[0]);
  const [activePhase, setActivePhase] = useState<PhaseKey>("challenge");
  const [manualPhase, setManualPhase] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.16]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -34]);
  const washOpacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.22, 0.06, 0.32]);

  useEffect(() => {
    try {
      const situation = window.localStorage.getItem(SITUATION_KEY);
      const matched = situation ? SITUATION_TO_PROJECT[situation] : undefined;
      if (matched && featured.some((project) => project?.slug === matched)) setSelectedSlug(matched);
    } catch {}
  }, [featured]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (prefersReducedMotion || manualPhase) return;
    const index = Math.min(PHASES.length - 1, Math.floor(value * PHASES.length));
    setActivePhase(PHASES[index].key);
  });

  const selected = featured.find((project) => project?.slug === selectedSlug) ?? featured[0];
  if (!selected) return null;

  const currentPhase = PHASES.find((phase) => phase.key === activePhase) ?? PHASES[0];
  const phaseText = selected[activePhase];
  const primaryStat = selected.stats?.[0];

  function chooseProject(slug: string) {
    setSelectedSlug(slug as (typeof FEATURED_SLUGS)[number]);
    setActivePhase("challenge");
    setManualPhase(false);
    track("evidence_case_selected", { project: slug, page: "home" });
  }

  function choosePhase(key: PhaseKey) {
    setManualPhase(true);
    setActivePhase(key);
  }

  return (
    <section ref={sectionRef} className="relative min-h-[310vh] bg-[#171411] text-ivory">
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 8% 15%, rgba(184,90,52,0.13), transparent 30%), radial-gradient(circle at 88% 80%, rgba(212,185,154,0.09), transparent 32%)",
          }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(198,169,122,0.08),transparent_42%)]"
          style={{ opacity: washOpacity }}
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sandstone/50 to-transparent" />

        <Container className="relative max-w-[94rem]">
          <div className="grid gap-6 border-b border-ivory/10 pb-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-sandstone">Case investigation</p>
              <h2 className="mt-3 max-w-xl font-display text-[clamp(2.35rem,5vw,5rem)] font-normal leading-[0.94]">
                Do not admire the result. Inspect the decision.
              </h2>
            </div>
            <div className="lg:justify-self-end">
              <p className="max-w-xl text-sm leading-relaxed text-ivory/62 sm:text-base">
                Keep scrolling. The file opens one layer at a time.
              </p>
              <Link href="/work" className="mt-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-sandstone transition-colors hover:text-ivory">
                Explore the complete archive <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-9">
            <div className="space-y-2" role="tablist" aria-label="Select a case investigation">
              {featured.map((project, index) => {
                if (!project) return null;
                const active = project.slug === selected.slug;
                return (
                  <button
                    key={project.slug}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => chooseProject(project.slug)}
                    className={`group relative w-full overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all duration-500 ${
                      active ? "border-sandstone/45 bg-ivory/[0.07]" : "border-ivory/10 bg-transparent hover:border-ivory/25 hover:bg-ivory/[0.025]"
                    }`}
                  >
                    <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 transition-transform duration-500" style={{ backgroundColor: project.accent, transform: active ? "scaleY(1)" : "scaleY(0.2)" }} />
                    <span className="text-[0.6rem] uppercase tracking-[0.2em] text-ivory/35">File {String(index + 1).padStart(2, "0")}</span>
                    <span className="mt-1.5 block font-display text-xl text-ivory">{project.title}</span>
                    <span className="mt-1.5 block text-xs leading-relaxed text-ivory/50">{project.hook}</span>
                  </button>
                );
              })}
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-ivory/12 bg-[#211d19] shadow-[0_42px_120px_-55px_rgba(0,0,0,0.9)]">
              <AnimatePresence mode="wait">
                <motion.div key={selected.slug} initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 1.01 }} transition={{ duration: prefersReducedMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative min-h-[18rem] overflow-hidden lg:min-h-[31rem]">
                      {selected.cardImage && (
                        <motion.div className="absolute inset-0" style={prefersReducedMotion ? undefined : { scale: imageScale, y: imageY }}>
                          <Image src={selected.cardImage} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: selected.cardImagePosition ?? "center" }} />
                        </motion.div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#211d19] via-[#211d19]/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#211d19]/75" />
                      <motion.div key={`${selected.slug}-${activePhase}-crop`} className="absolute inset-x-[8%] top-[8%] h-px bg-gradient-to-r from-transparent via-sandstone/80 to-transparent" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ivory/55">{selected.industry}</p>
                        <h3 className="mt-2 font-display text-4xl text-ivory sm:text-5xl">{selected.title}</h3>
                        {primaryStat ? (
                          <motion.div className="mt-5 inline-flex items-end gap-3 rounded-2xl border border-ivory/15 bg-[#171411]/70 px-4 py-3 backdrop-blur-sm" animate={{ boxShadow: activePhase === "outcome" ? "0 0 34px rgba(198,169,122,0.24)" : "0 0 0 rgba(198,169,122,0)" }}>
                            <span className="font-display text-3xl text-sandstone sm:text-4xl">{primaryStat.value}</span>
                            <span className="max-w-40 pb-1 text-xs leading-snug text-ivory/60">{primaryStat.label}</span>
                          </motion.div>
                        ) : (
                          <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/68">{selected.reflection}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex min-h-[31rem] flex-col p-6 sm:p-8 lg:p-9">
                      <div className="flex flex-wrap gap-2" role="tablist" aria-label={`${selected.title} investigation layers`}>
                        {PHASES.map((phase, index) => {
                          const active = activePhase === phase.key;
                          return (
                            <button key={phase.key} type="button" role="tab" aria-selected={active} onClick={() => choosePhase(phase.key)} className={`relative min-h-10 rounded-full border px-3 text-[0.62rem] font-medium uppercase tracking-[0.14em] transition-all duration-300 ${active ? "border-sandstone bg-sandstone text-soil" : "border-ivory/15 text-ivory/55 hover:border-ivory/35 hover:text-ivory"}`}>
                              {String(index + 1).padStart(2, "0")} {phase.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="relative mt-7 flex-1">
                        <div aria-hidden="true" className="absolute bottom-0 left-[5px] top-1 w-px bg-gradient-to-b from-sandstone/70 via-sandstone/20 to-transparent" />
                        <AnimatePresence mode="wait">
                          <motion.div key={`${selected.slug}-${activePhase}`} initial={prefersReducedMotion ? undefined : { opacity: 0, x: 22, filter: "blur(7px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={prefersReducedMotion ? undefined : { opacity: 0, x: -16, filter: "blur(5px)" }} transition={{ duration: prefersReducedMotion ? 0 : 0.52, ease: [0.22, 1, 0.36, 1] }} className="pl-8">
                            <span aria-hidden="true" className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-[#211d19] bg-sandstone shadow-[0_0_22px_rgba(212,185,154,0.7)]" />
                            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-sandstone">{currentPhase.prompt}</p>
                            <h4 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">{currentPhase.label}</h4>
                            <p className="mt-5 max-w-2xl text-base leading-[1.75] text-ivory/72">{shorten(phaseText)}</p>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 border-t border-ivory/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-md text-xs leading-relaxed text-ivory/40">Scroll reveals the chain. Clicking lets you inspect any clue directly.</p>
                        <Link href={`/work/${selected.slug}`} onClick={() => track("evidence_case_opened", { project: selected.slug, page: "home" })} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-sandstone/55 px-5 text-xs font-medium uppercase tracking-[0.16em] text-sandstone transition-colors hover:bg-sandstone hover:text-soil">
                          Open the full case <span className="ml-2" aria-hidden="true">↗</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
