#!/usr/bin/env node
/**
 * Arcanea Ops Health Check
 *
 * Checks intelligence systems, GitHub repos, and local build health.
 *
 * Usage:
 *   node scripts/ops-health-check.js          Full report
 *   node scripts/ops-health-check.js --quick   Local only, no GitHub API
 *   node scripts/ops-health-check.js --deep    Run configured per-repo smoke commands
 *   node scripts/ops-health-check.js --json    JSON only output
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// ---------------------------------------------------------------------------
// Paths — normalized for Windows
// ---------------------------------------------------------------------------

const HOME = process.env.HOME || process.env.USERPROFILE || '';
const PROJECT_ROOT = path.resolve(__dirname, '..');

const PATHS = {
  sisLastSummary: path.join(HOME, '.arcanea', 'sessions', 'last-summary.md'),
  skillsDir: path.join(PROJECT_ROOT, '.claude', 'skills'),
  agentsDir: path.join(PROJECT_ROOT, '.claude', 'agents'),
  hooksDir: path.join(PROJECT_ROOT, '.claude', 'hooks'),
  settingsLocal: path.join(PROJECT_ROOT, '.claude', 'settings.local.json'),
  repoRegistry: path.join(PROJECT_ROOT, '.arcanea', 'projects', 'repo-constellation.json'),
  packageJson: path.join(PROJECT_ROOT, 'package.json'),
  nodeModules: path.join(PROJECT_ROOT, 'node_modules'),
  nextBuildCache: path.join(PROJECT_ROOT, 'apps', 'web', '.next'),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dirExists(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}

function fileExists(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

function fileMtime(p) {
  try { return fs.statSync(p).mtime; } catch { return null; }
}

function countEntries(dir, filter) {
  if (!dirExists(dir)) return 0;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return filter ? entries.filter(filter).length : entries.length;
  } catch { return 0; }
}

function readJsonIfExists(p) {
  if (!fileExists(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function execInRepo(repoPath, command) {
  try {
    return execSync(command, {
      cwd: repoPath,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function runCommand(command, cwd) {
  const sanitize = (value) => String(value || '')
    .replace(/\x1B\[[0-9;]*[A-Za-z]/g, '')
    .replace(/[^\x20-\x7E\r\n\t]/g, '')
    .trim();

  try {
    const stdout = execSync(command, {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5 * 60 * 1000,
    });
    const lines = sanitize(stdout).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    return {
      ok: true,
      command,
      summary: lines[0] || 'ok',
    };
  } catch (error) {
    const stderr = sanitize(error?.stderr || '');
    const stdout = sanitize(error?.stdout || '');
    const combined = [stderr, stdout].filter(Boolean).join('\n');
    const firstLine = combined.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
    return {
      ok: false,
      command,
      summary: firstLine || error.message,
    };
  }
}

function normalizePathString(p) {
  return typeof p === 'string'
    ? path.normalize(p).replace(/[\\/]+/g, '/').replace(/\/$/, '').toLowerCase()
    : null;
}

function inferPackageManager(repoPath) {
  if (fileExists(path.join(repoPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fileExists(path.join(repoPath, 'bun.lock')) || fileExists(path.join(repoPath, 'bun.lockb'))) return 'bun';
  if (fileExists(path.join(repoPath, 'package-lock.json'))) return 'npm';
  if (fileExists(path.join(repoPath, 'yarn.lock'))) return 'yarn';
  return null;
}

function collectGitRemotes(repoPath) {
  const remoteNamesRaw = execInRepo(repoPath, 'git remote');
  const remoteNames = remoteNamesRaw ? remoteNamesRaw.split(/\r?\n/).map((name) => name.trim()).filter(Boolean) : [];
  const remotes = {};

  for (const remoteName of remoteNames) {
    const remoteUrl = execInRepo(repoPath, `git remote get-url ${remoteName}`);
    remotes[remoteName] = remoteUrl || '(unknown)';
  }

  return remotes;
}

function loadRepoRegistry() {
  const registry = readJsonIfExists(PATHS.repoRegistry);
  return Array.isArray(registry?.repos) ? registry.repos : [];
}

function countDirRecursive(dir, filter) {
  if (!dirExists(dir)) return 0;
  let count = 0;
  const walk = (d) => {
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (!filter || filter(e)) count++;
    }
  };
  walk(dir);
  return count;
}

function ageHours(date) {
  if (!date) return Infinity;
  return (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60);
}

function isExecutable(p) {
  if (!fileExists(p)) return false;
  // On Windows, shell scripts are always "executable" if they exist
  if (process.platform === 'win32') return true;
  try { fs.accessSync(p, fs.constants.X_OK); return true; } catch { return false; }
}

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      headers: { 'User-Agent': 'arcanea-ops-health-check', ...headers },
    };
    https.get(url, opts, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch { resolve(data); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

function httpsGetPaginated(baseUrl, headers = {}, maxPages = 3) {
  return new Promise(async (resolve) => {
    let all = [];
    for (let page = 1; page <= maxPages; page++) {
      const sep = baseUrl.includes('?') ? '&' : '?';
      const url = `${baseUrl}${sep}per_page=100&page=${page}`;
      try {
        const data = await httpsGet(url, headers);
        if (!Array.isArray(data) || data.length === 0) break;
        all = all.concat(data);
        if (data.length < 100) break;
      } catch { break; }
    }
    resolve(all);
  });
}

// ---------------------------------------------------------------------------
// Check: SIS (Session Intelligence System)
// ---------------------------------------------------------------------------

function checkSIS() {
  const result = { name: 'SIS', status: 'unknown', details: {} };

  const summaryPath = PATHS.sisLastSummary;
  if (!fileExists(summaryPath)) {
    result.status = 'warn';
    result.details.lastSummary = 'not found';
    result.details.path = summaryPath;
    return result;
  }

  const mtime = fileMtime(summaryPath);
  const age = ageHours(mtime);
  result.details.lastSummaryAge = `${age.toFixed(1)}h`;
  result.details.lastSummaryDate = mtime ? mtime.toISOString() : null;
  result.details.path = summaryPath;
  result.status = age < 24 ? 'ok' : 'stale';
  return result;
}

// ---------------------------------------------------------------------------
// Check: ACOS (Skills + Agents)
// ---------------------------------------------------------------------------

function checkACOS() {
  const result = { name: 'ACOS', status: 'unknown', details: {} };

  const skillCount = countDirRecursive(PATHS.skillsDir, (e) =>
    e.name.endsWith('.md') || e.name.endsWith('.skill.md')
  );
  const skillDirs = countEntries(PATHS.skillsDir, (e) => e.isDirectory());
  const agentCount = countEntries(PATHS.agentsDir, (e) =>
    e.isFile() && e.name.endsWith('.md')
  );
  const agentDirs = countEntries(PATHS.agentsDir, (e) => e.isDirectory());

  result.details.skillDirectories = skillDirs;
  result.details.skillFiles = skillCount;
  result.details.agentFiles = agentCount;
  result.details.agentDirectories = agentDirs;
  result.status = (skillDirs > 0 && agentCount > 0) ? 'ok' : 'warn';
  return result;
}

// ---------------------------------------------------------------------------
// Check: AIOS (@arcanea/aios importability + Guardian definitions)
// ---------------------------------------------------------------------------

function checkAIOS() {
  const result = { name: 'AIOS', status: 'unknown', details: {} };

  // Check if @arcanea/aios is resolvable
  let aiosResolvable = false;
  try {
    require.resolve('@arcanea/aios');
    aiosResolvable = true;
  } catch {
    // Try local packages directory
    const localAios = path.join(PROJECT_ROOT, 'packages', 'aios');
    aiosResolvable = dirExists(localAios);
    if (aiosResolvable) {
      result.details.location = 'packages/aios (local)';
    }
  }
  result.details.importable = aiosResolvable;

  // Count Guardian agent definitions
  const guardianNames = [
    'lyssandria', 'leyla', 'draconia', 'maylinn', 'alera',
    'lyria', 'aiyami', 'elara', 'ino', 'shinkami',
  ];
  let guardianCount = 0;
  if (dirExists(PATHS.agentsDir)) {
    try {
      const files = fs.readdirSync(PATHS.agentsDir);
      for (const f of files) {
        const lower = f.toLowerCase();
        if (guardianNames.some((g) => lower.includes(g))) guardianCount++;
      }
    } catch { /* ignore */ }
  }
  result.details.guardianDefinitions = guardianCount;
  result.details.expectedGuardians = guardianNames.length;

  result.status = (aiosResolvable || guardianCount >= 5) ? 'ok' : 'warn';
  return result;
}

// ---------------------------------------------------------------------------
// Check: Hooks
// ---------------------------------------------------------------------------

function checkHooks() {
  const result = { name: 'Hooks', status: 'unknown', details: {} };

  const expectedHooks = [
    'session-start.sh',
    'session-end.sh',
    'pre-tool.sh',
    'post-tool.sh',
    'prompt-submit.sh',
    'model-route.sh',
    'voice-check.sh',
    'context-tracker.sh',
  ];

  const hookStatus = {};
  let missing = 0;
  let notExecutable = 0;

  for (const hook of expectedHooks) {
    const hookPath = path.join(PATHS.hooksDir, hook);
    if (!fileExists(hookPath)) {
      hookStatus[hook] = 'missing';
      missing++;
    } else if (!isExecutable(hookPath)) {
      hookStatus[hook] = 'not-executable';
      notExecutable++;
    } else {
      hookStatus[hook] = 'ok';
    }
  }

  result.details.hooks = hookStatus;
  result.details.total = expectedHooks.length;
  result.details.missing = missing;
  result.details.notExecutable = notExecutable;

  if (missing > 0) result.status = 'error';
  else if (notExecutable > 0) result.status = 'warn';
  else result.status = 'ok';

  return result;
}

// ---------------------------------------------------------------------------
// Check: MCP Servers
// ---------------------------------------------------------------------------

function checkMCP() {
  const result = { name: 'MCP', status: 'unknown', details: {} };

  if (!fileExists(PATHS.settingsLocal)) {
    result.status = 'error';
    result.details.settingsLocal = 'not found';
    return result;
  }

  try {
    const raw = fs.readFileSync(PATHS.settingsLocal, 'utf8');
    const settings = JSON.parse(raw);
    const servers = settings.enabledMcpjsonServers || [];
    result.details.enabledServers = servers;
    result.details.count = servers.length;
    result.details.enableAllProjectMcpServers = !!settings.enableAllProjectMcpServers;

    // Check that hooks are configured in settings
    const hookEvents = settings.hooks ? Object.keys(settings.hooks) : [];
    result.details.hookEvents = hookEvents;

    result.status = servers.length > 0 ? 'ok' : 'warn';
  } catch (e) {
    result.status = 'error';
    result.details.error = e.message;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Check: GitHub Repos (requires GITHUB_TOKEN)
// ---------------------------------------------------------------------------

async function checkGitHub() {
  const result = { name: 'GitHub', status: 'unknown', details: {} };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  if (!token) {
    result.status = 'skipped';
    result.details.reason = 'No GITHUB_TOKEN or GH_TOKEN in environment';
    return result;
  }

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };

  try {
    const repos = await httpsGetPaginated(
      'https://api.github.com/users/frankxai/repos',
      headers,
      5
    );

    const now = Date.now();
    const staleThresholdMs = 90 * 24 * 60 * 60 * 1000; // 90 days
    let active = 0;
    let stale = 0;
    let archived = 0;

    for (const repo of repos) {
      if (repo.archived) { archived++; continue; }
      const pushed = new Date(repo.pushed_at).getTime();
      if (now - pushed > staleThresholdMs) stale++;
      else active++;
    }

    result.details.totalRepos = repos.length;
    result.details.active = active;
    result.details.stale = stale;
    result.details.archived = archived;

    // Check open issues/PRs on key repos
    const keyRepos = ['arcanea-ai-app', 'arcanea', 'claude-flow'];
    const repoDetails = {};

    for (const repoName of keyRepos) {
      try {
        const issues = await httpsGet(
          `https://api.github.com/repos/frankxai/${repoName}/issues?state=open&per_page=100`,
          headers
        );
        const prs = Array.isArray(issues)
          ? issues.filter((i) => i.pull_request)
          : [];
        const openIssues = Array.isArray(issues)
          ? issues.filter((i) => !i.pull_request)
          : [];
        repoDetails[repoName] = {
          openIssues: openIssues.length,
          openPRs: prs.length,
        };
      } catch {
        repoDetails[repoName] = { error: 'could not fetch' };
      }
    }

    result.details.keyRepos = repoDetails;
    result.status = 'ok';
  } catch (e) {
    result.status = 'error';
    result.details.error = e.message;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Check: Local Build Health
// ---------------------------------------------------------------------------

function checkBuild() {
  const result = { name: 'Build', status: 'unknown', details: {} };

  // Package version
  if (fileExists(PATHS.packageJson)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(PATHS.packageJson, 'utf8'));
      result.details.name = pkg.name;
      result.details.version = pkg.version;
      result.details.workspaces = pkg.workspaces || [];
    } catch (e) {
      result.details.packageJsonError = e.message;
    }
  } else {
    result.details.packageJson = 'not found';
  }

  // node_modules
  result.details.nodeModulesExists = dirExists(PATHS.nodeModules);

  // .next build cache
  result.details.nextBuildCacheExists = dirExists(PATHS.nextBuildCache);

  // Git info
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    result.details.gitBranch = branch;
  } catch { /* ignore */ }

  try {
    const shortHash = execSync('git rev-parse --short HEAD', {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    result.details.gitCommit = shortHash;
  } catch { /* ignore */ }

  // Determine status
  if (!result.details.nodeModulesExists) result.status = 'error';
  else if (!result.details.nextBuildCacheExists) result.status = 'warn';
  else result.status = 'ok';

  return result;
}

// ---------------------------------------------------------------------------
// Check: Repo Constellation
// ---------------------------------------------------------------------------

function checkRepoConstellation({ deep = false } = {}) {
  const result = { name: 'Repos', status: 'unknown', details: {} };
  const repos = loadRepoRegistry();

  result.details.registryPath = PATHS.repoRegistry;

  if (repos.length === 0) {
    result.status = 'warn';
    result.details.reason = 'No repo registry entries found';
    result.details.total = 0;
    result.details.repos = [];
    return result;
  }

  const repoReports = [];
  let ok = 0;
  let warn = 0;
  let error = 0;
  let missing = 0;
  let dirty = 0;
  let smokePassed = 0;
  let smokeFailed = 0;
  let smokeSkipped = 0;

  for (const repo of repos) {
    const repoPath = path.resolve(PROJECT_ROOT, repo.path);
    const exists = dirExists(repoPath);
    const packageJson = readJsonIfExists(path.join(repoPath, 'package.json'));
    const isGitRepo = exists && execInRepo(repoPath, 'git rev-parse --is-inside-work-tree') === 'true';
    const gitTopLevel = isGitRepo ? execInRepo(repoPath, 'git rev-parse --show-toplevel') : null;
    const repoMode = repo.repoMode || 'standalone';
    const normalizedRepoPath = normalizePathString(repoPath);
    const normalizedProjectRoot = normalizePathString(PROJECT_ROOT);
    const normalizedGitTopLevel = normalizePathString(gitTopLevel);
    const remotes = isGitRepo ? collectGitRemotes(repoPath) : {};
    const branch = isGitRepo ? execInRepo(repoPath, 'git rev-parse --abbrev-ref HEAD') : null;
    const commit = isGitRepo ? execInRepo(repoPath, 'git rev-parse --short HEAD') : null;
    const porcelain = isGitRepo ? execInRepo(repoPath, 'git status --short') : null;
    const dirtyFiles = porcelain ? porcelain.split(/\r?\n/).filter(Boolean) : [];
    const expectedRemoteHints = Array.isArray(repo.expectedRemoteHints) ? repo.expectedRemoteHints : [];
    const remoteUrls = Object.values(remotes);
    const missingRemoteHints = expectedRemoteHints.filter((hint) =>
      !remoteUrls.some((url) => typeof url === 'string' && url.includes(hint))
    );
    const smokeCommands = Array.isArray(repo.smokeCommands) ? repo.smokeCommands : [];
    const smokeResults = [];

    const expectedTopLevel = repoMode === 'workspace-module' ? normalizedProjectRoot : normalizedRepoPath;

    let status = 'ok';
    if (!exists || !isGitRepo) status = 'error';
    else if (normalizedGitTopLevel !== expectedTopLevel) status = 'warn';
    else if (repoMode === 'standalone' && (missingRemoteHints.length > 0 || dirtyFiles.length > 0)) status = 'warn';

    if (deep) {
      if (!exists || !isGitRepo || repoMode !== 'standalone' || smokeCommands.length === 0) {
        smokeSkipped += smokeCommands.length || 1;
      } else {
        for (const smoke of smokeCommands) {
          const command = typeof smoke === 'string' ? smoke : smoke.command;
          const label = typeof smoke === 'string' ? smoke : (smoke.label || smoke.command);
          const smokeResult = runCommand(command, repoPath);
          smokeResults.push({
            label,
            command,
            ok: smokeResult.ok,
            summary: smokeResult.summary,
          });
          if (smokeResult.ok) smokePassed++;
          else smokeFailed++;
        }
        if (smokeResults.some((entry) => !entry.ok)) status = 'warn';
      }
    }

    if (!exists) missing++;
    if (repoMode === 'standalone' && dirtyFiles.length > 0) dirty++;
    if (status === 'ok') ok++;
    else if (status === 'warn') warn++;
    else error++;

    repoReports.push({
      id: repo.id,
      label: repo.label || repo.id,
      purpose: repo.purpose || null,
      path: repoPath,
      cli: Array.isArray(repo.cli) ? repo.cli : [],
      packageManager: inferPackageManager(repoPath),
      packageName: packageJson?.name || null,
      packageVersion: packageJson?.version || null,
      repoMode,
      exists,
      isGitRepo,
      gitTopLevel,
      branch,
      commit,
      dirty: repoMode === 'standalone' && dirtyFiles.length > 0,
      dirtyFileCount: repoMode === 'standalone' ? dirtyFiles.length : 0,
      remotes,
      missingRemoteHints: repoMode === 'standalone' ? missingRemoteHints : [],
      smokeResults,
      status,
    });
  }

  result.details.total = repos.length;
  result.details.ok = ok;
  result.details.warn = warn;
  result.details.error = error;
  result.details.missing = missing;
  result.details.dirty = dirty;
  result.details.deep = deep;
  result.details.smokePassed = smokePassed;
  result.details.smokeFailed = smokeFailed;
  result.details.smokeSkipped = smokeSkipped;
  result.details.repos = repoReports;

  if (error > 0) result.status = 'error';
  else if (warn > 0) result.status = 'warn';
  else result.status = 'ok';

  return result;
}

// ---------------------------------------------------------------------------
// Report formatting
// ---------------------------------------------------------------------------

function statusIcon(status) {
  switch (status) {
    case 'ok': return '[OK]';
    case 'warn': return '[WARN]';
    case 'stale': return '[STALE]';
    case 'error': return '[ERROR]';
    case 'skipped': return '[SKIP]';
    default: return '[??]';
  }
}

function formatHumanReport(report) {
  const lines = [];
  lines.push('');
  lines.push('=== Arcanea Ops Health Check ===');
  lines.push(`Timestamp: ${report.timestamp}`);
  lines.push(`Duration:  ${report.durationMs}ms`);
  lines.push('');

  for (const check of report.checks) {
    lines.push(`${statusIcon(check.status)} ${check.name}`);

    // Custom summaries per check type
    switch (check.name) {
      case 'SIS':
        if (check.details.lastSummary === 'not found') {
          lines.push(`     Last summary not found at ${check.details.path}`);
        } else {
          lines.push(`     Last summary: ${check.details.lastSummaryAge} ago`);
        }
        break;

      case 'ACOS':
        lines.push(`     Skills: ${check.details.skillDirectories} dirs, ${check.details.skillFiles} files`);
        lines.push(`     Agents: ${check.details.agentFiles} files, ${check.details.agentDirectories} dirs`);
        break;

      case 'AIOS':
        lines.push(`     Importable: ${check.details.importable}`);
        lines.push(`     Guardians: ${check.details.guardianDefinitions}/${check.details.expectedGuardians}`);
        break;

      case 'Hooks':
        lines.push(`     Total: ${check.details.total}, Missing: ${check.details.missing}, Not-exec: ${check.details.notExecutable}`);
        if (check.details.missing > 0 || check.details.notExecutable > 0) {
          for (const [hook, st] of Object.entries(check.details.hooks)) {
            if (st !== 'ok') lines.push(`       ${hook}: ${st}`);
          }
        }
        break;

      case 'MCP':
        if (check.details.enabledServers) {
          lines.push(`     Servers (${check.details.count}): ${check.details.enabledServers.join(', ')}`);
          lines.push(`     Hook events: ${(check.details.hookEvents || []).join(', ')}`);
        } else {
          lines.push(`     ${check.details.error || check.details.settingsLocal}`);
        }
        break;

      case 'GitHub':
        if (check.status === 'skipped') {
          lines.push(`     ${check.details.reason}`);
        } else if (check.status === 'ok') {
          lines.push(`     Repos: ${check.details.totalRepos} total (${check.details.active} active, ${check.details.stale} stale, ${check.details.archived} archived)`);
          if (check.details.keyRepos) {
            for (const [repo, info] of Object.entries(check.details.keyRepos)) {
              if (info.error) {
                lines.push(`       ${repo}: ${info.error}`);
              } else {
                lines.push(`       ${repo}: ${info.openIssues} issues, ${info.openPRs} PRs`);
              }
            }
          }
        } else {
          lines.push(`     Error: ${check.details.error}`);
        }
        break;

      case 'Build':
        lines.push(`     Package: ${check.details.name || '?'}@${check.details.version || '?'}`);
        lines.push(`     node_modules: ${check.details.nodeModulesExists ? 'present' : 'MISSING'}`);
        lines.push(`     .next cache:  ${check.details.nextBuildCacheExists ? 'present' : 'missing'}`);
        if (check.details.gitBranch) {
          lines.push(`     Git: ${check.details.gitBranch} (${check.details.gitCommit || '?'})`);
        }
        break;

      case 'Repos':
        lines.push(`     Registry: ${check.details.registryPath}`);
        lines.push(`     Repos: ${check.details.total} total (${check.details.ok} ok, ${check.details.warn} warn, ${check.details.error} error)`);
        lines.push(`     Missing: ${check.details.missing}, Dirty: ${check.details.dirty}`);
        if (check.details.deep) {
          lines.push(`     Smoke: ${check.details.smokePassed} passed, ${check.details.smokeFailed} failed, ${check.details.smokeSkipped} skipped`);
        }
        for (const repo of check.details.repos || []) {
          const failedSmoke = (repo.smokeResults || []).filter((entry) => !entry.ok);
          if (repo.status === 'ok' && failedSmoke.length === 0) continue;
          const reasons = [];
          if (!repo.exists) reasons.push('missing');
          else {
            if (!repo.isGitRepo) reasons.push('not-git');
            if (normalizePathString(repo.gitTopLevel) && normalizePathString(repo.gitTopLevel) !== normalizePathString(repo.path) && repo.repoMode === 'standalone') reasons.push('nested-not-standalone');
            if (normalizePathString(repo.gitTopLevel) && normalizePathString(repo.gitTopLevel) !== normalizePathString(PROJECT_ROOT) && repo.repoMode === 'workspace-module') reasons.push('not-in-workspace-root');
            if (repo.missingRemoteHints?.length) reasons.push(`remote-drift:${repo.missingRemoteHints.join('|')}`);
            if (repo.dirty) reasons.push(`dirty:${repo.dirtyFileCount}`);
          }
          lines.push(`       ${repo.id}: ${reasons.join(', ') || repo.status}`);
          for (const smoke of failedSmoke) {
            lines.push(`         smoke ${smoke.label}: ${smoke.summary}`);
          }
        }
        break;
    }

    lines.push('');
  }

  // Overall
  const statuses = report.checks.map((c) => c.status);
  let overall = 'healthy';
  if (statuses.includes('error')) overall = 'unhealthy';
  else if (statuses.includes('warn') || statuses.includes('stale')) overall = 'degraded';

  lines.push(`Overall: ${overall.toUpperCase()}`);
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const quick = args.includes('--quick');
  const deep = args.includes('--deep');
  const jsonOnly = args.includes('--json');

  const start = Date.now();
  const checks = [];

  // Local checks (always run)
  checks.push(checkSIS());
  checks.push(checkACOS());
  checks.push(checkAIOS());
  checks.push(checkHooks());
  checks.push(checkMCP());
  checks.push(checkBuild());
  checks.push(checkRepoConstellation({ deep }));

  // GitHub check (unless --quick)
  if (!quick) {
    checks.push(await checkGitHub());
  }

  const report = {
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - start,
    mode: deep ? (quick ? 'quick+deep' : 'full+deep') : (quick ? 'quick' : 'full'),
    checks,
  };

  if (jsonOnly) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    process.stdout.write(formatHumanReport(report));
    process.stdout.write('\n--- JSON Report ---\n');
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  }
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${err.message}\n`);
  process.exit(1);
});
