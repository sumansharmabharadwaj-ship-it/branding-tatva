# Update the Branding Tatva preview link

The shared review link points to release 357. Release 364 is READY and includes
the current homepage changes, including compact framework choices and clearer readings.
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

## 2. Point the shared link to release 364

```bash
npx --yes vercel@59.19.0 alias set dpl_FnfbrvZ4214EERZPfdD8oAvdRj1J branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the preview link:
[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).
It does not promote the site to production.

After the command succeeds, return to this conversation so the link can be
checked against release 364.

This release includes the earlier opening, text, project controls and motion
improvements, plus a compact framework row on phones and tablets, an animated
selection indicator and a parchment reading panel. Build and deployment checks
passed. Chrome checks for this release covered 320 px, 390 px, 768 px and desktop
layouts, keyboard selection and the page motion controls. Details and verification
limits are recorded in homepage-framework-qa.md. Earlier project-control checks
remain documented in homepage-reading-controls-qa.md.

For verification, the expected preview commit is
`d864ce67da9efd415b187601c3822ad2550b351d`. A later preview release will need
its own confirmed deployment target; these commands deliberately identify this
specific version. Automatic assignment for future releases still requires the
repository's existing Vercel credential to be configured.
