import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Inline SVG Icons ───────────────────────────────────────────────────────────
type InlineSvgProps = { className?: string; style?: React.CSSProperties };
const Icons: Record<string, React.FC<InlineSvgProps>> = {
  ArrowLeft: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
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
  User: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
  Share2: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Bookmark: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  ThumbsUp: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  ),
  MessageCircle: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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


export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost =
    currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  // Convert markdown-like content to JSX
  const contentSections = post.content.split("\n\n").filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Arcanea',
      url: 'https://arcanea.ai',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://arcanea.ai/blog/${slug}`,
    },
    keywords: post.tags.join(', '),
  };

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse_at_top_right,${post.accent}20,transparent_55%),radial-gradient(ellipse_at_bottom_left,${post.accent}10,transparent_55%)`,
          }}
        />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors"
          >
            <Icons.ArrowLeft />
            Back to Blog
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          {/* Category */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-mono px-3 py-1 rounded-full border"
              style={{
                backgroundColor: `${post.accent}20`,
                color: post.accent,
                borderColor: `${post.accent}40`,
              }}
            >
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-2">
              <Icons.User />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Icons.Calendar />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-2">
              <Icons.Clock />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Article Content */}
        <article className="liquid-glass rounded-2xl p-6 sm:p-10 mb-10">
          <div className="prose prose-invert prose-lg max-w-none">
            {contentSections.map((section, index) => {
              const trimmed = section.trim();

              // Headers
              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={index}
                    className="text-2xl font-display font-bold mt-8 mb-4 text-white"
                  >
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h3
                    key={index}
                    className="text-xl font-display font-semibold mt-6 mb-3 text-white"
                  >
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              // Lists
              if (trimmed.match(/^\d+\.\s/) || trimmed.match(/^[-*]\s/)) {
                const items = trimmed.split("\n").filter((line) => line.trim());
                return (
                  <ul
                    key={index}
                    className="list-disc list-inside space-y-2 my-4 text-text-secondary"
                  >
                    {items.map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\.\s|^[-*]\s/, "")}</li>
                    ))}
                  </ul>
                );
              }

              // Blockquotes
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote
                    key={index}
                    className="border-l-4 border-brand-primary pl-4 my-6 italic text-text-secondary"
                  >
                    {trimmed.replace("> ", "")}
                  </blockquote>
                );
              }

              // Tables (simple implementation)
              if (trimmed.includes("|") && trimmed.includes("---")) {
                const rows = trimmed
                  .split("\n")
                  .filter((row) => !row.includes("---"));
                if (rows.length > 1) {
                  return (
                    <div key={index} className="overflow-x-auto my-6">
                      <table className="w-full text-sm">
                        <tbody>
                          {rows.map((row, i) => (
                            <tr
                              key={i}
                              className={i === 0 ? "font-semibold" : ""}
                            >
                              {row
                                .split("|")
                                .filter(Boolean)
                                .map((cell, j) => (
                                  <td
                                    key={j}
                                    className="px-3 py-2 border border-white/[0.06]"
                                  >
                                    {cell.trim()}
                                  </td>
                                ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }

              // Regular paragraph with inline bold
              if (trimmed) {
                const parts = trimmed.split(/\*\*(.*?)\*\*/g);
                return (
                  <p
                    key={index}
                    className="my-4 text-text-secondary leading-relaxed"
                  >
                    {parts.map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="text-white font-semibold">{part}</strong>
                      ) : (
                        part
                      ),
                    )}
                  </p>
                );
              }

              return null;
            })}
          </div>
        </article>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <span className="text-sm text-text-muted flex items-center gap-2">
            <Icons.Tag />
            Tags:
          </span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm px-3 py-1 rounded-full bg-white/[0.04] text-text-secondary"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-secondary hover:border-crystal/30 hover:text-crystal transition-all">
            <Icons.ThumbsUp />
            Like
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-secondary hover:border-crystal/30 hover:text-crystal transition-all">
            <Icons.Bookmark />
            Save
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-secondary hover:border-crystal/30 hover:text-crystal transition-all">
            <Icons.Share2 />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-secondary hover:border-crystal/30 hover:text-crystal transition-all">
            <Icons.MessageCircle />
            Comment
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center group-hover:bg-brand-primary/20 transition-all">
                <Icons.ChevronLeft />
              </div>
              <div>
                <span className="text-xs text-text-muted block">Previous</span>
                <span className="text-sm font-medium group-hover:text-crystal transition-colors">
                  {prevPost.title}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex items-center gap-3 text-right"
            >
              <div>
                <span className="text-xs text-text-muted block">Next</span>
                <span className="text-sm font-medium group-hover:text-crystal transition-colors">
                  {nextPost.title}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center group-hover:bg-brand-primary/20 transition-all">
                <Icons.ChevronRight />
              </div>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>
    </div>
  );
}
