# Branding Tatva motion and layout QA

## Outcome

Status: passed at the supplied desktop reference viewport after remediation.

The August 8 composition remains the source of truth. The repair keeps its layouts and editorial character, moves the dominant palette toward warm ivory and earth tones, removes broken inter-scene bands, and makes scroll/hover the interaction model. The Psychology + Literature visualizer remains present on both Home and About.

## Comparison inputs

- August 8 layout source: `/workspace/scratch/a3d8518ad1d9/upload/Screenshot 2026-08-23 at 4.21.04 PM.png`
- Psychology + Literature source: `/workspace/scratch/a3d8518ad1d9/upload/Screenshot 2026-08-23 at 9.54.49 PM.png`
- Reported homepage failures: the seven screenshots dated `2026-08-24 11.44–11.46 AM` in the upload folder.
- QA viewport: 1363 × 936 CSS pixels, DPR 1, Chrome cloud browser.

## Interaction contract

- Scroll position advances and reverses each narrative visualizer.
- Hover or keyboard focus temporarily inspects a stage; leaving returns to the scroll-derived stage.
- Clicking a tab remains an accessible manual fallback.
- Visible ambient video plays; offscreen media pauses.
- Reduced-motion users receive stable document flow without sticky cinematic runways.
- No storytelling section exposes a play button or timer-shaped presentation control.

## Remediation log

| Severity | Finding | Resolution |
| --- | --- | --- |
| P1 | Painted handoff components consumed space and created the white/black horizontal bands shown in the supplied captures. | Handoffs remain semantic separators but now consume and paint exactly `0px`; chapters meet continuously. |
| P1 | Sticky scene contents exceeded the viewport and leaked into adjacent chapters. | Recognition, Foundation, Process, Evidence, Studio, and Insights now own measured 100svh authored frames inside their longer scroll runways. |
| P1 | Assisted/trackpad scrolling could miss a Framer motion-value frame and leave a visualizer on the wrong stage. | The shared visualizer now includes a requestAnimationFrame-synchronised window-scroll fallback derived from the real section runway. |
| P1 | Homepage Studio used a portrait file with a baked grey lower half, producing a large empty-looking column. | Studio now uses the complete portrait asset with a full-height cover crop and no translating transform. |
| P2 | Insights topic names, especially “Distinctiveness”, could overrun narrow cards. | Cards and headings now allow shrinkage and safe wrapping without horizontal overflow. |
| P2 | The Services authority transition reached an over-dark final state that made copy appear missing. | The handoff runway and maximum veil opacity were reduced; all five final layers remain readable. |
| P2 | Timed/player language suggested passive viewing despite the requested visitor-controlled experience. | Controls now communicate Scroll; movement is driven by scroll and inspect-on-hover/focus. |

## Verification

- Production build: passed (`npm run build`, including TypeScript and lint checks).
- Static generation: 77 routes completed.
- Horizontal overflow: `0px` on Home, About, Services, and Insights at the QA viewport.
- Empty handoff bands: all seven homepage handoffs measured `clientHeight: 0` and `scrollHeight: 0`.
- Sticky fit: all six primary homepage narrative frames measured exactly 936px high with no internal viewport overflow.
- Recognition timeline: forward `01 → 02 → 03`, reverse `03 → 02`; hover preview returns to the scroll state on release.
- Homepage Studio timeline: forward `01 → 02 → 03`, reverse `03 → 02`.
- About Convergence timeline: forward `01 → 02 → 03`, reverse `03 → 02`.
- Visible media: ready state `4`, actively playing; offscreen video paused.
- Insights “Distinctiveness”: heading right edge remained inside its card and document overflow stayed `0px`.
- Services final authority layer: all five layer groups reached computed opacity `1` and remained readable.
- Work navigation: absent; `/work` resolves away from a standalone Work index.

## Residual coverage

The fixed cloud browser viewport matches the supplied desktop failures. Smaller/touch layouts are handled by the existing flow-mode and reduced-motion CSS gates; they do not use the desktop sticky runways.
