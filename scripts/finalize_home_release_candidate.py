from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
changed: list[str] = []


def write(path: str, text: str) -> None:
    file = ROOT / path
    original = file.read_text()
    if original == text:
        return
    file.write_text(text)
    changed.append(path)


def replace(text: str, before: str, after: str, *, required: bool = False) -> str:
    if before not in text:
        if required:
            raise SystemExit(f"Expected block missing: {before[:100]!r}")
        return text
    return text.replace(before, after, 1)


# Keep the detailed ladder for ultra-wide canvases only. Ordinary desktop,
# tablet, and mobile widths use the quieter right-edge Explore rail.
path = "src/sections/Home/HomeAutoJourney.tsx"
text = (ROOT / path).read_text()
text = text.replace('(max-width: 1279px)', '(max-width: 2047px)', 1)
text = text.replace(
    'backdrop-blur-xl xl:hidden',
    'backdrop-blur-xl min-[2048px]:hidden',
    1,
)
text = text.replace(
    'xl:bottom-5 xl:left-1/2 xl:right-auto xl:-translate-x-1/2',
    'min-[2048px]:bottom-5 min-[2048px]:left-1/2 min-[2048px]:right-auto min-[2048px]:-translate-x-1/2',
    1,
)
write(path, text)

path = "src/sections/Home/ChapterLadder.tsx"
text = (ROOT / path).read_text()
offset_block = '''    const chapter = target.dataset.homeChapter;
    const offset = ["process", "questions", "invitation"].includes(
      chapter ?? "",
    )
      ? 0
      : -72;'''
text = replace(text, offset_block, '    const offset = 0;')
text = text.replace(
    'hidden -translate-y-1/2 xl:block xl:right-5',
    'hidden -translate-y-1/2 min-[2048px]:block min-[2048px]:right-5',
    1,
)
text = text.replace(
    'fixed bottom-5 left-4 z-[45] xl:hidden',
    'fixed bottom-5 left-4 z-[45] min-[2048px]:hidden',
    1,
)
write(path, text)

path = "src/components/AmbientAudio.tsx"
text = (ROOT / path).read_text().replace(
    'xl:flex motion-reduce:flex',
    'min-[2048px]:flex motion-reduce:flex',
    1,
)
write(path, text)

# Remove the dead band before Earth on phones and reduced-motion layouts.
path = "src/sections/Elements/VerticalUnfold.tsx"
text = (ROOT / path).read_text().replace(
    'className="divide-y divide-border bg-soil pt-16 sm:pt-24"',
    'className="divide-y divide-border bg-soil pt-5 sm:pt-12"',
    1,
)
write(path, text)

# Give the mobile hero a stronger reading field without changing its forest,
# typography, copy, or cinematic motion.
path = "src/sections/Hero/index.tsx"
text = (ROOT / path).read_text()
text = text.replace(
    '<section ref={ref} className="relative h-svh min-h-[620px] overflow-hidden bg-soil">',
    '<section ref={ref} data-cinematic-hero className="relative h-svh min-h-[620px] overflow-hidden bg-soil">',
    1,
)
text = text.replace(
    'className="relative flex h-full flex-col items-center justify-end px-6 pb-24 text-center sm:pb-28"',
    'data-hero-content className="relative flex h-full flex-col items-center justify-end px-6 pb-24 text-center sm:pb-28"',
    1,
)
write(path, text)

# Consolidated responsive polish layer.
path = "src/app/home-release-candidate.css"
text = (ROOT / path).read_text()
text = text.replace(
    '@media (max-width: 1279px) {\n  [data-auto-journey-control][aria-pressed="false"]',
    '@media (max-width: 2047px) {\n  [data-auto-journey-control][aria-pressed="false"]',
    1,
)
text = text.replace(
    '    background-color: rgba(23, 20, 15, 0.76) !important;\n  }',
    '    overflow: hidden !important;\n    justify-content: center !important;\n    background-color: rgba(23, 20, 15, 0.76) !important;\n  }',
    1,
)
marker = '/* Final homepage release-candidate polish */'
if marker not in text:
    text += r'''

/* Final homepage release-candidate polish */

/* The compact chapter rail is the default navigation instrument through
   standard desktop widths. It has the same information architecture as the
   full ladder, but leaves diagrams, proof, and CTA fields undisturbed. */
@media (min-width: 768px) and (max-width: 2047px) {
  [data-chapter-ladder-mobile] > button {
    width: 2rem !important;
    height: 7.25rem !important;
    min-height: 7.25rem !important;
  }

  [data-chapter-ladder-mobile] > #mobile-chapter-ladder {
    position: fixed !important;
    top: max(1rem, calc(50% - 20rem)) !important;
    right: 3.25rem !important;
    bottom: auto !important;
    left: auto !important;
    width: min(21rem, calc(100vw - 5rem)) !important;
    max-height: min(40rem, calc(100svh - 2rem)) !important;
    margin: 0 !important;
  }

  #mobile-cinema-controls {
    top: calc(50% - 7rem) !important;
    right: 3.25rem !important;
    bottom: auto !important;
  }
}

/* On phones the forest remains luminous, but the words sit inside a stronger
   dusk gradient. This is contrast protection, not a palette change. */
@media (max-width: 767px) {
  [data-cinematic-hero]::after {
    content: "";
    pointer-events: none;
    position: absolute;
    z-index: 1;
    inset: 26% 0 0;
    background:
      linear-gradient(180deg, transparent 0%, rgba(20, 18, 16, 0.18) 18%, rgba(20, 18, 16, 0.72) 72%, rgba(20, 18, 16, 0.94) 100%);
  }

  [data-hero-content] {
    z-index: 2;
    padding-bottom: 5.75rem !important;
  }

  [data-hero-content] > span:first-child {
    max-width: 22rem;
    background: rgba(20, 18, 16, 0.24);
    box-shadow: 0 12px 38px rgba(20, 18, 16, 0.16);
    backdrop-filter: blur(8px);
  }

  [data-hero-content] h1,
  [data-hero-content] p {
    text-shadow: 0 2px 18px rgba(20, 18, 16, 0.72);
  }

  [data-hero-content] > p {
    max-width: 34ch;
    line-height: 1.65;
  }
}

/* One mobile proof card now owns the reading field while the next card peeks
   in as an invitation to continue. */
@media (max-width: 767px) {
  section[aria-labelledby="evidence-wall-title"] ul {
    scroll-padding-inline: 1rem;
  }

  section[aria-labelledby="evidence-wall-title"] ul > li {
    width: min(82vw, 18rem) !important;
  }
}

/* The first Tatva should arrive as Earth, rather than as an empty soil band. */
@media (max-width: 767px) {
  #elements > div > div.divide-y {
    padding-top: 1.25rem !important;
  }
}
'''
write(path, text)

for item in changed:
    print(item)
