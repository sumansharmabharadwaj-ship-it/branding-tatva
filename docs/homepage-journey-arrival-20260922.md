# Homepage journey arrival: 22 September 2026

## Changes

The guided journey now gives each chapter its full reading interval after the browser finishes arriving. Crossing the reading line during a transition updates the current chapter marker without starting the next timer. The final invitation finishes arriving before guided mode pauses, avoiding the previous early interruption of that last transition.

A small native-scroll observer tracks one requested destination. Arrival uses current chapter geometry, scroll margin, page scroll padding, and the available document range. It waits for a settled position and works without a `scrollend` event. An interrupted, removed, or unreachable target ends the request; a three-second limit prevents an indefinite pending transition. It never drives intermediate scroll positions or retries a failed destination. Homepage scrolling remains native, matching the existing provider's homepage profile.

Rapid Next and Previous clicks now step from the latest requested chapter. Replacing a request cancels the previous observer, so an old frame cannot complete a newer transition. Pointer activation keeps smooth native travel; keyboard and assistive activation of the transport controls uses instant travel. Reduced motion and the hydration state also keep transport changes instant. The controls remain focusable at their boundaries, with their existing disabled-state semantics.

Wheel, touch, pointer, focus, and keyboard input can take over immediately. Selection intersecting the homepage returns the journey to manual control. Hidden tabs, native dialogs, and the site menu pause an active tour and stop a manual transition too. Closing an overlay, clearing a selection, widening the viewport, or restoring motion does not automatically start a tour. Page progress waits while the tab is hidden and updates when it returns.

The chapter list preserves its 13 native anchor links, local list scrolling, temporary heading focus, and return to the reading. Handled, composing, and modified keyboard events are left alone. Progress and menu layout observers now reject callbacks after disposal. Chapter copy, dwell durations, styles, and scene handoffs remain unchanged.

## Verification

- TypeScript, ESLint for both changed source files, and `git diff --check` passed.
- The production build passed and generated all 106 routes. Homepage output is 72.5kB with 314kB first load JavaScript.
- A temporary harness executed the actual guide component callbacks and native arrival observer using simulated geometry, React state/effect lifecycles, focus, frames, and timers. All 12 scenario groups passed.
- Checks covered full reading intervals after arrival, the final chapter, rapid Next and Previous requests, stale frame rejection, margins and page padding, document-end clamping, changing geometry, instant keyboard travel, reduced motion and hydration, all five manual takeover events, dialog and site-menu interruption, tab visibility, text selection, timeout and removed-target handling, compact-layout focus transfer, native chapter links, shortcut guards, hidden progress, and cleanup.
- Twelve actual React server renders passed across beginning, middle, and final chapters, open and closed menus, and full and reduced motion. Each retained all 13 section anchors, four controls, one current-section marker, and stable boundary focus semantics.
- A source comparison confirmed the scene handoff implementation is byte-identical to the previous source.

These are source and simulated interaction checks. Native smooth-scroll timing, physical touch, focus rendering, mobile layout, and Safari acceptance still require the controlled preview.

## Pending preview acceptance

The established local browser route remains blocked by `net::ERR_BLOCKED_BY_CLIENT`. The recorded Vercel cooldown is still the release constraint; this batch requests no deployment and claims no fresh browser acceptance.

After the controlled preview is available and its exact source is confirmed:

1. Play the journey through several chapters. Confirm each reading interval begins after arrival and the final invitation finishes its transition before pausing.
2. Press Next repeatedly before a transition finishes, then press Previous. Confirm every click changes the requested destination in the intended direction.
3. Use keyboard and assistive activation on Previous, Next, and Return to beginning. Confirm instant travel and persistent visible control focus. Open the chapter list and check native anchor behavior, modifier shortcuts, and Escape return.
4. Interrupt an active transition with the wheel, touch, text selection, or focus outside the controls. Confirm it stops at the current position and leaves reading under the visitor's control.
5. Open a project file or site menu during a tour, switch tabs, or resize to the compact profile. Confirm movement stops and requires a fresh Play action to resume.
6. Resize during a transition, enlarge text, and repeat on Safari. Confirm correct arrival at the document end and no delayed retry or scroll jump when a destination changes layout.

Saved preview source only. Production and deployment controls remain unchanged.
