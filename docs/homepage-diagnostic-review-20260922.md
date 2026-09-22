# Homepage diagnostic review: 22 September 2026

## Visitor changes

The three question steps are now buttons. A visitor can revisit an answered question or resume the first unanswered question. Later questions stay disabled until the earlier answers exist. The current step has an explicit `aria-current` state, and answered steps receive a short ink animation. Mobile presents the controls in a full width row with targets at least 48px tall.

The result's existing answer buttons still reopen the exact question. Once all three answers exist, the primary action returns directly to the recalculated result from any question. Other answers survive the edit. The completed progress label remains 03 / 03 even when the result was recalculated from the first question. Reviewing clears the carried Services recommendation; completion publishes the revised recommendation through the existing mechanism.

Question changes preserve focus on the reading target and leave a visible question in place. An offscreen target is revealed immediately, without CSS smooth scrolling or rewinding the entire chapter. The homepage uses native scrolling under the current SmoothScrollProvider.

Reading no longer waits behind a blur or staggered opacity reveal. Pointer transitions retain a small directional movement and existing selection cues. Keyboard reading and the shared reduced motion control settle the panel, cancel queued pointer movement, pause the local ambient animation, and suppress local hover movement.

## Executed checks

- Diagnostic state gate: first question access, prevention of skipped questions, forward and backward navigation, preserved answers, direct review, revised results from question one, mixed results, and reset passed.
- TypeScript and ESLint passed for the changed source and scripts.
- The production build passed, compiling and generating all 106 routes. The Next build binary was used directly because this environment's pnpm wrapper attempted to reinstall the shared dependency directory before running the build.
- Sixteen React server render checks passed across initial, partial, resumed, edited, and all four result states with full and reduced motion preferences. Verified unique IDs, control targets, available question buttons, one active panel, primary action labels, completion count, and the existing result-specific contact URLs. Hooks were seeded for each state; this does not simulate browser interaction.
- The broad legacy homepage runtime gate stops on the existing HomeV4Scenes readable-plane assertion before reaching the diagnostic checks. HomeV4Scenes is unchanged in this batch. The obsolete diagnostic whole-section scrolling assertion was updated to the new reading-target contract.
- A local production server started successfully. Browser access to its loopback URL returned `net::ERR_BLOCKED_BY_CLIENT`, so visual and interactive acceptance remain pending.

## Next preview acceptance

Use the controlled august preview only after the current Vercel cooldown permits a normal release. Confirm its exact source before testing.

1. At 1440 x 790 and 1024 x 768, verify question steps, heading, choices, and primary action fit without overlap.
2. At 320px and 390px widths, verify all three question buttons remain readable, fit the viewport, and retain their tap targets. Repeat at increased text size.
3. Answer two questions, revisit question one through the step controls, change it, and resume question three. Other answers must remain selected.
4. Finish all questions, reopen question one through its result chip, edit it, and select See my result. Confirm the result changes immediately and the counter says 03 / 03.
5. Use Tab, Shift Tab, radio arrow keys, Enter, and Space. Confirm focus stays on the intended question, offscreen controls are revealed, and visible reading is never unnecessarily scrolled to the section opening.
6. Switch to reduced motion during a question change or pointer movement. Confirm the panel settles, queued pointer motion is canceled, and answers remain intact. Repeat reverse navigation and rapid selections.
7. Confirm each result still leads to its matching Contact enquiry and that reviewing removes a stale Services recommendation until completion.

This batch is source work for the pending preview. It does not request a Vercel deployment or change production.
