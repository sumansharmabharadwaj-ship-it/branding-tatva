"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion, useInView, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  CircleHelp,
  FileText,
  Layers3,
  MessageSquareQuote,
  ScanSearch,
} from "lucide-react";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import styles from "./WorkingDirectly.module.css";

const STAGES = [
  {
    label: "Question",
    verb: "Hear",
    title: "Find the decision hiding inside the brief.",
    note:
      "The commercial goal, audience tension, and practical constraint enter the same record before a direction is chosen.",
    recordLabel: "Decision to make",
    record: "Which perception must change before growth can follow?",
    output: "Problem statement · open questions",
    fragments: ["Commercial goal", "Audience tension", "Real constraint"],
    icon: CircleHelp,
  },
  {
    label: "Position",
    verb: "Decide",
    title: "Choose the frame that deserves to lead.",
    note:
      "Category, audience priority, and available evidence are resolved as one connected strategic choice.",
    recordLabel: "Chosen frame",
    record: "A position with rationale, priorities, and clear boundaries.",
    output: "Position · rationale · boundaries",
    fragments: ["Category choice", "Audience priority", "Reason to believe"],
    icon: ScanSearch,
  },
  {
    label: "Language",
    verb: "Name",
    title: "Give the strategic choice words people can carry.",
    note:
      "The chosen position becomes a message hierarchy, narrative direction, and verbal character that can be recognised and repeated.",
    recordLabel: "Language to carry",
    record: "A message system built around one clear strategic signal.",
    output: "Message hierarchy · verbal rules",
    fragments: ["Core message", "Narrative order", "Verbal character"],
    icon: MessageSquareQuote,
  },
  {
    label: "System",
    verb: "Carry",
    title: "Turn the signal into rules for everyday use.",
    note:
      "Position and language become practical formats, playbooks, and decision tools that keep future expression coherent.",
    recordLabel: "System to use",
    record: "A reusable operating system for campaigns, content, and brand decisions.",
    output: "Playbooks · formats · next actions",
    fragments: ["Channel rules", "Repeatable formats", "Decision tools"],
    icon: Layers3,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function WorkingDirectly() {
  const storyRef = useRef<HTMLDivElement>(null);
  const pointerFrameRef = useRef(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(storyRef, { amount: 0.16, margin: "8% 0px -12% 0px" });
  const sequence = useScrollDrivenVisualizer({
    count: STAGES.length,
    target: storyRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const active = STAGES[sequence.activeIndex];
  const sheetY = useTransform(sequence.scrollYProgress, [0, 1], ["2.4%", "-2.4%"]);
  const sheetScale = useTransform(sequence.scrollYProgress, [0, 0.5, 1], [0.985, 1, 0.99]);

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), []);

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const node = storyRef.current;
    if (!node) return;
    const { left, top, width, height } = node.getBoundingClientRect();
    const x = ((event.clientX - left) / Math.max(width, 1) - 0.5) * 2;
    const y = ((event.clientY - top) / Math.max(height, 1) - 0.5) * 2;

    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--direct-pointer-x", x.toFixed(3));
      node.style.setProperty("--direct-pointer-y", y.toFixed(3));
    });
  }

  function resetPointer() {
    const node = storyRef.current;
    if (!node) return;
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--direct-pointer-x", "0");
      node.style.setProperty("--direct-pointer-y", "0");
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % STAGES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + STAGES.length - 1) % STAGES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = STAGES.length - 1;
    else return;

    event.preventDefault();
    sequence.choose(next);
    document.getElementById(`direct-record-${next}`)?.focus();
  }

  return (
    <div
      ref={storyRef}
      className={styles.scrollStory}
      data-scroll-story="about-founder-led"
      data-direct-stage={sequence.activeIndex + 1}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
    >
      <Container className={styles.sticky}>
        <div className={styles.root}>
          <div className={styles.editorialColumn}>
            <header className={styles.header}>
              <p className={styles.eyebrow}>Working directly · one continuous strategic thread</p>
              <h2 id="direct-title">
                The same mind holds the work from <em>question to system.</em>
              </h2>
              <p>
                Context stays inside the decision. Each conclusion becomes the starting material for what follows.
              </p>
            </header>

            <div
              id="direct-stage-note"
              className={styles.activeNote}
              role="tabpanel"
              aria-labelledby={`direct-record-${sequence.activeIndex}`}
              aria-live="polite"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.label}
                  initial={prefersReducedMotion ? false : { clipPath: "inset(0 100% 0 0)", x: 18 }}
                  animate={{ clipPath: "inset(0 0% 0 0)", x: 0 }}
                  exit={prefersReducedMotion ? undefined : { clipPath: "inset(0 0 0 100%)", x: -12 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.54, ease: EASE }}
                >
                  <div className={styles.noteIndex}>
                    <span>{String(sequence.activeIndex + 1).padStart(2, "0")}</span>
                    <strong>{active.verb}</strong>
                  </div>
                  <h3>{active.title}</h3>
                  <p>{active.note}</p>
                  <div className={styles.output}>
                    <FileText size={15} aria-hidden="true" />
                    <span>Added to the record</span>
                    <strong>{active.output}</strong>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className={styles.continuity} aria-label="What remains continuous through the engagement">
              <span>One strategic lead</span>
              <i aria-hidden="true" />
              <span>Four connected decisions</span>
            </div>

            <Link className={styles.cta} href="/services#study">
              See the engagement structure <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <motion.div
            className={styles.sheetCamera}
            style={prefersReducedMotion ? undefined : { y: sheetY, scale: sheetScale }}
          >
            <article className={styles.sheet} aria-labelledby="direct-title">
              <div className={styles.paperLight} aria-hidden="true" />
              <header className={styles.sheetHeader}>
                <div>
                  <span>Branding Tatva</span>
                  <strong>Live strategy record</strong>
                </div>
                <p>
                  Context retained
                  <strong>{String(sequence.activeIndex + 1).padStart(2, "0")} / 04</strong>
                </p>
              </header>

              <div className={styles.threadLabel}>
                <span>One brief</span>
                <i aria-hidden="true" />
                <span>One decision trail</span>
                <i aria-hidden="true" />
                <span>One usable system</span>
              </div>

              <div className={styles.recordRows} role="tablist" aria-label="Explore the continuous strategic record">
                {STAGES.map((stage, index) => {
                  const Icon = stage.icon;
                  const selected = sequence.activeIndex === index;
                  const state = index < sequence.activeIndex ? "complete" : selected ? "active" : "waiting";

                  return (
                    <button
                      key={stage.label}
                      id={`direct-record-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="direct-stage-note"
                      tabIndex={selected ? 0 : -1}
                      className={styles.recordRow}
                      data-state={state}
                      onClick={() => sequence.choose(index)}
                      onPointerEnter={() => sequence.preview(index)}
                      onPointerLeave={sequence.releasePreview}
                      onFocus={() => sequence.preview(index)}
                      onBlur={sequence.releasePreview}
                      onKeyDown={(event) => onKeyDown(event, index)}
                    >
                      <span className={styles.recordMark}>
                        <Icon size={16} aria-hidden="true" />
                        <small>{String(index + 1).padStart(2, "0")}</small>
                      </span>
                      <span className={styles.recordCopy}>
                        <small>{stage.recordLabel}</small>
                        <strong>{stage.record}</strong>
                        <em>{stage.output}</em>
                      </span>
                      <span className={styles.fragments} aria-hidden="true">
                        {stage.fragments.map((fragment) => <i key={fragment}>{fragment}</i>)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <footer className={styles.sheetFooter}>
                <span>Founder-led from diagnosis through handover</span>
                <strong>BT / STRATEGY / 01</strong>
              </footer>
            </article>
          </motion.div>

          <div className={styles.staticExperience}>
            <p>Every stage remains visible in the finished record.</p>
            <ol>
              {STAGES.map((stage) => {
                const Icon = stage.icon;
                return (
                  <li key={stage.label}>
                    <span><Icon size={17} aria-hidden="true" /></span>
                    <div>
                      <small>{stage.label} · {stage.recordLabel}</small>
                      <h3>{stage.record}</h3>
                      <p>{stage.note}</p>
                      <strong>{stage.output}</strong>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </Container>
    </div>
  );
}
