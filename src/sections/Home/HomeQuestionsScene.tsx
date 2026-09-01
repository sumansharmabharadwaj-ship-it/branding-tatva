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
import {
  HOME_METHOD_DECISION_EVENT,
  type HomeMethodDecisionDetail,
} from "@/lib/homeMethodJourney";
import {
  publishHomeQuestionChoice,
  type HomeQuestionChoice,
} from "@/lib/homeQuestionJourney";
import {
  clearHomeStudioLens,
  HOME_STUDIO_LENS_EVENT,
  HOME_STUDIO_LENSES,
  publishHomeStudioLens,
  readHomeStudioLens,
  type HomeStudioLens,
  type HomeStudioLensDetail,
  type HomeStudioLensName,
} from "@/lib/homeStudioJourney";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

const QUESTIONS = [
  {
    id: "new-brand",
    label: "New",
    question: "Can you help a brand new business?",
    signalLabel: "What comes first",
    signal: "Decide the category, buyer, and reason to choose before identity or launch work begins.",
  },
  {
    id: "existing-brand",
    label: "Existing",
    question: "Can you help an existing brand that already has an identity?",
    signalLabel: "What usually changed",
    signal: "The business evolved, but buyers still meet the category, story, or identity it used to need.",
  },
  {
    id: "implementation",
    label: "Delivery",
    question: "Can you actually implement, or just strategise?",
    signalLabel: "What implementation can include",
    signal: "Messaging, visual direction, website structure, content, and campaigns.",
  },
  {
    id: "timing",
    label: "Timing",
    question: "How long does a project take?",
    signalLabel: "How timing is set",
    signal: "Scope, dependencies, and the speed of feedback determine the schedule.",
  },
  {
    id: "remote",
    label: "Remote",
    question: "Can we work remotely?",
    signalLabel: "Working model",
    signal: "Remote collaboration across every client project shown on this site.",
  },
] as const;

type SelectionDirection = "forward" | "backward";

const EASE = [0.22, 1, 0.36, 1] as const;
const QUESTION_ANSWER_VARIANTS = {
  enter: (direction: SelectionDirection) => ({
    opacity: 0,
    x: direction === "forward" ? 16 : -16,
    y: 5,
    filter: "blur(5px)",
  }),
  active: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
  exit: (direction: SelectionDirection) => ({
    opacity: 0,
    x: direction === "forward" ? -9 : 9,
    y: -7,
    filter: "blur(4px)",
  }),
};
const LENS_READING_VARIANTS = {
  enter: (direction: SelectionDirection) => ({
    opacity: 0,
    x: direction === "forward" ? 9 : -9,
    y: 4,
    filter: "blur(3px)",
  }),
  active: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
  exit: (direction: SelectionDirection) => ({
    opacity: 0,
    x: direction === "forward" ? -6 : 6,
    y: -4,
    filter: "blur(3px)",
  }),
};
const SITUATION_TO_QUESTION: Record<ServicesSituationId, number> = {
  idea: 0,
  reposition: 1,
  ongoing: 2,
};
const SITUATION_LABEL: Record<ServicesSituationId, string> = {
  idea: "New brand",
  reposition: "Repositioning",
  ongoing: "Repeatable system",
};
type QuestionId = (typeof QUESTIONS)[number]["id"];

const LENS_READINGS: Record<HomeStudioLensName, Record<QuestionId, string>> = {
  Psychology: {
    "new-brand": "Find the belief people need before a name or identity can earn trust.",
    "existing-brand": "Locate the gap between what the business has become and what people still assume it is.",
    implementation: "Every output should reinforce the same perception, so the strategy can leave the document.",
    timing: "Leave enough room to hear hesitation, test language, and decide with evidence.",
    remote: "Make uncertainty, language, and decision patterns visible across every conversation.",
  },
  Literature: {
    "new-brand": "Give the new brand one idea clear enough to survive every retelling.",
    "existing-brand": "Find the story the current identity carries after the business has outgrown it.",
    implementation: "Use voice, symbols, and rhythm to give the position a form people can repeat.",
    timing: "Give the central idea enough time to be found, tested, and edited.",
    remote: "Use shared language to keep meaning coherent across screens, documents, and decisions.",
  },
  Strategy: {
    "new-brand": "Resolve category, audience, and offer into one governing position before launch.",
    "existing-brand": "Decide whether the system needs repair, repositioning, or a stronger centre.",
    implementation: "Define which outputs must carry the governing position into the market.",
    timing: "Let dependencies and decision speed shape the sequence more honestly than a fixed estimate.",
    remote: "Keep responsibilities, approvals, and the governing decision visible across distance.",
  },
};

function toQuestionChoice(
  decision: (typeof QUESTIONS)[number] & { answer: string },
  lens: HomeStudioLens | null,
): HomeQuestionChoice {
  return {
    id: decision.id,
    label: decision.label,
    question: decision.question,
    lens,
  };
}

export function HomeQuestionsScene() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const selectionDirectionRef = useRef<SelectionDirection>("forward");
  const lensDirectionRef = useRef<SelectionDirection>("forward");
  const displayedIndexRef = useRef(0);
  const [committedIndex, setCommittedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [carriedSituation, setCarriedSituation] = useState<ServicesSituationId | null>(null);
  const [carriedLens, setCarriedLens] = useState<HomeStudioLens | null>(null);
  const decisions = useMemo(
    () => QUESTIONS.map((item) => ({
      ...item,
      answer: faqs.find((faq) => faq.question === item.question)?.answer ?? "",
    })),
    [],
  );
  const activeIndex = previewIndex ?? committedIndex;
  displayedIndexRef.current = activeIndex;
  const isPreviewing = previewIndex !== null && previewIndex !== committedIndex;
  const active = decisions[activeIndex] ?? decisions[0];
  const matchedToSituation = carriedSituation !== null && SITUATION_TO_QUESTION[carriedSituation] === activeIndex;
  const lensReading = carriedLens
    ? LENS_READINGS[carriedLens.name][active.id]
    : null;
  const sceneStyle = {
    "--question-progress": (activeIndex + 1) / decisions.length,
    "--question-lens-accent": carriedLens?.accent ?? "#9e672b",
  } as CSSProperties;

  useEffect(() => {
    function applySituation(value: string | null, resetDecisionThread = false) {
      if (!isServicesSituation(value)) return;
      setCarriedSituation(value);
      setCommittedIndex(SITUATION_TO_QUESTION[value]);
      setPreviewIndex(null);
      if (resetDecisionThread) {
        publishHomeQuestionChoice(null);
        clearHomeStudioLens();
      }
    }

    try {
      const completedDiagnosis = readCompletedHomeDiagnosis();
      if (completedDiagnosis) applySituation(completedDiagnosis);
      else applySituation(window.localStorage.getItem(SERVICES_SITUATION_STORAGE_KEY));
    } catch {}

    function onSituation(event: Event) {
      const detail = (event as CustomEvent<ServicesSituationDetail>).detail;
      applySituation(detail?.situation ?? null, true);
    }

    function onSituationCleared() {
      setCarriedSituation(null);
      setCommittedIndex(0);
      setPreviewIndex(null);
      publishHomeQuestionChoice(null);
      clearHomeStudioLens();
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

  useEffect(() => {
    setCarriedLens(readHomeStudioLens());

    function onStudioLens(event: Event) {
      const detail = (event as CustomEvent<HomeStudioLensDetail>).detail;
      setCarriedLens(detail?.lens ?? null);
      publishHomeQuestionChoice(null);
    }

    function onMethodDecision(event: Event) {
      const detail = (event as CustomEvent<HomeMethodDecisionDetail>).detail;
      if (detail?.decision?.origin !== "method_selection") return;
      setCarriedLens(null);
      clearHomeStudioLens();
      publishHomeQuestionChoice(null);
    }

    window.addEventListener(HOME_STUDIO_LENS_EVENT, onStudioLens as EventListener);
    window.addEventListener(HOME_METHOD_DECISION_EVENT, onMethodDecision as EventListener);
    return () => {
      window.removeEventListener(HOME_STUDIO_LENS_EVENT, onStudioLens as EventListener);
      window.removeEventListener(HOME_METHOD_DECISION_EVENT, onMethodDecision as EventListener);
    };
  }, []);

  function rememberSelectionDirection(
    next: number,
    direction?: SelectionDirection,
  ) {
    const current = displayedIndexRef.current;
    if (next === current) return;
    selectionDirectionRef.current = direction ?? (next > current ? "forward" : "backward");
    displayedIndexRef.current = next;
  }

  function choose(
    index: number,
    persist = true,
    measure = false,
    direction?: SelectionDirection,
  ) {
    rememberSelectionDirection(index, direction);
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
    publishHomeQuestionChoice(
      toQuestionChoice(decisions[index] ?? decisions[0], carriedLens),
    );
  }

  function clearPreview() {
    rememberSelectionDirection(committedIndex);
    setPreviewIndex(null);
  }

  function chooseLens(
    lens: HomeStudioLens,
    direction?: SelectionDirection,
  ) {
    const currentIndex = carriedLens
      ? HOME_STUDIO_LENSES.findIndex((option) => option.name === carriedLens.name)
      : -1;
    const nextIndex = HOME_STUDIO_LENSES.findIndex((option) => option.name === lens.name);
    if (nextIndex !== currentIndex) {
      lensDirectionRef.current = direction ?? (
        currentIndex < 0 || nextIndex > currentIndex ? "forward" : "backward"
      );
    }
    setCarriedLens(lens);
    publishHomeStudioLens(lens);
    publishHomeQuestionChoice(
      toQuestionChoice(decisions[committedIndex] ?? decisions[0], lens),
    );
  }

  function carryQuestionForward() {
    const selected = decisions[activeIndex] ?? decisions[0];
    setCommittedIndex(activeIndex);
    setPreviewIndex(null);
    publishHomeQuestionChoice(toQuestionChoice(selected, carriedLens));
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % decisions.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + decisions.length - 1) % decisions.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = decisions.length - 1;
    else return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? "forward"
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? "backward"
        : undefined;
    choose(next, true, true, direction);
    document.getElementById(`decision-question-${next}`)?.focus();
  }

  function onLensKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % HOME_STUDIO_LENSES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + HOME_STUDIO_LENSES.length - 1) % HOME_STUDIO_LENSES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = HOME_STUDIO_LENSES.length - 1;
    else return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? "forward"
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? "backward"
        : undefined;
    const nextLens = HOME_STUDIO_LENSES[next];
    if (!nextLens) return;
    chooseLens(nextLens, direction);
    document.getElementById(`question-lens-${next}`)?.focus();
  }

  return (
    <section
      className="questions-editorial"
      aria-labelledby="home-questions-title"
      data-question-state={active.id}
      data-question-preview={isPreviewing ? active.id : undefined}
      data-question-lens={carriedLens?.name.toLowerCase()}
      style={sceneStyle}
    >
      <BackgroundVideo
        video="/videos/pixabay-golden-reeds-wind.mp4"
        poster="/images/pixabay-golden-reeds-wind-poster.jpg"
        playbackRate={0.78}
        managedByHomepage
      />
      <div className="questions-editorial__veil" aria-hidden="true" />

      <Container className="questions-editorial__frame max-w-[104rem]" data-home-frame>
        <header className="questions-editorial__header">
          <div>
            <p>
              08 · Before we work together
              {carriedSituation ? ` · ${SITUATION_LABEL[carriedSituation]}` : ""}
              {carriedLens ? ` · ${carriedLens.name} lens` : ""}
            </p>
            <h2 id="home-questions-title">Questions founders usually ask.<br /><em>Answers without a sales script.</em></h2>
          </div>
          <p className="questions-editorial__intro">Scope, timing, delivery, and fit, stated before you book anything.</p>
        </header>

        <div className="questions-editorial__experience">
          <div
            className="questions-editorial__choices"
            role="tablist"
            aria-label="Choose a practical question"
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") clearPreview();
            }}
          >
            <p className="questions-editorial__instruction">Choose what you need to know</p>
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
                  <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <AnimatePresence
            mode="sync"
            initial={false}
            custom={selectionDirectionRef.current}
          >
            <motion.article
              key={active.id}
              id="decision-answer"
              role="tabpanel"
              aria-labelledby={`decision-question-${activeIndex}`}
              className="questions-editorial__answer"
              data-home-reading-plane
              data-home-selection-direction={selectionDirectionRef.current}
              custom={selectionDirectionRef.current}
              variants={QUESTION_ANSWER_VARIANTS}
              initial={reducedMotion ? false : "enter"}
              animate="active"
              exit={reducedMotion ? undefined : "exit"}
              transition={{ duration: reducedMotion ? 0 : 0.45, ease: EASE }}
              aria-live={isPreviewing ? "off" : "polite"}
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

              <div className="questions-editorial__lens-reader">
                <div className="questions-editorial__lens-toolbar">
                  <span>Read this answer through</span>
                  <div role="group" aria-label="Read the answer through a studio lens">
                    {HOME_STUDIO_LENSES.map((lens, index) => {
                      const selected = lens.name === carriedLens?.name;
                      return (
                        <button
                          key={lens.name}
                          id={`question-lens-${index}`}
                          type="button"
                          aria-pressed={selected}
                          data-lens-selected={selected ? "true" : undefined}
                          style={{ "--lens-choice-accent": lens.accent } as CSSProperties}
                          onClick={() => chooseLens(lens)}
                          onKeyDown={(event) => onLensKeyDown(event, index)}
                        >
                          {lens.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence
                  mode="sync"
                  initial={false}
                  custom={lensDirectionRef.current}
                >
                  <motion.div
                    key={carriedLens ? `${carriedLens.name}-${active.id}` : `open-${active.id}`}
                    className="questions-editorial__lens-reading"
                    data-home-selection-direction={lensDirectionRef.current}
                    custom={lensDirectionRef.current}
                    variants={LENS_READING_VARIANTS}
                    initial={reducedMotion ? false : "enter"}
                    animate="active"
                    exit={reducedMotion ? undefined : "exit"}
                    transition={{ duration: reducedMotion ? 0 : 0.32, ease: EASE }}
                  >
                    <small>
                      {carriedLens
                        ? `${carriedLens.name} asks · ${carriedLens.question}`
                        : "One answer · three useful readings"}
                    </small>
                    <strong>
                      {lensReading ?? "Choose a lens to expose the decision beneath the practical detail."}
                    </strong>
                  </motion.div>
                </AnimatePresence>
              </div>

              <Link
                href="#invitation"
                data-section-jump-yield="true"
                onClick={carryQuestionForward}
                aria-label={`Bring the ${active.label.toLowerCase()} question to Suman`}
              >
                Bring this {active.label.toLowerCase()} question to Suman
                <ArrowDown size={16} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </motion.article>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
