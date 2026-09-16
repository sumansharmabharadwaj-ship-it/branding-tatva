# Homepage invitation motion acceptance

Verified 16 September 2026 against isolated preview release 336.

## Change and baseline

The release 335 desktop invitation visibly painted overlapping headline words.
Its heading had six imperative SplitText children while the scene director also
applied clipped scroll ink. The heading occupied 280.75 px and the 905.703125 px
frame exceeded the 900 px viewport, disabling the desktop agenda hold.

The closing heading now uses native text and a single scroll ink treatment.
Its slightly wider measure reduces the default desktop heading to 210.5625 px.
The booking and proof links sit outside the moving reading group. Both retain
their mounted elements and receive a clay focus outline on the light background.

Each agenda row owns a stationary, fading reading light. Desktop advances through
the existing native sticky runway; compact layouts follow the agenda's natural
position without an added runway. All three readings remain visible. Pause and
resume preserve the chosen topic until a fresh scroll gesture. Keyboard focus and
text selection retain ownership of the reading surface. The signoff stays fully
visible, with a restrained scroll ink change instead of a delayed opacity reveal.

## Browser acceptance

| Viewport | Result |
| --- | --- |
| Desktop 1440 × 900 | Clean native heading, 900 px sticky frame, all links and signoff visible. Content and scroll widths both 1425 px. |
| Mobile 390 × 844 | Natural flow, readable heading, 327 × 56.39 px booking target. Content and scroll widths both 375 px. |
| Narrow 320 × 720 | Heading and both links wrap within the viewport. Booking target 257 × 78.78 px; proof target 257 × 62.78 px. Content and scroll widths both 305 px. |
| Short laptop 1280 × 720 | Personalized copy remains in natural flow with its complete 766.45 px frame reachable by scrolling. Content and scroll widths both 1265 px. |

Desktop native scroll advanced topics 1 → 2 → 3 and reversed 3 → 2. At scrollY
20207 and 20577, the booking top stayed 564.578125 px, proof top 705.75 px and
headline top 208.296875 px. Agenda row positions also remained unchanged.
Pausing on topic 2 retained that topic while the hold collapsed; the headline
moved only 0.4375 px. Resume restored the same position and topic without replaying
the headline or resetting to topic 1. The heading always had zero split children.

Native Tab reached booking with rgb(133,80,53) focus ink. A 450 px wheel scroll
preserved booking focus and both link positions. Tab moved to the proof link at
the same scrollY; Shift+Tab returned to booking. Enter reached `/contact#call`.

On mobile, scrollY 17180 selected topic 2, 17345 selected topic 3, and reversing
165 px restored topic 2 and exact row positions. Pause at 17180 preserved the
scroll position and every row position. Scrolling while paused kept topic 2.
Resume at 17345 retained it until a fresh 12 px scroll selected topic 3.

At 320 px, Tab reached the booking link without scrolling. The next Tab brought
the partially offscreen proof link fully into view, from top 667.4375 to
577.4375 px, with the clay outline. Shift+Tab returned to booking without another
scroll change. Both links' parent transforms remained `none`.

A real Reposition choice in the Paths chapter updated the mounted invitation to
“Find where the business and brand parted ways.” The proof became `/work/herbalcart`.
Native keyboard activation reached `/contact?package=brand-clarity#call`, retaining
the chosen package. The short laptop screenshot confirmed clean personalized text.

These are browser viewport checks, not physical-device or Safari certification.
The in-page pause control was exercised; operating-system settings were not changed.

## Build and deployment

TypeScript, ESLint for the changed TSX, homepage source gate, type floor gate,
existing invitation forward/reverse boundary gate, production build and rendered
homepage gate passed. The rendered gate checked 490,301 CSS bytes.

- Source: `f7bbb041a86dc14ad9d93269894a877c79295eff`
- Trigger: `fd61699024b4244014622fb98f6fccf63b677a89`
- READY preview: `dpl_3pnVC9RRAzZ1sV69Ac9xP5fYTBcm`
- Homepage workflow: 35140133430, passed
- Contact delivery workflow: 35140133401, passed
- Controlled preview workflow: 35140133414, passed

The source-to-trigger comparison contains only the controlled `vercel.json` flag.
Production remains untouched.

## Review-link limitation

The exact protected preview was visually and interactively checked. Vercel
metadata confirms the trigger, but its `/api/release` request returned a 302
authentication redirect. The permanent review alias returned 200 and still
reports `bf4ef15c495ad3e822425c68b2843805ddde6974`; it is not described as current.
The release 336 deployment log confirms that the `VERCEL_TOKEN` repository secret
required for permanent-alias reassignment is not configured.
