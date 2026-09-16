# Contact focus clipping

## Scope

Keep the existing animated Choose, Write and Call compositions anchored to
their sections during focus scrolling. Keep the booking card's heading and
copy anchored inside its rounded frame. Hero and gratitude choreography are
unchanged.

## Reproduced baseline

On the release 325 deployment, the Call section had `scrollTop: 107` even
though it displayed no scrollbar. Its reading plane was 107 px above its
section origin, and its departure gradient ended 107 px above the actual
section boundary. The screenshot showed a photograph strip followed by a
flat colour band before the gratitude scene.

On release 323, a clean Call section initially had zero internal scroll.
Ordinary pointer interaction, wheel scrolling and Tab to the booking link
kept that offset at zero in the tested sequence. The browser automation's
first-step focus and Home action reproduced `scrollTop: 107`, a plane offset
of -107 px and a departure gap of 107 px. This is a confirmed focus-scroll
path, not a claim that every ordinary Tab press reproduces the bug.

Focusing the calendar link through the same automation and pressing Tab
moved the booking card internally by 68 px. The card had a 543 px client
height and a 612 px scroll height. This explains the earlier clipped card
copy separately from the displaced section gradient.

## Change

- The shared scene uses `overflow: clip` and `display: flow-root` instead of
  scrollable hidden overflow.
- The booking card uses the same pair of properties. Its oversized light,
  rounded clipping, borders and existing transitions remain in place.
- No scroll listeners, focus redirection, animation loops or reset timers
  were added.

The [CSS Overflow specification](https://www.w3.org/TR/css-overflow-3/#overflow-properties)
defines hidden overflow as programmatically scrollable, while clip forbids
scrolling. Flow-root preserves the independent formatting context.

## Verification

- TypeScript, edited-component ESLint, the cinematic motion gate and diff
  whitespace checks passed.
- The full combined source build passed in a clean isolated directory:
  all 86 pages generated. The original build directory twice failed during
  Next's temporary export-folder cleanup after successful compilation and
  page generation. No dependency or build-configuration workaround shipped.
- The isolated copy's source, configuration, dependency lock and release
  marker matched the committed files.
- Release 328 source: `08dd90e127c2d5f8827d5f0c510f52534f34f0c8`.
- Deployment trigger: `c56e64000096277d853776832dca8980a58074b6`.
- Deployment: `dpl_4fPZh36tRqWxDk8mj9FhFvFC35DE`, READY.
- Exact host: `branding-tatva-ie34nptxe-suman22.vercel.app`.
- Controlled workflow `35129656682`, job `104907201116`: success, including
  the mocked contact-delivery check and return to controlled deployment mode.

## Hosted checks

Desktop viewport 1363 x 936, document width 1348:

- Repeated first-step focus/Home: all three scene scroll offsets, reading
  plane offsets and departure gaps remained zero. Computed overflow was
  clip, with flow-root formatting. Original section heights were preserved.
- Scrolled from 2892 to 3132 and back while the first call step held keyboard
  focus. Selection, trace and booking light returned to their exact values.
- The Call-to-gratitude screenshot now showed a continuous feathered
  transition, without the earlier photograph strip and flat colour band.
- Repeated calendar-link focus and Tab: booking-card scrollTop stayed zero,
  with its heading 41 px below the top border. Screenshot retained the full
  heading and body copy.
- Choose switched to the second route by ArrowRight with no displaced
  containers. Write focus and optional-field expansion retained zero scene
  offsets. Its height grew from 1025.39 to 1772.89 px and returned to
  1025.39 px after collapse settled.

Narrow responsive iframe 320 x 720, document width 305:

- Repeated first-step focus/Home and booking-link focus/Tab: scene and card
  offsets stayed zero. No horizontal document overflow. Booking heading
  retained its 21 px inset, and call controls remained 108 px tall.
- Manual reduced motion plus ArrowRight selected and focused the second
  call step. The settled washes were 0, 1, 0; scene seam transforms were
  none, with zero section and card offsets. Full motion was restored.
- Desktop and narrow app error logs were clear in the inspected 100-entry
  error window. Browser-extension metadata errors were excluded.
- This is responsive Chromium verification, not physical touch/Safari QA.
  No live enquiries, bookings, calls, messages or emails were sent.

## Review access

The temporary share link initially opened the exact deployment, and the
same-origin responsive route also opened for the checks above. Opening the
same share link in a fresh review tab after QA redirected to Vercel login.
Final unauthenticated review access remains unresolved; the deployment is
READY, but the initial successful load does not prove the final link is
reliably accessible. Footer destinations and the release endpoint were not
retried after the previously recorded access blocks.

The workflow still reported the absent VERCEL_TOKEN repository secret, so
the permanent review alias could not be reassigned. Deployment protections
and production were unchanged.
