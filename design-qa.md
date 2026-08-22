# Design QA — August 8 refinement

Reference: the deployed August 8 preview before this refinement (`6d618a8c2a93dda16c263f15c57cdbf78742683e`)

Verified preview: `https://branding-tatva-git-august-8-isolated-suman22.vercel.app/`

Desktop viewport: 1348 × 936 in Chrome

## Page-by-page result

| Page | August 8 structure retained | Refinement verified |
| --- | --- | --- |
| Home | Forest hero, editorial type, proof card, chapter navigation and original retained chapters | Hero grade is lighter, header and proof card use warm ivory, consent is compact, and the guided journey is reduced from 13 to 8 chapters. Recognition contrast is corrected, the process chapter is now a light strategy folio, and the remaining cinematic chapters use forest rather than black. Counter reads `01/08`. |
| About | Meadow hero, portrait card, editorial narrative and existing downstream sections | Portrait card is immediately readable. The Psychology + Literature scroll convergence is restored and resolves into the brand-strategy statement. Reduced-motion users receive the complete static version. |
| Work | Original light editorial evidence layout and project selector | Preserved without structural redesign; shared warm header and motion-safety refinements applied. |
| Services | Root-system opening, chapter map, situation, offerings, packages, proof, authority, audit and booking path | Opening is lifted from near-black to forest green. Heavy and redundant scroll chapters are not rendered. Five core service scenes remain, with six clear jump destinations including booking. |
| Insights | Water hero, editorial library introduction and light article section | Existing composition retained; shared header, palette and readable reveal behavior verified. |
| Contact | Image-led introduction and three contact paths | Existing layout retained; shared header and compact consent behavior verified. Call, WhatsApp and enquiry paths remain visible. |

## Interaction and resilience

- Header navigation resolves to Home, Work, About, Brand Strategy & Systems, Insights and Contact.
- Home primary actions resolve to Contact and Work.
- The six-stage process selector remains interactive after the light-theme conversion.
- Reveal content remains readable if an intersection observer or entrance animation fails.
- The About convergence is user-led, short, and has a complete reduced-motion fallback.
- Services no longer renders the heavy `stakes`, `education`, `deliverables`, `imagine`, or `health` scenes.
- `prefers-reduced-motion` collapses animation and transition duration without hiding content.
- Optional analytics remain off until consent, and the booking path is never blocked.

## Build verification

- Production Next.js build: passed after both refinement passes
- 78 static pages generated
- Home: 8 guided chapters
- Redundant process metrics and the duplicated clipped studio caption are removed.
- Services: 5 retained content scenes plus opening and booking destination

final result: passed
