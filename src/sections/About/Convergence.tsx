"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
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
    coreLine: "What kind of brand people believe they are seeing.",
    explanation: "What gets noticed first shapes what kind of brand people believe they are seeing.",
  },
  {
    human: "Association",
    language: "Metaphor",
    result: "Meaning",
    coreLine: "Where an unfamiliar offer belongs in the mind.",
    explanation: "Comparison and imagery give an unfamiliar offer a more useful place in the mind.",
  },
  {
    human: "Memory",
    language: "Narrative",
    result: "Recognition",
    coreLine: "A structure the audience can meet again.",
    explanation: "A recognisable story gives the same idea a structure worth remembering.",
  },
  {
    human: "Choice",
    language: "Tone",
    result: "Confidence",
    coreLine: "Language that makes the next choice feel credible.",
    explanation: "The right verbal character makes the next decision feel credible and possible.",
  },
] as const;

const OUTPUTS = [
  { label: "Positioning", line: "What the brand should mean in the market." },
  { label: "Language", line: "How that meaning becomes specific and repeatable." },
  { label: "Recognition", line: "What stays consistent enough to become familiar." },
] as const;

const STAGES = [
  {
    number: "01",
    label: "Read",
    cue: "Study the human behaviour and the language separately before connecting them.",
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
    cue: "Resolve the connections into a position the brand can keep using.",
    centreLabel: "Brand position",
    centreLine: "The idea the whole brand can carry.",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function Convergence() {
  const sectionRef = useRef<HTMLElement>(null);
  const pointerFrameRef = useRef(0);
  const [inspectedPair, setInspectedPair] = useState(0);
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
  const activePair = PAIRINGS[inspectedPair];

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), []);

  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const node = sectionRef.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--convergence-pointer-x", x.toFixed(3));
      node.style.setProperty("--convergence-pointer-y", y.toFixed(3));
    });
  }

  function resetPointer() {
    const node = sectionRef.current;
    if (!node) return;
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--convergence-pointer-x", "0");
      node.style.setProperty("--convergence-pointer-y", "0");
    });
  }

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
      data-convergence-pair={inspectedPair + 1}
      aria-labelledby="convergence-title"
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
    >
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>How the method works</p>
            <h2 id="convergence-title">
              Psychology finds the tension. <em>Literature gives it language.</em>
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
            <ul data-inspected-pair={inspectedPair + 1}>
              {PSYCHOLOGY_SIGNALS.map((signal, index) => (
                <li key={signal} data-pair={index + 1}><span>0{index + 1}</span>{signal}</li>
              ))}
            </ul>
          </motion.article>

          <div className={styles.synthesisField}>
            <div className={styles.threadField}>
              {PAIRINGS.map((pair, index) => (
                <div className={styles.thread} key={pair.result} data-thread={index + 1}>
                  <span />
                  <button
                    type="button"
                    aria-label={`${pair.human} and ${pair.language} shape ${pair.result}`}
                    aria-pressed={inspectedPair === index}
                    tabIndex={stage === 1 ? 0 : -1}
                    onClick={() => setInspectedPair(index)}
                    onPointerEnter={() => setInspectedPair(index)}
                    onFocus={() => setInspectedPair(index)}
                  >
                    <small>{pair.human} + {pair.language}</small>
                    <strong>{pair.result}</strong>
                  </button>
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
              <small>{stage === 1 ? activePair.result : activeStage.centreLabel}</small>
              <strong>{stage === 1 ? activePair.coreLine : activeStage.centreLine}</strong>
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
            <ul data-inspected-pair={inspectedPair + 1}>
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
            <small>What the business can use</small>
            <ul>{OUTPUTS.map((output) => <li key={output.label}>{output.label}</li>)}</ul>
            <Link href="/services#proof">Inspect a client record <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.tabs} role="tablist" aria-label="Choose a discipline combination">
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
                  onPointerDown={() => visualizer.choose(index)}
                  onClick={(event) => event.detail === 0 && visualizer.choose(index)}
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
          <Link href="/services#proof">Inspect a client record <ArrowRight size={14} aria-hidden="true" /></Link>
        </footer>
      </div>
    </section>
  );
}
