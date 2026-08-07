# Branding Tatva · Canonical Preview Verification Status

Last consolidated: 7 August 2026

## Canonical lane

- Branch: `homepage-cinematic-recovery`
- Permanent review alias: `https://branding-tatva-git-homepage-cinematic-recovery-suman22.vercel.app/`
- Backlog: `docs/MASTER_PENDING_WORK.md`
- Production remains untouched until Suman explicitly approves the preview.

## Source and deployment contract

The preview exposes two uncached machine-readable endpoints:

- `/api/release` for the public release identifier and flat Vercel runtime fingerprint.
- `/api/verification` for the canonical branch, permanent alias, backlog, phone, consultation duration, required routes, and nested Vercel runtime fingerprint.

`Permanent preview source gate` waits for the permanent alias to report the exact current canonical branch commit before accepting the deployment. It then checks Home, Services, Work, Insights, About, and Contact.

## Automated verification now attached to the canonical branch

### Whole-site

- Production TypeScript check.
- Focused ESLint checks.
- Next.js production build.
- Canonical preview URL gate so obsolete Branding Tatva Vercel links cannot return.
- Integrated desktop, tablet, and mobile browser smoke.
- Shared navigation, mobile menu, reduced-motion media, Contact, Insights, and About runtime audit.
- WCAG A/AA route audit on all primary routes plus a representative case study and Insight guide.
- Deployed SEO metadata, canonical, schema, social-card, H1, uniqueness, and preview-noindex audit.
- Safe runtime checks for invalid Contact and newsletter API requests.

### Homepage

- Cinematic experience gate.
- Density, loader timing, pacing, semantic tempo, touch hold, and process tempo gates.
- Prelude, foundation, evidence, studio, decision, invitation, and Tatva scene evidence gates.

### Services

- Anchor, archive, exploration-density, hash-override, media-loading, native-input, page, scroll-experience, and semantic-progress gates.
- Contact duration and direct-call contract prevents obsolete twenty-minute wording.

### Work

- Brand-study context, capability attention, decision context, hero pause, Lab accessibility, mobile index, mobile narrative, and three generations of Work page gates.
- Idempotent repair transform protects pointer-pause verification and mobile narrative label extraction without overwriting newer source.

### Insights

- Canonical 22-plus-guide registry requirement.
- Archive search and topic-cluster checks.
- Static article route, metadata, BlogPosting or Article schema, dates, breadcrumbs, citations, related reading, sitemap, robots, and `llms.txt` checks.
- RSS feed at `/insights/rss.xml`.
- Legacy `/blog` and `/blog/[slug]` redirects to canonical Insights URLs.

### Contact and APIs

- Canonical phone: `+91 84477 25381` / `+918447725381`.
- Public consultation duration: 30 minutes.
- Call, WhatsApp, Calendly, and written-enquiry paths guarded by source and runtime checks.
- Existing API protection contract plus deployed invalid-request checks.

## Items that still require external evidence

These must not be marked complete from source or headless-browser evidence alone:

- A real Calendly booking completed on a physical mobile device.
- A real phone tap and WhatsApp handoff on iOS and Android.
- Contact email delivery using the configured preview Resend credentials.
- Newsletter delivery and double opt-in using the configured preview provider.
- Vercel Speed Insights field data after enough real visits exist.
- Safari, Firefox, Android Chrome, Mac trackpad, and Windows precision-trackpad review on physical devices.
- Suman's approved biography dates, journey milestones, partner names, and permission-sensitive client claims.
- Final production-domain promotion and rollback rehearsal.

## Release rule

A green source gate proves that the permanent alias and GitHub source are the same. Green browser gates prove that the automated routes and states passed. Neither replaces Suman's visual approval or the real-device and real-delivery checks above.