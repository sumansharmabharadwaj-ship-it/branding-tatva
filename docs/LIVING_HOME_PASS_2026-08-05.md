# Living homepage refinement pass

Branch: `reimagine-project-moves`

This preview pass keeps the approved homepage architecture, core videos, typography, and original colour system while removing weak repetition and turning the remaining chapters into one coherent, autoplaying commercial journey.

## Narrative and section refinement

- Removed the empty process-closing quote slab.
- Removed the duplicate process prelude after the full decision architecture made the same introduction more usefully.
- Rebuilt the homepage About section as a living authorship studio, connecting Clinical Psychology, English Literature, and direct strategy leadership to verified client applications.
- Removed the duplicate Earth-only 320vh detour from Home; the full five-Tatva chapter now follows the framework directly.
- Reduced the homepage from eleven nominal chapters to ten real chapters, aligning the ladder and guided journey with the current copy.
- Replaced the repeated early diagnosis cards with the richer Clarity Lab, then moved Evidence directly after diagnosis.
- Separated diagnosis from service selection: the Clarity Lab names the gap, while Three Paths explains what to build next.
- Carried the visitor's selected diagnosis into Three Paths, Services, and the final invitation instead of asking the same question again.
- Added a legible mobile route view for Three Paths rather than shrinking a 900px diagram into unreadable text.
- Limited floating film windows to the one chapter that genuinely benefits from supplemental media, keeping them away from already cinematic sections.
- Tightened hero, FAQ, process, path, evidence, authority, and closing conversion copy without changing the font system.

## Autoplay stability pass

- Made the guided journey broadcast every real chapter transition so local autoplay systems reset and wake together.
- Reset guided dwell timing whenever a visitor manually enters another chapter, preventing premature jumps caused by an older timer.
- Explicitly play and resume the hero film and every VideoBreak rather than relying on the browser's autoplay attribute alone.
- Reworked the Five Elements chapter so scroll and autoplay no longer fight over opacity; autoplay resumes after scroll settles and only the visible element film decodes.
- Added a direct Tatva selector to the Five Elements scene while preserving automatic progression.
- Removed permanent hover freezes from Three Paths, Process, FAQ, Evidence, and the Studio. Hover now previews briefly; deliberate selection holds long enough to read, then autoplay resumes.
- Restarted Evidence, Studio, Tatva Framework, Five Elements, Process, and FAQ from a coherent first state whenever the guided journey enters them.
- Added explicit play/pause control to the active Evidence, Studio, and Process films and stopped their ambient motion outside the viewport.
- Lowered visibility thresholds for tall mobile sections so their autoplay can actually activate on smaller screens.
- Accelerated the Tatva Framework just enough for all five forces to complete within its guided chapter time.
- Preserved reduced-motion fallbacks, keyboard access, paused reading states, offscreen video discipline, and honest proof-only claims.

## Review gate

The branch head contains the autoplay stability pass and should be built as one preview before another visual layer is added. Review should focus on whether each chapter starts by itself, completes its internal story, yields to deliberate interaction, and resumes without requiring the visitor to move the cursor away.

Production remains untouched until preview approval.
