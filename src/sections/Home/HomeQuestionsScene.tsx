"use client";

import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
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

const AUTO_ADVANCE_MS = 4300;
const MANUAL_HOLD_MS = 14000;
const HOVER_HOLD_MS = 3200;
const EASE = [0.22, 1, 0.36, 1] as const;

function answerFor(question: string) {
  return faqs.find((item) => item.question === question)?.answer ?? "";
}

export function HomeQuestionsScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const holdUntilRef = useRef(0);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.22, margin: "8% 0px -12% 0px" });
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
  const motionActive = inView && !prefersReducedMotion;

  useEffect(() => {
    if (!motionActive || decisions.length < 2) return;

    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < holdUntilRef.current) return;
      setActiveIndex((current) => (current + 1) % decisions.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [decisions.length, motionActive]);

  useEffect(() => {
    function onChapter(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== "questions") return;
      holdUntilRef.current = Date.now() + 700;
      setActiveIndex(0);
    }

    window.addEventListener("bt:home-chapter", onChapter as EventListener);
    return () => window.removeEventListener("bt:home-chapter", onChapter as EventListener);
  }, []);

  function choose(index: number, hold = MANUAL_HOLD_MS) {
    holdUntilRef.current = Date.now() + hold;
    setActiveIndex(index);
  }

  return (
    <section
      ref={sectionRef}
      className="questions-cinematic"
      aria-labelledby="home-questions-title"
      style={{ "--questions-accent": active.color } as CSSProperties}
      onPointerDown={() => {
        holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
      onFocusCapture={() => {
        holdUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      }}
    >
      <span className="sr-only">The practical questions</span>
      <BackgroundVideo
        video="/videos/pexels-golden-fog-sea.mp4"
        videoWebm="/videos/pexels-golden-fog-sea.webm"
        poster="/images/pexels-golden-fog-sea-poster.jpg"
        parallax
      />
      <div className="questions-cinematic__veil" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="questions-cinematic__light questions-cinematic__light--one"
        animate={
          motionActive
            ? { x: [0, 78, 0], y: [0, 26, 0], scale: [0.95, 1.08, 0.95] }
            : undefined
        }
        transition={
          motionActive
            ? { duration: 17, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />
      <motion.div
        aria-hidden="true"
        className="questions-cinematic__light questions-cinematic__light--two"
        animate={
          motionActive
            ? { x: [0, -60, 0], y: [0, -24, 0], scale: [1.04, 0.95, 1.04] }
            : undefined
        }
        transition={
          motionActive
            ? { duration: 20, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />

      <Container className="questions-cinematic__shell max-w-[96rem]">
        <header className="questions-cinematic__header">
          <div>
            <p className="questions-cinematic__eyebrow">Before we work together</p>
            <h2 id="home-questions-title">
              Five practical doubts. <em>One clear starting point.</em>
            </h2>
          </div>
          <div className="questions-cinematic__intro">
            <p>
              Before money enters the room, scope, fit, implementation, timing, and
              distance should stop feeling vague.
            </p>
            <span>
              The compass moves while you watch. Select a doubt and it waits while you read.
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

            {decisions.map((decision, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={decision.signal}
                  type="button"
                  className={`questions-cinematic__node${selected ? " is-active" : ""}`}
                  style={
                    {
                      left: `${decision.x}%`,
                      top: `${decision.y}%`,
                      "--decision-color": decision.color,
                    } as CSSProperties
                  }
                  aria-label={`Focus ${decision.signal}: ${decision.question}`}
                  aria-pressed={selected}
                  onClick={() => choose(index)}
                  onPointerEnter={() => choose(index, HOVER_HOLD_MS)}
                  onFocus={() => choose(index)}
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

          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={active.signal}
              id="questions-cinematic-panel"
              role="tabpanel"
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
              <p className="questions-cinematic__answer-label">What this doubt is really asking</p>
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
              <span className="questions-cinematic__timer" aria-hidden="true">
                <motion.i
                  key={`questions-timer-${active.signal}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0 : AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                />
              </span>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="questions-cinematic__tabs" role="tablist" aria-label="Choose a practical doubt">
          {decisions.map((decision, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={decision.signal}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="questions-cinematic-panel"
                className={selected ? "is-active" : undefined}
                style={{ "--decision-color": decision.color } as CSSProperties}
                onClick={() => choose(index)}
                onPointerEnter={() => choose(index, HOVER_HOLD_MS)}
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
