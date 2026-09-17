# Update the Branding Tatva preview link

Release 369 is READY and browser verified. The shared review link currently
points to release 368, which was successfully updated before this work.
The new release improves the closing invitation's phone spacing and adds a
scroll-driven line connecting the three conversation steps.

[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).

The connected tools expose deployment inspection but no alias assignment
action. In the Terminal already signed into the site's Vercel account, run:

```bash
npx --yes vercel@59.19.0 alias set dpl_5Kg7mhK8JLo3qmWk2SmrXuKpVESg branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the shared preview link without promoting production. The target
is the verified release 369, trigger commit
`ffee9e5c99f4b09321592de9dcade360036b8fbb`.

Build and deployment checks passed. Browser checks covered 320 px and 390 px
phones, 1280 px laptops at two heights, and a 1440 px desktop. Forward/reverse
scrolling, pause/resume, visible keyboard focus and the personalized contact
route passed. See `homepage-invitation-reading-qa.md` for measurements and limits.

After the command succeeds, the shared link can be checked against this target.
The browser blocks `/api/release`, so endpoint certification remains unavailable;
deployment metadata, the trigger comparison and the rendered changes establish
the release used for browser verification.

A later preview will need its own confirmed deployment target. Automatic
assignment for future releases requires the repository's existing Vercel
credential to be configured.
