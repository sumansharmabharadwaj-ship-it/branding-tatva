# Branding Tatva Services scroll map

Branch: `services-scroll-experience-v1`

This map records the implemented native-first scroll choreography. It is a build contract, not a substitute for browser verification.

| Chapter | Meaningful states | Physical range | Primary mechanism | Supporting responses | Mobile fallback | Reduced-motion state |
| --- | ---: | ---: | --- | --- | --- | --- |
| Opening signal | 4 | 112svh desktop | short sticky cinematic frame | root aperture, film drift, signal underline, route index | ordinary full-screen hero | still poster, stable copy |
| Your situation | 3 | natural 100svh | scroll preview plus explicit commitment | orbit signal, changing recommendation, saved visitor state | tap-led path selector | all choices available without motion |
| Six disciplines | 6 | 165svh desktop | compressed vertical-to-lateral journey | moving active rail, changing panel, colour route, progress line | two-column tap rail and panel | unpinned direct explorer |
| Package paths | 3 | natural 100svh | scroll preview plus explicit package choice | water rings, package state, pricing context | tap-led selector | direct package states |
| Verified outcome | 4 proof points | natural 100svh | evidence build | measured bars, numbers, proof copy | normal proof stack | final values visible |
| Brand foundation | 5 layers | 220svh desktop | compressed sticky foundation assembly | connector growth, root metaphor, layer copy, signal wave | authored stacked explanation | complete static system without sticky debt |
| Positioning cost | 4 causal beats / 2 outcomes | 128svh on full-height desktop | sticky focus transfer | cause index, changing consequence, generic-to-distinct comparison | compact path deck | both outcomes visible in normal flow |
| Perception | 4 rungs | natural height | scroll-led diagram construction | signal ascent, changing market consequence, proof companion | simplified progression | complete ladder visible |
| The archive | 5 artifact groups | natural height | scroll-led document drawers | layered papers, artifact drawer, edge light | drawers and tap preview | documents remain readable |
| Project map | 2 decisions + result | natural 100svh | progressive choice deck | expanding frame, project map, regional pricing | short stepper | direct form and result |
| Health check | diagnostic states | natural 100svh | reflection reveal | water line, measured result, package suggestion | simplified diagnostic | static reflection and complete result |
| Recognition audit | 10 checks | natural 100svh | progressive audit | constellation signal, open checks, consent gate | stacked checks | all controls remain usable |
| Strategy room | 1 arrival | natural 100svh | cinematic settling | mineral reflection, quiet CTA, navigation exits | same quiet arrival | poster and stable CTA |

## Global rules now enforced

- Ordinary wheel, trackpad, keyboard, scrollbar, and touch scrolling remain native.
- No wheel listener calls `preventDefault()`.
- No page-wide mandatory snapping is installed.
- `IntersectionObserver` determines the active chapter and media eligibility.
- Scroll-linked visual progress is written to CSS custom properties through one `requestAnimationFrame` loop, rather than React state on every frame.
- The visible-media budget is two films on desktop and one on mobile or constrained devices.
- Form focus pauses nonessential Services films and removes the fixed chapter controls from the active form edge.
- The former full-width bottom navigation is replaced on this route by a compact chapter rail and mobile dial.
- Short desktop viewports fall back to normal flow instead of clipping sticky stages.
- Reduced-motion mode removes every compressed sticky stage and reveals the complete information at rest.
- The final strategy room removes fixed wayfinding so the conversion scene owns the viewport.
