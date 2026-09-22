const TRIGGER = /^Request release (\d+) through Git integration \[deploy\] \[release:\1\](?:\s|$)/;
const DAY = 24 * 60 * 60 * 1000;

function describeStatus(status, now = Date.now()) {
  const description = (status?.description || '').replace(/[\r\n]+/g, ' ').trim();
  const state = status?.state || 'waiting';
  const rateLimited = ['failure', 'error'].includes(state) &&
    (/rate.?limit|too many deployments/i.test(description) ||
      /[?&]upgradeToPro=build-rate-limit(?:&|$)/.test(status?.target_url || ''));
  const duration = description.match(/retry (?:in|after) (\d+(?:\.\d+)?)\s*(second|minute|hour|day)s?/i);
  const units = { second: 1000, minute: 60000, hour: 3600000, day: DAY };
  const retryMs = duration ? Number(duration[1]) * units[duration[2].toLowerCase()] : DAY;
  const created = Date.parse(status?.created_at);
  const retryAt = rateLimited && Number.isFinite(created) ? new Date(created + retryMs).toISOString() : '';
  return {
    state, description, targetUrl: status?.target_url || '', rateLimited, retryAt,
    coolingDown: rateLimited && (!retryAt || Date.parse(retryAt) > now),
  };
}

function publishOutputs(core, result) {
  core.setOutput('vercel_state', result.state);
  core.setOutput('target_url', result.targetUrl);
  core.setOutput('description', result.description);
  core.setOutput('rate_limited', String(result.rateLimited));
  core.setOutput('retry_at', result.retryAt);
}

async function latestTrigger(github, context, branch) {
  // Search recent branch history, including descendants of the source on a rerun.
  // Never infer a quota reset from an unrelated feature branch's successful build.
  for (let page = 1; page <= 3; page++) {
    const { data } = await github.rest.repos.listCommits({
      ...context.repo, sha: branch, per_page: 100, page,
    });
    const commit = data.find(item => TRIGGER.test(item.commit.message));
    if (commit) return { sha: commit.sha, release: TRIGGER.exec(commit.commit.message)[1] };
    if (data.length < 100) return null;
  }
  throw new Error('Could not establish the previous preview trigger within 300 commits. Check release history before requesting another build.');
}

async function preflight({ github, context, core, branch, release, now = Date.now() }) {
  const trigger = await latestTrigger(github, context, branch);
  if (!trigger) return;
  const { data } = await github.rest.repos.getCombinedStatusForRef({ ...context.repo, ref: trigger.sha });
  const result = describeStatus(data.statuses?.find(item => item.context === 'Vercel'), now);
  if (result.coolingDown) {
    publishOutputs(core, result);
    const timing = result.retryAt ? `Retry check after ${result.retryAt}.` : 'Vercel supplied no usable rejection timestamp; review the provider status before retrying.';
    core.summary.addHeading('Vercel deployment cooldown').addRaw(`${result.description}\n\n${timing}\n\nNo deployment was requested. The branch remains in controlled mode.\n`);
    await core.summary.write();
    core.setFailed(`${result.description} ${timing}`);
    return;
  }
  if (result.state === 'success' && trigger.release === String(release)) {
    publishOutputs(core, result);
    core.setOutput('reuse_sha', trigger.sha);
    core.notice(`Release ${release} is already ready at ${trigger.sha}; reusing its deployment.`);
    return;
  }
  if (['pending', 'waiting'].includes(result.state)) {
    const description = `Previous preview ${trigger.sha.slice(0, 8)} is ${result.state}; check it before requesting another build.`;
    publishOutputs(core, { ...result, state: 'error', description });
    core.setFailed(description);
  }
}

async function waitForVercel({ github, context, core, trigger, source, onStatus = () => {}, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), attempts = 120 }) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    const { data } = await github.rest.repos.getCombinedStatusForRef({ ...context.repo, ref: trigger });
    onStatus(data);
    const result = describeStatus(data.statuses?.find(item => item.context === 'Vercel'));
    core.info(`Vercel status for ${trigger}: ${result.state}${result.description ? `: ${result.description}` : ''}`);
    if (['success', 'failure', 'error'].includes(result.state)) {
      publishOutputs(core, result);
      core.summary.addHeading('Controlled august preview')
        .addRaw(`Source: ${source}\n\nTrigger: ${trigger}\n\nVercel: ${result.state}\n\n`)
        .addCodeBlock(result.description || 'No description supplied.');
      if (result.targetUrl) core.summary.addLink('Vercel result', result.targetUrl);
      if (result.retryAt) core.summary.addRaw(`\n\nRetry check after ${result.retryAt}. This is derived from Vercel's retry message; availability must still be checked.\n`);
      await core.summary.write();
      if (result.state !== 'success') core.setFailed(result.description || `Vercel reported ${result.state}.`);
      return;
    }
    if (attempt < attempts - 1) await sleep(6000);
  }
  core.setFailed('Vercel did not finish within 12 minutes. Inspect this trigger before requesting another deployment.');
}

module.exports = { describeStatus, latestTrigger, preflight, waitForVercel };
