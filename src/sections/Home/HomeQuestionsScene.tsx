"use client";

import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { faqs } from "@/data/faqs";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState, type KeyboardEvent } from "react";

const QUESTIONS = [
  { label: "Starting", question: "Can you help a brand new business?" },
  { label: "Existing", question: "Can you help an existing brand that already has an identity?" },
  { label: "Building", question: "Can you actually implement, or just strategise?" },
  { label: "Timing", question: "How long does a project take?" },
  { label: "Distance", question: "Can we work remotely?" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function HomeQuestionsScene() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const decisions = useMemo(
    () => QUESTIONS.map((item) => ({
      ...item,
      answer: faqs.find((faq) => faq.question === item.question)?.answer ?? "",
    })),
    [],
  );
  const active = decisions[activeIndex] ?? decisions[0];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % decisions.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + decisions.length - 1) % decisions.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = decisions.length - 1;
    else return;
    event.preventDefault();
    setActiveIndex(next);
    document.getElementById(`decision-question-${next}`)?.focus();
  }

  return (
    <section className="questions-editorial" aria-labelledby="home-questions-title">
      <BackgroundVideo video="/videos/pixabay-golden-reeds-wind.mp4" poster="/images/pixabay-golden-reeds-wind-poster.jpg" playbackRate={0.78} />
      <div className="questions-editorial__veil" aria-hidden="true" />

      <Container className="questions-editorial__frame max-w-[104rem]">
        <header className="questions-editorial__header">
          <div>
            <p>08 · Before we work together</p>
            <h2 id="home-questions-title">Choose the question<br /><em>you need answered.</em></h2>
          </div>
          <p className="questions-editorial__intro">Five practical answers, without a sales call or a maze of fine print.</p>
        </header>

        <div className="questions-editorial__experience">
          <div className="questions-editorial__choices" role="tablist" aria-label="Choose a practical question">
            <p className="questions-editorial__instruction">Select one question</p>
            {decisions.map((decision, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={decision.label}
                  id={`decision-question-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="decision-answer"
                  tabIndex={selected ? 0 : -1}
                  className={selected ? "is-active" : undefined}
                  onClick={() => setActiveIndex(index)}
                  onPointerEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{decision.label}</strong>
                  <i aria-hidden="true">→</i>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="sync" initial={false}>
            <motion.article
              key={active.label}
              id="decision-answer"
              role="tabpanel"
              aria-labelledby={`decision-question-${activeIndex}`}
              className="questions-editorial__answer"
              data-home-reading-plane
              initial={false}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: reducedMotion ? 0 : 0.45, ease: EASE }}
              aria-live="polite"
            >
              <div className="questions-editorial__answer-index">
                <span>{active.label}</span>
                <strong>{String(activeIndex + 1).padStart(2, "0")} / 05</strong>
              </div>
              <h3>{active.question}</h3>
              <p>{active.answer}</p>
              <Link href="/contact#write">Ask about your situation <span aria-hidden="true">→</span></Link>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="questions-editorial__footerline" aria-hidden="true">
          <span>Scope</span><span>Fit</span><span>Implementation</span><span>Timing</span><span>Distance</span>
        </div>
      </Container>
    </section>
  );
}
