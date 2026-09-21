# Contact call focus acceptance

Verified 16 September 2026 on preview Release 325.

## Release

- Source: `20abaedbd9e2b1a462ff95089d0a957c9938c23b`.
- Git integration trigger: `205f201850cb90923c2b129f0cad8bfacf3313d8`.
- Vercel deployment: `dpl_CxBvk44WDzx9C6JDguvGQZWUYxDw`, READY.
- Host: `branding-tatva-9d0nyllz5-suman22.vercel.app`.
- Workflow: `35112914666`, job `104850940160`, success.
- Controlled mode restored in `312c2f6`.
- The concurrent Release 324 homepage changes were preserved and included in
  the successful combined build. Production was unchanged.

## Reproduced problem

On Release 323, keyboard focus remained visibly on call step 0 after a 300px
scroll from scrollY 2785 to 3085, while aria-current moved to step 1 and the
vertical trace reached scale 0.716758. Moving the pointer over step 2 then
selected step 2 without moving the visible keyboard focus away from step 0.

## Change

The call sequence now owns its selected step while keyboard focus remains
inside it. Scroll and incidental hover cannot replace that reading state.
The same stage value continues to drive the selected wash, rings, connecting
trace, and booking card light. Their existing easing remains intact.

Leaving the sequence restores the scroll timeline. A primary pointer press
releases the keyboard hold, including a click on the already focused button.
Arrow keys, Home, End, Enter, and Space explicitly establish keyboard control.
Home and End also reselect a destination that already has focus, for which a
new focus event would never fire. The shared hook and route chooser are unchanged.

## Checks

- TypeScript and edited component ESLint passed.
- Contact cinematic motion contract gate passed.
- Full build passed before integration, then passed again with the latest
  homepage source: 86 static pages, Contact 31.8 kB / 299 kB first load.
- Diff whitespace check passed. Controlled workflow delivery check passed.
- No enquiry, booking, phone call, or WhatsApp message was sent.

## Deployed desktop

Viewport 1363 × 936, document width 1348px.

- Home on a mouse-focused first step established visible keyboard focus and
  selected step 0. Rings settled to `1 1`, `0 1`, `0 1`; trace scale was zero.
- Scrolling 300px, from 2785 to 3085, retained step 0, its focus, all three
  rings, the trace, and booking light matrix exactly.
- Hovering step 2 retained the keyboard selection on step 0.
- Reverse scrolling 300px restored the initial scroll position and retained
  the same trace and booking light matrices.
- Clicking the already focused first step then scrolling 300px released the
  keyboard hold: step 1 followed scroll and the trace reached scale 0.716758.
- End selected and focused step 2. Tab moved to the booking link without
  activating it; the sequence rejoined scroll, selecting step 1 at scrollY 2864.
- Enter on the first step also held step 0 through a subsequent 180px scroll.
- No application errors were recorded in the desktop interaction tab.

## Narrow viewport and reduced motion

Responsive iframe 320 × 720, document width and scrollWidth both 305px.

- All three step targets remained 108px high with no horizontal overflow.
- Home selected and focused step 0. Forward scrolling 180px, from 2686 to
  2866, retained the zero horizontal trace, first-step rings, and booking light.
- Reverse scrolling 180px restored the same scroll, trace, and light values.
- Manual reduced motion plus ArrowRight selected and visibly focused step 1.
  The wash settled immediately to `[0, 1, 0]`; all rings were complete and
  the trace used the static identity transform. Full motion was restored.
- This was responsive browser QA, not a physical touch or Safari test.

## Preview access limits

The narrow iframe logged failed background RSC preloads for Terms and Editorial
Policy after footer controls entered view. Clicking Terms displayed the browser's
content-blocked page, so footer navigation was not accepted and no alternate
channel was used to bypass that block.

Contact initially opened and supported all interaction checks through a Vercel
share link. At the final fresh-tab review, that link redirected to Vercel login.
A newly supplied Contact share link also redirected to login. The deployment is
READY and was tested earlier, but unauthenticated final-link access remains
unverified. No credentials or protection settings were changed.

The workflow confirmed at 15:07:24 UTC that permanent alias reassignment still
requires the absent `VERCEL_TOKEN` repository secret. The permanent alias is
not claimed to serve this release. The previously blocked `/api/release`
endpoint was not retried through another channel.
