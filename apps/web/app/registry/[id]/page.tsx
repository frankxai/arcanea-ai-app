import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAgent, getAgentStats, getRelatedAgents } from '@/lib/registry/queries';
import { AgentCard } from '@/components/registry/AgentCard';
import { AgentHeader } from '@/components/registry/AgentHeader';
import { DeployPanel } from '@/components/registry/DeployPanel';
import { StatsStrip } from '@/components/registry/StatsStrip';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const agent = await getAgent(id);
  if (!agent) {
    return { title: 'Agent not found — Arcanea Registry' };
  }
  return {
    title: `${agent.name} — Arcanea Registry`,
    description: agent.description,
    openGraph: {
      title: `${agent.name} — ${agent.title}`,
      description: agent.description,
      type: 'website',
    },
  };
}

export default async function AgentDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Parallel fetch — no waterfalls
  const agent = await getAgent(id);
  if (!agent) notFound();

  const [stats, related] = await Promise.all([
    getAgentStats(agent.id),
    getRelatedAgents(agent),
  ]);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Breadcrumb */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <Link
            href="/registry"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-white/40 transition-colors hover:text-white/70"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Registry
          </Link>
        </div>
      </div>

      <AgentHeader agent={agent} />

      <StatsStrip stats={stats} />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* Main content */}
          <div className="space-y-12">
            {/* Description */}
            <div>
              <h2 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-white/40">
                About
              </h2>
              <p className="text-lg leading-relaxed text-white/70">{agent.description}</p>
              {agent.long_description && (
                <p className="mt-4 leading-relaxed text-white/60">{agent.long_description}</p>
              )}
            </div>

            {/* Capabilities */}
            <div>
              <h2 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-white/40">
                Capabilities
              </h2>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 font-mono text-xs text-white/70"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {agent.tags.length > 0 && (
              <div>
                <h2 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {agent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/[0.05] bg-white/[0.01] px-2.5 py-0.5 font-mono text-[10px] text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Technical metadata */}
            <div>
              <h2 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-white/40">
                Protocol metadata
              </h2>
              <dl className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                <MetaRow label="Agent ID" value={agent.id} mono />
                <MetaRow label="Version" value={agent.version} mono />
                <MetaRow label="License" value={agent.license} />
                <MetaRow label="Category" value={agent.category} />
                <MetaRow label="Access" value={agent.is_open ? 'Open · Free' : 'Restricted'} />
                {agent.source_url && (
                  <MetaRow label="Source" value={agent.source_url} mono href={agent.source_url} />
                )}
              </dl>
            </div>
          </div>

          {/* Deploy sidebar */}
          <aside>
            <DeployPanel agent={agent} />
          </aside>
        </div>

        {/* Related agents */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-white/[0.06] pt-16">
            <h2 className="mb-8 font-display text-2xl text-white">Related agents</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {related.map((a, i) => (
                <AgentCard key={a.id} agent={a} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function MetaRow({
  label,
  value,
  mono,
  href,
}: {
  label: string;
  value: string;
  mono?: boolean;
  href?: string;
}) {
  const valueClass = `text-sm text-white/80 ${mono ? 'font-mono text-xs' : ''}`;
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">{label}</dt>
      <dd className={valueClass}>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-200">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
