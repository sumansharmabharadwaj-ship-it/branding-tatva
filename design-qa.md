# Design QA log

## Studio scroll continuation — 2026-09-10

### Scope and visual evidence

- Reference: release 212 Studio chapter, Psychology selected, pinned at the top of a 1363 × 936 viewport.
- Compared the reference screenshot and local implementation screenshot together in one browser output. The reference remains the visual target; Parker supplies only the vertical, visitor-led motion principle.
- Kept all copy, imagery, portrait treatment, colors, borders, surfaces, tab order and routes. No new visual asset was introduced. The headline now uses two lines on the tested desktop, with a viewport-aware size; tighter panel spacing leaves the complete footer visible at 831px, clear of the fixed guidance control. The original footer reached 901px when pinned.
- Desktop grid: 936px high, sticky at 0; outer scene: 2246px (unchanged 240svh runway); horizontal overflow: 0.
- Mobile: screenshots at the existing 390 × 844 QA preset show the original single-column reading layout. Selecting Literature updates its heading, result and MyShopInEurope proof link.

### Interaction and accessibility checks completed

- Desktop scroll advances to Literature with the correct heading.
- End key selects Strategy; keyboard traversal reaches `/work/dr-haley-nutrition`.
- While that link has visible keyboard focus, scrolling back to progress 0.5098 retains Strategy and the same focused link.
- Activating the site's reduced-motion control releases the grid to `position: relative`, collapses the section to 936px and removes the portrait transform.
- Browser console showed only a cloud-browser extension metadata error, not an application-origin error.
- Unit/source gate covers collapsed runways, forward/reverse steps, boundary hysteresis, listener cleanup, keyboard ownership and both reduced-motion fallbacks.
- Production build (79 routes), homepage source gate, built homepage gate and controlled-deployment self-test passed after integrating upstream release 214.

### Remaining verification / release gate

The local preview service stopped during short-laptop navigation, which returned `ERR_CONNECTION_REFUSED`. Its status confirms stopped. Earlier browser input commands also intermittently timed out; successful state reads above were verified separately rather than inferred from those commands.

Short-laptop/tablet visual inspection and an unpaused reverse-scroll browser check remain pending. Do not treat source tests as substitutes for these checks. Do not publish this continuation until the preview can be restored and the remaining checks pass. No deployment or authentication settings were changed.

final result: blocked

---

## Contact gratitude continuity

- Date: 2026-09-09 UTC
- Source visual: https://heyparker.ai/?utm_source=chatgpt.com
- Protected production route: https://branding-tatva-git-august-8-isolated-suman22.vercel.app/contact
- Implementation: cloud-browser local Contact route; screenshots were compared inline and were not persisted
- Comparison viewport: 1363 × 936 CSS px at DPR 1 (captured frame: 1348 × 926 px)
- Responsive viewport: 390 × 844 preset (375px document content width)

### Fidelity review

The reference and implementation were viewed together at the same desktop viewport. Parker's art direction was not copied. Its useful motion principle—a clear path that carries attention through sequential content and resolves into the next action—was translated into Branding Tatva's existing closing landscape, typography, sandstone accent, copy, and four acknowledgements.

1. Structure and composition: passed. The authored split composition, thank-you statement, acknowledgement ledger, next actions, film crop, and chapter rail remain unchanged. The desktop ledger now has one continuous scroll-linked spine without adding a new card or changing the section geometry.
2. Typography, copy, and hierarchy: passed. All Branding Tatva copy, display typography, small-cap metadata, acknowledgement order, and CTA labels are preserved. The active desktop label moves only 0.35rem, enough to clarify the current receipt without disturbing the editorial rhythm.
3. Colour, material, and light: passed. The cue uses the existing sandstone tone and a low-opacity ivory blend. Keyboard focus is a calm 1px inset sandstone edge instead of a heavy white outline. The spine releases to 58% opacity and zero glow after completion so the existing primary CTA receives the final emphasis.
4. Responsive geometry: passed. At the 390 × 844 preset, the document client width and scroll width both measured 375px. The notes remain a 327px two-column grid, the fourth label wraps cleanly, the desktop spine is hidden, and there is no horizontal overflow.
5. Motion and interaction: passed. Scroll receives acknowledgements cumulatively; the shared focus baton and response follow the active receipt; reverse and manual inspection preserve receipts; completion resolves once; manual keyboard inspection re-energizes the spine; and reduced motion removes the spine and label transforms.

### Issues closed

- P2: The four acknowledgements had no continuous visual path. Added a single desktop scroll-linked sandstone spine that completes with the fourth receipt.
- P2: Keyboard focus used a heavy white outline. Replaced it with an inset sandstone focus treatment and soft local halo.
- P2: The active row was too quiet at desktop size. Added a restrained 5.6px label handoff within the existing moving baton.
- P2: The progress glow remained equally active after completion. Added a finite 0.72s release to 58% opacity with no shadow, while restoring full energy during intentional inspection or revisit.
- P2: A desktop cue could have leaked into mobile or reduced motion. Limited label travel to desktop, hid the spine below 1024px, retained the ledger-based mobile progress source, and reset both transforms under explicit and system reduced-motion modes.

### Interaction evidence

- Receiving state: sequence focus `3`; `your candour` active; label transform `matrix(1, 0, 0, 1, 5.6, 0)`; spine scale `0.952381`; opacity `1`; sandstone 18px glow; first three receipts preserved.
- Settled state: four receipts preserved; completion and settled flags true; response phase `resolved`; no active note; spine settled flag true; opacity `0.58`; shadow `0` after the finite release.
- Keyboard state: first acknowledgement focused and selected; `:focus-visible` true; 1px inset sandstone edge plus 28px low-opacity halo; response phase `inspection`; spine restored to opacity `1` and the active glow.
- Reduced-motion state: document and component report `reduced`; active label transform `none`; spine transform `none`.
- Mobile full-motion state: all four acknowledgements received and settled; label transform `none`; spine display `none`; no horizontal overflow.
- Console: no app-origin errors in the final desktop and mobile sessions. Browser-extension errors were excluded from application QA.

### Automated verification

- `git diff --check`: passed
- Targeted ESLint: passed
- `pnpm run check:contact`: passed
- `pnpm exec tsc --noEmit`: passed
- `pnpm run build`: passed; 79 static routes generated

No P0, P1, or P2 visual, interaction, responsive, accessibility, or motion issues remain in the scoped gratitude refinement.

---

## Final conversation scroll pacing

### Evidence

- Source visual truth: release 145, `https://branding-tatva-cyp020aeb-suman22.vercel.app/qa/homepage-responsive?path=%2F&preset=desktop`
- Implementation: release 148, `https://branding-tatva-d8p4t91ce-suman22.vercel.app/qa/homepage-responsive?path=%2F&preset=desktop`
- Mobile implementation: release 148, `https://branding-tatva-d8p4t91ce-suman22.vercel.app/qa/homepage-responsive?path=%2F&preset=mobile`
- Browser-rendered source and implementation screenshots were emitted together in one comparison input.
- Capture pixels: 1348 × 926 for both desktop screenshots.
- CSS comparison viewport: 1440 × 900 in the responsive QA iframe; identical outer crop and browser density were used for both captures.
- Desktop state: the source final invitation versus the released held invitation with step 03 active. Separate browser captures verified steps 01, 02, and 03 under visitor scroll.
- Compact state: 390 × 844 CSS viewport with the invitation in normal document flow.

### Findings

- No actionable P0, P1, or P2 differences.
- The approved composition, typography, copy, imagery, CTA, grid, and spacing remain intact. The only intentional desktop change is the sequential focus treatment on the three agenda rows while the section holds.
- Fonts and typography: display and body families, weights, line heights, wrapping, and hierarchy remain consistent with the source. Active-row color emphasis does not change type metrics.
- Spacing and layout rhythm: the desktop frame stays composed at 1440 × 900 while scroll advances the agenda. The compact 390 × 844 layout keeps the original linear flow and does not inherit the extended scroll runway.
- Colors and visual tokens: the active row reuses the existing clay/brown palette; inactive opacity remains legible and preserves the warm neutral balance.
- Image quality and asset fidelity: the existing silver-tide video treatment and all supplied assets are unchanged; no substitute or generated assets were introduced.
- Copy and content: all section labels, agenda text, support copy, and CTA labels are unchanged.

### Full-view comparison evidence

The same 1348 × 926 browser capture input contained the release 145 source and release 148 implementation. The section boundaries, two-column proportion, headline wrapping, CTA placement, agenda alignment, and closing sign-off match. The implementation adds only the intended state emphasis and held scroll timing.

### Focused-region comparison evidence

A separate crop was not required because the final invitation fills the 1440 × 900 QA viewport and all typography, row borders, CTA details, and copy are legible in the full-view comparison. Three additional full-view states confirmed the active border, number, and heading move from steps 01 to 03 without layout shift.

### Primary interactions tested

- Desktop visitor scroll advances agenda focus in order: 01 → 02 → 03.
- The invitation remains held while each beat changes and releases naturally into the footer.
- The primary CTA remains visible, enabled, and links to `/contact#call`.
- The 390 × 844 mobile preset keeps all agenda items in normal document flow.
- The in-page reduced-motion control removes the 210svh desktop runway and restores the section to approximately one viewport height.
- Browser console checked on desktop and mobile. No application errors were present; only unrelated cloud-browser extension metadata errors appeared.

### Comparison history

- Pass 1: no actionable P0/P1/P2 differences. No visual correction iteration was required.

### Implementation checklist

- [x] Preserve approved visual design and content.
- [x] Add visitor-controlled held pacing to the final conversation.
- [x] Verify three desktop states.
- [x] Preserve mobile and reduced-motion flow.
- [x] Verify CTA and console state.

### Follow-up polish

- None required for this pass.

final result: passed

---

## Contact gratitude vertical response cadence

### Evidence

- Source visual truth: `/tmp/contact-gratitude-reference-parker-current.png` in the cloud browser runtime, captured from `https://heyparker.ai/?utm_source=chatgpt.com`.
- Implementation screenshot: `/tmp/contact-gratitude-refined-response-current.png` in the cloud browser runtime, captured from the local Contact route at `#thanks` after the current build.
- Paired comparison: `/tmp/contact-gratitude-paired-review.png` in the cloud browser runtime. Both captures were emitted together in one comparison input before this review.
- Source and implementation captures: 1348 × 926 px at a 1363 × 936 CSS viewport and DPR 1. The paired review normalised each capture to 674 × 463 px without changing crop or density.
- Comparison state: Parker hero with its single downward reading invitation; Branding Tatva gratitude with all four receipts complete, acknowledgement 04 held open, the status settled to `enough to begin`, and progress at `04 / 04 · enough`.
- Responsive evidence: 390 × 844 QA frame with a 375px document width.

### Findings

- No actionable P0, P1, or P2 differences remain in the scoped motion refinement.
- Fonts and typography: the existing display and body families, weights, line heights, wrapping, and small-cap labels are unchanged. The response and status transitions preserve their original text metrics.
- Spacing and layout rhythm: the split composition, ledger width, row heights, response minimum height, progress line, and CTA placement are unchanged. The new movement stays inside the existing clipped response and status regions, so it creates no layout shift.
- Colors and visual tokens: no palette, opacity, surface, border, or shadow token changed.
- Image quality and asset fidelity: the existing meadow film, poster, crop, and wash are unchanged. No asset was added or substituted.
- Copy and content: every visible Branding Tatva label, acknowledgement, response, completion phrase, and CTA is preserved.
- Motion and interaction: response copy now enters from below and leaves above with a finite 9px masked handoff, matching the ledger's vertical reading path. Reverse inspection naturally inverts the handoff. The final ledger status uses one finite 6px settle instead of snapping. Both use the existing Air easing, do not loop, and resolve to `transform: none`.
- Accessibility and responsiveness: the active acknowledgement keeps `aria-current="step"`, the current response remains available in non-live screen-reader text, and deliberate activation alone updates the polite announcement. Explicit and system reduced-motion rules remove transforms from both new beats. The 390 × 844 frame remains within its 375px document width and the desktop reading head stays hidden.

### Full-view comparison evidence

The paired input confirms that Parker's useful principle is a single clear scroll direction and a finite transfer of attention. The implementation now carries the acknowledgement response along that same vertical direction while retaining Branding Tatva's meadow, earthy palette, editorial typography, copy, and asymmetrical composition. Parker's device image, outlined navigation, cream palette, typography, and layout were intentionally excluded.

### Focused-region comparison evidence

A separate crop was unnecessary because the gratitude ledger is readable in the 1348 × 926 implementation capture. Browser-rendered DOM evidence confirmed `data-contact-gratitude-response-direction="vertical"`, six response beats, one status beat, acknowledgement 04 active, the matching unfinished-thought response visible at opacity 1 and `transform: none`, and the final status and progress text settled without horizontal overflow.

### Primary interactions tested

- Opening acknowledgement 01 moved the active state and visible response to the matching time response.
- Opening acknowledgement 04 moved the active state and visible response to the matching unfinished-thought response.
- The selected acknowledgement retained `aria-current="step"` and stayed readable through completion.
- After the 920ms completion hold, the scene reported settled, the ledger status read `enough to begin`, progress read `04 / 04 · enough`, and the next action reported ready.
- Desktop document client width and scroll width matched; no horizontal overflow was introduced.
- Browser console contained no application-origin errors or warnings. Cloud browser extension metadata errors were excluded from application QA.

### Comparison history

- Pass 1: no actionable P0, P1, or P2 difference. The motion-only change preserved the approved frame while making the response and completion tempo follow the reference's vertical reading principle.

### Implementation checklist

- [x] Preserve approved copy, imagery, palette, typography, layout, and routes.
- [x] Align response motion with the vertical acknowledgement path.
- [x] Add one finite completion-status settle.
- [x] Preserve cumulative receipts, reverse inspection, keyboard state, and screen-reader semantics.
- [x] Add explicit and system reduced-motion protection.
- [x] Verify build, source contracts, browser interaction, responsive fit, and console state.

### Follow-up polish

- None required for this pass.

final result: passed

---

## Final handoff camera drift

### Evidence

- Source visual truth: release 154, `https://branding-tatva-aumv2fdqy-suman22.vercel.app/qa/homepage-responsive?path=%2F&preset=desktop`
- Implementation: release 158, `https://branding-tatva-h21okox68-suman22.vercel.app/qa/homepage-responsive?path=%2F&preset=desktop`
- Mobile implementation: release 158, `https://branding-tatva-h21okox68-suman22.vercel.app/qa/homepage-responsive?path=%2F&preset=mobile`
- Browser-rendered source and implementation screenshots were emitted together in one comparison input.
- Capture pixels: 1348 × 926 for both desktop screenshots.
- CSS comparison viewport: 1440 × 900 in the responsive QA iframe; identical scroll position and outer crop were used.
- Comparison state: FAQ open on question 01 with the final invitation immediately below, before the new exit drift begins.
- Motion states: final invitation progress 0.08, 0.50, and 0.90; explicit reduced-motion mode; 390 × 844 mobile preset.

### Findings

- No actionable P0, P1, or P2 differences.
- Structure and composition: the approved FAQ split, invitation frame, two-column proportions, section boundaries, and opening composition remain unchanged. The new movement begins only during the final FAQ exit and invitation runway.
- Typography and copy: headline wrapping, editorial hierarchy, labels, answers, CTA copy, and sign-off are unchanged.
- Colour and material: the warm paper, sandstone rules, dark closing film, and existing contrast relationships are unchanged.
- Image quality and crop: the existing golden-fog and silver-tide media remain untouched. The invitation film receives a restrained 1.05 → 1.00 scale settle and 0.8% → 0% horizontal drift without exposing an edge.
- Responsive geometry: at the 390 × 844 preset, client width and scroll width both measured 375px. The FAQ remains a clean single-column flow and the invitation camera transform is `none`.

### Primary interactions tested

- Desktop visitor scroll advances invitation focus 01 → 02 → 03.
- Camera transforms measured `matrix(1.04612, …, 10.1821, 0)`, `matrix(1.02596, …, 3.86389, 0)`, and `matrix(1.00521, …, 0.74214, 0)` across the three sampled states.
- The primary CTA remains visible and links to `/contact#call`.
- Explicit reduced motion settles the invitation to approximately 907px, resets the active step to 01 on scroll, and removes the camera transform.
- Mobile preserves normal flow, keeps the invitation at step 01, removes the camera transform, and has no horizontal overflow.
- Browser console showed no application-origin errors. Repeated cloud-browser extension metadata errors were excluded from application QA.

### Comparison history

- Pass 1: source and implementation matched at the shared FAQ-to-invitation state. No visual correction iteration was required.

### Implementation checklist

- [x] Preserve the approved visual identity, imagery, copy, and opening.
- [x] Use Parker only as a reference for scroll pacing and camera restraint.
- [x] Add the FAQ exit handoff and invitation camera settle.
- [x] Verify desktop states 01, 02, and 03.
- [x] Verify reduced-motion and mobile behavior.
- [x] Verify CTA destination and runtime console.

### Follow-up polish

- None required for this pass.

final result: passed

---

## Contact gratitude reading-head handoff

### Evidence

- Source visual truth: `/tmp/contact-gratitude-reference-parker.png` in the cloud-browser runtime, captured from `https://heyparker.ai/?utm_source=chatgpt.com`.
- Implementation screenshot: `/tmp/contact-gratitude-implementation.png` in the cloud-browser runtime, captured from the local Contact route at `#thanks`.
- The source and implementation screenshots were emitted together in one comparison input before this review.
- Source pixels: 1348 × 926. Implementation pixels: 1348 × 926.
- CSS viewport: 1363 × 936 at DPR 1 for both captures; no density normalization was required.
- Responsive evidence: 390 × 844 QA preset with a 375px document width, captured in the cloud browser.
- Comparison state: Parker hero with its explicit scroll invitation; Branding Tatva gratitude sequence with `your candour` active and `03 / 04 received`. These are not content-equivalent screens: Parker is the motion-principle reference, while Branding Tatva's existing layout, copy, imagery, and visual system are intentionally preserved.

### Findings

- No actionable P0, P1, or P2 differences remain in the scoped gratitude refinement.
- Fonts and typography: the existing Branding Tatva display and body families, weights, wrapping, small-cap tracking, and hierarchy are unchanged. The moving cue does not alter text metrics, and the progress counter keeps a stable width while its text transitions.
- Spacing and layout rhythm: the split composition, ledger tracks, row heights, CTA placement, section height, and footer handoff remain unchanged. The 1px reading head sits exactly on the active row's lower edge and spans that row's width without displacing content.
- Colors and visual tokens: the new cue reuses the sandstone and ivory tokens already present in the section. Its short glow remains subordinate to the primary CTA and disappears when the completion state settles.
- Image quality and asset fidelity: the existing closing landscape and overlay treatment are unchanged; no substitute, generated, CSS-drawn, or inline-SVG assets were introduced.
- Copy and content: all gratitude copy, acknowledgement labels, responses, progress language, and onward routes are preserved. `aria-current="step"` adds state semantics without changing visible copy.
- Motion and interaction: the shared reading head follows scroll, pointer, and keyboard focus with one finite 0.48s handoff. The progress text uses one finite 0.34s directional beat. Neither effect loops. Completion removes the reading head, while an intentional reverse-scroll revisit restores the appropriate earlier row without erasing receipts.
- Accessibility and responsiveness: ArrowDown moved focus and `aria-current` from the first to second acknowledgement; the reading head landed flush with the focused row. Reduced motion rendered the cue with `transform: none`. At 390px, the desktop-only head remains absent and the page has no horizontal overflow.

### Full-view comparison evidence

The paired 1348 × 926 input shows the relevant Parker principle clearly: one dominant visual path, an explicit invitation to scroll, and a finite change of attention. The implementation translates that principle into the existing acknowledgement ledger through a single travelling row edge and progressive counter, without importing Parker's cream palette, outlined navigation, device hero, typography, or composition.

### Focused-region comparison evidence

A separate crop was not required because the ledger occupies the right third of the implementation frame at readable size. Browser geometry confirmed the reading head and active row share the same 376.83px width and lower edge within 2px. Keyboard focus moved the cue from the third-row edge at approximately 571px to the second-row edge at approximately 485px after the finite transition.

### Primary interactions tested

- Scroll-created active state and `03 / 04 received` progress.
- Keyboard ArrowDown handoff with focus and `aria-current="step"` on the next acknowledgement.
- Full completion: complete and settled flags true, reading head removed, progress `04 / 04 · enough`, and next actions ready.
- Reverse scroll: receipt count remained complete while sequence focus and the reading head returned to acknowledgement 02.
- Reduced motion: component reported reduced mode; the active cue aligned to its row with no transform animation.
- Mobile 390 × 844: two-column notes remained readable, the fourth label wrapped cleanly, and 375px document width stayed within the 390px viewport.
- Console: no application-origin errors or warnings. One cloud-browser extension metadata error was excluded from app QA.

### Comparison history

- Pass 1: no actionable P0/P1/P2 differences. The reading head was visually subordinate, aligned to the active row, finite, and contained to desktop, so no visual correction iteration was required.

### Implementation checklist

- [x] Preserve the approved Branding Tatva composition, imagery, palette, type, and copy.
- [x] Add one restrained scroll and keyboard focus handoff.
- [x] Add a finite directional progress beat.
- [x] Resolve the cue cleanly at completion and restore it on deliberate revisit.
- [x] Verify reduced motion, mobile geometry, keyboard semantics, and console state.

### Follow-up polish

- None required for this pass.

final result: passed

---

# Contact Sunlit Invitation design QA

Source visual truth: `/workspace/scratch/9fed9b137b53/generated_images/exec-b951b2e3-6739-4dae-acab-7ed54773bc21.png` (first displayed concept, selected by the user).

Implementation: local existing Next.js `/contact#thanks`.

## Comparison history

Pass 1: source 1487 × 1058 pixels; desktop CSS viewport 1363 × 936, DPR 1; browser capture 1348 × 926 (browser capture excludes viewport gutters). Capture: `/workspace/scratch/tatva-sunlit-desktop-pass3.jpg`. Full view comparison: `/workspace/scratch/tatva-sunlit-comparison-pass1.png`. This initial comparison scales both views to the viewport for broad composition, so minor aspect-related differences are excluded from findings. A same-aspect recapture remains required for final acceptance.

- P1: The shared header hides on direct hash arrival. The source includes the floating navigation. Fix: keep the existing functional pill visible while the closing Contact scene occupies the reading area; other pages retain their existing behavior.
- P2: Section content creates a 1052px frame in a 936px viewport, cropping the meadow foreground and lowering the actions. Fix: reduce excess bottom padding; tighten the display line boxes and the acknowledgement margin.
- P2: Italic tracking is too tight. Fix: use the real Cormorant Garamond italic face with less negative tracking. Body tracking also loosened for readable word spacing.

## Fidelity surfaces

- Typography: real Cormorant Garamond normal and italic, Manrope body. Scale/wrapping and spacing await revised capture.
- Layout: centered single invitation, large open sky and integrated photograph. Revised frame fit awaits visual verification.
- Colors: soil, clay, sage and pale sky; no dark scene wash. Existing shared navigation is preserved rather than replaced by raster UI.
- Image: the chosen background was extracted with built-in ImageGen, all UI removed; WebP is 1486 × 1058 and 81,026 bytes. No generated text is used as UI.
- Copy: selected wording reproduced. Calendar duration comes from site data; links preserve the actual calendar and enquiry form. No fabricated proof or promised response time added.

## Verification so far

- Production build, TypeScript, changed-file lint and all five contact gates pass.
- Contact delivery tests use isolated synthetic recipients and mocked provider acceptance; no live enquiry sent.
- Browser DOM confirms the complete section, correct calendar destination and writing anchor.
- Console inspection found only browser-extension messages, no application error in the inspected sample.

## Implementation checklist

- Capture and compare the revised desktop layout.
- Test keyboard links, writing destination, responsive layout and reduced motion.
- Verify the review deployment's exact release after the visual gate passes.

## Final comparison, pass 3

Exact-size QA frame: 1487 × 1058 CSS pixels, DPR 1, inside the existing responsive QA route. Full-page screenshot `/workspace/scratch/tatva-sunlit-desktop-final.jpg` was cropped at the observed iframe boundary (25, 60) to 1487 × 1058. No stretching or density scaling was applied to this final comparison. Source and implementation were viewed together at identical dimensions in `/workspace/scratch/tatva-sunlit-comparison-final.png`.

Persistent browser evidence:

- `docs/qa/contact-sunlit/desktop.webp`: rendered exact-size implementation.
- `docs/qa/contact-sunlit/desktop-comparison.webp`: source at left and final implementation at right.
- `docs/qa/contact-sunlit/actions-comparison.webp`: focused 770 × 365 pixel copy/action crops, source and implementation together.
- `docs/qa/contact-sunlit/mobile.webp`: 390 × 844 mobile frame with the final portrait asset, captured with reduced motion.

The header P1 is resolved: the real shared pill stays visible on direct gratitude arrival. Its existing wordmark, ambient-audio control and current color are intentionally preserved. The height P2 is resolved: the exact desktop scene measures 1058px in a 1058px viewport, and the 390px phone scene measures 844px in its 844px viewport. The tracking P2 is resolved with the real italic face and corrected line boxes. A second spacing adjustment brought the booking control to y660 with height60.5, against approximately y664 and height60 in the selected mockup.

Mobile pass 1 lost its meadow foreground from the landscape crop. The final dedicated portrait image restores the butterfly and wildflowers, with both contact actions above the foreground. At 320 × 720, content grows naturally to 822px rather than cropping; there is no horizontal overflow, and booking/writing targets measure 57.5px and 44px respectively.

All five fidelity surfaces reviewed in the final comparison:

- Fonts: Cormorant Garamond normal and true italic, Manrope body; heading and personal note retain selected hierarchy and readable word spacing. Small reassurance text remains a minor P3 optical-size difference.
- Spacing: centered layout, open sky, no acknowledgement grid; source-like headline and button positions. No clipping or overlap in tested desktop/mobile frames.
- Color: soil heading and button, clay italic, sage eyebrow, luminous natural background. Existing consent preferences remain available and are intentionally preserved; the second consent control visible in some full QA captures belongs to the outer test harness, not the contact page.
- Image: the selected landscape and portrait counterpart are actual raster assets, with no CSS/SVG replacement imagery or rasterized UI text.
- Content: selected gratitude copy is intact; the duration and calendar destination come from site configuration. The writing link returns to the existing form.

Primary interaction evidence: Tab from the calendar link reaches the writing link with a visible solid focus outline. Enter on the writing link changes the embedded page fragment to `#write`, aligns the section to the viewport, and exposes the form with three required fields. Calendar href, new-tab target and safe rel were verified. No booking was submitted; completion on Calendly was not tested. Reduced motion was exercised using the site's own control: the section reports `reduced` and the camera computed transform is `none`. Full motion was restored and the final desktop frame reports `full`.

Browser console errors checked: the sampled errors originate from the browser extension, with no application-origin error observed. Builds, TypeScript, lint and contact tests passed. No live contact message was sent.

No actionable P0/P1/P2 findings remain. P3: optional future tuning of small reassurance text size. No conversion uplift is claimed without measurement.

final result: passed
