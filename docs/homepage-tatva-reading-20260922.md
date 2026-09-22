# Homepage five elements reading: 22 September 2026

## Changes

The five elements chapter now has a next decision button inside its persistent reading card. Visitors can step through Position, Journey, Identity, Voice, and Recall, then return to Position. The original five choice buttons, pointer previews, keyboard selection, approved copy, and imagery remain available. Each deliberate selection has a concise polite announcement; hover and scroll updates stay silent. Hidden, inert labels reserve the next button's text space across all five choices, and the button has a minimum 44px target.

The desktop scroll sequence is admitted only after hydration, a wide and tall fine-pointer viewport, and a measured reading frame that fits inside the viewport with its padding. Measurement excludes the absolute film's overscan and observes the content, choices, and reading card. Enlarged content and compact screens retain document flow. Once admitted, the scroll sequence keeps its height when motion is paused or keyboard reading begins. Resizing beyond its supported geometry releases the hold. The film's camera value is preserved while paused or offscreen.

Keyboard reading settles the portraits, connectors, selected marker, shared heading effects, and reading paragraphs, and replaces the background film with its existing poster. This reading state persists until pointer interaction. Focus remains on the existing buttons and reading region; only decorative motion nodes are replaced to cancel their animations. The next button is included in the shared controller's focus protection. Arrow keys, Home, and End retain selection behavior while browser modifiers, composition events, and previously handled events remain available.

Full motion retains finite directional paragraph transitions, portrait and halo responses, connector movement, and the scroll camera. Fresh choices animate for 460ms with a 45ms paragraph stagger. Pause, offscreen transitions, and focus settle the reading immediately without replaying an old choice on return. Focused content uses an 80px viewport clearance with nearest scrolling for small targets and start alignment for taller reading regions.

The neighboring pressure lab styles and shared scroll controller are unchanged.

## Verification

- TypeScript, changed source ESLint, and `git diff --check` passed.
- The final production build passed and generated all 106 routes. Homepage output is 71.1kB with 313kB first load JavaScript.
- A focused temporary harness exercised the actual component callbacks and shared scroll selection hook with simulated geometry, animation, and event timing. It passed 11 layout transitions, all five sequential choices, four navigation keys, six shortcut guards, hover return, forward and reverse scrolling, manual ownership, pause preservation, camera preservation, offscreen reading, focus timing, and cleanup.
- Twenty actual React and Framer server renders passed across all five selected choices and full, keyboard, reduced, and offscreen modes. Checks covered one pressed choice, six button control targets, two inert measuring groups, unique IDs, the persistent named reading region, and film or poster rendering.
- A PostCSS comparison verified that every neighboring pressure lab rule in the shared stylesheet is unchanged.

## Pending preview acceptance

The established browser session cannot open the local preview (`net::ERR_BLOCKED_BY_CLIENT`), and the existing Vercel cooldown is still in effect. No fresh rendered viewport, real device, or Safari acceptance is claimed here. Earlier screenshot measurements describe their own releases.

After the controlled preview can be published and its exact source confirmed, check:

1. At 1440 x 790 and taller desktop sizes, traverse all five choices in both scroll directions. Use pointer previews and the next button, then resume scrolling and confirm selection ownership changes as expected.
2. Pause during the scroll sequence and during a fresh paragraph transition. Confirm the selected decision, section height, and camera crop remain stable. Resume and verify the previous paragraph entrance stays consumed.
3. Tab through the five choices, reading region, and next button. Confirm stationary text and decoration, visible focus, and readable content above the fixed page controls. Test Home, End, arrows, and browser modifier combinations.
4. At 1024 x 768, 390px, and 320px widths, cycle all decisions and inspect wrapping and card height. Repeat with enlarged text and confirm content overflow releases the desktop hold when required.
5. Leave and re-enter the chapter, resize across the desktop breakpoint, and repeat with the device reduced motion preference enabled before loading.
6. Confirm the following pressure lab retains its existing controls, diagram states, and spacing.

This is preview source work. It requests no deployment, changes no deployment flags, and leaves production untouched.
