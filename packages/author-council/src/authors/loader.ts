import { readFile, readdir, stat } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AuthorAgent, AuthorRole, AuthorSystem, VoiceVector } from "../protocol/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, "..", "..");
const AUTHORS_DIR = join(PACKAGE_ROOT, "authors");

export interface LoaderOptions {
  /** Override the authors directory for tests or custom installs. */
  authorsDir?: string;
}

/**
 * Load a single author agent from disk by slug.
 * Throws if the author directory is missing or incomplete.
 */
export async function loadAuthor(
  slug: string,
  options: LoaderOptions = {},
): Promise<AuthorAgent> {
  const dir = join(options.authorsDir ?? AUTHORS_DIR, slug);
  const [soul, skills, patterns, craft, glossaryRaw, systemsRaw, voiceRaw, sources] =
    await Promise.all([
      readFile(join(dir, "SOUL.md"), "utf8"),
      readFile(join(dir, "SKILLS.md"), "utf8"),
      readFile(join(dir, "PATTERNS.md"), "utf8"),
      readFile(join(dir, "craft.md"), "utf8"),
      readFile(join(dir, "glossary.json"), "utf8"),
      readFile(join(dir, "systems.json"), "utf8"),
      readFile(join(dir, "voice.json"), "utf8"),
      readFile(join(dir, "sources.md"), "utf8"),
    ]);

  const glossary = JSON.parse(glossaryRaw) as Record<string, string>;
  const systems = JSON.parse(systemsRaw) as AuthorSystem[];
  const voice = JSON.parse(voiceRaw) as VoiceVector;
  const role = roleFromSkills(skills);

  return {
    slug,
    role,
    soul,
    skills,
    patterns,
    craft,
    glossary,
    systems,
    voice,
    sources,
  };
}

export async function loadAuthors(
  slugs: string[],
  options: LoaderOptions = {},
): Promise<AuthorAgent[]> {
  return Promise.all(slugs.map((s) => loadAuthor(s, options)));
}

/**
 * Discover all available authors in the authors directory.
 * Returns the slug set used by validateRoster.
 */
export async function discoverAuthors(options: LoaderOptions = {}): Promise<Set<string>> {
  const dir = options.authorsDir ?? AUTHORS_DIR;
  try {
    const entries = await readdir(dir);
    const slugs = new Set<string>();
    for (const e of entries) {
      const s = await stat(join(dir, e));
      if (s.isDirectory()) slugs.add(e);
    }
    return slugs;
  } catch {
    return new Set();
  }
}

function roleFromSkills(skills: string): AuthorRole {
  const match = skills.match(/Role:\s*([a-z-]+)/i);
  if (match) return (match[1] ?? "general") as AuthorRole;
  return "heroic";
}

export { AUTHORS_DIR };
