# Homepage evidence archive acceptance

Verified 17 September 2026. Release 342 received the full interaction pass below.
Release 343 adds horizontal clearance for the tab focus ring on narrow screens.

## Changes

Project metrics, industry labels, case link labels and each of the three proof
rows now reserve space using the actual text at the current width and font size.
Invisible, inert copies contain no controls or extra accessible readings. The
live project reading, inspect button and links stay mounted throughout selection.

The metric moves 8 px horizontally and 2 px vertically over 380 ms; proof text
moves 6 px in the opposite direction and 2 px vertically over 420 ms. Both stay
fully opaque. The three proof rules draw once over 580 ms. The glass dossier and
links remain stationary. The shared chapter entrance now leaves the tab strip
and panel still while retaining the heading and introductory ink treatment.
Existing directional photo reveals remain the main project transition.

Keyboard focus in the tabs or panel preserves the chosen file. Focus selects the
project, rather than creating a hover preview that disappears on blur. Mouse
previews respect keyboard ownership and are disabled on compact layouts and
paused motion. Home, End and Arrow keys reveal an offscreen tab without moving
an already-visible reading. Pointer or keyboard reading settles the text motion.

A ResizeObserver measures the natural archive frame. The desktop sticky story
is enabled only when the complete frame fits. Shorter screens use document flow.
The desktop frame reserves 56 px below its content to clear the floating controls.
The source gate was updated to require the stationary dossier and live proof text;
the restrictions on overlapping copy, blur and focus ownership remain in place.

## Release 342 browser acceptance

| Viewport | Result |
| --- | --- |
| 1440 × 900 | Native scrolling reaches all five files in a 2565 px chapter with a 900 px sticky frame. Each proof row stays 96.3125 px high, the metric stays 127.796875 px high, and the case action stays at y 767.015625, sized 165.65625 × 46.390625 px. The archive link stays at y 806.609375. |
| 320 × 720 | All five keyboard selections retain scrollY 8591 and chapter height 1941.34375 px. Metric height is 225.453125 px; proof rows stay 151.703125, 151.703125 and 177.203125 px. The case action stays at y 1074.0625 and the archive link at y 1802.421875. |
| 1280 × 790 | The frame uses normal flow because its natural height is 813.796875 px. After a native 120 px scroll, the case action is at y 535.34375 and the archive link at y 574.9375. The complete footer is reachable. |
| 337 × 234 | End selects and centers the last tab at y 59.84375–173.15625, above the floating controls. The outer focus ring needed slightly more room at the horizontal strip edge; release 343 corrects that padding. This is a high-zoom viewport equivalent, not an actual browser zoom test. |

Desktop scrolling reached Dr. Haley Nutrition, MyShopInEurope, Executive
Springboard, HerbalCart and Plaxonic.com Content Portfolio. Reversing returned
to Executive Springboard and MyShopInEurope. The proof rows and action geometry
remained stable. Natural scroll admission can differ by a fraction of a pixel at
the sticky boundary; the first frame's action was at y 767.25.

Native Tab placed focus in the project strip. Home selected the first file and
ArrowRight selected MyShopInEurope, both at scrollY 12722. Tab into the panel and
inspect button left text transforms at none and opacity at 1. The focus outline
was rgb(234, 214, 188). Hidden measurement copies contained zero focusable controls.

Space opened the MyShopInEurope dialog with focus on Close project file. Escape
closed it and returned focus to the same inspect button at scrollY 12722. Pausing
retained MyShopInEurope and contracted the chapter to 900 px, with the action's
screen position changing by 0.421875 px. Tab from the motion control returned to
the selected project tab. Resuming retained the selection and restored the hold.

At 320 px, the horizontal strip revealed all five keyboard choices. End selected
the last tab with document scroll unchanged and strip scrollLeft 579. Native Tab
reached its case link at y 336.0625–384.0625 and scrollY 9329. The screenshot showed
a complete, visible action and focus ring. Pausing retained the project, text
geometry and scroll position; text remained fully opaque with no transform.
The motion control returned focus to the local inspect action.

Content and scroll widths matched at 1425, 305, 1265 and 322 px respectively.
Desktop, narrow and short-viewport screenshots were inspected. These are browser
viewport checks, not physical-device or Safari certification. The in-page pause
preference was tested; the operating-system preference was unchanged.

The browser connection intermittently stalled during baseline inspection and
pointer-based automation. A fresh tab recovered the deployed page. Native scrolling,
keyboard navigation and dialog checks completed successfully afterward. Captured
console errors referred to the browser extension's metadata connection; no site
change was made to work around those infrastructure errors.

## Release 343 final check

At 337 × 234, End placed the final tab at x 129.875–289.875 inside a strip extending
from x 24 to 298. The 8 px inline padding leaves room for the complete 2 px outline
and its 4 px offset. Its vertical bounds remained y 59.84375–173.15625, above the
floating controls. A screenshot confirmed the right edge of the ring is now whole.
Home returned to the first tab at x 32–192 and strip scrollLeft 0 without changing
document scrollY 8654. The chapter retained height 1915.84375 px.

The final desktop preview also retained the focused Plaxonic case link through
native scrolling. This confirms keyboard reading continues to own the selected
file while the page moves. The exact destination remained
/work/plaxonic-content-portfolio.

## Build and release

Release 342 passed TypeScript, changed-file ESLint, the homepage source gate, the
type floor gate, production build and rendered homepage gate. The rendered gate
verified 491,970 CSS bytes.

- Source: `ba44687fa93534d6fc0b1e6ee824082000dea2c1`
- Trigger: `147e76e5de46915bfd179dc4b2ac05234c4b0b04`
- READY deployment: `dpl_61tyKD7kMvhaER339ALZF5ecGqHv`
- Homepage workflow: 35186982042, passed
- Contact delivery workflow: 35186982347, passed
- Controlled preview workflow: 35186982219, passed
- Controlled-mode restoration: `ba06d6045e5b19218c1376a3d3e97057fbed999a`

The source-to-trigger comparison contains only the controlled vercel.json flag.
The exact preview /api/release returned HTTP 200 and reported the trigger above,
branch august-8-isolated and environment preview. Production was unchanged.

Release 343 passed the same local gates and production build, again verifying
491,970 CSS bytes. Its only source change is the narrow tab strip's horizontal
padding and scroll padding, increased from 0.3 rem to 0.5 rem.

- Source: `e53a920f04927fbd7193722f89c469d1cd78b108`
- Trigger: `4f8a38e07ebd44fc3b1bdf73a14e878eb56ec7f6`
- READY deployment: `dpl_3fbC2LFjjrt7j7tpz3tbPFwtR3p3`
- Homepage workflow: 35188177407, passed
- Contact delivery workflow: 35188177387, passed
- Controlled preview workflow: 35188177382, passed
- Controlled-mode restoration: `3b108340ce25f9f1d2a3f07bd33a84a5da683e39`

Release 343 was verified through its READY metadata and exact deployed browser
page. Its source-to-trigger comparison contains only vercel.json. The Vercel
fetch tool returned HTTP 302 for this release's /api/release, so the endpoint
itself is not independently certified for 343. The complete release 342 endpoint
check above and both deployment metadata records are retained separately.

## Permanent review link

The permanent alias returned HTTP 200 but still reported the older commit
bf4ef15c495ad3e822425c68b2843805ddde6974. The release 343 deployment log confirmed
that the existing VERCEL_TOKEN repository secret needed to reassign the alias is
unconfigured. The permanent review link does not show this archive refinement.
