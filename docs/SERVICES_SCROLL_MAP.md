# Branding Tatva Services scroll map

Branch: `services-scroll-experience-v1`

This map records the implemented native-first scroll choreography. It is a build contract, not a substitute for browser verification.

| Chapter | Meaningful states | Physical range | Primary mechanism | Supporting responses | Mobile fallback | Reduced-motion state |
| --- | ---: | ---: | --- | --- | --- | --- |
| Opening signal | 4 | 112svh desktop | cinematic camera drift | aperture line, living root film, copy drift | ordinary full-screen hero | still poster, stable copy |
| Your situation | 3 | natural 100svh | interactive diagnosis | orbit signal, environmental film, saved visitor state | tap-led path selector | all choices available without motion |
| Six disciplines | 6 | 165svh desktop | short CSS-sticky stage driven by native vertical scroll | active discipline, panel copy, colour route, progress line | normal tap-led explorer | unpinned direct explorer |
| Package paths | 3 | natural 100svh | interactive current selector | water rings, package state, pricing context | tap-led selector | direct package states |
| Verified outcome | 4 proof points | natural 100svh | evidence build | measured bars, numbers, proof copy | normal proof stack | final values visible |
| Brand foundation | 5 layers | existing short sticky scene | foundation assembly | connector growth, root metaphor, layer copy | authored stacked explanation | complete static system |
| Positioning cost | 2 paths | natural 100svh | focus comparison | aperture, cause/outcome deck, material backdrop | compact path deck | both outcomes visible |
| Perception | progressive ladder | natural 100svh | diagram construction | signal ascent, ladder state, terrain clarity | simplified progression | complete ladder visible |
| The archive | 5 artifact groups | natural 100svh | document explorer | layered papers, artifact drawer, edge light | drawers and tap preview | documents remain readable |
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
- Form focus pauses nonessential Services films.
- The former full-width bottom navigation is replaced on this route by a compact chapter rail and mobile dial.
- The final strategy room removes fixed wayfinding so the conversion scene owns the viewport.
