# Branding Tatva Insights authority release

Verified: 7 August 2026  
Canonical source commit: `c2db51bb7e642e6b39d71e511dcab7ab7c33971a`  
Discovery workflow: `Insights discovery · c2db51bb7e642e6b39d71e511dcab7ab7c33971a`  
Workflow run: `31150191575`  
Evidence artifact: `branding-tatva-insights-discovery` (`8983003313`)

## Canonical editorial source

The integrated `homepage-cinematic-recovery` branch now contains the canonical Insights authority hub. It replaces the former competing article registries with one rendered library built from `src/data/insightLibrary.ts` and `src/data/insights.ts`.

The verified release contains:

- 29 published guide routes.
- 5 topic-hub routes: Positioning, Customer Experience, Distinctive Brand, Brand Messaging, and Brand Memory.
- 7 sourced guides with a visible Research sources chapter and matching `BlogPosting.citation` structured data.
- 22 unsourced guides that correctly omit both the visible research chapter and structured citations rather than receiving invented references.
- Canonical `/insights/feed.xml` and compatibility `/insights/rss.xml` feeds.
- Permanent redirects from `/blog` and superseded Insight slugs to the closest current guide, Work evidence, or service path.

## Automated evidence

The production build generated 77 static pages and rendered all 29 Insight guides plus all 5 topic hubs.

The discovery gate verified every guide and topic against the rendered application:

- `guideCount`: 29
- `topicCount`: 5
- `sourcedGuideCount`: 7
- `articleFailures`: 0
- Sitemap response: 200
- Robots response: 200
- Canonical feed response: 200, `application/rss+xml`
- RSS alias response: 200, `application/rss+xml`
- `llms.txt` response: 200

For all 29 guides, the gate verified:

- unique title, description, and canonical URL;
- one rendered H1;
- Article or BlogPosting schema;
- publication date in structured data;
- an internal path to Services, Work, or Contact;
- sitemap inclusion;
- inclusion in both feeds;
- visible-source and structured-citation parity.

## Integrated route verification

The separate canonical preview release gate passed on the same commit:

- Workflow run: `31150192765`
- Evidence artifact: `branding-tatva-preview-release` (`8983026679`)
- 12 primary-route checks: Home, Services, Work, Insights, About, and Contact at 1440×900 and 390×844.
- Browser errors: 0.
- Horizontal overflow: 0 pixels.
- Dynamic case-study route verified.
- Dynamic Insight route verified.
- Contact phone, WhatsApp, 30-minute duration, schedule anchor, written-enquiry anchor, form, canonical metadata, and stale twenty-minute copy checks passed.

## Remaining boundary

This release is verified against the local production server generated from the exact branch commit. Vercel has a READY deployment for the integrated application source, but the requested permanent review alias is still attached to an older deployment and must be reassigned before hosted evidence can be called canonical.

Production and `main` remain untouched.