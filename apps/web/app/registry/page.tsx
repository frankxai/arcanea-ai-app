import type { Metadata } from 'next';
import { Suspense } from 'react';
import { searchAgents, getRegistryStats, type RegistryAgent } from '@/lib/registry/queries';
import { AgentCard } from '@/components/registry/AgentCard';
import { SearchBar } from '@/components/registry/SearchBar';
import { CategoryFilter } from '@/components/registry/CategoryFilter';
import { RegistryHero } from '@/components/registry/RegistryHero';

export const metadata: Metadata = {
  title: 'Agent Registry — Arcanea',
  description:
    'Open protocol for AI agents. Discover, deploy, and publish agents across platforms. Free to use, free to fork.',
  openGraph: {
    title: 'The Arcanea Agent Registry',
    description: 'Open protocol for AI agents. Free to deploy. Free to publish.',
    type: 'website',
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  'all': 'All',
  'core-development': 'Core Dev',
  'specialized': 'Specialized',
  'swarm-coordination': 'Swarms',
  'creative': 'Creative',
  'guardian': 'Guardians',
  'github': 'GitHub',
  'sparc': 'SPARC',
};

interface RegistryPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function RegistryPage({ searchParams }: RegistryPageProps) {
  const { q, category } = await searchParams;

  // Parallel data loading — no waterfalls
  const [agents, stats] = await Promise.all([
    searchAgents({ query: q, category, limit: 100 }),
    getRegistryStats(),
  ]);

  const categoryOptions = [
    { id: 'all', label: CATEGORY_LABELS.all, count: stats.total_agents },
    ...Object.entries(stats.categories)
      .sort(([, a], [, b]) => b - a)
      .map(([id, count]) => ({
        id,
        label: CATEGORY_LABELS[id] ?? id,
        count,
      })),
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <RegistryHero stats={stats} />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 space-y-6">
          <Suspense fallback={<div className="h-14" />}>
            <SearchBar />
          </Suspense>
          <Suspense fallback={<div className="h-10" />}>
            <CategoryFilter categories={categoryOptions} active={category ?? 'all'} />
          </Suspense>
        </div>

        {agents.length === 0 ? (
          <EmptyState query={q} category={category} />
        ) : (
          <AgentGrid agents={agents} />
        )}
      </section>
    </main>
  );
}

function AgentGrid({ agents }: { agents: RegistryAgent[] }) {
  return (
    <div>
      <p className="mb-6 font-mono text-xs uppercase tracking-wider text-white/40">
        {agents.length} {agents.length === 1 ? 'agent' : 'agents'}
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ query, category }: { query?: string; category?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-16 text-center backdrop-blur-sm">
      <p className="mb-2 font-display text-xl text-white">No agents match.</p>
      <p className="text-sm text-white/50">
        {query || category
          ? 'Try a different search or clear the filters.'
          : 'The registry is empty. Publish the first agent with the MCP server.'}
      </p>
    </div>
  );
}
