# Contact heading focus and ink · 15 September 2026

Choose, Write and Call previously reset heading transforms immediately through
a CSS override when a field or keyboard control gained focus. Removing focus
exposed the still running scroll transform in a single frame.

The scene now shares a damped reading spring with its heading. Each line blends
from its current scroll position into its reading pose and returns to the actual
scroll position on blur. The camera timeline continues throughout. Controls and
the content plane retain their existing fixed geometry.

Each of the three working headings has a curved SVG ink stroke. It draws and
retraces with the same scroll timeline, and completes during reading focus.
Reduced motion supplies explicit static values for all heading transforms and
the stroke length. Server HTML includes all three accessible heading labels and
complete, unmasked strokes.

TypeScript, edited component ESLint, Contact contracts, cinematic and invitation
contracts, copy checks and mocked delivery passed. The media presence gate is
limited by the sparse local checkout; existing Git tracked media are preserved.
The integrated production build passed with 86 routes and 298 kB Contact first
load JavaScript. Concurrent homepage Release 305 is included.

Release 306 source: `89f51077539778744742e4150af6f9e14d33aa3f`.
Deployment trigger: `3dfed0e99a67d0b8fa888b6895e3e64f0c043bab`.

## Hosted acceptance

- Desktop 1363 × 936: content and scroll widths both 1348px. At an entry pose,
  the Write lines were translated by -6.18578px, 7.10162px and 6.98776px, with
  ink length 0.5269599. Clicking the name field retained that pose on the first
  focus frame, then settled all three transforms to none and ink length to one.
  Tab moved to email without shifting the form. Blurring retained the resting
  first frame, then restored the exact earlier scroll pose and ink length.
- The writing section stayed 1025.390625px high. Its progress controls kept their
  positions and 48px heights throughout the desktop focus check.
- After switching to reduced motion and reversing 2200px, all three headings
  had no transforms and every stroke remained complete. The narrow preview
  also loaded reduced motion with complete unmasked strokes.
- Narrow 320 × 720: content and scroll widths both 305px. Choose, Write and Call
  headings and strokes fit inside the viewport; their controls remain fixed.
  A 180px forward scroll changed the Choose ink from 0.43175736 to 0.75289920.
  Reversing 180px restored the exact original ink and all three line transforms.
  All three narrow section compositions were visually inspected.
- Full motion was restored after verification. No enquiry, booking, phone call
  or WhatsApp message was sent.

The browser logged network failures while prefetching the footer privacy, terms
and editorial policy routes. These checks therefore do not establish clean
cross-page navigation. No heading rendering exception was observed.

Deployment `dpl_5mCAMRp16Y7jBUJYCy5KEURzStBp` is READY at
`https://branding-tatva-mktizc4vh-suman22.vercel.app/contact`.
Controlled workflow `35003895294` completed successfully and restored controlled
mode. Vercel metadata identifies the exact release trigger above.

The permanent alias remains stale because the existing VERCEL_TOKEN repository
secret is absent, confirmed by the completed workflow. Desktop temporary access
worked; the first mobile review link redirected to Vercel sign-in, then a renewed
narrow review link opened successfully. Production remains unchanged.

The final renewed direct Contact share link opened successfully in a fresh tab
at `/contact#write`. Its access expires on 16 September 2026 at 16:59 UTC.
The permanent alias was independently rechecked and still resolves to Release
292, deployment `dpl_BRZH8oWcjC2osnKD8FLteRx2r5KQ`.
