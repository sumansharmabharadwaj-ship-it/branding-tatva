"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { AnimatedStat } from "@/components/AnimatedStat";
import { useVideoFadeIn } from "@/hooks/useVideoFadeIn";
import type { Project } from "@/data/projects";
import { WORK } from "@/sections/Work/palette";

// Work Page 2.0 signature project — the deep evidence chapter. One
// engagement told as six beats (condition, perception, decision,
// response, practice, verified result), a sticky media panel on the
// left, and the color itself narrating: the project's own footage
// holds desaturated through the ambiguity beats and regains full
// color as the story reaches its verified result. CSS sticky with an
// IntersectionObserver scroll spy — no pin, Lenis untouched, every
// ancestor overflow stays visible. Reduced motion renders the full
// sequence statically in color.
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
  const prefersReducedMotion = useReducedMotion();
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoFadeIn(videoRef, true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-beat"));
            if (Number.isFinite(idx)) setActiveBeat(idx);
          }
        }
      },
      { rootMargin: "-42% 0px -48% 0px" }
    );
    beatRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const beats = BEATS.map((b) => ({
    key: b.key as string,
    label: b.label as string,
    text: project[b.key as keyof Project] as string | undefined,
  })).filter((b): b is { key: string; label: string; text: string } => typeof b.text === "string");
  // Ambiguity drains to zero as the story resolves: fully desaturated
  // at the starting condition, full color by the verified result.
  const gray = prefersReducedMotion ? 0 : Math.max(0, 0.85 * (1 - activeBeat / Math.max(1, beats.length - 1)));

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
          {/* Sticky evidence panel — the project's own real footage,
              color graded by narrative position. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="overflow-hidden rounded-2xl transition-[filter] duration-700"
              style={{ filter: `grayscale(${gray.toFixed(2)})` }}
            >
              {project.cardVideo ? (
                <video
                  ref={videoRef}
                  className="block h-auto w-full opacity-0 transition-opacity duration-700"
                  src={project.cardVideo}
                  poster={project.cardImage}
                  muted
                  loop
                  playsInline
                  autoPlay
                  aria-hidden="true"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.cardImage} alt="" className="block h-auto w-full" />
              )}
            </div>
            <p className="mt-3 text-xs leading-relaxed" style={{ color: WORK.sage }}>
              The frame holds its color back until the story earns it: full grey at the starting condition, full color
              at the verified result.
            </p>
            {/* Beat progress — chapter markers, clickable nowhere,
                honest wayfinding for a long read. */}
            <ol className="mt-6 flex gap-2" aria-hidden="true">
              {beats.map((b, i) => (
                <li
                  key={b.key}
                  className="h-[3px] flex-1 rounded-full transition-colors duration-500"
                  style={{ backgroundColor: i <= activeBeat ? WORK.sage : "rgba(143,174,131,0.25)" }}
                />
              ))}
            </ol>
          </div>

          <div>
            {beats.map((beat, i) => (
              <div
                key={beat.key}
                data-beat={i}
                ref={(el) => {
                  beatRefs.current[i] = el;
                }}
                className="border-l-2 py-10 pl-8 transition-colors duration-500 first:pt-2 sm:py-12"
                style={{ borderColor: activeBeat === i ? WORK.sage : "rgba(143,174,131,0.2)" }}
              >
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-sm" style={{ color: WORK.sage }} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: WORK.sage }}>
                    {beat.label}
                  </span>
                </p>
                <p
                  className="mt-3 max-w-xl text-base leading-relaxed transition-opacity duration-500"
                  style={{ color: "rgba(242,240,232,0.92)", opacity: prefersReducedMotion || activeBeat === i ? 1 : 0.6 }}
                >
                  {beat.text}
                </p>
                {beat.key === "outcome" && project.stats && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {project.stats.map((stat) => (
                      <div key={stat.label} className="rounded-xl border p-4" style={{ borderColor: "rgba(143,174,131,0.3)" }}>
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
