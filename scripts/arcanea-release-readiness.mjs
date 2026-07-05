#!/usr/bin/env node
/**
 * Arcanea release readiness gate.
 *
 * Usage:
 *   node scripts/arcanea-release-readiness.mjs
 *   node scripts/arcanea-release-readiness.mjs --json
 *   node scripts/arcanea-release-readiness.mjs --strict
 *
 * The default command reports blockers without failing the shell. Use --strict
 * when a CI/release lane should fail on blockers.
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
const strict = args.has('--strict');

const ROUTE_FILES = [
  'apps/web/app/status/page.tsx',
  'apps/web/app/method/page.tsx',
  'apps/web/app/genesis/page.tsx',
  'apps/web/app/atlas/creatures/page.tsx',
  'apps/web/app/studio/store/page.tsx',
];

const REQUIRED_APP_SCRIPTS = ['build', 'start', 'type-check', 'test:projects'];
const REQUIRED_ANALYTICS_DEPS = ['@vercel/analytics', '@vercel/speed-insights'];
const WORKFLOW_DEPS = ['eve', 'workflow', '@vercel/workflow'];
const IGNORED_PACKAGE_DIRS = new Set([
  '.git',
  '.next',
  '.turbo',
  '.vercel',
  '.worktrees',
  'coverage',
  'dist',
  'build',
  'node_modules',
]);

function relative(target) {
  return path.relative(PROJECT_ROOT, target).replace(/\\/g, '/');
}

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

function dirExists(relativePath) {
  try {
    return fs.statSync(absolute(relativePath)).isDirectory();
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

  return matches[0] ? relative(matches[0].full) : null;
}

function normalizeRepoPath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\.\//u, '');
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

function collectPackageJsonFiles(startRelative = '.') {
  const found = [];

  function walk(current) {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (IGNORED_PACKAGE_DIRS.has(entry.name)) continue;
        walk(full);
      } else if (entry.isFile() && entry.name === 'package.json') {
        found.push(relative(full));
      }
    }
  }

  walk(absolute(startRelative));
  return found.sort();
}

function packageDeps(pkg) {
  return {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
    ...pkg.optionalDependencies,
  };
}

function readPackages() {
  return collectPackageJsonFiles().map((file) => ({
    file,
    json: readJson(file),
  }));
}

function dependencyFind(packages, matcher) {
  const hits = [];
  for (const pkg of packages) {
    if (pkg.json.__readError) continue;
    const deps = packageDeps(pkg.json);
    for (const name of Object.keys(deps)) {
      if (matcher(name)) {
        hits.push({ file: pkg.file, name, version: deps[name] });
      }
    }
  }
  return hits;
}

function check(status, lane, id, summary, details = {}) {
  return { status, lane, id, summary, ...details };
}

function majorFromVersion(value) {
  const match = String(value || '').match(/(\d+)/);
  return match ? match[1] : null;
}

function gitStatus() {
  try {
    const output = execFileSync('git', ['status', '--short'], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 15000,
    }).replace(/\s+$/u, '');
    return output ? output.split(/\r?\n/).map((line) => line.trimEnd()) : [];
  } catch (error) {
    return [`git status unavailable: ${error.message}`];
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

function summarizeDirty(lines, releaseScope) {
  const includedPaths = Array.isArray(releaseScope?.includedPaths) ? releaseScope.includedPaths : [];
  const excludedDirtyPaths = Array.isArray(releaseScope?.excludedDirtyPaths) ? releaseScope.excludedDirtyPaths : [];
  const entries = lines.map((line) => {
    const file = line.slice(3).replace(/\\/g, '/');
    const included = pathCovered(file, includedPaths);
    const excluded = pathCovered(file, excludedDirtyPaths);
    return {
      raw: line,
      rawStatus: line.slice(0, 2),
      status: line.slice(0, 2).trim() || '??',
      file,
      included,
      excluded,
    };
  });

  return {
    count: entries.length,
    scopeManifest: releaseScope?.__path || null,
    included: entries.filter((entry) => entry.included).map((entry) => entry.file),
    excluded: entries.filter((entry) => entry.excluded).map((entry) => entry.file),
    unknown: entries.filter((entry) => !entry.included && !entry.excluded).map((entry) => entry.file),
    entries,
    sample: entries.slice(0, 12),
  };
}

function hasIndexChange(entry) {
  const indexStatus = String(entry.rawStatus || '').slice(0, 1);
  return indexStatus !== ' ' && indexStatus !== '?';
}

function hasWorktreeChange(entry) {
  const worktreeStatus = String(entry.rawStatus || '').slice(1, 2);
  return worktreeStatus !== ' ' && worktreeStatus !== '?';
}

function buildReport() {
  const checks = [];
  const packages = readPackages();
  const rootPkg = readJson('package.json');
  const webPkg = readJson('apps/web/package.json');
  const localProject = readJson('.vercel/project.json');
  const rootVercel = readJson('vercel.json');
  const webVercel = readJson('apps/web/vercel.json');
  const nvmrc = fileExists('.nvmrc') ? readText('.nvmrc').trim() : null;
  const remoteSnapshotPath = latestFile('planning-with-files', /^ARCANEA_VERCEL_REMOTE_SNAPSHOT_.*\.json$/);
  const remoteSnapshot = remoteSnapshotPath ? readJson(remoteSnapshotPath) : null;
  const releaseScopePath = latestFile('planning-with-files', /^ARCANEA_GOD_MODE_RELEASE_SCOPE_.*\.json$/);
  const releaseScope = releaseScopePath
    ? { ...readJson(releaseScopePath), __path: releaseScopePath }
    : null;
  const releasePackagePlanPath = latestFile('planning-with-files', /^ARCANEA_GOD_MODE_RELEASE_PACKAGE_PLAN_.*\.json$/);
  const releasePackagePlan = releasePackagePlanPath ? readJson(releasePackagePlanPath) : null;
  const remediationPacketPath = latestFile('planning-with-files', /^ARCANEA_VERCEL_REMEDIATION_PACKET_.*\.json$/);
  const remediationPacket = remediationPacketPath ? readJson(remediationPacketPath) : null;
  const remediationRunnerPath = latestFile('planning-with-files', /^ARCANEA_VERCEL_REMEDIATION_RUNNER_.*\.json$/);
  const remediationRunner = remediationRunnerPath ? readJson(remediationRunnerPath) : null;
  const domainAuditPath = latestFile('planning-with-files', /^ARCANEA_VERCEL_DOMAIN_AUDIT_.*\.json$/);
  const domainAudit = domainAuditPath ? readJson(domainAuditPath) : null;
  const projectSelectionPath = latestFile('planning-with-files', /^ARCANEA_VERCEL_PROJECT_SELECTION_.*\.json$/);
  const projectSelection = projectSelectionPath ? readJson(projectSelectionPath) : null;
  const successMetricsReportPath = '.visual-qa/arcanea-god-mode-2026-07-05/success-metrics-report.json';
  const successMetricsReport = fileExists(successMetricsReportPath) ? readJson(successMetricsReportPath) : null;
  const durableWorkflowReadinessReportPath = '.visual-qa/arcanea-god-mode-2026-07-05/durable-workflow-readiness-report.json';
  const durableWorkflowReadinessReport = fileExists(durableWorkflowReadinessReportPath)
    ? readJson(durableWorkflowReadinessReportPath)
    : null;
  const evidencePath = '.visual-qa/design-loop-evidence-arcanea-god-mode-2026-07-05.json';
  const evidence = fileExists(evidencePath) ? readJson(evidencePath) : null;
  const dirtyLines = gitStatus();
  const dirty = summarizeDirty(dirtyLines, releaseScope);
  const currentGitHead = gitHead();

  const localSettings = localProject.settings || {};
  const localFramework = localSettings.framework;
  const localNode = localSettings.nodeVersion;
  const remoteProject = remoteSnapshot?.project || {};
  const remoteLatest = remoteSnapshot?.latestDeployment || {};
  const candidateDeployment = remoteSnapshot?.candidateDeployment || null;
  const latestGitRef = String(remoteLatest.gitRef || '');
  const expectedNodeMajor = majorFromVersion(nvmrc);
  const localNodeMajor = majorFromVersion(localNode);
  const remoteNodeMajor = majorFromVersion(remoteProject.nodeVersion);

  if (fileExists('.vercel/project.json')) {
    checks.push(check('pass', 'vercel-release', 'vercel-project-linked', 'Vercel project link exists.', {
      evidence: '.vercel/project.json',
      projectId: localProject.projectId,
      orgId: localProject.orgId,
    }));
  } else {
    checks.push(check('blocker', 'vercel-release', 'vercel-project-linked', 'Missing .vercel/project.json; connector/project identity is not pinned.'));
  }

  if (localFramework === 'nextjs') {
    checks.push(check('pass', 'vercel-release', 'local-vercel-framework', 'Local Vercel project framework is Next.js.'));
  } else {
    checks.push(check('blocker', 'vercel-release', 'local-vercel-framework', `Local Vercel project framework is ${localFramework || 'unset'}, expected nextjs.`, {
      action: 'Update Vercel project settings before production promotion.',
    }));
  }

  if (remoteProject.framework === 'nextjs') {
    checks.push(check('pass', 'vercel-release', 'remote-vercel-framework', 'Remote Vercel project framework is Next.js.', {
      evidence: remoteSnapshotPath,
    }));
  } else if (remoteProject.framework) {
    checks.push(check('blocker', 'vercel-release', 'remote-vercel-framework', `Remote Vercel project framework is ${remoteProject.framework}, expected nextjs.`, {
      evidence: remoteSnapshotPath,
      action: 'Set the Vercel project framework preset to Next.js before production promotion.',
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'remote-vercel-framework', 'No remote Vercel snapshot was found; run the Vercel connector before promotion.'));
  }

  if (expectedNodeMajor && localNodeMajor === expectedNodeMajor) {
    checks.push(check('pass', 'vercel-release', 'local-node-version', `Local Vercel Node ${localNode} matches .nvmrc ${nvmrc}.`));
  } else {
    checks.push(check('blocker', 'vercel-release', 'local-node-version', `Local Vercel Node ${localNode || 'unset'} does not match .nvmrc ${nvmrc || 'missing'}.`, {
      action: 'Align Vercel project Node runtime with repo .nvmrc before production promotion.',
    }));
  }

  if (expectedNodeMajor && remoteNodeMajor === expectedNodeMajor) {
    checks.push(check('pass', 'vercel-release', 'remote-node-version', `Remote Vercel Node ${remoteProject.nodeVersion} matches .nvmrc ${nvmrc}.`, {
      evidence: remoteSnapshotPath,
    }));
  } else if (remoteProject.nodeVersion) {
    checks.push(check('blocker', 'vercel-release', 'remote-node-version', `Remote Vercel Node ${remoteProject.nodeVersion} does not match .nvmrc ${nvmrc || 'missing'}.`, {
      evidence: remoteSnapshotPath,
      action: 'Resolve Node runtime drift before production promotion.',
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'remote-node-version', 'No remote Vercel Node version snapshot was found.'));
  }

  const domains = Array.isArray(remoteProject.domains) ? remoteProject.domains : [];
  if (domains.includes('arcanea.ai')) {
    checks.push(check('pass', 'vercel-release', 'production-domain', 'arcanea.ai is attached to this Vercel project.', {
      evidence: remoteSnapshotPath,
    }));
  } else if (domains.length > 0) {
    checks.push(check('blocker', 'vercel-release', 'production-domain', 'arcanea.ai is not attached to the inspected Vercel project.', {
      evidence: remoteSnapshotPath,
      domains,
      action: 'Do not claim the production domain until project/domain mapping is resolved.',
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'production-domain', 'No remote Vercel domain snapshot was found.'));
  }

  if (remoteProject.live === true) {
    checks.push(check('pass', 'vercel-release', 'remote-live-state', 'Remote Vercel project reports live=true.', {
      evidence: remoteSnapshotPath,
    }));
  } else if (remoteProject.live === false) {
    checks.push(check('blocker', 'vercel-release', 'remote-live-state', 'Remote Vercel project reports live=false.', {
      evidence: remoteSnapshotPath,
      action: 'Verify preview and production mapping before promotion.',
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'remote-live-state', 'Remote Vercel live state is unknown.'));
  }

  if (remediationPacket && !remediationPacket.__readError) {
    checks.push(check('pass', 'vercel-release', 'vercel-remediation-packet', 'Vercel remediation packet exists for the remaining external project blockers.', {
      evidence: remediationPacketPath,
      actions: Array.isArray(remediationPacket.actions) ? remediationPacket.actions.map((action) => action.id) : [],
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'vercel-remediation-packet', 'No Vercel remediation packet was found for remaining external project blockers.', {
      action: 'Run node scripts/arcanea-vercel-remediation.mjs --write after inspecting Vercel connector state.',
    }));
  }

  if (
    remediationRunner
    && !remediationRunner.__readError
    && remediationRunner.decision === 'dry-run-ready'
    && remediationRunner.summary?.blockers === 0
    && remediationRunner.nonMutating === true
  ) {
    checks.push(check('pass', 'vercel-release', 'vercel-remediation-runner', 'Guarded Vercel remediation runner is dry-run ready and non-mutating by default.', {
      evidence: remediationRunnerPath,
      pass: remediationRunner.summary.pass,
      warn: remediationRunner.summary.warn,
      blockers: remediationRunner.summary.blockers,
      tokenPresent: remediationRunner.summary.tokenPresent,
      operatorCommands: remediationRunner.operatorCommands || {},
    }));
  } else if (remediationRunner && !remediationRunner.__readError) {
    checks.push(check('blocker', 'vercel-release', 'vercel-remediation-runner', 'Vercel remediation runner report exists but is not dry-run ready.', {
      evidence: remediationRunnerPath,
      decision: remediationRunner.decision || null,
      summary: remediationRunner.summary || null,
      action: 'Run node scripts/arcanea-vercel-remediation-runner.mjs --write --strict before release handoff.',
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'vercel-remediation-runner', 'No guarded Vercel remediation runner report was found.', {
      action: 'Run node scripts/arcanea-vercel-remediation-runner.mjs --write --strict to create operator-safe remediation evidence.',
    }));
  }

  if (
    domainAudit
    && !domainAudit.__readError
    && domainAudit.summary?.domainRegisteredInTeam === true
    && domainAudit.summary?.servedByVercel === true
  ) {
    checks.push(check('pass', 'vercel-release', 'vercel-domain-ownership-audit', 'arcanea.ai ownership/routing audit confirms the domain is under the Starlight Vercel team and served by Vercel, but not assigned to the current release project.', {
      evidence: domainAuditPath,
      decision: domainAudit.summary.decision || null,
      releaseProjectHasDomain: domainAudit.summary.releaseProjectHasDomain ?? null,
      knownAssociatedProject: domainAudit.summary.knownAssociatedProject || null,
      nameserversMatchVercelDns: domainAudit.summary.nameserversMatchVercelDns ?? null,
    }));
  } else if (domainAudit && !domainAudit.__readError) {
    checks.push(check('blocker', 'vercel-release', 'vercel-domain-ownership-audit', 'arcanea.ai domain audit exists but does not prove Starlight ownership/routing.', {
      evidence: domainAuditPath,
      decision: domainAudit.summary?.decision || null,
      domainRegisteredInTeam: domainAudit.summary?.domainRegisteredInTeam ?? null,
      servedByVercel: domainAudit.summary?.servedByVercel ?? null,
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'vercel-domain-ownership-audit', 'No arcanea.ai Vercel domain ownership audit was found.', {
      action: 'Run read-only Vercel domain/project inspection before moving or attaching arcanea.ai.',
    }));
  }

  const selectedProject = Array.isArray(projectSelection?.projects)
    ? projectSelection.projects.find((project) => project.name === projectSelection.summary?.recommendedProject)
    : null;

  if (
    projectSelection
    && !projectSelection.__readError
    && projectSelection.summary?.decision === 'fix-current-linked-project-first'
    && projectSelection.summary?.recommendedProject === 'arcanea-ai-app'
  ) {
    checks.push(check('pass', 'vercel-release', 'vercel-project-selection-audit', 'Vercel project selection audit recommends fixing the current linked release project before relinking to alternates.', {
      evidence: projectSelectionPath,
      decision: projectSelection.summary.decision,
      recommendedProject: projectSelection.summary.recommendedProject,
      alternateProject: projectSelection.summary.alternateProject || null,
      selectedScore: selectedProject?.readiness
        ? `${selectedProject.readiness.score}/${selectedProject.readiness.max}`
        : null,
      rationale: projectSelection.summary.rationale || [],
    }));
  } else if (projectSelection && !projectSelection.__readError) {
    checks.push(check('blocker', 'vercel-release', 'vercel-project-selection-audit', 'Vercel project selection audit exists but does not confirm arcanea-ai-app as the current release project to repair.', {
      evidence: projectSelectionPath,
      decision: projectSelection.summary?.decision || null,
      recommendedProject: projectSelection.summary?.recommendedProject || null,
      alternateProject: projectSelection.summary?.alternateProject || null,
      action: 'Resolve release-project selection before patching framework/runtime or moving domains.',
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'vercel-project-selection-audit', 'No Vercel project selection audit was found.', {
      action: 'Run node scripts/arcanea-vercel-project-selection.mjs --write before applying the remediation packet.',
    }));
  }

  if (remoteLatest.readyState === 'READY') {
    checks.push(check('pass', 'vercel-release', 'latest-deployment-ready', 'Latest Vercel deployment is READY.', {
      evidence: remoteSnapshotPath,
      deployment: remoteLatest.id,
      target: remoteLatest.target,
    }));
  } else if (remoteLatest.readyState && latestGitRef.startsWith('backup/') && candidateDeployment?.state === 'READY') {
    checks.push(check('warn', 'vercel-release', 'latest-deployment-ready', `Latest Vercel deployment is ${remoteLatest.readyState} on ${latestGitRef}; the latest recorded God Mode candidate preview is READY, so this is tracked as backup-branch release noise.`, {
      evidence: remoteSnapshotPath,
      latestDeployment: remoteLatest.id,
      candidateDeployment: candidateDeployment.id,
      action: 'Keep backup snapshot deployments out of the release decision path, and create a fresh God Mode preview after packaging the current worktree.',
    }));
  } else if (remoteLatest.readyState) {
    checks.push(check('blocker', 'vercel-release', 'latest-deployment-ready', `Latest Vercel deployment is ${remoteLatest.readyState}.`, {
      evidence: remoteSnapshotPath,
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'latest-deployment-ready', 'No latest deployment snapshot was found.'));
  }

  if (candidateDeployment?.id && candidateDeployment.state === 'READY' && currentGitHead && candidateDeployment.gitSha === currentGitHead && dirty.included.length === 0) {
    checks.push(check('pass', 'vercel-release', 'candidate-preview-current', 'Latest recorded God Mode candidate preview matches the current clean HEAD.', {
      evidence: remoteSnapshotPath,
      deployment: candidateDeployment.id,
      gitSha: candidateDeployment.gitSha,
    }));
  } else if (candidateDeployment?.id && candidateDeployment.state === 'READY' && currentGitHead && candidateDeployment.gitSha === currentGitHead) {
    checks.push(check('warn', 'vercel-release', 'candidate-preview-current', 'Latest recorded God Mode candidate preview matches current HEAD, but the worktree has included God Mode changes that are not deployed yet.', {
      evidence: remoteSnapshotPath,
      deployment: candidateDeployment.id,
      gitSha: candidateDeployment.gitSha,
      includedDirtyCount: dirty.included.length,
      action: 'After packaging the God Mode slice, create one fresh preview from the staged/committed change set and visually verify it.',
    }));
  } else if (candidateDeployment?.id) {
    checks.push(check('blocker', 'vercel-release', 'candidate-preview-current', 'Latest recorded God Mode candidate preview does not match the current repo HEAD or is not READY.', {
      evidence: remoteSnapshotPath,
      deployment: candidateDeployment.id,
      candidateState: candidateDeployment.state || null,
      candidateGitSha: candidateDeployment.gitSha || null,
      currentGitHead,
      action: 'Create a fresh God Mode preview from the current release branch before promotion.',
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'candidate-preview-current', 'No God Mode candidate preview was recorded in the remote Vercel snapshot.', {
      evidence: remoteSnapshotPath,
      action: 'Refresh the Vercel snapshot after creating a preview for the release branch.',
    }));
  }

  if (rootVercel.framework === 'nextjs' && rootVercel.outputDirectory === 'apps/web/.next') {
    checks.push(check('pass', 'vercel-release', 'root-vercel-config', 'Root vercel.json is configured for the apps/web Next.js build.'));
  } else {
    checks.push(check('warn', 'vercel-release', 'root-vercel-config', 'Root vercel.json should be reviewed for apps/web Next.js output.', {
      evidence: 'vercel.json',
    }));
  }

  for (const [id, file, config] of [
    ['root-frozen-install', 'vercel.json', rootVercel],
    ['web-frozen-install', 'apps/web/vercel.json', webVercel],
  ]) {
    if (String(config.installCommand || '').includes('--frozen-lockfile')) {
      checks.push(check('pass', 'vercel-release', id, `${file} uses pnpm --frozen-lockfile.`, { evidence: file }));
    } else {
      checks.push(check('blocker', 'vercel-release', id, `${file} does not enforce --frozen-lockfile.`, { evidence: file }));
    }
  }

  const missingScripts = REQUIRED_APP_SCRIPTS.filter((script) => !webPkg.scripts?.[script]);
  if (missingScripts.length === 0) {
    checks.push(check('pass', 'engineering', 'web-required-scripts', 'Web app has build/start/type-check/test:projects scripts.', {
      evidence: 'apps/web/package.json',
    }));
  } else {
    checks.push(check('blocker', 'engineering', 'web-required-scripts', `Web app is missing scripts: ${missingScripts.join(', ')}.`, {
      evidence: 'apps/web/package.json',
    }));
  }

  const webDeps = packageDeps(webPkg);
  const missingAnalytics = REQUIRED_ANALYTICS_DEPS.filter((name) => !webDeps[name]);
  if (missingAnalytics.length === 0) {
    checks.push(check('pass', 'ux-growth', 'analytics-sinks', 'Vercel Analytics and Speed Insights dependencies are installed.', {
      evidence: 'apps/web/package.json',
    }));
  } else {
    checks.push(check('warn', 'ux-growth', 'analytics-sinks', `Missing analytics dependency/dependencies: ${missingAnalytics.join(', ')}.`, {
      evidence: 'apps/web/package.json',
    }));
  }

  const missingRoutes = ROUTE_FILES.filter((file) => !fileExists(file));
  if (missingRoutes.length === 0) {
    checks.push(check('pass', 'product-doctrine', 'proof-loop-routes', 'Public proof-loop routes exist for status, method, Genesis, Atlas, and Store.', {
      evidence: ROUTE_FILES,
    }));
  } else {
    checks.push(check('blocker', 'product-doctrine', 'proof-loop-routes', `Missing product route files: ${missingRoutes.join(', ')}.`, {
      action: 'Restore route files before preview verification.',
    }));
  }

  if (successMetricsReport && successMetricsReport.summary?.decision === 'metrics-ready') {
    checks.push(check('pass', 'ux-growth', 'success-metrics-audit', 'Success metrics audit is clean for activation events, tests, docs, privacy, dashboard views, and competitive pressure mapping.', {
      evidence: successMetricsReportPath,
      pass: successMetricsReport.summary.pass,
      warn: successMetricsReport.summary.warn,
      blockers: successMetricsReport.summary.blockers,
    }));
  } else if (successMetricsReport) {
    checks.push(check('blocker', 'ux-growth', 'success-metrics-audit', 'Success metrics audit is not clean.', {
      evidence: successMetricsReportPath,
      decision: successMetricsReport.summary?.decision || null,
      pass: successMetricsReport.summary?.pass ?? null,
      warn: successMetricsReport.summary?.warn ?? null,
      blockers: successMetricsReport.summary?.blockers ?? null,
    }));
  } else {
    checks.push(check('warn', 'ux-growth', 'success-metrics-audit', 'Success metrics audit report is missing.', {
      action: 'Run node scripts/arcanea-success-metrics-audit.mjs --json > .visual-qa/arcanea-god-mode-2026-07-05/success-metrics-report.json.',
    }));
  }

  if (evidence && !evidence.__readError) {
    const evidenceFiles = [
      evidence.activationReport,
      evidence.statusReport,
      evidence.methodReport,
    ].filter(Boolean);
    const missingEvidenceFiles = evidenceFiles.filter((file) => !fileExists(file));
    if (missingEvidenceFiles.length === 0) {
      checks.push(check('pass', 'premium-qa', 'visual-evidence', 'Activation, status, and method visual QA reports are recorded.', {
        evidence: evidencePath,
      }));
    } else {
      checks.push(check('warn', 'premium-qa', 'visual-evidence', `Evidence manifest references missing reports: ${missingEvidenceFiles.join(', ')}.`, {
        evidence: evidencePath,
      }));
    }
  } else {
    checks.push(check('blocker', 'premium-qa', 'visual-evidence', 'Premium visual QA evidence manifest is missing or unreadable.', {
      evidence: evidencePath,
    }));
  }

  const workflowHits = dependencyFind(packages, (name) =>
    WORKFLOW_DEPS.includes(name) || name.startsWith('@workflow/')
  );
  const eveDocs = fileExists('node_modules/eve/docs/README.md');
  const workflowDocs = fileExists('node_modules/workflow/docs/README.md') || fileExists('node_modules/@vercel/workflow/docs/README.md');

  if (workflowHits.length > 0 && (eveDocs || workflowDocs)) {
    checks.push(check('pass', 'ai-engineering', 'durable-runtime-docs', 'Durable workflow/Eve dependency and bundled docs are present.', {
      dependencies: workflowHits,
    }));
  } else {
    checks.push(check('warn', 'ai-engineering', 'durable-runtime-docs', 'Eve/Vercel Workflow runtime is intentionally not ready: dependencies or bundled docs are absent.', {
      dependencies: workflowHits,
      docs: {
        eveDocs,
        workflowDocs,
      },
      action: 'Do not write or claim durable Eve/workflow runtime code until dependencies are intentionally added and bundled docs are read.',
    }));
  }

  if (
    durableWorkflowReadinessReport
    && !durableWorkflowReadinessReport.__readError
    && durableWorkflowReadinessReport.summary?.packetReady === true
    && durableWorkflowReadinessReport.summary?.blockers === 0
    && ['runtime-ready', 'runtime-blocked-packet-ready'].includes(durableWorkflowReadinessReport.summary?.decision)
  ) {
    checks.push(check('pass', 'ai-engineering', 'durable-workflow-readiness-packet', 'Durable Workflow/Eve readiness packet is present, blocker-free, and keeps runtime implementation behind docs/dependency gates.', {
      evidence: durableWorkflowReadinessReportPath,
      decision: durableWorkflowReadinessReport.summary.decision,
      pass: durableWorkflowReadinessReport.summary.pass,
      warn: durableWorkflowReadinessReport.summary.warn,
      blockers: durableWorkflowReadinessReport.summary.blockers,
    }));
  } else if (durableWorkflowReadinessReport && !durableWorkflowReadinessReport.__readError) {
    checks.push(check('blocker', 'ai-engineering', 'durable-workflow-readiness-packet', 'Durable Workflow/Eve readiness packet exists but is not clean.', {
      evidence: durableWorkflowReadinessReportPath,
      decision: durableWorkflowReadinessReport.summary?.decision || null,
      pass: durableWorkflowReadinessReport.summary?.pass ?? null,
      warn: durableWorkflowReadinessReport.summary?.warn ?? null,
      blockers: durableWorkflowReadinessReport.summary?.blockers ?? null,
    }));
  } else {
    checks.push(check('warn', 'ai-engineering', 'durable-workflow-readiness-packet', 'Durable Workflow/Eve readiness packet report is missing.', {
      action: 'Run node scripts/arcanea-durable-workflow-readiness.mjs --json > .visual-qa/arcanea-god-mode-2026-07-05/durable-workflow-readiness-report.json.',
    }));
  }

  if (dirty.count === 0) {
    checks.push(check('pass', 'safety', 'git-clean-release-packaging', 'Worktree is clean.'));
  } else if (dirty.scopeManifest && dirty.unknown.length === 0) {
    const status = dirty.excluded.length > 0 ? 'warn' : 'pass';
    checks.push(check(status, 'safety', 'git-clean-release-packaging', `Dirty worktree is classified by the release scope manifest: ${dirty.included.length} included paths, ${dirty.excluded.length} excluded paths, 0 unknown paths.`, {
      dirty,
      evidence: dirty.scopeManifest,
      action: dirty.excluded.length > 0
        ? 'Stage only included paths and leave excluded dirty paths out of the God Mode release.'
        : 'Stage included paths for the coherent God Mode release.',
    }));
  } else {
    checks.push(check('blocker', 'safety', 'git-clean-release-packaging', `Worktree has ${dirty.count} dirty paths and ${dirty.unknown.length} unknown paths outside the release scope.`, {
      dirty,
      action: 'Classify unknown dirty paths in the release scope manifest before PR/deploy.',
    }));
  }

  if (releasePackagePlanPath && releasePackagePlan && !releasePackagePlan.__readError) {
    const planSummary = releasePackagePlan.summary || {};
    const countsMatch =
      planSummary.includedDirtyCount === dirty.included.length
      && planSummary.excludedDirtyCount === dirty.excluded.length
      && planSummary.unknownDirtyCount === dirty.unknown.length;
    const stagedIncludedEntries = dirty.entries.filter((entry) => entry.included && hasIndexChange(entry));
    const unstagedIncludedEntries = dirty.entries.filter((entry) => entry.included && !hasIndexChange(entry));
    const includedWithExtraWorktreeChanges = dirty.entries.filter((entry) => entry.included && hasIndexChange(entry) && hasWorktreeChange(entry));
    const stagedExcludedEntries = dirty.entries.filter((entry) => entry.excluded && hasIndexChange(entry));
    const stagedUnknownEntries = dirty.entries.filter((entry) => !entry.included && !entry.excluded && hasIndexChange(entry));
    const packagedClean =
      releasePackagePlan.decision === 'stage-plan-ready'
      && planSummary.blockers === 0
      && planSummary.unknownDirtyCount === 0
      && stagedIncludedEntries.length > 0
      && unstagedIncludedEntries.length === 0
      && includedWithExtraWorktreeChanges.length === 0
      && stagedExcludedEntries.length === 0
      && stagedUnknownEntries.length === 0
      && dirty.unknown.length === 0;
    const committedClean =
      releasePackagePlan.decision === 'stage-plan-ready'
      && planSummary.blockers === 0
      && planSummary.unknownDirtyCount === 0
      && dirty.included.length === 0
      && dirty.unknown.length === 0
      && stagedExcludedEntries.length === 0
      && stagedUnknownEntries.length === 0;
    const planReady =
      releasePackagePlan.decision === 'stage-plan-ready'
      && planSummary.blockers === 0
      && planSummary.unknownDirtyCount === 0
      && (countsMatch || packagedClean || committedClean);

    checks.push(check(
      planReady ? 'pass' : 'blocker',
      'safety',
      'release-package-plan',
      planReady
        ? packagedClean
          ? `Release package plan has been applied cleanly: ${stagedIncludedEntries.length} included paths staged, no excluded paths staged.`
          : committedClean
            ? 'Release package plan has been applied and committed: no included dirty paths remain.'
            : `Release package plan is current and stage-ready: ${planSummary.stageTargetCount} scoped git add targets.`
        : 'Release package plan exists but does not match the current dirty tree or has blockers.',
      {
        evidence: releasePackagePlanPath,
        decision: releasePackagePlan.decision,
        countsMatch,
        packagedClean,
        committedClean,
        stagedIncludedCount: stagedIncludedEntries.length,
        unstagedIncluded: unstagedIncludedEntries.map((entry) => entry.file),
        includedWithExtraWorktreeChanges: includedWithExtraWorktreeChanges.map((entry) => entry.file),
        stagedExcluded: stagedExcludedEntries.map((entry) => entry.file),
        stagedUnknown: stagedUnknownEntries.map((entry) => entry.file),
        planSummary,
        action: planReady
          ? packagedClean
            ? 'Commit the staged God Mode package only after local gates remain green; do not push/deploy until Vercel blockers are resolved or a preview-only exception is approved.'
            : committedClean
              ? 'Use the committed God Mode package for the next draft PR/preview only after Vercel project blockers are resolved or a preview-only exception is approved.'
              : 'Use the package plan commands only after local gates remain green.'
          : 'Regenerate with node scripts/arcanea-release-package-plan.mjs --write before staging or deploy.',
      },
    ));
  } else if (releasePackagePlanPath) {
    checks.push(check('blocker', 'safety', 'release-package-plan', 'Release package plan is unreadable.', {
      evidence: releasePackagePlanPath,
      error: releasePackagePlan?.__readError || null,
      action: 'Regenerate with node scripts/arcanea-release-package-plan.mjs --write.',
    }));
  }

  if (rootPkg.packageManager?.startsWith('pnpm@')) {
    checks.push(check('pass', 'engineering', 'package-manager', `Repo package manager is ${rootPkg.packageManager}.`, {
      evidence: 'package.json',
    }));
  } else {
    checks.push(check('blocker', 'engineering', 'package-manager', 'Repo package manager is not pinned to pnpm.', {
      evidence: 'package.json',
    }));
  }

  const blockerCount = checks.filter((entry) => entry.status === 'blocker').length;
  const warnCount = checks.filter((entry) => entry.status === 'warn').length;
  const passCount = checks.filter((entry) => entry.status === 'pass').length;
  const productionReady = blockerCount === 0;
  const previewReady = productionReady || (
    checks.filter((entry) => entry.status === 'blocker')
      .every((entry) => ['production-domain', 'remote-live-state', 'git-clean-release-packaging'].includes(entry.id))
  );
  const durableWorkflowReady = checks.some((entry) => entry.id === 'durable-runtime-docs' && entry.status === 'pass');

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    repo: PROJECT_ROOT,
    summary: {
      productionReady,
      previewReady,
      durableWorkflowReady,
      pass: passCount,
      warn: warnCount,
      blockers: blockerCount,
    },
    decision: productionReady
      ? 'production-ready'
      : previewReady
        ? 'preview-only'
        : 'blocked',
    inputs: {
      nvmrc,
      packageManager: rootPkg.packageManager || null,
      localVercelProject: '.vercel/project.json',
      remoteSnapshot: remoteSnapshotPath,
      releaseScope: releaseScopePath,
      releasePackagePlan: releasePackagePlanPath,
      remediationPacket: remediationPacketPath,
      remediationRunner: remediationRunnerPath,
      domainAudit: domainAuditPath,
      projectSelection: projectSelectionPath,
      successMetricsReport: fileExists(successMetricsReportPath) ? successMetricsReportPath : null,
      durableWorkflowReadinessReport: fileExists(durableWorkflowReadinessReportPath) ? durableWorkflowReadinessReportPath : null,
      evidenceManifest: fileExists(evidencePath) ? evidencePath : null,
      currentGitHead,
      packageManifestCount: packages.length,
    },
    checks,
  };
}

function formatHuman(report) {
  const lines = [];
  lines.push('=== Arcanea Release Readiness ===');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Decision:  ${report.decision}`);
  lines.push(`Counts:    ${report.summary.pass} pass, ${report.summary.warn} warn, ${report.summary.blockers} blockers`);
  lines.push(`Preview:   ${report.summary.previewReady ? 'READY' : 'BLOCKED'}`);
  lines.push(`Production:${report.summary.productionReady ? 'READY' : 'BLOCKED'}`);
  lines.push(`Durable:   ${report.summary.durableWorkflowReady ? 'READY' : 'BLOCKED/ROADMAP'}`);
  lines.push('');

  for (const entry of report.checks) {
    const label = entry.status === 'pass' ? 'PASS' : entry.status === 'warn' ? 'WARN' : 'BLOCK';
    lines.push(`[${label}] ${entry.lane}/${entry.id}`);
    lines.push(`  ${entry.summary}`);
    if (entry.action) lines.push(`  Action: ${entry.action}`);
  }

  lines.push('');
  lines.push('Use --json for machine output and --strict to exit nonzero on blockers.');
  return lines.join('\n');
}

const report = buildReport();

if (jsonOnly) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  process.stdout.write(`${formatHuman(report)}\n`);
}

if (strict && report.summary.blockers > 0) {
  process.exit(1);
}
