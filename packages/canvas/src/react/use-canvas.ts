import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { CanvasDoc } from '../protocol/doc.ts';
import { OpType, type CanvasState, type Op, type RejectReason } from '../protocol/types.ts';
import { sliceForRun, canonBindings } from '../run/slice.ts';
import type { Transport } from '../transport/types.ts';

export interface UseCanvasOptions {
  clientId: string;
  transport: Transport;
  onRefused?(reason: RejectReason, message?: string): void;
}

let opCounter = 0;
const opId = () => `op_${Date.now().toString(36)}_${(opCounter++).toString(36)}`;

/**
 * Binds the document to React. Nodes are read through a snapshot store rather
 * than component state so that dragging one node does not re-render the other
 * three hundred.
 */
export function useCanvas({ clientId, transport, onRefused }: UseCanvasOptions) {
  const listeners = useRef(new Set<() => void>());
  const snapshot = useRef<CanvasState | null>(null);

  const doc = useMemo(
    () =>
      new CanvasDoc(clientId, transport, {
        onChange: (state) => {
          snapshot.current = state;
          for (const listener of listeners.current) listener();
        },
        onReject: (_id, reason, message) => onRefused?.(reason, message),
      }),
    [clientId, transport, onRefused],
  );

  const subscribe = useCallback((listener: () => void) => {
    listeners.current.add(listener);
    return () => listeners.current.delete(listener);
  }, []);

  const state = useSyncExternalStore(
    subscribe,
    () => snapshot.current ?? doc.getState(),
    () => doc.getState(),
  );

  useEffect(() => () => doc.flush(), [doc]);

  const commit = useCallback((ops: Omit<Op, 'id' | 'clientId'>[]) => {
    doc.commit(ops.map((op) => ({ ...op, id: opId(), clientId }) as Op));
  }, [doc, clientId]);

  /** Patch one field. Never send the whole node — that is how edits get eaten. */
  const setNodeProp = useCallback(
    (nodeId: string, key: string, value: unknown) => {
      commit([{ type: OpType.NodeProp, nodeId, key, value } as Omit<Op, 'id' | 'clientId'>]);
    },
    [commit],
  );

  const moveNode = useCallback(
    (nodeId: string, position: { x: number; y: number }) => setNodeProp(nodeId, 'position', position),
    [setNodeProp],
  );

  const [selection, setSelection] = useState<string[]>([]);

  /** What the Canon Rail renders: every canon entity upstream of the selection. */
  const bindings = useMemo(() => {
    if (selection.length === 0) return [];
    const slice = sliceForRun(state, selection);
    const nodeIds = slice.nodeIds.length > 0 ? slice.nodeIds : selection;
    return canonBindings(state, { nodeIds, edges: [], runnableNodeIds: [] });
  }, [state, selection]);

  const nodes = useMemo(() => [...state.nodes.values()], [state.nodes]);
  const edges = useMemo(() => [...state.edges.values()], [state.edges]);

  return { doc, state, nodes, edges, commit, setNodeProp, moveNode, selection, setSelection, bindings };
}
