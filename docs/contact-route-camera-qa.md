# Contact route camera and light · 15 September 2026

The route photographs used their own raw scroll observer and pointer camera,
while the surrounding chapter used an eased scroll timeline. This pass gives
each route photograph and its window light the chapter's existing motion values.
Forward and reverse scrolling now move the photograph, light and heading together.

Book, Speak and Write retain distinct camera directions and transform origins.
Compact screens use less travel. Reading focus settles each camera into a still
composition through the same spring as the heading. The caption and route
controls remain outside the camera. The light brightens locally on mouse hover.

Inactive routes retain their outgoing media through the existing short dissolve,
then release the photograph, camera and light together. The shared card layout,
route selection and enquiry delivery behavior are preserved. Separate looping
video camera keyframes and the restarted hover glint were removed.

Reduced motion supplies explicit static camera properties and hides the light;
both site and system preferences have CSS fallbacks. Server HTML contains one
static camera with a transparent light and no hidden route cameras.

TypeScript, edited component ESLint, Contact and cinematic contracts, mocked
delivery and the production build passed. The build produced 86 routes with
298 kB Contact first load JavaScript.

Release 307 source: `1420f622edace268d1f98014417439a297a67d7f`.

## Hosted acceptance

- Desktop 1363 × 936: content and scroll widths both 1348px. The route panel
  retains its 568.40625px height and the Write section begins at document
  position 1759.671875px across all three route selections.
- At scroll 816px, Book's camera scale is 1.06051 and its light translation is
  -1.36094px. Reversing 180px changes them to 1.07205 and -31.982px; returning
  180px restores the exact earlier transforms. The photo covers the frame and
  its caption retains the same position within that frame.
- Hover changes only local light opacity from 0.18 to 0.32. Keyboard route
  selection settles the camera at scale 1.035 with zero translation and settles
  the light at zero translation through the shared reading spring.
- Narrow 320 × 720: content and scroll widths both 305px. All three photos load
  successfully and cover their 231 × 129.9375px frames. Route selection keeps
  scroll at 644px, the card height at 541.203125px and Write's document position
  at 1475.484375px. All tab heights remain 69.28125px.
- Each settled route contains exactly one photo, camera and light. The other
  routes are inert and their media have unmounted. Arrow key selection followed
  by Tab reaches the selected Speak route's phone link without opening it.
- Reduced motion leaves the camera transform at none, with bounds matching the
  photo frame and light opacity zero. Scrolling a further 100px preserves those
  properties. Full motion was restored after verification.
- The narrow session had no Contact application errors in its inspected logs.
  No enquiry, booking, call or WhatsApp message was sent.

Regenerating review access during the first desktop session was followed by
failed lazy image loads in that older session. A fresh narrow session loaded
all three unchanged source photos successfully. Review access should be kept
stable during a complete acceptance pass.

Deployment `dpl_8BFF2ZXPYp3MU9vgMpmdKDKBYWaR` is READY for trigger
`bd451d65c54aa295a3ad3272c38ee456b94ca47c` at
`https://branding-tatva-k0zwo2btn-suman22.vercel.app/contact`.
Workflow `35006676665` completed successfully and restored controlled mode.
Its completed job confirms that the existing VERCEL_TOKEN repository secret is
absent, so the permanent preview alias still cannot be reassigned. Production
remains unchanged.

The final renewed direct Contact link opened successfully in a fresh desktop
tab. All three photos loaded at 381px source width with access kept stable.
Pointer selection preserved scroll 816px, the 568.40625px panel and every tab
position. That final session had no Contact application errors in its inspected
logs. The final share expires on 16 September 2026 at 17:25 UTC.
