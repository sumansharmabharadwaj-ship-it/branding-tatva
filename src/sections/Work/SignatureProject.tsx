"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { AnimatedStat } from "@/components/AnimatedStat";
import type { Project } from "@/data/projects";
import { getWorkTaxonomy } from "@/data/workTaxonomy";
import { WORK } from "@/sections/Work/palette";

// The measured-performance flagship is told as six beats: condition,
// perception, decision, response, practice, and verified result. The
// project-specific evidence diagram holds desaturated through ambiguity
// and regains full colour as the result resolves. CSS sticky keeps the
// document in normal flow. Reduced motion retains every beat and shows
// the diagram in its complete final state without autoplay.
const BEATS = [
  { key: "challenge", label: "Starting condition" },
  { key: "insight", label: "What people were perceiving" },
  { key: "strategy", label: "The decision" },
  { key: "execution", label: "The response" },
  { key: "reflection", label: "What changed in practice" },
  { key: "outcome", label: "Verified result" },
] as const;

export function SignatureProject({ project }: { project: Project }) {
  const [activeBeat, setActiveBeat] = useState(0);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useHydratedReducedMotion();
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const evidencePoster = getWorkTaxonomy(project.slug).evidencePoster;

  const reduceMotion = mounted && Boolean(prefersReducedMotion);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(entry.target.getAttribute("data-beat"));
          if (Number.isFinite(index)) setActiveBeat(index);
        }
      },
      { rootMargin: "-42% 0px -48% 0px" }
    );

    beatRefs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, [reduceMotion]);

  const beats = BEATS.map((beat) => ({
    key: beat.key as string,
    label: beat.label as string,
    text: project[beat.key as keyof Project] as string | undefined,
  })).filter((beat): beat is { key: string; label: string; text: string } => typeof beat.text === "string");

  const gray = reduceMotion ? 0 : Math.max(0, 0.85 * (1 - activeBeat / Math.max(1, beats.length - 1)));

  return (
    <section className="relative py-20 sm:py-28" style={{ backgroundColor: WORK.forest }}>
      <Container className="max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: WORK.sage }}>
          Signature project
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-display-sm font-normal text-white sm:text-display-md">
          {project.title}
        </h2>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em]" style={{ color: WORK.sage }}>
          {project.industry}
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="relative overflow-hidden rounded-2xl border transition-[filter] duration-700"
              style={{ filter: `grayscale(${gray.toFixed(2)})`, borderColor: "rgba(143,174,131,0.28)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={evidencePoster}
                alt={`${project.title} performance evidence diagram`}
                className="block h-auto w-full"
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed" style={{ color: WORK.sage }}>
              {reduceMotion
                ? "The complete evidence diagram remains visible without autoplay or scroll-controlled grading."
                : "The diagram holds its colour back until the story earns it: ambiguity first, verified result last."}
            </p>
            <ol className="mt-6 flex gap-2" aria-hidden="true">
              {beats.map((beat, index) => (
                <li
                  key={beat.key}
                  className="h-[3px] flex-1 rounded-full transition-colors duration-500"
                  style={{ backgroundColor: reduceMotion || index <= activeBeat ? WORK.sage : "rgba(143,174,131,0.25)" }}
                />
              ))}
            </ol>
          </div>

          <div>
            {beats.map((beat, index) => (
              <div
                key={beat.key}
                data-beat={index}
                ref={(element) => {
                  beatRefs.current[index] = element;
                }}
                className="border-l-2 py-10 pl-8 transition-colors duration-500 first:pt-2 sm:py-12"
                style={{ borderColor: reduceMotion || activeBeat === index ? WORK.sage : "rgba(143,174,131,0.2)" }}
              >
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-sm" style={{ color: WORK.sage }} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: WORK.sage }}>
                    {beat.label}
                  </span>
                </p>
                <p
                  className="mt-3 max-w-xl text-base leading-relaxed transition-opacity duration-500"
                  style={{ color: "rgba(242,240,232,0.92)", opacity: reduceMotion || activeBeat === index ? 1 : 0.66 }}
                >
                  {beat.text}
                </p>
                {beat.key === "outcome" && project.stats && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {project.stats.map((stat) => (
                      <div key={stat.label} className="rounded-2xl border p-4" style={{ borderColor: "rgba(143,174,131,0.3)" }}>
                        <p className="font-display text-3xl font-normal" style={{ color: WORK.sand }}>
                          <AnimatedStat value={stat.value} />
                        </p>
                        <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(242,240,232,0.75)" }}>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 pl-8">
              <LinkButton href={`/work/${project.slug}`} style={{ backgroundColor: WORK.moss }}>
                Read the full case study
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
