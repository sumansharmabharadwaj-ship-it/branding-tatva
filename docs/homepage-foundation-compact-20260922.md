# Compact homepage foundation diagram

## Change

At widths up to 1180px, the existing four foundation tabs now form a diagram: Category, Audience, and Belief feed into Position. The SVG connections occupy a dedicated grid row between the source tabs and the Position tab. Text can wrap without sharing space with a connector. Selecting a source draws its connection; selecting Position draws all three, with a brief stagger.

This reuses the same four controls and the same reading panel. It adds no second set of mobile controls, separate section, scroll hold, asset request, or runtime dependency. The wide diagram stays beside the reading on desktop. At tablet widths the reading card now uses the available width instead of keeping the narrow desktop allocation while its adjacent map is hidden.

Compact source tabs have a 3.25rem minimum height; Position has a 3rem minimum height. Existing Left/Right, Home/End, roving tab stops, selected states, and panel labelling remain in place. SVG clips have unique IDs and are hidden from assistive technology. Shared reduced motion and keyboard reading settle the connectors, selection marker, and reading animations. Pointer interaction can resume animation.

The four explanations now describe buyer comparisons, purchase decisions, evidence, and positioning directly, without leading with the studio's activities.

## Verification

- TypeScript and ESLint passed.
- The production build passed and generated 106 routes.
- Twelve React server render checks passed: all four selections in full motion, reduced motion, and keyboard reading states. Checked the single selected tab and roving tab stop, panel labels, unique IDs, valid clip references, the expected one or three active connections, motion state, copy restrictions, and the Foundation scope link.
- These checks use seeded hooks and actual React/Framer Motion server output. They do not certify browser layout, focus transitions, touch behavior, or animation playback.
- Local browser acceptance is pending: the browser rejected the local production preview with `net::ERR_BLOCKED_BY_CLIENT` during the preceding homepage batch. No alternate deployment is requested during the provider cooldown.

## Next controlled preview acceptance

1. Confirm the exact preview source includes this batch.
2. Inspect 320px, 390px, 768px, and 1024px widths: all labels fit or wrap, connections stay between the controls, the reading uses the available width, and the scope action stays reachable.
3. At 1180px and 1181px, confirm the layout switches between the compact diagram and the wide map without duplicate visible controls. Repeat on a short desktop viewport and with increased text size.
4. Tap all four choices. Confirm the selected tab, panel title, decisions, and connections agree. Confirm the panel's measured height remains stable across selections.
5. Use Tab, Shift Tab, Left/Right, Home/End, Enter, and Space. Confirm focus remains on a visible control and motion settles during keyboard reading.
6. Select Position and pause motion during the stagger. All three connections should settle immediately without losing selection or moving focus. Resume, switch choices quickly, and reverse the desktop scroll.

This is saved preview source. Publication and visual acceptance remain pending.
