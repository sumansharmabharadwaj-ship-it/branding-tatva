"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, BookOpenText, Brain, Sparkles } from "lucide-react";
import { VisualizerPlayback } from "@/components/VisualizerPlayback";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useTimedVisualizer } from "@/hooks/useTimedVisualizer";
import styles from "./Convergence.module.css";

const DWELL_MS = 4600;

const FIELDS = [
  {
    number: "01",
    name: "Psychology",
    degree: "M.A. Clinical Psychology",
    line: "Reads attention, tension, memory, and the way a choice is actually made.",
    terms: ["Attention", "Association", "Memory", "Choice"],
    icon: Brain,
  },
  {
    number: "02",
    name: "Literature",
    degree: "B.A. English Literature",
    line: "Gives the idea language people can understand, remember, and repeat.",
    terms: ["Framing", "Narrative", "Metaphor", "Tone"],
    icon: BookOpenText,
  },
] as const;

const STAGES = [
  { number: "01", label: "Read", cue: "Two distinct lenses read the same business tension." },
  { number: "02", label: "Converge", cue: "Evidence moves toward language; language returns as a decision." },
  { number: "03", label: "Resolve", cue: "The two disciplines become one practical brand system." },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function Convergence() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.22, margin: "8% 0px -12% 0px" });
  const visualizer = useTimedVisualizer({
    count: STAGES.length,
    durationMs: DWELL_MS,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const stage = visualizer.activeIndex;

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % STAGES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + STAGES.length - 1) % STAGES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = STAGES.length - 1;
    else return;

    event.preventDefault();
    visualizer.choose(next);
    document.getElementById(`convergence-tab-${next}`)?.focus();
  }

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-about-scene="method"
      data-convergence-stage={STAGES[stage].number}
      aria-labelledby="convergence-title"
    >
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Two disciplines. One practice.</p>
            <h2 id="convergence-title">
              Psychology reads the tension. <em>Literature gives it language.</em>
            </h2>
          </div>
          <div className={styles.headerAside}>
            <p>{STAGES[stage].cue}</p>
            <VisualizerPlayback
              current={stage}
              total={STAGES.length}
              durationMs={visualizer.durationMs}
              isRunning={visualizer.isRunning}
              progressKey={visualizer.progressKey}
              onToggle={visualizer.toggle}
              label="Psychology and literature convergence autoplay"
              tone="light"
            />
          </div>
        </header>

        <div className={styles.stage} aria-live="polite">
          <motion.span
            aria-hidden="true"
            className={styles.rule}
            animate={{ scaleX: stage === 0 ? 0.22 : stage === 1 ? 1 : 0.38, opacity: stage === 2 ? 0.28 : 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: EASE }}
          />

          <div className={styles.fields}>
            {FIELDS.map((field, index) => {
              const Icon = field.icon;
              const direction = index === 0 ? -1 : 1;
              return (
                <motion.article
                  key={field.name}
                  className={styles.field}
                  data-field={index === 0 ? "psychology" : "literature"}
                  animate={{
                    x: stage === 0 ? `${direction * 5.5}vw` : stage === 1 ? `${direction * 0.8}vw` : `${direction * -1.8}vw`,
                    scale: stage === 2 ? 0.94 : 1,
                    opacity: stage === 2 ? 0.16 : 1,
                  }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: EASE }}
                >
                  <div className={styles.fieldHeading}>
                    <span><Icon size={18} /></span>
                    <div>
                      <small>{field.number} · {field.degree}</small>
                      <h3>{field.name}</h3>
                    </div>
                  </div>
                  <p>{field.line}</p>
                  <ul>{field.terms.map((term) => <li key={term}>{term}</li>)}</ul>
                </motion.article>
              );
            })}
          </div>

          <div className={styles.transferSlot} aria-hidden={stage !== 1}>
            <motion.div
              className={styles.transfer}
              animate={{ opacity: stage === 1 ? 1 : 0, scale: stage === 1 ? 1 : 0.84 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.46, ease: EASE }}
            >
              <Sparkles size={16} />
              <span>evidence becomes language</span>
            </motion.div>
          </div>

          <AnimatePresence initial={false}>
            {stage === 2 ? (
              <div key="resolved-method" className={styles.resolutionSlot}>
                <motion.article
                  className={styles.resolution}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12, scale: 0.97 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.58, ease: EASE }}
                >
                  <span className={styles.resolutionIcon}><Sparkles size={18} /></span>
                  <p>Where the two meet</p>
                  <h3>Brand strategy <em>becomes usable.</em></h3>
                  <p className={styles.resolutionBody}>
                    Psychology finds the tension. Literature gives it language. Strategy turns both into a system a growing business can carry forward.
                  </p>
                  <ul>
                    <li>Positioning</li>
                    <li>Identity</li>
                    <li>Recognition</li>
                  </ul>
                </motion.article>
              </div>
            ) : null}
          </AnimatePresence>
        </div>

        <footer className={styles.footer}>
          <div className={styles.tabs} role="tablist" aria-label="Choose a convergence stage">
            {STAGES.map((item, index) => {
              const selected = stage === index;
              return (
                <button
                  key={item.number}
                  id={`convergence-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  data-active={selected}
                  onClick={() => visualizer.choose(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  <span>{item.number}</span>
                  <strong>{item.label}</strong>
                  <i aria-hidden="true">
                    {selected && visualizer.isRunning ? (
                      <b key={visualizer.progressKey} style={{ animationDuration: `${visualizer.durationMs}ms` }} />
                    ) : null}
                  </i>
                </button>
              );
            })}
          </div>
          <Link href="/services#proof">See the method applied <ArrowRight size={14} /></Link>
        </footer>
      </div>
    </section>
  );
}
