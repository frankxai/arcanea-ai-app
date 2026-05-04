#!/usr/bin/env node
// Smoke tests for @arcanea/voice workflow recipes.
// No test framework dep — uses node:assert. Run: `node test/workflows.test.mjs`.

import assert from 'node:assert/strict';
import { existsSync, readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

import { runWorkflow, listWorkflows, getProjectMap, resolveProjectPath } from '../src/workflows.mjs';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const suite = [];
const test = (name, fn) => suite.push({ name, fn });

// ---------------------------------------------------------------------------
// Registry integrity
// ---------------------------------------------------------------------------

test('listWorkflows returns at least 6 recipes with name/mutates/doc', () => {
  const list = listWorkflows();
  assert.ok(list.length >= 6, `expected >=6 workflows, got ${list.length}`);
  for (const wf of list) {
    assert.equal(typeof wf.name, 'string');
    assert.equal(typeof wf.mutates, 'boolean');
    assert.equal(typeof wf.doc, 'string');
    assert.ok(wf.doc.length > 10, `${wf.name} has trivial doc`);
  }
});

test('listWorkflows includes the canonical 6 recipes', () => {
  const names = listWorkflows().map((w) => w.name);
  for (const expected of [
    'project_status',
    'morning_brief',
    'demo_prep',
    'capture_thought',
    'build_handoff',
    'ship_it_preview',
  ]) {
    assert.ok(names.includes(expected), `missing workflow ${expected}`);
  }
});

test('only capture_thought is marked mutating', () => {
  const list = listWorkflows();
  const mutating = list.filter((w) => w.mutates).map((w) => w.name);
  assert.deepEqual(mutating, ['capture_thought'],
    `unexpected mutating workflows: ${mutating.join(',')}`);
});

// ---------------------------------------------------------------------------
// Unknown workflow handling
// ---------------------------------------------------------------------------

test('runWorkflow rejects unknown name with error', async () => {
  const r = await runWorkflow('definitely_not_a_workflow', {});
  assert.ok(r.error && /unknown workflow/.test(r.error), `expected error, got ${JSON.stringify(r)}`);
});

test('runWorkflow without args still works for nullary recipes', async () => {
  // demo_prep takes no args; should not throw
  const r = await runWorkflow('demo_prep');
  assert.equal(typeof r.workflow, 'string');
  assert.equal(r.workflow, 'demo_prep');
});

// ---------------------------------------------------------------------------
// project_status — read-only git introspection
// ---------------------------------------------------------------------------

test('project_status returns expected shape for current cwd', async () => {
  const r = await runWorkflow('project_status', {});
  assert.equal(r.workflow, 'project_status');
  assert.equal(typeof r.project, 'string');
  assert.equal(typeof r.branch, 'string');
  assert.equal(typeof r.changed_files, 'string');
  assert.equal(typeof r.recent_commits, 'string');
  assert.equal(typeof r.open_prs, 'string');
});

test('project_status resolves named projects via map', async () => {
  // 'arcanea' should resolve to a real path that is the arcanea repo root
  const r = await runWorkflow('project_status', { project: 'arcanea' });
  assert.equal(r.workflow, 'project_status');
  // The path should at least include 'Arcanea' segment
  assert.ok(/Arcanea/i.test(r.project), `expected Arcanea path, got ${r.project}`);
});

// ---------------------------------------------------------------------------
// morning_brief — multi-repo + WIP awareness
// ---------------------------------------------------------------------------

test('morning_brief returns repos array with branch/last_commit/wip fields', async () => {
  const r = await runWorkflow('morning_brief');
  assert.equal(r.workflow, 'morning_brief');
  assert.ok(Array.isArray(r.repos), 'repos should be array');
  assert.ok(r.repos.length >= 1, `expected at least 1 repo, got ${r.repos.length}`);
  for (const repo of r.repos) {
    assert.equal(typeof repo.repo, 'string');
    assert.equal(typeof repo.branch, 'string');
    assert.equal(typeof repo.last_commit, 'string');
    assert.equal(typeof repo.commits_24h, 'string');
    assert.equal(typeof repo.commits_7d, 'string');
    assert.equal(typeof repo.wip_changes, 'string');
    assert.equal(typeof repo.wip_modified_files, 'number');
    assert.equal(typeof repo.wip_untracked_files, 'number');
  }
  assert.equal(typeof r.captures_today, 'string');
});

// ---------------------------------------------------------------------------
// demo_prep — port probes via Node fetch
// ---------------------------------------------------------------------------

test('demo_prep returns port status fields for orb / dashboard / voice-operator', async () => {
  const r = await runWorkflow('demo_prep');
  assert.equal(r.workflow, 'demo_prep');
  assert.ok(['live', 'down'].includes(r.orb_7777), `unexpected orb status: ${r.orb_7777}`);
  assert.ok(['live', 'down'].includes(r.dashboard_3007), `unexpected dashboard status: ${r.dashboard_3007}`);
  assert.ok(['live', 'down'].includes(r.voice_operator_7373), `unexpected ops status: ${r.voice_operator_7373}`);
  assert.equal(typeof r.ready, 'boolean');
});

// ---------------------------------------------------------------------------
// capture_thought — appends to a session file in a temp location
// ---------------------------------------------------------------------------

test('capture_thought rejects empty text', async () => {
  const r = await runWorkflow('capture_thought', { text: '   ' });
  assert.ok(r.error && /text/.test(r.error), `expected text-required error, got ${JSON.stringify(r)}`);
});

test('capture_thought writes to memory/voice-sessions/<today>.md', async () => {
  const text = `test capture ${Date.now()}`;
  const r = await runWorkflow('capture_thought', { text });
  if (r.error) {
    // If starlight repo isn't accessible (e.g. clean test env), skip without failing.
    console.log(DIM + `   skipped: ${r.error}` + RESET);
    return;
  }
  assert.equal(r.workflow, 'capture_thought');
  assert.equal(typeof r.file, 'string');
  assert.ok(existsSync(r.file), `expected file to exist: ${r.file}`);
  const content = readFileSync(r.file, 'utf-8');
  assert.ok(content.includes(text), `file should contain captured text`);
});

// ---------------------------------------------------------------------------
// build_handoff — bundles git context + user task
// ---------------------------------------------------------------------------

test('build_handoff returns bundled_prompt with git context', async () => {
  const r = await runWorkflow('build_handoff', { task: 'add a feature flag for X' });
  assert.equal(r.workflow, 'build_handoff');
  assert.equal(typeof r.bundled_prompt, 'string');
  assert.ok(r.bundled_prompt.length > 50);
  assert.ok(r.bundled_prompt.includes('add a feature flag for X'),
    'bundled_prompt should embed the task verbatim');
  assert.ok(/branch/i.test(r.bundled_prompt), 'should mention branch');
});

test('build_handoff rejects empty task', async () => {
  const r = await runWorkflow('build_handoff', {});
  assert.ok(r.error && /task/.test(r.error), `expected task-required error, got ${JSON.stringify(r)}`);
});

// ---------------------------------------------------------------------------
// ship_it_preview — read-only diff preview
// ---------------------------------------------------------------------------

test('ship_it_preview returns would_commit + diffstat shape', async () => {
  const r = await runWorkflow('ship_it_preview');
  assert.equal(r.workflow, 'ship_it_preview');
  assert.equal(typeof r.would_commit, 'string');
  assert.equal(typeof r.diffstat, 'string');
  assert.equal(typeof r.branch, 'string');
});

// ---------------------------------------------------------------------------
// meeting_prep — topic-relevant gathering
// ---------------------------------------------------------------------------

test('meeting_prep rejects empty topic', async () => {
  const r = await runWorkflow('meeting_prep', {});
  assert.ok(r.error && /topic/.test(r.error), `expected topic-required error, got ${JSON.stringify(r)}`);
});

test('meeting_prep returns shape for any topic', async () => {
  const r = await runWorkflow('meeting_prep', { topic: 'cockpit' });
  assert.equal(r.workflow, 'meeting_prep');
  assert.equal(typeof r.topic, 'string');
  assert.ok(Array.isArray(r.matching_commits));
  assert.ok(Array.isArray(r.matching_captures));
  assert.ok(Array.isArray(r.matching_drafts));
  assert.equal(typeof r.summary, 'string');
});

// ---------------------------------------------------------------------------
// recent_drafts — listing
// ---------------------------------------------------------------------------

test('recent_drafts returns drafts array (possibly empty)', async () => {
  const r = await runWorkflow('recent_drafts', { limit: '5' });
  assert.equal(r.workflow, 'recent_drafts');
  assert.equal(typeof r.folder, 'string');
  assert.ok(Array.isArray(r.drafts));
  assert.equal(typeof r.count, 'number');
});

// ---------------------------------------------------------------------------
// port_health — service spine check
// ---------------------------------------------------------------------------

test('port_health returns services array with name/port/status', async () => {
  const r = await runWorkflow('port_health');
  assert.equal(r.workflow, 'port_health');
  assert.ok(Array.isArray(r.services));
  assert.equal(r.services.length, 3);
  for (const s of r.services) {
    assert.equal(typeof s.name, 'string');
    assert.equal(typeof s.port, 'number');
    assert.equal(typeof s.status, 'string');
  }
  assert.equal(typeof r.all_live, 'boolean');
});

// ---------------------------------------------------------------------------
// Project map integrity
// ---------------------------------------------------------------------------

test('getProjectMap returns lowercase keys', () => {
  const m = getProjectMap();
  for (const k of Object.keys(m)) {
    assert.equal(k, k.toLowerCase(), `project key not lowercased: ${k}`);
  }
});

test('getProjectMap contains the canonical defaults', () => {
  const m = getProjectMap();
  for (const k of ['starlight', 'arcanea', 'orb', 'cockpit']) {
    assert.ok(m[k], `missing default project: ${k}`);
  }
});

test('resolveProjectPath returns null for unknown name', () => {
  const r = resolveProjectPath('xyzzy_definitely_not_a_project');
  assert.equal(r, null);
});

test('resolveProjectPath is case-insensitive', () => {
  const a = resolveProjectPath('STARLIGHT');
  const b = resolveProjectPath('starlight');
  assert.equal(a, b);
});

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;
const start = Date.now();

for (const { name, fn } of suite) {
  try {
    await fn();
    console.log(`${GREEN}✓${RESET} ${name}`);
    passed++;
  } catch (e) {
    console.log(`${RED}✗${RESET} ${name}`);
    console.log(`${DIM}   ${e.message || e}${RESET}`);
    failed++;
  }
}

const ms = Date.now() - start;
const summary = `\n${passed} passed, ${failed} failed in ${ms}ms`;
console.log(failed === 0 ? `${GREEN}${summary}${RESET}` : `${RED}${summary}${RESET}`);
process.exit(failed === 0 ? 0 : 1);
