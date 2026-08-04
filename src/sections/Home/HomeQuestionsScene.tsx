"use client";

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { AuditInvite } from "@/components/AuditInvite";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Container } from "@/components/Container";
import { FAQ } from "@/sections/FAQ";

const QUESTIONS = [
  "Can you help a brand new business?",
  "Can you help an existing brand that already has an identity?",
  "Can you actually implement, or just strategize?",
  "How long does a project take?",
  "Can we work remotely?",
] as const;

const SIGNALS = [
  { label: "Scope", x: 18, y: 22 },
  { label: "Timing", x: 78, y: 19 },
  { label: "Implementation", x: 88, y: 66 },
  { label: "Distance", x: 52, y: 88 },
  { label: "Fit", x: 10, y: 67 },
] as const;

const PATHS = [
  "M90 55 C135 66 185 98 250 145",
  "M410 50 C365 66 315 100 250 145",
  "M452 184 C382 176 322 164 250 145",
  "M260 246 C256 210 253 179 250 145",
  "M48 187 C116 177 181 164 250 145",
] as const;

export function HomeQuestionsScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const inView = useInView(sectionRef, { amount: 0.22 });
  const motionActive = inView && !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-soil py-20 text-ivory sm:py-28"
      aria-labelledby="home-questions-title"
    >
      <BackgroundVideo
        video="/videos/pexels-golden-fog-sea.mp4"
        videoWebm="/videos/pexels-golden-fog-sea.webm"
        poster="/images/pexels-golden-fog-sea-poster.jpg"
        parallax
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(108deg, rgba(20,18,16,0.96) 0%, rgba(20,18,16,0.88) 47%, rgba(20,18,16,0.74) 100%)",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[12%] h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(184,90,52,0.18), transparent 68%)" }}
        animate={
          motionActive
            ? { x: [0, 86, 0], y: [0, 32, 0], scale: [0.96, 1.1, 0.96] }
            : undefined
        }
        transition={
          motionActive
            ? { duration: 18, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 bottom-[-18%] h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(212,185,154,0.16), transparent 70%)" }}
        animate={
          motionActive
            ? { x: [0, -64, 0], y: [0, -28, 0], scale: [1.05, 0.94, 1.05] }
            : undefined
        }
        transition={
          motionActive
            ? { duration: 21, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />

      <Container className="relative max-w-[92rem]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(28rem,1.12fr)] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-sandstone">
              Before we work together
            </p>
            <h2
              id="home-questions-title"
              className="mt-4 max-w-xl font-display text-[clamp(2.6rem,5vw,5.25rem)] font-normal leading-[0.96] tracking-[-0.025em] text-ivory"
            >
              Five practical doubts. One calmer decision.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-ivory/68 sm:text-base sm:leading-8">
              Scope, implementation, timing, distance, and fit should feel clear before money enters the room. The page answers each one in sequence.
            </p>

            <div className="mt-9 overflow-hidden rounded-[1.75rem] border border-ivory/12 bg-soil/54 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ivory/42">
                  Clarity field
                </p>
                <p className="text-[0.62rem] uppercase tracking-[0.14em] text-sandstone/70">
                  Five signals converge
                </p>
              </div>

              <div className="relative mt-3 aspect-[5/3] min-h-64 overflow-hidden rounded-2xl border border-ivory/8 bg-black/10">
                <svg
                  viewBox="0 0 500 280"
                  className="absolute inset-0 h-full w-full"
                  role="img"
                  aria-label="Scope, timing, implementation, distance, and fit converge into a clear starting decision"
                >
                  <defs>
                    <radialGradient id="question-field-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#D4B99A" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#D4B99A" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="250" cy="145" r="92" fill="url(#question-field-glow)" />
                  {PATHS.map((path, index) => (
                    <g key={path}>
                      <path
                        d={path}
                        fill="none"
                        stroke="rgba(244,239,230,0.10)"
                        strokeWidth="1"
                      />
                      <motion.path
                        d={path}
                        fill="none"
                        stroke={index % 2 === 0 ? "#D4B99A" : "#B85A34"}
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        pathLength="1"
                        strokeDasharray="0.08 0.12"
                        animate={
                          motionActive
                            ? { strokeDashoffset: [0, -1], opacity: [0.25, 0.85, 0.25] }
                            : { opacity: 0.32 }
                        }
                        transition={{
                          strokeDashoffset: {
                            duration: 4.8 + index * 0.35,
                            repeat: Infinity,
                            ease: "linear",
                          },
                          opacity: {
                            duration: 4.2,
                            delay: index * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                      />
                    </g>
                  ))}
                  <motion.circle
                    cx="250"
                    cy="145"
                    r="31"
                    fill="rgba(20,18,16,0.78)"
                    stroke="#D4B99A"
                    strokeWidth="1.2"
                    animate={
                      motionActive
                        ? { r: [29, 34, 29], opacity: [0.82, 1, 0.82] }
                        : undefined
                    }
                    transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </svg>

                {SIGNALS.map((signal, index) => (
                  <motion.div
                    key={signal.label}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                    style={{ left: `${signal.x}%`, top: `${signal.y}%` }}
                    animate={
                      motionActive
                        ? { y: [0, index % 2 === 0 ? -5 : 5, 0], opacity: [0.62, 1, 0.62] }
                        : undefined
                    }
                    transition={{
                      duration: 4.6 + index * 0.55,
                      delay: index * 0.28,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-sandstone/60 bg-soil"
                      style={{ boxShadow: "0 0 14px rgba(212,185,154,0.45)" }}
                    />
                    <span className="text-[0.55rem] font-medium uppercase tracking-[0.12em] text-ivory/58">
                      {signal.label}
                    </span>
                  </motion.div>
                ))}

                <div className="absolute left-1/2 top-[52%] w-28 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="font-display text-lg leading-tight text-ivory">Clear enough to begin</p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-ivory/48">
                Each answer removes one kind of uncertainty. The first conversation begins only after the practical shape is visible.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-ivory/14 bg-[#171512]/78 p-5 shadow-[0_34px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8 lg:p-9">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ivory/10 pb-7">
              <div>
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-sandstone">
                  Answers in motion
                </p>
                <p className="mt-2 max-w-md font-display text-3xl leading-tight text-ivory sm:text-4xl">
                  Read the question that matters now.
                </p>
              </div>
              <span className="text-[0.62rem] uppercase tracking-[0.14em] text-ivory/38">
                Select to hold
              </span>
            </div>

            <div className="mt-5">
              <FAQ questions={[...QUESTIONS]} tone="dark" />
            </div>

            <p className="mt-7 text-sm">
              <Link
                href="/services#book"
                className="link-underline text-ivory/62 hover:text-sandstone"
              >
                Bring another question to the first conversation
              </Link>
            </p>

            <div className="mt-8">
              <AuditInvite tone="dark" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
