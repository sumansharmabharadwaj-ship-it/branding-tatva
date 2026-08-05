# Branding Tatva Homepage Release Candidate Status

Date: 5 August 2026

Branch: `reimagine-project-moves`

Recovery snapshot: `snapshot/reimagine-before-home-audit-sprint-2026-08-05`

Status: **release candidate in active audit, production untouched**

This document records what changed during the representability and motion-reliability sprint, what has been verified, which findings were true product defects, which findings were audit noise, and what still blocks an approval-ready preview.

## 1. Locked direction

The release candidate preserves:

- The approved ten-chapter homepage architecture.
- Cormorant Garamond and Manrope.
- The current earthy cinematic colour universe.
- Existing nature films, project films, Tatva films, and final tide film.
- Local autoplay inside visible chapters.
- Optional Play Journey mode.
- The fixed chapter ladder.
- Direct authorship, psychology, literature, and verified project evidence as the authority structure.

It does not reintroduce:

- The rejected uniform Mother Earthed recolour.
- Flat agency-template layouts.
- Forced page travel.
- Additional long pinned scenes.
- Heavy WebGL or a new GSAP scroll system.
- Unverified client, partner, date, revenue, award, or performance claims.

## 2. Completed sprint work

### Persistent project memory

- Added `HOME_CONTROL_ROOM.md` as the operating index.
- Added `HOME_VISUAL_AUDIT_2026-08-05.md` as the screenshot defect record.
- Preserved and indexed the master brief, milestone backlog, QA checklist, reference bank, and fact bank.
- Updated `CLAUDE.md` so future sessions read the complete operating set before touching Home.

### Chapter boundaries

- Removed negative scene-bridge margins.
- Reduced bridge height.
- Kept elemental root, water, air, confluence, space, and fire motion in normal document flow.
- Changed chapter navigation offsets so each chapter opens at its own edge rather than showing the previous chapter’s tail.

### Fixed-control system

- Folded the desktop ladder explanation while preserving the rail.
- Compressed the desktop Play Journey control into an expandable cinema button.
- Hid idle Play Journey on compact viewports.
- Moved Play Journey and ambient sound into the Explore menu on compact viewports.
- Changed tablet widths to use the compact control system rather than desktop ladder, sound, and Journey controls simultaneously.
- Kept the visible mobile Explore rail at the right edge rather than across the reading column.

### Three Paths

- Reserved a clearer diagram field.
- Increased active-card hierarchy and inactive-card readability.
- Kept the ambient nature fragment off ordinary desktop, tablet, and mobile widths.
- Compressed inactive mobile cards without removing the active route’s explanation.
- Preserved diagnosis carryover and latest-path memory.

### Tatva Framework

- Preserved the five-force autoplay introduction.
- Changed the first CTA to enter the coherence laboratory.
- Kept the deeper Elements CTA after the laboratory.
- Reduced mobile repetition with a two-column force layout and a shorter laboratory map.
- Kept ambient films peripheral.

### Five Elements and Process

- Preserved their existing cinematic and decision-rich systems.
- Removed boundary overlap from their opening frames.
- Protected their selectors, charts, and decision map from persistent Journey controls.
- Kept one active film decoding per local system.

### Questions

- Contained the heading and all five signal labels on phone widths.
- Moved the FAQ panel before the clarity field on compact layouts so the answer sequence is visible and autoplaying as soon as the chapter opens.
- Preserved the desktop split layout, with introduction and clarity field on the left and answers on the right.
- Retained the moving golden-fog environment and clarity-field metaphor.

### Conversion handoffs

- Diagnosis now leads into Evidence before asking for a consultation.
- Framework now unfolds as understand → stress test → enter depth.
- The final invitation continues to remember the visitor’s latest diagnosis or chosen service path.

## 3. Audit infrastructure

### Build gate

The branch has an independent production Next.js build gate covering:

- dependency installation
- compilation
- TypeScript validation
- lint validation
- static generation

### Release gate v2

`scripts/home_release_gate_v2.cjs` checks:

- 320 × 568
- 375 × 667
- 390 × 844
- 430 × 932
- 768 × 1024
- 1024 × 768
- 1280 × 800
- 1440 × 900
- 1920 × 1080

Across all ten chapters it verifies:

- chapter sequence
- horizontal overflow
- heading containment
- fixed-control collision
- active video budget
- Elements and Process playback
- local autoplay cycles on mobile and desktop
- mobile Explore → Cinema and sound interaction
- runtime and media errors

It captures release-candidate screenshots at mobile 390, tablet 768, and desktop 1440.

## 4. Audit finding classification

The first automated release gate proved valuable but over-reported several collisions because it treated large panels and articles as if every pixel contained readable copy.

Confirmed product defects from that run:

- chapter-boundary overlap
- desktop and tablet control clutter
- mobile Questions ordering and visibility
- early Diagnosis conversion handoff
- premature Framework exit
- one narrow media probe that advanced successfully but was sampled after the visibility warden paused it

Audit noise repaired in v2:

- large article rectangles counted as text collisions
- collapsed ladder copy counted as visible
- video playback marked failed even after current time advanced
- Diagnosis fingerprint queried the wrong state selector
- Questions fingerprint sampled the FAQ before the mobile composition brought it into view

## 5. Current release blockers

The release candidate remains blocked until the v2 audit demonstrates:

- no horizontal overflow at all required widths
- no heading overflow
- no meaningful fixed-control collision
- no more than three simultaneous playing films
- successful Elements and Process media probes
- successful local autoplay cycles for Diagnosis, Evidence, Studio, Paths, Framework, Elements, Process, and Questions on 390 and 1440 widths
- a working compact Cinema and sound menu
- a successful production build for the same source state
- a Vercel deployment marked READY for the exact reviewed commit

## 6. Remaining P1 review after the gate passes

- Review portrait crop at 375, 768, 1440, and 1920.
- Review text contrast over every Tatva film.
- Review final invitation contrast across multiple tide-film frames.
- Confirm every case-study link and CTA destination.
- Test reduced-motion final compositions.
- Test hidden-tab return and low-power mobile recovery.
- Confirm the full guided journey completes without moving before a local chapter has explained itself.

## 7. Production rule

No branch promotion, domain reassignment, or production deployment occurs until:

1. the release gate passes,
2. Vercel marks the same commit READY,
3. fresh screenshots have been reviewed,
4. the preview receives explicit approval.

Until then, this remains an isolated preview system with a recovery branch available.
