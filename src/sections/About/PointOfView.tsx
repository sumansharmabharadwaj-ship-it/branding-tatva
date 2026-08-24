"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, Eye, Quote, Repeat2 } from "lucide-react";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { projects } from "@/data/projects";
import styles from "./PointOfView.module.css";

const CLAIMS = [
  {
    name: "Perception",
    verb: "See",
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
    verb: "Name",
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
    verb: "Return",
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
  const storyRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(storyRef, { amount: 0.16 });
  const sequence = useScrollDrivenVisualizer({
    count: CLAIMS.length,
    target: storyRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const active = CLAIMS[sequence.activeIndex];
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

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || !storyRef.current) return;
    const x = Math.min(1, Math.max(0, event.clientX / Math.max(window.innerWidth, 1)));
    const y = Math.min(1, Math.max(0, event.clientY / Math.max(window.innerHeight, 1)));
    storyRef.current.style.setProperty("--philosophy-x", `${(x * 100).toFixed(2)}%`);
    storyRef.current.style.setProperty("--philosophy-y", `${(y * 100).toFixed(2)}%`);
  }

  function resetPointer() {
    storyRef.current?.style.setProperty("--philosophy-x", "50%");
    storyRef.current?.style.setProperty("--philosophy-y", "50%");
  }

  return (
    <div
      ref={storyRef}
      className={styles.scrollStory}
      data-scroll-story="about-philosophy"
      data-philosophy-stage={sequence.activeIndex + 1}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
    >
      <Container className={styles.shell}>
        <div className={styles.root} data-about-visualizer="recognition-sequence">
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Point of view · a recognition sequence</p>
              <h2 id="philosophy-title">
                People see a category, hear a value, then <em>remember a pattern.</em>
              </h2>
            </div>
            <p>
              Perception sets the frame. Language carries value. Consistency returns the signal until it becomes familiar.
            </p>
          </header>

          <div className={styles.camera} aria-labelledby="philosophy-title">
            <div className={styles.cursorLight} aria-hidden="true" />

            <div className={styles.frames} role="tablist" aria-label="Explore the recognition sequence">
              {CLAIMS.map((claim, index) => {
                const selected = sequence.activeIndex === index;
                const Icon = claim.icon;
                return (
                  <motion.button
                    layout
                    key={claim.name}
                    id={`philosophy-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="philosophy-panel"
                    tabIndex={selected ? 0 : -1}
                    className={styles.frame}
                    data-active={selected}
                    data-frame={index + 1}
                    onClick={() => sequence.choose(index)}
                    onPointerEnter={() => sequence.preview(index)}
                    onPointerLeave={sequence.releasePreview}
                    onFocus={() => sequence.preview(index)}
                    onBlur={sequence.releasePreview}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    transition={{ layout: { duration: prefersReducedMotion ? 0 : 0.72, ease: EASE } }}
                  >
                    <span className={styles.frameIndex}>0{index + 1}</span>
                    <span className={styles.frameIcon}><Icon size={16} aria-hidden="true" /></span>
                    <span className={styles.frameVerb}>{claim.verb}</span>
                    <strong className={styles.frameName}>{claim.name}</strong>
                    <span className={styles.frameClaim}>{claim.claim}</span>
                    <span className={styles.frameQuestion}>{claim.signal}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className={styles.recordSlot}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={active.name}
                  id="philosophy-panel"
                  role="tabpanel"
                  aria-labelledby={`philosophy-tab-${sequence.activeIndex}`}
                  className={styles.record}
                  initial={prefersReducedMotion ? false : { opacity: 0, filter: "blur(7px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, filter: "blur(5px)" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.44, ease: EASE }}
                >
                  <div className={styles.recordStatement}>
                    <p>0{sequence.activeIndex + 1} · {active.name}</p>
                    <h3>{active.claim}</h3>
                    <span>{active.detail}</span>
                  </div>

                  <dl>
                    <div>
                      <dt>The decision</dt>
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

          <div className={styles.staticExperience}>
            {CLAIMS.map((claim, index) => {
              const Icon = claim.icon;
              const project = PROJECTS.get(claim.slug);
              return (
                <article key={claim.name}>
                  <div className={styles.staticHeading}>
                    <span><Icon size={17} aria-hidden="true" /></span>
                    <div>
                      <small>0{index + 1} · {claim.verb}</small>
                      <h3>{claim.claim}</h3>
                    </div>
                  </div>
                  <p>{claim.detail}</p>
                  <dl>
                    <div><dt>Signal</dt><dd>{claim.signal}</dd></div>
                    <div><dt>Decision</dt><dd>{claim.decision}</dd></div>
                    <div><dt>On record</dt><dd>{claim.proof}</dd></div>
                  </dl>
                  {project ? <Link href={`/work/${project.slug}`}>{project.title} <ArrowUpRight size={13} aria-hidden="true" /></Link> : null}
                </article>
              );
            })}
          </div>

          <div className={styles.progress} aria-hidden="true">
            {CLAIMS.map((claim, index) => (
              <span key={claim.name} data-active={sequence.activeIndex === index}>
                <i />
              </span>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
