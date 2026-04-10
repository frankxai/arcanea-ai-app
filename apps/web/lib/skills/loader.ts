import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Skill {
  slug: string;
  name: string;
  description: string;
  category?: string;
  version?: string;
  author?: string;
  license?: string;
  tags?: string[];
  toolCompatibility?: string[]; // ['claude-code', 'opencode', 'cursor']
  installCommand?: string;
  usageExamples?: string[];
  triggers?: string[];
  readmeContent: string; // full SKILL.md markdown (body, no frontmatter)
  sourceUrl: string; // github link
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SKILLS_ROOT = join(process.cwd(), '..', '..', 'oss', 'skills', 'arcanea');
const GITHUB_BASE =
  'https://github.com/frankxai/arcanea/tree/main/skills/arcanea';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function safeStat(path: string) {
  try {
    return await stat(path);
  } catch {
    return null;
  }
}

async function safeReadFile(path: string): Promise<string | null> {
  try {
    return await readFile(path, 'utf-8');
  } catch {
    return null;
  }
}

function coerceStringArray(value: unknown): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return undefined;
}

/**
 * Safely parse a SKILL.md file. If no frontmatter is present, returns null.
 */
function parseSkillMarkdown(raw: string) {
  try {
    const parsed = matter(raw);
    // gray-matter returns {} if no frontmatter — we require at least a name or description.
    const data = parsed.data || {};
    if (!data.name && !data.description) {
      return null;
    }
    return { data, content: parsed.content };
  } catch {
    return null;
  }
}

/**
 * Attempt to parse optional skill.yaml alongside SKILL.md. Accepts both a
 * plain YAML document and a YAML document with `---` fences.
 */
function parseSkillYaml(raw: string): Record<string, unknown> | null {
  try {
    const fenced = raw.trim().startsWith('---')
      ? raw
      : `---\n${raw}\n---\n`;
    const parsed = matter(fenced);
    return (parsed.data as Record<string, unknown>) || null;
  } catch {
    return null;
  }
}

/**
 * Merge skill.yaml metadata on top of SKILL.md frontmatter (yaml wins).
 */
function mergeMetadata(
  md: Record<string, unknown>,
  yaml: Record<string, unknown> | null
): Record<string, unknown> {
  if (!yaml) return md;
  return { ...md, ...yaml };
}

function buildSkill(
  slug: string,
  meta: Record<string, unknown>,
  body: string,
  relPath: string
): Skill {
  const name = (meta.name as string) || slug;
  const description =
    (meta.description as string) ||
    (meta.summary as string) ||
    '';

  const category =
    (meta.category as string) ||
    (typeof meta.group === 'string' ? (meta.group as string) : undefined);

  const tags = coerceStringArray(meta.tags);
  const triggers = coerceStringArray(meta.triggers);
  const usageExamples = coerceStringArray(
    meta.usage_examples ?? meta.usageExamples ?? meta.examples
  );
  const toolCompatibility = coerceStringArray(
    meta.tool_compatibility ?? meta.toolCompatibility ?? meta.tools
  );

  const installCommand =
    (meta.install_command as string) ||
    (meta.installCommand as string) ||
    undefined;

  return {
    slug,
    name,
    description,
    category,
    version: (meta.version as string) || undefined,
    author: (meta.author as string) || undefined,
    license: (meta.license as string) || undefined,
    tags,
    toolCompatibility,
    installCommand,
    usageExamples,
    triggers,
    readmeContent: body,
    sourceUrl: `${GITHUB_BASE}/${relPath}`,
  };
}

/* ------------------------------------------------------------------ */
/*  Loaders                                                            */
/* ------------------------------------------------------------------ */

/**
 * Load a skill whose body lives at an absolute SKILL.md path.
 * `relPath` is the path relative to SKILLS_ROOT (for source links).
 */
async function loadSkillFromMarkdown(
  slug: string,
  absMdPath: string,
  relPath: string,
  yamlDir?: string
): Promise<Skill | null> {
  const raw = await safeReadFile(absMdPath);
  if (!raw) return null;

  const parsed = parseSkillMarkdown(raw);
  if (!parsed) return null;

  let meta = parsed.data;

  if (yamlDir) {
    const yamlPath = join(yamlDir, 'skill.yaml');
    const yamlRaw = await safeReadFile(yamlPath);
    if (yamlRaw) {
      const yamlData = parseSkillYaml(yamlRaw);
      meta = mergeMetadata(meta, yamlData);
    }
  }

  return buildSkill(slug, meta, parsed.content, relPath);
}

/**
 * Read every skill under `oss/skills/arcanea/`. Supports two layouts:
 *   1. `arcanea/<slug>/SKILL.md`            (directory form, may include skill.yaml)
 *   2. `arcanea/<slug>.md`                   (flat markdown file)
 */
export async function getAllSkills(): Promise<Skill[]> {
  const rootStat = await safeStat(SKILLS_ROOT);
  if (!rootStat || !rootStat.isDirectory()) return [];

  let entries: Array<{ name: string; isDirectory: () => boolean; isFile: () => boolean }> = [];
  try {
    entries = await readdir(SKILLS_ROOT, { withFileTypes: true });
  } catch {
    return [];
  }

  const skills: Skill[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const dir = join(SKILLS_ROOT, entry.name);
      const mdPath = join(dir, 'SKILL.md');
      if (!(await safeStat(mdPath))) continue;

      const skill = await loadSkillFromMarkdown(
        entry.name,
        mdPath,
        `${entry.name}/SKILL.md`,
        dir
      );
      if (skill) skills.push(skill);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const slug = entry.name.replace(/\.md$/, '');
      const mdPath = join(SKILLS_ROOT, entry.name);
      const skill = await loadSkillFromMarkdown(slug, mdPath, entry.name);
      if (skill) skills.push(skill);
    }
  }

  // Sort: named first, alphabetical by display name
  skills.sort((a, b) => a.name.localeCompare(b.name));
  return skills;
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  const all = await getAllSkills();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function getSkillsByCategory(
  category: string
): Promise<Skill[]> {
  const all = await getAllSkills();
  return all.filter(
    (s) => (s.category || 'uncategorized').toLowerCase() === category.toLowerCase()
  );
}

/* ------------------------------------------------------------------ */
/*  Derived helpers                                                    */
/* ------------------------------------------------------------------ */

export function getCategories(skills: Skill[]): string[] {
  const set = new Set<string>();
  for (const s of skills) {
    if (s.category) set.add(s.category);
  }
  return Array.from(set).sort();
}

/**
 * Generate a sensible default install command when the skill does not
 * provide one in its metadata. Used by UI components as a fallback.
 */
export function defaultInstallCommand(
  slug: string,
  tool: 'claude-code' | 'opencode' | 'cursor' | 'codex' | 'gemini' | 'npx'
): string {
  switch (tool) {
    case 'claude-code':
      return `cp -r skills/${slug} ~/.claude/skills/`;
    case 'opencode':
      return `cp -r skills/${slug} ~/.opencode/skills/`;
    case 'cursor':
      return `cp -r skills/${slug} ~/.cursor/skills/`;
    case 'codex':
      return `cp -r skills/${slug} ~/.codex/skills/`;
    case 'gemini':
      return `cp -r skills/${slug} ~/.gemini/skills/`;
    case 'npx':
    default:
      return `npx arcanea install ${slug}`;
  }
}
