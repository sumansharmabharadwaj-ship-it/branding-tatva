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

    old = '''  // Audit: five useful checks are public and every consent input is
  // present before the optional unlock action.
  const audit = page.locator("#audit");
  await scrollTo(page, audit, `${label}/audit`);
  const auditItems = audit.locator("ol > li");
  await waitForCount(auditItems, 5, `${label}: public recognition checks`);
  const firstName = audit.getByLabel("First name", { exact: true });
  const email = audit.getByLabel("Email", { exact: true });
  const business = audit.getByLabel("Business name, optional", { exact: true });
  const consent = audit.getByRole("checkbox");
  assert((await firstName.getAttribute("required")) !== null, `${label}: audit first name is not required`);
  assert((await email.getAttribute("required")) !== null, `${label}: audit email is not required`);
  assert((await consent.getAttribute("required")) !== null, `${label}: audit consent is not required`);
  assert((await business.getAttribute("required")) === null, `${label}: optional business name became required`);
  const auditSubmit = audit.getByRole("button", { name: "Open the full audit", exact: true });
  await assertTouchTargets(auditSubmit, 40, `${label}: audit submit`);
  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-recognition-audit.png`);'''

    new = '''  // Audit: desktop keeps the useful checks and consent form together.
  // Mobile spends one frame on the five public checks and swaps to the
  // unlock form only after an explicit choice, preserving the same
  // consent contract without stacking both chapters vertically.
  const audit = page.locator("#audit");
  await scrollTo(page, audit, `${label}/audit`);
  const auditDesk = audit.locator('[data-recognition-audit-desk="true"]');
  await auditDesk.waitFor({ state: "visible", timeout: 8_000 });
  assert(
    (await auditDesk.getAttribute("data-mobile-chapter")) === "checks",
    `${label}: Recognition Audit does not open on the public checks`,
  );

  const checksPanel = audit.locator('[data-audit-chapter="checks"]');
  const unlockPanel = audit.locator('[data-audit-chapter="unlock"]');
  const publicChecks = audit.locator('[data-public-audit-checks="true"] > li');
  await waitForCount(publicChecks, 5, `${label}: public recognition checks`);
  const auditForm = audit.locator('[data-recognition-audit-form="true"]');
  const firstName = auditForm.getByLabel("First name", { exact: true });
  const email = auditForm.getByLabel("Email", { exact: true });
  const business = auditForm.getByLabel("Business name, optional", { exact: true });
  const consent = auditForm.getByRole("checkbox");
  assert((await firstName.getAttribute("required")) !== null, `${label}: audit first name is not required`);
  assert((await email.getAttribute("required")) !== null, `${label}: audit email is not required`);
  assert((await consent.getAttribute("required")) !== null, `${label}: audit consent is not required`);
  assert((await business.getAttribute("required")) === null, `${label}: optional business name became required`);
  const auditSubmit = auditForm.getByRole("button", { name: "Open the full audit", exact: true });

  // The tablist is intentionally display:none from the lg breakpoint.
  // A CSS locator verifies the two-tab DOM contract in every viewport;
  // visibleCount below verifies that desktop does not expose it.
  const auditChapterTabs = audit.locator(
    '[role="tablist"][aria-label="Recognition Audit chapters"] [role="tab"]',
  );
  await waitForCount(auditChapterTabs, 2, `${label}: Recognition Audit chapters`);

  if (viewport.width < 1024) {
    await assertTouchTargets(auditChapterTabs, 40, `${label}: Recognition Audit chapter tabs`);
    assert(
      (await auditChapterTabs.first().getAttribute("aria-selected")) === "true",
      `${label}: public-checks audit chapter is not selected initially`,
    );
    assert((await visibleCount(checksPanel)) === 1, `${label}: public checks are hidden initially on mobile`);
    assert((await visibleCount(unlockPanel)) === 0, `${label}: unlock form is stacked below public checks on mobile`);
    assert((await visibleCount(auditForm)) === 0, `${label}: audit form is visible before the visitor asks for it`);

    if (viewport.screenshots) {
      await captureViewport(page, `services-${viewport.name}-recognition-audit-checks.png`);
    }

    const unlockTab = audit.getByRole("tab", { name: "Unlock all ten", exact: true });
    await unlockTab.click();
    assert((await unlockTab.getAttribute("aria-selected")) === "true", `${label}: unlock chapter did not become selected`);
    assert(
      (await auditDesk.getAttribute("data-mobile-chapter")) === "unlock",
      `${label}: audit desk did not switch to the unlock chapter`,
    );
    assert((await visibleCount(checksPanel)) === 0, `${label}: public checks remain stacked above the mobile form`);
    assert((await visibleCount(unlockPanel)) === 1, `${label}: mobile unlock panel did not appear`);
    assert((await visibleCount(auditForm)) === 1, `${label}: mobile audit form did not appear`);
    await assertTouchTargets(auditSubmit, 40, `${label}: audit submit`);

    const auditBack = audit.getByRole("button", { name: "Back to the five open checks", exact: true });
    await assertTouchTargets(auditBack, 40, `${label}: Recognition Audit back control`);
    await auditBack.click();
    assert(
      (await auditDesk.getAttribute("data-mobile-chapter")) === "checks",
      `${label}: Recognition Audit cannot return to the public checks`,
    );
    assert((await visibleCount(checksPanel)) === 1, `${label}: public checks did not return after Back`);
    assert((await visibleCount(auditForm)) === 0, `${label}: audit form remained stacked after Back`);

    await unlockTab.click();
    await auditForm.waitFor({ state: "visible", timeout: 5_000 });
  } else {
    assert((await visibleCount(auditChapterTabs)) === 0, `${label}: mobile audit chapter tabs remain visible on desktop`);
    assert((await visibleCount(checksPanel)) === 1, `${label}: desktop public checks are hidden`);
    assert((await visibleCount(unlockPanel)) === 1, `${label}: desktop audit form is hidden`);
    assert((await visibleCount(auditForm)) === 1, `${label}: desktop audit form is unavailable`);
    await assertTouchTargets(auditSubmit, 40, `${label}: audit submit`);
  }

  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-recognition-audit.png`);'''

    text = replace_once(text, old, new, "Recognition Audit browser audit")
    text = replace_once(
        text,
        '    publicAuditChecks: 5,\n    strategyRoomQuestions: 3,',
        '    publicAuditChecks: 5,\n    recognitionAuditChapters: 2,\n    mobileAuditDesk: true,\n    strategyRoomQuestions: 3,',
        "Recognition Audit result fields",
    )

    path.write_text(text)

    updated = path.read_text()
    for needle in (
        'data-recognition-audit-desk="true"',
        "unlock form is stacked below public checks on mobile",
        "Recognition Audit cannot return to the public checks",
        "recognitionAuditChapters: 2",
        "mobileAuditDesk: true",
    ):
        if needle not in updated:
            raise SystemExit(f"Missing Recognition Audit gate contract: {needle}")

    print("Services mobile Recognition Audit gate applied.")


if __name__ == "__main__":
    main()
