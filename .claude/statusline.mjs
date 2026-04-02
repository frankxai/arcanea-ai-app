/**
 * Arcanea Intelligence OS — Claude Code Statusline v6.0
 * Updated for Claude Code v5 JSON stdin schema (2026-03)
 *
 * v6 changes over v5:
 * - Aligned with official Claude Code statusline JSON schema
 * - Uses model.display_name, workspace.current_dir, cost.total_duration_ms
 * - Proper rate_limits.five_hour / seven_day handling
 * - ANSI color support for terminal rendering
 * - Cached git operations for performance
 * - Dynamic Guardian routing based on work type
 */

import { spawnSync } from 'child_process';
import { readFileSync, statSync, existsSync, writeFileSync, mkdirSync } from 'fs';

// ─── Utils ───────────────────────────────────────────────────────────────────

const read  = (p, fb = '') => { try { return readFileSync(p, 'utf-8').trim(); } catch { return fb; } };
const readJ = (p, fb = {}) => { try { return JSON.parse(readFileSync(p, 'utf-8')); } catch { return fb; } };
const fmt   = n => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(1)}K` : String(n ?? 0);
const sh    = (cmd, timeout = 1500) => {
  try {
    const r = spawnSync('sh', ['-c', cmd], { encoding: 'utf-8', timeout });
    return r.stdout?.trim() ?? '';
  } catch { return ''; }
};

// ─── NTFS-safe shared cache ──────────────────────────────────────────────────
const CACHE_DIR = '/tmp/arcanea-statusline';
try { mkdirSync(CACHE_DIR, { recursive: true }); } catch {}

function cachedSh(key, cmd, ttlMs = 30_000, timeout = 1500) {
  const cacheFile = `${CACHE_DIR}/${key}`;
  try {
    if (existsSync(cacheFile)) {
      const stat = statSync(cacheFile);
      if (Date.now() - stat.mtimeMs < ttlMs) {
        return readFileSync(cacheFile, 'utf-8').trim();
      }
    }
  } catch {}
  const result = sh(cmd, timeout);
  try { writeFileSync(cacheFile, result); } catch {}
  return result;
}

// ─── ANSI Colors ────────────────────────────────────────────────────────────
const C = {
  cyan:    '\x1b[36m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  red:     '\x1b[31m',
  dim:     '\x1b[2m',
  bold:    '\x1b[1m',
  reset:   '\x1b[0m',
  magenta: '\x1b[35m',
};

// ─── Canon ───────────────────────────────────────────────────────────────────

const GATES = {
  Foundation: { guardian: 'Lyssandria', element: 'Earth',     glyph: '🌿' },
  Flow:       { guardian: 'Leyla',      element: 'Water',     glyph: '💧' },
  Fire:       { guardian: 'Draconia',   element: 'Fire',      glyph: '🔥' },
  Heart:      { guardian: 'Maylinn',    element: 'Heart',     glyph: '💜' },
  Voice:      { guardian: 'Alera',      element: 'Voice',     glyph: '🌟' },
  Sight:      { guardian: 'Lyria',      element: 'Sight',     glyph: '👁' },
  Crown:      { guardian: 'Aiyami',     element: 'Crown',     glyph: '👑' },
  Starweave:  { guardian: 'Elara',      element: 'Starweave', glyph: '🌀' },
  Unity:      { guardian: 'Ino',        element: 'Unity',     glyph: '🤝' },
  Source:     { guardian: 'Shinkami',    element: 'Void',      glyph: '✦'  },
};

const ARC_PHASES = {
  Potential:        { glyph: '◌', label: 'Potential' },
  Manifestation:    { glyph: '◉', label: 'Manifestation' },
  Experience:       { glyph: '●', label: 'Experience' },
  Dissolution:      { glyph: '◎', label: 'Dissolution' },
  EvolvedPotential: { glyph: '✦', label: 'Evolved Potential' },
};

// ─── Arc Phase Detection ────────────────────────────────────────────────────

function getArcPhase(toolCount, dirtyN, elapsedMin, linesAdded, linesRemoved) {
  if (dirtyN <= 2 && elapsedMin > 15 && linesAdded > 20 && toolCount > 10) return ARC_PHASES.EvolvedPotential;
  if (toolCount < 5 && elapsedMin < 8) return ARC_PHASES.Potential;
  if (dirtyN > 12 || elapsedMin > 100) return ARC_PHASES.Dissolution;
  if (toolCount > 35) return ARC_PHASES.Experience;
  return ARC_PHASES.Manifestation;
}

// ─── Dynamic Guardian Routing ───────────────────────────────────────────────

function detectGuardian(lastFiles = '') {
  const f = lastFiles.toLowerCase();
  if (f.includes('supabase') || f.includes('migration') || f.includes('schema'))  return 'Lyssandria';
  if (f.includes('component') || f.includes('design') || f.includes('.css'))       return 'Lyria';
  if (f.includes('book/') || f.includes('lore/') || f.includes('.md'))             return 'Alera';
  if (f.includes('test') || f.includes('spec'))                                     return 'Draconia';
  if (f.includes('agent') || f.includes('swarm') || f.includes('mcp'))             return 'Ino';
  if (f.includes('auth') || f.includes('security'))                                 return 'Aiyami';
  if (f.includes('api') || f.includes('route'))                                     return 'Elara';
  if (f.includes('hook') || f.includes('script'))                                   return 'Elara';
  return 'Shinkami';
}

// ─── Guardian Wisdom ────────────────────────────────────────────────────────

const WISDOM = {
  Shinkami:    { Potential: 'What universe will you speak into being?', Manifestation: 'You are encoding a mythology.', Experience: 'Step back. See the whole pattern.', Dissolution: 'Archive this chapter.', EvolvedPotential: 'The Arc turns. Begin again, evolved.' },
  Lyssandria:  { Potential: 'Feel the ground before building.', Manifestation: 'Each file a stone, each function a foundation.', Experience: 'Is your architecture rooted enough?', Dissolution: 'Commit this season\'s work.', EvolvedPotential: 'New earth, new seeds.' },
  Draconia:   { Potential: 'What transformation begins?', Manifestation: 'Strike while the iron is molten.', Experience: 'Is the flame consuming the right material?', Dissolution: 'Let what is forged cool.', EvolvedPotential: 'The forge is relit with new skill.' },
  Maylinn:    { Potential: 'What matters to people?', Manifestation: 'Empathy you code becomes experience.', Experience: 'Does this work carry the love that began it?', Dissolution: 'Share what you built.', EvolvedPotential: 'Build for others what you could not imagine before.' },
  Alera:      { Potential: 'Know what truth you carry.', Manifestation: 'Clarity of word is clarity of world.', Experience: 'Does it say exactly what you meant?', Dissolution: 'Write a commit message as a gift.', EvolvedPotential: 'Write what you could not articulate before.' },
  Lyria:      { Potential: 'See the whole system first.', Manifestation: 'Trust the vision and execute.', Experience: 'Are you solving the right problem?', Dissolution: 'Capture the vision while clear.', EvolvedPotential: 'What was hidden is now visible.' },
  Aiyami:     { Potential: 'What is the wisest use of this session?', Manifestation: 'The code writes itself through you.', Experience: 'Output or insight — which?', Dissolution: 'Illuminate the path for others.', EvolvedPotential: 'The Crown opens higher.' },
  Elara:      { Potential: 'The right problem, or the obvious one?', Manifestation: 'Something in the universe is different now.', Experience: 'Find the constant after many shifts.', Dissolution: 'Make this commit worth preserving.', EvolvedPotential: 'The old problem looks different.' },
  Ino:        { Potential: 'Who else is affected by today\'s work?', Manifestation: 'Let the swarm think as one.', Experience: 'Connection or separation?', Dissolution: 'Push so creation belongs to everyone.', EvolvedPotential: 'New alliances are possible.' },
  Leyla:      { Potential: 'What wants to flow through you?', Manifestation: 'Do not interrupt creative flow.', Experience: 'Is there a simpler way?', Dissolution: 'Commit what has flowed.', EvolvedPotential: 'The channel lets more water through.' },
};

function getWisdom(guardian, arcLabel) {
  const key = arcLabel.replace(' ', '');
  const g = WISDOM[guardian] ?? WISDOM.Shinkami;
  return g[key] ?? g.Manifestation;
}

// ─── Cached Git Operations ──────────────────────────────────────────────────

function getGitBranch() {
  return cachedSh('branch', 'git rev-parse --abbrev-ref HEAD 2>/dev/null', 60_000, 500) || 'main';
}

function getDirty() {
  const n = parseInt(cachedSh('dirty', 'git status --porcelain 2>/dev/null | grep -v "^??" | wc -l', 15_000, 1000), 10);
  return n || 0;
}

function getLastFiles() {
  return cachedSh('last-files', 'git diff --name-only HEAD 2>/dev/null | head -10', 30_000, 800);
}

function getRepo() {
  try {
    const r = cachedSh('remote-url', 'git remote get-url origin 2>/dev/null', 120_000, 800);
    return r.match(/\/([^/]+?)(?:\.git)?$/)?.[1] ?? 'Arcanea';
  } catch { return 'Arcanea'; }
}

function getLastCommit() {
  return cachedSh('last-commit', 'git log -1 --format="%ar" 2>/dev/null', 30_000, 800);
}

function getCommitsToday() {
  return parseInt(cachedSh('commits-today', 'git log --since=midnight --oneline 2>/dev/null | wc -l', 30_000, 1000), 10) || 0;
}

// ─── Universe Metrics (cached 2 min) ────────────────────────────────────────

function getUniverse() {
  const BASE = process.platform === 'win32' ? 'C:/Users/frank/Arcanea' : '/mnt/c/Users/frank/Arcanea';
  const lore = parseInt(cachedSh('lore-count', `ls ${BASE}/book/*/*.md 2>/dev/null | wc -l`, 120_000, 3000), 10) || 76;
  const agents = parseInt(cachedSh('agents-count', `ls ${BASE}/.claude/agents/ 2>/dev/null | wc -l`, 120_000, 2000), 10) || 65;
  return { lore, agents };
}

// ─── Arcanea Buddy (SIS Integration) ────────────────────────────────────

const BUDDY_ICONS = {
  'ember-wolf': '🔥', 'crystal-stag': '🦌', 'storm-falcon': '🦅', 'void-cat': '🐈‍⬛',
  'ocean-serpent': '🐉', 'stone-guardian': '🪨', 'mist-fox': '🦊', 'tide-bear': '🐻',
  'moss-tortoise': '🐢', 'coral-otter': '🦦', 'phoenix-spark': '🌟', 'flame-drake': '🐲',
  'gale-hummingbird': '🐦', 'abyss-jellyfish': '🪼', 'shadow-raven': '🐦‍⬛', 'starweave-moth': '🦋',
  'kaelith': '🌿', 'veloura': '💧', 'draconis': '🔥', 'laeylinn': '💜', 'otome': '🌟',
  'yumiko': '👁', 'sol': '👑', 'vaelith': '🌀', 'kyuro': '🤝', 'source': '✦',
};

const BUDDY_NAMES = {
  'ember-wolf': 'Ember Wolf', 'crystal-stag': 'Crystal Stag', 'storm-falcon': 'Storm Falcon',
  'void-cat': 'Void Cat', 'ocean-serpent': 'Ocean Serpent', 'stone-guardian': 'Stone Guardian',
  'mist-fox': 'Mist Fox', 'tide-bear': 'Tide Bear', 'moss-tortoise': 'Moss Tortoise',
  'coral-otter': 'Coral Otter', 'phoenix-spark': 'Phoenix Spark', 'flame-drake': 'Flame Drake',
  'gale-hummingbird': 'Gale Hummingbird', 'abyss-jellyfish': 'Abyss Jellyfish',
  'shadow-raven': 'Shadow Raven', 'starweave-moth': 'Starweave Moth',
  'kaelith': 'Kaelith', 'veloura': 'Veloura', 'draconis': 'Draconis', 'laeylinn': 'Laeylinn',
  'otome': 'Otome', 'yumiko': 'Yumiko', 'sol': 'Sol', 'vaelith': 'Vaelith', 'kyuro': 'Kyuro', 'source': 'Source',
};

function getBuddyStatusline() {
  try {
    // Check both legacy /tmp and os.tmpdir() paths
    const paths = [
      '/tmp/arcanea-buddy/state.json',
      `${process.env.TEMP || ''}/arcanea-buddy/state.json`,
      `${process.env.LOCALAPPDATA || ''}/Temp/arcanea-buddy/state.json`,
    ].filter(Boolean);
    const buddyPath = paths.find(p => existsSync(p));
    if (!buddyPath) return '';
    const state = JSON.parse(readFileSync(buddyPath, 'utf-8'));
    if (!state.hatched || state.hidden) return '';
    const icon = BUDDY_ICONS[state.buddyId] || '?';
    const name = BUDDY_NAMES[state.buddyId] || state.buddyId;
    let display = `${icon} ${name}`;
    if (state.godbeastId && state.godbeastId !== state.buddyId) {
      const gbIcon = BUDDY_ICONS[state.godbeastId] || '✦';
      display += `+${gbIcon}`;
    }
    return `${C.green}${display}${C.reset}`;
  } catch { return ''; }
}

// ─── MCP Count ──────────────────────────────────────────────────────────────

function getMcpCount() {
  const projSettings = readJ(process.platform === 'win32'
    ? 'C:/Users/frank/Arcanea/.claude/settings.local.json'
    : '/mnt/c/Users/frank/Arcanea/.claude/settings.local.json');
  const local = (projSettings.enabledMcpjsonServers ?? []).length;
  return local + 5; // +5 for cloud MCPs (Slack, Canva, Vercel, Linear, Miro)
}

// ─── Rate Limit Formatting ──────────────────────────────────────────────────

function fmtRateLimit(pct, resetsAt) {
  if (pct == null) return null;
  const p = Math.round(pct);
  let resetStr = '';
  if (resetsAt) {
    const remaining = Math.max(0, resetsAt * 1000 - Date.now());
    const mins = Math.floor(remaining / 60000);
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    resetStr = hrs > 0 ? ` ${hrs}h${String(m).padStart(2,'0')}m` : ` ${m}m`;
  }
  const color = p >= 80 ? C.red : p >= 50 ? C.yellow : C.green;
  return `${color}${p}%${C.reset}${resetStr}`;
}

// ─── Context Bar ────────────────────────────────────────────────────────────

function contextBar(pct) {
  const p = Math.floor(pct ?? 0);
  const filled = Math.floor(p / 10);
  const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
  const color = p >= 90 ? C.red : p >= 70 ? C.yellow : C.green;
  const warn = p >= 75 ? ' ⚠' : '';
  return `${color}${bar}${C.reset} ${p}%${warn}`;
}

// ─── Duration ───────────────────────────────────────────────────────────────

function duration(ms) {
  if (!ms) return null;
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h${String(m).padStart(2,'0')}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

// ─── Cost ───────────────────────────────────────────────────────────────────

const fmtCost = c => (!c || c < 0.0001) ? null : c >= 1 ? `$${c.toFixed(2)}` : `$${c.toFixed(4)}`;

// ─── Main ───────────────────────────────────────────────────────────────────

function statusline(data) {
  // Parse official Claude Code v5 JSON schema fields
  const model      = data.model?.display_name ?? data.model?.id?.replace('claude-','').split('-20')[0] ?? 'Sonnet';
  const cwd        = data.workspace?.current_dir ?? data.cwd ?? '';
  const branch     = getGitBranch();
  const dirtyN     = getDirty();
  const repo       = getRepo();
  const lastFiles  = getLastFiles();

  // Cost & duration
  const cost       = fmtCost(data.cost?.total_cost_usd);
  const dur        = duration(data.cost?.total_duration_ms);
  const elapsedMin = (data.cost?.total_duration_ms ?? 0) / 60000;
  const linesAdded = data.cost?.total_lines_added ?? 0;
  const linesRemoved = data.cost?.total_lines_removed ?? 0;

  // Context window
  const ctxPct     = data.context_window?.used_percentage;
  const inTok      = data.context_window?.total_input_tokens;
  const outTok     = data.context_window?.total_output_tokens;

  // Tool count approximation from tokens
  const toolCount  = inTok ? Math.floor(inTok / 3000) : 0;

  // Rate limits
  const rl5h       = data.rate_limits?.five_hour;
  const rl7d       = data.rate_limits?.seven_day;

  // Agent/worktree
  const agentName  = data.agent?.name ?? '';
  const worktree   = data.worktree?.name ?? '';

  // Arcanea Intelligence
  const guardian   = detectGuardian(lastFiles);
  const gateInfo   = Object.values(GATES).find(g => g.guardian === guardian) ?? GATES.Source;
  const gateName   = Object.entries(GATES).find(([,v]) => v.guardian === guardian)?.[0] ?? 'Source';
  const arc        = getArcPhase(toolCount, dirtyN, elapsedMin, linesAdded, linesRemoved);
  const universe   = getUniverse();
  const mcpCount   = getMcpCount();
  const commits    = getCommitsToday();
  const lastCommit = getLastCommit();
  const wisdom     = getWisdom(guardian, arc.label);

  // Arcanea Buddy (SIS integration)
  const buddyDisplay = getBuddyStatusline();

  // ── Line 1: Brand + Model + Buddy + Guardian + Arc ──────────────────────
  const parts1 = [
    `${C.cyan}${C.bold}Arcanea${C.reset}`,
    `${C.magenta}${model}${C.reset}`,
  ];
  if (buddyDisplay) parts1.push(buddyDisplay);
  parts1.push(`${guardian} ${gateInfo.glyph}`);
  parts1.push(`${arc.glyph} ${arc.label}`);
  if (cost) parts1.push(`${C.yellow}${cost}${C.reset}`);
  if (agentName) parts1.push(`🤖 ${agentName}`);

  // ── Line 2: Repo + Context + Velocity ────────────────────────────────────
  const dirty = dirtyN > 0 ? `${C.yellow} ●${dirtyN}${C.reset}` : '';
  const parts2 = [
    `⎇ ${repo}/${branch}${dirty}`,
  ];

  if (ctxPct != null) parts2.push(contextBar(ctxPct));

  if (linesAdded > 0 || linesRemoved > 0) {
    const net = linesAdded - linesRemoved;
    parts2.push(`${C.green}+${linesAdded}${C.reset}/${C.red}-${linesRemoved}${C.reset}`);
  }

  parts2.push(`📖${universe.lore} 🤖${universe.agents} ⚙${mcpCount}`);

  // ── Line 3: Momentum + Rate Limits ───────────────────────────────────────
  const parts3 = [];
  if (commits > 0) parts3.push(`📝 ${commits}`);
  if (dur) parts3.push(`⏱ ${dur}`);
  if (inTok) parts3.push(`↑${fmt(inTok)}`);
  if (outTok) parts3.push(`↓${fmt(outTok)}`);

  const rl5hStr = fmtRateLimit(rl5h?.used_percentage, rl5h?.resets_at);
  const rl7dStr = fmtRateLimit(rl7d?.used_percentage, rl7d?.resets_at);
  if (rl5hStr) parts3.push(`5h:${rl5hStr}`);
  if (rl7dStr) parts3.push(`7d:${rl7dStr}`);

  if (lastCommit) parts3.push(`${C.dim}last: ${lastCommit}${C.reset}`);
  if (worktree) parts3.push(`🌿 ${worktree}`);

  // ── Line 4: Guardian Wisdom ──────────────────────────────────────────────
  const wisdomLine = `${C.dim}⟡ ${guardian} · ${gateName}: "${wisdom}"${C.reset}`;

  const lines = [
    parts1.join('  │  '),
    parts2.join('  │  '),
  ];
  if (parts3.length > 0) lines.push(parts3.join('  │  '));
  lines.push(wisdomLine);

  return lines.join('\n');
}

// ─── Stdin Reader (Claude Code v5 JSON schema) ─────────────────────────────

let input = '';
process.stdin.setEncoding('utf-8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    console.log(statusline(data));
  } catch {
    // Fallback: minimal output
    console.log(`${C.cyan}Arcanea${C.reset}  │  Shinkami ✦  │  ◌ Potential`);
  }
});

// Handle no stdin (pipe closed immediately)
setTimeout(() => {
  if (!input) {
    console.log(`${C.cyan}Arcanea${C.reset}  │  Shinkami ✦  │  ◌ Potential`);
    process.exit(0);
  }
}, 3000);
