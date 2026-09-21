# Contact form and chapter dock handoff · 15 September 2026

Release 307 reproduced two glitches at the form boundary in the 320 × 720
responsive preview. The dock hid when the form top reached 544.875px, then
reappeared after only four pixels of reverse scrolling, at 548.875px. Repeating
that movement restarted the dock's dissolve. With keyboard focus on the Write
chapter link, crossing the same boundary made the dock inert and lost focus.

The form now keeps ownership through a 24px return buffer. Ownership changes
update the root attribute only when its value changes. A visible focused form
also keeps its reading area. Layout resize and visual viewport pan/resize
events refresh the measurements, including visual viewport offsets.

The dock stays available while one of its links owns keyboard focus. Blur and
pointer activation release that hold; keyboard chapter activation still moves
focus to the destination before the dock can leave. Its existing light and
dissolve animations, reduced motion fallback, geometry and chapter tracking
remain in place.

TypeScript, edited component ESLint, Contact/cinematic contracts and mocked
delivery passed. No real enquiry, booking, call or message is part of this pass.

The integrated production build passed with 86 routes and 298 kB Contact first
load JavaScript, including the concurrent homepage Release 309 changes.
Release 310 source: `5b6c25e085c35d5647b0665dcc95eb2623f9915d`.

## Hosted acceptance

- Narrow 320 × 720: at form top 544.875px the dock is hidden and inert. Reversing
  four pixels to 548.875px now keeps it hidden at opacity zero. Reversing another
  24px to 572.875px restores it. Moving forward four pixels to 568.875px keeps
  it visible until the form crosses its entry boundary again.
- With keyboard focus on the Write chapter link, scrolling the form to
  540.875px keeps that link focused, focus visible, and the dock interactive at
  opacity one, even though the form owns the viewport. The former focus loss
  is resolved.
- Pointer activation of that held Write link reaches `#write` and releases the
  dock. Keyboard Enter also reaches `#write`, moves focus to the Write section,
  and releases the dock. Both land with form top 412.875px and a clear form.
- Expanding optional details increases form height from 917.875px to 1832.875px
  while ownership remains true and the dock remains hidden. The optional fields
  were collapsed again before completion.
- Reduced motion keeps the dock's effective transition at the site's 0.01ms
  override; crossing into the form produces the static hidden state. All four
  chapter links retain 44px heights. Full motion was restored afterward.
- Narrow content and scroll widths are both 305px. Desktop content and scroll
  widths are both 1348px in a 1363 × 936 viewport. The desktop side rail stays
  visible while the form owns the viewport and remains clear of its right edge.
- No Contact application errors appeared in the inspected narrow or final
  desktop logs. These are browser viewport checks, not physical phone testing.

Deployment `dpl_8DuNyk3J7JgVnn7KPMYm9Tm7f6iy` is READY for trigger
`04a9a363ed6dad5ed38a9cff0a50ef7f09862813` at
`https://branding-tatva-mft2fgcjj-suman22.vercel.app/contact`.
Controlled workflow `35010219058` completed successfully and restored controlled
mode. Its completed job confirms that the existing VERCEL_TOKEN repository
secret remains absent, preventing permanent alias reassignment.

The final renewed direct Contact share link opened successfully at `/contact#write`
in a fresh desktop tab. Access expires on 16 September 2026 at 18:00 UTC.
Production remains unchanged; no form data or external action was submitted.
