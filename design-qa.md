# Branding Tatva homepage cinematic diagnostic and Insights QA

## Comparison target

- Primary source visual truth: `/workspace/scratch/55f96cacf4b7/upload/08a75655-58aa-4a35-9d03-637489c417c4(1).png` (`1536 × 1024`), the user's selected golden flower-on-water diagnostic scene.
- Secondary source evidence: `/workspace/scratch/55f96cacf4b7/upload/Screenshot 2026-08-24 at 3.30.30 PM.png`, showing the rejected crowded Insights layout.
- Browser-rendered diagnostic implementation: `qa/quiz-flowerwater-hover-final.jpg` (`1348 × 926`).
- Browser-rendered Insights implementation: `qa/insights-reading-room-final.jpg` (`1348 × 926`).
- Full-view diagnostic comparison: `qa/homepage-diagnostic-flowerwater-comparison-final.jpg` (`2696 × 926`).
- CSS viewport: `1363 × 936`; device pixel ratio: `1`.
- Density normalization: the source was proportionally resized and centered on a `1348 × 926` canvas; the implementation was captured at the browser's `1348 × 926` page-image output. Both sides of the comparison board therefore share the same pixel footprint without stretching.
- State: desktop, question `01 / 03`, second answer hovered, diagnostic section aligned to one viewport. The Insights capture shows field note `03` active.

## Findings

No actionable P0, P1, or P2 findings remain.

The diagnostic now uses the selected scene itself rather than a substitute landscape. The flower, water, reeds, golden light, question placement, progress treatment, three answer columns, and selected-answer gold state are visibly aligned in the normalized comparison. The implementation adds quiet continuous movement without changing the source composition.

The Insights chapter no longer repeats the active article inside three stacked cards. One open editorial argument occupies the reading area, the five-step visualizer uses the right half, and a compact three-item rail sits at the bottom. The article, visualizer, takeaway, links, and selector rail all fit inside the section with no internal overflow.

## Required fidelity surfaces

### Fonts and typography

- The existing Branding Tatva display serif, earth-green text, and compact uppercase UI type match the source direction.
- Question scale, line height, two-line wrap, answer hierarchy, progress type, and eyebrow spacing are preserved.
- Hover changes the selected answer to `rgb(228, 173, 80)`, matching the stronger gold emphasis in the target.
- Insights restores readable editorial type sizes while removing the oversized duplicate card titles.

### Spacing and layout rhythm

- The diagnostic measures exactly `936px` in the `936px` viewport; its header, prompt, moving scene, and all three answers fit within one screen.
- The fixed navigation may overlay the section during ordinary page travel, but it hides in the captured reading state and does not alter the diagnostic grid.
- Insights measures exactly one viewport. The active article has `scrollHeight === clientHeight`, so content is not clipped inside the panel.
- The Insights selector changed from three tall stacked cards to three low horizontal thresholds, eliminating the crowded right column and the large dead region beneath it.

### Colors and visual tokens

- Earth green remains the dominant foreground; warm ivory and muted gold follow the selected light, organic palette.
- The lower veil protects answer contrast while leaving the water and sunlight visible.
- Gold is reserved for progress, active/hover feedback, and article accents; no dark-theme panel was introduced.

### Image quality and asset fidelity

- The exact selected flower-on-water composition is the full-bleed base asset: `public/images/generated/bt-home-brand-diagnostic-flowerwater-v1.png`.
- A real water-motion video, `public/videos/generated/bt-home-decision-waterlight.mp4`, is masked into the water region at low opacity. It was browser-verified playing with `readyState: 4`, `paused: false`, and advancing `currentTime`.
- The base plate has a 24-second cinematic camera drift; real transparent petal assets move on independent 19-, 23-, and 27-second paths. Cursor movement adds restrained parallax.
- No placeholder art, CSS illustration, handcrafted SVG, or visible play control was introduced.
- The generated clean plate and petal assets are sharp at the measured slot size and show no visible transparency halo.

### Copy and content

- All three diagnostic questions, nine answer choices, scoring logic, diagnosis copy, service path, contact path, and retry action remain intact.
- Visible scroll instructions and play buttons are absent.
- Insights retains all three original article records, excerpts, takeaways, reading paths, and destination links; only the presentation and one redundant reading-time line were simplified.

## Interaction and browser verification

- Background movement: passed; water video playing, plate animation `brand-orbit-camera` active, petals animated, cursor parallax active.
- Answer hover/focus: passed; second answer becomes gold and the underline expands fully.
- Complete quiz journey: passed; `01 / 03 → 02 / 03 → 03 / 03 → diagnosis result`.
- Result actions: passed; `/services#health`, contact action, and retry action rendered.
- Reset: passed; returned to `01 / 03` with three choices.
- Insights tabs: passed; keyboard/click tab structure remains intact, field note `03` becomes the active panel, and the article reports no internal overflow.
- Browser console: no application errors. Cloud-browser extension metadata errors were excluded because their URLs are `chrome-extension://` and do not originate from the site.
- Production build: passed; all `77` routes generated.

## Comparison history

| Pass | Severity | Visible finding | Fix and post-fix evidence |
| --- | --- | --- | --- |
| 1 | P1 | The implementation used an unrelated aerial valley video instead of the selected flower-on-water scene. | Removed the valley sources, generated a clean plate from the exact selected frame, and placed that asset full bleed. The final comparison board shows the same flower, water, reeds, and golden-light composition. |
| 2 | P2 | A still plate alone would not satisfy the requested cinematic movement. | Added live water shimmer, slow camera drift, cursor parallax, and independently drifting real petal assets. Browser evidence confirms the video is playing and the animation is active. |
| 3 | P1 | Insights repeated the same article in one large panel and three stacked cards, creating the crowded layout shown in the user's screenshot. | Rebuilt it as one active editorial argument with a right-side visualizer and compact bottom rail. The final capture shows all content in one viewport without panel overflow. |
| 4 | P2 | The initial hover gold was too pale compared with the selected reference. | Strengthened the state to `rgb(228, 173, 80)` and re-captured the final hover comparison. |
| 5 | — | Final full-view comparison shows no remaining actionable P0/P1/P2 mismatch. | Passed. |

## Focused-region evidence

A separate crop was not needed because the normalized `2696 × 926` comparison keeps the diagnostic question, progress, imagery, all three answers, and hover state legible at full resolution. Motion state, exact computed hover color, section bounds, quiz completion, reset, Insights tab selection, panel overflow, and console errors were additionally inspected directly in the cloud browser.

## Follow-up polish

- P3: the drifting petals and water highlights naturally occupy different positions from frame to frame; this is intentional motion, not layout drift.
- P3: the global navigation can appear over the diagnostic while arriving from the previous scene, then clears as the homepage header director changes state.

## Final result

passed

---

# Homepage scene-rhythm QA · 2026-08-24

## Comparison target

- Source visual truth: `/workspace/scratch/55f96cacf4b7/upload/08a75655-58aa-4a35-9d03-637489c417c4(1).png` (`1514 × 1039`), the approved golden flower-on-water diagnostic.
- Pre-change live-flow evidence: `/workspace/scratch/bt-flow-01-06-contact.jpg`; ordinary wheel positions exposed adjacent chapters in the same viewport.
- Browser-rendered implementation: `/workspace/scratch/bt-scene-rhythm-diagnostic-final.jpg` (`1348 × 926`).
- Normalized full-view comparison: `/workspace/scratch/bt-scene-rhythm-comparison-final.jpg` (`2768 × 926`).
- Opening preservation comparison: `/workspace/scratch/bt-scene-rhythm-opening-comparison.jpg` (`2768 × 926`).
- CSS viewport: `1348 × 936`; device pixel ratio: `1`.
- Density normalization: the source visual was proportionally resized and center-cropped to `1348 × 926`; the browser capture remained at its native page-image size before the two images were placed side by side.
- State: desktop, full motion, diagnostic question `01 / 03`; opening captured before and after at the same route and viewport.

## Findings

No actionable P0, P1, or P2 findings remain.

The earlier layout problem was not chapter height: all thirteen authored chapters measure exactly one `936px` viewport. The failure was the resting position between chapters, which exposed two complete compositions at once. Visitor-led scrolling now resolves to the nearest chapter only after input settles. The behavior does not prevent scrolling, show an instruction, autoplay the page, or alter the first scene.

## Required fidelity surfaces

- Fonts and typography: unchanged. The opening and diagnostic preserve the existing display serif, uppercase utility type, line breaks, hierarchy, and readable answer labels.
- Spacing and layout rhythm: passed. A normal `1000px` desktop wheel gesture settled to Recognition at `936px`, Diagnostic at `1872px`, and Cost at `2808px`; the browser no longer rested at the former in-between positions.
- Colors and visual tokens: unchanged. The arrival treatment only lifts exposure and saturation from `0.93/0.90` to the authored final values during the `620ms` settle; no new palette, surface, or dark panel was added.
- Image quality and asset fidelity: passed. The approved flower, water, reeds, floating petals, and golden light remain the exact diagnostic scene. The live water video was playing at the aligned diagnostic frame (`readyState: 4`, `paused: false`).
- Copy and content: unchanged. The opening copy, diagnostic question, three choices, explicit `Choose this` affordances, links, and all later chapter content remain intact.

## Interaction and browser verification

- Natural wheel settle: passed at three consecutive chapter boundaries.
- Input priority: passed; the director does not prevent wheel, touch, pointer, or keyboard input and cancels its own settle when new input arrives.
- Quiz interaction: passed; choosing answer `01` advanced from question `01 / 03` to `02 / 03` while remaining aligned at `1872px`.
- Footer release: passed; scrolling beyond Invitation reached the document maximum (`11986px`) with the footer visible instead of snapping back.
- Reduced motion: passed by code path and site preference; the scene director unmounts when Branding Tatva's Reduced setting is active and the CSS arrival animation is disabled under `prefers-reduced-motion`.
- Browser console: no application errors. Logged errors were limited to `chrome-extension://` browser metadata messages and were excluded from site QA.
- Production build: passed; all `78` routes generated.
- Live deployment: `28e46545d9478adf55d17d0a935eb57984b0af6b`, READY on the `august-8-isolated` branch alias.

## Comparison history

| Pass | Severity | Visible finding | Fix and post-fix evidence |
| --- | --- | --- | --- |
| 1 | P1 | Wheel movement could stop between two one-screen chapters, making the homepage look crowded even though each chapter fit. | Added a visitor-led idle settle to the nearest chapter; live measurements landed at `936px`, `1872px`, and `2808px` across consecutive gestures. |
| 2 | P2 | A hard jump would have felt mechanical and would not match the cinematic reference direction. | Used the existing smooth-scroll engine with a `620ms` quartic ease and a restrained exposure/saturation arrival on the incoming scene. |
| 3 | P1 | A scene snap could have trapped the invitation or interfered with the quiz. | Explicitly released the footer after the last scene and browser-tested a quiz selection during the new rhythm. Both passed. |
| 4 | — | Static fidelity and opening preservation rechecked after the behavioral change. | The normalized flower-water comparison and opening before/after board show no new layout or content drift. |

## Focused-region evidence

A separate crop was not needed. The normalized full-view diagnostic board keeps the headline, progress, moving landscape, instruction line, all three answer columns, and answer affordances legible. Dynamic behavior was measured directly in the cloud browser because a still crop cannot prove scroll settling, video playback, input cancellation, or footer release.

## Follow-up polish

- P3: hash-entry alignment can finish a few pixels from the chapter top while the global hash-recovery routine hydrates; normal homepage entry and subsequent chapter gestures resolved exactly.

## Final result

passed
