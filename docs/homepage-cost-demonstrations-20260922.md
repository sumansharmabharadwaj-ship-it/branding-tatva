# Homepage cost demonstrations

## Change

Each of the three examples now identifies its Before or After state. The action changes to an explicit reverse instruction after activation: show the separate messages, repeated decisions, or changing cues. The same native button remains mounted. It is an action button rather than an aria-pressed toggle because its label names the next action. The existing polite caption describes the resulting state.

Both action labels reserve their combined maximum height through inert measurement copies, matching the existing caption treatment. The Before and After badge reserves a common width and can wrap with the example label on narrow cards.

In the messages example, three warm strokes draw in sequence as the channels converge on one promise. Reversing the example removes those strokes and restores the separate destinations. Existing decision and memory animations remain available. Keyboard focus and key presses now settle an animation immediately, including a transition already started by a pointer. Site pause, reduced motion and leaving the viewport settle the decorative subtree. Buttons and captions remain mounted. Reentry and resume render the current state without replaying an entrance.

The cost stack now checks each card's actual height plus its staggered top offset against the viewport, reserving 80 pixels below. A wide screen with enlarged text or a taller card uses ordinary document flow. Resize observers and viewport changes recheck that fit. Motion preferences do not control list positioning or gaps, so pause and resume retain the same layout. Native CSS sticky remains the only positioning mechanism.

## Verification

- TypeScript, changed-component ESLint and whitespace checks passed.
- Production build passed and generated 106 routes.
- A focused callback harness passed 42 checks across repeated pointer actions, keyboard activation, focus settling, pause/resume and leaving/reentering the viewport. It checked persistent button keys and caption IDs and both inert measurement groups.
- Nine fit checks passed with mocked geometry, covering normal height, site pause, overflowing content, shorter viewports, recovery and enlarged text. Observer/listener/frame cleanup passed.
- Twenty-four actual React/Framer Motion server renders passed: three diagram kinds, both choices and full motion, keyboard, reduced motion and offscreen states. Verified one button, one live caption, matching aria-controls, unique IDs and measurement semantics.
- Parsed CSS checks found no position, height, top or gap changes under motion preference rules.

The callback harness uses mocked geometry and observers. Server rendering verifies markup. These checks do not certify browser layout, physical touch, screen reader announcements or animation timing.

## Pending preview acceptance

The local browser's previously recorded `net::ERR_BLOCKED_BY_CLIENT` restriction remains unresolved. No deployment was requested during the Vercel cooldown. On a controlled preview containing this source:

1. At 320px, 390px, 768px and desktop widths, compare each Before and After state. Check label wrapping, button height, diagram text and the foundation link.
2. Enlarge text on a wide viewport until a card would exceed the available height. Confirm all cards return to flow and every action remains reachable. Restore the size and check the native stack returns.
3. Scroll forward and backward through the stack, then pause/resume. Confirm document geometry and choices remain stable.
4. Start the message connection animation, then Tab into its action. Confirm the drawing settles and the focus ring remains visible. Repeat using Shift Tab across overlapping cards.
5. Activate each action with Enter, Space and touch. Confirm its description and reverse action agree. Check the polite caption with a screen reader.
6. Leave and reenter a resolved example. Confirm it retains the selected state without replaying the drawing.

Saved preview source only. Publication and visual acceptance remain pending.
