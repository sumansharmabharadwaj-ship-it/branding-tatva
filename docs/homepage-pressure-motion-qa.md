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
