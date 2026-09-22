# Homepage process reading and reversible trail

## Changes

The six-stage process keeps one selection across tabs, trail controls, reading, outputs and media. The trail draws newly selected connections in sequence and unwinds them from the far end when moving backward. Connection movement takes 460 ms with a capped 60 ms stagger. The handoff explanation moves 4 px over 380 ms within its existing measured reading space. Its live text node remains mounted, and pausing or leaving the viewport settles it without replaying an earlier choice on resume.

The next-stage button reserves room for every label, including Revisit. Its accessible name now names the destination stage. Previous remains focusable with `aria-disabled` at the first stage. Both trail controls center themselves only when keyboard focus would fall beneath the header or lower controls. The handoff status announces explicit trail choices and clears when another route changes the stage, preventing an old announcement from returning on later scroll reentry.

Keyboard entry anywhere in the process now settles the local scene. The active film and any outgoing media crossfade are replaced with the selected stage's existing poster. The camera stops following scroll, the shared visualizer preserves the chosen stage, and copy, trail and selection movement settle. Pointer interaction resumes motion; a fresh scroll gesture releases the preserved choice. Scene exit also settles the finite copy and trail animations.

The booking action now goes directly to `/contact#call`, with prefetch disabled. The six approved film sources, reading copy, decision questions and deliverables remain in place.

## Stable pause geometry

The measured desktop hold waits for motion preference hydration and is separate from playback. An initial reduced-motion visit, a compact viewport or an overflowing frame uses normal document flow. Pausing a hold already in use retains its scroll space. Both the operating-system media condition and the HTML preference override that previously collapsed this geometry have been removed from the hold's CSS rules.

The fit guard measures the natural frame and its overflow, including the footer, and observes its reading regions. The media camera's overscan remains clipped inside the media card. A viewport or text-size change that makes the frame too tall releases the hold. No new spacer, scroll interception or motion dependency was added.

## Verification

- TypeScript, changed-file ESLint and the final production build passed. The build generated 106 routes; the homepage is 70.1 kB with 312 kB first load JavaScript.
- Focused checks exercise the real shared visualizer with mocked browser geometry: eleven layout transitions, six direct stage choices, six trail advances including revisit, four tab keys, focus clearance, pause and resume, offscreen settling, and cleanup.
- Forward and reverse jumps check the connector delay order; still mode clears both duration and delay. The handoff settles an interrupted animation and resumes only for a fresh choice.
- Twenty-four actual React/Framer Motion server renders cover all six stages in full motion, keyboard reading, reduced motion and offscreen states. Checks include the selected tab, panel label, unique IDs, film or poster choice, booking anchor, consultation duration, measured labels and rendered copy restrictions.
- The two held-layout CSS rules are independent of both motion preference mechanisms.
- Browser acceptance remains pending. The approved browser rejected the local preview with `net::ERR_BLOCKED_BY_CLIENT` during earlier verification. Mocked geometry and server markup do not certify native focus timing, visual wrapping, media playback or Safari behavior.

## Controlled preview acceptance

After `/api/release` identifies the saved source, check 320px, 390px, 768px and 1440px widths, a short desktop viewport and increased text size. Advance and reverse through all six stages. Confirm stable next-button size, agreement between tabs and reading, readable handoff text and reachable booking controls.

Pause during a media crossfade and connector stagger. Confirm the selected poster appears immediately, reading settles and an admitted desktop hold keeps its space. Repeat with keyboard focus on a tab, the reading panel, both trail controls and the booking link. Resume with the pointer and confirm the choice stays until a fresh scroll gesture. Use the operating-system reduced-motion setting both before loading and after entering the chapter.

Preview deployment and publication remain pending during the existing Vercel cooldown. This batch requests no deployment.
