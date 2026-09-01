"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  clearServicesSituation,
  publishCompletedHomeDiagnosis,
  servicesContactHrefForSituation,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import {
  homeDiagnosticReducer,
  initialHomeDiagnosticState,
  resolveCompletedHomeDiagnosis,
  type HomeDiagnosis,
} from "@/lib/homeDiagnosticState";
import { track, trackRuntimeIssue } from "@/lib/analytics";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useReducer, useRef, type KeyboardEvent, type PointerEvent } from "react";

type Diagnosis = HomeDiagnosis;
type ResultDiagnosis = HomeDiagnosis | "mixed";
type DiagnosticDirection = "forward" | "backward";

type Choice = {
  label: string;
  shortLabel: string;
  diagnosis: Diagnosis;
  centre: string;
};

type Question = {
  eyebrow: string;
  prompt: string;
  choices: readonly [Choice, Choice, Choice];
};

const QUESTIONS: readonly Question[] = [
  {
    eyebrow: "Begin with the cost",
    prompt: "Where is the brand making the business work harder?",
    choices: [
      {
        label: "Prospects understand the offer only after I explain it.",
        shortLabel: "Late understanding",
        diagnosis: "recognition",
        centre: "Move the reason to choose into the first encounter.",
      },
      {
        label: "The website, content, and identity feel like different businesses.",
        shortLabel: "Brand drift",
        diagnosis: "coherence",
        centre: "Give every channel the same governing choices.",
      },
      {
        label: "We keep marketing, but buyers still compare us mainly on price.",
        shortLabel: "Price pressure",
        diagnosis: "demand",
        centre: "Make the difference visible before the sales call.",
      },
    ],
  },
  {
    eyebrow: "Notice what returns to your desk",
    prompt: "Which task keeps asking for your approval?",
    choices: [
      {
        label: "Rewriting what makes us different.",
        shortLabel: "Difference",
        diagnosis: "recognition",
        centre: "Choose the comparison the brand can win.",
      },
      {
        label: "Correcting tone, design, and content.",
        shortLabel: "Approval",
        diagnosis: "coherence",
        centre: "Replace repeated correction with written rules.",
      },
      {
        label: "Starting each campaign without proof or a point of view.",
        shortLabel: "Proof",
        diagnosis: "demand",
        centre: "Put evidence beside the claim it must support.",
      },
    ],
  },
  {
    eyebrow: "Name the result worth noticing",
    prompt: "What should be different within 90 days?",
    choices: [
      {
        label: "Buyers repeat our value in their own words.",
        shortLabel: "Recall",
        diagnosis: "recognition",
        centre: "Make the position easy to repeat.",
      },
      {
        label: "The team knows what belongs and what does not.",
        shortLabel: "Judgement",
        diagnosis: "coherence",
        centre: "Write the rules behind the brand choices.",
      },
      {
        label: "The website and content make the sales call easier.",
        shortLabel: "Preference",
        diagnosis: "demand",
        centre: "Let proof answer doubt before the meeting.",
      },
    ],
  },
] as const;

const RESULTS: Record<
  ResultDiagnosis,
  {
    title: string;
    detail: string;
    signal: string;
    situation?: ServicesSituationId;
    nextAction: string;
  }
> = {
  recognition: {
    title: "Your value is arriving too late.",
    detail:
      "The offer becomes persuasive in conversation, but the website and content are asking buyers to do too much interpretation first.",
    signal: "Move the reason to choose forward",
    situation: "idea",
    nextAction: "See the evidence, then the Foundation engagement",
  },
  coherence: {
    title: "The brand depends too much on your personal approval.",
    detail:
      "Useful pieces already exist, but people are relying on memory and taste to keep them aligned across the website, content, and campaigns.",
    signal: "Turn your judgement into usable rules",
    situation: "reposition",
    nextAction: "See the evidence, then the Full Brand System",
  },
  demand: {
    title: "Marketing is carrying a weak reason to choose.",
    detail:
      "The business is visible, yet the message and evidence are not giving buyers enough reason to prefer it before the sales conversation.",
    signal: "Put proof behind a sharper position",
    situation: "ongoing",
    nextAction: "See the evidence, then the Brand Partnership",
  },
  mixed: {
    title: "The business has outgrown the brand representing it.",
    detail:
      "Positioning, expression, and proof are pulling in different directions. Pushing any single channel harder will make the mismatch more visible.",
    signal: "Diagnose the whole brand before rebuilding a part",
    nextAction: "See the evidence, then compare the engagements",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

const DIAGNOSTIC_SCENE_VARIANTS = {
  enter: (direction: DiagnosticDirection) => ({
    opacity: 0,
    x: direction === "forward" ? 18 : -18,
    y: 6,
    filter: "blur(4px)",
  }),
  center: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
  exit: (direction: DiagnosticDirection) => ({
    opacity: 0,
    x: direction === "forward" ? -12 : 12,
    y: -4,
    filter: "blur(3px)",
  }),
};

export function HomeBrandHealthCheck() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const focusRequestedRef = useRef(false);
  const diagnosticDirectionRef = useRef<DiagnosticDirection>("forward");
  const orbitPointerBoundsRef = useRef<DOMRect | null>(null);
  const orbitPointerFrameRef = useRef<number | null>(null);
  const orbitPointerMotionRef = useRef<{
    target: HTMLElement;
    x: number;
    y: number;
  } | null>(null);
  const [state, dispatch] = useReducer(homeDiagnosticReducer, initialHomeDiagnosticState);
  const { step, answers, selections, resultVisible, result: resolvedResult, preview } = state;
  const selected = selections[step] ?? null;
  const done = resultVisible;
  const active = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  const result = RESULTS[resolvedResult ?? "mixed"];
  const visualPreview = preview ?? selected;

  useEffect(() => {
    if (!focusRequestedRef.current) return;
    focusRequestedRef.current = false;
    if (done) {
      const resultPanel = resultRef.current;
      if (!resultPanel) {
        trackRuntimeIssue("diagnostic_transition_failed", { scene: "diagnostic" });
        return;
      }
      resultPanel.focus({ preventScroll: true });
      return;
    }
    const heading = headingRef.current;
    if (!heading) {
      trackRuntimeIssue("diagnostic_transition_failed", { scene: "diagnostic" });
      return;
    }
    heading.focus({ preventScroll: true });
  }, [done, step]);

  useEffect(() => () => {
    if (orbitPointerFrameRef.current !== null) {
      window.cancelAnimationFrame(orbitPointerFrameRef.current);
    }
  }, []);

  function prepareScene(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    orbitPointerBoundsRef.current = event.currentTarget.getBoundingClientRect();
  }

  function moveScene(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const target = event.currentTarget;
    const bounds = orbitPointerBoundsRef.current ?? target.getBoundingClientRect();
    orbitPointerBoundsRef.current = bounds;
    if (!bounds.width || !bounds.height) return;
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    orbitPointerMotionRef.current = { target, x, y };
    if (orbitPointerFrameRef.current !== null) return;
    orbitPointerFrameRef.current = window.requestAnimationFrame(() => {
      orbitPointerFrameRef.current = null;
      const motion = orbitPointerMotionRef.current;
      if (!motion) return;
      motion.target.style.setProperty("--orbit-pointer-x", motion.x.toFixed(3));
      motion.target.style.setProperty("--orbit-pointer-y", motion.y.toFixed(3));
    });
  }

  function resetScene(event: PointerEvent<HTMLElement>) {
    orbitPointerBoundsRef.current = null;
    orbitPointerMotionRef.current = null;
    if (orbitPointerFrameRef.current !== null) {
      window.cancelAnimationFrame(orbitPointerFrameRef.current);
      orbitPointerFrameRef.current = null;
    }
    event.currentTarget.style.removeProperty("--orbit-pointer-x");
    event.currentTarget.style.removeProperty("--orbit-pointer-y");
  }

  function choose(choice: Choice, index: number) {
    if (done) return;
    if (answers.every((answer) => answer === null)) {
      track("health_check_started", { source: "home" });
    }
    dispatch({ type: "choose", step, answer: choice.diagnosis, selection: index });
  }

  function previewChoice(event: PointerEvent<HTMLButtonElement>, index: number | null) {
    if (event.pointerType !== "mouse") return;
    dispatch({ type: "preview", selection: index });
  }

  function moveChoiceFocus(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    direction: 1 | -1,
  ) {
    const nextIndex = (index + direction + active.choices.length) % active.choices.length;
    const group = event.currentTarget.closest('[role="radiogroup"]');
    const options = group?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    options?.[nextIndex]?.focus({ preventScroll: true });
    choose(active.choices[nextIndex], nextIndex);
  }

  function continueDiagnostic() {
    if (selected === null) return;

    if (step < QUESTIONS.length - 1) {
      diagnosticDirectionRef.current = "forward";
      focusRequestedRef.current = true;
      dispatch({ type: "continue" });
      return;
    }

    const committedAnswers = [...answers];
    const nextDiagnosis = resolveCompletedHomeDiagnosis(committedAnswers);
    if (!nextDiagnosis) {
      trackRuntimeIssue("diagnostic_transition_failed", { scene: "diagnostic" });
      return;
    }
    const nextResult = RESULTS[nextDiagnosis];
    if (nextResult.situation) publishCompletedHomeDiagnosis(nextResult.situation);
    else clearServicesSituation();
    track("health_check_completed", {
      source: "home",
      result: nextDiagnosis,
      diagnosis: nextDiagnosis,
    });
    diagnosticDirectionRef.current = "forward";
    focusRequestedRef.current = true;
    dispatch({ type: "complete", answers: committedAnswers });
  }

  function back() {
    if (step === 0) return;
    diagnosticDirectionRef.current = "backward";
    focusRequestedRef.current = true;
    dispatch({ type: "back" });
  }

  function reviewAnswers() {
    clearServicesSituation();
    diagnosticDirectionRef.current = "backward";
    focusRequestedRef.current = true;
    dispatch({ type: "review" });
  }

  function onChoiceKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveChoiceFocus(event, index, 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveChoiceFocus(event, index, -1);
    } else if (event.key === "Tab" && !event.shiftKey && selected !== null) {
      event.preventDefault();
      document.querySelector<HTMLButtonElement>(".brand-orbit__continue")?.focus();
    }
  }

  return (
    <section
      ref={sectionRef}
      id="brand-diagnostic"
      className="brand-orbit"
      data-home-v4-chapter="diagnostic"
      data-home-chapter="diagnostic"
      data-home-section="diagnostic"
      data-cursor-world="light"
      data-preview={visualPreview === null ? "idle" : String(visualPreview)}
      data-diagnostic-state={done ? "complete" : selected === null ? "choosing" : "ready"}
      aria-labelledby="brand-orbit-title"
      onPointerEnter={prepareScene}
      onPointerMove={moveScene}
      onPointerLeave={resetScene}
      onPointerCancel={resetScene}
    >
      <div className="brand-orbit__landscape" aria-hidden="true">
        <Image
          className="brand-orbit__plate"
          src="/images/generated/bt-home-brand-diagnostic-flowerwater-v1.png"
          alt=""
          fill
          sizes="100vw"
        />
        <div className="brand-orbit__petals">
          <Image
            className="brand-orbit__petal brand-orbit__petal--one"
            src="/images/generated/bt-home-brand-diagnostic-petal-v1.png"
            alt=""
            width={270}
            height={180}
          />
          <Image
            className="brand-orbit__petal brand-orbit__petal--two"
            src="/images/generated/bt-home-brand-diagnostic-petal-v1.png"
            alt=""
            width={180}
            height={120}
          />
          <Image
            className="brand-orbit__petal brand-orbit__petal--three"
            src="/images/generated/bt-home-brand-diagnostic-petal-v1.png"
            alt=""
            width={130}
            height={87}
          />
        </div>
      </div>
      <div className="brand-orbit__veil" aria-hidden="true" />

      <div className="brand-orbit__shell" data-home-frame>
        <header className="brand-orbit__header">
          <h2 id="brand-orbit-title">
            02 · Brand diagnostic
            <span>3 choices · about 30 seconds · instant direction</span>
          </h2>
          <div
            className="brand-orbit__progress"
            role="progressbar"
            aria-label="Brand diagnostic progress"
            aria-valuemin={1}
            aria-valuemax={QUESTIONS.length}
            aria-valuenow={done ? QUESTIONS.length : step + 1}
            aria-valuetext={done ? "Complete" : `Question ${step + 1} of ${QUESTIONS.length}`}
          >
            <strong>
              <span>Question</span>
              {String(Math.min(step + 1, QUESTIONS.length)).padStart(2, "0")} / 03
            </strong>
            <span><i style={{ transform: `scaleX(${done ? 1 : (step + 1) / QUESTIONS.length})` }} /></span>
          </div>
        </header>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {done ? result.title : `Question ${step + 1} of ${QUESTIONS.length}. ${active.prompt}`}
        </p>

        <AnimatePresence
          mode="sync"
          initial={false}
          custom={diagnosticDirectionRef.current}
        >
          {done ? (
            <motion.div
              ref={resultRef}
              key="result"
              className="brand-orbit__result"
              data-home-reading-plane
              role="region"
              aria-labelledby="brand-orbit-result-title"
              tabIndex={-1}
              data-home-selection-direction={diagnosticDirectionRef.current}
              custom={diagnosticDirectionRef.current}
              variants={DIAGNOSTIC_SCENE_VARIANTS}
              initial={reducedMotion ? false : "enter"}
              animate="center"
              exit={reducedMotion ? undefined : "exit"}
              transition={{ duration: reducedMotion ? 0 : 0.7, ease: EASE }}
            >
              <div className="brand-orbit__result-copy">
                <p>Your answers point toward</p>
                <h3 id="brand-orbit-result-title">{result.title}</h3>
                <span>{result.detail}</span>
              </div>

              <div className="brand-orbit__result-action">
                <span>The strategic centre</span>
                <strong>{result.signal}</strong>
                <Link
                  href="#evidence"
                  className="brand-orbit__result-primary"
                  data-section-jump-yield="true"
                >
                  {result.nextAction} <i aria-hidden="true">→</i>
                </Link>
                <Link
                  href={servicesContactHrefForSituation(result.situation, "call")}
                  className="brand-orbit__result-secondary"
                >
                  Discuss this diagnosis <i aria-hidden="true">→</i>
                </Link>
                <button type="button" onClick={reviewAnswers}>Change an answer</button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={active.prompt}
              className="brand-orbit__question"
              data-home-reading-plane
              data-home-selection-direction={diagnosticDirectionRef.current}
              custom={diagnosticDirectionRef.current}
              variants={DIAGNOSTIC_SCENE_VARIANTS}
              initial={reducedMotion ? false : "enter"}
              animate="center"
              exit={reducedMotion ? undefined : "exit"}
              transition={{ duration: reducedMotion ? 0 : 0.58, ease: EASE }}
            >
              <div className="brand-orbit__prompt">
                <p>{active.eyebrow}</p>
                <h3 ref={headingRef} tabIndex={-1}>{active.prompt}</h3>
                {step > 0 ? <button type="button" onClick={back}>Back one question</button> : null}
              </div>

              <div className="brand-orbit__decision">
                <div className="brand-orbit__choice-cue" id={`brand-orbit-cue-${step}`}>
                  <p aria-live="polite" aria-atomic="true">
                    <span>{selected === null ? "Choose one" : "This points toward"}</span>
                    <b>
                      {selected === null
                        ? "The statement closest to where the friction lives."
                        : active.choices[selected].centre}
                    </b>
                  </p>
                  <button
                    type="button"
                    className="brand-orbit__continue"
                    onClick={continueDiagnostic}
                    disabled={selected === null}
                  >
                    {step === QUESTIONS.length - 1 ? "See my result" : "Next question"}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>

                <fieldset className="brand-orbit__choices" role="radiogroup" aria-describedby={`brand-orbit-cue-${step}`}>
                  <legend className="sr-only">{active.prompt}</legend>
                  {active.choices.map((choice, index) => (
                    <motion.button
                      key={choice.label}
                      type="button"
                      className={selected === index ? "is-selected" : undefined}
                      onClick={() => choose(choice, index)}
                      onPointerEnter={(event) => previewChoice(event, index)}
                      onPointerLeave={(event) => previewChoice(event, null)}
                      onFocus={() => dispatch({ type: "preview", selection: index })}
                      onBlur={() => dispatch({ type: "preview", selection: null })}
                      role="radio"
                      aria-checked={selected === index}
                      aria-label={`${String(index + 1).padStart(2, "0")} ${choice.label}`}
                      tabIndex={selected === index || (selected === null && index === 0) ? 0 : -1}
                      onKeyDown={(event) => onChoiceKeyDown(event, index)}
                      animate={{
                        opacity: 1,
                        scale: selected === index ? 0.985 : 1,
                      }}
                      transition={{ duration: reducedMotion ? 0 : 0.46, ease: EASE }}
                    >
                      <span className="brand-orbit__choice-number">0{index + 1}</span>
                      <strong>{choice.label}</strong>
                      <span className="brand-orbit__choice-short" aria-hidden="true">{choice.shortLabel}</span>
                      <span className="brand-orbit__choice-action" aria-hidden="true">
                        {selected === index ? "Selected" : "Choose this"}
                      </span>
                    </motion.button>
                  ))}
                </fieldset>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
