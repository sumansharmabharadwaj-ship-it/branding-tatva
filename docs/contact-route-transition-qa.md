# Contact route transition pass · 15 September 2026

The previous mobile route card changed from 617.56px for Book to 549.95px for
Speak. Its exit-before-enter animation removed the outgoing content from layout.
That combination could move the page and the following form during selection.

This pass keeps three text layers in one intrinsic grid cell. The tallest route
reserves the frame across viewport sizes and font loading; action rows use the
available height. Only the selected layer is accessible or interactive. A short
directional dissolve hands over between routes. Outgoing photographs remain for
that dissolve, then release their image/camera rather than keeping hidden films
running. The separate image entrance was removed to avoid two competing masks.

Cinematic chapters now render their readable pose on the server and enable the
camera after hydration. Compact chapter links also reserve the visible header's
height through scroll margin, without increasing section heights. The hero,
form delivery and closing invitation composition retain their existing behaviour.

## Verification

TypeScript, ESLint, the Contact contract and cinematic gates, and mocked delivery
checks passed. The production HTML contains three route layers with exactly one
accessible route, nine unshifted headline lines, and readable chapter frames.
A production build passed before incorporating the concurrent homepage update;
the combined branch is rebuilt before the controlled preview is requested.

Hosted acceptance will check route changes in both directions, keyboard focus,
reduced motion, stable frame height, active media count, mobile header clearance
and overflow against the exact deployment and the permanent branch alias.
