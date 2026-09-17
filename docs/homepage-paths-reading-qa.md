# Homepage Paths reading acceptance

Verified 17 September 2026 against isolated preview release 338.

## Changes and baseline

On release 337, native keyboard selection moved the package action by 26.390625 px
between Foundation and Full Brand System at the same document scroll position.
The global ivory focus outline also overrode the clay outline on this light section.

Paths now measures its possible readings at the rendered width and font size.
Invisible, inert copies reserve the title, description, question, decision rows and
button label without introducing extra accessible names, IDs or focus stops.
The mounted action is outside the reading transform and has a consistent width.

Fully opaque copy moves 6 px horizontally and 2 px vertically; the question group
moves 8 px. Both return to rest in 360–400 ms, reversing direction with the selection.
The former card rotation and delayed row animations are removed. The shared chapter
entrance leaves the tabs and panel stationary; the heading and introductory ink
retain their scroll treatment. Keyboard or pointer reading settles the copy.

Keyboard focus in either the tabs or panel preserves the current reading. Mouse
previews respect that ownership; touch and paused motion do not start hover previews.
The focus outline explicitly uses clay ink. A ResizeObserver measures the natural
frame: only a frame that fits the desktop viewport receives the native sticky hold.

## Browser acceptance

| Viewport | Result |
| --- | --- |
| 1440 × 900 | Complete 900 px frame with a 1800 px scroll chapter. All three actions remain 304 × 49.59375 px, at the same top position through Arrow keys, Home and End. Panel and action focus remain local. |
| 390 × 844 | Natural 1226.046875 px section. All choices keep the action at y 672.90625 and the document at scrollY 5227. Action width 327 px. Forward and reverse scrolling retain the chosen path. |
| 320 × 720 | Natural 1369.546875 px section. All choices keep its height and the action position unchanged. Native Tab brings the action into view at y 335.453125–385.046875. Action width 257 px. |
| 1280 × 790 | The measured 848.4375 px frame releases the sticky hold and flows normally. A 130 px scroll exposes the complete footer at y 610–671 without changing the selected path. |

Desktop native scroll reached Reposition at scrollY 7194, Ongoing at 7534, then
Reposition at 7184 on reversal. In the held frame the action stayed at y 675.0625.
A focused Brand Partnership action retained its destination while the page scrolled
410 px. Tabbing into the panel settled both text transforms immediately. Computed
keyboard outlines were rgb(128, 82, 57); text opacity remained 1.

Pausing on desktop retained Reposition. The chapter contracted from 1800 to 900 px
while the action's screen position changed by less than half a pixel. Resuming
retained the selection and restored the held frame with both reading transforms at
rest. The next reverse scroll returned to Beginning.

At 320 px, pausing retained Ongoing and scrollY 6006. Tab from the paused control
returned to the visible package action at the same scroll position. Both reading
transforms were none. Resuming retained the current path.

No horizontal overflow was observed: content and scroll widths matched at 1425,
375, 305 and 1265 px respectively. The hidden measure elements contained zero
focusable controls. Desktop and mobile screenshots were inspected for wrapping,
reading gaps, focus contrast and the lower section handoff.

These are browser viewport checks, not physical-device or Safari certification.
The in-page pause preference was exercised; the operating-system preference was
unchanged. Native focus scrolling was allowed to settle before final measurements.

## Build and release

TypeScript, changed-file ESLint, the homepage source gate, the type floor gate,
production build and rendered homepage gate passed. The rendered gate verified
490,757 CSS bytes.

- Source: `d51c78e2b3fe0895c4ad14dc8b7960dc0df96931`
- Trigger: `42a2b69393dcfa11430c52a9bfaaa8045a86548a`
- READY deployment: `dpl_HkYzUNAEpS3ZVQnhRSQ3KKCAVrJM`
- Homepage workflow: 35182644590, passed
- Contact delivery workflow: 35182644618, passed
- Controlled preview workflow: 35182644762, passed
- Controlled-mode restoration: `a131fdd98e0c429e038875b8b539e56704909ae1`

The source-to-trigger comparison contains only the controlled vercel.json flag.
The exact preview's /api/release returned HTTP 200 and reported trigger
42a2b69393dcfa11430c52a9bfaaa8045a86548a, branch august-8-isolated and environment
preview. The protected responsive QA pages were inspected on that deployment.
Production was unchanged.

## Permanent review link

The permanent alias returned HTTP 200 but still reported the older commit
bf4ef15c495ad3e822425c68b2843805ddde6974. It does not expose release 338.
The controlled deployment log again confirmed that the existing VERCEL_TOKEN
repository secret needed for permanent alias reassignment is not configured.
