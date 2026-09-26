interface SkillCategory {
  readonly label: string;
  readonly skills: readonly string[];
}

interface SkillCatalog {
  readonly name: string;
  readonly version: string;
  /** Actual bundled skill count; not an ecosystem-wide estimate. */
  readonly skillCount: number;
  readonly bundledCount: number;
  readonly categories: Readonly<Record<string, SkillCategory>>;
  readonly skills: readonly string[];
  readonly skillsDir: string;
  getSkillPath(skillName: string): string;
  getByCategory(category: string): string[];
}

declare const catalog: SkillCatalog;
export = catalog;
