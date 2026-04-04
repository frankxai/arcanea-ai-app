import { CreationRef } from "../memory/index.js";
export interface CreationNode {
    id: string;
    type: CreationRef["type"];
    name: string;
    element?: string;
    gate?: number;
    createdAt: string;
    metadata: Record<string, any>;
}
export interface CreationEdge {
    id: string;
    sourceId: string;
    targetId: string;
    relationship: RelationshipType;
    strength: number;
    metadata?: Record<string, any>;
}
export type RelationshipType = "created_by" | "mentored_by" | "located_at" | "wields" | "inhabits" | "guards" | "opposes" | "allies_with" | "transforms_into" | "derived_from" | "part_of" | "same_element" | "same_house" | "same_gate";
export declare function getGraphNodes(sessionId: string): CreationNode[];
export declare function getGraphEdges(sessionId: string): CreationEdge[];
export declare function addCreationToGraph(sessionId: string, creation: CreationRef, metadata?: Record<string, any>): CreationNode;
export declare function linkCreations(sessionId: string, sourceId: string, targetId: string, relationship: RelationshipType, strength?: number, metadata?: Record<string, any>): CreationEdge | null;
export declare function getRelatedCreations(sessionId: string, creationId: string, relationshipFilter?: RelationshipType): Array<{
    node: CreationNode;
    relationship: RelationshipType;
    strength: number;
}>;
export declare function suggestConnections(sessionId: string, creationId: string): Array<{
    target: CreationNode;
    suggestedRelationship: RelationshipType;
    reason: string;
}>;
export declare function getGraphSummary(sessionId: string): {
    nodeCount: number;
    edgeCount: number;
    nodesByType: Record<string, number>;
    nodesByElement: Record<string, number>;
    mostConnected: Array<{
        name: string;
        connections: number;
    }>;
};
export declare function exportGraph(sessionId: string): {
    nodes: CreationNode[];
    edges: CreationEdge[];
};
export declare function findPath(sessionId: string, sourceId: string, targetId: string, maxDepth?: number): Array<{
    nodeId: string;
    relationship: RelationshipType;
}> | null;
//# sourceMappingURL=creation-graph.d.ts.map