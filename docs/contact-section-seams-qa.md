# Contact section gradient transitions

## Baseline

Release 318 (`branding-tatva-ju5va7rf9-suman22.vercel.app`) showed a hard
horizontal cut through the foliage where Call met the thank-you stage. At a
1363 by 936 desktop viewport, that boundary was at y 464.0625px after scrolling
480px from the Call anchor. The two sections touched with no layout gap.

The existing Call edge ended in `#f2eddf`, but the incoming botanical foreground
had no matching feather. This was a compositing discontinuity, not dead scroll
space. The approved gratitude composition and camera sequence remain intact.

Baseline dimensions: Choose 936px, Write 1025.390625px, Call 936px, gratitude
1759.671875px with its existing sticky travel. Gratitude's stage was 936px high;
its action group was at y 612.203125px with height 142.296875px once the stage
reached the viewport top. Document and scroll widths were 1348px.

## Change

- Replace the three chapters' static pseudo-element edge washes with five
  decorative motion layers: Choose departure, Write arrival/departure, and
  Call arrival/departure.
- Each feather scales from its own boundary on the existing scene timeline.
  Neighbouring edges keep matching, fully opaque colours. Text and controls
  remain above the washes with no change to layout or section heights.
- Share the existing reading-rest spring so the edges settle while typing or
  navigating with a keyboard. Compact screens use a smaller range of travel.
- Add an incoming paper wash above the gratitude foliage and below its text.
  It follows the existing entry progress, independently of optional sticky
  travel, and clears as the top boundary leaves the viewport. The finished
  composition remains unchanged.
- Reduced motion and server rendering use static feathers. All new decoration
  is hidden from assistive technology and ignores pointer input.

## Checks

TypeScript, edited-file ESLint, Contact contract, cinematic motion, invitation
motion, and mocked delivery checks passed. The invitation gate covered 2,002
reversible poses plus botanical, glyph, and momentum bounds. No real enquiry was
sent. No media assets, dependencies, or rendered copy were added by this patch.

The first build passed all 86 routes. A later integrated build generated all
pages but failed while removing its export directory; generated output was moved
aside and the clean integrated build passed all 86 routes. Contact is 31.8kB,
299kB first load JS. Subsequent integration changed release metadata and
documentation only. Sparse media was preserved through the base Git tree; the
local media presence gate was not run.

## Deployment

- Release 322, preview only, branch `august-8-isolated`.
- Source: `f8202adcf7f0717cdbd9d6a56c2c12e48761cea5`.
- Trigger: `bf4ef15c495ad3e822425c68b2843805ddde6974`.
- Deployment: `dpl_o4VJQ5q2uu2mYzeeVyL2UEZXRqDT`, READY.
- Host: `branding-tatva-5zzfv4uur-suman22.vercel.app`.
- Workflow: `35064005950`, job `104690198278`.

The workflow again confirmed that permanent alias reassignment needs the existing
`VERCEL_TOKEN` repository secret, which is missing. Deployment identity was
verified using Vercel metadata and the rendered UI. The previously blocked
`/api/release` endpoint was not re-probed through another route.

## Hosted acceptance

### Desktop, 1363 by 936

- All four section heights exactly matched the baseline. Document and scroll
  widths remained 1348px. The five chapter edge layers had matching neighbouring
  colours, opacity 1, and `pointer-events: none`.
- At the Call-to-gratitude boundary, y 464.0625px, the outgoing feather measured
  160.765259px and the incoming feather 139.393372px. A screenshot confirmed the
  formerly clipped foliage now blends into the preceding paper colour.
- Scrolling forward 465px brought the stage to y 0 and cleared the incoming wash
  to opacity 0. Stage height remained 936px. Action top 612.203125px and height
  142.296875px exactly matched the baseline.
- Reversing 465px returned page position and every computed Call edge / incoming
  wash value to the same intermediate state.
- The chapter rail returned to Write; clicking the name field settled both
  feathers at transform `none`, height 131.03125px. Scrolling 180px with the field
  focused preserved those values.
- No Contact application errors appeared in the inspected logs.

### Narrow browser viewport, 320 by 720

- Document and scroll widths both 305px. Choose, Write, and Call heights were
  755.484375px, 1351.609375px, and 735.09375px. Full-motion gratitude retained its
  existing 1180.796875px height.
- At a boundary y 361.1875px, the outgoing feather measured 109.937195px and the
  incoming feather 107.609985px. Screenshot inspection confirmed the soft join
  and readable content.
- Forward 362px cleared the incoming wash to opacity 0 at the pinned stage's
  top. Reversing 362px restored the same scroll, Call layers, and incoming wash.
- Reduced motion gave all five chapter edges `transform: none` in computed and
  inline styles, each 100.796875px high. Gratitude restored its existing 720px
  native-flow height. Its wash remained static at opacity 1 / transform `none`,
  including while its boundary was visible at y 426.1875px after scrolling.
- Tab moved to the second Call control with its focus outline intact; its target
  was 108px high. Full motion was restored after the checks.
- No Contact application errors appeared in the inspected logs.

No real enquiry, booking, phone call, or WhatsApp message was sent. These were
Chrome viewport checks, not physical iPhone or Safari device tests.
