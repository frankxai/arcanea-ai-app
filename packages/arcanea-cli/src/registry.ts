import fs from "fs";
import path from "path";
import fetch from "node-fetch";

export interface RegistryFile {
  path: string;
  type: string;
  target: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  categories: string[];
  author: string;
  homepage: string;
  keywords: string[];
  meta: {
    slug: string;
    version: string;
    license: string;
    tags: string[];
  };
  files: RegistryFile[];
}

export interface Registry {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

const REMOTE_REGISTRY_URL = "https://raw.githubusercontent.com/frankxai/arcanea-ai-app/main/oss/skills/registry.json";
const REMOTE_RAW_BASE = "https://raw.githubusercontent.com/frankxai/arcanea-ai-app/main/oss/";

/**
 * Finds the local registry path if run within the monorepo.
 */
export function getLocalRegistryPath(): string | null {
  // Check relative paths from packages/arcanea-cli
  const checkPaths = [
    path.resolve(process.cwd(), "oss/skills/registry.json"),
    path.resolve(process.cwd(), "../oss/skills/registry.json"),
    path.resolve(process.cwd(), "../../oss/skills/registry.json"),
  ];

  for (const p of checkPaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

/**
 * Fetches the registry from local disk or falls back to remote GitHub URL.
 */
export async function fetchRegistry(): Promise<Registry> {
  const localPath = getLocalRegistryPath();
  if (localPath) {
    try {
      const content = fs.readFileSync(localPath, "utf-8");
      return JSON.parse(content) as Registry;
    } catch (e) {
      console.warn("Failed to read local registry, falling back to remote...");
    }
  }

  const response = await fetch(REMOTE_REGISTRY_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch remote registry: ${response.statusText}`);
  }
  return (await response.json()) as Registry;
}

/**
 * Fetches/Reads the content of a skill file.
 * If local registry path is found, it reads from the local monorepo directory structure.
 * Otherwise, it downloads from GitHub.
 */
export async function getFileContent(filePath: string): Promise<string> {
  const localRegistry = getLocalRegistryPath();
  if (localRegistry) {
    const ossDir = path.dirname(path.dirname(localRegistry));
    const fullLocalPath = path.resolve(ossDir, filePath);
    if (fs.existsSync(fullLocalPath)) {
      return fs.readFileSync(fullLocalPath, "utf-8");
    }
  }

  const remoteUrl = `${REMOTE_RAW_BASE}${filePath}`;
  const response = await fetch(remoteUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch remote file ${filePath}: ${response.statusText}`);
  }
  return await response.text();
}
