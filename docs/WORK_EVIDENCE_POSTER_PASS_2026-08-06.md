# Branding Tatva Work Evidence-Poster Pass

**Date:** 6 August 2026  
**Branch:** `homepage-cinematic-recovery`  
**Production:** untouched

## Purpose

The Work-page hierarchy and case-study writing were in place, but several portfolio surfaces still used atmospheric or generated imagery. Those visuals could support mood, yet they could not honestly demonstrate the strategic work described beside them.

This pass replaces those Work-page surfaces with project-specific editorial evidence diagrams. Every diagram is reconstructed from the recorded challenge, strategy, execution, outcome, and verified metrics in `src/data/projects.ts`. They are not presented as client-supplied photography, documentary footage, approved mockups, or original confidential documents.

## Evidence posters created

### Dr. Haley Nutrition

**File:** `public/images/work-evidence-dr-haley.svg`

The poster visualises:

- 23 Instagram posts in December;
- 12 Instagram posts in January;
- 48% fewer posts;
- 104% more followers earned per post;
- 1,350% increase in comments per post;
- 365% rise in LinkedIn impressions;
- engagement rate moving from 0.71% to 2.81%.

No metric beyond the recorded December 2025 to January 2026 engagement is introduced.

### MyShopInEurope

**File:** `public/images/work-evidence-myshopineurope.svg`

The poster visualises:

- ACCESS → ORIGIN → SYSTEM;
- belief, mission, promise, and value;
- the recorded 65% authority / 25% culture / 10% direct-brand content mix;
- the recorded rollout sequence: foundation, audience pull, lead quality, market position;
- the recorded LinkedIn, Instagram, YouTube, and Reddit channel architecture.

No commercial performance result is claimed.

### Executive Springboard

**File:** `public/images/work-evidence-executive-springboard.svg`

The poster visualises:

- Content → Webinar → Registration;
- competitive audit;
- eight content pillars;
- platform-specific playbooks;
- the registration sequence.

No registration count or conversion-rate result is introduced.

### HerbalCart

**File:** `public/images/work-evidence-herbalcart.svg`

The poster visualises:

- the inherited herbal or Ayurvedic category assumption;
- the intended modern, practical, supplement-first frame;
- food-versus-supplement comparisons;
- why-supplement explanations;
- DIY recipes;
- real-user transformation formats;
- reaction-style reviews;
- Hinglish scripting and native cultural references.

The poster demonstrates the delivered campaign direction. It does not claim a measured market-perception or sales result.

### Plaxonic.com Content Portfolio

**File:** `public/images/work-evidence-plaxonic.svg`

The poster visualises:

- sixteen pieces across four formats;
- Research Papers to validate;
- Perspective Pieces to challenge;
- Blogs to humanise;
- Articles to define;
- the Delhi Jal Board proof point as material used inside the research portfolio.

The Delhi Jal Board dosing figure remains evidence contained in the research content. It is not attributed as a result caused by the content engagement.

## Where the posters are used

`src/data/workTaxonomy.ts` now maps every recorded project to one evidence poster.

The posters replace atmospheric project imagery in:

- the Work-page hero;
- desktop project-index previews;
- mobile project-index previews;
- the Project Story Wall;
- the Dr. Haley performance flagship;
- the MyShopInEurope system flagship;
- all five project-detail heroes;
- all five project-detail evidence surfaces;
- previous and next project handoffs;
- structured-data image references for project-detail routes.

Atmospheric media remains available elsewhere in the repository, but it is no longer used as the primary evidence layer on the Work page or its client case studies.

## Evidence integrity changes

### Exact metrics at every frame

`AnimatedStat` now renders the verified value directly. The surrounding cards and sections may reveal with restrained motion, but the number itself never rolls through an incorrect intermediate state.

This prevents:

- 104% briefly appearing as a lower number;
- screenshots capturing a false result;
- background tabs pausing midway through an evidence count;
- reduced-motion users receiving different values;
- assistive technology encountering transient numerical claims.

### Reduced-motion flagship

The Dr. Haley flagship now uses the evidence diagram as its stable first render. Reduced motion keeps the complete diagram visible without autoplay or scroll-controlled grading.

### Case-study media boundary

Project-detail routes receive:

- no atmospheric hero video;
- no atmospheric card video;
- the evidence poster as `cardImage` and `heroPoster`.

Genuine client artefacts may replace these diagrams only after they are explicitly cleared and documented in the source data.

## Mobile and readability corrections

### Work index

Inactive project rows are no longer washed down to near-disabled contrast. Mobile rows remain fully readable; desktop rows use only a modest contrast reduction.

### Case-study navigation

The mobile fixed section bar has been replaced with a compact safe-area-aware guide. It opens the Result, Story, Evidence, and Outcome destinations only when requested, instead of sitting across body copy.

### Case-study selector

The selector heading is immediately readable rather than entering through another repeated fade-up. Inactive capability labels retain enough contrast to be scanned as available, while selected capabilities remain visually dominant.

## Verification gate

The independent Work evidence workflow runs:

- a production Next.js build;
- all five statically generated client case-study routes;
- `/work` across seven required viewport sizes;
- all five case-study routes at desktop and mobile widths;
- project filters;
- browser Back;
- direct routes;
- contextual CTAs;
- service links;
- reduced motion;
- image loading;
- horizontal overflow;
- screenshot evidence.

The workflow artifact contains `work-page-audit.json` plus desktop and mobile evidence captures. Production remains untouched until the focused gate is green and the generated captures are reviewed by eye.
