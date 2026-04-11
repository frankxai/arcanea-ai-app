#!/usr/bin/env node
/**
 * build-registry.mjs — Generate shadcn-compatible registry files for Arcanea skills.
 *
 * Walks `oss/skills/arcanea/<slug>/` and produces:
 *   - oss/skills/registry.json           (root manifest listing all items)
 *   - oss/skills/r/<slug>.json           (full item with embedded file contents)
 *
 * Format follows shadcn/ui's registry schema (v0.2+), with a custom
 * `registry:skill` type for Claude Code / OpenCode skill bundles.
 *
 * Source of truth: this script + skill.yaml + SKILL.md in each directory.
 * Registry JSON files are GENERATED — do not hand-edit.
 *
 * Usage:
 *   node oss/skills/scripts/build-registry.mjs
 *   pnpm --dir oss/skills build:registry   (if wired up)
 */

import { readdir, readFile, writeFile, mkdir, stat, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, dirname, sep, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SKILLS_ROOT = join(__dirname, '..');              // oss/skills
const ARCANEA_DIR = join(SKILLS_ROOT, 'arcanea');        // oss/skills/arcanea
const REGISTRY_OUT = join(SKILLS_ROOT, 'registry.json'); // oss/skills/registry.json
const R_DIR = join(SKILLS_ROOT, 'r');                    // oss/skills/r

const REGISTRY_SCHEMA = 'https://ui.shadcn.com/schema/registry.json';
const ITEM_SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json';
const REGISTRY_NAME = 'arcanea';
const REGISTRY_HOMEPAGE = 'https://arcanea.ai';

// ---------------------------------------------------------------------------
// Minimal YAML parser (same shape as packages/arcanea-cli/src/lib/registry.ts)
// Supports: scalar strings, scalar numbers, and list-of-strings.
// ---------------------------------------------------------------------------

function parseYamlSimple(content) {
  const result = {};
  const lines = content.split('\n');
  let currentKey = null;
  let listBuffer = null;
  for (const rawLine of lines) {
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;
    if (rawLine.startsWith('  - ') || rawLine.startsWith('- ')) {
      if (listBuffer && currentKey) {
        const val = rawLine.replace(/^\s*-\s*/, '').trim();
        listBuffer.push(val.replace(/^["']|["']$/g, ''));
      }
      continue;
    }
    const colonIdx = rawLine.indexOf(':');
    if (colonIdx === -1) continue;
    const key = rawLine.slice(0, colonIdx).trim();
    let value = rawLine.slice(colonIdx + 1).trim();
    if (!value) {
      currentKey = key;
      listBuffer = [];
      result[key] = listBuffer;
      continue;
    }
    currentKey = key;
    listBuffer = null;
    value = value.replace(/^["']|["']$/g, '');
    result[key] = value;
  }
  return result;
}

function parseFrontmatter(content) {
  const meta = {};
  if (!content.startsWith('---')) return meta;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return meta;
  const block = content.slice(3, end).trim();
  for (const rawLine of block.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) meta[key] = value;
  }
  return meta;
}

// ---------------------------------------------------------------------------
// Walk a skill directory recursively, returning relative POSIX paths.
// ---------------------------------------------------------------------------

async function walkSkillFiles(skillDir) {
  const out = [];
  async function recurse(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) {
        await recurse(abs);
      } else if (entry.isFile()) {
        const rel = relative(skillDir, abs).split(sep).join(posix.sep);
        out.push(rel);
      }
    }
  }
  await recurse(skillDir);
  out.sort();
  return out;
}

// ---------------------------------------------------------------------------
// Build a single skill entry.
// ---------------------------------------------------------------------------

async function buildSkillItem(slug) {
  const skillDir = join(ARCANEA_DIR, slug);
  const files = await walkSkillFiles(skillDir);

  // Load metadata — skill.yaml preferred, SKILL.md frontmatter fallback.
  let meta = {};
  const yamlPath = join(skillDir, 'skill.yaml');
  if (existsSync(yamlPath)) {
    const raw = await readFile(yamlPath, 'utf8');
    meta = parseYamlSimple(raw);
  }
  if (!meta.description || !meta.name) {
    const mdPath = join(skillDir, 'SKILL.md');
    if (existsSync(mdPath)) {
      const raw = await readFile(mdPath, 'utf8');
      const fm = parseFrontmatter(raw);
      if (!meta.name && fm.name) meta.name = fm.name;
      if (!meta.description && fm.description) meta.description = fm.description;
      if (!meta.category && fm.category) meta.category = fm.category;
      if (!meta.version && fm.version) meta.version = fm.version;
    }
  }

  const title = typeof meta.name === 'string' ? meta.name : slug;
  const description =
    typeof meta.description === 'string' ? meta.description : '';
  const category = typeof meta.category === 'string' ? meta.category : null;
  const categories = category ? [category] : [];
  const version = typeof meta.version === 'string' ? meta.version : undefined;
  const author = typeof meta.author === 'string' ? meta.author : undefined;
  const license = typeof meta.license === 'string' ? meta.license : undefined;
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  const homepage = typeof meta.homepage === 'string' ? meta.homepage : undefined;

  // Build file entries.
  // - `path` is the path under the skill's install root (SKILL.md, skill.yaml, etc.)
  // - `target` is where the file installs on the user's machine
  //   (~/.claude/skills/<slug>/<path>). The Arcanea CLI resolves ~ at install time;
  //   shadcn CLI will receive it as a literal string and try to write to it.
  // - `content` is populated for per-item files (r/<slug>.json), omitted from the
  //   root manifest to keep registry.json small.
  const fileEntries = [];
  const fileEntriesShallow = [];
  for (const rel of files) {
    const abs = join(skillDir, rel);
    const content = await readFile(abs, 'utf8');
    const entry = {
      path: `skills/arcanea/${slug}/${rel}`,
      content,
      type: 'registry:file',
      target: `~/.claude/skills/${slug}/${rel}`,
    };
    fileEntries.push(entry);
    fileEntriesShallow.push({
      path: entry.path,
      type: entry.type,
      target: entry.target,
    });
  }

  const baseItem = {
    $schema: ITEM_SCHEMA,
    name: slug,
    type: 'registry:skill',
    title,
    description,
    categories,
  };
  if (author) baseItem.author = author;
  if (homepage) baseItem.homepage = homepage;
  if (tags.length) baseItem.keywords = tags;

  // Shadcn's schema uses `meta` for arbitrary extra metadata.
  baseItem.meta = {
    slug,
    ...(version ? { version } : {}),
    ...(license ? { license } : {}),
    ...(tags.length ? { tags } : {}),
  };

  // Full item (goes into r/<slug>.json)
  const fullItem = { ...baseItem, files: fileEntries };

  // Shallow item (goes into registry.json — no content to keep size down)
  const shallowItem = { ...baseItem, files: fileEntriesShallow };

  return { fullItem, shallowItem, fileCount: fileEntries.length };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!existsSync(ARCANEA_DIR)) {
    console.error(`[build-registry] Missing ${ARCANEA_DIR}`);
    process.exit(1);
  }
  await mkdir(R_DIR, { recursive: true });

  const entries = await readdir(ARCANEA_DIR, { withFileTypes: true });
  const skillSlugs = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  // Clean stale r/<slug>.json files for skills that no longer exist in source.
  // Idempotency: running the script after a rename or delete should leave r/
  // in sync with arcanea/.
  const skillSet = new Set(skillSlugs);
  const existingItemFiles = existsSync(R_DIR)
    ? (await readdir(R_DIR)).filter((f) => f.endsWith('.json'))
    : [];
  for (const f of existingItemFiles) {
    const slug = f.replace(/\.json$/, '');
    if (!skillSet.has(slug)) {
      await unlink(join(R_DIR, f));
      console.log(`  [cleanup] removed stale r/${f}`);
    }
  }

  const shallowItems = [];
  let totalFiles = 0;
  let totalBytes = 0;

  for (const slug of skillSlugs) {
    const { fullItem, shallowItem, fileCount } = await buildSkillItem(slug);
    const itemPath = join(R_DIR, `${slug}.json`);
    const serialized = JSON.stringify(fullItem, null, 2) + '\n';
    await writeFile(itemPath, serialized, 'utf8');
    totalFiles += fileCount;
    totalBytes += serialized.length;
    shallowItems.push(shallowItem);
    console.log(
      `  [r] ${slug}.json  (${fileCount} files, ${(
        serialized.length / 1024
      ).toFixed(1)} KB)`,
    );
  }

  const registry = {
    $schema: REGISTRY_SCHEMA,
    name: REGISTRY_NAME,
    homepage: REGISTRY_HOMEPAGE,
    items: shallowItems,
  };
  const registrySerialized = JSON.stringify(registry, null, 2) + '\n';
  await writeFile(REGISTRY_OUT, registrySerialized, 'utf8');
  totalBytes += registrySerialized.length;

  console.log('');
  console.log(`[build-registry] Generated registry for ${skillSlugs.length} skills`);
  console.log(`  - ${REGISTRY_OUT}`);
  console.log(`  - ${R_DIR}/*.json (${skillSlugs.length} files)`);
  console.log(
    `  - Total files embedded: ${totalFiles}, total size: ${(totalBytes / 1024).toFixed(1)} KB`,
  );
}

main().catch((err) => {
  console.error('[build-registry] FAILED:', err);
  process.exit(1);
});
