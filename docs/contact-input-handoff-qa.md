# Contact input handoff

## Reproduced issue

On release 328, desktop 1363 x 936:

- Home on the already focused first call step selected that step, but the
  scene had no reading hold. The camera remained at scale 1.0504 and
  y 4.31814 px, with sunlight opacity 0.42.
- ArrowDown moved focus to the second step and correctly settled the scene
  at scale 1.03, y 0 and sunlight opacity 0.
- A primary mouse click on the third step changed the selected step but
  left the scene's reading hold active. Scrolling from 2892 to 3072 changed
  the call sequence again while the shared scenery remained frozen.

The scene only entered its reading pose on a focus event and only left it
when focus exited the entire section. Reusing a focused control therefore
missed the keyboard handoff, and changing input methods could retain a
stale hold.

## Change

The shared Choose, Write and Call scene tracks whether the latest local
interaction was a primary pointer action or ordinary keyboard use.

- Keyboard capture settles the existing reading-rest spring, including
  Home, End and activation on the same control.
- A primary pointer action releases a non-writing hold, including a click
  on the already focused control. The existing spring rejoins the live
  scroll composition.
- Text inputs, textareas, selects and editable content retain the writing
  pose. A focused field keeps that pose until its focus actually changes.
- Leaving the section clears the local input mode. Native focus, pointer
  and keyboard behavior remains intact.

No new rendered copy, assets, frame loops, dependencies or scroll listeners.
The previous clipping repair and reduced-motion fallbacks remain in place.

## Verification

TypeScript, edited-component ESLint, cinematic motion gate and diff checks
passed. The isolated full build passed all 86 static pages; Contact is
31.9 kB with 299 kB first-load JavaScript.

Release 330 source: `988f426093e0ed3a0be1254ca492b45d846c5699`.
Deployment trigger: `b3ab8a4b3c177df17b8f62f27876ed246576c888`.
Deployment: `dpl_21iqJi57vjmUhVGow5aKLUvNYvvZ`.
Host: `branding-tatva-d8yl6vhuc-suman22.vercel.app`.
Workflow: `35131471626`, job `104913262530`.

Deployment and controlled workflow completed successfully, including the
mocked delivery gate and cleanup commit `81f2415`. Production was unchanged.

## Hosted desktop checks

Viewport 1363 x 936, document width 1348:

- Clicked the first call step, then pressed Home without changing focus.
  The scene held at scale 1.03, y 0 and sunlight opacity 0.
- Clicked the same focused step. The hold cleared, and the camera returned
  to scale 1.04698, y 1.58784 and sunlight opacity 0.42 at scroll 2777.
- ArrowDown selected and focused the second step and restored the reading
  pose. Clicking the third step then released the hold correctly.
- Scrolled 180 px forward from 2777 to 2957: the camera moved to scale
  1.05233 and y 5.86135. Reversing 180 px restored the exact camera and
  page-scroll values.
- Choose keyboard ArrowRight held its reading pose. Clicking the first tab
  released it to scale 1.05842, y -5.85619 and sunlight opacity 0.42.
- Clicking and re-clicking the name field preserved the writing pose through
  a 180 px scroll. The Edit email control then focused the email field while
  retaining scale 1.03, y 0 and sunlight opacity 0.
- All three scene scroll offsets, reading-plane offsets and departure gaps
  remained zero; document width equalled scroll width.

## Hosted narrow and reduced-motion checks

Responsive iframe 320 x 720, document width 305:

- Clicking the first call step and pressing Home held the camera at scale
  1.03, y 0 and sunlight opacity 0. A second pointer click on that same step
  released it to scale 1.03057, y -0.302406 and opacity 0.42.
- Call targets stayed 108 px tall. No horizontal document overflow or
  internally displaced scene planes/seams appeared.
- Manual reduced motion plus Home established the reading hold while the
  camera stayed `none` and sunlight stayed at opacity 0.16. Clicking the
  same step cleared the hold without changing those static values.
- Full motion was restored after verification.
- Screenshots retained readable controls and the previous gradient and
  booking-card clipping repair. Desktop and narrow application errors were
  absent from the inspected 100-entry error windows; browser-extension
  metadata errors were excluded.

These are Chromium desktop and responsive-frame checks, not physical touch
or Safari certification. No live enquiry, booking, call or message was sent.

## Review access

The temporary share link opened the exact deployment for testing. After QA,
a fresh review tab using that same link also opened Contact successfully.
The tool reports expiry on 17 September 2026 at 17:01:10.

The permanent branch alias still could not be reassigned: the workflow
reported the missing VERCEL_TOKEN repository secret. Deployment protections
were unchanged, and previously blocked footer/release endpoints were not
retried.
