/**
 * @arcanea/voice — Workflow primitives
 *
 * Named recipes that compose multiple shell calls into one invocation. Solves
 * the "Jarvis tried to install stuff before checking" problem: instead of the
 * model picking individual tools by keyword association, it picks a workflow
 * by *intent*. Each recipe is a deterministic sequence — no LLM rounds, no
 * surprises. Output is a single rolled-up summary the model then narrates.
 *
 * Add a workflow here when you find yourself describing a multi-step ops
 * routine three times. Workflows are read-only (status + introspection) by
 * default; mutating workflows must explicitly opt in via `mutates: true` and
 * are gated separately.
 */

import { spawnSync } from 'child_process';
import { existsSync, readFileSync, appendFileSync, mkdirSync } from 'fs';
import { homedir, platform } from 'os';
import { join, resolve, dirname } from 'path';

const IS_WIN = platform() === 'win32';

// ---------------------------------------------------------------------------
// Project map — spoken-name → repo path. Lets Jarvis resolve "the cockpit",
// "this project", "the orb" to actual disk paths. User can override at
// ~/.starlight/jarvis-projects.json. Falls back to defaults below.
// ---------------------------------------------------------------------------

const DEFAULT_PROJECTS = {
  starlight: 'C:\\Users\\frank\\Starlight-Intelligence-System',
  sis: 'C:\\Users\\frank\\Starlight-Intelligence-System',
  arcanea: 'C:\\Users\\frank\\Arcanea',
  orb: 'C:\\Users\\frank\\Arcanea\\packages\\arcanea-voice',
  voice: 'C:\\Users\\frank\\Arcanea\\packages\\arcanea-voice',
  cockpit: 'C:\\Users\\frank\\Starlight-Intelligence-System\\private\\local-command-center',
  dashboard: 'C:\\Users\\frank\\Starlight-Intelligence-System\\private\\local-command-center\\apps\\dashboard',
  'voice-operator': 'C:\\Users\\frank\\Starlight-Intelligence-System\\private\\voice-operator',
  flow: 'C:\\Users\\frank\\arcanea-flow',
};

let projectMapCache = null;

export function getProjectMap() {
  if (projectMapCache) return projectMapCache;
  const overrideFile = join(homedir(), '.starlight', 'jarvis-projects.json');
  let map = { ...DEFAULT_PROJECTS };
  if (existsSync(overrideFile)) {
    try {
      const override = JSON.parse(readFileSync(overrideFile, 'utf-8'));
      map = { ...map, ...override };
    } catch {
      // ignore malformed override; defaults are good
    }
  }
  // Lowercase keys for case-insensitive lookup.
  const lc = {};
  for (const [k, v] of Object.entries(map)) lc[k.toLowerCase()] = v;
  projectMapCache = lc;
  return lc;
}

export function resolveProjectPath(nameOrPath) {
  if (!nameOrPath) return null;
  const map = getProjectMap();
  const key = nameOrPath.toLowerCase().trim();
  if (map[key]) return map[key];
  // If it looks like an absolute path that exists, use it directly.
  if ((nameOrPath.includes(':') || nameOrPath.startsWith('/')) && existsSync(nameOrPath)) {
    return nameOrPath;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Run helper — bounded, captured, no install side-effects.
// ---------------------------------------------------------------------------

function runCmd(cmd, cwd, timeoutMs = 8000) {
  const opts = {
    timeout: timeoutMs,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: cwd || undefined,
  };
  const r = IS_WIN ? spawnSync('cmd', ['/c', cmd], opts) : spawnSync('/bin/sh', ['-c', cmd], opts);
  return {
    cmd,
    cwd: cwd || process.cwd(),
    stdout: (r.stdout || '').toString().trim(),
    stderr: (r.stderr || '').toString().trim(),
    exit: typeof r.status === 'number' ? r.status : -1,
  };
}

function brief(s, max = 800) {
  if (!s) return '';
  return s.length > max ? s.slice(0, max) + '\n…(truncated)' : s;
}

// ---------------------------------------------------------------------------
// Recipes
// ---------------------------------------------------------------------------

/**
 * project_status — git status + branch + recent log + GH PR list (if available).
 * Read-only. Never installs. Default workflow when user says "what's the state
 * of X" / "check this project" / "where am I on Y".
 */
async function projectStatus(args) {
  const cwd = resolveProjectPath(args.project) || process.cwd();
  const branch = runCmd('git rev-parse --abbrev-ref HEAD', cwd, 3000);
  const status = runCmd('git status --short', cwd, 3000);
  const log = runCmd('git log --oneline -5', cwd, 3000);
  const prs = runCmd('gh pr list --limit 5 2>&1 || echo "(gh not configured)"', cwd, 5000);
  return {
    workflow: 'project_status',
    project: cwd,
    branch: branch.stdout || '(detached)',
    changed_files: brief(status.stdout, 400) || '(clean tree)',
    recent_commits: brief(log.stdout, 400),
    open_prs: brief(prs.stdout, 400),
  };
}

/**
 * morning_brief — a 60-second snapshot across the operator's stack.
 * Looks at: branch, last commit, recent commits (24h + 7d), uncommitted changes
 * (work-in-progress is real work, even before it lands as a commit), and
 * today's voice captures. Earlier version was blind to WIP and reported
 * "no commits in last 24h" while a hundred uncommitted files sat on disk.
 */
async function morningBrief() {
  const map = getProjectMap();
  const repos = ['starlight', 'arcanea', 'flow'];
  const perRepo = [];
  for (const r of repos) {
    const path = map[r];
    if (!path || !existsSync(path)) continue;
    const branch = runCmd('git rev-parse --abbrev-ref HEAD', path, 3000);
    // Windows cmd treats % as variable expansion. Use --pretty=oneline -n1 instead
    // of --format="%h %ar — %s" so we don't have to escape per-shell.
    const last = runCmd('git log -1 --pretty=oneline --abbrev-commit', path, 3000);
    const recent24h = runCmd('git log --since="24 hours ago" --oneline -10', path, 5000);
    const recent7d = runCmd('git log --since="7 days ago" --oneline -8', path, 5000);
    const wipShort = runCmd('git status --short', path, 3000);
    const wipCounts = runCmd('git diff --shortstat', path, 3000);
    const stagedCounts = runCmd('git diff --cached --shortstat', path, 3000);
    // Untracked file count (separate signal from modified)
    const untrackedRaw = wipShort.stdout.split('\n').filter((l) => l.startsWith('??')).length;
    const modifiedRaw = wipShort.stdout.split('\n').filter((l) => /^[ AM][ M]/.test(l) || l.startsWith(' M') || l.startsWith('M ') || l.startsWith('MM')).length;
    perRepo.push({
      repo: r,
      branch: branch.stdout || '(?)',
      last_commit: last.stdout || '(no history)',
      commits_24h: brief(recent24h.stdout, 240) || '(no commits in last 24h)',
      commits_7d: brief(recent7d.stdout, 240) || '(no commits in last 7 days)',
      wip_changes: wipCounts.stdout.trim() || '(no uncommitted edits)',
      wip_staged: stagedCounts.stdout.trim() || '(nothing staged)',
      wip_modified_files: modifiedRaw,
      wip_untracked_files: untrackedRaw,
    });
  }
  // Today's captures
  const today = new Date().toISOString().slice(0, 10);
  const sessionFile = join(map.starlight || '', 'memory', 'voice-sessions', `${today}.md`);
  let captures = '(no captures today yet)';
  if (existsSync(sessionFile)) {
    try {
      const raw = readFileSync(sessionFile, 'utf-8');
      const utterances = (raw.match(/\*\*Utterance:\*\* (.+)/g) || []).slice(0, 5);
      if (utterances.length) captures = utterances.join('\n').slice(0, 400);
    } catch {}
  }
  return {
    workflow: 'morning_brief',
    date: today,
    repos: perRepo,
    captures_today: captures,
    note: 'Pay attention to wip_changes — uncommitted edits are real work. Many modified files = active session.',
  };
}

/**
 * demo_prep — verifies cockpit health for a live demo. Read-only.
 * Uses Node fetch instead of curl to avoid Windows `%` escaping pain.
 */
async function probePort(url, timeoutMs = 2000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    return r.status;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function demoPrep() {
  const [orbCode, dashCode, opsCode] = await Promise.all([
    probePort('http://127.0.0.1:7777/api/health'),
    probePort('http://127.0.0.1:3007/cockpit'),
    probePort('http://127.0.0.1:7373/healthz'),
  ]);
  const draftsDir = join(homedir(), 'Desktop', 'jarvis-drafts');
  let drafts = '(none yet)';
  if (existsSync(draftsDir)) {
    const ls = runCmd(`dir /B "${draftsDir}"`, null, 3000);
    drafts = brief(ls.stdout, 200) || '(empty)';
  }
  return {
    workflow: 'demo_prep',
    orb_7777: orbCode === 200 ? 'live' : 'down',
    dashboard_3007: dashCode === 200 ? 'live' : 'down',
    voice_operator_7373: opsCode === 200 ? 'live' : 'down',
    drafts_folder: draftsDir,
    drafts_present: drafts,
    ready: orbCode === 200 && dashCode === 200,
  };
}

/**
 * capture_thought — append a voice capture to today's session log. Mutating
 * but minimal scope (only writes to memory/voice-sessions/YYYY-MM-DD.md).
 */
async function captureThought(args) {
  const text = (args.text || args.utterance || '').trim();
  if (!text) return { error: 'capture_thought needs `text` arg' };
  const map = getProjectMap();
  const root = map.starlight || homedir();
  const today = new Date().toISOString().slice(0, 10);
  const dir = join(root, 'memory', 'voice-sessions');
  const file = join(dir, `${today}.md`);
  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString();
    const block = `\n## ${ts}\n\n**Utterance:** ${text}\n`;
    appendFileSync(file, block, 'utf-8');
    return { workflow: 'capture_thought', file, captured: text.slice(0, 200) };
  } catch (e) {
    return { error: `failed to capture: ${String(e.message || e)}` };
  }
}

/**
 * build_handoff — bundle current context (cwd, branch, recent log, status)
 * + user's prompt into a single Claude Code prompt. Returns the bundled
 * prompt for the model to then pass to claude_code_launch.
 */
async function buildHandoff(args) {
  const task = (args.task || args.prompt || '').trim();
  if (!task) return { error: 'build_handoff needs `task` arg' };
  const cwd = resolveProjectPath(args.project) || process.cwd();
  const status = runCmd('git status --short', cwd, 3000);
  const branch = runCmd('git rev-parse --abbrev-ref HEAD', cwd, 3000);
  const log = runCmd('git log --oneline -3', cwd, 3000);
  const bundled = [
    `# Handoff from voice cockpit`,
    `**Project:** ${cwd}`,
    `**Branch:** ${branch.stdout || '(?)'}`,
    `**Recent commits:**`,
    '```',
    log.stdout || '(none)',
    '```',
    `**Current changes:**`,
    '```',
    status.stdout || '(clean)',
    '```',
    ``,
    `## The ask`,
    task,
  ].join('\n');
  return {
    workflow: 'build_handoff',
    bundled_prompt: bundled,
    project: cwd,
    next: 'Pass `bundled_prompt` to claude_code_launch to spawn the work.',
  };
}

/**
 * ship_it — show what *would* be committed. NEVER actually commits or pushes.
 * Demo-safe; mutating ship is a separate workflow gated by explicit confirmation.
 */
async function shipItPreview(args) {
  const cwd = resolveProjectPath(args.project) || process.cwd();
  const status = runCmd('git status --short', cwd, 3000);
  const diffstat = runCmd('git diff --stat', cwd, 5000);
  const branch = runCmd('git rev-parse --abbrev-ref HEAD', cwd, 3000);
  return {
    workflow: 'ship_it_preview',
    project: cwd,
    branch: branch.stdout,
    would_commit: brief(status.stdout, 400) || '(no changes)',
    diffstat: brief(diffstat.stdout, 400),
    note: 'Preview only. To actually commit, ask Frank to run git himself.',
  };
}

/**
 * meeting_prep — given a topic, gather: matching open PRs across repos,
 * grep matching today's captures, list relevant drafts. Pulls everything
 * Frank might need to remember about the topic in the next 60 seconds.
 */
async function meetingPrep(args) {
  const topic = (args.topic || args.text || '').trim();
  if (!topic) return { error: 'meeting_prep needs `topic` arg' };
  const map = getProjectMap();
  const repos = ['starlight', 'arcanea', 'flow'];
  const matches = [];
  for (const r of repos) {
    const path = map[r];
    if (!path || !existsSync(path)) continue;
    // Grep recent commits for the topic
    const log = runCmd(`git log --since="14 days ago" --grep="${topic.replace(/"/g, '')}" --oneline -8`, path, 5000);
    if (log.stdout) matches.push({ repo: r, recent_commits: brief(log.stdout, 300) });
  }
  // Today's captures matching topic
  const today = new Date().toISOString().slice(0, 10);
  const sessionFile = join(map.starlight || '', 'memory', 'voice-sessions', `${today}.md`);
  let captures = [];
  if (existsSync(sessionFile)) {
    try {
      const raw = readFileSync(sessionFile, 'utf-8');
      const lines = raw.split('\n').filter((l) => l.toLowerCase().includes(topic.toLowerCase()));
      captures = lines.slice(0, 5);
    } catch {}
  }
  // Drafts in ~/Desktop/jarvis-drafts/ matching topic
  const draftsDir = join(homedir(), 'Desktop', 'jarvis-drafts');
  let drafts = [];
  if (existsSync(draftsDir)) {
    try {
      const ls = runCmd('dir /B', draftsDir, 3000);
      drafts = ls.stdout.split('\n')
        .filter((n) => n.toLowerCase().includes(topic.toLowerCase()))
        .slice(0, 5);
    } catch {}
  }
  return {
    workflow: 'meeting_prep',
    topic,
    matching_commits: matches,
    matching_captures: captures,
    matching_drafts: drafts,
    summary: `Found ${matches.length} repos with related commits, ${captures.length} captures, ${drafts.length} drafts mentioning "${topic}".`,
  };
}

/**
 * recent_drafts — list ~/Desktop/jarvis-drafts/ files with size + preview head.
 * Useful when Frank says "what did I draft" or "show me recent docs".
 */
async function recentDrafts(args) {
  const draftsDir = join(homedir(), 'Desktop', 'jarvis-drafts');
  if (!existsSync(draftsDir)) {
    return { workflow: 'recent_drafts', drafts: [], note: 'drafts folder does not exist yet' };
  }
  const limit = Math.min(parseInt(args.limit || '8', 10) || 8, 30);
  // dir /O-D = sort by date descending
  const ls = runCmd(`dir /B /O-D "${draftsDir}"`, null, 3000);
  const names = ls.stdout.split('\n').filter(Boolean).slice(0, limit);
  const drafts = [];
  for (const name of names) {
    const full = join(draftsDir, name);
    try {
      const raw = readFileSync(full, 'utf-8');
      drafts.push({
        name,
        head: raw.split('\n').slice(0, 3).join(' / ').slice(0, 200),
        chars: raw.length,
      });
    } catch {}
  }
  return {
    workflow: 'recent_drafts',
    folder: draftsDir,
    drafts,
    count: drafts.length,
  };
}

/**
 * port_health — quick port-level check across the cockpit. Lighter than
 * demo_prep (no draft folder enumeration) — just "is the spine up?"
 */
async function portHealth() {
  const ports = [
    { name: 'orb', port: 7777, url: 'http://127.0.0.1:7777/api/health' },
    { name: 'dashboard', port: 3007, url: 'http://127.0.0.1:3007/' },
    { name: 'voice_operator', port: 7373, url: 'http://127.0.0.1:7373/healthz' },
  ];
  const results = await Promise.all(ports.map(async (p) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2000);
    try {
      const r = await fetch(p.url, { signal: ctrl.signal });
      clearTimeout(t);
      return { ...p, status: r.ok ? 'live' : `http_${r.status}` };
    } catch {
      clearTimeout(t);
      return { ...p, status: 'down' };
    }
  }));
  const allLive = results.every((r) => r.status === 'live');
  return {
    workflow: 'port_health',
    services: results,
    all_live: allLive,
    note: allLive ? 'Cockpit is healthy.' : 'One or more surfaces are down.',
  };
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const REGISTRY = {
  project_status: { fn: projectStatus, mutates: false, doc: 'git status + branch + recent commits + open PRs for a project' },
  morning_brief: { fn: morningBrief, mutates: false, doc: '24h+7d commits across known repos + WIP awareness + today\'s captures' },
  demo_prep: { fn: demoPrep, mutates: false, doc: 'verify all cockpit ports are LIVE + drafts folder before a demo' },
  port_health: { fn: portHealth, mutates: false, doc: 'lightweight port-level check across orb/dashboard/voice-operator' },
  capture_thought: { fn: captureThought, mutates: true, doc: 'append a thought to memory/voice-sessions/today.md' },
  build_handoff: { fn: buildHandoff, mutates: false, doc: 'bundle git context + user task into a Claude Code prompt' },
  ship_it_preview: { fn: shipItPreview, mutates: false, doc: 'preview what would be committed; never actually ships' },
  meeting_prep: { fn: meetingPrep, mutates: false, doc: 'given a topic, gather matching commits + captures + drafts. For when you walk into a meeting and need recall.' },
  recent_drafts: { fn: recentDrafts, mutates: false, doc: 'list recent jarvis-drafts/ files with size + preview head' },
};

export function listWorkflows() {
  return Object.entries(REGISTRY).map(([name, { mutates, doc }]) => ({ name, mutates, doc }));
}

export async function runWorkflow(name, args = {}) {
  const entry = REGISTRY[name];
  if (!entry) {
    return { error: `unknown workflow: ${name}. Available: ${Object.keys(REGISTRY).join(', ')}` };
  }
  try {
    return await entry.fn(args);
  } catch (e) {
    return { error: `workflow ${name} failed: ${String(e?.message || e)}` };
  }
}
