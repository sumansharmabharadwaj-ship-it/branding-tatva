# Homepage evidence readability and motion — release 362

## Change

The Evidence chapter now pairs brighter project photography with a parchment
decision record. Labels, project names, evidence text and actions have larger,
more legible type. The selected project has a clear light surface. Media
darkening is localized behind its labels and result, rather than grading the
whole photograph darker.

The signal, decision and recorded proof settle in a short reading sequence
when the selected project changes. Moving back reverses that sequence. The
original text remains opaque and selectable; measured rows keep the panel and
action positions stable. The existing focus and pointer guards stop reading
motion. Site and OS reduced-motion preferences suppress the added motion.
Action arrows move within stationary buttons.

Existing project content, metrics, routes and media are unchanged. No packages,
animation loops, scroll interception or new media requests were added.

## Local verification

- TypeScript and changed-component ESLint passed.
- Homepage source and typography gates passed.
- A clean production build generated 86 routes.
- Rendered homepage gate passed with 13 chapters and 506,491 CSS bytes.
- Whitespace validation passed.

Two incremental builds compiled and rendered the pages, then failed with an
ENOTEMPTY error during Next's temporary export cleanup. Removing the generated
.next directory and running the build again completed successfully. No
application configuration or dependencies were changed to work around this.

The GitHub connector uploaded the exact tested source tree
`89cee4ea6cad5263322a17d64b3209b6808e33e6` and advanced the branch without
force. Source commit: `47a3a06cebdf98d60dab82a16b8a4d6db6d082c0`.
Deployment trigger: `e6ff397551bf1d775b7fa8e94f9c1198796336d8`.
Comparing the trigger with the source shows only the controlled vercel.json
deployment flag change. Deployment: `dpl_FN5fbMjcMmihwHW6FaVM6fzHJTvh`.

## Deployed verification

Vercel reported READY for the exact deployment trigger. Homepage contract,
contact regression and controlled-preview GitHub workflows all passed.
Cleanup commit `e64ada48b78d48a4f83f067c7c287d62f3f95613` restored the
branch's deployment flag to false.

Chrome checks against that exact deployment:

- Desktop: 1363 × 936 viewport, 1348 px content width, no page overflow.
  The brighter photograph, parchment record and selected project were visually
  verified. The record's computed gradient matches the new source.
- End selected and focused the fifth project. Its 466.86 px panel retained the
  same top and bottom coordinates as the first project. Text remained opaque
  during the transition and settled to transform:none.
- Pause changed the site motion mode to reduced and cleared all three row
  transforms. Home returned to the first project with the same panel geometry
  within that mode and no animation. Resume restored full mode without
  replaying a row entrance. Changing motion modes also changes the existing
  held/flow layout, so this is not a claim of identical viewport coordinates
  across the mode change.
- Inspect the project file opened the Dr. Haley Nutrition dialog with its
  existing evidence and full-case-study link. Back to the archive closed the
  dialog and returned focus to its launch button.
- Narrow phone: 320 × 720 iframe with a 305 px content width. Document width
  also measured 305 px. The selected tab and header were visually checked;
  the decision record stays inside x=24…281 in normal flow.
- Phone: 390 × 844 iframe with a 375 px content width and matching document
  width. Both media actions measured 48 px high. Evidence text measured
  19.2 px. Keyboard order reached the archive link, whose visible focus ring
  was confirmed after scrolling. The entire parchment record was visually
  checked; text remained inside x=42.59…332.41.
- Forward and reverse native scrolling exposed the record normally. Captured
  console errors were from the browser extension, not application code.

The cloud browser became temporarily unresponsive with both test pages open.
Reconnecting and closing the extra QA tab restored interaction; the remaining
checks then completed in one tab. No app changes were made for that issue.
OS-level reduced-motion emulation, Safari and physical touch remain unverified.

The browser blocked navigation to /api/release with ERR_BLOCKED_BY_CLIENT.
Exact deployment identity is therefore verified through Vercel metadata and
the updated rendered UI, rather than an API response. The permanent review
alias still targets release 357. The connected tools have no alias mutation
action and the existing CLI/CI credentials are unavailable; the prepared
command in preview-link-repair.md targets release 362.
