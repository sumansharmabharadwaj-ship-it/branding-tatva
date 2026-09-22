# Homepage questions: stable disclosure reading

## Changes

Question headings now retain their position and full opacity while answers expand. The row-wide scroll entrance previously moved a whole question by 30 px and reduced its opacity to 0.1, even as opening an answer changed that row's height and scroll timeline. That entrance and the 7 px hover text slide have been removed. Answer height and copy transitions, the clay rule, warm row surface, plus icon and answer reading line continue to provide motion.

Keyboard reading now belongs to the whole question section. Focusing or using a key inside it settles every disclosure's decorative motion, the introduction, camera, gradient and action arrows. The existing fog poster replaces the living media during keyboard reading or reduced motion. Pointer interaction restores the section's full-motion behavior. The open answer set remains unchanged through pause, resume and viewport exit.

Escape within an open answer closes that answer and returns focus to its controlling question before the answer becomes inert. The other open answers stay open. Modified, composing and already-handled key events are left alone. The existing Up/Down and Home/End heading navigation keeps the same protection for modified shortcuts. Existing focus clearance still brings headings, reading regions and answer links above the fixed header and lower controls when necessary.

All six answers continue to come directly from the shared FAQ data. Their native next-step links retain their destinations and browser modifier behavior. The introductory copy is shorter, and the final audit link now avoids speculative prefetching. The first answer remains open on initial render; visitors can open several answers independently.

The section waits for hydrated motion preferences before finite disclosure movement and settles that movement offscreen. Reentry does not restart an already-open answer's entrance. The CSS scroll animation on the media also stops during keyboard reading.

## Verification

- TypeScript, changed-file ESLint and the production build passed. The build generated 106 routes; the homepage is 70.2 kB with 312 kB first load JavaScript.
- Focused callback checks cover six safe focus transfers on closing answers, all four heading navigation keys, six shortcut guards, Escape for each of the six answers, independent open states, pause/resume and offscreen reentry.
- Opening-copy checks cover focus arriving before the entrance effect, interruption during motion, and resuming without replaying the entrance.
- Thirty-two actual React/Framer Motion server renders cover each answer individually, all answers open and all answers closed across full motion, keyboard reading, reduced motion and offscreen states. Checks include six named regions, expanded states, inert closed regions, unique IDs, shared FAQ text, the six action destinations, and poster versus living media.
- A stylesheet comparison confirms every rule affecting the closing invitation is unchanged. The native evidence, process and invitation destinations remain focusable; Services still contains the offerings and audit anchors, and Contact contains the call anchor.
- These checks use mocked browser geometry and event callbacks. They do not certify native animation timing, rendered layout, physical iPhone behavior or Safari. Browser acceptance remains pending after the approved browser rejected the local preview with `net::ERR_BLOCKED_BY_CLIENT` during earlier verification.

## Next controlled preview acceptance

After the preview reports the saved source, check desktop, 320px and 390px widths, a short viewport and increased text size. Open several answers and confirm the question headings stay readable and anchored. Use Tab, Shift Tab, heading arrow keys, Home/End and Escape from an answer or its link. Verify the closed answer becomes inert only after focus returns to its question, and other open answers stay open.

Check Ctrl/Command/Alt/Shift shortcuts, rapid opening followed by Tab, pause during expansion, native reverse scrolling, and the OS reduced-motion setting. Confirm poster and gradient settling, reachable answer actions, and native fragment focus at evidence, process and invitation. Resume with a pointer and confirm open answers remain open without replaying their text entrance.

Preview deployment and publication remain pending during the existing Vercel cooldown. This batch requests no deployment and leaves the controlled release configuration unchanged.
