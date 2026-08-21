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
