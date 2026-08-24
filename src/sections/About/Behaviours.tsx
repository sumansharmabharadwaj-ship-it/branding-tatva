"use client";

import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { FileCheck2, MessageCircleMore, Repeat2, ScanSearch } from "lucide-react";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import styles from "./Behaviours.module.css";

const PRINCIPLES = [
  {
    title: "Evidence before volume",
    line: "Say less when proof is absent.",
    practice:
      "Measured outcomes, strategic outputs, and implementation-ready work appear as three different forms of evidence.",
    standard: "Every number keeps its source. Every unmeasured result keeps its honest label.",
    icon: FileCheck2,
  },
  {
    title: "Diagnosis before decoration",
    line: "Challenge the category before decorating it.",
    practice:
      "The work first asks what buyers think they are seeing, who they compare it with, and where the current frame breaks.",
    standard: "Expression begins after the category and positioning decision can be stated clearly.",
    icon: ScanSearch,
  },
  {
    title: "Reasoning before verdict",
    line: "Explain every recommendation.",
    practice:
      "A recommendation carries the observation behind it, the alternative paths considered, and the reason one path won.",
    standard: "The client can question the logic, reuse it, and explain it after the engagement ends.",
    icon: MessageCircleMore,
  },
  {
    title: "Recognition before novelty",
    line: "Protect recognition from constant reinvention.",
    practice:
      "Positioning, verbal identity, and visual rules return consistently enough to become familiar in the buyer's mind.",
    standard: "Fresh expression keeps the same strategic signal intact.",
    icon: Repeat2,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function Behaviours() {
  const storyRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(storyRef, { amount: 0.16 });
  const sequence = useScrollDrivenVisualizer({
    count: PRINCIPLES.length,
    target: storyRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const active = PRINCIPLES[sequence.activeIndex];
  const ActiveIcon = active.icon;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % PRINCIPLES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + PRINCIPLES.length - 1) % PRINCIPLES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = PRINCIPLES.length - 1;
    else return;

    event.preventDefault();
    sequence.choose(next);
    document.getElementById(`principle-tab-${next}`)?.focus();
  }

  return (
    <div ref={storyRef} className={styles.scrollStory} data-scroll-story="about-principles">
      <Container className={styles.container}>
      <div className={styles.root} data-about-visualizer="observable-principles">
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Observable principles · 04 standards</p>
            <h2 id="principles-title">The practice reveals its values through <em>behaviour.</em></h2>
          </div>
          <p>Each principle names a choice that can be seen in the work and tested during an engagement.</p>
        </header>

        <div className={styles.stage}>
          <div className={styles.constellation} role="tablist" aria-label="Choose an observable principle">
            <div className={styles.orbit} aria-hidden="true" />
            {PRINCIPLES.map((principle, index) => {
              const selected = sequence.activeIndex === index;
              const Icon = principle.icon;
              return (
                <motion.button
                  key={principle.title}
                  id={`principle-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="principle-panel"
                  tabIndex={selected ? 0 : -1}
                  className={styles.node}
                  data-position={index}
                  data-active={selected}
                  onClick={() => sequence.choose(index)}
                  onPointerEnter={() => sequence.preview(index)}
                  onPointerLeave={sequence.releasePreview}
                  onFocus={() => sequence.preview(index)}
                  onBlur={sequence.releasePreview}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  animate={{ scale: selected ? 1.04 : 0.96, opacity: selected ? 1 : 0.62 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.44, ease: EASE }}
                >
                  <span><Icon size={17} aria-hidden="true" /></span>
                  <small>0{index + 1}</small>
                  <strong>{principle.title}</strong>
                </motion.button>
              );
            })}

            <motion.div
              className={styles.core}
              key={active.title}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: EASE }}
              aria-hidden="true"
            >
              <ActiveIcon size={24} />
              <span>Standard 0{sequence.activeIndex + 1}</span>
            </motion.div>
          </div>

          <div className={styles.panelSlot}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={active.title}
                id="principle-panel"
                role="tabpanel"
                aria-labelledby={`principle-tab-${sequence.activeIndex}`}
                className={styles.panel}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.46, ease: EASE }}
              >
                <p>0{sequence.activeIndex + 1} · {active.title}</p>
                <h3>{active.line}</h3>
                <dl>
                  <div>
                    <dt>In practice</dt>
                    <dd>{active.practice}</dd>
                  </div>
                  <div>
                    <dt>The standard</dt>
                    <dd>{active.standard}</dd>
                  </div>
                </dl>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.index} aria-hidden="true">
          {PRINCIPLES.map((principle, index) => (
            <span key={principle.title} data-active={sequence.activeIndex === index}>0{index + 1}</span>
          ))}
        </div>
      </div>
      </Container>
    </div>
  );
}
