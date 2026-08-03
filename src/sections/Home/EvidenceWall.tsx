"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

function shorten(value: string | undefined, max = 360) {
  if (!value) return "This layer is documented in the complete case study.";
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
  const primaryStat = selected.stats?.[0];

  function chooseProject(slug: string) {
    setSelectedSlug(slug as (typeof FEATURED_SLUGS)[number]);
    setActivePhase("challenge");
    track("evidence_case_selected", { project: slug, page: "home" });
  }

  return (
    <section className="bg-[#14110f] px-6 py-20 text-ivory sm:px-10 sm:py-28 lg:px-14">
      <div className="mx-auto max-w-[92rem]">
        <div className="flex flex-col gap-6 border-b border-ivory/12 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-sandstone">Case investigation</p>
            <h2 className="mt-4 max-w-4xl font-display text-[clamp(2.8rem,6vw,6.4rem)] leading-[0.9] tracking-[-0.045em]">
              The result is the last thing you should look at.
            </h2>
          </div>
          <Link href="/work" className="text-xs font-medium uppercase tracking-[0.18em] text-sandstone hover:text-ivory">
            Complete archive ↗
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-3" aria-label="Choose a case study">
          {featured.map((project, index) => {
            if (!project) return null;
            const active = project.slug === selected.slug;
            return (
              <button
                key={project.slug}
                type="button"
                onClick={() => chooseProject(project.slug)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-3 text-xs uppercase tracking-[0.14em] transition-colors ${active ? "border-sandstone bg-sandstone text-soil" : "border-ivory/18 text-ivory/58 hover:border-ivory/45 hover:text-ivory"}`}
              >
                0{index + 1} · {project.title}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-soil/60">
              {selected.cardImage && (
                <Image
                  src={selected.cardImage}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: selected.cardImagePosition ?? "center" }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#14110f]/80 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-sandstone">{selected.industry}</p>
                <h3 className="mt-2 font-display text-[clamp(2.6rem,5vw,5.6rem)] leading-none">{selected.title}</h3>
              </div>
            </div>
            {primaryStat && (
              <div className="mt-6 flex items-end gap-4 border-t border-ivory/12 pt-6">
                <span className="font-display text-5xl text-sandstone sm:text-7xl">{primaryStat.value}</span>
                <span className="max-w-56 pb-2 text-sm leading-relaxed text-ivory/55">{primaryStat.label}</span>
              </div>
            )}
          </div>

          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5" role="tablist" aria-label="Choose investigation phase">
              {PHASES.map((phase) => {
                const active = phase.key === activePhase;
                return (
                  <button
                    key={phase.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActivePhase(phase.key)}
                    className={`min-h-12 rounded-xl border px-3 text-[0.62rem] uppercase tracking-[0.13em] transition-colors ${active ? "border-sandstone bg-sandstone text-soil" : "border-ivory/14 text-ivory/46 hover:border-ivory/35 hover:text-ivory"}`}
                  >
                    {phase.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-7 min-h-[22rem] rounded-[2rem] border border-ivory/12 bg-ivory/[0.035] p-6 sm:p-8">
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-sandstone">{currentPhase.prompt}</p>
              <h3 className="mt-3 font-display text-4xl sm:text-5xl">{currentPhase.label}</h3>
              <p className="mt-6 text-base leading-[1.8] text-ivory/72 sm:text-lg">{shorten(selected[activePhase])}</p>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-ivory/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ivory/42">Choose a phase to inspect the reasoning.</p>
              <Link
                href={`/work/${selected.slug}`}
                onClick={() => track("evidence_case_opened", { project: selected.slug, page: "home" })}
                className="text-xs font-medium uppercase tracking-[0.18em] text-sandstone hover:text-ivory"
              >
                Open the full case ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
