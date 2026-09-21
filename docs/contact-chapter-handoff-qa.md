# Contact chapter handoffs · 15 September 2026

The chapter dock used to select a destination immediately on click. Choosing
Thank you therefore hid the dock before scrolling began, then revealed it again
as intermediate chapters crossed the reading line. Selection now follows the
visible section throughout native scrolling. A 12px directional buffer prevents
small trackpad movements and fractional layout changes from alternating the
active chapter at a boundary. Section tops continue to determine the reading
chapter when optional enquiry fields change the Write section height.

Each link now contains a local gradient light dissolve. The hit area, label and
focus ring remain fixed. Hover is limited to fine pointers, and both the site
preference and operating system reduced motion rules remove the transitions.

## Local verification

- TypeScript, ESLint, Contact contracts, cinematic contracts and mocked delivery
  checks passed. No real enquiry or booking was sent.
- An executable harness ran the actual ContactChapterRail component with mocked
  browser geometry. Thank you selection retained the current reading chapter
  before scroll; small movements on either side of a boundary retained the
  current chapter; deliberate forward and reverse crossings selected the next
  chapter. Fast jumps, leaving the journey and re-entry also passed.
- The final integrated production build passed with 86 routes and 297 kB Contact
  first load JavaScript. Concurrent homepage release 300 was preserved, and this
  Contact change requests release 301.
- Server HTML contains all four chapter destinations. The dock starts inert,
  hidden from assistive navigation and outside the tab order until the journey.

## Deployment acceptance

Source: `3953d64813c03321c71ea7dcca264ef32dec490a`.
Trigger: `e4469e92b05c225a7c757e3618efdf029c353da4`.
Deployment `dpl_8fasXUvRXh2FdnVctq6Qn6PxbSWQ` is READY at
`https://branding-tatva-l6eve86oi-suman22.vercel.app/contact`.
Controlled workflow `34995950838` completed successfully and the branch returned
to controlled mode. Deployment identity was confirmed through Vercel metadata.

- Mobile 390 × 844: content and scroll widths are both 375px. All chapter links
  remain 44px high with no transform. The active gradient settles at opacity one,
  with a 320ms dissolve. Thank you navigation reaches the closing section and
  leaves the dock hidden, with its links outside the tab order.
- Reverse scrolling leaves Thank you active at section top 426.0625px, then
  selects Call at 438.0625px. A small forward correction to 432.0625px retains
  Call; deliberate forward scrolling to 407.0625px selects Thank you. The dock
  follows those decisions without toggling at the centre line.
- Keyboard Enter from Call to Choose transfers focus to the Choose section
  immediately while the active chapter still reflects Call during the glide.
  On arrival, Choose is active and its section top settles at 76.421875px.
- Reduced motion removes continuous progress updates and makes each link's light
  transition effectively immediate (0.00001s under the global preference rule).
  Full motion was restored after this check.
- Narrow 320 × 720: content and scroll widths are both 305px; the dock is 304px
  wide and its links retain their stationary 44px targets.
- Desktop 1363px viewport: content and scroll widths are both 1348px. The side
  rail is 113.21875px wide and 208.3125px high. Moving keyboard focus from Choose
  to Write leaves every link at the same position and 45.59375px high, with no
  transform. The destination link receives a visible focus outline.
- No Contact application errors appeared in inspected browser logs.

The permanent branch alias still resolves to Release 292. The completed workflow
reports that its existing VERCEL_TOKEN repository secret is absent, so its alias
refresh cannot run. Review uses temporary access to the exact Release 301
deployment. Production remains unchanged.
