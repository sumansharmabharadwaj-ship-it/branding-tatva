const fs = require('node:fs');

const RECORD = 'vercel-preview-cooldown.json';
const DAY = 24 * 60 * 60 * 1000;

function cooldownForStatus(status, now = Date.now()) {
  if (status?.context !== 'Vercel' || !['failure', 'error'].includes(status.state) ||
      !/rate.?limit|resource is limited|api-deployments-free-per-day/i.test(status.description || '')) return null;
  const observed = Date.parse(status.created_at || status.updated_at);
  if (!Number.isFinite(observed)) throw new Error('Vercel rate-limit status has no valid timestamp; deployment remains disabled.');
  const retry = status.description.match(/(?:retry|try again) in (\d+)\s*(day|hour|minute|second)s?/i);
  const units = { day: DAY, hour: 3600000, minute: 60000, second: 1000 };
  const duration = retry ? Math.max(1, Number(retry[1])) * units[retry[2].toLowerCase()] : DAY;
  const until = observed + duration;
  return { blocked: now < until, retryAfter: new Date(until).toISOString(), reason: status.description };
}

function readRecord(file = RECORD) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

async function checkCooldown({ github, owner, repo, now = Date.now(), record = readRecord() }) {
  const recorded = cooldownForStatus(record?.status, now);
  if (recorded?.blocked) return { ...recorded, observedCommit: record.observedCommit, checkedCommits: 0 };

  // Read GitHub's existing Vercel results. This never asks Vercel to deploy.
  // The ledger survives busy branches; recent status reads also catch a
  // rejection from production or a manually requested preview.
  const refs = new Set(['main', 'august-8-isolated']);
  for (const sha of [...refs]) {
    const { data } = await github.rest.repos.listCommits({
      owner, repo, sha, since: new Date(now - DAY).toISOString(), per_page: 20,
    });
    data.forEach(commit => refs.add(commit.sha));
  }
  let latest = null;
  const allRefs = [...refs];
  for (let index = 0; index < allRefs.length; index += 5) {
    const results = await Promise.all(allRefs.slice(index, index + 5).map(async ref => {
      const { data } = await github.rest.repos.getCombinedStatusForRef({ owner, repo, ref });
      const status = data.statuses?.find(item => item.context === 'Vercel');
      return { ...cooldownForStatus(status, now), observedCommit: data.sha || ref };
    }));
    for (const result of results) {
      if (result.blocked && (!latest || result.retryAfter > latest.retryAfter)) latest = result;
    }
  }
  return latest ? { ...latest, checkedCommits: refs.size } : { blocked: false, checkedCommits: refs.size };
}

function recordRejection(combined, observedCommit, file = RECORD, now = Date.now()) {
  const status = combined.statuses?.find(item => item.context === 'Vercel');
  const next = cooldownForStatus(status, now);
  if (!next) return false;
  const existing = cooldownForStatus(readRecord(file)?.status, now);
  if (existing && existing.retryAfter >= next.retryAfter) return false;
  fs.writeFileSync(file, JSON.stringify({
    version: 1, observedCommit,
    status: { context: 'Vercel', state: status.state, description: status.description, created_at: status.created_at || status.updated_at },
  }, null, 2) + '\n');
  return true;
}

module.exports = { cooldownForStatus, readRecord, checkCooldown, recordRejection };
