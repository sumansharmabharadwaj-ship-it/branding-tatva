from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def update_services_page() -> None:
    page = Path("src/app/services/page.tsx")
    text = page.read_text()

    import_anchor = 'import type { Metadata } from "next";\n'
    import_line = 'import type { CSSProperties } from "react";\n'
    if import_line not in text:
        text = replace_once(text, import_anchor, import_anchor + import_line, "Services import anchor")

    text = replace_once(
        text,
        """        {/* Curiosity opens on an original Branding Tatva film.
            A living root network reveals the system beneath visible
            brand work, so the first frame begins teaching before the
            headline finishes arriving. The compact 70svh masthead
            keeps the Services page moving quickly into diagnosis. */}""",
        """        {/* Curiosity opens as a complete first scene rather than a
            compact masthead. One viewport belongs to the root-system
            film, proposition, proof, and chapter map; the Situation
            chapter only begins after the visitor has finished this
            frame. The scene still advances quickly because the veil and
            word reveal respond inside the viewport, not by shortening it. */}""",
        "Services hero comment",
    )
    text = replace_once(text, '          minHeight="70vh"', '          minHeight="100vh"', "Services hero height")
    text = replace_once(text, "          <ScrollCue />", "          <ScrollCue raised />", "Services ScrollCue")
    text = replace_once(
        text,
        'className="spotlight-card group grid gap-2 rounded-2xl border-t border-ivory/12 px-4 py-6 transition-colors duration-500 hover:bg-ivory/[0.05] sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8"\n'
        '                      style={{ borderTopColor: "rgba(244,239,230,0.12)" }}',
        'className="spotlight-card group grid gap-2 rounded-2xl border-t border-ivory/12 px-4 py-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8"\n'
        '                      style={\n'
        '                        {\n'
        '                          borderTopColor: "rgba(244,239,230,0.12)",\n'
        '                          "--card-color": offer.color,\n'
        '                        } as CSSProperties\n'
        '                      }',
        "Offering style",
    )

    page.write_text(text)


def update_scroll_cue() -> None:
    cue = Path("src/components/ScrollCue.tsx")
    text = cue.read_text()
    text = replace_once(
        text,
        "export function ScrollCue() {",
        "export function ScrollCue({ raised = false }: { raised?: boolean }) {",
        "ScrollCue signature",
    )
    text = replace_once(
        text,
        '      className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2"',
        """      className={`pointer-events-none absolute inset-x-0 flex flex-col items-center gap-2 ${
        raised ? "bottom-[calc(5.75rem+env(safe-area-inset-bottom))] sm:bottom-6" : "bottom-6"
      }`}""",
        "ScrollCue position",
    )
    cue.write_text(text)


def update_spotlight_css() -> None:
    css = Path("src/app/globals.css")
    text = css.read_text()
    text = replace_once(
        text,
        """.spotlight-grid:has(.spotlight-card:hover) .spotlight-card:not(:hover) {
  opacity: 0.55;
}

.spotlight-card:hover {
  background-color: color-mix(in srgb, var(--card-color) 22%, transparent);
  border-color: var(--card-color);
}""",
        """.spotlight-card {
  transition-property: opacity, background-color, border-color;
  transition-duration: 500ms;
}

/* The spotlight belongs to fine-pointer exploration only. Touch
   browsers can retain :hover after a tap, which previously dimmed five
   disciplines indefinitely. Siblings now remain readable, and each row
   finally receives the discipline color already authored in its data. */
@media (hover: hover) and (pointer: fine) {
  .spotlight-grid:has(.spotlight-card:hover) .spotlight-card:not(:hover) {
    opacity: 0.72;
  }

  .spotlight-card:hover {
    background-color: color-mix(in srgb, var(--card-color) 22%, transparent);
    border-color: var(--card-color);
  }
}""",
        "Spotlight CSS",
    )
    css.write_text(text)


def update_services_gate() -> None:
    gate = Path("scripts/services_page_gate.cjs")
    text = gate.read_text()
    text = replace_once(
        text,
        "  await assertNoOverflow(page, `${label}/opening`);\n\n  for (const id of SECTION_IDS) {",
        """  await assertNoOverflow(page, `${label}/opening`);
  const heroBox = await hero.boundingBox();
  assert(
    heroBox && heroBox.height >= viewport.height - 2,
    `${label}: opening scene is ${heroBox?.height ?? 0}px tall for a ${viewport.height}px viewport`,
  );

  for (const id of SECTION_IDS) {""",
        "Hero-height audit",
    )
    text = replace_once(
        text,
        '  await waitForCount(offerings.locator(".spotlight-card"), 6, `${label}: offerings`);\n  for (const service of [',
        """  const offeringCards = offerings.locator(".spotlight-card");
  await waitForCount(offeringCards, 6, `${label}: offerings`);
  const offeringColors = await offeringCards.evaluateAll((nodes) =>
    nodes.map((node) => node.style.getPropertyValue("--card-color").trim()),
  );
  assert(
    offeringColors.length === 6 && offeringColors.every(Boolean),
    `${label}: one or more offering rows have no discipline accent ${JSON.stringify(offeringColors)}`,
  );
  for (const service of [""",
        "Offering-color audit",
    )
    gate.write_text(text)


def validate() -> None:
    contracts = {
        Path("src/app/services/page.tsx"): [
            'minHeight="100vh"',
            "<ScrollCue raised />",
            '"--card-color": offer.color',
        ],
        Path("src/components/ScrollCue.tsx"): [
            "raised = false",
            "bottom-[calc(5.75rem+env(safe-area-inset-bottom))]",
        ],
        Path("src/app/globals.css"): [
            "@media (hover: hover) and (pointer: fine)",
            "opacity: 0.72",
        ],
        Path("scripts/services_page_gate.cjs"): [
            "opening scene is",
            "one or more offering rows have no discipline accent",
        ],
    }
    for path, needles in contracts.items():
        text = path.read_text()
        for needle in needles:
            if needle not in text:
                raise SystemExit(f"{path}: missing contract {needle!r}")


def main() -> None:
    update_services_page()
    update_scroll_cue()
    update_spotlight_css()
    update_services_gate()
    validate()
    print("Services screen-fit pass applied.")


if __name__ == "__main__":
    main()
