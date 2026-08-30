"use client";

import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { faqs } from "@/data/faqs";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";

const QUESTIONS = [
  {
    label: "Starting",
    question: "Can you help a brand new business?",
    signalLabel: "A useful starting point",
    signal: "A real offer needs its position before identity and launch decisions begin.",
  },
  {
    label: "Existing",
    question: "Can you help an existing brand that already has an identity?",
    signalLabel: "A useful starting point",
    signal: "The business has evolved beyond the story or system people currently meet.",
  },
  {
    label: "Building",
    question: "Can you actually implement, or just strategise?",
    signalLabel: "What can carry through",
    signal: "Messaging, visual direction, website structure, content, and campaigns.",
  },
  {
    label: "Timing",
    question: "How long does a project take?",
    signalLabel: "How timing is set",
    signal: "Scope, dependencies, and decision speed determine the honest schedule.",
  },
  {
    label: "Distance",
    question: "Can we work remotely?",
    signalLabel: "Working model",
    signal: "Remote collaboration across every client project shown on this site.",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const SITUATION_TO_QUESTION: Record<ServicesSituationId, number> = {
  idea: 0,
  reposition: 1,
  ongoing: 2,
};
const SITUATION_LABEL: Record<ServicesSituationId, string> = {
  idea: "New brand",
  reposition: "Repositioning",
  ongoing: "Brand growth",
};

export function HomeQuestionsScene() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [carriedSituation, setCarriedSituation] = useState<ServicesSituationId | null>(null);
  const decisions = useMemo(
    () => QUESTIONS.map((item) => ({
      ...item,
      answer: faqs.find((faq) => faq.question === item.question)?.answer ?? "",
    })),
    [],
  );
  const active = decisions[activeIndex] ?? decisions[0];
  const matchedToSituation = carriedSituation !== null && SITUATION_TO_QUESTION[carriedSituation] === activeIndex;
  const sceneStyle = {
    "--question-progress": (activeIndex + 1) / decisions.length,
  } as CSSProperties;

  useEffect(() => {
    function applySituation(value: string | null) {
      if (!isServicesSituation(value)) return;
      setCarriedSituation(value);
      setActiveIndex(SITUATION_TO_QUESTION[value]);
    }

    try {
      const completedDiagnosis = readCompletedHomeDiagnosis();
      if (completedDiagnosis) applySituation(completedDiagnosis);
      else applySituation(window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY));
    } catch {}

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      applySituation(detail?.situation ?? null);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    return () =>
      window.removeEventListener(
        SERVICES_SITUATION_EVENT,
        onSituation as EventListener,
      );
  }, []);

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
    <section
      className="questions-editorial"
      aria-labelledby="home-questions-title"
      data-question-state={active.label.toLowerCase()}
      style={sceneStyle}
    >
      <BackgroundVideo video="/videos/pixabay-golden-reeds-wind.mp4" poster="/images/pixabay-golden-reeds-wind-poster.jpg" playbackRate={0.78} />
      <div className="questions-editorial__veil" aria-hidden="true" />

      <Container className="questions-editorial__frame max-w-[104rem]">
        <header className="questions-editorial__header">
          <div>
            <p>
              08 · Before we work together
              {carriedSituation ? ` · ${SITUATION_LABEL[carriedSituation]}` : ""}
            </p>
            <h2 id="home-questions-title">The questions that come next.<br /><em>Answered plainly.</em></h2>
          </div>
          <p className="questions-editorial__intro">Five practical answers, without a sales call or a maze of fine print.</p>
        </header>

        <div className="questions-editorial__experience">
          <div className="questions-editorial__choices" role="tablist" aria-label="Choose a practical question">
            <p className="questions-editorial__instruction">Five common questions</p>
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
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setActiveIndex(index);
                  }}
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
              <div className="questions-editorial__fit">
                <span>
                  {matchedToSituation && carriedSituation
                    ? `Matched to ${SITUATION_LABEL[carriedSituation]}`
                    : active.signalLabel}
                </span>
                <strong>{active.signal}</strong>
              </div>
              <Link href="#invitation">A conversation about this <span aria-hidden="true">↓</span></Link>
            </motion.article>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
