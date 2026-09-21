# Contact booking hover

## Baseline and change

On release 330 at desktop 1363 x 936, the first call step displayed the
truncated cursor text `You describe what has ch`. The booking action showed
`Open Calendly in Kolkata`, omitting the actual action. Short cursor labels
now use the existing compact step names, `Choose a time`, and
`Find a time with Suman`. Full accessible names remain unchanged.

At scroll 2777, the booking link started at x 720.390625, y 493.703125,
width 448.609375 and height 100. Hover at (995, 540) moved it to
x 724.472961, y 489.402618. The magnetic wrapper added a 4.08235 px
horizontal shift and the hover class raised the link another 4 px.

The Contact booking link now has a static wrapper and hit area. One finite
pass of warm light travels inside it on hover or keyboard focus; the
existing spotlight, shadow, arrow feedback and click ripple remain.
The new layer is decorative, clipped, pointer inert and hidden for both
manual and OS reduced motion. There are no new state subscriptions, frame
loops, listeners, assets or dependencies. The shared Magnetic component and
other pages are unchanged.

## Validation

TypeScript, edited-component ESLint, the existing cinematic motion gate and
diff checks passed before the combined build. Concurrent homepage release
331 is preserved.

The isolated full build passed all 86 pages. Contact remains 31.9 kB,
with 299 kB first load JavaScript. Source and release marker match the
built copy after rebasing the deployment cleanup commits.

Release 332 source: `abb544bd869239ccc37370c671888deeb1758387`.

Deployment trigger: `9b43a80d76468058db4faf75ba8d84979b22dce3`.
Deployment: `dpl_6NSHLhJgeWascVsnpiVnHapjnCed`, READY.
Host: `branding-tatva-bixns7wtb-suman22.vercel.app`.
Workflow: `35133964957`, job `104921560659`, success.
Cleanup: `cb8a8fe`, deploymentEnabled returned to false.
The controlled workflow's mocked delivery check passed. Production was unchanged.

## Hosted checks

Desktop 1363 x 936, document width 1348:

- At scroll 2777, resting and hovered booking-link rectangles were exactly
  equal: x 720.390625, y 493.703125, width 448.609375, height 100.
  The title rectangle also stayed exactly equal. Anchor and wrapper
  transforms, and the anchor translate property, were all `none`.
- Hover settled the decorative sheen from x -583.182 to +583.182 px,
  opacity 0 to 1, with the 0.9 s transform transition. The complete cursor
  label was `Choose a time`, 133.984375 px wide.
- All three call-step cursor labels were complete: `Where the brand stands`,
  `What shapes perception`, and `The decision to take`.
- Tab from the third call step focused the booking link, kept its full
  accessible name and triggered the same finite sheen. The browser scrolled
  the page to 3051; every scene's internal offsets, reading-plane offsets
  and departure-seam gaps remained zero.
- The closing invitation displayed the complete `Find a time with Suman`
  hover label while retaining its longer accessible name.
- Screenshots retained the authored gradients, typography and call layout.

Narrow responsive iframe 320 x 720, document width 305:

- At scroll 2751, resting and hovered booking-link rectangles were exactly
  equal: x 45, y 579.8125, width 215, height 96.78125. The title also stayed
  fixed. The sheen traversed x -279.5 to +279.5 px and the cursor label
  remained complete and inside the viewport.
- Manual reduced motion plus Tab focused the booking link, with sheen
  display `none` and transform `none`. The native focus state remained
  visible; the custom cursor was hidden.
- Every inspected scene retained zero internal scroll offsets, zero reading
  plane offsets and zero departure gaps. Document width equalled scroll
  width. Full motion was restored and confirmed afterward.
- OS reduced-motion coverage was checked in source; it was not emulated in
  this browser run. These are Chromium responsive-frame checks, not physical
  touch or Safari certification. No booking, enquiry, call or message was sent.

## Logs and review access

The desktop 100-entry log window included three failed RSC prefetches for
Privacy, Insights and About. Their cause was not established; those routes
were not navigated or retried. No Contact component exception was observed.
The narrow window also included Vercel login and browser-extension messages
from its initial protected navigation, with no Contact exception after access.

The direct narrow QA URL initially required login. The supported Vercel
share-link tool provided access to that path. The main Contact share link
opened both initially and in a fresh final review tab. Its reported expiry
is 17 September 2026 at 17:23:40; the tool did not specify a timezone.

The workflow again reported that the permanent preview alias needs the
missing VERCEL_TOKEN repository secret. Deployment protections and the
previously blocked release/footer endpoints were unchanged.
