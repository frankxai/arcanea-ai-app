import { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Latest insights, tutorials, and stories from the Arcanea universe. Discover creative techniques, platform updates, and wisdom from the Luminors.",
};

// ─── Inline SVG Icons ───────────────────────────────────────────────────────────
type InlineSvgProps = { className?: string; style?: React.CSSProperties };
const Icons: Record<string, React.FC<InlineSvgProps>> = {
  Sparkles: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  ),
  PenLine: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  Calendar: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Search: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Tag: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  BookOpen: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Zap: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Users: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  FileText: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

const CATEGORIES = BLOG_CATEGORIES;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  const featuredPosts = BLOG_POSTS.filter((post) => post.featured);
  const regularPosts = BLOG_POSTS.filter((post) => !post.featured);

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(13,71,161,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-12 sm:px-12 sm:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                <Icons.PenLine />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                  Blog
                </span>
              </div>

              <h1 className="text-fluid-3xl font-display font-bold mb-4">
                Insights & Stories
                <span className="block text-gradient-brand">from Arcanea</span>
              </h1>

              <p className="text-text-secondary font-body text-lg max-w-2xl mb-8">
                Discover tutorials, platform updates, and insights from the
                Luminors. Level up your practice with wisdom from the Arcanea
                universe.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/blog/arcanea-skills-system"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <Icons.BookOpen />
                  Read Latest
                  <Icons.ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                  category.id === "all"
                    ? "card-3d liquid-glass border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
                    : "liquid-glass border-white/[0.06] text-text-secondary hover:border-crystal/30 hover:text-crystal"
                }`}
              >
                <span className="text-sm font-sans">{category.label}</span>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                    category.id === "all" ? "bg-brand-primary/20" : "bg-white/[0.04]"
                  }`}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Search Bar */}
        <section className="mb-10">
          <div className="relative max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              <Icons.Search />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              aria-label="Search articles"
              className="w-full pl-12 pr-4 py-3 rounded-xl liquid-glass border border-white/[0.06] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-crystal/50 focus:ring-1 focus:ring-crystal/20 transition-all"
            />
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12" aria-labelledby="featured-heading">
            <h2
              id="featured-heading"
              className="text-xl font-display font-semibold mb-6 flex items-center gap-2"
            >
              <Icons.Zap className="w-5 h-5 text-brand-gold" />
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group relative card-3d liquid-glass rounded-2xl overflow-hidden glow-card hover-lift transition-all"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    {/* Accent bar */}
                    <div
                      className="h-1.5"
                      style={{ backgroundColor: post.accent }}
                    />

                    <div className="p-6">
                      {/* Category & Date */}
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="text-xs font-mono px-2.5 py-1 rounded-full border"
                          style={{
                            backgroundColor: `${post.accent}20`,
                            color: post.accent,
                            borderColor: `${post.accent}40`,
                          }}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Icons.Calendar />
                          {formatDate(post.date)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-crystal transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-text-secondary font-sans mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                        <span className="text-xs text-text-muted">
                          by {post.author}
                        </span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Icons.Clock />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section aria-labelledby="latest-heading">
          <h2
            id="latest-heading"
            className="text-xl font-display font-semibold mb-6 flex items-center gap-2"
          >
            <Icons.FileText className="w-5 h-5 text-brand-primary" />
            Latest Articles
          </h2>

          {regularPosts.length > 0 ? (
            <div className="space-y-4">
              {regularPosts.map((post) => (
                <article key={post.slug} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="card-3d liquid-glass rounded-xl p-5 hover:border-crystal/30 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Accent indicator */}
                        <div
                          className="hidden sm:block w-1 h-14 rounded-full"
                          style={{ backgroundColor: post.accent }}
                        />

                        <div className="flex-1 min-w-0">
                          {/* Category & Date */}
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className="text-xs font-mono px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${post.accent}20`,
                                color: post.accent,
                              }}
                            >
                              {post.category}
                            </span>
                            <span className="text-xs text-text-muted">
                              {formatDate(post.date)}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-display font-semibold mb-1 group-hover:text-crystal transition-colors">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-sm text-text-secondary line-clamp-1">
                            {post.excerpt}
                          </p>
                        </div>

                        {/* Read time & Arrow */}
                        <div className="flex items-center gap-3 text-text-muted">
                          <span className="text-xs hidden sm:block">
                            {post.readTime}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-all">
                            <Icons.ArrowRight />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary">No articles found.</p>
            </div>
          )}
        </section>

        {/* Pagination */}
        <section className="mt-12">
          <nav className="flex justify-center items-center gap-2" aria-label="Blog pagination">
            <button aria-label="Previous page" className="p-2 rounded-lg card-3d liquid-glass border border-white/[0.06] text-text-muted hover:border-crystal/30 hover:text-crystal transition-all">
              <Icons.ChevronLeft />
            </button>
            <button aria-label="Page 1" aria-current="page" className="w-10 h-10 rounded-lg bg-brand-primary/20 text-brand-primary font-mono text-sm">
              1
            </button>
            <button aria-label="Page 2" className="p-2 rounded-lg card-3d liquid-glass border border-white/[0.06] text-text-muted hover:border-crystal/30 hover:text-crystal transition-all">
              2
            </button>
            <button aria-label="Page 3" className="p-2 rounded-lg card-3d liquid-glass border border-white/[0.06] text-text-muted hover:border-crystal/30 hover:text-crystal transition-all">
              3
            </button>
            <button aria-label="Next page" className="p-2 rounded-lg card-3d liquid-glass border border-white/[0.06] text-text-muted hover:border-crystal/30 hover:text-crystal transition-all">
              <Icons.ChevronRight />
            </button>
          </nav>
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16">
          <div className="relative liquid-glass rounded-2xl p-8 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-crystal/10 pointer-events-none" />
            <div className="relative">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-primary/15 flex items-center justify-center">
                <Icons.Sparkles className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">
                Stay in the Loop
              </h3>
              <p className="text-text-secondary max-w-md mx-auto mb-6">
                Get notified when new articles drop. Wisdom from the Arcanea
                Library, delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address for newsletter"
                  className="flex-1 px-4 py-3 rounded-xl liquid-glass border border-white/[0.06] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-crystal/50 focus:ring-2 focus:ring-crystal/20"
                />
                <button className="px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:shadow-glow-brand transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
