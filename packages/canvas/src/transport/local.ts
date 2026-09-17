import { applyOp, emptyState, toSnapshot } from '../protocol/reducer.ts';
import type {
  CanvasState,
  ClientMessage,
  Op,
  RejectReason,
  ServerMessage,
} from '../protocol/types.ts';
import type { Transport } from './types.ts';

export interface LocalPolicy {
  /** Return a reason to refuse the op, or null to accept it. */
  validate?(op: Op, state: CanvasState): RejectReason | null;
}

/**
 * In-process stand-in for the sequencing server. Same message contract as the
 * Supabase transport, so the UI and the doc are exercised identically offline,
 * in tests, and in the demo.
 */
export class LocalTransport implements Transport {
  private state: CanvasState = emptyState();
  private seq = 0;
  private messageHandlers: ((message: ServerMessage) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];
  private log: Op[] = [];
  private readonly policy: LocalPolicy;

  constructor(policy: LocalPolicy = {}) {
    this.policy = policy;
  }

  start(): void {
    queueMicrotask(() => {
      this.emit({ kind: 'snapshot', snapshot: toSnapshot(this.state) });
      for (const handler of this.connectionHandlers) handler(true);
    });
  }

  send(message: ClientMessage): void {
    switch (message.kind) {
      case 'op': {
        for (const op of message.ops) this.ingest(op);
        break;
      }
      case 'snapshot_request': {
        this.emit({ kind: 'snapshot', snapshot: toSnapshot(this.state) });
        break;
      }
      case 'sync': {
        const gap = this.log.filter((op) => (op.seq ?? 0) > message.lastSeq);
        const outcomes = Object.fromEntries(
          message.pendingOpIds.map((id) => [
            id,
            this.log.some((op) => op.id === id) ? 'applied' : 'rejected',
          ]),
        ) as Record<string, 'applied' | 'rejected'>;
        if (gap.length > 64) {
          this.emit({ kind: 'sync_result', mode: 'snapshot', snapshot: toSnapshot(this.state), outcomes });
        } else {
          this.emit({ kind: 'sync_result', mode: 'ops', ops: gap, outcomes });
        }
        break;
      }
    }
  }

  private ingest(op: Op): void {
    const reason = this.policy.validate?.(op, this.state) ?? null;
    if (reason) {
      this.emit({ kind: 'reject', opId: op.id, reason });
      return;
    }
    const sequenced: Op = { ...op, seq: ++this.seq, ts: op.ts ?? 0 };
    applyOp(this.state, sequenced);
    this.log.push(sequenced);
    this.emit({ kind: 'op', ops: [sequenced] });
  }

  onMessage(handler: (message: ServerMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  onConnectionChange(handler: (connected: boolean) => void): void {
    this.connectionHandlers.push(handler);
  }

  close(): void {
    for (const handler of this.connectionHandlers) handler(false);
    this.messageHandlers = [];
  }

  private emit(message: ServerMessage): void {
    for (const handler of this.messageHandlers) handler(message);
  }
}
