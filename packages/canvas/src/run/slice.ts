import type { CanvasEdge, CanvasNode, CanvasState, NodeKind } from '../protocol/types.ts';

/** Kinds that execute, and therefore continue the upstream walk. */
const RUNNABLE: ReadonlySet<NodeKind> = new Set(['generate']);
/** Kinds that supply context but terminate the walk. */
const CONTEXT: ReadonlySet<NodeKind> = new Set(['lore', 'prompt', 'media', 'identity', 'note']);

export interface RunSlice {
  nodeIds: string[];
  edges: CanvasEdge[];
  runnableNodeIds: string[];
}

/**
 * Walk back from the requested nodes collecting every ancestor needed to
 * reproduce them, then forward across connected generators. Sending the slice
 * rather than the whole graph keeps a 400-node canvas from re-running itself
 * because someone hit a single node.
 */
export function sliceForRun(state: CanvasState, targets: string[]): RunSlice {
  const runnable = targets.filter((id) => {
    const node = state.nodes.get(id);
    return !!node && RUNNABLE.has(node.kind);
  });
  if (runnable.length === 0) return { nodeIds: [], edges: [], runnableNodeIds: [] };

  const included = new Set(runnable);
  const edges = [...state.edges.values()];
  let grew = true;

  while (grew) {
    grew = false;
    for (const edge of edges) {
      if (included.has(edge.target) && !included.has(edge.source)) {
        const source = state.nodes.get(edge.source);
        if (!source) continue;
        // Unlike a leaf-prompt canvas, an Arcanea prompt composes lore and
        // characters, so context nodes keep the walk going. The visited set
        // bounds it; a cycle cannot loop.
        if (RUNNABLE.has(source.kind) || CONTEXT.has(source.kind)) {
          included.add(edge.source);
          grew = true;
        }
      }
      if (included.has(edge.source) && !included.has(edge.target)) {
        const source = state.nodes.get(edge.source);
        const target = state.nodes.get(edge.target);
        if (source && target && RUNNABLE.has(source.kind) && RUNNABLE.has(target.kind)) {
          included.add(edge.target);
          grew = true;
        }
      }
    }
  }

  return {
    nodeIds: [...included],
    edges: edges.filter((edge) => included.has(edge.source) && included.has(edge.target)),
    runnableNodeIds: runnable,
  };
}

/** Canon entities every node in the slice inherits — what the Canon Rail shows. */
export function canonBindings(state: CanvasState, slice: RunSlice): string[] {
  const bindings = new Set<string>();
  for (const id of slice.nodeIds) {
    const node: CanvasNode | undefined = state.nodes.get(id);
    const refs = (node?.data as { canon?: { refs?: string[] } } | undefined)?.canon?.refs;
    for (const ref of refs ?? []) bindings.add(ref);
  }
  return [...bindings].sort();
}
