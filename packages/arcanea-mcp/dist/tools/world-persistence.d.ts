import type { CreationNode, CreationEdge } from "./creation-graph.js";
export interface SerializedGraph {
    sessionId: string;
    savedAt: string;
    nodes: CreationNode[];
    edges: CreationEdge[];
}
export declare function saveWorldToDisk(sessionId: string, nodes: CreationNode[], edges: CreationEdge[]): {
    filePath: string;
    nodeCount: number;
    edgeCount: number;
};
export declare function loadWorldFromDisk(sessionId: string): SerializedGraph | null;
export declare function listSavedWorlds(): Array<{
    sessionId: string;
    savedAt: string;
    nodeCount: number;
    edgeCount: number;
}>;
export declare function scheduleSave(sessionId: string, getNodes: () => CreationNode[], getEdges: () => CreationEdge[], delayMs?: number): void;
//# sourceMappingURL=world-persistence.d.ts.map