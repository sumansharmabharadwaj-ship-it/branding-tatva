# Homepage message comparison: 22 September 2026

## Changes

The hidden cost chapter now holds its reading state across keyboard focus, reduced motion, and leaving the viewport. An interrupted card entrance is consumed, so leaving focus or resuming motion cannot replay it. Forward and reverse message transitions, the connected channel diagram, count reel, selected mode marker, and native scroll rules remain available during full motion.

Keyboard reading settles the whole chapter: messages, counts, connectors, selected marker, introductory heading, gradient movement, and the new link arrow. Moving focus away preserves this state until pointer interaction resumes motion. Pausing or returning to the chapter preserves the selected comparison and does not replay a stale text transition. Motion waits for hydration and a visible chapter.

The finite automatic demonstration still waits 4.8 seconds with at least 65% of the comparison visible. Touch and pen contact cancel the pending interval; pointer release or cancellation starts a complete fresh interval. A confirmed click, manual choice, keyboard reading, or selection intersecting the section takes ownership and ends automatic progression. Text selections that begin outside the chapter are also protected when their range crosses its content. Timer, observer, and selection listener cleanup guard against stale callbacks after disposal.

Each channel's short buyer association now reserves space for both variants, extending the existing stable measurements for the larger messages and closing sentence. Hidden measuring copies remain inert and excluded from assistive reading. The original approved brand consultancy copy is unchanged.

A native link, “See what inconsistency costs,” leads to the focusable `#cost-stack` section. The link has a minimum 44px target, the existing clay focus treatment, and a short arrow response for pointer hover. Mobile places it below the chapter rule. Browser link modifiers and native fragment navigation remain available.

## Verification

- TypeScript, changed source ESLint, and `git diff --check` passed.
- The final production build passed and generated all 106 routes. Homepage output is 70.6kB with 312kB first load JavaScript.
- A focused temporary harness exercised the actual component callbacks and effects with virtual timers and mocked intersection/focus geometry. It passed automatic progression, visibility changes, mouse choices, forward/reverse transitions, same mode selection, pause/resume, offscreen return, touch and pen delay reset, keyboard reading persistence, three selection cases, focus clearance, and cleanup. Touch tests include the reading region's bubbling pointer handler as well as the section capture handler.
- Sixteen actual React and Framer server renders passed across both comparison modes, active or settled text, and full, keyboard, reduced, and offscreen preferences. Checks covered unique IDs, one pressed control, both control targets, the native next destination, and seven hidden/inert measurement groups.
- A byte comparison verified that the shared source file's opening and recognition components are unchanged.
- The next destination is present and explicitly focusable. The new anchor has no custom navigation handler.

## Pending preview acceptance

The established browser session cannot open the local preview (`net::ERR_BLOCKED_BY_CLIENT`), and the existing Vercel cooldown is still in effect. No fresh rendered viewport, real device, or Safari acceptance is claimed here. Earlier screenshot measurements describe their own releases.

After the controlled preview can be published and its exact source confirmed, check:

1. At 1440 x 790, 1024 x 768, 390px, and 320px widths, switch both modes repeatedly. Compare card, association, and closing sentence heights; confirm readable content and the next link's clearance. Repeat with enlarged text.
2. Start reading with Tab during the entrance and during a mode transition. Confirm stationary text, controls, decoration, and focus; leave the reading and confirm the entrance stays consumed.
3. Use touch scrolling through the example without tapping. Confirm the demonstration waits a fresh interval after the gesture. Tap either mode and verify automatic progression stays disabled.
4. Select text within the chapter and across its boundary. Confirm the current message survives without automatic replacement.
5. Pause and resume during forward and reverse transitions, then scroll away and return. Confirm the selected mode and reading remain intact.
6. Follow the next link with pointer and keyboard, including reverse navigation. Confirm focus lands on the cost chapter and browser modifier behavior is preserved.

This is preview source work. It requests no deployment, changes no deployment flags, and leaves production untouched.
