import { setPath, unsetPath } from './paths.ts';
import {
  type CanvasSnapshot,
  type CanvasState,
  type Op,
  OpType,
} from './types.ts';

export function emptyState(): CanvasState {
  return {
    seq: 0,
    nodes: new Map(),
    edges: new Map(),
    results: new Map(),
    nodeHistory: new Map(),
  };
}

export function fromSnapshot(snapshot: CanvasSnapshot): CanvasState {
  return {
    seq: snapshot.seq,
    nodes: new Map(snapshot.nodes.map((n) => [n.id, n])),
    edges: new Map(snapshot.edges.map((e) => [e.id, e])),
    results: new Map(snapshot.results.map((r) => [r.id, r])),
    nodeHistory: new Map(Object.entries(snapshot.nodeHistory).map(([k, v]) => [k, [...v]])),
  };
}

export function toSnapshot(state: CanvasState): CanvasSnapshot {
  return {
    seq: state.seq,
    nodes: [...state.nodes.values()],
    edges: [...state.edges.values()],
    results: [...state.results.values()],
    nodeHistory: Object.fromEntries(state.nodeHistory),
  };
}

/** Mutates in place. Callers clone first when they need the previous state. */
export function applyOp(state: CanvasState, op: Op): void {
  switch (op.type) {
    case OpType.Batch: {
      for (const child of op.ops) applyOp(state, child);
      break;
    }
    case OpType.NodeAdd: {
      state.nodes.set(op.nodeId, op.node);
      break;
    }
    case OpType.NodeRemove: {
      state.nodes.delete(op.nodeId);
      state.nodeHistory.delete(op.nodeId);
      for (const [id, edge] of state.edges) {
        if (edge.source === op.nodeId || edge.target === op.nodeId) state.edges.delete(id);
      }
      break;
    }
    case OpType.NodeProp: {
      const node = state.nodes.get(op.nodeId);
      if (!node) return;
      state.nodes.set(op.nodeId, op.unset ? unsetPath(node, op.key) : setPath(node, op.key, op.value));
      break;
    }
    case OpType.EdgeAdd: {
      state.edges.set(op.edgeId, op.edge);
      break;
    }
    case OpType.EdgeRemove: {
      state.edges.delete(op.edgeId);
      break;
    }
    case OpType.ResultUpdate: {
      state.results.set(op.resultId, op.entry);
      break;
    }
    case OpType.HistoryAppend: {
      const list = state.nodeHistory.get(op.nodeId) ?? [];
      if (!list.includes(op.resultId)) {
        state.nodeHistory.set(op.nodeId, [...list, op.resultId]);
      }
      break;
    }
    case OpType.HistoryRemove: {
      const list = state.nodeHistory.get(op.nodeId);
      if (list) state.nodeHistory.set(op.nodeId, list.filter((r) => r !== op.resultId));
      break;
    }
  }
  if (op.seq !== undefined && op.seq > state.seq) state.seq = op.seq;
}

export function cloneState(state: CanvasState): CanvasState {
  return {
    seq: state.seq,
    nodes: new Map(state.nodes),
    edges: new Map(state.edges),
    results: new Map(state.results),
    nodeHistory: new Map([...state.nodeHistory].map(([k, v]) => [k, [...v]])),
  };
}
