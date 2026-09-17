# Homepage pressure-model motion

## Observed baseline

At 390 × 844 on release 326, the complete-system board measured 923.765625 px
high. Selecting Vayu reduced it to 789.546875 px. The reading changed from
328.421875 px to 279.125 px. Both the variable heading and explanation contributed
to the movement. The reading's keyed wrapper also replaced its audit link on
every selection.

## Changes

The heading and reading reserve the tallest actual text state at the current
width. Their measurement copies are hidden, inert, and excluded from the
accessibility tree. One stable copy group performs a brief directional text
transition. The audit link remains outside the moving text and live announcement.
Focusing or touching the reading settles the transition immediately.

Both sets of force buttons support Left, Right, Home, and End. All buttons keep
their native Tab stops. Visible targets retain scroll position; offscreen targets
receive the browser's native focus scrolling. Repeating Home or End retains the
selected force; clicking an already selected force still restores it.

Small signals travel along the existing connections as the diagram crosses the
viewport. Reverse scrolling reverses their travel. This uses the existing page
height and never chooses a force for the visitor. Reduced motion removes the
signals, settles text and line transitions, and stops the ambient gradient loops.

## Acceptance

Release 327 source `609278ac97516df2ce18c6b4e6db9540ad02622b` deployed as
`dpl_HzF6yF1kxJuwy8Ho7dBciLg2F3va`, trigger
`bc17775964da305bbfca231aa622f24358309e83`. All three source workflows passed.

At 1440 × 900, the board remained 534.125 px high, the reading 375.703125 px,
and the heading area 80.421875 px across Vayu, Prithvi, Akash and repeated End.
Keyboard selections retained scrollY 14823. A native +120 / -120 wheel pair
returned both scroll position and every signal coordinate exactly to their
starting values while retaining the selected Akash button. Tab moved from the
last diagram node to the named reading region, then to the audit link.

Desktop pause removed the five signals, settled copy to transform none, and
stopped both ambient gradients (transform none). The card moved less than 1 px
through pause/resume; the heading shifted about 3 px on resume as the existing
scene motion reactivated. Selection and reading height were retained.

At 390 × 844, all checked states, including restoration, retained the 928.28125 px
board, 332.9375 px reading, and 165.34375 px heading area. Node-key selections
retained scrollY 11791 and card top 468.765625. The audit link was reachable with
Tab and fully visible at 740.703125–784.703125 within the 844 px viewport. Both
force lists supported keyboard navigation; End focused the Akash list button
fully inside the viewport. Enter on that selected button restored all five.
Pause and resume retained the mobile reading and exact position. Document widths
matched their viewport widths (1425 px desktop, 375 px mobile), and the accessible
snapshot contained one active heading, one reading, and one audit link.

The final visual review found an existing mobile diagram mismatch: the 500 × 420
SVG sat in a 293 × 352 px container. Percentage-positioned buttons therefore
missed the drawn endpoints. The followup uses the SVG's actual aspect ratio,
removes the forced 22 rem mobile height, and anchors each marker rather than the
combined marker and label. Focus outlines may extend into the existing board
spacing. Final geometry acceptance follows below.

## Final geometry acceptance

Release 329 source `63982935de439080ae97e980656fecb8ecdf4d96` deployed READY as
`dpl_E4dSCxEPuFfgcvHz41w2PB3WHwMW`, preview trigger
`27f6d7864ea2be997a7f6ca7f17501bfcbe3e5f4`.

Mobile diagram dimensions now measure 293 × 246.109375 px and match the
500 × 420 viewBox. Every marker centre is within 0.014 px of its line endpoint.
The board is 822.390625 px tall, 105.890625 px shorter than release 327. Cycling
through all five forces with Home and Right retained that height, the
332.9375 px reading height, and scrollY 11737. After the browser's native Tab
scroll settled, pause/resume retained scrollY 12261 and reading top 127.875.
Signals were removed and the reading transform was none while paused.

At desktop size, the diagram measures 376.84375 × 316.546875 px. Every marker is
within 0.015 px of its endpoint. Board and reading heights remain 534.125 and
375.703125 px. A native +90 / -90 scroll pair moved and exactly restored all
signal coordinates, retained audit-link focus, and returned to scrollY 14824.
Both layouts remain horizontally contained. Mobile focus outlines can extend
into the existing spacing instead of being cut by the diagram wrapper.

The final production build and rendered homepage gate passed (489,183 CSS bytes).
TypeScript, changed-file ESLint, homepage source, and typography checks passed.
GitHub runs 35129979127 (homepage), 35129979094 (contact delivery), and
35129979048 (controlled preview) all succeeded. A build made before the final
marker-anchor edit was correctly rejected as stale; the complete final source
was rebuilt successfully before release 329.

## Review-link limitation

The exact deployment's protected QA page was visually and interactively checked.
Vercel metadata confirms the trigger above. Its `/api/release` request redirects
to authentication, so endpoint identity certification remains unavailable. The
last successful permanent-alias identity check still reported older commit
`bf4ef15c495ad3e822425c68b2843805ddde6974`; the final alias request also redirected
to authentication. The permanent review link is therefore not represented as
current. Alias mutation is unavailable through the connected tools. The release
329 deployment log explicitly confirms that the `VERCEL_TOKEN` repository secret
needed for permanent-alias reassignment is not configured.

## Release 354 pressure reading refinement

The release 353 baseline confirmed that selecting Akash moved its diagram marker
3 px off the line endpoint on both desktop and narrow phone. The unselected
marker error was under 0.015 px; selected vertical error became 2.991518 px on
desktop and 2.994196 px on phone. Desktop selection retained scrollY 16541 and
the 534.125 px board, 375.703125 px reading and 80.421875 px heading.

At 320 × 720, the baseline board measured 796.09375 px, the reading 365.4375 px
and the heading 165.34375 px. End selected Akash; Tab reached the reading at
top 354.734375 / bottom 720.171875, touching the viewport edge. Document width
matched its 305 px viewport.

Release 354 removes the selected node translation and the force-list hover
translation. The shared scene entrance now moves only a stable introduction
wrapper; choices, diagram, measured reading and audit link keep their positions.
Existing SVG connection signals still respond to native forward and reverse
scrolling.

The four original reading paragraphs enter separately, in document order, over
440 ms with 45 ms stagger. Forward and reverse choices have opposite horizontal
travel: 8 px desktop or 4 px compact, with 3 px or 2 px vertical travel. Text
stays opaque. Choice changes, entering the reading, pause and unmount cancel the
active animations. Resize and resume retain the chosen reading without replay.
Animation handles stay in refs, and neither the live text nor the audit link is
keyed or replaced.

A one-pixel accent rule between consequence and repair draws with the reading's
native viewport progress, reversing when scroll direction reverses. The rule
adds no height or scroll distance and becomes fully drawn while the reading
has focus or reduced motion is active. OS reduced-motion CSS provides the same
static fallback. The existing site pause also settles the audit arrow.

Keyboard targets use 80 px viewport clearance and one focus-placement handler.
Both force lists retain Left, Right, Home and End behavior; Tab keeps its native
order through the reading and audit link. Focus outlines use the existing sand
color. Visible copy, palette and media are unchanged.

Local TypeScript, changed-file ESLint, homepage source and typography gates,
production build and rendered homepage gate all passed. The rendered gate
verified 496,919 CSS bytes. Source commit:
`78e87c20e49dfedaf0513e4511ad0c5247a17175`.

## Release 354 deployment evidence and remaining acceptance

Vercel deployment `dpl_3iWtrkKekWTn3q4dhKL5QjZ4aA8C` reached READY, preview target,
for trigger `1fe00e3a0fb3a69a240343cc06bc6343aa206cbf`. Source-to-trigger comparison
contains only `vercel.json`. GitHub homepage contract `35215030682`, contact
regression `35215030756`, and controlled preview `35215030711` all passed.
The workflow restored controlled mode in
`f982c0379e7f1ccfc80b0d8583a28dea95d2dcb4`.

The browser connection failed with an exec-server transport disconnection while
opening the final desktop preview. Two subsequent connection attempts remained
unresponsive and were cancelled. No browser edits or alternate automation were
used. The measurements above are explicitly the release 353 baseline. Final
release 354 desktop, narrow phone, reverse-scroll and pause/resume browser
acceptance remains pending. Source review and build checks cover the intended
motion fallbacks; they do not substitute for the remaining interactive checks.

The authenticated Vercel fetch of the exact release's `/api/release` on
2026-09-17 at 11:24:40 UTC returned HTTP 302 to Vercel authentication. Exact
endpoint identity could therefore not be certified in this pass; the READY
deployment and trigger identity are confirmed by Vercel metadata and GitHub.

The controlled workflow again reported that the existing `VERCEL_TOKEN` secret
for permanent-alias reassignment is unconfigured. The permanent review link is
still treated as an older release. Production remains unchanged.

Resume acceptance on the exact release 354 preview: cycle both force lists;
confirm every marker remains within 0.02 px of its endpoint; check fixed reading
height and keyboard viewport clearance; inspect opposite, opaque paragraph
transitions; verify native forward/reverse signal and reading-rule movement;
then pause and resume with reading or audit-link focus and confirm retained
selection, readable text and stable visible geometry. Capture the final narrow
phone screenshot and retry `/api/release` certification through the browser.
