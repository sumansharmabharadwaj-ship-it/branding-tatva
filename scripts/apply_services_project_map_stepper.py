from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def update_imagine_your_brand() -> None:
    path = Path("src/sections/Services/ImagineYourBrand.tsx")
    text = path.read_text()

    text = replace_once(text, "  JOURNEY_STAGES,\n", "", "obsolete journey-stage import")
    text = replace_once(text, "  CHANGE_INSIGHTS,\n", "", "obsolete change-insight import")
    text = replace_once(
        text,
        'import { WaystoneField, type Waystone } from "@/components/motion/WaystoneField";\n',
        'import type { Waystone } from "@/components/motion/WaystoneField";\n'
        'import { ProjectMapChoiceDeck } from "@/sections/Services/ProjectMapChoiceDeck";\n'
        'import { ProjectMapConsultationDeck } from "@/sections/Services/ProjectMapConsultationDeck";\n',
        "project-map component imports",
    )

    choices_start = text.find('      <div className="mt-8 grid gap-8 lg:grid-cols-2">')
    if choices_start < 0:
        raise SystemExit("project-map choice block start is missing")
    result_start = text.find('      <div aria-live="polite" className="mt-10 min-h-[200px]">', choices_start)
    if result_start < 0:
        raise SystemExit("project-map result block start is missing")
    choices_replacement = '''      <ProjectMapChoiceDeck
        situationStones={SITUATION_STONES}
        changeStones={CHANGE_STONES}
        situation={situation}
        change={change}
        recommendedChange={situation && !change ? RECOMMENDED_CHANGE[situation] : null}
        onSituation={(id) => pickSituation(id as SituationId)}
        onChange={(id) => pickChange(id as ChangeId)}
      />

'''
    text = text[:choices_start] + choices_replacement + text[result_start:]

    text = replace_once(
        text,
        '      <div aria-live="polite" className="mt-10 min-h-[200px]">',
        '      <div data-project-map-result="true" aria-live="polite" className="mt-8 min-h-[200px]">',
        "project-map result marker",
    )
    text = replace_once(
        text,
        'className="grid gap-8 rounded-2xl border border-ivory/15 p-6 backdrop-blur-md sm:p-8 lg:grid-cols-[1.3fr_1fr]"',
        'className="grid gap-6 rounded-2xl border border-ivory/15 p-5 backdrop-blur-md sm:p-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.72fr)]"',
        "project-map result grid",
    )

    insights_start = text.find('              <div>\n                {/* The first consultation before the consultation:')
    if insights_start < 0:
        raise SystemExit("project-map consultation block start is missing")
    package_start = text.find(
        '              <div className="border-t border-ivory/12 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">',
        insights_start,
    )
    if package_start < 0:
        raise SystemExit("project-map package column start is missing")
    insights_replacement = '''              <div>
                <ProjectMapConsultationDeck
                  situation={situation!}
                  change={change!}
                  map={map}
                  mapDeliverables={mapDeliverables}
                  packageColor={pkg.color}
                />
              </div>

'''
    text = text[:insights_start] + insights_replacement + text[package_start:]

    path.write_text(text)


def update_services_gate() -> None:
    path = Path("scripts/services_page_gate.cjs")
    text = path.read_text()

    old = '''  // Imagine Your Brand: two real choices must produce a complete map
  // before any form is needed.
  const imagine = page.locator("#imagine");
  await scrollTo(page, imagine, `${label}/imagine`);
  const situationStones = imagine.getByRole("group", { name: "Your situation" }).getByRole("button");
  const changeStones = imagine.getByRole("group", { name: "The change you want" }).getByRole("button");
  await waitForCount(situationStones, 6, `${label}: project-map situations`);
  await waitForCount(changeStones, 6, `${label}: project-map changes`);
  await assertTouchTargets(situationStones, 40, `${label}: project-map situations`);
  await assertTouchTargets(changeStones, 40, `${label}: project-map changes`);
  const launchStone = imagine.getByRole("button", { name: /Launching something new/i }).first();
  const positionStone = imagine.getByRole("button", { name: /A clearer position/i }).first();
  await launchStone.click();
  await positionStone.click();
  assert((await launchStone.getAttribute("aria-pressed")) === "true", `${label}: project-map situation is not pressed`);
  assert((await positionStone.getAttribute("aria-pressed")) === "true", `${label}: project-map change is not pressed`);
  const projectMap = imagine.locator('[aria-live="polite"]');
  await waitForVisibleText(projectMap, "The path that fits", `${label}: project map`);
  assert(
    /Foundation|Full Brand System|Brand Partnership/.test((await projectMap.textContent()) || ""),
    `${label}: project map has no real package recommendation`,
  );
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-project-map.png`);'''
    new = '''  // Imagine Your Brand: the two decisions now happen sequentially in
  // one screen-led deck. The complete consultation remains available in
  // eight indexed chapters instead of eight document-length blocks.
  const imagine = page.locator("#imagine");
  await scrollTo(page, imagine, `${label}/imagine`);
  const situationGroup = imagine.getByRole("group", { name: "Your situation" });
  const situationStones = situationGroup.getByRole("button");
  await waitForCount(situationStones, 6, `${label}: project-map situations`);
  await assertTouchTargets(situationStones, 40, `${label}: project-map situations`);
  const launchStone = situationGroup.getByRole("button", { name: /Launching something new/i }).first();
  await launchStone.click();

  const changeGroup = imagine.getByRole("group", { name: "The change you want" });
  const changeStones = changeGroup.getByRole("button");
  await waitForCount(changeStones, 6, `${label}: project-map changes`);
  await assertTouchTargets(changeStones, 40, `${label}: project-map changes`);
  const positionStone = changeGroup.getByRole("button", { name: /A clearer position/i }).first();
  await positionStone.click();

  const brief = imagine.locator('[data-project-map-brief="true"]');
  await waitForVisibleText(brief, "Launching something new", `${label}: project-map brief situation`);
  await waitForVisibleText(brief, "A clearer position", `${label}: project-map brief change`);

  const projectMap = imagine.locator('[data-project-map-result="true"]');
  await waitForVisibleText(projectMap, "The path that fits", `${label}: project map`);
  assert(
    /Foundation|Full Brand System|Brand Partnership/.test((await projectMap.textContent()) || ""),
    `${label}: project map has no real package recommendation`,
  );

  const insightTabs = imagine
    .getByRole("tablist", { name: "Project map consultation chapters" })
    .getByRole("tab");
  await waitForCount(insightTabs, 8, `${label}: project-map consultation chapters`);
  await assertTouchTargets(insightTabs, 40, `${label}: project-map consultation chapters`);
  const rootCauseTab = imagine.getByRole("tab", { name: "The likely root cause", exact: true });
  await rootCauseTab.click();
  const insightPanel = imagine.getByRole("tabpanel");
  await waitForVisibleText(
    insightPanel,
    "Design decisions are being made before the positioning decision",
    `${label}: project-map root-cause chapter`,
  );
  await scrollTo(page, projectMap, `${label}/project-map-result`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-project-map.png`);'''
    text = replace_once(text, old, new, "project-map browser audit")

    text = replace_once(
        text,
        '    projectMapChoices: 12,\n    healthQuestions: 4,',
        '    projectMapChoices: 12,\n    projectMapSteps: 2,\n    projectMapInsights: 8,\n    healthQuestions: 4,',
        "project-map audit result fields",
    )

    path.write_text(text)


def validate() -> None:
    contracts = {
        Path("src/sections/Services/ImagineYourBrand.tsx"): [
            "ProjectMapChoiceDeck",
            "ProjectMapConsultationDeck",
            'data-project-map-result="true"',
            "mapDeliverables={mapDeliverables}",
        ],
        Path("scripts/services_page_gate.cjs"): [
            "project-map consultation chapters",
            "projectMapSteps: 2",
            "projectMapInsights: 8",
        ],
    }
    for path, needles in contracts.items():
        text = path.read_text()
        for needle in needles:
            if needle not in text:
                raise SystemExit(f"{path}: missing contract {needle!r}")


if __name__ == "__main__":
    update_imagine_your_brand()
    update_services_gate()
    validate()
    print("Services project-map stepper applied.")
