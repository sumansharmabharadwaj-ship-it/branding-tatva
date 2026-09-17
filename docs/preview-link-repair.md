# Update the Branding Tatva preview link

Release 368 is READY and verified. The shared review link currently points to
release 366, which was successfully repaired earlier on 17 September 2026.
The newer release adds wider mobile question text, a scroll-driven reading line
and a fix for answer text moving after rapid keyboard focus.

[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).

The connected tools expose deployment inspection but no alias assignment
action. Run the command below in Terminal on your Mac, using the Vercel account
that owns Branding Tatva. Future releases still need their alias target verified.

## 1. Sign in if needed

If the previous repair command succeeded in this Terminal, skip to step 2.

```bash
npx --yes vercel@59.19.0 login
```

Complete the sign-in in your browser. Wait for Terminal to confirm success.

## 2. Point the shared link to release 368

```bash
npx --yes vercel@59.19.0 alias set dpl_3vtQMFw74baWvwDLmLJK7ENmSEYW branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the preview link:
[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).
It does not promote the site to production.

After the command succeeds, the shared link can be checked against release 368.
The browser blocks `/api/release`, so endpoint certification remains unavailable;
deployment metadata, the trigger diff and the rendered changes establish the
deployment verification.

Build and deployment checks passed. The questions work at 320 px, tablet and
desktop widths. Rapid keyboard opening and focus now keep the answer still,
and closing retains focus on the question. Native reverse scrolling and paused
motion were checked on the initial candidate; the final correction keeps its
layout and adds the focus safeguard. Details and limits are in
homepage-question-reading-qa.md. The release 366 screenshot fixes remain included.

For verification, the expected preview commit is
`1cc494eaa8f494af498cf2ddb6e3a3837282aec0`. A later preview release will need
its own confirmed deployment target; these commands deliberately identify this
specific version. Automatic assignment for future releases still requires the
repository's existing Vercel credential to be configured.
