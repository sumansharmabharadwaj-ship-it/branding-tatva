# Search visibility: 18 September 2026

## Observed baseline

The public domain is https://brandingtatva.com. Vercel reports production deployment `dpl_9JrSiMZcJ4BfVvxzpxpL4stSs33Q`, source `a7587c035f28937fd6ec9671c08bd56d50b9ebb8`. Its creation time is 17 September; that does not establish the first date the domain was publicly available.

The homepage, Services, About, Insights and Contact returned HTTP 200 with production canonicals and `index, follow`. Robots permits Googlebot; the sitemap is reachable. These checks establish technical eligibility, not Google indexing or a ranking position. Public searches did not return a clear result for the site, but only Search Console can establish the property's actual indexing and query performance.

The www hostname also served HTTP 200. The homepage included FAQ structured data for questions absent from the visible homepage. Many sitemap entries shared a hardcoded 7 August modification date despite subsequent work. Service discovery depended principally on one broad Services page and editorial guides.

## Changes

1. Permanent www-to-apex redirect, retaining path and query.
2. Host-scoped `X-Robots-Tag: noindex, follow` for Vercel aliases, including aliases of a production build. The public domain remains indexable. Existing preview environment restrictions remain active.
3. Homepage title and description identify Branding Tatva's service and audience. Replace the unsupported FAQ node with a WebPage node referencing the existing Organization, Person and WebSite.
4. Two substantive, server-rendered service pages: `/brand-positioning` and `/brand-audit`. Each states the work, suitability, possible outputs, preparation, scope boundaries, related reading and a consultation route. No invented testimonials, locality, prices or outcomes.
5. Visible service links in the shared footer, plus links between the service pages, existing guides, Services, About and Contact. Include both pages in the sitemap with their actual creation date.
6. Omit unverified shared last-modification dates. Retain existing individually maintained editorial dates.
7. Support an optional `GOOGLE_SITE_VERIFICATION` environment value. No verification token has been supplied or invented. This change alone does not verify Search Console ownership.
8. At the owner's request, prioritise UK service businesses in homepage and Services metadata, visible Services and footer copy, and both focused service pages. Each service page explains a distinct UK buyer situation and the remote engagement. Existing URLs and global service availability remain intact; no UK office, unconfirmed pricing, customer outcome or local address is asserted.

## Query-to-page map

These are relevance targets, not measured search-volume or difficulty estimates.

| Search intent | Primary page |
| --- | --- |
| Branding Tatva; Branding Tatva Suman Sharma | `/` |
| Suman Sharma brand strategist | `/about` |
| Brand strategy for UK service businesses | `/services` |
| Brand positioning consultant UK; positioning for UK service businesses | `/brand-positioning` |
| Brand audit services UK; brand audit before rebranding | `/brand-audit` |
| How to position a service business | `/insights/brand-positioning-strategy-service-businesses` |
| Brand audit checklist | `/insights/brand-audit-checklist-before-rebrand` |

## Validation

- TypeScript and focused ESLint passed.
- Production build passed: 88 generated routes.
- Built-server HTTP checks passed on Home, both new pages, Services, About and Contact: HTTP 200, one H1, correct canonical, production indexability and valid JSON-LD.
- Both new pages' related guide links returned HTTP 200.
- Permanent redirects passed for the root and a nested URL with a query string.
- Public-domain headers remained indexable; two Vercel hostname checks received noindex.
- Sitemap contained 70 unique canonical URLs, including both new pages.
- Public media was omitted from the local sparse checkout. This does not delete repository assets; a hosted visual check remains necessary.

## Search Console actions after publication

1. Open the existing property for the public domain. Check ownership before creating a duplicate property. Complete verification only with Google's actual DNS record, HTML file or meta token.
2. Inspect the homepage, Services and both new service URLs. Check live fetch, indexing permission, selected canonical and any reported exclusion reason. Do not infer these from a site search.
3. Submit `https://brandingtatva.com/sitemap.xml` once and verify its status. Request indexing for the homepage and the new pages once; repeated requests do not accelerate crawling.
4. Record a baseline for clicks, impressions, CTR and position with the Performance country filter set to United Kingdom. Separate branded queries (Branding Tatva and Suman Sharma) from service queries; compare mobile and desktop. Record the date range and each query's landing page. There is no measured UK ranking baseline in this change, and average position does not mean a guaranteed first-page result for every searcher.
5. Inspect Manual Actions, Security Issues and Core Web Vitals before attributing weak visibility to content alone.

## Subsequent work

The priority market is the United Kingdom. Start with the three service intents mapped above, rather than an undifferentiated goal of ranking for every branding search. UK search volume and difficulty have not been measured. Use 28-day country-filtered comparisons once enough Search Console data exists; inspect indexing first if impressions are absent. Keep evidence-led project examples and relevant UK industry mentions as subsequent work requiring genuine source material and, for outreach, explicit messaging authorisation.

All pages are currently a single English version. This patch does not add artificial regional duplicates, IP redirects, location meta tags or a fake UK business address. Locale and structured data alone cannot establish a ranking position. Revisit region-specific URLs and hreflang only if genuinely distinct regional content is introduced.

Use Search Console evidence to select the next improvement. If URLs are excluded, resolve the specific exclusion. If indexed pages have relevant impressions but weak clicks, improve the title and page promise. If relevant service queries produce few impressions, deepen the corresponding page with verified examples, decision criteria and evidence. Publish original project analysis with permission and pursue relevant earned mentions; avoid purchased links, fabricated reviews and duplicated city pages.

Ranking improvements require crawling, indexing and competition against existing results. No first-page position or timeline is promised.

## References

- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites

## Release boundary

The change starts from the inspected production source, on `seo/search-foundations-2026-09-18`. The active homepage branch has later work. Do not force-push either branch or overwrite later work when carrying the SEO changes forward. A preview uses preview noindex metadata; publishing requires a production build with `VERCEL_ENV=production`, not simply assigning the custom domain to a preview build.

## Integration with the current site

The UK SEO patch was carried forward onto `e2fd2d5cc0e562b20c2d5559bd7b29e2ade859a7` from `august-8-isolated`. Production had meanwhile advanced to release 399, source `2b966e0372d390be4568978fe62a88292ff21dcc`. The integration preserves the newer homepage motion, the WebPage and Service graph, the revised Services composition and the subsequent Services runtime repair. The unsupported homepage FAQ is removed; the existing WebPage node receives the UK title and author reference. New service copy follows the current house voice rules.

TypeScript and focused ESLint passed on the integrated source. Its production build passed with 93 generated routes. Release 400 requests the controlled preview of the integrated source; publication to the custom domain remains a separate production build step.

Integrated built-server checks passed on Home, Services, About, Contact and both new service pages: HTTP 200, one H1, canonical URLs, production indexability, UK metadata on the intended pages, valid structured data and working guide links. The homepage retained exactly one WebPage and its existing Service node. The sitemap contains 75 unique canonical URLs. Public robots rules, www redirects and Vercel hostname noindex headers passed. The controlled deployment self-test and its required contact delivery check also passed.

Google Public DNS returned the owner's `google-site-verification` TXT record at the root of `brandingtatva.com` on 18 September. This confirms public DNS visibility, not completed Search Console ownership verification. The user must finish Verify in their authenticated Search Console session. The assistant's Search Console and Vercel browser sessions remained signed out at this check.

## Contextual article discovery

Four established guides now link to their matching service page within the existing next-step section and desktop reading sidebar. The positioning and consulting guides link to `/brand-positioning`; the audit and consistency guides link to `/brand-audit`. Each link describes the engagement in the context of the article. Topic hubs and other articles retain their existing service paths; project evidence and contact links remain intact.

TypeScript, focused ESLint, the production build (93 routes), contact delivery gate and deployment gate passed. Inspection of the generated HTML confirmed the four ordinary anchor links, their existing proof and contact destinations, the unchanged messaging guide path, production canonicals and indexability for both service destinations. This is a discovery improvement, not a measured ranking result.

The deployment workflow confirms that its existing `VERCEL_TOKEN` secret is absent. Git integration can create previews, but authenticated production promotion and Search Console actions still need the owner's account session. Production was still release 399 at this check.

Reference: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
