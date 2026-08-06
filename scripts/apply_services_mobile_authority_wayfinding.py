from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def update_authority() -> None:
    path = Path("src/sections/Services/PinnedBrandBuild.tsx")
    text = path.read_text()

    text = replace_once(
        text,
        'import { elements } from "@/data/elements";\n',
        'import { elements } from "@/data/elements";\n'
        'import { MobileAuthorityDeck, type AuthorityLayer } from "@/sections/Services/MobileAuthorityDeck";\n',
        "mobile authority import",
    )
    text = replace_once(
        text,
        "const LAYERS = elements.map((el) => ({\n",
        "const LAYERS: AuthorityLayer[] = elements.map((el) => ({\n",
        "authority layer type",
    )
    text = replace_once(
        text,
        "  color: ELEMENT_HEX[el.slug],\n",
        '  color: ELEMENT_HEX[el.slug] ?? "#C6A97A",\n',
        "authority color fallback",
    )
    text = replace_once(
        text,
        '  const isDesktop = useMediaQuery("(min-width: 640px)");',
        '  const isDesktop = useMediaQuery("(min-width: 1024px)");',
        "authority desktop breakpoint",
    )
    text = replace_once(
        text,
        '    <div ref={wrapRef} className="relative sm:h-[420vh]" style={{ backgroundColor: MOOD.charcoal }}>',
        '    <div ref={wrapRef} className="relative lg:h-[420vh]" style={{ backgroundColor: MOOD.charcoal }}>',
        "authority scroll range breakpoint",
    )
    text = replace_once(
        text,
        '      <div className="relative overflow-hidden sm:sticky sm:top-0 sm:flex sm:h-screen sm:flex-col sm:justify-center">',
        '      <div className="relative overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">',
        "authority sticky breakpoint",
    )
    text = replace_once(
        text,
        '        <div className="relative mx-auto flex w-full max-w-[100rem] flex-col justify-center px-6 py-16 sm:py-24 sm:px-10 sm:py-0 lg:px-20">',
        '        <div className="relative mx-auto flex w-full max-w-[100rem] flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:px-20 lg:py-0">',
        "authority responsive padding",
    )
    text = replace_once(
        text,
        '            </div>\n            <div className="relative">\n              {/* The output signal',
        '            </div>\n            <MobileAuthorityDeck layers={LAYERS} wavePath={WAVE_PATH} />\n            <div className="relative hidden lg:block">\n              {/* The output signal',
        "authority mobile deck insertion",
    )
    text = replace_once(
        text,
        '                  key={layer.slug}\n                  ref={(node) => {',
        '                  key={layer.slug}\n                  data-authority-desktop-layer="true"\n                  ref={(node) => {',
        "authority desktop layer marker",
    )

    path.write_text(text)


def update_section_guide() -> None:
    path = Path("src/components/SectionJumpNav.tsx")
    text = path.read_text()

    text = replace_once(
        text,
        '// screens retain the quiet technical index along the bottom edge. On\n'
        '// mobile, the full-width strip collapses into one safe-area-aware pill\n'
        '// and opens the destinations only when requested.\n',
        '// screens retain the quiet technical index along the bottom edge. On\n'
        '// mobile, wayfinding becomes one small corner dial. The complete index\n'
        '// occupies the viewport only after the visitor explicitly opens it, so\n'
        '// reading, forms, and calls to action keep their full width.\n',
        "section guide intent comment",
    )
    text = replace_once(
        text,
        '        className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-30 w-[min(19rem,calc(100vw-1.5rem))] -translate-x-1/2 sm:hidden"',
        '        data-section-jump-nav-mobile="true"\n'
        '        className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-[calc(0.75rem+env(safe-area-inset-right))] z-30 sm:hidden"',
        "mobile section guide footprint",
    )
    text = replace_once(
        text,
        '          <div className="mb-2 grid grid-cols-2 gap-1.5 rounded-2xl border border-ivory/12 bg-soil/95 p-2 shadow-elevation-lg backdrop-blur-md">',
        '          <div className="absolute bottom-[calc(100%+0.5rem)] right-0 grid w-[min(19rem,calc(100vw-1.5rem))] grid-cols-2 gap-1.5 rounded-2xl border border-ivory/12 bg-soil/95 p-2 shadow-elevation-lg backdrop-blur-md">',
        "mobile section guide open panel",
    )

    old_button = '''        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-label={`${mobileOpen ? "Close" : "Open"} section navigation`}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex min-h-12 w-full items-center justify-between rounded-full border border-ivory/14 bg-soil/95 px-4 py-2.5 shadow-elevation-lg backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 font-display text-sm text-terracotta">{position}</span>
            <span className="truncate text-[0.64rem] font-medium uppercase tracking-[0.16em] text-ivory/78">
              {activeItem?.label ?? "Sections"}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`ml-3 text-base text-terracotta transition-transform duration-300 ${mobileOpen ? "rotate-45" : ""}`}
          >
            +
          </span>
        </button>'''
    new_button = '''        <button
          type="button"
          data-section-jump-nav-trigger="true"
          aria-expanded={mobileOpen}
          aria-label={`${mobileOpen ? "Close" : "Open"} section navigation. Current chapter ${activeIndex + 1} of ${items.length}: ${activeItem?.label ?? "Sections"}`}
          onClick={() => setMobileOpen((open) => !open)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-ivory/16 bg-soil/92 shadow-elevation-lg backdrop-blur-md transition-[opacity,transform] duration-300 hover:scale-[1.03] hover:bg-soil focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <span className="flex flex-col items-center justify-center leading-none" aria-hidden="true">
            <span className="font-display text-base text-terracotta">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="mt-0.5 text-[0.48rem] font-medium uppercase tracking-[0.12em] text-ivory/48">
              / {String(items.length).padStart(2, "0")}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`absolute right-1.5 top-1 text-xs text-terracotta transition-transform duration-300 ${mobileOpen ? "rotate-45" : ""}`}
          >
            +
          </span>
        </button>'''
    text = replace_once(text, old_button, new_button, "mobile section guide trigger")
    text = replace_once(
        text,
        '  const position = useMemo(\n'
        '    () => `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`,\n'
        '    [activeIndex, items.length]\n'
        '  );\n',
        "",
        "obsolete mobile section guide label",
    )
    text = replace_once(
        text,
        'import { useEffect, useMemo, useState } from "react";',
        'import { useEffect, useState } from "react";',
        "obsolete useMemo import",
    )

    path.write_text(text)


def update_gate() -> None:
    path = Path("scripts/services_page_gate.cjs")
    text = path.read_text()

    old_nav = '''  const jumpNav = page.locator('nav[aria-label="Jump to section"]');
  assert((await visibleCount(jumpNav)) === 1, `${label}: exactly one section guide should be visible near the opening`);'''
    new_nav = '''  const jumpNav = page.locator('nav[aria-label="Jump to section"]');
  assert((await visibleCount(jumpNav)) === 1, `${label}: exactly one section guide should be visible near the opening`);

  if (viewport.width < 640) {
    const mobileJumpNav = page.locator('[data-section-jump-nav-mobile="true"]');
    const mobileJumpTrigger = mobileJumpNav.locator('[data-section-jump-nav-trigger="true"]');
    await mobileJumpTrigger.waitFor({ state: "visible", timeout: 5_000 });
    await assertTouchTargets(mobileJumpTrigger, 40, `${label}: mobile section guide trigger`);
    const guideBox = await mobileJumpTrigger.boundingBox();
    assert(
      guideBox && guideBox.width <= 64 && guideBox.height <= 64,
      `${label}: mobile section guide still occupies a reading-width pill ${JSON.stringify(guideBox)}`,
    );
    assert(
      guideBox && guideBox.x >= viewport.width - 84,
      `${label}: mobile section guide is not confined to the safe corner ${JSON.stringify(guideBox)}`,
    );
    await mobileJumpTrigger.click();
    const mobileJumpLinks = mobileJumpNav.getByRole("link");
    await waitForCount(mobileJumpLinks, SECTION_IDS.length, `${label}: mobile section guide destinations`);
    await assertTouchTargets(mobileJumpLinks, 40, `${label}: mobile section guide destinations`);
    await mobileJumpTrigger.click();
  }'''
    text = replace_once(text, old_nav, new_nav, "mobile section guide gate")

    old_authority = '''  const authority = page.locator("#authority");
  await captureAt(
    page,
    authority,
    `services-${viewport.name}-authority.png`,
    `${label}/authority`,
  ).catch((error) => {
    if (viewport.screenshots) throw error;
  });
  const authorityText = (await authority.textContent()) || "";
  for (const layer of ["Foundation", "Experience", "Expression", "Voice", "Presence"]) {
    assert(authorityText.includes(layer), `${label}: authority layer ${layer} is missing`);
  }'''
    new_authority = '''  const authority = page.locator("#authority");
  await scrollTo(page, authority, `${label}/authority`);
  const authorityText = (await authority.textContent()) || "";
  for (const layer of ["Foundation", "Experience", "Expression", "Voice", "Presence"]) {
    assert(authorityText.includes(layer), `${label}: authority layer ${layer} is missing`);
  }

  const mobileAuthorityDeck = authority.locator('[data-authority-mobile-deck="true"]');
  const desktopAuthorityLayers = authority.locator('[data-authority-desktop-layer="true"]');
  await waitForCount(desktopAuthorityLayers, 5, `${label}: desktop authority layers`);

  if (viewport.width < 1024) {
    assert((await visibleCount(mobileAuthorityDeck)) === 1, `${label}: compact Authority deck is not visible`);
    assert((await visibleCount(desktopAuthorityLayers)) === 0, `${label}: five desktop Authority rows still stack on mobile`);
    const authorityTabs = mobileAuthorityDeck
      .getByRole("tablist", { name: "Brand authority layers" })
      .getByRole("tab");
    await waitForCount(authorityTabs, 5, `${label}: compact Authority layer tabs`);
    await assertTouchTargets(authorityTabs, 40, `${label}: compact Authority layer tabs`);
    assert((await authorityTabs.first().getAttribute("aria-selected")) === "true", `${label}: first Authority layer is not selected`);
    const authorityPanels = mobileAuthorityDeck.locator('[data-authority-layer-panel="true"]');
    await waitForCount(authorityPanels, 5, `${label}: compact Authority layer panels`);
    assert((await visibleCount(authorityPanels)) === 1, `${label}: multiple Authority panels stack in the mobile scene`);
    const voiceLayer = mobileAuthorityDeck.getByRole("tab", { name: /04 Voice/i });
    await voiceLayer.click();
    assert((await voiceLayer.getAttribute("aria-selected")) === "true", `${label}: Voice Authority layer did not activate`);
    assert((await mobileAuthorityDeck.getAttribute("data-active-index")) === "3", `${label}: Authority deck index did not advance`);
    const activeAuthorityPanel = mobileAuthorityDeck.locator('[data-authority-layer-panel="true"]:not([hidden])');
    await waitForVisibleText(
      activeAuthorityPanel,
      "five channels, five personalities, zero memory",
      `${label}: Voice Authority consequence`,
    );
    const authorityControls = mobileAuthorityDeck.locator('[data-authority-mobile-controls="true"]').getByRole("button");
    await waitForCount(authorityControls, 2, `${label}: compact Authority controls`);
    await assertTouchTargets(authorityControls, 40, `${label}: compact Authority controls`);
  } else {
    assert((await visibleCount(mobileAuthorityDeck)) === 0, `${label}: mobile Authority deck remains visible on desktop`);
    assert((await visibleCount(desktopAuthorityLayers)) === 5, `${label}: desktop Authority build lost one or more layers`);
  }

  if (viewport.screenshots) await captureViewport(page, `services-${viewport.name}-authority.png`);'''
    text = replace_once(text, old_authority, new_authority, "compact Authority gate")

    text = replace_once(
        text,
        '    perceptionRungs: 4,\n    deliverables: 14,',
        '    authorityLayers: 5,\n    compactAuthorityDeck: true,\n    compactSectionGuide: true,\n    perceptionRungs: 4,\n    deliverables: 14,',
        "Authority and wayfinding audit fields",
    )

    path.write_text(text)


def validate() -> None:
    contracts = {
        Path("src/sections/Services/PinnedBrandBuild.tsx"): [
            "MobileAuthorityDeck",
            'useMediaQuery("(min-width: 1024px)")',
            'data-authority-desktop-layer="true"',
            "lg:h-[420vh]",
        ],
        Path("src/components/SectionJumpNav.tsx"): [
            'data-section-jump-nav-mobile="true"',
            'data-section-jump-nav-trigger="true"',
            "h-14 w-14",
            "safe corner",
        ],
        Path("scripts/services_page_gate.cjs"): [
            "mobile section guide still occupies a reading-width pill",
            "five desktop Authority rows still stack on mobile",
            "compactAuthorityDeck: true",
            "compactSectionGuide: true",
        ],
    }
    for path, needles in contracts.items():
        text = path.read_text()
        for needle in needles:
            if needle not in text:
                raise SystemExit(f"{path}: missing contract {needle!r}")


if __name__ == "__main__":
    update_authority()
    update_section_guide()
    update_gate()
    validate()
    print("Services mobile Authority and section guide pass applied.")
