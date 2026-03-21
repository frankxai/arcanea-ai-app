'use client';

import { useCommandStats, useAgents } from '@/lib/command-center/hooks';
import { StatsOverview } from '@/components/command-center/StatsOverview';
import { AgentStatusPanel } from '@/components/command-center/AgentStatusPanel';
import Link from 'next/link';

export default function CommandCenterDashboard() {
  const { stats, loading: statsLoading } = useCommandStats();
  const { agents, loading: agentsLoading } = useAgents();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-white"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Command Center
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Manage your creative assets, monitor agents, and publish across the
          multiverse.
        </p>
      </div>

      {/* Stats overview */}
      <StatsOverview stats={stats} loading={statsLoading} />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickAction
          href="/command/inbox"
          label="Review Inbox"
          description="Review and approve new media assets"
          accent="teal"
        />
        <QuickAction
          href="/command/agents"
          label="Check Agents"
          description="Monitor active agent status"
          accent="gold"
        />
        <QuickAction
          href="/command/social"
          label="Schedule Posts"
          description="Manage your social content queue"
          accent="blue"
        />
      </div>

      {/* Recent activity feed */}
      <section>
        <h2
          className="text-lg font-semibold text-white/80 mb-4"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Recent Activity
        </h2>
        <ActivityFeed />
      </section>

      {/* Agent panel */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-semibold text-white/80"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Agents
          </h2>
          <Link
            href="/command/agents"
            className="text-xs text-[#7fffd4] hover:underline"
          >
            View all
          </Link>
        </div>
        <AgentStatusPanel
          agents={agents.slice(0, 6)}
          loading={agentsLoading}
        />
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick action card
// ---------------------------------------------------------------------------

function QuickAction({
  href,
  label,
  description,
  accent,
}: {
  href: string;
  label: string;
  description: string;
  accent: 'teal' | 'gold' | 'blue';
}) {
  const colors = {
    teal: {
      border: 'hover:border-[#7fffd4]/40',
      text: 'text-[#7fffd4]',
      bg: 'bg-[#7fffd4]/5',
    },
    gold: {
      border: 'hover:border-[#ffd700]/40',
      text: 'text-[#ffd700]',
      bg: 'bg-[#ffd700]/5',
    },
    blue: {
      border: 'hover:border-blue-400/40',
      text: 'text-blue-400',
      bg: 'bg-blue-400/5',
    },
  };

  const c = colors[accent];

  return (
    <Link
      href={href}
      className={`
        block p-5 rounded-xl border border-white/10 ${c.bg} ${c.border}
        transition-all duration-200 group
      `}
    >
      <p className={`text-sm font-semibold ${c.text} group-hover:underline`}>
        {label}
      </p>
      <p className="text-xs text-white/40 mt-1">{description}</p>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Activity feed (placeholder — uses local mock until events table exists)
// ---------------------------------------------------------------------------

const MOCK_EVENTS = [
  {
    id: '1',
    time: '2 min ago',
    message: 'ArcaneaClaw scanned 47 new assets from /guardians/v3/',
    type: 'scan',
  },
  {
    id: '2',
    time: '8 min ago',
    message: 'Cloud Gemini classified 12 assets — 3 hero, 5 gallery, 4 thumbnail',
    type: 'classify',
  },
  {
    id: '3',
    time: '15 min ago',
    message: 'Quality scoring complete: 2 new hero-tier assets detected',
    type: 'score',
  },
  {
    id: '4',
    time: '1h ago',
    message: 'Social post scheduled: Draconia hero image for Instagram',
    type: 'social',
  },
  {
    id: '5',
    time: '3h ago',
    message: 'Pipeline complete: 31 assets processed end-to-end',
    type: 'pipeline',
  },
];

const EVENT_COLORS: Record<string, string> = {
  scan: '#7fffd4',
  classify: '#a855f7',
  score: '#ffd700',
  social: '#3b82f6',
  pipeline: '#22c55e',
};

function ActivityFeed() {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl divide-y divide-white/5">
      {MOCK_EVENTS.map((event) => (
        <div
          key={event.id}
          className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
        >
          <span
            className="mt-1.5 w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: EVENT_COLORS[event.type] ?? '#6b7280' }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/70">{event.message}</p>
          </div>
          <span className="text-[11px] text-white/30 whitespace-nowrap">
            {event.time}
          </span>
        </div>
      ))}
    </div>
  );
}
