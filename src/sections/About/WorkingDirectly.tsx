"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
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
    cue: "Name the real problem",
    title: "Start with the decision beneath the brief.",
    summary:
      "Business context, audience signals, and the language already in use are brought into one clear starting point.",
    context: "The commercial goal, the audience tension, and the constraint shaping the work.",
    work: "Listen for the category or perception decision the brief is asking the brand to make.",
    handoff: "A written problem statement and the questions the strategy must answer.",
    record: "Problem statement and open questions",
    icon: CircleHelp,
  },
  {
    label: "Decision",
    cue: "Choose the strategic path",
    title: "Resolve the position before shaping expression.",
    summary:
      "The category, audience priority, and strongest strategic path are considered as one connected choice.",
    context: "The agreed problem, available evidence, and the viable strategic paths.",
    work: "Compare the options, choose the position, and state why that direction deserves to lead.",
    handoff: "A strategic decision with rationale, priorities, and clear boundaries.",
    record: "Decision, rationale, and boundaries",
    icon: ScanSearch,
  },
  {
    label: "Language",
    cue: "Give the decision words",
    title: "Turn the strategic choice into language people can carry.",
    summary:
      "Positioning becomes a message hierarchy, narrative direction, and verbal character that can be recognised and repeated.",
    context: "The chosen position and the audience frame it needs to enter.",
    work: "Translate the strategic decision into messaging, narrative, tone, and repeatable verbal cues.",
    handoff: "A usable language system for campaigns, content, and client conversations.",
    record: "Message hierarchy and verbal rules",
    icon: MessageSquareQuote,
  },
  {
    label: "System",
    cue: "Make the idea usable",
    title: "Carry one strategic signal into everyday execution.",
    summary:
      "The approved direction becomes practical rules, formats, and playbooks that keep future expression coherent.",
    context: "The positioning, message hierarchy, and the channels where the brand must perform.",
    work: "Convert the direction into content formats, implementation rules, and decision tools.",
    handoff: "A reusable brand system the client can apply, question, and extend.",
    record: "Playbooks, formats, and next actions",
    icon: Layers3,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function WorkingDirectly() {
  const storyRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(storyRef, { amount: 0.16 });
  const sequence = useScrollDrivenVisualizer({
    count: STAGES.length,
    target: storyRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const active = STAGES[sequence.activeIndex];
  const ActiveIcon = active.icon;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % STAGES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + STAGES.length - 1) % STAGES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = STAGES.length - 1;
    else return;

    event.preventDefault();
    sequence.choose(next);
    document.getElementById(`direct-tab-${next}`)?.focus();
  }

  return (
    <div ref={storyRef} className={styles.scrollStory} data-scroll-story="about-founder-led">
      <Container className={styles.container}>
      <div className={styles.root} data-about-visualizer="founder-led-thread">
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Working directly · one continuous strategic thread</p>
            <h2 id="direct-title">From the first question to a system <em>you can use.</em></h2>
          </div>
          <p>
            Each decision becomes the starting point for the next, held by the same strategic lead from diagnosis through handover.
          </p>
        </header>

        <div className={styles.timeline} role="tablist" aria-label="Explore the strategic thread">
          {STAGES.map((stage, index) => {
            const selected = sequence.activeIndex === index;
            const Icon = stage.icon;
            return (
              <button
                key={stage.label}
                id={`direct-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="direct-panel"
                tabIndex={selected ? 0 : -1}
                data-active={selected}
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
                <em>{stage.cue}</em>
                <i aria-hidden="true"><b /></i>
              </button>
            );
          })}
        </div>

        <div className={styles.panelSlot}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={active.label}
              id="direct-panel"
              role="tabpanel"
              aria-labelledby={`direct-tab-${sequence.activeIndex}`}
              className={styles.stage}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.46, ease: EASE }}
            >
              <div className={styles.stageLead}>
                <div className={styles.stageMark}>
                  <span><ActiveIcon size={18} aria-hidden="true" /></span>
                  <small>Stage {String(sequence.activeIndex + 1).padStart(2, "0")} / 04</small>
                </div>
                <h3>{active.title}</h3>
                <p>{active.summary}</p>
              </div>

              <div className={styles.handoff}>
                <div>
                  <small>What enters</small>
                  <p>{active.context}</p>
                </div>
                <ArrowRight className={styles.handoffArrow} size={18} aria-hidden="true" />
                <div>
                  <small>Strategic work</small>
                  <p>{active.work}</p>
                </div>
                <ArrowRight className={styles.handoffArrow} size={18} aria-hidden="true" />
                <div>
                  <small>What you leave with</small>
                  <p>{active.handoff}</p>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <footer className={styles.footer}>
          <div className={styles.record}>
            <FileText size={15} aria-hidden="true" />
            <span>Documented at this stage</span>
            <strong>{active.record}</strong>
          </div>
          <div className={styles.promise} aria-label="The founder-led model in summary">
            <span>One strategic lead</span>
            <i aria-hidden="true" />
            <span>Four connected handoffs</span>
          </div>
          <Link href="/services#study">
            See the engagement system <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </footer>
      </div>
      </Container>
    </div>
  );
}
