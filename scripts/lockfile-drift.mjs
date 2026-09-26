#!/usr/bin/env node
// Lockfile drift guard: fail a PR only when a package.json changes its dependency graph
// and pnpm-lock.yaml did not change with it. Description, script or version edits pass;
// the workflow's frozen-lockfile install remains the authoritative check.
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEPENDENCY_FIELDS = [
  'dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies',
  'peerDependenciesMeta', 'dependenciesMeta', 'bundledDependencies', 'bundleDependencies',
  'overrides', 'resolutions', 'pnpm',
];

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

/** before/after are parsed package.json objects, or null when the file is added or deleted. */
export function needsLockfileChange(before, after) {
  // pnpm keeps one lockfile importer per workspace package, so adding or removing one always drifts.
  if (!before || !after) return true;
  return DEPENDENCY_FIELDS.some((field) => JSON.stringify(canonical(before[field])) !== JSON.stringify(canonical(after[field])));
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function manifestAt(ref, file) {
  try {
    return JSON.parse(git(['show', `${ref}:${file}`]));
  } catch {
    return null;
  }
}

function main([baseRef, headRef]) {
  if (!baseRef || !headRef) {
    console.error('Usage: node scripts/lockfile-drift.mjs <base-sha> <head-sha>');
    return 1;
  }
  // `**/package.json` without glob magic never matches the root manifest; `:(glob)` does.
  const manifests = git(['diff', '--name-only', baseRef, headRef, '--', ':(glob)**/package.json'])
    .split('\n').filter(Boolean).filter((file) => !file.includes('node_modules/'));
  const lockChanged = git(['diff', '--name-only', baseRef, headRef, '--', 'pnpm-lock.yaml']).trim() !== '';
  const drifting = manifests.filter((file) => needsLockfileChange(manifestAt(baseRef, file), manifestAt(headRef, file)));

  console.log(`package.json files changed: ${manifests.length}`);
  console.log(`dependency changes: ${drifting.length}${drifting.length ? ` (${drifting.join(', ')})` : ''}`);
  console.log(`pnpm-lock.yaml changed: ${lockChanged ? 1 : 0}`);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `pkg_changed=${manifests.length}\ndeps_changed=${drifting.length}\nlock_changed=${lockChanged ? 1 : 0}\n`);
  }

  if (drifting.length > 0 && !lockChanged) {
    console.log(`::error::Dependencies changed in ${drifting.join(', ')} but pnpm-lock.yaml did not. Run pnpm install and commit pnpm-lock.yaml.`);
    return 1;
  }
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
