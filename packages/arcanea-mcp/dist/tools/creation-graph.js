// Creation Graph - Relationship Network for Generated Content
// Inspired by Qdrant vector patterns and knowledge graphs
// In-memory graph store
const graphs = new Map();
function getOrCreateGraph(sessionId) {
    if (!graphs.has(sessionId)) {
        graphs.set(sessionId, {
            nodes: new Map(),
            edges: [],
        });
    }
    return graphs.get(sessionId);
}
export function getGraphNodes(sessionId) {
    const graph = getOrCreateGraph(sessionId);
    return [...graph.nodes.values()];
}
export function getGraphEdges(sessionId) {
    const graph = getOrCreateGraph(sessionId);
    return [...graph.edges];
}
export function addCreationToGraph(sessionId, creation, metadata = {}) {
    const graph = getOrCreateGraph(sessionId);
    const node = {
        id: creation.id,
        type: creation.type,
        name: creation.name,
        element: creation.element,
        gate: creation.gate,
        createdAt: creation.createdAt instanceof Date
            ? creation.createdAt.toISOString()
            : creation.createdAt ?? new Date().toISOString(),
        metadata,
    };
    graph.nodes.set(creation.id, node);
    // Auto-detect relationships based on shared properties
    autoLinkByElement(sessionId, node);
    autoLinkByGate(sessionId, node);
    return node;
}
export function linkCreations(sessionId, sourceId, targetId, relationship, strength = 0.5, metadata) {
    const graph = getOrCreateGraph(sessionId);
    if (!graph.nodes.has(sourceId) || !graph.nodes.has(targetId)) {
        return null;
    }
    const edge = {
        id: `${sourceId}-${relationship}-${targetId}`,
        sourceId,
        targetId,
        relationship,
        strength: Math.min(1, Math.max(0, strength)),
        metadata,
    };
    // Avoid duplicate edges
    const existingIdx = graph.edges.findIndex((e) => e.sourceId === sourceId &&
        e.targetId === targetId &&
        e.relationship === relationship);
    if (existingIdx >= 0) {
        graph.edges[existingIdx] = edge; // Update existing
    }
    else {
        graph.edges.push(edge);
    }
    return edge;
}
function autoLinkByElement(sessionId, newNode) {
    if (!newNode.element)
        return;
    const graph = getOrCreateGraph(sessionId);
    for (const [id, node] of graph.nodes) {
        if (id === newNode.id)
            continue;
        if (node.element === newNode.element) {
            linkCreations(sessionId, newNode.id, id, "same_element", 0.3);
        }
    }
}
function autoLinkByGate(sessionId, newNode) {
    if (!newNode.gate)
        return;
    const graph = getOrCreateGraph(sessionId);
    for (const [id, node] of graph.nodes) {
        if (id === newNode.id)
            continue;
        if (node.gate === newNode.gate) {
            linkCreations(sessionId, newNode.id, id, "same_gate", 0.3);
        }
    }
}
export function getRelatedCreations(sessionId, creationId, relationshipFilter) {
    const graph = getOrCreateGraph(sessionId);
    const results = [];
    for (const edge of graph.edges) {
        if (relationshipFilter && edge.relationship !== relationshipFilter)
            continue;
        if (edge.sourceId === creationId && graph.nodes.has(edge.targetId)) {
            results.push({
                node: graph.nodes.get(edge.targetId),
                relationship: edge.relationship,
                strength: edge.strength,
            });
        }
        else if (edge.targetId === creationId && graph.nodes.has(edge.sourceId)) {
            results.push({
                node: graph.nodes.get(edge.sourceId),
                relationship: edge.relationship,
                strength: edge.strength,
            });
        }
    }
    // Sort by strength descending
    return results.sort((a, b) => b.strength - a.strength);
}
export function suggestConnections(sessionId, creationId) {
    const graph = getOrCreateGraph(sessionId);
    const source = graph.nodes.get(creationId);
    if (!source)
        return [];
    const suggestions = [];
    // Get existing connections
    const existingConnections = new Set(graph.edges
        .filter((e) => e.sourceId === creationId || e.targetId === creationId)
        .flatMap((e) => [e.sourceId, e.targetId]));
    for (const [id, target] of graph.nodes) {
        if (id === creationId || existingConnections.has(id))
            continue;
        // Suggest based on type compatibility
        if (source.type === "character" && target.type === "location") {
            suggestions.push({
                target,
                suggestedRelationship: "located_at",
                reason: `${source.name} could be found at ${target.name}`,
            });
        }
        else if (source.type === "character" && target.type === "artifact") {
            suggestions.push({
                target,
                suggestedRelationship: "wields",
                reason: `${source.name} could wield ${target.name}`,
            });
        }
        else if (source.type === "character" && target.type === "creature") {
            suggestions.push({
                target,
                suggestedRelationship: "allies_with",
                reason: `${source.name} could ally with ${target.name}`,
            });
        }
        else if (source.type === "creature" && target.type === "location") {
            suggestions.push({
                target,
                suggestedRelationship: "inhabits",
                reason: `${source.name} could inhabit ${target.name}`,
            });
        }
        else if (source.type === "artifact" && target.type === "character") {
            suggestions.push({
                target,
                suggestedRelationship: "created_by",
                reason: `${source.name} could have been created by ${target.name}`,
            });
        }
    }
    return suggestions.slice(0, 5); // Return top 5 suggestions
}
export function getGraphSummary(sessionId) {
    const graph = getOrCreateGraph(sessionId);
    const nodesByType = {};
    const nodesByElement = {};
    const connectionCounts = new Map();
    for (const [id, node] of graph.nodes) {
        nodesByType[node.type] = (nodesByType[node.type] || 0) + 1;
        if (node.element) {
            nodesByElement[node.element] = (nodesByElement[node.element] || 0) + 1;
        }
        connectionCounts.set(id, 0);
    }
    for (const edge of graph.edges) {
        connectionCounts.set(edge.sourceId, (connectionCounts.get(edge.sourceId) || 0) + 1);
        connectionCounts.set(edge.targetId, (connectionCounts.get(edge.targetId) || 0) + 1);
    }
    const mostConnected = Array.from(connectionCounts.entries())
        .map(([id, count]) => ({
        name: graph.nodes.get(id)?.name || id,
        connections: count,
    }))
        .sort((a, b) => b.connections - a.connections)
        .slice(0, 5);
    return {
        nodeCount: graph.nodes.size,
        edgeCount: graph.edges.length,
        nodesByType,
        nodesByElement,
        mostConnected,
    };
}
// Export graph as JSON for visualization
export function exportGraph(sessionId) {
    const graph = getOrCreateGraph(sessionId);
    return {
        nodes: Array.from(graph.nodes.values()),
        edges: graph.edges,
    };
}
// Find path between two creations
export function findPath(sessionId, sourceId, targetId, maxDepth = 5) {
    const graph = getOrCreateGraph(sessionId);
    if (!graph.nodes.has(sourceId) || !graph.nodes.has(targetId)) {
        return null;
    }
    // BFS to find shortest path
    const visited = new Set();
    const queue = [{ nodeId: sourceId, path: [] }];
    while (queue.length > 0) {
        const current = queue.shift();
        if (current.path.length > maxDepth)
            continue;
        if (visited.has(current.nodeId))
            continue;
        visited.add(current.nodeId);
        if (current.nodeId === targetId) {
            return current.path;
        }
        // Find connected nodes
        for (const edge of graph.edges) {
            let nextId = null;
            if (edge.sourceId === current.nodeId) {
                nextId = edge.targetId;
            }
            else if (edge.targetId === current.nodeId) {
                nextId = edge.sourceId;
            }
            if (nextId && !visited.has(nextId)) {
                queue.push({
                    nodeId: nextId,
                    path: [...current.path, { nodeId: nextId, relationship: edge.relationship }],
                });
            }
        }
    }
    return null; // No path found
}
//# sourceMappingURL=creation-graph.js.map