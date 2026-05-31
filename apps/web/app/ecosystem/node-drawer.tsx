'use client';

import type { EcosystemNode } from '@/lib/ecosystem/derived';
import { NODES } from '@/lib/ecosystem/derived';
import Link from 'next/link';

interface NodeDrawerProps {
  node: EcosystemNode | null;
  onClose: () => void;
  onFocus: (id: string) => void;
}

const STATUS_COLOR: Record<EcosystemNode['status'], string> = {
  shipped: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  built: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  wip: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  orphan: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  sunset: 'bg-red-500/20 text-red-300 border-red-500/40',
  external: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
};

export function NodeDrawer({ node, onClose, onFocus }: NodeDrawerProps) {
  if (!node) return null;

  const consumesNodes = node.consumes
    .map((id) => NODES.find((n) => n.id === id))
    .filter((n): n is EcosystemNode => Boolean(n));
  const consumedByNodes = node.consumedBy
    .map((id) => NODES.find((n) => n.id === id))
    .filter((n): n is EcosystemNode => Boolean(n));

  return (
    <aside
      className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950/95 border-l border-white/[0.08] backdrop-blur-xl z-50 overflow-y-auto"
      role="dialog"
      aria-label={`${node.name} details`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">{node.name}</h2>
            <span
              className={`inline-block mt-2 px-2 py-0.5 text-xs border rounded-full ${STATUS_COLOR[node.status]}`}
            >
              {node.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="text-zinc-300 text-sm mb-6">{node.description}</p>

        <dl className="space-y-2 text-sm mb-6">
          <Row label="Layer" value={node.layer} />
          <Row label="Gate" value={node.gate} />
          <Row label="Hemisphere" value={node.hemisphere} />
          {node.packageVersion && <Row label="Version" value={node.packageVersion} />}
          {node.lastCommitAt && (
            <Row label="Last commit" value={new Date(node.lastCommitAt).toLocaleDateString()} />
          )}
          {node.owner && <Row label="Owner" value={node.owner} />}
        </dl>

        {consumesNodes.length > 0 && (
          <Section title="Consumes">
            {consumesNodes.map((n) => (
              <Chip key={n.id} onClick={() => onFocus(n.id)}>
                {n.name}
              </Chip>
            ))}
          </Section>
        )}

        {consumedByNodes.length > 0 && (
          <Section title="Consumed by">
            {consumedByNodes.map((n) => (
              <Chip key={n.id} onClick={() => onFocus(n.id)}>
                {n.name}
              </Chip>
            ))}
          </Section>
        )}

        <div className="space-y-2 mt-6">
          {node.github && <ActionLink href={node.github} label="View on GitHub" />}
          {node.publicUrl && <ActionLink href={node.publicUrl} label="Open live URL" />}
          {node.links.try_live && <ActionLink href={node.links.try_live} label="Try live" />}
          {node.status === 'orphan' && (
            <p className="text-xs text-orange-300/80 mt-3">
              This node is orphaned — no detected consumers. See{' '}
              <code>.arcanea/audits/2026-05-06-plugin-overlap.md</code> for context.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-zinc-200">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs uppercase tracking-wide text-zinc-500 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-0.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-full text-zinc-200 hover:bg-white/[0.08] transition-colors"
    >
      {children}
    </button>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  const isInternal = href.startsWith('/');
  if (isInternal) {
    return (
      <Link
        href={href}
        className="block px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white hover:bg-white/[0.08]"
      >
        {label} →
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white hover:bg-white/[0.08]"
    >
      {label} ↗
    </a>
  );
}
