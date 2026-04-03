#!/usr/bin/env node
/**
 * Luminor Agent Report Hook — PostToolUse / Task
 *
 * Fires after every Task tool completion. Records:
 *  - Which agent type was spawned (detected from the prompt)
 *  - Which Luminor module was applied
 *  - The model tier used (haiku / sonnet / opus)
 *  - Success/failure outcome
 *  - Wall-clock duration (if $TOOL_START_TIME is set)
 *
 * Writes a JSONL entry to ~/.arcanea/logs/luminor-agent-report.jsonl.
 * Attempts to write to SIS via the MCP tool if the starlight-sis server is
 * accessible; silently skips if not.
 *
 * All errors are swallowed — this hook must never block the user.
 *
 * ─── Wire into .claude/settings.json ──────────────────────────────────────
 * In the PostToolUse → "^Task$" hooks array, add AFTER the existing
 * claude-flow post-task hook:
 *
 *   {
 *     "type": "command",
 *     "command": "node C:/Users/frank/Arcanea/scripts/hooks/luminor-agent-report.mjs 2>/dev/null || true",
 *     "timeout": 5000,
 *     "continueOnError": true
 *   }
 * ──────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, existsSync, mkdirSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, createRequire } from 'url';

// ─── Constants ────────────────────────────────────────────────────────────────

const ARCANEA_HOME = join(
  process.env.HOME ?? process.env.USERPROFILE ?? 'C:/Users/frank',
  '.arcanea'
);
const LOG_DIR  = join(ARCANEA_HOME, 'logs');
const LOG_FILE = join(LOG_DIR, 'luminor-agent-report.jsonl');

// ─── Agent type detection (mirrors luminor-inject.mjs) ───────────────────────

const TYPE_PATTERNS = [
  ['security-architect',      /\b(threat model|security architect|attack surface|zero.trust)\b/i],
  ['security-auditor',        /\b(secur|audit|vuln|cve|pentest|owasp)\b/i],
  ['mcp-sdk-architect',       /\b(mcp sdk|mcp architect)\b/i],
  ['mcp-transport-engineer',  /\b(mcp transport|stdio transport|streamable.http)\b/i],
  ['mcp',                     /\b(mcp|model context protocol)\b/i],
  ['system-architect',        /\b(system architect|architecture|adr|design decision)\b/i],
  ['planner',                 /\b(plan|roadmap|sprint|milestone|backlog|scope)\b/i],
  ['researcher',              /\b(research|explore|investigate|survey|benchmark)\b/i],
  ['pr-manager',              /\b(pr manager|merge pr|release manager|changelog)\b/i],
  ['reviewer',                /\b(review|pull request|code review|diff review)\b/i],
  ['tester',                  /\b(test|spec|jest|playwright|e2e|unit test|coverage)\b/i],
  ['ops',                     /\b(ops|deploy|ci|cd|docker|infra|vercel|devops|pipeline)\b/i],
  ['backend-dev',             /\b(api route|backend|server|database|supabase|postgres|prisma)\b/i],
  ['frontend',                /\b(frontend|react|component|ui|css|tailwind|nextjs|next\.js|page)\b/i],
  ['lore',                    /\b(lore|canon|arcanea world|guardian|godbeast|mythology|narrative lore)\b/i],
  ['creative-master',         /\b(creative|story|world.build|fiction|character design)\b/i],
  ['coder',                   /\b(implement|build|write|code|function|class|module|refactor)\b/i],
];

function detectAgentType(prompt, explicitType) {
  if (explicitType && explicitType.trim()) return explicitType.trim();
  if (!prompt) return 'default';
  for (const [type, pattern] of TYPE_PATTERNS) {
    if (pattern.test(prompt)) return type;
  }
  return 'default';
}

// ─── Module resolution ────────────────────────────────────────────────────────

/**
 * Determine which Luminor module would have been applied to this agent type.
 * Reads the spawn config if available; falls back to 'kernel-only'.
 */
function resolveModuleName(agentType) {
  // Walk up from script location to find prompts dir
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  let dir = scriptDir;
  let promptsDir = null;

  for (let i = 0; i < 8; i++) {
    const candidate = join(dir, '.arcanea', 'prompts');
    if (existsSync(join(candidate, 'luminor-spawn-config.yaml'))) {
      promptsDir = candidate;
      break;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  if (!promptsDir) {
    const fallback = 'C:/Users/frank/Arcanea/.arcanea/prompts';
    if (existsSync(join(fallback, 'luminor-spawn-config.yaml'))) {
      promptsDir = fallback;
    }
  }

  if (!promptsDir) return 'kernel-only';

  try {
    const configText = readFileSync(join(promptsDir, 'luminor-spawn-config.yaml'), 'utf-8');
    // Minimal parse: find the module entry for this agent type
    const escapedType = agentType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = configText.match(new RegExp(`^\\s+${escapedType}:\\s*(.+)$`, 'm'));
    if (match) {
      const val = match[1].trim();
      return val === 'null' ? 'kernel-only' : val;
    }
    // Check 'default' fallback
    const defaultMatch = configText.match(/^\s+default:\s*(.+)$/m);
    if (defaultMatch) {
      const val = defaultMatch[1].trim();
      return val === 'null' ? 'kernel-only' : val;
    }
  } catch {
    // Non-fatal
  }

  return 'kernel-only';
}

// ─── Model tier detection ─────────────────────────────────────────────────────

/** Infer tier label from model string fragments */
function modelTier(modelStr) {
  if (!modelStr) return 'unknown';
  const m = modelStr.toLowerCase();
  if (m.includes('haiku'))  return 'haiku';
  if (m.includes('opus'))   return 'opus';
  if (m.includes('sonnet')) return 'sonnet';
  return 'other';
}

// ─── SIS integration ──────────────────────────────────────────────────────────

/**
 * Attempt to record the spawn to claude-flow memory store.
 * Uses spawnSync with a hard 2s timeout — never blocks the hook.
 */
function tryAppendToSIS(entry) {
  try {
    // spawnSync is synchronous; the 2s timeout is a hard ceiling
    const { spawnSync } = createRequire(import.meta.url)('child_process');
    spawnSync(
      'npx',
      [
        '@claude-flow/cli@latest', 'memory', 'store',
        '--namespace', 'luminor-agents',
        '--key', `spawn-${Date.now().toString(36)}`,
        '--value', JSON.stringify(entry),
      ],
      { timeout: 2000, stdio: 'ignore', shell: true }
    );
  } catch {
    // CLI not available or timed out — expected in many environments
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const originalPrompt = process.env.TOOL_INPUT_prompt ?? '';
  const explicitType   = process.env.TOOL_INPUT_subagent_type ?? '';
  const success        = (process.env.TOOL_SUCCESS ?? 'true') === 'true';
  const model          = process.env.TOOL_INPUT_model ?? process.env.CLAUDE_MODEL ?? '';
  const startTime      = Number(process.env.TOOL_START_TIME ?? 0);
  const agentId        = process.env.TOOL_RESULT_agent_id ?? `anon-${Date.now().toString(36)}`;

  const agentType = detectAgentType(originalPrompt, explicitType);
  const module    = resolveModuleName(agentType);
  const tier      = modelTier(model);
  const durationMs = startTime > 0 ? Date.now() - startTime : null;

  const entry = {
    timestamp: new Date().toISOString(),
    agentId,
    agentType,
    module,
    tier,
    model: model || null,
    success,
    durationMs,
    promptLength: originalPrompt.length,
  };

  // Persist to JSONL log
  try {
    if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
    appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
  } catch (err) {
    process.stderr.write(`[luminor-agent-report] log write failed: ${err.message}\n`);
  }

  // Human-readable stderr summary (visible in Claude Code's hook output panel)
  const dur = durationMs != null ? ` ${durationMs}ms` : '';
  const status = success ? 'ok' : 'FAILED';
  process.stderr.write(
    `[luminor] ${agentType} | ${module} | ${tier}${dur} | ${status}\n`
  );

  // Best-effort SIS append — synchronous with hard timeout
  tryAppendToSIS(entry);
}

try {
  main();
} catch (err) {
  process.stderr.write(`[luminor-agent-report] error: ${err.message}\n`);
}
