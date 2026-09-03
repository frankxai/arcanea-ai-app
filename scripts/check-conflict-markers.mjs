#!/usr/bin/env node
// Fails when unresolved merge-conflict markers are present in tracked text files.
// Twelve files carrying committed markers reached main in 5f8b82d8 (2026-02-24)
// and sat there for six months without any gate noticing.

import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync } from 'node:fs';

const SIZE = 7;

// Plain string scanning rather than RegExp: the diff3 base marker is seven
// pipes, which as a pattern is an alternation of empty branches matching every
// line. Assembling the needles at runtime also keeps this file from matching
// itself.
//
// `<`, `|` and `>` runs are matched at seven-or-more so a non-default
// conflict-marker-size is still caught. The `=======` separator is matched at
// exactly seven: a longer run of `=` is a Markdown setext heading underline,
// and this repo is mostly prose.
const MARKERS = [
  { label: 'ours', char: '<', widen: true },
  { label: 'base', char: '|', widen: true },
  { label: 'separator', char: '=', widen: false },
  { label: 'theirs', char: '>', widen: true },
];

function markerAt(line) {
  for (const { label, char, widen } of MARKERS) {
    const prefix = char.repeat(SIZE);
    if (!line.startsWith(prefix)) continue;
    let i = SIZE;
    if (widen) while (line[i] === char) i += 1;
    const rest = line.slice(i);
    if (label === 'separator') {
      if (rest === '') return label;
    } else if (rest === '' || rest.startsWith(' ')) {
      return label;
    }
  }
  return null;
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

// Submodule (gitlink) paths appear in a diff but are directories on disk, and
// symlinks must not be followed out of the workspace.
function isScannable(path) {
  let st;
  try {
    st = lstatSync(path);
  } catch {
    return false;
  }
  if (!st.isFile() || st.size === 0) return false;
  return !readFileSync(path).subarray(0, 8000).includes(0);
}

function scan(paths) {
  const hits = [];
  for (const path of paths) {
    if (!isScannable(path)) continue;
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .forEach((line, i) => {
        const label = markerAt(line);
        if (label) hits.push({ path, line: i + 1, label, text: line.slice(0, 120) });
      });
  }
  return hits;
}

// Options bind only before `--`; everything after it is a path, so a file
// literally named `--something.md` is still scanned. An unknown option is a
// broken caller, not a clean tree.
const argv = process.argv.slice(2);
const sep = argv.indexOf('--');
const optionArgs = sep === -1 ? argv.filter((a) => a.startsWith('--')) : argv.slice(0, sep);
const pathArgs = sep === -1 ? argv.filter((a) => !a.startsWith('--')) : argv.slice(sep + 1);

const unknown = optionArgs.filter((a) => a !== '--all');
if (unknown.length > 0) {
  console.error(`check-conflict-markers: unknown option(s): ${unknown.join(', ')}`);
  process.exit(2);
}
const all = optionArgs.includes('--all');

if (!all && pathArgs.length === 0) {
  console.error('check-conflict-markers: no paths given and --all not set; refusing to report success.');
  process.exit(2);
}

const targets = all ? git(['ls-files', '-z']).split('\0').filter(Boolean) : pathArgs;
const hits = scan(targets);

for (const hit of hits) {
  console.error(`::error file=${hit.path},line=${hit.line}::Merge conflict marker (${hit.label}) committed: ${hit.text}`);
}

if (hits.length > 0) {
  const files = new Set(hits.map((h) => h.path)).size;
  console.error(`\n${hits.length} conflict marker line(s) across ${files} file(s).`);
  console.error('Resolve the merge properly and remove every marker before merging.');
  process.exit(1);
}

console.log(`No conflict markers in ${targets.length} file(s).`);
