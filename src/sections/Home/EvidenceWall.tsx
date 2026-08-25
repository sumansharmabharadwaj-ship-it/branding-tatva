"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Container } from "@/components/Container";
import { projects, type Project } from "@/data/projects";
import { ProjectFile } from "@/sections/Home/ProjectFile";

const SELECTED_PROJECTS = projects.filter((project) => project.featured);

const ACTION: Record<string, string> = {
  "dr-haley-nutrition": "Watch the story",
  myshopineurope: "Open the file",
  "executive-springboard": "View the case",
};

const DECISION: Record<string, { big: string; label: string }> = {
  myshopineurope: {
    big: "Craft over price",
    label: "the positioning refusal that reframed the platform",
  },
  "executive-springboard": {
    big: "One clear action",
    label: "every platform sequence designed toward webinar registration",
  },
};

const EVIDENCE_META: Record<string, { type: string; period: string; source: string }> = {
  "dr-haley-nutrition": {
    type: "Measured performance",
    period: "December 2025 → January 2026",
    source: "Instagram account comparison: 111 followers from 23 posts versus 126 from 12 posts. The homepage shows the raw per-post values instead of an unexplained percentage.",
  },
  myshopineurope: {
    type: "Delivered system",
    period: "Completed project output",
    source: "Brand foundation, channel playbooks and a quarter-by-quarter content operating plan.",
  },
  "executive-springboard": {
    type: "Documented decision + delivered system",
    period: "Completed project output",
    source: "Competitive audit, eight content pillars and platform-specific playbooks structured around webinar registration.",
  },
};

const TRAILS: Record<string, { signal: string; decision: string; proof: string }> = {
  "dr-haley-nutrition": {
    signal: "More posts were producing weaker audience response.",
    decision: "Post less, then make every remaining post earn its place.",
    proof: "Engagement moved from 0.71% to 2.81%; followers earned per Instagram post moved from 4.8 to 10.5.",
  },
  myshopineurope: {
    signal: "A new marketplace risked reading as generic access and cheap supply.",
    decision: "Position Indian craft, origin, and wellness heritage ahead of price.",
    proof: "A complete brand foundation and year-long content operating system.",
  },
  "executive-springboard": {
    signal: "Social content was building awareness without a clear destination.",
    decision: "Sequence each platform toward webinar registration and mentor action.",
    proof: "An eight-pillar, platform-specific content system built around conversion.",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

function trailFor(project: Project) {
  return (
    TRAILS[project.slug] ?? {
      signal: project.challenge,
      decision: project.strategy ?? project.insight ?? project.execution ?? "",
      proof: project.outcome,
    }
  );
}

function metricFor(project: Project) {
  if (project.slug === "dr-haley-nutrition") {
    return {
      big: "10.5 vs 4.8",
      label: "followers earned per Instagram post · January vs December",
    };
  }

  const stat = project.stats?.[0];
  const fallback = DECISION[project.slug];
  return {
    big: stat?.value ?? fallback?.big ?? "A clearer system",
    label: stat?.label ?? fallback?.label ?? project.hook ?? project.outcome,
  };
}

export function EvidenceWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const indexButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.42, margin: "4% 0px -8% 0px" });
  const activeProject = SELECTED_PROJECTS[activeIndex] ?? SELECTED_PROJECTS[0];
  const activeTrail = trailFor(activeProject);
  const activeMetric = metricFor(activeProject);
  const activeEvidence = EVIDENCE_META[activeProject.slug];

  const choose = useCallback((index: number) => {
    const nextIndex = ((index % SELECTED_PROJECTS.length) + SELECTED_PROJECTS.length) % SELECTED_PROJECTS.length;
    setActiveIndex(nextIndex);
  }, []);

  function chooseFromKeyboard(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0;
    if (!direction && event.key !== "Home" && event.key !== "End") return;

    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? SELECTED_PROJECTS.length - 1
        : (index + direction + SELECTED_PROJECTS.length) % SELECTED_PROJECTS.length;
    choose(nextIndex);
    indexButtonRefs.current[nextIndex]?.focus();
  }

  const closeProjectFile = useCallback(() => setOpenSlug(null), []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const videoAtEffectStart = activeVideoRef.current;

    function syncPlayback() {
      const video = activeVideoRef.current;
      if (!video) return;
      video.playbackRate = 0.86;
      if (inView && !document.hidden) void video.play().catch(() => {});
      else video.pause();
    }

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      videoAtEffectStart?.pause();
    };
  }, [activeIndex, inView, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="evidence-cinematic"
      aria-labelledby="evidence-wall-title"
      data-evidence-state={activeProject.slug}
      data-media-id="BT-HOME-SELECTED-WORK-CINEMATIC-V2"
      style={{ "--evidence-accent": activeProject.accent } as CSSProperties}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`evidence-backdrop-${activeProject.slug}`}
          className="evidence-cinematic__backdrop"
          aria-hidden="true"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.045 }}
          animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : 1.075 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ opacity: { duration: 0.9, ease: EASE }, scale: { duration: 11, ease: "linear" } }}
        >
          {activeProject.cardImage && (
            <Image
              src={activeProject.cardImage}
              alt=""
              fill
              priority={activeIndex === 0}
              sizes="100vw"
              className="evidence-cinematic__backdrop-image"
              style={{ objectPosition: activeProject.cardImagePosition ?? "center" }}
            />
          )}
          {!prefersReducedMotion && activeProject.cardVideo && (
            <video
              ref={activeVideoRef}
              className="evidence-cinematic__backdrop-video"
              src={activeProject.cardVideo}
              poster={activeProject.cardImage}
              muted
              loop
              autoPlay
              playsInline
              preload={inView ? "metadata" : "none"}
              data-home-playback-rate="0.86"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="evidence-cinematic__veil" aria-hidden="true" />

      <Container className="evidence-cinematic__shell max-w-[100rem]">
        <header className="evidence-cinematic__header">
          <div>
            <p className="evidence-cinematic__eyebrow">04 · Selected work</p>
            <h2 id="evidence-wall-title">Proof should <em>show its working.</em></h2>
          </div>
          <div className="evidence-cinematic__intro">
            <span>{String(activeIndex + 1).padStart(2, "0")} / {String(SELECTED_PROJECTS.length).padStart(2, "0")}</span>
            <p>One real signal. One strategic decision. One outcome you can inspect.</p>
          </div>
        </header>

        <div className="evidence-cinematic__stage">
          <AnimatePresence mode="sync" initial={false}>
            <motion.article
              key={`evidence-summary-${activeProject.slug}`}
              id="evidence-active-file"
              role="tabpanel"
              aria-labelledby={`evidence-tab-${activeIndex}`}
              className="evidence-cinematic__summary"
              data-home-reading-plane
              aria-live="polite"
              initial={false}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10, filter: "blur(3px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.58, ease: EASE }}
            >
              <p>{activeProject.title} · {activeProject.industry}</p>
              <strong>{activeMetric.big}</strong>
              <span>{activeMetric.label}</span>
              <div className="evidence-cinematic__proof-line" aria-label="Decision trail">
                {[
                  ["Signal", activeTrail.signal],
                  ["Decision", activeTrail.decision],
                  ["Proof", activeTrail.proof],
                ].map(([label, value]) => (
                  <div key={label}>
                    <small>{label}</small>
                    <p>{value}</p>
                  </div>
                ))}
              </div>

              {activeEvidence && (
                <p className="evidence-cinematic__source">
                  <span>{activeEvidence.type} · {activeEvidence.period}</span>
                  {activeEvidence.source}
                </p>
              )}

              <div className="evidence-cinematic__actions">
                <button type="button" onClick={() => setOpenSlug(activeProject.slug)}>
                  Inspect the project file <span aria-hidden="true">↗</span>
                </button>
                <Link href={`/work/${activeProject.slug}`}>
                  {ACTION[activeProject.slug] ?? "View the case"} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="evidence-cinematic__index" role="tablist" aria-label="Choose a project case">
          {SELECTED_PROJECTS.map((project, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={project.slug}
                type="button"
                role="tab"
                id={`evidence-tab-${index}`}
                aria-selected={selected}
                aria-controls="evidence-active-file"
                tabIndex={selected ? 0 : -1}
                ref={(node) => { indexButtonRefs.current[index] = node; }}
                className={selected ? "is-active" : undefined}
                style={{ "--project-accent": project.accent } as CSSProperties}
                onClick={() => choose(index)}
                onKeyDown={(event) => chooseFromKeyboard(event, index)}
              >
                <span className="evidence-cinematic__index-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="evidence-cinematic__index-copy">
                  <strong>{project.title}</strong>
                  <em>{project.industry}</em>
                </span>
                <i aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </Container>

      <ProjectFile
        project={SELECTED_PROJECTS.find((project) => project.slug === openSlug) ?? null}
        onClose={closeProjectFile}
      />
    </section>
  );
}
