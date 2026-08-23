# Branding Tatva motion and layout QA

## Outcome

Status: passed for the desktop reference viewport after remediation.

The August 8 composition remains the visual source of truth. Timed presentation controls were removed from the narrative visualizers and replaced with a reversible scroll timeline plus inspect-on-hover/focus behavior. The restored Psychology + Literature visualizer remains present on both the homepage and About page.

## Comparison inputs

- Source visual: `/workspace/scratch/a3d8518ad1d9/upload/Screenshot 2026-08-23 at 9.54.49 PM.png`
- Implementation: browser-rendered `http://terminal.local:4173/` and `http://terminal.local:4173/about`
- Reference sites reviewed before implementation: Izanami Official, Parker, Rectangles, and the supplied reference bank.
- QA viewport: 1363 × 936 CSS pixels, DPR 1, Chrome cloud browser.

## Intent preserved

- Warm, light earth-tone presentation with forest/sage/clay accents.
- August 8 page structure and editorial serif typography.
- Psychology and Literature shown as two disciplines converging into one applied system.
- Cinematic dark interludes retained only where they create rhythm and proof, not as the dominant page theme.

## Interaction contract

- Scroll position advances and reverses every narrative visualizer.
- Hover or keyboard focus temporarily inspects a stage without starting a timer.
- Clicking a tab provides an accessible manual fallback.
- Releasing a hover/focus preview returns the scene to its scroll-derived stage.
- Reduced-motion users receive stable document flow without sticky cinematic runways.
- No storytelling section exposes `PLAYING`, `PAUSED`, or a play-button control.

## Remediation log

| Severity | Finding | Resolution |
| --- | --- | --- |
| P1 | Process runway exceeded its outer chapter and was clipped by the next section. | Outer chapter now owns the full scroll runway; the board remains sticky and fully visible. |
| P1 | Evidence shell inherited flex centering, delaying sticky engagement and clipping its index. | Scene wrapper now uses block ownership; the shell pins at `top: 0` and fits the viewport. |
| P1 | Homepage Studio grid was partially above the viewport. | Sticky ownership moved to the complete studio grid and the outer wrapper no longer clips it. |
| P1 | Insights shell inherited `height: 100%` from a higher-specificity fit stylesheet and became 215svh tall. | A higher-specificity scroll override now fixes the shell at 100svh while preserving its grid layout. |
| P2 | Process scene had excessive empty space above the information architecture. | Sticky shell aligns content from the top with a bounded header offset. |
| P2 | Timers could advance while a visitor was reading or report a playing state unrelated to scroll. | All key homepage/About stories now use one scroll-driven state hook. |
| P2 | Shared cue text was vulnerable to broad descendant span rules. | Cue labels, instructions, and counters now receive explicit readable inline styles. |

## Verification

- Production build: passed (`npm run build`).
- TypeScript: passed (`tsc --noEmit`).
- Horizontal overflow: none at the tested viewport on homepage and About.
- Sticky fit: Process, Evidence, Studio, Insights, About Convergence, and About Evidence measured at 936px and pinned at the viewport top.
- Accessibility state: visualizer tabs expose `role="tab"`, `aria-selected`, keyboard focus, and manual selection.
- Runtime console: no application errors observed; only browser-extension metadata errors were present.
- Visual comparison: the Psychology + Literature composition, cards, typography, and stage structure match the supplied source while replacing the timed player with a scroll cue.

## Residual coverage

The cloud browser viewport is fixed, so mobile behavior was verified through responsive CSS and reduced-motion fallbacks rather than a second resizable browser capture. Desktop/fine-pointer sticky motion is intentionally gated behind `min-width: 1181px`, `min-height: 761px`, and `pointer: fine`; smaller/touch devices keep ordinary flow.
