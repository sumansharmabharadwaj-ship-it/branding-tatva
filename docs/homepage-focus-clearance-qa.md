# Homepage focus clearance — release 360

## Reproduced on release 359

The cloud browser connection recovered on 2026-09-17. The exact release 359
deployment was opened through its Vercel share link. Tests used the deployed
responsive QA page, native keyboard input, native wheel input and read-only DOM
measurements. These are Chrome responsive viewport checks, not physical-device
or Safari acceptance.

- At 1440 × 900, the held Paths footer link ended at 837.80 px. Focusing it
  moved the document 18 px but could not establish the requested 80 px bottom
  clearance because the content remained sticky.
- In Questions, Space followed immediately by Tab focused an answer while its
  height was still zero. Once expansion finished, its bottom reached 870.41 px
  in a 900 px viewport, crossing the fixed guided control area. Focus remained
  in the answer, but the initial visibility correction had measured it too early.
- At 390 × 844, Tab into Studio's Strategy panel left its bottom at 938.42 px.
  Its 479.36 px reading could fit in the viewport, but ordinary Tab had no
  section-level visibility correction.

Other release 359 observations: Paths retained its choice during a reverse
wheel gesture. Repeated Home brought the same focused first tab from below the
viewport to a bottom of 819.80 px at 1440 × 900. Pause/resume retained the Paths
heading within 0.3 px while changing between held and document-flow layouts.
Paths panel and footer focus cleared the fixed controls at 390 × 844. At
320 × 720, Recognition's tall panel aligned its start at 79.88 px, the Tatva
End key selected Akash with visible focus, and the pressure controls selected
the missing Akash state without losing focus. No horizontal overflow was
observed at either phone width.

## Corrections

Paths now reserves at least 5 rem below its desktop frame. Its existing natural
height measurement releases the hold if the extra clearance makes the frame
too tall. Mobile keeps its existing flow layout and spacing.

An open Questions answer with focus within it uses its full natural height
immediately. The section's existing focus handler therefore measures all of
the reading before scrolling. The opening animation remains for pointer use,
and focus still moves to the question before a closing answer becomes inert.

Studio now checks keyboard visibility for its tabs, reading panel and links.
It uses 80 px scroll margins and nearest alignment when content fits; taller
readings align at their start. Already visible targets remain stationary.
Repeated Home/End rechecks the current tab after native scrolling. The text,
selection ownership and existing reversible reading transitions are preserved.

## Build verification

TypeScript, changed-component ESLint, homepage source contract, typography
floor, production build, rendered homepage gate and whitespace validation
passed. The final build generated 86 routes and verified 499,867 CSS bytes.
An earlier build was correctly rejected by the freshness gate after the
Questions stylesheet changed during compilation; the final complete rebuild
passed against all release 360 source files.

Source commit: `85b7370635f31d1a00fc08ef2dea0568a4767a64`.

Vercel deployment `dpl_7tLCpStkshU7EuKBe2M5aM62yvFQ` reached READY at
trigger `9c73afda548a82012669765bb05766f36989502b`. The source-to-trigger
comparison contains only the controlled `vercel.json` flag. Its `/api/release`
returned HTTP 200 at 14:56:55 UTC on 2026-09-17 and reported that exact commit,
branch `august-8-isolated` and environment `preview`.

GitHub homepage contract `35236645351`, contact regression `35236645463` and
controlled preview `35236645315` passed. Cleanup commit
`415fcbbb678a4786078163a2b11f4c7b818edbab` restored controlled mode.
The workflow again confirmed the existing alias credential is unconfigured.

## Deployed acceptance

The exact release 360 build passed the reproduced cases in Chrome:

| Viewport | Observed result |
| --- | --- |
| 1440 × 900 | Paths uses document flow when its 909.59 px complete frame cannot fit; focused footer ends at 820.30 px. Immediate Questions answer focus ends at 820 px, including while the inline animation still says height zero. |
| 390 × 844 | Studio's Strategy panel ends at 764.42 px; immediate Questions answer focus ends at 763.50 px. Studio pause/resume preserves the panel top at 285.06 px and returns Tab to the selected Strategy control. |
| 320 × 720 | Studio panel ends at 639.91 px and its proof link at 622.91 px. After a 650 px reverse wheel gesture takes the selected tab below the viewport, repeated End restores its bottom to 639.97 px without losing selection. Recognition's taller reading starts at 79.88 px. |
| 1280 × 790 | Paths footer ends at 710.36 px and Studio panel at 709.56 px. Both chapters use ordinary flow. |
| 1487 × 1058 | Paths retains the held layout with its footer ending at 917.13 px. Keyboard pause changes to flow, stops all videos, and moves the heading only 0.125 px; resume restores the exact 208.23 px heading position and original selection. Reversing tab direction retains focus on Reposition. |

No horizontal overflow was observed at these widths. Questions remained at its
corrected position after the expansion finished, and closing restored focus to
the visible heading while the independently opened first answer stayed open.

The native wheel automation returned a completion timeout, but a subsequent
read confirmed the 650 px movement and retained focus; the gesture was not
repeated. A pointer click on the pause control below the outer viewport of the
tall QA iframe had no effect. Keyboard activation of that same control worked;
both pause and resume were verified from the actual motion preference and
layout state. These tool limitations were not treated as application failures.

OS reduced-motion emulation, Safari and physical touch-device checks remain
outside this responsive Chrome coverage. Existing source checks cover the
OS and site preference fallbacks; they do not replace device testing.

At final verification the shared alias still resolved to release 357 deployment
`dpl_ETy3ey7duTKFk8vT3kGqyaa5k837`, commit
`5d64cf439c9a2081ae62090b0cb90bd64192741b`. Its release endpoint returned
an authentication redirect at 15:05:08 UTC, so that final alias check relies on
Vercel deployment metadata. The release 360 exact endpoint was independently
certified above. `docs/preview-link-repair.md` now targets release 360. Production
was unchanged.
