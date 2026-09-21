# Homepage controls and reading-position acceptance

Verified 16 September 2026 against isolated preview release 337.

## Baseline and changes

On release 336, the narrow mobile pause control remained 76 px above the bottom
even when the privacy notice had become a small shield in the opposite corner.
Its 600–644 px bounds at 320 × 720 could overlap the personalized booking button.
After pausing at the invitation, native Tab jumped to the opening CTA at
scrollY 187 instead of continuing the current reading.

The mobile pause control now docks at 12 px when the privacy notice is compact.
The full-width notice retains its existing 76 px clearance. A restrained 320 ms
position transition follows the notice's forward and reverse scroll state, with
an immediate position when motion is paused or the control receives keyboard focus.
The focus outline explicitly uses soil ink rather than the global ivory override.

The pause control and desktop guide share a current-reading focus helper. It uses
visible chapter geometry, selects an available local target, and avoids scrolling
when that target already fits the reading area. Hidden, disabled and inert targets
are excluded. The footer is its own reading region. Reverse Tab at the opening
keeps the normal route back to the header. The guide's opening description now uses
the actual chapter count rather than the old eleven-scene label.

## Browser acceptance

| Viewport | Checks |
| --- | --- |
| 320 × 720 | Compact pause control at y 664–708, booking at y 516.6875–595.46875. Tab after pause reaches booking at unchanged scrollY 17697. |
| 390 × 844 | Reverse Tab from the paused control reaches the invitation proof link at y 571.765625–615.765625, retaining scrollY 16650. |
| 1440 × 900 | Paused Tab returns to the questions section. Full motion retains both desktop guide buttons in order, then returns to the same section. Footer return stays local. |

At 320 px, the second Tab brought the lower proof link into view at
y 577.4375–640.21875, above the dock's y 664 top. Resuming motion and pressing Tab
returned to booking without changing the new scrollY 17787. The control stayed a
44 × 44 px target. Document content and scroll widths both measured 305 px.

At 390 px, the expanded privacy notice occupied y 774.8125–832; the pause control
ended at y 768, leaving clearance. Scrolling down 260 px compacted the notice and
moved the pause control to bottom 12 px. Reversing to scrollY 0 restored bottom
76 px and the expanded notice. Reverse Tab from the paused opening control reached
the header's “Open menu” button without moving the page. While paused, the control
had only a background-color transition of 0.00001 seconds and no position transition.
Content and scroll widths both measured 375 px.

On desktop, pausing at Questions collapsed the upstream story heights as expected.
Tab then reached “Talk through your question” at unchanged paused scrollY 12442.
After resuming, the sequence was Pause page motion → Play guided journey → Read the
homepage at your own pace → the current Questions link, all at scrollY 17917.
The link stayed at y 451.984375. At the footer, paused Tab reached its visible
newsletter frequency control at unchanged scrollY 15091. Both document widths
measured 1425 px.

These are browser viewport checks, not physical-device or Safari certification.
The in-page motion preference was tested; operating-system preferences were unchanged.

## Build and release

TypeScript, changed-file ESLint, homepage source gate, type floor gate, production
build and rendered homepage gate passed. The rendered gate checked 490,631 CSS bytes.

- Source: `19bdbc2b846caf778e858e70fece530f85d5f63e`
- Trigger: `64604323157e0ef5f3104602d214684773067777`
- READY preview: `dpl_GEWjU7KrfaAGSbM1kWQQDsC5yp2Z`
- Homepage workflow: 35142031832, passed
- Contact delivery workflow: 35142031915, passed
- Controlled preview workflow: 35142031834, passed

The source-to-trigger comparison contains only the controlled `vercel.json` flag.
The branch returned to controlled mode. Production was unchanged.

## Review-link limitation

The exact protected preview was inspected through authenticated QA pages. Vercel
metadata confirms its trigger. Both the exact preview and permanent-alias
`/api/release` requests returned 302 authentication redirects in this pass, so
the permanent alias is not certified as current. The release 337 deployment log
again confirms that the `VERCEL_TOKEN` repository secret required to reassign the
permanent alias is not configured.
