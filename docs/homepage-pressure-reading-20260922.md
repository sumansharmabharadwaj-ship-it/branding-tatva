# Homepage pressure diagram reading: 22 September 2026

## Changes

The brand connections exercise now includes a sequential control within the reading card. Visitors can test Foundation, Flow, Distinction, Voice, and Recognition, then restore the complete system. The diagram nodes and desktop choices still allow direct selection and toggling. All controls update the same missing connection, count, meter, heading, and reading. The sequential button reserves the space needed for every label and has a minimum 44px target.

Each newly changed connection has a finite 650ms signal cue. Removing a connection sends the signal from the shared centre toward the missing function; restoring it brings the signal back to the centre. Switching between missing functions restores the previous connection while withdrawing the next. The existing completion ring still appears once when the whole system is restored. Entry into the viewport, pause, or resume cannot replay an old cue.

Motion now waits for hydration and a visible section. Keyboard or assistive activation settles the reading even when a focus event has not preceded the click. Arrow navigation retains its direct selection behavior in both control groups and leaves modified, composing, and previously handled events alone. Small offscreen focus targets use nearest scrolling with an 80px clearance; taller reading targets use start alignment.

The shared heading effects, reading rule, connector and meter transitions, centre, and new control respond to the same settled state. Offscreen or paused reading consumes existing paragraph and connection transitions. Pointer choices through the sequential control can animate the reading while preserving the focused button. Keyboard focus arriving before the paragraph effect prevents that entrance. The audit keeps its existing destination and disables speculative prefetching.

The preceding five elements chapter, approved explanatory copy, warm palette, original diagram coordinates, and fixed control positions are unchanged.

## Verification

- TypeScript, changed source ESLint, and `git diff --check` passed.
- The final production build passed and generated all 106 routes. Homepage output is 71.4kB with 313kB first load JavaScript.
- A focused temporary harness exercised the actual component callbacks with mocked hook scheduling, geometry, and animation controls. It passed all five direct choice and restore paths, all six sequential steps, eight arrow/Home/End handlers, 12 modifier/composition guards across the two groups, native Tab behavior, nearest/start focus clearance, pause/resume, viewport exit/reentry, assistive activation, and focus arriving before an animation effect.
- Each of the five actual connection components passed independent withdrawal, return, rapid reversal, interruption, paused selection, resume without replay, and cleanup checks. The expected start and end coordinates and 650ms duration were verified.
- Thirty actual React and Framer server renders passed: six connection states across full, reduced, keyboard, offscreen, and unhydrated modes. Checks covered matching pressed controls, restore availability, 13 valid reading control references, three inert measuring groups, five connection lines, signal availability, unique IDs, the original polygon, and the audit destination.

These checks validate source behavior and markup. They do not certify rendered fit, physical touch behavior, Safari animation playback, or native focus traversal.

## Pending preview acceptance

The established browser session cannot open the local preview (`net::ERR_BLOCKED_BY_CLIENT`), and the existing Vercel cooldown remains in effect. No fresh browser acceptance is claimed.

After the controlled preview can be published and its exact source confirmed:

1. At desktop, 1024px, 768px, 390px, and 320px widths, use each node and the sequential control. Confirm the selected function, disappearing connector, count, meter, heading, and consequence agree. Check enlarged text and the new button's wrapping.
2. Switch quickly between functions, then restore using the centre, lower restore button, or final sequential step. Confirm signals move in the correct directions, stale signals disappear, and completion occurs once.
3. Pause during a signal or text transition; resume, scroll away and return, and reverse scroll. Confirm the selected state survives and old transitions stay consumed.
4. Use Tab, Shift Tab, arrows, Home, End, Enter, and Space. Confirm stationary keyboard reading, stable control focus, visible outlines, and clearance around fixed page controls. Check browser modifier combinations.
5. Follow the audit link and confirm its existing service destination. Inspect the preceding five elements chapter for unchanged behavior.

This batch saves preview source and requests no deployment. Production and deployment controls are unchanged.
