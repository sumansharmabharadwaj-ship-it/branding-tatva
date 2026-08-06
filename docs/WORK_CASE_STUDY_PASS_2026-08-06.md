# Branding Tatva Work Case-Study Pass

**Date:** 6 August 2026  
**Branch:** `homepage-cinematic-recovery`  
**Production:** untouched

## Why this pass exists

The redesigned `/work` index established hierarchy, but the five `/work/[slug]` routes still shared one generic composition. This pass turns each route into an evidence-led case study with project-specific visual behaviour while keeping a common navigation, reading, accessibility, and conversion framework.

## Shared case-study structure

Every client route now contains:

1. project-specific hero and transformation summary;
2. immediate result or honest evidence boundary;
3. starting condition;
4. audience context when the source contains it;
5. strategic diagnosis when the source contains it;
6. central decision;
7. execution or operating system;
8. outcome on record;
9. reflection when the source contains it;
10. project artefacts and decision details;
11. actual services used;
12. contextual inquiry path;
13. previous and next project navigation;
14. section progress navigation.

No testimonial is shown because no approved project testimonial exists in the current repository evidence.

## Project-specific treatments

### Dr. Haley Nutrition

**Mode:** measured performance  
**Visual logic:** publishing volume falls while value per post rises.  
**Result surfaced first:** 104% more followers earned per post, 1,350% more comments per post, and 365% higher LinkedIn impressions.  
**Evidence boundary:** all metrics remain tied to the recorded December 2025 to January 2026 engagement.

### MyShopInEurope

**Mode:** brand-system assembly  
**Visual logic:** ACCESS becomes ORIGIN, then resolves into a foundation, content architecture, channel roles, and rollout system.  
**Result surfaced first:** a complete brand foundation and content operating system replaced an access-only marketplace frame.  
**Evidence boundary:** no market-performance result is claimed.

### Executive Springboard

**Mode:** conversion journey  
**Visual logic:** Content → Webinar → Registration.  
**Result surfaced first:** a platform-specific content system connected everyday publishing directly to webinar registration.  
**Evidence boundary:** no registration count or conversion-rate claim is introduced.

### HerbalCart

**Mode:** perception reset  
**Visual logic:** the assumed herbal/Ayurvedic category frame is contrasted with the intended modern supplement-first frame.  
**Result surfaced first:** five shoot-ready formats and complete Hinglish scripts reset the campaign direction.  
**Evidence boundary:** the route describes the delivered campaign system, not an unverified commercial outcome.

### Plaxonic.com Content Portfolio

**Mode:** authority architecture  
**Visual logic:** Research Papers, Perspective Pieces, Blogs, and Articles assemble into a four-format authority system.  
**Result surfaced first:** sixteen pieces were organised to validate, challenge, humanise, and define.  
**Evidence boundary:** the Delhi Jal Board dosing figure remains a proof point contained in the research portfolio, not a result attributed to the content engagement itself.

## Motion and media behaviour

- videos are muted and inline;
- posters remain visible until video playback is ready;
- offscreen project videos pause through Intersection Observer;
- reduced motion replaces project video with the poster;
- the main Work flagship also falls back to a static poster;
- every written chapter remains visible without animation;
- project-specific transitions use opacity and transform rather than new pinned ScrollTriggers;
- no new long GSAP pin was added.

Atmospheric project media remains art direction. The strategic copy, recorded artefacts, and verified metrics are the evidence. It must not be described as documentary client footage unless the repository later contains publishable proof of that.

## Work-page hierarchy refinement

The live route now separates the two longer sticky flagship chapters with the faster Project Story Wall:

1. Dr. Haley Nutrition flagship;
2. contextual CTA;
3. Executive Springboard, HerbalCart, and Plaxonic project stories;
4. MyShopInEurope flagship;
5. Tier-three decision fragments.

This prevents two long sticky narratives from sitting directly beside one another.

`DecisionEvidenceGallery` is now explicitly framed as the Tier-three visual archive. Its seven entries are real decision fragments, not seven inflated case studies.

## Browser gate

The existing cinematic-recovery workflow now runs a dedicated Work-page browser gate after the production build and homepage gate.

The Work gate covers:

- `/work` at 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844, and 360×800;
- all five direct case-study routes at desktop and mobile widths;
- five hero project controls;
- six buyer-problem filters;
- Clarity-filter result accuracy;
- keyboard filter order;
- seven decision fragments;
- case-study selector and final CTA presence;
- direct route navigation and browser Back;
- service links;
- result/story/evidence/outcome anchors;
- metric-boundary copy;
- previous and next project navigation;
- reduced-motion poster fallbacks;
- horizontal overflow;
- broken images;
- console and network failures;
- screenshot evidence for key desktop and mobile scenes.

The gate writes `cinematic-recovery-audit/work-page-audit.json` and captures visual evidence in the workflow artifact.

## Still open

- review the generated screenshots by eye;
- replace atmospheric project media where publishable project-specific artefacts become available;
- reconcile the repository's client-permission conflict;
- decide whether project years can be structured for every engagement;
- add approved testimonials only when real quotes and permissions exist;
- verify the final protected Vercel preview after the build-rate queue clears;
- promote nothing to production until the browser gate and visual review both pass.
