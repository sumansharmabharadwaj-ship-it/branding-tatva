# Homepage cost-stack reading acceptance

Release 351, checked 17 September 2026.

## Changes

The existing three cost cards keep their native sticky positions and spacing
when site or OS reduced motion is active. Pause removes decorative card scale,
text travel and line drawing. Compact screens retain ordinary document flow.
This avoids switching a visible sticky reading back to its earlier flow position.

Each cost is a labelled keyboard stop in the existing ordered list. A focused
card rises above the overlapping cards, keeps its text and rule still, and uses
a sand focus outline. This also applies when returning with Shift+Tab. Obscured
readings and the foundation link receive 80 px viewport clearance; readings
taller than the safe viewport align at their start. Section hash focus remains
owned by the existing homepage navigation.

Headings travel up to 8 px and paragraphs up to 12 px on desktop, with separate
scroll ranges. Compact travel is 4 px and 6 px. Both remain opaque, settle before
the sticky reading position, and reverse with native scrolling. Text selection
holds a card's current paint. The section heading remains intact and uses the
existing shared scene entrance, avoiding a second word-splitting animation.

The foundation link keeps a stationary hit area, with a color-only hover.
Visible copy is unchanged. There are no new packages, scroll spacers or wheel
handlers that prevent native scrolling.

## Baseline on release 350

At 1440 × 900, the three cards measure 244.375 px high, separated by a computed
252 px grid gap. In the middle of the stack, their tops are 135, 202.1875 and
538.453125 px at scrollY 3857.

Pause changes the cards from sticky to static. The shared reading-anchor
correction changes scrollY to 3697 and keeps the second heading within 0.11 px,
but moves the third card from top 538.453125 to 698.453125 px. The first reading
goes above the viewport. The computed grid gap stays 252 px; the observed jump
comes from changing positioning, despite the module's older reduced-gap rule.

Resuming leaves scrollY at 3696. Tab from the paused motion control skips the
three readings and lands on Build the foundation at 851.828125–899.828125 px,
against the bottom of the 900 px frame.

## Verification

TypeScript, changed-file ESLint, the homepage source gate, the type-floor gate,
production build and rendered homepage gate pass. The rendered gate checks
494,823 CSS bytes and the homepage's ordered chapters, unique IDs, heading and
media semantics and decision handoffs.

At 1440 × 900, the chapter remains 1932.171875 px high and the three cards remain
244.375 px high. Forward Tab reaches all three cost readings. The second and
third readings center at top 328.078125 and 327.453125 px when initially outside
the safe reading area. Shift+Tab from the third returns to the second at scrollY
4068 with no scroll change. Its 2 px sand outline, fully opaque text and elevated
paint order were checked in the DOM and a screenshot. Hit testing confirms the
second paragraph paints above the third card while focused.

Pause and resume preserve scrollY 4068, every card box, the 252 px gap and the
chapter height exactly. Native sticky positioning stays active. Tab from the
paused motion control returns to a cost reading without scrolling. Native
scrolling forward 180 px from scrollY 4108 and reversing 180 px returns to 4108
and restores every card box. The second card keeps focus throughout. The
foundation link remains wholly within the viewport at 628.828125–676.828125 px;
Enter changes the hash and moves focus to the foundation section.

At 320 × 720, all cards use static document flow with a 17.6 px gap. They measure
251.46875, 226.390625 and 226.390625 px high. Forward Tab places their complete
readings safely inside the viewport; the second and third begin at 246.84375
and 246.828125 px. Reverse Tab returns to the second at the same 246.84375 px
position. Pause, local keyboard return and resume preserve scrollY 3877,
the 1467.78125 px chapter and every card box exactly. Native scroll forward and
reverse by 120 px restores scrollY 3917 and every box, while the third reading
retains focus. Content width and scroll width both measure 305 px.

At 337 × 234, the first two oversized readings align their card tops at
79.5625 and 79.625 px. Native scrolling moves through the full paragraph without
losing focus or changing the list geometry. The 48 px foundation link centers
at 92.625–140.625 px, clear of fixed controls. Enter moves focus to the
foundation section; its settled top is 75.625 px. Content width and scroll
width both measure 322 px. These are CSS viewport checks, rather than physical
device or actual browser zoom certification.

The remote browser reports hidden visibility throughout. All text remains
opaque and readable, focused text has no travel, and native scroll geometry,
focus retention, reverse scrolling and site pause were verified. The local
scroll director correctly stands down while hidden, so its continuous text,
depth and meter animation progress is outside this browser acceptance. OS
reduced motion and selection holding were inspected in source rather than
emulated through unsupported browser APIs. Pointer activation and uninterrupted
foreground animation timing are also excluded. An initial mobile iframe
authentication failure was recovered with fresh authorized preview access
before the mobile measurements were taken.

## Deployment evidence

Source: `1bab3911b70d047394c713fe01f148222d203254`.
Git deployment trigger: `cbeefc0dd23e571c6d6119b9f312b81c7a1f7e18`.
Only `vercel.json` changes between source and trigger.
READY deployment: `dpl_AaTmQC8HetyvFTTPkG2nFEHojaiV`.
Vercel metadata matches that exact trigger.
The authenticated `/api/release` response at 09:40 UTC independently reports
the exact trigger commit, branch `august-8-isolated` and environment `preview`.

Homepage CI run 35205428465, Contact CI run 35205428374 and controlled preview
run 35205428576 all pass. Controlled-mode restoration commit:
`3a3f80a1081dd53f9f6cc64a2586605d75aff945`.

The permanent preview alias remains on an older build. The controlled workflow
again reports that its existing `VERCEL_TOKEN` repository secret is unconfigured.
Production remains unchanged.
