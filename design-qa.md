# Design QA: Recognition Field Notes · 2026-09-03

**Findings**

- No actionable P0, P1, or P2 mismatch remains. The selected field-notes direction is now a live, responsive recognition check rather than a decorative recreation.
- [P3] The source mock's drawn connector line and separate lock tab are simplified in the implementation. The privacy statement remains explicit, and the omission keeps the live question, tabs, answer states, and mobile layout readable.

**Target and evidence**

- Source visual truth: `/workspace/scratch/41664d6afc73/generated_images/exec-ce9a175f-834a-40e4-a426-fc4597fbd34b.png` (`1487 × 1058`).
- Generated production asset: `public/images/generated/bt-services-recognition-field-notes.webp` (`1536 × 1024`, 80 KB).
- Implementation route: `/services#audit`.
- Desktop browser capture: `/workspace/scratch/services-field-notes-evidence/bt-services-recognition-audit-desktop-final-1363x936.jpg` (`1348 × 926` image from a `1363 × 936` CSS viewport, DPR `1`; the browser capture excludes scrollbar pixels).
- Mobile browser capture: `/workspace/scratch/services-field-notes-evidence/bt-services-recognition-audit-mobile-390x844.jpg` (`390 × 844` image and CSS viewport, DPR `1`).
- Full-view comparison: `/workspace/scratch/services-field-notes-evidence/source-implementation-comparison.jpg`. Both uncropped images were normalized to `800` px height and placed in one comparison image.
- Focused paper-panel comparison: `/workspace/scratch/services-field-notes-evidence/source-implementation-focused-comparison.jpg`. Source and implementation question-panel crops were normalized to `800` px height and placed in one comparison image so type, paper, tabs, and answer controls remained readable.
- State: question 1, no answers selected, full motion. Mobile was also checked at question 3 and in reduced-motion mode.

**Comparison history**

| Pass | Severity | Visible finding | Fix and post-fix evidence |
| --- | --- | --- | --- |
| 1 | P2 | On `390 × 844`, the answer controls initially fell below the first frame and inactive tabs were too quiet. | Compressed the mobile introduction and paper spacing, strengthened the five tab states, and preserved 44–48 px controls. The final mobile capture shows both answer actions in the first frame; `scrollWidth` is `375` within a `390` px viewport. |
| 2 | P2 | The live desktop question hierarchy was materially smaller than the selected mock. | Added density-aware display sizing for standard and longer questions. The final full and focused comparisons show the same three-line opening question and editorial hierarchy as the source. |
| 3 | P2 | Opening the email handoff could focus before the animated form mounted, leaving focus on the trigger and making the transition less clear. | Focus now moves when the form heading actually mounts, with `preventScroll`. Browser verification found the heading focused and only a `22` px settling delta while the form entered. |

**Required fidelity surfaces**

- Fonts and typography: the existing display and sans families carry the source's editorial contrast; the question uses optical display sizing, balanced wrapping, and a compact treatment only for longer prompts. Small labels retain uppercase spacing and remain legible.
- Spacing and layout rhythm: desktop preserves the left thesis, leather folio, five paper tabs, dial, private note, and continuation pocket. Mobile reflows those same parts into a single readable stack without horizontal overflow or hidden primary actions.
- Colors and visual tokens: warm mineral paper, forest leather, kraft tabs, muted ink, and clay accents match the selected direction while using the page's existing ivory, forest, and sandstone language.
- Image quality and asset fidelity: a project-owned `1536 × 1024` generated WebP provides the paper, leather, dial, pocket, and leaf-shadow detail. It is eagerly loaded for direct hash visits and remains sharp at the tested desktop and mobile crops.
- Copy and content: all ten recognition statements, the private-first-five promise, score guidance, email handoff, consent language, and Strategy Room publishing behavior remain intact.
- Interaction and accessibility: the tabs use tab/tabpanel semantics, Arrow keys plus Home/End work, answer states advance predictably, controls meet a 44 px mobile floor, focus enters the email handoff, and reduced motion reports a `0.00001s` tab transition.

**Verification**

- Desktop keyboard test: Question 2 + ArrowRight selected Question 3 and updated the panel.
- Private flow test: five positive answers produced `5 of 5 answered`, unlocked the complete-check handoff, and focused its heading. No form data was entered or submitted.
- Mobile test: `390 × 844`, both answer actions visible, tabs navigable by keyboard, no horizontal overflow.
- Reduced-motion test: the site toggle set `data-motion="reduced"` and collapsed the tab transition to `0.00001s`; full motion was restored afterward.
- Browser console: no application-origin errors. The cloud browser's existing extension metadata bridge logged extension-only errors.
- `npm run build`: passed; all 79 static pages generated and `/services` typechecked successfully.

**Implementation Checklist**

- [x] Match the selected field-notes composition with a real generated image asset.
- [x] Preserve the existing recognition logic and newsletter endpoint.
- [x] Make the first five questions private and the remaining five consent-gated.
- [x] Verify desktop, mobile, keyboard, focus, motion preference, console, and production build.

**Follow-up Polish**

- If the source illustration is ever rebuilt as a fully bespoke interactive asset, the decorative connector and lock tab could return as image details without compromising the responsive UI.

## Final result

passed

---

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
