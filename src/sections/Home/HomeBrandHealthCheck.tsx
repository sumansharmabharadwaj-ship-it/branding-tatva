"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  clearServicesSituation,
  publishCompletedHomeDiagnosis,
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
    eyebrow: "Begin with the friction",
    prompt: "Where is your brand losing its shape?",
    choices: [
      {
        label: "The idea is clear. The market is not.",
        shortLabel: "Unclear",
        diagnosis: "recognition",
        centre: "Make the meaning easier to remember.",
      },
      {
        label: "The identity exists. The system does not.",
        shortLabel: "Unsystemised",
        diagnosis: "coherence",
        centre: "Give every expression one source.",
      },
      {
        label: "Marketing is moving without one direction.",
        shortLabel: "Undirected",
        diagnosis: "demand",
        centre: "Turn activity into a repeated signal.",
      },
    ],
  },
  {
    eyebrow: "Notice the recurring cost",
    prompt: "Which effort keeps starting again?",
    choices: [
      {
        label: "Explaining what makes us different.",
        shortLabel: "Difference",
        diagnosis: "recognition",
        centre: "Commit to the idea only you can carry.",
      },
      {
        label: "Approving every message and visual.",
        shortLabel: "Approval",
        diagnosis: "coherence",
        centre: "Replace personal taste with shared rules.",
      },
      {
        label: "Publishing without a clear proof path.",
        shortLabel: "Proof",
        diagnosis: "demand",
        centre: "Put evidence where buyer doubt forms.",
      },
    ],
  },
  {
    eyebrow: "Choose the next visible change",
    prompt: "What should become true in the next 90 days?",
    choices: [
      {
        label: "People remember us for one clear idea.",
        shortLabel: "Recall",
        diagnosis: "recognition",
        centre: "Build the position first.",
      },
      {
        label: "The team can create from one system.",
        shortLabel: "System",
        diagnosis: "coherence",
        centre: "Connect language, identity and behaviour.",
      },
      {
        label: "Proof creates preference before the call.",
        shortLabel: "Preference",
        diagnosis: "demand",
        centre: "Make the evidence carry the promise.",
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
    action: string;
    href: string;
  }
> = {
  recognition: {
    title: "Recognition needs a sharper centre.",
    detail:
      "The business has useful substance, while the market still has to work too hard to name what makes it different.",
    signal: "Position before expression",
    situation: "idea",
    action: "Explore the foundation path",
    href: "/services#desire",
  },
  coherence: {
    title: "Coherence needs one living system.",
    detail:
      "Good elements already exist. They need a shared logic that the website, team and marketing can use without reinterpretation.",
    signal: "One source for every expression",
    situation: "reposition",
    action: "Explore the repositioning path",
    href: "/services#situation",
  },
  demand: {
    title: "Demand needs proof with direction.",
    detail:
      "Visibility is present, while the evidence, message and repeated signals have yet to compound into preference.",
    signal: "Evidence that reinforces one promise",
    situation: "ongoing",
    action: "Explore the ongoing path",
    href: "/services#offerings",
  },
  mixed: {
    title: "Your answers point to a connected brand problem.",
    detail:
      "The friction is moving across positioning, expression and proof. The next decision needs to connect those parts before any one of them is pushed harder.",
    signal: "One joined-up diagnosis",
    action: "See the connected system",
    href: "/services#offerings",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function HomeBrandHealthCheck() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const landscapeVideoRef = useRef<HTMLVideoElement>(null);
  const choiceRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const focusRequestedRef = useRef(false);
  const pendingChoiceFocusRef = useRef<number | null>(null);
  const [state, dispatch] = useReducer(homeDiagnosticReducer, initialHomeDiagnosticState);
  const { step, answers, selections, resultVisible, result: resolvedResult, preview } = state;
  const selected = selections[step] ?? null;
  const done = resultVisible;
  const active = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  const result = RESULTS[resolvedResult ?? "mixed"];

  useEffect(() => {
    const video = landscapeVideoRef.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
      video.currentTime = 0;
      return;
    }
    void video.play().catch(() => {});
  }, [reducedMotion]);

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

  useEffect(() => {
    const nextIndex = pendingChoiceFocusRef.current;
    if (nextIndex === null) return;
    pendingChoiceFocusRef.current = null;
    choiceRefs.current[nextIndex]?.focus();
  }, [selected]);

  function moveScene(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || !sectionRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    sectionRef.current.style.setProperty("--orbit-pointer-x", x.toFixed(3));
    sectionRef.current.style.setProperty("--orbit-pointer-y", y.toFixed(3));
  }

  function choose(choice: Choice, index: number) {
    if (done) return;
    if (answers.every((answer) => answer === null)) {
      track("health_check_started", { source: "home" });
    }
    dispatch({ type: "choose", step, answer: choice.diagnosis, selection: index });
  }

  function moveChoiceFocus(index: number, direction: 1 | -1) {
    const nextIndex = (index + direction + active.choices.length) % active.choices.length;
    pendingChoiceFocusRef.current = nextIndex;
    choose(active.choices[nextIndex], nextIndex);
  }

  function continueDiagnostic() {
    if (selected === null) return;

    if (step < QUESTIONS.length - 1) {
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
    focusRequestedRef.current = true;
    dispatch({ type: "complete", answers: committedAnswers });
  }

  function back() {
    if (step === 0) return;
    focusRequestedRef.current = true;
    dispatch({ type: "back" });
  }

  function reviewAnswers() {
    clearServicesSituation();
    focusRequestedRef.current = true;
    dispatch({ type: "review" });
  }

  function reset() {
    clearServicesSituation();
    focusRequestedRef.current = true;
    dispatch({ type: "reset" });
  }

  function onChoiceKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveChoiceFocus(index, 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveChoiceFocus(index, -1);
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
      data-preview={preview === null ? "idle" : String(preview)}
      aria-labelledby="brand-orbit-title"
      onPointerMove={moveScene}
    >
      <div className="brand-orbit__landscape" aria-hidden="true">
        <Image
          className="brand-orbit__plate"
          src="/images/generated/bt-home-brand-diagnostic-flowerwater-v1.png"
          alt=""
          fill
          sizes="100vw"
        />
        <video
          ref={landscapeVideoRef}
          className="brand-orbit__water-motion"
          muted
          loop
          playsInline
          aria-hidden="true"
          preload={reducedMotion ? "none" : "auto"}
          data-home-playback-rate="1"
        >
          <source src="/videos/generated/bt-home-decision-waterlight.mp4" type="video/mp4" />
        </video>
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

      <div className="brand-orbit__shell">
        <header className="brand-orbit__header">
          <h2 id="brand-orbit-title">
            02 · Brand diagnostic
            <span>About 30 seconds</span>
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

        <AnimatePresence mode="sync" initial={false}>
          {done ? (
            <motion.div
              ref={resultRef}
              key="result"
              className="brand-orbit__result"
              data-home-reading-plane
              role="region"
              aria-labelledby="brand-orbit-result-title"
              tabIndex={-1}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
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
                <Link href={result.href}>{result.action} <i aria-hidden="true">↗</i></Link>
                <Link href="/contact#call">Discuss this diagnosis <i aria-hidden="true">→</i></Link>
                <button type="button" onClick={reviewAnswers}>Review or change answers</button>
                <button type="button" onClick={reset}>Take the quiz again</button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={active.prompt}
              className="brand-orbit__question"
              data-home-reading-plane
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: reducedMotion ? 0 : 0.58, ease: EASE }}
            >
              <div className="brand-orbit__prompt">
                <p>{active.eyebrow}</p>
                <h3 ref={headingRef} tabIndex={-1}>{active.prompt}</h3>
                {step > 0 ? <button type="button" onClick={back}>Back one question</button> : null}
                <button
                  type="button"
                  className="brand-orbit__continue"
                  onClick={continueDiagnostic}
                  disabled={selected === null}
                >
                  {step === QUESTIONS.length - 1 ? "See my result" : "Continue"}
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              <fieldset className="brand-orbit__choices" role="radiogroup" aria-describedby={`brand-orbit-cue-${step}`}>
                <legend className="sr-only">{active.prompt}</legend>
                <p className="brand-orbit__choice-cue" id={`brand-orbit-cue-${step}`}>
                  <span>Choose one</span>
                  <b>{selected === null ? "Select the statement closest to your business." : active.choices[selected].label}</b>
                </p>
                {active.choices.map((choice, index) => (
                  <motion.button
                    key={choice.label}
                    ref={(node) => { choiceRefs.current[index] = node; }}
                    type="button"
                    className={selected === index ? "is-selected" : undefined}
                    onClick={() => choose(choice, index)}
                    onPointerEnter={() => dispatch({ type: "preview", selection: index })}
                    onPointerLeave={() => dispatch({ type: "preview", selection: null })}
                    onFocus={() => dispatch({ type: "preview", selection: index })}
                    onBlur={() => dispatch({ type: "preview", selection: null })}
                    role="radio"
                    aria-checked={selected === index}
                    aria-label={`${String(index + 1).padStart(2, "0")} ${choice.label}`}
                    tabIndex={selected === index || (selected === null && index === 0) ? 0 : -1}
                    onKeyDown={(event) => onChoiceKeyDown(event, index)}
                    animate={{
                      opacity: 1,
                      x: preview === index ? 14 : 0,
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
