import { applyOp, emptyState, toSnapshot } from "../protocol/reducer.js";
/**
 * In-process stand-in for the sequencing server. Same message contract as the
 * Supabase transport, so the UI and the doc are exercised identically offline,
 * in tests, and in the demo.
 */
export class LocalTransport {
    state = emptyState();
    seq = 0;
    messageHandlers = [];
    connectionHandlers = [];
    log = [];
    policy;
    constructor(policy = {}) {
        this.policy = policy;
    }
    start() {
        queueMicrotask(() => {
            this.emit({ kind: 'snapshot', snapshot: toSnapshot(this.state) });
            for (const handler of this.connectionHandlers)
                handler(true);
        });
    }
    send(message) {
        switch (message.kind) {
            case 'op': {
                for (const op of message.ops)
                    this.ingest(op);
                break;
            }
            case 'snapshot_request': {
                this.emit({ kind: 'snapshot', snapshot: toSnapshot(this.state) });
                break;
            }
            case 'sync': {
                const gap = this.log.filter((op) => (op.seq ?? 0) > message.lastSeq);
                const outcomes = Object.fromEntries(message.pendingOpIds.map((id) => [
                    id,
                    this.log.some((op) => op.id === id) ? 'applied' : 'rejected',
                ]));
                if (gap.length > 64) {
                    this.emit({ kind: 'sync_result', mode: 'snapshot', snapshot: toSnapshot(this.state), outcomes });
                }
                else {
                    this.emit({ kind: 'sync_result', mode: 'ops', ops: gap, outcomes });
                }
                break;
            }
        }
    }
    ingest(op) {
        const reason = this.policy.validate?.(op, this.state) ?? null;
        if (reason) {
            this.emit({ kind: 'reject', opId: op.id, reason });
            return;
        }
        const sequenced = { ...op, seq: ++this.seq, ts: op.ts ?? 0 };
        applyOp(this.state, sequenced);
        this.log.push(sequenced);
        this.emit({ kind: 'op', ops: [sequenced] });
    }
    onMessage(handler) {
        this.messageHandlers.push(handler);
    }
    onConnectionChange(handler) {
        this.connectionHandlers.push(handler);
    }
    close() {
        for (const handler of this.connectionHandlers)
            handler(false);
        this.messageHandlers = [];
    }
    emit(message) {
        for (const handler of this.messageHandlers)
            handler(message);
    }
}
