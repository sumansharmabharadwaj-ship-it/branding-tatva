# Branding Tatva Homepage Milestones and Backlog

Branch: `reimagine-project-moves`

Last audit consolidation: 5 August 2026

Status legend:

- `[x]` complete and build-verified
- `[~]` implemented or in progress, awaiting visual confirmation
- `[ ]` not started
- `[!]` blocked or dependent on another item

## Milestone 0: Source lock and recovery

- [x] Lock work to `reimagine-project-moves`.
- [x] Preserve production until explicit approval.
- [x] Create recovery snapshots before major passes.
- [x] Consolidate the project history into `HOME_MASTER_BRIEF.md`.
- [x] Consolidate reference roles into `HOME_REFERENCE_BANK.md`.
- [x] Establish this milestone and backlog file.
- [x] Establish a repeatable QA checklist.

Exit condition: future sessions can recover the exact homepage rules without re-deriving them from scattered chats.

## Milestone 1: Navigation, overlays, and scene boundaries

Current screenshot findings:

- The desktop chapter detail card permanently covers portrait, framework, path, and process content on the right.
- Mobile Explore and Play Journey controls overlap each other and cover the lower part of cards and copy.
- The Play Journey control competes with the audio control on small screens.
- Some scene bridges resemble empty UI pills or spacer bars rather than natural transitions.
- Negative bridge overlap reveals clipped text from the preceding chapter.
- Process entry can include too much of the previous Elements chrome above the heading.

Backlog:

- [~] Collapse the desktop chapter detail card until the rail is hovered or keyboard-focused.
- [~] Turn the mobile Play Journey control into a compact upper-right cinema button.
- [~] Reserve a safe bottom area for mobile navigation controls.
- [~] Reduce scene-bridge height and negative overlap.
- [~] Replace pill-like water ripples with broader, natural wave rings.
- [~] Make bridge visuals quiet on mobile.
- [ ] Confirm the Process anchor lands beneath the fixed header without the previous selector dominating the frame.

Exit condition: no fixed or transitional interface covers meaningful content at any audit width.

## Milestone 2: Mobile containment and responsive composition

Current screenshot findings:

- The Questions headline and supporting copy can clip horizontally on mobile.
- The clarity-field diagram can extend beyond the viewport.
- Framework film fragments overlap explanatory copy on small screens.
- The Studio top metadata is clipped near the scene boundary.
- Three Paths cards continue beneath the fixed navigation dock.
- Desktop diagrams are still too dense when merely scaled down.

Backlog:

- [~] Enforce `min-width: 0`, safe wrapping, and viewport containment in Questions.
- [~] Constrain the clarity-field diagram and long labels.
- [~] Reposition ambient films on mobile so they support rather than cover.
- [~] Add chapter-level bottom padding where fixed controls remain.
- [ ] Test 320, 375, 390, and 430 pixel widths.
- [ ] Confirm every interactive system has a purpose-built mobile composition.

Exit condition: no horizontal overflow, clipped heading, unreadable diagram, or content hidden behind fixed controls.

## Milestone 3: Autoplay orchestration and video governance

Current system:

- Local sections own their active state.
- `HomeVideoHeartbeat` revives visibly mounted muted loops.
- `VideoWarden` pauses offscreen media.
- Play Journey coordinates chapter travel.

Risks:

- A global playback controller can revive a hidden carousel or sticky slide if it only checks viewport intersection.
- Multiple observers can disagree about whether a video is active.
- Autoplay can restart too quickly after intentional reading interaction.
- Hidden-tab return can expose stale active states.

Backlog:

- [~] Make `VideoWarden` verify visual eligibility before resuming a paused film.
- [~] Keep hidden and `aria-hidden` slides asleep.
- [~] Preserve one active film per mobile chapter.
- [ ] Observe a complete autoplay cycle in every chapter on desktop.
- [ ] Observe a complete autoplay cycle in every chapter on mobile.
- [ ] Test tab background/foreground recovery.
- [ ] Test reduced-motion posters and final states.

Exit condition: every visible chapter wakes reliably, hidden media stays asleep, and deliberate interaction always wins.

## Milestone 4: Section-level presentation polish

### Opening

- [x] Clear strategy promise and above-fold CTA.
- [x] Living recognition signal.
- [ ] Confirm the recognition control never competes with the hero CTA.
- [ ] Check first-load text contrast over the brightest film frame.

### Diagnosis

- [x] Three recognisable states.
- [x] Moving diagnostic system.
- [x] Handoff to Evidence instead of an early hard sell.
- [ ] Confirm the active state remains obvious in bright and dark footage moments.

### Evidence

- [x] Signal → decision → proof structure.
- [x] Verified project claims.
- [x] Direct file controls.
- [ ] Check card contrast at ordinary laptop brightness.
- [ ] Confirm anchor offset below the fixed header.

### Studio

- [x] Psychology, literature, and strategy translated into client value.
- [x] Verified project application per discipline.
- [x] Direct authorship promise.
- [~] Protect portrait and caption from the desktop ladder.
- [~] Protect lower content from the mobile control dock.
- [ ] Review portrait crop across 375, 768, and 1440 widths.

### Three Paths

- [x] Diagnosis and path selection are distinct.
- [x] Earlier diagnosis carries forward.
- [x] Mobile route card exists.
- [~] Increase diagram and inactive-card legibility.
- [~] Keep ambient film peripheral on mobile.
- [ ] Confirm all path links preserve the visitor choice.

### Tatva Framework

- [x] Five-force autoplay.
- [x] Coherence laboratory.
- [~] Protect Akash and right-side copy from the ladder.
- [~] Keep the ambient river fragment away from mobile copy.
- [ ] Confirm the complete five-force cycle fits the guided dwell.

### Five Elements

- [x] Scroll and autoplay controllers separated.
- [x] Direct Tatva selector.
- [~] Reduce the visual tail before Process.
- [ ] Confirm only the active film decodes.

### Process

- [x] Six-stage decision architecture.
- [x] Output, prevention, clarity, and readiness systems.
- [~] Improve entry framing from Elements.
- [~] Prevent the ladder card covering the right-side metrics.
- [ ] Check the mobile decision map for label collisions.

### Questions

- [x] Cinematic dark scene.
- [x] Five-signal clarity field.
- [x] Auto-advancing answers.
- [~] Eliminate mobile horizontal overflow.
- [~] Ensure the lower controls do not cover the clarity field or answers.

### Final invitation

- [x] Personalised by diagnosis/path.
- [x] Clear next decisions.
- [x] Calm strategy-session CTA.
- [ ] Confirm the invitation remains legible over every tide-film frame.

Exit condition: every chapter is understandable, visually distinct, alive at rest, and commercially purposeful.

## Milestone 5: Copy and conversion hardening

- [x] First proof appears early.
- [x] Academic authority is translated into business value.
- [x] Solo-led access is framed positively.
- [x] Diagnosis leads into proof.
- [x] Final invitation remembers the visitor.
- [ ] Remove any remaining repeated claim across adjacent chapters.
- [ ] Audit every CTA destination and label.
- [ ] Confirm email and booking fallbacks.
- [ ] Recheck all outcome claims against documented evidence.

Exit condition: each chapter advances the visitor’s decision rather than repeating the previous chapter.

## Milestone 6: Release-candidate QA

- [ ] Run production build.
- [ ] Confirm lint and type validation.
- [ ] Confirm all static pages generate.
- [ ] Capture fresh desktop chapter screenshots.
- [ ] Capture fresh mobile chapter screenshots.
- [ ] Compare against current audit contact sheets.
- [ ] Test keyboard-only navigation.
- [ ] Test reduced motion.
- [ ] Test low-power mobile behaviour.
- [ ] Test SSO preview link and branch alias.
- [ ] Record exact deployed commit.
- [ ] Ask for approval before production promotion.

## Permanent backlog rules

New ideas are accepted only after they answer:

1. Which visitor question does this solve?
2. Which conversion stage does it advance?
3. What existing element can it replace rather than merely join?
4. What is its reduced-motion state?
5. What is its mobile composition?
6. What does it cost in active video, sticky travel, JavaScript, and visual attention?

Anything without clear answers remains in backlog rather than entering the page.
