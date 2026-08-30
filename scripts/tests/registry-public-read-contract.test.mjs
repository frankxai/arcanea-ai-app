import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(path, 'utf8');

const queries = read('apps/web/lib/registry/queries.ts');
const hero = read('apps/web/components/registry/RegistryHero.tsx');
const statsStrip = read('apps/web/components/registry/StatsStrip.tsx');

test('public registry loaders never query owner-scoped event tables', () => {
  assert.doesNotMatch(
    queries,
    /\.from\(['"](?:deployments|usage_events|attribution_events)['"]\)/,
  );
  assert.match(
    queries,
    /\.from\('marketplace_agents'\)[\s\S]*\.select\('usage_count'\)/,
  );
  assert.match(queries, /total_deployments:\s*null/);
  assert.match(queries, /total_deploys:\s*null/);
  assert.match(queries, /platforms_reached:\s*null/);
});

test('registry surfaces omit unavailable private aggregates', () => {
  assert.match(hero, /stats\.total_deployments !== null/);
  assert.match(statsStrip, /item\.value !== null/);
  assert.match(statsStrip, /visibleItems\.map/);
});
