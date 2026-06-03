import Link from 'next/link';
import type { Metadata } from 'next';
import { pagesServiceClient, PAGES_TABLE } from '@/lib/pages/db';
import { rowToSummary, type PageRow, type PageSummary } from '@/lib/pages/types';

export const runtime = 'nodejs';
export const revalidate = 60;

const EDITORIAL = 'var(--font-editorial), var(--font-serif), serif';

export const metadata: Metadata = {
  title: 'Discover Pages · Arcanea',
  description: 'Explore Pages published by the Arcanea community — research, essays, and guides distilled from conversations.',
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
    <main className="min-h-screen bg-[var(--arc-cosmic-void)] text-white/90">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16">
        <header className="mb-10">
          <h1
            className="text-4xl sm:text-5xl tracking-tight text-white mb-3"
            style={{ fontFamily: EDITORIAL }}
          >
            Discover Pages
          </h1>
          <p className="text-white/45 max-w-2xl">
            Research, essays, and guides the community has published from their conversations.
          </p>
        </header>

        {pages.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-20 text-center">
            <p className="text-white/40">No public Pages yet.</p>
            <Link
              href="/chat"
              className="inline-block mt-4 text-sm text-[var(--arc-brand-atlantean-teal)] hover:underline"
            >
              Start a conversation →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={`/p/${page.slug}`}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-[var(--arc-brand-atlantean-teal)]/25 transition-colors"
              >
                {page.coverImageUrl ? (
                  <div className="h-36 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.coverImageUrl}
                      alt={page.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ) : (
                  <div className="h-36 bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/10 to-transparent" />
                )}
                <div className="p-4">
                  <h2
                    className="text-lg text-white/90 leading-snug mb-1 line-clamp-2"
                    style={{ fontFamily: EDITORIAL }}
                  >
                    {page.title}
                  </h2>
                  {page.summary && (
                    <p className="text-sm text-white/45 line-clamp-2">{page.summary}</p>
                  )}
                  <p className="mt-3 text-[11px] text-white/25">
                    {page.viewCount} {page.viewCount === 1 ? 'view' : 'views'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
