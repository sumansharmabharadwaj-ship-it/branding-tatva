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
    note: "Commercial goal, audience tension, and practical constraint enter the same record before a direction is chosen.",
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
    note: "Category, audience priority, and available evidence resolve as one connected strategic choice.",
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
    note: "The chosen position becomes a message hierarchy, narrative direction, and verbal character people can recognise and repeat.",
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
    note: "Position and language become practical formats, playbooks, and decision tools that keep future expression coherent.",
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
  const sheetY = useTransform(sequence.scrollYProgress, [0, 1], ["2%", "-2%"]);
  const sheetScale = useTransform(sequence.scrollYProgress, [0, 0.5, 1], [0.988, 1, 0.992]);

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), []);

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const node = storyRef.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
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
    document.getElementById(`direct-stage-${next}`)?.focus();
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
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Working directly · one continuous strategic thread</p>
              <h2 id="direct-title">One mind keeps the context <em>alive through every decision.</em></h2>
            </div>
            <div className={styles.headerAside}>
              <p>Each conclusion becomes the starting material for what follows, so the original business tension survives all the way into the usable system.</p>
              <div><span>One strategic lead</span><i aria-hidden="true" /><span>One decision trail</span></div>
            </div>
          </header>

          <motion.div
            className={styles.sheetCamera}
            style={prefersReducedMotion ? undefined : { y: sheetY, scale: sheetScale }}
          >
            <article className={styles.sheet} aria-labelledby="direct-title">
              <div className={styles.paperLight} aria-hidden="true" />
              <header className={styles.sheetHeader}>
                <div><span>Branding Tatva</span><strong>Living strategy record</strong></div>
                <p>Context retained <strong>{String(sequence.activeIndex + 1).padStart(2, "0")} / 04</strong></p>
              </header>

              <div className={styles.stageRail} role="tablist" aria-label="Follow the founder-led decision trail">
                <span className={styles.railLine} aria-hidden="true"><b /></span>
                {STAGES.map((stage, index) => {
                  const Icon = stage.icon;
                  const selected = sequence.activeIndex === index;
                  const reached = index <= sequence.activeIndex;
                  return (
                    <button
                      key={stage.label}
                      id={`direct-stage-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="direct-record"
                      tabIndex={selected ? 0 : -1}
                      data-active={selected}
                      data-reached={reached}
                      onClick={() => sequence.choose(index)}
                      onPointerEnter={() => sequence.preview(index)}
                      onPointerLeave={sequence.releasePreview}
                      onFocus={() => sequence.preview(index)}
                      onBlur={sequence.releasePreview}
                      onKeyDown={(event) => onKeyDown(event, index)}
                    >
                      <span><Icon size={15} aria-hidden="true" /></span>
                      <small>0{index + 1}</small>
                      <strong>{stage.label}</strong>
                    </button>
                  );
                })}
              </div>

              <div
                id="direct-record"
                className={styles.recordStage}
                role="tabpanel"
                aria-labelledby={`direct-stage-${sequence.activeIndex}`}
                aria-live="polite"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.label}
                    className={styles.activeRecord}
                    initial={prefersReducedMotion ? false : { clipPath: "inset(0 100% 0 0)", x: 24 }}
                    animate={{ clipPath: "inset(0 0% 0 0)", x: 0 }}
                    exit={prefersReducedMotion ? undefined : { clipPath: "inset(0 0 0 100%)", x: -16 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.56, ease: EASE }}
                  >
                    <div className={styles.inputs}>
                      <span>{active.verb} · incoming context</span>
                      {active.fragments.map((fragment, index) => (
                        <motion.i
                          key={fragment}
                          initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.42, delay: prefersReducedMotion ? 0 : index * 0.07 }}
                        >{fragment}</motion.i>
                      ))}
                    </div>
                    <div className={styles.decision}>
                      <small>{active.recordLabel}</small>
                      <h3>{active.title}</h3>
                      <strong>{active.record}</strong>
                      <p>{active.note}</p>
                    </div>
                    <div className={styles.recordedOutput}>
                      <FileText size={16} aria-hidden="true" />
                      <span>Added to the same record</span>
                      <strong>{active.output}</strong>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <footer className={styles.sheetFooter}>
                <div aria-label="Decisions retained in the record">
                  {STAGES.map((stage, index) => (
                    <span key={stage.label} data-visible={index <= sequence.activeIndex}>{stage.label}</span>
                  ))}
                </div>
                <Link href="/services#study">See the engagement structure <ArrowUpRight size={14} aria-hidden="true" /></Link>
              </footer>
            </article>
          </motion.div>

          <div className={styles.staticExperience}>
            <p>One record carries every decision forward.</p>
            <ol>
              {STAGES.map((stage) => {
                const Icon = stage.icon;
                return (
                  <li key={stage.label}>
                    <span><Icon size={17} aria-hidden="true" /></span>
                    <div><small>{stage.label} · {stage.recordLabel}</small><h3>{stage.record}</h3><p>{stage.note}</p><strong>{stage.output}</strong></div>
                  </li>
                );
              })}
            </ol>
            <Link href="/services#study">See the engagement structure <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
