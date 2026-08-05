# Branding Tatva Homepage QA Checklist

Use this checklist before describing any homepage preview as ready.

## A. Branch and deployment safety

- [ ] Work is on `reimagine-project-moves`.
- [ ] A recovery snapshot exists for the current major pass.
- [ ] Production has not been modified.
- [ ] The preview commit SHA is recorded.
- [ ] Vercel reports `READY` for that exact commit.
- [ ] The shareable preview link opens without an expired bypass.

## B. Viewport matrix

Test every required state at:

- [ ] 320 × 568
- [ ] 375 × 667
- [ ] 390 × 844
- [ ] 430 × 932
- [ ] 768 × 1024
- [ ] 1024 × 768
- [ ] 1280 × 800
- [ ] 1440 × 900
- [ ] 1920 × 1080

At every width:

- [ ] No horizontal overflow.
- [ ] No heading is clipped.
- [ ] No paragraph exits the viewport.
- [ ] No diagram label collides with another.
- [ ] No fixed control covers meaningful content.
- [ ] No ladder panel covers a portrait, CTA, chart, or proof statement.
- [ ] Touch targets remain at least approximately 44 × 44 pixels.

## C. Chapter sequence

Expected chapters:

1. Opening
2. Find the Gap
3. Evidence
4. The Studio
5. Three Paths
6. Tatva Framework
7. Five Elements
8. The Process
9. Questions
10. Begin

For each chapter:

- [ ] Ladder detects the chapter.
- [ ] Chapter number is one-based and consistent.
- [ ] Direct ladder navigation lands below the fixed header.
- [ ] The main heading is visible at arrival.
- [ ] The local autoplay begins without hover.
- [ ] The sequence completes one meaningful cycle.
- [ ] Interaction pauses the sequence.
- [ ] Autoplay resumes after the reading hold.
- [ ] Leaving the viewport pauses expensive motion.
- [ ] Returning restores the correct active state.

## D. Play Journey

- [ ] Play Journey is off by default.
- [ ] The control does not cover content.
- [ ] The mobile control does not collide with Explore or audio.
- [ ] Play starts from the current chapter.
- [ ] Replay returns to Opening.
- [ ] Wheel input pauses immediately.
- [ ] Touch input pauses immediately.
- [ ] Pointer input pauses immediately.
- [ ] Arrow, Page, Home, End, and Space input pauses immediately.
- [ ] Form focus prevents automatic travel.
- [ ] Chapter dwell is long enough for the local system to explain itself.
- [ ] Framework reveals its second movement without scroll hijacking.

## E. Video and motion

- [ ] Hero plays muted, looping, and inline.
- [ ] Poster appears before playback.
- [ ] Only visible or near-visible video decodes.
- [ ] Hidden carousel/sticky slides remain paused.
- [ ] Global video controllers do not revive `aria-hidden` media.
- [ ] One active mobile film per chapter.
- [ ] Ordinary desktop does not exceed the intended active-film budget.
- [ ] Hidden-tab return resumes only eligible visible films.
- [ ] No video flashes black while switching.
- [ ] No generated wildlife or synthetic artefact breaks the natural tone.
- [ ] Reduced-motion replaces movement with a stable, composed state.

## F. Fixed navigation and chrome

- [ ] Desktop ladder rail remains visible.
- [ ] Desktop detail card appears only when useful.
- [ ] Ladder hover and keyboard focus reveal labels.
- [ ] Mobile Explore opens and closes.
- [ ] Escape closes the mobile chapter panel.
- [ ] Mobile chapter panel is scrollable.
- [ ] Audio control remains reachable.
- [ ] Play Journey remains reachable.
- [ ] Fixed controls sit above safe-area insets.
- [ ] Footer content is not obscured by the control dock.

## G. Section-specific checks

### Opening

- [ ] Headline is readable over brightest footage.
- [ ] Primary CTA is above the fold.
- [ ] Work/proof CTA is distinct.
- [ ] Recognition experiment is understandable without instruction.
- [ ] Find the Gap control lands correctly.

### Diagnosis

- [ ] All three states are readable.
- [ ] Active state is obvious.
- [ ] Radar or diagnostic instrument moves.
- [ ] Strategic move and outcome update together.
- [ ] CTA leads into Evidence.

### Evidence

- [ ] Project carousel advances.
- [ ] Direct selectors work.
- [ ] Signal, decision, and proof update together.
- [ ] Only active project film plays.
- [ ] Every numerical claim is documented.

### Studio

- [ ] All three disciplines cycle.
- [ ] Film, copy, diagram, output, and proof remain synchronized.
- [ ] Portrait crop is flattering and stable.
- [ ] Direct-authorship panel stays readable.
- [ ] Ladder does not cover the portrait.

### Three Paths

- [ ] Earlier diagnosis highlights the relevant path.
- [ ] All three paths cycle after the hold.
- [ ] Desktop diagram remains legible.
- [ ] Mobile route card remains legible.
- [ ] Selected path is stored before navigation.

### Tatva Framework

- [ ] All five forces cycle.
- [ ] Focus card matches the active force.
- [ ] Coherence lab is clearly labelled illustrative.
- [ ] Removing a force changes the model.
- [ ] Akash remains readable near the ladder.

### Five Elements

- [ ] Earth, Water, Fire, Air, and Space all appear.
- [ ] Scroll steering and autoplay do not fight.
- [ ] Direct selector works.
- [ ] Only the active film plays.
- [ ] Transition into Process does not retain excessive previous chrome.

### Process

- [ ] All six stages cycle.
- [ ] Rail, focus card, map, graph, and readiness bars remain synchronized.
- [ ] Stage film changes correctly.
- [ ] Hover preview is brief.
- [ ] Click/focus hold is long enough to read.
- [ ] Right-side metrics are not covered by the ladder.

### Questions

- [ ] Headline fits mobile width.
- [ ] Clarity field fits mobile width.
- [ ] All five signal labels remain visible.
- [ ] FAQ advances automatically.
- [ ] Opening an answer pauses the sequence.
- [ ] The audit invite and additional-question link remain reachable.

### Final invitation

- [ ] Copy reflects the most recent diagnosis or path choice.
- [ ] Orbit/decision map remains readable.
- [ ] Mobile version uses stacked decisions.
- [ ] CTA and proof link are distinct.
- [ ] Text stays readable over every tide-film frame.

## H. Copy, proof, and conversion

- [ ] Hero promise is clear within one read.
- [ ] First proof appears within two meaningful sections.
- [ ] Each chapter answers one visitor question.
- [ ] Adjacent sections do not repeat the same claim.
- [ ] Every CTA label matches its destination.
- [ ] No fabricated metric, partner, date, or outcome appears.
- [ ] Degrees are connected to business value.
- [ ] Solo-led access is framed positively.
- [ ] Booking feels calm and low-friction.
- [ ] Direct-email fallback exists.

## I. Accessibility

- [ ] Keyboard can reach every control.
- [ ] Focus indicator is visible against every background.
- [ ] Buttons use button semantics.
- [ ] Links use link semantics.
- [ ] `aria-expanded`, `aria-pressed`, and `aria-current` are accurate.
- [ ] Hidden slides use appropriate accessibility state.
- [ ] Decorative films are hidden from assistive technology.
- [ ] Reduced motion works through OS preference and site toggle.
- [ ] Text contrast meets the intended accessibility baseline.
- [ ] Autoplay never interrupts form entry.

## J. Build and runtime

- [ ] `pnpm build` passes.
- [ ] Type checking passes.
- [ ] Lint validation passes.
- [ ] All static pages generate.
- [ ] No repeated React warnings appear.
- [ ] No hydration mismatch appears.
- [ ] No uncaught console error appears.
- [ ] No failed local media request appears.
- [ ] Homepage first-load JavaScript is recorded.
- [ ] Runtime remains smooth on mobile and ordinary laptop hardware.

## K. Evidence capture

For every release candidate, save:

- [ ] Desktop contact sheet.
- [ ] Mobile contact sheet.
- [ ] Individual screenshots for Studio, Three Paths, Framework, Elements, Process, Questions, and Final Invitation.
- [ ] Build log.
- [ ] Commit SHA.
- [ ] Preview URL.
- [ ] Before/after notes for every P0 and P1 repair.
