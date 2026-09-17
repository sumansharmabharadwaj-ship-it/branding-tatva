# Homepage question reading — release 368

## Changes

The introduction now reads “Scope, timing, and working directly with Suman.”
On phones, tighter introduction spacing and question gutters bring the choices
forward. Answer text uses more of the available width while retaining the
16 px reading size. The section reserves 80 px below its final action.

Each open answer has a quiet clay reading line. It shares the row's existing
scroll signal and grows or retracts with native scrolling. The line is purely
decorative, has no pointer target, and stays full when its answer receives
keyboard focus or when motion is paused or reduced. Focused answer text is also
held still, including focus that arrives before the opening effect. Existing disclosure,
answer-copy and underline transitions remain. No dependencies or media were
added, and the shared FAQ answers and structured data remain unchanged.

## Source verification

TypeScript, changed-file ESLint, source homepage contract, typography floor,
production build, rendered homepage contract and whitespace checks passed.
The build generated 86 routes; the rendered gate verified 13 chapters and
513,765 CSS bytes for the first candidate. The final focus correction is
verified separately below.

Initial candidate source: `fe89042bb13c2a206ed75c7a176e2d4a38ff5c90`.
Candidate tree: `4acc44f0482d20dabb821df42e75899411101d0c`.
The deployment trigger `cf0c6a5025718c0c740c1bc49cd6f2e4a373d6c6` differs only
by the controlled `vercel.json` deployment flag.

The release 366 baseline at 390 × 844 (375 px content width) measured
1046.52 px for the section, 377.73 px from the section top to its first question,
128.75 px for the first answer, and 266.20 px for the answer text width.

## Initial candidate acceptance and correction

Release 367, deployment `dpl_392na5FgNY73SmSQm9N9GA4Lvn8K`, reached READY.
Homepage contract `35254105598`, controlled preview `35254105472` and contact
regression `35254105422` passed. Cleanup
`e2b81c17c5d7693088320440a3a736e8eae92e8b` restored the deployment flag.

At 390 × 844, answer width increased from 266.20 to 298.20 px (12%). The
first question appeared 28.80 px earlier, at 348.94 px. Section height was
1015.39 px and the first answer was 124.75 px high. Text remained 16 px, every
question was at least 70.39 px high, and the document had no horizontal overflow.

A native +70 / −70 px scroll pair changed the first reading line from scaleY
0.688905 to 0.817791 and exactly back to 0.688905. Focusing an already-open
answer set both the line and copy transforms to none. Paused mode kept every
line static; opening the second answer preserved the first and expanded the
section naturally to 1194.52 px. Motion was then resumed.

At 320 × 720, answer width was 228.20 px, section height was 1148.17 px, and
the first question appeared at 392.19 px. Rapid End → Enter → Tab moved focus
to the newly opened last answer, but exposed a brief 6 × 3 px copy translation:
the opening effect could restart after the focus handler had settled it.
The final correction checks for answer focus before starting that effect and
uses a focus CSS rule to keep the text stationary immediately.

## Final deployed acceptance

The final source `d18380e42397539b160be81b99e46d3e6bd31a60`, tree
`f76ccd60a3d9d9de8ab68d0621e2df6781b0cc81`, passed TypeScript, changed-file
ESLint, source homepage contract, typography floor, build and rendered contract.
The final rendered check verified 513,837 CSS bytes.

Deployment `dpl_3vtQMFw74baWvwDLmLJK7ENmSEYW` reached READY at trigger
`1cc494eaa8f494af498cf2ddb6e3a3837282aec0`. The source-to-trigger diff contains
only the controlled deployment flag. Homepage contract `35254927018`, controlled
preview `35254926987` and contact regression `35254926981` succeeded. Cleanup
`a6df190c71e29ae03d874de7d25fb48105613203` restored the flag to false.

Final Chrome responsive-frame checks:

| Viewport | Content width | Section height | Answer text width | First answer height | Horizontal overflow |
| --- | --- | --- | --- | --- | --- |
| 320 × 720 | 305 px | 1148.17 px | 228.20 px | 151.94 px | None |
| 768 × 820 | 753 px | 820 px | 312.84 px | 132.75 px | None |
| 1440 × 900 | 1425 px | 900 px | 622.39 px | 78.38 px | None |

The narrow layout retained the initial candidate's measurements. Repeating the
same rapid End → Enter → Tab sequence immediately reported transform none for
both the last answer's text and line, with focus on `home-question-5-answer`.
The complete answer was visible at 569.66–640.03 px in the 720 px viewport.
Shift+Tab and Enter closed it, kept focus on `home-question-5`, and immediately
made the answer hidden and inert.

The tablet screenshot retained two readable columns and the audit action inside
one viewport. On desktop, ArrowDown → Enter → Tab opened and focused the second
answer while preserving the first. Both text and line were immediately static,
and the answer occupied 324.94–430.50 px inside the 900 px viewport.

## Limits and shared link

The checks cover Chrome viewport layouts, native scrolling, keyboard and the
site's motion preference. Physical phones, Safari and OS-level motion emulation
were not tested. The browser blocks `/api/release`; exact release identity comes
from Vercel metadata, trigger comparison and the rendered changes.

The shared alias was repaired to release 366 earlier in this session and still
points to deployment `dpl_48YDZyZYv9R5dnTJJUvMGohdHiZz` after these releases.
The connection has no alias assignment action. `preview-link-repair.md` targets
the final verified release 368. Production was untouched.
