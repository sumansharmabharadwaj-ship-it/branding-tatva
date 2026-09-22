# Homepage section menu viewport fit

## Change

The floating chapter menu previously used a height limit of 68svh regardless of its distance from the top of the screen. On a short viewport, especially with the consent notice raising the guide, the list could extend above the viewport.

While open, the list now measures the space between its control and the header's resting bottom edge. It reserves an eight pixel clearance above and uses a shared ten pixel gap below. A CSS height budget covers the first paint before measurement. The existing entrance animation and reduced motion fallback remain in place.

The menu updates after viewport, header or guide size changes and consent notice state changes. The focused chapter stays in view by scrolling only the list. A visual viewport offset is included in the top clearance calculation. Measurement listeners, observers and pending frames are removed when the menu closes.

At widths up to 820px and heights up to 520px, the control docks on the left beside the existing privacy shield. This matches the homepage's existing compact consent breakpoint and recovers the vertical space previously reserved above that shield. The chapter list opens from the same edge. Short layouts omit the decorative list heading and reduce panel padding while keeping each link's 44px minimum height. Horizontal sizing accounts for safe area insets.

## Verification

- TypeScript and component ESLint passed.
- Production build passed and generated 106 routes.
- Whitespace checks passed.
- The actual component callback harness passed nine mocked viewport geometries, including 234px height and a larger bottom safe area. It checked header clearance, room for a complete link, focus retention and unchanged page position.
- Header resizing, consent state observation, visual viewport resize and offset updates recomputed the menu budget. Closing during a queued measurement removed observers, listeners, the frame and the temporary style.
- Existing navigation checks passed for all 13 links, four menu navigation keys, four modified click paths, destination heading focus, Escape, boundary controls, compact tour cancellation and reduced motion.
- Twelve React server renders passed across first, middle and final chapters, open and closed menus, and full and reduced motion.
- Source comparison confirmed the scene handoff functions were unchanged.

These checks exercise mocked geometry and actual server markup. They do not certify native browser layout, touch scrolling, focus painting or mobile Safari behavior.

## Pending preview acceptance

Browser acceptance remains pending after the previously recorded local `net::ERR_BLOCKED_BY_CLIENT` failure. No deployment was requested during the Vercel cooldown.

On a preview containing this batch, check 320px and 390px widths, landscape, 337 by 234, and desktop with and without the consent notice. Open near the final chapter, scroll the list, rotate the viewport and change the notice state. Confirm full focus outlines, header clearance, privacy button access and a stable page position. Repeat with keyboard navigation, browser zoom, safe area insets and reduced motion.

Saved preview source only. Publication and visual acceptance remain pending.
