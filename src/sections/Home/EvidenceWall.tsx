"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useIsPresent, type HTMLMotionProps } from "framer-motion";
import { Container } from "@/components/Container";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import {
  projects,
  type Project,
} from "@/sections/HomeV4/homeSnapshotProjects";

type ProjectFileModule = typeof import("@/sections/Home/ProjectFile");
let projectFileDownload: Promise<ProjectFileModule> | null = null;

function loadProjectFile() {
  projectFileDownload ??= import("@/sections/Home/ProjectFile").catch((error) => {
    projectFileDownload = null;
    throw error;
  });
  return projectFileDownload;
}

function prepareProjectFile() {
  void loadProjectFile().catch(() => {});
}

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
    proof: "A complete brand foundation and a yearlong content operating system.",
  },
  "executive-springboard": {
    signal: "Social content was building awareness without a clear destination.",
    decision: "Sequence each platform toward webinar registration and mentor action.",
    proof: "A content system of eight pillars, shaped per platform and built around conversion.",
  },
  herbalcart: {
    signal: "A modern supplement range was being read through a purely herbal lens.",
    decision: "Explain supplementation as the practical answer to the gaps an active life leaves.",
    proof: "Five content formats ready to shoot and complete Hinglish video scripts.",
  },
  "plaxonic-content-portfolio": {
    signal: "One content tone failed to serve beginners and technical experts with equal credibility.",
    decision: "Give research, perspective, education, and fast consumption different jobs.",
    proof: "Sixteen authority pieces structured to validate, challenge, humanise, and define.",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

function EvidenceMedia(props: HTMLMotionProps<"article">) {
  const isPresent = useIsPresent();
  return (
    <motion.article
      {...props}
      inert={!isPresent}
      aria-hidden={!isPresent}
      style={{ ...props.style, pointerEvents: isPresent ? props.style?.pointerEvents : "none" }}
    />
  );
}

function EvidenceDossier(props: HTMLMotionProps<"aside">) {
  const isPresent = useIsPresent();
  return (
    <motion.aside
      {...props}
      inert={!isPresent}
      aria-hidden={!isPresent}
      style={{ ...props.style, pointerEvents: isPresent ? props.style?.pointerEvents : "none" }}
    />
  );
}

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
  const previousIndexRef = useRef(0);
  const fileRequestRef = useRef(0);
  const [ProjectFile, setProjectFile] = useState<ProjectFileModule["ProjectFile"] | null>(null);
  const [openingSlug, setOpeningSlug] = useState<string | null>(null);
  const [fileError, setFileError] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const desktopMotion = useMediaQuery("(min-width: 1181px) and (min-height: 761px) and (pointer: fine)");
  const inView = useInView(sectionRef, { amount: 0.22, margin: "8% 0px -12% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: projects.length,
    target: sectionRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const { activeIndex, choose: chooseVisualState, preview, releasePreview } = visualizer;
  const selectionDirection = activeIndex >= previousIndexRef.current ? 1 : -1;
  const activeProject = projects[activeIndex] ?? projects[0];
  const activeTrail = trailFor(activeProject);
  const activeMetric = metricFor(activeProject);

  useEffect(() => () => { fileRequestRef.current += 1; }, []);

  function cancelOpening() {
    fileRequestRef.current += 1;
    setOpeningSlug(null);
  }

  function chooseProject(index: number) {
    cancelOpening();
    setFileError(false);
    chooseVisualState(index);
  }

  async function openProjectFile(slug: string, opener: HTMLButtonElement) {
    if (openingSlug === slug) {
      cancelOpening();
      return;
    }
    opener.focus({ preventScroll: true });
    const request = ++fileRequestRef.current;
    setOpeningSlug(slug);
    setFileError(false);
    try {
      const loadedFile = await loadProjectFile();
      if (request !== fileRequestRef.current) return;
      setProjectFile(() => loadedFile.ProjectFile);
      setOpeningSlug(null);
      setOpenSlug(slug);
    } catch {
      if (request !== fileRequestRef.current) return;
      setOpeningSlug(null);
      setFileError(true);
    }
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? projects.length - 1
      : event.key === "ArrowRight" ? (index + 1) % projects.length
      : (index - 1 + projects.length) % projects.length;
    chooseProject(next);
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

  useEffect(() => {
    previousIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      className="evidence-cinematic"
      aria-labelledby="evidence-wall-title"
      data-evidence-state={activeProject.slug}
      data-evidence-index={activeIndex}
      data-scroll-story="evidence"
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
        initial={false}
        animate={
          prefersReducedMotion
            ? { x: 0, y: 0 }
            : { x: activeIndex * 20, y: activeIndex * -6 }
        }
        transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: EASE }}
      />
      <motion.div
        aria-hidden="true"
        className="evidence-cinematic__light evidence-cinematic__light--two"
        initial={false}
        animate={
          prefersReducedMotion
            ? { x: 0, y: 0 }
            : { x: activeIndex * -16, y: activeIndex * 6 }
        }
        transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: EASE }}
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
                onClick={() => chooseProject(index)}
                onPointerEnter={() => preview(index)}
                onPointerLeave={releasePreview}
                onFocus={() => preview(index)}
                onBlur={releasePreview}
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
          <EvidenceMedia
            key={`media-${activeProject.slug}`}
            className="evidence-cinematic__media"
            initial={prefersReducedMotion ? false : { opacity: 0.68, x: selectionDirection * 28, scale: 1.018, filter: "blur(2px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            exit={prefersReducedMotion ? undefined : { opacity: 0.78, x: selectionDirection * -18, scale: 1.006, filter: "blur(2px)" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.58, ease: EASE }}
          >
            <motion.div
              className="evidence-cinematic__media-layer"
              data-evidence-camera
              initial={prefersReducedMotion ? false : { scale: desktopMotion ? 1.16 : 1.035, rotate: desktopMotion ? selectionDirection * -0.8 : 0 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease: EASE }}
            >
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
            </motion.div>
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
                aria-haspopup="dialog"
                aria-busy={openingSlug === activeProject.slug}
                onPointerEnter={prepareProjectFile}
                onFocus={prepareProjectFile}
                onBlur={cancelOpening}
                onClick={(event) => void openProjectFile(activeProject.slug, event.currentTarget)}
              >
                {openingSlug === activeProject.slug ? "Cancel opening" : fileError ? "Retry project file" : "Inspect the project file"}
                <span aria-hidden="true">↗</span>
              </button>
              <Link href={`/work/${activeProject.slug}`}>
                {ACTION[activeProject.slug] ?? "View the case"} <span aria-hidden="true">→</span>
              </Link>
              {fileError && (
                <p className="evidence-cinematic__file-error" role="status">
                  Loading failed. Retry, or open the full case study.
                </p>
              )}
            </div>
          </EvidenceMedia>
          </AnimatePresence>

          <AnimatePresence mode="sync" initial={false}>
          <EvidenceDossier
            key={`trail-${activeProject.slug}`}
            className="evidence-cinematic__dossier"
            initial={prefersReducedMotion ? false : { opacity: 0.62, y: selectionDirection * 18, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={prefersReducedMotion ? undefined : { opacity: 0.8, y: selectionDirection * -12, filter: "blur(2px)" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
          >
            <div className="evidence-cinematic__dossier-topline">
              <span>Decision record</span>
              <strong>{String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</strong>
            </div>

            {[
              ["01 · The signal", activeTrail.signal],
              ["02 · The decision", activeTrail.decision],
              ["03 · Recorded proof", activeTrail.proof],
            ].map(([label, value], index) => (
              <motion.div
                key={label}
                className="evidence-cinematic__trail-step"
                initial={prefersReducedMotion ? false : { x: selectionDirection * 20 }}
                animate={{ x: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.44, delay: prefersReducedMotion ? 0 : index * 0.07, ease: EASE }}
              >
                <div>
                  <span>{label}</span>
                  <i aria-hidden="true" />
                </div>
                <p>{value}</p>
              </motion.div>
            ))}

            <div className="evidence-cinematic__dossier-footer">
              <p>One decision worth following is more useful than a wall of unexplained outcomes.</p>
              <Link href="/work">Open the full archive <span aria-hidden="true">→</span></Link>
            </div>
          </EvidenceDossier>
          </AnimatePresence>
        </div>
      </Container>

      <p className="sr-only" role="status">{openingSlug ? "Loading project file." : ""}</p>
      {ProjectFile && (
        <ProjectFile
          project={projects.find((project) => project.slug === openSlug) ?? null}
          onClose={() => setOpenSlug(null)}
        />
      )}
    </section>
  );
}
