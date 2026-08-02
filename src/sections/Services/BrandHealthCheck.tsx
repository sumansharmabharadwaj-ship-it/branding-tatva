"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { AnimatedStat } from "@/components/AnimatedStat";
import { packages } from "@/data/services";

// A real, transparent scored self-assessment, not a fake "AI analyzes
// your brand" claim — every question and point value is visible in this
// file, and the three possible outcomes map directly to the same three
// real packages PackageSelector already shows (data/services.ts), never
// a fabricated recommendation. Different mechanism from PackageSelector
// on purpose: that section is a one-click "which of these three sounds
// like you," this is a slower, four-question pattern for a visitor who
// wants to think it through before the booking CTA further down the
// page.
const QUESTIONS = [
  {
    prompt: "How would you describe your positioning right now?",
    options: [
      { label: "Still deciding what we stand for", points: 0 },
      { label: "We have an idea, but it changes depending on who is asking", points: 1 },
      { label: "Clear and written down somewhere", points: 2 },
      { label: "Clear, and everyone on the team says it the same way", points: 3 },
    ],
  },
  {
    prompt: "How consistent does your brand look across channels?",
    options: [
      { label: "Every channel looks different", points: 0 },
      { label: "Mostly consistent, with some obvious gaps", points: 1 },
      { label: "Consistent, reviewed occasionally", points: 2 },
      { label: "Consistent everywhere, reviewed on a real schedule", points: 3 },
    ],
  },
  {
    prompt: "How would a stranger describe what you sell, in one sentence?",
    options: [
      { label: "They would probably struggle", points: 0 },
      { label: "They would get the category right, nothing more", points: 1 },
      { label: "They would get close", points: 2 },
      { label: "They would get it right, unprompted", points: 3 },
    ],
  },
  {
    prompt: "Do people choose you before comparing you to anyone else?",
    options: [
      { label: "Rarely", points: 0 },
      { label: "Sometimes", points: 1 },
      { label: "Often", points: 2 },
      { label: "Usually", points: 3 },
    ],
  },
] as const;

const BANDS = [
  {
    max: 3,
    title: "Foundation stage",
    detail: "The basics are still being decided. Foundation starts exactly here.",
    packageSlug: "brand-beginning",
  },
  {
    max: 7,
    title: "Building consistency",
    detail: "Real elements already exist, but they pull in different directions instead of one. Full Brand System brings them together.",
    packageSlug: "brand-clarity",
  },
  {
    max: 12,
    title: "Maintaining recognition",
    detail: "The foundation already holds. The work now is staying consistent as more goes out into the world. Brand Partnership does exactly that.",
    packageSlug: "brand-partnership",
  },
] as const;

function bandFor(score: number) {
  return BANDS.find((b) => score <= b.max) ?? BANDS[BANDS.length - 1];
}

const MAX_SCORE = QUESTIONS.reduce((sum, q) => sum + q.options[q.options.length - 1].points, 0);

export function BrandHealthCheck() {
  const [step, setStep] = useState(0);
  // Points per answered question, not a running total — storing each
  // answer separately (instead of just a summed score) is what makes
  // "Back" possible: going back a step needs to un-add exactly the
  // right amount, not guess at it.
  const [answers, setAnswers] = useState<number[]>([]);
  // Direct feedback that this quiz "isn't interactive" — a click landed
  // with no visible acknowledgement before the next question swapped in.
  // Tracking the just-clicked option separately lets the button itself
  // show a pressed state for a beat before advancing, real tactile
  // feedback rather than relying only on the AnimatePresence swap.
  const [selected, setSelected] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const done = step >= QUESTIONS.length;
  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.35 };
  const score = answers.reduce((sum, points) => sum + points, 0);

  function answer(label: string, points: number) {
    if (selected) return;
    setSelected(label);
    window.setTimeout(
      () => {
        setAnswers((a) => [...a, points]);
        setStep((s) => s + 1);
        setSelected(null);
      },
      prefersReducedMotion ? 0 : 260
    );
  }

  function back() {
    if (step === 0 || selected) return;
    setStep((s) => s - 1);
    setAnswers((a) => a.slice(0, -1));
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setSelected(null);
  }

  const result = done ? bandFor(score) : null;
  const resultPackage = result ? packages.find((p) => p.slug === result.packageSlug) : undefined;
  // Real, live-responsive companion for the right column — not a
  // decorative fill. As real answers accumulate, this highlights which
  // of the three actual outcome bands the current score is trending
  // toward, before the quiz is even finished. step > 0 guards against
  // showing a misleading "Foundation stage" trend at score 0 before any
  // question has been answered at all.
  const trendingBand = step > 0 ? bandFor(score) : null;

  return (
    <Container className="max-w-5xl">
      {/* Direct feedback (screenshot) that this section, like the FAQ
          before it, sat centered in a narrow column with the rest of a
          wide viewport left empty. The quiz itself is unchanged; a real
          companion — the three actual outcome bands, live-highlighting
          which one the visitor's real answers are trending toward —
          fills the second column instead, the same sticky-rail pattern
          already proven on Risk removal. */}
      <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,19rem)] lg:gap-16">
        {/* Glass reading surface (Phase 1, mandatory per brief) — the
            quiz sat directly on the stream footage; a soft
            forest-tinted panel keeps the video cinematic around it
            while the questions become the unambiguous focus. */}
        <motion.div
          // Phase 2 motion direction — "the instrument arrives": the
          // glass diagnostic panel slides laterally into position as
          // the section enters, the only lateral entrance on the page
          // — a device being set on the table, distinct from the
          // vertical rises everywhere else.
          initial={prefersReducedMotion ? undefined : { opacity: 0, x: -28 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl rounded-2xl p-6 backdrop-blur-md sm:p-8"
          style={{ backgroundColor: "rgba(20,26,21,0.55)" }}
        >
          {/* "Self-check" carried a rendered hyphen — a copywriting
              standard violation caught in the Phase 4 pass. */}
          <p className="text-sm font-medium uppercase tracking-wide text-ivory/70">Self assessment</p>
          <h2 className="mt-2 text-display-sm font-display font-normal text-ivory">
            A quick brand health check.
          </h2>
          <p className="mt-4 text-ivory/85">
            A real pattern, no invented analysis. {QUESTIONS.length} questions, about a minute.
          </p>

          {/* Progress bar — the other real, visible signal that a click
              registered, independent of the question-swap animation. */}
          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-ivory/10">
            <div
              className="h-full rounded-full bg-sandstone transition-[width] duration-500 ease-out"
              style={{ width: `${(Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100}%` }}
            />
          </div>

          <div className="relative mt-8 min-h-[260px]">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-ivory/50">
                  Question {step + 1} of {QUESTIONS.length}
                </p>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={back}
                    className="link-underline text-xs text-ivory/60 hover:text-ivory"
                  >
                    Back
                  </button>
                )}
              </div>
              <p className="mt-2 text-lg text-ivory">{QUESTIONS[step].prompt}</p>
              <div className="mt-5 space-y-2.5">
                {QUESTIONS[step].options.map((opt) => {
                  const isSelected = selected === opt.label;
                  return (
                    <motion.button
                      key={opt.label}
                      type="button"
                      onClick={() => answer(opt.label, opt.points)}
                      aria-pressed={isSelected}
                      whileHover={prefersReducedMotion || selected ? undefined : { x: 4 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors duration-200 ${
                        isSelected
                          ? "border-sandstone bg-sandstone/15 text-ivory"
                          : "border-ivory/20 text-ivory/85 hover:border-ivory/45 hover:bg-ivory/5"
                      }`}
                    >
                      <span>{opt.label}</span>
                      <motion.span
                        aria-hidden="true"
                        initial={false}
                        animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sandstone text-soil"
                      >
                        <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8.5L6.5 12L13 4.5" />
                        </svg>
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
              className="rounded-lg border-t-2 p-6 sm:p-8"
              style={{ borderColor: resultPackage?.color, backgroundColor: "rgba(244,239,230,0.04)" }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-xs uppercase tracking-wide text-ivory/50">Where this points</p>
                <p className="font-display text-sm text-ivory/70">
                  <AnimatedStat value={String(score)} />
                  <span className="text-ivory/50">/{MAX_SCORE}</span>
                </p>
              </div>
              <p className="mt-2 font-display text-xl font-normal text-ivory">{result?.title}</p>
              <p className="mt-3 text-ivory/85">{result?.detail}</p>
              {resultPackage && (
                <p className="mt-4 text-sm text-ivory/60">
                  Closest real match: <span className="text-ivory">{resultPackage.name}</span>
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <LinkButton href="#desire">See that package</LinkButton>
                <button
                  type="button"
                  onClick={reset}
                  className="link-underline text-sm text-ivory/70 hover:text-ivory"
                >
                  Start over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
          </div>
        </motion.div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          {/* A live diagnostic reads as live: the indicator breathes
              continuously, so the panel keeps feeling like an
              instrument watching the answers rather than a static
              legend once its entrance has played. */}
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ivory/60">
            <motion.span
              aria-hidden="true"
              animate={prefersReducedMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-sandstone"
            />
            Where this could point
          </p>
          <div className="mt-4 space-y-3">
            {BANDS.map((band) => {
              const isTrending = trendingBand?.title === band.title;
              return (
                <div
                  key={band.title}
                  className={`rounded-lg border p-4 transition-colors duration-500 ${
                    isTrending ? "border-sandstone bg-sandstone/10" : "border-ivory/10"
                  }`}
                >
                  <p className={`font-display text-lg font-normal ${isTrending ? "text-ivory" : "text-ivory/55"}`}>
                    {band.title}
                  </p>
                  <AnimatePresence>
                    {isTrending && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-1.5 overflow-hidden text-sm text-ivory/80"
                      >
                        {band.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </Container>
  );
}
