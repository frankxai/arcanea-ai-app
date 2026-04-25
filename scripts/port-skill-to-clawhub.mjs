#!/usr/bin/env node
/**
 * port-skill-to-clawhub.mjs
 *
 * Converts a Claude Code skill (`.claude/skills/<name>/SKILL.md`) into
 * an OpenClaw-compatible skill (`~/.openclaw/workspace/skills/<name>/SKILL.md`)
 * by adding the required `metadata.openclaw` frontmatter block.
 *
 * Usage:
 *   node scripts/port-skill-to-clawhub.mjs <skill-name>      # port one
 *   node scripts/port-skill-to-clawhub.mjs --all             # port all .claude/skills
 *   node scripts/port-skill-to-clawhub.mjs --dry-run --all   # preview without writing
 *
 * Output: writes to ./clawhub-staging/arcanea/<skill-name>/SKILL.md
 *
 * Next step (manual): cd clawhub-staging/arcanea/<skill> && clawhub skill publish .
 */

import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { existsSync } from 'node:fs';

// Allow override via env var or --source flag for portability:
//   SKILLS_DIR=~/.claude/skills node scripts/port-skill-to-clawhub.mjs --all
//   node scripts/port-skill-to-clawhub.mjs --source wiki/skills --all
const sourceFlag = process.argv.indexOf('--source');
const SKILLS_DIR =
  sourceFlag > -1
    ? process.argv[sourceFlag + 1]
    : process.env.SKILLS_DIR || '.claude/skills';
const STAGING_DIR = process.env.STAGING_DIR || 'clawhub-staging/arcanea';
const NAMESPACE = process.env.NAMESPACE || 'arcanea';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ALL = args.includes('--all');
const VERBOSE = args.includes('--verbose');

function log(...m) { console.log('[port]', ...m); }
function warn(...m) { console.warn('[port][warn]', ...m); }

/**
 * Parse YAML frontmatter from a markdown file.
 * Returns { frontmatter: object|null, body: string, raw: string }.
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: null, body: raw, raw };
  const yamlBlock = match[1];
  const body = match[2];
  const fm = {};
  let currentKey = null;
  let currentList = null;
  for (const line of yamlBlock.split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (/^\s+-\s+/.test(line) && currentList) {
      currentList.push(line.replace(/^\s+-\s+/, '').trim());
      continue;
    }
    const m = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (m) {
      const k = m[1];
      const v = m[2].trim();
      if (v === '') {
        // expect a list or nested
        currentKey = k;
        currentList = [];
        fm[k] = currentList;
      } else {
        fm[k] = v;
        currentKey = null;
        currentList = null;
      }
    }
  }
  return { frontmatter: fm, body, raw };
}

/**
 * Detect required env vars referenced in the skill body.
 * Looks for ${ENV_VAR} or process.env.ENV_VAR patterns.
 */
function detectEnvVars(body) {
  const set = new Set();
  const patterns = [
    /\$\{([A-Z][A-Z0-9_]+)\}/g,
    /process\.env\.([A-Z][A-Z0-9_]+)/g,
    /env:\s*\n([\s\S]*?)(?:\n\w|\n$)/g,
  ];
  for (const p of patterns) {
    const matches = body.matchAll(p);
    for (const m of matches) {
      if (m[1]) set.add(m[1]);
    }
  }
  return [...set];
}

/**
 * Detect required binaries (CLI tools) the skill calls.
 * Looks for fenced bash blocks and common tool invocations.
 */
function detectBins(body) {
  const set = new Set();
  const known = [
    'gh', 'git', 'pnpm', 'npm', 'npx', 'node', 'python', 'pip', 'uv', 'uvx',
    'docker', 'kubectl', 'curl', 'wget', 'jq', 'rg', 'fd', 'fzf', 'ffmpeg',
    'pandoc', 'playwright',
  ];
  // grep fenced bash blocks
  const bashBlocks = body.matchAll(/```(?:bash|sh|zsh|shell)\n([\s\S]*?)```/g);
  for (const blk of bashBlocks) {
    for (const tool of known) {
      const re = new RegExp(`(^|\\s|\\|)${tool}\\s`, 'm');
      if (re.test(blk[1])) set.add(tool);
    }
  }
  return [...set];
}

/**
 * Build OpenClaw-compatible frontmatter from Claude Code frontmatter.
 */
function buildOpenClawFrontmatter(originalFm, envVars, bins, skillName) {
  const name = `${NAMESPACE}-${skillName}`;
  const description =
    originalFm?.description ||
    originalFm?.desc ||
    `Arcanea skill: ${skillName}`;

  const lines = ['---'];
  lines.push(`name: ${name}`);
  lines.push(`description: ${description}`);
  lines.push('metadata:');
  lines.push('  openclaw:');
  lines.push('    requires:');
  if (envVars.length > 0) {
    lines.push('      env:');
    envVars.forEach((e) => lines.push(`        - ${e}`));
  } else {
    lines.push('      env: []');
  }
  if (bins.length > 0) {
    lines.push('      bins:');
    bins.forEach((b) => lines.push(`        - ${b}`));
  } else {
    lines.push('      bins: []');
  }
  lines.push('    tags:');
  lines.push(`      - arcanea`);
  if (originalFm?.tags) {
    const tags = Array.isArray(originalFm.tags)
      ? originalFm.tags
      : [originalFm.tags];
    tags.forEach((t) => lines.push(`      - ${t}`));
  }
  lines.push(`    namespace: ${NAMESPACE}`);
  lines.push(`    source: claude-code`);
  lines.push(`    ported: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('---');
  return lines.join('\n');
}

/**
 * Port a single skill.
 */
async function portSkill(skillName) {
  const sourceDir = join(SKILLS_DIR, skillName);
  let sourceFile = join(sourceDir, 'SKILL.md');
  // Some skills are single-file: .claude/skills/<name>.md
  if (!existsSync(sourceFile)) {
    sourceFile = join(SKILLS_DIR, `${skillName}.md`);
  }
  if (!existsSync(sourceFile)) {
    warn(`source missing: ${skillName}`);
    return { ok: false, reason: 'source-missing', skill: skillName };
  }

  const raw = await readFile(sourceFile, 'utf8');
  const { frontmatter, body } = parseFrontmatter(raw);
  const envVars = detectEnvVars(body);
  const bins = detectBins(body);

  const newFm = buildOpenClawFrontmatter(frontmatter, envVars, bins, skillName);
  const output = `${newFm}\n\n${body.replace(/^\s+/, '')}\n`;

  const targetDir = join(STAGING_DIR, skillName);
  const targetFile = join(targetDir, 'SKILL.md');

  if (DRY_RUN) {
    log(`[dry] would write: ${targetFile}`);
    if (VERBOSE) log(newFm);
    return { ok: true, skill: skillName, target: targetFile, dry: true };
  }

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetFile, output, 'utf8');
  log(`ported: ${skillName} → ${targetFile} (env:${envVars.length} bins:${bins.length})`);
  return { ok: true, skill: skillName, target: targetFile };
}

async function listSkills() {
  if (!existsSync(SKILLS_DIR)) return [];
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const skills = [];
  for (const e of entries) {
    if (e.isDirectory()) skills.push(e.name);
    else if (e.isFile() && e.name.endsWith('.md') && e.name !== 'README.md') {
      skills.push(e.name.replace(/\.md$/, ''));
    }
  }
  return skills.sort();
}

async function main() {
  if (args.length === 0) {
    console.log('Usage: port-skill-to-clawhub.mjs <skill-name> | --all [--dry-run] [--verbose]');
    process.exit(1);
  }

  const targets = ALL ? await listSkills() : args.filter((a) => !a.startsWith('--'));
  log(`porting ${targets.length} skill(s)${DRY_RUN ? ' (dry run)' : ''}`);

  const results = [];
  for (const t of targets) {
    try {
      const r = await portSkill(t);
      results.push(r);
    } catch (err) {
      warn(`failed: ${t}`, err.message);
      results.push({ ok: false, skill: t, reason: err.message });
    }
  }

  const ok = results.filter((r) => r.ok).length;
  const failed = results.length - ok;
  log(`done: ${ok} ported, ${failed} failed`);
  if (failed > 0) {
    log('failures:');
    results.filter((r) => !r.ok).forEach((r) => log(`  - ${r.skill}: ${r.reason}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[port][fatal]', err);
  process.exit(1);
});
