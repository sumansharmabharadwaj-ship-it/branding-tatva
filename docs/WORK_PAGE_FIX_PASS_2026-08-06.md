# Work Page Fix Pass

**Date:** 6 August 2026  
**Branch:** `homepage-cinematic-recovery`  
**Production:** untouched  
**Source tree:** Work fixes through `51000b8e0e92bf2216b3d132d1772d4c160b7338`; workflow cleanup at `4c67d8a2a4b6e8d08958885d70e80ddc79dd11d8`

## Why this pass existed

The previous Work gate was green, but screenshot review exposed a second class of problem:

1. important content could begin server-rendered at `opacity: 0` and depend on hydration before becoming readable;
2. fast scrolling, anchor navigation, browser restoration, or reverse scrolling could leave a sticky flagship visual on the wrong chapter;
3. mobile archive layers were still paying desktop-sized scroll costs, especially the Work index, decision fragments, and independent Brand Studies.

This pass treats motion as progressive enhancement. Evidence must be readable before JavaScript, and mobile exploration must reveal abundance without stacking a miniature case study for every archive entry.

---

## Implemented repairs

### 1. Work opening

`src/sections/Work/WorkOpening.tsx`

- Removed opacity-zero first-paint states from the proposition, supporting copy, actions, and project stage.
- Added viewport-aware automatic project rotation so the montage stops while offscreen.
- Added an explicit pause/resume control.
- Pauses rotation after a visitor deliberately selects a project.
- Added roving tab index and Arrow Left, Arrow Right, Home, and End navigation.
- Connected the active tab and tabpanel with `aria-labelledby`.
- Reduced-motion mode remains static.

### 2. Work index

`src/sections/Work/WorkIndex.tsx`

- Replaced five complete stacked mobile evidence posters with one active 4:3 evidence frame and five compact project selectors.
- Unified that active frame across mobile and desktop so there is one visible project link rather than breakpoint-specific duplicate links.
- Preserved all five project records, filters, evidence labels, tiers, and project routes.
- Preserved the desktop sticky evidence frame and full editorial project rows.
- Ensured archive transitions do not begin hidden before hydration.

### 3. Performance flagship

`src/sections/Work/SignatureProject.tsx`

- Added redundant active-chapter tracking through IntersectionObserver, Lenis or native scroll position checks, animation frame, timeout, and `pageshow` restoration.
- Reverse scrolling and browser restoration now resolve to the nearest narrative beat.
- Reduced motion shows the complete evidence diagram and every chapter without scroll-controlled grading.

### 4. System-building flagship

`src/sections/Work/SystemFlagship.tsx`

- Added the same redundant active-chapter tracking used by the performance flagship.
- Prevented ACCESS / ORIGIN / SYSTEM framing from beginning invisible before hydration.
- Added descriptive progress-control labels and Lenis-aware chapter navigation.
- Reduced mobile chapter height while preserving all three strategic chapters and the recorded outcome.

### 5. Case-study selector

`src/sections/Work/CapabilityMap.tsx`

- Kept the recommended project and capability path visible before hydration.
- Removed opacity-zero first-paint states from mobile capability tiles.
- Improved mobile count and heading composition.
- Preserved the full fifteen-capability constellation on desktop.

### 6. Decision archive

`src/sections/Work/DecisionEvidenceGallery.tsx`

- Reduced closed mobile decisions to compact evidence rows.
- Preserved the full decision, reason, application, and project path in the selected panel.
- Added explicit plus and close states and richer accessible labels.
- Preserved seven independently reachable decision fragments.

### 7. Independent Brand Studies

`src/sections/CaseStudies/BrandStudies.tsx`

- Reduced unopened mobile studies to concise mechanism summaries.
- Collapsed the selected cover when its lesson board opens.
- Moves the opened lesson board into the mobile reading window.
- Retained the complete desktop mechanism cards.
- Preserved five public-record studies and the explicit zero-client-claim boundary.

### 8. Shared reveal resilience

`src/hooks/useRevealTrigger.ts`

- Reveal content now settles once it enters or has already passed the reading window.
- Added native-scroll fallback when Lenis is absent.
- Added animation-frame, timeout, hash-change, and page-restoration checks.
- Entrance effects are no longer allowed to become a content gate.

---

## Verification evidence

### Successful deployment build

Vercel successfully built the repair chain through commit `23d4410074077f421cf26411d1033a19fd19070c`.

That build completed:

- Next.js production compilation;
- TypeScript and lint validation;
- generation of all 56 static pages;
- `/work`;
- all five `/work/[slug]` routes;
- all five `/work/studies/[slug]` routes.

The later commits only change the compact Decision archive, compact Brand Studies covers, and the unified Work-index frame.

### Full browser gate blocked before execution

The final Work browser gate for `51000b8e0e92bf2216b3d132d1772d4c160b7338` was not acquired by a GitHub-hosted Ubuntu runner. No checkout, install, build, browser, or assertion step ran.

A second temporary macOS build lane was created to distinguish repository failure from runner-allocation failure. It received the same hosted-runner acquisition failure before any step ran. The temporary workflow was then removed.

These are infrastructure failures, not failed page assertions.

### Final Vercel deployment blocked

The final source tree is also blocked by the Vercel account build-rate limit. The protected preview currently points to the last successful deployment rather than the complete final tree.

---

## Known remaining technical cleanup

The last successful Vercel build reports five `@next/next/no-img-element` warnings inside `src/sections/Work/CaseStudyExperience.tsx`.

They belong to:

- managed-video poster fallback and crossfade images;
- the narrative visual background;
- previous and next project covers;
- the mobile project-evidence figure.

They are warnings rather than build failures. Replacing them with `next/image` requires visual verification of fill behaviour, video crossfades, and local poster sizing, so that change is intentionally deferred until a browser/build lane is available.

---

## Completion rule

Do not mark this Work pass complete until:

1. GitHub successfully acquires a hosted runner;
2. the production build passes on the complete source tree;
3. the seven-viewport Work gate passes;
4. the final source tree reaches a protected Vercel preview;
5. the deployed preview is inspected rather than inferred from source code.

Production remains untouched.
