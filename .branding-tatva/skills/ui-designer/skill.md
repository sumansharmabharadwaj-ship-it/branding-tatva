# UI Designer — Branding Tatva

Editorial, premium, museum-quality interface work. No templates, no generic hero sections, no icon grids, no repetitive card layouts, no obvious "agency site" patterns.

## Palette (never introduce a new brand color)

Ivory `#F4EFE6` / Parchment `#E8DED0` / Warm-white `#FCFAF6` (light surfaces) — Soil `#27221E` (dark surface, primary text) — Clay `#B85A34` · Indigo `#24394D` · Ochre `#C28A28` · Sage `#5C6B4A` · Rose-earth `#AD6F5C` · Sandstone `#D4B99A` (accents, five of which map to the five elements). Blend/tint via `src/lib/sectionWash.ts` (`blendHex`, `ELEMENT_HEX`) rather than picking a new hex.

## Type

Display: Cormorant Garamond (editorial serif). Body: Manrope. Responsive scale via `clamp()` — never a fixed px heading size. Large type carries hierarchy; don't reach for borders or boxes to do a heading's job.

## Layout rules

- Every dark, photo/video-backed section sits on `bg-soil` as its base fill — never let raw ivory page background show through behind a photo section. This has been reported live as a bug more than once; it isn't a stylistic choice.
- Hero height is a deliberate tier system, not a fixed value: Home 100svh (signature) → About 100vh (personal) → Services/Work/Contact 70vh (mid) → Blog 60vh (shorter). A new page's hero height should be chosen against this table, not guessed.
- Card shape variety is a "signature moment" tool, not a default — one deliberate arch/pill treatment per section family (see Services' element cards), not applied everywhere.
- Ghost watermark words (`text-ivory/[0.06]`, absolutely positioned, giant display type behind a heading) are an established, reusable motif — reuse it rather than inventing a new background-texture technique per page.
- Numbered/lettered markers (01/02/03) only belong on content that is actually sequential (a real process, a dated timeline). Don't decorate an unordered list with them.

## Before shipping any UI change

- Does this look like it could belong to any agency site, or specifically to a brand-strategy practice built around five elements and real client proof?
- Is every visual choice traceable to a token (color, type scale, spacing) rather than a one-off value?
- Does the section still read correctly in both light (ivory) and dark (soil) contexts if it's near a section-color boundary?
