from __future__ import annotations

from pathlib import Path


path = Path("src/sections/Services/ProjectRoomPackage.tsx")
text = path.read_text()

old = '''                <ol data-project-room-route="true" className="relative mt-6 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6 sm:gap-3">
                  <span
                    aria-hidden="true"
                    className="absolute left-[8%] right-[8%] top-[1.05rem] hidden h-px bg-gradient-to-r from-transparent via-ivory/20 to-transparent sm:block"
                  />
                  {PROJECT_ROUTE.map((phase, index) => ('''
new = '''                <div className="relative mt-6">
                  <span
                    aria-hidden="true"
                    className="absolute left-[8%] right-[8%] top-[1.05rem] hidden h-px bg-gradient-to-r from-transparent via-ivory/20 to-transparent sm:block"
                  />
                  <ol data-project-room-route="true" className="relative grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6 sm:gap-3">
                    {PROJECT_ROUTE.map((phase, index) => ('''

if text.count(old) != 1:
    raise SystemExit(f"Project Room route opening: expected one match, found {text.count(old)}")
text = text.replace(old, new, 1)

old = '''                  ))}
                </ol>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">'''
new = '''                    ))}
                  </ol>
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">'''

if text.count(old) != 1:
    raise SystemExit(f"Project Room route closing: expected one match, found {text.count(old)}")
text = text.replace(old, new, 1)
path.write_text(text)
print("Project Room route semantics repaired.")
