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
    practice: "Measured outcomes, strategic outputs, and work ready for implementation are recorded as three distinct forms of evidence.",
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
    practice: "The work examines what buyers think they are seeing, which alternatives frame the category, and where the current meaning breaks.",
    visible: "The category, audience, and positioning choice are stated before visual or verbal routes begin.",
    recordLabel: "Category choice",
    recordValue: "What the brand must mean",
    trace: "Frame decided",
    icon: ScanSearch,
  },
  {
    short: "Reasoning",
    title: "Reasoning before verdict",
    line: "Make the reasoning available with the recommendation.",
    practice: "Each recommendation carries the observation behind it, the viable paths considered, and the reason one direction serves the brand best.",
    visible: "The client can question the logic, reuse it, and explain it after the engagement ends.",
    recordLabel: "Reasoning trail",
    recordValue: "Why this direction holds",
    trace: "Logic documented",
    icon: MessageCircleMore,
  },
  {
    short: "Recognition",
    title: "Recognition before novelty",
    line: "Let fresh expression carry the same strategic choice.",
    practice: "Positioning, verbal identity, and visual rules return with enough discipline to become familiar in the buyer's mind.",
    visible: "New campaigns can change their surface while preserving the meaning people are learning to recognise.",
    recordLabel: "Repeatable choice",
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

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), []);

  function updatePointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const node = storyRef.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
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
    document.getElementById(`standard-gate-${next}`)?.focus();
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
              <p className={styles.eyebrow}>How recommendations are tested</p>
              <h2 id="standards-title">A principle earns its place when <em>the work becomes stronger through it.</em></h2>
            </div>
            <p>Every recommendation must survive four tests. The source, reasoning, and practical consequence remain visible for the client to inspect.</p>
          </header>

          <div className={styles.desktopExperience} aria-labelledby="standards-title">
            <div className={styles.instrument}>
              <div className={styles.instrumentTopline}>
                <span>Incoming recommendation</span>
                <strong>Decision integrity test · 0{activeIndex + 1} / 04</strong>
                <span>Carryable signal</span>
              </div>

              <div className={styles.gateTrack} role="tablist" aria-label="Test the decision">
                <div className={styles.trackLine} aria-hidden="true"><i /></div>
                <span className={styles.signalToken} aria-hidden="true"><b /></span>
                {STANDARDS.map((standard, index) => {
                  const Icon = standard.icon;
                  const selected = activeIndex === index;
                  const passed = index <= activeIndex;
                  return (
                    <button
                      key={standard.title}
                      id={`standard-gate-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="standard-detail"
                      tabIndex={selected ? 0 : -1}
                      data-active={selected}
                      data-passed={passed}
                      onPointerDown={() => sequence.choose(index)}
                      onClick={(event) => event.detail === 0 && sequence.choose(index)}
                      onPointerEnter={() => sequence.preview(index)}
                      onPointerLeave={sequence.releasePreview}
                      onFocus={() => sequence.preview(index)}
                      onBlur={sequence.releasePreview}
                      onKeyDown={(event) => onKeyDown(event, index)}
                    >
                      <span><Icon size={16} aria-hidden="true" /></span>
                      <small>0{index + 1}</small>
                      <strong>{standard.short}</strong>
                      <em>{standard.trace}</em>
                    </button>
                  );
                })}
              </div>

              <div
                id="standard-detail"
                className={styles.testResult}
                role="tabpanel"
                aria-labelledby={`standard-gate-${activeIndex}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.article
                    key={active.title}
                    initial={prefersReducedMotion ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)", x: 20 }}
                    animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)", x: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, clipPath: "inset(0 0 0 100%)", x: -14 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.52, ease: EASE }}
                  >
                    <div className={styles.testStatement}>
                      <span>Pressure test · {active.title}</span>
                      <h3>{active.line}</h3>
                    </div>
                    <dl>
                      <div><dt>How the test works</dt><dd>{active.practice}</dd></div>
                      <div><dt>Visible trace</dt><dd>{active.visible}</dd></div>
                    </dl>
                    <div className={styles.testStamp}>
                      <small>{active.recordLabel}</small>
                      <strong>{active.recordValue}</strong>
                      <span>{active.trace}</span>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>

              <footer className={styles.instrumentFooter}>
                <div aria-label="Completed pressure tests">
                  {STANDARDS.map((standard, index) => <span key={standard.short} data-passed={index <= activeIndex}>{standard.short}</span>)}
                </div>
                <p className={styles.verdict} data-complete={activeIndex === STANDARDS.length - 1} aria-live="polite">
                  <FileCheck2 size={13} aria-hidden="true" />
                  {activeIndex === STANDARDS.length - 1
                    ? "Recommendation ready to carry"
                    : `0${activeIndex + 1} of 04 traces secured`}
                </p>
                <Link href="/editorial-policy">Read the evidence policy <ArrowUpRight size={14} aria-hidden="true" /></Link>
              </footer>
            </div>
          </div>

          <div className={styles.staticExperience}>
            <p>Four pressure tests turn a recommendation into a decision record another person can carry.</p>
            <ol>
              {STANDARDS.map((standard, index) => {
                const Icon = standard.icon;
                return (
                  <li key={standard.title}>
                    <div><span><Icon size={17} aria-hidden="true" /></span><small>0{index + 1} · {standard.title}</small></div>
                    <h3>{standard.line}</h3>
                    <p>{standard.practice}</p>
                    <strong>{standard.visible}</strong>
                  </li>
                );
              })}
            </ol>
            <Link href="/editorial-policy">Read the evidence policy <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
