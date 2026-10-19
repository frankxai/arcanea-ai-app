// World Persistence — file-backed storage for creation graphs
// Keeps the in-memory Map as the fast cache; .arcanea/worlds/{sessionId}.json as durability.

import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "node:crypto";
import { getDataDirectory } from "../storage-paths.js";
import type { CreationNode, CreationEdge } from "./creation-graph.js";
import { validateCreationGraph } from "./graph-validation.js";

function getWorldsDir(): string {
  return path.join(getDataDirectory(), "worlds");
}

function ensureWorldsDir(): string {
  const dir = getWorldsDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function worldFilePath(sessionId: string): string {
  // Reject ambiguous names rather than mapping different ids to the same file.
  if (
    !/^[a-zA-Z0-9_-]{1,128}$/.test(sessionId) ||
    /^(?:con|prn|aux|nul|com[0-9]|lpt[0-9])$/i.test(sessionId)
  ) {
    throw new Error(
      "World session id must be 1–128 letters, digits, underscores or hyphens and not a reserved filename.",
    );
  }
  return path.join(getWorldsDir(), `${sessionId}.json`);
}

export interface SerializedGraph {
  sessionId: string;
  savedAt: string;
  nodes: CreationNode[];
  edges: CreationEdge[];
}

// -------------------------------------------------------------------------
// Save
// -------------------------------------------------------------------------

export function saveWorldToDisk(
  sessionId: string,
  nodes: CreationNode[],
  edges: CreationEdge[],
): { filePath: string; nodeCount: number; edgeCount: number } {
  const filePath = worldFilePath(sessionId);
  const snapshot = validateCreationGraph(nodes, edges);
  // In particular, two ids differing only by case share a path on Windows.
  // Never replace a corrupt file or a snapshot belonging to a different id.
  if (fs.existsSync(filePath)) loadWorldFromDisk(sessionId);
  ensureWorldsDir();
  const payload: SerializedGraph = {
    sessionId,
    savedAt: new Date().toISOString(),
    ...snapshot,
  };
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporaryPath, JSON.stringify(payload, null, 2), {
      encoding: "utf-8",
      flag: "wx",
      mode: 0o600,
    });
    fs.renameSync(temporaryPath, filePath);
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }
  return { filePath, nodeCount: nodes.length, edgeCount: edges.length };
}

// -------------------------------------------------------------------------
// Load
// -------------------------------------------------------------------------

export function loadWorldFromDisk(sessionId: string): SerializedGraph | null {
  const filePath = worldFilePath(sessionId);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const graph = JSON.parse(raw) as SerializedGraph;
    if (
      !graph ||
      graph.sessionId !== sessionId ||
      typeof graph.savedAt !== "string" ||
      !Array.isArray(graph.nodes) ||
      !Array.isArray(graph.edges)
    ) {
      throw new Error("World file identity or structure is invalid.");
    }
    return { ...graph, ...validateCreationGraph(graph.nodes, graph.edges) };
  } catch {
    throw new Error(
      `Cannot load saved world ${sessionId}: the file is unreadable or invalid. It has not been modified.`,
    );
  }
}

// -------------------------------------------------------------------------
// List saved worlds
// -------------------------------------------------------------------------

export function listSavedWorlds(): Array<{
  sessionId: string;
  savedAt: string;
  nodeCount: number;
  edgeCount: number;
}> {
  const dir = getWorldsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const saved = loadWorldFromDisk(file.slice(0, -5));
      if (!saved)
        throw new Error(
          "A saved world disappeared while listing. Retry the request.",
        );
      return {
        sessionId: saved.sessionId,
        savedAt: saved.savedAt,
        nodeCount: saved.nodes.length,
        edgeCount: saved.edges.length,
      };
    });
}

// -------------------------------------------------------------------------
// Debounce helper — module-level so it persists across calls
// -------------------------------------------------------------------------

const pendingSaves = new Map<string, ReturnType<typeof setTimeout>>();

export function scheduleSave(
  sessionId: string,
  getNodes: () => CreationNode[],
  getEdges: () => CreationEdge[],
  delayMs = 5000,
): void {
  const existing = pendingSaves.get(sessionId);
  if (existing) clearTimeout(existing);
  const timer = setTimeout(() => {
    pendingSaves.delete(sessionId);
    try {
      saveWorldToDisk(sessionId, getNodes(), getEdges());
    } catch {
      // Best-effort — never crash the server for a background save
    }
  }, delayMs);
  pendingSaves.set(sessionId, timer);
}
