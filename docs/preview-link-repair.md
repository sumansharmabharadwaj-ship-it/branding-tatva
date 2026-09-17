# Update the Branding Tatva preview link

The shared review link has advanced to release 357. Release 363 is READY and includes
the current homepage changes, including phone project controls and steadier pause.
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

## 2. Point the shared link to release 363

```bash
npx --yes vercel@59.19.0 alias set dpl_6THbjBMBtTAoAM8pMtXmaWTnU2NX branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the preview link:
[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).
It does not promote the site to production.

After the command succeeds, return to this conversation so the link can be
checked against release 363.

This release includes the earlier opening, text and motion improvements, plus
phone project controls, a shorter decision record and a fix for the reading
position shifting when motion is paused. Build and deployment checks passed.
Chrome checks covered desktop, 320 px and 390 px layouts, all five projects,
keyboard focus, pause/resume and opening headline stability. Details and
verification limits are recorded in homepage-reading-controls-qa.md.

For verification, the expected preview commit is
`128fc6e540d3603529125f1d68d60cb8b0c8e3bc`. A later preview release will need
its own confirmed deployment target; these commands deliberately identify this
specific version. Automatic assignment for future releases still requires the
repository's existing Vercel credential to be configured.
