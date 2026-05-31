import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { enrichWithGitHub, parseGitHubUrl } from '../../src/ecosystem/enrich-github.js';

describe('enrichWithGitHub', () => {
  it('returns lastCommitAt for a repo', async () => {
    const fakeClient = {
      repos: {
        getCommit: mock.fn(async () => ({ data: { commit: { author: { date: '2026-05-10T12:00:00Z' } } } })),
      },
    };
    const result = await enrichWithGitHub({ owner: 'frankxai', repo: 'arcanea-ai-app', branch: 'main' }, fakeClient as never);
    assert.equal(result.lastCommitAt, '2026-05-10T12:00:00Z');
  });

  it('returns null on 404', async () => {
    const fakeClient = {
      repos: {
        getCommit: mock.fn(async () => {
          const err = new Error('not found') as Error & { status: number };
          err.status = 404;
          throw err;
        }),
      },
    };
    const result = await enrichWithGitHub({ owner: 'frankxai', repo: 'missing', branch: 'main' }, fakeClient as never);
    assert.equal(result.lastCommitAt, null);
  });
});

describe('parseGitHubUrl', () => {
  it('parses standard URLs', () => {
    assert.deepEqual(parseGitHubUrl('https://github.com/frankxai/arcanea-ai-app'), { owner: 'frankxai', repo: 'arcanea-ai-app' });
  });
  it('strips .git suffix', () => {
    assert.deepEqual(parseGitHubUrl('https://github.com/frankxai/arcanea.git'), { owner: 'frankxai', repo: 'arcanea' });
  });
  it('returns null for non-github URLs', () => {
    assert.equal(parseGitHubUrl('https://gitlab.com/x/y'), null);
  });
});
