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

    old = '''  // Deliverables: every real item is reachable, filters are touch-safe,
  // and selecting one changes the practical explanation panel.
  const deliverablesHeading = page.getByRole("heading", { level: 2, name: "What you actually leave with.", exact: true });
  const deliverablesSection = await ancestorSection(deliverablesHeading);
  await scrollTo(page, deliverablesSection, `${label}/deliverables`);
  const scopeFilters = deliverablesSection.getByRole("group", { name: "Filter by scope group" }).getByRole("button");
  await waitForCount(scopeFilters, 6, `${label}: deliverable filters`);
  await assertTouchTargets(scopeFilters, 40, `${label}: deliverable filters`);
  const deliverableButtons = deliverablesSection.locator('ul[aria-label="Deliverables"] button');
  await waitForCount(deliverableButtons, 14, `${label}: deliverables`);
  await assertTouchTargets(deliverableButtons, 40, `${label}: deliverables`);
  const voiceDeliverable = deliverablesSection.getByRole("button", { name: "Voice & messaging alignment", exact: true });
  await voiceDeliverable.click();
  assert((await voiceDeliverable.getAttribute("aria-pressed")) === "true", `${label}: deliverable did not become selected`);
  const deliverablePanel = deliverablesSection.locator('[aria-live="polite"]');
  for (const labelText of ["What it is", "Why it matters", "How it gets used"]) {
    await waitForVisibleText(deliverablePanel, labelText, `${label}: deliverable detail ${labelText}`);
  }
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-deliverables.png`);'''

    new = '''  // Deliverables: the fourteen real artifacts are distributed across
  // five scope drawers, so only three or four occupy the scene at once.
  // What, why, and use remain inspectable through a second accessible
  // tab set instead of three vertically stacked explanation blocks.
  const deliverablesHeading = page.getByRole("heading", { level: 2, name: "What you actually leave with.", exact: true });
  const deliverablesSection = await ancestorSection(deliverablesHeading);
  await scrollTo(page, deliverablesSection, `${label}/deliverables`);
  const deliverablesExplorer = deliverablesSection.locator('[data-deliverables-explorer="drawers"]');
  assert(
    (await deliverablesExplorer.getAttribute("data-deliverable-total")) === "14",
    `${label}: deliverable total is no longer fourteen`,
  );

  const drawerTabs = deliverablesExplorer
    .getByRole("tablist", { name: "Deliverable scope drawers" })
    .getByRole("tab");
  await waitForCount(drawerTabs, 5, `${label}: deliverable drawers`);
  await assertTouchTargets(drawerTabs, 40, `${label}: deliverable drawers`);
  const drawerCounts = await drawerTabs.evaluateAll((nodes) =>
    nodes.map((node) => Number(node.getAttribute("data-deliverable-count") || 0)),
  );
  assert(
    drawerCounts.reduce((sum, count) => sum + count, 0) === 14,
    `${label}: deliverable drawer counts do not total fourteen ${JSON.stringify(drawerCounts)}`,
  );
  assert(
    (await drawerTabs.first().getAttribute("aria-selected")) === "true",
    `${label}: Foundation drawer is not selected initially`,
  );

  const foundationButtons = deliverablesExplorer.locator('ul[aria-label="Foundation deliverables"] button');
  await waitForCount(foundationButtons, 3, `${label}: Foundation deliverables`);
  await assertTouchTargets(foundationButtons, 40, `${label}: Foundation deliverables`);

  const activationDrawer = deliverablesExplorer.getByRole("tab", { name: /Activation drawer/i }).first();
  await activationDrawer.click();
  assert(
    (await activationDrawer.getAttribute("aria-selected")) === "true",
    `${label}: Activation drawer did not open`,
  );
  const activationButtons = deliverablesExplorer.locator('ul[aria-label="Activation deliverables"] button');
  await waitForCount(activationButtons, 3, `${label}: Activation deliverables`);
  await assertTouchTargets(activationButtons, 40, `${label}: Activation deliverables`);

  const voiceDeliverable = deliverablesExplorer.getByRole("button", { name: "Voice & messaging alignment", exact: true });
  await voiceDeliverable.click();
  assert((await voiceDeliverable.getAttribute("aria-pressed")) === "true", `${label}: deliverable did not become selected`);

  const deliverableDetail = deliverablesExplorer.locator('[data-deliverable-detail="true"]');
  const explanationTabs = deliverableDetail
    .getByRole("tablist", { name: "Deliverable explanation" })
    .getByRole("tab");
  await waitForCount(explanationTabs, 3, `${label}: deliverable explanation modes`);
  await assertTouchTargets(explanationTabs, 40, `${label}: deliverable explanation modes`);
  const explanationPanel = deliverableDetail.getByRole("tabpanel");
  await waitForVisibleText(
    explanationPanel,
    "One verbal identity translated into each channel's own working format.",
    `${label}: deliverable what-it-is explanation`,
  );
  const whyTab = deliverableDetail.getByRole("tab", { name: "Why it matters", exact: true });
  await whyTab.click();
  await waitForVisibleText(
    explanationPanel,
    "Consistency creates memory",
    `${label}: deliverable why-it-matters explanation`,
  );
  const useTab = deliverableDetail.getByRole("tab", { name: "How it gets used", exact: true });
  await useTab.click();
  await waitForVisibleText(
    explanationPanel,
    "Templates and rewrites the team applies the same week.",
    `${label}: deliverable usage explanation`,
  );
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-deliverables.png`);'''

    text = replace_once(text, old, new, "deliverables browser audit")
    text = replace_once(
        text,
        '    deliverables: 14,\n    projectMapChoices: 12,',
        '    deliverables: 14,\n    deliverableDrawers: 5,\n    deliverableExplanationModes: 3,\n    projectMapChoices: 12,',
        "deliverables audit result fields",
    )

    path.write_text(text)

    updated = path.read_text()
    for needle in (
        'data-deliverables-explorer="drawers"',
        "deliverable drawer counts do not total fourteen",
        "deliverableDrawers: 5",
        "deliverableExplanationModes: 3",
    ):
        if needle not in updated:
            raise SystemExit(f"Missing deliverables gate contract: {needle}")

    print("Services deliverables drawer gate applied.")


if __name__ == "__main__":
    main()
