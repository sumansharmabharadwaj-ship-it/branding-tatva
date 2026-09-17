# Update the Branding Tatva preview link

The shared review link has advanced to release 357. Release 359 is READY and includes all
current website changes, including the Paths and Questions corrections. The workspace cannot
complete Vercel sign-in because its connection to Vercel's API was blocked.
Run these steps in **Terminal on your Mac**, using the Vercel account that owns
Branding Tatva.

## 1. Sign in if needed

If the previous repair command succeeded in this Terminal, skip to step 2.

```bash
npx --yes vercel@59.19.0 login
```

Complete the sign-in in your browser. Wait for Terminal to confirm success.

## 2. Point the shared link to release 359

```bash
npx --yes vercel@59.19.0 alias set dpl_A1srdMuvGBfsgbdpWiyQbrue9kYG branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the preview link:
[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).
It does not promote the site to production.

After the command succeeds, return to this conversation so the link can be
checked against release 359.

This release includes the opening text and proof improvements, Recognition
and Paths keyboard clearance, and the Questions closing-focus safeguard. Automated
checks passed. Interactive browser acceptance remains pending.

For verification, the expected preview commit is
`79a4fe3e43579db6af4f05f3b84acf1a9f55dafa`. A later preview release will need
its own confirmed deployment target; these commands deliberately identify this
specific version. Automatic assignment for future releases still requires the
repository's existing Vercel credential to be configured.
