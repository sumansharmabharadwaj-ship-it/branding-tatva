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

The source gate now resolves the latest **deployable application commit**, using the same path boundary as `vercel.json`'s ignored-build command. Workflow-only documentation and verifier commits therefore no longer create an impossible wait for a Vercel deployment that should correctly be skipped.

The gate also understands Vercel Deployment Protection. It uses `VERCEL_AUTOMATION_BYPASS_SECRET` when configured and fails immediately with an explicit authentication diagnosis when the secret is absent or rejected, rather than polling a protected 401 response for twelve minutes.

## Current certified application source

- Deployable commit: `79ede2c19d3825df2d6dca2e3d41ccc34c5f7bef`
- Commit purpose: repair the client-proof Insight's missing poster and video pair.
- READY deployment: `dpl_AGKbgVhHmrtPjDHPNZVvCxZs97UF`
- Immutable preview: `https://branding-tatva-oue6ecbln-suman22.vercel.app/`
- Runtime branch: `homepage-cinematic-recovery`
- Runtime environment: `preview`

The immutable deployment's `/api/release` endpoint reports this exact commit, branch, environment, permanent-review alias contract, and canonical backlog.

## Permanent-alias boundary

The permanent review alias still resolves to older CLI deployment `dpl_HcKYrrLjAWoGBq9uVJXoUknn5wXv`, sourced from commit `a717c871427f08c0b50f7607c608ed8887bf0c04`. Reassignment is intentionally not faked in source. It requires external Vercel configuration:

- `VERCEL_TOKEN` with permission to assign the alias to the certified deployment.
- `VERCEL_AUTOMATION_BYPASS_SECRET` so GitHub Actions can inspect the protected alias without disabling preview protection.

Until both are configured and the alias is reassigned, the permanent source gate must remain red even though the correct immutable deployment is READY.

## Automated verification attached to the canonical branch

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
- Responsive video source listeners are released during unmount, preventing the previously measured Services page-tree retention through Blink MediaQueryList roots.

### Work

- Full eight-contract matrix: page hierarchy and viewports, hero pause, capability attention, mobile narrative, mobile index, Lab accessibility, decision context, and public-brand-study context.
- Exact unchanged Work source passed run `31166850299`.
- The verifier respects the production Content Security Policy rather than weakening it with `unsafe-eval`.

### Insights

- One canonical registry containing 29 published guides across five topic hubs.
- Archive search, topic filters, related reading, sourced and unsourced article behavior, keyboard operation, mobile rendering, and reduced motion.
- Static article routes, metadata, BlogPosting schema, dates, breadcrumbs, FAQ schema, citations, sitemap, robots, Googlebot preview directives, and `llms.txt`.
- Both feeds: `/insights/feed.xml` and `/insights/rss.xml`.
- Legacy `/blog` and `/blog/[slug]` redirects to canonical Insights URLs.
- Missing `cinematic-waterlight` media references replaced with the valid approved water-element poster and video pair.
- Final green evidence:
  - Authority run `31183444009`.
  - Responsive browser run `31183533137`.
  - Discovery run `31183610142`.

### Contact and APIs

- Canonical phone: `+91 84477 25381` / `+918447725381`.
- Public consultation duration: 30 minutes.
- Call, WhatsApp, Calendly, and written-enquiry paths guarded by source and runtime checks.
- Existing API protection contract plus deployed invalid-request checks.

## Items that still require external evidence

These must not be marked complete from source or headless-browser evidence alone:

- Reassigning and authenticating the permanent protected Vercel alias.
- A real Calendly booking completed on a physical mobile device.
- A real phone tap and WhatsApp handoff on iOS and Android.
- Contact email delivery using the configured preview Resend credentials.
- Newsletter delivery and double opt-in using the configured preview provider.
- Vercel Speed Insights field data after enough real visits exist.
- Safari, Firefox, Android Chrome, Mac trackpad, and Windows precision-trackpad review on physical devices.
- Suman's approved biography dates, journey milestones, partner names, and permission-sensitive client claims.
- Final production-domain promotion and rollback rehearsal.

## Release rule

A green source gate proves that the permanent alias and the latest deployable GitHub source are the same. Green browser gates prove that the automated routes and states passed. Neither replaces Suman's visual approval or the real-device and real-delivery checks above.