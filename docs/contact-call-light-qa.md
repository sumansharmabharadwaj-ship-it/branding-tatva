# Contact call and window light · 15 September 2026

The call chapter previously moved its selected row on pointer or keyboard input,
while the line between steps continued to represent the scroll position. Its
shared layout highlight also travelled between differently sized rows and columns.

The three steps now draw from one continuous motion value. Scrolling, pointing,
tapping and focusing move the number's ink, connecting trace and selected wash
together. A local dissolve replaces the travelling layout layer. A small scroll
dead band prevents repeated highlight exchanges at a stage boundary. Arrow keys,
Home and End inspect steps without moving the viewport; Tab remains available.

Choose, Write and Call also carry a soft window-light band on their existing
camera timeline. Reverse scrolling retraces it. Compact screens use a shorter
path; reading focus settles the light. No extra sections or scroll distance are
introduced. Controls stay in their existing reading plane.

The server frame and reduced-motion version show complete, static ink. Motion
uses the existing library with no new dependency, media request or timer loop.

## Verification

TypeScript, ESLint, the Contact contract and cinematic motion gate passed.
The production build passed with 86 routes and 297 kB Contact first-load JavaScript.
Hosted acceptance covers forward/reverse step selection, the shared trace,
keyboard focus, stable card dimensions, scrolling after manual selection,
compact overflow and reduced motion. Build and deployment results follow below.
