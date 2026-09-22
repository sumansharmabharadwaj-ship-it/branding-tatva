# Vercel deployment recovery: 22 September 2026

The connected Vercel dashboard identifies the Suman team as Hobby. Current production is Ready at source e4e1f7f5ac33463c7e26d6df035435e0562ba9bd. GitHub reports a Vercel failure on main source 32702288fad7830537a677201356783ed94801cd at 2026-09-22T12:23:50Z: `Deployment rate limited — retry in 24 hours.` Controlled release 514 received the same response at 12:19:01Z.

## Changes

The Git deployment rules disable ordinary branches by default, including names containing slashes. Main remains enabled. The august preview stays disabled except for its existing deliberate release handshake.

The controlled release checks the saved provider rejection before changing any deployment setting. An active cooldown ends the workflow with an explicit status and no deployment trigger. Once the recorded interval expires, read-only GitHub checks inspect recent main and august results for a newer rejection. An unavailable status API fails closed. A second check reads the current branch ledger immediately before enabling the preview.

Cleanup records a newer rate-limit rejection while returning the preview branch to disabled mode. Older responses cannot shorten or extend the ledger. Malformed status output cannot prevent the branch from being disabled. Ordinary build failures and successful results do not create a cooldown.

The initial conservative retry boundary is 2026-09-23T12:23:50Z, or 17:53:50 IST. This follows the provider response; it does not guarantee quota availability at that time. Newer provider failures can require a later boundary. The ledger is evidence, not an override of Vercel's limit. Do not delete it to force retries.

## Validation

Nine Node regression checks passed: fixed cooldown expiry, unrelated failure handling, explicit shorter intervals, zero API calls during the saved cooldown, newer trigger discovery behind ordinary commits, expired cooldown handling, failed API lookup, rejection persistence, and branch-rule matching with minimatch.

The existing preview deployment gate self-test passed. Workflow YAML and all Bash steps parse successfully, and the cooldown step precedes deployment enablement. Running the new check against the saved real rejection returned blocked with zero API calls.

These changes affect deployment controls only. They do not publish pending website changes or clear a provider quota. Older working branches need the current deployment configuration before their next push. No plan purchase, project transfer, domain change, or deployment deletion is part of this repair.

## Recovery

After the cooldown, request one deliberate current preview through the existing release manifest workflow. Verify the exact Ready deployment and its browser acceptance before promoting reviewed source. Check the production `/api/release` before reporting publication. Further rate-limit responses should be recorded and allowed to expire, not repeatedly retried.

Official references:

- https://vercel.com/docs/limits
- https://vercel.com/docs/project-configuration/git-configuration
- https://vercel.com/docs/monorepos
