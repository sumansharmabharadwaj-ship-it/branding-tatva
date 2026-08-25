"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import { track } from "@/lib/analytics";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

type Diagnosis = "recognition" | "coherence" | "demand";
type ResultDiagnosis = Diagnosis | "mixed";

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
  }
> = {
  recognition: {
    title: "Recognition needs a sharper centre.",
    detail:
      "The business has useful substance, while the market still has to work too hard to name what makes it different.",
    signal: "Position before expression",
    situation: "idea",
    action: "Explore the foundation path",
  },
  coherence: {
    title: "Coherence needs one living system.",
    detail:
      "Good elements already exist. They need a shared logic that the website, team and marketing can use without reinterpretation.",
    signal: "One source for every expression",
    situation: "reposition",
    action: "Explore the repositioning path",
  },
  demand: {
    title: "Demand needs proof with direction.",
    detail:
      "Visibility is present, while the evidence, message and repeated signals have yet to compound into preference.",
    signal: "Evidence that reinforces one promise",
    situation: "ongoing",
    action: "Explore the ongoing path",
  },
  mixed: {
    title: "Your answers point to a connected brand problem.",
    detail:
      "The friction is moving across positioning, expression and proof. The next decision needs to connect those parts before any one of them is pushed harder.",
    signal: "One joined-up diagnosis",
    action: "See the connected system",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

function publishResult(situation: ServicesSituationId) {
  try {
    window.localStorage.setItem(SERVICES_SITUATION_STORAGE_KEY, situation);
    const detail: ServicesSituationDetail = {
      situation,
      packageSlug: SITUATION_TO_PACKAGE[situation],
    };
    window.dispatchEvent(new CustomEvent<ServicesSituationDetail>(SERVICES_SITUATION_EVENT, { detail }));
  } catch {}
}

function resolveDiagnosis(answers: Diagnosis[]): ResultDiagnosis {
  const score: Record<Diagnosis, number> = { recognition: 0, coherence: 0, demand: 0 };
  answers.forEach((answer) => {
    score[answer] += 1;
  });
  const entries = Object.entries(score) as Array<[Diagnosis, number]>;
  const highestScore = Math.max(...entries.map(([, value]) => value));
  const winners = entries.filter(([, value]) => value === highestScore);
  return winners.length === 1 ? winners[0][0] : "mixed";
}

export function HomeBrandHealthCheck() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const landscapeVideoRef = useRef<HTMLVideoElement>(null);
  const choiceRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Diagnosis[]>([]);
  const [selections, setSelections] = useState<Array<number | null>>([]);
  const [resultVisible, setResultVisible] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const selected = selections[step] ?? null;
  const done = resultVisible;
  const active = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  const diagnosis = useMemo(() => resolveDiagnosis(answers), [answers]);
  const result = RESULTS[diagnosis];

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
    if (answers.length === 0) track("health_check_started", { source: "home" });
    setAnswers((current) => {
      const next = [...current];
      next[step] = choice.diagnosis;
      return next;
    });
    setSelections((current) => {
      const next = [...current];
      next[step] = index;
      return next;
    });
    setPreview(null);
  }

  function moveChoiceFocus(index: number, direction: 1 | -1) {
    const nextIndex = (index + direction + active.choices.length) % active.choices.length;
    choiceRefs.current[nextIndex]?.focus();
    choose(active.choices[nextIndex], nextIndex);
  }

  function continueDiagnostic() {
    if (selected === null) return;

    if (step < QUESTIONS.length - 1) {
      setStep((current) => current + 1);
      setPreview(null);
      return;
    }

    const nextDiagnosis = resolveDiagnosis(answers);
    const nextResult = RESULTS[nextDiagnosis];
    if (nextResult.situation) publishResult(nextResult.situation);
    track("health_check_completed", {
      source: "home",
      result: nextDiagnosis,
      diagnosis: nextDiagnosis,
    });
    setResultVisible(true);
  }

  function back() {
    if (step === 0) return;
    setStep((current) => current - 1);
    setPreview(null);
  }

  function reviewAnswers() {
    setResultVisible(false);
    setStep(QUESTIONS.length - 1);
    setPreview(null);
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setSelections([]);
    setResultVisible(false);
    setPreview(null);
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
          autoPlay={!reducedMotion}
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
          <p id="brand-orbit-title">
            02 · Brand diagnostic
            <span>About 30 seconds</span>
          </p>
          <div className="brand-orbit__progress" aria-label={`${Math.min(step + 1, QUESTIONS.length)} of ${QUESTIONS.length}`}>
            <strong>
              <span>Question</span>
              {String(Math.min(step + 1, QUESTIONS.length)).padStart(2, "0")} / 03
            </strong>
            <span><i style={{ transform: `scaleX(${done ? 1 : (step + 1) / QUESTIONS.length})` }} /></span>
          </div>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="result"
              className="brand-orbit__result"
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.7, ease: EASE }}
              aria-live="polite"
            >
              <div className="brand-orbit__result-copy">
                <p>Your answers point toward</p>
                <h3>{result.title}</h3>
                <span>{result.detail}</span>
              </div>

              <div className="brand-orbit__result-action">
                <span>The strategic centre</span>
                <strong>{result.signal}</strong>
                <Link href="/services#health">{result.action} <i aria-hidden="true">↗</i></Link>
                <Link href="/contact">Discuss this diagnosis <i aria-hidden="true">→</i></Link>
                <button type="button" onClick={reviewAnswers}>Review or change answers</button>
                <button type="button" onClick={reset}>Take the quiz again</button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={active.prompt}
              className="brand-orbit__question"
              aria-live="polite"
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: reducedMotion ? 0 : 0.58, ease: EASE }}
            >
              <div className="brand-orbit__prompt">
                <p>{active.eyebrow}</p>
                <h3>{active.prompt}</h3>
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
                    onPointerEnter={() => setPreview(index)}
                    onPointerLeave={() => setPreview(null)}
                    onFocus={() => setPreview(index)}
                    onBlur={() => setPreview(null)}
                    role="radio"
                    aria-checked={selected === index}
                    aria-label={`${String(index + 1).padStart(2, "0")} ${choice.label}`}
                    tabIndex={selected === null ? (index === 0 ? 0 : -1) : (selected === index ? 0 : -1)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                        event.preventDefault();
                        moveChoiceFocus(index, 1);
                      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                        event.preventDefault();
                        moveChoiceFocus(index, -1);
                      }
                    }}
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
