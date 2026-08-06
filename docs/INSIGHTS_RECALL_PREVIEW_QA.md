# Insights recall-guide preview QA

Status: **candidate assembled, hosted build pending**

Branch: `preview/insights-recall-citations`

Article: `/insights/measure-brand-recall-limited-budget`

## Completed checks

- The existing limited-budget recall draft was rewritten around explicit survey-design boundaries rather than an unsupported universal respondent count.
- Six research sources are present in the article data and exposed through a dedicated evidence-ledger section in the preview route.
- A supplemental `BlogPosting` JSON-LD object uses the canonical article `@id` and exposes all six source URLs through the `citation` property.
- Googlebot metadata permits large image previews, full snippets, and video previews.
- The preview route keeps the shared article renderer, suppresses its duplicate closing CTA and footer, inserts the source ledger, and restores one final CTA and one footer.
- The split TSX route and evidence-ledger component passed an isolated strict TypeScript and JSX compile with structural stubs for their imported server components.
- The CSS override contains only two scoped rules and does not alter the shared dynamic article route.
- Each source URL was checked on 6 August 2026 and resolved to the intended publisher page.

## Source set

1. Ehrenberg-Bass Institute: mental availability versus awareness
2. Ehrenberg-Bass Institute: Category Entry Points
3. American Association for Public Opinion Research: survey best practices
4. Pew Research Center: writing survey questions
5. Pew Research Center: online nonprobability survey evaluation
6. Qualtrics: top-of-mind, unaided, and aided awareness examples

## Hosted checks still required

- Next.js production build on the repository dependency graph
- Route-resolution confirmation for the explicit article route beside `[slug]`
- Responsive browser screenshots at 390 px and 1440 px
- Hero-video playback and resource-response audit
- Archive, topic, sitemap, RSS, and `llms.txt` discovery checks against the built application

## Current infrastructure blocks

- The repository's GitHub Actions jobs are queued without a runner being assigned.
- Vercel rejected the preview deployment because the account reached its deployment build-rate limit and requested a retry after 24 hours.

No merge is permitted until the hosted checks above pass. `main`, staging, and production remain untouched.
