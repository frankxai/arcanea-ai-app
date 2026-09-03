#!/usr/bin/env node
// Fails when unresolved merge-conflict markers are present in tracked text files.
// Twelve files carrying committed markers reached main and sat there from
// 2026-02-24 (5f8b82d8) to 2026-09-03 without any gate noticing.

import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

// Assembled at runtime so this file never matches its own patterns. Plain
// string comparison rather than RegExp: the diff3 base marker is seven pipes,
// which as a pattern is an alternation of empty branches that matches everything.
const MARKERS = [
  { label: 'ours', prefix: '<'.repeat(7), exact: false },
  { label: 'base', prefix: '|'.repeat(7), exact: false },
  { label: 'separator', prefix: '='.repeat(7), exact: true },
  { label: 'theirs', prefix: '>'.repeat(7), exact: false },
];

function markerAt(line) {
  for (const marker of MARKERS) {
    if (!line.startsWith(marker.prefix)) continue;
    const rest = line.slice(marker.prefix.length);
    if (marker.exact ? rest === '' : rest === '' || rest.startsWith(' ')) return marker.label;
  }
  return null;
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function isBinary(path) {
  try {
    if (statSync(path).size === 0) return true;
  } catch {
    return true;
  }
  const head = readFileSync(path).subarray(0, 8000);
  return head.includes(0);
}

function scan(paths) {
  const hits = [];
  for (const path of paths) {
    if (isBinary(path)) continue;
    const lines = readFileSync(path, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      const label = markerAt(line);
      if (label) hits.push({ path, line: i + 1, label, text: line.slice(0, 120) });
    });
  }
  return hits;
}

function trackedFiles() {
  return git(['ls-files', '-z']).split('\0').filter(Boolean);
}

const args = process.argv.slice(2);
const all = args.includes('--all');
const explicit = args.filter((a) => !a.startsWith('--'));

// Fail closed: an empty invocation is a broken caller, not a clean tree.
if (!all && explicit.length === 0) {
  console.error('check-conflict-markers: no paths given and --all not set; refusing to report success.');
  process.exit(2);
}

const targets = all ? trackedFiles() : explicit;
const hits = scan(targets);

for (const hit of hits) {
  console.error(`::error file=${hit.path},line=${hit.line}::Merge conflict marker (${hit.label}) committed: ${hit.text}`);
}

if (hits.length > 0) {
  console.error(`\n${hits.length} conflict marker line(s) across ${new Set(hits.map((h) => h.path)).size} file(s).`);
  console.error('Resolve the merge properly and remove every marker before merging.');
  process.exit(1);
}

console.log(`No conflict markers in ${targets.length} file(s).`);
