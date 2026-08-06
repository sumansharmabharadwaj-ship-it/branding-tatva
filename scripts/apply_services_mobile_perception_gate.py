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

    old = '''  // Education: all four rungs are complete under reduced motion and can
  // still be inspected through a real expanded state.
  const education = page.locator("#education");
  await scrollTo(page, education, `${label}/education`);
  const rungButtons = education.locator('button[aria-expanded]');
  await waitForCount(rungButtons, 4, `${label}: perception rungs`);
  await assertTouchTargets(rungButtons, 40, `${label}: perception rungs`);
  const remembered = education.locator("button").filter({ hasText: "Remembered" }).first();
  await remembered.click();
  assert((await remembered.getAttribute("aria-expanded")) === "true", `${label}: perception rung did not expand`);
  await waitForVisibleText(education, "The brand comes to mind unprompted", `${label}: perception implication`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-education.png`);'''

    new = '''  // Education: mobile now spends one panel-height on the four-rung
  // ladder and places the 0.71% to 2.81% proof in one horizontal rail.
  // Desktop retains the scroll-linked ladder and sticky proof card.
  const education = page.locator("#education");
  await scrollTo(page, education, `${label}/education`);
  const mobilePerceptionDeck = education.locator('[data-perception-mobile-deck="true"]');
  const desktopPerceptionLadder = education.locator('[data-perception-desktop-ladder="true"]');

  if (viewport.width < 1024) {
    assert((await visibleCount(mobilePerceptionDeck)) === 1, `${label}: compact perception climb is not visible`);
    assert((await visibleCount(desktopPerceptionLadder)) === 0, `${label}: full desktop perception ladder still stacks on mobile`);

    const proofValues = mobilePerceptionDeck.locator('[data-perception-proof-value]');
    await waitForCount(proofValues, 2, `${label}: compact perception proof values`);
    const proofText = (await mobilePerceptionDeck.locator('[data-perception-proof="true"]').textContent()) || "";
    assert(
      proofText.includes("0.71%") && proofText.includes("2.81%"),
      `${label}: compact perception proof rail is incomplete`,
    );

    const rungTabs = mobilePerceptionDeck
      .getByRole("tablist", { name: "Perception ladder rungs" })
      .getByRole("tab");
    await waitForCount(rungTabs, 4, `${label}: compact perception rung tabs`);
    await assertTouchTargets(rungTabs, 40, `${label}: compact perception rung tabs`);
    assert((await rungTabs.first().getAttribute("aria-selected")) === "true", `${label}: Unknown rung is not selected initially`);

    const rungPanels = mobilePerceptionDeck.locator('[data-perception-rung-panel="true"]');
    await waitForCount(rungPanels, 4, `${label}: compact perception rung panels`);
    assert((await visibleCount(rungPanels)) === 1, `${label}: multiple perception rungs stack in the mobile scene`);

    const rememberedTab = mobilePerceptionDeck.getByRole("tab", { name: /03 Remembered/i });
    await rememberedTab.click();
    assert((await rememberedTab.getAttribute("aria-selected")) === "true", `${label}: Remembered rung did not activate`);
    assert(
      (await mobilePerceptionDeck.getAttribute("data-active-perception-index")) === "2",
      `${label}: compact perception climb did not reach Remembered`,
    );
    await waitForVisibleText(
      mobilePerceptionDeck.locator('[data-perception-rung="remembered"]'),
      "The brand comes to mind unprompted",
      `${label}: compact perception implication`,
    );

    const nextRung = mobilePerceptionDeck.locator('[data-perception-next="true"]');
    await assertTouchTargets(nextRung, 40, `${label}: perception next-rung control`);
    await nextRung.click();
    assert(
      (await mobilePerceptionDeck.getAttribute("data-active-perception-index")) === "3",
      `${label}: perception next-rung control did not advance`,
    );
    await waitForVisibleText(
      mobilePerceptionDeck.locator('[data-perception-rung="preferred"]'),
      "Comparison ends before it begins",
      `${label}: Preferred perception implication`,
    );
    await rememberedTab.click();
  } else {
    assert((await visibleCount(mobilePerceptionDeck)) === 0, `${label}: compact perception climb remains visible on desktop`);
    assert((await visibleCount(desktopPerceptionLadder)) === 1, `${label}: desktop perception ladder is hidden`);
    const rungButtons = desktopPerceptionLadder.locator('[data-perception-desktop-rung="true"]');
    await waitForCount(rungButtons, 4, `${label}: desktop perception rungs`);
    await assertTouchTargets(rungButtons, 40, `${label}: desktop perception rungs`);
    const remembered = desktopPerceptionLadder.locator("button").filter({ hasText: "Remembered" }).first();
    await remembered.click();
    assert((await remembered.getAttribute("aria-expanded")) === "true", `${label}: desktop perception rung did not expand`);
    await waitForVisibleText(
      desktopPerceptionLadder,
      "The brand comes to mind unprompted",
      `${label}: desktop perception implication`,
    );
    const desktopProof = desktopPerceptionLadder.locator('[data-perception-desktop-proof="true"]');
    const desktopProofText = (await desktopProof.textContent()) || "";
    assert(
      desktopProofText.includes("0.71%") && desktopProofText.includes("2.81%"),
      `${label}: desktop perception proof is incomplete`,
    );
  }

  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-education.png`);'''

    text = replace_once(text, old, new, "compact perception climb browser audit")
    text = replace_once(
        text,
        '    perceptionRungs: 4,\n    deliverables: 14,',
        '    perceptionRungs: 4,\n    perceptionProofValues: 2,\n    compactPerceptionClimb: true,\n    deliverables: 14,',
        "compact perception result fields",
    )
    path.write_text(text)

    updated = path.read_text()
    for needle in (
        'data-perception-mobile-deck="true"',
        "full desktop perception ladder still stacks on mobile",
        "perception next-rung control did not advance",
        "compactPerceptionClimb: true",
    ):
        if needle not in updated:
            raise SystemExit(f"Missing compact perception gate contract: {needle}")

    print("Services compact mobile perception gate applied.")


if __name__ == "__main__":
    main()
