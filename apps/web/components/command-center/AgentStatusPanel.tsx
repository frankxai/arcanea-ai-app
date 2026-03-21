'use client';

import { useEffect, useState } from 'react';
import type { AgentRegistry, AgentStatus } from '@/lib/command-center/types';

const STATUS_COLORS: Record<AgentStatus, string> = {
  online: '#22c55e',
  busy: '#eab308',
  idle: '#6b7280',
  offline: '#ef4444',
  error: '#dc2626',
};

const STATUS_LABELS: Record<AgentStatus, string> = {
  online: 'Online',
  busy: 'Busy',
  idle: 'Idle',
  offline: 'Offline',
  error: 'Error',
};

const AGENT_TYPE_ICONS: Record<string, string> = {
  'arcanea-claw': 'C',
  'claude-code': 'A',
  'mobile-capture': 'M',
  'cloud-gemini': 'G',
  'cloud-suno': 'S',
  'cloud-dalle': 'D',
  'cloud-flux': 'F',
};

interface AgentStatusPanelProps {
  agents: AgentRegistry[];
  loading: boolean;
}

export function AgentStatusPanel({ agents, loading }: AgentStatusPanelProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse"
          >
            <div className="h-4 w-28 bg-white/10 rounded mb-3" />
            <div className="h-3 w-20 bg-white/10 rounded mb-2" />
            <div className="h-3 w-32 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
        <p className="text-white/40 text-sm">No agents registered yet.</p>
        <p className="text-white/30 text-xs mt-1">
          Agents will appear here when they connect to the system.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single agent card
// ---------------------------------------------------------------------------

function AgentCard({ agent }: { agent: AgentRegistry }) {
  const [pulse, setPulse] = useState(false);
  const statusColor = STATUS_COLORS[agent.status];
  const typeIcon = AGENT_TYPE_ICONS[agent.agent_type] ?? '?';

  // Pulse animation when heartbeat updates
  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 1000);
    return () => clearTimeout(timer);
  }, [agent.last_heartbeat]);

  const relativeTime = agent.last_heartbeat
    ? formatRelativeTime(agent.last_heartbeat)
    : 'Never';

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-[#7fffd4]/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {/* Type icon */}
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-[#7fffd4]">
            {typeIcon}
          </div>
          <div>
            <p className="text-sm font-medium text-white/90">{agent.name}</p>
            <p className="text-[10px] text-white/40 capitalize">
              {agent.agent_type.replace(/-/g, ' ')}
            </p>
          </div>
        </div>

        {/* Status dot */}
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              pulse ? 'scale-125' : 'scale-100'
            }`}
            style={{
              backgroundColor: statusColor,
              boxShadow:
                agent.status === 'online' || agent.status === 'busy'
                  ? `0 0 8px ${statusColor}60`
                  : 'none',
            }}
          />
          <span className="text-[10px] text-white/50">
            {STATUS_LABELS[agent.status]}
          </span>
        </div>
      </div>

      {/* Current task */}
      {agent.status === 'busy' && (
        <div className="mb-2 px-2 py-1.5 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
          <p className="text-[11px] text-yellow-300/80 truncate">
            Processing...
          </p>
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center justify-between text-[11px] text-white/40">
        <span>
          {agent.assets_processed} processed
        </span>
        <span>
          {relativeTime}
        </span>
      </div>

      {/* Capabilities */}
      {agent.capabilities.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {agent.capabilities.slice(0, 4).map((cap) => (
            <span
              key={cap}
              className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/30"
            >
              {cap}
            </span>
          ))}
          {agent.capabilities.length > 4 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">
              +{agent.capabilities.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'just now';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
