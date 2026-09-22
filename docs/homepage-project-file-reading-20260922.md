# Homepage project file reading: 22 September 2026

## Changes

The expanded project file now measures its toolbar's natural height and uses that value for the reading inset. The toolbar retains a minimum height, while larger text and wrapped navigation can increase its size. Its own layout does not depend on the measured variable, avoiding a resize feedback loop. The reading remains the only scrolling content area.

Project transitions move the introductory copy, decision trail, and results in a short sequence. Each block stays opaque, moves 6px horizontally and 2px vertically, and settles in 400ms with a capped 45ms stagger. The reading surface and its action controls remain stationary. The article retains its identity between projects, while the existing media movement remains a separate 620ms transition. Only a fresh pointer navigation requests these effects.

Keyboard focus, keyboard events, and assistive activation settle reading motion and replace the project film with its existing poster. This state persists until pointer interaction. Pausing, resuming, reopening, or changing a project while reduced motion is active cannot replay a consumed transition. The modal continues to use the shared media director for playback. The full case study link keeps its destination and disables speculative prefetching.

The native modal now owns Tab traversal without a custom boundary handler. Escape retains the existing cancel and close behavior. Opening preserves the page's scrollbar space, and closing restores the original overflow and gutter values with their priorities, the previous scrolling state, and the original opener focus. Project navigation keeps this lock and the dialog in place.

All five projects retain their original text, results, labels, and case study destinations. The archive outside the dialog is unchanged.

## Verification

- TypeScript, component ESLint, and `git diff --check` passed.
- The final production build passed and generated all 106 routes. Homepage output remains 71.4kB with 313kB first load JavaScript; the project file remains lazily loaded through the existing archive entry point.
- A focused temporary harness executed the actual component callbacks and effects with simulated browser objects. It passed forward and reverse navigation through all projects, stationary paper and controls, toolbar measurement and cleanup, progress clamping and frame coalescing, both scroll-lock restoration cases, opener focus restoration, keyboard and assistive activation, pointer resumption, pause/resume, reopen, unmount cleanup, and focus arriving before a transition effect.
- Five Tab combinations were left unprevented, including Shift and browser modifiers. Native focus containment itself remains a browser acceptance item.
- Twenty actual React server renders passed across all five projects and full, keyboard, reduced, and unhydrated modes. Checks covered one labelled modal, four controls, unique IDs, the reading region, film or poster selection, and the correct case study destination. Extracted text matched the previous source for every rendered project.
- Parsed CSS checks confirmed that the toolbar's height does not consume its own measured variable.

These checks cover source logic and rendered markup, rather than real browser layout, native modal traversal, or physical device playback.

## Pending preview acceptance

The established browser session cannot open the local preview (`net::ERR_BLOCKED_BY_CLIENT`), and the existing Vercel cooldown remains in effect. No fresh desktop, mobile, or Safari acceptance is claimed.

After the controlled preview can be published and its exact source confirmed:

1. Open a project using pointer and keyboard. Inspect desktop, 768px, 390px, and 320px widths, plus enlarged text. Confirm the reading begins below the complete toolbar and every navigation control remains visible.
2. Move forward and backward through all five files, including rapid reversals. Confirm the reading returns to its top, the control focus remains stable, and the page behind the dialog stays locked.
3. Use Tab and Shift Tab through the native modal; use Escape, the close control, and the lower archive control. Confirm focus containment, visible focus, and restoration to the original opener without page movement.
4. Pause during text and media transitions, then resume. Repeat with keyboard focus and assistive activation. Confirm the poster and settled reading remain until pointer interaction and old transitions stay consumed.
5. Resize or enlarge text while a file is open. Inspect toolbar wrapping, reading clearance, internal scroll progress, and the case study link. Repeat on Safari.

This batch saves preview source and requests no deployment. Production and deployment controls are unchanged.
