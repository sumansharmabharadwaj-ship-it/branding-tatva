"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/Container";
import { projects, type Project } from "@/data/projects";
import {
  SERVICES_SITUATION_CLEARED_EVENT,
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PROOF_SLUG,
  isServicesSituation,
  publishServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";

const DEFAULT_PROJECTS = projects.filter((project) => project.featured);
const PROJECTS_BY_SLUG = new Map(projects.map((project) => [project.slug, project]));

const SITUATION_LABEL: Record<ServicesSituationId, string> = {
  idea: "New brand",
  reposition: "Repositioning",
  ongoing: "Brand growth",
};

const PROOF_TO_SITUATION: Partial<Record<string, ServicesSituationId>> = {
  [SITUATION_TO_PROOF_SLUG.idea]: "idea",
  [SITUATION_TO_PROOF_SLUG.reposition]: "reposition",
  [SITUATION_TO_PROOF_SLUG.ongoing]: "ongoing",
};

const DECISION: Record<string, { big: string; label: string }> = {
  myshopineurope: {
    big: "Craft over price",
    label: "the positioning choice that moved the platform beyond cheap supply",
  },
  "executive-springboard": {
    big: "One next action",
    label: "every platform sequence designed toward webinar registration",
  },
  herbalcart: {
    big: "Perception reset",
    label: "a modern supplement position replacing the accidental herbal frame",
  },
};

const EVIDENCE_META: Record<string, { type: string; period: string; source: string }> = {
  "dr-haley-nutrition": {
    type: "Measured performance",
    period: "December 2025 to January 2026",
    source: "Instagram account comparison: 111 followers from 23 posts versus 126 from 12 posts. The homepage shows the raw values per post instead of an unexplained percentage.",
  },
  myshopineurope: {
    type: "Delivered system",
    period: "Completed project output",
    source: "Brand foundation, channel playbooks, and a content operating plan for four quarters.",
  },
  "executive-springboard": {
    type: "Documented decision and delivered work",
    period: "Completed project output",
    source: "Competitive audit, eight content pillars, and channel playbooks structured around webinar registration.",
  },
  herbalcart: {
    type: "Delivered campaign reset",
    period: "Completed project output",
    source: "Repositioned content themes, five formats ready for production, and complete video scripts.",
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
    proof: "A complete brand foundation and content operating plan for twelve months.",
  },
  "executive-springboard": {
    signal: "Social content was building awareness without a clear destination.",
    decision: "Sequence each platform toward webinar registration and mentor action.",
    proof: "Eight content pillars and channel plans built around webinar registration.",
  },
  herbalcart: {
    signal: "The product range was being read through an accidental herbal and Ayurvedic frame.",
    decision: "Reposition the campaign around practical, modern supplementation for active lifestyles.",
    proof: "Five content formats ready to shoot, with complete scripts built around the modern supplement category.",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

const loadProjectFile = () => import("@/sections/Home/ProjectFile");
const ProjectFile = dynamic(
  () => loadProjectFile().then((module) => module.ProjectFile),
  { ssr: false },
);

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
    big: stat?.value ?? fallback?.big ?? "A stronger brand choice",
    label: stat?.label ?? fallback?.label ?? project.hook ?? project.outcome,
  };
}

function projectsForSituation(situation: ServicesSituationId | null) {
  if (!situation) return DEFAULT_PROJECTS;

  const primary = PROJECTS_BY_SLUG.get(SITUATION_TO_PROOF_SLUG[situation]);
  if (!primary) return DEFAULT_PROJECTS;

  return [
    primary,
    ...DEFAULT_PROJECTS.filter((project) => project.slug !== primary.slug).slice(0, 2),
  ];
}

export function EvidenceWall() {
  const indexButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [committedIndex, setCommittedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [projectFileRequested, setProjectFileRequested] = useState(false);
  const [carriedSituation, setCarriedSituation] = useState<ServicesSituationId | null>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const visibleProjects = useMemo(
    () => projectsForSituation(carriedSituation),
    [carriedSituation],
  );
  const activeIndex = previewIndex ?? committedIndex;
  const isPreviewing = previewIndex !== null && previewIndex !== committedIndex;
  const activeProject = visibleProjects[activeIndex] ?? visibleProjects[0];
  const activeTrail = trailFor(activeProject);
  const activeMetric = metricFor(activeProject);
  const activeEvidence = EVIDENCE_META[activeProject.slug];
  const activeSituation = PROOF_TO_SITUATION[activeProject.slug];

  function choose(index: number, persist = true) {
    const count = visibleProjects.length;
    const next = count > 0 ? ((index % count) + count) % count : 0;
    if (!persist) {
      setPreviewIndex(next);
      return;
    }
    setCommittedIndex(next);
    setPreviewIndex(null);
  }

  useEffect(() => {
    function applySituation(value: string | null) {
      if (!isServicesSituation(value)) return;
      setCarriedSituation(value);
      setCommittedIndex(0);
      setPreviewIndex(null);
      setOpenSlug(null);
    }

    try {
      const completedDiagnosis = readCompletedHomeDiagnosis();
      if (completedDiagnosis) applySituation(completedDiagnosis);
      else applySituation(window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY));
    } catch {}

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      applySituation(detail?.situation ?? null);
    }

    function onSituationCleared() {
      setCarriedSituation(null);
      setCommittedIndex(0);
      setPreviewIndex(null);
      setOpenSlug(null);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    window.addEventListener(SERVICES_SITUATION_CLEARED_EVENT, onSituationCleared);
    return () => {
      window.removeEventListener(
        SERVICES_SITUATION_EVENT,
        onSituation as EventListener,
      );
      window.removeEventListener(SERVICES_SITUATION_CLEARED_EVENT, onSituationCleared);
    };
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
        ? visibleProjects.length - 1
        : (index + direction + visibleProjects.length) % visibleProjects.length;
    choose(nextIndex);
    indexButtonRefs.current[nextIndex]?.focus();
  }

  const closeProjectFile = useCallback(() => setOpenSlug(null), []);

  function prepareProjectFile() {
    setProjectFileRequested(true);
    void loadProjectFile();
  }

  function openProjectFile() {
    prepareProjectFile();
    setOpenSlug(activeProject.slug);
  }

  function continueIntoPath() {
    if (!activeSituation) return;
    publishServicesSituation(activeSituation, "home_paths");
  }

  return (
    <section
      className="evidence-cinematic"
      aria-labelledby="evidence-wall-title"
      data-evidence-state={activeProject.slug}
      data-evidence-match={carriedSituation ?? "default"}
      data-evidence-preview={isPreviewing ? activeProject.slug : undefined}
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
              className="evidence-cinematic__backdrop-video"
              src={activeProject.cardVideo}
              poster={activeProject.cardImage}
              muted
              loop
              playsInline
              aria-hidden="true"
              preload="none"
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
            <h2 id="evidence-wall-title">Client work should reveal <em>the thinking behind it.</em></h2>
          </div>
          <div className="evidence-cinematic__intro">
            <span>{String(activeIndex + 1).padStart(2, "0")} / {String(visibleProjects.length).padStart(2, "0")}</span>
            {(isPreviewing || carriedSituation) && (
              <small className="evidence-cinematic__match">
                {isPreviewing
                  ? "Previewing project"
                  : `Matched proof · ${SITUATION_LABEL[carriedSituation!]}`}
              </small>
            )}
            <p>Each project shows what was happening, what changed, and what the available evidence can honestly support.</p>
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
              <ol className="evidence-cinematic__proof-line" aria-label="Project reasoning">
                {[
                  ["What was happening", activeTrail.signal],
                  ["What changed", activeTrail.decision],
                  ["What we can show", activeTrail.proof],
                ].map(([label, value], index) => (
                  <motion.li
                    key={label}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.48,
                      delay: prefersReducedMotion ? 0 : 0.08 + index * 0.08,
                      ease: EASE,
                    }}
                  >
                    <span className="evidence-cinematic__proof-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <small>{label}</small>
                      <p>{value}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>

              {activeEvidence && (
                <aside className="evidence-cinematic__source" aria-label="Evidence source">
                  <p>Evidence source</p>
                  <div>
                    <strong>{activeEvidence.type} · {activeEvidence.period}</strong>
                    <span>{activeEvidence.source}</span>
                  </div>
                </aside>
              )}

              <div className="evidence-cinematic__actions">
                <button
                  type="button"
                  onClick={openProjectFile}
                  onPointerEnter={prepareProjectFile}
                  onFocus={prepareProjectFile}
                >
                  Open the project record <span aria-hidden="true">↗</span>
                </button>
                <Link href="#paths" onClick={continueIntoPath}>
                  {activeSituation
                    ? `Continue with the ${SITUATION_LABEL[activeSituation].toLowerCase()} path`
                    : "See which engagement fits"}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="evidence-cinematic__index-area">
          <p className="evidence-cinematic__index-guide">
            <span>Choose a project</span>
            <span>Open the reasoning and evidence</span>
          </p>
          <div
            className="evidence-cinematic__index"
            role="tablist"
            aria-label="Choose a project case"
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") setPreviewIndex(null);
            }}
          >
            {visibleProjects.map((project, index) => {
              const displayed = index === activeIndex;
              const committed = index === committedIndex;
              return (
                <button
                  key={project.slug}
                  type="button"
                  role="tab"
                  id={`evidence-tab-${index}`}
                  aria-selected={committed}
                  aria-controls="evidence-active-file"
                  tabIndex={committed ? 0 : -1}
                  ref={(node) => { indexButtonRefs.current[index] = node; }}
                  className={displayed ? "is-active" : undefined}
                  style={{ "--project-accent": project.accent } as CSSProperties}
                  onClick={() => choose(index)}
                  onFocus={() => choose(index)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") choose(index, false);
                  }}
                  onKeyDown={(event) => chooseFromKeyboard(event, index)}
                >
                  <span className="evidence-cinematic__index-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="evidence-cinematic__index-copy">
                    <strong>{project.title}</strong>
                    <em>
                      {EVIDENCE_META[project.slug]?.type ?? "Project evidence"} · {project.industry}
                    </em>
                  </span>
                  <span className="evidence-cinematic__index-state" aria-hidden="true">
                    {displayed ? (isPreviewing ? "Preview" : "Viewing") : ""}
                  </span>
                  <i aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </Container>

      {projectFileRequested ? (
        <ProjectFile
          project={visibleProjects.find((project) => project.slug === openSlug) ?? null}
          onClose={closeProjectFile}
        />
      ) : null}
    </section>
  );
}
