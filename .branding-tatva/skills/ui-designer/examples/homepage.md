# Example: Home page structure (`src/app/page.tsx`)

Read the live file before treating this as current — it changes often. As of this writing, the flow is:

1. `CinematicHero` — full 100svh video hero, word-by-word headline, two CTAs, one real proof stat.
2. `KineticMarquee` — a scrolling branding-vocabulary strip, a quick chapter-divider beat, not a content section.
3. Trust beat + framework claim — merged into one `TexturedDark` section sharing one continuous video, not two sections cutting between a video and flat `bg-soil`.
4. `ElementsSection` (`PinnedSlider`) — the five-elements pinned crossfade sequence, `position: sticky`-driven, not GSAP pin.
5. Selected-work heading (own section, video-backed) → `SelectedWorkPinned` (2-stage pinned: one hero project, two secondary cards).
6. Mid-funnel CTA (plain `bg-soil`, one link).
7. Process heading (video-backed) → `ProcessSection` (`PinnedJourney`) → closing line.
8. FAQ, on a light `ClipReveal`-wrapped card over a video backdrop (light chapter, deliberate contrast with the dark sections around it).
9. Closing `PinnedVideoBreak` — quote + final CTA, merged into one continuous video-backed section (not two).

**Pattern worth reusing elsewhere**: two adjacent, thematically-connected plain-text sections read as an abrupt seam if only one has a video background. Merge them into one video-backed wrapper with a hairline divider (`border-t border-ivory/15`) between the content blocks instead of a hard section cut — see the Trust+Framework merge above.
