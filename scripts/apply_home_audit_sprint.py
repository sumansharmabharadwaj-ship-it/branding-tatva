from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
changed_files: list[Path] = []


def write_if_changed(path: Path, text: str) -> None:
    original = path.read_text()
    if original == text:
        return
    path.write_text(text)
    changed_files.append(path.relative_to(ROOT))


def patch_diagnosis() -> None:
    path = ROOT / "src/sections/Home/ClarityCTA.tsx"
    text = path.read_text()
    label = "Discuss the right starting point"
    if label not in text:
        return
    label_index = text.index(label)
    href_index = text.rfind('href="/contact"', 0, label_index)
    if href_index < 0:
        raise SystemExit("Diagnosis CTA contact href was not found")
    text = (
        text[:href_index]
        + 'href="#evidence-wall-title"'
        + text[href_index + len('href="/contact"') :]
    )
    text = text.replace(label, "See how decisions become proof", 1)
    write_if_changed(path, text)


def patch_framework_handoffs() -> None:
    path = ROOT / "src/sections/Home/TatvaStrip.tsx"
    text = path.read_text()
    label = "Enter the five-element chapter"
    if label in text:
        label_index = text.index(label)
        href_index = text.rfind('href="#elements"', 0, label_index)
        if href_index < 0:
            raise SystemExit("Tatva Strip Elements href was not found")
        text = (
            text[:href_index]
            + 'href="#tatva-system-lab-title"'
            + text[href_index + len('href="#elements"') :]
        )
        text = text.replace(label, "Stress test the five force system", 1)
    write_if_changed(path, text)

    path = ROOT / "src/sections/Home/TatvaSystemLab.tsx"
    text = path.read_text()
    text = text.replace(
        'className="relative overflow-hidden border-t border-soil/10 py-16 sm:py-24"',
        'className="relative scroll-mt-24 overflow-hidden border-t border-soil/10 py-16 sm:py-24"',
        1,
    )
    text = text.replace(
        "Examine every Tatva in depth",
        "Continue into the five living Tatvas",
        1,
    )
    write_if_changed(path, text)


def patch_questions() -> None:
    path = ROOT / "src/sections/Home/HomeQuestionsScene.tsx"
    text = path.read_text()
    replacements = [
        ('{ label: "Timing", x: 78, y: 19 }', '{ label: "Timing", x: 76, y: 19 }'),
        (
            '{ label: "Implementation", x: 88, y: 66 }',
            '{ label: "Implementation", x: 78, y: 66 }',
        ),
        ('{ label: "Fit", x: 10, y: 67 }', '{ label: "Fit", x: 16, y: 67 }'),
        (
            'className="mt-4 max-w-xl font-display text-[clamp(2.6rem,5vw,5.25rem)] font-normal leading-[0.96] tracking-[-0.025em] text-ivory"',
            'className="mt-4 max-w-xl break-words font-display text-[clamp(2.35rem,5vw,5.25rem)] font-normal leading-[0.96] tracking-[-0.025em] text-ivory [text-wrap:balance]"',
        ),
        (
            "Scope, implementation, timing, distance, and fit should feel clear before money enters the room. The page answers each one in sequence.",
            "Scope, implementation, timing, distance, and fit should feel clear before a proposal enters the room. The page answers each one in sequence.",
        ),
        (
            'className="text-[0.55rem] font-medium uppercase tracking-[0.12em] text-ivory/58"',
            'className="max-w-[5.25rem] text-center text-[0.55rem] font-medium uppercase leading-tight tracking-[0.12em] text-ivory/58"',
        ),
    ]
    for before, after in replacements:
        text = text.replace(before, after, 1)
    write_if_changed(path, text)


def patch_scene_bridge() -> None:
    path = ROOT / "src/sections/Home/HomeSceneBridge.tsx"
    text = path.read_text().replace(
        'className="pointer-events-none relative z-[8] -my-2 h-10 overflow-hidden sm:-my-4 sm:h-14 lg:-my-5 lg:h-16"',
        'className="pointer-events-none relative z-[4] my-0 h-8 overflow-hidden sm:h-10 lg:h-12"',
        1,
    )
    write_if_changed(path, text)


def patch_chapter_entry_framing() -> None:
    replacements = [
        (
            ROOT / "src/sections/Home/HomeAutoJourney.tsx",
            'lenis.scrollTo(target, { offset: -72, duration: 1.35 });',
            'lenis.scrollTo(target, { offset: 0, duration: 1.35 });',
        ),
        (
            ROOT / "src/sections/Home/ChapterLadder.tsx",
            'lenis.scrollTo(target, { offset: -72, duration: 1.05 });',
            'lenis.scrollTo(target, { offset: 0, duration: 1.05 });',
        ),
        (
            ROOT / "src/sections/Home/HomeOpeningSignal.tsx",
            'lenis.scrollTo(target, { offset: -72, duration: 1.05 });',
            'lenis.scrollTo(target, { offset: 0, duration: 1.05 });',
        ),
    ]
    for path, before, after in replacements:
        text = path.read_text().replace(before, after, 1)
        write_if_changed(path, text)


def patch_mobile_cinema_entry() -> None:
    path = ROOT / "src/sections/Home/HomeAutoJourney.tsx"
    text = path.read_text()
    listener = '''  useEffect(() => {
    function openMobileCinemaControls() {
      if (!isMobile || playing) return;
      setMobileMenuOpen(true);
    }

    window.addEventListener(
      "bt:open-cinema-controls",
      openMobileCinemaControls,
    );
    return () => {
      window.removeEventListener(
        "bt:open-cinema-controls",
        openMobileCinemaControls,
      );
    };
  }, [isMobile, playing]);

'''
    marker = '''  useEffect(
    () => () => {
      window.clearTimeout(holdTimerRef.current);
    },
    [],
  );'''
    if "openMobileCinemaControls" not in text:
        if marker not in text:
            raise SystemExit("HomeAutoJourney cleanup marker was not found")
        text = text.replace(marker, listener + marker, 1)
    write_if_changed(path, text)

    path = ROOT / "src/sections/Home/ChapterLadder.tsx"
    text = path.read_text()
    cinema_button = '''              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(
                    new CustomEvent("bt:open-cinema-controls"),
                  );
                }}
                className="mb-2 flex w-full items-center justify-between gap-4 rounded-2xl border border-sandstone/20 bg-sandstone/[0.06] px-3 py-3 text-left transition-colors hover:bg-sandstone/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sandstone"
              >
                <span>
                  <span className="block font-display text-base text-ivory">
                    Cinema and sound
                  </span>
                  <span className="mt-1 block text-[0.62rem] leading-relaxed text-ivory/42">
                    Start the guided journey or turn on the ambient score.
                  </span>
                </span>
                <span aria-hidden="true" className="text-sandstone">
                  ▶
                </span>
              </button>

'''
    marker = '''              <div className="max-h-[54vh] space-y-1 overflow-y-auto pr-1">'''
    if "Cinema and sound" not in text:
        if marker not in text:
            raise SystemExit("ChapterLadder mobile chapter list was not found")
        text = text.replace(marker, cinema_button + marker, 1)
    write_if_changed(path, text)


def patch_tablet_controls() -> None:
    path = ROOT / "src/sections/Home/HomeAutoJourney.tsx"
    text = path.read_text()
    text = text.replace(
        'window.matchMedia("(max-width: 767px)")',
        'window.matchMedia("(max-width: 1023px)")',
        1,
    )
    text = text.replace(
        'backdrop-blur-xl md:hidden',
        'backdrop-blur-xl lg:hidden',
        1,
    )
    text = text.replace(
        'md:bottom-5 md:left-1/2 md:right-auto md:-translate-x-1/2',
        'lg:bottom-5 lg:left-1/2 lg:right-auto lg:-translate-x-1/2',
        1,
    )
    write_if_changed(path, text)

    path = ROOT / "src/sections/Home/ChapterLadder.tsx"
    text = path.read_text()
    text = text.replace(
        'hidden -translate-y-1/2 md:block lg:right-5',
        'hidden -translate-y-1/2 lg:block lg:right-5',
        1,
    )
    text = text.replace(
        'fixed bottom-5 left-4 z-[45] md:hidden',
        'fixed bottom-5 left-4 z-[45] lg:hidden',
        1,
    )
    write_if_changed(path, text)

    path = ROOT / "src/components/AmbientAudio.tsx"
    text = path.read_text().replace(
        'md:flex motion-reduce:flex',
        'lg:flex motion-reduce:flex',
        1,
    )
    write_if_changed(path, text)


def patch_mobile_control_css() -> None:
    path = ROOT / "src/app/home-release-candidate.css"
    text = path.read_text()
    marker = "/* Mobile cinema docking repair */"
    if marker not in text:
        text += '''

/* Mobile cinema docking repair */
@media (max-width: 1023px) {
  [data-auto-journey-control][aria-pressed="false"] {
    display: none !important;
  }

  [data-chapter-ladder-mobile] {
    right: 0 !important;
    left: auto !important;
    top: calc(50% - 3.25rem) !important;
    bottom: auto !important;
    transform: none !important;
  }

  [data-chapter-ladder-mobile] > button {
    width: 1.75rem !important;
    height: 6.5rem !important;
    min-height: 6.5rem !important;
    border-right: 0 !important;
    border-radius: 999px 0 0 999px !important;
    padding: 0 !important;
    background-color: rgba(23, 20, 15, 0.76) !important;
  }

  [data-chapter-ladder-mobile] > button > span:first-child {
    gap: 0.3rem !important;
  }
}
'''
    else:
        text = text.replace(
            '@media (max-width: 767px) {\n  [data-auto-journey-control][aria-pressed="false"]',
            '@media (max-width: 1023px) {\n  [data-auto-journey-control][aria-pressed="false"]',
            1,
        )
    write_if_changed(path, text)


def patch_project_instructions() -> None:
    path = ROOT / "CLAUDE.md"
    text = path.read_text()
    old_list = """1. `docs/HOME_MASTER_BRIEF.md` — binding creative, commercial, motion, media, copy, accessibility, and deployment rules.
2. `docs/HOME_MILESTONES_BACKLOG.md` — current milestones, screenshot findings, P0/P1 repairs, and remaining work.
3. `docs/HOME_QA_CHECKLIST.md` — viewport, autoplay, fixed UI, accessibility, proof, and release gate.
4. `docs/HOME_REFERENCE_BANK.md` — the exact role of every approved reference and what must remain original.
5. `docs/HOME_FACT_BANK.md` — verified public facts, outcomes, allowed claims, and blocked unknowns."""
    new_list = """1. `docs/HOME_CONTROL_ROOM.md` — operational index, architecture lock, current sprint, and release gate.
2. `docs/HOME_MASTER_BRIEF.md` — binding creative, commercial, motion, media, copy, accessibility, and deployment rules.
3. `docs/HOME_VISUAL_AUDIT_2026-08-05.md` — screenshot findings, P0/P1 repairs, and chapter acceptance criteria.
4. `docs/HOME_MILESTONES_BACKLOG.md` — current milestones, remaining work, and release dependencies.
5. `docs/HOME_QA_CHECKLIST.md` — viewport, autoplay, fixed UI, accessibility, proof, and release gate.
6. `docs/HOME_REFERENCE_BANK.md` — the exact role of every approved reference and what must remain original.
7. `docs/HOME_FACT_BANK.md` — verified public facts, outcomes, allowed claims, and blocked unknowns."""
    text = text.replace(old_list, new_list, 1)
    write_if_changed(path, text)


def main() -> None:
    patch_diagnosis()
    patch_framework_handoffs()
    patch_questions()
    patch_scene_bridge()
    patch_chapter_entry_framing()
    patch_mobile_cinema_entry()
    patch_tablet_controls()
    patch_mobile_control_css()
    patch_project_instructions()
    for path in changed_files:
        print(path)


if __name__ == "__main__":
    main()
