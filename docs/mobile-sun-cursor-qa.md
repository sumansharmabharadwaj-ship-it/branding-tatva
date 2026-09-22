# Mobile sun cursor — 22 September 2026

## Behavior

- The shared sun cursor now responds to touch and pen contact on every route.
- A 26px sun sits 32px above the contact point, with its rays kept clear of the visible viewport edges.
- A released contact remains visible for 520ms, followed by the CSS opacity fade.
- Native scrolling, pointer cancellation, multi-contact gestures, keyboard Tab, backgrounding and navigation away clear feedback. No default action or pointer capture is changed.
- Connected mice use `any-pointer: fine`, allowing a mouse on a tablet while the primary pointer remains touch. Native mouse cursors are hidden only after actual mouse input.
- Touch feedback has no text tooltip. Operating-system and site reduced-motion preferences disable both cursor modes.
- Motion stays outside React rendering: pointer updates change only the existing decoration's styles, with passive listeners and no animation loop.

## Verification

- `pnpm check:cursor`: actual component handlers exercised with simulated touch, pen and mouse events. Covers viewport edges, release timing, cancellation, pinch, keyboard, OS and site motion preferences, passive input listeners and complete cleanup.
- TypeScript and targeted ESLint passed.
- Production build passed again with the latest incoming homepage performance changes (106 routes).

The cloud browser can operate a mouse but does not expose native touch input. These input-handler checks are distinct from physical iPhone/Safari acceptance, which remains outstanding. Inspecting the old Contact phone frame timed out, and a fresh-tab recovery also timed out before navigation. No touch screenshot or full physical-device pass is claimed.

## Preview release 507

- Source commit: `0a6b6914a9f11561cad44ab67239b04a307e7d85`.
- Deployment trigger: `e6d5186ea25ed64cc40ac3936eb0ea2e65d60ad4`.
- Vercel deployment `dpl_CBgdzPjaCiHHSTu1pg8nDzgwF7Ta` is READY; the controlled-preview check succeeded.
- The deployment's `/api/release` returned HTTP 200 and the exact trigger commit, branch `august-8-isolated`, environment `preview` at 10:56 UTC.
- The permanent review alias still returned production commit `a29577f4cd2497d7e76524c73ec49b5222a8caac` at the same time. It is not evidence for this change. Alias reassignment remains unavailable through the connected deployment tools; the workflow has no configured Vercel API credential for that step.
