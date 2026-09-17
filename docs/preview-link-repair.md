# Update the Branding Tatva preview link

The shared review link has advanced to release 357. Release 360 is READY and includes all
current website changes, including the Paths, Questions and Studio corrections. The workspace cannot
complete Vercel sign-in because its connection to Vercel's API was blocked.
Run these steps in **Terminal on your Mac**, using the Vercel account that owns
Branding Tatva.

## 1. Sign in if needed

If the previous repair command succeeded in this Terminal, skip to step 2.

```bash
npx --yes vercel@59.19.0 login
```

Complete the sign-in in your browser. Wait for Terminal to confirm success.

## 2. Point the shared link to release 360

```bash
npx --yes vercel@59.19.0 alias set dpl_7tLCpStkshU7EuKBe2M5aM62yvFQ branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the preview link:
[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).
It does not promote the site to production.

After the command succeeds, return to this conversation so the link can be
checked against release 360.

This release includes all earlier opening, text and motion improvements, plus
corrections for the Paths footer, fast Questions keyboard input and Studio reading
focus. Automated checks and responsive Chrome checks passed, including reverse
scrolling and pause/resume. Details are recorded in homepage-focus-clearance-qa.md.

For verification, the expected preview commit is
`9c73afda548a82012669765bb05766f36989502b`. A later preview release will need
its own confirmed deployment target; these commands deliberately identify this
specific version. Automatic assignment for future releases still requires the
repository's existing Vercel credential to be configured.
