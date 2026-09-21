# Homepage pressure clarity — release 365

## Changes

Phones and tablets use the existing interactive diagram as their single force
selector. The duplicate list is hidden below 1024 px, and diagram labels now
name Foundation, Flow, Distinction, Voice and Recognition. Each accessible name
includes the displayed role, the Tatva name and the available action.

The shorter introduction, tighter spacing and smaller mobile heading bring the
diagram and consequence closer together. The reading uses parchment with darker
text. Five decorative bars reflect the connections: the omitted segment retracts
to 18%, and restoration fills it again. The transition lasts 450 ms, or zero
with reduced motion. Existing reversible scroll signals and opaque paragraph
motion remain. No new packages, media or repeating animations were introduced.

The restore action now follows the diagram and reading. Both original keyboard
selection handlers remain; the hidden mobile list leaves the accessibility tree.
The reading is also an explicit landmark for the existing page pause anchor.

## Source verification

TypeScript, changed-file ESLint, source homepage contract, typography floor,
production build and rendered homepage contract passed. The build generated
86 routes; the rendered check verified 13 chapters and 512,828 CSS bytes.

Source: `b4ea39748520851cd6e02c454f8ce97c92ba70fe`.
Tested/uploaded tree: `e92b7fe20bc64305d23b725aab1c5828de7cf3d9`.

The release 364 baseline at 390 × 844 (375 px content width) measured
1,730.06 px for this section, 822.39 px for the board and 332.94 px for the
reading. The reading began 1,304.13 px below the section top.

## Deployed acceptance

Preview deployment `dpl_726ae6YQd2omk9yMcrmAugPw1h4G` reached READY for trigger
`a78e205fc180d145adcd0d595db650ab2c9a7996`. Source-to-trigger comparison contains
only the controlled `vercel.json` flag. The homepage contract (`35247910419`),
controlled preview (`35247910417`) and contact regression (`35247910420`) all
succeeded. Cleanup `b48d26a9801f706769bbacc2b3b07ecb1907a241` restored the branch's
deployment flag to false.

Chrome checks used responsive frames on this exact deployed preview:

| Viewport | Content width | Section height | Board height | Reading height | Horizontal overflow |
| --- | --- | --- | --- | --- | --- |
| 390 × 844 | 375 px | 1191.44 px | 841.50 px | 354.02 px | None |
| 320 × 720 | 305 px | 1236.38 px | 860.05 px | 401.36 px | None |
| 768 × 820 | 753 px | 942.27 px | 627.78 px | 426.78 px | None |
| 1440 × 900 | 1425 px | 842.28 px | 617.28 px | 396.78 px | None |

At 390 px the whole section is about 31% shorter. The reading begins 624.42 px
below the section top, about 680 px earlier than the release 364 baseline.
The board is slightly taller because it now contains the restore action and
larger labels; removing the separate selector is the principal height saving.
The phone section still uses native scrolling beyond one viewport.

All five diagram labels fit at 320 px with no internal horizontal overflow.
Buttons measure 88 × 53 px. Every marker centre is within 0.017 px of its line
endpoint. Tablet displays the diagram and reading side by side, with the
duplicate list hidden. Desktop retains both synchronized selector groups.

On the 390 px frame, Home and End selected Foundation and Recognition; the
corresponding meter segments settled at scaleX 0.18. Board and reading heights
stayed fixed. Tab from the final node reached the reading, then the audit link,
then Restore all five forces. Enter restored the complete copy and all five
meter segments. Focus clearance may change viewport scroll position, while
selection preserves the measured reading height.

At 320 px, a settled paused-state click selected Flow and the second segment
retracted. Right selected Distinction and Voice, and End selected Recognition.
The reading remained 401.36 px high. Paused mode removed all traveling signals
and left the four reading paragraphs at transform none. Tab revealed the full
reading at 238.20–639.56 px inside the 720 px frame. Resume was exercised before
the next viewport check. A rapid two-action pause/click automation sequence on
the 390 px frame selected a different node than requested; the separated,
settled-state narrow interaction above verified the intended Flow control.

On desktop, list End selected Recognition and diagram Home selected Foundation.
Both groups reported the same selection; the board retained 617.28 px and the
reading 396.78 px. A native −90 / +90 wheel pair moved scrollY from 14088 to
13998 and back. Every signal coordinate returned exactly to its starting value.
The browser transport reported a timeout for the first gesture, but the DOM
confirmed the 90 px movement and corresponding changed signal coordinates.
Sampled browser error entries came from the browser extension.

## Limits and shared link

These checks cover Chrome viewport layouts, keyboard and the site motion
control. Physical touch devices, Safari and OS-level reduced-motion emulation
were not tested. `/api/release` browser navigation remains blocked in this
environment; exact identity is established by Vercel metadata, the trigger diff
and the rendered new interface rather than an endpoint certification.

The familiar preview alias still resolves to release 357, deployment
`dpl_ETy3ey7duTKFk8vT3kGqyaa5k837`, commit
`5d64cf439c9a2081ae62090b0cb90bd64192741b`. The available connection has no alias
assignment action. `preview-link-repair.md` targets the confirmed release 365
deployment above. Production was untouched.
