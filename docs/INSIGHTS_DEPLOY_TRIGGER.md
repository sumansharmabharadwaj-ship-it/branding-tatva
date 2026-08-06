# Insights preview deployment status

Canonical Insights branch: `feat/insights-authority-hub`
Canonical head requested for preview: `34bd92aeba5191aa6dba78be14c328c260cf847d`
Date checked: 2026-08-06

## Result

The GitHub-to-Vercel webhook was successfully regenerated through a clean branch push and temporary pull request. Vercel attached a failure status before cloning or compiling the repository:

`https://vercel.com/suman22?upgradeToPro=build-rate-limit`

This confirms that the missing preview is caused by the Vercel account build-rate limit, rather than the Insights branch, GitHub integration, or application build.

## Safe boundary

The earlier Insights preview remains available. The complete canonical library still requires a fresh Vercel build after the account allows another deployment. Main and production remain untouched.
