# Contact writing motion · 15 September 2026

Required fields previously translated upwards on focus, and the progress
highlight travelled between controls while those controls also moved on hover.
The writing surface now stays fixed. A clay ink line draws beneath the active
input, remains quieter beneath a completed required field, and turns to the
existing error colour for invalid input. The same focus response covers every
optional field. Labels, hints and error associations remain attached to inputs.

Progress controls keep a stationary hit area. A local light dissolve, number to
checkmark animation and partial or complete ink stroke communicate focus and
completion. No extra step is required to submit the enquiry.

Optional context retains its values and refs while closed. Its opacity and height
have separate timings, and validation recovery waits for the reveal to complete
before focusing a hidden optional field. Manual disclosure changes, a new focus
choice and clearing the draft cancel a pending focus handoff.

TypeScript, ESLint, Contact contracts, cinematic contracts and mocked delivery
regressions passed.

The final production build passed with 86 routes and 297 kB Contact first-load
JavaScript. Its server HTML contains 11 labelled field/ink pairs, three stationary
progress controls and an initially inert, hidden optional panel.

## Hosted acceptance

- Mobile 390 × 844: content and scroll widths both 375px. Name and email remain
  83px tall and untransformed while typing. Enter from Name focuses Email.
- Completion moves from zero to three with the test fields. Inactive completed
  ink settles at 0.4 opacity, focused ink at 0.9. All progress buttons retain
  `transform: none`; their decorative ink and checkmarks develop independently.
- An invalid optional website survives closing the panel. Submitting that invalid
  draft produces the validation alert while the panel stays at zero height and
  inert. Review your website opens the panel fully before focusing the website.
  The revealed panel is 919px high with inline height auto, opacity one and no
  inert attribute. The input is fully inside its panel and visible in the viewport
  at 685.84375–730.84375px, with the existing error colour (180, 67, 46).
- Rapid double-click disclosure changes settle back to the complete 919px panel
  and preserve the invalid website value.
- Reload restores the test name, email, question and optional website. Required
  completion remains three and optional context opens. All four values were
  confirmed in the rendered form; the draft status reports restoration.
- Reduced motion uses effectively immediate ink transitions (0.00001s from the
  global accessibility rule) and a static disclosure. Clearing the test note
  returns completion to zero, the draft to empty, all text inputs to empty and
  optional context to its inert closed state. Full motion was restored afterwards.
- Narrow 320 × 720: content and scroll widths both 305px; the fields and progress
  controls remain untransformed and available through normal page scrolling.
- Desktop 1363px: direct Name focus then Tab to Email leave both inputs at
  378.390625px and 93px high. The card stays at 29.671875px and 861.71875px high.
  Only the focused field's ink moves; its input does not translate.
- No Contact application errors appeared in the inspected browser logs. The only
  submit action used a schema-invalid website and stopped at client validation;
  no enquiry, booking, phone call or WhatsApp message was sent.

## Deployment

Source: `73f095affd86171f6bef82e522be7dcae1c252c5`.
Trigger: `cde87e1749a4c0953712500e1546bb0ef5b43cb3`.
Vercel deployment `dpl_9TsHF2JSUWqjyF9cz5Vw8zsjA4Bp` is READY at
`https://branding-tatva-42qoqd7rt-suman22.vercel.app/contact`.
Controlled workflow `34992122989` completed successfully and returned the branch
to controlled mode. Deployment identity was verified through Vercel metadata.

The permanent branch alias still resolves to Release 292. Its existing Vercel
credential limitation remains, so review uses temporary access to the exact
Release 298 deployment. Production remains untouched.
