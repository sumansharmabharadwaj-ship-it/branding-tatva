# Branding Tatva Services scroll map

Branch: `homepage-cinematic-recovery`

This document records the implemented Services-page choreography. It is an implementation contract for browser verification, not a design wishlist. The governing rule is simple: preserve native browser control while increasing the amount of meaningful discovery produced by a short physical scroll.

## Current chapter map

| # | Chapter | Meaningful states | Physical range | Primary mechanism | Manual interaction | Touch / mobile | Reduced motion |
| ---: | --- | ---: | --- | --- | --- | --- | --- |
| 01 | Opening signal | 3 semantic phases | natural hero, approximately one viewport | native-scroll camera resolve, fragment alignment, aperture handoff | hero CTA and chapter links remain native anchors | fragments are simplified; no desktop-only depth requirement | stable poster/copy; scrub-dependent decoration removed |
| 02 | Your situation | 3 route previews | natural section, at least one viewport | normalized scene progress previews Idea → Reposition → Ongoing | selecting a row explicitly commits the route and holds the choice | direct tap-led route selection remains fully usable | all choices remain directly selectable; no scroll dependency |
| 03 | Six disciplines | 6 service states | `170svh` on desktop | short sticky service journey: small vertical travel advances the service focal state | hover/focus/click select a discipline; manual choice receives a hold period | vertical/tap-led explorer rather than desktop lateral travel | unpinned direct explorer |
| 04 | Package paths | 3 package previews | natural section, at least one viewport | normalized scene progress previews the three real packages | click is required for commitment; carried diagnosis overrides passive preview | tap-led package choice remains available | direct package states, no required scrub |
| 05 | Verified outcome | 3 proof beats | natural section, at least one viewport | decision → behavioural shift → one foregrounded verified result | links to the complete case-study decision trail remain normal links | same readable three-beat evidence stack | final result is foregrounded while all three evidence rows stay visible |
| 06 | Brand foundation | 5 layers | maximum `220svh` desktop | short sticky foundation assembly | content remains readable independent of scroll speed | authored non-caged explanation | sticky range removed and the complete system is visible |
| 07 | Positioning cost | 4 causal beats × 2 focus modes | natural section; no multi-viewport cage required | cause progression changes the consequence and shifts focus Generic → Distinct | visitor may explicitly hold Generic or Distinct | compact `MobileStakesDeck`, touch-led | both paths remain readable without scrub |
| 08 | Perception | 4 rungs | natural section, at least one viewport | ladder progresses Unknown → Recognized → Remembered → Preferred | each rung can be opened directly | `MobilePerceptionClimb` replaces desktop ladder choreography | complete ladder and proof remain available statically |
| 09 | The archive | 5 scope drawers / 14 real artifacts | natural section, at least one viewport | fine-pointer desktop scroll previews Foundation → Expression → Experience → Activation → Continuity | drawer, artifact, explanation-tab focus/click/keyboard receives a 12-second manual hold | scroll preview is disabled; archive is fully tap-led so drawer-height changes never fight a finger gesture | manual/static archive with every artifact accessible |
| 10 | Project map | 2 decisions + personalized result | natural section | progressive interactive project mapping | visitor choices create the result from real package/deliverable data | direct touch controls | complete form and result remain functional |
| 11 | Health check | 4 questions + result | natural section | measured self-assessment with progressive diagnostic feedback | visitor answers, back/reset, and result actions remain explicit | touch-first controls | no required motion; full diagnostic remains usable |
| 12 | Recognition audit | interactive checks / audit result | natural section | progressive recognition audit rather than a pinned scroll cage | form controls own the experience | normal stacked/touch controls | all checks remain usable |
| 13 | Strategy room | 1 arrival state | natural final scene | cinematic settling and one clear next action | booking/contact controls remain primary | same quiet arrival | stable final composition |

## Stable chapter anchors

The Services runtime assigns and publishes one stable anchor per directed scene. The fixed route guide is built from this same runtime list, so deep links, active state, and visible chapter labels cannot drift into separate taxonomies.

1. `#services-opening` — Opening signal
2. `#situation` — Your situation
3. `#offerings` — Six disciplines
4. `#desire` — Package paths
5. `#verified-outcome` — Verified outcome
6. `#authority` — Brand foundation
7. `#stakes` — Positioning cost
8. `#education` — Perception
9. `#deliverables` — The archive
10. `#imagine` — Project map
11. `#health` — Health check
12. `#audit` — Recognition audit
13. `#book` — Strategy room

Client-assigned anchors such as `#stakes`, `#verified-outcome`, and `#deliverables` are restored once after hydration when they are the initial URL hash. Normal anchor clicks after hydration remain browser-controlled.

## Global scroll rules now enforced

- Ordinary wheel, trackpad, scrollbar, keyboard, and touch scrolling remain native browser input.
- No ordinary `wheel` or touch listener calls `preventDefault()`.
- No page-wide mandatory scroll snapping is installed.
- No fake scrollbar or page-wide nested scroll container is used.
- One Services runtime uses `IntersectionObserver` for active-scene state and one `requestAnimationFrame` loop for nearby scene progress.
- High-frequency progress is written to CSS custom properties. React is reserved for semantic state changes rather than pixel-by-pixel rerenders.
- Desktop chapter navigation is a narrow right-edge rail, not a full-width bottom bar.
- Tablet/mobile navigation collapses to a compact corner dial and explicit chapter menu.
- The chapter guide exposes all 13 directed scenes and uses their real anchors.
- The final Strategy room removes the fixed chapter guide so conversion controls own the viewport.
- Form interaction fades fixed chapter wayfinding and pauses nonessential Services media.
- Maximum simultaneously playing Services films: two on desktop/tablet, one on mobile or constrained devices.
- Offscreen media is paused. Reduced-motion mode pauses ambient Services video playback.
- `will-change` is reserved for the active opening scene rather than held globally.
- The shared continuity signal avoids an always-on blur filter and uses paint containment.
- Authority is capped at approximately `220svh` on desktop instead of the earlier multi-hundred-viewport-style scroll cage.
- Touch devices do not inherit desktop archive auto-progression.
- Passive situation/package previews never silently commit a user choice.

## Browser release contracts

The current release workflow runs the following browser contracts against the exact commit being gated:

### `services_page_gate.cjs`

Walks the full Services page and verifies the core interaction surface across the route.

### `services_scroll_experience_gate.cjs`

Profiles `1440×900`, `1024×768`, and `390×844` plus reduced motion. It verifies:

- exactly 13 directed scenes;
- 13 unique stable IDs and labels;
- compact Services wayfinding rather than the old bottom bar;
- all 13 desktop/mobile chapter destinations;
- total physical journey remains within the current scroll-viewports ceiling;
- service ecosystem range remains about `1.7` viewports;
- Authority remains about `2.2` viewports on desktop;
- native first-gesture hero response;
- manual service choice is not overwritten by automatic progression;
- maximum active-video budget of two desktop/tablet and one mobile;
- no horizontal overflow;
- zero fixed route guides inside the final Strategy room;
- reduced-motion scenes are unpinned/non-caged and videos are stopped.

### `services_semantic_progress_gate.cjs`

Verifies that scroll produces meaningful states rather than decoration:

- Situation preview changes without passive commitment;
- package preview changes without passive commitment;
- explicit route/package clicks commit correctly;
- Verified outcome resolves through three distinct proof beats;
- positioning story changes causal beat and Generic/Distinct focus;
- Perception progresses Unknown → Preferred;
- form focus clears wayfinding and pauses Services films.

### `services_archive_gate.cjs`

Separately verifies the archive input split:

- fine-pointer desktop scroll previews Foundation → Continuity;
- a deliberate manual drawer selection is held against later scroll;
- mobile touch scrolling does not auto-change drawers;
- mobile tapping still selects a drawer directly.

### `services_native_input_gate.cjs`

Verifies browser control and restoration:

- mouse wheel;
- immediate reverse wheel;
- Page Down;
- Space;
- Home;
- End;
- direct programmatic position as the scrollbar-drag contract;
- direct anchors including client-assigned `#stakes` and `#deliverables`;
- correct active route-guide state after anchor entry;
- browser Back and Forward restoration;
- refresh inside Authority;
- no browser page errors.

## Hardware boundary

Automated browser input verifies the event/control contract, but it is not a substitute for physical-device testing. A final human release review must still include:

- Mac precision trackpad;
- Windows precision trackpad;
- physical touchscreen / mobile Safari or Chrome where available;
- actual scrollbar-thumb dragging.

These hardware checks must not be reported as complete until they have genuinely been performed.

## Completion rule

A scene passes only when a small movement produces an immediate, understandable change in meaning. If one viewport of travel produces only a heading fade, it is under-authored. If a tiny gesture produces several unrelated effects, it is over-authored. The target remains small physical movement, immediate feedback, one meaningful transformation, and a clear destination.
