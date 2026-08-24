"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AuditInvite } from "@/components/AuditInvite";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { faqs } from "@/data/faqs";

const QUESTION_ORDER = [
  "Can you help a brand new business?",
  "Can you help an existing brand that already has an identity?",
  "Can you actually implement, or just strategize?",
  "How long does a project take?",
  "Can we work remotely?",
] as const;

const DECISION_META = [
  {
    signal: "Scope",
    title: "Begin before assumptions become assets.",
    outcome: "Discovery → positioning → audience",
    color: "#D4B99A",
    x: 50,
    y: 11,
  },
  {
    signal: "Fit",
    title: "Keep the useful. Rework what confuses.",
    outcome: "Clarity → sharper expression → continuity",
    color: "#8FA283",
    x: 84,
    y: 35,
  },
  {
    signal: "Implementation",
    title: "The plan continues into the build.",
    outcome: "Strategy → website → content → campaigns",
    color: "#C77752",
    x: 80,
    y: 78,
  },
  {
    signal: "Timing",
    title: "Scope decides the clock.",
    outcome: "A timeline shaped after diagnosis",
    color: "#D3A24F",
    x: 20,
    y: 78,
  },
  {
    signal: "Distance",
    title: "Distance changes the room, not the work.",
    outcome: "Remote collaboration from diagnosis to delivery",
    color: "#7D9AA8",
    x: 16,
    y: 35,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

function answerFor(question: string) {
  return faqs.find((item) => item.question === question)?.answer ?? "";
}

export function HomeQuestionsScene() {
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const decisions = useMemo(
    () =>
      QUESTION_ORDER.map((question, index) => ({
        ...DECISION_META[index],
        question,
        answer: answerFor(question),
      })),
    [],
  );
  const active = decisions[activeIndex] ?? decisions[0];
  // The film is the sole ambient movement. The compass changes only after a
  // visitor chooses a question, so the answer stays still while it is read.
  const motionActive = false;

  useEffect(() => {
    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== "questions") return;
      setActiveIndex(0);
    }

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => window.removeEventListener("bt:home-chapter", onChapter as EventListener);
  }, []);

  function choose(index: number) {
    setActiveIndex(index);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % decisions.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + decisions.length - 1) % decisions.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = decisions.length - 1;
    else return;

    event.preventDefault();
    choose(next);
    const tabPrefix = event.currentTarget.id.startsWith("question-compass")
      ? "question-compass-tab"
      : "question-tab";
    document.getElementById(`${tabPrefix}-${next}`)?.focus();
  }

  return (
    <section
      className="questions-cinematic"
      aria-labelledby="home-questions-title"
      style={{ "--questions-accent": active.color } as CSSProperties}
    >
      <span className="sr-only">Before we work together</span>
      <BackgroundVideo
        video="/videos/pixabay-golden-reeds-wind.mp4"
        poster="/images/pixabay-golden-reeds-wind-poster.jpg"
        playbackRate={0.92}
      />
      <div className="questions-cinematic__veil" aria-hidden="true" />
      <Container className="questions-cinematic__shell max-w-[96rem]">
        <header className="questions-cinematic__header">
          <div>
            <p className="questions-cinematic__eyebrow">Before we work together</p>
            <h2 id="home-questions-title">
              Five practical questions. <em>One clear starting point.</em>
            </h2>
          </div>
          <div className="questions-cinematic__intro">
            <p>
              Before money enters the room, scope, fit, implementation, timing, and
              distance should stop feeling vague.
            </p>
            <span>
              Five questions resolve into one practical way to begin.
            </span>
          </div>
        </header>

        <div className="questions-cinematic__stage">
          <div
            className="questions-cinematic__compass"
            aria-label="Five practical doubts converging into a clear starting decision"
          >
            <div className="questions-cinematic__compass-topline">
              <span>Clarity compass</span>
              <strong>{String(activeIndex + 1).padStart(2, "0")} / 05</strong>
            </div>

            <svg viewBox="0 0 500 500" aria-hidden="true">
              <defs>
                <radialGradient id="questions-core-field" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={active.color} stopOpacity="0.24" />
                  <stop offset="100%" stopColor={active.color} stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="250" cy="250" r="138" fill="url(#questions-core-field)" />
              <circle
                cx="250"
                cy="250"
                r="178"
                fill="none"
                stroke="rgba(244,239,230,0.08)"
                strokeDasharray="3 12"
              />
              <motion.circle
                cx="250"
                cy="250"
                r="157"
                fill="none"
                stroke={active.color}
                strokeWidth="1"
                strokeDasharray="8 16"
                animate={motionActive ? { rotate: 360, opacity: [0.22, 0.58, 0.22] } : undefined}
                style={{ transformOrigin: "250px 250px" }}
                transition={
                  motionActive
                    ? {
                        rotate: { duration: 22, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
                      }
                    : undefined
                }
              />

              {decisions.map((decision, index) => {
                const x = (decision.x / 100) * 500;
                const y = (decision.y / 100) * 500;
                const selected = index === activeIndex;
                return (
                  <g key={decision.signal}>
                    <line
                      x1={x}
                      y1={y}
                      x2="250"
                      y2="250"
                      stroke="rgba(244,239,230,0.08)"
                      strokeWidth="1"
                    />
                    <motion.line
                      x1={x}
                      y1={y}
                      x2="250"
                      y2="250"
                      stroke={decision.color}
                      strokeWidth={selected ? 2.2 : 1}
                      strokeLinecap="round"
                      pathLength="1"
                      strokeDasharray="0.08 0.12"
                      animate={
                        selected && motionActive
                          ? { strokeDashoffset: [0, -1], opacity: [0.48, 1, 0.48] }
                          : { opacity: selected ? 0.72 : 0.13 }
                      }
                      transition={{
                        strokeDashoffset: { duration: 3.2, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 2.8, repeat: selected ? Infinity : 0, ease: "easeInOut" },
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            <div className="questions-cinematic__nodes" role="tablist" aria-label="Choose a practical question">
              {decisions.map((decision, index) => {
                const selected = index === activeIndex;
                return (
                  <button
                    key={decision.signal}
                    id={`question-compass-tab-${index}`}
                    type="button"
                    role="tab"
                    className={`questions-cinematic__node${selected ? " is-active" : ""}`}
                    style={
                      {
                        left: `${decision.x}%`,
                        top: `${decision.y}%`,
                        "--decision-color": decision.color,
                      } as CSSProperties
                    }
                    aria-label={`${decision.signal}: ${decision.question}`}
                    aria-selected={selected}
                    aria-controls="questions-cinematic-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => choose(index)}
                    onFocus={() => choose(index)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                  >
                    <motion.i
                      aria-hidden="true"
                      animate={
                        selected && motionActive
                          ? { scale: [0.78, 1.24, 0.78], opacity: [0.7, 1, 0.7] }
                          : { scale: 1, opacity: selected ? 1 : 0.58 }
                      }
                      transition={{ duration: 2.4, repeat: selected && motionActive ? Infinity : 0, ease: "easeInOut" }}
                    />
                    <span>{decision.signal}</span>
                  </button>
                );
              })}
            </div>

            <motion.div
              className="questions-cinematic__core"
              animate={
                motionActive
                  ? { scale: [0.97, 1.04, 0.97], opacity: [0.88, 1, 0.88] }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 4.6, repeat: motionActive ? Infinity : 0, ease: "easeInOut" }}
            >
              <span>Clear enough</span>
              <strong>to begin</strong>
            </motion.div>
          </div>

          <AnimatePresence mode="sync" initial={false}>
            <motion.article
              key={active.signal}
              id="questions-cinematic-panel"
              role="tabpanel"
              aria-label={`${active.signal}: ${active.question}`}
              className="questions-cinematic__answer"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.48, ease: EASE }}
              aria-live="polite"
            >
              <div className="questions-cinematic__answer-topline">
                <span>{active.signal}</span>
                <strong>{String(activeIndex + 1).padStart(2, "0")} / 05</strong>
              </div>
              <p className="questions-cinematic__answer-label">What this question is really asking</p>
              <h3>{active.title}</h3>
              <p className="questions-cinematic__question">“{active.question}”</p>
              <p className="questions-cinematic__answer-copy">{active.answer}</p>
              <div className="questions-cinematic__outcome">
                <span>What becomes clear</span>
                <strong>{active.outcome}</strong>
              </div>
              <Link href="/contact" className="questions-cinematic__answer-link">
                Bring the remaining question <span aria-hidden="true">↗</span>
              </Link>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="questions-cinematic__tabs" role="tablist" aria-label="Choose a practical doubt">
          {decisions.map((decision, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={decision.signal}
                id={`question-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="questions-cinematic-panel"
                tabIndex={selected ? 0 : -1}
                className={selected ? "is-active" : undefined}
                style={{ "--decision-color": decision.color } as CSSProperties}
                onClick={() => choose(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                onFocus={() => choose(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{decision.signal}</strong>
                <small>{decision.question}</small>
              </button>
            );
          })}
        </div>

        <div className="questions-cinematic__utility">
          <div>
            <span>Still deciding where to begin?</span>
            <p>
              The audit gives you a useful diagnosis before any conversation becomes a proposal.
            </p>
          </div>
          <AuditInvite tone="dark" />
        </div>
      </Container>
    </section>
  );
}
