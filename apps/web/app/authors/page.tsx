import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import type { Metadata } from 'next';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Authors — Arcanea Open Library',
  description:
    'Writers building books in the open on Arcanea. Browse by author and follow their journey chapter by chapter.',
  openGraph: {
    title: 'Authors — Arcanea Open Library',
    description:
      'Writers building books in the open. One profile per creator, every book they touch, every world they shape.',
  },
  alternates: { canonical: '/authors' },
};

/* ------------------------------------------------------------------ */
/*  Data loading                                                       */
/* ------------------------------------------------------------------ */

const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');

interface ManifestAuthor {
  name: string;
  role?: string;
  github?: string;
}

interface AuthorAggregate {
  slug: string;
  name: string;
  github: string | null;
  roles: Set<string>;
  books: { slug: string; title: string; role: string }[];
}

async function exists(p: string): Promise<boolean> {
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

async function loadAuthors(): Promise<AuthorAggregate[]> {
  const map = new Map<string, AuthorAggregate>();

  try {
    const entries = await readdir(BOOK_ROOT, { withFileTypes: true });
    const bookDirs = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();

    for (const dir of bookDirs) {
      const yamlPath = join(BOOK_ROOT, dir, 'book.yaml');
      if (!(await exists(yamlPath))) continue;

      const raw = await readFile(yamlPath, 'utf-8');
      const { data: manifest } = matter(`---\n${raw}\n---`);

      const title = (manifest.title as string) || dir;
      const slug = (manifest.slug as string) || dir;
      const authors = (manifest.authors as ManifestAuthor[]) || [];

      for (const author of authors) {
        if (!author?.name) continue;
        const aSlug = authorSlug(author);
        const existing = map.get(aSlug);
        const role = author.role || 'author';

        if (existing) {
          existing.roles.add(role);
          existing.books.push({ slug, title, role });
        } else {
          map.set(aSlug, {
            slug: aSlug,
            name: author.name,
            github: author.github ?? null,
            roles: new Set([role]),
            books: [{ slug, title, role }],
          });
        }
      }
    }
  } catch {
    /* silent — page renders empty state */
  }

  return Array.from(map.values()).sort((a, b) => b.books.length - a.books.length);
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function AuthorsHubPage() {
  const authors = await loadAuthors();
  const totalBooks = authors.reduce((sum, a) => sum + a.books.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00bcd4]/[0.04] via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#00bcd4]/[0.03] blur-[120px]" />

        <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
          <Link
            href="/books/drafts"
            className="inline-block text-xs text-white/30 hover:text-white/50 transition-colors mb-8"
          >
            &larr; Drafts
          </Link>

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#00bcd4]/60 mb-4">
            Arcanea Open Library
          </p>

          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white/95 mb-4">
            Authors
          </h1>

          <p className="text-lg text-white/40 max-w-xl mx-auto mb-8 leading-relaxed">
            Writers building in the open. One profile per creator, every book
            they touch, every world they shape.
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-white/25">
            <span>
              {authors.length} {authors.length === 1 ? 'author' : 'authors'}
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span>
              {totalBooks} {totalBooks === 1 ? 'book' : 'books'}
            </span>
          </div>
        </div>
      </section>

      {/* Author Cards */}
      <section className="max-w-4xl mx-auto px-6 pb-32">
        {authors.length === 0 ? (
          <div className="text-center text-white/40 py-16">
            No authors found yet. Check back soon.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {authors.map((author) => (
              <Link
                key={author.slug}
                href={`/authors/${author.slug}`}
                className="group relative rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm p-6 transition-all hover:bg-white/[0.05] hover:border-[#00bcd4]/20"
              >
                <div className="flex items-start gap-4">
                  <div
                    aria-hidden
                    className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#00bcd4]/30 to-[#0d47a1]/30 border border-white/[0.08] flex items-center justify-center text-lg font-display font-bold text-white/80"
                  >
                    {author.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-display font-semibold text-white/95 group-hover:text-[#00bcd4] transition-colors">
                      {author.name}
                    </h2>
                    <p className="text-xs text-white/40 mt-0.5">
                      {Array.from(author.roles).join(' · ')}
                    </p>
                    <p className="text-xs text-white/30 mt-3">
                      {author.books.length}{' '}
                      {author.books.length === 1 ? 'book' : 'books'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
