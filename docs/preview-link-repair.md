# Update the Branding Tatva preview link

Release 371 is READY and verified. The shared review link currently points to
release 369, which was successfully updated before this work.

The new release makes the brand diagnostic easier to follow: wider phone
answer text on a light reading panel, choices before the next action, a clear
completion label, and room between desktop actions and fixed page controls.

[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).

The connected tools expose deployment inspection but no alias assignment
action. In the Terminal already signed into the site's Vercel account, run:

```bash
npx --yes vercel@59.19.0 alias set dpl_5ioFupDvX3q9ftgEyFxQg1k63u6o branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the shared preview link without promoting production. The target
is the verified release 371, trigger commit
`2b4cd0e44e1c5574b63b12b1cc95f08110eeaf41`.

The build, typing, homepage and deployment checks passed. The initial candidate
passed the three-question flow, back navigation, keyboard selection, answer
review and editing, completion and motion pause checks at 320 px. Layouts were
checked at 390 px, tablet, laptop and desktop widths. The final correction was
verified on both desktop heights and the phone layout was confirmed unchanged.
See `homepage-diagnostic-reading-qa.md` for exact measurements and limits.

After the command succeeds, the shared link can be checked against this target.
The browser blocks `/api/release`, so endpoint certification remains unavailable;
deployment metadata, the trigger comparison and the rendered changes establish
the release used for browser verification.

A later preview will need its own confirmed deployment target. Automatic
assignment for future releases requires the repository's existing Vercel
credential to be configured.
