# Branding Tatva — Design System

This is the current, accurate reference for the site's visual and motion language. Unlike the other files in `docs/` (written near project inception and now stale per `CLAUDE.md`), this file is kept in sync with the real code — every value below is pulled directly from `src/app/globals.css`, `src/lib/sectionWash.ts`, and the components that implement each pattern. If this file and the code ever disagree, the code is right; fix this file to match, not the other way round.

This document describes what the system *is*, not an aspirational one. It does not promise capabilities that aren't real (a custom AI-video pipeline, a page-wide 3D master timeline) — those are addressed directly in "What this system deliberately does not do" below.

## Colour tokens

Defined in `src/app/globals.css`'s `@theme` block (Tailwind v4 CSS-based config, not `tailwind.config.ts`).

| Token | Hex | Use |
|---|---|---|
| `ivory` / `background` | `#F4EFE6` | Default page background |
| `parchment` / `background-alt` | `#E8DED0` | Alternating light section background |
| `warm-white` / `background-elevated` | `#FCFAF6` | Cards, elevated light surfaces |
| `soil` / `foreground` | `#27221E` | Primary text on light; the site's single dark-section anchor tone |
| `foreground-secondary` | `#5A5148` | Body copy on light backgrounds |
| `clay` / `action-primary` | `#B85A34` | Primary buttons, links, Earth element |
| `indigo` / `action-secondary` | `#24394D` | Eyebrows, secondary accents, Water element |
| `ochre` / `state-focus` | `#C28A28` | Focus rings, warnings, Fire element |
| `sage` / `state-success` | `#5C6B4A` | Success states, Air element |
| `rose-earth` | `#AD6F5C` | Space element |
| `sandstone` | `#D4B99A` | The site's one light-section anchor tone besides ivory/parchment |
| `terracotta` | `#CD7A4C` | Secondary accent (Marketing Strategy offering) |
| `border` | `#D9CDBC` | Hairline dividers on light backgrounds |

The five element hexes (`ELEMENT_HEX` in `src/lib/sectionWash.ts`) are the site's *only* accent palette — clay/indigo/ochre/sage/rose-earth. Never introduce a new brand colour; blend or tint one of these five (`blendHex`, `sectionWash`) instead. `sectionWash.ts`'s own top comment documents why: cycling through five different saturated full-section fills read as "cluttered, no cohesive visual language" — element hues now only ever appear as accents (icons, borders, numerals, card tints), never as a full section fill. Every dark, photo/video-backed section uses flat `soil` as its base for the same reason.

## Typography

- **Display** (headings): Cormorant Garamond — an editorial serif, loaded via `next/font/google`, referenced as `font-display`. Chosen deliberately over the geometric sans-serif nearly every competing brand-strategy site reaches for (see `src/data/design-rationale.ts`'s own real rationale, rendered on the About page).
- **Body**: Manrope — `font-body`, stays quiet at small sizes (form labels, captions) so the display face can carry the personality.
- Responsive scale via `clamp()`, defined as `--text-display-xl` through `--text-display-sm` in `globals.css`'s `@theme` block:
  - `display-xl`: `clamp(2.75rem, 6vw, 5.5rem)`, line-height 1.05
  - `display-lg`: `clamp(2.25rem, 4.5vw, 4rem)`, line-height 1.08
  - `display-md`: `clamp(1.75rem, 3vw, 2.75rem)`, line-height 1.15
  - `display-sm`: `clamp(1.375rem, 2vw, 1.875rem)`, line-height 1.25
  - One-off hero/editorial moments (Services' `CyclingStatement`, the "breath" pacing sections) use inline `clamp()` values outside this scale when a specific moment calls for it — the scale above is the default, not a hard ceiling.

## Copywriting standard

Fully documented in `CLAUDE.md` — the short version: no literal "not" anywhere in rendered copy, no hyphens/dashes anywhere in rendered copy (code comments exempt), a banned list of generic-agency/AI-cliché words and adjectives, no self-referential "we/our" framing, and every number/claim traces to real, verified data (`src/data/projects.ts`). This is enforced on every page, not just Services — check new copy against it before shipping.

## Motion system

There is no single formal "master timeline," and this is a considered choice, not an oversight (see below) — but there *is* one consistent set of primitives reused everywhere rather than each section inventing its own:

- **Entrance reveal**: `Reveal` (`src/components/Reveal.tsx`) — the default fade/slide-up for any content entering the viewport, `IntersectionObserver`-driven, easing `[0.16, 1, 0.3, 1]`.
- **Headline reveal**: `SplitReveal` (`src/components/SplitReveal.tsx`) — word- or char-level GSAP `SplitText` reveal, reserved for the two or three headline moments per page that should carry real editorial weight, not applied to every heading (that would just be `Reveal` with extra steps). `splitType="chars"` requires `type: "words, chars"` in the underlying `SplitText` call, not `"chars"` alone — otherwise the browser can wrap mid-word (a real bug this codebase hit and fixed).
- **Staggered lists**: Framer Motion `motion.li`/`motion.div` with an index-based `delay` (`i * 0.06`–`0.08`), the same pattern in `PackageSelector`, `CommonMistakes`, `DesignRationaleGrid`, `ContactForm`'s row-by-row reveal.
- **Card hover**: `TiltCard` (`src/components/TiltCard.tsx`) — cursor-reactive 3D tilt (`useTilt` hook) + lift + coloured glow, reused on every card grid site-wide (About credentials, Blog, Work, Services comparisons) rather than each grid hand-rolling its own hover.
- **Toggle/step transitions**: Framer Motion `AnimatePresence mode="wait"`, used identically in `PackageSelector`, `BrandHealthCheck`, `StrategyRoomCTA`.
- **Scroll-driven crossfade**: `stageOpacity` (`src/lib/pinnedStageOpacity.ts`), a shared plateau-easing formula reused by every sticky multi-stage sequence (`PinnedSlider`, `PinnedJourney`, `CaseStudyScrollStory`).
- **Ambient backdrop**: `AmbientElementShader` (`src/components/AmbientElementShader.tsx`) — a single vanilla-Three.js GLSL shader blending the five element hexes as slow drifting light/grain, reused as the connecting visual thread across most of Services' dark sections rather than inventing a new background treatment per section.
- **Reduced motion**: every animated component has a `useReducedMotion()` branch — either a static equivalent or a zero-duration render. This is not optional per-component; it's checked on every new piece.

## Hero height tiers

Deliberate, documented in `PhotoHero.tsx`'s own comment: Home `100svh` (signature) → About `100vh` (personal) → Services/Work/Contact `70vh` (mid) → Blog `60vh` (shorter). A new page's hero height should reference this table, not guess.

## Video and photography sourcing

- Real footage only: either Suman's own personal photos/video, or free, properly licensed stock (Pixabay, Pexels, Coverr — no AI generation). Every clip is picked for a specific thematic fit to the copy it sits behind, not decoration.
- Register: calm, natural, outdoor, warm-earthy light. No office footage, no people-in-meetings, no literal stock-photo business clichés — this was a real, explicit correction this session (a fire-embers hero swapped for a calm misty forest trail after direct feedback that flickering flame footage read as agitated, not calm).
- A flat, textureless dark section is a real defect, not a stylistic choice — checked directly via DOM sweep (`document.querySelectorAll('main').children` background colours), not by eye alone, since a subtle low-opacity shader can be "technically present" in the DOM while still reading as flat in a screenshot. Prefer real, visible footage over a purely ambient shader when a section otherwise has none.
- Every video needs a poster image at the same path convention (`/videos/x.mp4` ↔ `/images/x-poster.jpg`) and goes through `useVideoFadeIn` or an equivalent explicit `.play()` call — the bare `autoplay` attribute is not reliable (confirmed directly, multiple times).

## What this system deliberately does not do

Documented at length in `CLAUDE.md`; summarised here as design-system-level constraints, not personal caution:

- **No AI-generated video.** There is no account access to Runway, Kling, Higgsfield, Luma, Pika, Leonardo, or Flux in this environment, and creating accounts or entering credentials on third-party services isn't something done autonomously. This is a hard capability boundary, not a budget or quality preference.
- **`ScrollTrigger.pin` is scoped to exactly one section site-wide** (`PinnedBrandBuild`), deliberately. This codebase has built and rolled back full GSAP pin implementations twice, for real, repeated bugs (pin desync on tab backgrounding, stale cached trigger positions, dead scroll space after unpinning). Every other pinned-feeling section (`PinnedSlider`, `PinnedJourney`, `PinnedHold`, `SelectedWorkPinned`) runs on plain CSS `position: sticky` + `getBoundingClientRect()` math instead, specifically because sticky can't fall out of sync with its own wrapper's layout the way a cached GSAP trigger position can.
- **WebGL is scoped to one ambient shader, no literal 3D objects.** Two prior full-scene WebGL attempts (an About-page closing scene, a five-capsule "skyline" moment) were both rejected as "cartoonish and disconnected from the brand" — the shared failure was literal 3D geometry competing with an editorial, photographic, warm-earthy identity. `AmbientElementShader` avoids this by rendering colour and light drift on a flat plane, never simulated objects.
- **No fabricated content.** Testimonials, precision stats, scarcity claims, deliverable names, or company comparisons that don't trace to real data in `src/data/*.ts` don't ship, regardless of how they're requested. This has been tested directly and held.

## Components built so far

Header, Footer, Container, Button/LinkButton, FAQ (+ `RiskRemovalFAQ` grouped variant), ContactForm, NewsletterForm, PhotoHero, CinematicHero, TexturedDark, VideoBreak/ImageBreak/BackgroundVideo, Reveal/SplitReveal/ClipReveal/PerspectiveReveal, TiltCard, AmbientElementShader, ScrollProgress, SectionJumpNav, PinnedSlider/PinnedJourney/PinnedHold/PinnedBrandBuild, CaseStudyScrollStory, PackageSelector, BrandHealthCheck, DeliverablesReveal, CommonMistakes, WeakBrandingCost, StrategySessionPreview, StrategyRoomCTA, DesignRationaleGrid, ElementGlyph, AnimatedStat, CalendlyEmbed, SparkCursor, AmbientAudio.

## Still open

- The Trust section's "founder environment" (workspace, notes, sketches) needs real photos that don't exist yet — parked until supplied, not built from stock or invented imagery.
- Indian motif library (jali, rangoli-logic, threshold frames) — referenced in early planning, never built; current identity leans on colour, type, and the five-element system rather than literal pattern work.
