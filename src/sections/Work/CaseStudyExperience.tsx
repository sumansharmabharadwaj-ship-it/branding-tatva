"use client";

import { useHydratedMotionPreference, useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { AnimatedStat } from "@/components/AnimatedStat";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Reveal } from "@/components/Reveal";
import type { Project } from "@/data/projects";
import type { CaseStudyPresentation } from "@/data/caseStudyPresentation";
import { track } from "@/lib/analytics";

const EASE = [0.22, 1, 0.36, 1] as const;
const STORY_AUTOPLAY_MS = 5600;
const STORY_USER_HOLD_MS = 16000;

type Chapter = {
  id: string;
  label: string;
  title: string;
  body: string;
};

type Props = {
  project: Project;
  presentation: CaseStudyPresentation;
  tierLabel: string;
  evidenceLabel: string;
  evidenceAlt: string;
  previous: Project;
  next: Project;
};

function firstSentence(text: string) {
  return text.split(/(?<=\.)\s/)[0];
}

function buildChapters(project: Project): Chapter[] {
  const raw: Array<Chapter | null> = [
    {
      id: "challenge",
      label: "Starting condition",
      title: "The real problem beneath the requested output",
      body: project.challenge,
    },
    project.audience
      ? {
          id: "audience",
          label: "Audience",
          title: "Who had to understand, trust, or choose differently",
          body: project.audience,
        }
      : null,
    project.insight
      ? {
          id: "diagnosis",
          label: "Strategic diagnosis",
          title: "The observation that changed the direction",
          body: project.insight,
        }
      : null,
    project.strategy
      ? {
          id: "strategy",
          label: "Central decision",
          title: "The choice the rest of the work had to obey",
          body: project.strategy,
        }
      : null,
    project.execution
      ? {
          id: "execution",
          label: "System in motion",
          title: "How the decision travelled through the work",
          body: project.execution,
        }
      : null,
    {
      id: "outcome",
      label: "Outcome on record",
      title: "What the engagement actually produced",
      body: project.outcome,
    },
    project.reflection
      ? {
          id: "reflection",
          label: "Reflection",
          title: "The decision worth carrying into the next project",
          body: project.reflection,
        }
      : null,
  ];

  return raw.filter(Boolean) as Chapter[];
}

function ManagedVideo({
  src,
  poster,
  className,
  imageAlt = "",
  preload = "metadata",
}: {
  src?: string;
  poster?: string;
  className: string;
  imageAlt?: string;
  preload?: "none" | "metadata";
}) {
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!hydrated || !video || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          const attempt = video.play();
          if (attempt) attempt.catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.22 }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [hydrated, prefersReducedMotion]);

  if (!hydrated || !src || prefersReducedMotion) {
    return poster ? (
      <Image
        src={poster}
        alt={imageAlt ?? ""}
        width={1600}
        height={900}
        sizes="100vw"
        className={className}
      />
    ) : null;
  }

  return (
    <div className="absolute inset-0">
      {poster && (
        <Image
          src={poster}
          alt={imageAlt ?? ""}
          width={1600}
          height={900}
          sizes="100vw"
          className={`${className} transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
        />
      )}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload={preload}
        aria-hidden="true"
        onCanPlay={() => setReady(true)}
        className={`${className} transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

function PerformanceVisual({ progress, accent, secondary }: { progress: number; accent: string; secondary: string }) {
  const volume = 92 - progress * 44;
  const relevance = 34 + progress * 62;

  return (
    <div className="grid h-full grid-cols-2 items-end gap-6 px-3 pb-2 pt-8 sm:px-7">
      <div className="flex h-full flex-col justify-end">
        <div className="relative h-[70%] overflow-hidden rounded-t-2xl border border-white/15 bg-black/20">
          <motion.div
            className="absolute inset-x-0 bottom-0 rounded-t-2xl"
            animate={{ height: `${volume}%` }}
            transition={{ duration: 0.65, ease: EASE }}
            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
          />
          <span className="absolute left-3 top-3 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-white/65">Publishing volume</span>
        </div>
        <p className="mt-3 font-display text-2xl text-white">23 → 12</p>
        <p className="text-xs text-white/60">Instagram posts</p>
      </div>
      <div className="flex h-full flex-col justify-end">
        <div className="relative h-[70%] overflow-hidden rounded-t-2xl border border-white/15 bg-black/20">
          <motion.div
            className="absolute inset-x-0 bottom-0 rounded-t-2xl"
            animate={{ height: `${relevance}%` }}
            transition={{ duration: 0.65, ease: EASE }}
            style={{ background: `linear-gradient(180deg, ${accent}, ${secondary})` }}
          />
          <span className="absolute left-3 top-3 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-white/75">Value per post</span>
        </div>
        <p className="mt-3 font-display text-2xl" style={{ color: secondary }}>104%</p>
        <p className="text-xs text-white/60">more followers per post</p>
      </div>
    </div>
  );
}

function SystemVisual({
  active,
  artifacts,
  accent,
}: {
  active: number;
  artifacts: CaseStudyPresentation["artifacts"];
  accent: string;
}) {
  const settled = active >= 3;
  const revealed = Math.max(1, active);

  return (
    <>
      <div className="grid h-full grid-cols-2 content-center gap-2 px-3 py-3 sm:hidden">
        {artifacts.map((artifact, index) => {
          const visible = index <= revealed;
          return (
            <motion.div
              key={artifact.label}
              data-system-card-mobile
              className="flex min-h-[4.25rem] flex-col justify-between rounded-xl border p-3"
              animate={{ opacity: visible ? 1 : 0.32, y: visible ? 0 : 5, scale: visible ? 1 : 0.97 }}
              transition={{ duration: 0.48, ease: EASE }}
              style={{
                borderColor: visible ? `${accent}88` : "rgba(255,255,255,0.14)",
                backgroundColor: visible ? "rgba(31,58,40,0.78)" : "rgba(8,13,16,0.56)",
              }}
            >
              <span
                className="text-[0.52rem] font-medium uppercase tracking-[0.14em]"
                style={{ color: visible ? accent : "rgba(255,255,255,0.38)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 line-clamp-2 font-display text-sm leading-tight text-white/85">
                {artifact.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="relative hidden h-full px-7 pb-4 pt-10 sm:block">
        {artifacts.map((artifact, index) => (
          <motion.div
            key={artifact.label}
            className="absolute inset-x-7 rounded-2xl border p-4 backdrop-blur-md"
            animate={{
              y: settled ? index * 68 : index * 42,
              x: settled ? 0 : (index - 1.5) * 8,
              rotate: settled ? 0 : (index - 1.5) * 1.2,
              opacity: index <= Math.max(1, active) ? 1 : 0.38,
            }}
            transition={{ duration: 0.65, ease: EASE }}
            style={{
              top: "1.25rem",
              borderColor: settled ? `${accent}88` : "rgba(255,255,255,0.18)",
              backgroundColor: settled ? "rgba(31,58,40,0.82)" : "rgba(8,13,16,0.68)",
            }}
          >
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em]" style={{ color: accent }}>
              {String(index + 1).padStart(2, "0")} · {artifact.label}
            </p>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/75">{artifact.detail}</p>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function JourneyVisual({ progress, accent, secondary }: { progress: number; accent: string; secondary: string }) {
  const nodes = ["Content", "Webinar", "Registration"];
  return (
    <div className="flex h-full flex-col justify-center px-5 sm:px-10">
      <div className="relative">
        <div className="absolute left-[10%] right-[10%] top-5 h-px bg-white/20" />
        <motion.div
          className="absolute left-[10%] top-5 h-px"
          animate={{ width: `${Math.max(0, Math.min(80, progress * 80))}%` }}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ background: `linear-gradient(90deg, ${accent}, ${secondary})` }}
        />
        <ol className="relative flex justify-between">
          {nodes.map((node, index) => {
            const threshold = index / Math.max(1, nodes.length - 1);
            const reached = progress >= threshold - 0.05;
            return (
              <li key={node} className="flex w-24 flex-col items-center text-center">
                <motion.span
                  className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium"
                  animate={{ scale: reached ? 1 : 0.88 }}
                  style={{
                    borderColor: reached ? accent : "rgba(255,255,255,0.25)",
                    backgroundColor: reached ? `${accent}33` : "rgba(0,0,0,0.18)",
                    color: reached ? "white" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {index + 1}
                </motion.span>
                <span className="mt-3 text-xs uppercase tracking-[0.12em] text-white/70">{node}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mx-auto mt-12 max-w-sm text-center font-display text-2xl text-white">
        Attention is unfinished until the path has somewhere to end.
      </p>
    </div>
  );
}

function PerceptionVisual({
  progress,
  from,
  to,
  accent,
  secondary,
}: {
  progress: number;
  from: string;
  to: string;
  accent: string;
  secondary: string;
}) {
  return (
    <div className="grid h-full grid-cols-2 gap-3 p-4 sm:gap-5 sm:p-7">
      <motion.div
        className="flex flex-col justify-between rounded-2xl border border-white/15 bg-black/20 p-4 sm:p-5"
        animate={{ opacity: 1 - progress * 0.55, scale: 1 - progress * 0.03 }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-white/50">Assumed category</p>
        <p className="font-display text-2xl leading-tight text-white/70 sm:text-3xl">{from}</p>
      </motion.div>
      <motion.div
        className="flex flex-col justify-between rounded-2xl border p-4 sm:p-5"
        animate={{ opacity: 0.45 + progress * 0.55, scale: 0.97 + progress * 0.03 }}
        transition={{ duration: 0.65, ease: EASE }}
        style={{ borderColor: `${accent}88`, background: `linear-gradient(145deg, ${accent}22, ${secondary}18)` }}
      >
        <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em]" style={{ color: secondary }}>Intended frame</p>
        <p className="font-display text-2xl leading-tight text-white sm:text-3xl">{to}</p>
      </motion.div>
    </div>
  );
}

function AuthorityVisual({
  active,
  artifacts,
  accent,
}: {
  active: number;
  artifacts: CaseStudyPresentation["artifacts"];
  accent: string;
}) {
  return (
    <div className="grid h-full min-h-0 grid-cols-2 grid-rows-2 gap-1.5 p-2 sm:gap-5 sm:p-7">
      {artifacts.map((artifact, index) => {
        const visible = index <= Math.max(0, active - 1);
        return (
          <motion.div
            key={artifact.label}
            className="min-h-0 overflow-hidden rounded-lg border p-2 sm:rounded-2xl sm:p-5"
            animate={{ opacity: visible ? 1 : 0.34, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{
              borderColor: visible ? `${accent}77` : "rgba(255,255,255,0.14)",
              backgroundColor: visible ? `${accent}18` : "rgba(0,0,0,0.16)",
            }}
          >
            <p className="text-[0.48rem] font-medium uppercase tracking-[0.12em] sm:text-[0.58rem] sm:tracking-[0.14em]" style={{ color: visible ? accent : "rgba(255,255,255,0.42)" }}>
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-0.5 line-clamp-2 font-display text-[0.78rem] leading-[0.95] text-white sm:mt-2 sm:text-2xl sm:leading-tight">{artifact.label}</p>
            <p className="mt-2 hidden line-clamp-3 text-xs leading-relaxed text-white/60 sm:block">{artifact.detail}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

function NarrativeVisual({
  project,
  presentation,
  active,
  total,
}: {
  project: Project;
  presentation: CaseStudyPresentation;
  active: number;
  total: number;
}) {
  const progress = total <= 1 ? 1 : active / (total - 1);
  const { palette } = presentation;

  return (
    <div className="overflow-hidden rounded-[1.6rem] border shadow-[0_28px_90px_rgba(0,0,0,0.28)]" style={{ borderColor: `${palette.accent}44`, backgroundColor: palette.surface }}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {project.cardImage && (
          <Image
            src={project.cardImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${palette.ink}66, ${palette.ink}F2 72%)` }} />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
          <span
  data-narrative-descriptor
  className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.15em] text-white/75 backdrop-blur-sm"
>
  <span className="sm:hidden">Evidence map</span>
  <span className="hidden sm:inline">{presentation.descriptor}</span>
</span>
          <span className="font-display text-sm text-white/65">
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 top-14">
          {presentation.mode === "performance" && <PerformanceVisual progress={progress} accent={palette.accent} secondary={palette.secondary} />}
          {presentation.mode === "system" && <SystemVisual active={active} artifacts={presentation.artifacts} accent={palette.accent} />}
          {presentation.mode === "journey" && <JourneyVisual progress={progress} accent={palette.accent} secondary={palette.secondary} />}
          {presentation.mode === "perception" && (
            <PerceptionVisual
              progress={progress}
              from={presentation.transformation.from}
              to={presentation.transformation.to}
              accent={palette.accent}
              secondary={palette.secondary}
            />
          )}
          {presentation.mode === "authority" && <AuthorityVisual active={active} artifacts={presentation.artifacts} accent={palette.accent} />}
        </div>
      </div>
      <div className="h-1 bg-white/10">
        <motion.div
          className="h-full"
          animate={{ width: `${Math.max(8, (active + 1) / total * 100)}%` }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ background: `linear-gradient(90deg, ${palette.accent}, ${palette.secondary})` }}
        />
      </div>
    </div>
  );
}

function ProjectNeighbour({ project, direction, accent }: { project: Project; direction: "Previous" | "Next"; accent: string }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative min-h-64 overflow-hidden rounded-[1.4rem] border border-white/15 bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ outlineColor: accent }}
    >
      {project.cardImage && (
        <Image
          src={project.cardImage}
          alt=""
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-45 transition-transform duration-700 group-hover:scale-[1.025]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-white/60">{direction} project</p>
        <div>
          <p className="text-xs uppercase tracking-[0.13em]" style={{ color: accent }}>{project.industry}</p>
          <h3 className="mt-1 font-display text-3xl text-white">{project.title}</h3>
          <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white">
            Open project <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CaseStudyExperience({ project, presentation, tierLabel, evidenceLabel, evidenceAlt, previous, next }: Props) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const chapters = buildChapters(project);
  const [activeChapter, setActiveChapter] = useState(0);
  const storyRef = useRef<HTMLElement>(null);
  const storyUserHoldUntilRef = useRef(0);
  const { palette } = presentation;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const story = storyRef.current;
    if (!story) return;

    let intervalId: number | undefined;
    const stop = () => {
      if (intervalId === undefined) return;
      window.clearInterval(intervalId);
      intervalId = undefined;
    };
    const start = () => {
      if (intervalId !== undefined) return;
      intervalId = window.setInterval(() => {
        if (document.hidden || Date.now() < storyUserHoldUntilRef.current) return;
        setActiveChapter((current) => (current + 1) % chapters.length);
      }, STORY_AUTOPLAY_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
        else stop();
      },
      { threshold: 0.42 }
    );

    observer.observe(story);
    return () => {
      stop();
      observer.disconnect();
    };
  }, [chapters.length, prefersReducedMotion]);

  return (
    <>
      <section className="relative min-h-[82vh] overflow-hidden" style={{ backgroundColor: palette.ink }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 hidden sm:block">
            <ManagedVideo
              src={project.heroVideo}
              poster={project.heroPoster ?? project.cardImage}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 sm:hidden"
            style={{
              background: `radial-gradient(circle at 82% 16%, ${palette.accent}2E, transparent 34%), linear-gradient(180deg, ${palette.ink} 0%, ${palette.surface} 100%)`,
            }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${palette.ink}66 0%, ${palette.ink}B8 60%, ${palette.ink}F5 100%)` }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 78% 22%, ${palette.accent}33, transparent 38%)` }} />
        </div>

        <Container className="relative flex min-h-[82vh] flex-col justify-end pb-14 pt-32 sm:pb-20 sm:pt-40">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
            <div>
              <Reveal>
                <Link href="/services#proof" className="link-underline inline-flex min-h-11 items-center text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                  Client proof
                </Link>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/20 bg-black/15 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.15em] text-white/75 backdrop-blur-sm">
                    {tierLabel}
                  </span>
                  <span className="rounded-full border px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.15em]" style={{ borderColor: `${palette.accent}88`, color: palette.secondary }}>
                    {evidenceLabel}
                  </span>
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.17em]" style={{ color: palette.secondary }}>
                  {project.industry}
                </p>
                <h1 className="mt-2 max-w-4xl font-display text-[clamp(3rem,7vw,6.4rem)] font-normal leading-[0.96] tracking-[-0.025em] text-white">
                  {project.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
                  {project.hook ?? presentation.resultSummary}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="rounded-[1.4rem] border border-white/15 bg-black/20 p-5 backdrop-blur-md sm:p-6">
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: palette.secondary }}>
                  Change on record
                </p>
                <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div>
                    <p className="text-[0.56rem] uppercase tracking-[0.15em] text-white/45">From</p>
                    <p className="mt-1 font-display text-2xl leading-tight text-white/70">{presentation.transformation.from}</p>
                  </div>
                  <span className="hidden text-white/35 sm:block" aria-hidden="true">→</span>
                  <div>
                    <p className="text-[0.56rem] uppercase tracking-[0.15em]" style={{ color: palette.accent }}>To</p>
                    <p className="mt-1 font-display text-2xl leading-tight text-white">{presentation.transformation.to}</p>
                  </div>
                </div>
                <div className="mt-6 border-t border-white/15 pt-5">
                  <p className="text-[0.56rem] uppercase tracking-[0.15em] text-white/45">Scope</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.services.map((service) => (
                      <span key={service} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {(project.heroPoster ?? project.cardImage) && (
            <figure
              className="mt-8 overflow-hidden rounded-[1.4rem] border sm:hidden"
              style={{ borderColor: `${palette.accent}55`, backgroundColor: palette.surface }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
                <Image
                  src={(project.heroPoster ?? project.cardImage)!}
                  alt={evidenceAlt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-16"
                  style={{ background: `linear-gradient(180deg, transparent, ${palette.surface}CC)` }}
                />
              </div>
              <figcaption
                className="flex items-center justify-between gap-4 border-t px-4 py-3 text-[0.58rem] font-medium uppercase tracking-[0.15em]"
                style={{ borderColor: `${palette.accent}44`, color: palette.secondary }}
              >
                <span>Project evidence</span>
                <span>{evidenceLabel}</span>
              </figcaption>
            </figure>
          )}

          <a href="#result" className="mt-10 inline-flex min-h-11 w-fit items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
            See the result first <span aria-hidden="true">↓</span>
          </a>
        </Container>
      </section>

      <section id="result" className="scroll-mt-24 py-14 sm:py-20" style={{ backgroundColor: palette.paper }}>
        <Container className="max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-16">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: palette.accent }}>
                Recorded result
              </p>
              <h2 className="mt-2 font-display text-3xl font-normal leading-tight sm:text-4xl" style={{ color: palette.ink }}>
                Start with what the record can support.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-3xl font-display text-2xl leading-relaxed sm:text-3xl" style={{ color: palette.ink }}>
                {presentation.resultSummary}
              </p>
              {project.stats ? (
                <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: `${palette.accent}44`, backgroundColor: "rgba(255,255,255,0.42)" }}>
                      <p className="font-display text-3xl font-normal sm:text-4xl" style={{ color: palette.accent }}>
                        <AnimatedStat value={stat.value} />
                      </p>
                      <p className="mt-2 text-xs leading-relaxed" style={{ color: palette.ink }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border p-5" style={{ borderColor: `${palette.accent}44`, backgroundColor: "rgba(255,255,255,0.42)" }}>
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em]" style={{ color: palette.accent }}>Evidence boundary</p>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: palette.ink }}>
                    No performance metric is claimed for this engagement. The recorded outcome is the strategy, system, or campaign material delivered.
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      <section ref={storyRef} id="story" className="scroll-mt-24 py-14 sm:py-16" style={{ backgroundColor: palette.ink }}>
        <Container className="max-w-6xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: palette.secondary }}>
              Decision record
            </p>
            <h2 className="mt-2 max-w-3xl font-display text-4xl font-normal leading-tight text-white sm:text-5xl">
              What was made, and why it was made that way.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-16">
            <div>
              <NarrativeVisual project={project} presentation={presentation} active={activeChapter} total={chapters.length} />
              <ol className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7" aria-label="Case study chapters">
                {chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <button
                      type="button"
                      aria-current={activeChapter === index ? "step" : undefined}
                      onClick={() => {
                        storyUserHoldUntilRef.current = Date.now() + STORY_USER_HOLD_MS;
                        setActiveChapter(index);
                      }}
                      className="min-h-11 w-full rounded-full border text-[0.58rem] font-medium uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        borderColor: activeChapter === index ? palette.accent : "rgba(255,255,255,0.16)",
                        backgroundColor: activeChapter === index ? `${palette.accent}22` : "transparent",
                        color: activeChapter === index ? palette.secondary : "rgba(255,255,255,0.45)",
                        outlineColor: palette.accent,
                      }}
                      title={chapter.label}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="min-h-[22rem] sm:min-h-[24rem] lg:flex lg:min-h-[28rem] lg:items-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={chapters[activeChapter]?.id}
                  id={chapters[activeChapter]?.id}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.46, ease: EASE }}
                  className="w-full border-l-2 py-8 pl-7 sm:pl-9"
                  style={{ borderColor: palette.accent }}
                >
                  <div>
                    <p className="flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.18em]" style={{ color: palette.secondary }}>
                      <span className="font-display text-base" aria-hidden="true">{String(activeChapter + 1).padStart(2, "0")}</span>
                      {chapters[activeChapter]?.label}
                    </p>
                    <h3 className="mt-3 max-w-xl font-display text-3xl font-normal leading-tight text-white sm:text-4xl">
                      {chapters[activeChapter]?.title}
                    </h3>
                    <p
                      className="mt-5 max-w-xl text-base leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.78)" }}
                    >
                      {chapters[activeChapter]?.body}
                    </p>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </section>

      <section id="system" className="scroll-mt-24 py-20 sm:py-28" style={{ backgroundColor: palette.paper }}>
        <Container className="max-w-6xl">
          <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: palette.accent }}>
              What the work contained
            </p>
            <h2 className="mt-2 max-w-3xl font-display text-4xl font-normal leading-tight sm:text-5xl" style={{ color: palette.ink }}>
              Inspect the decisions inside the deliverable.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border shadow-[0_24px_70px_rgba(0,0,0,0.12)]" style={{ borderColor: `${palette.accent}33`, backgroundColor: palette.surface }}>
                <ManagedVideo
                  src={project.cardVideo}
                  poster={project.cardImage}
                  imageAlt={evidenceAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                  preload="none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em]" style={{ color: palette.secondary }}>
                    Project evidence
                  </p>
                  <p className="mt-1 max-w-xl font-display text-2xl text-white sm:text-3xl">
                    {project.closingQuote ?? project.hook ?? firstSentence(project.outcome)}
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {presentation.artifacts.slice(0, 2).map((artifact, index) => (
                <Reveal key={artifact.label} delay={index * 0.06}>
                  <div className="h-full rounded-[1.35rem] border p-5 sm:p-6" style={{ borderColor: `${palette.accent}44`, backgroundColor: "rgba(255,255,255,0.42)" }}>
                    <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em]" style={{ color: palette.accent }}>
                      {String(index + 1).padStart(2, "0")} · {artifact.label}
                    </p>
                    <p className="mt-3 text-base leading-relaxed" style={{ color: palette.ink }}>{artifact.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {presentation.artifacts.slice(2).map((artifact, index) => (
              <Reveal key={artifact.label} delay={0.1 + index * 0.06} className={index % 2 === 0 ? "lg:col-span-5" : "lg:col-span-7"}>
                <div className="h-full rounded-[1.35rem] border p-5 sm:p-7" style={{ borderColor: `${palette.accent}44`, backgroundColor: "rgba(255,255,255,0.42)" }}>
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em]" style={{ color: palette.accent }}>
                    {String(index + 3).padStart(2, "0")} · {artifact.label}
                  </p>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed" style={{ color: palette.ink }}>{artifact.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="outcome-summary" className="scroll-mt-24 py-20 sm:py-28" style={{ backgroundColor: palette.surface }}>
        <Container className="max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: palette.secondary }}>
                Outcome and boundary
              </p>
              <h2 className="mt-2 font-display text-4xl font-normal leading-tight text-white sm:text-5xl">
                What can be claimed, and what cannot.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-lg leading-relaxed text-white/80">{project.outcome}</p>
              {project.reflection && (
                <blockquote className="mt-8 border-l-2 pl-5 font-display text-2xl leading-relaxed text-white" style={{ borderColor: palette.accent }}>
                  {project.reflection}
                </blockquote>
              )}
              <div className="mt-8 border-t border-white/15 pt-6">
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-white/45">Services in scope</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.services.map((service) => (
                    <Link
                      key={service}
                      href={presentation.serviceHref}
                      className="inline-flex min-h-11 items-center rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-white/10"
                      style={{ borderColor: `${palette.accent}66`, color: palette.secondary }}
                    >
                      {service}
                    </Link>
                  ))}
                </div>
                <Link href={presentation.serviceHref} className="link-underline mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium" style={{ color: palette.secondary }}>
                  Relevant service path: {presentation.serviceLabel} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden py-20 sm:py-28" style={{ backgroundColor: palette.ink }}>
        <BackgroundVideo
          video="/videos/generated/bt-work-decision-trace.mp4"
          poster="/images/generated/bt-work-decision-trace-poster.jpg"
          imagePosition="center"
          parallax
          playbackRate={0.9}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${palette.ink}E8, ${palette.ink}A8 52%, ${palette.ink}D6)` }} />
        <Container className="relative max-w-5xl text-center">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: palette.secondary }}>If this is your problem</p>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-normal leading-tight text-white sm:text-5xl">
              {presentation.ctaHeading}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75">
              {presentation.ctaBody}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <Link
                href="/contact"
                onClick={() => track("contextual_cta_clicked", { source: `case_study_${project.slug}` })}
                className="inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: palette.accent, outlineColor: palette.accent }}
              >
                Bring this problem to Suman
              </Link>
              <Link href={presentation.serviceHref} className="link-underline inline-flex min-h-11 items-center text-sm font-medium text-white">
                See {presentation.serviceLabel} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-24" style={{ backgroundColor: palette.ink }}>
        <Container className="max-w-6xl">
          <div className="grid gap-5 lg:grid-cols-2">
            <ProjectNeighbour project={previous} direction="Previous" accent={palette.accent} />
            <ProjectNeighbour project={next} direction="Next" accent={palette.accent} />
          </div>
        </Container>
      </section>
    </>
  );
}
