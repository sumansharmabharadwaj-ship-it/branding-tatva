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
  tone?: "light" | "dark";
};

const MANUAL_HOLD_MS = 18000;

export function FAQ({
  questions,
  autoplay = true,
  intervalMs = 7200,
  tone = "light",
}: FAQProps = {}) {
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
  const dark = tone === "dark";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.22 },
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

  useEffect(() => {
    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== "questions" || !autoplay) return;
      window.clearTimeout(holdTimerRef.current);
      setHeld(false);
      setOpenIndex(items.length ? 0 : null);
    }

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => {
      window.removeEventListener("bt:home-chapter", onChapter as EventListener);
    };
  }, [autoplay, items.length]);

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
      className={dark ? "divide-y divide-ivory/12" : "divide-y divide-border"}
      data-faq-autoplay={autoplay ? "true" : undefined}
      onPointerDown={pauseAutoplay}
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
                backgroundColor: isOpen
                  ? dark
                    ? "rgba(212,185,154,0.075)"
                    : "rgba(184,90,52,0.055)"
                  : "rgba(184,90,52,0)",
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55 }}
            >
              {isOpen && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full"
                  style={{
                    background: dark
                      ? "radial-gradient(circle, rgba(212,185,154,0.16), transparent 68%)"
                      : "radial-gradient(circle, rgba(194,138,40,0.14), transparent 68%)",
                  }}
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
                className={`relative flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left font-medium transition-colors duration-300 ${
                  dark
                    ? "text-ivory hover:bg-ivory/[0.045] focus-visible:bg-ivory/[0.045]"
                    : "text-soil hover:bg-clay/8 focus-visible:bg-clay/8"
                }`}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => {
                  pauseAutoplay();
                  setOpenIndex(isOpen ? null : index);
                }}
              >
                <span className="flex items-baseline gap-3 pr-4">
                  <span
                    aria-hidden="true"
                    className={`text-[0.58rem] tracking-[0.14em] ${
                      dark ? "text-sandstone/60" : "text-clay/60"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.question}</span>
                </span>
                <motion.span
                  className="ml-4 shrink-0"
                  animate={{
                    rotate: isOpen
                      ? Number.parseFloat(TOGGLE_ROTATION.open)
                      : Number.parseFloat(TOGGLE_ROTATION.closed),
                    color: isOpen
                      ? dark
                        ? "#D4B99A"
                        : "#B85A34"
                      : dark
                        ? "rgba(244,239,230,0.52)"
                        : "#5A5148",
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
                    <p
                      className={`px-3 pb-4 pl-12 pt-1 text-sm leading-relaxed ${
                        dark ? "text-ivory/68" : "text-foreground-secondary"
                      }`}
                    >
                      {item.answer}
                    </p>
                    {autoplay && !prefersReducedMotion && !held && visible && (
                      <motion.span
                        key={`faq-timer-${index}`}
                        aria-hidden="true"
                        className={`absolute bottom-0 left-12 h-px origin-left ${
                          dark ? "bg-sandstone/65" : "bg-clay/55"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: "calc(100% - 3.75rem)" }}
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
        <p
          className={`px-3 pt-4 text-[0.62rem] uppercase tracking-[0.15em] ${
            dark ? "text-ivory/42" : "text-foreground-secondary/60"
          }`}
        >
          Answers unfold automatically. Select one and the page waits while you read.
        </p>
      )}
    </div>
  );
}
