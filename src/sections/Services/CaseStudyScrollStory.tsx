"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "@/components/SmoothScrollProvider";
import { AnimatedStat } from "@/components/AnimatedStat";
import { LinkButton } from "@/components/Button";
import { Container } from "@/components/Container";
import { stageOpacity } from "@/lib/pinnedStageOpacity";
import type { Project } from "@/data/projects";

// The "Proof" objection, staged as a real scroll-driven story instead
// of a static case-study block — reuses the exact sticky + rect-top
// progress mechanism PinnedJourney already proves (position: sticky,
// no ScrollTrigger.pin needed here, this section doesn't need the
// timeline-scrub capability the one deliberate pin above does), fed
// with one real project's own challenge/insight/strategy/execution/
// outcome fields (data/projects.ts) — no invented narrative beats.
const STAGE_SPEED = 1.1;

type Stage = { label: string; text: string };

export function CaseStudyScrollStory({ project }: { project: Project }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();

  const stages: Stage[] = [
    { label: "The challenge", text: project.challenge },
    ...(project.insight ? [{ label: "The insight", text: project.insight }] : []),
    ...(project.strategy ? [{ label: "Strategy", text: project.strategy }] : []),
    ...(project.execution ? [{ label: "Execution", text: project.execution }] : []),
    { label: "Outcome", text: project.outcome },
  ];

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || prefersReducedMotion) return;

    function update() {
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const scrollDistance = (stages.length - 1) * window.innerHeight * STAGE_SPEED;
      const raw = scrollDistance > 0 ? -rect.top / scrollDistance : 0;
      const progress = Math.min(1, Math.max(0, raw)) * (stages.length - 1);
      const idx = Math.min(stages.length - 1, Math.round(progress));
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
      stageRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = String(stageOpacity(progress, i, 0.3));
      });
      // The brief's own "everything grey, then the insight appears and
      // colour returns" beat, built as a real, cheap CSS filter tied to
      // the same progress value already driving the text above — not a
      // new mechanism, and not new imagery. Fully desaturated on "The
      // challenge" (index 0), fully resolved to color by "The insight"
      // (index 1) — the exact narrative turn those two stages already
      // carry in the real copy.
      if (imageRef.current) {
        const colorProgress = Math.min(1, Math.max(0, progress));
        imageRef.current.style.filter = `grayscale(${(1 - colorProgress) * 0.85}) saturate(${0.4 + colorProgress * 0.6})`;
      }
    }

    update();
    const unsubscribe = lenis?.on("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe?.();
      window.removeEventListener("resize", update);
    };
  }, [lenis, prefersReducedMotion, stages.length]);

  if (prefersReducedMotion) {
    return (
      <Container className="max-w-2xl space-y-10">
        {stages.map((stage) => (
          <div key={stage.label}>
            <p className="text-sm font-medium uppercase tracking-wide text-sandstone">{stage.label}</p>
            <p className="mt-2 text-ivory/80">{stage.text}</p>
          </div>
        ))}
        <StatsRow project={project} />
      </Container>
    );
  }

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${(stages.length - 1) * 100 * STAGE_SPEED + 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={imageRef} className="absolute inset-0" style={{ filter: "grayscale(0.85) saturate(0.4)" }}>
          <Image
            src={project.cardImage ?? "/images/own-forest-clearing.jpg"}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(39,34,30,0.86)" }} />
        <Container className="relative flex h-full flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-sandstone">{project.industry}</p>
          <p className="mt-2 font-display text-2xl font-normal text-ivory sm:text-3xl">{project.title}</p>

          <div className="relative mt-8 max-w-xl">
            {stages.map((stage, i) => (
              <div
                key={stage.label}
                ref={(node) => {
                  stageRefs.current[i] = node;
                }}
                className="absolute inset-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <p className="text-sm font-medium uppercase tracking-wide" style={{ color: project.accent }}>
                  {stage.label}
                </p>
                <p className="mt-3 text-ivory/85 sm:text-lg">{stage.text}</p>
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-0 right-0">
            <Container>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-4">
                  {stages.map((stage, i) => (
                    <span
                      key={stage.label}
                      className="font-body text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-500"
                      style={{ color: i === activeIndex ? "#F4EFE6" : "rgba(244,239,230,0.4)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  ))}
                </div>
                <LinkButton href={`/work/${project.slug}`} variant="secondary" className="border-ivory/30 text-ivory hover:bg-ivory/10">
                  Read the full case study
                </LinkButton>
              </div>
            </Container>
          </div>
        </Container>
      </div>
    </div>
  );
}

function StatsRow({ project }: { project: Project }) {
  if (!project.stats?.length) return null;
  return (
    <div className="grid grid-cols-2 gap-6 border-t border-ivory/15 pt-6 sm:grid-cols-4">
      {project.stats.map((stat) => (
        <div key={stat.label}>
          <p className="font-display text-2xl font-normal text-sandstone">
            <AnimatedStat value={stat.value} />
          </p>
          <p className="mt-1 text-xs text-ivory/60">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
