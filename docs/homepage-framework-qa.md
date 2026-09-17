# Homepage framework clarity — release 364

## Changes

Phone and tablet layouts now put all five framework choices in one compact
row, directly above the selected reading. Position, Journey, Identity, Voice
and Recall describe the brand decision behind each Tatva. Accessible names
include both the visible choice and the existing element name/role.

The existing nature photographs use small portrait crops in the compact view.
A finite sliding rule identifies the selected choice. The original image and
paragraph motion remains in place; reduced motion settles the rule immediately
and suppresses hover scaling. Desktop keeps the original five-portrait layout.

The measured reading has a parchment surface with darker text and the selected
Tatva name. The shorter introduction names the five business decisions directly.
The reading is also an explicit landmark for the page's pause/resume anchor.
No assets, packages or new animation loops were added.

## Source verification

TypeScript, changed-file ESLint, homepage source, typography, production build
and rendered homepage checks passed. The build generated 86 routes. The
rendered gate verified 13 chapters and 510,778 CSS bytes.

Source: `949d84f2ec34e7951c83471f1e65b44ad85ebd1d`.
Tested/uploaded tree: `010fdb1fc82423ad47f4a9bab9d7d3e6f361512c`.
Deployment trigger: `d864ce67da9efd415b187601c3822ad2550b351d`.
Only the controlled vercel.json deployment flag differs between source and
trigger. Deployment: `dpl_FnfbrvZ4214EERZPfdD8oAvdRj1J`.

Baseline in release 363 at 390 × 844 (375 px content width): the framework was
1,536.73 px tall; choices took 826.67 px; the reading began at 1,241.83 px below
the viewport top when arriving at the chapter.

## Deployed acceptance

Vercel reports READY for the exact deployment trigger above. GitHub's homepage
contract, controlled preview and contact regression checks succeeded. Cleanup
commit `b68870f7a93246331a909570e5430de3357913d9` restored the branch deployment
flag to false after the controlled release.

Chrome checks used the deployed site's responsive QA frames:

| Viewport | Content width | Framework height | Reading top / height | Horizontal overflow |
| --- | --- | --- | --- | --- |
| 390 × 844 | 375 px | 766.86 px | 491.95 / 219 px | None |
| 320 × 720 | 305 px | 839.11 px | 538.19 / 245 px | None |
| 768 × 820 | 753 px | 576.28 px | 341.95 / 178.25 px | None |
| 1440 × 900 | 1425 px | 2700 px, existing sticky story | 469.78 / 227 px | None |

At 390 px, all five choices and the complete reading fit within the frame.
The chapter is about half its previous height. At 320 px the reading continues
below the initial viewport through native scrolling; all five choices remain
together, each at least 48.18 px wide, with no internal horizontal overflow.
Tablet uses the same compact row. Desktop retains the circular photographs,
element names, descriptions and existing story height; compact labels and the
sliding rule are hidden.

Keyboard End selected and focused Recall on phone and desktop, showed the
correct Space reading, and preserved the reading panel's top and height.
Tab from the last phone choice reached the reading region. Home returned to
Position. The full-motion indicator settled at four times its segment width
for the fifth choice. With page motion paused at 320 px, End still selected
Recall, the indicator settled at 205.56 px (four × 51.39 px), reading paragraph
transforms were none and portrait scale was 1. Resume remained available.

The page pause check at 390 px moved the reading by 16 px while preserving the
selected content. This is recorded separately from the stable geometry during
choice changes. No claim is made that every pause location is pixel invariant.
The sampled browser error entries came from the browser extension.

## Verification limits and shared link

These are Chrome viewport, keyboard and site motion-control checks. Physical
touch devices, Safari and OS-level reduced-motion emulation were not tested.
Direct browser access to `/api/release` is blocked in this environment; release
identity was checked through Vercel commit metadata and the rendered new UI.

The familiar preview alias still resolves to release 357, deployment
`dpl_ETy3ey7duTKFk8vT3kGqyaa5k837`, commit
`5d64cf439c9a2081ae62090b0cb90bd64192741b`. The available connection has no alias
assignment action. `preview-link-repair.md` now targets this confirmed release
364 deployment. Production was untouched.
