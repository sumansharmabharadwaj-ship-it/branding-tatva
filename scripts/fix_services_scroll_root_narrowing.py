from __future__ import annotations

from pathlib import Path

path = Path("src/sections/Services/ServicesScrollExperience.tsx")
text = path.read_text()

old = '''  useEffect(() => {\n    const marker = markerRef.current;\n    const root = marker?.closest<HTMLElement>("[data-services-scroll-root]");\n    if (!root) return;\n\n    assignSceneIdentity(root);'''
new = '''  useEffect(() => {\n    const marker = markerRef.current;\n    const root = marker?.closest<HTMLElement>("[data-services-scroll-root]");\n    if (!root) return;\n    const scrollRoot = root;\n\n    assignSceneIdentity(scrollRoot);'''

if text.count(old) != 1:
    raise SystemExit(f"scroll-root setup: expected one match, found {text.count(old)}")
text = text.replace(old, new, 1)

for old_use, new_use in [
    ("collectScenes(root)", "collectScenes(scrollRoot)"),
    ("root.dataset.servicesScrollReady", "scrollRoot.dataset.servicesScrollReady"),
    ("root.dataset.servicesDirection", "scrollRoot.dataset.servicesDirection"),
    ("root.dataset.servicesActiveScene", "scrollRoot.dataset.servicesActiveScene"),
    ("root.querySelectorAll<HTMLVideoElement>", "scrollRoot.querySelectorAll<HTMLVideoElement>"),
    ("assignSceneIdentity(root)", "assignSceneIdentity(scrollRoot)"),
    ("mutationObserver.observe(root,", "mutationObserver.observe(scrollRoot,"),
    ("root.contains(active)", "scrollRoot.contains(active)"),
    ("root.dataset.servicesFormInteraction", "scrollRoot.dataset.servicesFormInteraction"),
    ("root.addEventListener", "scrollRoot.addEventListener"),
    ("root.removeEventListener", "scrollRoot.removeEventListener"),
    ("root.removeAttribute", "scrollRoot.removeAttribute"),
]:
    text = text.replace(old_use, new_use)

path.write_text(text)
print("Services scroll-root narrowing repaired.")
