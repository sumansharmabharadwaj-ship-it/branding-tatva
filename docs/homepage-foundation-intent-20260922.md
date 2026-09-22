# Foundation reading and sequential exploration

## Visitor changes

The homepage foundation now has a native button that advances through Category, Audience, Belief, and Position, then offers a return to Category. Its label reserves the space required by every state. The existing scope link stays alongside it on wider screens and stacks below it on small phones. Both actions remain available when motion is reduced.

The button and desktop diagram announce an explicit choice through a polite status region. The existing tabs retain their selected state, roving tab stop, Left/Right and Home/End behavior. Changing the decision leaves focus on the control used. The scope action remains `/services#package-brand-beginning` and avoids speculative prefetching.

Keyboard reading now settles the entire local scene: the camera stops updating, the video is replaced by its existing poster, and scroll no longer changes the selected layer. Pointer interaction can resume motion while preserving the selection until a fresh scroll gesture. The same shared visualizer still owns the active layer, so tabs, diagrams and explanations agree.

The map caption keeps its text node mounted. Only a fresh layer choice starts its short movement. Pausing or leaving the viewport stops and settles that movement; reentry and resuming do not replay an earlier choice. The connector and selection animations also settle outside the viewport.

## Layout and media

The desktop hold waits for motion preferences to hydrate. A visit beginning with reduced motion stays in document flow. A hold already in use retains its space during keyboard reading or a motion pause. A smaller viewport or overflowing reading content releases it.

The fit guard observes the scene, reading shell and control regions. It measures the natural scene height and shell overflow, excluding the decorative camera's deliberate overscan. Measuring the entire scene's `scrollHeight` would incorrectly treat transformed background media as reading overflow.

The poster uses the same source and object position as the video. No media assets, dependencies, shared motion directors, deployment settings, or other pages were changed.

## Verification

- TypeScript, ESLint and the production build passed. The build generated 106 routes; the homepage is 69.7 kB with 311 kB first load JavaScript. The standalone type check ran after the build regenerated its route types.
- Focused callback and hook checks passed for eleven layout transitions, the four sequential choices, all four tab navigation keys, explicit announcements, keyboard pause, pointer resume, scroll intent, offscreen settling and listener cleanup.
- The tests exercise the real `useScrollDrivenVisualizer` with mocked browser geometry. Oversized decorative media preserves a fitting hold; reading overflow releases it.
- Sixteen React/Framer Motion server renders cover all four layers in full motion, keyboard, reduced motion and offscreen states. They check selected controls, panel labels, poster versus video, unique SVG IDs, clip references, expected connections, scope destination and copy restrictions.
- The caption effect settles an interrupted animation and resumes only for a fresh choice.
- Browser acceptance remains pending. The approved browser rejected the local preview with `net::ERR_BLOCKED_BY_CLIENT` during prior verification. These callback and render checks do not establish mobile layout, actual focus timing or media playback in a browser.

## Next controlled preview acceptance

After the preview release reports the saved commit, inspect 320px, 390px, 768px, 1180px and 1440px widths, a short desktop viewport, and increased text size. Confirm both actions remain reachable and the added action row releases any desktop hold that cannot fit.

Use the sequential control repeatedly, then the four tabs and desktop diagram. Confirm that the reading, selected control and connections agree, focus stays visible, and the final action returns to Category. With a connection or caption moving, use Tab or pause motion. Confirm the scene settles without losing the selected layer or changing the existing scroll space. Resume with a pointer, then scroll, and confirm only fresh scroll intent releases the explicit choice.

Publication remains pending during the existing Vercel cooldown. This batch does not request a deployment.
