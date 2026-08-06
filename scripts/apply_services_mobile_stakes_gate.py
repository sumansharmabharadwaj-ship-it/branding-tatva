from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def main() -> None:
    path = Path("scripts/services_page_gate.cjs")
    text = path.read_text()

    old = '''  const stakesHeading = page.getByRole("heading", { level: 2, name: /What weak branding actually costs/i }).first();
  const stakesSection = await ancestorSection(stakesHeading);
  await scrollTo(page, stakesSection, `${label}/stakes`);
  const stakesText = (await stakesSection.textContent()) || "";
  assert(stakesText.includes("Positioned generically") && stakesText.includes("Positioned distinctly"), `${label}: stakes comparison is incomplete`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-stakes.png`);'''

    new = '''  const stakesHeading = page.getByRole("heading", { level: 2, name: /What weak branding actually costs/i }).first();
  const stakesSection = await ancestorSection(stakesHeading);
  await scrollTo(page, stakesSection, `${label}/stakes`);
  const stakesText = (await stakesSection.textContent()) || "";
  assert(
    stakesText.includes("Positioned generically") && stakesText.includes("Positioned distinctly"),
    `${label}: stakes comparison is incomplete`,
  );

  const mobileStakesDeck = stakesSection.locator('[data-stakes-mobile-deck="true"]');
  const desktopStakesComparison = stakesSection.locator('[data-stakes-desktop-comparison="true"]');
  const desktopStakesCards = desktopStakesComparison.locator('[data-stakes-desktop-card]');
  await waitForCount(desktopStakesCards, 2, `${label}: desktop Stakes cards`);

  if (viewport.width < 1024) {
    assert((await visibleCount(mobileStakesDeck)) === 1, `${label}: compact Stakes deck is not visible`);
    assert((await visibleCount(desktopStakesComparison)) === 0, `${label}: both complete Stakes cards still stack on mobile`);

    const originPoints = mobileStakesDeck.locator('[data-stakes-origin="true"]');
    await waitForCount(originPoints, 4, `${label}: Stakes origin points`);

    const stakesTabs = mobileStakesDeck
      .getByRole("tablist", { name: "Brand positioning outcomes" })
      .getByRole("tab");
    await waitForCount(stakesTabs, 2, `${label}: Stakes outcome tabs`);
    await assertTouchTargets(stakesTabs, 40, `${label}: Stakes outcome tabs`);
    assert((await stakesTabs.first().getAttribute("aria-selected")) === "true", `${label}: generic Stakes path is not selected initially`);

    const stakesPanels = mobileStakesDeck.locator('[data-stakes-path-panel="true"]');
    await waitForCount(stakesPanels, 2, `${label}: Stakes outcome panels`);
    assert((await visibleCount(stakesPanels)) === 1, `${label}: both Stakes futures stack in the mobile scene`);

    const genericOutcomes = mobileStakesDeck.locator('[data-stakes-path="generic"] [data-stakes-outcome="true"]');
    const distinctOutcomes = mobileStakesDeck.locator('[data-stakes-path="distinct"] [data-stakes-outcome="true"]');
    await waitForCount(genericOutcomes, 4, `${label}: generic Stakes outcomes`);
    await waitForCount(distinctOutcomes, 4, `${label}: distinct Stakes outcomes`);
    await waitForVisibleText(
      mobileStakesDeck.locator('[data-stakes-path="generic"]'),
      "Marketing spend replaces recognition instead of building on it.",
      `${label}: generic Stakes outcome`,
    );

    const distinctTab = mobileStakesDeck.getByRole("tab", { name: "Distinct future", exact: true });
    await distinctTab.click();
    assert((await distinctTab.getAttribute("aria-selected")) === "true", `${label}: distinct Stakes path did not activate`);
    assert(
      (await mobileStakesDeck.getAttribute("data-active-stakes-path")) === "distinct",
      `${label}: compact Stakes deck did not record the distinct path`,
    );
    assert((await visibleCount(stakesPanels)) === 1, `${label}: Stakes panels stack after the path changes`);
    await waitForVisibleText(
      mobileStakesDeck.locator('[data-stakes-path="distinct"]'),
      "Marketing spend compounds instead of starting over each time.",
      `${label}: distinct Stakes outcome`,
    );

    const stakesSwitch = mobileStakesDeck.locator('[data-stakes-path-switch="true"]');
    await assertTouchTargets(stakesSwitch, 40, `${label}: Stakes path switch`);
    await stakesSwitch.click();
    assert(
      (await mobileStakesDeck.getAttribute("data-active-stakes-path")) === "generic",
      `${label}: Stakes path switch cannot return to the generic future`,
    );
    await distinctTab.click();
  } else {
    assert((await visibleCount(mobileStakesDeck)) === 0, `${label}: compact Stakes deck remains visible on desktop`);
    assert((await visibleCount(desktopStakesComparison)) === 1, `${label}: desktop Stakes comparison is hidden`);
    assert((await visibleCount(desktopStakesCards)) === 2, `${label}: desktop Stakes lost a comparison card`);
    assert(
      (await visibleCount(stakesSection.locator('[data-stakes-desktop-origins="true"]'))) === 1,
      `${label}: desktop Stakes origin index is hidden`,
    );
    const stakesCardBoxes = await desktopStakesCards.evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }),
    );
    const stakesY = stakesCardBoxes.map((box) => box.y);
    assert(
      Math.max(...stakesY) - Math.min(...stakesY) < 3,
      `${label}: desktop Stakes cards no longer share one row ${JSON.stringify(stakesCardBoxes)}`,
    );
  }

  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-stakes.png`);'''

    text = replace_once(text, old, new, "compact Stakes browser audit")
    text = replace_once(
        text,
        '    compactSectionGuide: true,\n    perceptionRungs: 4,',
        '    compactSectionGuide: true,\n    stakesOrigins: 4,\n    stakesPaths: 2,\n    compactStakesDeck: true,\n    perceptionRungs: 4,',
        "compact Stakes result fields",
    )
    path.write_text(text)

    updated = path.read_text()
    for needle in (
        'data-stakes-mobile-deck="true"',
        "both complete Stakes cards still stack on mobile",
        "Stakes path switch cannot return to the generic future",
        "compactStakesDeck: true",
    ):
        if needle not in updated:
            raise SystemExit(f"Missing compact Stakes gate contract: {needle}")

    print("Services compact mobile Stakes gate applied.")


if __name__ == "__main__":
    main()
