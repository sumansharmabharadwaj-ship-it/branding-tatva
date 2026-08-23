"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { BookOpenText, Brain, MoveRight, Sparkles } from "lucide-react";
import { VisualizerPlayback } from "@/components/VisualizerPlayback";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useTimedVisualizer } from "@/hooks/useTimedVisualizer";
import styles from "./Convergence.module.css";

const DWELL_MS = 5200;

const STAGES = [
  {
    number: "01",
    label: "Notice",
    title: "Psychology reads what happens before a choice.",
    explanation:
      "Attention reveals the signal. Association gives it meaning. Memory holds the pattern. Choice shows whether the pattern became useful.",
    psychology: ["Attention", "Association", "Memory", "Choice"],
    language: ["Framing", "Narrative", "Metaphor", "Tone"],
    overlap: ["Positioning", "Identity", "Recognition"],
    active: "psychology",
  },
  {
    number: "02",
    label: "Interpret",
    title: "Literature gives the tension a form people can carry.",
    explanation:
      "Framing sets the angle. Narrative creates movement. Metaphor makes the unfamiliar graspable. Tone teaches people how the brand should feel.",
    psychology: ["Attention", "Association", "Memory", "Choice"],
    language: ["Framing", "Narrative", "Metaphor", "Tone"],
    overlap: ["Positioning", "Identity", "Recognition"],
    active: "language",
  },
  {
    number: "03",
    label: "Choose",
    title: "The two disciplines become one practical decision system.",
    explanation:
      "The overlap turns evidence and language into positioning, identity, and repeated recognition—the parts a growing business can keep using.",
    psychology: ["Attention", "Association", "Memory", "Choice"],
    language: ["Framing", "Narrative", "Metaphor", "Tone"],
    overlap: ["Positioning", "Identity", "Recognition"],
    active: "overlap",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function Convergence() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.18, margin: "8% 0px -12% 0px" });
  const visualizer = useTimedVisualizer({
    count: STAGES.length,
    durationMs: DWELL_MS,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const active = STAGES[visualizer.activeIndex];

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
      data-convergence-stage={active.number}
      aria-labelledby="convergence-title"
    >
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>The psychology × literature method</p>
            <h2 id="convergence-title">
              Two disciplines. <em>One usable brand system.</em>
            </h2>
          </div>
          <div className={styles.intro}>
            <p>
              The August 8 idea, restored as a self-running visualizer. Select any stage to hold it; press play to continue.
            </p>
            <VisualizerPlayback
              current={visualizer.activeIndex}
              total={STAGES.length}
              durationMs={visualizer.durationMs}
              isRunning={visualizer.isRunning}
              progressKey={visualizer.progressKey}
              onToggle={visualizer.toggle}
              label="Psychology and literature method autoplay"
              tone="light"
            />
          </div>
        </header>

        <div className={styles.instrument}>
          <div className={styles.fields} aria-label="Psychology and literature inputs">
            <motion.article
              className={styles.field}
              data-active={active.active === "psychology" || active.active === "overlap"}
              animate={{ opacity: active.active === "language" ? 0.56 : 1, y: active.active === "psychology" ? -4 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}
            >
              <div className={styles.fieldTitle}>
                <span><Brain size={19} /></span>
                <div><small>Field one</small><h3>Psychology</h3></div>
              </div>
              <p>How people notice, associate, remember, and choose.</p>
              <ul>{active.psychology.map((term) => <li key={term}>{term}</li>)}</ul>
            </motion.article>

            <div className={styles.transfer} aria-hidden="true">
              <MoveRight size={19} />
              <span>evidence becomes language</span>
              <MoveRight size={19} />
            </div>

            <motion.article
              className={styles.field}
              data-active={active.active === "language" || active.active === "overlap"}
              animate={{ opacity: active.active === "psychology" ? 0.56 : 1, y: active.active === "language" ? -4 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}
            >
              <div className={styles.fieldTitle}>
                <span><BookOpenText size={19} /></span>
                <div><small>Field two</small><h3>Literature</h3></div>
              </div>
              <p>How meaning is framed, narrated, felt, and repeated.</p>
              <ul>{active.language.map((term) => <li key={term}>{term}</li>)}</ul>
            </motion.article>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={active.number}
              className={styles.resolution}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}
              aria-live="polite"
            >
              <div className={styles.resolutionIcon}><Sparkles size={18} /></div>
              <div className={styles.resolutionCopy}>
                <span>{active.number} · {active.label}</span>
                <h3>{active.title}</h3>
                <p>{active.explanation}</p>
              </div>
              <ul>{active.overlap.map((term) => <li key={term}>{term}</li>)}</ul>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Choose a method stage">
          {STAGES.map((stage, index) => {
            const selected = index === visualizer.activeIndex;
            return (
              <button
                key={stage.number}
                id={`convergence-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                data-active={selected}
                onClick={() => visualizer.choose(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <span>{stage.number}</span>
                <strong>{stage.label}</strong>
                <i aria-hidden="true">
                  {selected && visualizer.isRunning ? (
                    <b key={visualizer.progressKey} style={{ animationDuration: `${visualizer.durationMs}ms` }} />
                  ) : null}
                </i>
              </button>
            );
          })}
          <Link href="/services#proof">See the method applied <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
