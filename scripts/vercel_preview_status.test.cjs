const { test } = require('node:test');
const assert = require('node:assert/strict');
const { describeStatus, preflight, waitForVercel } = require('./vercel_preview_status.cjs');

test('deployment policy closes nested feature branches and permits the one controlled trigger', () => {
  const { matchesGlob } = require('node:path');
  const policy = require('../vercel.json').git.deploymentEnabled;
  const enabled = branch => {
    const rules = Object.entries(policy).filter(([pattern]) => matchesGlob(branch, pattern));
    return rules.length ? rules.some(([, value]) => value) : true;
  };
  for (const branch of ['feature-copy', 'seo/buyer-guides', 'audit/retire-stale-automation-workflows', 'august-8-isolated']) {
    assert.equal(enabled(branch), false, branch);
  }
  assert.equal(enabled('main'), true);
  policy['august-8-isolated'] = true;
  assert.equal(enabled('august-8-isolated'), true);
  policy['august-8-isolated'] = false;
});

const rejectedAt = '2026-09-22T12:19:01Z';
const now = Date.parse('2026-09-22T13:00:00Z');
const limited = {
  context: 'Vercel', state: 'failure', created_at: rejectedAt,
  description: 'Deployment rate limited — retry in 24 hours.',
  target_url: 'https://vercel.com/suman22?upgradeToPro=build-rate-limit',
};
const trigger = release => ({ sha: `trigger-${release}`, commit: {
  message: `Request release ${release} through Git integration [deploy] [release:${release}]`,
} });
function harness(statuses, commits = [trigger(514)]) {
  const output = {}, failures = [], queries = [];
  let polls = 0;
  const summary = {};
  for (const method of ['addHeading', 'addRaw', 'addCodeBlock', 'addLink']) summary[method] = () => summary;
  summary.write = async () => {};
  const core = { summary, setOutput: (key, value) => { output[key] = value; },
    setFailed: message => failures.push(message), info() {}, notice() {} };
  const github = { rest: { repos: {
    listCommits: async args => { queries.push(args); return { data: commits }; },
    getCombinedStatusForRef: async args => {
      queries.push(args);
      return { data: { statuses: statuses[Math.min(polls++, statuses.length - 1)] } };
    },
  } } };
  return { github, core, context: { repo: { owner: 'owner', repo: 'repo' } },
    branch: 'august-8-isolated', release: '515', now, output, failures, queries };
}

test('provider retry message establishes a stable cooldown without extending it on inspection', () => {
  const a = describeStatus(limited, now);
  const b = describeStatus(limited, now + 60000);
  assert.equal(a.retryAt, '2026-09-23T12:19:01.000Z');
  assert.equal(b.retryAt, a.retryAt);
  assert.equal(a.coolingDown, true);
  assert.equal(describeStatus(limited, Date.parse(a.retryAt)).coolingDown, false);
});

test('minute retry messages and missing timestamp are handled conservatively', () => {
  assert.equal(describeStatus({ ...limited, description: 'Rate limited. Retry after 30 minutes.' }, now).retryAt, '2026-09-22T12:49:01.000Z');
  assert.equal(describeStatus({ ...limited, created_at: undefined }, now).coolingDown, true);
});

test('ordinary compilation failures do not impose a quota cooldown', () => {
  const result = describeStatus({ ...limited, description: 'Build failed.', target_url: 'https://vercel.com/project/deployment' }, now);
  assert.equal(result.rateLimited, false);
  assert.equal(result.coolingDown, false);
});

test('active provider cooldown blocks before a new trigger and retains the exact reason', async () => {
  const h = harness([[limited]]);
  await preflight(h);
  assert.equal(h.output.vercel_state, 'failure');
  assert.equal(h.output.description, limited.description);
  assert.equal(h.output.retry_at, '2026-09-23T12:19:01.000Z');
  assert.match(h.failures[0], /Retry check after/);
  assert.equal(h.output.reuse_sha, undefined);
  assert.equal(h.queries[0].sha, 'august-8-isolated');
});

test('expired provider cooldown permits a fresh request', async () => {
  const h = harness([[limited]]);
  await preflight({ ...h, now: Date.parse('2026-09-23T12:19:02Z') });
  assert.deepEqual(h.failures, []);
  assert.deepEqual(h.output, {});
});

test('rerunning a successful release reuses its trigger instead of deploying twice', async () => {
  const h = harness([[{ context: 'Vercel', state: 'success', description: 'Ready', target_url: 'https://vercel.com/project/deployment' }]]);
  await preflight({ ...h, release: '514' });
  assert.equal(h.output.reuse_sha, 'trigger-514');
  assert.equal(h.output.vercel_state, 'success');
  assert.deepEqual(h.failures, []);
});

test('a different release cannot reuse a previous successful build', async () => {
  const h = harness([[{ context: 'Vercel', state: 'success' }]]);
  await preflight(h);
  assert.equal(h.output.reuse_sha, undefined);
  assert.deepEqual(h.failures, []);
});

test('pending or absent Vercel status blocks duplicate requests', async () => {
  for (const statuses of [[{ context: 'Vercel', state: 'pending' }], []]) {
    const h = harness([statuses]);
    await preflight(h);
    assert.equal(h.output.vercel_state, 'error');
    assert.equal(h.failures.length, 1);
  }
});

test('ordinary source markers are ignored when resolving the deployment trigger', async () => {
  const h = harness([[limited]], [{ sha: 'source', commit: { message: 'Improve Services [deploy] [release:515]' } }, trigger(514)]);
  await preflight(h);
  assert.equal(h.queries[1].ref, 'trigger-514');
});

test('status polling waits for this exact trigger and preserves a rate rejection', async () => {
  const h = harness([[], [{ context: 'Vercel', state: 'pending' }], [limited]]);
  const pauses = [];
  const evidence = [];
  await waitForVercel({ ...h, trigger: 'exact-sha', source: 'source-sha', onStatus: data => evidence.push(data), sleep: async ms => pauses.push(ms), attempts: 3 });
  assert.deepEqual(pauses, [6000, 6000]);
  assert.ok(h.queries.every(query => query.ref === 'exact-sha'));
  assert.deepEqual(h.failures, [limited.description]);
  assert.equal(h.output.description, limited.description);
  assert.deepEqual(evidence.at(-1), { statuses: [limited] }, 'final cleanup receives the real rejection for the shared ledger');
});

test('successful and timed out polls report truthful outcomes', async () => {
  const success = harness([[{ context: 'Vercel', state: 'success' }]]);
  await waitForVercel({ ...success, trigger: 'ready-sha', source: 'source-sha' });
  assert.equal(success.output.vercel_state, 'success');
  assert.deepEqual(success.failures, []);
  const timeout = harness([[]]);
  await waitForVercel({ ...timeout, trigger: 'waiting-sha', source: 'source-sha', attempts: 1 });
  assert.equal(timeout.output.vercel_state, undefined);
  assert.match(timeout.failures[0], /did not finish/);
});

test('GitHub lookup errors fail closed instead of assuming quota is available', async () => {
  const h = harness([[]]);
  h.github.rest.repos.getCombinedStatusForRef = async () => { throw new Error('API unavailable'); };
  await assert.rejects(preflight(h), /API unavailable/);
  assert.deepEqual(h.output, {});
});
