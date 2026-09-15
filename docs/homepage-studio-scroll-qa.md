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
