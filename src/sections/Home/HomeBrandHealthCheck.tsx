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
import { useMemo, useRef, useState, type PointerEvent } from "react";

type Diagnosis = "recognition" | "coherence" | "demand";

type Choice = {
  label: string;
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
        diagnosis: "recognition",
        centre: "Make the meaning easier to remember.",
      },
      {
        label: "The identity exists. The system does not.",
        diagnosis: "coherence",
        centre: "Give every expression one source.",
      },
      {
        label: "Marketing moves without one direction.",
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
        diagnosis: "recognition",
        centre: "Commit to the idea only you can carry.",
      },
      {
        label: "Approving every message and visual.",
        diagnosis: "coherence",
        centre: "Replace personal taste with shared rules.",
      },
      {
        label: "Publishing without a clear proof path.",
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
        diagnosis: "recognition",
        centre: "Build the position first.",
      },
      {
        label: "The team can create from one system.",
        diagnosis: "coherence",
        centre: "Connect language, identity and behaviour.",
      },
      {
        label: "Proof creates preference before the call.",
        diagnosis: "demand",
        centre: "Make the evidence carry the promise.",
      },
    ],
  },
] as const;

const RESULTS: Record<
  Diagnosis,
  {
    title: string;
    detail: string;
    signal: string;
    situation: ServicesSituationId;
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

function resolveDiagnosis(answers: Diagnosis[]) {
  const score: Record<Diagnosis, number> = { recognition: 0, coherence: 0, demand: 0 };
  answers.forEach((answer) => {
    score[answer] += 1;
  });
  return (Object.entries(score) as Array<[Diagnosis, number]>).sort((a, b) => b[1] - a[1])[0][0];
}

export function HomeBrandHealthCheck() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Diagnosis[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const done = step >= QUESTIONS.length;
  const active = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  const diagnosis = useMemo(() => resolveDiagnosis(answers), [answers]);
  const result = RESULTS[diagnosis];
  const previewChoice = preview === null ? null : active.choices[preview];

  function moveScene(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || !sectionRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    sectionRef.current.style.setProperty("--orbit-pointer-x", x.toFixed(3));
    sectionRef.current.style.setProperty("--orbit-pointer-y", y.toFixed(3));
  }

  function choose(choice: Choice, index: number) {
    if (selected !== null || done) return;
    if (answers.length === 0) track("health_check_started", { source: "home" });
    setSelected(index);
    const nextAnswers = [...answers, choice.diagnosis];

    window.setTimeout(
      () => {
        setAnswers(nextAnswers);
        setStep((current) => current + 1);
        setSelected(null);
        setPreview(null);

        if (nextAnswers.length === QUESTIONS.length) {
          const nextDiagnosis = resolveDiagnosis(nextAnswers);
          const nextResult = RESULTS[nextDiagnosis];
          publishResult(nextResult.situation);
          track("health_check_completed", {
            source: "home",
            result: nextResult.situation,
            diagnosis: nextDiagnosis,
          });
        }
      },
      reducedMotion ? 0 : 460,
    );
  }

  function back() {
    if (step === 0 || selected !== null) return;
    setAnswers((current) => current.slice(0, -1));
    setStep((current) => current - 1);
    setPreview(null);
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setSelected(null);
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
      aria-labelledby="brand-orbit-title"
      onPointerMove={moveScene}
    >
      <div className="brand-orbit__landscape" aria-hidden="true">
        <Image
          src="/images/generated/bt-home-brand-orbit-valley.webp"
          alt=""
          fill
          priority={false}
          sizes="100vw"
        />
      </div>
      <div className="brand-orbit__veil" aria-hidden="true" />

      <div className="brand-orbit__shell">
        <header className="brand-orbit__header">
          <div>
            <p>02 · Brand diagnostic</p>
            <h2 id="brand-orbit-title">Find the decision your brand needs next.</h2>
          </div>
          <div className="brand-orbit__progress" aria-label={`${Math.min(step + 1, QUESTIONS.length)} of ${QUESTIONS.length}`}>
            <strong>{String(Math.min(step + 1, QUESTIONS.length)).padStart(2, "0")} / 03</strong>
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

              <motion.div
                className="brand-orbit__sun brand-orbit__sun--result"
                initial={reducedMotion ? false : { scale: 0.74, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.9, ease: EASE }}
              >
                <Image src="/images/generated/bt-home-brand-orbit-sun.webp" alt="" fill sizes="26rem" />
              </motion.div>

              <div className="brand-orbit__result-action">
                <span>The strategic centre</span>
                <strong>{result.signal}</strong>
                <Link href="/services#health">{result.action} <i aria-hidden="true">↗</i></Link>
                <Link href="/contact">Discuss this diagnosis <i aria-hidden="true">→</i></Link>
                <button type="button" onClick={reset}>Take the quiz again</button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={active.prompt}
              className="brand-orbit__question"
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: reducedMotion ? 0 : 0.58, ease: EASE }}
            >
              <div className="brand-orbit__prompt">
                <p>{active.eyebrow}</p>
                <h3>{active.prompt}</h3>
                {step > 0 ? <button type="button" onClick={back}>Back one question</button> : null}
              </div>

              <motion.div
                className="brand-orbit__sun"
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        x: `calc(var(--orbit-pointer-x, 0) * 12px)`,
                        y: `calc(var(--orbit-pointer-y, 0) * 10px)`,
                        rotate: preview === null ? [0, 2, 0, -2, 0] : preview * 3 - 3,
                        scale: preview === null ? [0.985, 1.015, 0.985] : 1.045,
                      }
                }
                transition={
                  preview === null
                    ? { duration: 7, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.5, ease: EASE }
                }
                aria-hidden="true"
              >
                <Image src="/images/generated/bt-home-brand-orbit-sun.webp" alt="" fill sizes="24rem" />
              </motion.div>

              <div className="brand-orbit__centre-copy" aria-live="polite">
                <span>{previewChoice ? "This answer points toward" : "Choose the sentence closest to today"}</span>
                <strong>{previewChoice?.centre ?? "Honesty creates the useful route."}</strong>
              </div>

              <div className="brand-orbit__choices" role="group" aria-label={active.prompt}>
                {active.choices.map((choice, index) => (
                  <motion.button
                    key={choice.label}
                    type="button"
                    className={selected === index ? "is-selected" : undefined}
                    onClick={() => choose(choice, index)}
                    onPointerEnter={() => setPreview(index)}
                    onPointerLeave={() => setPreview(null)}
                    onFocus={() => setPreview(index)}
                    onBlur={() => setPreview(null)}
                    aria-pressed={selected === index}
                    animate={
                      selected === index
                        ? { scale: 0.86, opacity: 0, x: index === 0 ? 170 : index === 1 ? -170 : 0, y: index === 2 ? -120 : 40 }
                        : { scale: preview === index ? 1.035 : 1, opacity: selected === null ? 1 : 0.3 }
                    }
                    transition={{ duration: reducedMotion ? 0 : 0.46, ease: EASE }}
                  >
                    <span>0{index + 1}</span>
                    <strong>{choice.label}</strong>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
