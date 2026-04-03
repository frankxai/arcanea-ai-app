/**
 * Living Lore — Episode & Encounter Loader
 *
 * Reads episode and encounter markdown files from `book/living-lore/`
 * using the same gray-matter pattern as the main content loader.
 */

import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import type { Episode, Encounter, ActInfo, EpisodeMeta } from './types';

const grayMatter = require('gray-matter') as typeof import('gray-matter');
type YamlRuntime = {
  load: (value: string) => unknown;
};
const yaml = require('js-yaml') as YamlRuntime;

const LIVING_LORE_DIR = join(process.cwd(), '..', '..', 'book', 'living-lore');

// ---------------------------------------------------------------------------
// Act metadata — maps act numbers to canonical Gate/Guardian info
// ---------------------------------------------------------------------------

const ACT_INFO: Record<number, { title: string; subtitle: string; guardianName: string }> = {
  1: { title: 'Foundation', subtitle: 'Where We Begin', guardianName: 'Lyssandria' },
  2: { title: 'Flow', subtitle: 'What Moves Us', guardianName: 'Leyla' },
  3: { title: 'Fire', subtitle: 'What Transforms Us', guardianName: 'Draconia' },
  4: { title: 'Heart', subtitle: 'What Heals Us', guardianName: 'Maylinn' },
  5: { title: 'Voice', subtitle: 'What We Must Say', guardianName: 'Alera' },
  6: { title: 'Sight', subtitle: 'What We Must See', guardianName: 'Lyria' },
  7: { title: 'Crown', subtitle: 'What We Must Know', guardianName: 'Aiyami' },
  8: { title: 'Starweave', subtitle: 'What We Must Become', guardianName: 'Elara' },
  9: { title: 'Unity', subtitle: 'What We Build Together', guardianName: 'Ino' },
  10: { title: 'Source', subtitle: 'Where All Returns', guardianName: 'Shinkami' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check whether a directory exists without throwing. */
async function dirExists(dirPath: string): Promise<boolean> {
  try {
    await access(dirPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse an act directory name like `act-01-foundation` into its number and title.
 * Returns null if the name does not match the expected pattern.
 */
function parseActDir(name: string): { number: number; dirTitle: string } | null {
  const match = name.match(/^act-(\d{2})-(.+)$/);
  if (!match) return null;
  return { number: parseInt(match[1], 10), dirTitle: match[2] };
}

/**
 * Derive a slug from an episode filename.
 * `01-the-assembly.md` -> `the-assembly`
 */
function slugFromEpisodeFilename(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .replace(/^\d+-/, '');
}

/**
 * Derive a slug from an encounter filename.
 * `assembly-campfire.md` -> `assembly-campfire`
 */
function slugFromEncounterFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

/** Parse a markdown file with gray-matter, returning null on failure. */
async function parseMarkdown(filePath: string): Promise<{ data: Record<string, unknown>; content: string } | null> {
  try {
    const raw = await readFile(filePath, 'utf-8');
    const { data, content } = parseFrontmatter(raw);
    return { data: data as Record<string, unknown>, content };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Core Loaders
// ---------------------------------------------------------------------------

/**
 * Get all acts with their episode metadata.
 * Scans `book/living-lore/act-*` directories.
 */
export async function getActs(): Promise<ActInfo[]> {
  if (!(await dirExists(LIVING_LORE_DIR))) return [];

  try {
    const entries = await readdir(LIVING_LORE_DIR, { withFileTypes: true });
    const actDirs = entries
      .filter((e) => e.isDirectory() && e.name.startsWith('act-'))
      .map((e) => e.name)
      .sort();

    const acts: ActInfo[] = [];

    for (const dirName of actDirs) {
      const parsed = parseActDir(dirName);
      if (!parsed) continue;

      const info = ACT_INFO[parsed.number];
      if (!info) continue;

      const episodes = await getEpisodesForAct(parsed.number);
      const episodeMetas: EpisodeMeta[] = episodes.map((ep) => ({
        slug: ep.slug,
        title: ep.title,
        episodeNumber: ep.episodeNumber,
        perspectives: ep.perspectives,
        connectedLore: ep.connectedLore,
      }));

      acts.push({
        number: parsed.number,
        title: info.title,
        subtitle: info.subtitle,
        gate: parsed.number,
        guardianName: info.guardianName,
        episodes: episodeMetas,
      });
    }

    return acts;
  } catch (error) {
    console.error('Error loading acts:', error);
    return [];
  }
}

/**
 * Get a single episode by slug (e.g., `the-assembly`).
 * Searches all act directories for a matching filename.
 */
export async function getEpisode(slug: string): Promise<Episode | null> {
  if (!(await dirExists(LIVING_LORE_DIR))) return null;

  try {
    const entries = await readdir(LIVING_LORE_DIR, { withFileTypes: true });
    const actDirs = entries
      .filter((e) => e.isDirectory() && e.name.startsWith('act-'))
      .map((e) => e.name);

    for (const dirName of actDirs) {
      const actPath = join(LIVING_LORE_DIR, dirName);
      const files = await readdir(actPath);
      const mdFiles = files.filter((f) => f.endsWith('.md'));

      for (const filename of mdFiles) {
        if (slugFromEpisodeFilename(filename) === slug) {
          const parsed = await parseMarkdown(join(actPath, filename));
          if (!parsed) continue;

          const { data, content } = parsed;
          const actNumber = (data.act as number) ?? parseActDir(dirName)?.number ?? 0;
          const info = ACT_INFO[actNumber];

          return {
            slug,
            title: (data.title as string) ?? slug,
            act: actNumber,
            actTitle: (data.actTitle as string) ?? info?.title ?? '',
            episodeNumber: (data.episodeNumber as number) ?? 0,
            excerpt: (data.excerpt as string) ?? content.slice(0, 200).replace(/[#*>\-\n]/g, ' ').trim() + '...',
            gate: (data.gate as number) ?? actNumber,
            perspectives: (data.perspectives as string[]) ?? [],
            connectedLore: (data.connectedLore as string[]) ?? [],
            content,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Error loading episode "${slug}":`, error);
    return null;
  }
}

/**
 * Get all episodes for an act, sorted by episode number.
 */
export async function getEpisodesForAct(actNumber: number): Promise<Episode[]> {
  if (!(await dirExists(LIVING_LORE_DIR))) return [];

  const info = ACT_INFO[actNumber];
  if (!info) return [];

  // Find the matching act directory
  const paddedNum = String(actNumber).padStart(2, '0');
  const actDirPrefix = `act-${paddedNum}`;

  try {
    const entries = await readdir(LIVING_LORE_DIR, { withFileTypes: true });
    const actDir = entries.find(
      (e) => e.isDirectory() && e.name.startsWith(actDirPrefix)
    );
    if (!actDir) return [];

    const actPath = join(LIVING_LORE_DIR, actDir.name);
    const files = await readdir(actPath);
    const mdFiles = files.filter((f) => f.endsWith('.md')).sort();

    const episodes: Episode[] = [];

    for (const filename of mdFiles) {
      const parsed = await parseMarkdown(join(actPath, filename));
      if (!parsed) continue;

      const { data, content } = parsed;

      // Skip encounter files that happen to be at the top level of the act dir
      if ((data.type as string) === 'encounter') continue;

      const slug = slugFromEpisodeFilename(filename);

      episodes.push({
        slug,
        title: (data.title as string) ?? slug,
        act: actNumber,
        actTitle: (data.actTitle as string) ?? info.title,
        episodeNumber: (data.episodeNumber as number) ?? 0,
        excerpt: (data.excerpt as string) ?? content.slice(0, 200).replace(/[#*>\-\n]/g, ' ').trim() + '...',
        gate: (data.gate as number) ?? actNumber,
        perspectives: (data.perspectives as string[]) ?? [],
        connectedLore: (data.connectedLore as string[]) ?? [],
        content,
      });
    }

    return episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
  } catch (error) {
    console.error(`Error loading episodes for act ${actNumber}:`, error);
    return [];
  }
}

/**
 * Get an encounter by slug (e.g., `assembly-campfire`).
 * Searches `encounters/` subdirectories within each act directory.
 */
export async function getEncounter(slug: string): Promise<Encounter | null> {
  if (!(await dirExists(LIVING_LORE_DIR))) return null;

  try {
    const entries = await readdir(LIVING_LORE_DIR, { withFileTypes: true });
    const actDirs = entries
      .filter((e) => e.isDirectory() && e.name.startsWith('act-'))
      .map((e) => e.name);

    for (const dirName of actDirs) {
      const encountersPath = join(LIVING_LORE_DIR, dirName, 'encounters');
      if (!(await dirExists(encountersPath))) continue;

      const files = await readdir(encountersPath);
      const mdFiles = files.filter((f) => f.endsWith('.md'));

      for (const filename of mdFiles) {
        if (slugFromEncounterFilename(filename) === slug) {
          const parsed = await parseMarkdown(join(encountersPath, filename));
          if (!parsed) return null;

          const { data, content } = parsed;

          return {
            slug,
            title: (data.title as string) ?? slug,
            episodeSlug: (data.episodeSlug as string) ?? '',
            act: (data.act as number) ?? parseActDir(dirName)?.number ?? 0,
            presentCrew: (data.presentCrew as string[]) ?? [],
            openingScript: content.split('---')[0]?.trim() ?? content.slice(0, 500),
            sceneContext: (data.sceneContext as string) ?? '',
            xpReward: (data.xpReward as number) ?? 100,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Error loading encounter "${slug}":`, error);
    return null;
  }
}

/**
 * Get all encounters associated with an episode slug.
 */
export async function getEncountersForEpisode(episodeSlug: string): Promise<Encounter[]> {
  if (!(await dirExists(LIVING_LORE_DIR))) return [];

  try {
    const entries = await readdir(LIVING_LORE_DIR, { withFileTypes: true });
    const actDirs = entries
      .filter((e) => e.isDirectory() && e.name.startsWith('act-'))
      .map((e) => e.name);

    const encounters: Encounter[] = [];

    for (const dirName of actDirs) {
      const encountersPath = join(LIVING_LORE_DIR, dirName, 'encounters');
      if (!(await dirExists(encountersPath))) continue;

      const files = await readdir(encountersPath);
      const mdFiles = files.filter((f) => f.endsWith('.md'));

      for (const filename of mdFiles) {
        const parsed = await parseMarkdown(join(encountersPath, filename));
        if (!parsed) continue;

        const { data, content } = parsed;

        if ((data.episodeSlug as string) === episodeSlug) {
          encounters.push({
            slug: slugFromEncounterFilename(filename),
            title: (data.title as string) ?? filename.replace('.md', ''),
            episodeSlug: (data.episodeSlug as string) ?? '',
            act: (data.act as number) ?? parseActDir(dirName)?.number ?? 0,
            presentCrew: (data.presentCrew as string[]) ?? [],
            openingScript: content.split('---')[0]?.trim() ?? content.slice(0, 500),
            sceneContext: (data.sceneContext as string) ?? '',
            xpReward: (data.xpReward as number) ?? 100,
          });
        }
      }
    }

    return encounters;
  } catch (error) {
    console.error(`Error loading encounters for episode "${episodeSlug}":`, error);
    return [];
  }
}

/**
 * Get all encounters that feature a specific crew member.
 * Searches all act directories for encounters where `presentCrew` includes the member.
 */
export async function getEncountersForCrewMember(memberId: string): Promise<Encounter[]> {
  if (!(await dirExists(LIVING_LORE_DIR))) return [];

  try {
    const entries = await readdir(LIVING_LORE_DIR, { withFileTypes: true });
    const actDirs = entries
      .filter((e) => e.isDirectory() && e.name.startsWith('act-'))
      .map((e) => e.name);

    const encounters: Encounter[] = [];

    for (const dirName of actDirs) {
      const encountersPath = join(LIVING_LORE_DIR, dirName, 'encounters');
      if (!(await dirExists(encountersPath))) continue;

      const files = await readdir(encountersPath);
      const mdFiles = files.filter((f) => f.endsWith('.md'));

      for (const filename of mdFiles) {
        const parsed = await parseMarkdown(join(encountersPath, filename));
        if (!parsed) continue;

        const { data, content } = parsed;
        const presentCrew = (data.presentCrew as string[]) ?? [];

        if (presentCrew.includes(memberId)) {
          encounters.push({
            slug: slugFromEncounterFilename(filename),
            title: (data.title as string) ?? filename.replace('.md', ''),
            episodeSlug: (data.episodeSlug as string) ?? '',
            act: (data.act as number) ?? parseActDir(dirName)?.number ?? 0,
            presentCrew,
            openingScript: content.split('---')[0]?.trim() ?? content.slice(0, 500),
            sceneContext: (data.sceneContext as string) ?? '',
            xpReward: (data.xpReward as number) ?? 100,
          });
        }
      }
    }

    return encounters;
  } catch (error) {
    console.error(`Error loading encounters for crew member "${memberId}":`, error);
    return [];
  }
}

/**
 * Get the backstory markdown for a crew member by their ID.
 * Reads from `book/living-lore/crew/{memberId}.md`.
 *
 * Accepts both `crew-ren` (full ID) and `ren` (short name).
 */
export async function getCrewBackstory(memberId: string): Promise<string | null> {
  const shortName = memberId.replace(/^crew-/, '');
  const filePath = join(LIVING_LORE_DIR, 'crew', `${shortName}.md`);

  try {
    const raw = await readFile(filePath, 'utf-8');
    const { content } = parseFrontmatter(raw);
    return content;
  } catch {
    return null;
  }
}
function parseFrontmatter(source: string) {
  return grayMatter(source, {
    engines: {
      yaml: (value: string) => yaml.load(value) as Record<string, unknown>,
    },
  });
}
