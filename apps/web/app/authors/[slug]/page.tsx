/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import matter from 'gray-matter';
import { getBookRoot } from '@/lib/content/book-path';

export const dynamic = 'force-dynamic';
export const dynamicParams = false;

const BOOK_ROOT = getBookRoot();

const COVER_MAP: Record<string, string> = {
  'forge-of-ruin': '/images/books/forge-of-ruin-cover-nb2.png',
  'tides-of-silence': '/images/books/tides-of-silence-cover-v2.png',
  'heart-of-pyrathis': '/images/books/heart-of-pyrathis-cover-v2.png',
  'song-of-van-linh': '/images/books/song-of-van-linh-cover.png',
  'las-tierras-de-luz': '/images/books/las-tierras-de-luz-cover.png',
};

interface ManifestAuthor {
  name: string;
  role?: string;
  github?: string;
}

interface AuthorBook {
  slug: string;
  title: string;
  description: string;
  role: string;
  status: string;
  tags: string[];
  cover: string | null;
}

interface AuthorProfile {
  slug: string;
  name: string;
  github: string | null;
  roles: string[];
  books: AuthorBook[];
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function authorSlug(author: ManifestAuthor): string {
  if (author.github) return author.github.toLowerCase();
  return author.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function authorSlugs(author: ManifestAuthor): string[] {
  const slugs = new Set([authorSlug(author)]);
  const nameSlug = author.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  if (nameSlug) slugs.add(nameSlug);
  return Array.from(slugs);
}

async function loadAuthorSlugs(): Promise<string[]> {
  const slugs = new Set<string>();

  try {
    const entries = await readdir(BOOK_ROOT, { withFileTypes: true });
    const bookDirs = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();

    for (const dir of bookDirs) {
      const yamlPath = join(BOOK_ROOT, dir, 'book.yaml');
      if (!(await fileExists(yamlPath))) continue;

      const raw = await readFile(yamlPath, 'utf-8');
      const { data: manifest } = matter(`---\n${raw}\n---`);
      const authors = (manifest.authors as ManifestAuthor[]) || [];

      for (const author of authors) {
        if (!author?.name) continue;
        for (const slug of authorSlugs(author)) slugs.add(slug);
      }
    }
  } catch {
    /* unknown authors resolve to 404 */
  }

  return Array.from(slugs);
}

async function loadAuthor(slug: string): Promise<AuthorProfile | null> {
  let displayName = '';
  let github: string | null = null;
  const roles = new Set<string>();
  const books: AuthorBook[] = [];

  try {
    const entries = await readdir(BOOK_ROOT, { withFileTypes: true });
    const bookDirs = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();

    for (const dir of bookDirs) {
      const yamlPath = join(BOOK_ROOT, dir, 'book.yaml');
      if (!(await fileExists(yamlPath))) continue;

      const raw = await readFile(yamlPath, 'utf-8');
      const { data: manifest } = matter(`---\n${raw}\n---`);

      const authors = (manifest.authors as ManifestAuthor[]) || [];
      const match = authors.find((a) => a?.name && authorSlugs(a).includes(slug));
      if (!match) continue;

      displayName = displayName || match.name;
      github = github ?? match.github ?? null;
      roles.add(match.role || 'author');

      const bookSlug = (manifest.slug as string) || dir;
      const title = (manifest.title as string) || dir;
      const acknowledgments = (manifest.acknowledgments as string) || '';

      books.push({
        slug: bookSlug,
        title,
        description: acknowledgments.split('\n')[0] || '',
        role: match.role || 'author',
        status: (manifest.status as string) || 'draft',
        tags: (manifest.tags as string[]) || [],
        cover: COVER_MAP[bookSlug] || null,
      });
    }
  } catch {
    /* fall through to null check below */
  }

  if (books.length === 0) return null;

  return {
    slug,
    name: displayName,
    github,
    roles: Array.from(roles),
    books,
  };
}

export async function generateStaticParams() {
  const slugs = await loadAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await loadAuthor(slug);
  if (!author) return { title: 'Author Not Found — Arcanea' };
  return {
    title: `${author.name} — Arcanea Authors`,
    description: `${author.name} is writing ${author.books.length} ${
      author.books.length === 1 ? 'book' : 'books'
    } in the open on Arcanea.`,
    openGraph: {
      title: `${author.name} — Arcanea Authors`,
      description: `${author.name} on Arcanea — ${author.roles.join(', ')}.`,
      url: `https://www.arcanea.ai/authors/${slug}`,
    },
    alternates: { canonical: `/authors/${slug}` },
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await loadAuthor(slug);
  if (!author) notFound();

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--arc-brand-atlantean-teal)]/[0.04] via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[var(--arc-brand-atlantean-teal)]/[0.03] blur-[120px]" />

        <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-16">
          <Link
            href="/authors"
            className="inline-block text-xs text-white/30 hover:text-white/50 transition-colors mb-8"
          >
            &larr; Authors
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
            <div
              aria-hidden
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/30 to-[var(--arc-brand-cosmic-blue)]/30 border border-white/[0.08] flex items-center justify-center text-3xl font-display font-bold text-white/90"
            >
              {author.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]/60 mb-2">
                Author
              </p>
              <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white/95">
                {author.name}
              </h1>
              <p className="text-sm text-white/40 mt-2">
                {author.roles.join(' · ')}
                {author.github && (
                  <>
                    {' · '}
                    <a
                      href={`https://github.com/${author.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--arc-brand-atlantean-teal)]/70 hover:text-[var(--arc-brand-atlantean-teal)] transition-colors"
                    >
                      @{author.github}
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/25">
            <span>
              {author.books.length}{' '}
              {author.books.length === 1 ? 'book' : 'books'} in the open
            </span>
          </div>
        </div>
      </section>

      {/* Books */}
      <section className="max-w-3xl mx-auto px-6 pb-32">
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6">
          Books
        </h2>

        <div className="space-y-4">
          {author.books.map((book) => (
            <Link
              key={book.slug}
              href={`/books/drafts/${book.slug}`}
              className="group flex gap-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm p-5 transition-all hover:bg-white/[0.05] hover:border-[var(--arc-brand-atlantean-teal)]/20"
            >
              {book.cover ? (
                <div className="flex-shrink-0 w-20 h-28 relative rounded-lg overflow-hidden border border-white/[0.08]">
                  <Image
                    src={book.cover}
                    alt={`${book.title} cover`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ) : (
                <div
                  aria-hidden
                  className="flex-shrink-0 w-20 h-28 rounded-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08]"
                />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]/50">
                    {book.role}
                  </span>
                  <span className="text-[10px] text-white/20">·</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    {book.status}
                  </span>
                </div>
                <h3 className="text-lg font-display font-semibold text-white/95 group-hover:text-[var(--arc-brand-atlantean-teal)] transition-colors">
                  {book.title}
                </h3>
                {book.description && (
                  <p className="text-sm text-white/40 mt-2 line-clamp-2">
                    {book.description}
                  </p>
                )}
                {book.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {book.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
