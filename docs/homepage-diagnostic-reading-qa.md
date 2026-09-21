# Homepage diagnostic reading — release 371

## Changes

The diagnostic presents its answer choices before the implication and next
action. At widths up to 820 px, the question and choices follow one another
in normal document flow instead of separating around an empty landscape gap.
A light translucent panel carries the answer text in the site's body typeface.
The repeated phone “Choose this” labels give their width back to the answers.
The section reserves 80 px above and below its contents and grows when needed.

The title no longer displays an unrelated “02”. It introduces three questions,
and the visible progress label changes to “Complete” with the result. Two copy
lines were revised to follow the existing affirmative-copy rule.

Existing choice, underline, scenery and directional panel motion remain. Focused
reading panels and keyboard-focused radios settle immediately. Keyboard focus
reveals controls that would otherwise fall behind fixed page controls. The
diagnostic scoring, answer review and service handoff remain unchanged.

## Source verification

TypeScript, changed-file ESLint, the homepage source contract, typography floor,
diagnostic state and personalization state gates passed. The production build
generated 86 routes; the rendered homepage check verified thirteen chapters
and 515,134 CSS bytes. The typography check reported 207 retained baseline
issues, with no new issue.

Source: `64ce0f6c6c56f73ca1014a129f2c3922f035537a`.
Tree: `562491044369e89b60fef9f65856964aacd99152`.

## Baseline

The shared preview was confirmed on release 369 before this work.
At 390 × 844 (375 px document width), the diagnostic was 844 px high.
The prompt ended at y=308.63 but the first answer began at y=609.34, leaving
300.72 px between them. Answer copy was 210.14 px wide, set in 17.55 px serif
type with a tight 1.04 line height. The next button appeared above the choices,
and the last choice extended to y=822.33 near the floating controls.

## Candidate verification and correction

Release 370 reached READY as `dpl_Bx7gT7MRGeJcPvp3gCSoRZSsdsNB`, trigger
`16af30d964dafa695c180ba0eb4ea4bc7d0e230e`. Its source-to-trigger comparison
contains only the controlled deployment flag. Homepage contract `35258994101`,
contact regression `35258994079` and controlled preview `35258993941` passed.
Cleanup `40353b95e33f5368590635a99186b9877b38cf5a` restored the flag.

At 390 × 844, the scene still fits 844 px. The first answer begins at y=362.23,
247.11 px earlier; the prompt-to-answer gap falls from 300.72 to 41 px. Answer
copy is 257.03 px wide, a 22.3% increase, with 16 px body type and 24 px line
height. All three choices and the action at y=681.83–730.86 fit the screen.

At 320 × 720, the scene grows to 928 px with no horizontal overflow. Copy is
187.03 px wide; choices are 104–105 px high, and the next button is 49.03 px
high. Selecting the second choice enables the action without advancing. Going
forward and back retains the second answer. ArrowDown chooses the second answer
on question two; its focused transform is none. Tab moves to the next action,
visibly positioned at y=335.41–384.44. Enter opens question three with its
heading focused at y=304.42–414.81, and the panel's transform and filter are none.

With the second answer chosen on all three questions, pausing motion stops all
four scenery animations. Completion yields the coherence result, “The brand
depends too much on your personal approval.” Both visible and spoken progress
say “Complete”. The result is sharp and stationary. Links retain `#evidence`
and `/contact?package=brand-clarity#call`.

Tab through the result makes the proof action visible at y=543.09–614.19, the
contact action at y=400.78–450.72, and answer review at y=400.72–444.72. Review
returns to question three with its second choice selected and the heading
focused. Changing that choice to the third and completing again retains the
correct two-to-one coherence result. Resuming motion preserves the result.
No contact or booking form was submitted.

At 768 × 820, all content fits in one 820 px scene, with 635.03 px answer text
width, 72 px choice heights, and an action at y=648.36–697.39. There is no
horizontal overflow at any of these widths.

The desktop checks exposed insufficient clearance below the newly relocated
action row: its lower edge was y=859.30 at 1440 × 900 and y=689.33 at
1280 × 720. Release 371 gives desktop content 80 px bottom padding and removes
the decision block's additional bottom offset. The phone layout is unchanged.

## Final deployed verification

The final source `a96cbd6a9aa1246d0d2946d914caa04752f525a5`, tree
`abd66d6d45804d0160ec56b14a46b717bd4a8373`, passed a fresh production build,
TypeScript, changed-file ESLint, source homepage, typography and rendered
homepage checks. The rendered check verified 515,232 CSS bytes. A concurrent
local type check/build attempt collided with generated build files; the
successful rerun used a fresh output directory and ran the checks sequentially.

Deployment `dpl_5ioFupDvX3q9ftgEyFxQg1k63u6o` reached READY at trigger
`2b4cd0e44e1c5574b63b12b1cc95f08110eeaf41`. The comparison from final source
to trigger contains only the controlled deployment flag. Homepage contract
`35260196888`, contact regression `35260196815` and controlled preview
`35260196819` passed. Cleanup `eab30d8052f0ba780d88daf99289a3133c6b978e`
restored the flag to false.

Final exact-preview measurements:

| Viewport | Scene height | Prompt bottom | First choice top | Action bottom | Horizontal overflow |
| --- | --- | --- | --- | --- | --- |
| 390 × 844 | 844 px | 321.23 px | 362.23 px | 730.86 px | None |
| 1280 × 720 | 720 px | 282.61 px | 336.66 px | 639.72 px | None |
| 1440 × 900 | 900 px | 436.94 px | 480.36 px | 819.78 px | None |

The desktop action clears the viewport bottom by 80.22–80.28 px, and the
choices remain below the prompt. The laptop screenshot shows the implication
and next action clear of the fixed controls. ArrowDown selection followed by
Tab enables and focuses the action, visibly placed at y=577.69–626.72.
The final phone scene height, answer text width and action dimensions match
the initial candidate exactly. The correction changes only desktop spacing;
the full diagnostic flow was verified on release 370 as recorded above.

## Limits and shared preview

The checks cover Chrome responsive viewports, keyboard input, pointer selection
and the site's motion control. Physical phones, Safari and OS-level motion
emulation were not tested. The browser's existing `/api/release` block prevents
endpoint certification. Deployment metadata, the trigger comparison and the
rendered changes identify the exact preview used for verification.

The shared alias was verified on release 369 at the start and remains there
after these releases: `dpl_5Kg7mhK8JLo3qmWk2SmrXuKpVESg`, trigger
`ffee9e5c99f4b09321592de9dcade360036b8fbb`. The connected tools have no alias
assignment action. `preview-link-repair.md` targets the verified release 371.
Production was untouched.
