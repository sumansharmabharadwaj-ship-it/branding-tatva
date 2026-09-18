# Homepage project file reading checks

Releases 403 and 405, 18 September 2026.

## Change

The archive's full screen project file now uses a warm, translucent reading
surface. The project's existing film or poster remains bright around it. The
former full screen dark gradient is removed. Verified project copy and metrics
still come from the existing homepage snapshot.

A fixed toolbar keeps Close available while the file scrolls. Its decorative
rule follows native reading progress through one scheduled animation frame per
scroll event. ResizeObserver updates the measure when the reading size changes.
Reduced motion keeps a complete, static rule and a poster. A 1.2 second camera
settle is confined to the scenery; the copy is fully visible and stationary.

The reading region is now a keyboard stop, so Page Down and End can scroll the
file before reaching its links. The existing native dialog, Escape handling,
focus trap, document scroll lock and return to the opener remain in place.
Section labels are headings. The title wraps long project names; metric cells
and the two actions reflow on narrow screens. Body text is 16 px with 28 px
leading. The case action uses soil and ivory for consistent contrast across
project accents.

## Baseline

The shared preview at trigger `2b966e0372d390be4568978fe62a88292ff21dcc`
put long white paragraphs directly over footage with a dark gradient. Screenshots
at desktop and 320 × 720 confirmed the busy reading background. On the narrow
view the title occupied a 257 px box and the indented trail left approximately
235 px for text. Close was an icon without a visible text label.

The browser initially stalled during some overlay interactions. A fresh tab and
subsequent full motion desktop check worked normally. This was treated as a
verification environment interruption, rather than evidence for an unrelated
site change.

## Release 403 mobile interaction pass

At 390 × 844 the reading starts below the 72 px toolbar. The paper is 351 px
wide and body copy is 317 px wide, at 16 px with 28 px leading. The 44 px close
control stays at y 13.5 throughout scrolling. Dialog width and scroll width both
equal 390 px. Screenshots of the beginning and the ending were reviewed.

Native Tab moves from Close into Project reading. Page Down moves its scrollTop
from 0 to 633 while the progress rule reaches 0.722603. End reaches scrollTop
876, the full 772 px reading viewport, and a complete rule. Both bottom actions
are 48 px tall and fully visible. Forward and reverse keyboard loops remain
inside the modal. Escape returns focus to Inspect the project file.

Pausing replaces the video with one poster and keeps the progress rule complete.
Reopening starts the reading at scrollTop 0. However, the document's scrollbar
disappeared during scroll lock, changing earlier chapter widths. A measured
paused reopen and close moved the opener from y 346.71875 to 397.71875 and page
scrollY from 8818 to 8767. Release 405 reserves the existing scrollbar gutter
while the dialog is open and restores the previous inline style on close.
It also explicitly uses the body font for small section headings.

Release 404 belongs to the concurrent hidden cost refinement and is preserved
in the final source. It is not a separate project file candidate.

## Build and release identity

TypeScript, changed file ESLint, the homepage source gate, type floor gate,
production build and rendered homepage gate passed. The final build generated
93 routes. The rendered gate verified 526,696 CSS bytes. The type gate retains
204 pre-existing declarations in its baseline and found no new violation.

- Source: `6526c3260e9419ad6d56979cc57d8dd061bb1b0a`
- Trigger: `c8d589486b4770b26c151f5d40238e37976668d0`
- READY deployment: `dpl_8d7yYHwgPaMPfCahuxd15TfozjKC`
- Homepage workflow: `35331420474`
- Contact delivery workflow: `35331420460`
- Controlled preview workflow: `35331420464`

The source to trigger comparison contains only the controlled deployment flag
in vercel.json. The preceding Services and hidden cost changes were preserved.
All three release 403 workflows passed.

Release 405 passed the same local checks after preserving the newer hidden cost
change. Its final rendered gate also verified 526,696 CSS bytes.

- Source: `1fe4b82547c1e32fb51f5b3a20dde2defd23f065`
- Trigger: `403fef297095020243d041c506d22d75e65c6802`
- READY deployment: `dpl_9xkdSFukNfcQVuKnBYLR1UrgckMc`
- Homepage workflow: `35332655319`
- Contact delivery workflow: `35332655252`
- Controlled preview workflow: `35332655297`

All three release 405 workflows passed. The source to trigger comparison
contains only vercel.json.

## Release 405 browser check and remaining limit

The exact deployed 320 × 720 frame opened the file in full motion. Its computed
root gutter is stable. Dialog width and scroll width both equal 305 px; the
reserved root gutter accounts for the remaining viewport space. The body
reading width is 232 px. The section headings use Manrope. The beginning was
visually inspected and the title, toolbar and copy reflow without clipping.

Native Tab entered Project reading and End reached its bottom at scrollTop
1551. The case link occupied y 574.828125–622.828125 and the return action
y 630.828125–678.828125. Both are 48 px tall and completely visible.

Before the second opening, the focused archive control was at y 336.390625 and
page scrollY 9608. The browser connection failed after the final Escape action,
first with an evaluation timeout, then with CDP get/refresh tabs timeouts.
Consequently, the final before/after position comparison is **unverified**.
The release 403 mobile keyboard and motion checks above should not be read as
certifying this final scroll-lock correction. A final desktop visual pass also
remains unverified. Physical devices, Safari and OS-level reduced motion were
not exercised. The source has an independent reduced-motion CSS equivalent.

## Shared preview link

The permanent alias still identifies deployment
`dpl_21j67LeVcVe1JUyM4ukCUyxB4eTK`, commit
`2b966e0372d390be4568978fe62a88292ff21dcc`. It has not been updated to release
405. The connected Vercel tools expose no alias assignment operation. The
existing controlled workflow completed without changing this pinned alias.

Use the command in `preview-link-repair.md` to point the shared review link at
the READY release 405. Production was unchanged. Protected preview access was
provided by Vercel's access tool; no authentication workaround was used. The
browser's previously blocked /api/release endpoint was not retried. Exact
deployment metadata, source comparison and the observed rendered controls
identify the release used for these checks.
