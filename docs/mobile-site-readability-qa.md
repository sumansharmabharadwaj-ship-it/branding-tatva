# Sitewide mobile reading pass — 22 September 2026

## Changes

- Extend shared phone header, consent and footer spacing to 639px and stable page-entry behavior to 959px.
- Keep the menu scrollable with safe-area clearance, including short landscape screens.
- Set phone/tablet input and select text to at least 16px; enlarge buttons and footer navigation targets.
- Restore full Contact introduction and normal reading sizes; stack its actions and required form fields, enlarge the question textarea.
- Improve About mobile reading editions without touching its opening component or content.
- Stack Services packages earlier, increase scope and pricing-control readability, and raise tiny diagram labels.
- Improve Insights horizontal choice strips and reflow the newsletter cadence on narrow phones.
- Add 360px/480px presets and the three service landing pages to the existing internal responsive QA route.

## Verification

- Production build passed (106 generated routes), including built-in lint and TypeScript validation.
- `pnpm exec tsc --noEmit`: passed.
- ESLint on the two changed TSX files: passed.
- `pnpm check:contact`: passed all six source/behavior gates.
- `pnpm check:type`: passed; no new under-floor text (186 previously recorded declarations remain elsewhere).
- `git diff --check`: passed.

## Existing gate failures

The About journey gate expects an old exact source string with `behavior: "auto"`; the unchanged SmoothScrollProvider now uses `instant` and excludes Home as well as Contact from its fallback. The homepage conversion gate expects a label in the old control file. Neither referenced component was changed in this pass. These checks do not establish a regression in the changed CSS.

## Visual verification limitation

The live desktop homepage and a 390px homepage DOM were inspected before editing. Subsequent cloud-browser screenshot, frame measurement and navigation calls timed out, including a fresh-tab recovery. No post-change mobile screenshot, physical iPhone/Safari acceptance, keyboard, reverse-scroll or reduced-motion runtime pass is claimed. Preview publication is for review; production promotion should follow those checks.

## Follow-up: article decisions and phone reading

The browser recovered for DOM, click and screenshot checks. A 320px screenshot of the release 502 positioning article confirmed that its five decision tabs shrink into narrow columns with individual letters wrapping vertically. This follows from the shared mobile button minimum overriding the older tab minimum while flex shrinking remains enabled.

- Give article decision tabs explicit nonshrinking widths and contained horizontal scrolling.
- Keep one persistent tab panel and persistent previous/next controls; animate only the decision copy, so changing a decision preserves the button that owns focus.
- Reveal a newly selected tab within its own strip without scrolling the article. Support Home and End as well as arrow keys.
- Stop centering already-visible reading-rail links during vertical reading.
- Increase article answer, summary and control-label readability; unwrap previous/next labels. Stack decision controls below 360px.
- Account for the shared header and safe area above article chapters; release the sticky rail on short landscape screens.
- Stack service landing-page actions and increase their text and breadcrumb tap areas.
- Temporarily hide the floating consent notice while a phone/tablet field has focus; retain the footer preference link and restore the notice on blur.

Follow-up code checks: TypeScript, ESLint on the changed components, production build (106 routes), typography gate, and whitespace check passed.

### Release 503 browser results

Source commit `3f52c2b80893e9b2e191825c7a47a9780a0f66aa`; Vercel trigger `eb09b9c3156c1cdfe8bba91b284dbf06e3895200`; deployment `dpl_FtEwLqanUbwUqp4XDPF1k9y3tZyu` is READY and the controlled-preview check succeeded. Browser checks used this deployment's unique origin, not the permanent alias.

- At 320px, the positioning article now renders a readable horizontal decision strip instead of letter-by-letter columns.
- Home and End select the first and last tabs. Arrow navigation also works after selecting the site's reduced-motion setting.
- Clicking Next and then pressing Enter again changes decisions while the same navigation button remains focused. The snapshot contains one labelled tab panel.
- At 390px, the positioning service page's full-width booking action and secondary link fit, with a visible keyboard focus outline.
- Saved a screenshot of the narrow article panel with its readable, stacked decision controls.

Vercel protection blocked the cross-page iframe booking-path check. A direct Contact frame retry later timed out, so post-change field-focus/consent verification is still outstanding. The API release URL returned an authentication redirect through the connector and a browser client block; the exact deployment identity above comes from Vercel metadata. Physical iPhone/Safari, short-landscape and full site regression acceptance remain outstanding. Production was not changed by this pass.
