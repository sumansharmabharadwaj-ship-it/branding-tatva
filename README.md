# Branding Tatva — website project

This is the code for your website. You don't need to understand any of it — I'm keeping this file updated in plain language as we go, and I'll do all the technical work.

## Where things stand
- ✅ All pages built: Home, About, Services, Work (with individual case studies), Contact, Privacy, Terms
- ✅ Full design system: colours, typography, the five-elements branding, motion and scroll animations throughout
- ✅ Accessibility pass: keyboard navigation, visible focus indicators, reduced-motion support
- ✅ Social sharing: link previews on LinkedIn/Instagram/WhatsApp now show a proper branded image instead of a blank card
- ✅ Custom 404 and error pages, so anything that goes wrong still looks like your site, not a generic crash screen
- ⏳ Not yet connected: GitHub, Vercel (hosting), your domain
- ⏳ Still needed from you before this can go live — see `docs/PROJECT_PLAN.md` for the full list, but the short version is: your domain name, a public contact email/phone if you want one different from what's there now, and picking one of the five positioning options in `docs/BRAND_STRATEGY.md` as final

## How to edit text later (once the site is live)
Most of the words on the site live in one place: `src/data/`.
- `src/data/site.ts` — the tagline, positioning statement, contact email, social links
- `src/data/elements.ts` — the five branding elements and what proves each one
- `src/data/projects.ts` — your portfolio/case study entries

You'll never need to touch these directly — just tell me what to change and I'll edit them.

## Common questions
**"Can I see this now?"** Yes — I can run the site and check it in a live browser myself, and I do that before saying anything is finished. Once we connect Vercel, you'll also get a real link you can open on your own phone or laptop.

**"Did you test this?"** Yes — every change gets checked for actual code errors, then opened in a live browser to confirm it looks and works right, including things like keyboard navigation and mobile screen sizes.
