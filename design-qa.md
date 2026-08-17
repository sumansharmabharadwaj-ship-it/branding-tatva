# Homepage cinematic rebuild — design QA

## Evidence

- Source visual truth: `/workspace/scratch/2af10d827d8a/generated_images/exec-20f8d6be-2bd7-48d7-aa5f-3287bc53373b.png`
- Source frame: 1487 × 1058
- Implementation: `https://branding-tatva-git-homepage-cinematic-recovery-suman22.vercel.app/`
- Implementation frame: 1363 × 936 CSS pixels at device scale factor 1
- State: desktop opening after the prelude; consent dismissed for an unobstructed comparison
- Full-view comparison: the source and deployed opening were placed in the same comparison input during cloud-browser QA.
- Focused interaction evidence: the Ask Tatva panel was opened on the deployed preview and its “Clarify my positioning” starter returned the intended strategy response.

## Comparison findings

### Typography

- Passed. The deployed opening preserves the source direction’s large editorial serif, italic emphasis, small uppercase metadata, and restrained sans-serif support copy.
- The hierarchy remains readable inside one viewport without clipped display text.

### Spacing and layout

- Passed at the requested desktop film frame. All 11 chapters measure exactly 936px at the 1363 × 936 viewport, and one deliberate wheel movement advances exactly one 936px chapter.
- The opening keeps the source’s left-led statement, far-left chapter index, quiet proof plate, and lower-right strategy guide entry.
- Recognition, Hidden Cost, Paths, Method, Evidence, Tatva, Studio, Decision, and Invitation were each inspected at their snapped position. No remaining content panel exposes a browser scrollbar or collides with the fixed film controls.

### Colors and tokens

- Passed. The blue-hour charcoal, mist grey, warm ivory, and restrained sandstone accent map closely to the selected direction while using the site’s existing brand tokens.
- Glass surfaces retain readable contrast and do not overpower the live footage.

### Image quality and asset fidelity

- Passed. The opening and internal cinematic scenes use real live-action video/poster assets with filmic crops, dark grading, and continuous motion.
- Legacy constellation, compass, map, orbit, and diagram treatments are removed across breakpoints; no GIF-style or boomerang-style graphic is used as the visual subject.

### Copy and content

- Passed. The opening promise, chapter sequence, pathway previews, evidence, method, studio authorship, decision answers, and invitation form one coherent strategy narrative.
- The method language now describes the method rather than a removed diagram.

## Interaction and accessibility checks

- Chapter snapping: passed; 0 → 936px on one wheel movement.
- Recognition choices: passed; the selected condition and reading update together.
- Method tabs: passed; selecting “Architect” updated the reading to “One defensible position.”
- Ask Tatva: passed; trigger, close control, starter chips, response, input, and session-only privacy note are present and usable.
- Primary CTAs and links remain semantic anchors/buttons with visible focus styles.
- Reduced-motion behavior remains implemented; decorative diagrams stay absent at desktop and mobile breakpoints.
- Console check: no application errors observed. Logged errors were isolated to the cloud browser’s Chrome extension, not the deployed site.

## Iteration history

- Iteration 1 finding (P2): the chapter rail collided with the hero, and Recognition, Hidden Cost, Paths, Method, Evidence, and Decision inherited multi-screen layouts that clipped content.
- Iteration 2 fix: compact rail behavior, explicit one-viewport geometry, split reading plates, visible path choices, evidence rows, and written Decision/Tatva scenes.
- Iteration 3 finding (P2): Recognition and Paths showed internal scrollbars; Method’s focus card sat below the viewport; Tatva retained an empty diagram-sized board; Studio and Decision exposed clipped lower content.
- Iteration 3 fix: removed internal scrollbar treatments, replaced diagram space with a live-action reading plate, removed the clipped studio detail block, compressed Decision, and raised/shortened the Method reading clear of fixed controls.
- Post-fix evidence: the final deployed Method frame shows the complete active reading with no clipped label, scrollbar, or control overlap; Tatva shows live footage and a readable consequence plate; Studio and Decision each fit the single frame.

## Final result

passed