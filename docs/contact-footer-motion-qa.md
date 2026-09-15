# Contact closing light · 15 September 2026

The footer previously animated from entry to 72% or 88% of its full viewport
crossing. The page ends when the footer becomes fully visible, so those timelines
could never complete. They also depended on CSS view timeline support.

ContactFooterMotion now measures only footer entry, from its top reaching the
viewport bottom to its bottom reaching that same edge. The horizon opens and
then narrows while the warm light settles behind the footer links. Scrolling
backwards retraces the same motion. No extra height, artificial scroll distance
or moving controls are needed.

The server frame uses a complete static gradient. Hydration and motion preference
changes synchronize the spring to the current scroll position; changes to page
or footer size are tracked. Both site and system reduced motion retain a static
closing composition. The existing footer landmark, links and controls remain in
the server render.

TypeScript, ESLint, Contact contracts, cinematic contracts and mocked delivery
checks passed. The production build passed with 86 routes and 298 kB Contact
first load JavaScript. Server HTML includes the static initial footer, its
landmark, four links and three controls.

The previous Release 301 mobile preview confirmed the incomplete endpoint:
remaining scroll was zero, but the horizon scale was 0.947231 and opacity
0.721788, instead of its authored final scale 0.42 and opacity 0.34.

Release 302 source: `b5c6c1f55d45497db6ad5096e6038812a1493238`.
Its preview reached progress one at the mobile page endpoint, with horizon
scale 0.62 / opacity 0.45 and light scale 1.08 / opacity 0.14. Reverse scrolling
190px returned progress to 0.5042, and returning to the endpoint restored the
exact final pose. The footer remained 238px high, content and scroll widths were
375px, and all seven controls retained their positions and 44px heights.

That hosted check also found a reduced motion issue: removing the style object
could leave custom properties attached to a settling spring. Release 304 replaces
the live properties with explicit static values when motion is reduced.
Concurrent homepage release 303 is preserved.

The final integrated build also passed with 86 routes and 298 kB Contact first
load JavaScript. Its server footer carries explicit resting progress and light
properties. Release 304 source is `4aa405a5f130d35158a68b5bde8b9d176134ab32`;
its trigger is `38cae39772f89cda61f931f34310f031bb015613`.

## Final hosted acceptance

- Release 304 mobile 390 × 844: reduced motion now keeps progress fixed at one,
  horizon opacity 0.45 and light opacity 0.14 while scrolling 190px backwards.
  Both decorative transforms are none. Returning to full motion restores the
  authored endpoint with the same footer geometry. Tab transfers focus from
  Full to Reduced while controls remain stationary.
- Narrow 320 × 720: content and scroll widths both 305px; the 298px footer reaches
  progress one at the page endpoint. The horizon settles at scale 0.62 / opacity
  0.45 and the light at scale 1.08 / opacity 0.14. All seven controls are 44px high
  and untransformed.
- Desktop 1363px viewport: content and scroll widths both 1348px; the 84px footer
  reaches progress one at the page endpoint, with the same exact final light
  values. Its links and controls stay at their existing 24px heights.
- No Contact application errors appeared in the inspected browser logs.

Deployment `dpl_Fv45vwsQS1AVBdjeBhjYABvMihtL` is READY at
`https://branding-tatva-9bufck7d1-suman22.vercel.app/contact`.
Controlled workflow `35001367729` completed successfully and returned the branch
to controlled mode. Vercel metadata identifies the exact release trigger.

The permanent alias remains on Release 292. The completed workflow confirms its
existing VERCEL_TOKEN repository secret is absent, preventing alias reassignment.
Review uses temporary access to the exact release deployment. Production remains
unchanged. No enquiry, booking, phone call or WhatsApp message was sent.
