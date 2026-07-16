/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';
import Link from 'next/link';
import { AgentsDashboard } from './agents-dashboard';

export const metadata: Metadata = {
  title: 'Ops — Agents',
  description:
    'Live view of Arcanea Agent Orchestrator sessions, routed model surfaces, and worktree state.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AgentsOpsPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[var(--arc-cosmic-void)]">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.12),transparent_55%)]" />
      </div>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/ops" className="hover:text-white transition-colors">
            Ops
          </Link>
          <span>/</span>
          <span className="text-white">Agents</span>
        </nav>

        <header className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Agents — Live Orchestration
          </h1>
          <p className="mt-2 text-text-secondary">
            Composio AO sessions, Router Spec surfaces, and worktree state at a glance.
          </p>
        </header>

        <AgentsDashboard />
      </main>
    </div>
  );
}
