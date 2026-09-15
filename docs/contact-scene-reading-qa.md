# Contact scene reading motion

Release 314 continues the Contact motion work on `august-8-isolated`.

## Change

Choose, Write, and Call now share one reading-rest spring across their scenery,
gradient current, exposure, sunlight, decorative thread, and heading. The existing
scroll timeline continues underneath. Focusing a field or using keyboard controls
eases the composition into its reading pose; leaving the section returns it to the
current scroll pose. The content plane and action targets retain their layout.

Explicit static values replace every animated transform binding in reduced motion.
Sunlight opacity uses the shared spring rather than a separate CSS transition.
There are no new scroll listeners, frame loops, dependencies, or rendered copy.

## Baseline evidence

Release 310, narrow 320 by 720 browser viewport, 305px document width:

- Opening optional fields by pointer kept the disclosure in place, apart from a
  5px native scroll adjustment. The previously suspected large form jump was not
  reproduced and was not treated as a bug.
- With the name field focused, scrolling 180px changed the background camera from
  scale 1.03135 / y 0.721293px to scale 1.03377 / y 2.00829px.
- The gradient moved from x -1.03863px / y 2.63021px to x -11.4252px / y 28.9315px,
  despite the heading already occupying its reading pose.

## Source checks

- TypeScript and edited-component ESLint passed.
- Contact contract and cinematic motion gates passed.
- Mocked delivery gate passed; no real enquiry was sent.
- Clean build passed all 86 routes. After preserving the concurrent release 313
  updates, the integrated build also passed. Contact is 31.4kB, 298kB first load JS.
- An interrupted build and a subsequent stale export-directory cleanup failure
  were resolved by replacing generated build output and rebuilding cleanly.
- Sparse public media was preserved through the base Git tree. No media was changed
  by this Contact patch; the local media presence gate was not run.

## Deployment

- Source: `264f5c2f11439b569062f91cabddc4637111ac9f`.
- Trigger: `7f6a64c9fb6b2142f0def146d27b087a60ab6561`.
- Deployment: `dpl_9Mvo99A475MWEPyAWAYgKDw3p1Jf`.
- Host: `branding-tatva-fdd924d1p-suman22.vercel.app`.
- Workflow: `35023384265`, job `104564416505`.

Deployment and controlled workflow both completed successfully. The permanent
branch alias still lacks the existing `VERCEL_TOKEN` repository secret. Its
reassignment notice was confirmed in this workflow. The exact deployment was
verified through Vercel metadata and browser UI; `/api/release` was not re-probed
after its previously recorded browser block.

## Hosted acceptance

### Narrow browser viewport, 320 by 720

- Document and scroll widths both 305px; no horizontal overflow.
- Focusing the name field produced an intermediate spring pose before settling
  at camera scale 1.03 / y 0, gradient transform `none`, exposure opacity 0.12,
  and sunlight transform `none` / opacity 0.
- A 180px scroll with the field focused preserved every one of those values.
- Optional expansion increased Write's height from 1351.609375px to
  2266.609375px. Scroll remained 1971px, and the disclosure remained at
  top 546.890625px / height 56px. The background reading pose stayed unchanged.
- Closing the optional section and clicking the background restored the live
  scroll pose. Forward 180px and reverse 180px returned the camera, gradient,
  sunlight, exposure, and page scroll to exactly their starting values.
- Reduced motion gave all three scenes static `none` transforms, including their
  inline styles. Sunlight stayed at opacity 0.16 and exposure at the CSS fallback
  0.1 during focused scrolling. Full motion was restored afterward.
- No Contact application errors appeared in the inspected logs.

### Desktop browser viewport, 1363 by 936

- Document and scroll widths both 1348px; no horizontal overflow.
- ArrowRight switched the Choose tab to Speak directly with keyboard focus.
  Choose reached the same settled camera, gradient, exposure, and light pose.
- The call-flow link reached Call. Tab moved focus to the second call step,
  retained its visible focus outline, and settled that scene. The call targets
  measured 71.5px, 71.5px, and 54px high.
- The chapter rail returned to Write. Focusing the name field settled its scene;
  the form remained 589.90625px wide by 861.71875px high, with a clear side rail.
- Screenshots confirmed readable fields, visible gradients, and unobstructed
  actions. No Contact application errors appeared in the inspected logs.

No enquiry, booking, call, or WhatsApp message was sent. These were Chrome browser
viewport checks, not physical iPhone or Safari keyboard tests. Hero and gratitude
retain their existing authored animation and were outside this patch's scope.
