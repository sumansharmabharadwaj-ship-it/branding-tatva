# Homepage project archive: navigation and settled reading

## Change

The project archive now exposes the same Back and Next controls beside the decision record at every viewport width. The controls replace the former explanatory footer paragraph and retain the archive link. They wrap through the five projects, keep focus on the activated control, and move only the horizontal thumbnail strip when its selected tab is outside view. Keyboard and reduced motion choices settle that strip immediately; pointer navigation retains its smooth movement and directional case transition.

Keyboard reading now settles the project copy, decision traces, light accents, image wipe, and foreground project film. Changing the decorative media container's key discards departing image layers on settlement while the original text, tabs, and action buttons keep their DOM ownership. Pointer activation can resume the visual transitions. The foreground film also avoids mount time autoplay while the project dialog is open.

The status region announces explicit project choices rather than every scroll or hover preview. The intro has a stable line of copy instead of switching instructions with playback mode.

The measured desktop scroll frame now survives a motion pause. Playback and scroll driven selection stop without removing the established runway from the document. Initial reduced motion remains in ordinary flow. A compact viewport or content that becomes taller than the viewport releases the hold. CSS spacing and positioning depend on the physical viewport and the layout state, rather than the motion preference.

## Verification

- TypeScript, component ESLint, and whitespace checks passed.
- The production build passed and generated 106 routes.
- Eleven component effect lifecycle checks passed, covering hydration, initial reduced motion, pause/resume, oversized content, and compact/wide viewport changes.
- All five project choices retained the matching case URL and explicit status announcement. Next and Previous wrapped correctly. Four keyboard handler checks covered Left/Right wrapping and Home/End focus targets.
- The component harness confirmed that keyboard choices do not restart reading animations, foreground video is absent while reading is settled, video cleanup pauses the old element, and pointer interaction restores animated selection. Scroll/hover state changes did not produce a status announcement.
- Fifteen actual React/Framer Motion server renders passed: all five projects in full motion, paused motion, and keyboard reading. Checked the selected tab, panel label, unique IDs, single pair of pager controls, case URL, six inert measurement groups, and foreground video state.
- Parsed CSS checks confirmed the pager no longer depends on a mobile media query and reduced motion rules in the active archive stylesheet do not override geometry.

The lifecycle harness executes actual component callbacks with mocked browser geometry, animation controls, and hook scheduling. Server rendering validates markup. Neither establishes visual fit, native focus traversal, touch behavior, or playback quality.

## Pending browser acceptance

The local browser previously rejected the production preview with `net::ERR_BLOCKED_BY_CLIENT`. Visual acceptance requires the next controlled preview containing this commit; no deployment is requested during the Vercel cooldown.

1. Inspect 320px, 390px, 768px, 1180px, and 1440px widths, plus short desktop windows and enlarged text. Confirm Back/Next, the case actions, and the archive link remain visible and usable without horizontal overflow.
2. At a desktop size where the complete shell fits, scroll through the project sequence, reverse direction, pause during an image wipe, and resume. The reading and following chapter should retain their positions.
3. Start with reduced motion enabled. Confirm ordinary flow. Resize or enlarge text while paused; oversized content must release the hold.
4. Use Back/Next with pointer, touch, and keyboard. Confirm wrapping, stable focus, the selected tab, record, count, and case destination agree. Verify the thumbnail strip moves without moving the page.
5. Use Tab, Shift Tab, Left/Right, Home/End, Enter, and Space. Confirm text stays settled, focus remains visible, and screen reader announcements follow explicit choices.
6. Pause during a pending image transition, then resume. Open a project file, move between files, and close it. Confirm no departing media layer remains visible and the foreground film stays paused while the dialog is open.

This batch is saved preview source. Publication and visual acceptance remain pending.
