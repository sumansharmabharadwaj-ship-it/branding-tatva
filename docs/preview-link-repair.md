# Update the Branding Tatva preview link

The shared review link points to release 357. Release 366 is READY and includes
the current homepage changes, including the screenshot fixes for section bands
and complete strategist content.
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

## 2. Point the shared link to release 366

```bash
npx --yes vercel@59.19.0 alias set dpl_48YDZyZYv9R5dnTJJUvMGohdHiZz branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the preview link:
[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).
It does not promote the site to production.

After the command succeeds, return to this conversation so the link can be
checked against release 366.

This release removes the broad gradient strips between chapters, lets the
portrait caption size its card, improves the studio fit check and adds footer
clearance. Build and deployment checks passed. Chrome checks covered desktop,
short laptop, 320 px phone and compact reflow layouts, discipline selection,
reverse scrolling and paused motion. Details and verification limits are in
homepage-screenshot-glitches-qa.md. Earlier pressure and framework improvements
remain included and documented in their respective QA files.

For verification, the expected preview commit is
`ef50219c9c9b1566d3c4efaf8b67353d5d87826e`. A later preview release will need
its own confirmed deployment target; these commands deliberately identify this
specific version. Automatic assignment for future releases still requires the
repository's existing Vercel credential to be configured.
