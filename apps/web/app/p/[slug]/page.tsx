import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { pagesServiceClient } from '@/lib/pages/db';
import { rowToView } from '@/lib/pages/types';
import { getPageRow } from './page-data';
import { PageReader } from './page-reader';

export const runtime = 'nodejs';

type Props = { params: Promise<{ slug: string }> };

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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageReader page={rowToView(row, isOwner)} />
    </>
  );
}
