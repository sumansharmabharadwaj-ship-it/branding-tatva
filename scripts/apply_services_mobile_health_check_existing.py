from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


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
    update_health_check()
    update_services_page()
    update_services_gate()
    validate()
    print("Services mobile Health Check source patches applied.")
