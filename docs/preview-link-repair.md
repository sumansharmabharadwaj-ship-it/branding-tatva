# Update the Branding Tatva preview link

The shared review link has advanced to release 357. Release 361 is READY and includes all
current website changes, including the Paths, Questions and Studio corrections.
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

## 2. Point the shared link to release 361

```bash
npx --yes vercel@59.19.0 alias set dpl_svYSjWbiCjp8QNxuEqH33gDitLcz branding-tatva-git-august-8-isolated-suman22.vercel.app --scope suman22
```

This updates the preview link:
[Branding Tatva preview](https://branding-tatva-git-august-8-isolated-suman22.vercel.app/).
It does not promote the site to production.

After the command succeeds, return to this conversation so the link can be
checked against release 361.

This release includes all earlier opening, text and motion improvements, plus
corrections for the Paths footer, fast Questions keyboard input and Studio reading
focus. Release 361 adds the staggered headline entrance, scroll-drawn accents,
chapter rules, stable button light sweeps and clearer opening copy. Automated
checks and responsive Chrome checks passed, including reverse scrolling and
pause/resume. Details and verification limits are recorded in
homepage-signature-motion-qa.md.

For verification, the expected preview commit is
`a890ad3ca04f8cb39c9fb687f16c3c7d66162365`. A later preview release will need
its own confirmed deployment target; these commands deliberately identify this
specific version. Automatic assignment for future releases still requires the
repository's existing Vercel credential to be configured.
