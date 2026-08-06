# Branding Tatva — Sitewide Scroll, Motion & Experience Operating System

Codified from Suman's directive (Aug 2026). CURRENT truth alongside CINEMATIC_MEDIA_OS.md. One coherent motion system across every page: the visitor supplies an ordinary scroll; the site supplies the world.

## §1 Central rule — native effort, cinematic result

One ordinary gesture (natural scrolling) produces all richness. Banned: forced horizontal scroll, long pins, scroll snapping on ordinary content, progress slower than the gesture, hidden scrollbars, hover-only information, loaders delaying the proposition, text readable only after animation.

## §3 Scroll comfort standard

- One wheel movement = visible progress, always.
- Essential copy readable within ~300ms of reaching reading position; animation continues around it, never in front of it.
- Sticky budgets: explanatory scene 120–180vh, signature scene 220–320vh, exceptional case study 400vh max after review. 500vh+ requires content justification + mobile alternative.
- Every immersive chapter has an escape: visible progress, chapter index, skip, next indicator, or plain scrolling.
- Mobile: reduced parallax, shorter wrappers, visible media instead of hover, no cursor interactions, horizontal sequences stacked, one idea per viewport.

## §4 Rhythm model

Repeat: IMPACT → ORIENTATION → DEPTH → PROOF → BREATH → DECISION. Never three immersive sections consecutively. Tempo guide: 0–12% arrival, 12–28% recognition, 28–52% proof/education, 52–72% deeper interaction, 72–88% risk reduction, 88–100% conversion.

## §5 Motion budget per viewport

Foreground max 1 primary motion; midground max 2 supporting; background max 2 ambient. Amplitudes: text 12–28px, cards 4–10px, cursor pull 2–5px, background parallax 2–6%, image scale ≤1.04, rotation ≤1°, blur ≤14px.

## §6–§9 Engine

- **Tokens:** `src/lib/motionTokens.ts` — the only source of easing/duration/distance values for new work.
- **Level A** native CSS (progress lines, simple opacity/scale, section entry — scroll-driven timelines where supported, visible fallback always).
- **Level B** Framer Motion (component entry, accordions, tabs, cards, layout transitions).
- **Level C** measured scroll progress via `src/hooks/useMeasuredScrollProgress.ts` + CSS sticky (signature storytelling, evidence sequences, decision maps). Hottest scenes write styles directly to nodes.
- **GSAP `ScrollTrigger.pin` is banned in this codebase** (verified failure history; the last pin was removed Aug 2026). Non-pin GSAP timelines remain fine.
- **Lenis:** stays on the documented `lerp` configuration rather than the directive's `duration/easing` example — this codebase traced Lenis's source and verified duration mode never completes its curve under continuous wheel input (SmoothScrollProvider's own comment). Intention preserved through safer execution per §20: responsiveness tuned via `wheelMultiplier` ≈ 0.92 and lerp, not by re-introducing a mode with a known failure here. All programmatic movement through `useLenis()`.

## §10 Sticky story pattern

Sticky child inside a tall wrapper; ancestors stay `overflow: visible`; `overflow: hidden` scoped to media masks; `svh` where appropriate; reduced motion gets a linear static layout; essential copy in semantic DOM order.

## §11 Per page immersive budgets

Home max 2 chapters (awakening → invitation). Services 1 major + 2 minor (pricing/booking stay stable — money hates motion). Work 2 major (the signature project owns the site's longest scene). About 1 (the convergence). Insights 0 on ordinary articles. Contact: a meaningful contact action within one viewport.

## §12–§13 Transitions

Five element families — Earth (texture/grounded vertical), Water (mask/reflection/ripple), Fire (warm light/contrast), Air (blur sharpening/tracking), Space (scale down/negative space). Two or three families per page, never all five. Match cuts by shape, motion, or one preserved dominant tone; palette shifts ≤10–15% per boundary.

## §14 Cards

One purpose specific interaction per card type: informational (2px lift, border, arrow), project (media reveal + decisive line), service (scope preview), diagnostic (clear active state + announcement), pricing (stable, minimal motion). No universal tilt-and-glow. No spring bounce.

## §15 Scroll fatigue gates

Flag any page where sticky wrappers exceed 40% of height, >3 videos decode at once, >2 major scrubbed sections, offer unclear after three screens, proof after extensive philosophy, or mobile inherits desktop scroll distances.

## §16–§18 Accessibility, performance, video

Reduced motion: global CSS clamp + per component visible fallbacks (a blanket rule alone leaves hidden initial states). Optional site level Motion Full/Reduced toggle, persisted. Animate transform/opacity/controlled filter only; `will-change` transient; pause offscreen loops and videos; cap DPR; targets LCP ≤2.5s, CLS ≤0.1, INP ≤200ms, ~60fps scroll. Autoplay cap: 2 videos desktop, 1 mobile; every video has WebM+MP4+poster, explicit play, reduced motion and error fallbacks, and a stated purpose.

## §19 Conversion in the scroll

Contextual CTAs at logical moments — after self recognition ("See the path that fits"), after proof ("See the decisions behind the result"), after education ("Find the weakest brand decision"), after risk reduction ("Book a Brand Strategy Session"). Never a booking button after every section.

## §22 Component roadmap

Built: motionTokens, useMeasuredScrollProgress. To build as pages migrate: useMotionPreference + MotionPreferenceToggle, SectionReveal, StickyStory, MediaReveal, ChapterProgress, five transition family components. Audit and consolidate existing components (Reveal, ClipReveal, PerspectiveReveal, PinnedHold, SceneVeil/Handoff already cover much of this) rather than duplicating.

## §24 Quality gate per page

Report scroll distance, sticky distance, motion sequences, playing videos, reduced motion behaviour, mobile adaptation, conversion moments, perf/accessibility risks, files changed, screenshots, build results. tsc + eslint + build + a real browser walkthrough, wheel/trackpad/touch/keyboard, both reduced motion states, Safari/Chrome/Firefox, resize, back navigation.
