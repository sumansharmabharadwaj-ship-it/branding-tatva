# Homepage reading stability · release 318

## Change

Foundation and evidence reading columns keep their text nodes mounted. A short
directional translation carries each column as one group, preserving title and
paragraph spacing. The existing reversible heading ink and scene entrances stay
in charge of scroll choreography. Evidence scenery still crossfades independently.

Foundation and evidence panels now use the existing keyboard reading guard:
a focus-visible panel or descendant keeps its selection and action destination
through scrolling and hover. Arrow-key tab selection prevents incidental browser
scrolling. Motion pause holds the current story stage until real scroll intent
resumes it.

The homepage pause button preserves a visible, unobscured reading landmark as
sticky runways collapse or expand. Its brief layout correction starts only
on explicit toggle activation and stops immediately on reader input. Initial fragment recovery has an independent
hydration lifecycle, so resuming motion cannot replay an old fragment. Keyboard
focus, Tab, Escape and manual scrolling cancel pending recovery.

The shared homepage pacing signal now stops with the site motion preference.
Evidence image motion and autoplay also honour pause directly.

## Initial release identity · 315

- Source: `f5677c3fd57f61f9ac3bd1cd8b7105259ff183c8`
- Trigger: `79851b09b4a36c0369efbe03906a7924d800e0d8`
- Deployment: `dpl_9pYy9tUqL1hb2myRPHbkbobKvmTE`
- Preview: https://branding-tatva-5xzdd8ye3-suman22.vercel.app/
- Source-to-trigger diff changes only the controlled Vercel flag.

## Baseline reproduction

In the previous deployed page, a keyboard-focused evidence action changed from
Dr. Haley's story to MyShopInEurope's file after a 520 px wheel gesture.
The focused link survived but its destination changed underneath the reader.
Pausing in Evidence moved the visible reading position into the Tatva chapter.
Resuming returned the archive to its first project.

## Verification

Local TypeScript, changed-file lint, homepage source gate, typography gate,
production build and rendered homepage gate passed. The release history below
records the initial checks, discovered pause defects, and final release 318
acceptance. The final deployed checks supersede the earlier failed pause checks.

## Desktop acceptance of release 315

- 1440 × 900 viewport: client and document widths both 1425 px.
- Keyboard focus reached the MyShopInEurope project link. A 560 px forward
  wheel gesture moved scrollY from 9544 to 10104 without changing focus,
  selection or `/work/myshopineurope`. A 380 px reverse gesture retained all
  three at scrollY 9724.
- ArrowRight, End and Home changed project selection and the focused tab while
  scrollY remained exactly 11099.
- After focus left the panel, native scroll resumed the sequence: Executive
  Springboard at 10283, HerbalCart at 10583, Executive Springboard again at
  10283 on reverse scrolling.
- Pause stopped all videos, removed all ink targets, and cleared both reading
  column transforms. Selection and toggle focus survived. The reading position
  still shifted: shared SmoothScrollProvider started another fragment recovery
  when reduced motion became active. This is a failed acceptance item for 315,
  fixed in the follow-up below.
- Final-source CI `35023697994` passed all steps, including production build,
  rendered output, homepage destinations and contact/newsletter contracts.

## Follow-up · release 317

Source `f889e332e7929e8719336999ab985a41ccb1fe81` excludes Home from the shared
provider's reduced-motion fragment recovery. Home's own hydration recovery now
uses explicit instant alignment, compatible with the separately added smooth
native anchor CSS. The latest branch's headline and anchor refinements were
retained. Local production build and homepage rendered/source gates passed.

## Mobile acceptance · 390 × 844

- Client and document widths both 375 px; no measured foundation heading,
  paragraph, link or button crossed the viewport.
- Foundation uses natural flow. Category → Audience → Position keyboard
  selection retained scrollY 4272 and focused `foundation-tab-position`.
- Title/description gap remained 12.796875 px in Category and Position.
- Native mobile scroll changed heading ink from approximately .22 at scrollY
  3857 to .623 at 4017, then returned to .218 at 3857 in reverse.

## Deferred resize correction · release 318

Release 317 removed the competing recovery, but a delayed responsive scene
resize still displaced the reading landmark after the immediate correction.
Release 318 observes that brief layout transaction before paint, with a 1.5 s
upper bound. Wheel, touch, pointer, keyboard or focus input immediately ends the
correction, and unmount cleans up every listener and observer.

Source: `64f960b17b98d354cd3e4837833957d0bf05d8e9`.
Local TypeScript, changed-file lint, production build and rendered/source gates
passed. Final deployed pause acceptance is recorded below.

## Final release 318 identity and automation

- Source: `64f960b17b98d354cd3e4837833957d0bf05d8e9`
- Trigger: `78d4c039455aaba04046dc3e56cb91b4271587f3`
- Deployment: `dpl_BUMdmGpx8Gw5Vt3j84xrxtLZ5LmN`, READY, preview target.
- Preview: https://branding-tatva-ju5va7rf9-suman22.vercel.app/
- Homepage CI `35025432654`: success, all steps.
- Controlled preview workflow `35025432625`: success.
- Contact regression workflow `35025432626`: success.
- The root preview was opened after deployment and its homepage heading,
  navigation, motion toggle and section content were confirmed.
- At verification, the usual august-8-isolated branch alias still resolved to
  release 316. The unique release 318 URL above is the tested preview.

## Final desktop pause and resume · 1440 × 900

The Evidence heading was at viewport top 222.5625 px, scrollY 9437, with
MyShopInEurope selected. Immediate pause held it at 222.0625 px while the
layout changed. After deferred layout settled it remained at 222.75 px,
scrollY 6988: less than one pixel of visible drift. There were no active ink
targets, all videos were paused, and focus stayed on Resume page motion.

Resume restored the heading to exactly 222.5625 px, scrollY 9437, with
MyShopInEurope still selected and focus on Pause page motion. A later read
confirmed the same settled values. Client width and scroll width both remained
1425 px. These final checks resolve both previously observed pause defects.

## Final mobile pause and resume · 390 × 844

- With Position selected, the Foundation heading was at 177 px and scrollY
  4320. Pausing retained both values. The panel's entrance transform settled
  by 8 px, preserving its title/description gap of 12.796875 px.
- While paused, ink target count and playing video count were both zero.
- Keyboard tab selection still worked while paused: End selected and focused
  `foundation-tab-position`, with no text transform. The preceding native
  click moved scrollY to 4272; this is not counted as a zero-scroll click test.
- Resume retained scrollY 4272, heading top 225 px and Position selection.
- Client and document widths both remained 375 px. Visual inspection confirmed
  readable natural-flow content and usable two-column tab controls.

## Scope

Browser checks used Chromium desktop and responsive mobile viewports. They
cover keyboard focus, stable action destinations, tab navigation, native forward
and reverse scrolling, visible text spacing, overflow, and the site's motion
pause/resume control. The OS reduced-motion fallback was checked in source;
this record does not certify physical touch hardware or Safari. Browser logs
contained extension metadata errors; these were not attributed to the app.
