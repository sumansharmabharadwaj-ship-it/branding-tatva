# Homepage studio entrance acceptance

Verified 17 September 2026 for release 344.

## Changes

The founder introduction now owns its entrance motion. Its eyebrow, heading and
introductory paragraph share one flex column with the same typography and gaps.
The group approaches from at most 12 px above and 24 px horizontally on desktop,
and from 12 px above on compact screens. This direction preserves clearance from
the stationary discipline tabs during both forward and reverse scrolling.

The shared entrance no longer translates the complete content column or rotates
and scales the portrait frame. The proof link, footer link, tabs and authorship
caption stay anchored. The existing native portrait image camera, directional
discipline readings, result rule and reading ink retain their individual motion.
Existing measured copies preserve the tallest reading and proof at each width.

Home, End and Arrow keys now center an obscured target before focusing it with
preventScroll. Visible targets remain in place. The clearance reserves 80 px for
the header and 64 px for the floating controls. Focus outlines use the selected
discipline's accent, including the existing inset outline on the proof link.

## Reproduced baseline

On release 343 at 337 × 234, End selected Strategy with the tab at y 94.75–138.75.
After a native 70 px reverse scroll, Home selected Psychology at y 164.75–208.75
without repositioning it. The pause control visibly covered part of the focused
tab. The prior bounds check allowed any tab within the full viewport, including
the area occupied by floating controls. Its outline was the global ivory color.

The baseline section height was 1718.21875 px, panel height 530.875 px, proof
height 170.65625 px and heading font size 44 px. Content and scroll width both
measured 322 px.

## Local verification

TypeScript, changed-file ESLint, the Studio scroll gate, homepage source gate,
type floor gate, production build and rendered homepage gate passed. The rendered
gate verified 492,087 CSS bytes. The existing Studio gate covers reversible
progress, selection deadband, collapsed runway, keyboard ownership and both
motion preference fallbacks.

## Browser acceptance

| Viewport | Result |
| --- | --- |
| 337 × 234 | After a settled native 70 px reverse scroll, Home centers Psychology at y 94.75–138.75. The complete focus ring is visible above both floating controls and uses rgb(201, 139, 99). End then selects Strategy without changing scrollY 13935. Heading size, section, panel and proof heights match the baseline exactly. |
| 1440 × 900 | Native scrolling reaches Psychology, Literature and Strategy, then reverses through Literature to Psychology. The chapter is 2160 px high. The panel stays 344.578125 px high; the proof stays 86.40625 px high at y 665.984375; the footer stays at y 789.390625. |
| 320 × 720 | All three keyboard choices retain scrollY 14172, section height 1781.703125 px, panel height 552.5625 px and proof height 192.34375 px. Native Tab reaches the HerbalCart proof at y 263.578125–455.921875 with its full inset accent ring visible. |
| 1280 × 790 | The natural frame is 809.15625 px high, so the chapter uses document flow. After a native scroll, the complete proof is at y 467.5–575.59375 and the footer at y 612.59375–634.984375, clear of the floating controls. |

Content and scroll widths match at 322, 1425, 305 and 1265 px respectively.
Screenshots were inspected at all four sizes. These are browser viewport checks,
including a high-zoom viewport equivalent, rather than physical-device or Safari
certification.

During desktop entry, the introduction was sampled at translate 16.3 px, -8.15 px
with rotation 0 and scale 1. The lede cleared the stationary chooser by 22.54 px.
Content, proof, footer and portrait frame all had no transform, translate,
rotation or scale. The portrait image's camera matrix changed through the three
scroll stages and returned to the same matrices on reversal. At rest after
resume, the introduction cleared the chooser by its original 14.390625 px gap.

Keyboard selection of Literature followed by two native Tab presses reached
/work/myshopineurope. That link retained focus and its destination through a
900 px native scroll. Reading transforms settled to none. Pausing retained
Literature, collapsed the hold to 900 px and removed the introduction and camera
transforms. The intro's screen position shifted by 0.45 px; the proof and footer
shifted by 7.703125 px as the partially entered intro settled. Native Tab from the
motion control returned to the selected Literature tab. Resume retained Literature
and restored the 2160 px hold.

At 320 px, pause and resume retained Psychology, scrollY 14649 and the exact
reading/proof geometry. Native Tab from the paused motion control returned to
the HerbalCart proof link. The site preference was tested; the OS preference was
unchanged and its fallback was checked by the existing source gate.

### Browser limitations

The browser reported document.visibilityState as hidden during part of the
desktop pass. This is the environment's documented background-tab issue: the
shared scene director pauses its RAF work, leaving the sampled entrance offset
in place. The complete continuous entrance/ink sweep therefore remains visually
uncertified in this environment. Its isolated layer, clearance, stationary
siblings, native stage progression, image camera and pause cleanup were observed.
No site change was made to work around the browser's visibility report.

An initial combined wheel/Home automation call sent the key before the wheel
movement had settled. Repeating those actions in separate calls reproduced the
starting bounds and confirmed the corrected centering. Some locator actions also
timed out while still placing focus; subsequent native keys used the observed
active element. Protected preview navigation intermittently reopened Vercel's
login screen. Refreshing the authorized root preview link restored access.

## Release

- Source: `e1297b1968f0993dbbf446df7c7bf939bd02302c`
- Trigger: `4f3393ee322c5690e575dce13161fe279d1d4c34`
- READY deployment: `dpl_J98xck1pBGr7UHp1ySQ39orrr23V`
- Homepage workflow: 35189560544, passed
- Contact delivery workflow: 35189560598, passed
- Controlled preview workflow: 35189560566, passed
- Controlled-mode restoration: `62b1a55a23ac2591aa1561a423643607b678d8e7`

The source-to-trigger comparison contains only the controlled vercel.json flag.
Deployment metadata identifies the exact trigger above on august-8-isolated.
The Vercel fetch tool returned HTTP 302 for this preview's /api/release, so that
endpoint itself is not independently certified. The browser checks used the exact
READY deployment. Production was unchanged.

## Permanent review link

The permanent alias returned HTTP 200 but still reported the older commit
bf4ef15c495ad3e822425c68b2843805ddde6974. The release 344 deployment log confirms
that the existing VERCEL_TOKEN repository secret required to reassign the alias
is unconfigured. The permanent review link does not show release 344.
