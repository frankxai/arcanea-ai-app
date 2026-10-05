'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const checker = path.join(__dirname, '..', 'craft-check.cjs');
const fixtures = path.join(__dirname, '..', 'fixtures', 'craft');

test('the committed craft check scores both fixtures', () => {
  for (const name of ['slop.html', 'craft.html', 'button.tsx', 'slop-page.tsx']) {
    const file = path.join(fixtures, name);
    const want = fs.readFileSync(file, 'utf8').match(/craft-expect:\s*(\S+)/)[1];
    const run = spawnSync(process.execPath, [checker, file], { encoding: 'utf8' });
    process.stdout.write(`${name} verdict=${String(run.stdout || '').trim()} exit=${run.status}\n`);
    assert.equal(String(run.stdout || '').trim(), want);
    assert.equal(run.status, require('../craft-check.cjs').EXIT_STATUS[want]);
  }
});

test('disposition applies CI, merge gate and review before any salvage label', () => {
  const { decideDisposition } = require(checker);
  const ok = { ci: 'pass', mergeGate: 'pass', reviewProvider: 'grok', author: 'claude' };
  assert.equal(decideDisposition({ ...ok }), 'merged');
  assert.equal(decideDisposition({ ...ok, craftFlags: ['slop'], salvageable: true }), 'cherry-pick-follow-up');
  assert.equal(decideDisposition({ ...ok, craftFlags: ['slop'], salvageable: false }), 'rejected');
  assert.equal(decideDisposition({ ...ok, ci: 'fail', craftFlags: ['slop'], salvageable: true }), 'rejected');
  assert.equal(decideDisposition({ ...ok, mergeGate: 'fail', craftFlags: ['slop'], salvageable: true }), 'rejected');
  assert.equal(decideDisposition({ ...ok, reviewProvider: 'claude', craftFlags: ['slop'], salvageable: true }), 'rejected');
  assert.equal(decideDisposition({ ...ok, dependabotMajor: true, craftFlags: ['slop'], salvageable: true }), 'rejected');
  assert.equal(decideDisposition({ ...ok, hold: true }), 'held');
  assert.equal(decideDisposition({ ...ok, draft: true }), 'left-draft');
});
