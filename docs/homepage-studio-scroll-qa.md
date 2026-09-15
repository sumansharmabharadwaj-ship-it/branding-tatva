# Homepage strategist scroll · 15 September 2026

Release 299 restores the strategist chapter's three discipline sequence.

The previous loaded desktop page measured 936px for both the outer Studio
section and its sticky frame at a 936px viewport height. The authored 240svh
sequence therefore had zero scroll travel. The conflicting selector was in
`home-v4-orbit-redesign.css`, where the brand health check stylesheet also
forced Studio to `height: 100svh !important`.

Studio now owns its height through `home-v4-studio-scroll.css`. A ResizeObserver
measures the frame's natural height, including its portrait and proof link.
The 240svh sequence activates only on a suitable desktop viewport when the
whole frame fits. Shorter, larger-type, touch and reduced-motion views flow.

Selecting a discipline no longer calls Lenis or changes the document's scroll
position. Explicit choices remain selected until real scroll intent resumes
the sequence. Keyboard focus continues to own the active proof destination.
The decision surface and proof link stay mounted while animation controls
replay the directional copy and result entrances for each selection.

## Validation

- TypeScript and changed-file ESLint passed.
- Studio progression, reversal, boundary deadband, collapsed-runway and
  keyboard ownership checks passed.
- Homepage source and rendered gates passed: thirteen ordered chapters,
  unique IDs, heading and media semantics, and motion preference contracts.
- Type floor passed with the same 239 existing exceptions. Seven Contact
  baseline references moved after release 298; each old and new declaration
  was verified identical before updating its line reference.
- Production build passed with 86 routes. Homepage output: 50.6 kB route,
  289 kB first-load JavaScript.
- Remote homepage and Contact regression workflows passed.

## Deployment and remaining visual check

- Source: `fa85158b15485033f150be40f5a0f887b8d532b9`.
- Deployment trigger: `cb8934d77765b75e656b80711e62c24f97890ed5`.
- Source-to-trigger difference: only the controlled Vercel deployment flag.
- Preview: https://branding-tatva-fc0ds9w6z-suman22.vercel.app/.
- Vercel deployment `dpl_HE8xFQaCjediYkoZsbRSjTxSEoCs` is READY, preview target.
- Controlled deployment workflow `34993220146` succeeded and cleanup commit
  `76c4c0be72f41ed8ec4b362c7830f4e63f1a4869` restored controlled mode.

Hosted visual acceptance remains unverified. The official temporary access
tool returned a 409 conflict when creating its protection bypass. The release
endpoint returned HTTP 302, and a fresh browser tab redirected to Vercel
sign-in. No old-page screenshot is evidence for release 299. When review
access is available, check forward and reverse scrolling through all three
disciplines, click and keyboard selection without document jumps, a focused
proof link during scroll, and mobile/short-screen/reduced-motion flow.

## Release 300 hosted follow-up

The reading-group refinement at `fa3ff6ab95aa40c41a814cd5aa4ed27ba29194ab`
keeps the cost introduction, both Tatva copy columns and the complete Studio
reading column together during entry. Independent portrait, diagram, card and
discipline motion remains. The unused nested accent motion was removed.

Release 300 is READY at
`https://branding-tatva-9tn3ucrdc-suman22.vercel.app/#studio`.
Its `/api/release` endpoint returned HTTP 200 with trigger
`b20edf58532c3ebec9800eddef011a22fba4b304`, branch `august-8-isolated`, and
environment `preview`. The controlled deployment workflow `34995019976`,
homepage workflow `34995019799`, and Contact workflow `34995019964` passed.
TypeScript, changed-file ESLint, homepage source/rendered gates, type floor and
the 86-route production build also passed locally.

Temporary review access succeeded for this deployment. Desktop, mobile and
short-screen acceptance therefore covers the release 299 Studio changes too:

- At 1363 × 936, Studio measures 2246.39px with a 936px sticky frame and a
  `held` story. The previous zero-length scroll interval is restored.
- At a 536.30px section entrance, the unfocused reading group was moving by
  18.62px while preserving a 14.39px headline/intro gap and a 16px panel/footer
  gap. The old page at the equivalent entrance overlapped those pairs.
- Real scrolling reversed the selected discipline through 03, 02 and 01.
- Native pointer selection and Home, ArrowRight and End keys kept scrollY
  exactly 16359 while selecting Psychology, Literature and Strategy. Native
  events isolated application behavior from locator-assisted scrolling.
- Keyboard focus reached the HerbalCart proof link. A further 900px scroll
  preserved both focus and that destination while Psychology stayed selected.
- At 390 × 844, content and scroll widths were both 375px. Studio uses normal
  flow, with a 20.80px headline/intro gap and a 24.80px panel/footer gap.
  Literature and Strategy choices update their corresponding proof links.
- Pausing page motion clears the reading-column translation and portrait
  transform; tab choices remain functional. Full motion was restored.
- At 1280 × 720, the natural frame grows to 949.45px in normal flow, keeping
  the entire reading column reachable. Content and scroll widths are 1265px.
- At 320 × 720, content and scroll widths are 305px, the headline/intro gap
  remains 20.80px, and no Studio link or button extends outside the viewport.

The protected responsive QA route needed its own freshly generated official
review link. After that, the mobile, laptop and narrow presets opened within
the same tab. Review tokens are deliberately omitted from this record.
