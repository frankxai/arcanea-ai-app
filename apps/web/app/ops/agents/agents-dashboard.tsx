'use client';

import { useEffect, useState } from 'react';

interface AOSession {
  id: string;
  project: string;
  state: string;
  branch?: string;
  pr?: number;
}

interface SessionsResponse {
  ok: boolean;
  reason?: string;
  sessions: AOSession[];
}

export function AgentsDashboard() {
  const [data, setData] = useState<SessionsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch('/api/ops/sessions', { cache: 'no-store' });
        const json = (await res.json()) as SessionsResponse;
        if (alive) setData(json);
      } catch {
        if (alive) setData({ ok: false, reason: 'fetch failed', sessions: [] });
      } finally {
        if (alive) setLoading(false);
      }
    };
    void load();
    const timer = setInterval(() => void load(), 5000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6">
        <h2 className="font-display text-xl font-semibold text-white mb-3">
          Agent Orchestrator
        </h2>
        {loading ? (
          <p className="text-text-muted text-sm">Connecting to localhost:4200…</p>
        ) : data?.ok ? (
          <>
            <p className="text-text-muted text-sm mb-4">
              {data.sessions.length} active session{data.sessions.length === 1 ? '' : 's'}
            </p>
            <div className="space-y-2">
              {data.sessions.length === 0 ? (
                <p className="text-text-muted text-sm">No active workers.</p>
              ) : (
                data.sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2"
                  >
                    <div>
                      <div className="font-mono text-sm text-white">{s.id}</div>
                      <div className="text-xs text-text-muted">
                        {s.project} · {s.state}
                        {s.branch ? ` · ${s.branch}` : ''}
                        {s.pr ? ` · #${s.pr}` : ''}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-text-muted">
              AO daemon unreachable ({data?.reason ?? 'unknown'}).
            </p>
            <p className="text-xs text-text-muted">
              Start with <code className="font-mono text-white">ao start</code> on the dev machine.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6">
        <h2 className="font-display text-xl font-semibold text-white mb-3">
          Routing surfaces
        </h2>
        <p className="text-text-muted text-sm mb-4">
          Declared in <code className="font-mono">packages/router-spec/models.yaml</code>.
        </p>
        <ul className="space-y-2 text-sm">
          {[
            { id: 'claude-arcanea', desc: 'Claude Code overlay — Max sub first' },
            { id: 'oh-my-arcanea', desc: 'OpenCode overlay — Zen free first' },
            { id: 'codex-arcanea', desc: 'Codex CLI overlay — OpenAI BYOK' },
            { id: 'gemini-arcanea', desc: 'Gemini CLI overlay — Google BYOK' },
            { id: 'arcanea-flow', desc: 'Workflow engine — sub preferred' },
            { id: 'arcanea-mcp', desc: 'MCP tool server — free preferred' },
          ].map((s) => (
            <li
              key={s.id}
              className="flex items-start justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2"
            >
              <div>
                <div className="font-mono text-white">{s.id}</div>
                <div className="text-xs text-text-muted">{s.desc}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="md:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6">
        <h2 className="font-display text-xl font-semibold text-white mb-3">
          Run from the terminal
        </h2>
        <pre className="text-xs text-text-secondary whitespace-pre-wrap overflow-x-auto font-mono bg-black/40 rounded-lg p-4 border border-white/[0.04]">
{`# Situational awareness, terminal-side
arcanea-code status

# Plan a swarm without spawning
arcanea-code swarm --from planning-with-files/CURRENT_BACKLOG_2026-04-13.md --dry-run

# Spawn via ao (daemon must be running)
arcanea-code swarm --from planning-with-files/CURRENT_BACKLOG_2026-04-13.md --tasks 5

# Route one prompt to the best model for the task
arcanea-code run --task world.canon "write chapter 5 of Forge of Ruin"`}
        </pre>
      </section>
    </div>
  );
}
