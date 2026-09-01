"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion, useInView, useTransform } from "framer-motion";
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
    question: "What are people assuming this brand is?",
    decision: "Reset the frame before adding persuasion.",
    proof:
      "HerbalCart shifted from an inherited herbal frame toward modern wellness led by supplements.",
    recordType: "Documented perception reset",
    project: "HerbalCart",
    slug: "herbalcart",
    image: "/images/card-herbalcart-poster.jpg",
    imagePosition: "50% 46%",
    from: "Inherited frame",
    to: "Intended category",
    outcome: "People understand where you belong.",
    icon: Eye,
  },
  {
    number: "02",
    verb: "Name",
    lens: "Value",
    question: "Which words are carrying the advantage?",
    decision: "Choose the value frame before writing the campaign.",
    proof:
      "MyShopInEurope built its position around craft and origin instead of marketplace language led by price.",
    recordType: "Documented brand foundation",
    project: "MyShopInEurope",
    slug: "myshopineurope",
    image: "/images/card-myshopineurope-poster.jpg",
    imagePosition: "50% 50%",
    from: "Access and price",
    to: "Craft and origin",
    outcome: "They can name why you matter.",
    icon: Quote,
  },
  {
    number: "03",
    verb: "Return",
    lens: "Memory",
    question: "Which useful idea deserves to return?",
    decision: "Protect the useful idea from constant reinvention.",
    proof:
      "Dr. Haley Nutrition posted 48% less and earned 104% more followers per post.",
    recordType: "Measured performance · December 2025 to January 2026",
    project: "Dr. Haley Nutrition",
    slug: "dr-haley-nutrition",
    image: "/images/card-dr-haley-nutrition-poster.jpg",
    imagePosition: "50% 50%",
    from: "Cadence led by volume",
    to: "Pattern led by quality",
    outcome: "The useful idea stays with them.",
    icon: Repeat2,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function PointOfView() {
  const storyRef = useRef<HTMLDivElement>(null);
  const pointerFrameRef = useRef(0);
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
  const filmY = useTransform(sequence.scrollYProgress, [0, 1], ["2.4%", "-2.4%"]);
  const filmScale = useTransform(sequence.scrollYProgress, [0, 0.5, 1], [1.045, 1.015, 0.99]);

  useEffect(() => {
    previousIndexRef.current = activeIndex;
  }, [activeIndex]);

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
      node.style.setProperty("--recognition-pointer-x", x.toFixed(3));
      node.style.setProperty("--recognition-pointer-y", y.toFixed(3));
    });
  }

  function resetPointer() {
    const node = storyRef.current;
    if (!node) return;
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--recognition-pointer-x", "0");
      node.style.setProperty("--recognition-pointer-y", "0");
    });
  }

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
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
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
              I read those three decisions in sequence. First the category, then the value, then the
              pattern worth returning to. That is how a brand becomes easier to choose.
            </p>
          </header>

          <div className={styles.interactiveExperience}>
            <ol className={styles.stageRail} role="tablist" aria-label="Choose a stage in the recognition sequence">
              {STAGES.map((stage, index) => {
                const Icon = stage.icon;
                const selected = activeIndex === index;
                const resolved = index <= activeIndex;
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
                      <i aria-hidden="true"><b /></i>
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
                  <AnimatePresence mode="wait" initial={false} custom={transitionDirection}>
                    <motion.figure
                      key={active.image}
                      className={styles.evidenceFilm}
                      custom={transitionDirection}
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.12, x: transitionDirection * 14 }}
                      animate={{ opacity: 1, scale: 1.025, x: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.98, x: transitionDirection * -10 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.92, ease: EASE }}
                    >
                      <Image
                        src={active.image}
                        alt=""
                        fill
                        sizes="(min-width: 981px) 35vw, 100vw"
                        style={{ objectPosition: active.imagePosition }}
                      />
                    </motion.figure>
                  </AnimatePresence>
                  <div className={styles.ambientSequence}>
                    {STAGES.map((stage, index) => (
                      <span key={stage.lens} data-active={index === activeIndex}>{stage.lens}</span>
                    ))}
                  </div>
                  <AnimatePresence mode="wait" initial={false} custom={transitionDirection}>
                    <motion.div
                      key={active.lens}
                      className={styles.signalStage}
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.08, filter: "blur(9px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.94, filter: "blur(7px)" }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.66, ease: EASE }}
                    >
                      <small>The mind asks</small>
                      <p>{active.question}</p>
                      <div><span>{active.verb}</span><strong>{active.lens}</strong></div>
                    </motion.div>
                  </AnimatePresence>
                  <div className={styles.frameShift}>
                    <span>{active.from}</span>
                    <i />
                    <strong>{active.to}</strong>
                  </div>
                </div>
              </motion.div>
            </div>

            <div id="recognition-panel" className={styles.recordSlot} role="tabpanel" aria-labelledby={`recognition-stage-${activeIndex}`}>
              <AnimatePresence mode="wait" initial={false} custom={transitionDirection}>
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
                    <figure className={styles.staticFilm} aria-hidden="true">
                      <Image
                        src={stage.image}
                        alt=""
                        fill
                        sizes="20rem"
                        style={{ objectPosition: stage.imagePosition }}
                      />
                    </figure>
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
