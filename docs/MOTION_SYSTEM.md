# Branding Tatva — Motion System

## The hero: "The Elements Find Their Form"
Five fragments — one per element (earth, water, fire, air, space) — begin scattered around the composition and settle into place around a central point (the bindu) on page load. Built in `src/components/AnimatedHero.tsx` using Framer Motion.

- **Earth** (clay blob): slow, weighted settle — arrives first
- **Water** (indigo arc): curved entry path
- **Fire** (ochre ring): smaller, sharper motion
- **Air** (sage line): light, arrives with a slight rotation
- **Space** (soil dot): arrives last, marks convergence

## Reduced motion
`useReducedMotion()` (Framer Motion) checks the system preference. When active, every fragment renders directly in its final position with zero animation duration — no opacity fades, no movement. This is handled per-component, in addition to the site-wide CSS rule in `globals.css` that shortens all animations to near-zero for anyone with the OS-level reduced-motion setting on.

## Desktop interaction
Gentle pointer-based parallax on the hero fragments (a few pixels of drift toward the cursor, spring-damped so it feels calm rather than jumpy). Disabled entirely on mobile and under reduced motion.

## Mobile
Fragment count drops from five to three (earth, air, space) to keep the composition legible on a small screen without feeling cluttered. No parallax. No layout shift — the container has a fixed height so nothing jumps as it loads.

## Not yet built
- Scroll-triggered reveals for lower sections (currently static)
- Element hover/tab interactions on the Services page
- Page-transition motion between routes

## Motion principles carried forward
- No auto-playing carousels
- No scroll hijacking
- Nothing that blocks or delays reading the headline
- Every animated component must have a reduced-motion equivalent before it ships

## Known defect: reduced motion hydrates twice (Aug 2026)

`useReducedMotion()` returns `false` on the server, because there is no
`matchMedia` there, and `true` on a reduced motion client's very first
render. Any component that uses it to decide **what markup to render**
therefore produces one tree on the server and a different one during
hydration, and React throws a recoverable mismatch.

Confirmed with Playwright under `reducedMotion: 'reduce'`: React error
418 fires on every route, on every page load, for reduced motion
visitors only. Content still renders correctly, because React recovers
by re-rendering on the client, so nothing looks broken. The cost is a
full client re-render on load for the people least likely to want one.

`PageLoadVeil` was fixed properly and is the model: start state where
the server left it, then tear down in a layout effect before paint.

Still branching markup on `useReducedMotion` and still mismatching:
`VideoBreak`, `ImageBreak`, `ClipReveal`, `ScatterReveal`,
`PerspectiveReveal`, `GradientSections`, `DustMotes`, `ParallaxDrift`,
`SkyLife`, `HoverGlyph`, `ScrollProgress`, `NewsletterForm`.

The wrong fix is deferring the branch to after mount everywhere: that
would show reduced motion visitors a frame of the animated markup they
asked to avoid. The right fix is moving these branches out of JS and
into the `prefers-reduced-motion` CSS already in `globals.css`, so the
server and the client render identical markup and the media query
decides what moves. That is a dedicated pass, not a patch.
