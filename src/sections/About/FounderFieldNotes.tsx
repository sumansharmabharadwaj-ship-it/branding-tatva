"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion, useInView, useTransform } from "framer-motion";
import { BookOpenText, Brain, Clapperboard, Compass } from "lucide-react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useScrollDrivenVisualizer } from "@/hooks/useScrollDrivenVisualizer";
import { credentials } from "@/data/about";
import styles from "./FounderFieldNotes.module.css";

const STAGES = [
  {
    number: "01",
    verb: "Listen",
    field: "Psychology",
    title: "Attention has a logic before it has a look.",
    credential: credentials[0].label,
    source: credentials[0].detail,
    record: "Clinical and counselling internships · 90 documented training hours · 2021–22",
    thought:
      "Observe the tension, context, and pattern before prescribing the message.",
    translation:
      "In brand work, this becomes sharper audience reading, more useful research questions, and fewer assumptions disguised as insight.",
    terms: ["Attention", "Perception", "Decision"],
    icon: Brain,
    word: "notice",
  },
  {
    number: "02",
    verb: "Name",
    field: "Literature",
    title: "Language changes the value people think they are seeing.",
    credential: credentials[1].label,
    source: credentials[1].detail,
    record: "A formal study of narrative, voice, metaphor, and meaning",
    thought:
      "Find the words that make a complex idea feel precise, human, and repeatable.",
    translation:
      "In brand work, this becomes positioning people can understand, a message hierarchy teams can use, and a voice that earns recognition.",
    terms: ["Narrative", "Meaning", "Memory"],
    icon: BookOpenText,
    word: "name",
  },
  {
    number: "03",
    verb: "Frame",
    field: "Film",
    title: "A frame decides what enters the story—and what stays out.",
    credential: credentials[4].label,
    source: credentials[4].detail,
    record: "National filmmaking recognition · Thomso ’19",
    thought:
      "Use sequence, focus, and restraint to make the important idea impossible to miss.",
    translation:
      "In brand work, this becomes creative direction with a reason: each image, beat, and campaign format carries the same strategic signal.",
    terms: ["Focus", "Rhythm", "Selection"],
    icon: Clapperboard,
    word: "frame",
  },
  {
    number: "04",
    verb: "Synthesize",
    field: "Brand strategy",
    title: "The disciplines now work as one decision-making practice.",
    credential: "Branding Tatva",
    source: "Founder-led brand strategy practice",
    record: "One strategic thread from the first question to the usable system",
    thought:
      "Psychology detects. Literature articulates. Film frames. Strategy decides.",
    translation:
      "The result is not a borrowed framework or a decorative style. It is a way of finding the signal a brand can credibly own and helping it carry that signal consistently.",
    terms: ["Position", "Expression", "Recognition"],
    icon: Compass,
    word: "decide",
  },
] as const;

const STATIC_STAGES = STAGES.slice(0, 3);
const EASE = [0.22, 1, 0.36, 1] as const;

export function FounderFieldNotes() {
  const storyRef = useRef<HTMLElement>(null);
  const pointerFrameRef = useRef(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(storyRef, { amount: 0.16, margin: "8% 0px -12% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: STAGES.length,
    target: storyRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const active = STAGES[visualizer.activeIndex];
  const ActiveIcon = active.icon;
  const portraitY = useTransform(visualizer.scrollYProgress, [0, 1], ["2.8%", "-2.8%"]);
  const portraitScale = useTransform(visualizer.scrollYProgress, [0, 0.48, 1], [1.04, 1, 0.965]);

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), []);

  function updatePointer(event: ReactPointerEvent<HTMLElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const node = storyRef.current;
    if (!node) return;
    const { left, top, width, height } = node.getBoundingClientRect();
    const x = ((event.clientX - left) / Math.max(width, 1) - 0.5) * 2;
    const y = ((event.clientY - top) / Math.max(height, 1) - 0.5) * 2;

    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--origin-pointer-x", x.toFixed(3));
      node.style.setProperty("--origin-pointer-y", y.toFixed(3));
    });
  }

  function resetPointer() {
    const node = storyRef.current;
    if (!node) return;
    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      node.style.setProperty("--origin-pointer-x", "0");
      node.style.setProperty("--origin-pointer-y", "0");
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
    visualizer.choose(next);
    document.getElementById(`origin-tab-${next}`)?.focus();
  }

  return (
    <section
      ref={storyRef}
      className={styles.scrollStory}
      data-origin-stage={visualizer.activeIndex + 1}
      data-scroll-story="about-founder-origin"
      aria-labelledby="founder-origin-title"
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <div className={styles.sticky}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>The mind behind the method · verified field record</p>
            <h2 id="founder-origin-title">
              This practice was shaped in three rooms: <em>the clinic, the page, and the frame.</em>
            </h2>
          </div>
          <div className={styles.headerAside}>
            <p>
              Not a conventional résumé. A map of the disciplines that changed how Suman listens,
              interprets, and makes brand decisions.
            </p>
            <p className={styles.stageReadout} aria-live="polite">
              <span>{active.verb}</span>
              <strong>{active.number} / 04</strong>
            </p>
          </div>
        </header>

        <div className={styles.desktopComposition}>
          <div className={styles.wordStage} aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active.word}
                initial={prefersReducedMotion ? false : { opacity: 0, letterSpacing: "0.08em", x: 42 }}
                animate={{ opacity: 1, letterSpacing: "-0.06em", x: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, letterSpacing: "-0.11em", x: -28 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: EASE }}
              >
                {active.word}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className={styles.portraitColumn}>
            <div className={styles.portraitCamera}>
              <motion.figure
                className={styles.portrait}
                style={prefersReducedMotion ? undefined : { y: portraitY, scale: portraitScale }}
                animate={prefersReducedMotion ? undefined : {
                  rotate: visualizer.activeIndex === 0 ? -1.5 : visualizer.activeIndex === 1 ? 0.8 : visualizer.activeIndex === 2 ? -0.6 : 0,
                }}
                transition={{ duration: 0.72, ease: EASE }}
              >
                <Image
                  src="/images/own-portrait.jpg"
                  alt="Suman Sharma seated in a mountain forest"
                  fill
                  priority={false}
                  sizes="(max-width: 900px) 88vw, 34vw"
                  className={styles.portraitImage}
                />
                <div className={styles.aperture} aria-hidden="true">
                  <span /><span /><span /><span />
                </div>
                <figcaption>
                  <span>Suman Sharma</span>
                  <strong>Founder · Brand strategist</strong>
                </figcaption>
              </motion.figure>
            </div>

            <div className={styles.disciplineNodes} aria-hidden="true">
              {STAGES.slice(0, 3).map((stage, index) => {
                const Icon = stage.icon;
                const activeNode = visualizer.activeIndex === index || visualizer.activeIndex === 3;
                return (
                  <motion.span
                    key={stage.field}
                    data-node={index + 1}
                    data-active={activeNode}
                    animate={{ scale: activeNode ? 1 : 0.82, opacity: activeNode ? 1 : 0.38 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
                  >
                    <Icon size={15} />
                  </motion.span>
                );
              })}
            </div>
          </div>

          <div className={styles.recordSlot} aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={active.field}
                id="founder-origin-panel"
                role="tabpanel"
                aria-labelledby={`origin-tab-${visualizer.activeIndex}`}
                className={styles.recordCard}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 44, rotateY: -7, clipPath: "inset(0 0 0 18%)" }}
                animate={{ opacity: 1, x: 0, rotateY: 0, clipPath: "inset(0 0 0 0%)" }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, x: -26, rotateY: 5, clipPath: "inset(0 16% 0 0)" }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.58, ease: EASE }}
              >
                <div className={styles.cardTopline}>
                  <span><ActiveIcon size={17} aria-hidden="true" /></span>
                  <small>{active.number} · {active.field}</small>
                </div>
                <h3>{active.title}</h3>

                <dl>
                  <div>
                    <dt>On record</dt>
                    <dd><strong>{active.credential}</strong><span>{active.source}</span></dd>
                  </div>
                  <div>
                    <dt>Field note</dt>
                    <dd>{active.record}</dd>
                  </div>
                </dl>

                <blockquote>“{active.thought}”</blockquote>

                <div className={styles.translation}>
                  <span>How it enters the work</span>
                  <p>{active.translation}</p>
                </div>

                <ul>
                  {active.terms.map((term) => <li key={term}>{term}</li>)}
                </ul>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Explore the disciplines behind Branding Tatva">
          {STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const selected = visualizer.activeIndex === index;
            return (
              <button
                key={stage.field}
                id={`origin-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="founder-origin-panel"
                tabIndex={selected ? 0 : -1}
                data-active={selected}
                onClick={() => visualizer.choose(index)}
                onPointerEnter={() => visualizer.preview(index)}
                onPointerLeave={visualizer.releasePreview}
                onFocus={() => visualizer.preview(index)}
                onBlur={visualizer.releasePreview}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <span><Icon size={15} aria-hidden="true" /></span>
                <small>{stage.number}</small>
                <strong>{stage.verb}</strong>
                <em>{stage.field}</em>
                <i aria-hidden="true"><b /></i>
              </button>
            );
          })}
        </div>

        <div className={styles.staticExperience}>
          <figure className={styles.mobilePortrait}>
            <Image
              src="/images/own-portrait.jpg"
              alt="Suman Sharma seated in a mountain forest"
              fill
              sizes="(max-width: 900px) 92vw, 36vw"
              className={styles.portraitImage}
            />
            <figcaption>Suman Sharma · Founder and brand strategist</figcaption>
          </figure>

          <ol>
            {STATIC_STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <li key={stage.field}>
                  <span><Icon size={17} aria-hidden="true" /></span>
                  <div>
                    <small>{stage.number} · {stage.field}</small>
                    <h3>{stage.credential}</h3>
                    <p>{stage.source}</p>
                    <p>{stage.translation}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className={styles.staticResolution}>
            <strong>Psychology detects. Literature articulates. Film frames.</strong>
            Strategy turns all three into a decision a brand can use.
          </p>
        </div>
      </div>
    </section>
  );
}
