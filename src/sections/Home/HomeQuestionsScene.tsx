"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { motion, useAnimationControls, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Plus } from "lucide-react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { faqs } from "@/data/faqs";
import styles from "./HomeConversation.module.css";
import { LivingGradient } from "@/components/LivingGradient";

const QUESTION_ORDER = [
  "Can you help a brand new business?",
  "Can you help an existing brand that already has an identity?",
  "Can you actually implement, or just strategise?",
  "How long does a project take?",
  "Can we work remotely?",
] as const satisfies readonly (typeof faqs)[number]["question"][];

// Keep the answers and the homepage's FAQ structured data in agreement.
const QUESTIONS = QUESTION_ORDER.flatMap((question) =>
  faqs.filter((item) => item.question === question),
);

function QuestionRow({ item, index, open, reducedMotion, buttonRef, onToggle, onKeyDown }: {
  item: (typeof QUESTIONS)[number];
  index: number;
  open: boolean;
  reducedMotion: boolean;
  buttonRef: (element: HTMLButtonElement | null) => void;
  onToggle: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const previousOpen = useRef(open);
  const copyControls = useAnimationControls();
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ["start end", "end start"] });
  // Warm soil ink deepens through the reading interval in either direction.
  // The original semantic text keeps its wrapping, selection and contrast.
  const readingInk = useTransform(scrollYProgress, [0, .3, .7, 1], ["#625a4d", "#342f27", "#342f27", "#625a4d"]);
  const readingLine = useTransform(scrollYProgress, [.18, .64], [.12, 1]);
  const buttonId = `home-question-${index + 1}`;
  const answerId = `${buttonId}-answer`;

  const settleCopy = useCallback(() => {
    copyControls.stop();
    copyControls.set({ x: 0, y: 0 });
  }, [copyControls]);

  useEffect(() => {
    const opened = open && !previousOpen.current;
    previousOpen.current = open;
    settleCopy();
    // Focus may enter between the opening render and this effect. A reading
    // already owned by the keyboard must not restart its entrance motion.
    const answerHasFocus = rowRef.current?.querySelector('[role="region"]')?.contains(document.activeElement);
    if (!opened || reducedMotion || answerHasFocus) return;
    copyControls.set({ x: 6, y: 3 });
    void copyControls.start({ x: 0, y: 0, transition: { duration: .34, ease: [.22, 1, .36, 1] } });
    return () => copyControls.stop();
  }, [open, reducedMotion, copyControls, settleCopy]);

  return (
    <motion.div
      ref={rowRef}
      className={styles.questionItem}
      data-open={open}
      style={{ color: reducedMotion ? "#342f27" : readingInk }}
    >
      <motion.span
        aria-hidden="true"
        className={styles.questionRule}
        initial={false}
        animate={{ scaleX: open ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : .38, ease: [.22, 1, .36, 1] }}
      />
      <h3>
        <button
          ref={buttonRef}
          type="button"
          id={buttonId}
          className={styles.questionButton}
          aria-expanded={open}
          aria-controls={answerId}
          onClick={onToggle}
          onKeyDown={onKeyDown}
        >
          <span className={styles.questionNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span>{item.question}</span>
          <Plus size={19} className={styles.questionIcon} aria-hidden="true" />
        </button>
      </h3>
      <motion.div
        id={answerId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        inert={!open}
        tabIndex={open ? 0 : -1}
        className={styles.answer}
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={{ duration: reducedMotion ? 0 : .34, ease: [.22, 1, .36, 1] }}
        onFocusCapture={settleCopy}
        onPointerDown={settleCopy}
      >
        <span className={styles.answerRail} aria-hidden="true">
          <motion.i style={{ scaleY: reducedMotion ? 1 : readingLine }} />
        </span>
        <motion.p initial={false} animate={copyControls}>{item.answer}</motion.p>
      </motion.div>
    </motion.div>
  );
}

export function HomeQuestionsScene() {
  const rootRef = useRef<HTMLElement>(null);
  const questionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [openQuestions, setOpenQuestions] = useState(() => new Set([0]));
  const reducedMotion = useHydratedReducedMotion();
  const cinematicMotion = useMediaQuery(
    "(min-width: 1181px) and (min-height: 761px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  });
  const mediaScale = useTransform(scrollYProgress, [0, 0.68, 1], [1, 1, 1.035]);

  function revealFocusedQuestion(target: HTMLElement | null) {
    if (!target || target === rootRef.current || !target.matches(":focus-visible")) return;
    const bounds = target.getBoundingClientRect();
    if (bounds.top < 80 || bounds.bottom > window.innerHeight - 80) {
      target.scrollIntoView({
        block: bounds.height > window.innerHeight - 160 ? "start" : "nearest",
        inline: "nearest",
        behavior: "instant",
      });
    }
  }

  function onQuestionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? QUESTIONS.length - 1
      : event.key === "ArrowDown" ? (index + 1) % QUESTIONS.length
      : (index - 1 + QUESTIONS.length) % QUESTIONS.length;
    // Moving between headings leaves the answer being read unchanged.
    const target = questionRefs.current[next];
    if (target === document.activeElement) revealFocusedQuestion(target);
    else target?.focus({ preventScroll: true });
  }

  function toggleQuestion(index: number) {
    // Move focus before making its current reading surface inert. Pointer
    // activation does not focus buttons in every browser.
    const button = questionRefs.current[index];
    const answerId = button?.getAttribute("aria-controls");
    const answer = answerId ? document.getElementById(answerId) : null;
    if (openQuestions.has(index) && answer?.contains(document.activeElement)) {
      button?.focus({ preventScroll: true });
    }
    // Opening a later answer never collapses text above the active heading.
    // Each disclosure stays owned by the visitor who opened it.
    setOpenQuestions((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <section ref={rootRef} className={styles.questions} data-cursor-world="light" aria-labelledby="home-questions-title"
      onFocusCapture={(event) => revealFocusedQuestion(event.target)}>
      <LivingGradient contours preset="meadow" plain opacity={0.42} shaft={false} />
      <motion.div
        className={styles.questionMedia}
        style={{ scale: cinematicMotion && !reducedMotion ? mediaScale : 1 }}
        aria-hidden="true"
      >
        <BackgroundVideo
          video="/videos/pexels-golden-fog-sea.mp4"
          videoWebm="/videos/pexels-golden-fog-sea.webm"
          poster="/images/pexels-golden-fog-sea-poster.jpg"
        />
      </motion.div>
      <div className={styles.questionFrame}>
        <header className={styles.questionIntro}>
          <p className={styles.eyebrow}>Before we work together</p>
          <h2 id="home-questions-title">Know what you’re <em>saying yes to.</em></h2>
          <p className={styles.lede}>
            Scope, timing, and working directly with Suman.
          </p>
          {/* Native fragment navigation carries keyboard focus into the next scene. */}
          <a href="#invitation" className={styles.textLink}>
            Talk through your question <ArrowDown size={17} aria-hidden="true" />
          </a>
        </header>

        <div className={styles.questionList}>
          {QUESTIONS.map((item, index) => (
            <QuestionRow
              key={item.question}
              item={item}
              index={index}
              open={openQuestions.has(index)}
              reducedMotion={reducedMotion}
              buttonRef={(element) => { questionRefs.current[index] = element; }}
              onToggle={() => toggleQuestion(index)}
              onKeyDown={(event) => onQuestionKeyDown(event, index)}
            />
          ))}
          <div className={styles.auditNote}>
            <p>Prefer to look at your brand first?</p>
            <Link href="/services#audit" className={styles.textLink}>
              Try the recognition audit <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
