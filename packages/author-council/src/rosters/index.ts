import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { RosterManifest } from "../protocol/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, "..", "..");
const ROSTERS_DIR = join(PACKAGE_ROOT, "rosters");

export interface RosterLoaderOptions {
  rostersDir?: string;
}

export async function loadRoster(
  id: string,
  options: RosterLoaderOptions = {},
): Promise<RosterManifest> {
  const dir = options.rostersDir ?? ROSTERS_DIR;
  const raw = await readFile(join(dir, `${id}.json`), "utf8");
  return JSON.parse(raw) as RosterManifest;
}

export async function listRosters(
  options: RosterLoaderOptions = {},
): Promise<string[]> {
  const dir = options.rostersDir ?? ROSTERS_DIR;
  const entries = await readdir(dir);
  return entries.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
}

export { ROSTERS_DIR };
