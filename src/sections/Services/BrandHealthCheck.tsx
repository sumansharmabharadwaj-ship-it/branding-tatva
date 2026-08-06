"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { packages } from "@/data/services";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";
import { track } from "@/lib/analytics";
import { BrandHealthCheck as DesktopBrandHealthCheck } from "@/sections/Services/BrandHealthCheckDesktop";
import { HealthCheckMobileInstrument } from "@/sections/Services/HealthCheckMobileInstrument";

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
const MAX_SCORE = QUESTIONS.reduce(
  (sum, question) => sum + question.options[question.options.length - 1].points,
  0,
);

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

  const result = done ? bandFor(score) : null;
  const resultPackage = result
    ? packages.find((item) => item.slug === result.packageSlug)
    : undefined;
  const trendingBand = step >= Math.ceil(QUESTIONS.length / 2) ? bandFor(score) : null;

  return (
    <Container className="max-w-5xl">
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
    </Container>
  );
}

export function BrandHealthCheck() {
  return (
    <>
      <style>{`
        @media (max-width: 1023px) {
          #health {
            justify-content: flex-start !important;
            padding-top: 6rem !important;
            padding-bottom: 4rem !important;
          }
        }
      `}</style>
      <div className="lg:hidden">
        <MobileBrandHealthCheck />
      </div>
      <div data-health-desktop-layout="true" className="hidden lg:block">
        <DesktopBrandHealthCheck />
      </div>
    </>
  );
}
