# Homepage Recognition reading acceptance

Releases 346 through 348, checked 17 September 2026.

## Changes

Recognition keeps its live reading mounted when a visitor chooses a situation.
The explanation, each example column and the recommendation reserve the space
needed by all three choices at the current width and font size. Hidden measurement
copies are inert and contain no IDs or interactive controls.

The explanation moves 8 px horizontally and 3 px vertically over 380 ms. The
example text moves 6 px in the opposite direction and 2 px vertically over 420 ms.
The recommendation moves 6 px horizontally over 440 ms. All text stays fully
opaque. Pointer or keyboard reading settles these transitions.

The example's top rule follows the panel's native scroll progress and reverses
as the visitor scrolls back. Paused motion displays its complete static rule.
The selected choice's decorative arrow has a small directional entrance, with
site and OS reduced-motion equivalents.

The shared entrance now moves only the introductory heading group. The tabs,
reading panel and action keep their hit areas still. The action's magnetic hook
was removed. Existing choice-to-Services mappings, copy and destinations are
unchanged.

ArrowUp, ArrowDown, Home and End center an obscured target before focusing it
without a second scroll. Visible targets keep their current position. Focus
outlines use the section's clay color for visibility on the light background.

## Reproduced baseline

On release 345 at 320 × 720 and scrollY 738, the three choices produced:

| Choice | Panel height | Action top | Chapter height |
| --- | --- | --- | --- |
| The idea is clear in your head. | 766.828125 px | 1379.515625 px | 1507.703125 px |
| The identity already exists. | 772.609375 px | 1385.296875 px | 1513.484375 px |
| Marketing is active. | 792.734375 px | 1405.421875 px | 1533.609375 px |

The action moved by up to 25.90625 px while the selected reading changed.

## Local verification

TypeScript, changed-file ESLint, homepage source gate, type floor gate,
production build and rendered homepage gate passed. The rendered gate verified
493,762 CSS bytes.

## Release 346 browser findings

At 320 × 720, native Tab, ArrowDown and End selected all three situations.
The panel stayed 824.421875 px tall, its action stayed at top 1437.109375 px
at scrollY 738, and the chapter stayed 1565.296875 px tall. The independently
reserved explanation, two examples and recommendation had equal bounds in all
three states. This removes the baseline's 25.90625 px shift. The reserved panel
uses additional natural document height to accommodate each group's longest text.

Native Tab entered the existing reading panel, then reached the cost action.
The action settled at top 338.109375 px with a complete 2 px clay focus outline.
There was one live explanation heading and four hidden, inert measurement
containers with zero IDs or interactive descendants.

Native scrolling from scrollY 1415 to 1715 expanded the example rule from
scaleX 0.755144 to 1. Scrolling back by 300 px restored 0.755144. The selected
third situation and focused reading panel stayed unchanged. Pausing and resuming
at scrollY 1837 preserved the choice, panel bounds and action position. Tab from
the pause control returned to the local cost action. Reduced mode showed the
complete static rule and settled text transforms.

At 1440 × 900, all three readings shared a 632.609375 px panel and the same
explanation, example, recommendation and action positions. Visible ArrowDown
and End targets kept scrollY 1171. This check also found a legacy rule in the
diagnostic stylesheet forcing Recognition to 100svh. The 1054.34375 px shell
overflowed the 900 px chapter, clipping the panel's lower edge. Release 347
removes both the desktop constraint and its redundant phone exception, returning
height ownership to Recognition's existing auto-height component stylesheet.

The browser reported document visibility as hidden during desktop entry. The
initial shared entrance remained transformed until keyboard focus settled it.
Settled geometry and native scroll response were inspected; uninterrupted
background video playback and entrance timing are outside this browser result.

## Release 347 desktop acceptance

At 1440 × 900, the chapter and shell both measure 1054.34375 px tall.
The full panel has 100.796875 px clearance before the chapter boundary; the
action has 141.796875 px clearance. All three choices retain the same
632.609375 px panel height, action position and chapter height. ArrowDown and
End keep visible targets at scrollY 846 without moving the page.

Native Tab enters the persistent panel and brings its complete height into view.
Forward scrolling from 989 to 1209 changes the rule from scaleX 0.656758 to
0.92116. Reverse scrolling restores both scrollY 989 and scaleX 0.656758.
The third choice and focused panel remain unchanged in both directions.

Pausing at scrollY 989 preserves all reading bounds and the selected third
choice, sets the rule to its full width and settles every text transform.
Tab from the pause control returns to the local selected choice. Resume keeps
the same geometry and restores the rule's 0.656758 progress. Subsequent native
Tab steps reach the panel and cost action, with a 2 px clay action focus outline.

At 337 × 234 on release 346, End centers choice 03 at top 88.796875 px and
bottom 144.796875 px. Home returns choice 01 to top 79.890625 px and bottom
153.546875 px. Both focus rings clear the fixed controls and viewport edges.
Content and scroll widths are both 322 px. This is a CSS viewport equivalent,
rather than certification of physical hardware or the browser zoom feature.

The release 347 build, source gate, type floor and rendered gate pass. Its
rendered gate verifies 493,556 CSS bytes. The exact-source CI also passes
TypeScript, changed-surface lint, production build, destination checks and
contact/newsletter contracts.

At 1280 × 790, all three choices on release 347 retain a 613.9375 px panel,
982.828125 px chapter and the same action bounds at scrollY 821. The panel
clears the chapter boundary by 89.59375 px. Native Tab reaches the panel, then
the cost action. The action at top 706.109375 px overlaps the floating chapter
control near the viewport's lower edge, despite being inside the chapter.

Release 348 adds an 80 px viewport clearance check when the action receives
visible keyboard focus. An obscured action centers once in native document
flow. Pointer focus keeps its location. Arrow-key choice navigation uses the
same clearance, followed by focus with preventScroll. This preserves the
layout and manual choice while keeping fixed controls clear of focused targets.

On release 348 at 1280 × 790, choice 01 and choice 03 retain the release 347
geometry. Native Tab reaches the panel and then centers the focused action at
top 373.109375 px, bottom 417.109375 px, clear of the floating controls. The
selected third situation and 613.9375 px panel height stay unchanged. Pause,
Tab back to the action and resume all preserve scrollY 1258 and these bounds.
The complete focus ring and lower panel were inspected in a screenshot.

A later locator click and native pointer input timed out in the remote browser
transport. Pointer activation is excluded from the acceptance claim; the
keyboard-only guard is verified in the source and final production bundle.

At 320 × 720 on release 348, choice 01 and choice 03 retain the 824.421875 px
panel and 1565.296875 px chapter. End centers the lower choice to respect the
80 px clearance. Native Tab reaches the persistent panel, then the action at
top 338.109375 px and bottom 382.109375 px. The third situation remains selected,
all reading transforms are settled, and content/scroll widths both remain 305 px.

At 337 × 234 on release 348, End and Home reproduce the accepted compact
bounds: choice 03 spans 88.796875–144.796875 px; choice 01 spans
79.890625–153.546875 px. Focus stays on the selected choice, panel height remains
768.734375 px and content/scroll widths both remain 322 px.

## Delivery evidence

| Release | Source commit | Git deployment trigger | Vercel deployment |
| --- | --- | --- | --- |
| 346 | `7ed5f2c6e1e4366fb3b5ad25430e6f2b72ac3d03` | `047e5ec733f5babbf6edb45aebf7c2437dd96fd0` | `dpl_2t1N6kqxhTqcmaZmcWwXnusy7NVT` |
| 347 | `de188e912a813a0d7e85e631f4e46cfa6c081376` | `b373e566210cc9a6d955a442e0e555d12cf571bc` | `dpl_49LtTUnxWLsi74fE5vL194YxpdFr` |
| 348 | `1c810bbbacc9d00579767beb534194a30d531564` | `7e511e46f5f651d920d0f74c6e17a72857afefef` | `dpl_98qJF1M4KZmCans43EsLfmhunHQe` |

Releases 346 and 347 reached READY. Each source-to-trigger comparison changes
only `vercel.json`. Their controlled preview, homepage and Contact checks pass.
Controlled-mode restoration commits are `2c68cf2f5e239cf6912553efac61b5fb54877995`
and `357045178db1f0a292bfcc1f9b3d98043cde0581`, respectively.

Release 348 also reached READY with only `vercel.json` changed between source
and trigger. Homepage CI run 35200781715, Contact CI run 35200781732 and
controlled preview run 35200781623 passed. The preview workflow restored
controlled mode and again reported the missing alias token. Local TypeScript,
changed-file ESLint, source/type gates, final production build and rendered gate
passed; the latter verifies 493,556 CSS bytes.
The final controlled-mode restoration commit is
`032cb810287702fa728d8eed5d586c707af21190`.

The Vercel connector returned HTTP 302 for both release endpoints, so those
responses are excluded from endpoint certification. Browser checks used the
exact protected deployment and Vercel metadata confirmed its trigger SHA.
For release 348, the authenticated browser successfully rendered `/api/release`.
It reports commit `7e511e46f5f651d920d0f74c6e17a72857afefef`, branch
`august-8-isolated` and environment `preview`, matching the READY deployment and
the source-to-trigger comparison.
The permanent preview alias still points to an older build. Workflow logs
confirm its existing `VERCEL_TOKEN` repository secret is unconfigured; the
automatic alias refresh therefore remains unavailable. Production is unchanged.

The OS reduced-motion path shares the inspected hydrated preference hook and
has a matching CSS media fallback. Site pause and resume were exercised in the
browser. An OS preference change was not emulated in this session.
