#!/usr/bin/env node
/**
 * Arcanea Machine Readiness Check
 *
 * Validates the local operator machine state needed to resume Arcanea work after
 * restart: core toolchain, profile aliases, repo-local wrappers, worktrees, and
 * orchestrator/flow integration artifacts.
 *
 * Usage:
 *   node scripts/machine-readiness-check.js
 *   node scripts/machine-readiness-check.js --json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const HOME = process.env.HOME || process.env.USERPROFILE || '';
const PROFILE = path.join(HOME, 'Documents', 'WindowsPowerShell', 'Microsoft.PowerShell_profile.ps1');

const REQUIRED_COMMANDS = ['node', 'npm', 'pnpm', 'git', 'bun'];

const REQUIRED_FILES = [
  {
    label: 'PowerShell profile',
    path: PROFILE,
  },
  {
    label: 'Arcanea Flow wrapper',
    path: path.join(PROJECT_ROOT, '.arcanea', 'scripts', 'arcanea-flow.ps1'),
  },
  {
    label: 'Arcanea Flow MCP wrapper',
    path: path.join(PROJECT_ROOT, '.arcanea', 'scripts', 'arcanea-flow-mcp.ps1'),
  },
  {
    label: 'Arcanea Orchestrator wrapper',
    path: path.join(PROJECT_ROOT, '.arcanea', 'scripts', 'arcanea-orchestrator.ps1'),
  },
  {
    label: 'Repo constellation registry',
    path: path.join(PROJECT_ROOT, '.arcanea', 'projects', 'repo-constellation.json'),
  },
  {
    label: 'Platform handoff',
    path: path.join(PROJECT_ROOT, 'docs', 'ops', 'ARCANEA_PLATFORM_HANDOFF_2026-03-31.md'),
  },
  {
    label: 'Project graph handoff',
    path: path.join(PROJECT_ROOT, 'docs', 'ops', 'PROJECT_GRAPH_HANDOFF_2026-03-31.md'),
  },
  {
    label: 'Arcanea Orchestrator config',
    path: path.join(PROJECT_ROOT, 'arcanea-orchestrator', 'agent-orchestrator.yaml'),
  },
  {
    label: 'Arcanea Orchestrator CLI dist',
    path: path.join(PROJECT_ROOT, 'arcanea-orchestrator', 'packages', 'cli', 'dist', 'index.js'),
  },
  {
    label: 'Arcanea Flow CLI entrypoint',
    path: path.join(PROJECT_ROOT, 'arcanea-flow', 'v3', '@arcanea-flow', 'cli', 'bin', 'cli.js'),
  },
];

const EXPECTED_PROFILE_MARKERS = [
  'function arcanea',
  'function arcanea-flow',
  'function arcanea-orchestrator',
  'function ao',
  'Set-Alias -Name cda',
  'Set-Alias -Name cla',
];

function fileExists(targetPath) {
  try {
    return fs.statSync(targetPath).isFile();
  } catch {
    return false;
  }
}

function dirExists(targetPath) {
  try {
    return fs.statSync(targetPath).isDirectory();
  } catch {
    return false;
  }
}

function run(command, options = {}) {
  try {
    const output = execSync(command, {
      cwd: options.cwd || PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: options.timeoutMs || 30000,
    });
    return { ok: true, output: output.trim() };
  } catch (error) {
    const stdout = String(error?.stdout || '').trim();
    const stderr = String(error?.stderr || '').trim();
    return {
      ok: false,
      output: [stderr, stdout].filter(Boolean).join('\n').trim() || String(error.message || 'failed'),
    };
  }
}

function checkCommands() {
  return REQUIRED_COMMANDS.map((commandName) => {
    const result = run(`${commandName} --version`);
    return {
      label: commandName,
      ok: result.ok,
      detail: result.ok ? result.output.split(/\r?\n/)[0] : result.output.split(/\r?\n/)[0],
    };
  });
}

function checkFiles() {
  return REQUIRED_FILES.map((entry) => ({
    label: entry.label,
    ok: fileExists(entry.path),
    detail: entry.path,
  }));
}

function checkProfileMarkers() {
  if (!fileExists(PROFILE)) {
    return EXPECTED_PROFILE_MARKERS.map((marker) => ({
      label: marker,
      ok: false,
      detail: 'profile missing',
    }));
  }

  const profileText = fs.readFileSync(PROFILE, 'utf8');
  return EXPECTED_PROFILE_MARKERS.map((marker) => ({
    label: marker,
    ok: profileText.includes(marker),
    detail: path.basename(PROFILE),
  }));
}

function checkWorktrees() {
  const result = run('git worktree list');
  if (!result.ok) {
    return [{ label: 'git worktree list', ok: false, detail: result.output.split(/\r?\n/)[0] }];
  }

  const lines = result.output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const rootPath = path.normalize(PROJECT_ROOT).replace(/\\/g, '/');
  const integrationPath = 'C:/Users/frank/Arcanea-integration-review';
  const integrationGit = run('git rev-parse --is-inside-work-tree', {
    cwd: 'C:\\Users\\frank\\Arcanea-integration-review',
  });

  return [
    {
      label: rootPath,
      ok: lines.some((line) => line.toLowerCase().startsWith(rootPath.toLowerCase())),
      detail: 'attached worktree',
    },
    {
      label: integrationPath,
      ok: integrationGit.ok && integrationGit.output.split(/\r?\n/)[0] === 'true',
      detail: integrationGit.ok ? 'git workspace present' : 'workspace missing or detached from git',
    },
  ];
}

function checkRepoArtifacts() {
  return [
    {
      label: 'arcanea-orchestrator repo',
      ok: dirExists(path.join(PROJECT_ROOT, 'arcanea-orchestrator', '.git')) || dirExists(path.join(PROJECT_ROOT, 'arcanea-orchestrator')),
      detail: path.join(PROJECT_ROOT, 'arcanea-orchestrator'),
    },
    {
      label: 'oh-my-arcanea repo',
      ok: dirExists(path.join(PROJECT_ROOT, 'oh-my-arcanea')),
      detail: path.join(PROJECT_ROOT, 'oh-my-arcanea'),
    },
    {
      label: 'arcanea-flow repo',
      ok: dirExists(path.join(PROJECT_ROOT, 'arcanea-flow')),
      detail: path.join(PROJECT_ROOT, 'arcanea-flow'),
    },
  ];
}

function checkCommandSurfaces() {
  const commandPrefix = `powershell -NoLogo -NoProfile -Command ". '${PROFILE}'; `;
  const suffix = `"`;
  const checks = [
    { label: 'arcanea-flow ao dry-run', command: `${commandPrefix}arcanea-flow ao --dry-run status${suffix}` },
    { label: 'ao help', command: `${commandPrefix}ao --help${suffix}` },
    { label: 'arcanea status', command: `${commandPrefix}arcanea status${suffix}` },
  ];

  return checks.map((check) => {
    const result = run(check.command, { timeoutMs: 40000 });
    return {
      label: check.label,
      ok: result.ok,
      detail: result.ok ? result.output.split(/\r?\n/)[0] : result.output.split(/\r?\n/)[0],
    };
  });
}

function summarize(groups) {
  const all = groups.flatMap((group) => group.items);
  const passed = all.filter((item) => item.ok).length;
  const failed = all.length - passed;
  return {
    overall: failed === 0 ? 'READY' : 'DEGRADED',
    passed,
    failed,
  };
}

function printHuman(groups, summary) {
  console.log('=== Arcanea Machine Readiness Check ===');
  console.log(`Root: ${PROJECT_ROOT}`);
  console.log(`Overall: ${summary.overall}`);
  console.log(`Checks: ${summary.passed} passed, ${summary.failed} failed`);
  console.log('');

  for (const group of groups) {
    console.log(`[${group.name}]`);
    for (const item of group.items) {
      const marker = item.ok ? 'OK' : 'FAIL';
      console.log(`  ${marker}  ${item.label}`);
      if (item.detail) {
        console.log(`       ${item.detail}`);
      }
    }
    console.log('');
  }
}

function main() {
  const groups = [
    { name: 'Commands', items: checkCommands() },
    { name: 'Files', items: checkFiles() },
    { name: 'Profile', items: checkProfileMarkers() },
    { name: 'Worktrees', items: checkWorktrees() },
    { name: 'Repos', items: checkRepoArtifacts() },
    { name: 'Surfaces', items: checkCommandSurfaces() },
  ];

  const summary = summarize(groups);
  const jsonMode = process.argv.includes('--json');

  if (jsonMode) {
    console.log(JSON.stringify({ root: PROJECT_ROOT, summary, groups }, null, 2));
    process.exit(summary.failed === 0 ? 0 : 1);
  }

  printHuman(groups, summary);
  process.exit(summary.failed === 0 ? 0 : 1);
}

main();
