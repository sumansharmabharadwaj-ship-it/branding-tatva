# Update the Branding Tatva preview link

Release 412 is READY. The homepage service paths now use a connected decision
trail, clearer labels and supporting explanations. Decorative connector
segments draw in sequence, while keyboard selection and paused motion keep
the reading still. Mobile menu fixes and the concurrent Insights, hidden cost
and Services improvements are included.

[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).

The shared link was successfully updated to release 408 following the user's
earlier command. It still points to that release, trigger
`30683d854ee271602773e892cd90c03c32dd9110`. The connected tools expose deployment
inspection but no alias assignment. In the Terminal already signed into the
site's Vercel account, run:

```bash
npx --yes vercel@59.19.0 alias set dpl_GEdjBi9baGhvajFTeVxjae5uD1WN branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This changes the shared preview link without promoting production. Release
412's exact trigger is `f78f5af66beb71e6cc8fc577413c63c4ff1a561c`.

TypeScript, changed-file ESLint, homepage source, type floor, production build and
rendered homepage checks passed. All three final release workflows passed.
The exact final deployment passed desktop and narrow layout checks, keyboard
path selection, stable panel sizing, paused motion, and forward and reverse
scrolling. Pointer dispatch timeouts prevented capturing the connector's
intermediate draw frames. See `homepage-path-decision-trail-qa.md` for exact
measurements and verification limits.

The browser's /api/release restriction remains, so endpoint certification is
unavailable. Metadata, source to trigger comparisons, and rendered changes
establish the exact previews used for verification.

A later preview needs its own confirmed deployment target. Automatic alias
assignment requires the repository's existing Vercel credential to be configured.
