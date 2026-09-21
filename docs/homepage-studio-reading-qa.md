# Homepage studio reading motion

## Observed baseline

At 390 × 844 on release 329, the Psychology panel measured 457.671875 px,
Literature 428.65625 px, and Strategy 435.984375 px. Switching disciplines
changed the section height from 1642 px to 1613 px or 1621 px. The proof link
also sat inside the translating, rotating decision wrapper.

## Changes

The reading and proof text now reserve the tallest actual state at the current
viewport width and type size. Measurement copies are hidden, inert, and excluded
from accessible names. They contain no duplicate links or IDs. One mounted proof
link stays outside the text transition and keeps a stable top edge.

The decision uses an 8 px horizontal and 3 px vertical entrance over 380 ms.
The result has a 10 px horizontal entrance over 420 ms. Text remains opaque and
unblurred. Pointer contact or keyboard focus inside the panel settles both
transitions immediately. The result's accent line responds to native scroll and
reverses with it; reduced motion renders a static line.

Left, Right, Home, and End retain tab selection without moving a visible target.
Offscreen targets may use native focus scrolling to become reachable. Keyboard
focus and native text selection hold the current discipline against scroll
selection. The existing desktop hold still depends on the complete frame fitting
the viewport; compact and reduced-motion layouts keep document flow.

## Build and release

TypeScript, changed-file ESLint, homepage source and type-floor checks passed.
The production build generated 86 routes. The rendered homepage gate passed
with thirteen ordered chapters, unique IDs and 489,809 CSS bytes.

Release 331 source: `a0cd98039f0eca9ee402515b8d5849b641327992`.
Deployment trigger: `7c896d1347f2a8d2095d0c87ce6f12885cc6e579`.
Source-to-trigger changes contain only the controlled Vercel deployment flag.
Vercel deployment: `dpl_HTZ3sVBWxspUdwQVhNDuJNB1jPSw`.

The latest Contact source and QA documentation were preserved by creating this
release on the current branch tree. Only the Studio component, Studio stylesheet,
and release counter were included in the source commit.

## Hosted acceptance on release 331

At 390 × 844, all three disciplines retained the 479.359375 px panel and
146.65625 px proof card. Right, Right, and Home kept scrollY 13099, panel top
459.625 px, and proof top 775.328125 px. The section stayed 1664 px tall.
Tab reached the panel and then the one live proof link. Focusing the reading
settled both text transforms to none. Native focus scrolling brought the proof
into view at scrollY 13177; pause and resume retained that position exactly.
Reduced motion settled the result accent to a full static line. A native
+100 / -100 px scroll pair changed its scale from 0.502712 to 0.642001 and
returned to 0.502712, with scrollY restored to 13177.

At 1440 × 900, all three readings retained the 344.578125 px panel and
86.40625 px proof card. The frame stayed 900 px within the 2160 px desktop
hold. Native scrolling selected 01 → 02 → 03 → 02 → 01 at 500 px intervals.
Home and End retained scrollY 15661. A focused HerbalCart proof link survived
a further 900 px scroll with its focus, destination, and Psychology reading
intact. Pausing kept panel position within 0.25 px while collapsing the hold;
the portrait and text transforms settled to none. Resuming returned the panel
within 0.11 px of its initial position.

At 320 × 720, Home and End retained the 552.5625 px panel, 1782 px section,
scrollY 14075, and proof top 740.203125 px. All tabs and links stayed within
the 305 px content width. Both larger layouts also had matching content and
scroll widths: 375 px mobile and 1425 px desktop. The accessible snapshot
exposed one active discipline heading, one reading, and one proof link.

An additional pause check exposed an existing selection issue: a scroll-selected
Strategy panel survived pause but reset to Psychology on resume. Collapsing
the hold resets its progress. The followup preserves the active discipline
through pause/resume until actual scroll intent resumes automatic selection.
The proof focus ring also moves inside the card, keeping it visible when native
focus scrolling places the card at the viewport edge.

All release 331 workflows passed: homepage 35133284787, Contact delivery
35133284820, and controlled preview 35133284688.

## Pause followup

Release 333 source: `ba73fc5c0ba3b1d078becdc23bc2ee1ddc73ec5d`.
The final TypeScript, changed-file ESLint, homepage source, typography,
production build and rendered homepage checks passed (489,829 CSS bytes).
Concurrent Contact release 332 is preserved in the source tree.

Release 333 deployed READY as `dpl_Dhdw7eHVuMdcRTMGJeVUQiTQ5sfp`, trigger
`26d1f24e1c09afbd9780567e42fd0f55a96cc9d4`. Source-to-trigger changes contain
the controlled Vercel flag and a concurrent Contact QA document only.

On the exact final desktop preview, native +1000 px scrolling selected Strategy
at scrollY 16721. Pause retained Strategy and its Dr. Haley proof destination,
settled portrait/copy/result transforms, and kept panel top within 0.25 px.
Resume retained Strategy and the same destination with panel top 428.921875 px,
within 0.11 px of the original held position. The document scroll offset changes
as the desktop hold collapses and returns; the reading stays in place. A further
native +500 / -500 px pair selected Literature then Psychology, confirming that
actual scroll intent releases the pause selection lock.

On the final 390 × 844 preview, End retained the same 479.359375 px panel and
scrollY 13099. Tab reached the panel then the Dr. Haley proof link. Its 2 px
focus outline uses a -4 px offset and remains inside the card when its bottom
is at 843.984375 px in the 844 px viewport. A screenshot confirmed the full ring.
Pausing Strategy retained scrollY 13177, panel top 381.625 px, proof top
697.328125 px, its destination, and its selected state; all reading transforms
settled to none and the accent became static.

Final workflows passed: homepage 35134625313, Contact delivery 35134625365,
and controlled preview 35134625342. Native text-selection ownership was added
in source; this round did not automate a drag-selection acceptance test.

## Review-link limitation

The exact protected QA pages were visually and interactively checked. Vercel
metadata confirms the final deployment trigger. The exact `/api/release` request
returned a 302 authentication redirect, so endpoint identity certification is
unavailable. The permanent alias returned 200 but still reports older commit
`bf4ef15c495ad3e822425c68b2843805ddde6974`. It is not represented as current.
The final deployment log confirms that the existing `VERCEL_TOKEN` repository
secret needed for permanent-alias reassignment is not configured.
