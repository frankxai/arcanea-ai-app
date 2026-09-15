import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  CanvasSnapshot,
  ClientMessage,
  Op,
  RejectReason,
  ServerMessage,
} from '../protocol/types.ts';
import type { Transport } from './types.ts';

interface SubmitRow {
  op_id: string;
  status: 'applied' | 'rejected';
  seq: number | null;
  reason: RejectReason | null;
}

/**
 * Postgres is the sequencer; Realtime is only fanout. An op is not real until
 * canvas_submit_ops has given it a seq, so a dropped broadcast costs a reconnect
 * and a gap query, never a lost edit.
 */
export class SupabaseTransport implements Transport {
  private messageHandlers: ((message: ServerMessage) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];
  private channel: ReturnType<SupabaseClient['channel']> | null = null;
  private readonly supabase: SupabaseClient;
  private readonly canvasId: string;
  private readonly clientId: string;

  constructor(supabase: SupabaseClient, canvasId: string, clientId: string) {
    this.supabase = supabase;
    this.canvasId = canvasId;
    this.clientId = clientId;
  }

  async start(): Promise<void> {
    this.channel = this.supabase
      .channel(`canvas:${this.canvasId}`, { config: { broadcast: { self: false } } })
      .on('broadcast', { event: 'ops' }, ({ payload }) => {
        this.emit({ kind: 'op', ops: payload.ops as Op[] });
      })
      .on('broadcast', { event: 'awareness' }, ({ payload }) => {
        this.emit({ kind: 'awareness', payload: [payload] });
      })
      .subscribe((status) => {
        const connected = status === 'SUBSCRIBED';
        for (const handler of this.connectionHandlers) handler(connected);
      });

    this.emit({ kind: 'snapshot', snapshot: await this.loadSnapshot() });
  }

  send(message: ClientMessage): void {
    switch (message.kind) {
      case 'op':
        void this.submit(message.ops);
        break;
      case 'sync':
        void this.resync(message.lastSeq, message.pendingOpIds);
        break;
      case 'snapshot_request':
        void this.loadSnapshot().then((snapshot) => this.emit({ kind: 'snapshot', snapshot }));
        break;
      case 'awareness':
        void this.channel?.send({ type: 'broadcast', event: 'awareness', payload: message.payload });
        break;
    }
  }

  private async submit(ops: Op[]): Promise<void> {
    const { data, error } = await this.supabase.rpc('canvas_submit_ops', {
      target: this.canvasId,
      client: this.clientId,
      ops,
    });

    if (error) {
      for (const op of ops) this.emit({ kind: 'reject', opId: op.id, reason: 'forbidden', message: error.message });
      return;
    }

    const sequenced: Op[] = [];
    for (const row of (data ?? []) as SubmitRow[]) {
      if (row.status === 'rejected') {
        this.emit({ kind: 'reject', opId: row.op_id, reason: row.reason ?? 'malformed' });
        continue;
      }
      const op = ops.find((candidate) => candidate.id === row.op_id);
      if (op && row.seq !== null) {
        sequenced.push({ ...op, seq: row.seq });
        this.emit({ kind: 'op_status', opId: row.op_id, status: 'applied', seq: row.seq });
      }
    }

    if (sequenced.length > 0) {
      void this.channel?.send({ type: 'broadcast', event: 'ops', payload: { ops: sequenced } });
    }
  }

  private async resync(lastSeq: number, pendingOpIds: string[]): Promise<void> {
    const { data } = await this.supabase
      .from('canvas_ops')
      .select('seq, op_id, payload')
      .eq('canvas_id', this.canvasId)
      .gt('seq', lastSeq)
      .order('seq', { ascending: true })
      .limit(512);

    const rows = data ?? [];
    const landed = new Set(rows.map((row) => row.op_id as string));
    const outcomes = Object.fromEntries(
      pendingOpIds.map((id) => [id, landed.has(id) ? 'applied' : 'rejected'] as const),
    ) as Record<string, 'applied' | 'rejected'>;

    // A full page back means we cannot prove we saw the whole gap; reset instead.
    if (rows.length >= 512) {
      this.emit({ kind: 'sync_result', mode: 'snapshot', snapshot: await this.loadSnapshot(), outcomes });
      return;
    }

    const ops = rows.map((row) => ({ ...(row.payload as Op), seq: row.seq as number }));
    this.emit({ kind: 'sync_result', mode: 'ops', ops, outcomes });
  }

  private async loadSnapshot(): Promise<CanvasSnapshot> {
    const { data: snap } = await this.supabase
      .from('canvas_snapshots')
      .select('seq, nodes, edges, results, node_history')
      .eq('canvas_id', this.canvasId)
      .maybeSingle();

    const base: CanvasSnapshot = {
      seq: snap?.seq ?? 0,
      nodes: snap?.nodes ?? [],
      edges: snap?.edges ?? [],
      results: snap?.results ?? [],
      nodeHistory: snap?.node_history ?? {},
    };

    const { data: tail } = await this.supabase
      .from('canvas_ops')
      .select('seq, payload')
      .eq('canvas_id', this.canvasId)
      .gt('seq', base.seq)
      .order('seq', { ascending: true });

    if (tail?.length) {
      // Fold the tail in on the client so the snapshot table can lag freely.
      const { applyOp, fromSnapshot, toSnapshot } = await import('../protocol/reducer.ts');
      const state = fromSnapshot(base);
      for (const row of tail) applyOp(state, { ...(row.payload as Op), seq: row.seq as number });
      return toSnapshot(state);
    }

    return base;
  }

  onMessage(handler: (message: ServerMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  onConnectionChange(handler: (connected: boolean) => void): void {
    this.connectionHandlers.push(handler);
  }

  close(): void {
    void this.channel?.unsubscribe();
    this.channel = null;
    this.messageHandlers = [];
  }

  private emit(message: ServerMessage): void {
    for (const handler of this.messageHandlers) handler(message);
  }
}
