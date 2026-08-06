from __future__ import annotations

from pathlib import Path


path = Path("src/sections/Services/ServicesScrollExperience.tsx")
text = path.read_text()

old = '''  useEffect(() => {
    const root = markerRef.current?.closest<HTMLElement>("[data-services-scroll-root]")!;
    if (!root) return;

    prepareScenes(root);'''
new = '''  useEffect(() => {
    const root = markerRef.current?.closest<HTMLElement>("[data-services-scroll-root]");
    if (!root) return;
    const scrollRoot = root;

    prepareScenes(scrollRoot);'''

if text.count(old) != 1:
    raise SystemExit(f"scroll-root setup: expected one match, found {text.count(old)}")
text = text.replace(old, new, 1)

# Once the guarded element is aliased, every callback captures the
# definitely-present HTMLElement rather than the nullable query result.
for old_use, new_use in [
    ("readScenes(root)", "readScenes(scrollRoot)"),
    ("root.dataset.servicesScrollReady", "scrollRoot.dataset.servicesScrollReady"),
    ("root.dataset.servicesDirection", "scrollRoot.dataset.servicesDirection"),
    ("root.dataset.servicesActiveScene", "scrollRoot.dataset.servicesActiveScene"),
    ("root.querySelectorAll<HTMLVideoElement>", "scrollRoot.querySelectorAll<HTMLVideoElement>"),
    ("mutationObserver.observe(root,", "mutationObserver.observe(scrollRoot,"),
    ("root.contains(active)", "scrollRoot.contains(active)"),
    ("root.addEventListener", "scrollRoot.addEventListener"),
    ("root.removeEventListener", "scrollRoot.removeEventListener"),
    ("delete root.dataset.servicesScrollReady", "delete scrollRoot.dataset.servicesScrollReady"),
    ("delete root.dataset.servicesActiveScene", "delete scrollRoot.dataset.servicesActiveScene"),
    ("delete root.dataset.servicesDirection", "delete scrollRoot.dataset.servicesDirection"),
]:
    count = text.count(old_use)
    if count == 0:
        raise SystemExit(f"scroll-root usage missing: {old_use!r}")
    text = text.replace(old_use, new_use)

path.write_text(text)
print("Services scroll-root narrowing repaired.")
