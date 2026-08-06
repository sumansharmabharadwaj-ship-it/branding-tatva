from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


MOBILE_COMPONENT = r'''"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AnimatedStat } from "@/components/AnimatedStat";
import { LinkButton } from "@/components/Button";

type HealthOption = {
  readonly label: string;
  readonly points: number;
};

type HealthQuestion = {
  readonly prompt: string;
  readonly options: readonly HealthOption[];
};

type HealthBand = {
  readonly max: number;
  readonly title: string;
  readonly detail: string;
  readonly packageSlug: string;
};

type HealthPackage = {
  readonly name: string;
  readonly color: string;
  readonly slug: string;
};

type HealthCheckMobileInstrumentProps = {
  questions: readonly HealthQuestion[];
  bands: readonly HealthBand[];
  themes: readonly string[];
  answers: readonly number[];
  step: number;
  selected: string | null;
  done: boolean;
  score: number;
  maxScore: number;
  result: HealthBand | null | undefined;
  resultPackage: HealthPackage | undefined;
  trendingBand: HealthBand | null | undefined;
  reduced: boolean;
  onAnswer: (label: string, points: number) => void;
  onBack: () => void;
  onReset: () => void;
};

function MobileDiagnosticRings({
  answers,
  step,
  themes,
  reduced,
}: {
  answers: readonly number[];
  step: number;
  themes: readonly string[];
  reduced: boolean;
}) {
  const radii = [7, 12, 17, 22];
  const label = step >= themes.length ? "Complete" : themes[Math.min(step, themes.length - 1)];

  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden="true">
        {radii.map((radius, index) => {
          const circumference = 2 * Math.PI * radius;
          const answered = index < answers.length;
          const fraction = answered ? Math.max(answers[index] / 3, 0.07) : 0;
          return (
            <g key={radius}>
              <circle
                cx="26"
                cy="26"
                r={radius}
                fill="none"
                stroke="rgba(244,239,230,0.12)"
                strokeWidth="1.35"
                strokeDasharray={index === step && !answered ? "2 3" : undefined}
              />
              <motion.circle
                cx="26"
                cy="26"
                r={radius}
                fill="none"
                stroke="#E4D9B4"
                strokeWidth="1.35"
                strokeLinecap="round"
                transform="rotate(-90 26 26)"
                strokeDasharray={circumference}
                initial={false}
                animate={{ strokeDashoffset: circumference * (1 - fraction) }}
                transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
              />
            </g>
          );
        })}
        <circle cx="26" cy="26" r="1.8" fill="#E4D9B4" />
      </svg>
      <span className="max-w-16 text-center text-[0.54rem] font-medium uppercase leading-tight tracking-[0.12em] text-ivory/55">
        {label}
      </span>
    </div>
  );
}

function OutcomeMap({
  bands,
  activeBand,
}: {
  bands: readonly HealthBand[];
  activeBand: HealthBand | null | undefined;
}) {
  return (
    <div
      data-health-outcome-map="true"
      data-health-trend-state={activeBand ? "visible" : "pending"}
      data-health-active-band={activeBand?.title ?? "pending"}
      className="mt-5 rounded-2xl border border-ivory/12 bg-black/15 p-3.5"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ivory/50">Direction map</p>
        <p data-health-trend="true" aria-live="polite" className="text-right text-xs text-ivory/75">
          {activeBand ? activeBand.title : "Two answers reveal a direction"}
        </p>
      </div>
      <div role="list" aria-label="Possible brand health directions" className="mt-3 grid grid-cols-3 gap-1.5">
        {bands.map((band, index) => {
          const active = activeBand?.title === band.title;
          return (
            <div
              key={band.title}
              role="listitem"
              data-health-outcome-band={band.title}
              data-health-band-active={active ? "true" : "false"}
              aria-current={active ? "step" : undefined}
              className={`relative min-h-14 rounded-xl border px-2 py-2 transition-colors duration-300 ${
                active
                  ? "border-sandstone/70 bg-sandstone/12 text-ivory"
                  : "border-ivory/10 text-ivory/42"
              }`}
            >
              <span className="block text-[0.54rem] font-medium uppercase tracking-[0.12em]">0{index + 1}</span>
              <span className="mt-1 block text-[0.68rem] leading-tight">{band.title}</span>
              {active && <span aria-hidden="true" className="absolute inset-x-2 bottom-0 h-px bg-sandstone" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HealthCheckMobileInstrument({
  questions,
  bands,
  themes,
  answers,
  step,
  selected,
  done,
  score,
  maxScore,
  result,
  resultPackage,
  trendingBand,
  reduced,
  onAnswer,
  onBack,
  onReset,
}: HealthCheckMobileInstrumentProps) {
  const activeBand = result ?? trendingBand;
  const strongest = answers.length === themes.length ? Math.max(...answers) : null;
  const weakest = answers.length === themes.length ? Math.min(...answers) : null;
  const hasSpread = strongest !== null && weakest !== null && strongest > weakest;

  return (
    <motion.section
      data-health-mobile-instrument="true"
      data-health-step={String(step)}
      data-health-done={done ? "true" : "false"}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: reduced ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="lg:hidden"
    >
      <div className="rounded-[1.75rem] border border-ivory/14 bg-[rgba(12,19,15,0.78)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ivory/60">Self assessment</p>
            <h2 className="mt-1.5 font-display text-[1.72rem] font-normal leading-[1.05] text-ivory">
              A quick brand health check.
            </h2>
            <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-ivory/72">
              Four questions. One live diagnostic.
            </p>
          </div>
          <MobileDiagnosticRings answers={answers} step={step} themes={themes} reduced={reduced} />
        </div>

        <div
          role="progressbar"
          aria-label="Brand health check progress"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={Math.min(step, questions.length)}
          className="mt-4 grid grid-cols-4 gap-1.5"
        >
          {themes.map((theme, index) => {
            const complete = index < answers.length;
            const current = index === step && !done;
            return (
              <div key={theme} data-health-theme={theme} className="min-w-0">
                <div
                  className={`h-1 rounded-full transition-colors duration-300 ${
                    complete ? "bg-sandstone" : current ? "bg-ivory/38" : "bg-ivory/10"
                  }`}
                />
                <span className={`mt-1 block truncate text-[0.52rem] uppercase tracking-[0.09em] ${complete || current ? "text-ivory/65" : "text-ivory/30"}`}>
                  {theme}
                </span>
              </div>
            );
          })}
        </div>

        <div data-health-question-stage="true" className="relative mt-5 min-h-[18rem] border-t border-ivory/10 pt-5" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {!done ? (
              <motion.div
                key={`question-${step}`}
                data-health-question-panel="true"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -5 }}
                transition={{ duration: reduced ? 0 : 0.28 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ivory/52">
                    Question {step + 1} of {questions.length}
                  </p>
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-ivory/65 transition-colors hover:bg-ivory/[0.05] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                    >
                      Back
                    </button>
                  )}
                </div>
                <p className="mt-1.5 font-display text-xl font-normal leading-snug text-ivory">
                  {questions[step].prompt}
                </p>
                <div className="mt-4 space-y-2">
                  {questions[step].options.map((option) => {
                    const active = selected === option.label;
                    return (
                      <motion.button
                        key={option.label}
                        type="button"
                        onClick={() => onAnswer(option.label, option.points)}
                        aria-pressed={active}
                        disabled={Boolean(selected)}
                        whileTap={reduced ? undefined : { scale: 0.985 }}
                        className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[0.86rem] leading-snug transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone disabled:cursor-wait ${
                          active
                            ? "border-sandstone bg-sandstone/14 text-ivory"
                            : "border-ivory/14 bg-black/10 text-ivory/82 hover:border-ivory/35 hover:bg-ivory/[0.04]"
                        }`}
                      >
                        <span>{option.label}</span>
                        <motion.span
                          aria-hidden="true"
                          initial={false}
                          animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
                          transition={{ duration: reduced ? 0 : 0.16 }}
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
                data-health-result="true"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.32 }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ivory/52">Where this points</p>
                  <p className="font-display text-sm text-ivory/70">
                    <AnimatedStat value={String(score)} />
                    <span className="text-ivory/55">/{maxScore}</span>
                  </p>
                </div>
                <p className="mt-2 font-display text-2xl font-normal text-ivory">{result?.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ivory/82">{result?.detail}</p>
                {hasSpread && strongest !== null && weakest !== null && (
                  <p className="mt-3 text-xs leading-relaxed text-ivory/65">
                    Strongest signal: {themes[answers.indexOf(strongest)].toLowerCase()}. Clearest gap: {themes[answers.indexOf(weakest)].toLowerCase()}.
                  </p>
                )}
                {resultPackage && (
                  <p className="mt-3 text-xs text-ivory/60">
                    Closest real match: <span className="text-ivory/90">{resultPackage.name}</span>
                  </p>
                )}
                <div className="mt-5 grid gap-2.5">
                  <LinkButton href="#book" className="w-full justify-center">Book a Brand Strategy Session</LinkButton>
                  <LinkButton href="#desire" variant="secondary" className="w-full justify-center border-ivory/30 text-ivory hover:bg-ivory/10">
                    See that package
                  </LinkButton>
                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm text-ivory/65 transition-colors hover:bg-ivory/[0.05] hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sandstone"
                  >
                    Start over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <OutcomeMap bands={bands} activeBand={activeBand} />
      </div>
    </motion.section>
  );
}
'''


def write_mobile_component() -> None:
    path = Path("src/sections/Services/HealthCheckMobileInstrument.tsx")
    if path.exists():
        raise SystemExit(f"{path} already exists")
    path.write_text(MOBILE_COMPONENT)


def update_health_check() -> None:
    path = Path("src/sections/Services/BrandHealthCheck.tsx")
    text = path.read_text()

    text = replace_once(
        text,
        'import { AnimatedStat } from "@/components/AnimatedStat";\n',
        'import { AnimatedStat } from "@/components/AnimatedStat";\nimport { HealthCheckMobileInstrument } from "@/sections/Services/HealthCheckMobileInstrument";\n',
        "Health Check mobile instrument import",
    )

    text = replace_once(
        text,
        '''  return (
    <Container className="max-w-5xl">
      {/* Direct feedback (screenshot) that this section, like the FAQ''',
        '''  return (
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

      {/* Direct feedback (screenshot) that this section, like the FAQ''',
        "Health Check mobile instrument insertion",
    )

    text = replace_once(
        text,
        '      <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,19rem)] lg:gap-16">',
        '      <div data-health-desktop-layout="true" className="hidden gap-12 lg:grid lg:grid-cols-[1fr_minmax(0,19rem)] lg:gap-16">',
        "Health Check desktop layout breakpoint",
    )

    path.write_text(text)


def update_services_page() -> None:
    path = Path("src/app/services/page.tsx")
    text = path.read_text()
    text = replace_once(
        text,
        '<section id="health" data-services-scene="health" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"',
        '<section id="health" data-services-scene="health" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-start overflow-hidden pb-16 pt-24 sm:py-20 lg:justify-center lg:py-24"',
        "Health Check mobile alignment",
    )
    path.write_text(text)


def update_services_gate() -> None:
    path = Path("scripts/services_page_gate.cjs")
    text = path.read_text()

    old = '''  // Health check: an answer advances visibly and Back remains available.
  const health = page.locator("#health");
  await scrollTo(page, health, `${label}/health`);
  const firstQuestionButtons = health.locator('button[aria-pressed]');
  await waitForCount(firstQuestionButtons, 4, `${label}: health-check first question`);
  await assertTouchTargets(firstQuestionButtons, 40, `${label}: health-check answers`);
  const clearPositioning = health.getByRole("button", { name: "Clear and written down somewhere", exact: true });
  await clearPositioning.click();
  await waitForVisibleText(health, "How consistent does your brand look across channels?", `${label}: health-check second question`);
  assert((await health.getByRole("button", { name: "Back", exact: true }).count()) === 1, `${label}: health check cannot go back`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-health-check.png`);'''

    new = '''  // Health Check: mobile keeps the four-question diagnostic and the
  // three possible outcome bands inside one instrument. Desktop retains
  // the original question panel plus live outcome rail.
  const health = page.locator("#health");
  await scrollTo(page, health, `${label}/health`);
  const mobileHealthInstrument = health.locator('[data-health-mobile-instrument="true"]');
  const desktopHealthLayout = health.locator('[data-health-desktop-layout="true"]');

  if (viewport.width < 1024) {
    assert((await visibleCount(mobileHealthInstrument)) === 1, `${label}: compact Health Check instrument is hidden`);
    assert((await visibleCount(desktopHealthLayout)) === 0, `${label}: desktop Health Check still stacks on mobile`);

    const instrumentBox = await mobileHealthInstrument.boundingBox();
    assert(
      instrumentBox && instrumentBox.y >= 72 && instrumentBox.y <= 210,
      `${label}: Health Check instrument is not anchored beneath the fixed header ${JSON.stringify(instrumentBox)}`,
    );
    assert(
      instrumentBox && instrumentBox.height <= viewport.height - 55,
      `${label}: Health Check first question exceeds one mobile frame ${JSON.stringify(instrumentBox)}`,
    );

    const outcomeBands = mobileHealthInstrument.locator('[data-health-outcome-band]');
    await waitForCount(outcomeBands, 3, `${label}: Health Check outcome bands`);
    assert(
      (await mobileHealthInstrument.locator('[data-health-outcome-map="true"]').getAttribute("data-health-trend-state")) === "pending",
      `${label}: Health Check claims a direction before two answers`,
    );

    let questionButtons = mobileHealthInstrument.locator('[data-health-question-panel="true"] button[aria-pressed]');
    await waitForCount(questionButtons, 4, `${label}: Health Check first question`);
    await assertTouchTargets(questionButtons, 40, `${label}: Health Check answers`);

    const clearPositioning = mobileHealthInstrument.getByRole("button", { name: "Clear and written down somewhere", exact: true });
    await clearPositioning.click();
    await waitForVisibleText(
      mobileHealthInstrument,
      "How consistent does your brand look across channels?",
      `${label}: Health Check second question`,
    );
    assert((await mobileHealthInstrument.getAttribute("data-health-step")) === "1", `${label}: Health Check did not advance to step two`);

    const healthBack = mobileHealthInstrument.getByRole("button", { name: "Back", exact: true });
    await assertTouchTargets(healthBack, 40, `${label}: Health Check Back control`);
    await healthBack.click();
    await waitForVisibleText(
      mobileHealthInstrument,
      "How would you describe your positioning right now?",
      `${label}: Health Check first question after Back`,
    );
    assert((await mobileHealthInstrument.getAttribute("data-health-step")) === "0", `${label}: Health Check Back did not restore step one`);

    await clearPositioning.click();
    await waitForVisibleText(
      mobileHealthInstrument,
      "How consistent does your brand look across channels?",
      `${label}: Health Check second question after replay`,
    );
    const consistentEverywhere = mobileHealthInstrument.getByRole("button", {
      name: "Consistent everywhere, reviewed on a real schedule",
      exact: true,
    });
    await consistentEverywhere.click();
    await waitForVisibleText(
      mobileHealthInstrument,
      "How would a stranger describe what you sell, in one sentence?",
      `${label}: Health Check third question`,
    );
    const outcomeMap = mobileHealthInstrument.locator('[data-health-outcome-map="true"]');
    assert((await outcomeMap.getAttribute("data-health-trend-state")) === "visible", `${label}: Health Check direction did not unlock after two answers`);
    assert((await outcomeMap.getAttribute("data-health-active-band")) === "Building consistency", `${label}: Health Check live direction is incorrect`);
    assert(
      (await visibleCount(mobileHealthInstrument.locator('[data-health-band-active="true"]'))) === 1,
      `${label}: Health Check highlights more than one direction`,
    );

    if (viewport.screenshots) {
      await captureViewport(page, `services-${viewport.name}-health-check-question.png`);
    }

    await mobileHealthInstrument.getByRole("button", { name: "They would get close", exact: true }).click();
    await waitForVisibleText(
      mobileHealthInstrument,
      "Do people choose you before comparing you to anyone else?",
      `${label}: Health Check fourth question`,
    );
    await mobileHealthInstrument.getByRole("button", { name: "Often", exact: true }).click();
    const healthResult = mobileHealthInstrument.locator('[data-health-result="true"]');
    await waitForVisibleText(healthResult, "Maintaining recognition", `${label}: Health Check result`);
    await waitForVisibleText(healthResult, "9/12", `${label}: Health Check score`);
    assert((await mobileHealthInstrument.getAttribute("data-health-done")) === "true", `${label}: Health Check did not complete`);
    assert((await outcomeMap.getAttribute("data-health-active-band")) === "Maintaining recognition", `${label}: Health Check outcome map did not settle on the result`);
    assert((await healthResult.getByRole("link", { name: "Book a Brand Strategy Session", exact: true }).count()) === 1, `${label}: Health Check result has no booking path`);
    assert((await healthResult.getByRole("link", { name: "See that package", exact: true }).count()) === 1, `${label}: Health Check result has no package path`);
    await assertTouchTargets(healthResult.getByRole("button", { name: "Start over", exact: true }), 40, `${label}: Health Check reset`);

    if (viewport.screenshots) {
      await captureViewport(page, `services-${viewport.name}-health-check.png`);
    }
  } else {
    assert((await visibleCount(mobileHealthInstrument)) === 0, `${label}: compact Health Check instrument remains visible on desktop`);
    assert((await visibleCount(desktopHealthLayout)) === 1, `${label}: desktop Health Check layout is hidden`);
    const firstQuestionButtons = desktopHealthLayout.locator('button[aria-pressed]');
    await waitForCount(firstQuestionButtons, 4, `${label}: desktop Health Check first question`);
    await assertTouchTargets(firstQuestionButtons, 40, `${label}: desktop Health Check answers`);
    const clearPositioning = desktopHealthLayout.getByRole("button", { name: "Clear and written down somewhere", exact: true });
    await clearPositioning.click();
    await waitForVisibleText(
      desktopHealthLayout,
      "How consistent does your brand look across channels?",
      `${label}: desktop Health Check second question`,
    );
    assert((await desktopHealthLayout.getByRole("button", { name: "Back", exact: true }).count()) === 1, `${label}: desktop Health Check cannot go back`);
    if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-health-check.png`);
  }'''

    text = replace_once(text, old, new, "Health Check browser contract")
    text = replace_once(
        text,
        '    healthQuestions: 4,\n    publicAuditChecks: 5,',
        '    healthQuestions: 4,\n    healthOutcomeBands: 3,\n    compactHealthInstrument: true,\n    healthResultVerified: true,\n    publicAuditChecks: 5,',
        "Health Check result fields",
    )
    path.write_text(text)


def validate() -> None:
    contracts = {
        Path("src/sections/Services/HealthCheckMobileInstrument.tsx"): [
            'data-health-mobile-instrument="true"',
            'data-health-outcome-map="true"',
            'data-health-result="true"',
            "Two answers reveal a direction",
        ],
        Path("src/sections/Services/BrandHealthCheck.tsx"): [
            "HealthCheckMobileInstrument",
            'data-health-desktop-layout="true"',
            "lg:grid",
        ],
        Path("src/app/services/page.tsx"): [
            'id="health" data-services-scene="health" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-start',
            "lg:justify-center",
        ],
        Path("scripts/services_page_gate.cjs"): [
            "Health Check first question exceeds one mobile frame",
            "Health Check direction did not unlock after two answers",
            "compactHealthInstrument: true",
            "healthResultVerified: true",
        ],
    }

    for path, needles in contracts.items():
        text = path.read_text()
        for needle in needles:
            if needle not in text:
                raise SystemExit(f"{path}: missing contract {needle!r}")


if __name__ == "__main__":
    write_mobile_component()
    update_health_check()
    update_services_page()
    update_services_gate()
    validate()
    print("Services mobile Health Check instrument applied.")
