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
