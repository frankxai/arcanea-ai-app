/**
 * Arcanea Canvas wire protocol, v1.
 *
 * Server-authoritative op log, not a CRDT. The server must be able to refuse an
 * op — a generation costs credits and can violate canon — and refusal is not
 * expressible in a merge-always model. Character-level text merging happens in a
 * separate Yjs document per text node, where merge-always IS correct.
 */

export type NodeKind =
  | 'lore'
  | 'prompt'
  | 'generate'
  | 'media'
  | 'identity'
  | 'note'
  | 'group';

/** Port shape encodes what flows through an edge. Monochrome by design. */
export type PortKind = 'media' | 'text' | 'identity';

export interface CanvasNode {
  id: string;
  kind: NodeKind;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  data: Record<string, unknown>;
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  sourcePort?: string;
  targetPort?: string;
}

export type ResultState = 'queued' | 'running' | 'ready' | 'failed' | 'cancelled';

export interface CanvasResult {
  id: string;
  nodeId: string;
  state: ResultState;
  /** Everything needed to re-derive this asset. Powers the provenance ribbon. */
  provenance: {
    model: string;
    canonRef: string;
    seed?: number;
    inputs: string[];
    createdAt: string;
  };
  output?: { url: string; mime: string; width?: number; height?: number };
  error?: string;
}

export const OpType = {
  NodeProp: 0,
  NodeAdd: 1,
  NodeRemove: 2,
  EdgeAdd: 3,
  EdgeRemove: 4,
  ResultUpdate: 5,
  Batch: 6,
  HistoryAppend: 7,
  HistoryRemove: 8,
} as const;

export type OpTypeValue = (typeof OpType)[keyof typeof OpType];

interface OpBase {
  id: string;
  clientId: string;
  /** Assigned by the server. Absent means not yet acknowledged. */
  seq?: number;
  ts?: number;
}

/**
 * Dotted key path against the node, e.g. `data.input.model`. Patching a path
 * rather than replacing the node is what lets two people edit different fields
 * of the same node in the same frame without clobbering each other.
 */
export type NodePropOp = OpBase & {
  type: typeof OpType.NodeProp;
  nodeId: string;
  key: string;
  value?: unknown;
  unset?: boolean;
};

export type NodeAddOp = OpBase & { type: typeof OpType.NodeAdd; nodeId: string; node: CanvasNode };
export type NodeRemoveOp = OpBase & { type: typeof OpType.NodeRemove; nodeId: string };
export type EdgeAddOp = OpBase & { type: typeof OpType.EdgeAdd; edgeId: string; edge: CanvasEdge };
export type EdgeRemoveOp = OpBase & { type: typeof OpType.EdgeRemove; edgeId: string };
export type ResultUpdateOp = OpBase & {
  type: typeof OpType.ResultUpdate;
  resultId: string;
  entry: CanvasResult;
};
export type HistoryAppendOp = OpBase & {
  type: typeof OpType.HistoryAppend;
  nodeId: string;
  resultId: string;
};
export type HistoryRemoveOp = OpBase & {
  type: typeof OpType.HistoryRemove;
  nodeId: string;
  resultId: string;
};
export type BatchOp = OpBase & { type: typeof OpType.Batch; ops: Op[] };

export type Op =
  | NodePropOp
  | NodeAddOp
  | NodeRemoveOp
  | EdgeAddOp
  | EdgeRemoveOp
  | ResultUpdateOp
  | HistoryAppendOp
  | HistoryRemoveOp
  | BatchOp;

export interface CanvasSnapshot {
  seq: number;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  results: CanvasResult[];
  nodeHistory: Record<string, string[]>;
}

export interface CanvasState {
  seq: number;
  nodes: Map<string, CanvasNode>;
  edges: Map<string, CanvasEdge>;
  results: Map<string, CanvasResult>;
  nodeHistory: Map<string, string[]>;
}

export type ClientMessage =
  | { kind: 'op'; ops: Op[] }
  | { kind: 'sync'; lastSeq: number; pendingOpIds: string[] }
  | { kind: 'snapshot_request' }
  | { kind: 'awareness'; payload: Awareness };

export type RejectReason =
  | 'not_enough_credits'
  | 'daily_limit_reached'
  | 'canon_locked'
  | 'node_missing'
  | 'forbidden'
  | 'malformed';

export type ServerMessage =
  | { kind: 'op'; ops: Op[] }
  | { kind: 'snapshot'; snapshot: CanvasSnapshot }
  | { kind: 'op_status'; opId: string; status: 'applied'; seq: number }
  | { kind: 'reject'; opId: string; reason: RejectReason; message?: string }
  | {
      kind: 'sync_result';
      mode: 'ops' | 'snapshot';
      ops?: Op[];
      snapshot?: CanvasSnapshot;
      outcomes: Record<string, 'applied' | 'rejected'>;
    }
  | { kind: 'awareness'; payload: Awareness[] };

export interface Awareness {
  clientId: string;
  name: string;
  /** Stable per-member hue offset; never one of the two reserved signal colors. */
  tint: number;
  cursor?: { x: number; y: number };
  viewport?: { x: number; y: number; zoom: number };
  selection?: string[];
}
