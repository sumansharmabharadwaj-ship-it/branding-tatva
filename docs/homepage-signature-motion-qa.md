# Homepage signature motion — release 361

## Change

The opening headline has a finite staggered entrance on its original words.
Words stay readable, retain native selection and wrapping, and never animate
opacity. The entrance waits for the existing prelude and is skipped on a
restored scroll position. Scrolling, keyboard focus, text selection, hiding the
tab, or choosing reduced motion cancels it. Resuming motion never replays it.

A two-stroke accent below the headline follows native scroll. Chapter labels
gain a matching drawn rule, using the existing scene director and its focus,
selection and visibility guards. The rules sit outside document flow. Returning
scroll draws the existing chapter seams from the opposite side.

Homepage buttons keep their hit areas stationary. Light sweeps within the
button on hover/focus, and arrows move in the direction of the action. Site and
OS reduced-motion settings suppress the additional motion. Opening body copy
now states the work more directly. No dependencies or media downloads added.

## Build verification

- TypeScript and changed-component ESLint passed.
- Homepage source and typography checks passed.
- Production build generated 86 routes.
- Rendered homepage gate passed: 13 chapters, unique IDs, semantic heading
  order, media attributes, required conversion links and 502,464 CSS bytes.
- Whitespace validation passed.

A repeated local build hit an ENOTEMPTY error in the generated export folder.
Removing that generated intermediate folder and rebuilding completed normally.

Source commit: `af0539865209e0324a166b6dd1c3b30b82cffcb5`.
The GitHub connector uploaded the exact locally validated tree
`db1f91a9602f806793a838c5e4dad64e80b1e633` after the terminal push lacked
credentials. The branch was advanced without force.

Deployment trigger: `a890ad3ca04f8cb39c9fb687f16c3c7d66162365`.
Deployment: `dpl_svYSjWbiCjp8QNxuEqH33gDitLcz`.

## Deployed verification

Vercel reached READY for the exact trigger above. Comparing trigger to source
shows only the controlled vercel.json flag. The homepage contract, contact
regression and controlled-preview GitHub workflows all passed. Cleanup commit
`7791efb28b71d614fdec9056f5ec7ce107908797` restored controlled mode.

Chrome checks against that exact deployment:

- Desktop: 1363 × 936 viewport, 1348 px content width, no horizontal overflow.
  The headline remains a single accessible H1 with correct word spacing.
- The 390 × 844 QA iframe has a 375 px content width with the browser scrollbar;
  document width matches it. Both opening actions fit within the viewport,
  ending at 622.84 and 678.84 px.
- Pause/resume keeps the phone headline top at 232.33 px. Pausing stops all
  videos and removes every headline word transform. Resuming leaves the words
  settled rather than replaying their entrance.
- The primary action transfers focus to Recognition. End selects the final
  Recognition tab using the existing keyboard behavior.
- A 380 px forward scroll moves the first accent's stroke offset from .7 to
  .107942 and the Recognition rule to .420 progress. PageUp returns to the
  original position, restores the .7 offset and changes the camera direction
  to reverse. No scroll interception was added.
- Captured console errors were from the browser extension, not application code.

The native PageUp measurement was read again after settling, rather than
mistaking the immediate pre-scroll geometry for a failed key event.

Local browser access was unavailable because the cloud browser rejected the
loopback URL. The additional 320 px route redirected to Vercel sign-in; the
connector then returned HTTP 500 creating access for that route. That narrow
check, OS-level reduced-motion emulation, Safari and physical touch checks
remain unverified. These limits do not invalidate the separate deployed
desktop and 390 px checks above.

The release API fetch returned an authentication redirect, so the exact source
is certified through Vercel deployment metadata and the visibly updated page,
not an API response. The permanent preview alias still resolves to release 357.
The prepared alias command in preview-link-repair.md now targets release 361.
