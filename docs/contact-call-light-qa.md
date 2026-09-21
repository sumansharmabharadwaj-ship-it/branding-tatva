# Contact call and window light · 15 September 2026

The call chapter previously moved its selected row on pointer or keyboard input,
while the line between steps continued to represent the scroll position. Its
shared layout highlight also travelled between differently sized rows and columns.

The three steps now draw from one continuous motion value. Scrolling, pointing,
tapping and focusing move the number's ink, connecting trace and selected wash
together. A local dissolve replaces the travelling layout layer. A small scroll
dead band prevents repeated highlight exchanges at a stage boundary. Arrow keys,
Home and End inspect steps without moving the viewport; Tab remains available.

Choose, Write and Call also carry a soft window-light band on their existing
camera timeline. Reverse scrolling retraces it. Compact screens use a shorter
path; reading focus settles the light. No extra sections or scroll distance are
introduced. Controls stay in their existing reading plane.

The server frame and reduced-motion version show complete, static ink. Motion
uses the existing library with no new dependency, media request or timer loop.

## Verification

TypeScript, ESLint, the Contact contract and cinematic motion gate passed.
The production build passed with 86 routes and 297 kB Contact first-load JavaScript.
Production HTML contains three stationary light layers, three complete ink rings,
two static traces and all three readable call steps before hydration.

Hosted acceptance passed on Release 296:

- Mobile 390 × 844: content width and scroll width both 375px. All step rows are
  108px tall and the booking card remains 428.234375px through selection.
- Direct clicks keep the chapter at 76.046875px. The first step resolves the
  connector to zero, the middle step to 0.5 and the last step to one. The same
  selection develops the ink rings and the local wash.
- ArrowLeft moves focus and selection backwards. A direct End key selects the
  final step without changing the settled 91.046875px chapter position. Locator
  input initially adjusted the viewport by 15px; direct keyboard input confirmed
  the application's preventScroll behaviour independently of locator focusing.
- A 230px reverse wheel gesture returns the manual final-step choice to the
  first scroll beat, retracts the ink and retraces the window light.
- Reduced motion resolves all rings and both traces, removes the light transform
  and retains the same booking height. Reloaded reduced motion also renders
  complete SVG circles without waiting for animation.
- Narrow 320 × 720: content width and scroll width both 305px; call lands at
  76.09375px, all step labels fit, and the booking card is 426.59375px tall.
- Desktop 1363px: first and final selections retain the 544.90625px booking card
  and the 7.0625px chapter position. The vertical trace reaches its completed
  pose. The content plane remains untransformed on desktop and compact screens.
- No application errors appeared in the inspected browser logs. No enquiry,
  calendar booking, phone call or WhatsApp message was sent during acceptance.

## Deployment

Source: `c9ff5c360ea03691b0fc60744155c5e81ff0be83`.
Trigger: `808f10788a1332e66dbb40ba97945ba4a161b1ad`.
Vercel deployment `dpl_EE6KMNgwHj3dA9bMQdCbpUBg2NNj` is READY at
`https://branding-tatva-lag2t5hix-suman22.vercel.app/contact`.
Controlled workflow `34990088759` completed successfully, including the mocked
delivery check and return to controlled mode. Deployment identity was verified
through Vercel metadata; the exact Contact preview was browser inspected.

The permanent branch alias still resolves to Release 292. Its existing credential
limitation remains; review uses a temporary access link to the exact Release 296
deployment. Production was left untouched.
