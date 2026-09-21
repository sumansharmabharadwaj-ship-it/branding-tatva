# Branding Tatva Work Page Audit

**Date:** 6 August 2026  
**Repository:** `sumansharmabharadwaj-ship-it/branding-tatva`  
**Branch:** `homepage-cinematic-recovery`  
**Route:** `/work`

## Audit constraint

The protected Vercel preview currently redirects unauthenticated visitors to Vercel SSO. This audit therefore covers the repository implementation, content data, asset inventory, responsive code paths, accessibility states, and media declarations. A rendered-browser audit remains mandatory after a deploy-protection bypass or authenticated preview becomes available.

## Executive finding

The current Work page is not a generic card grid. It already contains strong editorial thinking, genuine project narratives, accessible interactive components, and one unusually good evidence-led signature chapter. The central problem is not lack of effort. It is hierarchy.

The route currently presents several adjacent mechanisms that explain similar ideas in different forms:

1. opening proposition;
2. capability map;
3. contextual CTA;
4. project contents index;
5. one signature project;
6. decision evidence gallery;
7. five-element decision map;
8. concept lab;
9. marketing ecosystem;
10. project archive;
11. independent brand studies;
12. authorship;
13. final consultation CTA.

Individually, many of these sections are thoughtful. Together, they create a long sequence of explanation before the page establishes a simple buyer-facing hierarchy of strongest proof, relevant proof, wider range, and next action.

The rebuild should preserve the strongest components, reduce repeated conceptual teaching, and make the real work visually dominant.

---

# 1. Content audit

## Project truth matrix

| Project | Repository evidence | Quantitative evidence | Current completeness | Proposed tier | Important constraint |
| --- | --- | --- | --- | --- | --- |
| Dr. Haley Nutrition | Challenge, insight, strategy, execution, reflection, outcome, media, four structured stats | Strong. January versus December performance data is structured in `projects.ts` | Complete enough for a flagship case study | Tier 1 flagship | Keep metrics exactly as sourced. Do not extrapolate beyond the two-month engagement. |
| MyShopInEurope | Full foundation, audience, insight, strategy, execution, outcome, media | No performance metrics | Strong strategic narrative, but outcome is a delivered system rather than a measured market result | Tier 1 flagship or Tier 2 project story | Permission status conflicts between `projects.ts` and `ASSET_INVENTORY.md`. Do not add new public claims until resolved. |
| Executive Springboard | Challenge, strategy, execution, outcome, media | No performance metrics | Useful but intentionally higher-level because the full source text is not available in the repository summary | Tier 2 project story | Do not inflate the webinar-conversion claim into a measured result. |
| HerbalCart | Challenge, audience, insight, strategy, execution, reflection, outcome, media | No performance metrics | Good repositioning and campaign-process story | Tier 2 project story | Outcome is delivery and perception direction, not a proved commercial result. |
| Plaxonic.com Content Portfolio | Challenge, strategy, execution, outcome, two structured numbers, media | A 16-piece portfolio and a Delhi Jal Board proof point are recorded | Moderate-to-strong thought-leadership story | Tier 2 project story | Asset inventory says two source-plan versions exist and the final version is unresolved. Preserve only already-recorded claims. |

## Source conflict requiring owner resolution

`src/data/projects.ts` says client names were cleared for public use. `docs/ASSET_INVENTORY.md` still marks several projects as requiring permission confirmation. These two repository sources conflict.

Until the owner resolves the conflict:

- keep currently published names and copy unchanged;
- do not add new client logos, testimonials, private documents, portraits, or expanded claims;
- label independent and concept work unmistakably;
- do not infer permission from the existence of an asset.

## Existing content strengths

- Every client entry has at least a challenge, service connection, outcome, and project-specific hook.
- Dr. Haley Nutrition has the clearest evidence chain and deserves flagship priority.
- The repository distinguishes client work, independent brand studies, and speculative concept work.
- The current copy mostly avoids empty agency language and explains concrete decisions.
- The founder-led authorship layer is present.
- Service connections already exist in project data.

## Content gaps

- There is no explicit three-tier portfolio model on the route.
- The page has one deep flagship chapter, not a deliberate set of flagship case studies plus shorter stories and a visual archive.
- Results are not surfaced consistently near the opening of every project.
- Project years, engagement types, and permission status are not structured.
- Testimonials are absent. None should be invented.
- Some project media is atmospheric rather than actual project evidence.
- Concept studies and public-record brand analyses add breadth, but they can blur the main client-work narrative when placed in the same long stream.

---

# 2. Design audit

## Existing strengths

- The opening uses a quiet editorial cream ground rather than a random full-screen stock-video hero.
- The project index uses a live preview on desktop and inline images on mobile, so information is not hover-only.
- The signature project uses a sticky evidence panel and six narrative beats without adding a ScrollTrigger pin.
- Colour is restrained and tokenised through the Work palette.
- Individual project accents and project-specific videos already exist on case-study routes.
- The page avoids a conventional three-column portfolio grid.

## Design problems

### The first viewport does not prove abundance

The hero currently shows two overlapping stills. It communicates restraint, but not the breadth, energy, and quality expected from the strongest page on the site. The new opening needs a controlled montage of genuine project fragments while keeping the headline readable immediately.

### No compact proof layer

There is no proof strip immediately after the hero. The page moves into an abstract capability mechanism before giving the visitor a fast, concrete summary of what is on record.

### No visible project hierarchy

All five engagements appear in the contents list and later repeat in the archive. The visitor cannot distinguish:

- flagship case studies;
- shorter project stories;
- wider visual or experimental work.

### Repeated explanatory sections

`CapabilityMap`, `DecisionEvidenceGallery`, `DecisionMap`, and `MarketingEcosystem` all explain strategic judgment through interactive selection. This repetition lengthens the journey and competes with the actual case studies.

### The archive repeats the index

The index and archive both list the same five projects. Their visual treatments differ, but they do not currently perform sufficiently different jobs.

### Project-specific art direction is limited

Detail pages change accent colour and media, but the narrative layout remains essentially identical across all projects. The strongest case studies should have distinct visual behaviour where evidence permits.

### Stock-footage risk inside case studies

Several closing videos are landscape or nature clips. The new brief correctly prioritises actual work footage and project artefacts over unrelated atmosphere. Atmospheric footage may remain only as a transition when it does not impersonate project evidence.

---

# 3. Interaction audit

## Existing interactions

- Framer Motion headline and content reveals;
- pointer drift on the desktop hero still stack;
- accessible active-preview project index;
- accessible need selector in the capability map;
- sticky signature-project media with IntersectionObserver beat tracking;
- expandable decision evidence tiles;
- interactive five-question decision map;
- expandable concept-study dossiers;
- business-type marketing explorer;
- reduced-motion branches across the main interactive sections.

## Interaction strengths

- Key content does not rely solely on hover.
- Reduced-motion handling is present in the major client components.
- The signature project avoids brittle pinning and lets the document retain normal scroll flow.
- Mobile project previews are deliberately shortened to reduce scroll fatigue.
- Interactive controls use buttons, links, pressed or expanded states, and focus-visible styling.

## Interaction problems

- Too many consecutive selectors create interaction fatigue.
- The opening interaction is subtle pointer drift, not a memorable scroll-led reveal.
- The project index lacks filtering by service or buyer problem.
- The page does not yet change viewing mode clearly enough between overview, scan, immersion, process, results, range, and conversion.
- The route needs rendered verification for autoplay, reverse scroll, focus order, sticky boundaries, mobile viewport height, and media loading.

---

# 4. Conversion audit

## What currently works

- The opening names the founder’s role.
- The capability map connects needs to projects and service paths.
- The signature case links to the full case study.
- Project detail pages carry a “Start a similar project” CTA.
- The route ends with a consultation CTA.

## Conversion gaps

- The strongest factual proof is not presented immediately after the hero.
- The page does not let a buyer filter the archive by the problem they recognise in their own business.
- The early contextual CTA asks visitors to explore work they are about to encounter anyway.
- The final CTA is generic relative to the accumulated strategic evidence.
- Trust cues near the final CTA are thin.
- The index and archive do not visibly connect each project to the most relevant service chapter.
- Only one featured case receives an immersive summary on the main page.
- Outcomes are strong on Dr. Haley Nutrition but visually inconsistent elsewhere.

---

# 5. Information architecture decision

The first implementation should use this sequence:

1. **Cinematic evidence hero** using genuine project media, immediate readable proposition, active project metadata, and an Explore action.
2. **Compact proof strip** based only on recorded capabilities and engagements.
3. **Filterable Work index** with buyer-problem and service-oriented discovery.
4. **Flagship case study** for Dr. Haley Nutrition, retaining the six-beat evidence narrative.
5. **Project stories** for the remaining real engagements, lighter than a flagship and honest about evidence limits.
6. **Decisions, not decoration** using the existing decision-evidence gallery.
7. **Wider archive** that clearly separates client work, concept studies, and independent public-record analyses.
8. **Case-study selector** adapted from the strongest parts of the current capability map.
9. **Founder-led authority and final conversion** with one problem-focused primary action and one quieter alternative.

`DecisionMap` and `MarketingEcosystem` should be removed from the main Work-page scroll during the first consolidation pass, not deleted. They can be repurposed on Services, Process, or individual case-study routes if they improve those journeys.

---

# 6. First implementation slice

## Build now

- Upgrade `WorkOpening` from two static stills to a controlled, genuine-project montage.
- Add a compact `WorkProofStrip` immediately after the hero.
- Add structured buyer-problem tags to project data, derived only from each recorded challenge.
- Add accessible filters to `WorkIndex`.
- Reorder the main route around evidence hierarchy.
- Remove duplicated conceptual sections from the rendered route while preserving their source files.
- Rewrite the final conversion scene around a concrete brand problem and founder-led collaboration.
- Add an explicit route-level distinction between client engagements, concept work, and independent studies.

## Do not build yet

- invented testimonials;
- invented performance figures;
- fake client logos;
- new project dates;
- unverified permissions;
- project-specific visuals not present in the repository;
- long ScrollTrigger pin sequences;
- autoplaying every preview at once;
- a complete redesign of all case-study detail routes before the main-page hierarchy is verified.

---

# 7. Verification gate

Before the first implementation slice is called complete, verify the deployed branch at:

- 1440 × 900;
- 1280 × 800;
- 1024 × 768;
- 768 × 1024;
- 430 × 932;
- 390 × 844;
- 360 × 800.

Check:

- hero media loads without black flashes;
- only the intended media plays;
- filters work with pointer, keyboard, and touch;
- focus order follows visual order;
- sticky media releases cleanly in both scroll directions;
- no horizontal overflow;
- no content becomes inaccessible with reduced motion;
- case-study links and service links are valid;
- direct routes and browser Back preserve a usable state;
- the final deployed preview actually contains the new build.

## Current status

**Audit complete from repository evidence. Rendered-browser audit blocked by Vercel SSO.**

The next commit should implement the first slice above on `homepage-cinematic-recovery` only. Production must remain untouched until explicit approval.