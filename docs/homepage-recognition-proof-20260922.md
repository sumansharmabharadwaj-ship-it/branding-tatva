# Homepage situation selection and proof

## Change

The Recognition chapter keeps its choice rows fully readable and stationary during scrolling and hover. The previous CSS view-timeline entrance reduced each row to 10% opacity and shifted it by 26 pixels. A decorative selection marker now travels between the chosen rows, while the native button boxes remain fixed. Existing directional reading transitions continue after pointer choices.

Keyboard focus anywhere in the chapter settles active reading motion. Keyboard selection also settles the marker, example rule, reflection, arrow effects and the chapter's CSS exit fade. The background film becomes its existing poster while reading is settled. Tabs, the reading panel and links remain mounted. Site pause, reduced motion and offscreen text transitions retain their static fallbacks. Returning to the chapter or resuming motion does not replay an old text transition.

Each situation now offers a direct case study link using the existing situation-to-proof mapping and project titles:

| Situation | Case study |
| --- | --- |
| Beginning | MyShopInEurope |
| Reposition | HerbalCart |
| Ongoing | Dr. Haley Nutrition |

The link publishes the same chosen situation as the existing path and cost actions. Its label reserves the space required by every project title through inert measurement copies. The link remains a native destination with automatic prefetch disabled. The cost action now reads “Follow the cost of inconsistency.”

## Verification

- TypeScript, component ESLint and whitespace checks passed.
- Production build passed and generated 106 routes.
- The callback harness checked all nine situation/link handoffs, the four tab navigation keys, focus retention, nearest alignment for an obscured link, start alignment for tall reading, and repeated End on the focused tab.
- Motion checks confirmed pointer choices animate, keyboard choices settle, the poster replaces the film during keyboard reading, pause/resume retains the chosen proof, and offscreen choices do not replay on reentry.
- Twelve actual React/Framer Motion server renders passed: three choices across full, keyboard, reduced and offscreen modes. Checked roving tab state, matching panel labels, unique IDs, three destinations and five inert measurement groups.
- Parsed CSS checks confirmed the choice row and its hover state have no translate, transform, opacity or animation declarations.
- Direct source comparison confirmed the opening and hidden-cost scene functions remain unchanged. The About page was outside this batch.

These callback checks use mocked geometry and animation controls. Server renders establish markup, not browser layout or physical input behavior.

## Pending preview acceptance

Browser acceptance remains pending after the previously recorded local `net::ERR_BLOCKED_BY_CLIENT` failure. No deployment was requested during the Vercel cooldown.

On the next controlled preview containing this source, inspect all choices at 320px, 390px, 768px, short desktop and full desktop widths. Check marker travel, visible text throughout forward/reverse scrolling, the added proof link's wrapping, panel height stability and complete focus rings. Use Tab, Shift Tab, Up/Down, Home/End and Enter. Verify the proof link for each choice, then return and follow its path link. Pause during a transition and resume; the current choice, focus and document position should hold. Repeat with reduced motion and enlarged text. Confirm that resuming after keyboard reading does not replay an old transition.

Saved preview source only. Publication and visual acceptance remain pending.
