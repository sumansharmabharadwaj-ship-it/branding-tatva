# Branding Tatva — Twelve Month Content & Authority System

The complete editorial system, ready to execute. Built on the governing bible's five pillars, the existing glossary (`src/data/glossary.ts`), and the live lead assets (Brand Recognition Audit, Brand Health Check). Every piece supports the philosophy and ends in a qualified next step. Quality over volume: one substantial pillar piece per month, supported by derivative formats, never filler.

## Operating rhythm (weekly)

| Day | Channel | Format |
|---|---|---|
| Tuesday | Insights (site) | Pillar article month, or glossary/diagnostic page in off weeks |
| Wednesday | LinkedIn | The article's sharpest claim as a standalone opinion post |
| Thursday | Instagram | Carousel: the article's framework in 5 to 7 cards, site palette |
| Friday | Newsletter | The article's core idea compressed to 200 words + one instruction |
| Monthly | YouTube | One 4 to 6 minute talking head: the pillar argued aloud |
| Monthly | Pinterest | The carousel cards re published as idea pins (evergreen search) |

One source piece feeds every channel. Nothing gets created channel first.

## The twelve months

| Month | Pillar piece (Insights) | Cluster | Lead magnet / conversion asset |
|---|---|---|---|
| 1 | What brand positioning actually decides | Positioning | Positioning checklist (10 items, gated like the audit) |
| 2 | Why visible brands stay forgettable | Recognition | Brand Recognition Audit (already live) |
| 3 | Verbal identity beyond tone of voice | Verbal identity | Voice worksheet: 12 sentences only your brand would say |
| 4 | When a growing business needs repositioning | Positioning | Repositioning readiness test (5 questions, health check pattern) |
| 5 | Distinctive assets and mental availability | Recognition | Asset inventory template |
| 6 | Brand architecture for multiple offers | Architecture | Architecture map worksheet |
| 7 | How psychology informs brand strategy | Psychology | Decision prompts: 8 questions before any rebrand |
| 8 | How to evaluate a branding proposal | Positioning | Proposal comparison sheet |
| 9 | Branding Tatva Lab: reframing a commodity category | Psychology | The Lab study itself (clearly labelled concept work) |
| 10 | What brand strategy costs across markets | Positioning | Scope explainer (links the live price book) |
| 11 | How to document brand decisions | Architecture | Decision record template |
| 12 | The annual brand health review | Recognition | Brand Health Check (already live) |

## Per channel strategy

**LinkedIn (primary authority channel).** Three posts weekly: the claim post (Wednesday), one observation from real client work Friday (anonymised unless cleared), one glossary term taught in plain language Monday. Voice: opinionated, first person, zero engagement bait. Goal: comments from founders, DMs into the audit.

**Instagram (recognition channel).** Two posts weekly: the framework carousel and one quiet brand-world post (studio, notes, process) in the site's earth palette. Every carousel ends with the same recognizable closing card — a distinctive asset in practice. Goal: profile visits → site.

**YouTube (depth channel).** One video monthly, the pillar argued to camera, natural light, chapter markers matching the article's headings. Titles are the pillar questions verbatim (search intent). Description links the article and the audit.

**Pinterest (evergreen search).** Idea pins from each carousel plus one text pin per glossary term. Pinterest queries for "brand identity" and "branding tips" stay stable year round; pins compound with zero cadence pressure.

**Newsletter (owned channel).** Friday, 200 words, one idea, one instruction, one link. Grows from the audit and the Contact form; the automation pack (EMAIL_AUTOMATION.md) handles the first five touches.

## SEO, AEO and GEO mapping

**Cluster structure** (already seeded in `src/data/glossary.ts`):
- Each month's pillar publishes at `/insights/<slug>` and joins its pillar in the topic clusters section.
- Glossary terms graduate to individual `/glossary/<term>` pages once 6+ pillar pieces exist to link from (build milestone, month 4).
- Internal linking rule: every pillar links 2 glossary terms + 1 service path + 1 case study; every glossary term links back to its pillar and one live example on the site.

**AEO:** every pillar opens with a direct 2 to 4 sentence answer to its title question; question subheadings from the clusters; author block with credentials on every piece (already live on Insights); Article schema with author, dates, and about entities (already emitted by the post template).

**GEO (US, UK, Canada per the standing directive):** pillar examples alternate spellings and market references naturally; the areaServed entities already declare the four markets in the sitewide schema; month 10's pricing piece speaks to each market's price book directly.

## Production notes

- Articles go in `src/data/blog.ts` (typed, no CMS) — the Insights page, clusters, sitemap, and schema pick them up automatically.
- Every new lead magnet reuses the RecognitionAudit pattern: useful preview visible, full asset behind first name + email + explicit consent, tagged by source.
- The commercial honesty rule is absolute: client examples only with cleared names or full anonymisation; concept work always labelled Branding Tatva Lab.
- Measurement: each pillar's success = audit requests + session bookings attributed in the analytics funnel, never raw traffic.
