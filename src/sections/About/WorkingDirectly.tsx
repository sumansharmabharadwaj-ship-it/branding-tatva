"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, FileText, MessageSquareText, UserRound, UsersRound } from "lucide-react";
import { Container } from "@/components/Container";
import { useAmbientSequence } from "@/hooks/useAmbientSequence";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import styles from "./WorkingDirectly.module.css";

const MOMENTS = [
  {
    label: "Hear",
    founder: "The founder hears the business context, the hesitation, and the language used in the room.",
    layered: "A discovery role captures context for the team members who carry the next stage.",
    record: "Original questions and tensions",
  },
  {
    label: "Decide",
    founder: "The same person who heard the context makes the positioning and messaging recommendation.",
    layered: "Specialist roles develop the recommendation from a shared internal brief.",
    record: "Decision, rationale, alternatives",
  },
  {
    label: "Explain",
    founder: "Feedback comes directly from the person responsible for the strategic choice.",
    layered: "Client-service roles translate specialist thinking into one joined response.",
    record: "Reasoning a client can reuse",
  },
  {
    label: "Carry",
    founder: "One strategic thread stays intact from diagnosis through the final system and handover.",
    layered: "A shared delivery process keeps the thread aligned across roles and handoffs.",
    record: "Implementation boundaries and next actions",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function WorkingDirectly() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(rootRef, { amount: 0.34 });
  const sequence = useAmbientSequence({
    count: MOMENTS.length,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
    intervalMs: 5000,
  });
  const active = MOMENTS[sequence.activeIndex];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % MOMENTS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + MOMENTS.length - 1) % MOMENTS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = MOMENTS.length - 1;
    else return;

    event.preventDefault();
    sequence.choose(next);
    document.getElementById(`direct-tab-${next}`)?.focus();
  }

  return (
    <Container className={styles.container}>
      <div ref={rootRef} className={styles.root} data-about-visualizer="founder-led-thread">
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Working directly · Founder-led by design</p>
            <h2 id="direct-title">One mind holds the thread from <em>question to system.</em></h2>
          </div>
          <p>
            A layered team distributes the journey across roles. This practice keeps hearing, deciding, and explaining with the founder.
          </p>
        </header>

        <div className={styles.timeline} role="tablist" aria-label="Choose an engagement moment">
          {MOMENTS.map((moment, index) => {
            const selected = sequence.activeIndex === index;
            return (
              <button
                key={moment.label}
                id={`direct-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="direct-panel"
                tabIndex={selected ? 0 : -1}
                data-active={selected}
                onClick={() => sequence.choose(index)}
                onPointerEnter={() => sequence.preview(index)}
                onPointerLeave={sequence.release}
                onFocus={() => sequence.preview(index)}
                onBlur={sequence.release}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                <small>0{index + 1}</small>
                <strong>{moment.label}</strong>
                <i aria-hidden="true"><span /></i>
              </button>
            );
          })}
        </div>

        <div className={styles.panelSlot}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.label}
              id="direct-panel"
              role="tabpanel"
              aria-labelledby={`direct-tab-${sequence.activeIndex}`}
              className={styles.comparison}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
            >
              <article className={styles.founderCard}>
                <span><UserRound size={18} aria-hidden="true" /></span>
                <p>Founder-led practice</p>
                <h3>{active.label}</h3>
                <p className={styles.body}>{active.founder}</p>
              </article>

              <div className={styles.thread} aria-hidden="true">
                <motion.span
                  animate={{ scaleX: [0.15, 1, 0.15], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: prefersReducedMotion ? 0 : 3.8, repeat: prefersReducedMotion ? 0 : Infinity, ease: "easeInOut" }}
                />
                <ArrowRight size={18} />
              </div>

              <article className={styles.layeredCard}>
                <span><UsersRound size={18} aria-hidden="true" /></span>
                <p>Layered delivery structure</p>
                <h3>{active.label}</h3>
                <p className={styles.body}>{active.layered}</p>
              </article>
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className={styles.footer}>
          <div>
            <FileText size={15} aria-hidden="true" />
            <span>What stays documented</span>
            <strong>{active.record}</strong>
          </div>
          <Link href="/services#study">
            See the engagement system <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <span aria-hidden="true"><MessageSquareText size={15} /></span>
        </footer>
      </div>
    </Container>
  );
}
