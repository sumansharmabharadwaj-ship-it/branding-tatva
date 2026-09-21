# Contact route transition pass · 15 September 2026

The previous mobile route card changed from 617.56px for Book to 549.95px for
Speak. Its exit-before-enter animation removed the outgoing content from layout.
That combination could move the page and the following form during selection.

This pass keeps three text layers in one intrinsic grid cell. The tallest route
reserves the frame across viewport sizes and font loading; action rows use the
available height. Only the selected layer is accessible or interactive. A short
directional dissolve hands over between routes. Outgoing photographs remain for
that dissolve, then release their image/camera rather than keeping hidden films
running. The separate image entrance was removed to avoid two competing masks.

Cinematic chapters now render their readable pose on the server and enable the
camera after hydration. Compact chapter links also reserve the visible header's
height through scroll margin, without increasing section heights. The hero,
form delivery and closing invitation composition retain their existing behaviour.

## Verification

TypeScript, ESLint, the Contact contract and cinematic gates, and mocked delivery
checks passed. The production HTML contains three route layers with exactly one
accessible route, nine unshifted headline lines, and readable chapter frames.
A production build also passed on the combined branch after incorporating the
concurrent homepage update, producing 86 routes. Contact's first load is 297 kB.

Hosted acceptance passed on Release 294:

- At the 390px mobile preset, all three routes retain a 617.5625px frame.
  At the 320px preset, Book and Write retain a 541.203125px frame. Neither
  viewport has horizontal overflow (375px and 305px content widths respectively).
- Desktop Book and Speak retain a 568.40625px frame. Each settled route has one
  visible photograph; the two hidden routes are inert and contain no image.
- Direct pointer selection preserves the card and following form's page position.
  Forward, reverse and rapid keyboard selection settle on the intended route.
- Tab from the selected Book tab reaches See available times, skipping hidden
  links. Start the note moves keyboard focus to Write. No external action was sent.
- Reduced motion removes the gradient transform and preserves the route frame.
- The narrow Write destination lands at 76.484375px, with its heading at
  131.1875px, clear of the compact header. Its interaction plane is untransformed.
- Browser logs contained no application errors in the inspected interval;
  extension and earlier Vercel sign-in messages were unrelated to Contact.

## Deployment

Source commit: `d0f175ed11e1e561df5988499bb535a1d9280ee7`.
Vercel confirmed deployment `dpl_CTqVLkrErPHuPrH7V6sp632oaMuC` READY for trigger
commit `7c1e5784f9b38f659eddb16f613596ee6f1b36a6` on `august-8-isolated`.
The exact Contact preview was opened and inspected at
`https://branding-tatva-pzjjxe2gs-suman22.vercel.app/contact` through temporary
review access. Browser navigation to `/api/release` was blocked by the client;
release identity was verified through deployment metadata instead.

The usual branch alias remains on Release 292. Workflow run `34987577224`,
job `104443543374`, reports that permanent alias reassignment needs the existing
`VERCEL_TOKEN` repository secret, which is absent. The verified Release 294 share
link is the review destination until that credential is restored. No production
promotion was requested or performed.
