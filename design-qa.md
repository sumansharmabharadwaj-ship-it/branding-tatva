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
