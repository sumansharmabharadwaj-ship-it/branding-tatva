from pathlib import Path

path = Path("src/sections/Services/ServicesScrollExperience.tsx")
text = path.read_text()

old = '''    const marker = markerRef.current;\n    const root = marker?.closest<HTMLElement>("[data-services-scroll-root]");\n    if (!root) return;\n\n    assignSceneIdentity(root);\n    let scenes = collectScenes(root);'''
new = '''    const marker = markerRef.current;\n    const root = marker?.closest<HTMLElement>("[data-services-scroll-root]");\n    if (!root) return;\n    const scrollRoot = root;\n\n    assignSceneIdentity(scrollRoot);\n    let scenes = collectScenes(scrollRoot);'''

if old not in text:
    raise SystemExit("services scroll-root setup did not match expected source")
text = text.replace(old, new, 1)

for before, after in [
    ("root.dataset.servicesScrollReady", "scrollRoot.dataset.servicesScrollReady"),
    ("root.dataset.servicesDirection", "scrollRoot.dataset.servicesDirection"),
    ("root.dataset.servicesActiveScene", "scrollRoot.dataset.servicesActiveScene"),
    ("collectScenes(root)", "collectScenes(scrollRoot)"),
    ("root.querySelectorAll<HTMLVideoElement>", "scrollRoot.querySelectorAll<HTMLVideoElement>"),
    ("root.contains(active)", "scrollRoot.contains(active)"),
    ("root.addEventListener", "scrollRoot.addEventListener"),
    ("root.removeEventListener", "scrollRoot.removeEventListener"),
    ("mutationObserver.observe(root,", "mutationObserver.observe(scrollRoot,"),
    ("delete root.dataset.servicesScrollReady", "delete scrollRoot.dataset.servicesScrollReady"),
    ("delete root.dataset.servicesActiveScene", "delete scrollRoot.dataset.servicesActiveScene"),
    ("delete root.dataset.servicesDirection", "delete scrollRoot.dataset.servicesDirection"),
]:
    text = text.replace(before, after)

path.write_text(text)
print("Preview Services scroll-root narrowing repaired")
