# Mobile navigation checks

Releases 406–408, 18 September 2026.

## Change

The mobile menu now has a viewport bound at every collapsed navigation width,
including short landscape screens. The panel scrolls independently while the
surrounding area remains available to dismiss the menu. Overscroll stays inside
the panel. A dedicated 844 × 320 responsive QA preset exercises this case.

The menu reserves the document scrollbar space while open, stops Lenis, and
restores the previous scroll styles and Lenis state on close. Existing page and
footer inert states are preserved. The visible header controls and menu form
the keyboard focus loop. Escape, the close control, the backdrop and menu links
return focus to the trigger before the panel exits. Selecting the brand link
also closes the menu, including on the homepage.

The existing opening cascade remains. Keyboard focus immediately settles the
panel and its links, with a visible outline. The exiting layer becomes inert
and hidden from accessibility navigation while its visual exit finishes.
Measurement preferences are hidden behind the open menu at all collapsed
navigation widths. Existing reduced motion behavior remains in place.

## Baseline and local checks

The prior scroll bound only covered widths up to 430 px although the collapsed
navigation continues below 960 px. Exiting links remained in the document's
focus sequence until the animation completed. Backdrop close did not return
focus, and the keyboard loop excluded the other visible header controls.

TypeScript, changed file ESLint, homepage source, type floor, production build
and rendered homepage gates passed. The build generated 93 routes; the rendered
gate checked 527,311 CSS bytes. The type floor baseline remains at 204 existing
declarations. No contact form or booking submission was made.

## Deployment identity

- Source: `d338a8061dc6226c4b7e0571694d3a15d858b5be`
- Trigger: `3eb7d61b706ea7eb6ad03fa2ad6e7d49b96fdea1`
- Deployment: `dpl_6GAGTwauiGKwsory7AByaF6JYXND`
- Homepage workflow: `35352602447`
- Contact delivery workflow: `35352602417`
- Controlled preview workflow: `35352602433`

The source to trigger comparison contains only the controlled deployment flag
in vercel.json. Earlier homepage and Services work is preserved.

## Release 406 browser verification

All three workflows passed and the exact deployment reached READY.

At 390 × 844 the menu is 351 × 392 px, starts at y 76 and has no horizontal
overflow. Native Tab enters Home. The focused panel and all link rows report
opacity 1 and no transform. Main is inert while the menu is open. The forward
loop moves from Talk with Suman to the brand link, and Shift Tab returns to the
last action. Escape restores focus to Open menu. The trigger remains at
x 307.609375, y 22, with a 44 × 44 px target before and after closing. The
temporary gutter is restored. The outgoing layer was observed with inert
already set during its exit, and main becomes interactive again.

A pointer click below the panel dismisses it and restores trigger focus.
Pausing page motion gives a fully opaque panel and link rows with no transform.
Choosing Home while already on the homepage closes the menu and returns focus.

At 844 × 320 the settled panel occupies x 222.5–606.5 and y 96–308. Its client
height is 210 px and scroll height is 284 px. Native Tab reaches Contact at
scrollTop 74; its 52 px target occupies y 243–295. The forward loop includes
the brand link and the visible header CTA. A visual check caught the homepage
guide at z-index 67 overlapping the last link. Release 407 hides that guide
while the menu is open. The Strategy link loads the Services heading and closes
the menu.

At the 337 × 234 zoom-equivalent preset the panel occupies y 52–222 and is
298 px wide. Native Tab reaches the final 48 px CTA at y 167.59375–215.59375,
with scrollTop 169 and zero horizontal overflow. The final controls were also
visually inspected.

Browser input timeouts during the baseline recovered. An immediately captured
landscape screenshot showed a stale frame; the subsequent settled screenshot
and DOM measurements agreed. These were treated as browser environment issues.
Physical phones, Safari and OS-level reduced motion were not exercised. The
site's Pause page motion control was exercised on the exact deployment.

## Release 407 verification

The additional change only hides the homepage guide while the menu is open.
TypeScript, homepage source, type floor, build and rendered checks passed again.
The final rendered gate checked 527,378 CSS bytes. Header TypeScript and lint
had already passed; release 407 changes only CSS and the release manifest.

Source `c0ae40290ecabbc9fc9bf969e973714fe48f7c8d` produced trigger
`457cf8de2ea9f16cb224873832543ead7f5013b7` and READY deployment
`dpl_9acFMnEbWALQfaLKqa7Thbx4Ut3h`. The source to trigger comparison contains
only vercel.json. The contact delivery and controlled preview workflows ran
for this CSS change.

On the exact deployed 844 × 320 frame, the guide is hidden while the menu is
open. Contact remains at y 243–295 with its complete focus outline, and the
settled screenshot confirms that nothing covers it. Escape restores the guide.

## Release 408 verification

The last visual review found an empty Ambient sound row on phones. Existing
home-final-polish.css deliberately hides audio buttons below 1200 px and on
coarse pointers. Release 408 removes the obsolete mobile row and its unused
layout rules; the existing desktop audio control remains.

TypeScript, Header ESLint, homepage source, type floor, production build and
rendered homepage gates passed. The build generated 93 routes and the final
rendered gate checked 527,262 CSS bytes.

Source: `35b97f22d3144f7a37cb6853463d4739db1da82a`.
Trigger: `30683d854ee271602773e892cd90c03c32dd9110`.
READY deployment: `dpl_H6MVbfzSVsrshPLpcMMwx8RjKEYW`.

All three workflows passed: homepage `35353811587`, contact delivery
`35353811526`, controlled preview `35353811415`. The source to trigger
comparison contains only vercel.json.

The exact deployed 390 × 844 menu measures 351 × 355 px at y 76. The empty
row is absent and the full menu was visually reviewed. Native Tab enters Home
with opacity 1 and no transform. The final action loops back to the brand link.
Escape restores Open menu focus and the exiting layer was again observed inert.

At 337 × 234, the final panel still occupies y 52–222 with zero horizontal
overflow. Tab reaches the 48 px contact CTA at y 167.59375–215.59375; removing
the unused row lowers the needed scrollTop from 169 to 132. At desktop width,
the regular navigation and its audio control remain visible. The navigation
is 44 px tall and the document has zero horizontal overflow. Its screenshot
was visually reviewed.

The initial protected mobile link required renewal through Vercel's access
tool after the deployment became READY. Verification then used that exact
deployment. The browser's previously blocked /api/release endpoint was not
retried; deployment metadata, source comparison and rendered changes establish
the build identity. Physical device and OS-level motion limits remain as above.

## Shared preview

The shared alias was confirmed on release 405 after the user's earlier alias
update. At the end of these changes it still identifies
`dpl_9xkdSFukNfcQVuKnBYLR1UrgckMc`, trigger
`403fef297095020243d041c506d22d75e65c6802`. The connected app exposes no alias
assignment tool. `preview-link-repair.md` contains the exact command for the
verified release 408. Production was unchanged.
