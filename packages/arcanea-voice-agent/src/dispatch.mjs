/**
 * Intent dispatcher.
 *
 * Routes intents to handlers and emits events on the shared bus so any
 * connected WebSocket client (the dashboard) can render them in the
 * Logic Stream in real time.
 *
 * Handlers are intentionally minimal in v0.1 — `clap`, `summon`, `runtime`,
 * `workflow`, `tts`. Day 5 expands `runtime` to actually spawn child
 * processes and stream stdout. v0.1 logs + acks so the discovery /
 * fallback story is end-to-end testable.
 */

import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';

const MAX_CONCURRENT_RUNTIMES = 3;
const activeRuntimes = new Map(); // id → { proc, kind, startedAt }

export const events = new EventEmitter();
events.setMaxListeners(50);

/** Emit a structured event for WS subscribers. */
function emit(kind, payload = {}) {
  const evt = { kind, ts: Date.now(), payload };
  events.emit('event', evt);
  return evt;
}

export async function dispatch(intent) {
  if (!intent || typeof intent !== 'object') {
    return { ok: false, error: 'invalid intent' };
  }
  const { kind } = intent;
  switch (kind) {
    case 'clap':
      return handleClap(intent);
    case 'summon':
      return handleSummon(intent);
    case 'workflow':
      return handleWorkflow(intent);
    case 'runtime':
      return handleRuntime(intent);
    case 'tts':
      return handleTts(intent);
    default:
      return { ok: false, error: `unknown intent kind: ${kind}` };
  }
}

function handleClap(intent) {
  const persona = intent.persona || 'lumina';
  const tenant = intent.tenant || 'arcanea';
  emit('clap', { persona, tenant });
  // In v0.1 the daemon is still doing the actual browser launch. The agent
  // just records the event so the dashboard's Logic Stream sees it.
  return { ok: true, persona, tenant };
}

function handleSummon(intent) {
  const persona = intent.persona || 'lumina';
  const tenant = intent.tenant || 'arcanea';
  emit('summon', { persona, tenant });
  return { ok: true, persona, tenant };
}

function handleWorkflow(intent) {
  const id = intent.workflowId || intent.id;
  emit('workflow', { id, label: intent.label, action: intent.action });
  // v0.1 doesn't shell out yet — Day 5 implements the wt.exe spawn for daily-ops.
  return { ok: true, workflowId: id, deferred: true };
}

function handleRuntime(intent) {
  const id = intent.runtimeId || intent.id;
  if (activeRuntimes.size >= MAX_CONCURRENT_RUNTIMES) {
    return { ok: false, error: `max concurrent runtimes (${MAX_CONCURRENT_RUNTIMES}) reached` };
  }
  // v0.1: emit + ack only. Day 5: actual spawn with streaming output.
  emit('runtime', { id, command: intent.command });
  return { ok: true, runtimeId: id, deferred: true };
}

function handleTts(intent) {
  emit('tts', { persona: intent.persona, tenant: intent.tenant });
  return { ok: true };
}

export function listActiveRuntimes() {
  return Array.from(activeRuntimes.entries()).map(([id, info]) => ({
    id,
    kind: info.kind,
    startedAt: info.startedAt,
    pid: info.proc?.pid ?? null,
  }));
}

export function killAllRuntimes() {
  for (const [id, info] of activeRuntimes) {
    try { info.proc.kill(); } catch {}
    activeRuntimes.delete(id);
  }
}
