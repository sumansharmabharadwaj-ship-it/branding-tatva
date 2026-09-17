# Update the Branding Tatva preview link

The shared review link has advanced to release 357. Release 362 is READY and includes
the current homepage changes, including the brighter evidence archive.
The permanent alias has not advanced automatically. The connected tools expose
deployment inspection but no alias assignment action.
Run these steps in **Terminal on your Mac**, using the Vercel account that owns
Branding Tatva.

## 1. Sign in if needed

If the previous repair command succeeded in this Terminal, skip to step 2.

```bash
npx --yes vercel@59.19.0 login
```

Complete the sign-in in your browser. Wait for Terminal to confirm success.

## 2. Point the shared link to release 362

```bash
npx --yes vercel@59.19.0 alias set dpl_FN5fbMjcMmihwHW6FaVM6fzHJTvh branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the preview link:
[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).
It does not promote the site to production.

After the command succeeds, return to this conversation so the link can be
checked against release 362.

This release includes the earlier opening, text and motion improvements, plus
brighter project photography, readable decision records, clearer project
selection and sequenced evidence animations. Build and deployment checks passed.
Chrome checks covered desktop, 320 px and 390 px layouts, keyboard selection,
pause/resume and opening/closing a project file. Details and verification limits
are recorded in homepage-evidence-readability-qa.md.

For verification, the expected preview commit is
`e6ff397551bf1d775b7fa8e94f9c1198796336d8`. A later preview release will need
its own confirmed deployment target; these commands deliberately identify this
specific version. Automatic assignment for future releases still requires the
repository's existing Vercel credential to be configured.
