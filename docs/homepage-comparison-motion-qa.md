# Homepage comparison motion · release 305

## Release and verification

- Source: `61ab48213fb6e3ae8d1f5d3d7f379d7304561921`
- Trigger: `cec290b80afb05213086ae51a87c9679af6133b9`
- Preview: https://branding-tatva-cyue3ms1k-suman22.vercel.app/
- Deployment: `dpl_4Z1JvRNeo7PN3fHr24tTGruL5E21`, READY, preview only.
- Source to trigger diff contains only the controlled deployment flag.
- `/api/release` returned HTTP 200 with the exact trigger, `august-8-isolated`
  branch, and `preview` environment.
- TypeScript, changed component ESLint, homepage source, typography, production
  build, and rendered homepage checks passed. Build: 86 routes, homepage
  51 kB / 289 kB first load, 487,557 CSS bytes.
- All three CI workflows passed: controlled preview `35003528051`, homepage
  contract `35003527982`, Contact delivery regression `35003527984`.

## Changes

The message comparison now uses one sliding selection pill, three staggered
message transitions, and channel rules that draw with the card's actual eased
entrance. The rules retrace on reverse scroll. In Shared position, their three
earth tones resolve to the same clay tone.

SceneRhythm publishes the comparison's local arrival from its existing frame
loop. No new scroll listener or scroll interception was added. Text uses a
finite CSS animation, allowing a motion preference change to cancel it without
waiting for React to replace the selected message. Desktop has a short tilt;
compact and touch layouts use a smaller translation with zero tilt.

The original sample measurement cells still reserve the larger of each pair.
Buttons, message rows, and status remain mounted. Only the selected message
span is replaced, with full opacity throughout.

A separate repair removes Recognition's legacy text-fill declaration, which
was painting solid letters over the release 303 gradient. Its original solid
color remains the fallback when ink motion is disabled.

## Live acceptance · 15 September 2026

| Check | Observed result |
| --- | --- |
| Recognition paint | Text fill is transparent with `background-clip: text` and the intended opaque clay gradient. Reverse scrolling changed progress to 0.698 and background position to 30.2%. Pausing restored solid `rgb(128, 82, 57)` and no background. |
| Desktop 1440 × 900 | Document client and scroll widths both 1425 px. Card width 597 px, height 438 px, three 72 px rows and two 44 px controls. Card and row heights stayed identical across both modes. |
| Scroll reversal | Card arrival decreased from 0.8677 to 0.5854; the three rule scales became 0.81956, 0.65956 and 0.49956. All resolved to 1 in the reading position. |
| Shared selection | Message delays were 0, 55 and 110 ms. All three rules resolved to `rgb(128, 82, 57)`, text transforms settled to identity, and the pill moved 263.656 px into the second button cell. |
| Keyboard | Native click, Tab and Enter selected Shared position, retained focus on its button, exposed the correct pressed states, and kept the 438 px card height. |
| Mobile 390 × 844 | Client and scroll widths both 375 px. Card height remained 426 px in both modes; rows remained 72 px. Controls were 57 px high, message tilt was zero, and no controls or messages extended outside the viewport. |
| Motion pause | Mode switching worked while paused. All three message animations and transforms were `none`, the arrival property was removed, and all rule transforms were `none`. The site's global reduced-motion override gave the pill and rules an effectively immediate 0.00001 s transition. Card height remained 426 px. Full motion was restored. |
| Narrow 320 × 720 | Client and scroll widths both 305 px. Card height remained 450 px with row heights 72, 96 and 72 px in both modes. Both controls were 57 px high. No controls or message text extended outside the viewport. The selector settled 106.312 px into its second cell. |

Screenshots and live DOM readings were taken through the deployed homepage's
existing responsive QA route. Site motion pause was tested directly; system
reduced motion is handled by the component's matching CSS media rule.
