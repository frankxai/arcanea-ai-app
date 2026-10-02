import type { Buffer } from "node:buffer";

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
  evaluation?: {
    status: string;
    evidence?: string | null;
    contentSha256?: string | null;
  };
  review?: {
    status: string;
    evidence?: string | null;
    maker?: string | null;
    reviewer?: string | null;
    contentSha256?: string | null;
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
  readBytes?: (path: string) => Buffer,
): ValidatedSource[];
export function contained(root: string, target: string): boolean;
