"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useAnimationControls, useInView, useTransform } from "framer-motion";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import type { ProcessStage } from "@/data/process";
import { consultation } from "@/data/site";
import styles from "./ProjectJourney.module.css";

const STAGE_META = [
  {
    title: "Start with what the business can stand behind.",
    explanation: "Review the offer, the founder’s view, and the current messaging. Find where the promise on paper differs from what the business can deliver.",
    output: "Business diagnosis and founder brief",
    decision: "Which promises can the business support with evidence?",
  },
  {
    title: "Find the reason buyers choose, or hesitate.",
    explanation: "Read customer behaviour alongside competing offers. Separate what buyers value from what the category keeps repeating.",
    output: "Audience tensions and category map",
    decision: "What matters to the audience that competitors leave unresolved?",
  },
  {
    title: "Give the brand one position to build from.",
    explanation: "Choose who the brand serves, what it promises, and why that promise is credible. Record the choices the team will use to judge future work.",
    output: "Positioning brief and brand narrative",
    decision: "What should buyers remember about this business?",
  },
  {
    title: "Make the position recognisable.",
    explanation: "Translate the position into voice, messaging, and design direction. Give the team examples it can apply across the website, content, and sales conversations.",
    output: "Voice, messaging, and identity direction",
    decision: "Which words and visual cues should stay consistent?",
  },
  {
    title: "Carry the promise into the customer’s world.",
    explanation: "Bring the strategy into the website, content, campaigns, and selling moments. Check that the journey from first impression to enquiry tells the same story.",
    output: "Launch plan and channel playbooks",
    decision: "Where does the customer need to encounter the promise first?",
  },
  {
    title: "Keep the brand recognisable as it grows.",
    explanation: "Review the work after launch. Keep the signals people respond to, correct inconsistencies, and give the team clear rules for what comes next.",
    output: "Brand guidelines and review roadmap",
    decision: "What should we repeat, improve, or stop?",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
type StageReading = { title: string; explanation: string; output: string; decision: string };

function resolveReading(stage: ProcessStage, index: number): StageReading {
  return STAGE_META[index] ?? {
    title: stage.stage,
    explanation: stage.description,
    output: "A decision the next stage can use",
    decision: "What needs to be agreed before the next stage?",
  };
}

function DecisionReading({ meta }: { meta: StageReading }) {
  return (
    <>
      <p className={styles.eyebrow}>The decision</p>
      <h3>{meta.title}</h3>
      <p className={styles.explanation}>{meta.explanation}</p>
    </>
  );
}

export function RootSystem({ stages }: { stages: ProcessStage[] }) {
  const readings = useMemo(() => stages.map(resolveReading), [stages]);
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const animatedStageRef = useRef(0);
  const selectionId = useId();
  const readingMotion = useAnimationControls();
  const noteMotion = useAnimationControls();
  const captionMotion = useAnimationControls();
  const outputMotion = useAnimationControls();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const cinematicMotion = useMediaQuery(
    "(min-width: 1181px) and (min-height: 761px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );
  const [frameFits, setFrameFits] = useState(false);
  const desktopStory = cinematicMotion && !prefersReducedMotion && frameFits;
  const sceneInView = useInView(sectionRef, { amount: 0.06 });
  const visualizer = useScrollDrivenVisualizer({
    scrollHysteresis: 0.0125,
    preservePanelFocus: true,
    focusScopeSelector: '[role="tabpanel"], [role="tablist"]',
    count: stages.length,
    target: sectionRef,
    enabled: desktopStory && sceneInView,
    reducedMotion: prefersReducedMotion,
  });
  // One selection survives switching between the scroll story, compact layout,
  // and reduced motion. The visualizer also accepts direct choices when idle.
  const active = Math.min(
    visualizer.activeIndex,
    Math.max(0, stages.length - 1),
  );
  // The photograph follows the same reversible timeline as the six decisions.
  // A close inspection opens out again; compact layouts retain a quiet still.
  const imageY = useTransform(visualizer.scrollYProgress, [0, .2, .4, .6, .8, 1], [14, -8, 5, -12, -4, 10]);
  const imageX = useTransform(visualizer.scrollYProgress, [0, .2, .4, .6, .8, 1], ["-1%", "1%", "-.7%", "1.2%", ".2%", "-.8%"]);
  const imageScale = useTransform(visualizer.scrollYProgress, [0, .2, .4, .6, .8, 1], [1.05, 1.1, 1.07, 1.13, 1.09, 1.04]);

  // Measure the natural frame, including the footer, before enabling a hold.
  // Sticky never imposes a height that could hide the last decision or action.
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
    readingMotion.stop(); noteMotion.stop(); captionMotion.stop(); outputMotion.stop();
    readingMotion.set({ x: 0, y: 0 });
    noteMotion.set({ x: 0, y: 0 });
    captionMotion.set({ x: 0 });
    outputMotion.set({ scaleX: 1 });
  }, [readingMotion, noteMotion, captionMotion, outputMotion]);

  useEffect(() => {
    const previous = animatedStageRef.current;
    animatedStageRef.current = active;
    settleReading();
    if (prefersReducedMotion || previous === active) return;
    const direction = Math.sign(active - previous);
    // Reading moves within a measured space; the note surface, result and
    // controls retain their positions through every forward or reverse step.
    readingMotion.set({ x: direction * 8, y: 2 });
    noteMotion.set({ x: direction * -6, y: 2 });
    captionMotion.set({ x: direction * 6 });
    outputMotion.set({ scaleX: .08 });
    void readingMotion.start({ x: 0, y: 0, transition: { duration: .38, ease: EASE } });
    void noteMotion.start({ x: 0, y: 0, transition: { duration: .42, ease: EASE } });
    void captionMotion.start({ x: 0, transition: { duration: .38, ease: EASE } });
    void outputMotion.start({ scaleX: 1, transition: { duration: .62, ease: EASE } });
    return () => { readingMotion.stop(); noteMotion.stop(); captionMotion.stop(); outputMotion.stop(); };
  }, [active, prefersReducedMotion, settleReading, readingMotion, noteMotion, captionMotion, outputMotion]);

  function choose(index: number) {
    visualizer.choose(index);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? stages.length - 1
      : event.key === "ArrowRight" ? (index + 1) % stages.length
      : (index - 1 + stages.length) % stages.length;
    choose(next);
    tabsRef.current[next]?.focus({ preventScroll: true });
  }

  if (!stages.length) return null;
  const stage = stages[active];
  const meta = readings[active];
  return (
    <section ref={sectionRef} data-project-journey="true" data-scroll-story="process" data-process-state={active} data-process-layout={desktopStory ? "held" : "flow"} className={`project-journey ${styles.journey}`} aria-labelledby="project-journey-title">
      <div ref={frameRef} className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>The working method</p>
            <h2 id="project-journey-title">How a project moves</h2>
          </div>
          <p className={styles.intro}>From the first questions to the work after launch. Each stage settles a decision the next one depends on.</p>
        </header>

        <div className={`project-journey__rail ${styles.tabs}`} role="tablist" aria-label="Project stages">
          {stages.map((item, index) => (
            <button
              key={item.stage}
              ref={(element) => { tabsRef.current[index] = element; }}
              id={`project-stage-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls="project-stage-panel"
              tabIndex={active === index ? 0 : -1}
              className={styles.tab}
              onClick={() => choose(index)}
              onFocus={() => choose(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {active === index && <motion.span className={styles.selection} layoutId={`project-selection-${selectionId}`} transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: EASE }} aria-hidden="true" />}
              <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.tabLabel}>{item.stage}</span>
            </button>
          ))}
        </div>

        <article id="project-stage-panel" role="tabpanel" aria-labelledby={`project-stage-tab-${active}`} tabIndex={0} className={styles.panel} onFocusCapture={settleReading} onPointerDownCapture={settleReading}>
          <div className={styles.media}>
            <motion.div className={styles.imagePlane} data-process-camera style={{ x: desktopStory ? imageX : 0, y: desktopStory ? imageY : 0, scale: desktopStory ? imageScale : 1 }}>
              <Image src="/images/strategy-working-desk.webp" alt="" fill sizes="(max-width: 900px) 100vw, 46vw" className={styles.image} />
            </motion.div>
            <div className={styles.imageShade} />
            <div className={styles.deskNote} data-process-note>
              <span>Before moving on</span>
              <div className={styles.readingStack}>
                <div className={styles.readingMeasure} aria-hidden="true" inert>
                  {readings.map((reading, index) => <p key={index}>{reading.decision}</p>)}
                </div>
                <motion.p data-process-note-reading initial={false} animate={noteMotion}>{meta.decision}</motion.p>
              </div>
            </div>
            <motion.p className={styles.imageCaption} initial={false} animate={captionMotion} aria-hidden="true">
              <span>{String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span>{stage.stage}
            </motion.p>
          </div>

          <div className={styles.reading} data-process-reading>
            <div className={styles.readingStack}>
              <div className={styles.readingMeasure} aria-hidden="true" inert>
                {readings.map((reading, index) => (
                  <div key={index}><DecisionReading meta={reading} /></div>
                ))}
              </div>
              <motion.div data-process-copy initial={false} animate={readingMotion}>
                <DecisionReading meta={meta} />
              </motion.div>
            </div>
            <dl className={styles.notes}>
              <div>
                <motion.span aria-hidden="true" className={styles.outputTrace} data-process-output-trace initial={false} animate={outputMotion} />
                <dt>What you receive</dt>
                <dd className={styles.readingStack}>
                  <span className={styles.readingMeasure} aria-hidden="true" inert>
                    {readings.map((reading, index) => <span key={index}>{reading.output}</span>)}
                  </span>
                  <span>{meta.output}</span>
                </dd>
              </div>
            </dl>
          </div>
        </article>

        <footer className={styles.footer}>
          <p>Bring the unfinished notes and the questions you keep coming back to.</p>
          <div>
            <Link href="/contact">Bring me the messy version <span aria-hidden="true">↗</span></Link>
            <span>{consultation.minutes} minutes · No deck required</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
