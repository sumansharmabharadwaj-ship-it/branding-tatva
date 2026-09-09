"use client";

import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { packages } from "@/data/services";
import {
  isServicesSituation,
  publishServicesSituation,
  readCompletedHomeDiagnosis,
  SERVICES_SITUATION_CLEARED_EVENT,
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import styles from "./HomePaths.module.css";

const PATHS = [
  {
    situation: "idea",
    label: "Beginning",
    context: "A new business",
    title: "Give the idea a clear beginning.",
    question: "Who should choose this business, and why?",
    decisions: ["Position and audience", "Core identity", "Launch messaging"],
  },
  {
    situation: "reposition",
    label: "Reposition",
    context: "An existing brand",
    title: "Let the brand catch up.",
    question: "What should buyers recognise, and what needs to change?",
    decisions: ["Audit and position", "Language and identity", "Website and campaign direction"],
  },
  {
    situation: "ongoing",
    label: "Ongoing",
    context: "Work that keeps growing",
    title: "Keep the brand recognisable.",
    question: "Where is the brand drifting as the work grows?",
    decisions: ["Monthly brand review", "Content management", "Performance and adjustment"],
  },
] as const satisfies readonly {
  situation: ServicesSituationId;
  label: string;
  context: string;
  title: string;
  question: string;
  decisions: readonly string[];
}[];

const EASE = [0.22, 1, 0.36, 1] as const;

export function PathsCinematicChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const previousIndexRef = useRef(0);
  const selectionId = useId();
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const cinematicMotion = useMediaQuery(
    "(min-width: 1181px) and (min-height: 761px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );
  const sceneInView = useInView(sectionRef, { amount: 0.08 });
  const visualizer = useScrollDrivenVisualizer({
    count: PATHS.length,
    target: sectionRef,
    enabled: cinematicMotion && sceneInView,
    reducedMotion,
  });
  const { activeIndex, choose: chooseVisualState, preview, releasePreview } = visualizer;
  const selectionDirection = activeIndex >= previousIndexRef.current ? 1 : -1;
  const active = PATHS[activeIndex];
  const packageSlug = SITUATION_TO_PACKAGE[active.situation];
  const offering = packages.find((item) => item.slug === packageSlug)!;

  useEffect(() => {
    function restore(saved: ServicesSituationId | null) {
      const index = PATHS.findIndex((path) => path.situation === saved);
      chooseVisualState(index >= 0 ? index : 0);
    }
    function sync() {
      try {
        const stored = window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY);
        restore(isServicesSituation(stored) ? stored : readCompletedHomeDiagnosis());
      } catch {
        // In-page choices still arrive through events when storage is unavailable.
      }
    }
    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      if (detail?.origin === "home_paths") return;
      if (isServicesSituation(detail?.situation ?? null)) restore(detail.situation);
    }
    function onStorage(event: StorageEvent) {
      if (event.key === SERVICES_SITUATION_STORAGE_KEY || event.key === null) sync();
    }
    function clear() { restore(null); }

    sync();
    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation);
    window.addEventListener(SERVICES_SITUATION_CLEARED_EVENT, clear);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SERVICES_SITUATION_EVENT, onSituation);
      window.removeEventListener(SERVICES_SITUATION_CLEARED_EVENT, clear);
      window.removeEventListener("storage", onStorage);
    };
  }, [chooseVisualState]);

  useEffect(() => {
    previousIndexRef.current = activeIndex;
  }, [activeIndex]);

  function choose(index: number) {
    chooseVisualState(index);
    publishServicesSituation(PATHS[index].situation, "home_paths");
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? PATHS.length - 1
      : event.key === "ArrowRight" ? (index + 1) % PATHS.length
      : (index - 1 + PATHS.length) % PATHS.length;
    choose(next);
    tabsRef.current[next]?.focus();
  }

  return (
    <section
      ref={sectionRef}
      id="paths"
      data-home-chapter="paths"
      data-home-section="paths"
      data-cursor-world="light"
      data-scroll-story="paths"
      data-path-state={activeIndex}
      className={styles.paths}
      aria-labelledby="paths-cinematic-title"
    >
      <div className={styles.scene}>
        <div className={styles.film} aria-hidden="true">
          <BackgroundVideo
            video="/videos/higgsfield-mountain-mist.mp4"
            poster="/images/higgsfield-mountain-mist-poster.jpg"
            managedByHomepage
            loop={false}
          />
        </div>
        <div className={styles.frame}>
          <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Three ways to work together</p>
            <h2 id="paths-cinematic-title">Start with where <em>the business stands.</em></h2>
          </div>
          <p className={styles.intro}>
            A first identity, a changed position, or work that needs a consistent hand.
            The starting point shapes the scope.
          </p>
          </header>

        <div className={styles.tabs} role="tablist" aria-label="Choose a brand path">
          {PATHS.map((path, index) => (
            <button
              key={path.situation}
              ref={(element) => { tabsRef.current[index] = element; }}
              id={`home-path-${path.situation}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="home-path-panel"
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => choose(index)}
              onPointerEnter={() => preview(index)}
              onPointerLeave={(event) => {
                if (document.activeElement !== event.currentTarget) releasePreview();
              }}
              onFocus={() => preview(index)}
              onBlur={releasePreview}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={styles.tab}
            >
              {index === activeIndex && (
                <motion.span
                  className={styles.selection}
                  layoutId={`home-path-selection-${selectionId}`}
                  transition={{ duration: reducedMotion ? 0 : 0.35, ease: EASE }}
                  aria-hidden="true"
                />
              )}
              <span className={styles.tabLabel}>{path.label}</span>
              <span className={styles.tabContext}>{path.context}</span>
            </button>
          ))}
        </div>

        <div
          id="home-path-panel"
          className={styles.panel}
          role="tabpanel"
          aria-labelledby={`home-path-${active.situation}`}
          tabIndex={0}
          data-path-situation={active.situation}
        >
          <motion.div
            key={active.situation}
            className={styles.detail}
            initial={reducedMotion ? false : { x: selectionDirection * 12 }}
            animate={{ x: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.32, ease: EASE }}
          >
            <div className={styles.copy}>
              <p className={styles.pathNumber}>0{activeIndex + 1} <span>{offering.name}</span></p>
              <h3>{active.title}</h3>
              <p className={styles.description}>{offering.description}</p>
              <Link
                href={`/services#package-${packageSlug}`}
                onClick={() => publishServicesSituation(active.situation, "home_paths")}
                className={styles.action}
              >
                Explore {offering.name} <ArrowRight size={19} aria-hidden="true" />
              </Link>
            </div>

            <div className={styles.scope}>
              <p className={styles.eyebrow}>The first question</p>
              <p className={styles.question}>{active.question}</p>
              <p className={styles.scopeLabel}>What we work on</p>
              <ul>
                {active.decisions.map((decision, index) => (
                  <li key={decision}>
                    <span aria-hidden="true">0{index + 1}</span>
                    {decision}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <footer className={styles.footer}>
          <p>Not sure which fits yet?</p>
          <Link href="/services#audit">
            Start with the recognition audit <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </footer>
        </div>
      </div>
    </section>
  );
}
