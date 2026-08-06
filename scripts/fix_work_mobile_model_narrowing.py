from __future__ import annotations

from pathlib import Path


path = Path("src/sections/Work/MobileNarrativeEnhancers.tsx")
text = path.read_text()

# The current Work mobile enhancer has two asynchronous case-study
# callbacks after the `model` guard. TypeScript correctly refuses to
# assume that the captured model can never become null later, so those
# callback reads must remain null-safe. Earlier versions of this repair
# introduced a broad `resolvedModel` alias across three components; the
# current component has since been simplified and no longer contains the
# old SystemDeck or those exact source anchors. Keep the repair focused,
# idempotent, and compatible with both source generations.
replacements = {
    "const article = model.articles[index];": "const article = model?.articles[index];",
    "const originalButton = model.originalButtons[index];": "const originalButton = model?.originalButtons[index];",
}

changed = False
for old, new in replacements.items():
    if old in text:
        text = text.replace(old, new, 1)
        changed = True

path.write_text(text)
updated = path.read_text()

contracts = (
    "const article = model?.articles[index];",
    "const originalButton = model?.originalButtons[index];",
    "if (!model) return null;",
)
for contract in contracts:
    if contract not in updated:
        raise SystemExit(f"Work mobile model narrowing contract is missing: {contract}")

print(
    "Work mobile model narrowing repaired."
    if changed
    else "Work mobile model narrowing is already current."
)
