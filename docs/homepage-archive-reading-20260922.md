# Homepage archive reading: 22 September 2026

## Changes

The project archive now holds its selected record while a project file is loading or open, and while keyboard reading is active. The shared scroll controller receives the same reading state as the media and text. Closing a file preserves its selected record until fresh scroll intent takes over. A cancelled or failed download releases the loading state without opening an obsolete file.

Next and Back now retain their intended transition direction when wrapping between the first and last projects. Direct tab choices and scroll selection keep their natural index direction. Hover previews return to the deliberate selection, and the status region clears when that announced record is no longer displayed. Scroll and hover do not announce project changes.

Keyboard and assistive activation settle the reading immediately, including activation without a prior focus event. Arrow navigation, Home, and End keep their existing behavior; modified, composing, and previously handled events are left alone. Horizontal thumbnail scrolling is instant for keyboard choices and smooth for pointer choices. Small offscreen focus targets use nearest alignment with an 80px clearance, while taller readings use start alignment. Focus inside the native project dialog remains under the dialog's own scrolling behavior.

Text, image wipes, background light, shared heading effects, and project films now wait for hydration, visibility, and an active archive. Settled states show the existing background poster and project image. A fresh pointer or scroll selection retains the directional image wipe, reading sequence, and decision traces. Returning from a file, re-entering the viewport, or resuming motion does not replay an old reading transition. Case and archive destinations retain their URLs and disable speculative prefetching.

The desktop frame measures both its box and overflowing content, observing the header, thumbnail strip, and reading stage. Its padding reserves 5.4rem above and 5rem below for fixed page controls. The scroll hold remains available when the complete reading fits; larger content uses document flow. Pausing preserves an already admitted hold while its viewport and content remain eligible.

The shared scroll controller, project data, expanded file component, and original case copy are unchanged.

## Verification

- TypeScript, component ESLint, and `git diff --check` passed.
- The final production build passed and generated all 106 routes. Homepage output is 71.8kB with 313kB first load JavaScript.
- A focused temporary harness executed the actual archive callbacks and shared scroll controller with simulated geometry, focus, animation, and event timing. It passed 11 layout transitions, all five direct choices, both wrap directions, four keyboard navigation handlers, six shortcut guards, hover return, forward and reverse scrolling, persistent keyboard selection, focus clearance, offscreen interruption, and cleanup.
- Controlled asynchronous module loading passed failure and retry, cancellation, loading selection preservation, file navigation, return to the same archive record, fresh scroll takeover, and resolution after disposal. The loading tests use the actual import and request-token path with a deferred module response.
- Thirty-five actual React and Framer server renders passed across all five projects and full, keyboard, reduced, offscreen, loading, open-file, and unhydrated modes. Checks covered the selected tab, labelled panel, six inert measuring groups, unique IDs, correct case URLs, and foreground video presence only in full motion.

These checks establish source behavior and markup. Physical touch, browser layout, native focus traversal, image playback, and Safari rendering remain preview acceptance items.

## Pending preview acceptance

The established browser session cannot open the local preview (`net::ERR_BLOCKED_BY_CLIENT`), and the existing Vercel cooldown remains in effect. No fresh browser acceptance is claimed.

After the controlled preview can be published and its exact source confirmed:

1. At 1440px and taller desktop sizes, inspect clearance around the fixed header and page controls. Resize to a shorter window and enlarge text; confirm an overflowing frame uses document flow without clipping.
2. Use Next from the last project and Back from the first. Confirm the image wipe and reading sequence follow the control direction. Switch rapidly between tabs and reverse scroll.
3. At 390px and 320px widths, browse with the pager and thumbnail strip. Confirm only the strip moves horizontally, with readable labels and stable action positions.
4. Open a file while the module loads slowly. Scroll, cancel, retry, navigate within the file, and close it. Confirm the requested project remains selected and returning retains the correct record until a fresh page scroll gesture.
5. Use keyboard and assistive activation through tabs, pager, and case actions. Confirm settled text and imagery, visible focus, native shortcut behavior, and announcements that match the displayed record.
6. Pause mid-transition, resume, and scroll away and back. Confirm the prior reading entrance stays consumed. Repeat on Safari.

This batch saves preview source and requests no deployment. Production and deployment controls are unchanged.
