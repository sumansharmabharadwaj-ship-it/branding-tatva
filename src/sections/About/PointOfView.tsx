"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, Eye, Quote, Repeat2 } from "lucide-react";
import { Container } from "@/components/Container";
import { useAmbientSequence } from "@/hooks/useAmbientSequence";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { projects } from "@/data/projects";
import styles from "./PointOfView.module.css";

const CLAIMS = [
  {
    name: "Perception",
    claim: "Perception precedes preference.",
    detail:
      "People decide what kind of brand they are seeing before they decide whether they want it.",
    signal: "What category forms in the buyer's mind?",
    decision: "Reset the category before adding persuasion.",
    proof: "HerbalCart's content moved from a herbal-remedy frame toward modern, supplement-first wellness.",
    slug: "herbalcart",
    icon: Eye,
  },
  {
    name: "Language",
    claim: "Language frames value.",
    detail:
      "A verbal choice can make the same offer feel generic, credible, premium, or easy to repeat.",
    signal: "Which words are carrying the value?",
    decision: "Choose the frame before writing the campaign.",
    proof: "MyShopInEurope built its position around craft and origin, ahead of cheap access.",
    slug: "myshopineurope",
    icon: Quote,
  },
  {
    name: "Memory",
    claim: "Consistency creates memory.",
    detail:
      "Recognition compounds when one useful position returns with enough discipline to become familiar.",
    signal: "Which idea deserves to return?",
    decision: "Protect the signal from constant reinvention.",
    proof: "Dr. Haley Nutrition posted 48% less and earned 104% more followers per post.",
    slug: "dr-haley-nutrition",
    icon: Repeat2,
  },
] as const;

const PROJECTS = new Map(projects.map((project) => [project.slug, project]));
const EASE = [0.22, 1, 0.36, 1] as const;

export function PointOfView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(rootRef, { amount: 0.35 });
  const sequence = useAmbientSequence({
    count: CLAIMS.length,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
    intervalMs: 5600,
  });
  const active = CLAIMS[sequence.activeIndex];
  const ActiveIcon = active.icon;
  const activeProject = PROJECTS.get(active.slug);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % CLAIMS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + CLAIMS.length - 1) % CLAIMS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = CLAIMS.length - 1;
    else return;

    event.preventDefault();
    sequence.choose(next);
    document.getElementById(`philosophy-tab-${next}`)?.focus();
  }

  return (
    <Container className={styles.shell}>
      <div ref={rootRef} className={styles.root} data-about-visualizer="philosophy-prism">
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Point of view · 03 working beliefs</p>
            <h2 id="philosophy-title">
              A philosophy built to face <em>real decisions.</em>
            </h2>
          </div>
          <p>
            Perception, language, and memory form one system. Each belief below connects to a recorded engagement.
          </p>
        </header>

        <div className={styles.visualizer} aria-labelledby="philosophy-title">
          <div className={styles.tabs} role="tablist" aria-label="Choose a working belief">
            {CLAIMS.map((claim, index) => {
              const selected = sequence.activeIndex === index;
              const Icon = claim.icon;
              return (
                <button
                  key={claim.name}
                  id={`philosophy-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="philosophy-panel"
                  tabIndex={selected ? 0 : -1}
                  data-active={selected}
                  onClick={() => sequence.choose(index)}
                  onPointerEnter={() => sequence.preview(index)}
                  onPointerLeave={sequence.release}
                  onFocus={() => sequence.preview(index)}
                  onBlur={sequence.release}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  <span><Icon size={15} aria-hidden="true" /></span>
                  <small>0{index + 1}</small>
                  <strong>{claim.name}</strong>
                </button>
              );
            })}
          </div>

          <div className={styles.prism} aria-hidden="true">
            <motion.div
              className={styles.prismHalo}
              animate={prefersReducedMotion ? undefined : { rotate: sequence.activeIndex * 120 }}
              transition={{ duration: 1.1, ease: EASE }}
            />
            <motion.div
              className={styles.prismCore}
              key={active.name}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.62, ease: EASE }}
            >
              <ActiveIcon size={24} />
              <span>{active.name}</span>
              <strong>Recognition</strong>
            </motion.div>
            {CLAIMS.map((claim, index) => (
              <motion.span
                key={claim.name}
                className={styles.prismNode}
                data-position={index}
                data-active={sequence.activeIndex === index}
                animate={{ opacity: sequence.activeIndex === index ? 1 : 0.42, scale: sequence.activeIndex === index ? 1.08 : 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}
              >
                0{index + 1}
              </motion.span>
            ))}
          </div>

          <div className={styles.panelWrap}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={active.name}
                id="philosophy-panel"
                role="tabpanel"
                aria-labelledby={`philosophy-tab-${sequence.activeIndex}`}
                className={styles.panel}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.46, ease: EASE }}
              >
                <p className={styles.claimNumber}>0{sequence.activeIndex + 1} · {active.name}</p>
                <h3>{active.claim}</h3>
                <p className={styles.detail}>{active.detail}</p>
                <dl>
                  <div>
                    <dt>Signal</dt>
                    <dd>{active.signal}</dd>
                  </div>
                  <div>
                    <dt>Decision</dt>
                    <dd>{active.decision}</dd>
                  </div>
                  <div>
                    <dt>On record</dt>
                    <dd>{active.proof}</dd>
                  </div>
                </dl>
                {activeProject ? (
                  <Link href={`/work/${activeProject.slug}`}>
                    {activeProject.title} <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                ) : null}
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.progress} aria-hidden="true">
          {CLAIMS.map((claim, index) => (
            <span key={claim.name} data-active={sequence.activeIndex === index} />
          ))}
        </div>
      </div>
    </Container>
  );
}
