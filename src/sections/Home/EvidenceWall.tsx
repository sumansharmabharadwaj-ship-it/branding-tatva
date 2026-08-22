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
  herbalcart: "View the case",
  "plaxonic-content-portfolio": "Open the file",
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
  herbalcart: {
    big: "Wellness first",
    label: "perception moved from herbal supplement to modern brand",
  },
};

const EVIDENCE_META: Record<string, { type: string; source: string }> = {
  "dr-haley-nutrition": {
    type: "Measured platform performance · Dec 2025–Jan 2026",
    source: "Documented account comparison in the project file",
  },
  myshopineurope: {
    type: "Delivered brand and content operating system",
    source: "Completed foundation, channel playbooks and quarterly rollout",
  },
  "executive-springboard": {
    type: "Delivered conversion-led content system",
    source: "Completed competitive audit, eight pillars and platform playbooks",
  },
};

const TRAILS: Record<string, { signal: string; decision: string; proof: string }> = {
  "dr-haley-nutrition": {
    signal: "More posts were producing weaker audience response.",
    decision: "Post less, then make every remaining post earn its place.",
    proof: "Engagement moved from 0.71% to 2.81%; followers earned per post rose 104%.",
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
  herbalcart: {
    signal: "A modern supplement range was being read through a purely herbal lens.",
    decision: "Explain supplementation as a practical gap-filler for active lifestyles.",
    proof: "Five content formats ready to shoot and complete Hinglish video scripts.",
  },
  "plaxonic-content-portfolio": {
    signal: "One content tone failed to serve beginners and technical experts with equal credibility.",
    decision: "Give research, perspective, education, and fast consumption different jobs.",
    proof: "A sixteen-piece authority portfolio structured to validate, challenge, humanise, and define.",
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
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.22, margin: "8% 0px -12% 0px" });
  const activeProject = SELECTED_PROJECTS[activeIndex] ?? SELECTED_PROJECTS[0];
  const activeTrail = trailFor(activeProject);
  const activeMetric = metricFor(activeProject);
  const activeEvidence = EVIDENCE_META[activeProject.slug];

  function choose(index: number) {
    if (!SELECTED_PROJECTS.length) return;
    const safeIndex = ((index % SELECTED_PROJECTS.length) + SELECTED_PROJECTS.length) % SELECTED_PROJECTS.length;
    setActiveIndex(safeIndex);
  }

  function chooseFromKeyboard(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    const keyDirection = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0;
    if (!keyDirection && event.key !== "Home" && event.key !== "End") return;

    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? SELECTED_PROJECTS.length - 1
        : (index + keyDirection + SELECTED_PROJECTS.length) % SELECTED_PROJECTS.length;
    choose(nextIndex);
    indexButtonRefs.current[nextIndex]?.focus();
  }

  const closeProjectFile = useCallback(() => setOpenSlug(null), []);

  useEffect(() => {
    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== "evidence") return;
      setActiveIndex(0);
    }

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => window.removeEventListener("bt:home-chapter", onChapter as EventListener);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const videoAtEffectStart = activeVideoRef.current;

    function syncPlayback() {
      const video = activeVideoRef.current;
      if (!video) return;
      video.playbackRate = 1.2;
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
      data-evidence-autoplay="visitor-led"
      data-media-id="BT-HOME-SELECTED-WORK-ARCHIVE-V1"
      style={{ "--evidence-accent": activeProject.accent } as CSSProperties}
    >
      <div className="evidence-cinematic__archive-current" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="evidence-cinematic__veil" aria-hidden="true" />

      <Container className="evidence-cinematic__shell max-w-[100rem]">
        <header className="evidence-cinematic__header">
          <div>
            <p className="evidence-cinematic__eyebrow">The evidence archive</p>
            <h2 id="evidence-wall-title">
              Decisions first. <em>Proof follows the trail.</em>
            </h2>
          </div>
          <div className="evidence-cinematic__intro">
            <p>
              Three selected engagements. Each file traces a signal, the strategic
              decision and the evidence that can be inspected.
            </p>
            <span>Desktop demonstrates the archive. Every manual choice holds; touch stays visitor-led.</span>
          </div>
        </header>

        <div className="evidence-cinematic__stage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={`media-${activeProject.slug}`}
              id="evidence-active-file"
              className="evidence-cinematic__media"
              initial={prefersReducedMotion ? false : { opacity: 0.34, scale: 1.035, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 1.015, filter: "blur(3px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.52, ease: EASE }}
              aria-live="polite"
            >
              <div className="evidence-cinematic__media-layer">
                {activeProject.cardImage && (
                  <Image
                    src={activeProject.cardImage}
                    alt=""
                    fill
                    priority={activeIndex === 0}
                    sizes="(min-width: 1100px) 62vw, 100vw"
                    className="evidence-cinematic__media-image"
                    style={{ objectPosition: activeProject.cardImagePosition ?? "center" }}
                  />
                )}

                {!prefersReducedMotion && activeProject.cardVideo && (
                  <motion.video
                    ref={activeVideoRef}
                    key={activeProject.cardVideo}
                    className="evidence-cinematic__media-video"
                    src={activeProject.cardVideo}
                    poster={activeProject.cardImage}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload={inView ? "metadata" : "none"}
                    data-home-playback-rate="1.2"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 1.035 }}
                    animate={{ opacity: 1, scale: inView ? 1.1 : 1.04 }}
                    transition={{ opacity: { duration: 0.72 }, scale: { duration: 8, ease: "linear" } }}
                  />
                )}
              </div>
              <div className="evidence-cinematic__media-wash" aria-hidden="true" />
              <div className="evidence-cinematic__media-topline">
                <span>Case file {String(activeIndex + 1).padStart(2, "0")}</span>
                <span>{activeProject.industry}</span>
              </div>
              <div className="evidence-cinematic__media-copy">
                <p>{activeProject.title}</p>
                <strong>{activeMetric.big}</strong>
                <span>{activeMetric.label}</span>
              </div>
              <div className="evidence-cinematic__media-actions">
                <button
                  type="button"
                  onClick={() => {
                    setOpenSlug(activeProject.slug);
                  }}
                >
                  Inspect the project file <span aria-hidden="true">↗</span>
                </button>
                <Link href={`/work/${activeProject.slug}`}>
                  {ACTION[activeProject.slug] ?? "View the case"} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.article>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.aside
              key={`trail-${activeProject.slug}`}
              className="evidence-cinematic__dossier"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
            >
              <div className="evidence-cinematic__dossier-topline">
                <span>Decision record</span>
                <strong>{String(activeIndex + 1).padStart(2, "0")} / {String(SELECTED_PROJECTS.length).padStart(2, "0")}</strong>
              </div>

              {[
                ["01 · The signal", activeTrail.signal],
                ["02 · The decision", activeTrail.decision],
                ["03 · Recorded proof", activeTrail.proof],
              ].map(([label, value], index) => (
                <div key={label} className="evidence-cinematic__trail-step">
                  <div>
                    <span>{label}</span>
                    <i aria-hidden="true" />
                  </div>
                  <p>{value}</p>
                  {index < 2 && (
                    <motion.b
                      aria-hidden="true"
                      animate={
                        prefersReducedMotion || !inView
                          ? undefined
                          : { scaleY: [0, 1], opacity: [0.18, 0.68] }
                      }
                      transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.4, delay: index * 0.32, ease: "easeInOut" }}
                    />
                  )}
                </div>
              ))}

              {activeEvidence && (
                <div className="evidence-cinematic__evidence-note">
                  <span>Evidence type</span>
                  <strong>{activeEvidence.type}</strong>
                  <p>{activeEvidence.source}</p>
                </div>
              )}

              <div className="evidence-cinematic__dossier-footer">
                <p>One decision worth following is more useful than a wall of unexplained outcomes.</p>
                <Link href="/work">Explore the full archive <span aria-hidden="true">→</span></Link>
              </div>

              <span className="evidence-cinematic__timer" aria-hidden="true">
                <motion.i
                  key={`evidence-timer-${activeProject.slug}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: EASE }}
                />
              </span>
            </motion.aside>
          </AnimatePresence>
        </div>

        <div className="evidence-cinematic__index" role="tablist" aria-label="Choose a project file">
          {SELECTED_PROJECTS.map((project, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={project.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="evidence-active-file"
                ref={(node) => {
                  indexButtonRefs.current[index] = node;
                }}
                className={selected ? "is-active" : undefined}
                style={{ "--project-accent": project.accent } as CSSProperties}
                onClick={() => choose(index)}
                onFocus={() => choose(index)}
                onKeyDown={(event) => chooseFromKeyboard(event, index)}
              >
                <span className="evidence-cinematic__index-image" aria-hidden="true">
                  {project.cardImage && (
                    <Image
                      src={project.cardImage}
                      alt=""
                      fill
                      sizes="180px"
                      style={{ objectFit: "cover", objectPosition: project.cardImagePosition ?? "center" }}
                    />
                  )}
                  <i />
                </span>
                <span className="evidence-cinematic__index-copy">
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <strong>{project.title}</strong>
                  <em>{project.industry}</em>
                </span>
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
