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
