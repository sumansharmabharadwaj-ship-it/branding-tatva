# Frontend Architect — Branding Tatva

Next.js 15 (App Router), React 19, TypeScript, Tailwind v4, `pnpm`, deployed on Vercel.

## Structure

- `src/app/**/page.tsx` — pages (mostly composition, minimal logic)
- `src/components/` — shared UI (`Button`, `Container`, `Reveal`, `TexturedDark`, `PhotoHero`, `VideoBreak`, `PinnedHold`, etc.)
- `src/sections/` — page-specific composed sections (`Home/SelectedWorkPinned`, `Elements/PinnedSlider`, `Process`, `FAQ`, `Footer`)
- `src/data/*.ts` — all content, plain typed arrays, no CMS (`elements.ts`, `projects.ts`, `process.ts`, `services.ts`, `faqs.ts`, `blog.ts`, `about.ts`)
- `src/hooks/` — `useLazyMount`, `useVideoFadeIn`, `useTilt`, `useSpotlight`, `useMediaQuery`, `useRevealTrigger`
- `src/lib/` — `sectionWash.ts` (color blending/tokens), `pinnedStageOpacity.ts` (sticky-stage settle math), `elementColor.ts`, `media.ts`

## Verify → deploy loop (every change)

```
npx tsc --noEmit
npx eslint <changed files>
pnpm build
git add <specific files>          # never blind -A — review what's staged
git commit -m "..."               # explain why
git push origin august-8-isolated
curl -s https://branding-tatva-git-august-8-isolated-suman22.vercel.app/api/release
```

The permanent review alias above is the only Vercel URL to share. Keep production untouched until Suman explicitly approves promotion. Confirm that `/api/release` reports the exact branch commit before describing a preview as current.

Run typecheck + lint after each meaningful edit, not just once at the end of a large change — catching a mistake immediately is cheaper than untangling it three edits later.

## Known sandbox limitation — read before "fixing" a phantom bug

This dev environment's Browser pane has a recurring, documented flakiness: `document.visibilityState`/`document.hasFocus()` can report `hidden`/`false` even when nothing is actually wrong on the site, which stalls IntersectionObserver-gated mounts, `<video>` play/pause state, and rAF-driven timers (a loading-veil animation can appear stuck indefinitely). When a screenshot looks wrong or a video reads `paused: true`, first check `document.visibilityState` — if it's `hidden`, the read is unreliable. Trust direct DOM/computed-style JS extraction over screenshots, and cross-check against the actual preview deploy before concluding something is broken.

## Established, working patterns — reuse rather than reinvent

- `useVideoFadeIn` for every autoplay video (explicit `.play()` call + `loadeddata`-race-safe opacity fade — the bare `autoplay` attribute alone is confirmed unreliable).
- `useLazyMount` for gating expensive mounts near-viewport.
- Sticky-based pinned sections (see `motion-designer/skill.md`) — never GSAP `ScrollTrigger.pin` or WebGL/Three.js; both have a documented failure/rejection history in this exact codebase.
- `blendHex`/`ELEMENT_HEX` (`src/lib/sectionWash.ts`) for any new section-color treatment — never a new hardcoded hex.
- `useLenis()` + `lenis.scrollTo(...)` for any programmatic scroll — never raw `window.scrollTo`.

## Security & correctness baseline

Standard OWASP hygiene applies (this is a public marketing site with a contact form + newsletter signup hitting `/api/contact` and `/api/newsletter`) — validate all form input server-side (already via `zod` schemas in `src/lib/*-schema.ts`), never trust client-side validation alone, keep the honeypot fields on both forms, and never log or expose submitted PII beyond what's needed to process the enquiry.
