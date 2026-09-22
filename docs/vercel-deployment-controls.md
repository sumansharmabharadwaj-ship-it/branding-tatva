# Vercel deployment controls

The September 22 rejections came from Vercel before build creation. The provider's GitHub status said `Deployment rate limited — retry in 24 hours.` A successful deployment from another branch does not establish that the controlled release can be retried.

## Automatic deployment policy

`vercel.json` disables automatic Git deployments by default (`**: false`). `main` remains enabled for production. `august-8-isolated` is normally disabled and is enabled only for an intentional release trigger. This includes nested feature branch names: a single `*` would miss names containing `/`.

Use the shared controlled preview to review batches of changes. If an additional branch preview is deliberately needed, explicitly enable that exact branch in its `vercel.json`; remove the exception when finished. Existing branches must incorporate this policy before it can govern their next push. Do not add a broad `true` wildcard: Vercel deploys when any matching rule is true.

Vercel's Ignored Build Step runs after a deployment has been created. Those canceled deployments still count toward deployment limits. It is a second check, not the quota-saving mechanism.

## Controlled release behavior

1. Increment `vercel-preview-release.json` and commit with `[deploy] [release:N]` only when a preview is intentionally requested.
2. The shared cooldown guard checks the persistent rejection ledger and recent production and preview statuses. The workflow also checks the most recent controlled trigger's real Vercel status before installing dependencies or writing a new trigger. An active provider cooldown or unresolved previous deployment stops another request.
3. A rerun of an already successful release reuses the existing trigger. A different release needs its own verified build.
4. The existing ancestry, current-release, and contact-delivery checks still run before a fresh deployment is enabled.
5. Only the workflow-generated `Request release N through Git integration [deploy] [release:N]` commit passes the preview build gate. A source request arriving during the enable window is rejected by the gate.
6. The workflow immediately restores `deploymentEnabled` to false after pushing that immutable trigger, before waiting for the build. The final cleanup retains the shared rejection ledger and records newer cooldowns. This reduces the interval in which concurrent source pushes could create extra deployments.
7. GitHub reports Vercel's actual error description. A cleanup failure or alias assignment failure cannot be reported as a fully successful controlled preview.

## After a quota rejection

The retry-check time is calculated from Vercel's rejection timestamp and its stated retry interval. It is a conservative check time, not a guarantee that the provider's quota has reset. Repeated inspections do not extend it. No alternate team, branch, or deployment API should be used to bypass the quota.

After the indicated time, run `Deploy one controlled august preview` using its manual action on `august-8-isolated`, entering the current manifest release number. This uses the current workflow, unlike rerunning a historical job that still carries the old deployment logic. If a newer release exists, request only that current batch. Increment the manifest for new changes after a successful release. An expired cooldown permits one normal request; any new rejection establishes the next cooldown. A paid plan change remains an account-owner decision.

Run `node scripts/vercel_preview_deploy_gate.cjs --self-test` and `node --test scripts/vercel_preview_status.test.cjs scripts/vercel_preview_cooldown.test.cjs` to check the deployment logic without requesting a Vercel build.

References: [Git deployment configuration](https://vercel.com/docs/project-configuration/git-configuration), [ignored build limits](https://vercel.com/docs/monorepos#ignoring-the-build-step), [Vercel limits](https://vercel.com/docs/limits).
