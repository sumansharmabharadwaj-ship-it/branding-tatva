"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, type CSSProperties } from "react";
import {
  SERVICES_SITUATION_EVENT,
  SERVICES_SITUATION_STORAGE_KEY,
  SITUATION_TO_PACKAGE,
  type ServicesSituationDetail,
  type ServicesSituationId,
} from "@/lib/servicesJourney";
import { track } from "@/lib/analytics";

type Answer = {
  measure: string;
  points: number;
  label: string;
};

const MEASURES = [
  {
    id: "position",
    number: "01",
    label: "Position",
    prompt: "How clearly can the team explain why this business is chosen?",
    options: [
      { label: "The answer changes across people and moments", points: 0 },
      { label: "A shared idea exists, with room to sharpen", points: 1 },
      { label: "One written position guides decisions", points: 2 },
    ],
  },
  {
    id: "recognition",
    number: "02",
    label: "Recognition",
    prompt: "How quickly do people recognise the brand before seeing its name?",
    options: [
      { label: "Recognition depends on the name and logo together", points: 0 },
      { label: "A few assets already feel familiar", points: 1 },
      { label: "Several assets are recognisable on their own", points: 2 },
    ],
  },
  {
    id: "consistency",
    number: "03",
    label: "Consistency",
    prompt: "How consistently do active channels repeat the same brand idea?",
    options: [
      { label: "Each channel follows its own logic", points: 0 },
      { label: "Core elements repeat with occasional drift", points: 1 },
      { label: "One system guides every active channel", points: 2 },
    ],
  },
  {
    id: "expression",
    number: "04",
    label: "Expression",
    prompt: "How easily can the team create new work from shared rules?",
    options: [
      { label: "Each brief begins from personal preference", points: 0 },
      { label: "Templates help, while decisions still vary", points: 1 },
      { label: "Shared rules make new work faster and coherent", points: 2 },
    ],
  },
  {
    id: "preference",
    number: "05",
    label: "Preference",
    prompt: "How often do buyers choose the brand before a close comparison?",
    options: [
      { label: "Price and features carry most decisions", points: 0 },
      { label: "Some buyers arrive with a clear preference", points: 1 },
      { label: "Preference often begins before comparison", points: 2 },
    ],
  },
] as const;

const BANDS = [
  {
    max: 3,
    title: "Foundation to define",
    detail: "Position and recognition need the first shared direction.",
    situation: "idea",
    action: "Explore the foundation path",
  },
  {
    max: 7,
    title: "System to align",
    detail: "Useful signals already exist. A connected system can align them.",
    situation: "reposition",
    action: "Explore the repositioning path",
  },
  {
    max: 10,
    title: "Recognition to compound",
    detail: "The base is working. Consistent application can make it easier to recall and choose.",
    situation: "ongoing",
    action: "Explore the ongoing path",
  },
] as const satisfies ReadonlyArray<{
  max: number;
  title: string;
  detail: string;
  situation: ServicesSituationId;
  action: string;
}>;

const MAX_SCORE = MEASURES.length * 2;
const EASE = [0.22, 1, 0.36, 1] as const;

function bandFor(score: number) {
  return BANDS.find((band) => score <= band.max) ?? BANDS[BANDS.length - 1];
}

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

export function HomeBrandHealthCheck() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const done = step >= MEASURES.length;
  const active = MEASURES[Math.min(step, MEASURES.length - 1)];
  const score = answers.reduce((sum, answer) => sum + answer.points, 0);
  const result = bandFor(score);
  const progress = answers.length / MEASURES.length;

  const signals = useMemo(() => {
    if (!done || answers.length !== MEASURES.length) return null;
    const strongest = answers.reduce((best, answer) => (answer.points > best.points ? answer : best));
    const clearestGap = answers.reduce((lowest, answer) => (answer.points < lowest.points ? answer : lowest));
    return { strongest, clearestGap };
  }, [answers, done]);

  function answer(label: string, points: number) {
    if (selected || done) return;
    if (answers.length === 0) track("health_check_started", { source: "home" });
    setSelected(label);

    window.setTimeout(
      () => {
        const nextAnswers = [
          ...answers,
          { measure: active.label, points, label },
        ];
        setAnswers(nextAnswers);
        setStep((current) => current + 1);
        setSelected(null);

        if (nextAnswers.length === MEASURES.length) {
          const nextScore = nextAnswers.reduce((sum, answer) => sum + answer.points, 0);
          const nextResult = bandFor(nextScore);
          publishResult(nextResult.situation);
          track("health_check_completed", {
            source: "home",
            score: nextScore,
            result: nextResult.situation,
          });
        }
      },
      prefersReducedMotion ? 0 : 220,
    );
  }

  function back() {
    if (step === 0 || selected) return;
    setAnswers((current) => current.slice(0, -1));
    setStep((current) => current - 1);
  }

  function reset() {
    setAnswers([]);
    setStep(0);
    setSelected(null);
  }

  return (
    <section
      className="home-health"
      aria-labelledby="home-health-title"
      style={{ "--health-progress": progress } as CSSProperties}
    >
      <div className="home-health__stream" data-media-id="BT-HOME-HEALTH-FIVE-STONES" aria-hidden="true">
        <span className="home-health__stream-bed" />
        <span className="home-health__stream-current" />
        <span className="home-health__stream-light" />
        <span className="home-health__stream-wash" />
      </div>

      <div className="home-health__shell">
        <header className="home-health__header">
          <div>
            <p className="home-health__eyebrow">Brand Health Check</p>
            <h2 id="home-health-title">
              Five signals reveal <em>where recognition needs support.</em>
            </h2>
          </div>
          <div className="home-health__intro">
            <p>
              Choose one honest answer for each measure. The result appears here, with every point visible and every recommendation traceable to your choices.
            </p>
            <span>Each answer adds 0, 1, or 2 points. Total: {MAX_SCORE}.</span>
          </div>
        </header>

        <div className="home-health__stage">
          <div className="home-health__instrument">
            <div className="home-health__instrument-topline">
              <span>Five measurement stones</span>
              <strong>{String(Math.min(step + 1, MEASURES.length)).padStart(2, "0")} / 05</strong>
            </div>
            <HealthWaterInstrument
              answers={answers}
              activeIndex={Math.min(step, MEASURES.length - 1)}
              reducedMotion={prefersReducedMotion}
            />
            <div className="home-health__legend" aria-hidden="true">
              <span><i data-score="0" /> Emerging</span>
              <span><i data-score="1" /> Forming</span>
              <span><i data-score="2" /> Working</span>
            </div>
          </div>

          <div className="home-health__diagnostic">
            <div className="home-health__progress" aria-label={`${answers.length} of ${MEASURES.length} measures answered`}>
              <span style={{ transform: `scaleX(${progress})` }} />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.article
                  key="health-result"
                  className="home-health__result"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 14, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
                  aria-live="polite"
                >
                  <div className="home-health__result-topline">
                    <span>Your visible score</span>
                    <strong>{score} / {MAX_SCORE}</strong>
                  </div>
                  <p className="home-health__result-label">Your answers point toward</p>
                  <h3>{result.title}</h3>
                  <p className="home-health__result-copy">{result.detail}</p>

                  {signals && (
                    <dl className="home-health__signals">
                      <div>
                        <dt>Strongest signal</dt>
                        <dd>{signals.strongest.measure} · {signals.strongest.points}/2</dd>
                      </div>
                      <div>
                        <dt>Clearest opportunity</dt>
                        <dd>{signals.clearestGap.measure} · {signals.clearestGap.points}/2</dd>
                      </div>
                    </dl>
                  )}

                  <div className="home-health__result-actions">
                    <Link href="/services#health">{result.action} <span aria-hidden="true">↗</span></Link>
                    <Link href="/contact">Discuss the diagnosis <span aria-hidden="true">→</span></Link>
                    <button type="button" onClick={reset}>Measure again</button>
                  </div>
                </motion.article>
              ) : (
                <motion.div
                  key={active.id}
                  className="home-health__question"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE }}
                  aria-live="polite"
                >
                  <div className="home-health__question-topline">
                    <span>{active.number} · {active.label}</span>
                    {step > 0 && (
                      <button type="button" onClick={back}>Back</button>
                    )}
                  </div>
                  <h3>{active.prompt}</h3>
                  <div className="home-health__options">
                    {active.options.map((option) => {
                      const pressed = selected === option.label;
                      return (
                        <motion.button
                          key={option.label}
                          type="button"
                          aria-pressed={pressed}
                          onClick={() => answer(option.label, option.points)}
                          whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                          className={pressed ? "is-selected" : undefined}
                        >
                          <span>{option.label}</span>
                          <strong>{option.points}</strong>
                        </motion.button>
                      );
                    })}
                  </div>
                  <p className="home-health__scoring-note">
                    The number at the right is the exact value added to your total.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function HealthWaterInstrument({
  answers,
  activeIndex,
  reducedMotion,
}: {
  answers: Answer[];
  activeIndex: number;
  reducedMotion: boolean;
}) {
  const points = [
    { x: 88, y: 292 },
    { x: 198, y: 208 },
    { x: 308, y: 278 },
    { x: 420, y: 176 },
    { x: 530, y: 252 },
  ] as const;

  return (
    <div
      className="home-health__water-map"
      role="img"
      aria-label={`${answers.length} of five brand health measures answered`}
    >
      <svg viewBox="0 0 620 400" aria-hidden="true">
        <defs>
          <linearGradient id="health-current-gradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#7D9BAF" stopOpacity="0.18" />
            <stop offset="52%" stopColor="#D4B99A" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#8FA283" stopOpacity="0.38" />
          </linearGradient>
          <radialGradient id="health-stone-gradient">
            <stop offset="0%" stopColor="#D9D1BF" stopOpacity="0.84" />
            <stop offset="100%" stopColor="#6F786E" stopOpacity="0.64" />
          </radialGradient>
        </defs>

        <path
          d="M42 326 C122 292 148 208 214 222 S290 318 350 270 S428 152 488 190 S546 272 590 234"
          fill="none"
          stroke="rgba(244,239,230,0.11)"
          strokeWidth="2"
        />
        <motion.path
          d="M42 326 C122 292 148 208 214 222 S290 318 350 270 S428 152 488 190 S546 272 590 234"
          fill="none"
          stroke="url(#health-current-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="1"
          initial={false}
          animate={{ pathLength: Math.max(0.03, answers.length / MEASURES.length) }}
          transition={{ duration: reducedMotion ? 0 : 0.9, ease: EASE }}
        />

        {points.map((point, index) => {
          const answer = answers[index];
          const active = index === activeIndex && answers.length < MEASURES.length;
          const score = answer?.points ?? -1;
          const fill =
            score === 2 ? "#D4B99A" :
            score === 1 ? "#8FA283" :
            score === 0 ? "#7D9BAF" :
            "url(#health-stone-gradient)";

          return (
            <g key={MEASURES[index].id}>
              {answer && !reducedMotion && (
                <motion.circle
                  key={`health-ring-${index}-${score}`}
                  cx={point.x}
                  cy={point.y}
                  fill="none"
                  stroke={fill === "url(#health-stone-gradient)" ? "#D4B99A" : fill}
                  strokeWidth="1.5"
                  initial={{ r: 22, opacity: 0.62 }}
                  animate={{ r: 48, opacity: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                />
              )}
              <motion.ellipse
                cx={point.x}
                cy={point.y}
                rx={active ? 25 : 21}
                ry={active ? 17 : 14}
                fill={fill}
                stroke={active ? "#F4EFE6" : "rgba(244,239,230,0.22)"}
                strokeWidth={active ? 1.8 : 1}
                initial={false}
                animate={{ scale: answer ? 1.08 : 1, opacity: answer ? 1 : active ? 0.95 : 0.52 }}
                style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                transition={{ duration: reducedMotion ? 0 : 0.45, ease: EASE }}
              />
              <text x={point.x} y={point.y + 42} textAnchor="middle">
                {MEASURES[index].label}
              </text>
              {answer && (
                <text x={point.x} y={point.y + 4} textAnchor="middle" className="home-health__stone-score">
                  {answer.points}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
