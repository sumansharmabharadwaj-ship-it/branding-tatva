from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def update_component() -> None:
    path = Path("src/sections/Services/RecognitionAudit.tsx")
    text = path.read_text()

    text = replace_once(
        text,
        '  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);\n'
        '  const prefersReducedMotion = useHydratedReducedMotion();\n'
        '  const unlocked = status === "done";\n\n'
        '  function selectChapter(index: number, focus = false) {\n'
        '    const nextIndex = (index + MOBILE_CHAPTERS.length) % MOBILE_CHAPTERS.length;\n'
        '    setMobileChapter(MOBILE_CHAPTERS[nextIndex].id);\n'
        '    if (focus) requestAnimationFrame(() => chapterRefs.current[nextIndex]?.focus());\n'
        '  }',
        '  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);\n'
        '  const mobileNavRef = useRef<HTMLDivElement>(null);\n'
        '  const prefersReducedMotion = useHydratedReducedMotion();\n'
        '  const unlocked = status === "done";\n\n'
        '  function openMobileChapter(nextChapter: MobileChapter) {\n'
        '    setMobileChapter(nextChapter);\n'
        '    if (typeof window === "undefined" || window.innerWidth >= 1024) return;\n'
        '    requestAnimationFrame(() => {\n'
        '      mobileNavRef.current?.scrollIntoView({\n'
        '        block: "start",\n'
        '        behavior: prefersReducedMotion ? "auto" : "smooth",\n'
        '      });\n'
        '    });\n'
        '  }\n\n'
        '  function selectChapter(index: number, focus = false) {\n'
        '    const nextIndex = (index + MOBILE_CHAPTERS.length) % MOBILE_CHAPTERS.length;\n'
        '    openMobileChapter(MOBILE_CHAPTERS[nextIndex].id);\n'
        '    if (focus) requestAnimationFrame(() => chapterRefs.current[nextIndex]?.focus());\n'
        '  }',
        "mobile chapter navigation helper",
    )

    text = replace_once(
        text,
        '          role="tablist"\n'
        '          aria-label="Recognition Audit chapters"\n'
        '          className="mb-7 grid grid-cols-2 gap-2 rounded-2xl border border-ivory/12 bg-ivory/[0.025] p-1.5 lg:hidden"',
        '          ref={mobileNavRef}\n'
        '          role="tablist"\n'
        '          aria-label="Recognition Audit chapters"\n'
        '          className="scroll-mt-24 mb-7 grid grid-cols-2 gap-2 rounded-2xl border border-ivory/14 bg-[rgba(18,20,18,0.9)] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:hidden"',
        "mobile audit navigation surface",
    )

    replacements = {
        '      setMobileChapter("checks");': '      openMobileChapter("checks");',
        '                  onClick={() => setMobileChapter("unlock")}': '                  onClick={() => openMobileChapter("unlock")}',
        '              onClick={() => setMobileChapter("checks")}': '              onClick={() => openMobileChapter("checks")}',
        '                    onClick={() => setMobileChapter("checks")}': '                    onClick={() => openMobileChapter("checks")}',
    }
    for old, new in replacements.items():
        count = text.count(old)
        if count < 1:
            raise SystemExit(f"chapter transition {old!r}: expected at least one match, found {count}")
        text = text.replace(old, new)

    path.write_text(text)


def update_page() -> None:
    path = Path("src/app/services/page.tsx")
    text = path.read_text()
    text = replace_once(
        text,
        '<section id="audit" data-services-scene="audit" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center overflow-hidden py-16 sm:py-20 lg:py-24"',
        '<section id="audit" data-services-scene="audit" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-start overflow-hidden pb-16 pt-24 sm:py-20 lg:justify-center lg:py-24"',
        "mobile audit top alignment",
    )
    path.write_text(text)


def update_gate() -> None:
    path = Path("scripts/services_page_gate.cjs")
    text = path.read_text()

    text = replace_once(
        text,
        '''  const auditChapterTabs = audit.locator(
    '[role="tablist"][aria-label="Recognition Audit chapters"] [role="tab"]',
  );
  await waitForCount(auditChapterTabs, 2, `${label}: Recognition Audit chapters`);

  if (viewport.width < 1024) {
    await assertTouchTargets(auditChapterTabs, 40, `${label}: Recognition Audit chapter tabs`);''',
        '''  const auditChapterNav = audit.locator(
    '[role="tablist"][aria-label="Recognition Audit chapters"]',
  );
  const auditChapterTabs = auditChapterNav.locator('[role="tab"]');
  await waitForCount(auditChapterTabs, 2, `${label}: Recognition Audit chapters`);

  if (viewport.width < 1024) {
    await auditChapterNav.scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    const initialAuditNavBox = await auditChapterNav.boundingBox();
    assert(
      initialAuditNavBox && initialAuditNavBox.y >= 72 && initialAuditNavBox.y <= 180,
      `${label}: Recognition Audit navigation is not anchored below the fixed header ${JSON.stringify(initialAuditNavBox)}`,
    );
    await assertTouchTargets(auditChapterTabs, 40, `${label}: Recognition Audit chapter tabs`);''',
        "Recognition Audit navigation position contract",
    )

    text = replace_once(
        text,
        '''    assert((await visibleCount(unlockPanel)) === 1, `${label}: mobile unlock panel did not appear`);
    assert((await visibleCount(auditForm)) === 1, `${label}: mobile audit form did not appear`);
    await assertTouchTargets(auditSubmit, 40, `${label}: audit submit`);''',
        '''    assert((await visibleCount(unlockPanel)) === 1, `${label}: mobile unlock panel did not appear`);
    assert((await visibleCount(auditForm)) === 1, `${label}: mobile audit form did not appear`);
    await page.waitForTimeout(120);
    const unlockAuditNavBox = await auditChapterNav.boundingBox();
    const unlockFormBox = await auditForm.boundingBox();
    assert(
      unlockAuditNavBox && unlockAuditNavBox.y >= 72 && unlockAuditNavBox.y <= 180,
      `${label}: Recognition Audit navigation moved away after chapter swap ${JSON.stringify(unlockAuditNavBox)}`,
    );
    assert(
      unlockFormBox && unlockAuditNavBox && unlockFormBox.y > unlockAuditNavBox.y + unlockAuditNavBox.height,
      `${label}: Recognition Audit form does not begin beneath its chapter navigation`,
    );
    assert(
      unlockFormBox && unlockFormBox.y < viewport.height,
      `${label}: Recognition Audit form begins below the mobile viewport`,
    );
    await assertTouchTargets(auditSubmit, 40, `${label}: audit submit`);''',
        "Recognition Audit swapped-frame position contract",
    )

    text = replace_once(
        text,
        '    recognitionAuditChapters: 2,\n    mobileAuditDesk: true,\n    strategyRoomQuestions: 3,',
        '    recognitionAuditChapters: 2,\n    mobileAuditDesk: true,\n    auditDeskAnchored: true,\n    strategyRoomQuestions: 3,',
        "Recognition Audit anchored result field",
    )

    path.write_text(text)


def validate() -> None:
    contracts = {
        Path("src/sections/Services/RecognitionAudit.tsx"): [
            "mobileNavRef",
            "openMobileChapter",
            "scroll-mt-24",
            "window.innerWidth >= 1024",
        ],
        Path("src/app/services/page.tsx"): [
            'id="audit" data-services-scene="audit" className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-start',
            "lg:justify-center",
        ],
        Path("scripts/services_page_gate.cjs"): [
            "Recognition Audit navigation is not anchored below the fixed header",
            "Recognition Audit form begins below the mobile viewport",
            "auditDeskAnchored: true",
        ],
    }
    for path, needles in contracts.items():
        text = path.read_text()
        for needle in needles:
            if needle not in text:
                raise SystemExit(f"{path}: missing contract {needle!r}")


if __name__ == "__main__":
    update_component()
    update_page()
    update_gate()
    validate()
    print("Services mobile Recognition Audit composition refined.")
