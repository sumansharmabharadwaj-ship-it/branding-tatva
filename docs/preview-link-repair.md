# Update the Branding Tatva preview link

Release 408 is READY. The mobile menu scrolls within short screens, restores
keyboard focus on close, keeps its animated exit inactive, and preserves page
position. Keyboard focus settles the opening animation. The floating homepage
guide stays clear of the open menu, and the empty phone sound row is removed.
The earlier homepage project file and Services improvements are included.

[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).

The shared link was successfully updated to release 405 following the user's
earlier command. It still points to that release, trigger
`403fef297095020243d041c506d22d75e65c6802`. The connected tools expose deployment
inspection but no alias assignment. In the Terminal already signed into the
site's Vercel account, run:

```bash
npx --yes vercel@59.19.0 alias set dpl_H6MVbfzSVsrshPLpcMMwx8RjKEYW branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This changes the shared preview link without promoting production. Release
408's exact trigger is `30683d854ee271602773e892cd90c03c32dd9110`.

TypeScript, Header ESLint, homepage source, type floor, production build and
rendered homepage checks passed. All three final release workflows passed.
The exact final deployment passed phone focus and exit checks, the shortest
viewport's bottom-action check, and desktop visual review. Landscape scrolling,
focus, route navigation, paused motion and backdrop close were exercised during
this release sequence. The overlap fix was visually verified on release 407.
See `homepage-mobile-menu-qa.md` for exact measurements and verification limits.

The browser's /api/release restriction remains, so endpoint certification is
unavailable. Metadata, source to trigger comparisons, and rendered changes
establish the exact previews used for verification.

A later preview needs its own confirmed deployment target. Automatic alias
assignment requires the repository's existing Vercel credential to be configured.
