# Homepage introduction motion · release 319

Source: `b1f8ada11acde97b7e149d3cbacc4d0b85e54d52`.

Twelve chapter introductions now carry a vertical ink sweep tied to their
position in the reading zone. The sweep moves between the original readable
text colour and an opaque emphasis colour, reversing with native scroll. The
original paragraph nodes, line wrapping, selection and layout are preserved.
The effect shares the existing visible-scene animation loop and its short
settling interval; it adds no scroll listener, timer or React render loop.

An active native selection holds this director's geometry and ink for the
selected scene. Keyboard focus inside a scene holds its decorative text paint.
Clearing selection or moving focus resumes the same scroll-derived state.
The site pause control removes the effect and its inline properties. OS reduced
motion, forced colours, printing and missing text-clip support retain native ink.

Local TypeScript, changed-file lint, homepage source gate, typography gate,
production build and rendered homepage gate passed. The release preserves the
latest independent Services and founder-guide changes from branch head
`cb3af98874ce522b02027582048e592b5ee72d80`.

## Deployment and release checks

- Trigger: `8d696ee0e10b327ec6732ec860c3f423630949b8`.
- Deployment: `dpl_8VKcud2gQHbCYLVsNoT9fTFTXLV5`, READY, preview target.
- Preview: https://branding-tatva-pnv0ea030-suman22.vercel.app/
- Homepage CI `35063292880`: success, including build and rendered checks.
- Controlled deployment `35063292879`: success.
- Contact delivery regression `35063292881`: success.
- The usual branch alias still resolved to release 316 during acceptance.

## Desktop · 1440 × 900

The hidden-cost introduction's progress was .550 at scrollY 1871. A native
160 px forward gesture changed it to .940 at 2031, and the reverse gesture
returned it to .550 at 1871. The heading-to-paragraph gap stayed exactly 16 px.
Client and document widths were both 1425 px.

A native drag selected the paragraph, confirmed visually. A 140 px wheel
gesture then moved the document from 1871 to 2011 while progress stayed .550.
Clearing selection allowed the sweep to follow the new reading position again.

Tab moved keyboard focus from Separate promises to Shared position. Reversing
120 px retained that focus and held paint progress at .219. Enter activated
Shared position successfully. Pause cleared all reading and heading ink targets,
removed the gradient and stopped every video. Resume restored the sweep at
scrollY 1628 and paragraph top 766.5356 px, matching the paused reading position.

## Responsive mobile · 390 × 844

Foundation introduction progress was .611 at scrollY 4125, .882 at 4225,
and .611 again after reversing to 4125. The heading-to-paragraph gap stayed
14.390625 px and client/document widths stayed equal at 375 px.

Pause and resume both retained scrollY 4125, heading top 372 px and paragraph
top 471.171875 px. Pause removed all reading targets and stopped every video;
resume restored progress .611. After the native click brought Category into
view at scrollY 4272, End moved selection and focus to Position with no further
scroll change. The introduction gap and paint progress were retained.

Visual inspection confirmed readable text, stable line wrapping, usable controls
and no horizontal overflow. Browser checks used Chromium desktop and responsive
mobile viewports, not physical touch devices. OS reduced-motion, forced-colour
and print fallbacks were checked in source; the site pause was tested live.
