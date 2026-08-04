# Homepage audit and repair pass

Branch audited: `work/home-audit-fixes-2026-08-04`
Source version preserved at: `backup/before-home-audit-fixes-2026-08-04`
Production remains untouched.

## Preserved

- The approved cinematic homepage architecture and visual direction.
- The author chapter, Notice / Name / Direct lenses, portrait, diagrams, five Tatvas, evidence investigation, service routes, and closing scene.
- Desktop scroll choreography where the viewport can support it.

## Repaired

1. **Founder chapter typography collision**
   - Removed the interval where the opening statement and active lens occupied the frame together.
   - Delayed lens progression until the opening title has cleared.
   - Manual lens selection now remains stable instead of being immediately overwritten by scroll.

2. **Reduced-motion collisions**
   - Replaced overlapping absolute animation layers with complete, readable static compositions in the hero, recognition, evidence, authorial lenses, service routes, and closing questions.

3. **Mobile and short-screen clipping**
   - Added normal-flow compact layouts for the information-heavy pinned chapters.
   - Choices, outcomes, case phases, service routes, FAQ answers, links, and calls to action remain reachable without relying on a tall viewport.

4. **Process-film performance**
   - Removed React state updates on every scroll frame.
   - Moved camera, stage, video, closing, and progress updates to element refs.
   - Prevented duplicate Lenis and native scroll listeners.
   - Paused process videos away from the section and limited playback to the active and next scenes.
   - Changed process videos to `preload="none"` and shortened the hold without removing a stage.

5. **Duplicate closing sequence**
   - Removed the second full-screen silver-tide booking chapter that the footer injected immediately after the homepage closing scene.
   - The page now resolves once, then enters the compact footer.

6. **Interaction and accessibility details**
   - Added stable tab semantics to the author lens controls.
   - Added `aria-controls` to animated FAQ controls.
   - Made the shared media-query hook hydration safe.

## Verification gate

- Next.js production build must compile.
- TypeScript and lint checks must pass.
- All generated routes must complete.
- The final preview deployment must return HTTP 200 before the audited branch is promoted to `redesign/conversion-architecture`.
