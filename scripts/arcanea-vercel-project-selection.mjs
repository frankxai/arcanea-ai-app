#!/usr/bin/env node
/**
 * Arcanea Vercel project selection audit.
 *
 * This is intentionally non-mutating. It turns the observed Vercel estate
 * state into an operator-safe release-target recommendation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));

const OUTPUT_BASENAME = 'ARCANEA_VERCEL_PROJECT_SELECTION_2026-07-05';
const JSON_OUTPUT = path.join(PROJECT_ROOT, 'planning-with-files', `${OUTPUT_BASENAME}.json`);
const MD_OUTPUT = path.join(PROJECT_ROOT, 'planning-with-files', `${OUTPUT_BASENAME}.md`);

function absolute(relativePath) {
  return path.join(PROJECT_ROOT, relativePath);
}

function fileExists(relativePath) {
  try {
    return fs.statSync(absolute(relativePath)).isFile();
  } catch {
    return false;
  }
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

  return matches[0] ? path.relative(PROJECT_ROOT, matches[0].full).replace(/\\/g, '/') : null;
}

function commandUsesPnpm(value) {
  const command = String(value || '');
  const hasStandaloneNpm = /(^|[\s;&|()])npm\s+(install|run|ci)\b/u.test(command);
  return command.includes('pnpm') && !hasStandaloneNpm;
}

function projectScore(project) {
  const checks = [
    {
      id: 'linked-current-worktree',
      pass: project.linkedCurrentWorktree === true,
      weight: 3,
      summary: project.linkedCurrentWorktree
        ? 'Project is linked from .vercel/project.json.'
        : 'Project is not linked from the current worktree.',
    },
    {
      id: 'framework-nextjs',
      pass: project.framework === 'nextjs',
      weight: 2,
      summary: `Framework is ${project.framework || 'unset'}.`,
    },
    {
      id: 'node-22',
      pass: String(project.nodeVersion || '').startsWith('22'),
      weight: 2,
      summary: `Node version is ${project.nodeVersion || 'unset'}.`,
    },
    {
      id: 'pnpm-build-install',
      pass: project.pnpmBuildInstall === true,
      weight: 2,
      summary: project.pnpmBuildInstall
        ? 'Build/install commands are pnpm-aligned.'
        : 'Build/install commands need pnpm/frozen-lockfile correction.',
    },
    {
      id: 'domain-attached',
      pass: project.hasProductionDomain === true,
      weight: 3,
      summary: project.hasProductionDomain
        ? 'Production domain is attached.'
        : 'Production domain is not attached.',
    },
    {
      id: 'candidate-preview',
      pass: project.hasCandidatePreview === true,
      weight: 2,
      summary: project.hasCandidatePreview
        ? 'A recorded God Mode branch preview exists.'
        : 'No recorded God Mode branch preview exists.',
    },
  ];
  const max = checks.reduce((sum, check) => sum + check.weight, 0);
  const score = checks.reduce((sum, check) => sum + (check.pass ? check.weight : 0), 0);
  return { score, max, checks };
}

function buildReport() {
  const projectLink = readJson('.vercel/project.json');
  const rootVercel = readJson('vercel.json');
  const appVercel = readJson('apps/web/vercel.json');
  const rootPackage = readJson('package.json');
  const domainAuditPath = latestFile('planning-with-files', /^ARCANEA_VERCEL_DOMAIN_AUDIT_.*\.json$/);
  const domainAudit = domainAuditPath ? readJson(domainAuditPath) : null;
  const remoteSnapshotPath = latestFile('planning-with-files', /^ARCANEA_VERCEL_REMOTE_SNAPSHOT_.*\.json$/);
  const remoteSnapshot = remoteSnapshotPath ? readJson(remoteSnapshotPath) : null;

  const releaseProject = domainAudit?.releaseProject || {};
  const nearby = Array.isArray(domainAudit?.nearbyProjectsInspected) ? domainAudit.nearbyProjectsInspected : [];
  const appx = nearby.find((project) => project.name === 'arcanea-ai-appx') || {};
  const candidateDeployment = remoteSnapshot?.candidateDeployment || {};

  const rootCommandsPnpm = commandUsesPnpm(rootVercel.buildCommand)
    && commandUsesPnpm(rootVercel.installCommand)
    && String(rootVercel.installCommand || '').includes('--frozen-lockfile');
  const appCommandsPnpm = commandUsesPnpm(appVercel.buildCommand)
    && commandUsesPnpm(appVercel.installCommand)
    && String(appVercel.installCommand || '').includes('--frozen-lockfile');

  const projects = [
    {
      id: releaseProject.id || projectLink.projectId,
      name: releaseProject.name || projectLink.projectName || 'arcanea-ai-app',
      role: 'current-linked-release-project',
      linkedCurrentWorktree: true,
      framework: releaseProject.framework || remoteSnapshot?.project?.framework || null,
      nodeVersion: releaseProject.nodeVersion || remoteSnapshot?.project?.nodeVersion || null,
      rootDirectory: releaseProject.rootDirectory || '.',
      configuredBuildCommand: rootVercel.buildCommand || null,
      configuredInstallCommand: rootVercel.installCommand || null,
      configuredOutputDirectory: rootVercel.outputDirectory || null,
      pnpmBuildInstall: rootCommandsPnpm,
      hasProductionDomain: Array.isArray(releaseProject.domains)
        && (releaseProject.domains.includes('arcanea.ai') || releaseProject.domains.includes('www.arcanea.ai')),
      hasCandidatePreview: candidateDeployment.state === 'READY',
      primaryFixes: [
        'Patch Vercel project framework to nextjs.',
        'Patch Vercel project Node runtime to 22.x.',
        'Keep rootDirectory "." and root vercel.json outputDirectory apps/web/.next unless a human chooses apps/web root.',
        'Attach arcanea.ai/www.arcanea.ai only after domain owner and rollback path are explicit.',
        'Create a fresh preview from the packaged God Mode branch.',
      ],
      risk: 'Lowest repo-continuity risk because the current worktree and recorded God Mode preview already point here.',
    },
    {
      id: appx.id || null,
      name: appx.name || 'arcanea-ai-appx',
      role: 'nearby-alternate-web-project',
      linkedCurrentWorktree: false,
      framework: appx.framework || null,
      nodeVersion: appx.nodeVersion || null,
      rootDirectory: appx.rootDirectory || 'apps/web',
      configuredBuildCommand: 'npm run build',
      configuredInstallCommand: 'npm install',
      configuredOutputDirectory: '.next',
      pnpmBuildInstall: false,
      hasProductionDomain: Array.isArray(appx.domains)
        && (appx.domains.includes('arcanea.ai') || appx.domains.includes('www.arcanea.ai')),
      hasCandidatePreview: false,
      primaryFixes: [
        'Relink current worktree to this project only after human selection.',
        'Replace npm install/build commands with pnpm/frozen-lockfile commands.',
        'Confirm branch/deployment history for the God Mode app before attaching production domain.',
        'Attach arcanea.ai/www.arcanea.ai only after rollback path is explicit.',
      ],
      risk: 'Better framework/runtime/root posture, but higher continuity risk because this worktree is not linked here and command settings are npm-based.',
    },
  ].map((project) => ({ ...project, readiness: projectScore(project) }));

  return {
    version: '1.0.0',
    id: 'arcanea-vercel-project-selection-2026-07-05',
    generatedAt: new Date().toISOString(),
    repo: PROJECT_ROOT,
    sourceInputs: {
      projectLink: '.vercel/project.json',
      rootVercel: 'vercel.json',
      appVercel: 'apps/web/vercel.json',
      packageManager: rootPackage.packageManager || null,
      domainAudit: domainAuditPath,
      remoteSnapshot: remoteSnapshotPath,
    },
    summary: {
      decision: 'fix-current-linked-project-first',
      recommendedProject: 'arcanea-ai-app',
      alternateProject: 'arcanea-ai-appx',
      rationale: [
        'arcanea-ai-app is the current linked project and has recorded God Mode branch preview evidence.',
        'arcanea-ai-app needs framework/node/domain/live-state repair, but those are direct project-setting/domain actions.',
        'arcanea-ai-appx has better framework/node/root posture, but it is not linked to the current worktree and still has npm-based project commands.',
        'No inspected Arcanea candidate currently owns arcanea.ai/www.arcanea.ai, so domain movement requires explicit production-owner and rollback approval either way.',
      ],
    },
    projects,
    decisionRules: [
      'Prefer the linked project when it has current branch/deployment evidence and can be repaired with settings changes.',
      'Prefer a relink only when the alternate project has correct build commands, confirmed current branch previews, and explicit domain ownership.',
      'Do not force attach arcanea.ai while any existing production owner or rollback path is unclear.',
      'Do not promote until release-readiness strict mode passes and a fresh God Mode preview is visually verified.',
    ],
    nextActions: [
      'Patch arcanea-ai-app framework/node settings through the approved Vercel remediation packet.',
      'Refresh Vercel connector snapshot and release-readiness report.',
      'Package/stage only included God Mode paths, leaving excluded dirty paths out.',
      'Create one fresh preview from the packaged branch or draft PR.',
      'Attach arcanea.ai/www.arcanea.ai to the selected release project only after confirming current production owner and rollback path.',
    ],
  };
}

function formatMarkdown(report) {
  const lines = [];
  lines.push('# Arcanea Vercel Project Selection');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Decision: ${report.summary.decision}`);
  lines.push(`Recommended project: ${report.summary.recommendedProject}`);
  lines.push(`Alternate project: ${report.summary.alternateProject}`);
  lines.push('');
  lines.push('## Rationale');
  lines.push('');
  for (const item of report.summary.rationale) lines.push(`- ${item}`);
  lines.push('');
  lines.push('## Project Scores');
  lines.push('');
  for (const project of report.projects) {
    lines.push(`### ${project.name}`);
    lines.push('');
    lines.push(`Role: ${project.role}`);
    lines.push(`Score: ${project.readiness.score}/${project.readiness.max}`);
    lines.push(`Framework: ${project.framework || 'unset'}`);
    lines.push(`Node: ${project.nodeVersion || 'unset'}`);
    lines.push(`Root: ${project.rootDirectory || 'unset'}`);
    lines.push(`Build: ${project.configuredBuildCommand || 'unset'}`);
    lines.push(`Install: ${project.configuredInstallCommand || 'unset'}`);
    lines.push(`Risk: ${project.risk}`);
    lines.push('');
    lines.push('Checks:');
    for (const check of project.readiness.checks) {
      lines.push(`- ${check.pass ? 'PASS' : 'MISS'} ${check.id}: ${check.summary}`);
    }
    lines.push('');
    lines.push('Primary fixes:');
    for (const fix of project.primaryFixes) lines.push(`- ${fix}`);
    lines.push('');
  }
  lines.push('## Decision Rules');
  lines.push('');
  for (const rule of report.decisionRules) lines.push(`- ${rule}`);
  lines.push('');
  lines.push('## Next Actions');
  lines.push('');
  for (const action of report.nextActions) lines.push(`- ${action}`);
  lines.push('');
  return lines.join('\n');
}

const report = buildReport();
const markdown = formatMarkdown(report);

if (args.has('--write')) {
  fs.writeFileSync(JSON_OUTPUT, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(MD_OUTPUT, markdown);
  process.stdout.write(`Wrote ${path.relative(PROJECT_ROOT, JSON_OUTPUT).replace(/\\/g, '/')}\n`);
  process.stdout.write(`Wrote ${path.relative(PROJECT_ROOT, MD_OUTPUT).replace(/\\/g, '/')}\n`);
} else if (args.has('--json')) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else if (args.has('--markdown')) {
  process.stdout.write(markdown);
} else {
  process.stdout.write(`${markdown}\n`);
}
