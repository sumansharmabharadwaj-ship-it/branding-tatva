# Contact continuous motion pass · 15 September 2026

Release 281 source: da46416a6959f3e101a30b9120c85ce5385f47ec.
Verified source tree: 4479ba2a4dd209d85b1640a00c54bf4419e57dd0.

The Contact camera previously transformed and blurred its entire content plane,
including form controls. Native snapping also switched on while reading the
middle chapters. Two background cameras independently transformed the same
photograph. Route choices could change during scrolling, and an exiting choice
retained interactive actions while its replacement arrived.

This pass removes content-plane transforms and blur, keeps native scrolling,
and gives each chapter one spring-smoothed timeline for the background, colour
currents, headline and drawn line. The hero composition and gratitude film remain
in place. Sand, sage and peach gradients join the intervening chapters; more
opaque paper surfaces keep fields and route details legible without backdrop
blur. Headline animation now works through Motion rather than depending on CSS
view-timeline support. All reduced-motion preferences retain a readable state.

Route selection now follows a deliberate tab action or horizontal surface swipe.
Scrolling and hovering do not replace the chosen route. Outgoing panels are inert
and hidden from assistive technology; links and buttons retain native touch taps.
Contact alone owns its hash recovery, including in reduced motion.

## Local verification

- Production build: passed, 85 routes generated, TypeScript and lint passed.
- All Contact gates passed: contract, delivery, media, cinematic motion,
  invitation poses and copy.
- The invitation gate checked 2,002 reversible poses, camera coverage, type depth,
  compact bounds, botanical motion and reading order.
- Local browser navigation was blocked by the browser transport. Visual review
  therefore uses the deployed preview, with no real enquiry or booking submitted.

## Deployed review

Release 281 was reviewed on its exact protected deployment:
`branding-tatva-9zvsxprm1-suman22.vercel.app`.

- Desktop: all three content planes report transform none and filter none;
  scroll-snap-type remains none. The backgrounds and gradients change with scroll.
- Route tabs: click and ArrowRight select the expected route; an outgoing panel
  reports aria-hidden true and the settled panel returns to its interactive state.
- Writing and call anchors settle at 7.7px and 8.1px respectively.
- Name focus retains an untransformed form; optional context opens to 747.5px and
  closes back to zero. No enquiry was sent.
- 390px QA frame: 375px content width and 375px scroll width. Selecting Write and
  following Start the note lands at 7.7px with a stable content plane.
- 320px QA frame: 305px content width and 305px scroll width. Text and form fields
  remain in normal document flow.
- Reduced motion: all scene-current and content-plane transforms become none.
  Full motion was restored after checking.
- Gratitude camera changes direction with reverse scrolling. All previous
  invitation pose checks also pass.
- No Contact application errors appeared in the captured browser log. Browser
  extension messages and an earlier Vercel sign-in message were unrelated.

Release 282 adds the final focus correction: pointer chapter clicks do not
programmatically focus the destination and freeze its reading pose; keyboard
chapter activation still transfers focus. Its production build also passes.

## Preview alias limitation

The controlled release succeeded, but the permanent branch alias remains on
Release 273. The deploy job explicitly reports that the repository VERCEL_TOKEN
secret is missing, so its alias-reassignment step cannot run. The connected app
can supply a 23-hour share link to the exact preview. No production promotion or
account/security setting was changed.

Checks above use desktop Chrome and same-origin responsive frames, not physical
mobile devices or independent Safari/Firefox runs.

## Release 284 continuation

The mobile review exposed a hidden-but-focusable chapter dock while the form
owned the viewport. Visibility, inertness and tab order now share the same state.
The dock returns after leaving the form even when optional context remains open.
Chapter tracking uses the section crossing the reading line, and remeasures when
section height or motion preferences change.

Compact screens show one bottom control at a time during the chapter journey.
The measurement notice remains available at the hero/footer and while focused;
measurement consent itself is unchanged. Matched paper gradients now blend the
Choose/Write/Call boundaries and lead into the existing invitation frame. Lower
specificity on the default palette lets each chapter use its intended sage or
peach colours.

Local verification: production build (including types/lint), Contact contract,
cinematic motion and all 2,002 invitation poses passed before deployment.
Hosted acceptance is performed against the exact Release 284 preview.

Release 284 hosted acceptance completed on
`branding-tatva-70sc5ujex-suman22.vercel.app`, deployment
`dpl_DKxGgV1bvf5oX7mNC5DrV2taJgtR` (READY). Source commit
`b8916a93cfaf4b774e8e8e808bc4a6d92ad9e366`; trigger
`ca701e21268fb4d9e90eb7cebb3cf9257f27facb`.

- Desktop visual review confirms a blended Write/Call boundary and crisp fields.
- At 390px, the dock sits 12px above the viewport edge; the measurement notice
  yields while the dock is visible. Each chapter reports its distinct palette.
- Keyboard Write navigation lands at 7.77px and transfers focus to Write. The
  hidden dock has aria-hidden true, inert present, and all four tab indices -1.
- Optional context expands Write to 2,145px; leaving it expanded and scrolling
  into Call restores the dock with Call current and inert absent.
- Both 390px and 320px QA frames have matching content and scroll widths
  (375/375px and 305/305px respectively).
- Reduced motion reports data-motion reduced and transform none on the gradient.
  Full motion was restored. No Contact application error was present in the
  captured log; extension transport errors were unrelated.
- Controlled preview status is success and the branch returned to controlled
  mode. The permanent alias was rechecked and still points to Release 273.
