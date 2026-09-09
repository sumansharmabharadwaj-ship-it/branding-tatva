"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
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

export function RootSystem({ stages }: { stages: ProcessStage[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const selectionId = useId();
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [selected, setSelected] = useState(0);
  const active = Math.min(selected, Math.max(0, stages.length - 1));
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.1]);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? stages.length - 1
      : event.key === "ArrowRight" ? (index + 1) % stages.length
      : (index - 1 + stages.length) % stages.length;
    setSelected(next);
    tabsRef.current[next]?.focus();
  }

  if (!stages.length) return null;
  const stage = stages[active];
  const meta = STAGE_META[active] ?? {
    title: stage.stage,
    explanation: stage.description,
    output: "A decision the next stage can use",
    decision: "What needs to be agreed before the next stage?",
  };

  return (
    <section ref={sectionRef} data-project-journey="true" className={`project-journey ${styles.journey}`} aria-labelledby="project-journey-title">
      <div className={styles.shell}>
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
              onClick={() => setSelected(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {active === index && <motion.span className={styles.selection} layoutId={`project-selection-${selectionId}`} transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: EASE }} aria-hidden="true" />}
              <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.tabLabel}>{item.stage}</span>
            </button>
          ))}
        </div>

        <article id="project-stage-panel" role="tabpanel" aria-labelledby={`project-stage-tab-${active}`} tabIndex={0} className={styles.panel}>
          <div className={styles.media} aria-hidden="true">
            <motion.div className={styles.imagePlane} style={prefersReducedMotion ? undefined : { y: imageY, scale: imageScale }}>
              {stage.poster && <Image src={stage.poster} alt="" fill sizes="(max-width: 680px) 100vw, 46vw" className={styles.image} />}
            </motion.div>
            <div className={styles.imageShade} />
            <p className={styles.imageCaption}><span>{String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span>{stage.stage}</p>
          </div>

          <motion.div key={active} className={styles.reading} initial={prefersReducedMotion ? false : { x: 10 }} animate={{ x: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: EASE }}>
            <p className={styles.eyebrow}>The decision</p>
            <h3>{meta.title}</h3>
            <p className={styles.explanation}>{meta.explanation}</p>
            <dl className={styles.notes}>
              <div><dt>What you receive</dt><dd>{meta.output}</dd></div>
              <div><dt>Before moving on</dt><dd>{meta.decision}</dd></div>
            </dl>
          </motion.div>
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
