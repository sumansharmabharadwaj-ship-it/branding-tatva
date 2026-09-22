"use client";

import { useHydratedMotionPreference } from "@/hooks/useHydratedReducedMotion";
import {
  clearServicesSituation,
  publishCompletedHomeDiagnosis,
  servicesContactHrefForSituation,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import {
  homeDiagnosticReducer,
  canReviewHomeDiagnosticStep,
  initialHomeDiagnosticState,
  resolveCompletedHomeDiagnosis,
  type HomeDiagnosis,
} from "@/lib/homeDiagnosticState";
import { track, trackRuntimeIssue } from "@/lib/analytics";
import { motion, useAnimationControls, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useReducer, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";
import journeyStyles from "./DiagnosticJourney.module.css";

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
        label: "The team makes brand decisions from shared rules.",
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
    nextAction: "Follow the evidence to the Foundation engagement",
  },
  coherence: {
    title: "The brand depends too much on your personal approval.",
    detail:
      "Useful pieces already exist, but people are relying on memory and taste to keep them aligned across the website, content, and campaigns.",
    signal: "Turn your judgement into usable rules",
    situation: "reposition",
    nextAction: "Follow the evidence to the Full Brand System",
  },
  demand: {
    title: "Marketing is carrying a weak reason to choose.",
    detail:
      "The business is visible, yet buyers reach the sales conversation still comparing price. The message and evidence need to establish a reason to prefer it.",
    signal: "Put proof behind a sharper position",
    situation: "ongoing",
    nextAction: "Follow the evidence to the Brand Partnership",
  },
  mixed: {
    title: "The business has outgrown the brand representing it.",
    detail:
      "Positioning, expression, and proof are pulling in different directions. Pushing any single channel harder will make the mismatch more visible.",
    signal: "Diagnose the whole brand before rebuilding a part",
    nextAction: "Follow the evidence, then compare the engagements",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;
const QUESTION_NAMES = ["Cost", "Approvals", "Change"] as const;
const EMPTY_CHOICE_CUE = "The statement closest to your business.";
const CHOICE_CUES = [EMPTY_CHOICE_CUE, ...QUESTIONS.flatMap((question) => question.choices.map((choice) => choice.centre))];

const DIAGNOSTIC_SCENE_VARIANTS = {
  enter: (direction: DiagnosticDirection) => ({
    opacity: 1,
    x: direction === "forward" ? 8 : -8,
    y: 3,
  }),
  center: { opacity: 1, x: 0, y: 0 },
};

function revealDiagnosticReading(target: HTMLElement) {
  const bounds = target.getBoundingClientRect();
  const readingBottom = window.innerHeight - 80;
  const fits = bounds.height <= window.innerHeight - 160;
  // Keep an already visible question still. Long results align their opening,
  // rather than moving focus to their bottom or rewinding the whole chapter.
  if (bounds.top < 80 || (fits ? bounds.bottom > readingBottom : bounds.top > readingBottom)) {
    target.scrollIntoView({ behavior: "instant", block: fits ? "nearest" : "start", inline: "nearest" });
  }
}

export function HomeBrandHealthCheck() {
  const { hydrated, prefersReducedMotion } = useHydratedMotionPreference();
  const [keyboardReading, setKeyboardReading] = useState(false);
  const still = prefersReducedMotion || keyboardReading;
  const panelControls = useAnimationControls();
  const cueControls = useAnimationControls();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: .06 });
  const motionActive = hydrated && inView && !still;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const focusRequestedRef = useRef(false);
  const diagnosticDirectionRef = useRef<DiagnosticDirection>("forward");
  const orbitPointerFrameRef = useRef<number | null>(null);
  const orbitPointerMotionRef = useRef<{
    target: HTMLElement;
    clientX: number;
    clientY: number;
  } | null>(null);
  const [state, dispatch] = useReducer(homeDiagnosticReducer, initialHomeDiagnosticState);
  const { step, answers, selections, resultVisible, result: resolvedResult, preview } = state;
  const selected = selections[step] ?? null;
  const done = resultVisible;
  const active = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  const result = RESULTS[resolvedResult ?? "mixed"];
  const visualPreview = preview ?? selected;
  const allAnswered = resolveCompletedHomeDiagnosis(answers) !== null;
  const panelIdentity = done ? "result" : `question-${step}`;
  const previousPanel = useRef(panelIdentity);
  const previousChoice = useRef({ panelIdentity, selected });

  useEffect(() => {
    const changed = previousPanel.current !== panelIdentity;
    previousPanel.current = panelIdentity;
    panelControls.stop();
    panelControls.set("center");
    if (changed && motionActive) {
      panelControls.set(DIAGNOSTIC_SCENE_VARIANTS.enter(diagnosticDirectionRef.current));
      void panelControls.start("center", { duration: .4, ease: EASE });
    }
    return () => panelControls.stop();
  }, [motionActive, panelControls, panelIdentity]);

  useEffect(() => {
    const changed = previousChoice.current.panelIdentity === panelIdentity && previousChoice.current.selected !== selected;
    previousChoice.current = { panelIdentity, selected };
    cueControls.stop();
    cueControls.set({ y: 0 });
    // Only a fresh answer moves its implication. Pausing or returning to the
    // chapter settles the current words without replaying a past selection.
    if (changed && selected !== null && !done && motionActive) {
      cueControls.set({ y: 4 });
      void cueControls.start({ y: 0 }, { duration: .36, ease: EASE });
    }
    return () => cueControls.stop();
  }, [cueControls, done, motionActive, panelIdentity, selected]);

  useLayoutEffect(() => {
    if (!focusRequestedRef.current) return;
    focusRequestedRef.current = false;
    const section = sectionRef.current;
    const focusTarget = done ? resultRef.current : headingRef.current;
    if (!section || !focusTarget) {
      trackRuntimeIssue("diagnostic_transition_failed", { scene: "diagnostic" });
      return;
    }
    focusTarget.focus({ preventScroll: true });
    revealDiagnosticReading(focusTarget);
  }, [done, step]);

  useEffect(() => () => {
    if (orbitPointerFrameRef.current !== null) {
      window.cancelAnimationFrame(orbitPointerFrameRef.current);
    }
  }, []);

  useEffect(() => {
    if (motionActive) return;
    orbitPointerMotionRef.current = null;
    if (orbitPointerFrameRef.current !== null) {
      window.cancelAnimationFrame(orbitPointerFrameRef.current);
      orbitPointerFrameRef.current = null;
    }
    sectionRef.current?.style.removeProperty("--orbit-pointer-x");
    sectionRef.current?.style.removeProperty("--orbit-pointer-y");
  }, [motionActive]);

  function moveScene(event: PointerEvent<HTMLElement>) {
    if (!motionActive || event.pointerType !== "mouse") return;
    orbitPointerMotionRef.current = { target: event.currentTarget, clientX: event.clientX, clientY: event.clientY };
    if (orbitPointerFrameRef.current !== null) return;
    orbitPointerFrameRef.current = window.requestAnimationFrame(() => {
      orbitPointerFrameRef.current = null;
      const motion = orbitPointerMotionRef.current;
      if (!motion) return;
      // Read once per frame, after any intervening scroll or content resize.
      const bounds = motion.target.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = Math.max(-1, Math.min(1, ((motion.clientX - bounds.left) / bounds.width - .5) * 2));
      const y = Math.max(-1, Math.min(1, ((motion.clientY - bounds.top) / bounds.height - .5) * 2));
      motion.target.style.setProperty("--orbit-pointer-x", x.toFixed(3));
      motion.target.style.setProperty("--orbit-pointer-y", y.toFixed(3));
    });
  }

  function resetScene(event: PointerEvent<HTMLElement>) {
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
    if (!motionActive || event.pointerType !== "mouse") return;
    dispatch({ type: "preview", selection: index });
  }

  function moveChoiceFocus(
    event: KeyboardEvent<HTMLButtonElement>,
    nextIndex: number,
  ) {
    const group = event.currentTarget.closest('[role="radiogroup"]');
    const options = group?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    const option = options?.[nextIndex];
    if (!option) return;
    option.focus({ preventScroll: true });
    revealDiagnosticReading(option);
    choose(active.choices[nextIndex], nextIndex);
  }

  function continueDiagnostic() {
    if (selected === null) return;

    if (!allAnswered && step < QUESTIONS.length - 1) {
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

  function reviewAnswers(targetStep?: number) {
    if (targetStep !== undefined && (!canReviewHomeDiagnosticStep(state, targetStep) || (!done && targetStep === step))) return;
    clearServicesSituation();
    diagnosticDirectionRef.current = "backward";
    if (!done && targetStep !== undefined && targetStep > step) diagnosticDirectionRef.current = "forward";
    focusRequestedRef.current = true;
    dispatch({ type: "review", step: targetStep });
  }

  function revealReading(event: FocusEvent<HTMLElement>) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(":focus-visible")) return;
    setKeyboardReading(true);
    panelControls.stop();
    panelControls.set("center");
    cueControls.stop();
    cueControls.set({ y: 0 });
    revealDiagnosticReading(target);
  }

  function onChoiceKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.nativeEvent.isComposing) return;
    let nextIndex: number;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % active.choices.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index + active.choices.length - 1) % active.choices.length;
    } else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = active.choices.length - 1;
    else return;
    event.preventDefault();
    moveChoiceFocus(event, nextIndex);
  }

  return (
    <section
      ref={sectionRef}
      id="brand-diagnostic"
      className={`brand-orbit ${journeyStyles.scene}`}
      data-diagnostic-still={!motionActive}
      data-home-v4-chapter="diagnostic"
      data-home-chapter="diagnostic"
      data-home-section="diagnostic"
      data-cursor-world="light"
      data-preview={visualPreview === null ? "idle" : String(visualPreview)}
      data-diagnostic-state={done ? "complete" : selected === null ? "choosing" : "ready"}
      data-diagnostic-panel={done ? "result" : `question-${step + 1}`}
      aria-labelledby="brand-orbit-title"
      onFocusCapture={revealReading}
      onKeyDownCapture={() => setKeyboardReading(true)}
      onPointerDownCapture={() => setKeyboardReading(false)}
      onClickCapture={(event) => { if (event.detail === 0) setKeyboardReading(true); }}
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
        <header className={`brand-orbit__header ${journeyStyles.header}`}>
          <h2 id="brand-orbit-title">
            Brand diagnostic
            <span>3 questions · Where to begin</span>
          </h2>
          <div
            className={done ? "brand-orbit__progress" : "sr-only"}
            role="progressbar"
            aria-label="Brand diagnostic progress"
            aria-valuemin={1}
            aria-valuemax={QUESTIONS.length}
            aria-valuenow={done ? QUESTIONS.length : step + 1}
            aria-valuetext={done ? "Complete" : `Question ${step + 1} of ${QUESTIONS.length}`}
          >
            <strong>
              <span className="brand-orbit__progress-label">{done ? "Complete" : "Question"}</span>
              <span className="brand-orbit__progress-count">
                {String(done ? QUESTIONS.length : step + 1).padStart(2, "0")} / 03
              </span>
            </strong>
            <span><i style={{ transform: `scaleX(${done ? 1 : (step + 1) / QUESTIONS.length})` }} /></span>
          </div>
          {!done ? (
            <nav className={journeyStyles.trail} aria-label="Brand diagnostic questions">
              <ol>
                {QUESTIONS.map((question, index) => {
                  const answer = selections[index];
                  const choice = answer === null ? null : question.choices[answer];
                  return (
                    <li key={question.prompt}>
                      <button
                        type="button"
                        disabled={!canReviewHomeDiagnosticStep(state, index)}
                        aria-current={index === step ? "step" : undefined}
                        aria-label={`Question ${index + 1}: ${question.prompt}${choice ? ` Your answer: ${choice.label}` : ""}`}
                        aria-controls="brand-orbit-question-panel"
                        data-answered={choice !== null}
                        onClick={() => reviewAnswers(index)}
                        data-cursor-label="revisit"
                      >
                        <span aria-hidden="true">0{index + 1}</span>
                        <strong>{QUESTION_NAMES[index]}</strong>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          ) : null}
        </header>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {done ? result.title : `Question ${step + 1} of ${QUESTIONS.length}. ${active.prompt}`}
        </p>

        {done ? (
            <motion.div
              ref={resultRef}
              key="result"
              className="brand-orbit__result"
              data-home-reading-plane
              data-diagnostic-active-panel="true"
              role="region"
              aria-labelledby="brand-orbit-result-title"
              tabIndex={-1}
              data-home-selection-direction={diagnosticDirectionRef.current}
              custom={diagnosticDirectionRef.current}
              variants={DIAGNOSTIC_SCENE_VARIANTS}
              initial={false}
              animate={panelControls}
            >
              <div className="brand-orbit__result-copy">
                <p>Your answers point toward</p>
                <h3 id="brand-orbit-result-title">{result.title}</h3>
                <span>{result.detail}</span>
                {/* The diagnosis quotes its own symptoms: the three chosen
                    signals return as chips, and each one reopens exactly its
                    question, so changing one answer costs one step instead of
                    walking the whole sequence backward. */}
                <ul className="brand-orbit__result-trace" aria-label="Your three answers, each one reopens its question">
                  {QUESTIONS.map((question, index) => {
                    const selection = selections[index];
                    const choice = selection === null ? null : question.choices[selection];
                    if (!choice) return null;
                    return (
                      <li key={question.prompt}>
                        <button
                          type="button"
                          onClick={() => reviewAnswers(index)}
                          data-cursor-label="Change this"
                          aria-label={`Question ${index + 1}, you chose: ${choice.label} Change this answer.`}
                        >
                          <span aria-hidden="true">0{index + 1}</span>
                          {choice.shortLabel}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="brand-orbit__result-action">
                <span>The strategic centre</span>
                <strong>{result.signal}</strong>
                <Link
                  href="#evidence"
                  prefetch={false}
                  className="brand-orbit__result-primary"
                  data-section-jump-yield="true"
                >
                  {result.nextAction} <i aria-hidden="true">→</i>
                </Link>
                <Link
                  href={servicesContactHrefForSituation(result.situation, "call")}
                  prefetch={false}
                  className="brand-orbit__result-secondary"
                >
                  Discuss this diagnosis <i aria-hidden="true">→</i>
                </Link>
                <button type="button" onClick={() => reviewAnswers()}>Change an answer</button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              id="brand-orbit-question-panel"
              key={`question-${step}`}
              className="brand-orbit__question"
              data-home-reading-plane
              data-diagnostic-active-panel="true"
              data-home-selection-direction={diagnosticDirectionRef.current}
              custom={diagnosticDirectionRef.current}
              variants={DIAGNOSTIC_SCENE_VARIANTS}
              initial={false}
              animate={panelControls}
            >
              <div className="brand-orbit__prompt">
                <p>{active.eyebrow}</p>
                <h3 ref={headingRef} tabIndex={-1}>{active.prompt}</h3>
                {step > 0 ? <button type="button" onClick={back}>Back one question</button> : null}
              </div>

              <div className="brand-orbit__decision">
                <fieldset className="brand-orbit__choices" role="radiogroup" aria-describedby={`brand-orbit-cue-${step}`}>
                  <legend className="sr-only">{active.prompt}</legend>
                  {active.choices.map((choice, index) => (
                    <button
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
                      data-cursor-label={choice.shortLabel}
                      tabIndex={selected === index || (selected === null && index === 0) ? 0 : -1}
                      onKeyDown={(event) => onChoiceKeyDown(event, index)}
                    >
                      <span className="brand-orbit__choice-number">0{index + 1}</span>
                      <strong>{choice.label}</strong>
                      <span className="brand-orbit__choice-short" aria-hidden="true">{choice.shortLabel}</span>
                      <span className="brand-orbit__choice-action" aria-hidden="true">
                        {selected === index ? "Selected" : "Choose this"}
                      </span>
                    </button>
                  ))}
                </fieldset>

                <div className="brand-orbit__choice-cue" id={`brand-orbit-cue-${step}`}>
                  <p aria-live="polite" aria-atomic="true">
                    <span>{selected === null ? "Choose one" : "This points toward"}</span>
                    <span className={journeyStyles.cueCopy}>
                      <motion.b initial={false} animate={cueControls}>
                        {selected === null ? EMPTY_CHOICE_CUE : active.choices[selected].centre}
                      </motion.b>
                      <span className={journeyStyles.cueMeasure} aria-hidden="true" inert>
                        {CHOICE_CUES.map((cue) => <span key={cue}>{cue}</span>)}
                      </span>
                    </span>
                  </p>
                  <button
                    type="button"
                    className="brand-orbit__continue"
                    onClick={continueDiagnostic}
                    disabled={selected === null}
                  >
                    {allAnswered ? "See my result" : "Next question"}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
      </div>
    </section>
  );
}
