# Homepage journey navigation

## Change

The section menu opens around the current chapter. Enter, Space or Up/Down on its trigger opens the list with focus on that chapter. Up/Down wrap through the links; Home and End reach the first and last. Ordinary Tab remains available and Escape returns to the trigger. Only the floating list scrolls to reveal a focused link.

Unmodified link activation places programmatic focus on the destination heading before closing the list. The native fragment link still owns navigation and history. Any temporary tabindex is removed on blur. Modified clicks keep their normal browser behavior.

Previous and Next remain mounted and focusable at the first and final chapters. They expose aria-disabled and perform no action at those boundaries, avoiding the focus loss caused by disabling the focused button. The guided playback button also stays mounted when reduced motion is enabled, explains its unavailable state, and cannot start a tour.

Crossing into the compact layout stops an active guided tour and clears its pending advance. Focus on a control hidden by that layout moves to the visible section-menu trigger. Widening the screen does not restart the tour. The blur handler also covers the browser clearing focus while CSS hides a control.

A small rule under the chapter control follows the current chapter's reading progress. It reverses with scrolling and has no timed animation. Chapter resize observation updates both the rule and active chapter after content reflow. The existing scene handoff implementation is unchanged.

## Verification

- TypeScript, component ESLint and whitespace checks passed.
- Production build passed and generated 106 routes.
- The focused callback harness checked all 13 chapter links, four list-navigation keys, four modified-click paths, Escape, current-chapter opening, temporary heading focus and the existing return-to-reading Tab path.
- Boundary controls retained their identities and produced no extra scroll request. Reduced motion retained the playback control, cleared the advance timer and blocked activation.
- Compact viewport changes stopped the tour, moved focus to the trigger and cleared its timer. Widening and resuming page motion did not restart it. Backgrounding the document also cleared the guided advance.
- Forward/reverse progress returned the same value. Menu focus scrolled only the menu in the mocked geometry. Observer/listener/frame/timer cleanup passed.
- Twelve actual React server renders passed across first, middle and final chapters, open/closed menus and full/reduced motion. Every render retained four controls, 13 native fragment links and exactly one current-location link.
- Source comparison confirmed the scene handoff functions remained unchanged.

The harness uses mocked DOM geometry, events and timers. Server rendering verifies markup. These checks do not certify native browser focus, fragment history, menu clipping or physical touch.

## Pending preview acceptance

Visual/browser acceptance remains pending after the previously recorded local `net::ERR_BLOCKED_BY_CLIENT` failure. No deployment was requested during the Vercel cooldown.

On a controlled preview containing this batch:

1. Inspect desktop, 390px and 320px layouts, landscape and the 337 by 234 compact case. Check menu bounds and header/privacy-notice clearance, especially at short viewport heights.
2. Open the menu near the final chapter. Confirm the current link is revealed without moving the page. Repeat with pointer, Enter, Space and Up/Down.
3. Use all four navigation keys, ordinary Tab and Shift Tab, then Escape. Confirm complete focus outlines and a stable page position.
4. Activate links by pointer and Enter, including the current hash. Check destination heading focus, Back/Forward behavior, then modified clicks in a separate tab.
5. Reach the first/final chapters using Previous and Next. Focus should remain on the same control and a further activation should do nothing.
6. Start the guided tour, resize below 821px, then widen. Confirm no hidden advance continues and focus returns to the visible control. Repeat while changing the site's and OS motion preferences.
7. Scroll in both directions and change content height. Confirm the progress rule and chapter label follow the reading without causing scrolling.

Saved preview source only. Publication and browser acceptance remain pending.
