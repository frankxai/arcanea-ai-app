#!/usr/bin/env node
/**
 * Skill Registry Generator
 *
 * Walks all known skill directories on the machine, extracts metadata from
 * SKILL.md frontmatter (and flat .md skill files), and emits a consolidated
 * docs/skills/INDEX.md with a table of every skill, its canonical location,
 * and duplicate/drift signals.
 *
 * Usage:
 *   node scripts/build-skill-registry.mjs
 *
 * Output: docs/skills/INDEX.md + docs/skills/registry.json
 */

import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';

const HOME = homedir();

// Dirs to scan (canonical path order — earlier = more authoritative for tie-breaking)
const SKILL_DIRS = [
  { path: join(HOME, '.claude', 'skills'), scope: 'user-global', authority: 1 },
  { path: join(process.cwd(), '.claude', 'skills'), scope: 'project-arcanea', authority: 1 },
  { path: join(process.cwd(), '.arcanea', 'skills'), scope: 'shared-intelligence', authority: 2 },
  { path: join(process.cwd(), '.agents', 'skills'), scope: 'project-agents', authority: 2 },
  { path: join(process.cwd(), '.opencode', 'skills'), scope: 'opencode', authority: 2 },
  { path: join(HOME, '.agents', 'skills'), scope: 'user-agents', authority: 3 },
  { path: join(HOME, '.codex', 'skills'), scope: 'codex', authority: 3 },
  { path: join(HOME, '.continue', 'skills'), scope: 'continue', authority: 3 },
  { path: join(HOME, '.claude', 'acos', 'skills'), scope: 'acos-config', authority: 4 },
  { path: join(HOME, '.arcanea', 'arcanea', '.claude', 'skills'), scope: 'arcanea-lore', authority: 2 },
  { path: join(HOME, '.arcanea', 'arcanea', 'arcanea-skills-opensource', 'skills'), scope: 'oss-publish', authority: 2 },
  { path: join(HOME, '.arcanea', 'arcanea', 'oss', 'skills'), scope: 'oss-mirror', authority: 5 },
  { path: join(HOME, 'agentic-creator-os', '.claude', 'skills'), scope: 'acos-mirror', authority: 4 },
  { path: join(HOME, 'agentic-creator-os', 'skills'), scope: 'acos-repo', authority: 3 },
  { path: join(HOME, 'AnimeLegends.ai', 'skills'), scope: 'anime-legends', authority: 2, warn: 'NOT IN GIT' },
];

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '').trim();
  }
  return fm;
}

function firstHeading(content) {
  const body = content.replace(/^---[\s\S]*?---/, '');
  const m = body.match(/^#\s+(.+?)$/m);
  return m ? m[1].trim() : null;
}

function md5(s) {
  return createHash('md5').update(s).digest('hex').slice(0, 8);
}

async function readSkill(path) {
  try {
    const content = await readFile(path, 'utf-8');
    const fm = parseFrontmatter(content);
    return {
      name: fm.name || basename(path, '.md').replace(/\/SKILL$/, ''),
      description: fm.description || firstHeading(content) || '',
      version: fm.version || null,
      size: content.length,
      md5: md5(content),
    };
  } catch {
    return null;
  }
}

async function scanDir(dir) {
  const { path, scope, authority, warn } = dir;
  if (!existsSync(path)) return { path, scope, authority, warn, skills: [], missing: true };

  const entries = await readdir(path, { withFileTypes: true });
  const skills = [];

  for (const e of entries) {
    const full = join(path, e.name);
    if (e.isDirectory()) {
      // Look for SKILL.md or <dirname>.md inside
      const skillPath = [join(full, 'SKILL.md'), join(full, `${e.name}.md`)].find(existsSync);
      if (skillPath) {
        const meta = await readSkill(skillPath);
        if (meta) skills.push({ ...meta, dir: full, file: skillPath, kind: 'dir' });
      }
    } else if (e.isFile() && e.name.endsWith('.md') && !e.name.startsWith('SKILL_') && e.name !== 'README.md' && e.name !== 'INDEX.md') {
      const meta = await readSkill(full);
      if (meta) skills.push({ ...meta, dir: path, file: full, kind: 'flat' });
    }
  }

  return { path, scope, authority, warn, skills };
}

async function main() {
  console.log('[registry] Scanning', SKILL_DIRS.length, 'skill directories...');
  const results = await Promise.all(SKILL_DIRS.map(scanDir));

  // Group skills by name across all dirs
  const byName = new Map();
  for (const r of results) {
    for (const s of r.skills) {
      const key = s.name.toLowerCase();
      if (!byName.has(key)) byName.set(key, []);
      byName.get(key).push({ ...s, scope: r.scope, authority: r.authority });
    }
  }

  // Dedup + drift detection
  const unique = new Map(); // name -> {canonical, duplicates: [{scope, md5}], drift: boolean}
  for (const [name, entries] of byName) {
    entries.sort((a, b) => a.authority - b.authority);
    const [canonical, ...others] = entries;
    const md5s = new Set(entries.map((e) => e.md5));
    unique.set(name, {
      canonical,
      duplicates: others,
      drift: md5s.size > 1,
      copies: entries.length,
    });
  }

  // Emit markdown
  const totalEntries = results.reduce((s, r) => s + r.skills.length, 0);
  const atRisk = results.filter((r) => r.warn);

  let md = `# Arcanea Skill Registry\n\n`;
  md += `> Auto-generated by \`scripts/build-skill-registry.mjs\`. Do not edit by hand.\n`;
  md += `> Last generated: ${new Date().toISOString()}\n\n`;
  md += `## Summary\n\n`;
  md += `- **${totalEntries}** skill entries across **${SKILL_DIRS.length}** directories\n`;
  md += `- **${unique.size}** unique skill names\n`;
  md += `- **${[...unique.values()].filter((u) => u.drift).length}** with content drift (same name, different md5)\n`;
  md += `- **${[...unique.values()].filter((u) => u.copies > 1).length}** with duplicates\n`;
  if (atRisk.length > 0) {
    md += `- **At risk (not in git):** ${atRisk.map((r) => r.path).join(', ')}\n`;
  }
  md += `\n## Directories\n\n`;
  md += `| Scope | Path | Count | Note |\n|---|---|---|---|\n`;
  for (const r of results) {
    md += `| \`${r.scope}\` | \`${r.path.replace(HOME, '~')}\` | ${r.skills.length} | ${r.missing ? 'MISSING' : r.warn || '—'} |\n`;
  }

  md += `\n## Skills (alphabetical)\n\n`;
  md += `| Name | Canonical scope | Copies | Drift | Description |\n|---|---|---|---|---|\n`;
  for (const [name, u] of [...unique.entries()].sort()) {
    const desc = (u.canonical.description || '').replace(/\|/g, '\\|').slice(0, 120);
    const drift = u.drift ? '⚠️' : '—';
    md += `| \`${name}\` | ${u.canonical.scope} | ${u.copies} | ${drift} | ${desc} |\n`;
  }

  // Drift details
  const driftList = [...unique.entries()].filter(([, u]) => u.drift);
  if (driftList.length > 0) {
    md += `\n## Drift detected (same name, different md5)\n\n`;
    for (const [name, u] of driftList) {
      md += `### \`${name}\`\n\n`;
      for (const e of [u.canonical, ...u.duplicates]) {
        md += `- \`${e.scope}\` md5 \`${e.md5}\` (${e.size} bytes) — \`${e.file.replace(HOME, '~')}\`\n`;
      }
      md += `\n`;
    }
  }

  // Write outputs
  const outDir = join(process.cwd(), 'docs', 'skills');
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'INDEX.md'), md);

  const registry = {
    generatedAt: new Date().toISOString(),
    totalEntries,
    uniqueNames: unique.size,
    directories: results.map((r) => ({ scope: r.scope, path: r.path, count: r.skills.length, missing: r.missing, warn: r.warn })),
    skills: [...unique.entries()].map(([name, u]) => ({
      name,
      canonicalScope: u.canonical.scope,
      canonicalFile: u.canonical.file,
      copies: u.copies,
      drift: u.drift,
      description: u.canonical.description,
    })),
  };
  await writeFile(join(outDir, 'registry.json'), JSON.stringify(registry, null, 2));

  console.log(`[registry] Wrote ${outDir}/INDEX.md (${unique.size} unique of ${totalEntries} entries, ${driftList.length} drifted)`);
}

main().catch((e) => {
  console.error('[registry] ERROR:', e);
  process.exit(1);
});
