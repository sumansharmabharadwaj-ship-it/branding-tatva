from pathlib import Path

replacements = {
    Path("src/sections/Home/HomeAutoJourney.tsx"): [
        ('window.matchMedia("(max-width: 1023px)")', 'window.matchMedia("(max-width: 1279px)")'),
        ("backdrop-blur-xl lg:hidden", "backdrop-blur-xl xl:hidden"),
        (
            "lg:bottom-5 lg:left-1/2 lg:right-auto lg:-translate-x-1/2",
            "xl:bottom-5 xl:left-1/2 xl:right-auto xl:-translate-x-1/2",
        ),
    ],
    Path("src/sections/Home/ChapterLadder.tsx"): [
        (
            "hidden -translate-y-1/2 lg:block lg:right-5",
            "hidden -translate-y-1/2 xl:block xl:right-5",
        ),
        (
            "fixed bottom-5 left-4 z-[45] lg:hidden",
            "fixed bottom-5 left-4 z-[45] xl:hidden",
        ),
    ],
    Path("src/components/AmbientAudio.tsx"): [
        ("lg:flex motion-reduce:flex", "xl:flex motion-reduce:flex"),
    ],
    Path("src/app/home-release-candidate.css"): [
        (
            '@media (max-width: 1023px) {\n  [data-auto-journey-control][aria-pressed="false"]',
            '@media (max-width: 1279px) {\n  [data-auto-journey-control][aria-pressed="false"]',
        ),
    ],
}

changed = []
for path, pairs in replacements.items():
    text = path.read_text()
    updated = text
    for before, after in pairs:
        updated = updated.replace(before, after, 1)
    if updated != text:
        path.write_text(updated)
        changed.append(str(path))

for path in changed:
    print(path)
