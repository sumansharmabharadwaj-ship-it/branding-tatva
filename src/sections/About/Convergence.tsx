"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useInView, useSpring, useTransform } from "framer-motion";
import { ArrowRight, BookOpenText, Brain } from "lucide-react";
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
  { label: "Positioning", line: "Where you belong, in plain language." },
  { label: "Language", line: "Words the whole team can use." },
  { label: "Recognition", line: "A pattern the audience can recognise." },
] as const;

const STAGES = [
  {
    number: "01",
    label: "Read",
    cue: "I find the hesitation hiding behind the brief.",
    centreLabel: "Buyer hesitation",
    centreLine: "The moment confidence breaks.",
  },
  {
    number: "02",
    label: "Connect",
    cue: "I connect the behaviour to language the market can hold.",
    centreLabel: "Synthesis",
    centreLine: "Evidence becomes a position.",
  },
  {
    number: "03",
    label: "Carry",
    cue: "Your team leaves with one thought that governs every expression.",
    centreLabel: "Usable position",
    centreLine: "One thought. Every expression.",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const SCROLL_BEATS = [0, 0.29, 0.36, 0.62, 0.69, 1];
const VERTICAL_SWAP = {
  enter: (direction: number) => ({ opacity: 0, y: direction * 7 }),
  active: { opacity: 1, y: 0 },
  exit: (direction: number) => ({ opacity: 0, y: direction * -5 }),
};
const HORIZONTAL_SWAP = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 8 }),
  active: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -6 }),
};

export function Convergence() {
  const sectionRef = useRef<HTMLElement>(null);
  const previousStageRef = useRef(0);
  const [inspectedPair, setInspectedPair] = useState(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.2, margin: "8% 0px -12% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: STAGES.length,
    target: sectionRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const pacedScrollProgress = useSpring(visualizer.scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.2,
  });
  const readProgress = useTransform(pacedScrollProgress, [0, 0.29], [0, 1]);
  const connectProgress = useTransform(pacedScrollProgress, [0.36, 0.62], [0, 1]);
  const carryProgress = useTransform(pacedScrollProgress, [0.69, 1], [0, 1]);
  const registerProgress = useTransform(
    pacedScrollProgress,
    SCROLL_BEATS,
    [0.34, 0.53, 0.53, 0.76, 0.76, 1],
  );
  const psychologyX = useTransform(
    pacedScrollProgress,
    SCROLL_BEATS,
    ["-1vw", "-1vw", "0vw", "0vw", "2.5vw", "2.5vw"],
  );
  const literatureX = useTransform(
    pacedScrollProgress,
    SCROLL_BEATS,
    ["1vw", "1vw", "0vw", "0vw", "-2.5vw", "-2.5vw"],
  );
  const disciplineOpacity = useTransform(
    pacedScrollProgress,
    SCROLL_BEATS,
    [1, 1, 1, 1, 0.28, 0.28],
  );
  const signalScale = useTransform(
    pacedScrollProgress,
    SCROLL_BEATS,
    [0.96, 0.96, 1, 1, 0.97, 0.97],
  );
  const signalY = useTransform(pacedScrollProgress, SCROLL_BEATS, [8, 8, 0, 0, -6, -6]);
  const signalOpacity = useTransform(
    pacedScrollProgress,
    SCROLL_BEATS,
    [1, 1, 1, 1, 0.38, 0.38],
  );
  const outcomeOpacity = useTransform(pacedScrollProgress, [0.69, 0.8], [0, 1]);
  const outcomeY = useTransform(pacedScrollProgress, [0.69, 0.8], [10, 0]);
  const outputsOpacity = useTransform(pacedScrollProgress, [0.76, 0.92], [0, 1]);
  const outputsY = useTransform(pacedScrollProgress, [0.76, 0.92], [14, 0]);
  const stageProgress = [readProgress, connectProgress, carryProgress] as const;
  const stage = prefersReducedMotion ? STAGES.length - 1 : visualizer.activeIndex;
  const activeStage = STAGES[stage];
  const transitionDirection = stage >= previousStageRef.current ? 1 : -1;
  const activePair = PAIRINGS[inspectedPair];
  const registerLeft = stage === 1 ? activePair.human : stage === 0 ? "Observe" : "Position";
  const registerRight = stage === 1 ? activePair.language : stage === 0 ? "Interpret" : "Express";
  const registerResult = stage === 1 ? activePair.result : stage === 0 ? "Tension" : "Direction";

  useEffect(() => {
    previousStageRef.current = stage;
  }, [stage]);

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
    >
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Why the disciplines meet</p>
            <h2 id="convergence-title">
              I read the decision <em>before I write the line.</em>
            </h2>
          </div>
          <div className={styles.headerAside}>
            <AnimatePresence mode="popLayout" initial={false} custom={transitionDirection}>
              <motion.p
                key={activeStage.number}
                custom={transitionDirection}
                variants={VERTICAL_SWAP}
                initial={prefersReducedMotion ? false : "enter"}
                animate="active"
                exit={prefersReducedMotion ? undefined : "exit"}
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
            style={
              prefersReducedMotion
                ? { x: "2.5vw", opacity: 0.28 }
                : { x: psychologyX, opacity: disciplineOpacity }
            }
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

            <motion.figure
              className={styles.signalCore}
              data-register-stage={activeStage.number}
              style={
                prefersReducedMotion
                  ? { scale: 0.97, y: -6, opacity: 0.38 }
                  : { scale: signalScale, y: signalY, opacity: signalOpacity }
              }
            >
              <div className={styles.folioImage} aria-hidden="true">
                <div className={styles.decisionRegister}>
                  <div className={styles.registerHead}>
                    <span>Behaviour</span>
                    <span>Language</span>
                  </div>
                  <div className={styles.registerTerms}>
                    <AnimatePresence mode="popLayout" initial={false} custom={transitionDirection}>
                      <motion.strong
                        key={registerLeft}
                        custom={transitionDirection}
                        variants={VERTICAL_SWAP}
                        initial={prefersReducedMotion ? false : "enter"}
                        animate="active"
                        exit={prefersReducedMotion ? undefined : "exit"}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: EASE }}
                      >
                        {registerLeft}
                      </motion.strong>
                    </AnimatePresence>
                    <i />
                    <AnimatePresence mode="popLayout" initial={false} custom={transitionDirection}>
                      <motion.strong
                        key={registerRight}
                        custom={transitionDirection}
                        variants={VERTICAL_SWAP}
                        initial={prefersReducedMotion ? false : "enter"}
                        animate="active"
                        exit={prefersReducedMotion ? undefined : "exit"}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: EASE }}
                      >
                        {registerRight}
                      </motion.strong>
                    </AnimatePresence>
                  </div>
                  <div className={styles.registerMeasure}>
                    <motion.span
                      style={prefersReducedMotion ? undefined : { scaleX: registerProgress }}
                    />
                  </div>
                  <div className={styles.registerResult}>
                    <AnimatePresence mode="popLayout" initial={false} custom={transitionDirection}>
                      <motion.small
                        key={stage === 1 ? "resolved" : "decision"}
                        custom={transitionDirection}
                        variants={VERTICAL_SWAP}
                        initial={prefersReducedMotion ? false : "enter"}
                        animate="active"
                        exit={prefersReducedMotion ? undefined : "exit"}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.34, ease: EASE }}
                      >
                        {stage === 1 ? "Resolved as" : "Decision state"}
                      </motion.small>
                    </AnimatePresence>
                    <AnimatePresence mode="popLayout" initial={false} custom={transitionDirection}>
                      <motion.strong
                        key={registerResult}
                        custom={transitionDirection}
                        variants={HORIZONTAL_SWAP}
                        initial={prefersReducedMotion ? false : "enter"}
                        animate="active"
                        exit={prefersReducedMotion ? undefined : "exit"}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE }}
                      >
                        {registerResult}
                      </motion.strong>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <figcaption className={styles.folioCopy}>
                <AnimatePresence mode="popLayout" initial={false} custom={transitionDirection}>
                  <motion.span
                    key={activeStage.number}
                    custom={transitionDirection}
                    variants={VERTICAL_SWAP}
                    initial={prefersReducedMotion ? false : "enter"}
                    animate="active"
                    exit={prefersReducedMotion ? undefined : "exit"}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: EASE }}
                  >
                    {activeStage.number} / 03
                  </motion.span>
                </AnimatePresence>
                <AnimatePresence mode="popLayout" initial={false} custom={transitionDirection}>
                  <motion.small
                    key={stage === 1 ? activePair.result : activeStage.centreLabel}
                    custom={transitionDirection}
                    variants={VERTICAL_SWAP}
                    initial={prefersReducedMotion ? false : "enter"}
                    animate="active"
                    exit={prefersReducedMotion ? undefined : "exit"}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.34, ease: EASE }}
                  >
                    {stage === 1 ? activePair.result : activeStage.centreLabel}
                  </motion.small>
                </AnimatePresence>
                <AnimatePresence mode="popLayout" initial={false} custom={transitionDirection}>
                  <motion.strong
                    key={stage === 1 ? activePair.coreLine : activeStage.centreLine}
                    custom={transitionDirection}
                    variants={VERTICAL_SWAP}
                    initial={prefersReducedMotion ? false : "enter"}
                    animate="active"
                    exit={prefersReducedMotion ? undefined : "exit"}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: EASE }}
                  >
                    {stage === 1 ? activePair.coreLine : activeStage.centreLine}
                  </motion.strong>
                </AnimatePresence>
              </figcaption>
            </motion.figure>

            <div className={styles.outputs}>
              <motion.p
                className={styles.outcomeStatement}
                style={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: outcomeOpacity, y: outcomeY }
                }
              >
                One position the whole brand can carry.
              </motion.p>
              {OUTPUTS.map((output, index) => (
                <motion.div
                  key={output.label}
                  style={
                    prefersReducedMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: outputsOpacity, y: outputsY }
                  }
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
            style={
              prefersReducedMotion
                ? { x: "-2.5vw", opacity: 0.28 }
                : { x: literatureX, opacity: disciplineOpacity }
            }
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
            <small>The hiring payoff</small>
            <strong>One position the whole brand can carry.</strong>
            <p>Not two degrees on display. A sharper decision your team can use.</p>
            <ul>{OUTPUTS.map((output) => <li key={output.label}>{output.label}</li>)}</ul>
            <Link href="/services#proof">See the thinking in a client record <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.tabs} role="tablist" aria-label="Choose a discipline combination">
            {STAGES.map((item, index) => {
              const selected = stage === index;
              const progress = stageProgress[index];
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
                  <motion.i
                    aria-hidden="true"
                    style={prefersReducedMotion ? undefined : { scaleX: progress }}
                  />
                </button>
              );
            })}
          </div>
          <Link href="/services#proof">See the thinking in a client record <ArrowRight size={14} aria-hidden="true" /></Link>
        </footer>
      </div>
    </section>
  );
}
