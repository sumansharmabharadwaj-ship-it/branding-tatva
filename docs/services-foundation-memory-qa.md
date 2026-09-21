# Services foundation and memory follow-up

The work stays on `august-8-isolated`. Production has not been promoted.

## Changes

- Release 411 rebuilt the buyer-memory section with explicit state selection,
  an illustrated sequence and content-sized spacing. Scrolling no longer
  replaces the state being read.
- Release 414 names all five mobile foundation tabs, adds concrete decisions
  for each layer, and uses one stable-height mobile reading area. Inactive
  panels remain in the size calculation but are invisible, inert and excluded
  from the accessibility tree. Desktop rows settle when selected or focused.
- Release 415 strengthens inactive mobile tab contrast and removes the
  animation-frame wait before keyboard focus moves, using `preventScroll`.

## Verified

- TypeScript, changed-component ESLint, whitespace checks and the complete
  Next production build passed. The build generated all 93 routes.
- On release 412, the earlier memory change passed the 390 × 844 responsive
  layout check. Arrow and End key selection produced the matching content.
  The audit link landed with its heading 135 px below the viewport top.
  Reduced motion disabled every memory connector animation.
- On release 414, the desktop foundation section measured 936 px in a 936 px
  viewport and had no horizontal document overflow. Selecting Voice showed
  Point of view, Vocabulary and Tone; the selected row had an identity
  transform. Reduced motion disabled its connector animations.
- At 390 px, Foundation and Presence both measured 311 px high and 325 px
  wide, with no content overflow. End selected Presence; Tab reached its
  reading panel. The new labels, light panel and focus outline were inspected
  in screenshots.
- On the exact release 415 preview, inactive tab text resolved to
  `rgb(225, 214, 195)`. End selected and immediately focused Presence. Its
  panel remained 311 px high, 325 px wide and free of horizontal overflow.
  Vercel reported the deployment READY.

## Deployment identity

- Foundation source: `345bbe133996a72ad7b0de68e1bbf1eb2aa3870f`.
- Release 414 trigger: `19d0e91b5bce5c61ad6257662270433f0d58eeff`.
- Final correction source: `e1b9f504e8e9b42a121a116cd9f1ecd4296c2e94`.
- Release 415 trigger: `4a9ca717e2e8d8c686dc6ce92c55a719cb3f7840`.
- Each source-to-trigger comparison changed only `vercel.json`.

## Verification limits

The browser intermittently timed out on pointer dispatch and frame discovery.
Keyboard interactions, screenshots and DOM measurements succeeded. These are
responsive Chrome checks, not a physical iPhone or Safari acceptance test.

The permanent preview alias still reported release 408 during this work.
Connected Vercel tools can inspect deployments but cannot assign that alias.
An authenticated CLI alias assignment is still required. The checked target is
`dpl_DtLghZEHmJUrdXFmiWVoUp5PCE6g` (release 415). `/api/release` certification remains
unavailable through the protected browser endpoint. Do not call the shared
link current based only on a successful preview build.
