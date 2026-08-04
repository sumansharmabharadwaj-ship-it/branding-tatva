"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { faqs } from "@/data/faqs";
import { Reveal } from "@/components/Reveal";
import { answerVariants, answerTransition, TOGGLE_ROTATION } from "./animations";

type FAQProps = {
  questions?: string[];
  autoplay?: boolean;
  intervalMs?: number;
};

const MANUAL_HOLD_MS = 18000;

export function FAQ({ questions, autoplay = true, intervalMs = 7200 }: FAQProps = {}) {
  const items = useMemo(
    () => (questions ? faqs.filter((faq) => questions.includes(faq.question)) : faqs),
    [questions],
  );
  const [openIndex, setOpenIndex] = useState<number | null>(() => (autoplay ? 0 : null));
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const holdTimerRef = useRef(0);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.28 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (openIndex !== null && openIndex >= items.length) {
      setOpenIndex(items.length ? 0 : null);
    }
  }, [items.length, openIndex]);

  useEffect(() => {
    if (!autoplay || prefersReducedMotion || held || !visible || items.length < 2) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setOpenIndex((current) => (current === null ? 0 : (current + 1) % items.length));
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [autoplay, held, intervalMs, items.length, prefersReducedMotion, visible]);

  useEffect(
    () => () => {
      window.clearTimeout(holdTimerRef.current);
    },
    [],
  );

  function pauseAutoplay() {
    if (!autoplay) return;
    setHeld(true);
    window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = window.setTimeout(() => setHeld(false), MANUAL_HOLD_MS);
  }

  return (
    <div
      ref={rootRef}
      className="divide-y divide-border"
      data-faq-autoplay={autoplay ? "true" : undefined}
      onPointerEnter={pauseAutoplay}
      onFocusCapture={pauseAutoplay}
      onTouchStart={pauseAutoplay}
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const questionId = `faq-question-${index}`;
        const answerId = `faq-answer-${index}`;

        return (
          <Reveal key={item.question} delay={index * 0.05} className="relative py-1">
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              animate={{
                backgroundColor: isOpen ? "rgba(184,90,52,0.055)" : "rgba(184,90,52,0)",
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55 }}
            >
              {isOpen && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(194,138,40,0.14), transparent 68%)" }}
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { scale: [0.86, 1.16, 0.86], opacity: [0.45, 0.9, 0.45] }
                  }
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 5.4, repeat: Infinity, ease: "easeInOut" }
                  }
                />
              )}

              <button
                type="button"
                id={questionId}
                className="relative flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left font-medium text-soil transition-colors duration-300 hover:bg-clay/8 focus-visible:bg-clay/8"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => {
                  pauseAutoplay();
                  setOpenIndex(isOpen ? null : index);
                }}
              >
                <span className="pr-4">{item.question}</span>
                <motion.span
                  className="ml-4 shrink-0 text-foreground-secondary"
                  animate={{
                    rotate: isOpen ? Number.parseFloat(TOGGLE_ROTATION.open) : Number.parseFloat(TOGGLE_ROTATION.closed),
                    color: isOpen ? "#B85A34" : "#5A5148",
                  }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
                  aria-hidden="true"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    variants={prefersReducedMotion ? undefined : answerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={answerTransition}
                    className="relative overflow-hidden"
                  >
                    <p className="px-3 pb-4 pt-1 text-sm leading-relaxed text-foreground-secondary">
                      {item.answer}
                    </p>
                    {autoplay && !prefersReducedMotion && !held && visible && (
                      <motion.span
                        key={`faq-timer-${index}`}
                        aria-hidden="true"
                        className="absolute bottom-0 left-3 h-px origin-left bg-clay/55"
                        initial={{ width: 0 }}
                        animate={{ width: "calc(100% - 1.5rem)" }}
                        transition={{ duration: intervalMs / 1000, ease: "linear" }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Reveal>
        );
      })}

      {autoplay && !prefersReducedMotion && (
        <p className="px-3 pt-4 text-[0.62rem] uppercase tracking-[0.15em] text-foreground-secondary/60">
          Answers unfold automatically. Open one and the page waits while you read.
        </p>
      )}
    </div>
  );
}
