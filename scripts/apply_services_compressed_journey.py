from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def update_page() -> None:
    path = Path("src/app/services/page.tsx")
    text = path.read_text()

    text = replace_once(
        text,
        'import type { CSSProperties } from "react";\n',
        "",
        "obsolete CSSProperties import",
    )
    text = replace_once(
        text,
        'import { offerings } from "@/data/services";\n',
        "",
        "obsolete offerings import",
    )
    text = replace_once(
        text,
        'import { SituationPath } from "@/sections/Services/SituationPath";\n',
        'import { SituationPath } from "@/sections/Services/SituationPath";\n'
        'import { ServiceDisciplineExplorer } from "@/sections/Services/ServiceDisciplineExplorer";\n',
        "discipline explorer import",
    )

    scene_replacements = {
        '<section id="situation" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24"':
            '<section id="situation" data-services-scene="situation" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"',
        '<section id="offerings" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24"':
            '<section id="offerings" data-services-scene="offerings" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"',
        '<section id="desire" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24"':
            '<section id="desire" data-services-scene="desire" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"',
        '<section id="education" className="relative scroll-mt-24 overflow-hidden"':
            '<section id="education" data-services-scene="education" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden"',
        '<section id="imagine" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24"':
            '<section id="imagine" data-services-scene="imagine" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"',
        '<section id="health" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24"':
            '<section id="health" data-services-scene="health" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"',
        '<section id="audit" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24"':
            '<section id="audit" data-services-scene="audit" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"',
    }
    for old, new in scene_replacements.items():
        text = replace_once(text, old, new, f"screen-fit scene {old[:36]}")

    text = replace_once(
        text,
        '<section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.charcoal }}>\n'
        '          <SceneVeil color="#0E1714" />',
        '<section data-services-scene="verified-outcome" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.charcoal }}>\n'
        '          <SceneVeil color="#0E1714" />',
        "verified outcome screen fit",
    )
    text = replace_once(
        text,
        '<section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.stone }}>',
        '<section data-services-scene="stakes" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.stone }}>',
        "stakes screen fit",
    )
    text = replace_once(
        text,
        '<section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.study }}>',
        '<section data-services-scene="deliverables" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24" style={{ backgroundColor: MOOD.study }}>',
        "deliverables screen fit",
    )
    text = replace_once(
        text,
        'className="scroll-mt-24 pb-16 pt-24 sm:pb-20 sm:pt-32"',
        'className="flex min-h-[100svh] scroll-mt-24 flex-col justify-center pb-16 pt-24 sm:pb-20 sm:pt-32"',
        "Strategy Room screen fit",
    )

    offering_section = text.find('<section id="offerings" data-services-scene="offerings"')
    if offering_section < 0:
        raise SystemExit("offering explorer section marker is missing")
    offering_content = text.find('          <Container className="relative max-w-6xl">', offering_section)
    if offering_content < 0:
        raise SystemExit("offering explorer content start is missing")
    offering_handoff = text.find('          <SceneHandoff color="#0E1714" />', offering_content)
    if offering_handoff < 0:
        raise SystemExit("offering explorer handoff marker is missing")
    replacement = (
        '          <div className="relative w-full">\n'
        '            <ServiceDisciplineExplorer />\n'
        '          </div>\n'
    )
    text = text[:offering_content] + replacement + text[offering_handoff:]

    path.write_text(text)


def update_gate() -> None:
    path = Path("scripts/services_page_gate.cjs")
    text = path.read_text()

    text = replace_once(
        text,
        '  for (const id of SECTION_IDS) {\n'
        '    assert((await page.locator(`#${id}`).count()) === 1, `${label}: #${id} is missing or duplicated`);\n'
        '  }\n\n'
        '  const jumpNav = page.locator(\'nav[aria-label="Jump to section"]\');',
        '  for (const id of SECTION_IDS) {\n'
        '    assert((await page.locator(`#${id}`).count()) === 1, `${label}: #${id} is missing or duplicated`);\n'
        '  }\n\n'
        '  const screenFitScenes = page.locator("[data-services-scene]");\n'
        '  await waitForCount(screenFitScenes, 10, `${label}: screen-fit Services scenes`);\n'
        '  const sceneFloors = await screenFitScenes.evaluateAll((nodes) =>\n'
        '    nodes.map((node) => {\n'
        '      const rect = node.getBoundingClientRect();\n'
        '      return { name: node.getAttribute("data-services-scene") || "unnamed", height: rect.height };\n'
        '    }),\n'
        '  );\n'
        '  for (const scene of sceneFloors) {\n'
        '    assert(\n'
        '      scene.height >= viewport.height - 2,\n'
        '      `${label}: ${scene.name} scene is ${scene.height.toFixed(1)}px tall for a ${viewport.height}px viewport`,\n'
        '    );\n'
        '  }\n'
        '  const bookBox = await page.locator("#book").boundingBox();\n'
        '  assert(\n'
        '    bookBox && bookBox.height >= viewport.height - 2,\n'
        '    `${label}: Strategy Room is ${bookBox?.height ?? 0}px tall for a ${viewport.height}px viewport`,\n'
        '  );\n\n'
        '  const jumpNav = page.locator(\'nav[aria-label="Jump to section"]\');',
        "screen-fit scene audit",
    )

    old_offerings = '''  // Offerings: all six disciplines remain visible and the original
  // terrain film has a complete reduced-motion frame.
  const offerings = page.locator("#offerings");
  await scrollTo(page, offerings, `${label}/offerings`);
  const offeringCards = offerings.locator(".spotlight-card");
  await waitForCount(offeringCards, 6, `${label}: offerings`);
  const offeringColors = await offeringCards.evaluateAll((nodes) =>
    nodes.map((node) => node.style.getPropertyValue("--card-color").trim()),
  );
  assert(
    offeringColors.length === 6 && offeringColors.every(Boolean),
    `${label}: one or more offering rows have no discipline accent ${JSON.stringify(offeringColors)}`,
  );
  for (const service of [
    "Brand Strategy & Identity",
    "Content Strategy",
    "Social Media Marketing",
    "Website Development",
    "Content Creation",
    "Marketing Strategy",
  ]) {
    assert(((await offerings.textContent()) || "").includes(service), `${label}: offering ${service} is missing`);
  }
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-offerings.png`);'''
    new_offerings = '''  // Offerings: all six disciplines stay visible inside one compact
  // explorer, and changing a tab replaces the explanation without adding
  // six document-length rows to the journey.
  const offerings = page.locator("#offerings");
  await scrollTo(page, offerings, `${label}/offerings`);
  const disciplineTabs = offerings.getByRole("tab");
  await waitForCount(disciplineTabs, 6, `${label}: service-discipline tabs`);
  await assertTouchTargets(disciplineTabs, 40, `${label}: service-discipline tabs`);
  assert((await disciplineTabs.first().getAttribute("aria-selected")) === "true", `${label}: first discipline is not selected`);
  const websiteTab = offerings.getByRole("tab", { name: "Website Development", exact: true });
  await websiteTab.click();
  assert((await websiteTab.getAttribute("aria-selected")) === "true", `${label}: Website Development tab did not activate`);
  const disciplinePanel = offerings.getByRole("tabpanel");
  await waitForVisibleText(disciplinePanel, "The most visited stop on a customer's whole journey", `${label}: service-discipline panel`);
  for (const service of [
    "Brand Strategy & Identity",
    "Content Strategy",
    "Social Media Marketing",
    "Website Development",
    "Content Creation",
    "Marketing Strategy",
  ]) {
    assert(((await offerings.textContent()) || "").includes(service), `${label}: offering ${service} is missing`);
  }
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-offerings.png`);'''
    text = replace_once(text, old_offerings, new_offerings, "discipline explorer audit")

    text = replace_once(
        text,
        '  const desire = page.locator("#desire");\n'
        '  await scrollTo(page, desire, `${label}/desire`);\n'
        '  const packageCards = desire',
        '  const desire = page.locator("#desire");\n'
        '  await scrollTo(page, desire, `${label}/desire`);\n'
        '  const carriedPackage = desire.locator(\'[data-carried-package="true"]\');\n'
        '  await waitForVisibleText(carriedPackage, "Your earlier choice points to", `${label}: carried package recommendation`);\n'
        '  const foundationChoice = desire.locator("button").filter({ hasText: "Starting with an idea" }).first();\n'
        '  assert(\n'
        '    (await foundationChoice.getAttribute("aria-pressed")) === "true",\n'
        '    `${label}: Situation choice did not carry into Foundation`,\n'
        '  );\n'
        '  const packageCards = desire',
        "carried package audit",
    )
    text = replace_once(
        text,
        '  await unclearChoice.click();\n'
        '  assert(\n'
        '    (await unclearChoice.getAttribute("aria-pressed")) === "true",',
        '  await unclearChoice.click();\n'
        '  await page.waitForTimeout(120);\n'
        '  assert(!(await carriedPackage.isVisible().catch(() => false)), `${label}: carried recommendation did not clear after a manual package choice`);\n'
        '  assert(\n'
        '    (await unclearChoice.getAttribute("aria-pressed")) === "true",',
        "manual package override audit",
    )

    text = replace_once(
        text,
        '    offerings: 6,\n'
        '    packageChoices: 3,',
        '    offerings: 6,\n'
        '    screenFitScenes: 10,\n'
        '    carriedRecommendation: true,\n'
        '    packageChoices: 3,',
        "Services audit result fields",
    )

    path.write_text(text)


def validate() -> None:
    contracts = {
        Path("src/app/services/page.tsx"): [
            'ServiceDisciplineExplorer',
            'data-services-scene="offerings"',
            'min-h-[100svh]',
            '<ServiceDisciplineExplorer />',
        ],
        Path("scripts/services_page_gate.cjs"): [
            'service-discipline tabs',
            'carried package recommendation',
            'screenFitScenes: 10',
        ],
    }
    for path, needles in contracts.items():
        text = path.read_text()
        for needle in needles:
            if needle not in text:
                raise SystemExit(f"{path}: missing contract {needle!r}")


if __name__ == "__main__":
    update_page()
    update_gate()
    validate()
    print("Services compressed-journey pass applied.")
