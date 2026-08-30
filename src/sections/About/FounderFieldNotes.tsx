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

const FIELDS = [
  {
    number: "01",
    verb: "Notice",
    field: "Psychology",
    credential: credentials[0].label,
    source: credentials[0].detail,
    record: "Clinical and counselling internships · 90 documented training hours · 2021–22",
    instinct: "Read the tension beneath the first answer.",
    application:
      "Audience inquiry begins with attention, context, hesitation, and the patterns people repeat before a positioning decision is made.",
    result: "Human signal",
    icon: Brain,
  },
  {
    number: "02",
    verb: "Name",
    field: "Literature",
    credential: credentials[1].label,
    source: credentials[1].detail,
    record: "Formal study of narrative, voice, metaphor, and meaning",
    instinct: "Give a complex idea language people can hold.",
    application:
      "Positioning becomes a message hierarchy, verbal character, and set of phrases a team can understand and repeat.",
    result: "Verbal signal",
    icon: BookOpenText,
  },
  {
    number: "03",
    verb: "Frame",
    field: "Film",
    credential: credentials[4].label,
    source: credentials[4].detail,
    record: "National filmmaking recognition · Thomso ’19",
    instinct: "Direct attention through sequence, focus, and restraint.",
    application:
      "Creative direction gives image, rhythm, composition, and campaign formats a shared strategic reason.",
    result: "Visual signal",
    icon: Clapperboard,
  },
  {
    number: "04",
    verb: "Decide",
    field: "Brand strategy",
    credential: "Branding Tatva",
    source: "Founder-led brand strategy practice",
    record: "One strategic thread from the first question to the usable system",
    instinct: "Join observation, language, and focus into one choice.",
    application:
      "The practice finds a credible position, gives it language and form, then builds the rules that help recognition compound.",
    result: "Brand signal",
    icon: Compass,
  },
] as const;

const FORMATIVE_FIELDS = FIELDS.slice(0, 3);
const EASE = [0.22, 1, 0.36, 1] as const;

export function FounderFieldNotes() {
  const storyRef = useRef<HTMLElement>(null);
  const pointerFrameRef = useRef(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(storyRef, { amount: 0.16, margin: "8% 0px -12% 0px" });
  const visualizer = useScrollDrivenVisualizer({
    count: FIELDS.length,
    target: storyRef,
    enabled: inView,
    reducedMotion: prefersReducedMotion,
  });
  const activeIndex = prefersReducedMotion ? FIELDS.length - 1 : visualizer.activeIndex;
  const active = FIELDS[activeIndex];
  const ActiveIcon = active.icon;
  const portraitY = useTransform(visualizer.scrollYProgress, [0, 1], ["2.2%", "-2.2%"]);
  const portraitScale = useTransform(visualizer.scrollYProgress, [0, 0.72, 1], [1.055, 1.015, 0.98]);

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
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % FIELDS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + FIELDS.length - 1) % FIELDS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = FIELDS.length - 1;
    else return;

    event.preventDefault();
    visualizer.choose(next);
    document.getElementById(`origin-field-${next}`)?.focus();
  }

  return (
    <section
      ref={storyRef}
      className={styles.scrollStory}
      data-origin-stage={activeIndex + 1}
      data-scroll-story="about-founder-origin"
      aria-labelledby="founder-origin-title"
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <div className={styles.sticky}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Formative fields · verified record</p>
            <h2 id="founder-origin-title">
              Three disciplines trained the same instinct: <em>find what matters, then make it clear.</em>
            </h2>
          </div>
          <div className={styles.headerAside}>
            <p>
              Psychology sharpened observation. Literature sharpened language. Film sharpened
              attention. The combination matters when a founder is beginning, an existing brand
              feels difficult to explain, or recognition needs steadier continuity.
            </p>
            <p className={styles.stageReadout}>
              <span>{active.verb}</span>
              <strong>{active.number} / 04</strong>
            </p>
          </div>
        </header>

        <div className={styles.desktopComposition}>
          <ol className={styles.fieldRail} role="tablist" aria-label="Explore Suman Sharma's formative fields">
            {FIELDS.map((field, index) => {
              const Icon = field.icon;
              const selected = activeIndex === index;
              const gathered = index <= activeIndex || activeIndex === FIELDS.length - 1;
              return (
                <li key={field.field} role="presentation">
                  <button
                    id={`origin-field-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="founder-origin-panel"
                    tabIndex={selected ? 0 : -1}
                    data-active={selected}
                    data-gathered={gathered}
                    onClick={() => visualizer.choose(index)}
                    onPointerEnter={() => visualizer.preview(index)}
                    onPointerLeave={visualizer.releasePreview}
                    onFocus={() => visualizer.preview(index)}
                    onBlur={visualizer.releasePreview}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                  >
                    <span><Icon size={16} aria-hidden="true" /></span>
                    <small>{field.number} · {field.verb}</small>
                    <strong>{field.field}</strong>
                    <em>{field.result}</em>
                    <i aria-hidden="true"><b /></i>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className={styles.portraitStage} aria-hidden="true">
            <div className={styles.threadField}>
              {FORMATIVE_FIELDS.map((field, index) => (
                <span key={field.field} data-thread={index + 1} data-active={index <= activeIndex || activeIndex === 3} />
              ))}
            </div>
            <div className={styles.portraitCamera}>
              <motion.figure
                className={styles.portrait}
                style={prefersReducedMotion ? undefined : { y: portraitY, scale: portraitScale }}
                animate={prefersReducedMotion ? undefined : {
                  rotate: activeIndex === 0 ? -1.1 : activeIndex === 1 ? 0.55 : activeIndex === 2 ? -0.4 : 0,
                }}
                transition={{ duration: 0.72, ease: EASE }}
              >
                <Image
                  src="/images/suman-sharma-studio-portrait.webp"
                  alt=""
                  fill
                  priority={false}
                  sizes="40rem"
                  className={styles.portraitImage}
                />
                <div className={styles.aperture}><span /><span /><span /></div>
                <figcaption>
                  <span>Suman Sharma</span>
                  <strong>Founder · Brand strategist</strong>
                </figcaption>
              </motion.figure>
            </div>

            <div className={styles.lensNodes}>
              {FORMATIVE_FIELDS.map((field, index) => {
                const Icon = field.icon;
                const gathered = index <= activeIndex || activeIndex === 3;
                return (
                  <motion.span
                    key={field.field}
                    data-node={index + 1}
                    data-active={gathered}
                    animate={{ scale: gathered ? 1 : 0.78, opacity: gathered ? 1 : 0.28 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
                  >
                    <Icon size={15} />
                  </motion.span>
                );
              })}
            </div>

            <motion.div
              className={styles.synthesisSeal}
              animate={{ opacity: activeIndex === 3 ? 1 : 0, scale: activeIndex === 3 ? 1 : 0.76 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.62, ease: EASE }}
            >
              <Compass size={15} />
              <span>Three trained lenses</span>
              <strong>One founder-led practice</strong>
            </motion.div>
          </div>

          <div className={styles.recordSlot} aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={active.field}
                id="founder-origin-panel"
                role="tabpanel"
                aria-labelledby={`origin-field-${activeIndex}`}
                className={styles.recordCard}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 32, clipPath: "inset(0 0 0 14%)" }}
                animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)" }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, x: -20, clipPath: "inset(0 12% 0 0)" }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
              >
                <div className={styles.cardTopline}>
                  <span><ActiveIcon size={17} aria-hidden="true" /></span>
                  <small>{active.number} · {active.field}</small>
                </div>
                <h3>{active.instinct}</h3>
                <div className={styles.credential}>
                  <span>On record</span>
                  <strong>{active.credential}</strong>
                  <p>{active.source}</p>
                  <small>{active.record}</small>
                </div>
                <div className={styles.application}>
                  <span>How the field enters brand work</span>
                  <p>{active.application}</p>
                </div>
                <footer>
                  <span>{active.verb}</span><i /><strong>{active.result}</strong>
                </footer>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.progressRail} aria-hidden="true">
          <span>Formation</span>
          <div><i style={{ transform: `scaleX(${(activeIndex + 1) / FIELDS.length})` }} /></div>
          <strong>{String(activeIndex + 1).padStart(2, "0")} / 04</strong>
        </div>

        <div className={styles.staticExperience}>
          <figure className={styles.mobilePortrait}>
            <Image
              src="/images/suman-sharma-studio-portrait.webp"
              alt="Black-and-white studio portrait of Suman Sharma"
              fill
              sizes="40rem"
              className={styles.portraitImage}
            />
            <figcaption>Suman Sharma · Founder and brand strategist</figcaption>
          </figure>

          <ol>
            {FORMATIVE_FIELDS.map((field) => {
              const Icon = field.icon;
              return (
                <li key={field.field}>
                  <span><Icon size={17} aria-hidden="true" /></span>
                  <div>
                    <small>{field.number} · {field.field}</small>
                    <h3>{field.instinct}</h3>
                    <p><strong>{field.credential}</strong> · {field.source}</p>
                    <p>{field.application}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className={styles.staticResolution}>
            <Compass size={18} aria-hidden="true" />
            <div>
              <small>Branding Tatva</small>
              <strong>Psychology notices. Literature names. Film frames. Strategy decides.</strong>
              <p>Three trained lenses now work as one founder-led practice.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
