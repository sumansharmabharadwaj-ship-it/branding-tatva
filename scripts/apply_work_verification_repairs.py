#!/usr/bin/env python3
"""Apply the exact current Work verification repairs without overwriting newer work.

The transform is deliberately idempotent. It only changes the two known source
patterns when the repaired behavior is still absent.
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORK_OPENING = ROOT / "src/sections/Work/WorkOpening.tsx"
MOBILE_NARRATIVE = ROOT / "src/sections/Work/MobileNarrativeEnhancers.tsx"


def replace_once(source: str, old: str, new: str, label: str) -> tuple[str, bool]:
    if new in source:
        return source, False
    if old not in source:
        raise RuntimeError(f"Could not locate the expected source pattern for {label}.")
    return source.replace(old, new, 1), True


def repair_work_opening() -> bool:
    source = WORK_OPENING.read_text(encoding="utf-8")
    changed = False

    pointer_effect = '''
  useEffect(() => {
    function trackPointer(event: PointerEvent) {
      const stage = stageRef.current;
      if (!stage) return;
      const bounds = stage.getBoundingClientRect();
      const inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      setPointerPaused(inside);
    }

    window.addEventListener("pointermove", trackPointer, { passive: true });
    return () => window.removeEventListener("pointermove", trackPointer);
  }, []);
'''

    if "function trackPointer(event: PointerEvent)" not in source:
        anchor = '''
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px 0px 120px 0px" },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);
'''
        if anchor not in source:
            raise RuntimeError("Could not locate the Work opening IntersectionObserver effect.")
        source = source.replace(anchor, anchor + pointer_effect, 1)
        changed = True

    old_stage = '''
            ref={stageRef}
            data-work-preview-stage="true"
            onMouseEnter={() => setPointerPaused(true)}
            onMouseLeave={() => setPointerPaused(false)}
            onFocusCapture={() => setFocusPaused(true)}
'''
    new_stage = '''
            ref={stageRef}
            data-work-preview-stage="true"
            data-pointer-paused={pointerPaused ? "true" : "false"}
            data-focus-paused={focusPaused ? "true" : "false"}
            data-preview-in-view={inView ? "true" : "false"}
            onPointerEnter={() => setPointerPaused(true)}
            onPointerLeave={() => setPointerPaused(false)}
            onFocusCapture={() => setFocusPaused(true)}
'''
    if "data-pointer-paused={pointerPaused" not in source:
        source, did_change = replace_once(
            source,
            old_stage,
            new_stage,
            "Work opening pointer/focus verification attributes",
        )
        changed = changed or did_change

    if changed:
        WORK_OPENING.write_text(source, encoding="utf-8")
    return changed


def repair_mobile_narrative() -> bool:
    source = MOBILE_NARRATIVE.read_text(encoding="utf-8")
    old = '''
  const finalParagraph = paragraphs.length > 0 ? paragraphs[paragraphs.length - 1] : undefined;
  const label =
    text(contentRoot.querySelector(":scope > p span:last-child")) || text(paragraphs[0]).replace(/^\\d+\\s*/, "");
  const title = text(contentRoot.querySelector(":scope > h2, :scope > h3"));
'''
    new = '''
  const finalParagraph = paragraphs.length > 0 ? paragraphs[paragraphs.length - 1] : undefined;
  const labelSpans = paragraphs[0] ? Array.from(paragraphs[0].querySelectorAll(":scope > span")) : [];
  const label =
    (labelSpans.length > 1 ? text(labelSpans[labelSpans.length - 1]) : "") ||
    text(paragraphs[0]).replace(/^\\d+\\s*/, "");
  const title = text(contentRoot.querySelector(":scope > h2, :scope > h3"));
'''
    source, changed = replace_once(
        source,
        old,
        new,
        "mobile Work narrative label extraction",
    )
    if changed:
        MOBILE_NARRATIVE.write_text(source, encoding="utf-8")
    return changed


def main() -> None:
    changed = {
        "workOpening": repair_work_opening(),
        "mobileNarrative": repair_mobile_narrative(),
    }
    print(changed)


if __name__ == "__main__":
    main()
