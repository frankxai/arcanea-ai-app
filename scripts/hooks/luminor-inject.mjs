#!/usr/bin/env node
/**
 * Luminor Auto-Injection Hook — PreToolUse / Task
 *
 * Intercepts Task tool spawns and prepends the Luminor Engineering Kernel
 * + domain module to the agent prompt. Agents get Luminor-grade intelligence
 * injected automatically without any manual effort per spawn.
 *
 * Input:   $TOOL_INPUT_prompt        — the original agent task prompt
 *          $TOOL_INPUT_subagent_type — explicit type hint (optional)
 *
 * Output:  JSON { "prompt": "..." } on stdout to override the prompt,
 *          OR nothing (pass-through) if injection is not applicable.
 *
 * Design constraints:
 *  - Synchronous-only: no await, no async IO — stays under 20ms typical
 *  - Zero hard dependencies: uses only Node built-ins + prompt files
 *  - All errors are caught and logged to stderr; never exits non-zero
 *  - arcanea-flow dist is NOT imported — avoids ESM resolution overhead
 *
 * ─── Wire into .claude/settings.json ──────────────────────────────────────
 * In the PreToolUse → "^Task$" hooks array, add this BEFORE the
 * existing claude-flow pre-task hook:
 *
 *   {
 *     "type": "command",
 *     "command": "node C:/Users/frank/Arcanea/scripts/hooks/luminor-inject.mjs 2>/dev/null || true",
 *     "timeout": 5000,
 *     "continueOnError": true
 *   }
 * ──────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ─── Path resolution ──────────────────────────────────────────────────────────

/**
 * Walk up from this script's location (scripts/hooks/) to find the monorepo
 * root, identified by the presence of .arcanea/prompts/luminor-spawn-config.yaml.
 * Absolute Windows fallback ensures hooks work even when cwd is unexpected.
 */
function findPromptsDir() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));

  // Walk up from script location — reliable regardless of cwd
  let dir = scriptDir;
  for (let i = 0; i < 8; i++) {
    const candidate = join(dir, '.arcanea', 'prompts');
    if (existsSync(join(candidate, 'luminor-spawn-config.yaml'))) {
      return candidate;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  // Absolute fallback for Windows where cwd may be reset between hook calls
  const windowsFallback = 'C:/Users/frank/Arcanea/.arcanea/prompts';
  if (existsSync(join(windowsFallback, 'luminor-spawn-config.yaml'))) {
    return windowsFallback;
  }

  return null;
}

// ─── Minimal YAML parser ──────────────────────────────────────────────────────

/**
 * Parse luminor-spawn-config.yaml without js-yaml dependency.
 * Only handles the two sections we need: `kernel` (scalar) and `modules`
 * (indented key: value pairs). Robust enough for this specific file format.
 */
function parseSpawnConfig(text) {
  const config = { kernel: 'luminor-engineering-kernel.md', modules: {} };
  let inModules = false;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trimEnd();
    if (!line || line.startsWith('#')) continue;

    // Top-level `kernel:` scalar
    const kernelMatch = line.match(/^kernel:\s*(.+)$/);
    if (kernelMatch) {
      config.kernel = kernelMatch[1].trim();
      inModules = false;
      continue;
    }

    // Section header
    if (line.match(/^modules:\s*$/)) { inModules = true; continue; }
    if (line.match(/^\w/) && !line.startsWith(' ') && !line.startsWith('\t')) {
      inModules = false;
      continue;
    }

    // Module entry (indented)
    if (inModules) {
      const entryMatch = line.match(/^\s+([\w\s/'"-]+?):\s*(.*)$/);
      if (entryMatch) {
        const key = entryMatch[1].trim();
        const val = entryMatch[2].trim();
        config.modules[key] = (val === 'null' || val === '') ? null : val;
      }
    }
  }

  return config;
}

// ─── Agent type detection ─────────────────────────────────────────────────────

/**
 * Keyword patterns for heuristic agent type detection from prompt text.
 * Ordered most-specific first to prevent false matches on generic terms.
 */
const TYPE_PATTERNS = [
  ['security-architect',      /\b(threat model|security architect|attack surface|zero.trust)\b/i],
  ['security-auditor',        /\b(secur|audit|vuln|cve|pentest|owasp)\b/i],
  ['mcp-sdk-architect',       /\b(mcp sdk|mcp architect)\b/i],
  ['mcp-transport-engineer',  /\b(mcp transport|stdio transport|streamable.http)\b/i],
  ['mcp',                     /\b(mcp|model context protocol)\b/i],
  ['system-architect',        /\b(system architect|architecture|adr|design decision)\b/i],
  ['planner',                 /\b(plan|roadmap|sprint|milestone|backlog|scope)\b/i],
  ['researcher',              /\b(research|explore|investigate|survey|benchmark|survey)\b/i],
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
  // Explicit type from Claude Code env wins
  if (explicitType && explicitType.trim()) {
    return explicitType.trim();
  }
  if (!prompt) return 'default';

  for (const [type, pattern] of TYPE_PATTERNS) {
    if (pattern.test(prompt)) return type;
  }
  return 'default';
}

// ─── Prompt assembly ──────────────────────────────────────────────────────────

function buildEnhancedPrompt(agentType, task, promptsDir) {
  const configPath = join(promptsDir, 'luminor-spawn-config.yaml');
  if (!existsSync(configPath)) {
    throw new Error(`Config not found: ${configPath}`);
  }

  const config = parseSpawnConfig(readFileSync(configPath, 'utf-8'));

  // Kernel — universal base, always present
  const kernelPath = join(promptsDir, config.kernel);
  if (!existsSync(kernelPath)) {
    throw new Error(`Kernel not found: ${kernelPath}`);
  }
  const kernel = readFileSync(kernelPath, 'utf-8');

  // Domain module — optional, type-specific
  const moduleFile = config.modules[agentType] ?? config.modules['default'] ?? null;
  let module = null;
  if (moduleFile) {
    const modulePath = join(promptsDir, moduleFile);
    if (existsSync(modulePath)) {
      module = readFileSync(modulePath, 'utf-8');
    }
    // Non-fatal if missing — kernel-only is still a meaningful upgrade
  }

  const parts = [kernel];
  if (module) {
    parts.push('\n\n---\n', module);
  }
  parts.push('\n\n---\n', `## TASK\n\n${task}`);

  return parts.join('\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const originalPrompt = process.env.TOOL_INPUT_prompt ?? '';
  const explicitType   = process.env.TOOL_INPUT_subagent_type ?? '';

  // Fast-exit: nothing to enhance
  if (!originalPrompt.trim()) return;

  const promptsDir = findPromptsDir();
  if (!promptsDir) {
    // Silent pass-through — not inside the Arcanea monorepo
    return;
  }

  const agentType = detectAgentType(originalPrompt, explicitType);
  const enhanced  = buildEnhancedPrompt(agentType, originalPrompt, promptsDir);

  // Only emit if we actually changed something (avoids no-op overrides)
  if (enhanced !== originalPrompt) {
    process.stdout.write(JSON.stringify({ prompt: enhanced }) + '\n');
  }
}

try {
  main();
} catch (err) {
  // Log to stderr — never let a broken hook surface to the user
  process.stderr.write(`[luminor-inject] error: ${err.message}\n`);
  // No process.exit(1) — continueOnError handles this at the harness level
}
