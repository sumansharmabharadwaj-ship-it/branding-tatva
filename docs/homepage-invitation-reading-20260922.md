# Homepage closing invitation

## Change

The three conversation choices now reveal preparation questions that match the visitor's carried brand situation: beginning, repositioning or ongoing stewardship. A general set remains available when no situation is selected. Each row reserves space for its original description and all four question variants, keeping the disclosure stable as it opens or its context changes. Context changes clear a stale announcement; explicit choices still announce the selected question.

A direct "Write to Suman" link joins the booking action. Both routes carry the existing package mapping and land on the appropriate Contact section, `#write` or `#call`. The proof link retains its existing situation mapping. Actions remain outside the animated introduction and wrap onto separate lines when needed.

The desktop sticky layout now has separate admission and playback state. It starts only after hydration, a full motion preference and a successful content-fit measurement. Pausing motion keeps an existing layout in place. Initial reduced motion, compact viewports and overflowing content use document flow. Frame and child observations include longer personalised copy and the new action.

Keyboard focus or input settles the heading, ink, film camera, progress rules, gradient and choice reading. The existing film poster replaces the video while reading is still. Pointer input restores the motion profile; a fresh scroll gesture is still required before scroll progress replaces an explicit choice. Offscreen choice transitions and gradient animation pause. Returning onscreen or resuming motion does not replay an earlier disclosure transition.

## Verification

- TypeScript, changed-component ESLint and whitespace checks passed.
- Production build passed and generated 106 routes.
- The focused component callback harness passed 12 layout transitions, including initial reduced motion, an established hold through pause, overflow release, compact release and resumption.
- All 12 contextual questions opened and closed correctly. Eight booking/writing destinations and four proof destinations matched the existing service mapping.
- Keyboard focus retained the selected reading during wheel and scroll input. Pointer resumption preserved it until fresh scroll intent. Text selection retained the active reading. Offscreen highlights and disclosures settled.
- Reading controls stopped an active transition on pause. Resuming and changing question context settled without replaying the prior animation.
- Forty-eight actual React server renders covered four situations, full motion, keyboard reading, reduced motion and all four disclosure states. Each retained three native disclosure buttons, three unique question regions, inert measuring copies and the correct writing link. Only full motion rendered the mocked film component.
- The existing invitation scroll gate passed forward/reverse boundaries, jitter, large jumps and invalid input.
- A CSS parser check confirmed that all three sticky geometry rules are independent of motion preference selectors and media queries. Listener, observer and pending-frame cleanup passed.

The component harness uses mocked DOM geometry and media providers. Server renders check actual component markup with React and Framer Motion. These checks do not certify browser focus painting, physical touch, video playback or layout fit.

## Pending acceptance

Browser acceptance remains pending after the recorded local `net::ERR_BLOCKED_BY_CLIENT` failure. No deployment was requested during the Vercel cooldown.

On a preview containing this update, check desktop, short laptop, 390px and 320px widths. Carry each situation from the homepage, open and close all questions, and follow both contact actions. Confirm agenda heights remain steady, all actions wrap within the frame, and taller content releases the hold. Check forward/reverse scrolling, selection, Tab, Enter, pointer resumption, and both motion preferences. Compare the invitation and following footer positions before and after pausing. Repeat in mobile Safari.

Saved preview source only. Publication and visual acceptance remain pending.
