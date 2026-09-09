"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Container } from "@/components/Container";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import {
  projects,
  type Project,
} from "@/sections/HomeV4/homeSnapshotProjects";
import { ProjectFile } from "@/sections/Home/ProjectFile";

const ACTION: Record<string, string> = {
  "dr-haley-nutrition": "Watch the story",
  myshopineurope: "Open the file",
  "executive-springboard": "View the case",
  herbalcart: "View the case",
  "plaxonic-content-portfolio": "Open the file",
};

const DECISION: Record<string, { big: string; label: string }> = {
  // Show the work delivered, rather than a result quoted inside the research.
  "plaxonic-content-portfolio": {
    big: "16",
    label: "content pieces across four formats",
  },
  myshopineurope: {
    big: "Craft over price",
    label: "the positioning refusal that reframed the platform",
  },
  "executive-springboard": {
    big: "Registrations",
    label: "content built to end in one, well past a like",
  },
  herbalcart: {
    big: "Wellness first",
    label: "perception moved from herbal supplement to modern brand",
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
    big: fallback?.big ?? stat?.value ?? "A clearer system",
    label: fallback?.label ?? stat?.label ?? project.hook ?? project.outcome,
  };
}

export function EvidenceWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.22, margin: "8% 0px -12% 0px" });
  const activeProject = projects[activeIndex] ?? projects[0];
  const activeTrail = trailFor(activeProject);
  const activeMetric = metricFor(activeProject);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? projects.length - 1
      : event.key === "ArrowRight" ? (index + 1) % projects.length
      : (index - 1 + projects.length) % projects.length;
    setActiveIndex(next);
    tabsRef.current[next]?.focus();
  }

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
      style={{ "--evidence-accent": activeProject.accent } as CSSProperties}
    >
      <BackgroundVideo
        video="/videos/pexels-fog-sunrise.mp4"
        videoWebm="/videos/pexels-fog-sunrise.webm"
        poster="/images/pexels-fog-sunrise-poster.jpg"
      />
      <div className="evidence-cinematic__veil" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="evidence-cinematic__light evidence-cinematic__light--one"
        animate={
          prefersReducedMotion || !inView
            ? undefined
            : { x: [0, 86, 0], y: [0, -30, 0], scale: [0.96, 1.12, 0.96] }
        }
        transition={
          prefersReducedMotion || !inView
            ? undefined
            : { duration: 18, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        aria-hidden="true"
        className="evidence-cinematic__light evidence-cinematic__light--two"
        animate={
          prefersReducedMotion || !inView
            ? undefined
            : { x: [0, -64, 0], y: [0, 24, 0], scale: [1.05, 0.94, 1.05] }
        }
        transition={
          prefersReducedMotion || !inView
            ? undefined
            : { duration: 21, repeat: Infinity, ease: "easeInOut" }
        }
      />

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
              Five real engagements. Each file begins with a signal that was misread,
              then records the decision that changed the direction.
            </p>
            <span>Choose a project to follow the decision and its result.</span>
          </div>
        </header>

        <div className="evidence-cinematic__index" role="tablist" aria-label="Choose a project file">
          {projects.map((project, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={project.slug}
                ref={(element) => { tabsRef.current[index] = element; }}
                id={`evidence-tab-${project.slug}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="evidence-active-file"
                tabIndex={selected ? 0 : -1}
                className={selected ? "is-active" : undefined}
                style={{ "--project-accent": project.accent } as CSSProperties}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
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

        <div
          id="evidence-active-file"
          role="tabpanel"
          aria-labelledby={`evidence-tab-${activeProject.slug}`}
          tabIndex={0}
          className="evidence-cinematic__stage"
        >
          <AnimatePresence mode="sync" initial={false}>
          <motion.article
            key={`media-${activeProject.slug}`}
            className="evidence-cinematic__media"
            initial={prefersReducedMotion ? false : { opacity: 0.78, scale: 1.014, filter: "blur(1px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={prefersReducedMotion ? undefined : { opacity: 0.78, scale: 1.006, filter: "blur(1px)" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE }}
          >
            <div className="evidence-cinematic__media-layer">
              {activeProject.cardImage && (
                <Image
                  src={activeProject.cardImage}
                  alt=""
                  fill
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
                onClick={() => setOpenSlug(activeProject.slug)}
              >
                Inspect the project file <span aria-hidden="true">↗</span>
              </button>
              <Link href={`/work/${activeProject.slug}`}>
                {ACTION[activeProject.slug] ?? "View the case"} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.article>
          </AnimatePresence>

          <AnimatePresence mode="sync" initial={false}>
          <motion.aside
            key={`trail-${activeProject.slug}`}
            className="evidence-cinematic__dossier"
            initial={prefersReducedMotion ? false : { opacity: 0.8, y: 7, filter: "blur(1px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={prefersReducedMotion ? undefined : { opacity: 0.8, y: -4, filter: "blur(1px)" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: EASE }}
          >
            <div className="evidence-cinematic__dossier-topline">
              <span>Decision record</span>
              <strong>{String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</strong>
            </div>

            {[
              ["01 · The signal", activeTrail.signal],
              ["02 · The decision", activeTrail.decision],
              ["03 · Recorded proof", activeTrail.proof],
            ].map(([label, value]) => (
              <div key={label} className="evidence-cinematic__trail-step">
                <div>
                  <span>{label}</span>
                  <i aria-hidden="true" />
                </div>
                <p>{value}</p>
              </div>
            ))}

            <div className="evidence-cinematic__dossier-footer">
              <p>One decision worth following is more useful than a wall of unexplained outcomes.</p>
              <Link href="/work">Explore the full archive <span aria-hidden="true">→</span></Link>
            </div>
          </motion.aside>
          </AnimatePresence>
        </div>
      </Container>

      <ProjectFile
        project={projects.find((project) => project.slug === openSlug) ?? null}
        onClose={() => setOpenSlug(null)}
      />
    </section>
  );
}
