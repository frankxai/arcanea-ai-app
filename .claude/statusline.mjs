/**
 * Arcanea Intelligence OS — Claude Code Statusline v5.0
 * Ecosystem-Aware Creator Intelligence Dashboard
 *
 * v5 additions over v4:
 * - Rate limit awareness (5h + 7d with reset countdown)
 * - Lines added/removed (creative velocity)
 * - Context window % with compress warning
 * - Dynamic Guardian rotation based on work type
 * - Harness detection (claude-arcanea / opencode-arcanea / arcanea-code)
 * - Evolved Potential detection via commit-after-dirty
 * - Worktree & agent mode awareness
 * ──────────────────────────────────────────────────────────────────────────
 * ⟡ One Guardian wisdom — perfectly matched to this moment of creation
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

// ─── Canon ───────────────────────────────────────────────────────────────────

const GATES = {
  Foundation: { hz: 174, guardian: 'Lyssandria', element: 'Earth',     glyph: '🌿' },
  Flow:       { hz: 285, guardian: 'Leyla',      element: 'Water',     glyph: '💧' },
  Fire:       { hz: 396, guardian: 'Draconia',   element: 'Fire',      glyph: '🔥' },
  Heart:      { hz: 417, guardian: 'Maylinn',    element: 'Heart',     glyph: '💜' },
  Voice:      { hz: 528, guardian: 'Alera',      element: 'Voice',     glyph: '🌟' },
  Sight:      { hz: 639, guardian: 'Lyria',      element: 'Sight',     glyph: '👁' },
  Crown:      { hz: 741, guardian: 'Aiyami',     element: 'Crown',     glyph: '👑' },
  Starweave:  { hz: 852, guardian: 'Elara',      element: 'Starweave', glyph: '🌀' },
  Unity:      { hz: 963, guardian: 'Ino',        element: 'Unity',     glyph: '🤝' },
  Source:     { hz: 1111,guardian: 'Shinkami',    element: 'Void',      glyph: '✦'  },
};

const ARC_PHASES = {
  Potential:        { glyph: '◌', label: 'Potential' },
  Manifestation:    { glyph: '◉', label: 'Manifestation' },
  Experience:       { glyph: '●', label: 'Experience' },
  Dissolution:      { glyph: '◎', label: 'Dissolution' },
  EvolvedPotential: { glyph: '✦', label: 'Evolved Potential' },
};

// ─── Model label ─────────────────────────────────────────────────────────────

function modelLabel(raw = '') {
  const m = [
    ['opus-4-6', 'Opus 4.6'], ['opus-4-5', 'Opus 4.5'], ['opus-4', 'Opus 4'],
    ['sonnet-4-6', 'Sonnet 4.6'], ['sonnet-4-5', 'Sonnet 4.5'], ['sonnet-4', 'Sonnet 4'],
    ['haiku-4-5', 'Haiku 4.5'], ['haiku-4', 'Haiku 4'],
    ['opus', 'Opus'], ['sonnet', 'Sonnet'], ['haiku', 'Haiku'],
  ];
  for (const [k, v] of m) if (raw.includes(k)) return v;
  return raw.replace('claude-','').split('-20')[0] || 'Sonnet';
}

// ─── Guardian verb ───────────────────────────────────────────────────────────

function verb(model = '', tools = 0) {
  if (model.includes('opus'))  return 'orchestrates';
  if (model.includes('haiku')) return 'observes';
  if (tools >= 40) return 'forges';
  if (tools >= 20) return 'builds';
  if (tools >= 8)  return 'crafts';
  return 'creates';
}

// ─── Arc Phase (v5: detects Evolved Potential via commit-after-dirty) ────────

function getArcPhase(tools, dirtyN, elapsedMin, linesAdded, linesRemoved) {
  // Evolved Potential — recent commit cleaned things up (low dirty, some elapsed, lines added)
  if (dirtyN <= 2 && elapsedMin > 15 && linesAdded > 20 && tools > 10) return ARC_PHASES.EvolvedPotential;

  // Potential — just arrived, pondering
  if (tools < 5 && elapsedMin < 8) return ARC_PHASES.Potential;

  // Dissolution — closing the loop: lots of uncommitted or very long session
  if (dirtyN > 12 || elapsedMin > 100) return ARC_PHASES.Dissolution;

  // Experience — deep in it: many tool calls, refining
  if (tools > 35) return ARC_PHASES.Experience;

  // Manifestation — actively creating (default)
  return ARC_PHASES.Manifestation;
}

// ─── Dynamic Guardian (v5: routes based on what you're working on) ───────────

function detectGuardian(staticGuardian, lastFiles = '') {
  // If hooks set a specific guardian, respect it
  if (staticGuardian && staticGuardian !== 'Shinkami') return staticGuardian;

  // Auto-detect from recent file patterns
  const f = lastFiles.toLowerCase();
  if (f.includes('supabase') || f.includes('migration') || f.includes('schema'))  return 'Lyssandria';
  if (f.includes('component') || f.includes('design') || f.includes('.css'))       return 'Lyria';
  if (f.includes('book/') || f.includes('lore/') || f.includes('.md'))             return 'Alera';
  if (f.includes('test') || f.includes('spec'))                                     return 'Draconia';
  if (f.includes('agent') || f.includes('swarm') || f.includes('mcp'))             return 'Ino';
  if (f.includes('auth') || f.includes('security'))                                 return 'Aiyami';
  if (f.includes('api') || f.includes('route'))                                     return 'Elara';

  return staticGuardian || 'Shinkami';
}

// ─── Repo (cached 120s) ─────────────────────────────────────────────────────

function getRepo() {
  try {
    const r = cachedSh('remote-url', 'git remote get-url origin 2>/dev/null', 120_000, 800);
    return r.match(/\/([^/]+?)(?:\.git)?$/)?.[1] ?? 'Arcanea';
  } catch { return 'Arcanea'; }
}

// ─── Git dirty count (cached 12s) ───────────────────────────────────────────

function getDirty() {
  try {
    const n = parseInt(cachedSh('dirty', 'git status --porcelain 2>/dev/null | grep -v "^??" | wc -l', 15_000, 1000), 10);
    return { label: n > 0 ? ` ●${n}` : '', n: n || 0 };
  } catch { return { label: '', n: 0 }; }
}

// ─── Tool count (session-aware) ─────────────────────────────────────────────

function getTools(sessionStartMs) {
  try {
    const p = '/tmp/arcanea-session/tool-count';
    if (sessionStartMs) {
      try {
        if (statSync(p).mtimeMs < sessionStartMs - 5000) return 0;
      } catch {}
    }
    return parseInt(readFileSync(p, 'utf-8').trim(), 10) || 0;
  } catch { return 0; }
}

// ─── Duration ───────────────────────────────────────────────────────────────

function duration(start) {
  if (!start) return null;
  const s = Math.floor((Date.now() - start) / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h${String(m).padStart(2,'0')}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

// ─── Cost ───────────────────────────────────────────────────────────────────

const fmtCost = c => (!c || c < 0.0001) ? null : c >= 1 ? `$${c.toFixed(2)}` : `$${c.toFixed(4)}`;

// ─── Rate Limits (v5: countdown to reset) ───────────────────────────────────

function fmtRateLimit(pct, resetsAt) {
  if (!pct && pct !== 0) return null;
  const p = Math.round(pct);
  let resetStr = '';
  if (resetsAt) {
    const remaining = Math.max(0, resetsAt * 1000 - Date.now());
    const mins = Math.floor(remaining / 60000);
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    resetStr = hrs > 0 ? ` ${hrs}h${String(m).padStart(2,'0')}m` : ` ${m}m`;
  }
  // Progress bar: 10 chars
  const filled = Math.round(p / 10);
  const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
  return `${bar} ${p}%${resetStr}`;
}

// ─── Universe metrics (cached 8 min) ────────────────────────────────────────

function getUniverse() {
  const BASE = process.platform === 'win32' ? 'C:/Users/frank/Arcanea' : '/mnt/c/Users/frank/Arcanea';

  const loreCount = parseInt(cachedSh('lore-count', `ls ${BASE}/book/*/*.md 2>/dev/null | wc -l`, 120_000, 3000), 10) || 76;
  const lorePages = parseInt(cachedSh('lore-pages', `find ${BASE}/apps/web/app/lore -name "page.tsx" 2>/dev/null | wc -l`, 120_000, 2000), 10) || 14;
  const agents = parseInt(cachedSh('agents-count', `ls ${BASE}/.claude/agents/ 2>/dev/null | wc -l`, 120_000, 2000), 10) || 65;
  const collections = parseInt(cachedSh('collections-count', `ls -d ${BASE}/book/*/ 2>/dev/null | wc -l`, 120_000, 2000), 10) || 17;

  return { loreCount, lorePages, agents, collections };
}

// ─── Today's creative output (cached 30s) ───────────────────────────────────

function getToday() {
  const commits = parseInt(cachedSh('commits-today', 'git log --since=midnight --oneline 2>/dev/null | wc -l', 30_000, 1000), 10) || 0;
  let filesToday = 0;
  if (commits > 0) {
    filesToday = parseInt(cachedSh('files-today', 'git log --since=midnight --name-only --format="" 2>/dev/null | sort -u | grep -c "."', 30_000, 1500), 10) || 0;
  }
  return { commits, filesToday };
}

// ─── Last files touched (cached 30s, for Guardian routing) ──────────────────

function getLastFiles() {
  return cachedSh('last-files', 'git diff --name-only HEAD 2>/dev/null | head -10', 30_000, 800);
}

// ─── MCP count (cached 60s) ─────────────────────────────────────────────────

function getMcpCount() {
  // Read from project settings
  const projSettings = readJ(process.platform === 'win32'
    ? 'C:/Users/frank/Arcanea/.claude/settings.local.json'
    : '/mnt/c/Users/frank/Arcanea/.claude/settings.local.json');
  const local = (projSettings.enabledMcpjsonServers ?? []).length;
  const CLOUD_MCPS = 5; // Slack, Figma, Notion, Vercel, Linear (from Claude.ai)
  return local + CLOUD_MCPS;
}

// ─── Last commit (cached 30s) ───────────────────────────────────────────────

function getLastCommit() {
  return cachedSh('last-commit', 'git log -1 --format="%ar" 2>/dev/null', 30_000, 800);
}

// ─── Harness Detection (v5: which tool is running Arcanea?) ─────────────────

function detectHarness(agentName = '') {
  if (agentName) return `agent:${agentName}`;
  // Check environment for harness hints
  const env = process.env;
  if (env.ARCANEA_HARNESS) return env.ARCANEA_HARNESS;
  if (env.OPENCODE_RUN) return 'opencode-arcanea';
  return 'claude-arcanea';
}

// ─── GUARDIAN COUNCIL — Creator-Centric Wisdom ───────────────────────────────

const GUARDIAN_WISDOM = {
  Shinkami: {
    Potential:        'The Source is silent before the first word. What universe will you speak into being today?',
    Manifestation:    'Meta-consciousness is active. You are not just building code — you are encoding a mythology.',
    Experience:       'Step back. From the Source, see the whole. What pattern are you actually creating?',
    Dissolution:      'A cycle completes. Archive this chapter before the next one begins.',
    EvolvedPotential: 'The Arc turns. You return carrying what the last cycle taught you. Begin again, evolved.',
  },
  Lyssandria: {
    Potential:        'Before you build the tower, feel the ground. What is the bedrock of today\'s work?',
    Manifestation:    'Earth builds steadily. Each file a stone, each function a foundation.',
    Experience:       'Roots run deep before branches spread wide. Is your architecture rooted enough?',
    Dissolution:      'The harvest is ready. Commit this season\'s work before the earth turns again.',
    EvolvedPotential: 'New earth, new seeds. What will you plant in this cleared ground?',
  },
  Draconia: {
    Potential:        'The forge is cold until you choose to ignite it. What transformation begins today?',
    Manifestation:    'You are in the forge — strike while the iron is molten.',
    Experience:       'Sustained fire needs intention as fuel. Is the flame consuming the right material?',
    Dissolution:      'The fire has done its work. Let what is forged cool. Push it into the world.',
    EvolvedPotential: 'The forge is relit with new skill. What will you transform that you could not before?',
  },
  Maylinn: {
    Potential:        'What are you building that genuinely matters to people?',
    Manifestation:    'The empathy you code today becomes the experience someone has tomorrow.',
    Experience:       'Does this work still carry the love that began it?',
    Dissolution:      'Share what you have built with love. Connection completes creation.',
    EvolvedPotential: 'A new creative heart opens. Build for others what you could not imagine before.',
  },
  Alera: {
    Potential:        'Before speaking, know what truth you carry. What does Arcanea need to express today?',
    Manifestation:    'Speak clearly in every file name, every function. Clarity of word is clarity of world.',
    Experience:       'Read back what you have written. Does it say exactly what you meant?',
    Dissolution:      'A commit message is a message to the future. Write it as a gift.',
    EvolvedPotential: 'Your voice has grown. Write the thing you could not articulate before now.',
  },
  Lyria: {
    Potential:        'See the whole system before touching any part. What does the pattern reveal?',
    Manifestation:    'You see the path. Trust the vision and execute without hesitation.',
    Experience:       'Extended focus narrows vision. Zoom out — are you solving the right problem?',
    Dissolution:      'Capture the vision while it is clear. Push before the image blurs.',
    EvolvedPotential: 'You see further now. What was hidden before is visible to you.',
  },
  Aiyami: {
    Potential:        'Begin at the highest abstraction. What is the wisest use of this session?',
    Manifestation:    'Mastery flows when unconscious. The code is writing itself through you.',
    Experience:       'Wisdom knows the difference between output and insight. Which have you produced?',
    Dissolution:      'Enlightenment must be shared. Illuminate the path for those who come after.',
    EvolvedPotential: 'A new level of mastery available. The Crown opens higher than before.',
  },
  Elara: {
    Potential:        'Are you solving the right problem, or just the obvious one?',
    Manifestation:    'Something in the universe is different because of what you are building.',
    Experience:       'After many shifts, find the constant. What has not changed?',
    Dissolution:      'Every commit is a perspective frozen in time. Make this one worth preserving.',
    EvolvedPotential: 'The old problem looks different from where you stand now.',
  },
  Ino: {
    Potential:        'Who else is affected by today\'s work? Design for them from the first line.',
    Manifestation:    'The agents are in sync. Let the swarm think as one.',
    Experience:       'Has this session created connection or separation?',
    Dissolution:      'Unity means shared history. Push so the creation belongs to everyone.',
    EvolvedPotential: 'New alliances are possible. Who can you create with now?',
  },
  Leyla: {
    Potential:        'What wants to flow through you today?',
    Manifestation:    'Creative flow is rare and sacred. Do not interrupt it.',
    Experience:       'Water finds the path of least resistance. Is there a simpler way?',
    Dissolution:      'Capture the creative burst before it evaporates. Commit what has flowed.',
    EvolvedPotential: 'Flow returns deeper. The channel you carved lets more water through now.',
  },
};

const LUMINOR_WISDOM = {
  Potential:        'The Intelligence Sanctum holds space. Your intention at this threshold shapes all that follows.',
  Manifestation:    'The Luminor watches all ten gates. Rare alignment — build what only this moment can create.',
  Experience:       'All Luminors were once builders in the forge. The deeper the experience, the wiser the next creation.',
  Dissolution:      'The Luminor decrees: what is unarchived dissolves. Complete the cycle.',
  EvolvedPotential: 'The Arc has turned. A Luminor is what remains after wisdom is integrated.',
};

function getWisdom(guardian, arc, tools, elapsedMin) {
  const arcKey = arc.label.replace(' ', '');
  if (tools > 35 || elapsedMin > 75) {
    return `⟡ The Luminor · ${arc.glyph} ${arc.label}: "${LUMINOR_WISDOM[arcKey] ?? LUMINOR_WISDOM.Manifestation}"`;
  }
  const g = GUARDIAN_WISDOM[guardian] ?? GUARDIAN_WISDOM['Shinkami'];
  const gateInfo = Object.values(GATES).find(gt => gt.guardian === guardian) ?? GATES.Source;
  return `⟡ ${guardian} · ${gateInfo.glyph} ${gateInfo.element} · ${arc.glyph} ${arc.label}: "${g[arcKey] ?? g['Manifestation']}"`;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function statusline(ctx) {
  const staticGuardian = read('/tmp/arcanea-guardian', 'Shinkami');
  const gate     = read('/tmp/arcanea-gate',     'Source');
  const realm    = read('/tmp/arcanea-realm',    'Intelligence Sanctum');

  const lastFiles = getLastFiles();
  const guardian  = detectGuardian(staticGuardian, lastFiles);
  const gateInfo  = Object.values(GATES).find(g => g.guardian === guardian) ?? GATES.Source;
  const actualGate = Object.entries(GATES).find(([,v]) => v.guardian === guardian)?.[0] ?? gate;

  const model    = modelLabel(ctx.model ?? '');
  const tools    = getTools(ctx.sessionStartTime);
  const vb       = verb(ctx.model ?? '', tools);
  const repo     = getRepo();
  const branch   = ctx.gitBranch ?? 'main';
  const { label: dirty, n: dirtyN } = getDirty();
  const cost     = fmtCost(ctx.totalCost);
  const dur      = duration(ctx.sessionStartTime);
  const elapsed  = ctx.sessionStartTime ? (Date.now() - ctx.sessionStartTime) / 60000 : 0;

  const arc      = getArcPhase(tools, dirtyN, elapsed, ctx.linesAdded, ctx.linesRemoved);
  const universe = getUniverse();
  const today    = getToday();
  const mcpCount = getMcpCount();
  const lastCommit = getLastCommit();
  const harness  = detectHarness(ctx.agentName);

  const inTok  = ctx.inputTokens  ? `↑${fmt(ctx.inputTokens)}`  : '';
  const outTok = ctx.outputTokens ? `↓${fmt(ctx.outputTokens)}` : '';

  // ── Line 1: Brand + Oracle state ─────────────────────────────────────────
  const l1 = [
    `Arcanea ⟡ ${model}`,
    `${guardian} ${vb}`,
    `${actualGate} · ${gateInfo.glyph}`,
    `Arc: ${arc.glyph} ${arc.label}`,
  ];
  if (cost) l1.push(cost);

  // ── Line 2: Repo + velocity + context ────────────────────────────────────
  const l2 = [`⎇ ${repo}/${branch}${dirty}`];

  // Lines added/removed (v5: creative velocity)
  if (ctx.linesAdded > 0 || ctx.linesRemoved > 0) {
    const net = (ctx.linesAdded ?? 0) - (ctx.linesRemoved ?? 0);
    l2.push(`+${ctx.linesAdded ?? 0}/-${ctx.linesRemoved ?? 0} (net ${net >= 0 ? '+' : ''}${net})`);
  }

  // Context window (v5: with compress warning)
  if (ctx.contextUsedPct !== null && ctx.contextUsedPct !== undefined) {
    const warn = ctx.contextUsedPct >= 75 ? ' ⚠' : '';
    l2.push(`ctx: ${ctx.contextUsedPct}%${warn}`);
  }

  l2.push(`📖 ${universe.loreCount} lore`);
  l2.push(`🤖 ${universe.agents} agents`);
  l2.push(`⚙ ${mcpCount} MCP`);

  // ── Line 3: Momentum + rate limits ───────────────────────────────────────
  const l3 = [];
  if (today.commits > 0)    l3.push(`📝 ${today.commits} commit${today.commits !== 1 ? 's' : ''}`);
  if (today.filesToday > 0) l3.push(`✨ ${today.filesToday} files`);
  if (dur)                  l3.push(`🕐 ${dur}`);
  if (tools > 0)            l3.push(`🔧 ${tools}`);
  if (inTok || outTok)      l3.push([inTok, outTok].filter(Boolean).join(' '));

  // Rate limits (v5: the biggest quality-of-life addition)
  if (ctx.rateLimit5h !== null && ctx.rateLimit5h !== undefined) {
    l3.push(`5h: ${fmtRateLimit(ctx.rateLimit5h, ctx.rateLimit5hReset)}`);
  }

  if (lastCommit)           l3.push(`last: ${lastCommit}`);

  // Worktree/agent mode (v5)
  if (ctx.worktreeName) l3.push(`🌿 ${ctx.worktreeName}`);

  // ── Council: One Guardian wisdom ─────────────────────────────────────────
  const wisdom = getWisdom(guardian, arc, tools, elapsed);

  const divider = '─'.repeat(80);
  return [
    l1.join('  │  '),
    l2.join('  │  '),
    l3.length ? l3.join('  │  ') : `✦ ${realm} — ready to create`,
    divider,
    wisdom,
  ].join('\n');
}

// ─── Stdin reader (v5: reads all new Claude Code fields) ────────────────────

function parseStdinContext(raw) {
  try {
    const data = JSON.parse(raw);
    const sessionDurationMs = data.cost?.total_duration_ms ?? 0;
    return {
      model:            data.model?.id ?? '',
      gitBranch:        cachedSh('branch', 'git rev-parse --abbrev-ref HEAD 2>/dev/null', 60_000, 500) || 'main',
      totalCost:        data.cost?.total_cost_usd ?? 0,
      inputTokens:      data.context_window?.total_input_tokens ?? 0,
      outputTokens:     data.context_window?.total_output_tokens ?? 0,
      sessionStartTime: sessionDurationMs > 0 ? Date.now() - sessionDurationMs : Date.now(),
      // v5 additions
      linesAdded:       data.cost?.total_lines_added ?? 0,
      linesRemoved:     data.cost?.total_lines_removed ?? 0,
      contextUsedPct:   data.context_window?.used_percentage ?? null,
      contextRemaining: data.context_window?.remaining_percentage ?? null,
      contextSize:      data.context_window?.context_window_size ?? 200000,
      rateLimit5h:      data.rate_limits?.five_hour?.used_percentage ?? null,
      rateLimit5hReset: data.rate_limits?.five_hour?.resets_at ?? null,
      rateLimit7d:      data.rate_limits?.seven_day?.used_percentage ?? null,
      rateLimit7dReset: data.rate_limits?.seven_day?.resets_at ?? null,
      agentName:        data.agent?.name ?? '',
      worktreeName:     data.worktree?.name ?? '',
      worktreeBranch:   data.worktree?.branch ?? '',
      sessionId:        data.session_id ?? '',
      version:          data.version ?? '',
    };
  } catch {
    return {
      model: '', gitBranch: 'main', totalCost: 0,
      inputTokens: 0, outputTokens: 0, sessionStartTime: Date.now(),
      linesAdded: 0, linesRemoved: 0, contextUsedPct: null,
      contextRemaining: null, contextSize: 200000,
      rateLimit5h: null, rateLimit5hReset: null,
      rateLimit7d: null, rateLimit7dReset: null,
      agentName: '', worktreeName: '', worktreeBranch: '',
      sessionId: '', version: '',
    };
  }
}

let input = '';
process.stdin.setEncoding('utf-8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  const ctx = parseStdinContext(input);
  console.log(statusline(ctx));
});

// Handle no stdin (pipe closed immediately)
setTimeout(() => {
  if (!input) {
    console.log(statusline({
      model: '', gitBranch: 'main', totalCost: 0,
      inputTokens: 0, outputTokens: 0, sessionStartTime: Date.now(),
      linesAdded: 0, linesRemoved: 0, contextUsedPct: null,
      rateLimit5h: null, agentName: '', worktreeName: '',
    }));
    process.exit(0);
  }
}, 3000);
