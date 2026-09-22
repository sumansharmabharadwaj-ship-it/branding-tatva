const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createRequire } = require('node:module');
const { cooldownForStatus, checkCooldown, recordRejection, readRecord } = require('./vercel_preview_cooldown.cjs');

const observed = Date.parse('2026-09-22T12:23:50Z');
const rejection = {
  context: 'Vercel', state: 'failure',
  description: 'Deployment rate limited — retry in 24 hours.',
  created_at: new Date(observed).toISOString(),
};

test('the reported cooldown expires instead of moving on each check', () => {
  const first = cooldownForStatus(rejection, observed + 1);
  assert.equal(first.retryAfter, '2026-09-23T12:23:50.000Z');
  assert.equal(first.blocked, true);
  assert.equal(cooldownForStatus(rejection, observed + 3600000).retryAfter, first.retryAfter);
  assert.equal(cooldownForStatus(rejection, Date.parse(first.retryAfter)).blocked, false);
});

test('successful, unrelated, and ordinary build failures do not create cooldowns', () => {
  assert.equal(cooldownForStatus({ ...rejection, state: 'success' }), null);
  assert.equal(cooldownForStatus({ ...rejection, context: 'Unit tests' }), null);
  assert.equal(cooldownForStatus({ ...rejection, description: 'Build failed: TypeScript error' }), null);
  assert.equal(cooldownForStatus(undefined), null);
});

test('shorter explicit guidance is honoured and missing timestamps fail closed', () => {
  const status = { ...rejection, description: 'Resource is limited: try again in 30 minutes.' };
  assert.equal(cooldownForStatus(status, observed).retryAfter, '2026-09-22T12:53:50.000Z');
  assert.throws(() => cooldownForStatus({ ...rejection, created_at: 'invalid' }), /timestamp/);
});

test('an active saved rejection stops before any API or deployment request', async () => {
  const result = await checkCooldown({ github: {}, owner: 'owner', repo: 'repo', now: observed + 1,
    record: { observedCommit: 'known-source', status: rejection } });
  assert.equal(result.blocked, true);
  assert.equal(result.checkedCommits, 0);
  assert.equal(result.observedCommit, 'known-source');
});

function mockGithub(statuses) {
  return { rest: { repos: {
    listCommits: async () => ({ data: [{ sha: 'recent-trigger' }] }),
    getCombinedStatusForRef: async ({ ref }) => ({ data: { sha: ref, statuses: statuses[ref] || [] } }),
  } } };
}

test('recent trigger rejection is detected behind an ordinary branch head', async () => {
  const result = await checkCooldown({ github: mockGithub({ 'recent-trigger': [rejection] }),
    owner: 'owner', repo: 'repo', record: null, now: observed + 1 });
  assert.equal(result.blocked, true);
  assert.equal(result.observedCommit, 'recent-trigger');
  assert.equal(result.checkedCommits, 3);
});

test('expired evidence allows a deliberate request after fresh read-only checks', async () => {
  const result = await checkCooldown({ github: mockGithub({ 'recent-trigger': [rejection] }),
    owner: 'owner', repo: 'repo', record: { status: rejection }, now: observed + 86400000 });
  assert.equal(result.blocked, false);
  assert.equal(result.checkedCommits, 3);
});

test('a failed status lookup cannot silently enable deployments', async () => {
  await assert.rejects(checkCooldown({ github: { rest: { repos: {
    listCommits: async () => { throw new Error('GitHub unavailable'); },
  } } }, owner: 'owner', repo: 'repo', record: null, now: observed }), /GitHub unavailable/);
});

test('cleanup preserves the newest rejection and ignores ordinary errors', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tatva-cooldown-'));
  const file = path.join(dir, 'cooldown.json');
  try {
    assert.equal(recordRejection({ statuses: [rejection] }, 'first', file, observed), true);
    assert.equal(recordRejection({ statuses: [{ ...rejection, created_at: new Date(observed - 1).toISOString() }] }, 'older', file, observed), false);
    assert.equal(recordRejection({ statuses: [{ ...rejection, description: 'Build failed' }] }, 'build', file, observed), false);
    assert.equal(readRecord(file).observedCommit, 'first');
    assert.equal(recordRejection({ statuses: [{ ...rejection, created_at: new Date(observed + 1).toISOString() }] }, 'newer', file, observed), true);
    assert.equal(readRecord(file).observedCommit, 'newer');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('working branches are disabled while main and deliberate preview remain possible', () => {
  const minimatch = createRequire(require.resolve('eslint/package.json'))('minimatch');
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../vercel.json'), 'utf8'));
  const rules = config.git.deploymentEnabled;
  const enabled = (branch, settings = rules) => {
    const matches = Object.entries(settings).filter(([pattern]) => minimatch(branch, pattern));
    return matches.length === 0 || matches.some(([, value]) => value);
  };
  for (const branch of ['august-8-isolated', 'seo/example', 'improve/mobile', 'homepage-cinematic-recovery']) assert.equal(enabled(branch), false);
  assert.equal(enabled('main'), true);
  assert.equal(enabled('august-8-isolated', { ...rules, 'august-8-isolated': true }), true);
});
