import { join } from "node:path";
import {
  loadCatalog,
  selectReady,
  validateSources,
} from "../../../../packages/arcanea-skills/scripts/catalog.cjs";

export interface Skill {
  slug: string;
  name: string;
  description: string;
  category?: string;
  version?: string;
  author?: string;
  license?: string;
  tags?: string[];
  toolCompatibility?: string[];
  usageExamples?: string[];
  triggers?: string[];
  readmeContent: string;
  sourceUrl: string;
  installGuideUrl: string;
}

interface CatalogOptions {
  packageRoot?: string;
  sourceRevision?: string;
}

const PACKAGE_ROOT = join(
  process.cwd(),
  "..",
  "..",
  "packages",
  "arcanea-skills",
);

/** Read the same validated, ready catalog as the package API and installer. */
export async function getAllSkills(
  options: CatalogOptions = {},
): Promise<Skill[]> {
  const packageRoot = options.packageRoot ?? PACKAGE_ROOT;
  const catalog = loadCatalog(packageRoot);
  if (catalog.sourceRepo !== "frankxai/arcanea-ai-app") {
    throw new Error("Unexpected skill source repository");
  }
  const sources = validateSources(packageRoot, catalog);
  const ready = selectReady(catalog);
  if (!ready.length) return [];

  const revision = options.sourceRevision ?? process.env.VERCEL_GIT_COMMIT_SHA;
  if (!revision || !/^[a-f0-9]{40}$/.test(revision)) {
    throw new Error("Ready skills require an immutable source revision");
  }
  const sourceBase = `https://github.com/frankxai/arcanea-ai-app/blob/${revision}/packages/arcanea-skills`;
  return ready
    .map((entry) => {
      const source = sources.find((row) => row.name === entry.name);
      if (!source) throw new Error(`Missing validated source: ${entry.name}`);
      return {
        slug: entry.name,
        name: entry.name,
        description: source.description,
        category: entry.category,
        author: entry.owner,
        license: entry.rights?.license ?? undefined,
        readmeContent: source.body,
        sourceUrl: `${sourceBase}/${entry.path}/SKILL.md`,
        installGuideUrl: `${sourceBase}/README.md`,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getSkillBySlug(
  slug: string,
  options: CatalogOptions = {},
): Promise<Skill | null> {
  return (
    (await getAllSkills(options)).find((skill) => skill.slug === slug) ?? null
  );
}

export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  return (await getAllSkills()).filter(
    (skill) => (skill.category ?? "").toLowerCase() === category.toLowerCase(),
  );
}

export function getCategories(skills: Skill[]): string[] {
  return [
    ...new Set(
      skills.flatMap((skill) => (skill.category ? [skill.category] : [])),
    ),
  ].sort();
}
