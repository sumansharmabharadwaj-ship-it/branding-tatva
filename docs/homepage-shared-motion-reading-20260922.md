# Homepage shared motion reading: 22 September 2026

## Changes

The shared background camera and page pacing now yield while a native dialog is open, keyboard focus is visible within the homepage, or a text selection intersects the homepage. The selection check also covers a range that starts outside the homepage. A shared helper observes focus, selection, pointer input, dialog state, and page visibility so both directors use the same reading conditions.

The camera cancels its animation frame and pauses the atmospheric surfaces while preserving their current transform values and internal easing state. Pointer movement during reading leaves the camera position alone. On release, the camera resumes from the held position and re-establishes the current scroll baseline. An inactive tab follows the same hold and resume path. Resizing and measured layout changes reset the scroll baseline before another camera frame, preventing document repositioning from creating false velocity.

Page pacing now waits for hydration and an active motion preference. Entering a reading state cancels pending animation and settle timers, clears scroll intent and velocity, and keeps the last page progress value. Returning updates progress without treating the intervening position change as a gesture. Keyboard shortcuts, composing or handled events, editable controls, wheel zoom, and multi-touch gestures no longer establish page scroll intent. Scene presence annotations retain their existing semantics.

Both directors recheck ownership after pointer defaults, allowing pointer input on an already focused control to release keyboard ownership without requiring focus to move. Event handlers, dialog and layout observers, frames, timers, scene annotations, and camera properties are cleaned up when the effect ends. Late observer callbacks cannot republish motion after disposal.

This batch changes no rendered copy or styles. Fragment recovery, motion-toggle reading-position restoration, and the toggle's keyboard return behavior are byte-identical to the previous source. Native document scrolling remains under the browser's control.

## Verification

- TypeScript, ESLint for all three changed source files, and `git diff --check` passed.
- The production build passed and generated all 106 routes. Homepage output is 72kB with 314kB first load JavaScript.
- A temporary harness executed the actual camera and pacing effects and ownership helper with simulated DOM, focus, selection ranges, geometry, observers, animation frames, and timers. All 22 focused scenarios passed.
- Scenarios covered hydration and reduced-motion gates; hold and resume for keyboard focus, selection, dialogs, and hidden tabs; same-control pointer resumption; resize and ResizeObserver rebasing; forward and reverse scroll; frozen-position continuity; inactive offscreen surfaces; shortcut, control, zoom, and touch guards; device preference changes; retained scene-entry semantics; full cleanup; and late callbacks after disposal.
- The harness rejects any native document scroll call from the tested effects. A separate source comparison verified that the camera component's fragment recovery and motion-toggle code remained byte-identical.

These checks establish source behavior with simulated event ordering. Browser timing, physical touch, native focus styling, dialog rendering, and Safari acceptance still need the controlled preview.

## Pending preview acceptance

The established browser session cannot open the local preview (`net::ERR_BLOCKED_BY_CLIENT`), and Vercel remains in its recorded deployment cooldown. This batch requests no deployment and claims no fresh browser acceptance.

After the controlled preview is available and its exact source is confirmed:

1. Start scrolling and moving the pointer across an atmospheric field. Select text, including a selection crossing a section boundary. Confirm background movement holds without a jump, then resumes smoothly when the selection is cleared.
2. Tab into homepage controls and read a panel. Activate the same control with the pointer and confirm the background can resume after keyboard focus styling releases.
3. Open a project file while background movement is active. Read and scroll within the native dialog, then close it. Confirm the background holds throughout and resumes without a burst from the dialog's scroll or page restoration.
4. Switch browser tabs during movement, return, and reverse scroll. Confirm no accumulated velocity from the time spent away.
5. Resize the viewport and increase text size while a desktop story changes between its held layout and document flow. Confirm the resulting position adjustment creates no false momentum.
6. Repeat with reduced motion, touch, browser zoom shortcuts, and Safari. Confirm native scrolling and shortcuts retain their normal behavior.

Preview source only. Production and deployment controls remain unchanged.
