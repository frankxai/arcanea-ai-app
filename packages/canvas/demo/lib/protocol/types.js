/**
 * Arcanea Canvas wire protocol, v1.
 *
 * Server-authoritative op log, not a CRDT. The server must be able to refuse an
 * op — a generation costs credits and can violate canon — and refusal is not
 * expressible in a merge-always model. Character-level text merging happens in a
 * separate Yjs document per text node, where merge-always IS correct.
 */
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
};
