#!/usr/bin/env node
/**
 * Arcanea Ops Health Check
 *
 * Checks intelligence systems, GitHub repos, and local build health.
 *
 * Usage:
 *   node scripts/ops-health-check.js          Full report
 *   node scripts/ops-health-check.js --quick   Local only, no GitHub API
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

  // GitHub check (unless --quick)
  if (!quick) {
    checks.push(await checkGitHub());
  }

  const report = {
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - start,
    mode: quick ? 'quick' : 'full',
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
