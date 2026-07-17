# Branding Tatva — website project

This is the in-progress code for your website. You don't need to understand any of it — I'm keeping this file updated in plain language as we go, and I'll do all the technical work.

## Where things stand
- ✅ Project foundation: page structure, colour system, typography, homepage
- ⏳ Not yet built: About, Services, Work, Contact pages; animated hero; final design polish
- ⏳ Not yet connected: GitHub, Vercel (hosting), your domain

## How to edit text later (once the site is live)
Most of the words on the site live in one place: `src/data/`.
- `src/data/site.ts` — the tagline, positioning statement, contact email, social links
- `src/data/elements.ts` — the five branding elements and what proves each one
- `src/data/projects.ts` — your portfolio/case study entries

You'll never need to touch these directly — just tell me what to change and I'll edit them.

## Common questions
**"Can I see this now?"** Not yet as a live link — I don't have the ability to run a live preview in my current workspace (it can't reach the internet to download the tools it needs). The first real preview will happen once we deploy to Vercel, which is a coming step.

**"Did you test this?"** I checked the code carefully and did a structural sanity check, but I haven't been able to run it. The first full test happens automatically when we deploy — if anything's broken, Vercel will tell us exactly what and I'll fix it before it goes live.
