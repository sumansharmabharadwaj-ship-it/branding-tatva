# Homepage diagnostic flow: 22 September 2026

## Visitor changes

The question and its choices now occupy normal document flow at every width. Desktop keeps its landscape composition, with spare vertical space between the prompt and choices when available. The section and shell can grow for a longer question, result, or enlarged text. The compact laptop heading scale and mobile reading order remain. Desktop retains 80px bottom clearance; the next action has a 48px minimum height and the back/review controls have 44px minimum heights.

A new answer gives its implication a finite 4px, 360ms entrance. All ten possible implication sentences share a hidden, inert measurement area, and the cue label occupies its own row. This reserves the text footprint while the visitor compares answers. Hover previews leave the committed answer and its explanation intact. The existing selected underline, trail ink, directional question transition, and landscape remain. Choice hit areas stay stationary; the next button's perpetual movement is replaced with a short pointer hover response on its arrow.

Motion starts only after hydration while the diagnostic is in view. Keyboard reading, assistive clicks, reduced motion, and leaving the chapter settle the panel and implication. They also cancel pending pointer movement and pause the ambient plate/petals. The local static state now settles the scroll driven landscape entry, shared title transforms, and action movement. Returning or resuming does not replay a previous answer or question transition.

Pointer movement measures the current section once per animation frame, after any intervening scroll or content resize. Coalesced mouse positions use the latest bounds and clamp movement to the original small camera range. Touch input continues to leave the camera alone.

Radio choices support all four arrow keys plus Home and End, with focus revealed only when obscured. Modified shortcuts, composition, and already handled events pass through. Tab and Shift Tab use native browser navigation with one radio tab stop. The existing answer review, scoring, recommendation expiry, result links, and contact package mapping remain; both result links explicitly disable prefetch.

## Executed verification

- TypeScript and changed component ESLint passed.
- Existing diagnostic reducer and personalization state gates passed, covering answer preservation, direct review, revised results, mixed results, expiry, corruption, and blocked storage behavior.
- A focused temporary harness exercised the actual diagnostic component callbacks and effects with mocked geometry: six radio navigation keys, six shortcut guards, both native Tab directions, answer revision through completion, matching contact handoffs, coalesced pointer movement with changed bounds, bounded movement, keyboard focus clearance, pause/resume, offscreen return, touch/cancel handling, and cleanup all passed.
- 220 actual React and Framer server renders passed: the initial state and every one of the 27 complete answer combinations, plus review of each combination, across full, keyboard, reduced, and offscreen modes. Checks included one active panel, unique IDs, radio state, hidden measurement content, completion progress, three answer review controls, and result contact URLs.
- CSS source checks confirmed natural question/choice flow, inherited shell minimum height, the next control's minimum target, and removal of the perpetual invitation animation. These checks are not rendered geometry measurements.
- The production build passed and generated all 106 routes. Homepage output is 70.4kB with 312kB first load JavaScript.
- `git diff --check` passed.

## Preview acceptance still required

The established browser session cannot reach the local preview (`net::ERR_BLOCKED_BY_CLIENT`). This batch has no new visual, real keyboard, Safari, or physical phone certification. Historical viewport measurements in the earlier diagnostic reading document describe that earlier release, not this source.

After the existing Vercel cooldown permits the controlled preview release, confirm its exact source before testing:

1. Check all three questions and all four results at 1440 x 790, 1024 x 768, 840 x 600, 390px, and 320px widths. Repeat with enlarged text. Confirm readable content, no overlap or horizontal overflow, and fixed control clearance.
2. Change a selected answer repeatedly. Confirm the implication moves once, the next action keeps its position, and hover leaves the actual answer unchanged.
3. Complete the diagnostic, reopen question one, change it, and return directly to the revised result. Confirm the other answers survive and the matching Contact enquiry is retained.
4. Exercise arrow keys, Home, End, Tab, Shift Tab, Enter, Space, and modified browser shortcuts. Confirm the reading target stays visible and existing visible content is not unnecessarily scrolled.
5. Pause during an implication transition or queued pointer movement. Repeat keyboard reading, pointer resume, leaving the chapter, and returning. Confirm static reading and no replay of a stale transition.

This change is saved as preview source. It makes no Vercel deployment request, changes no deployment flags, and does not modify production.
