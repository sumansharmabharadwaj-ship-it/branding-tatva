# Branding Tatva · Canonical Pending-Work Board

Last reconstructed: 18 August 2026

This file is the single source of truth for unfinished website work. It consolidates Suman's chat instructions, the full-site audit manuals, the current `homepage-cinematic-recovery` branch, open verification PRs, and the preview/deployment boundary.

## Governing rules

- Work only on preview branches until Suman explicitly approves production.
- Permanent review alias: `https://branding-tatva-git-homepage-cinematic-recovery-suman22.vercel.app/`.
- Preserve the approved nature-led cinematic world: mist, water, roots, moss, moving light, cool charcoal/slate/forest/silver/deep-water tones, and restrained gold.
- No generic corporate footage, tourist landscapes, wellness clichés, heavy orange grading, repeated sunrise footage, or spectacle without a strategic job.
- Native browser scrolling remains primary. Do not trap wheel, trackpad, touch, keyboard, anchors, back navigation, or reduced-motion users.
- Use verified work and sourced claims only. Label non-client studies clearly as Branding Tatva Lab, Concept Work, or independent analysis.
- Mobile must be authored rather than a compressed desktop.
- Maximum active films: two on desktop, one on mobile or constrained devices. Pause offscreen media and provide poster/reduced-motion fallbacks.

## P0 · Release and deployment blockers

- [x] Publish the complete cinematic application source to `homepage-cinematic-recovery`; current source head is `5b92e1ac734ac8638964ba88858a7d70acaf6de6`.
- [x] Keep the permanent review alias attached only to the `homepage-cinematic-recovery` preview environment; production remains untouched.
- [ ] Configure `VERCEL_TOKEN` for alias management and `VERCEL_AUTOMATION_BYPASS_SECRET` for protected-preview CI, without weakening preview protection.
- [ ] Verify `/api/release` and `/api/verification` on the permanent alias report the certified canonical commit, branch `homepage-cinematic-recovery`, and preview environment.
- [x] Make the permanent source gate compare the latest deployable application commit rather than workflow-only branch commits, and fail immediately when preview authentication is unavailable.
- [ ] Deploy the complete source head after Vercel's Hobby-plan deployment limit resets. The clean commit is currently rejected with `api-deployments-free-per-day` / retry in 24 hours.
- [ ] Complete the final Services browser matrix; Home, Work, Contact, shared media, and utility media are green on the current source line.
- [ ] Run the integrated browser matrix on the deployed artifact, not only the local production build.
- [ ] Record Vercel Speed Insights and field Core Web Vitals where available: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- [ ] Keep a rollback commit and do not promote production until Suman approves desktop and mobile screenshots.

Current release evidence: the permanent alias currently resolves to READY deployment `dpl_FCTrUGDsvz65fuucQeTMoc66Jq5w` from intermediate commit `90de2b6f0f1474d47213d1a4383d1255fd42fbe8`. That artifact contains the latest Home, Work, Services, Contact, About, Insights, and shared-footer application changes plus the new utility posters, but it predates assembly of the four utility MP4 payloads; those four utility mastheads therefore retain their poster fallback until the clean source can deploy. The last complete main-route immutable deployment is `dpl_JDM8gLziegH2Q7A9Rzv8TRXCHs5G` from Work commit `429bcf7eb23adca407d24485647fa5bcbf13fdde`. Protected-preview CI still needs `VERCEL_AUTOMATION_BYPASS_SECRET`.

## P0 · Homepage V5

### Established

- Eight one-screen desktop chapters: Opening, Recognition, Foundation, Process, Evidence, Studio, Decision, and Invitation.
- Seven dedicated forward-play films, two original editorial stills, native scrolling, chapter navigation, reduced-motion fallbacks, and a persistent Ask Tatva guide.
- Every Home film is unique and at least 16 seconds; the release gate rejects repeated or GIF-length footage.

### Pending

- [x] Hosted verification of the newest loader timing and loader-to-hero handoff.
- [ ] Confirm the guided journey never advances after explicit manual input and Pause freezes every decorative loop and film.
- [ ] Review every scene at 1440×900, 1280×800, 1024×768, 768×1024, 390×844, and 360×800 on the hosted preview.
- [x] Recheck all eight V5 chapters for screen fit: at 1365×936 every desktop chapter is exactly 936px high with no horizontal overflow.
- [x] Remove the 49px mobile Process overflow and keep all five method choices inside a 390px viewport.
- [x] Pass the exact-source Home V5 release workflow, run `32075701590`.
- [ ] Compare the current result against the approved screenshots and nature moodboards, not an older homepage branch.
- [ ] Confirm autoplay feels clearly faster without making reading hurried; validate film speed, semantic rotation speed, touch holds, and offscreen pausing.
- [ ] Inspect Safari, Chrome, and Firefox; mouse wheel, trackpad, touch, keyboard, resize, back navigation, background-tab restoration, and slow-network behavior.
- [x] Replace the crowded eleven-scene copy stack with eight focused chapters and one clear next action per scene.
- [ ] Record media licences, route purpose, crops, file sizes, WebM/MP4/poster coverage, and mobile crops.

## P0 · Services

Intended order: Hero → Situation → Project Rooms → verified outcome → Authority → Stakes → five-stage recognition ladder → Deliverables → Imagine Your Brand → Health Check → practical FAQ → call preview → booking.

- [x] Replace all fourteen Services chapter backgrounds with distinct 16–26 second forward films and reject short/repeated media in CI.
- [x] Prevent pointer hover/focus movement from changing the discipline rail before a visitor's click commits.
- [x] Publish all thirteen real cinematic chapters in compact desktop and mobile wayfinding.
- [ ] Verify the fully integrated Services source on the permanent review alias after the final assembled source can deploy.
- [ ] Complete a hosted traversal at desktop, tablet, and phone sizes.
- [ ] Verify native wheel/trackpad/touch/keyboard behavior, direction reversal, anchors, refresh inside sticky scenes, and no snap-back.
- [ ] Confirm Situation selection persists into Project Rooms and can be changed deliberately.
- [ ] Confirm all Project Rooms use the real package registry, deliverables, quotation policy, localized investment, optional additions, and verified proof.
- [ ] Confirm the five recognition states are Unknown, Noticed, Recognized, Remembered, and Preferred; keep engagement proof separate from recall proof.
- [ ] Verify compact mobile Health Check, all four questions, three outcome bands, reset/back/package/booking paths, and neutral state before enough answers exist.
- [ ] Verify the nine-question FAQ, desktop category index, mobile linear order, direct answers, scope notes, and FAQPage schema.
- [x] Remove every old twenty-minute reference; the public consultation duration is 30 minutes.
- [ ] Verify the Strategy Room brief, copy action, privacy boundary, email alternative, Calendly path, timezone language, and booking confirmation.
- [ ] Real-device Calendly booking-path verification remains required.

## P0 · Work

- [x] Restore the roots-led opening with a dedicated 21-second forward film and make it visibly present behind the evidence interface.
- [x] Remove exact film reuse and replace every later 8–14 second Work loop with a distinct 16–19 second forward film.
- [x] Pass the complete eight-contract Work browser matrix on the long-film source, run `32073781671`.
- [ ] Obtain hosted evidence for the exact current Work source after the final assembled source can deploy.
- [x] Verify hero hover, focus, manual pause, autoplay resume, keyboard selection, and reduced-motion behavior in the production-server browser gate.
- [ ] Verify hero offscreen and background-tab restoration on the hosted preview.
- [x] Verify mobile selector placement, active evidence proximity, and semantic narrative labels.
- [x] Verify all five case-study routes on desktop and mobile, including project navigation.
- [x] Verify Tatva Lab keyboard navigation and focus restoration.
- [x] Verify Decision Archive and Brand Study close actions restore viewport context.
- [x] Keep verified client work, smaller engagements, independent studies, and concepts clearly separated in source and rendered labels.
- [ ] Recheck every metric, attribution boundary, baseline, timeframe, image crop, and alt description.
- [ ] Finish the documentary-detail media pass without turning every project into the same sticky sequence.

The current Work source passed the full matrix in run `32073781671`: media uniqueness/duration, hierarchy and seven viewports, hero pause contract, capability attention, mobile narratives, mobile index, Lab accessibility, seventh-decision context, and fifth-study context.

## P0 · Insights and SEO authority

- [x] Give all 29 guides a dedicated film and poster, plus six archive films and fifteen element-specific topic films.
- [x] Pass the portable media-uniqueness gate for all 50 Insights films.
- [x] Establish and document one canonical Insights source: 29 published guides in the integrated authority registry. Evidence: `docs/INSIGHTS_AUTHORITY_RELEASE_2026-08-07.md`.
- [x] Integrate the complete authority hub, five topic hubs, and article renderer into `homepage-cinematic-recovery`. Permanent-alias reassignment remains a release blocker above.
- [x] Verify both feeds, topic routes, sitemap inclusion, canonical URLs, static generation, and permanent redirects from `/blog` and superseded Insight slugs.
- [x] Browser-interact archive search, topic filtering, and related-reading journeys at desktop and mobile sizes.
- [x] Verify sourced guides display Research sources and expose `BlogPosting.citation`; verify unsourced guides expose neither.
- [x] Verify unique title, description, canonical, robots discovery, Article/BlogPosting schema, and publication date across all 29 rendered guides.
- [x] Verify Open Graph, Twitter, breadcrumb, FAQ, author/publisher schema, secure external-link labels, and Googlebot preview directives on representative guides.
- [ ] Periodically recheck that external research-source destinations remain reachable and still support the attributed claims.
- [x] Publish and verify AI-readable discovery through `llms.txt`, `/insights/feed.xml`, and `/insights/rss.xml`.
- [x] Prevent duplicate search intent and competing URLs through the single registry and explicit legacy redirects, including refresh-vs-rebrand and brand-recall routes.
- [x] Run responsive browser checks on sourced and unsourced articles, including keyboard navigation and reduced motion.
- [x] Replace the missing client-proof `cinematic-waterlight` poster/video references with the valid approved water-element media pair.
- [x] Pass the repaired 29-guide authority, responsive-browser, and discovery suites: runs `31183444009`, `31183533137`, and `31183610142`.
- [ ] Record indexability/noindex decisions for draft legal or preview-only routes.

## P0 · Contact and booking

- [x] Replace all four Contact backgrounds with distinct 16–19 second forward films and pass the dedicated route media gate.
- [x] Integrate the three-path Contact hierarchy: schedule, call/WhatsApp, or write.
- [x] Centralize public contact data: `+91 84477 25381`, readable display format, `tel:` link, WhatsApp URL, email, and 30-minute consultation duration.
- [x] Remove contradictory twenty-minute references and guard the public route against their return in release CI.
- [x] Verify the scheduling anchor, form anchor, direct call/WhatsApp actions, visible phone number, and repeated contact paths at 1440×900 and 390×844.
- [ ] Verify Calendly loading, timezone explanation, fallback link, confirmation state, and real booking flow.
- [ ] Verify form validation, linked errors, live announcements, honeypot, request-size/content-type guard, rate limiting, delivery timeouts, no fake success, and email fallback.
- [ ] Test phone, WhatsApp, schedule, and form paths on a real mobile browser.

## P1 · About

- [x] Replace every exact About-route media repeat, including the duplicated portrait treatment.
- [x] Replace all 4–13 second About loops with sixteen unique forward films of at least 16 seconds and add a release gate against regression.
- [ ] Recheck About against the approved direction: reflection, language, field notes, portrait, and direct authorship.
- [ ] Express psychology, literature, and strategy as applied disciplines rather than credential decoration.
- [ ] Verify biography, dates, partner/client claims, and journey milestones; do not invent missing dates or engagements.
- [ ] Improve mobile portrait crop, narrative order, and pacing where needed.
- [ ] Ensure About leads naturally to Work or Services rather than ending in biography.
- [ ] Trace and remove the remaining About-route detached-DOM retention, measured at roughly 2,540 nodes per round trip after the responsive-video listener fix.

## P1 · Shared frontend systems

- [ ] Navigation compresses after scrolling, returns immediately on upward movement, adapts contrast, exposes active route state, and never covers reading zones.
- [ ] Mobile menu opens quickly, traps focus, closes with Escape, prevents background scroll, preserves booking action, and maintains 48px item height.
- [ ] Every interaction works by keyboard and touch; no essential information exists only on hover, colour, or motion.
- [ ] Every diagram keeps text inside geometry with correct radius, padding, stroke, line origins, node spacing, and optical centring.
- [x] Release responsive video `<source>` listeners during unmount so repeated Services navigation no longer retains entire page trees through Blink MediaQueryList roots.
- [x] Replace the repeated 10-second global footer loop with one dedicated 19-second forward film and pass the shared-media gate.
- [x] Give Privacy, Terms, the Glossary index, and glossary-term mastheads four distinct 16–20 second forward films with original posters; utility-media run `32075288106` is green.
- [ ] Remove remaining duplicated animation loops, listeners, observers, ScrollTriggers, media directors, and stale hidden components.
- [ ] Reserve media dimensions to prevent CLS; use Next Image where appropriate.
- [ ] Verify loading, empty, error, failed-video, and failed-form states.
- [ ] Review focus indicators, skip links, landmarks, heading hierarchy, contrast over moving media, and 44px minimum controls.

## P1 · Backend, analytics, and measurement

- [ ] Confirm preview environment variables for Resend, Mailchimp, Calendly, analytics, and contact delivery.
- [ ] Confirm API rate limiting is appropriate for serverless deployment rather than relying only on process memory.
- [ ] Verify contact and newsletter audit logging without storing sensitive form copy unnecessarily.
- [ ] Verify consent and double opt-in behavior.
- [ ] Define and validate analytics for primary CTA, situation choice, package choice, project dossier, article depth, contact path, phone/WhatsApp, form success, and booking start/complete.
- [ ] Check current preview and production runtime error clusters.

## P1 · Content truth and conversion

- [ ] Proposition understood within ten seconds on every main route.
- [ ] First proof appears within two sections.
- [ ] Every route has one clear primary conversion path.
- [ ] Every statistic is verified and contextualized.
- [ ] Replace generic agency language and plural `we` where the practice is personally led by Suman.
- [ ] Remove duplicate CTAs and abrupt booking requests; every CTA should feel like the next chapter.
- [ ] Keep summary first and details on demand; flag paragraphs over 70 words and sections with more than four consecutive text blocks.

## P2 · Repository and release hygiene

- [ ] Identify canonical PRs and retire duplicate verification-only PRs only after evidence is preserved.
- [ ] Close stale preview branches after the permanent alias carries the same or newer source.
- [ ] Keep one current integration branch, one permanent preview alias, one backlog, and one release report.
- [ ] Remove obsolete marker files, temporary build commands, duplicate gates, old deployment probes, and abandoned transforms.
- [ ] Update `llms.txt` and other discovery files so `/insights`, current contact paths, and the solo-practice voice are accurate.
- [ ] Produce the final report: audit table, before/after screenshots, routes changed, components created/removed, scroll/video/navigation/content/conversion fixes, accessibility, build results, performance, risks, and preview URL.

## Current verification PRs to resolve

- PR #99 · current `homepage-cinematic-recovery` integration and verification head.
- PR #98 · earlier exact Work verification repairs.
- PR #96 · Contact call/WhatsApp/30-minute conversion journey.
- PR #91 · obsolete 22-guide Insights verification snapshot; preserve evidence but do not treat it as the authority source.
- PR #84 · repaired earlier Work hosted verification.
- PR #79 · complete Services journey preview.
- PR #78 · integrated site preview candidate.
- PR #77 · research sources in Insights renderer.
- PR #76 · integrated release candidate.

These are evidence sources, not automatically canonical merge targets. Compare them to the latest deployable `homepage-cinematic-recovery` source before integrating or retiring anything.

## Definition of done

The preview is done only when it is calm to enter, easy to scroll, clear to understand, rewarding to explore, credible to trust, simple to contact, distinctly Branding Tatva, fully usable with motion disabled, and verified on the exact deployed commit. Production remains untouched until Suman approves the preview.
