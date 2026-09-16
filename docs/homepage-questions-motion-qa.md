# Homepage question motion and disclosure stability

## Observed baseline

At 390 × 844 on release 333, opening question 5 while question 1 was open
moved the activated heading from top 718.066895 px to 570.546875 px, a
147.52002 px shift. ScrollY stayed 14855. Closing the earlier answer removed
128.75 px above the heading; the row's entrance transform contributed the
remaining movement. The accessible snapshot also listed the collapsed answers'
paragraphs even though their containers had zero height and aria-hidden.

## Changes

Each question opens and closes independently, so choosing a later answer keeps
earlier readings in place. Question headings retain their layout and hit areas.
Their warm soil text deepens as each row crosses its native scroll reading
interval, and reverses with scroll direction. Each open question draws its own
accent rule. The original heading, introduction, media and background motion
remain in place.

Answers reveal over 340 ms with a small 6 px horizontal and 3 px vertical text
entrance. Copy stays opaque and sharp. Pointer contact or keyboard focus settles
the copy immediately. Open answers have named keyboard reading stops; closed
answers are inert, removed from tab order, and explicitly visibility-hidden.

Up, Down, Home and End move among question headings without changing answers.
Visible targets preserve scroll position; offscreen targets retain native focus
scrolling. Reduced motion uses static text colour and zero-duration disclosure
and rule transitions. No scroll interception, additional runway, or automatic
answer selection was added.

## Build and release

TypeScript, changed-file ESLint, homepage source and typography checks passed.
The production build generated 86 routes, and the rendered homepage gate passed
with thirteen ordered chapters, unique IDs and 490,007 CSS bytes.

Release 334 source: `ad68868bda5060c609b5827a017e28f5d655e068`.
Only the question component, its shared CSS module, the question row treatment
in the homepage scene controller, and release counter changed in this commit.

## Release 334 acceptance

Release 334 deployed READY as `dpl_CzpmXss66NrBKZwqbR3JMbUYNRAG`, trigger
`af6ece11cb6596f49d452647f5ec3257d5216b92`. The trigger differed from source
only by the controlled deployment flag. Homepage run 35136751923, Contact
delivery run 35136751630, and controlled preview run 35136751892 passed.

On the exact 390 × 844 preview, a native pointer click opened question 5 while
question 1 stayed open. All five heading positions stayed exact, with question
5 at 699.296875 px and scrollY 14855. The section expanded down from
1046.515625 px to 1120.890625 px. Tab reached the named question 5 answer,
whose copy transform was none, then continued to the audit link. Opening the
longer question 2 retained questions 1 and 5, and its answer was reachable with
Tab. Pausing with those three answers open preserved their state, the
1331.203125 px section, scrollY 14902, and every question position exactly.
All row colours became static soil and copy transforms settled to none.

The accessible snapshot exposed five question buttons and only the currently
open answer. Closed answers had visibility hidden, zero height, aria-hidden,
inert and a negative tab index. Their paragraphs no longer appeared in the
snapshot. Content and scroll widths both measured 375 px.

At 1440 × 900, Home and End moved between headings at unchanged scrollY 17575.
Enter toggled the focused answer independently. Tab reached the first answer,
then questions 2 and 3, skipping the closed question 2 answer. The desktop
section stayed 900 px tall with questions 1 and 5 open, and both document
widths measured 1425 px. A native 100 px forward/reverse/forward scroll cycle
preserved question 3 focus and both open answers. Question 5's row colour was
rgb(73,67,57), then rgb(87,80,68), then exactly rgb(73,67,57); all row positions
returned to their corresponding values. Pausing kept question positions within
0.15 px while the earlier desktop holds collapsed, and all text became static.

Visual acceptance found the homepage's important ivory outline overriding this
light scene's local focus colour. The followup scopes a clay outline override
to the questions section and moves the answer outline inside its reading area.
It also makes answer entrance motion run only when an answer is newly opened,
so resuming motion does not replay entrances on answers already being read.

## Final followup

Release 335 source: `2d47c8afe441fbc1342ec67bafe7ecb4fac5caef`.
Final TypeScript, changed-file ESLint, homepage source, typography, production
build and rendered homepage checks passed (490,232 CSS bytes).

Release 335 deployed READY as `dpl_GnbavMhgE3WudSmEfpxspWbppk2s`, trigger
`080b4c6fad5f76131c9b6244bc58eab169d76684`. Its trigger differs from source
only by the controlled Vercel flag.

At 320 × 720 on the exact final preview, the long question 2 answer stayed
within x 24–281 px of the 305 px content width. Its named reading stop had
a 2 px rgb(133,80,53) outline inset by 3 px, and a settled copy transform.
A screenshot confirmed the darker focus treatment on the light background.
Content and scroll widths both measured 305 px, including the long reading.
End brought offscreen question 5 into view at top 356.6875 px. Enter opened
it without changing any heading position or scrollY 16660, while questions
1 and 2 stayed open. The section grew downward to 1596.71875 px. Tab reached
the question 5 answer at 427.078125–501.453125 px, fully inside the viewport.
Pause and resume retained all three answers, exact heading positions and scrollY;
their copy transforms remained none immediately after resume and after settling.

On the exact final 1440 × 900 preview, questions 1 and 2 stayed open in a
900 px section. Tab reached the question 2 reading at 516.703125–622.265625 px
with the same clay focus colour and -3 px inset. Pause moved the headings by
only 0.140625 px while the preceding desktop holds collapsed; copy transforms
remained none through resume. Both document widths remained 1425 px.

All final workflows passed: homepage 35137458867, Contact delivery 35137458834,
and controlled preview 35137458759. These are responsive browser-viewport checks,
not physical-device or Safari certification.

## Review-link limitation

The exact protected QA pages were visually and interactively checked. Vercel
metadata confirms the final trigger, but its `/api/release` request returned a
302 authentication redirect. The permanent review alias returned 200 and still
reports older commit `bf4ef15c495ad3e822425c68b2843805ddde6974`; it is not described
as current. The release 335 deployment log confirms that the `VERCEL_TOKEN`
repository secret needed for permanent-alias reassignment is not configured.
