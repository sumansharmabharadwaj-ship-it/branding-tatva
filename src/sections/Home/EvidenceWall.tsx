"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useAnimationControls, useInView, useIsPresent, type HTMLMotionProps } from "framer-motion";
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

function EvidenceMediaLayer(props: HTMLMotionProps<"div">) {
  const isPresent = useIsPresent();
  return (
    <motion.div
      {...props}
      aria-hidden="true"
      style={{ ...props.style, zIndex: isPresent ? 1 : 0, pointerEvents: "none" }}
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

const READINGS = projects.map((project) => ({ project, trail: trailFor(project) }));
const TRAIL_ROWS = [
  { key: "signal", label: "01 · The signal" },
  { key: "decision", label: "02 · The decision" },
  { key: "proof", label: "03 · Recorded proof" },
] as const;

function ProjectMetric({ project }: { project: Project }) {
  const metric = metricFor(project);
  return <><p>{project.title}</p><strong>{metric.big}</strong><span>{metric.label}</span></>;
}

export function EvidenceWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const previousIndexRef = useRef(0);
  const copyMotion = useAnimationControls();
  const trailMotion = useAnimationControls();
  const traceMotion = useAnimationControls();
  const fileRequestRef = useRef(0);
  const [ProjectFile, setProjectFile] = useState<ProjectFileModule["ProjectFile"] | null>(null);
  const [openingSlug, setOpeningSlug] = useState<string | null>(null);
  const [fileError, setFileError] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const desktopMotion = useMediaQuery("(min-width: 1181px) and (min-height: 761px) and (pointer: fine)");
  const [frameFits, setFrameFits] = useState(false);
  const desktopStory = desktopMotion && !prefersReducedMotion && frameFits;
  const inView = useInView(sectionRef, { amount: 0.22, margin: "8% 0px -12% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    scrollHysteresis: 0.0125,
    preservePanelFocus: true,
    focusScopeSelector: '[role="tabpanel"], [role="tablist"]',
    count: projects.length,
    target: sectionRef,
    enabled: inView && desktopStory,
    reducedMotion: prefersReducedMotion,
  });
  const { activeIndex, choose: chooseVisualState, preview, releasePreview } = visualizer;
  const selectionDirection = activeIndex >= previousIndexRef.current ? 1 : -1;
  const activeProject = projects[activeIndex] ?? projects[0];
  const activeTrail = trailFor(activeProject);
  const mediaDuration = prefersReducedMotion ? 0 : desktopMotion ? 0.7 : 0.35;

  useEffect(() => () => { fileRequestRef.current += 1; }, []);

  useEffect(() => {
    const frame = sectionRef.current?.querySelector<HTMLElement>(".evidence-cinematic__shell");
    if (!frame) return;
    const measure = () => setFrameFits(frame.offsetHeight <= window.innerHeight + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  function cancelOpening() {
    fileRequestRef.current += 1;
    setOpeningSlug(null);
  }

  function chooseProject(index: number) {
    cancelOpening();
    setFileError(false);
    chooseVisualState(index);
  }

  function stepProject(direction: -1 | 1) {
    const next = (activeIndex + direction + projects.length) % projects.length;
    chooseProject(next);
    // Keep the controls and reading in place. Only the horizontal tab strip
    // moves to show the new selection; page scroll and keyboard focus stay put.
    const tab = tabsRef.current[next];
    const strip = tab?.parentElement;
    if (!tab || !strip) return;
    const tabRect = tab.getBoundingClientRect();
    const stripRect = strip.getBoundingClientRect();
    if (tabRect.left < stripRect.left || tabRect.right > stripRect.right) {
      strip.scrollBy({
        left: tabRect.left - stripRect.left - (strip.clientWidth - tabRect.width) / 2,
        behavior: prefersReducedMotion ? "instant" : "smooth",
      });
    }
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
    const target = tabsRef.current[next];
    const bounds = target?.getBoundingClientRect();
    if (bounds) {
      const needsVerticalSpace = bounds.top < 80 || bounds.bottom > window.innerHeight - 64;
      const needsHorizontalSpace = bounds.left < 24 || bounds.right > window.innerWidth - 24;
      if (needsVerticalSpace || needsHorizontalSpace) {
        target?.scrollIntoView({ block: needsVerticalSpace ? "center" : "nearest", inline: "nearest", behavior: "instant" });
      }
    }
    target?.focus({ preventScroll: true });
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

  const settleReading = useCallback(() => {
    copyMotion.stop();
    trailMotion.stop();
    traceMotion.stop();
    copyMotion.set({ x: 0, y: 0 });
    trailMotion.set({ x: 0, y: 0 });
    traceMotion.set({ scaleX: 1 });
  }, [copyMotion, trailMotion, traceMotion]);

  useEffect(() => {
    const previous = previousIndexRef.current;
    previousIndexRef.current = activeIndex;
    settleReading();
    if (prefersReducedMotion || previous === activeIndex) return;
    const direction = activeIndex > previous ? 1 : -1;
    // The photograph opens the file; opaque text settles inside measured rows.
    // Glass surfaces and actions keep their positions throughout the transition.
    copyMotion.set({ x: -direction * 8, y: 2 });
    trailMotion.set({ x: direction * 6, y: 2 });
    traceMotion.set({ scaleX: .08 });
    void copyMotion.start({ x: 0, y: 0, transition: { duration: .38, ease: EASE } });
    // Follow the decision in reading order; reversing project direction also
    // reverses the short sequence. The original text remains opaque throughout.
    const delayFor = (row: number) => (direction > 0 ? row : TRAIL_ROWS.length - 1 - row) * .065;
    void trailMotion.start((row: number) => ({ x: 0, y: 0, transition: { duration: .42, delay: delayFor(row), ease: EASE } }));
    void traceMotion.start((row: number) => ({ scaleX: 1, transition: { duration: .58, delay: delayFor(row), ease: EASE } }));
    return () => { copyMotion.stop(); trailMotion.stop(); traceMotion.stop(); };
  }, [activeIndex, copyMotion, prefersReducedMotion, settleReading, trailMotion, traceMotion]);

  return (
    <section
      ref={sectionRef}
      className="evidence-cinematic"
      aria-labelledby="evidence-wall-title"
      data-evidence-state={activeProject.slug}
      data-evidence-index={activeIndex}
      data-evidence-layout={desktopStory ? "held" : "flow"}
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
            <span>{desktopStory
              ? "Scroll through five project files, or choose one to explore."
              : "Choose a project to follow the decision and its result."}</span>
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
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse" && desktopMotion && !prefersReducedMotion) preview(index);
                }}
                onPointerLeave={releasePreview}
                onFocus={() => chooseProject(index)}
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
          onFocusCapture={settleReading}
          onPointerDownCapture={settleReading}
        >
          <article className="evidence-cinematic__media">
            {/* Only the scenery overlaps. Copy and actions retain one owner. */}
            <AnimatePresence mode="sync" initial={false}>
            <EvidenceMediaLayer
              key={`media-${activeProject.slug}`}
              className="evidence-cinematic__media-layer"
              data-evidence-camera
              initial={prefersReducedMotion ? false : {
                opacity: desktopMotion ? 1 : 0,
                clipPath: desktopMotion
                  ? selectionDirection > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)"
                  : "inset(0% 0% 0% 0%)",
                scale: desktopMotion ? 1.1 : 1.025,
              }}
              animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
              exit={{
                opacity: 0,
                clipPath: "inset(0% 0% 0% 0%)",
                transition: {
                  clipPath: { duration: 0 },
                  opacity: { delay: mediaDuration, duration: 0 },
                },
              }}
              transition={{ duration: mediaDuration, ease: EASE }}
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
                  ref={(video) => {
                    if (video) activeVideoRef.current = video;
                    // A departing film must not clear the next film's ref.
                    else if (activeVideoRef.current?.dataset.evidenceProject === activeProject.slug) {
                      activeVideoRef.current = null;
                    }
                  }}
                  key={activeProject.cardVideo}
                  className="evidence-cinematic__media-video"
                  src={activeProject.cardVideo}
                  poster={activeProject.cardImage}
                  muted
                  loop
                  autoPlay={!prefersReducedMotion}
                  playsInline
                  preload={inView ? "metadata" : "none"}
                  data-home-playback-rate="1.2"
                  data-evidence-project={activeProject.slug}
                  aria-hidden="true"
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.035 }}
                  animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : inView ? 1.1 : 1.04 }}
                  transition={{ opacity: { duration: prefersReducedMotion ? 0 : .72 }, scale: { duration: prefersReducedMotion ? 0 : 8, ease: "linear" } }}
                />
              )}
            </EvidenceMediaLayer>
            </AnimatePresence>
            <div className="evidence-cinematic__media-wash" aria-hidden="true" />
            <div className="evidence-cinematic__media-topline">
              <span>Case file {String(activeIndex + 1).padStart(2, "0")}</span>
              <span className="evidence-cinematic__industry evidence-cinematic__reading-stack">
                <span className="evidence-cinematic__measure" aria-hidden="true" inert>
                  {projects.map((project) => <span key={project.slug}>{project.industry}</span>)}
                </span>
                <span>{activeProject.industry}</span>
              </span>
            </div>
            <div className="evidence-cinematic__media-copy evidence-cinematic__reading-stack">
              <div className="evidence-cinematic__measure" aria-hidden="true" inert>
                {READINGS.map(({ project }) => (
                  <div key={project.slug} className="evidence-cinematic__metric"><ProjectMetric project={project} /></div>
                ))}
              </div>
              <motion.div className="evidence-cinematic__metric" data-evidence-reading initial={false} animate={copyMotion}>
                <ProjectMetric project={activeProject} />
              </motion.div>
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
                <span className="evidence-cinematic__reading-stack">
                  <span className="evidence-cinematic__measure" aria-hidden="true" inert>
                    {projects.map((project) => <span key={project.slug}>{ACTION[project.slug] ?? "View the case"}</span>)}
                  </span>
                  <span>{ACTION[activeProject.slug] ?? "View the case"}</span>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
              {fileError && (
                <p className="evidence-cinematic__file-error" role="status">
                  Loading failed. Retry, or open the full case study.
                </p>
              )}
            </div>
          </article>

          <aside className="evidence-cinematic__dossier">
            <div className="evidence-cinematic__dossier-topline">
              <span>Decision record</span>
              <strong>{String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</strong>
            </div>

            {TRAIL_ROWS.map(({ key, label }, row) => (
              <div
                key={label}
                className="evidence-cinematic__trail-step"
                data-home-reading-anchor
              >
                <div>
                  <span>{label}</span>
                  <motion.i aria-hidden="true" custom={row} initial={false} animate={traceMotion} />
                </div>
                <div className="evidence-cinematic__reading-stack">
                  <div className="evidence-cinematic__measure" aria-hidden="true" inert>
                    {READINGS.map(({ project, trail }) => <p key={project.slug}>{trail[key]}</p>)}
                  </div>
                  <motion.p data-evidence-trail-reading custom={row} initial={false} animate={trailMotion}>{activeTrail[key]}</motion.p>
                </div>
              </div>
            ))}

            <div className="evidence-cinematic__pager" role="group" aria-label="Browse project records">
              <button type="button" aria-label="Previous project" onClick={() => stepProject(-1)}>
                <span aria-hidden="true">←</span> Back
              </button>
              <span className="evidence-cinematic__pager-count" aria-hidden="true">
                {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              <button type="button" aria-label="Next project" onClick={() => stepProject(1)}>
                Next <span aria-hidden="true">→</span>
              </button>
              <p className="sr-only" role="status" aria-atomic="true">
                Project {activeIndex + 1} of {projects.length}: {activeProject.title}.
              </p>
            </div>

            <div className="evidence-cinematic__dossier-footer">
              <p>One decision worth following is more useful than a wall of unexplained outcomes.</p>
              <Link href="/work">Open the full archive <span aria-hidden="true">→</span></Link>
            </div>
          </aside>
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
