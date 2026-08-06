"use client";

import { useState } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { packages } from "@/data/services";
import { track } from "@/lib/analytics";
import { BrandHealthCheck as DesktopBrandHealthCheck } from "./BrandHealthCheck";
import { HealthCheckMobileInstrument } from "./HealthCheckMobileInstrument";

// The desktop diagnostic already has the right split composition. Mobile
// needs a different authoring model: one live instrument rather than the
// question panel and outcome rail stacking into a long document. The
// controller keeps the same four real questions, transparent scoring,
// package mapping, analytics events, and delayed selected-state feedback.
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
    detail:
      "Real elements already exist, but they pull in different directions instead of one. Full Brand System brings them together.",
    packageSlug: "brand-clarity",
  },
  {
    max: 12,
    title: "Maintaining recognition",
    detail:
      "The foundation already holds. The work now is staying consistent as more goes out into the world. Brand Partnership does exactly that.",
    packageSlug: "brand-partnership",
  },
] as const;

const THEMES = ["Positioning", "Consistency", "Recognition", "Preference"] as const;
const MAX_SCORE = QUESTIONS.reduce((sum, question) => sum + question.options[question.options.length - 1].points, 0);

function bandFor(score: number) {
  return BANDS.find((band) => score <= band.max) ?? BANDS[BANDS.length - 1];
}

function MobileBrandHealthCheck() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();
  const done = step >= QUESTIONS.length;
  const score = answers.reduce((sum, points) => sum + points, 0);
  const result = done ? bandFor(score) : null;
  const resultPackage = result ? packages.find((pkg) => pkg.slug === result.packageSlug) : undefined;
  const trendingBand = step >= Math.ceil(QUESTIONS.length / 2) ? bandFor(score) : null;

  function answer(label: string, points: number) {
    if (selected) return;
    if (answers.length === 0) track("health_check_started");
    if (step === QUESTIONS.length - 1) track("health_check_completed");
    setSelected(label);
    window.setTimeout(
      () => {
        setAnswers((current) => [...current, points]);
        setStep((current) => current + 1);
        setSelected(null);
      },
      prefersReducedMotion ? 0 : 260,
    );
  }

  function back() {
    if (step === 0 || selected) return;
    setStep((current) => current - 1);
    setAnswers((current) => current.slice(0, -1));
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setSelected(null);
  }

  return (
    <HealthCheckMobileInstrument
      questions={QUESTIONS}
      bands={BANDS}
      themes={THEMES}
      answers={answers}
      step={step}
      selected={selected}
      done={done}
      score={score}
      maxScore={MAX_SCORE}
      result={result}
      resultPackage={resultPackage}
      trendingBand={trendingBand}
      reduced={Boolean(prefersReducedMotion)}
      onAnswer={answer}
      onBack={back}
      onReset={reset}
    />
  );
}

export function BrandHealthCheck() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop ? <DesktopBrandHealthCheck /> : <MobileBrandHealthCheck />;
}
