# Homepage path reading motion · release 308

## Release

- Source: `828b81229d11f8c9f4789bb8afbec918082ae28c`
- Trigger: `d7e76b5571dc74b5f74afe1a45f230d8965b5680`
- Preview: https://branding-tatva-3sdgdoor7-suman22.vercel.app/#paths
- Deployment: `dpl_5T8HBwAFLXLNsox6M8Do77ZmBqik`, READY, preview target.
- Deployment metadata confirms the trigger and `august-8-isolated` branch.
  Source to trigger changes only the controlled Vercel flag.
- The protected `/api/release` endpoint returned HTTP 302 through the official
  access and fetch tools. Endpoint identity remains unverified; deployment
  metadata and direct acceptance of the changed UI establish this preview.
- TypeScript, changed-file ESLint, homepage source and rendered gates, the
  typography gate, About journey gate, and the production build passed.
  Build: 86 routes, homepage 51.2 kB / 289 kB first load, 487,610 CSS bytes.
- CI passed: controlled preview `35007290646`, homepage `35007290762`,
  Contact regression `35007290563`. Controlled-mode cleanup is `953a18b`.

## Repair

The previous Paths detail was keyed by situation, replacing its action link
whenever scrolling selected another path. On release 305, a keyboard-focused
Full Brand System link lost focus to the document body after a 350 px wheel
gesture selected Ongoing.

The detail and its action now remain mounted. An opt-in guard in the shared
visualizer keeps a focus-visible path panel or descendant in control of the
current selection. Hover and scroll cannot replace that reader's destination.
After focus leaves, genuine scroll intent resumes the timeline. Other hook
consumers retain their existing behavior.

Animation controls replay the two reading columns without rebuilding them.
The title and description share one transform, preserving their reading gap.
The scope card turns directionally on desktop; compact screens use a short
translation with no rotation. Three decisions enter at 55 ms intervals with
a finite CSS animation. Both motion preferences cancel that stagger, and
reading focus immediately settles the column transforms. Arrow-key focus
uses preventScroll.

Three existing Contact typography baseline entries moved after release 307.
Their declarations were checked against the earlier source before relocating
the references. The baseline still contains the same 239 entries.

## Live acceptance · 15 September 2026

| Check | Observed result |
| --- | --- |
| Desktop 1440 × 900 | Client and scroll widths both 1425 px. Paths has an 1800 px runway. |
| Focused panel | After selecting Beginning, native Tab reached the panel. A 620 px wheel gesture retained focus and Beginning, with the section at −504.64 px. |
| Focused action | The next Tab reached `/services#package-brand-beginning`. A further 350 px wheel gesture retained both focus and the same destination, with the section at −854.64 px. |
| Scroll handoff | Tab moved to the audit footer link. A new wheel gesture resumed Ongoing, and reverse scrolling stepped through Reposition at −444.64 px and Beginning at −94.64 px. |
| Keyboard controls | Native ArrowRight, End and Home selected paths 1, 2 and 0 and moved tab focus correctly. ScrollY stayed exactly 6884 throughout. |
| Reading geometry | Heading/description gap stayed 19.1875 px, including the initial desktop transition with copy translation −30/12 px and scope translation 38 px / rotation −9°. Decision delays were 0, 55 and 110 ms. |
| Mobile 390 × 844 | Client and scroll widths both 375 px. Native selection updated the path. Text gap stayed 16 px; action width 327 px and height 49.59 px. No measured text, link, decision or button crossed the viewport. |
| Motion pause | Native selection changed Reposition to Beginning while paused and exposed the Foundation destination. Copy translation and all decision animations were absent; the scope matrix retained only perspective with zero movement or rotation. Full motion was restored. |
| Narrow 320 × 720 | Client and scroll widths both 305 px. Controls measured 44.80 px high. Native Ongoing selection preserved a 16 px text gap and zero scope rotation. The 257 × 49.59 px action, complete 369.59 px scope card, and footer remained reachable by normal scrolling, with no horizontal overflow. |

Screenshots and DOM readings used the deployed responsive QA route. Native
input established the scroll and focus results. Site motion pause was tested
directly; the matching OS reduced-motion CSS fallback was verified in source.
Temporary review tokens are omitted.
