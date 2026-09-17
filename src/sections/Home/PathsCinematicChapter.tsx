"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { motion, useAnimationControls, useInView } from "framer-motion";
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
type Path = (typeof PATHS)[number];

function PathReading({ path, index }: { path: Path; index: number }) {
  const offering = packages.find((item) => item.slug === SITUATION_TO_PACKAGE[path.situation])!;
  return (
    <>
      <p className={styles.pathNumber}>0{index + 1} <span>{offering.name}</span></p>
      <h3>{path.title}</h3>
      <p className={styles.description}>{offering.description}</p>
    </>
  );
}

export function PathsCinematicChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameFits, setFrameFits] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const previousIndexRef = useRef(0);
  const copyMotion = useAnimationControls();
  const scopeMotion = useAnimationControls();
  const selectionId = useId();
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const cinematicMotion = useMediaQuery(
    "(min-width: 1181px) and (min-height: 761px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );
  const desktopStory = cinematicMotion && frameFits && !reducedMotion;
  const sceneInView = useInView(sectionRef, { amount: 0.08 });
  const visualizer = useScrollDrivenVisualizer({
    scrollHysteresis: 0.0125,
    preservePanelFocus: true,
    focusScopeSelector: '[role="tabpanel"], [role="tablist"]',
    count: PATHS.length,
    target: sectionRef,
    enabled: desktopStory && sceneInView,
    reducedMotion,
  });
  const { activeIndex, choose: chooseVisualState, preview, releasePreview } = visualizer;
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

  // Measure natural content, including every possible reading, before holding
  // the scene. Short windows and larger text retain ordinary document flow.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => setFrameFits(frame.offsetHeight <= window.innerHeight + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const settleReading = useCallback(() => {
    copyMotion.stop();
    scopeMotion.stop();
    copyMotion.set({ x: 0, y: 0 });
    scopeMotion.set({ x: 0 });
  }, [copyMotion, scopeMotion]);

  useEffect(() => {
    const previous = previousIndexRef.current;
    previousIndexRef.current = activeIndex;
    settleReading();
    if (reducedMotion || previous === activeIndex) return;
    const direction = activeIndex > previous ? 1 : -1;
    // Fully opaque text arrives as one reading group; controls stay outside
    // its transform. Reversing the selection reverses this small movement.
    copyMotion.set({ x: direction * 6, y: 2 });
    scopeMotion.set({ x: direction * 8 });
    void copyMotion.start({ x: 0, y: 0, transition: { duration: .36, ease: EASE } });
    void scopeMotion.start({ x: 0, transition: { duration: .4, ease: EASE } });
    return () => { copyMotion.stop(); scopeMotion.stop(); };
  }, [activeIndex, copyMotion, reducedMotion, scopeMotion, settleReading]);

  function choose(index: number) {
    chooseVisualState(index);
    publishServicesSituation(PATHS[index].situation, "home_paths");
  }

  function revealFocusedPath(target: HTMLElement | null) {
    if (!target || target === sectionRef.current || !target.matches(":focus-visible")) return;
    const bounds = target.getBoundingClientRect();
    if (bounds.top < 80 || bounds.bottom > window.innerHeight - 80) {
      target.scrollIntoView({
        block: bounds.height > window.innerHeight - 160 ? "start" : "nearest",
        inline: "nearest",
        behavior: "instant",
      });
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? PATHS.length - 1
      : event.key === "ArrowRight" ? (index + 1) % PATHS.length
      : (index - 1 + PATHS.length) % PATHS.length;
    choose(next);
    const target = tabsRef.current[next];
    // Repeated Home/End needs its own visibility check after a wheel gesture;
    // new targets use the same focus handler as Tab and Shift Tab.
    if (target === document.activeElement) revealFocusedPath(target);
    else target?.focus({ preventScroll: true });
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
      data-path-story={desktopStory ? "held" : "flow"}
      className={styles.paths}
      aria-labelledby="paths-cinematic-title"
      onFocusCapture={(event) => revealFocusedPath(event.target)}
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
        <div ref={frameRef} className={styles.frame}>
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
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse" && !reducedMotion) preview(index);
              }}
              onPointerLeave={(event) => {
                if (document.activeElement !== event.currentTarget) releasePreview();
              }}
              onFocus={() => chooseVisualState(index)}
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
          onFocusCapture={settleReading}
          onPointerDownCapture={settleReading}
        >
          <div
            className={styles.detail}
            data-path-detail
          >
            <div className={styles.copy}>
              <div className={styles.readingStack}>
                <div className={styles.readingMeasure} aria-hidden="true" inert>
                  {PATHS.map((path, index) => (
                    <div key={path.situation}><PathReading path={path} index={index} /></div>
                  ))}
                </div>
                <motion.div data-path-reading initial={false} animate={copyMotion}>
                  <PathReading path={active} index={activeIndex} />
                </motion.div>
              </div>
              <Link
                href={`/services#package-${packageSlug}`}
                onClick={() => publishServicesSituation(active.situation, "home_paths")}
                className={styles.action}
              >
                <span className={styles.readingStack}>
                  <span className={styles.readingMeasure} aria-hidden="true" inert>
                    {PATHS.map((path) => (
                      <span key={path.situation}>
                        Open {packages.find((item) => item.slug === SITUATION_TO_PACKAGE[path.situation])!.name}
                      </span>
                    ))}
                  </span>
                  <span>Open {offering.name}</span>
                </span>
                <ArrowRight size={19} aria-hidden="true" />
              </Link>
            </div>

            <div className={styles.scope} data-path-scope>
              <motion.div initial={false} animate={scopeMotion} data-path-question>
                <p className={styles.eyebrow}>The first question</p>
                <div className={`${styles.readingStack} ${styles.questionStack}`}>
                  <div className={styles.readingMeasure} aria-hidden="true" inert>
                    {PATHS.map((path) => <p key={path.situation} className={styles.question}>{path.question}</p>)}
                  </div>
                  <p className={styles.question}>{active.question}</p>
                </div>
                <p className={styles.scopeLabel}>What the work covers</p>
                <ul>
                  {active.decisions.map((decision, index) => (
                    <li key={index}>
                      <span aria-hidden="true">0{index + 1}</span>
                      <div className={styles.readingStack}>
                        <div className={styles.readingMeasure} aria-hidden="true" inert>
                          {PATHS.map((path) => <div key={path.situation}>{path.decisions[index]}</div>)}
                        </div>
                        <div>{decision}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>Find the scope your brand needs.</p>
          <Link href="/services#audit">
            Start with the recognition audit <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </footer>
        </div>
      </div>
    </section>
  );
}
