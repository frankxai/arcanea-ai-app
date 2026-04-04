// World Persistence — file-backed storage for creation graphs
// Keeps the in-memory Map as the fast cache; .arcanea/worlds/{sessionId}.json as durability.
import * as fs from "fs";
import * as path from "path";
// Resolve the worlds directory relative to the repo root.
// __dirname is packages/arcanea-mcp/src/tools at runtime, so walk up 4 levels.
function getWorldsDir() {
    const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "../../../../");
    return path.join(repoRoot, ".arcanea", "worlds");
}
function ensureWorldsDir() {
    const dir = getWorldsDir();
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
}
function worldFilePath(sessionId) {
    // Sanitize sessionId to prevent directory traversal
    const safe = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
    return path.join(getWorldsDir(), `${safe}.json`);
}
// -------------------------------------------------------------------------
// Save
// -------------------------------------------------------------------------
export function saveWorldToDisk(sessionId, nodes, edges) {
    ensureWorldsDir();
    const filePath = worldFilePath(sessionId);
    const payload = {
        sessionId,
        savedAt: new Date().toISOString(),
        nodes,
        edges,
    };
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
    return { filePath, nodeCount: nodes.length, edgeCount: edges.length };
}
// -------------------------------------------------------------------------
// Load
// -------------------------------------------------------------------------
export function loadWorldFromDisk(sessionId) {
    const filePath = worldFilePath(sessionId);
    if (!fs.existsSync(filePath)) {
        return null;
    }
    try {
        const raw = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(raw);
    }
    catch {
        // Corrupt file — treat as empty world
        return null;
    }
}
// -------------------------------------------------------------------------
// List saved worlds
// -------------------------------------------------------------------------
export function listSavedWorlds() {
    try {
        const dir = getWorldsDir();
        if (!fs.existsSync(dir))
            return [];
        return fs
            .readdirSync(dir)
            .filter((f) => f.endsWith(".json"))
            .map((f) => {
            try {
                const raw = fs.readFileSync(path.join(dir, f), "utf-8");
                const g = JSON.parse(raw);
                return {
                    sessionId: g.sessionId,
                    savedAt: g.savedAt,
                    nodeCount: g.nodes.length,
                    edgeCount: g.edges.length,
                };
            }
            catch {
                return null;
            }
        })
            .filter((x) => x !== null);
    }
    catch {
        return [];
    }
}
// -------------------------------------------------------------------------
// Debounce helper — module-level so it persists across calls
// -------------------------------------------------------------------------
const pendingSaves = new Map();
export function scheduleSave(sessionId, getNodes, getEdges, delayMs = 5000) {
    const existing = pendingSaves.get(sessionId);
    if (existing)
        clearTimeout(existing);
    const timer = setTimeout(() => {
        pendingSaves.delete(sessionId);
        try {
            saveWorldToDisk(sessionId, getNodes(), getEdges());
        }
        catch {
            // Best-effort — never crash the server for a background save
        }
    }, delayMs);
    pendingSaves.set(sessionId, timer);
}
//# sourceMappingURL=world-persistence.js.map