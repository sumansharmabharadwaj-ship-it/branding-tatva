# Homepage screenshot glitches — release 366

## Report and diagnosis

The six supplied screenshots show horizontal gradient bands at Recognition /
Hidden Cost, Process / Evidence and Studio / Questions, plus a cut-off portrait
caption. The screenshot URL identifies release 292, deployment
`dpl_BRZH8oWcjC2osnKD8FLteRx2r5KQ`, commit
`4ae0d55be1e76d0332efb6a2026d5ec38fe4cd72`.

Release 365 already displayed the complete portrait caption, but reproduced the
separate gradient bands. Its twelve transition elements measured 37.44 px at
1440 × 900 and 33.27 px at 1280 × 790. At the latter size, the strategist footer
link sat close to the fixed motion control.

## Changes

Transition elements now have zero height, zero block margin and no background.
Decorative children are clipped. The existing twelve structural markers and
chapter animations remain in place.

The portrait caption participates in a grid row instead of being absolutely
positioned, allowing its text to contribute to the card's natural height. The
former portrait maximum height is removed. The studio frame reserves at least
80 px of bottom padding, and the footer link has a 44 px minimum touch height.

The desktop fit check considers both offsetHeight and scrollHeight and observes
the content and portrait as well as the outer grid. A frame that needs more
room continues in normal document flow.

## Source verification

TypeScript, changed-file ESLint, source homepage contract, typography floor,
production build, rendered homepage contract and diff whitespace checks passed.
The build generated 86 routes; the rendered gate verified 13 chapters and
513,114 CSS bytes.

Source: `04035cacab51c7f59b003cbd2e9d3276648bf4ef`.
Tested/uploaded tree: `f10d7886d97d26c9cd1d875c6402c78d7d6f54fd`.

## Deployed acceptance

Preview `dpl_48YDZyZYv9R5dnTJJUvMGohdHiZz` reached READY for trigger
`ef50219c9c9b1566d3c4efaf8b67353d5d87826e`. The source-to-trigger comparison
contains only the controlled `vercel.json` deployment flag. Homepage contract
`35250465710`, controlled preview `35250465611` and contact regression
`35250465738` all succeeded. Cleanup
`55b1915df1e55ec6ad6a80525eb3595088880ef4` restored the flag to false.

Chrome responsive-frame measurements on this exact deployment:

| Viewport | Content width | Studio mode | Grid height | Caption height | Horizontal overflow |
| --- | --- | --- | --- | --- | --- |
| 1440 × 900 | 1425 px | Held | 900 px | 209.88 px | None |
| 1280 × 790 | 1265 px | Flow | 878.77 px | 164.89 px | None |
| 320 × 720 | 305 px | Flow | 1853.70 px | 130.11 px | None |
| 674 × 468 | 659 px | Flow | 1597.95 px | 116 px | None |

All twelve transition elements measured zero height, no background image and
zero gap between their adjacent chapters at every size. The same held while
motion was paused on the narrow phone.

The desktop portrait is 612 px high. Its caption ends 29 px above the card's
bottom, and the footer link is 44 px high. Selecting Literature and using End
to select Strategy preserved the 344.58 px reading panel and 900 px grid.
The proof destinations changed correctly to `/work/myshopineurope` and
`/work/dr-haley-nutrition`; Psychology initially linked to `/work/herbalcart`.

On the short laptop, the frame uses native flow. Scrolling 120 px exposed the
footer at 626.48–670.48 px within the 790 px viewport, clear of the bottom
controls. The caption ended at 568.50 px inside its portrait's 595.09 px bottom.
The Studio / Questions boundary was visible with no intervening gradient strip.

On the 320 px phone, selecting Literature with motion paused preserved the
552.56 px panel height and complete caption. After native scrolling, the caption
was visible at 455.16–585.27 px, inside the portrait's 602.27 px bottom and above
the bottom controls. Motion was resumed before the compact reflow check.

Native reverse scrolling also exposed Recognition / Hidden Cost and Process /
Evidence. Their adjacent edges matched at 239.83 px and 269.64 px respectively;
screenshots confirmed the broad bands were gone. Two scroll calls reported a
browser transport timeout, but subsequent DOM readings and screenshots confirmed
both gestures had executed.

## Limits and shared link

These checks cover Chrome viewport layouts and the site's motion control.
The 674 px check exercises compact reflow rather than actual browser text zoom.
Physical phones, Safari and OS-level reduced-motion emulation were not tested.
The browser blocks `/api/release` in this environment; release identity is based
on Vercel metadata, the exact trigger diff and the deployed CSS and interface.

The screenshot's release 292 URL remains an immutable older deployment. At
initial delivery, the familiar preview alias still pointed to release 357, deployment
`dpl_ETy3ey7duTKFk8vT3kGqyaa5k837`. The available connection has no alias
assignment action. `preview-link-repair.md` now targets release 366.
Production was untouched.

## Shared alias repair verified — 17 September 2026

The familiar alias now resolves to release 366 deployment
`dpl_48YDZyZYv9R5dnTJJUvMGohdHiZz` and trigger
`ef50219c9c9b1566d3c4efaf8b67353d5d87826e`, confirmed with Vercel metadata.
The shared site's 320 × 720 questions frame loaded and all twelve transition
elements remained zero height, with no horizontal overflow.

End moved focus from the first question to the last. Enter opened the last
answer while preserving the first, and Tab focused the complete last answer
at 565.95–640.33 px inside the 720 px viewport. The shared homepage also loaded
directly at `/#studio`. This is a follow-up verification of release 366, with
no new application release.

A direct pointer click on the deployed studio Literature tab preserved
scrollY 14658. The apparent shift seen with automated locator clicks did not
reproduce with the direct pointer gesture, so no speculative scroll fix was
made. The browser still blocks `/api/release`; the connected fetch on the
updated shared alias returned a 302 authentication redirect. Neither result
is an endpoint certification.
