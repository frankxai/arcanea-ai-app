import { applyOp, cloneState, emptyState, fromSnapshot } from './reducer.ts';
import type { CanvasState, Op, RejectReason, ServerMessage } from './types.ts';
import type { Transport } from '../transport/types.ts';

export interface CanvasDocEvents {
  onChange(state: CanvasState): void;
  onReject(opId: string, reason: RejectReason, message?: string): void;
  onConnectionChange(connected: boolean): void;
}

const FRAME_MS = 16;

/**
 * Client-side document. Applies local ops immediately against a confirmed base,
 * then replays anything still unacknowledged on top. A rejected op simply
 * disappears from pending and the next rebase drops its effect — no undo stack
 * gymnastics, and the user sees exactly what the server believes.
 */
export class CanvasDoc {
  private confirmed: CanvasState = emptyState();
  private view: CanvasState = emptyState();
  private pending: Op[] = [];
  private outbox: Op[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  readonly clientId: string;
  private readonly transport: Transport;
  private readonly events: Partial<CanvasDocEvents>;

  constructor(clientId: string, transport: Transport, events: Partial<CanvasDocEvents> = {}) {
    this.clientId = clientId;
    this.transport = transport;
    this.events = events;
    transport.onMessage((message) => this.receive(message));
    transport.onConnectionChange((connected) => {
      this.events.onConnectionChange?.(connected);
      if (connected) {
        transport.send({
          kind: 'sync',
          lastSeq: this.confirmed.seq,
          pendingOpIds: this.pending.map((op) => op.id),
        });
      }
    });
  }

  getState(): CanvasState {
    return this.view;
  }

  /** Optimistic local mutation. Ops coalesce into one frame before going out. */
  commit(ops: Op[]): void {
    if (ops.length === 0) return;
    this.pending.push(...ops);
    this.outbox.push(...ops);
    this.rebase();
    if (this.flushTimer === null) {
      this.flushTimer = setTimeout(() => this.flush(), FRAME_MS);
    }
  }

  flush(): void {
    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.outbox.length === 0) return;
    const ops = this.outbox.splice(0, this.outbox.length);
    this.transport.send({ kind: 'op', ops });
  }

  private receive(message: ServerMessage): void {
    switch (message.kind) {
      case 'snapshot': {
        this.confirmed = fromSnapshot(message.snapshot);
        this.rebase();
        break;
      }
      case 'op': {
        for (const op of message.ops) {
          applyOp(this.confirmed, op);
          if (op.clientId === this.clientId) this.drop(op.id);
        }
        this.rebase();
        break;
      }
      case 'op_status': {
        this.drop(message.opId);
        if (message.seq > this.confirmed.seq) this.confirmed.seq = message.seq;
        break;
      }
      case 'reject': {
        this.drop(message.opId);
        this.rebase();
        this.events.onReject?.(message.opId, message.reason, message.message);
        break;
      }
      case 'sync_result': {
        if (message.mode === 'snapshot' && message.snapshot) {
          this.confirmed = fromSnapshot(message.snapshot);
        } else if (message.ops) {
          for (const op of message.ops) applyOp(this.confirmed, op);
        }
        for (const [opId, outcome] of Object.entries(message.outcomes)) {
          if (outcome === 'applied' || outcome === 'rejected') this.drop(opId);
        }
        this.rebase();
        break;
      }
    }
  }

  private drop(opId: string): void {
    const index = this.pending.findIndex((op) => op.id === opId);
    if (index >= 0) this.pending.splice(index, 1);
  }

  private rebase(): void {
    const next = cloneState(this.confirmed);
    for (const op of this.pending) applyOp(next, op);
    this.view = next;
    this.events.onChange?.(next);
  }
}
