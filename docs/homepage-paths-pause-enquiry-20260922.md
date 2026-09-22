# Homepage service paths: pause stability and direct enquiry

## Change

The service paths chapter now separates its established scroll layout from animation playback. Pausing motion leaves an existing measured desktop frame in place rather than removing a viewport of document height. The scroll driven selection stops, while the tabs and links remain available. An initial reduced motion visit uses ordinary document flow. Narrow viewports and content that grows taller than the viewport release the held layout, including while motion is paused.

The footer now offers a direct enquiry for the selected package: Foundation, Full Brand System, or Brand Partnership. It carries the package into the contact page's call section and publishes the existing journey selection on activation. The existing scope link still opens the corresponding Services package. Hidden inert labels reserve the space needed by every enquiry label.

The new enquiry link joins the visualizer's protected keyboard focus scope, so scroll driven selection cannot change its destination while it owns keyboard focus. Keyboard reading also settles the selection marker and arrow hover motion. Pointer interaction can resume the decorative motion.

## Verification

- TypeScript, component ESLint, and diff whitespace checks passed.
- The production build passed and generated 106 routes.
- Eleven component effect lifecycle checks passed: hydration, initial reduced motion, enabling motion, pause, resume, oversized content, content shrinking while paused, and compact/wide viewport changes. The harness executes the component's actual effect callbacks with mocked browser geometry and hook scheduling; it does not measure browser layout.
- All three package enquiry destinations and scope links matched the selected path. Enquiry activation published the correct package and origin through the existing journey helper.
- Four tab keyboard handler checks passed: Left/Right wrapping and Home/End, including default prevention and the intended focus target. Two interaction mode checks confirmed keyboard settlement and pointer resumption of the selection marker.
- Nine actual React/Framer Motion server renders passed: all three choices in full motion, paused motion, and keyboard reading. Checked the single selected tab, panel, unique IDs, motion state, package destinations, and inert measurement copies.
- A parsed CSS check confirmed reduced motion rules no longer override scene height or positioning.

These checks do not certify visual layout, native focus traversal, touch behavior, or animation playback. Browser acceptance is pending because the local production preview was rejected with `net::ERR_BLOCKED_BY_CLIENT` in the preceding batch. No deployment is requested during the provider cooldown.

## Next controlled preview acceptance

1. Confirm the preview release includes this source commit.
2. At a desktop width above 1180px with content fitting the viewport, pause midway through this chapter. Confirm the current reading stays at the same position and the following chapter does not jump upward. Resume and reverse the scroll.
3. Start with reduced motion already enabled. Confirm normal document flow. Repeat with increased text size, a short window, and a viewport resize while paused; every action should remain reachable.
4. Select every path and verify both the Services scope and contact package. Use back navigation and confirm the journey selection restores correctly.
5. Tab to the enquiry link, then scroll while it remains focused. Its label and destination should remain stable. Test Shift Tab, Left/Right, Home/End, Enter, and Space on the path controls.
6. Inspect 320px, 390px, 768px, and 1024px layouts. Confirm the new enquiry and audit actions wrap legibly, have usable touch targets, and cause no horizontal overflow.

This is saved preview source. Publication and visual acceptance remain pending.
