# Opening reading and recorded proof · release 356

## What changed

The opening eyebrow, headline, supporting copy, actions and proof render fully
visible from the server. The previous timed opacity entrances on the supporting
copy, links and proof have been removed. Native scroll now paints the original
headline emphasis through the shared reading director. Text remains semantic
and selectable, without animated word replacement or changes to line wrapping.

The opening reading group uses the existing short introduction treatment. The
actions and proof card are stationary siblings, outside that movement. The proof
card no longer receives the director's large translating and rotating plate
treatment. Its case study link now has a dark visible keyboard outline against
the light card.

The Dr. Haley proof compares December 2025 (0.71%) and January 2026 (2.81%) in a
definition list with proportional decorative bars. The values and dates match
`src/data/projects.ts`. Values and bar lengths stay fixed. Native scroll moves a
small light within the bars; reversing scroll reverses that light. Focus within
the proof, site motion pause, OS reduced motion, forced colors and print suppress
the decorative light. Existing compact-view rules continue to hide the full
proof card below 821 px.

Headline ink retains static fallbacks for site pause, OS reduced motion, forced
colors and print. The shared director retains its selection freeze and native
scroll behavior. No click target is remounted by these changes.

## Validation

Local checks passed on 2026-09-17:

- TypeScript and ESLint for both edited TSX components.
- Homepage source contract and typography floor.
- Production build and rendered homepage contract (499,330 CSS bytes).
- `git diff --check`.

Source commit: `50052f21265602bec9fd8317c3b904d3fb5fe158`.

GitHub homepage contract `35218220929` and contact regression `35218221097`
passed. Controlled preview `35218220970` created deployment trigger
`03890ea7587f65438e68419c7187cb7d88dea433`; the source-to-trigger comparison
contains only `vercel.json`.

Deployment `dpl_HetmRJf4WsnPrvo7PS5zK7wkaoUo` reached READY as a preview.
The controlled workflow completed successfully and restored controlled mode in
`2fc7e7a7fb9128285acbe66984dd225a1d07aae9`. Its logs confirm the existing
alias credential is unconfigured and cleanup succeeded.

The authenticated Vercel fetch of this exact deployment's `/api/release` returned
HTTP 200 at 11:59:28 UTC on 2026-09-17, reporting commit
`03890ea7587f65438e68419c7187cb7d88dea433`, branch `august-8-isolated` and
environment `preview`. Exact deployed identity is certified by the endpoint.

The permanent alias endpoint also returned HTTP 200 at 11:59:40 UTC, but reported
older commit `bf4ef15c495ad3e822425c68b2843805ddde6974`. The permanent review
link is therefore explicitly stale; the new preview is not represented by it.

## Browser and preview access

The existing browser transport remains unavailable. A bounded pure JavaScript
connection probe produced no response and was cancelled; no alternate browser
automation was used. Release 356 desktop, narrow phone, reverse-scroll and
pause/resume acceptance remains pending. Build validation does not establish
interactive acceptance. Pending release 354 and 355 Tatva checks recorded in
`docs/homepage-pressure-motion-qa.md` should run on this release as well.

The connected Vercel app is enabled and can inspect deployments, but exposes no
alias assignment operation. The official Vercel CLI reports that a new account
login is required. An official device login was initiated to prepare permanent
preview alias repair; account authorization is still required. No credentials
were searched, extracted or added to the repository. Production is untouched.

After login, inspect the exact READY preview and assign only
`branding-tatva-git-august-8-isolated-suman22.vercel.app`. Verify `/api/release`
against that deployment's trigger before calling the permanent link current.
The existing CI `VERCEL_TOKEN` secret remains unconfigured; manual alias repair
alone does not configure automatic reassignment for future previews.

The prepared preview-only alias command, after confirming READY and account
authorization, is:

```sh
vercel alias set dpl_HetmRJf4WsnPrvo7PS5zK7wkaoUo branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

## Remaining acceptance

- Inspect the opening at 1440 × 900, a compact desktop, 390 × 844 and 320 × 720.
- Check headline wrapping, italic descenders, lede spacing and action visibility.
- Confirm date labels, values and proportional tracks remain legible at zoom.
- Scroll forward and backward; confirm readable ink and fixed proof/link geometry.
- Tab through both opening actions and the case study link with visible outlines.
- Pause and resume motion while focused; confirm retained focus and scroll position.
- Inspect OS reduced motion and selection with readable static text.
