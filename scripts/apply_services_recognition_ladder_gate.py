from pathlib import Path

path = Path("scripts/services_page_gate.cjs")
text = path.read_text()

replacements = [
    (
        "// Education: mobile now spends one panel-height on the four-rung\n  // ladder and places the 0.71% to 2.81% proof in one horizontal rail.",
        "// Education: mobile spends one panel-height on the complete five-stage\n  // ladder and places the qualified 0.71% to 2.81% signal in one horizontal rail.",
    ),
    ("waitForCount(rungTabs, 4,", "waitForCount(rungTabs, 5,"),
    ("waitForCount(rungPanels, 4,", "waitForCount(rungPanels, 5,"),
    ('name: /03 Remembered/i', 'name: /04 Remembered/i'),
    ('data-active-perception-index\")) === \"2\",\n      `${label}: compact perception climb did not reach Remembered`', 'data-active-perception-index\")) === \"3\",\n      `${label}: compact perception climb did not reach Remembered`'),
    ('data-active-perception-index\")) === \"3\",\n      `${label}: perception next-rung control did not advance`', 'data-active-perception-index\")) === \"4\",\n      `${label}: perception next-stage control did not advance`'),
    ("The brand comes to mind unprompted", "Mental availability starts carrying part of the sale."),
    ("Comparison ends before it begins", "Price no longer carries the whole decision."),
    ("waitForCount(rungButtons, 4,", "waitForCount(rungButtons, 5,"),
    ("    perceptionRungs: 4,", "    perceptionRungs: 5,\n    perceptionFieldsPerStage: 5,\n    recognitionProofQualified: true,"),
]

for old, new in replacements:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"expected one match for {old!r}, found {count}")
    text = text.replace(old, new, 1)

mobile_anchor = '''    await waitForVisibleText(
      mobilePerceptionDeck.locator('[data-perception-rung="remembered"]'),
      "Mental availability starts carrying part of the sale.",
      `${label}: compact perception implication`,
    );'''
mobile_checks = mobile_anchor + '''
    const rememberedPanel = mobilePerceptionDeck.locator('[data-perception-rung="remembered"]');
    await waitForVisibleText(rememberedPanel, "Who comes to mind when I need this?", `${label}: perception buyer question`);
    for (const selector of [
      '[data-perception-question="true"]',
      '[data-perception-branding-role="true"]',
      '[data-perception-marketing-role="true"]',
      '[data-perception-asset="true"]',
      '[data-perception-metric="true"]',
    ]) {
      assert((await visibleCount(rememberedPanel.locator(selector))) === 1, `${label}: perception field missing ${selector}`);
    }
    await waitForVisibleText(rememberedPanel, "Unaided recall", `${label}: perception useful metric`);'''
if text.count(mobile_anchor) != 1:
    raise SystemExit("mobile recognition anchor missing")
text = text.replace(mobile_anchor, mobile_checks, 1)

desktop_anchor = '''    await waitForVisibleText(
      desktopPerceptionLadder,
      "Mental availability starts carrying part of the sale.",
      `${label}: desktop perception implication`,
    );'''
desktop_checks = desktop_anchor + '''
    const desktopDetail = desktopPerceptionLadder.locator('[data-perception-desktop-detail="true"]');
    assert((await visibleCount(desktopDetail)) === 1, `${label}: desktop recognition detail is not singular`);
    for (const field of ["Buyer is asking", "Branding role", "Marketing role", "Asset to build", "Useful metric"]) {
      await waitForVisibleText(desktopDetail, field, `${label}: desktop recognition field ${field}`);
    }
    await waitForVisibleText(desktopDetail, "Unaided recall", `${label}: desktop recognition useful metric`);'''
if text.count(desktop_anchor) != 1:
    raise SystemExit("desktop recognition anchor missing")
text = text.replace(desktop_anchor, desktop_checks, 1)

proof_anchor = '''    assert(
      desktopProofText.includes("0.71%") && desktopProofText.includes("2.81%"),
      `${label}: desktop perception proof is incomplete`,
    );'''
proof_checks = proof_anchor + '''
    assert(desktopProofText.includes("not a direct measure of brand recall"), `${label}: recognition proof limitation is missing`);'''
if text.count(proof_anchor) != 1:
    raise SystemExit("recognition proof anchor missing")
text = text.replace(proof_anchor, proof_checks, 1)

path.write_text(text)
print("Five-stage Services recognition ladder browser contract applied.")
