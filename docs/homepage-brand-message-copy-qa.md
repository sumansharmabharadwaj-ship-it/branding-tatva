# Homepage brand message example

18 September 2026. Requested after the user rejected the meal planning analogy
in the hidden cost chapter.

## Editorial change

The example is now explicitly a brand consultancy. Its mixed messages sell
appearance, content volume and website speed. Its aligned messages express a
single position: a clear reason for buyers to choose the business. Website,
email and social remain distinct channels. The example label identifies the
copy as illustrative rather than a record of client results or service terms.

The heading reads “More content. Less recognition.” The two controls read
“Mixed messages” and “Clear positioning”. All recipe, meal planning, dinner
and calorie references have been removed from both visible and measured
variants of this section. The introductory paragraph, per-channel association
labels and final remembered idea now explain branding directly.

The comparison's existing animations, interaction, layout, reduced-motion
behavior and accessible control structure are unchanged. Both message variants
still reserve their reading height before the visitor switches.

## Local validation

TypeScript, changed-file ESLint, homepage source check, type floor check,
production build and rendered homepage check passed. The build generated
93 routes. Rendered homepage checks verified 526,631 CSS bytes. A focused
inspection of the rendered cost section confirmed that the new copy is
present in both variants and that the recipe terms are absent.

## Release

Controlled preview release 413.
Source: `b3ab8f1f054c1e360c65123e7bf8f48b63d264af`.
Trigger: `245f2f8305a0006256ab82942a8f09fd57b115b0`.
Deployment: `dpl_511DRDce3rrTLC31TdxWSpV7nkF1`.

The exact deployment is READY. Source to trigger comparison contains only
`vercel.json`. All release workflows passed: homepage `35360829983`, contact
delivery `35360830017`, and controlled preview `35360830016`. Cleanup returned
the branch to controlled mode at `21b491b`.

## Deployed browser checks

The desktop viewport was 1363 × 936. The chapter retained a 936 px height,
without horizontal overflow. All three cards were 237.171875 px high, around
388.7 px wide. The mixed-message screenshot was reviewed and all text was
fully opaque. The revised heading, introduction and example label were visible.

The narrow QA viewport was 320 × 720, with 305 px of content after the scrollbar.
The comparison measured 764.421875 px high in both modes. Each card measured
255.40625 × 146.015625 px. Horizontal overflow was zero. Keyboard Enter selected
Clear positioning, updating all three messages and the remembered idea. Enter
on Mixed messages restored the original state with the same comparison height.
PageDown and PageUp preserved the selected state while reading. A screenshot
of the aligned state showed all three messages, their common association and
the final remembered idea without clipped text. A DOM check of the deployed
section confirmed the recipe terminology was absent.

Browser pointer dispatch and desktop key dispatch repeatedly timed out. A
later short-laptop check also encountered a browser discovery timeout. These
checks are recorded as unavailable rather than passed. Mobile keyboard mode
switching and desktop static layout were directly verified. The change contains
copy edits only; animation logic and CSS are unchanged.

The protected `/api/release` request returned a Vercel authentication redirect,
so endpoint certification remains unavailable. Deployment metadata, source to
trigger comparison and the rendered new copy identify the exact preview.

## Shared review link

The shared alias was checked after release 413 became READY and still resolves
to release 408, deployment `dpl_H6MVbfzSVsrshPLpcMMwx8RjKEYW`. The available
connected tools cannot assign aliases. The updated command in
`preview-link-repair.md` assigns the existing review alias to release 413 without
promoting production.

Before the documentation push, a concurrent Services release 414 arrived.
Its source is `345bbe133996a72ad7b0de68e1bbf1eb2aa3870f`, trigger
`19d0e91b5bce5c61ad6257662270433f0d58eeff`, and READY deployment
`dpl_5C3ec1h8SuLB7QBF4G2afRzTJd1s`. Comparing its cleaned branch head with
release 413's cleaned head changes only the Services stylesheet, two Services
components and the release number. This homepage correction is included
unchanged. The final shared-link command therefore targets 414 to preserve
those concurrent changes. Browser measurements above remain from exact 413.
