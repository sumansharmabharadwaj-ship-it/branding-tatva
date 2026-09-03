# Parker reference alignment QA

Date: 2026-09-03

## Comparison target

- Source visual truth: `artifacts/parker-reference-pass/reference.jpg`
- About implementation: `artifacts/parker-reference-pass/about-implementation.jpg`
- Insights implementation: `artifacts/parker-reference-pass/insights-implementation.jpg`
- Full view comparisons: `artifacts/parker-reference-pass/about-comparison.jpg` and `artifacts/parker-reference-pass/insights-comparison.jpg`
- CSS viewport: 1363 by 936 pixels
- Captured image size: 1348 by 926 pixels
- Device pixel ratio: 1
- Density normalization: source and implementation captures use the same browser, viewport, and density. No resampling was required before the side by side comparisons.
- States: Parker flat colour explanation scene; About convergence at Read; Insights audit at the default Foundation state.

## Findings

No actionable P0, P1, or P2 mismatch remains.

### Fonts and typography

The implementation matches the reference hierarchy through a large editorial serif, compact sans labels, a quiet navigation wordmark, tight display leading, and concise primary statements. Branding Tatva retains Cormorant Garamond and Manrope because they are established brand assets. The Insights headline was shortened after the first comparison so its wrapping and visual weight now follow the reference rhythm.

### Spacing and layout rhythm

The centred framed header, dark offset shadow, broad flat colour fields, rounded primary frame, and dominant visual region now match the reference composition. The About scene keeps more information than Parker because the psychology and literature relationship is core product content, but the visual hierarchy remains singular. The Insights worksheet continues below the first viewport because its five interactive checks are functional content rather than decorative chrome.

### Colours and visual tokens

The source purple is intentionally translated into Branding Tatva sage and ochre. Cream, black, clay, sage, and ochre remain within the established brand palette. Flat fills and dark outlines replace the earlier low contrast washes and glass layers.

### Image quality and asset fidelity

About uses the existing high resolution psychology and literature folio photograph with the preserved animated synthesis field. Insights uses the topic specific animated brand audit instrument rather than the earlier generic material swatch film. Both images are sharp at the captured desktop size and use deliberate crops.

### Copy and content

The About proposition remains intact. The Insights worksheet now opens with the direct statement “Find where buyer confidence breaks.” Supporting copy explains the five checks without competing with the headline.

## Focused region comparison

The About comparison clearly exposes the header, headline, discipline columns, central folio, framing, border weight, and stage controls. The Insights comparison exposes the header, scene label, dominant film crop, headline, supporting copy, and first worksheet state. Separate crops were unnecessary because all type and control boundaries remain readable in the full resolution comparison files.

## Interaction and runtime checks

- About Connect tab: activated successfully and reported `aria-selected="true"`.
- Insights Foundation control: toggled successfully from `aria-pressed="false"` to `aria-pressed="true"`.
- Header: remains visible at the deep linked About and Insights scenes.
- Console: no application errors were found. Chrome extension metadata messages were excluded because they originate outside the site.
- TypeScript: passed.
- ESLint on changed TypeScript files: passed.
- Production build: passed for all 79 generated pages.
- About journey and resolution gates: passed.
- Homepage conversion, state, truth, analytics, and runtime gates: passed.

## Comparison history

1. First comparison found a P1 navigation mismatch because the shared header disappeared during downward scroll. The hide on scroll state was removed. The final About and Insights captures show the framed header present at both deep linked scenes.
2. First Insights comparison found a P2 collision between the sticky header and the worksheet ledger plus a P2 headline density mismatch. The scene top spacing was increased and the headline was reduced to one direct sentence. The final capture shows clear separation and a shorter four line statement.
3. First About comparison found a P2 risk that the dominant folio could become static. The existing synthesis renderer was restored as an animated overlay on the real folio image. The final capture shows the image led composition with the interaction layer retained.

## Follow up polish

- P3: test the final framed header at one narrow phone viewport during the next dedicated mobile acceptance pass.
- P3: consider reducing the About discipline detail by one row only if user testing shows slower scanning.

## Final result

final result: passed
