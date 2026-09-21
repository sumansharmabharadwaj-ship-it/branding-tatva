# Homepage reading controls — release 363

## Changes

Stacked project layouts now have Back and Next controls beside the decision
record. They change the same project state as the tabs, preserve button focus,
and reveal the selected tab by scrolling only its horizontal strip. The record
retains measured rows, so a longer project's text cannot move the controls.
The controls loop through all five existing projects and announce the selected
file through a polite status. They are absent from the desktop tab order.

The phone record has tighter row spacing and a shorter footer. New buttons
have 48 px minimum hit areas and visible focus outlines. Their arrows respond
to hover/focus without moving the button. Reduced motion removes the added
transition and makes the tab strip's repositioning immediate.

The page motion control now preserves the visible landmark nearest the reading
line, preferring a specific evidence row over its enclosing panel. Previously
the earliest visible heading could be preserved while the reader's panel
shifted. The existing bounded layout transaction still ends immediately on
scroll intent, pointer input, keyboard input or focus changes.

## Verification

TypeScript, changed-file ESLint, homepage source, typography, production build
and rendered homepage checks passed. The build generated 86 routes; the rendered
gate verified 13 homepage chapters and 508,406 CSS bytes. No dependency or media
changes were added.

Source: `29d8d80cdf7a3290b6ee4ad5c3902d7fcc9ccded`.
Tested/uploaded tree: `63db86e6764ea25c08c4923e4b95161568e06942`.
Deployment trigger: `128fc6e540d3603529125f1d68d60cb8b0c8e3bc`.
The trigger differs from the source only by enabling the controlled deployment
flag. Deployment: `dpl_6THbjBMBtTAoAM8pMtXmaWTnU2NX`.

Vercel reached READY for that exact trigger. GitHub's homepage contract,
contact regression and controlled-preview workflows all passed. Cleanup commit
`0938fab9fa563e2c32024a0575120fb17a2aaf6d` restored controlled mode.

Chrome acceptance on the exact deployment:

- Desktop 1363 × 936: 1348 px content width, matching scroll width. The phone
  controls have display:none. The evidence panel top was 413.140625 px before
  pause, 412.8125 px paused, and 413.140625 px after resume. This replaces the
  roughly 129 px panel shift documented during release 362 checks.
- All three evidence rows had transform:none while paused; the selected
  project remained unchanged on resume.
- Narrow phone 320 × 720: document/client widths both 305 px. Both controls
  measured 48 px high, with no internal text overflow. The record measured
  658.3125 px high, down from 734.90625 px in release 362, including the new
  controls.
- Clicking Next chose the second project and kept focus on Next project.
  Enter chose the third. Dossier top stayed at -199.234375 px and button top
  at 335.6875 px across the change. The tab strip alone moved horizontally.
- Further Enter presses selected projects four, five, then one. Back from one
  selected five. Focus stayed on the activated control and button top stayed
  335.6875 px. The status reported the correct project number and name each time.
- Pause retained that same phone button coordinate. Next continued to select
  projects with all row transforms at none and focus on the same button.
- Phone 390 × 844: document/client widths both 375 px. The record measured
  606.46875 px high. Both controls were 48 px high and inside the viewport.
  Selection, focus styling and the record's lower layout were visually checked.
- Opening regression at 390 px: the H1 top stayed 232.328125 px before pause,
  while paused and after resume. Its height stayed 177.765625 px.
- Captured console errors came from the browser extension, not application
  code. An old tab's stale inspection helper was recovered by opening one
  fresh tab; the new-deployment checks completed there.

Identity was verified through Vercel metadata and the newly rendered controls.
The release API remains unverified in the cloud browser, which previously
blocked that path. OS-level reduced-motion emulation, Safari and physical touch
are not claimed by these Chrome checks.

The familiar preview alias still targets release 357. No alias-assignment tool
or existing CLI/environment credential is available in this session. The
prepared command in preview-link-repair.md now identifies release 363.
