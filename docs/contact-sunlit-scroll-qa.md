# Sunlit invitation scroll interaction

Scope: animate the approved gratitude scene without changing its copy, imagery,
section height, form or booking destination. Other page sections are unchanged.

## Motion contract

Native section scroll drives an opening camera move, opposing headline travel
and a small acknowledgement lift. The pose is reversible and depends only on
scroll position. At the reading interval, the approved composition is exact.
There is no sticky hold, additional scroll distance, timer, hidden copy or loop.
The booking and writing actions remain outside the animated elements.

Desktop camera amplitude is 12%; phone amplitude is 5.5%, with no horizontal
headline movement on phones. Pointer drift is restricted to a mouse. The
reduced-motion setting and OS preference remove all layer transforms. Focus
inside the scene resolves the still reading composition immediately.

## Verification

Passed production compilation, lint, TypeScript and all Contact gates, including
the new 2,002-pose test. That test checks forward/reverse equivalence, finite and
clamped values, smoothness, mobile horizontal bounds, image edge coverage, and
the exact resting composition. The integrated build is checked again after
concurrent Insights and homepage updates are brought forward without changes.

Browser review on desktop (1363 × 936):

- Direct hash arrival: section top 0.375px, height 936px, full motion; all scroll
  transforms resolve to identity. Approved composition visually preserved.
- Scroll upward 420px: camera scale 1.0761 and y 19.0245px; headline lines move
  to x −27.9026px and +24.0977px. Action wrapper transform remains none.
- Scroll forward 420px: camera and headline return to identity at top 0.375px.
  Entry and settled screenshots were visually reviewed for clipping and overlap.
- Tab from booking reaches the writing link with a solid focus outline and all
  scene layer transforms reset to none. Enter reaches `#write`; its section top
  is −0.328125px and all three required fields remain available. No message sent.

Browser phone review in the existing 390 × 844 QA frame (375px content width
after scrollbar): correct portrait asset, height 844px, no horizontal overflow,
57.5px booking target. At entry top 218.4375px, camera scale is 1.01474, headline
x remains zero, and action wrapper transform remains none. Screenshot reviewed.
The reduced-motion control reports reduced, and every scene layer has transform
none and animation none. Full mode is restored after the check.

One mouse-action call timed out after the preference actually changed; the
subsequent DOM and computed-style read confirms the reduced state. This is
recorded as browser transport latency, rather than an application defect.

External Calendly submission is outside this test; existing href, target and
package-context routing are preserved. No live enquiry or booking was created.
