"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useInView, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Eye, Quote, Repeat2 } from "lucide-react";
import { Container } from "@/components/Container";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import styles from "./PointOfView.module.css";

const STAGES = [
  {
    number: "01",
    verb: "See",
    lens: "Category",
    question: "What category are people placing you in?",
    decision: "Correct the frame before asking for preference.",
    proof:
      "HerbalCart shifted from an inherited herbal frame toward modern wellness led by supplements.",
    recordType: "Documented perception reset",
    project: "HerbalCart",
    slug: "herbalcart",
    from: "Inherited frame",
    to: "Intended category",
    outcome: "They know where you belong.",
    icon: Eye,
  },
  {
    number: "02",
    verb: "Name",
    lens: "Value",
    question: "What makes the offer worth choosing?",
    decision: "Name the advantage before writing the campaign.",
    proof:
      "MyShopInEurope built its position around craft and origin instead of marketplace language led by price.",
    recordType: "Documented brand foundation",
    project: "MyShopInEurope",
    slug: "myshopineurope",
    from: "Access and price",
    to: "Craft and origin",
    outcome: "They know why you matter.",
    icon: Quote,
  },
  {
    number: "03",
    verb: "Return",
    lens: "Memory",
    question: "What should stay familiar every time?",
    decision: "Keep one useful idea consistent enough to be remembered.",
    proof:
      "Dr. Haley Nutrition posted 48% less and earned 104% more followers per post.",
    recordType: "Measured performance · December 2025 to January 2026",
    project: "Dr. Haley Nutrition",
    slug: "dr-haley-nutrition",
    from: "Cadence led by volume",
    to: "Pattern led by quality",
    outcome: "They remember what to return to.",
    icon: Repeat2,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const SCROLL_BEATS = [0, 0.29, 0.36, 0.62, 0.69, 1];
const HORIZONTAL_SWAP = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 8 }),
  active: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -6 }),
};

export function PointOfView() {
  const storyRef = useRef<HTMLDivElement>(null);
  const previousIndexRef = useRef(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(storyRef, { amount: 0.16, margin: "8% 0px -12% 0px" });
  const sequence = useScrollDrivenVisualizer({
    count: STAGES.length,
    target: storyRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const activeIndex = prefersReducedMotion ? STAGES.length - 1 : sequence.activeIndex;
  const active = STAGES[activeIndex];
  const transitionDirection = activeIndex >= previousIndexRef.current ? 1 : -1;
  const pacedScrollProgress = useSpring(sequence.scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.2,
  });
  const filmY = useTransform(pacedScrollProgress, [0, 1], ["1.2%", "-1.2%"]);
  const filmScale = useTransform(pacedScrollProgress, [0, 0.5, 1], [1.02, 1, 0.99]);
  const ledgerFocusY = useTransform(
    pacedScrollProgress,
    SCROLL_BEATS,
    ["0%", "58%", "58%", "132%", "132%", "200%"],
  );
  const ledgerCursorX = useTransform(
    pacedScrollProgress,
    SCROLL_BEATS,
    ["28%", "40%", "40%", "60%", "60%", "72%"],
  );
  const frameShiftProgress = useTransform(
    pacedScrollProgress,
    SCROLL_BEATS,
    [0.34, 0.53, 0.53, 0.76, 0.76, 1],
  );
  const categoryProgress = useTransform(pacedScrollProgress, [0, 0.29], [0, 1]);
  const valueProgress = useTransform(pacedScrollProgress, [0.36, 0.62], [0, 1]);
  const memoryProgress = useTransform(pacedScrollProgress, [0.69, 1], [0, 1]);
  const stageProgress = [categoryProgress, valueProgress, memoryProgress] as const;

  useEffect(() => {
    previousIndexRef.current = activeIndex;
  }, [activeIndex]);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % STAGES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + STAGES.length - 1) % STAGES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = STAGES.length - 1;
    else return;

    event.preventDefault();
    sequence.choose(next);
    document.getElementById(`recognition-stage-${next}`)?.focus();
  }

  return (
    <div
      ref={storyRef}
      className={styles.scrollStory}
      data-scroll-story="about-philosophy"
      data-recognition-stage={activeIndex + 1}
    >
      <Container className={styles.shell}>
        <section className={styles.root} aria-labelledby="philosophy-title">
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Suman&apos;s point of view</p>
              <h2 id="philosophy-title">
                Before a brand is chosen, it must be easy to <em>place, value and remember.</em>
              </h2>
            </div>
            <p>
              I read those decisions in order: where you belong, why you matter, and what should
              return. The work becomes easier to choose.
            </p>
          </header>

          <div className={styles.interactiveExperience}>
            <ol className={styles.stageRail} role="tablist" aria-label="Choose a stage in the recognition sequence">
              {STAGES.map((stage, index) => {
                const Icon = stage.icon;
                const selected = activeIndex === index;
                const resolved = index <= activeIndex;
                const progress = stageProgress[index];
                return (
                  <li key={stage.lens} role="presentation">
                    <button
                      id={`recognition-stage-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="recognition-panel"
                      tabIndex={selected ? 0 : -1}
                      data-active={selected}
                      data-resolved={resolved}
                      onPointerDown={() => sequence.choose(index)}
                      onClick={(event) => event.detail === 0 && sequence.choose(index)}
                      onPointerEnter={() => sequence.preview(index)}
                      onPointerLeave={sequence.releasePreview}
                      onFocus={() => sequence.preview(index)}
                      onBlur={sequence.releasePreview}
                      onKeyDown={(event) => onTabKeyDown(event, index)}
                    >
                      <span><Icon size={15} aria-hidden="true" /></span>
                      <small>{stage.number} · {stage.verb}</small>
                      <strong>{stage.lens}</strong>
                      <i aria-hidden="true">
                        <motion.b style={prefersReducedMotion ? undefined : { scaleX: progress }} />
                      </i>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className={styles.filmCamera} aria-hidden="true">
              <motion.div
                className={styles.filmDepth}
                style={prefersReducedMotion ? undefined : { y: filmY, scale: filmScale }}
              >
                <div className={styles.recognitionChamber}>
                  <div className={styles.evidenceFilm}>
                    <div className={styles.decisionLedger}>
                      <motion.span
                        className={styles.ledgerFocus}
                        style={prefersReducedMotion ? undefined : { y: ledgerFocusY }}
                      />
                      <motion.span
                        className={styles.ledgerCursor}
                        style={prefersReducedMotion ? undefined : { left: ledgerCursorX }}
                      />
                      <div className={styles.ledgerRows}>
                        {STAGES.map((stage, index) => (
                          <span key={stage.lens} data-active={index === activeIndex}>
                            <small>{stage.number}</small>
                            <strong>{stage.verb}</strong>
                            <i>{stage.lens}</i>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence mode="sync" initial={false} custom={transitionDirection}>
                    <motion.div
                      key={active.lens}
                      className={styles.signalStage}
                      initial={
                        prefersReducedMotion
                          ? false
                          : {
                              opacity: 0,
                              y: transitionDirection * 18,
                              clipPath: "inset(10% 0 10% 0)",
                            }
                      }
                      animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0% 0)" }}
                      exit={
                        prefersReducedMotion
                          ? undefined
                          : {
                              opacity: 0,
                              y: transitionDirection * -14,
                              clipPath: "inset(8% 0 8% 0)",
                            }
                      }
                      transition={{ duration: prefersReducedMotion ? 0 : 0.52, ease: EASE }}
                    >
                      <small>The mind asks</small>
                      <p>{active.question}</p>
                      <div>
                        <span>{active.verb}</span>
                        <strong>{active.lens}</strong>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className={styles.frameShift}>
                    <AnimatePresence mode="popLayout" initial={false} custom={transitionDirection}>
                      <motion.span
                        key={active.from}
                        custom={transitionDirection}
                        variants={HORIZONTAL_SWAP}
                        initial={prefersReducedMotion ? false : "enter"}
                        animate="active"
                        exit={prefersReducedMotion ? undefined : "exit"}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: EASE }}
                      >
                        {active.from}
                      </motion.span>
                    </AnimatePresence>
                    <motion.i
                      style={prefersReducedMotion ? undefined : { scaleX: frameShiftProgress }}
                    />
                    <AnimatePresence mode="popLayout" initial={false} custom={transitionDirection}>
                      <motion.strong
                        key={active.to}
                        custom={transitionDirection}
                        variants={HORIZONTAL_SWAP}
                        initial={prefersReducedMotion ? false : "enter"}
                        animate="active"
                        exit={prefersReducedMotion ? undefined : "exit"}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: EASE }}
                      >
                        {active.to}
                      </motion.strong>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>

            <div id="recognition-panel" className={styles.recordSlot} role="tabpanel" aria-labelledby={`recognition-stage-${activeIndex}`}>
              <AnimatePresence mode="popLayout" initial={false} custom={transitionDirection}>
                <motion.article
                  key={active.lens}
                  className={styles.record}
                  custom={transitionDirection}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: transitionDirection * 24, clipPath: "inset(0 0 0 9%)" }}
                  animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)" }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, x: transitionDirection * -16, clipPath: "inset(0 9% 0 0)" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
                >
                  <p className={styles.recordKicker}>{active.number} · {active.verb} through {active.lens.toLowerCase()}</p>
                  <h3>{active.outcome}</h3>

                  <dl>
                    <div>
                      <dt>Suman&apos;s decision</dt>
                      <dd>{active.decision}</dd>
                    </div>
                    <div>
                      <dt>Visible shift</dt>
                      <dd>{active.from} → {active.to}</dd>
                    </div>
                  </dl>

                  <div className={styles.proofRecord}>
                    <span>On record</span>
                    <p>{active.proof}</p>
                    <small>{active.recordType}</small>
                  </div>

                  <Link href={`/work/${active.slug}`}>
                    Read {active.project} <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.staticExperience}>
            <div className={styles.staticLedgerHead}>
              <small>How I make a brand easier to choose</small>
              <strong>Place the brand. Name the value. Protect what returns.</strong>
            </div>
            <div className={styles.staticLedger}>
              {STAGES.map((stage) => {
                const Icon = stage.icon;
                return (
                  <article key={stage.lens}>
                    <div className={styles.staticIndex}>
                      <span><Icon size={16} aria-hidden="true" /></span>
                      <small>{stage.number} · {stage.verb}</small>
                    </div>
                    <strong className={styles.staticLens}>{stage.lens}</strong>
                    <h3>{stage.outcome}</h3>
                    <p>{stage.decision}</p>
                    <div className={styles.staticProof}>
                      <small>{stage.project} · {stage.recordType}</small>
                      <p>{stage.proof}</p>
                      <Link href={`/work/${stage.slug}`}>
                        Read the record <ArrowUpRight size={13} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className={styles.recognitionLine} aria-label="The recognition result">
            <span>Easy to place</span><i data-resolved={activeIndex >= 1} />
            <span>Worth valuing</span><i data-resolved={activeIndex >= 2} />
            <span>Made to return</span><strong>Easier to choose</strong>
          </div>
        </section>
      </Container>
    </div>
  );
}
