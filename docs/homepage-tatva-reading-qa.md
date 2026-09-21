# Homepage Tatva reading stability

## Baseline

On release 323 at 1440 × 900, choosing Akash moved scrollY from 12161 to
13781, a 1620 px jump. The sticky heading barely moved on screen, hiding the
fact that the visitor had been moved past four scroll stages. The component
also recalculated its active force on every resize and motion resume.

## Change

The Tatva chapter now uses the homepage's shared reversible selection controller.
Choosing a force updates its reading in place. Mouse hover previews return to
the committed reading; normal scroll intent resumes the sequence. A small
boundary buffer prevents oscillation from tiny trackpad reversals.

Left, Right, Home and End choose a force and focus its existing button. Visible
choices use preventScroll; an offscreen choice receives native browser scrolling
so its focus outline remains reachable on mobile. All five buttons keep their native Tab stops. Keyboard focus on
either a force button or the reading region holds that selection during scroll.
The shared controller ignores already-handled navigation keys and retains its
existing default focus scope for the other homepage scenes.

The explanation's original live nodes now move together in one brief directional
transition. Hidden, inert measurements reserve the longest reading at the actual
text width, so selecting another force cannot resize the card. The measurement
copy is excluded from the accessibility tree. Scroll changes no longer trigger
a live-region announcement; the selected button and named reading region expose
the current choice. Page pause settles the copy and retains the selected force.

## Verification

Release 324 passed direct desktop selection, hover return, keyboard selection,
forward and reverse wheel scrolling, and fixed reading-card height (227 px on
desktop, 219 px on mobile). A direct physical click on Akash retained scrollY
12202. Home and Right retained that position and moved focus to the chosen force.
Wheel movements of +420 and -420 retained the keyboard-focused force. With focus
outside the controls, +450 selected Jal and -450 restored Prithvi. Widths matched
the document viewport on desktop and mobile.

Two final checks required a followup: pause moved the heading about 12 px because
the legacy Reveal wrapper replaced the live nodes, and mobile End focused Akash
below the screen because all key selection used preventScroll. The Tatva chapter
now retains stable div wrappers under its existing scene-rhythm entrance motion
and checks target visibility before preventing native focus scrolling.

## Followup acceptance

Release 326 source: `ee94f2779f627d13f59dc234868e4dd44685a3ac`.
Vercel deployment: `dpl_4NsYrGsnoDs5xpPpraoE39kSmmYo`, READY, preview target.
Vercel reports trigger commit `365e67695d1c336b1a5a39d62cc7552a027fa794`.

At 1440 × 900, a direct physical click on Akash retained scrollY 12161 and
the 227 px card height. The heading stayed at 289.59375 px and card at
473.78125 px through settled pause and resume. Pause collapsed the desktop
runways (scrollY 7946), then resume restored scrollY 12161. The selected Akash
reading remained intact, its text transform settled to none, and every video
was paused. The Tatva progress style was cleared while paused.

At 390 × 844, End selected and focused Akash, then native focus scrolling
made its entire control visible at top 569.1875 / bottom 836.75 within the
844 px viewport. Home returned selection and focus to Prithvi. The card stayed
219 px tall. After returning to the reading region, pause and resume retained
scrollY 9812, heading top 41.015625, and card top 312.078125. Text was settled,
videos were paused, and width remained 375 px with no horizontal page overflow.
Desktop width likewise matched the 1425 px document viewport. Accessibility
snapshot inspection exposed only the active reading, with no measurement copies.

TypeScript, changed-file ESLint, homepage source gate, typography gate, production
build, and rendered homepage gate passed locally. GitHub homepage release contract
35113654112, contact delivery regression 35113653750, and controlled preview
35113654062 all completed successfully.

## Review-link limitation

The permanent review alias still reports commit
`bf4ef15c495ad3e822425c68b2843805ddde6974`, an older release. Alias reassignment
requires the existing Vercel credential, which is unavailable in this environment.
The release 326 deployment was tested through its exact protected QA route, and
its source identity was confirmed through Vercel deployment metadata. Requests
to that deployment's `/api/release` redirected to Vercel authentication even with
fresh connector-provided share links, so endpoint identity certification remains
blocked; the permanent alias is not represented as current.

## Release 352 reading and control refinement

The five choices now precede their named reading region in document order.
Desktop CSS preserves the established left introduction and reading beside
the five portraits. Compact layouts place the choices before their reading.
Tab from the last choice reaches the explanation; Shift+Tab returns through
the existing buttons. Home and End retain their native buttons and selection
behavior, with an 80 px clearance check for offscreen keyboard targets.

The button and list-item selection translations are removed, and the shared
scene entrance moves only the introduction. The desktop frame also stays still.
Portraits retain the existing selection zoom and gain a small sequential native
scroll entrance, up to 8 px on desktop or 4 px on compact screens.

The three original reading paragraphs now use separate native animations,
460 ms long with 45 ms stagger. Direction follows the change in selection.
Desktop travel is 10 px horizontally and 4 px vertically; compact travel is
5 px and 2 px. Copy stays opaque. Each choice cancels the preceding animations;
entering the reading by keyboard or pointer and enabling reduced motion cancel
them as well. Pause and resume keep the mounted text and selection. Hidden,
inert measurements continue reserving the longest reading at its actual width.

On release 351 at 1440 × 900, the reading measured 227 px high. Selecting Akash
with native End updated the same reading, but Tab then skipped it and entered
the pressure lab's Prithvi button. The selected-button style translated the
button 3 px and its list item another 4 px. These observations informed the
reading-order and stationary-control changes. No visible copy, footage or
image assets changed in this pass.

Release 352 passes TypeScript, changed-file ESLint, homepage source and type-floor
gates, the production build and the rendered homepage gate. The latter verifies
495,775 CSS bytes, the thirteen ordered chapters, unique IDs, heading and media
semantics and decision handoffs. React review confirms animation cleanup on
choice changes, pause and unmount; transient animation handles stay in refs.

## Release 352 browser acceptance and pause followup

On the exact release 352 preview at 1440 × 900, Home, End and Right selected all
five forces while retaining scrollY 13935. The reading stayed 227 px tall;
button and list-item transforms stayed `none`, with identical control bounds.
End selected Akash and Tab reached `tatva-focus-reading`; Shift+Tab returned to
Akash, and Home restored Prithvi. Forward and reverse selections produced the
intended opposite text offsets while opacity remained 1. Focusing the reading
cancelled all three paragraph transforms. The hidden measurement container had
no controls or IDs.

At 320 × 720, Home and End brought their full selected controls into the viewport,
with approximately 80 px or more clearance. End followed by Tab brought the
245 px reading to top 237.15625 / bottom 482.15625. Native wheel steps of +120 and
−120 restored the initial scroll position and button bounds, retaining Prithvi
focus and selection. The portrait arrival value moved from 0.565506 to 0.700687
and back to 0.565506. Distinct staggered paragraph offsets were observed before
all three settled to `none`. Document and viewport widths matched at 305 px.

Desktop pause exposed an incomplete structural fallback: the text stayed stable,
but Tatva retained its 2700 px scroll runway while other chapters contracted.
Release 353 applies the same single-frame layout to site pause and OS reduced
motion. It also keeps the film's absolute geometry in the OS fallback. Compact
screens retain their natural content height.

## Release 353 final acceptance

The exact final preview was checked at 1440 × 900 and 320 × 720. Desktop End
selected Akash and Tab reached the reading. Pausing contracted Tatva from 2700 px
to 900 px, while the 227 px reading moved only 0.015625 px vertically. Controls
retained their bounds within the same rounding difference. Absolute scrollY
changed as preceding chapters contracted; the visible reading stayed anchored.
Akash remained selected and all three paragraphs settled to `none` at opacity 1.
Resume restored the 2700 px section and retained the settled Akash reading.

With the desktop reading focused, native ArrowDown advanced scrollY from 13935
to 13975. Wheel +180 then −180 returned to 13975. The sticky reading and controls
stayed in place, and focus and selection were preserved. Document and viewport
widths matched at 1425 px.

At 320 × 720, the final reading stayed 245 px tall at top 237.15625 / bottom
482.15625 through pause and resume, with scrollY 11768 and natural section height
1676.15625 unchanged. Akash selection persisted. Tab from the motion control
returned to the reading after both pause and resume. While paused, paragraph
transforms and portrait translations were `none`. Widths matched at 305 px.
The final screenshot showed complete readable text and a visible sand focus
outline inside the viewport.

Local release 353 gates passed: TypeScript, changed-file ESLint, homepage source
contract, typography floor, production build and rendered homepage validation.
The rendered check verified 496,185 CSS bytes. GitHub homepage contract
`35211537605`, contact regression `35211537544`, and controlled preview
`35211537591` all completed successfully.

Release 353 source: `90a5a88541911e0aae7c2a1bf548d2d16d198d70`.
Deployment trigger: `07785783ad8dd111d5206c940daaac49f8dc422f`.
READY preview deployment: `dpl_3D6ydmc6aKXpcyHT7js4Kquv9fRj`.
Only `vercel.json` changed between source and trigger. The controlled workflow
restored preview deployment controls in commit
`0ac886d19db2be4d4932e97a6a93bc32cc51f3ec`.

The exact deployment's `/api/release` was read successfully in the browser on
2026-09-17; its generated timestamp was `2026-09-17T10:48:32.057Z`. It reported
the trigger commit above, branch `august-8-isolated`, and environment `preview`.
This final endpoint certification supersedes the historical release 326 endpoint
limitation recorded above.

The permanent review alias remains an older release. The release 353 workflow
reported that alias reassignment requires the existing `VERCEL_TOKEN` repository
secret, which is unconfigured. Production was untouched.

Browser verification used native keyboard and wheel input with read-only DOM
measurements. The browser often reported a hidden document, so uninterrupted
foreground animation timing was not certified. Pointer activation, physical
touch devices, Safari and OS reduced-motion emulation were not exercised in this
pass. Site pause, narrow viewport geometry, reverse wheel scrolling and keyboard
reading order were verified directly; OS fallback was reviewed in source and
through the build gates.
