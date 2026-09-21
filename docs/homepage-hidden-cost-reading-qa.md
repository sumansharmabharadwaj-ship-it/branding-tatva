# Homepage hidden-cost reading acceptance

Releases 349 and 350, checked 17 September 2026.

## Changes

The three message nodes remain mounted when switching between Separate promises
and Shared position. Separate forward and reverse CSS animation names replay the
directional transition without replacing the text nodes. Rows travel 8 px with
a 3 px rise and 5 degree tilt on desktop, or 4 px with a 2 px rise on compact
screens. The 480 ms transitions stagger by 45 ms and remain fully opaque.

The closing sentence uses the same reading treatment with a 4 px horizontal
movement over 420 ms. Both sentence variants reserve their natural text height
using identical paragraph styles. All sizing copies are hidden and inert.

The last row settles the animation state after its transition. Entering the
reading with keyboard focus or a pointer also settles it. Site or OS reduced
motion uses the static state, and resuming does not replay a stale text change.

The comparison now owns its three channel rules through native scroll progress.
The lines draw in sequence, reverse when scrolling back, and become the same
clay color in the Shared position mode. The buttons and comparison surface stay
anchored; the shared scene entrance moves only the introductory heading group.

The example is a labelled keyboard reading region after the two mode buttons.
Its focus outline and the buttons' outlines use clay, overriding a pale global
outline color. Obscured keyboard mode controls center once with 80 px viewport
clearance. A reading that fits the safe viewport centers; a taller reading
aligns its start with an 80 px scroll margin. Visible controls keep their place;
scrolling never selects a mode.

## Baseline on release 348

At 320 × 720, native Tab and Space selected both modes. Both retained a
449.8125 px comparison, 832.75 px chapter and 44 px closing sentence. Existing
message-row measurement already prevented a layout shift at this width; this
pass preserves that behavior and reserves the closing sentence as well.

The focused mode button's computed outline was `rgb(234, 214, 188) solid 2px`,
which was pale against the cream comparison. The row rules were already fully
drawn while the comparison was focused because their progress depended on the
shared entrance settling the whole surface. Browser visibility reported hidden.

## Release 349 findings

At 320 × 720, both modes retain the baseline comparison, chapter, message-row
and closing-sentence dimensions at scrollY 2321. All four live text elements
stay fully opaque. The four measurement containers contain zero IDs or controls.
Tab enters the same reading region and settles every text element to the idle
state, with no animation or transform.

At scrollY 2349, the three row rules have scales 0.831308, 0.671308 and
0.511308. Native scrolling forward 180 px changes them to 1, 1 and 0.859297.
Reversing 180 px restores all three starting scales. The focused reading,
Shared position selection and layout dimensions stay unchanged.

The deployed cascade showed that the global important outline shorthand still
outranked the first focus-color rule. Also, native reading focus left the region
bottom at 719.859375 px, leaving its outline outside the 720 px frame. Release
350 increases only the section focus selector's specificity and gives the
keyboard reading the same safe viewport clearance as its mode controls.

## Verification

At 320 × 720 on release 350, both modes retain the 449.8125 px panel and
832.75 px chapter. The mode buttons and focused reading use a 2 px clay outline.
Tab places the full reading at top 211.796875 px and bottom 508.859375 px,
clear of the floating controls. The three messages and closing sentence are
fully opaque, idle and untransformed when reading focus enters.

Pause, local Tab return and resume preserve scrollY 2560, Shared position and
all dimensions. Tab from the motion control returns to Separate promises
without changing the selected mode. Pause completes the three static rules;
resume restores their native progress, including the last row at scale 0.919229.
No text animation replays on resume. A subsequent switch back to Separate
promises invokes the reverse animation on the same four live text elements;
pause and resume settle those elements to idle as well.

At 1440 × 900, both modes keep the 900 px chapter, 438.390625 px comparison,
272.796875 px reading and 44 px closing sentence. Both 44 px buttons remain at
top 304.859375 px. Tab into the reading keeps scrollY 2025 and settles its text.
The complete reading and clay focus outline were inspected in a screenshot.
Native scrolling 180 px changes the row scales from 1, 0.962272, 0.802272 to
1, 1, 1; reversing restores the original scales and scrollY. Shared position
and reading focus remain selected throughout. Content and scroll widths both
measure 1425 px, with no horizontal overflow.

At 337 × 234, both 56.78125 px mode buttons center at top 88.84375 px and
bottom 145.625 px, clear of the fixed controls. Switching modes keeps scrollY
2497 and the 425.546875 px comparison unchanged. Tab into the taller reading
aligns its first row at top 79.625 px instead of centering the middle of the
text. A 220 px native scroll exposes the closing sentence at 88.421875–132.421875
px without losing reading focus or changing Shared position. Content and scroll
widths both remain 322 px. These are CSS viewport checks, not physical device or
browser zoom certification.

Both source/type gates, TypeScript, changed-file ESLint, production build and
rendered homepage gate passed for release 349. Its rendered gate verified
494,405 CSS bytes. Further acceptance and deployment evidence follow below.

Release 350 passes the same local checks, with 494,448 CSS bytes in its rendered
homepage. The follow-up changes only focus clearance and the scoped focus
selector, retaining release 349's message and native-scroll behavior.

## Deployment evidence

Release 349 source: `c6a7c6eb60b25d84040834bdafcc6e447a55b62f`.
Its Git deployment trigger is `b5e72c180947470898440a88bc7a105752abb6af` and its
READY deployment is `dpl_GQeQC9X8SGpdFjNGpQycLvfoTouY`. Only `vercel.json` changes
between source and trigger. Homepage CI run 35202653600, Contact CI run
35202653560 and controlled preview run 35202653903 pass. Controlled-mode
restoration commit: `8c5071475dc639f86e859ce00c971a72560203e7`.

Release 350 source: `b98828cecb9b4e6799a2d6c008ae3127aadf9753`.
Its Git deployment trigger is `3b8abd1566c858222e0837bef59fd7d6239ed87c` and its
READY deployment is `dpl_2jhJQ8vudEFvU5o52x2ZfTd6QLUm`. Only `vercel.json` changes
between source and trigger. Homepage CI run 35203291275, Contact CI run
35203291351 and controlled preview run 35203291379 pass. Controlled-mode
restoration commit: `4fba3a0642351e9335bb7e1c4ea3f3f0f2b4e7e5`.

The authenticated browser rendered `/api/release` with the exact release 350
trigger commit, branch `august-8-isolated` and environment `preview`. Vercel
metadata independently matches that trigger. The permanent preview alias still
points to an older build; workflow logs confirm its existing `VERCEL_TOKEN`
repository secret is unconfigured. Production remains unchanged.

The remote browser reports hidden visibility. Layout, readable text, animation
states, keyboard focus, native scrolling and site pause/resume were checked.
A final native pointer click timed out in `Input.dispatchMouseEvent`, so pointer
activation is excluded from acceptance. Uninterrupted foreground animation
timing and an emulated OS motion-preference change are also outside this check;
the shared OS preference hook and CSS fallback were inspected in source.
