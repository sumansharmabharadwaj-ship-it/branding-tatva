"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, BookOpenText, Brain, Sparkles } from "lucide-react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import styles from "./Convergence.module.css";

const PSYCHOLOGY_SIGNALS = ["Attention", "Association", "Memory", "Choice"] as const;
const LITERARY_SIGNALS = ["Framing", "Metaphor", "Narrative", "Tone"] as const;

const PAIRINGS = [
  {
    human: "Attention",
    language: "Framing",
    result: "Category",
    explanation: "What gets noticed first shapes what kind of brand people believe they are seeing.",
  },
  {
    human: "Association",
    language: "Metaphor",
    result: "Meaning",
    explanation: "Comparison and imagery give an unfamiliar offer a more useful place in the mind.",
  },
  {
    human: "Memory",
    language: "Narrative",
    result: "Recognition",
    explanation: "A coherent story gives the same strategic signal a structure worth remembering.",
  },
  {
    human: "Choice",
    language: "Tone",
    result: "Confidence",
    explanation: "The right verbal character makes the next decision feel clear, credible, and possible.",
  },
] as const;

const OUTPUTS = [
  { label: "Positioning", line: "What the brand should mean in the market." },
  { label: "Language", line: "How that meaning becomes clear and repeatable." },
  { label: "Recognition", line: "What stays consistent enough to become familiar." },
] as const;

const STAGES = [
  {
    number: "01",
    label: "Read",
    cue: "Hold the human signal and the language separately long enough to see both clearly.",
    centreLabel: "Business tension",
    centreLine: "Read what is really happening.",
  },
  {
    number: "02",
    label: "Connect",
    cue: "Pair what people notice with the language that can carry its meaning.",
    centreLabel: "Synthesis",
    centreLine: "Turn observation into a point of view.",
  },
  {
    number: "03",
    label: "Carry",
    cue: "Resolve the connections into one strategic signal the brand can keep using.",
    centreLabel: "Brand signal",
    centreLine: "One idea, clear enough to carry.",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function Convergence() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.2, margin: "8% 0px -12% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: STAGES.length,
    target: sectionRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const stage = prefersReducedMotion ? STAGES.length - 1 : visualizer.activeIndex;
  const activeStage = STAGES[stage];

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
      data-scroll-story="about-convergence"
      data-convergence-stage={activeStage.number}
      aria-labelledby="convergence-title"
    >
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>The synthesis · from observation to signal</p>
            <h2 id="convergence-title">
              Two disciplines meet inside <em>one brand decision.</em>
            </h2>
          </div>
          <div className={styles.headerAside}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={activeStage.number}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: EASE }}
              >
                {activeStage.cue}
              </motion.p>
            </AnimatePresence>
            <p className={styles.stageCue} aria-live="polite">
              <span>{activeStage.label}</span>
              <strong>{activeStage.number} / 03</strong>
            </p>
          </div>
        </header>

        <div
          id="convergence-panel"
          className={styles.cinematicStage}
          role="tabpanel"
          aria-labelledby={`convergence-tab-${stage}`}
        >
          <p className="sr-only">
            Psychology reads attention, association, memory, and choice. Literature shapes framing,
            metaphor, narrative, and tone. Together they turn a business tension into positioning,
            language, and recognition.
          </p>
          <motion.article
            className={`${styles.discipline} ${styles.psychology}`}
            aria-hidden="true"
            animate={{
              x: stage === 0 ? "-1.8vw" : stage === 1 ? "0vw" : "4.5vw",
              opacity: stage === 2 ? 0.28 : 1,
            }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: EASE }}
          >
            <div className={styles.disciplineHeading}>
              <span><Brain size={18} aria-hidden="true" /></span>
              <div>
                <small>M.A. Clinical Psychology</small>
                <h3>Reads behaviour</h3>
              </div>
            </div>
            <p>What people notice, connect, remember, and choose.</p>
            <ul>
              {PSYCHOLOGY_SIGNALS.map((signal, index) => (
                <li key={signal} data-pair={index + 1}><span>0{index + 1}</span>{signal}</li>
              ))}
            </ul>
          </motion.article>

          <div className={styles.synthesisField} aria-hidden="true">
            <div className={styles.threadField}>
              {PAIRINGS.map((pair, index) => (
                <div className={styles.thread} key={pair.result} data-thread={index + 1}>
                  <span />
                  <strong>{pair.result}</strong>
                  <span />
                </div>
              ))}
            </div>

            <motion.div
              className={styles.signalCore}
              animate={{
                scale: stage === 0 ? 0.82 : stage === 1 ? 1 : 1.2,
                rotate: stage === 0 ? -5 : stage === 1 ? 0 : 4,
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.78, ease: EASE }}
            >
              <span className={styles.coreHalo} />
              <Sparkles size={18} />
              <small>{activeStage.centreLabel}</small>
              <strong>{activeStage.centreLine}</strong>
            </motion.div>

            <div className={styles.outputs}>
              {OUTPUTS.map((output, index) => (
                <motion.div
                  key={output.label}
                  initial={false}
                  animate={{
                    opacity: stage === 2 ? 1 : 0,
                    y: stage === 2 ? 0 : 14,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.48,
                    delay: prefersReducedMotion ? 0 : index * 0.06,
                    ease: EASE,
                  }}
                >
                  <span>0{index + 1}</span>
                  <strong>{output.label}</strong>
                  <p>{output.line}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.article
            className={`${styles.discipline} ${styles.literature}`}
            aria-hidden="true"
            animate={{
              x: stage === 0 ? "1.8vw" : stage === 1 ? "0vw" : "-4.5vw",
              opacity: stage === 2 ? 0.28 : 1,
            }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: EASE }}
          >
            <div className={styles.disciplineHeading}>
              <span><BookOpenText size={18} aria-hidden="true" /></span>
              <div>
                <small>B.A. (Hons) English Literature</small>
                <h3>Shapes meaning</h3>
              </div>
            </div>
            <p>How an idea is framed, imagined, ordered, and voiced.</p>
            <ul>
              {LITERARY_SIGNALS.map((signal, index) => (
                <li key={signal} data-pair={index + 1}><span>0{index + 1}</span>{signal}</li>
              ))}
            </ul>
          </motion.article>
        </div>

        <div className={styles.mobileSynthesis}>
          <div className={styles.mobileFields}>
            <div>
              <span><Brain size={17} aria-hidden="true" /></span>
              <p>Psychology reads behaviour.</p>
            </div>
            <div>
              <span><BookOpenText size={17} aria-hidden="true" /></span>
              <p>Literature shapes meaning.</p>
            </div>
          </div>
          <ol>
            {PAIRINGS.map((pair) => (
              <li key={pair.result}>
                <p><span>{pair.human}</span><i>+</i><span>{pair.language}</span></p>
                <div>
                  <strong>{pair.result}</strong>
                  <p>{pair.explanation}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className={styles.mobileResolution}>
            <small>One usable brand signal</small>
            <ul>{OUTPUTS.map((output) => <li key={output.label}>{output.label}</li>)}</ul>
            <Link href="/services#proof">See the synthesis applied <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.tabs} role="tablist" aria-label="Explore how the disciplines combine">
            {STAGES.map((item, index) => {
              const selected = stage === index;
              return (
                <button
                  key={item.number}
                  id={`convergence-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="convergence-panel"
                  tabIndex={selected ? 0 : -1}
                  data-active={selected}
                  onClick={() => visualizer.choose(index)}
                  onPointerEnter={() => visualizer.preview(index)}
                  onPointerLeave={visualizer.releasePreview}
                  onFocus={() => visualizer.preview(index)}
                  onBlur={visualizer.releasePreview}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  <span>{item.number}</span>
                  <strong>{item.label}</strong>
                  <i aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <Link href="/services#proof">See the synthesis applied <ArrowRight size={14} aria-hidden="true" /></Link>
        </footer>
      </div>
    </section>
  );
}
