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

## Release 358 keyboard visibility correction

Source review found that Paths moved keyboard focus with `preventScroll` for
ArrowLeft, ArrowRight, Home and End without checking visibility. After native
scroll moved the focused tab beyond the viewport, another key selection could
leave the new target offscreen. Ordinary Tab into the panel or its links also
lacked the explicit fixed-control clearance used by other updated chapters.

Paths now checks visible keyboard focus at section level for tabs, the reading
panel, package action and footer link. All of those surfaces use 80 px vertical
scroll margins. Fully visible targets remain stationary. Obscured small targets
use nearest alignment; targets taller than the available viewport align at their
start. Pointer focus and the section itself do not trigger the correction.

New arrow-key targets focus with `preventScroll` and use the section handler.
Repeated Home or End on the same focused tab checks visibility directly because
no new focus event fires. The selected path, mounted reading and links, measured
content space, scroll ownership and existing pause behavior are unchanged.

TypeScript, changed-component ESLint, homepage source contract, typography floor,
production build, rendered homepage gate (499,573 CSS bytes) and whitespace
validation passed. Source commit:
`944e1c21e4d56fa3590ffaeb243004290b72be31`.

The browser connection probe remained unresponsive and was cancelled. This is
a source-confirmed correction; release 358 interactive acceptance is pending.
The historical release 338 measurements above do not certify this new release.

Remaining checks: at 1440 × 900, 1280 × 790, 390 × 844 and 320 × 720, verify
Arrow keys, Home/End and Tab/Shift Tab across tabs, panel and links. Move the
focused first or last tab offscreen and repeat Home/End. Check visible targets
stay still, obscured controls clear both fixed edges, tall reading starts below
the header, reverse scrolling retains selection, and pause/resume retains the
focused node and readable text. Inspect OS reduced motion separately.

The permanent alias still resolves to older deployment
`dpl_o4VJQ5q2uu2mYzeeVyL2UEZXRqDT`, commit
`bf4ef15c495ad3e822425c68b2843805ddde6974`, at the start of this continuation.
The repository already declares the intended alias in `vercel.json`; another
configuration edit is not justified by the documentation or observed state.
The existing account-authorized alias repair remains pending. This workspace's
earlier CLI login was terminated by a network policy denial, so that device
session cannot finish the repair.

Release 358 deployment trigger:
`561178de180e3ce6814b21d7ecde04f66b558e74`.
Deployment: `dpl_GdU2F7RWtvJkNiE8tKcD5uWZMyeC`.
The source-to-trigger comparison contains only `vercel.json`.
Include the footer link in the held-desktop clearance check: its final position
depends on the measured frame and native sticky scrolling, and has not been
visually certified in this pass.

Release 358 reached READY. GitHub homepage contract `35220772850`, contact
regression `35220772948` and controlled preview `35220772991` passed. Controlled
mode was restored in `c68de5ded017147c5dd62084e25e94f702922935`.

The exact deployment's `/api/release` returned HTTP 200 at 12:26:04 UTC on
2026-09-17 and reported commit `561178de180e3ce6814b21d7ecde04f66b558e74`,
branch `august-8-isolated` and environment `preview`. This certifies the exact
preview identity, not browser interaction acceptance. Production is unchanged.

The current user-terminal repair steps are saved in
`docs/preview-link-repair.md`; they identify the release 358 deployment rather
than an older target. Assignment to release 358 remains outstanding.

At final verification the shared alias had advanced to release 357:
`dpl_ETy3ey7duTKFk8vT3kGqyaa5k837`, commit
`5d64cf439c9a2081ae62090b0cb90bd64192741b`. That update exposes the opening
and Recognition improvements. It does not yet expose the new Paths correction.
The local CLI still reports `login_required`, so workspace account access has
not recovered. The controlled workflow confirms the existing alias credential
is unconfigured and cleanup succeeded. The repair guide now distinguishes the
confirmed release 357 alias from the READY release 358 target.
