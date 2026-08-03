"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
  { key: "challenge", label: "Observation", prompt: "What was visible" },
  { key: "insight", label: "Diagnosis", prompt: "What the surface concealed" },
  { key: "strategy", label: "Decision", prompt: "The choice that changed the system" },
  { key: "execution", label: "Application", prompt: "How the choice became tangible" },
  { key: "outcome", label: "Outcome", prompt: "What the evidence can support" },
] as const;

type PhaseKey = (typeof PHASES)[number]["key"];

function shorten(value: string | undefined, max = 340) {
  if (!value) return "This layer is documented in the complete case study.";
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
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.22]);
  const imageX = useTransform(scrollYProgress, [0, 1], [0, -38]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const vignette = useTransform(scrollYProgress, [0, 0.48, 1], [0.58, 0.34, 0.7]);
  const evidenceLine = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    try {
      const situation = window.localStorage.getItem(SITUATION_KEY);
      const matched = situation ? SITUATION_TO_PROJECT[situation] : undefined;
      if (matched && featured.some((project) => project?.slug === matched)) setSelectedSlug(matched);
    } catch {}
  }, [featured]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (prefersReducedMotion) return;
    const index = Math.min(PHASES.length - 1, Math.floor(value * PHASES.length));
    setActivePhase(PHASES[index].key);
  });

  const selected = featured.find((project) => project?.slug === selectedSlug) ?? featured[0];
  if (!selected) return null;

  const phaseIndex = PHASES.findIndex((phase) => phase.key === activePhase);
  const currentPhase = PHASES[phaseIndex] ?? PHASES[0];
  const phaseText = selected[activePhase];
  const primaryStat = selected.stats?.[0];

  function chooseProject(slug: string) {
    setSelectedSlug(slug as (typeof FEATURED_SLUGS)[number]);
    setActivePhase("challenge");
    track("evidence_case_selected", { project: slug, page: "home" });
  }

  return (
    <section ref={sectionRef} className="relative h-[360vh] bg-[#14110f] text-ivory">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={prefersReducedMotion ? undefined : { scale: imageScale, x: imageX, y: imageY }}>
          {selected.cardImage && (
            <Image
              src={selected.cardImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: selected.cardImagePosition ?? "center" }}
              priority={false}
            />
          )}
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-[#14110f]"
          style={{ opacity: vignette }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg,rgba(20,17,15,.18) 0%,rgba(20,17,15,.42) 48%,rgba(20,17,15,.94) 78%,rgba(20,17,15,.98) 100%), linear-gradient(180deg,rgba(20,17,15,.56) 0%,transparent 28%,transparent 68%,rgba(20,17,15,.78) 100%)",
          }}
        />

        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-6 pt-24 sm:px-10 lg:px-14">
          <div>
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone">Case investigation</p>
            <p className="mt-2 max-w-sm font-display text-2xl leading-tight text-ivory/88 sm:text-3xl">
              The result is the last thing you should look at.
            </p>
          </div>
          <Link href="/work" className="hidden text-[0.62rem] font-medium uppercase tracking-[0.2em] text-ivory/58 transition-colors hover:text-sandstone sm:inline-flex">
            Complete archive ↗
          </Link>
        </div>

        <div className="absolute bottom-8 left-6 z-20 flex max-w-[58vw] gap-2 sm:left-10 lg:left-14">
          {featured.map((project, index) => {
            if (!project) return null;
            const active = project.slug === selected.slug;
            return (
              <button
                key={project.slug}
                type="button"
                onClick={() => chooseProject(project.slug)}
                className={`group flex items-center gap-2 rounded-full border px-3 py-2 text-left backdrop-blur-md transition-all duration-500 ${active ? "border-sandstone/65 bg-[#14110f]/76 text-ivory" : "border-ivory/15 bg-[#14110f]/36 text-ivory/44 hover:border-ivory/36 hover:text-ivory"}`}
                aria-pressed={active}
              >
                <span className="text-[0.58rem] uppercase tracking-[0.2em]">0{index + 1}</span>
                <span className="hidden text-xs sm:inline">{project.title}</span>
              </button>
            );
          })}
        </div>

        <div className="absolute inset-y-0 right-0 z-10 flex w-full items-center px-6 sm:px-10 lg:w-[52%] lg:px-14 xl:px-20">
          <div className="w-full max-w-2xl lg:ml-auto">
            <div className="mb-7 flex items-center gap-3">
              <span className="text-[0.62rem] uppercase tracking-[0.22em] text-ivory/42">{selected.industry}</span>
              <span className="h-px flex-1 bg-ivory/16" />
              <span className="text-[0.62rem] uppercase tracking-[0.22em] text-sandstone">File {String(FEATURED_SLUGS.indexOf(selected.slug as (typeof FEATURED_SLUGS)[number]) + 1).padStart(2, "0")}</span>
            </div>

            <h2 className="font-display text-[clamp(3.4rem,8vw,8.8rem)] font-normal leading-[0.82] tracking-[-0.045em] text-ivory">
              {selected.title}
            </h2>

            <div className="mt-8 grid grid-cols-[auto_1fr] gap-5 sm:gap-8">
              <div className="relative pt-1">
                <div className="absolute left-[5px] top-5 h-[calc(100%-1.25rem)] w-px bg-ivory/14" />
                {PHASES.map((phase, index) => {
                  const active = index === phaseIndex;
                  const passed = index < phaseIndex;
                  return (
                    <div key={phase.key} className="relative flex h-12 items-start gap-3">
                      <motion.span
                        className="relative z-10 mt-1 h-3 w-3 rounded-full border"
                        animate={{
                          backgroundColor: active || passed ? "#C6A97A" : "rgba(20,17,15,.7)",
                          borderColor: active || passed ? "#C6A97A" : "rgba(244,239,230,.22)",
                          scale: active ? 1.35 : 1,
                        }}
                      />
                      <span className={`hidden pt-0.5 text-[0.58rem] uppercase tracking-[0.18em] transition-colors sm:block ${active ? "text-sandstone" : passed ? "text-ivory/52" : "text-ivory/24"}`}>
                        {phase.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="min-h-[19rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selected.slug}-${activePhase}`}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 26, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -18, filter: "blur(7px)" }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-sandstone">{currentPhase.prompt}</p>
                    <h3 className="mt-3 font-display text-4xl leading-none text-ivory sm:text-5xl">{currentPhase.label}</h3>
                    <p className="mt-6 max-w-xl text-base leading-[1.85] text-ivory/72 sm:text-lg">{shorten(phaseText)}</p>

                    {activePhase === "outcome" && primaryStat && (
                      <motion.div
                        className="mt-8 flex items-end gap-4"
                        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <span className="font-display text-5xl text-sandstone sm:text-7xl">{primaryStat.value}</span>
                        <span className="max-w-48 pb-2 text-xs leading-relaxed text-ivory/55">{primaryStat.label}</span>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between gap-5 border-t border-ivory/14 pt-5">
              <p className="text-xs text-ivory/38">Scroll to uncover the next layer.</p>
              <Link
                href={`/work/${selected.slug}`}
                onClick={() => track("evidence_case_opened", { project: selected.slug, page: "home" })}
                className="inline-flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-sandstone transition-colors hover:text-ivory"
              >
                Open the full case <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>

        <motion.div className="absolute bottom-0 left-0 z-30 h-[2px] origin-left bg-sandstone" style={{ scaleX: evidenceLine }} aria-hidden="true" />
      </div>
    </section>
  );
}
