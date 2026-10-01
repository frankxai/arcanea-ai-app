export interface CatalogSkill {
  name: string;
  path: string;
  category: string;
  owner: string;
  status: "candidate" | "ready";
  rights?: {
    status: string;
    license?: string | null;
    evidence?: string | null;
  };
}

export interface Catalog {
  schema: string;
  sourceRepo: string;
  root: string;
  skills: CatalogSkill[];
}

export interface ValidatedSource {
  name: string;
  path: string;
  sha256: string;
  files: string[];
  description: string;
  body: string;
}

export function loadCatalog(packageRoot: string): Catalog;
export function selectReady(catalog: Catalog): CatalogSkill[];
export function validateSources(
  packageRoot: string,
  catalog: Catalog,
): ValidatedSource[];
export function contained(root: string, target: string): boolean;
