# Homepage brand connections diagram

## Change

The interactive connection exercise now uses a warm cream and earthy palette, with darker labels and connection colours. Foundation, Flow, Distinction, Voice, and Recognition lead the desktop choices; the Tatva names remain as supporting labels. Connected and Missing states sit below the main label so longer names can use the card width.

The centre shows how many connections remain and is a real restore button. Restoring a missing connection expands a single, brief ring from the centre as all five connections return. The existing restore action below the reading remains available. Both controls retain their DOM nodes and keyboard focus after restoration, expose an unavailable state when the system is already complete, and ignore redundant activation.

The diagram's side nodes move inward, and button widths are limited in proportion to the diagram. This reserves space around edge controls on narrow screens. The enclosing polygon uses the same coordinates as the controls and connectors. Nodes have a 3rem minimum height; the centre has a 4.5rem minimum height.

Keyboard reading and reduced motion settle the connector transitions, foreground signal dots, central circle, completion ring, text movement, background glows, and hover transitions. Pointer interaction can resume motion. Leaving the viewport cancels the completion cue; returning or resuming does not replay an old restore. The core circle animates its radius around fixed coordinates, rather than scaling an SVG group around an inferred origin.

Toggle buttons now retain stable accessible labels as their pressed state changes. The reading and status describe the missing business function directly. The existing audit destination remains `/services#audit`.

## Verification

- TypeScript, component ESLint, and whitespace checks passed.
- The production build passed and generated 106 routes.
- The component callback harness passed all five choice/restore paths, including synchronized desktop and diagram controls, one completion pulse per restore, and redundant restore activation.
- Eight keyboard handler checks covered Left/Right wrapping and Home/End for both control groups. Checked intended focus targets and settled keyboard reading.
- Pause, resume, pointer resumption, viewport exit/reentry, repeated node toggling, and reduced motion restoration checks passed. Active text animations were cancelled and the completion ring cleared on pause. Resume and viewport reentry did not replay completion.
- Eighteen actual React/Framer Motion server renders passed: the complete system and all five missing states, each in full motion, reduced motion, and keyboard reading. Checked pressed states, restore availability, unique IDs, valid reading controls, stable accessible labels, hidden measurement groups, five connections, signal-dot presence, polygon coordinates, and the audit link.
- The five principal text colours have calculated contrast ratios from 5.09:1 to 10.24:1 against the nominal `#eae1d2` ground. This is a palette check, not a rendered contrast audit of gradients and translucent surfaces.

The callback harness uses mocked geometry, animation controls, and hook scheduling. Server rendering validates markup. These checks do not certify visual fit, physical touch behavior, native focus traversal, or animation playback.

## Pending controlled preview acceptance

The local browser previously rejected the production preview with `net::ERR_BLOCKED_BY_CLIENT`. No deployment is requested during the Vercel cooldown. Inspect the next controlled preview containing this batch:

1. Check the lighter diagram after the Tatva introduction and its transition into the following section. Confirm readable labels, subtle grid texture, and sufficient contrast in every selected state.
2. Inspect 320px, 390px, 768px, 1024px, and desktop widths, plus enlarged text. Confirm edge labels, focus outlines, the centre control, and the reading fit without clipping or overlapping hit areas.
3. Select every node. Confirm the missing connector, meter segment, count, heading, and consequence agree. Select the same node again or use either restore control; all five connections should return with one completion ring in full motion.
4. Use Tab, Shift Tab, Left/Right, Home/End, Enter, and Space. Confirm stable focus, visible outlines, consistent toggle labels, and settled reading. Restore from the centre and confirm focus stays there.
5. Pause midway through a connector or completion animation. Confirm everything settles immediately. Resume, scroll out and back, and reverse scroll; the old completion cue should remain finished.
6. Open the audit link and verify its destination. Confirm the preceding Tatva introduction retains its existing behavior.

This batch is saved preview source. Publication and visual acceptance remain pending.
