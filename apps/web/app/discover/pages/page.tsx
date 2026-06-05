import Link from 'next/link';
import type { Metadata } from 'next';
import { PhArrowRight } from '@/lib/phosphor-icons';
import { pagesServiceClient, PAGES_TABLE } from '@/lib/pages/db';
import { rowToSummary, type PageRow, type PageSummary } from '@/lib/pages/types';
import { DiscoverGrid } from './discover-grid';

export const runtime = 'nodejs';
export const revalidate = 60;

const EDITORIAL = 'var(--font-editorial), var(--font-serif), serif';

export const metadata: Metadata = {
  title: 'Discover Pages · Arcanea',
  description:
    'Research, essays, and guides the community has published from their conversations on Arcanea.',
};

async function getPublicPages(): Promise<PageSummary[]> {
  try {
    const db = pagesServiceClient();
    const { data } = await db
      .from(PAGES_TABLE)
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(48);
    return ((data as PageRow[]) ?? []).map(rowToSummary);
  } catch {
    return [];
  }
}

export default async function DiscoverPagesPage() {
  const pages = await getPublicPages();

  return (
    <main className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white/85">
      {/* Atmospheric masthead glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(0,188,212,0.12),transparent)] blur-2xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <header className="mb-12 max-w-2xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--arc-brand-atlantean-teal)]/70">
            Pages
          </p>
          <h1 className="text-balance text-4xl leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl" style={{ fontFamily: EDITORIAL }}>
            Conversations, distilled into things worth sharing.
          </h1>
          <p className="mt-4 max-w-xl text-white/45">
            Research, essays, and guides published from chats across the community.
          </p>
        </header>

        {pages.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-24 text-center">
            <p className="text-white/40">No public Pages yet — be the first.</p>
            <Link
              href="/chat"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] transition-colors hover:text-white"
            >
              Start a conversation
              <PhArrowRight className="h-4 w-4" weight="bold" />
            </Link>
          </div>
        ) : (
          <DiscoverGrid pages={pages} />
        )}
      </div>
    </main>
  );
}
