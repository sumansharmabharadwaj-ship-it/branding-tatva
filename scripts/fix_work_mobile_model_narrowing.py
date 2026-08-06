from __future__ import annotations

from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


path = Path("src/sections/Work/MobileNarrativeEnhancers.tsx")
text = path.read_text()

text = replace_once(
    text,
    '''  if (!model) return null;

  const chapter = model.chapters[active] ?? model.chapters[0];''',
    '''  if (!model) return null;
  const resolvedModel = model;

  const chapter = resolvedModel.chapters[active] ?? resolvedModel.chapters[0];''',
    "case-study model alias",
)
text = replace_once(
    text,
    '''    const article = model.articles[index];
    const originalButton = model.originalButtons[index];''',
    '''    const article = resolvedModel.articles[index];
    const originalButton = resolvedModel.originalButtons[index];''',
    "case-study model callback",
)
text = replace_once(text, "{model.chapters.map((item, index) => {", "{resolvedModel.chapters.map((item, index) => {", "case-study chapter map")
text = replace_once(text, "{String(model.chapters.length).padStart(2, \"0\")}", "{String(resolvedModel.chapters.length).padStart(2, \"0\")}", "case-study chapter count")
text = replace_once(text, "    model.host,\n  );\n}\n\nfunction SignatureDeck", "    resolvedModel.host,\n  );\n}\n\nfunction SignatureDeck", "case-study portal host")

text = replace_once(
    text,
    '''  if (!model) return null;
  const beat = model.beats[active] ?? model.beats[0];''',
    '''  if (!model) return null;
  const resolvedModel = model;
  const beat = resolvedModel.beats[active] ?? resolvedModel.beats[0];''',
    "signature model alias",
)
text = replace_once(text, "{model.imageSrc && (", "{resolvedModel.imageSrc && (", "signature image guard")
text = replace_once(text, "src={model.imageSrc}", "src={resolvedModel.imageSrc}", "signature image source")
text = replace_once(text, "model.beats.length - 1", "resolvedModel.beats.length - 1", "signature image progression")
text = replace_once(text, "{model.beats.map((item, index) => {", "{resolvedModel.beats.map((item, index) => {", "signature beat map")
text = replace_once(text, "{String(model.beats.length).padStart(2, \"0\")}", "{String(resolvedModel.beats.length).padStart(2, \"0\")}", "signature beat count")
text = replace_once(text, "href={model.href}", "href={resolvedModel.href}", "signature href")
text = replace_once(text, "    model.host,\n  );\n}\n\nfunction SystemDeck", "    resolvedModel.host,\n  );\n}\n\nfunction SystemDeck", "signature portal host")

text = replace_once(
    text,
    '''  if (!model) return null;
  const step = model.steps[active] ?? model.steps[0];''',
    '''  if (!model) return null;
  const resolvedModel = model;
  const step = resolvedModel.steps[active] ?? resolvedModel.steps[0];''',
    "system model alias",
)
text = replace_once(text, "{model.imageSrc && (", "{resolvedModel.imageSrc && (", "system image guard")
text = replace_once(text, "src={model.imageSrc}", "src={resolvedModel.imageSrc}", "system image source")
text = replace_once(text, "{model.steps.map((item, index) => {", "{resolvedModel.steps.map((item, index) => {", "system step map")
text = replace_once(text, "{model.outcome}", "{resolvedModel.outcome}", "system outcome")
text = replace_once(text, "href={model.href}", "href={resolvedModel.href}", "system href")
text = replace_once(text, "    model.host,\n  );\n}\n\nexport function WorkMobileNarrativeEnhancers", "    resolvedModel.host,\n  );\n}\n\nexport function WorkMobileNarrativeEnhancers", "system portal host")

path.write_text(text)
print("Work mobile model narrowing repaired.")
