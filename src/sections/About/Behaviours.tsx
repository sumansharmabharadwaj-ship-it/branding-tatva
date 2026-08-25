"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  FileCheck2,
  MessageCircleMore,
  Repeat2,
  ScanSearch,
} from "lucide-react";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import styles from "./Behaviours.module.css";

const STANDARDS = [
  {
    short: "Evidence",
    title: "Evidence before volume",
    line: "Let the strength of the proof set the strength of the claim.",
    practice:
      "Measured outcomes, strategic outputs, and implementation-ready work are recorded as three distinct forms of evidence.",
    visible: "A source, an output, or an honest evidence label travels with the statement.",
    recordLabel: "Observed evidence",
    recordValue: "What can be supported now",
    trace: "Source attached",
    icon: FileCheck2,
  },
  {
    short: "Diagnosis",
    title: "Diagnosis before decoration",
    line: "Name the category problem before shaping expression.",
    practice:
      "The work first examines what buyers think they are seeing, which alternatives frame the category, and where the current signal loses clarity.",
    visible: "The category, audience, and positioning choice are stated before visual or verbal routes begin.",
    recordLabel: "Category choice",
    recordValue: "What the brand must mean",
    trace: "Frame clarified",
    icon: ScanSearch,
  },
  {
    short: "Reasoning",
    title: "Reasoning before verdict",
    line: "Make the reasoning available with the recommendation.",
    practice:
      "Each recommendation carries the observation behind it, the viable paths considered, and the reason one direction serves the brand best.",
    visible: "The client can question the logic, reuse it, and explain it after the engagement ends.",
    recordLabel: "Reasoning trail",
    recordValue: "Why this direction holds",
    trace: "Logic documented",
    icon: MessageCircleMore,
  },
  {
    short: "Recognition",
    title: "Recognition before novelty",
    line: "Let fresh expression carry the same strategic signal.",
    practice:
      "Positioning, verbal identity, and visual rules return with enough discipline to become familiar in the buyer's mind.",
    visible: "New campaigns can change their surface while preserving the meaning people are learning to recognise.",
    recordLabel: "Repeatable signal",
    recordValue: "What every expression carries",
    trace: "Pattern protected",
    icon: Repeat2,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function Behaviours() {
  const storyRef = useRef<HTMLDivElement>(null);
  const pointerFrameRef = useRef(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(storyRef, { amount: 0.14, margin: "8% 0px -12% 0px" });
  const sequence = useScrollDrivenVisualizer({
    count: STANDARDS.length,
    target: storyRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const activeIndex = prefersReducedMotion ? STANDARDS.length - 1 : sequence.activeIndex;
  const active = STANDARDS[activeIndex];
  const ActiveIcon = active.icon;

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), []);

  function updatePointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const node = storyRef.current;
    if (!node) return;
    const { left, top, width, height } = node.getBoundingClientRect();
    const x = ((event.clientX - left) / Math.max(width, 1) - 0.5) * 2;
    const y = ((event.clientY - top) / Math.max(height, 1) - 0.5) * 2;

    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--standards-pointer-x", x.toFixed(3));
      node.style.setProperty("--standards-pointer-y", y.toFixed(3));
    });
  }

  function resetPointer() {
    const node = storyRef.current;
    if (!node) return;
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--standards-pointer-x", "0");
      node.style.setProperty("--standards-pointer-y", "0");
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % STANDARDS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + STANDARDS.length - 1) % STANDARDS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = STANDARDS.length - 1;
    else return;

    event.preventDefault();
    sequence.choose(next);
    document.getElementById(`standard-control-${next}`)?.focus();
  }

  return (
    <div
      ref={storyRef}
      className={styles.scrollStory}
      data-scroll-story="about-standards-record"
      data-standard-stage={activeIndex + 1}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <Container className={styles.container}>
        <div className={styles.root}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Working standards · one decision under pressure</p>
              <h2 id="standards-title">
                A value becomes real when it changes <em>how the work is handled.</em>
              </h2>
            </div>
            <p>
              Each standard leaves a visible trace in the work, turning judgment into a record
              another person can inspect, question, and carry.
            </p>
          </header>

          <div className={styles.desktopExperience} aria-labelledby="standards-title">
            <div className={styles.instrument}>
              <ol className={styles.standardIndex} aria-label="Working standards">
                {STANDARDS.map((standard, index) => {
                  const selected = activeIndex === index;
                  const complete = index <= activeIndex;
                  return (
                    <li key={standard.title}>
                      <button
                        id={`standard-control-${index}`}
                        type="button"
                        aria-pressed={selected}
                        aria-controls="standard-detail"
                        data-active={selected}
                        data-complete={complete}
                        onClick={() => sequence.choose(index)}
                        onPointerEnter={() => sequence.preview(index)}
                        onPointerLeave={sequence.releasePreview}
                        onFocus={() => sequence.preview(index)}
                        onBlur={sequence.releasePreview}
                        onKeyDown={(event) => onKeyDown(event, index)}
                      >
                        <span>0{index + 1}</span>
                        <strong>{standard.short}</strong>
                        <i aria-hidden="true"><b /></i>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className={styles.recordCamera} aria-hidden="true">
                <div className={styles.ambientLight} />
                <div className={styles.recordStack}>
                  <span className={styles.paperShadow} />
                  <article className={styles.recordSheet}>
                    <header>
                      <span>Branding Tatva · decision record</span>
                      <strong>BT / 04</strong>
                    </header>
                    <div className={styles.recordTitle}>
                      <small>Resolution</small>
                      <h3>A strategic signal others can carry.</h3>
                    </div>
                    <div className={styles.recordGrid}>
                      {STANDARDS.map((standard, index) => {
                        const Icon = standard.icon;
                        const complete = index <= activeIndex;
                        return (
                          <div
                            key={standard.title}
                            className={styles.recordEntry}
                            data-complete={complete}
                            data-active={index === activeIndex}
                          >
                            <span><Icon size={14} /></span>
                            <small>0{index + 1} · {standard.recordLabel}</small>
                            <strong>{standard.recordValue}</strong>
                            <em>{standard.trace}</em>
                          </div>
                        );
                      })}
                    </div>
                    <footer>
                      <span>Evidence</span><span>Category</span><span>Logic</span><span>Signal</span>
                    </footer>
                  </article>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.aside
                      key={active.title}
                      className={styles.marginNote}
                      initial={prefersReducedMotion ? false : { opacity: 0, rotate: -5, clipPath: "inset(0 0 42% 0)" }}
                      animate={{ opacity: 1, rotate: activeIndex % 2 === 0 ? -1.5 : 1.25, clipPath: "inset(0 0 0% 0)" }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, rotate: 4, clipPath: "inset(58% 0 0 0)" }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.54, ease: EASE }}
                    >
                      <ActiveIcon size={16} />
                      <span>0{activeIndex + 1}</span>
                      <strong>{active.trace}</strong>
                    </motion.aside>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className={styles.narrative}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={active.title}
                  id="standard-detail"
                  aria-live="polite"
                  initial={prefersReducedMotion ? false : { opacity: 0, filter: "blur(6px)", clipPath: "inset(0 0 34% 0)" }}
                  animate={{ opacity: 1, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, filter: "blur(4px)", clipPath: "inset(60% 0 0 0)" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
                >
                  <p>Standard 0{activeIndex + 1} · {active.title}</p>
                  <h3>{active.line}</h3>
                  <dl>
                    <div>
                      <dt>How it enters the work</dt>
                      <dd>{active.practice}</dd>
                    </div>
                    <div>
                      <dt>What the client can see</dt>
                      <dd>{active.visible}</dd>
                    </div>
                  </dl>
                </motion.article>
              </AnimatePresence>

              <Link href="/editorial-policy">
                Read the evidence policy <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.resolutionRail} aria-hidden="true">
            <span>Record assembly</span>
            <div><i style={{ transform: `scaleX(${(activeIndex + 1) / STANDARDS.length})` }} /></div>
            <strong>{String(activeIndex + 1).padStart(2, "0")} / 04</strong>
          </div>

          <div className={styles.staticExperience}>
            <p className={styles.staticIntro}>
              Together, these standards turn an opinion into a decision record another person can
              inspect, question, and carry forward.
            </p>
            <ol>
              {STANDARDS.map((standard, index) => {
                const Icon = standard.icon;
                return (
                  <li key={standard.title}>
                    <div className={styles.staticHeading}>
                      <span><Icon size={17} aria-hidden="true" /></span>
                      <div>
                        <small>0{index + 1} · {standard.title}</small>
                        <h3>{standard.line}</h3>
                      </div>
                    </div>
                    <p>{standard.practice}</p>
                    <strong>{standard.visible}</strong>
                  </li>
                );
              })}
            </ol>
            <Link href="/editorial-policy">
              Read the evidence policy <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
