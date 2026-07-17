# Branding Tatva — Design System

Reference for anyone (including future-me) editing the site's look. Lives alongside the code in `branding-tatva/tailwind.config.ts`.

## Colour tokens
| Token | Hex | Use |
|---|---|---|
| `ivory` (background) | #F4EFE6 | Default page background |
| `parchment` (background-alt) | #E8DED0 | Alternating section background |
| `warm-white` (background-elevated) | #FCFAF6 | Cards, elevated surfaces |
| `soil` (foreground) | #27221E | Primary text, headings |
| `clay` (action-primary) | #A65F46 | Primary buttons, links |
| `indigo` (action-secondary) | #31485A | Eyebrows, secondary accents |
| `ochre` (state-focus) | #C9953D | Focus rings, warnings |
| `sage` (state-success) | #79816D | Success states |
| `terracotta`, `sandstone`, `rose-earth` | — | Element-specific accent colours (see elements.ts) |

Semantic tokens (`background`, `foreground`, `action`, `border`, `state`) are what components should reference — never hardcode a raw colour name in a page.

## Typography
- **Display** (headings): Cormorant Garamond — editorial serif, loaded via `next/font/google`
- **Body**: Manrope — readable sans-serif
- Responsive scale uses `clamp()` so headings never become unusable on mobile: `display-xl` through `display-sm` in `tailwind.config.ts`

## Spacing & layout
- Max content width: 6xl (~1152px), via the `.container-page` utility class
- Section vertical rhythm: py-16 to py-28 depending on section weight
- Breakpoints follow Tailwind defaults (sm 640 / md 768 / lg 1024 / xl 1280)

## Components built so far
Header, Footer, Container, Button (LinkButton), SectionHeading, FAQ, ContactForm, AnimatedHero

## Still to design
- Indian motif library (jali, rangoli-logic, threshold frames) — referenced in the brief but not yet built; current design leans on colour, type, and the elemental composition rather than literal pattern work
- Image treatment guidelines (once real photos/case study visuals are supplied)
- Icon system beyond Lucide defaults
