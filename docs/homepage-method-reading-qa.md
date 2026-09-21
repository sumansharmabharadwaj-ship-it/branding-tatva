# Homepage working method reading acceptance

Verified 17 September 2026. Release 340 received the full browser matrix below;
release 341 adds keyboard clearance in very short viewports.

## Changes and baseline

The working method now reserves space for every stage's heading, explanation,
output and decision question at the current width and font size. Invisible,
inert copies provide measurement without additional accessible names or focus
stops. The live reading, output and contact action remain mounted.

On the baseline, the decision question grew by 39.734375 px between Question and
Influence on desktop. At 320 px, selecting Signal shortened the chapter and moved
the contact action by 35 px at the same scroll position. Both changes are removed.

The main copy moves 8 px horizontally and 2 px vertically over 380 ms. The decision
question moves 6 px in the opposite direction over 420 ms. Both remain fully opaque.
The glass note, tabs, output and contact action remain stationary. The shared
chapter entrance now leaves the method's controls and panel in place, while the
heading and introductory ink retain their scroll treatment. The photograph keeps
its native scroll camera movement. Keyboard and pointer reading settle the copy.

Focus in either the tabs or the panel preserves the selected reading. Native arrow
keys, Home and End select the corresponding stage and use a clay focus outline.
Visible tabs keep the document stationary. A tab outside the header and lower
control clearance is centered before focus moves, so compact screens keep the
selection visible. Motion pause retains the current stage and returns focus locally.

Browser testing also exposed a conflicting outer height rule: the process chapter
was forced to 900 px while its native sticky journey needed 2520 px. That clipped
Influence and Compound and prevented the full reverse-scroll sequence. The outer
chapter now follows its content height; RootSystem owns the native sticky span.
Shorter desktop frames that cannot contain the content continue in normal flow.

## Full browser acceptance on release 340

| Viewport | Result |
| --- | --- |
| 1440 × 900 | Both outer chapter and journey are 2520 px, with a 900 px sticky frame. Native scrolling reaches all six stages. The note stays 251.328125 px high, the output stays at y 604.65625, and the action stays at y 774.375, sized 280.125 × 48 px. |
| 320 × 720 | All six keyboard choices preserve chapter height 1608.84375 px and scrollY 6964. Note height is 192.453125 px; output y 889.484375 and action y 1462.515625 remain unchanged. Native Tab brings the contact action to y 325.515625–394.671875. |
| 1280 × 790 | Outer chapter and journey both follow their natural height of 880.609375 px. A native 160 px scroll exposes the action at y 603.265625. The footer is fully reachable. |
| 337 × 234 | The layout has no horizontal overflow. End initially placed the last tab at the viewport's bottom edge beneath floating controls; release 341 specifically corrects that clearance. This is a viewport equivalent of high zoom, not an actual browser zoom test. |

Desktop native scrolling reached Question, Decode, Architect, Signal, Influence
and Compound at scrollY 8625, 8925, 9225, 9525, 9825 and 10125. Reversing returned
through Influence and Architect. The photograph's transform changed throughout;
text remained fully opaque. Screenshots confirmed the final stage and footer were
visible. Native keyboard outlines measured rgb(128, 82, 57). Hidden measurement
copies contained zero focusable controls.

Pausing on Architect retained the stage and changed the action's screen position
by only 0.015625 px as the held chapter changed to normal flow. Tab from the motion
control returned to the selected stage at the same scroll position. Resuming
retained Architect with the text at rest; the next reverse scroll returned to
Question. A focused panel also retained Compound through native scrolling while
the photo continued its camera movement.

At 320 px, pausing retained Compound, scrollY 8101 and the visible contact action
at y 325.515625. Tab from the paused control returned to that action without a
document jump. Reading transforms were none. No horizontal overflow was observed:
content and scroll widths matched at 305, 1265 and 322 px in the narrow, laptop
and compact viewports.

These are browser viewport checks, not physical-device or Safari certification.
The in-page pause preference was exercised; the operating-system preference was
unchanged. Native focus scrolling was allowed to settle before measurements.

## Release 341 verification

The exact READY deployment was opened through Vercel's authenticated preview access.
At 337 × 234, End selected Compound and placed its focused tab at y 86.25–147.8125,
clear of the lower controls. ArrowLeft selected Influence with scrollY unchanged
at 7045. Home selected Question and centered it at y 86.53125–148.09375;
ArrowRight selected Decode with scrollY unchanged at 6912. All four native key
checks retained the clay outline. Chapter height stayed 1557.65625 px, the note
stayed 192.453125 px high, text opacity stayed 1, and reading transforms were none.
Content and scroll width both measured 322 px. The screenshot confirmed the full
focus ring was visible above the controls. Hidden measurement copies had zero
focusable controls.

The only source change between releases 340 and 341 is this keyboard clearance
fallback; the full scroll, responsive layout and pause results above apply to
the unchanged implementation from release 340.

## Build and release

TypeScript, changed-file ESLint, the homepage source gate, the type floor gate,
production build and rendered homepage gate passed for release 341. The rendered
gate verified 491,127 CSS bytes.

Release 340 full-matrix deployment:

- Source: `532e369aa497481279f8c91e86ae5e76f7dc807b`
- Trigger: `5c14265731fb802989e6d8b394efed55b0e8d7fb`
- READY deployment: `dpl_9GhXjkSaw5S567iMLuorzrx1AUxZ`
- Homepage workflow: 35184722692, passed
- Contact delivery workflow: 35184722716, passed
- Controlled preview workflow: 35184722686, passed

Release 341 keyboard clearance:

- Source: `8491d2e12c7e796a5170fe9c0d43bed2e1df5471`
- Trigger: `4b47a571b30a82f73c2cdd94639ab857503987e1`
- READY deployment: `dpl_6JjJWwYm7BZyNRAPTkByMJyuhEgv`
- Homepage workflow: 35185538651, passed
- Contact delivery workflow: 35185538657, passed
- Controlled preview workflow: 35185538696, passed
- Controlled-mode restoration: `8d11bb61ebc60f07b9aa976ddd81c3d48a24bd51`

The release 340 exact preview /api/release returned HTTP 200 and reported its exact
trigger, branch august-8-isolated and environment preview. Release 341 was verified
through its READY deployment metadata and exact deployed browser page. The
source-to-trigger comparison contains only the controlled vercel.json flag.
Its /api/release request returned HTTP 302 through the Vercel fetch tool; an
authenticated browser attempt was blocked by the browser client. Therefore the
release 341 endpoint itself is not independently certified here. Production was
unchanged.

## Permanent review link

The permanent alias returned HTTP 200 and still reported the older commit
bf4ef15c495ad3e822425c68b2843805ddde6974 during release 341 verification. The final
controlled deployment log confirmed the existing VERCEL_TOKEN repository secret
required for automatic reassignment is unconfigured. The permanent review link
therefore does not yet show these changes.
