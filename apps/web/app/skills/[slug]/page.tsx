import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Tag,
  Users,
} from 'lucide-react';
import {
  getAllSkills,
  getSkillBySlug,
  type Skill,
} from '@/lib/skills/loader';
import InstallTabs from '@/components/skills/InstallTabs';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);
  if (!skill) {
    return { title: 'Skill not found — Arcanea', robots: { index: false } };
  }
  return {
    title: `${skill.name} — Arcanea Skills`,
    description: skill.description,
    openGraph: {
      title: `${skill.name} — Arcanea Skills`,
      description: skill.description,
      type: 'article',
    },
    alternates: { canonical: `/skills/${skill.slug}` },
    robots: { index: true, follow: true },
  };
}

function RelatedSkills({
  current,
  all,
}: {
  current: Skill;
  all: Skill[];
}) {
  if (!current.category) return null;
  const related = all
    .filter((s) => s.slug !== current.slug && s.category === current.category)
    .slice(0, 5);
  if (related.length === 0) return null;

  return (
    <aside className="rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm p-5">
      <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
        Related Skills
      </h3>
      <div className="space-y-3">
        {related.map((s) => (
          <Link
            key={s.slug}
            href={`/skills/${s.slug}`}
            className="block group"
          >
            <div className="text-sm font-medium text-white/80 group-hover:text-[#00bcd4] transition-colors line-clamp-1">
              {s.name}
            </div>
            <div className="text-xs text-white/40 line-clamp-2 mt-0.5 leading-relaxed">
              {s.description}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);
  if (!skill) notFound();

  const allSkills = await getAllSkills();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white/90">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00bcd4]/[0.08] via-transparent to-transparent" />

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12">
          <Link
            href="/skills"
            className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-8"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            All Skills
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            {skill.category && (
              <Badge variant="crystal" icon={<Tag className="h-3 w-3" />}>
                {skill.category}
              </Badge>
            )}
            {skill.version && <Badge variant="default">v{skill.version}</Badge>}
            {skill.author && (
              <Badge variant="default" icon={<Users className="h-3 w-3" />}>
                by {skill.author}
              </Badge>
            )}
            {skill.license && <Badge variant="gold">{skill.license}</Badge>}
          </div>

          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white/95 mb-5 max-w-3xl">
            {skill.name}
          </h1>

          <p className="text-lg text-white/60 max-w-3xl leading-relaxed">
            {skill.description}
          </p>

          {skill.tags && skill.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-6">
              {skill.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white/40"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[1fr_280px] gap-10">
          <div className="min-w-0">
            {/* Install */}
            <div className="mb-12">
              <h2 className="font-display text-xl font-semibold text-white/95 mb-4">
                Install
              </h2>
              <InstallTabs skill={skill} />
            </div>

            {/* Usage examples */}
            {skill.usageExamples && skill.usageExamples.length > 0 && (
              <div className="mb-12">
                <h2 className="font-display text-xl font-semibold text-white/95 mb-4">
                  Usage Examples
                </h2>
                <ul className="space-y-2">
                  {skill.usageExamples.map((ex, i) => (
                    <li
                      key={i}
                      className="rounded-lg bg-white/[0.02] border border-white/[0.04] px-4 py-3 text-sm text-white/70 font-mono"
                    >
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Triggers */}
            {skill.triggers && skill.triggers.length > 0 && (
              <div className="mb-12">
                <h2 className="font-display text-xl font-semibold text-white/95 mb-4">
                  Triggers
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skill.triggers.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-md bg-[#00bcd4]/5 border border-[#00bcd4]/20 text-[#00bcd4]/80 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full markdown */}
            <div className="mb-12">
              <h2 className="font-display text-xl font-semibold text-white/95 mb-4 inline-flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#00bcd4]/80" aria-hidden="true" />
                Documentation
              </h2>
              <article className="skill-prose">
                <ReactMarkdown>{skill.readmeContent}</ReactMarkdown>
              </article>
            </div>

            {/* Source link */}
            <div className="mt-12">
              <Link
                href={skill.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 text-sm hover:text-[#00bcd4] hover:border-[#00bcd4]/30 transition-colors"
              >
                View source on GitHub
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RelatedSkills current={skill} all={allSkills} />
          </div>
        </div>
      </section>

      {/* Minimal prose styles */}
      <style>{`
        .skill-prose {
          color: rgb(255 255 255 / 0.75);
          font-size: 0.95rem;
          line-height: 1.7;
        }
        .skill-prose h1, .skill-prose h2, .skill-prose h3, .skill-prose h4 {
          color: rgb(255 255 255 / 0.95);
          font-family: var(--font-display, inherit);
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.25;
        }
        .skill-prose h1 { font-size: 1.75rem; }
        .skill-prose h2 {
          font-size: 1.35rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgb(255 255 255 / 0.06);
        }
        .skill-prose h3 { font-size: 1.1rem; color: rgb(0 188 212 / 0.9); }
        .skill-prose p { margin: 0.9rem 0; }
        .skill-prose a { color: #00bcd4; text-decoration: underline; text-underline-offset: 2px; }
        .skill-prose code {
          font-family: var(--font-mono, monospace);
          font-size: 0.85em;
          background: rgb(0 0 0 / 0.4);
          border: 1px solid rgb(255 255 255 / 0.06);
          padding: 0.1rem 0.35rem;
          border-radius: 0.25rem;
          color: rgb(0 188 212 / 0.85);
        }
        .skill-prose pre {
          background: rgb(0 0 0 / 0.4);
          border: 1px solid rgb(255 255 255 / 0.06);
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .skill-prose pre code {
          background: transparent;
          border: 0;
          padding: 0;
          color: rgb(255 255 255 / 0.85);
        }
        .skill-prose ul, .skill-prose ol {
          padding-left: 1.5rem;
          margin: 0.9rem 0;
        }
        .skill-prose ul { list-style: disc; }
        .skill-prose ol { list-style: decimal; }
        .skill-prose li { margin: 0.35rem 0; }
        .skill-prose blockquote {
          border-left: 3px solid rgb(0 188 212 / 0.4);
          padding-left: 1rem;
          margin: 1rem 0;
          color: rgb(255 255 255 / 0.6);
          font-style: italic;
        }
        .skill-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 0.9em;
        }
        .skill-prose th, .skill-prose td {
          border: 1px solid rgb(255 255 255 / 0.08);
          padding: 0.5rem 0.75rem;
          text-align: left;
        }
        .skill-prose th {
          background: rgb(255 255 255 / 0.03);
          color: rgb(255 255 255 / 0.9);
          font-weight: 600;
        }
        .skill-prose hr {
          border: 0;
          border-top: 1px solid rgb(255 255 255 / 0.08);
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}
