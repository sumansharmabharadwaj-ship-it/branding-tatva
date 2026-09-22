# Homepage header reading: 22 September 2026

## Changes

The homepage header now has one owner for its hide and reveal movement. The shared Header keeps its compact brand mark and surface feedback, while the homepage director owns the pill's complete vertical travel. This removes the overlapping Framer transform and CSS translate that previously used different reveal thresholds.

The director coalesces scroll events into one animation frame and writes its visibility attribute only when the value changes. The established 8px downward threshold and 56px upward travel remain. Document positions are clamped to the scrollable range so bottom overscroll and its rebound cannot become a false upward gesture.

Keyboard focus, an open menu, and mouse hover keep navigation visible while it is being used. Focus and an expanded menu reveal the pill immediately. Leaving focus, closing a menu, or moving the pointer away preserves the visible header until fresh downward travel. Touch entry creates no persistent hover state.

Text selection, native dialogs, and keyboard reading in the homepage retain the header's current position. Focus adjustments, resizing, measured chapter layout changes, and returning from a hidden tab establish a fresh direction baseline. Page restoration uses the restored position directly. Hidden tabs cancel queued header frames. Observer callbacks and frames arriving after disposal cannot restore annotations or listeners.

Header motion styles now target the site header explicitly, leaving semantic headers inside chapters outside this transition rule. Both the page motion preference and the operating-system preference settle its transition. Page content, links, menus, and the About first section are unchanged.

## Verification

- TypeScript, ESLint for both changed TSX files, and `git diff --check` passed.
- The production build passed and generated all 106 routes. Homepage output is 72.8kB with 314kB first load JavaScript.
- A temporary harness executed the actual homepage director and shared ownership helper with simulated scroll, focus, pointer, selection, dialog, observer, and frame events. All 13 scenario groups passed.
- Coverage included direction thresholds, gradual reverse travel, direction reversal, coalescing and duplicate-write avoidance, immediate focus reveal, focus departure, menu ownership, mouse versus touch input, reading holds, resize and layout rebasing, hidden-tab cancellation, page restoration, overscroll, and full cleanup with late callbacks.
- The shared Header's actual scroll effect was executed for About, Services, Insights, and Contact under full and reduced motion. All eight route/preference comparisons matched the previous source. Homepage runs confirmed that the shared Header remains in its visible transform state while preserving brand-scroll feedback.
- PostCSS source checks confirmed site-header scoping and settled transition declarations for focus, expanded menus, page motion preference, and device reduced motion. These checks do not substitute for a browser cascade or visual check.

The harness rejects native document scroll calls from the homepage director. Physical touch, browser focus styling, transition appearance, and Safari acceptance remain preview checks.

## Pending preview acceptance

The established local browser route remains blocked by `net::ERR_BLOCKED_BY_CLIENT`, and the recorded Vercel cooldown remains the release constraint. This batch requests no deployment and claims no fresh browser acceptance.

After the controlled preview is available and its exact source is confirmed:

1. Scroll down, then reverse slowly and quickly. Confirm the pill follows one vertical transition, stays away during small reading corrections, and returns after deliberate upward travel.
2. Tab into navigation while the header is hidden. Confirm the focused link appears immediately. Move focus back into the reading and confirm the pill stays visible until fresh downward scrolling.
3. Hover a header link while scrolling with the wheel, and open and close the compact menu. Confirm the target stays available during interaction. Repeat on touch without a lingering hover state.
4. Select text or open a project file while changing scroll direction. Confirm the header preserves its position during reading and uses a fresh baseline on return.
5. Resize, enlarge text, switch tabs, restore browser history, and overscroll at the document end. Confirm these position changes do not become false reveal gestures.
6. Use Pause motion and the device preference. Repeat homepage checks on Safari and confirm About, Services, Insights, and Contact retain their established navigation behavior.

Saved preview source only. Production and deployment controls remain unchanged.
