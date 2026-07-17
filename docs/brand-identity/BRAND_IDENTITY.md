# Branding Tatva — Brand Identity Reference

Everything that makes the visual and verbal identity what it is, and why, in one place. The condensed, visitor-facing version of this lives on the [About page](../../src/app/about/page.tsx) under "Why this site looks the way it does" — this file is the fuller working reference.

---

## 1. The name

**Tatva** (तत्त्व) — a Sanskrit term for "element" or "essential principle." The five tatvas — earth, water, fire, air, space — are the classical building blocks of everything material. Branding Tatva borrows the frame deliberately: a brand is also built from a small number of essential parts (foundation, experience, expression, voice, presence), and it holds together, or doesn't, based on whether those parts agree with each other. See [BRAND_STRATEGY.md](../BRAND_STRATEGY.md) section 4 for how each element maps to an actual service.

## 2. The mark

Five petals, one per element, arranged around a central point (the *bindu* — the point of origin/convergence in Indian visual tradition). Built in [`src/components/Logo.tsx`](../../src/components/Logo.tsx).

**Why this shape specifically:**
- It's the static, small-scale version of the same idea the homepage hero animates: separate elements settling into one form. Using the same underlying geometry in both places (rather than a hero animation and an unrelated logo) means the mark isn't decoration bolted onto the site — it's the same visual argument at two different scales.
- Five petals converging on one point reads clearly even at favicon size (32px), which a lot of illustrative "brand story" logos fail at. A mark that only works large isn't finished.
- The colors are the same five element colors used everywhere else on the site (see below) — the logo doesn't introduce a new palette, it just concentrates the existing one into a single glyph.

**Files:**
- `src/components/Logo.tsx` — the `<Logo />` component (mark + wordmark) used in the header and footer, and `<LogoMark />` for icon-only placements.
- `src/app/icon.tsx` — generates the browser favicon from the same five-color concept using Next.js's built-in image generation, so the tab icon matches the header mark instead of being a separate asset someone forgot to update.

## 3. Typography

| Role | Typeface | Why |
|---|---|---|
| Headlines (`font-display`) | **Cormorant Garamond** | An editorial serif rather than the geometric sans nearly every "brand strategy" or agency site defaults to. It signals writing-first, not template-first — which matters given the practice is literally built on a literature background. Serifs at large display sizes also carry more emotional weight than sans headlines; the hero headline ("Most brands are visible. Very few are remembered.") needs that. |
| Body text (`font-sans`) | **Manrope** | A humanist sans-serif chosen for legibility at small sizes — form labels, footnotes, card copy — where a serif would slow reading down. The pairing is a deliberate split: serif for the sentence that should be *felt*, sans for the sentence that should be *used*. |

Both load via `next/font/google` (self-hosted, no external font request at runtime) — configured in `src/app/layout.tsx`.

## 4. Color

Defined as semantic Tailwind tokens in [`tailwind.config.ts`](../../tailwind.config.ts) — components reference `background`, `foreground`, `action`, `border`, `state`, never a raw color name, so the palette can be adjusted centrally.

| Token | Hex | Element association | Why this color |
|---|---|---|---|
| Ivory (background) | `#F4EFE6` | — | A warm off-white instead of pure white — closer to paper or plaster than a screen default. |
| Soil (foreground) | `#27221E` | Space | Near-black with a warm cast, paired with the "Space" element (presence, what's left once the noise settles). |
| Clay (primary action) | `#A65F46` | Earth | Terracotta — foundation, groundedness. Used for primary buttons because it's the warmest, most inviting color in the set. |
| Indigo (secondary action) | `#31485A` | Water | A traditional Indian dye color — adaptability, movement. |
| Ochre (focus/warning state) | `#C9953D` | Fire | Turmeric/mineral pigment — visibility, attention. |
| Sage (success state) | `#79816D` | Air | A muted, breathing green — voice, language, the least "loud" color in the set on purpose. |

The throughline: every color names an actual dyed or pigmented material (clay, indigo dye, turmeric, sage, terracotta) rather than a screen-native hex chosen for contrast ratios alone. It's meant to look like it came from somewhere, not from a color picker.

## 5. Motion

Documented in full in [MOTION_SYSTEM.md](../MOTION_SYSTEM.md). The short version: the homepage hero animates the five element-shapes settling into the same convergence point the logo shows statically. Motion always resolves toward stillness (the bindu), never loops or auto-plays past that point — restlessness isn't the brand's idea of attention, arrival is.

## 6. Voice

Documented in full in [BRAND_VOICE.md](../BRAND_VOICE.md). The identity system and the writing system are meant to make the same argument from two directions: specific, grounded, sourced in real material (real colors, real client work, real sentences) rather than abstraction.

## 7. Where this shows up on the actual site

The [About page](../../src/app/about/page.tsx) includes a section, "Why this site looks the way it does," that gives visitors the condensed version of sections 2–4 above, in Suman's voice. The intent: most brand-strategy sites *tell* a visitor they're good at branding. This one *shows* the reasoning behind its own choices, in public, as the proof.
