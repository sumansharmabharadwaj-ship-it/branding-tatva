# Motion Designer — Branding Tatva

Motion directs attention, explains relationships, and increases immersion. It never runs purely for decoration.

## Read this before touching scroll, pin, or 3D — critical project history

This codebase has **twice built and abandoned GSAP ScrollTrigger `pin: true`** — real, repeated bugs (pin desync on tab backgrounding, stale cached trigger positions, dead scroll space left after unpinning). It has **twice built and rejected full WebGL/Three.js scenes** — direct feedback both times called the result "cartoonish and disconnected from the brand" (an About-page closing scene, and a five-capsule Three.js "skyline" moment on About). All current pinned sections (`PinnedSlider`, `PinnedJourney`, `ElementsIntroPinned`, `MeadowClosing`, `SelectedWorkPinned`, `PinnedHold`, `PinnedVideoBreak`) run on plain CSS `position: sticky` + `getBoundingClientRect()`-driven progress math instead, specifically because sticky can't desync from its own wrapper's live layout the way a cached GSAP trigger position can.

**If a brief asks for ScrollTrigger pinning or a WebGL/Three.js scene**: say so explicitly before building — name the prior attempt and why it was rolled back — rather than silently complying (repeating a proven failure) or silently refusing (ignoring the ask). GSAP itself (non-pin), Framer Motion, and Lenis remain in active, working, proven use across the site.

## Proven patterns to reuse

- **Sticky-driven pinned stages**: a wrapper sized `(stageCount + 1) * 100vh * STAGE_SPEED`, a `sticky top-0 h-screen` inner viewport, a `lenis.on("scroll", update)` callback that reads `wrapper.getBoundingClientRect()` and writes `stage.style.opacity` directly (no `setState` per scroll tick — see `stageOpacity()` in `src/lib/pinnedStageOpacity.ts` for the settle/hold-plateau math).
- **`useVideoFadeIn`** (`src/hooks/useVideoFadeIn.ts`) — every autoplay video on the site should use this, not the bare `autoplay` attribute alone, which is confirmed unreliable live (a fully-loaded, muted, autoplay video can sit permanently paused with nothing to start it).
- **`useLazyMount`** (IntersectionObserver + Lenis-scroll fallback) gates expensive mounts (video elements, heavy sections) until near-viewport — more reliable than `next/image`'s own native lazy-load for sections well below the fold.
- Reduced motion: every animated component needs a `useReducedMotion()` branch (Framer Motion) rendering a static/zero-duration equivalent, on top of the sitewide CSS rule in `globals.css`.

## Hard rules

- No auto-playing carousels. No scroll hijacking (the user's own scroll input must always stay in direct control). Nothing blocks or delays reading a headline.
- `position: sticky` breaks the instant an ancestor gets `overflow` other than `visible` — scope any `overflow-hidden` to the smallest wrapper that needs it.
- `ClipReveal`/`PerspectiveReveal` clip their *entire* children to zero at rest, background included — a background meant to always show must be a sibling outside the reveal wrapper, never nested inside it.
- Raw `window.scrollTo`/`scrollBy` fights Lenis's own virtual scroll state — use `useLenis()` + `lenis.scrollTo(...)`.
