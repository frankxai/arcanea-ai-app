import Link from 'next/link';
import type { Metadata } from 'next';
import { GitBranch, Package, Sparkles } from 'lucide-react';
import { getAllSkills, getCategories } from '@/lib/skills/loader';
import SkillSearch from '@/components/skills/SkillSearch';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Skill Marketplace — Arcanea',
  description:
    'Browse and install open-source skills for Claude Code, OpenCode, Cursor, and more. One-command install for every skill.',
  openGraph: {
    title: 'Arcanea Skill Marketplace',
    description:
      'Open-source skills for Claude Code, OpenCode, Cursor, and more. Install with one command.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arcanea Skill Marketplace',
    description:
      'Open-source skills for Claude Code, OpenCode, Cursor, and more.',
  },
  alternates: { canonical: '/skills' },
  robots: { index: true, follow: true },
};

export default async function SkillsMarketplacePage() {
  const skills = await getAllSkills();
  const categories = getCategories(skills);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white/90">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00bcd4]/[0.05] via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#00bcd4]/[0.04] blur-[140px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#00bcd4]/70 mb-4 inline-flex items-center gap-2 justify-center">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Arcanea Open Library
          </p>

          <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-white/95 mb-5">
            Skill Marketplace
          </h1>

          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-10">
            {skills.length}+ skills for Claude Code, OpenCode, Cursor, and
            more. Install with one command.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <Badge variant="crystal" size="md" icon={<Package className="h-3 w-3" />}>
              {skills.length} Skills
            </Badge>
            <Badge variant="default" size="md">
              {categories.length || '—'} Categories
            </Badge>
            <Badge variant="gold" size="md" icon={<GitBranch className="h-3 w-3" />}>
              MIT Licensed
            </Badge>
          </div>
        </div>
      </section>

      {/* Browse */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {skills.length > 0 ? (
          <SkillSearch skills={skills} categories={categories} />
        ) : (
          <div className="text-center py-24">
            <p className="text-white/40 text-sm mb-3">
              No skills found in the open library yet.
            </p>
            <p className="text-white/25 text-xs">
              Skills live in{' '}
              <code className="text-[#00bcd4]/60">oss/skills/arcanea/</code>
            </p>
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-2xl bg-gradient-to-br from-[#00bcd4]/[0.08] via-white/[0.02] to-transparent border border-white/[0.06] backdrop-blur-sm p-8 sm:p-12 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white/95 mb-3">
            Build your own skill
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
            Every skill is a markdown file with frontmatter. Fork the OSS repo,
            add your skill, open a PR. It will appear here automatically.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="https://github.com/frankxai/arcanea/tree/main/skills/arcanea"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00bcd4]/15 border border-[#00bcd4]/30 text-[#00bcd4] text-sm font-medium hover:bg-[#00bcd4]/25 transition-colors"
            >
              View on GitHub →
            </Link>
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 text-sm font-medium hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              Skill guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
