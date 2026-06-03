import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ChatMarkdown from '@/components/chat/chat-markdown';
import { createClient } from '@/lib/supabase/server';
import { pagesServiceClient } from '@/lib/pages/db';
import { getPageRow } from './page-data';
import { CopyLinkButton } from './copy-link-button';

export const runtime = 'nodejs';

type Props = { params: Promise<{ slug: string }> };

const EDITORIAL = 'var(--font-editorial), var(--font-serif), serif';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await getPageRow(slug);
  if (!row || row.visibility === 'private') {
    return { title: 'Page not found · Arcanea', robots: { index: false, follow: false } };
  }
  const description = row.summary || 'A page published on Arcanea.';
  const images = row.cover_image_url ? [{ url: row.cover_image_url }] : undefined;
  return {
    title: `${row.title} · Arcanea`,
    description,
    alternates: { canonical: `/p/${slug}` },
    robots: row.visibility === 'public' ? undefined : { index: false, follow: false },
    openGraph: {
      title: row.title,
      description,
      type: 'article',
      url: `/p/${slug}`,
      images,
      publishedTime: row.created_at,
      modifiedTime: row.updated_at,
    },
    twitter: {
      card: row.cover_image_url ? 'summary_large_image' : 'summary',
      title: row.title,
      description,
      images: row.cover_image_url ? [row.cover_image_url] : undefined,
    },
  };
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  const row = await getPageRow(slug);
  if (!row) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = !!user && user.id === row.owner_id;

  if (row.visibility === 'private' && !isOwner) notFound();

  // Count a view for non-owner reads (atomic, fire-and-forget).
  if (!isOwner) {
    void pagesServiceClient()
      .rpc('increment_page_views', { p_slug: slug })
      .then(
        () => {},
        () => {},
      );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: row.title,
    description: row.summary || undefined,
    image: row.cover_image_url || undefined,
    datePublished: row.created_at,
    dateModified: row.updated_at,
  };

  return (
    <main className="min-h-screen bg-[var(--arc-cosmic-void)] text-white/90">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cover */}
      {row.cover_image_url && (
        <div className="relative w-full h-[38vh] min-h-[240px] max-h-[460px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={row.cover_image_url}
            alt={row.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--arc-cosmic-void)]" />
        </div>
      )}

      <article className="mx-auto max-w-3xl px-5 sm:px-8 pb-24 pt-12">
        {/* Owner / share bar */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-2 text-[11px] text-white/35">
            <span className="px-2 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] capitalize">
              {row.visibility}
            </span>
            <span>{row.view_count} {row.view_count === 1 ? 'view' : 'views'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CopyLinkButton />
            {isOwner && (
              <Link
                href={`/p/${slug}/edit`}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/15 transition-colors"
              >
                Edit
              </Link>
            )}
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl leading-[1.1] tracking-tight text-white mb-4"
          style={{ fontFamily: EDITORIAL }}
        >
          {row.title}
        </h1>
        {row.summary && (
          <p className="text-lg text-white/55 leading-relaxed mb-10">{row.summary}</p>
        )}

        {/* Sections */}
        <div className="space-y-12">
          {row.sections.map((section) => (
            <section key={section.id}>
              {section.heading && (
                <h2
                  className="text-2xl text-white/90 mb-3 tracking-tight"
                  style={{ fontFamily: EDITORIAL }}
                >
                  {section.heading}
                </h2>
              )}
              {section.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-white/[0.06] mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={section.imageUrl} alt={section.heading} className="w-full" />
                </div>
              )}
              <div className="text-[15px] leading-relaxed text-white/75">
                <ChatMarkdown content={section.markdown} />
              </div>
            </section>
          ))}
        </div>

        {/* Sources */}
        {row.sources.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/35 mb-4">
              Sources
            </h2>
            <ol className="space-y-2">
              {row.sources.map((source, i) => (
                <li key={`${source.url}-${i}`} className="flex gap-2 text-sm">
                  <span className="text-white/25 tabular-nums">{i + 1}.</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--arc-brand-atlantean-teal)]/80 hover:text-[var(--arc-brand-atlantean-teal)] underline-offset-2 hover:underline break-words"
                  >
                    {source.title || source.url}
                    {source.domain && (
                      <span className="text-white/30 ml-1.5">· {source.domain}</span>
                    )}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-white/[0.06] text-center">
          <Link
            href="/chat"
            className="text-xs text-white/35 hover:text-white/60 transition-colors"
          >
            Published with Arcanea
          </Link>
        </footer>
      </article>
    </main>
  );
}
