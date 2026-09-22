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

The cloud browser can operate a mouse but does not expose native touch input. These input-handler checks are distinct from physical iPhone/Safari acceptance, which remains outstanding. The latest attempt to inspect the old Contact phone frame also timed out. No touch screenshot or full physical-device pass is claimed.
