# Homepage foundation reading acceptance

Release 345, checked 17 September 2026.

## Changes

The foundation title and explanation reserve the tallest of the four readings at
the current font size and width. Each of the three output positions also reserves
its longest label. Hidden measurement copies are inert and contain no IDs or
controls. The live reading, tab panel and action remain mounted.

The title and explanation move 8 px horizontally and 3 px vertically over 380 ms.
Output text moves 6 px in the opposite direction over 420 ms while its three
vertical rules draw over 580 ms. Text stays fully opaque. Focusing or pressing the
reading panel settles all three motions. Both motion preferences keep a static
equivalent.

The shared entrance now animates only the introduction, approaching from above
to clear the stationary tab strip. The reading panel and action stay still while
the existing landscape camera follows the native scroll. The action no longer
has a magnetic movement hook.

Keyboard focus selects a persistent choice. The tab strip, reading and action
share focus ownership, so scroll and hover cannot replace a keyboard reading.
Mouse previews are limited to the desktop cinematic mode. Home, End and Arrow
keys center a tab only when it would fall behind the fixed header or floating
controls, then focus it without another scroll.

A ResizeObserver measures the complete natural frame. The 220svh sticky story
is enabled only when the frame fits the desktop viewport. Shorter viewports or
larger type keep the reading in normal document flow. The breakpoint remains
1181 px wide and 761 px tall with a fine pointer; the site and OS reduced-motion
CSS independently release the hold.

## Reproduced baseline

On release 344 at 320 × 720 and scrollY 4720, Audience had a 362.390625 px panel
and its action started at y 764.484375. Selecting Category changed the panel to
320 px and moved the action to y 722.09375, a 42.390625 px shift. Position also
used the shorter panel. The chapter height changed from 1000.4375 to 958.046875 px.

During the baseline native scrolling check, Category retained keyboard focus
while Audience became the selected tab. The revised focus scope and explicit
focus selection address this mismatch.

## Release 345 browser acceptance

| Viewport | Result |
| --- | --- |
| 320 × 720 | Category, Audience, Belief and Position all retain scrollY 4600, chapter height 1000.4375 px, panel height 362.390625 px and action top 884.484375 px. The former 42.390625 px action shift is gone. |
| 1440 × 900 | The complete 900 px frame fits and enables the 1980 px native sticky story. All four forward and reverse readings retain panel height 256 px, panel top 459.703125 px and action top 735.703125 px. |
| 1280 × 790 | The natural frame is 806.53125 px high, so the scene uses normal flow. After native scrolling, the action is fully visible at y 458.21875–506.21875. |
| 337 × 234 | End selects and centers Position at y 94.8125–138.8125. Home centers Category at the same height. ArrowRight then selects Audience without moving scrollY 4687. The outline is whole and clears the floating controls. |

Content and scroll widths match at 305, 1425, 1265 and 322 px respectively.
Screenshots were inspected at all four viewport sizes. The compact check is a
high-zoom viewport equivalent, rather than a browser zoom or physical-device test.

The live reading contains one h3. The hidden measurement copies contain zero
focusable controls. The narrow action's focus outline is rgb(128, 82, 57), 2 px
solid, with the complete ring visible. All three live output labels remained
fully opaque. Focus in the panel settled the live reading transform to none.

At 320 px, native Tab reached the Position reading and then the action at
y 336.484375–384.484375 and scrollY 5148. Pausing and resuming retained Position,
the exact scroll position, panel height and action geometry. Native Tab from the
paused motion control returned to /services#package-brand-beginning.

Desktop native scrolling reached Category, Audience, Belief and Position at
scrollY 4774, 5074, 5374 and 5674 respectively. Reversal returned through Belief,
Audience and Category at the same positions. Keyboard-selected Belief then
retained both selection and focus through a 900 px native scroll. Two Tab presses
reached its panel and the foundation action without changing the selection or
the action's position.

Desktop pause retained Belief, released the chapter to 900 px and stopped the
camera, live text, output and rule transforms. Sunlight opacity became zero.
The action moved from y 735.703125 to 734.8125, less than one pixel. Native Tab
from the paused motion control returned to the selected Belief tab. Resume kept
Belief selected and restored the 1980 px story and original action position.

The site motion preference was tested. The OS preference remained unchanged;
its independent CSS fallback and matching render path were reviewed. These are
browser state, layout and interaction checks, rather than Safari or physical
touch-device certification. Protected preview navigation sometimes reopened
Vercel's login screen. Refreshing the authorized root preview link restored the
session; no sign-in credentials or alternative authentication path were used.

## Build and release

TypeScript, changed-file ESLint, homepage source gate, type floor gate,
production build and rendered homepage gate passed. The final rendered gate
verified 492,838 CSS bytes.

- Source: `4b025b6bdbe675479166f39cc1f20e7a5e600a0a`
- Trigger: `b2cd1bf23910f673a32b4886398d5a2bfa886480`
- READY deployment: `dpl_8DKes2Zge9LMXyYCvAsRzyP9QiAK`
- Homepage workflow: 35195595583, passed
- Contact delivery workflow: 35195595417, passed
- Controlled preview workflow: 35195595385, passed
- Controlled-mode restoration: `201725ae95b28a5270de69aac49b78e640dd996f`

The source-to-trigger comparison contains only vercel.json. READY deployment
metadata identifies the exact trigger on august-8-isolated. Browser checks used
that deployment. The Vercel fetch tool returned HTTP 302 for its /api/release,
so that endpoint itself is not independently certified. Production was unchanged.

## Permanent review link

The permanent alias returned HTTP 200 but still reported the older commit
bf4ef15c495ad3e822425c68b2843805ddde6974. The release 345 deployment log confirms
that the existing VERCEL_TOKEN repository secret required to reassign the alias
is unconfigured. The permanent review link does not show release 345.
