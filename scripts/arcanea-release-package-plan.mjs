#!/usr/bin/env node
/**
 * Arcanea release package planner.
 *
 * This script is intentionally non-mutating: it does not stage, commit, push,
 * deploy, or change Vercel settings. It turns the God Mode release scope
 * manifest plus the current dirty tree into an auditable staging plan.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const jsonOnly = args.has('--json');
const write = args.has('--write');
const strict = args.has('--strict');

const REPORT_ID = 'arcanea-god-mode-release-package-plan-2026-07-05';
const REPORT_BASENAME = 'ARCANEA_GOD_MODE_RELEASE_PACKAGE_PLAN_2026-07-05';
const PLANNING_JSON_PATH = `planning-with-files/${REPORT_BASENAME}.json`;
const PLANNING_MD_PATH = `planning-with-files/${REPORT_BASENAME}.md`;
const VISUAL_JSON_PATH = '.visual-qa/arcanea-god-mode-2026-07-05/release-package-plan.json';
const QUEEN_REPORT_PATH = path.resolve(
  PROJECT_ROOT,
  '..',
  '..',
  'queen',
  'reports',
  `${REPORT_ID}.md`,
);

function absolute(relativePath) {
  return path.join(PROJECT_ROOT, relativePath);
}

function relative(target) {
  return path.relative(PROJECT_ROOT, target).replace(/\\/g, '/');
}

function normalizeRepoPath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//u, '')
    .replace(/\/{2,}/gu, '/');
}

function readText(relativePath) {
  return fs.readFileSync(absolute(relativePath), 'utf8');
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    return { __readError: error.message };
  }
}

function latestFile(dirRelative, pattern) {
  const dir = absolute(dirRelative);
  if (!fs.existsSync(dir)) return null;

  const matches = fs.readdirSync(dir)
    .filter((name) => pattern.test(name))
    .map((name) => {
      const full = path.join(dir, name);
      return { name, full, mtime: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  return matches[0] ? relative(matches[0].full) : null;
}

function pathCovered(file, scopePaths) {
  const normalizedFile = normalizeRepoPath(file);
  return scopePaths.some((entry) => {
    const normalizedEntry = normalizeRepoPath(entry);
    if (normalizedEntry.endsWith('/')) {
      return normalizedFile === normalizedEntry.slice(0, -1) || normalizedFile.startsWith(normalizedEntry);
    }

    return normalizedFile === normalizedEntry;
  });
}

function gitStatusLines() {
  try {
    const output = execFileSync('git', ['status', '--short'], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 15000,
    }).replace(/\s+$/u, '');

    return output ? output.split(/\r?\n/u).map((line) => line.trimEnd()) : [];
  } catch (error) {
    return [`!! git status unavailable: ${error.message}`];
  }
}

function gitHead() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 15000,
    }).trim();
  } catch {
    return null;
  }
}

function unquoteGitPath(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed.startsWith('"') || !trimmed.endsWith('"')) return trimmed;

  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed.slice(1, -1);
  }
}

function parseGitStatusLine(line) {
  const rawStatus = line.slice(0, 2);
  let file = line.slice(3);
  if (file.includes(' -> ')) {
    file = file.split(' -> ').pop();
  }

  return {
    raw: line,
    status: rawStatus.trim() || '??',
    file: normalizeRepoPath(unquoteGitPath(file)),
  };
}

function classifyDirty(lines, releaseScope) {
  const includedPaths = Array.isArray(releaseScope?.includedPaths) ? releaseScope.includedPaths : [];
  const excludedDirtyPaths = Array.isArray(releaseScope?.excludedDirtyPaths) ? releaseScope.excludedDirtyPaths : [];

  const entries = lines.map(parseGitStatusLine).map((entry) => {
    const included = pathCovered(entry.file, includedPaths);
    const excluded = pathCovered(entry.file, excludedDirtyPaths);
    return {
      ...entry,
      included,
      excluded,
      classification: included ? 'included' : excluded ? 'excluded' : 'unknown',
    };
  });

  return {
    count: entries.length,
    included: entries.filter((entry) => entry.included).map((entry) => entry.file),
    excluded: entries.filter((entry) => entry.excluded).map((entry) => entry.file),
    unknown: entries.filter((entry) => !entry.included && !entry.excluded).map((entry) => entry.file),
    entries,
  };
}

function pathIsInside(candidate, parent) {
  const normalizedCandidate = normalizeRepoPath(candidate);
  const normalizedParent = normalizeRepoPath(parent);
  if (normalizedParent.endsWith('/')) {
    return normalizedCandidate === normalizedParent.slice(0, -1) || normalizedCandidate.startsWith(normalizedParent);
  }
  return normalizedCandidate === normalizedParent;
}

function minimalStagePaths(includedPaths, dirtyIncludedFiles) {
  const selected = [];

  for (const entry of includedPaths.map(normalizeRepoPath)) {
    if (!dirtyIncludedFiles.some((file) => pathCovered(file, [entry]))) continue;
    if (selected.some((parent) => pathIsInside(entry, parent))) continue;
    selected.push(entry);
  }

  return selected;
}

function quotePath(value) {
  return `'${String(value).replace(/'/gu, "''")}'`;
}

function chunk(values, size) {
  const chunks = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function buildCommands(stagePaths) {
  return {
    preflight: [
      'node scripts/arcanea-release-package-plan.mjs --strict',
      'node scripts/arcanea-release-readiness.mjs --strict',
    ],
    stage: chunk(stagePaths, 10).map((paths) => `git add -- ${paths.map(quotePath).join(' ')}`),
    verifyAfterStage: [
      'git diff --cached --name-only',
      'git status --short',
      'corepack pnpm --dir apps/web type-check',
      'corepack pnpm --dir apps/web test:projects',
      'corepack pnpm --dir apps/web build',
      'node scripts/arcanea-success-metrics-audit.mjs --strict',
      'node scripts/arcanea-durable-workflow-readiness.mjs --strict',
      'node scripts/arcanea-release-readiness.mjs --strict',
    ],
    draftPrOnly: [
      'gh pr create --draft',
    ],
  };
}

function check(status, lane, id, summary, details = {}) {
  return { status, lane, id, summary, ...details };
}

function buildReport() {
  const releaseScopePath = latestFile('planning-with-files', /^ARCANEA_GOD_MODE_RELEASE_SCOPE_.*\.json$/u);
  const releaseScope = releaseScopePath ? readJson(releaseScopePath) : { __readError: 'No release scope manifest found.' };
  const currentReleaseReadinessPath = '.visual-qa/arcanea-god-mode-2026-07-05/release-readiness-report.json';
  const releaseReadiness = fs.existsSync(absolute(currentReleaseReadinessPath))
    ? readJson(currentReleaseReadinessPath)
    : null;
  const lines = gitStatusLines();
  const dirty = classifyDirty(lines, releaseScope);
  const includedPaths = Array.isArray(releaseScope?.includedPaths) ? releaseScope.includedPaths.map(normalizeRepoPath) : [];
  const safeStagePaths = minimalStagePaths(includedPaths, dirty.included);
  const excludedCoveredByStage = dirty.excluded.filter((file) => pathCovered(file, safeStagePaths));
  const includedMissingFromStage = dirty.included.filter((file) => !pathCovered(file, safeStagePaths));
  const checks = [];

  if (releaseScopePath && !releaseScope.__readError) {
    checks.push(check('pass', 'safety', 'release-scope-loaded', 'Release scope manifest loaded.', {
      evidence: releaseScopePath,
      includedScopeCount: includedPaths.length,
      excludedScopeCount: Array.isArray(releaseScope.excludedDirtyPaths) ? releaseScope.excludedDirtyPaths.length : 0,
    }));
  } else {
    checks.push(check('blocker', 'safety', 'release-scope-loaded', 'Release scope manifest is missing or unreadable.', {
      error: releaseScope.__readError || null,
      action: 'Create or repair planning-with-files/ARCANEA_GOD_MODE_RELEASE_SCOPE_*.json before packaging.',
    }));
  }

  if (dirty.unknown.length === 0) {
    checks.push(check('pass', 'safety', 'unknown-dirty-paths', 'No dirty paths are outside the release scope classification.'));
  } else {
    checks.push(check('blocker', 'safety', 'unknown-dirty-paths', `${dirty.unknown.length} dirty paths are outside the release scope classification.`, {
      unknown: dirty.unknown,
      action: 'Classify these paths as included or excluded before staging, preview, or deploy.',
    }));
  }

  if (excludedCoveredByStage.length === 0) {
    checks.push(check('pass', 'safety', 'excluded-paths-preserved', 'The staging plan does not cover excluded dirty paths.'));
  } else {
    checks.push(check('blocker', 'safety', 'excluded-paths-preserved', 'The staging plan would include excluded dirty paths.', {
      excludedCoveredByStage,
      action: 'Narrow included paths before running git add.',
    }));
  }

  if (includedMissingFromStage.length === 0) {
    checks.push(check('pass', 'safety', 'included-paths-covered', 'Every included dirty path is covered by a planned git add target.'));
  } else {
    checks.push(check('blocker', 'safety', 'included-paths-covered', `${includedMissingFromStage.length} included dirty paths are missing from the staging targets.`, {
      includedMissingFromStage,
    }));
  }

  if (dirty.excluded.length === 0) {
    checks.push(check('pass', 'safety', 'excluded-dirty-work', 'No excluded dirty paths are present.'));
  } else {
    checks.push(check('warn', 'safety', 'excluded-dirty-work', `${dirty.excluded.length} excluded dirty paths remain and must stay out of the God Mode PR.`, {
      excluded: dirty.excluded,
    }));
  }

  if (safeStagePaths.length > 0) {
    checks.push(check('pass', 'release', 'stage-command-ready', `${safeStagePaths.length} scoped git add targets are ready for a release operator.`));
  } else {
    checks.push(check('warn', 'release', 'stage-command-ready', 'No scoped git add targets are currently needed.'));
  }

  if (releaseReadiness && !releaseReadiness.__readError) {
    const status = releaseReadiness.summary?.blockers > 0 ? 'warn' : 'pass';
    checks.push(check(status, 'vercel-release', 'release-readiness-context', `Latest release-readiness report decision is ${releaseReadiness.decision}.`, {
      evidence: currentReleaseReadinessPath,
      pass: releaseReadiness.summary?.pass ?? null,
      warn: releaseReadiness.summary?.warn ?? null,
      blockers: releaseReadiness.summary?.blockers ?? null,
      action: releaseReadiness.summary?.blockers > 0
        ? 'Treat packaging as PR/preview preparation only. Do not promote production until release blockers are resolved.'
        : 'Use the strict release gate after staging before preview or production.',
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'release-readiness-context', 'No current release-readiness report was found.', {
      action: 'Run node scripts/arcanea-release-readiness.mjs --json > .visual-qa/arcanea-god-mode-2026-07-05/release-readiness-report.json.',
    }));
  }

  const blockerCount = checks.filter((entry) => entry.status === 'blocker').length;
  const warnCount = checks.filter((entry) => entry.status === 'warn').length;
  const passCount = checks.filter((entry) => entry.status === 'pass').length;
  const commands = buildCommands(safeStagePaths);

  return {
    version: '1.0.0',
    id: REPORT_ID,
    generatedAt: new Date().toISOString(),
    repo: PROJECT_ROOT,
    currentGitHead: gitHead(),
    decision: blockerCount === 0 ? 'stage-plan-ready' : 'classify-before-release',
    nonMutating: true,
    summary: {
      pass: passCount,
      warn: warnCount,
      blockers: blockerCount,
      dirtyCount: dirty.count,
      includedDirtyCount: dirty.included.length,
      excludedDirtyCount: dirty.excluded.length,
      unknownDirtyCount: dirty.unknown.length,
      stageTargetCount: safeStagePaths.length,
      readyForStaging: blockerCount === 0,
      readyForPreview: false,
      readyForProduction: false,
    },
    inputs: {
      releaseScope: releaseScopePath,
      releaseReadinessReport: fs.existsSync(absolute(currentReleaseReadinessPath)) ? currentReleaseReadinessPath : null,
    },
    dirty,
    safeStagePaths,
    excludedCoveredByStage,
    includedMissingFromStage,
    commands,
    stopConditions: [
      'Do not run any staging command if unknownDirtyCount is greater than 0.',
      'Do not stage excludedDirtyPaths unless Frank explicitly expands the release scope.',
      'Do not push or open a ready PR until local app gates pass after staging.',
      'Do not create or promote a production deployment until Vercel framework, Node runtime, domain, and live-state blockers are resolved.',
      'Do not add Workflow or Eve runtime code in this package without installed dependencies and bundled docs.',
    ],
    checks,
  };
}

function formatMarkdown(report) {
  const lines = [];
  lines.push('# Arcanea God Mode Release Package Plan');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Decision: ${report.decision}`);
  lines.push(`Repo: \`${report.repo}\``);
  lines.push(`Current HEAD: \`${report.currentGitHead || 'unknown'}\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Dirty paths: ${report.summary.dirtyCount}`);
  lines.push(`- Included God Mode paths: ${report.summary.includedDirtyCount}`);
  lines.push(`- Excluded dirty paths: ${report.summary.excludedDirtyCount}`);
  lines.push(`- Unknown dirty paths: ${report.summary.unknownDirtyCount}`);
  lines.push(`- Planned git add targets: ${report.summary.stageTargetCount}`);
  lines.push(`- Planner checks: ${report.summary.pass} pass, ${report.summary.warn} warn, ${report.summary.blockers} blockers`);
  lines.push('- Preview/production: still blocked until the release-readiness gate and Vercel project/domain drift are resolved.');
  lines.push('');
  lines.push('## Stage Commands');
  lines.push('');
  lines.push('These commands are generated for a release operator. This script did not run them.');
  lines.push('');
  lines.push('```text');
  if (report.commands.stage.length > 0) {
    lines.push(...report.commands.stage);
  } else {
    lines.push('# No scoped staging targets are currently needed.');
  }
  lines.push('```');
  lines.push('');
  lines.push('## Excluded Dirty Paths');
  lines.push('');
  if (report.dirty.excluded.length > 0) {
    for (const file of report.dirty.excluded) {
      lines.push(`- \`${file}\``);
    }
  } else {
    lines.push('- None');
  }
  lines.push('');
  lines.push('## Unknown Dirty Paths');
  lines.push('');
  if (report.dirty.unknown.length > 0) {
    for (const file of report.dirty.unknown) {
      lines.push(`- \`${file}\``);
    }
  } else {
    lines.push('- None');
  }
  lines.push('');
  lines.push('## Checks');
  lines.push('');
  for (const entry of report.checks) {
    lines.push(`- ${entry.status.toUpperCase()} [${entry.lane}/${entry.id}] ${entry.summary}`);
  }
  lines.push('');
  lines.push('## Stop Conditions');
  lines.push('');
  for (const condition of report.stopConditions) {
    lines.push(`- ${condition}`);
  }
  lines.push('');
  lines.push('## After Staging');
  lines.push('');
  lines.push('```text');
  lines.push(...report.commands.verifyAfterStage);
  lines.push('```');
  lines.push('');
  lines.push('## Queen Handoff');
  lines.push('');
  lines.push('- Lane: Vercel/Product Engineer.');
  lines.push('- Objective: create one draft PR from the scoped God Mode slice, then verify exactly one preview after Vercel project settings are repaired or a preview-only exception is approved.');
  lines.push('- Risk gate: excluded package/lock/campaign files remain dirty and must stay out of this release unless Frank expands scope.');
  lines.push('- Handoff format: attach this plan, the release-readiness report, and the Vercel remediation packet.');
  return `${lines.join('\n').replace(/\n+$/u, '')}\n`;
}

function writeFile(relativePath, content) {
  const target = absolute(relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function writeAbsoluteFile(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

const report = buildReport();
const markdown = formatMarkdown(report);

if (write) {
  const json = `${JSON.stringify(report, null, 2)}\n`;
  writeFile(PLANNING_JSON_PATH, json);
  writeFile(PLANNING_MD_PATH, markdown);
  writeFile(VISUAL_JSON_PATH, json);
  writeAbsoluteFile(QUEEN_REPORT_PATH, markdown);
}

if (jsonOnly) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  process.stdout.write(markdown);
  if (write) {
    process.stdout.write(`\nWrote ${PLANNING_JSON_PATH}\n`);
    process.stdout.write(`Wrote ${PLANNING_MD_PATH}\n`);
    process.stdout.write(`Wrote ${VISUAL_JSON_PATH}\n`);
    process.stdout.write(`Wrote ${QUEEN_REPORT_PATH}\n`);
  }
}

if (strict && report.summary.blockers > 0) {
  process.exitCode = 1;
}
