# Branding Tatva Homepage Release Candidate Status

Date: 5 August 2026

Branch: `reimagine-project-moves`

Recovery snapshot: `snapshot/reimagine-before-home-audit-sprint-2026-08-05`

Audited source commit: `2242894fbb46cab7796c1c58e93d8aa40fe0a592`

Status: **preview release candidate passed the automated release gate; production remains untouched**

This document records the current homepage state, the locked creative direction, the repairs completed during the representability and motion-reliability sprint, and the remaining manual approval checks.

## 1. Locked direction

The release candidate preserves:

- The approved ten-chapter homepage architecture.
- Cormorant Garamond and Manrope.
- The current earthy cinematic colour universe.
- Existing nature films, project films, Tatva films, and final tide film.
- Local autoplay inside visible chapters.
- Optional Play Journey mode.
- Compact chapter navigation through ordinary desktop widths.
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

### Navigation and cinema controls

- Replaced persistent standard-desktop ladder clutter with the compact right-edge Explore rail.
- Reserved the detailed ladder and separate floating sound control for ultra-wide canvases.
- Moved Play Journey and ambient sound into the compact Cinema and sound menu.
- Hid the idle Journey pill on compact viewports.
- Repositioned the Explore rail beneath the Evidence card field while Evidence is active.
- Added a dedicated Evidence reading gutter at standard desktop widths.
- Removed the dead cinema entry from reduced-motion navigation.

### Opening

- Preserved the moving Himalayan forest and original hierarchy.
- Added a phone-only dusk gradient, text shadow, and slightly tighter reading field so the promise remains legible over bright film frames.

### Evidence

- Preserved the archive and verified proof structure.
- Increased mobile card ownership of the viewport while allowing the next card to peek in.
- Reserved right-side space for compact navigation.

### Three Paths

- Reserved a clearer diagram field.
- Increased active-card hierarchy and inactive-card readability.
- Kept ambient nature fragments off ordinary desktop, tablet, and mobile widths.
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
- Protected selectors, charts, and the decision map from persistent controls.
- Reduced the empty soil band before Earth so the first Tatva arrives immediately.
- Kept one active film decoding per local system.

### Questions

- Contained the heading and all five signal labels on phone widths.
- Moved the FAQ panel before the clarity field on compact layouts so answers are visible and autoplaying when the chapter opens.
- Preserved the desktop split layout.
- Retained the moving golden-fog environment and clarity-field metaphor.

### Conversion handoffs

- Diagnosis now leads into Evidence before asking for a consultation.
- Framework now unfolds as understand → stress test → enter depth.
- The final invitation continues to remember the visitor’s latest diagnosis or chosen service path.

## 3. Final validation results

### Production build gate

GitHub Actions run `30994374399` completed successfully.

It verified:

- dependency installation
- production compilation
- TypeScript validation
- lint validation
- generation of all 56 static pages

### Homepage release gate v3

GitHub Actions run `30994374434` completed successfully against source commit `2242894fbb46cab7796c1c58e93d8aa40fe0a592`.

Results:

- 9 viewports tested
- 90 chapter checks
- 18 critical media probes
- 16 autoplay probes
- 0 failures

Required viewports:

- 320 × 568
- 375 × 667
- 390 × 844
- 430 × 932
- 768 × 1024
- 1024 × 768
- 1280 × 800
- 1440 × 900
- 1920 × 1080

Verified behaviours:

- no horizontal overflow
- no heading overflow
- no meaningful fixed-control collision
- media budget remained inside the gate
- Elements and Process films played at every required viewport
- Diagnosis, Evidence, Studio, Paths, Framework, Elements, Process, and Questions autoplay advanced on mobile and desktop
- compact Explore → Cinema and sound interaction worked
- no unexpected runtime or media errors were recorded

The release-gate evidence is stored as GitHub Actions artifact `8925718539`.

## 4. Remaining manual approval checks

The automated release blockers are cleared. The remaining work is subjective or device-specific:

- Review portrait crop at 375, 768, 1440, and 1920.
- Review text contrast over every Tatva film frame.
- Review the final invitation across several tide-film moments.
- Review the reduced-motion composition as a complete reading experience.
- Test hidden-tab return and low-power physical-device behaviour.
- Confirm every case-study and CTA destination in the deployed preview.
- Confirm the full guided journey feels slow enough for comprehension.

## 5. Production rule

Production promotion still requires explicit approval of the deployed preview.

Until approval, the current work remains isolated on `reimagine-project-moves`, with the recovery snapshot available and production untouched.
