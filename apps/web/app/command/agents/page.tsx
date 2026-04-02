'use client';

import { useAgents } from '@/lib/command-center/hooks';
import { AgentStatusPanel } from '@/components/command-center/AgentStatusPanel';

export default function AgentsPage() {
  const { agents, loading } = useAgents();

  const onlineCount = agents.filter(
    (a) => a.status === 'online' || a.status === 'busy'
  ).length;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Agents
          </h1>
          <p className="text-sm text-white/50 mt-0.5">
            {onlineCount} of {agents.length} agent
            {agents.length !== 1 ? 's' : ''} online
          </p>
        </div>

        <button
          disabled
          className="px-4 py-2 text-xs font-medium rounded-lg bg-[#7fffd4]/10 text-[#7fffd4] border border-[#7fffd4]/20 opacity-50 cursor-not-allowed"
          title="Coming soon: register mobile and cloud agents"
        >
          Register New Agent
        </button>
      </div>

      {/* Agent grid */}
      <AgentStatusPanel agents={agents} loading={loading} />

      {/* Agent history */}
      <section>
        <h2
          className="text-lg font-semibold text-white/80 mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Recent Agent Events
        </h2>
        <AgentHistory />
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Agent history (placeholder until agent_events table exists)
// ---------------------------------------------------------------------------

const MOCK_HISTORY = [
  {
    id: '1',
    agent: 'claw-frank-desktop',
    event: 'Completed scan of /guardians/v3/ — 10 new assets ingested',
    time: '5 min ago',
  },
  {
    id: '2',
    agent: 'cloud-gemini-classifier',
    event: 'Classified batch of 12 assets (3 hero, 5 gallery, 4 thumbnail)',
    time: '12 min ago',
  },
  {
    id: '3',
    agent: 'cloud-gemini-scorer',
    event: 'Quality scoring complete for 12 assets — avg score 72',
    time: '14 min ago',
  },
  {
    id: '4',
    agent: 'social-prep-agent',
    event: 'Prepared 3 Instagram posts from approved hero assets',
    time: '45 min ago',
  },
  {
    id: '5',
    agent: 'claw-frank-desktop',
    event: 'Agent started — monitoring /guardians, /gallery, /forge',
    time: '1h ago',
  },
];

function AgentHistory() {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl divide-y divide-white/5">
      {MOCK_HISTORY.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#7fffd4]/80 font-medium">
              {item.agent}
            </p>
            <p className="text-sm text-white/60 mt-0.5">{item.event}</p>
          </div>
          <span className="text-[11px] text-white/30 whitespace-nowrap">
            {item.time}
          </span>
        </div>
      ))}
    </div>
  );
}
