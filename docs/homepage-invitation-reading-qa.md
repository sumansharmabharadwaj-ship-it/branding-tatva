# Homepage invitation reading — release 369

## Changes

The closing invitation gives phone readers wider agenda text, tighter space
between the introduction and agenda, and 80 px beneath the final message.
The booking action and its destination remain unchanged.

A decorative clay line connects the three conversation steps. It uses the
existing scroll calculation, retracts with reverse scrolling, and becomes full
when motion is paused or reduced. The line has no pointer target or accessible
content. Existing keyboard focus and text selection protections also freeze
its progress. No new scroll listeners, media or dependencies were added.

The desktop fit measurement now includes scroll height as well as offset height
so overflowing content falls back to normal document flow.

## Source verification

TypeScript, changed-file ESLint, source homepage contract, typography floor,
production build, rendered homepage contract and whitespace checks passed.
The production build generated 86 routes. The rendered check verified thirteen
chapters and 514,529 CSS bytes. The typography check retained the recorded 208
pre-existing issues without adding any.

Source: `6e24a89dca0344b987ce4ed4c7532531c55147ab`.
Tree: `454ef3cfd21c21f7967fba593e0c20352eaaabc9`.

## Baseline

Release 368 at 390 × 844, with 375 px content width, used a 1336.42 px section.
The primary action occupied 442.86–499.25 px from the viewport top after opening
the invitation anchor. The agenda began at 700.20 px, its copy was 282.20 px
wide, and its three rows were each 151.66 px high. The final message had 56 px
of bottom clearance. There was no horizontal overflow.

## Deployed acceptance

Deployment `dpl_5Kg7mhK8JLo3qmWk2SmrXuKpVESg` reached READY at trigger
`ffee9e5c99f4b09321592de9dcade360036b8fbb`. The source-to-trigger comparison
contains only the controlled `vercel.json` deployment flag. Homepage contract
`35256747658`, contact regression `35256747954` and controlled preview
`35256747597` all succeeded. Cleanup `d0d406f` restored the deployment flag.

Chrome responsive-frame measurements after hydration:

| Viewport | Content width | Layout | Frame height | Agenda text width | Horizontal overflow |
| --- | --- | --- | --- | --- | --- |
| 390 × 844 | 375 px | Normal flow | 1257.30 px | 299.81 px | None |
| 320 × 720 | 305 px | Normal flow | 1480.41 px | 229.81 px | None |
| 1280 × 720 | 1265 px | Normal flow | 766.45 px | 431.14 px | None |
| 1280 × 790 | 1265 px | Desktop hold | 790 px | 431.14 px | None |
| 1440 × 900 | 1425 px | Desktop hold | 900 px | 491.48 px | None |

At 390 px, the agenda text gains 17.61 px of width (6.2%) and begins 49.59 px
earlier. The section is 79.13 px shorter. The booking button is fully visible
at 414.06–470.45 px; the secondary link retains its 44 px target. The final
message has exactly 80 px of bottom clearance. At 320 px, the booking label
wraps within a 78.78 px target at 488.34–567.13 px, inside the first viewport.
The narrow layout also retains 80 px beneath the final message.

The new 2 px track occupies the gutter between step numbers and text. At
390 px, number cells end at x=40.80, the track occupies x=45.19–47.19, and
copy begins at x=51.19. It has `aria-hidden="true"` and `pointer-events: none`.
Screenshots were inspected at phone, narrow phone and desktop widths, including
the full agenda and final message after native scrolling.

Native scrolling 500 px down selected step 2 with track scaleY 0.492162.
A further +100 px selected step 3 at 0.733572; −100 px returned to step 2
and exactly 0.492162 at the same agenda position. Pausing set the line's
computed transform to none and retained step 2. Resuming without another scroll
gesture restored scaleY 0.492162 and retained step 2.

Keyboard Tab reaches the booking and proof links with visible 2 px outlines.
On the narrow personalized layout, the proof link settled at 596.28–640.28 px,
above the floating motion control at 664–708 px; the measured overlap was zero.
Shift+Tab returned to the booking action. Enter opened
`/contact?package=brand-clarity#call`, and the contact call section rendered.
No booking or contact form was submitted.

Selecting “The identity already exists.” through the homepage interface changed
the invitation to `reposition`. At 1280 × 790 this copy still fit the 790 px
desktop frame, with the final message ending at 741.69 px. The proof link was
`/work/herbalcart` and the booking route retained `package=brand-clarity`.
The other personalized variants were unchanged and were not retested.

## Limits and shared link

These checks cover Chrome responsive viewports, native scrolling, keyboard
navigation and the site's motion control. Physical phones, Safari and OS-level
motion emulation were not tested. The existing browser block on `/api/release`
prevents endpoint certification. Vercel metadata, the trigger comparison and
the rendered changes establish the exact preview used for these checks.

The shared review alias was successfully updated to release 368 before this
work. After release 369 it still targets `dpl_3vtQMFw74baWvwDLmLJK7ENmSEYW`,
trigger `1cc494eaa8f494af498cf2ddb6e3a3837282aec0`. The connected tools have
no alias assignment action. `preview-link-repair.md` provides the exact command
for the verified release 369. Production was untouched.
