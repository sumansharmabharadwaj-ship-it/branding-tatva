"use client";

import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { faqs } from "@/data/faqs";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  SERVICES_SITUATION_CLEARED_EVENT,
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  isServicesSituation,
  readCompletedHomeDiagnosis,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import { track } from "@/lib/analytics";
import { publishHomeQuestionChoice } from "@/lib/homeQuestionJourney";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";

const QUESTIONS = [
  {
    id: "new-brand",
    label: "New",
    question: "Can you help a brand new business?",
    signalLabel: "A useful starting point",
    signal: "A real offer needs its position before identity and launch decisions begin.",
  },
  {
    id: "existing-brand",
    label: "Existing",
    question: "Can you help an existing brand that already has an identity?",
    signalLabel: "A useful starting point",
    signal: "The business has evolved beyond the story or system people currently meet.",
  },
  {
    id: "implementation",
    label: "Delivery",
    question: "Can you actually implement, or just strategise?",
    signalLabel: "What can carry through",
    signal: "Messaging, visual direction, website structure, content, and campaigns.",
  },
  {
    id: "timing",
    label: "Timing",
    question: "How long does a project take?",
    signalLabel: "How timing is set",
    signal: "Scope, dependencies, and decision speed determine the honest schedule.",
  },
  {
    id: "remote",
    label: "Remote",
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
  const [committedIndex, setCommittedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [carriedSituation, setCarriedSituation] = useState<ServicesSituationId | null>(null);
  const decisions = useMemo(
    () => QUESTIONS.map((item) => ({
      ...item,
      answer: faqs.find((faq) => faq.question === item.question)?.answer ?? "",
    })),
    [],
  );
  const activeIndex = previewIndex ?? committedIndex;
  const isPreviewing = previewIndex !== null && previewIndex !== committedIndex;
  const active = decisions[activeIndex] ?? decisions[0];
  const matchedToSituation = carriedSituation !== null && SITUATION_TO_QUESTION[carriedSituation] === activeIndex;
  const sceneStyle = {
    "--question-progress": (activeIndex + 1) / decisions.length,
  } as CSSProperties;

  useEffect(() => {
    function applySituation(value: string | null) {
      if (!isServicesSituation(value)) return;
      setCarriedSituation(value);
      setCommittedIndex(SITUATION_TO_QUESTION[value]);
      setPreviewIndex(null);
      publishHomeQuestionChoice(null);
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

    function onSituationCleared() {
      setCarriedSituation(null);
      setCommittedIndex(0);
      setPreviewIndex(null);
      publishHomeQuestionChoice(null);
    }

    window.addEventListener(SERVICES_SITUATION_EVENT, onSituation as EventListener);
    window.addEventListener(SERVICES_SITUATION_CLEARED_EVENT, onSituationCleared);
    return () => {
      window.removeEventListener(
        SERVICES_SITUATION_EVENT,
        onSituation as EventListener,
      );
      window.removeEventListener(SERVICES_SITUATION_CLEARED_EVENT, onSituationCleared);
    };
  }, []);

  function choose(index: number, persist = true, measure = false) {
    if (!persist) {
      setPreviewIndex(index);
      return;
    }
    if (measure) {
      track("faq_opened", {
        source: "home_questions",
        question: decisions[index]?.id ?? "unknown",
      });
    }
    setCommittedIndex(index);
    setPreviewIndex(null);
    publishHomeQuestionChoice(decisions[index] ?? decisions[0]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % decisions.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + decisions.length - 1) % decisions.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = decisions.length - 1;
    else return;
    event.preventDefault();
    choose(next, true, true);
    document.getElementById(`decision-question-${next}`)?.focus();
  }

  return (
    <section
      className="questions-editorial"
      aria-labelledby="home-questions-title"
      data-question-state={active.id}
      data-question-preview={isPreviewing ? active.id : undefined}
      style={sceneStyle}
    >
      <BackgroundVideo
        video="/videos/pixabay-golden-reeds-wind.mp4"
        poster="/images/pixabay-golden-reeds-wind-poster.jpg"
        playbackRate={0.78}
        managedByHomepage
      />
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
          <div
            className="questions-editorial__choices"
            role="tablist"
            aria-label="Choose a practical question"
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") setPreviewIndex(null);
            }}
          >
            <p className="questions-editorial__instruction">Five common questions</p>
            {decisions.map((decision, index) => {
              const displayed = index === activeIndex;
              const committed = index === committedIndex;
              return (
                <button
                  key={decision.id}
                  id={`decision-question-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={committed}
                  aria-controls="decision-answer"
                  aria-label={`${decision.label}: ${decision.question}`}
                  tabIndex={committed ? 0 : -1}
                  className={displayed ? "is-active" : undefined}
                  data-committed={committed ? "true" : undefined}
                  onClick={() => choose(index, true, true)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") choose(index, false);
                  }}
                  onFocus={() => choose(index)}
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
              key={active.id}
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
                <span>{isPreviewing ? "Preview" : active.label}</span>
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
              <Link
                href="#invitation"
                onClick={() => publishHomeQuestionChoice(decisions[committedIndex] ?? decisions[0])}
              >
                A conversation about this <span aria-hidden="true">↓</span>
              </Link>
            </motion.article>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
