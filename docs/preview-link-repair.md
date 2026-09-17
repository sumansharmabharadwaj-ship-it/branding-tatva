# Update the Branding Tatva preview link

The shared review link has advanced to release 357. Release 358 is READY and
adds the latest Paths keyboard correction. The workspace cannot
complete Vercel sign-in because its connection to Vercel's API was blocked.
Run these steps in **Terminal on your Mac**, using the Vercel account that owns
Branding Tatva.

## 1. Sign in if needed

If the previous repair command succeeded in this Terminal, skip to step 2.

```bash
npx --yes vercel@59.19.0 login
```

Complete the sign-in in your browser. Wait for Terminal to confirm success.

## 2. Point the shared link to release 358

```bash
npx --yes vercel@59.19.0 alias set dpl_GdU2F7RWtvJkNiE8tKcD5uWZMyeC branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the preview link:
[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).
It does not promote the site to production.

After the command succeeds, return to this conversation so the link can be
checked against release 358.

This release includes the opening text and proof improvements, Recognition
keyboard clearance, and the Paths keyboard visibility correction. Automated
checks passed. Interactive browser acceptance remains pending.

For verification, the expected preview commit is
`561178de180e3ce6814b21d7ecde04f66b558e74`. A later preview release will need
its own confirmed deployment target; these commands deliberately identify this
specific version. Automatic assignment for future releases still requires the
repository's existing Vercel credential to be configured.
