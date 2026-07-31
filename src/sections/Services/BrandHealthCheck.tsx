"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
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

export function BrandHealthCheck() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  // Direct feedback that this quiz "isn't interactive" — a click landed
  // with no visible acknowledgement before the next question swapped in.
  // Tracking the just-clicked option separately lets the button itself
  // show a pressed state for a beat before advancing, real tactile
  // feedback rather than relying only on the AnimatePresence swap.
  const [selected, setSelected] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const done = step >= QUESTIONS.length;
  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.35 };

  function answer(label: string, points: number) {
    if (selected) return;
    setSelected(label);
    window.setTimeout(
      () => {
        setScore((s) => s + points);
        setStep((s) => s + 1);
        setSelected(null);
      },
      prefersReducedMotion ? 0 : 260
    );
  }

  function reset() {
    setStep(0);
    setScore(0);
    setSelected(null);
  }

  const result = done ? bandFor(score) : null;
  const resultPackage = result ? packages.find((p) => p.slug === result.packageSlug) : undefined;

  return (
    <Container className="max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-wide text-sandstone">Self-check</p>
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
              <p className="text-xs uppercase tracking-wide text-ivory/50">
                Question {step + 1} of {QUESTIONS.length}
              </p>
              <p className="mt-2 text-lg text-ivory">{QUESTIONS[step].prompt}</p>
              <div className="mt-5 space-y-2.5">
                {QUESTIONS[step].options.map((opt) => {
                  const isSelected = selected === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => answer(opt.label, opt.points)}
                      aria-pressed={isSelected}
                      className={`block w-full rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200 ${
                        isSelected
                          ? "border-sandstone bg-sandstone/15 text-ivory"
                          : "border-ivory/20 text-ivory/85 hover:border-ivory/45 hover:bg-ivory/5"
                      }`}
                    >
                      {opt.label}
                    </button>
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
              <p className="text-xs uppercase tracking-wide text-ivory/50">Where this points</p>
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
    </Container>
  );
}
