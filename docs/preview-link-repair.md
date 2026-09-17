# Update the Branding Tatva preview link

The shared review link points to release 357. Release 365 is READY and includes
the current homepage changes, including a shorter pressure section and animated
connection feedback.
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

## 2. Point the shared link to release 365

```bash
npx --yes vercel@59.19.0 alias set dpl_726ae6YQd2omk9yMcrmAugPw1h4G branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the preview link:
[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).
It does not promote the site to production.

After the command succeeds, return to this conversation so the link can be
checked against release 365.

This release includes the earlier opening, project controls and compact framework
improvements, plus a shorter pressure section on phones, clearer diagram labels,
animated connection bars and a parchment consequence panel. Build and deployment
checks passed. Chrome checks covered 320 px, 390 px, 768 px and desktop layouts,
keyboard selection, restoration, reverse scrolling and paused motion. Details
and verification limits are recorded in homepage-pressure-clarity-qa.md.
Earlier framework checks remain documented in homepage-framework-qa.md.

For verification, the expected preview commit is
`a78e205fc180d145adcd0d595db650ab2c9a7996`. A later preview release will need
its own confirmed deployment target; these commands deliberately identify this
specific version. Automatic assignment for future releases still requires the
repository's existing Vercel credential to be configured.
