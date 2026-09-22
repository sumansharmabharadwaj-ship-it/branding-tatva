# UK service search improvements — 22 September 2026

## Observed production baseline

Production was Vercel deployment `dpl_CExjCZ1SxSjnr2wmZb7LqzP1AYcF`, source `9e1fa10fffb145bae711e0deba9adda3118eab95` on `main` (release 488). The active development branch was ahead, so this patch starts from production and should also be carried onto the development branch without overwriting its design work.

HTTP checks of Home, Services, Brand Positioning and Brand Audit returned 200, one H1, the public canonical and `index, follow`. Production robots permits crawling and advertises the sitemap. The sitemap contained 86 unique URLs. These observations establish technical eligibility, not Google's indexing decision or a UK rank.

Search Console opened its signed-out public introduction. No property reports, UK impressions, Google-selected canonicals, manual actions or Core Web Vitals data were accessible. No ranking baseline or indexing request is claimed.

## Changes

* Add `/brand-messaging` for a distinct commercial question: commissioning messaging and voice work for a UK service business. The page explains scope, outputs, preparation, research dependencies, remote collaboration and the difference between messaging guidance and a full website rewrite.
* Deepen positioning and audit pages with clearly labelled worked examples, relevant existing project records and four buying questions each. Avoid representing examples as customer results or existing project records as UK client evidence.
* Add visible authorship and accurate content revision dates. Reuse the existing WebPage, Service and breadcrumb schema. Questions remain accessible native HTML disclosures; no unsupported rich-result claims or FAQ schema are added.
* Connect the messaging topic and its articles to the dedicated service page. Add a sitewide footer link and cross-links between all three service pages. Existing sitemap generation picks up the new page and revised service dates.
* Preserve the homepage scenes, About opening, existing routes, enquiry forms, production indexing and preview noindex policy.

## Query-to-page map

These are relevance targets, not measured search volumes or ranking claims.

| Intent | Destination |
| --- | --- |
| Brand strategy for UK service businesses | `/services` |
| Brand positioning consultant UK | `/brand-positioning` |
| Brand audit services UK | `/brand-audit` |
| Brand messaging consultant UK; tone of voice for service businesses | `/brand-messaging` |

## Validation before publication

* TypeScript, focused ESLint and copy voice checks passed.
* Production build passed with 105 generated pages.
* Existing internal-link and deployment gates and the contact delivery regression check passed.
* Built-server HTTP checks: all three service pages returned 200 with one H1, correct public canonical, production indexing, valid WebPage/Service structured data and four rendered question-and-answer disclosures. Examples and evidence were present in the server HTML.
* Discovery links were present in Home, the messaging topic, the service-page messaging guide and the voice guidelines guide.
* All 20 internal destinations linked by the service pages returned HTTP 200.
* Generated sitemap contains 87 unique URLs including the new service page. A Vercel hostname still receives a noindex response header.

## Account work still required

Open the existing Search Console property before attempting to add another one. Confirm ownership, inspect the public homepage and three service URLs, and record Google's selected canonical and any exclusion reason. Submit the existing sitemap if it has not been submitted successfully. Request indexing once for the new page and materially updated pages; repeated requests do not accelerate crawling.

Record UK Web Search impressions, clicks, CTR and average position for the last 28 days, with a previous-period comparison when data exists. Separate branded searches from service searches and inspect the page associated with each query. Review indexing, manual actions, security issues and field Core Web Vitals before attributing a lack of impressions to copy.

Use that evidence to choose subsequent work. Excluded URLs need their stated cause resolved; indexed pages with impressions but weak clicks need a closer match between the result promise and the page; low service-query coverage may need more specific, verified project evidence and earned relevant references. No outreach, paid links, third-party profile changes or invented customer reviews form part of this release.

Google controls ranking and recrawling. Publication does not establish a first-page position or a guaranteed ranking timeline.

## Primary guidance

* https://developers.google.com/search/docs/fundamentals/seo-starter-guide
* https://developers.google.com/search/docs/essentials
* https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
* https://support.google.com/webmasters/answer/7576553
