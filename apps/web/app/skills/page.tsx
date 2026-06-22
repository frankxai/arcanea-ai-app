/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllSkills, getCategories } from '@/lib/skills/loader';
import SkillSearch from '@/components/skills/SkillSearch';
import { SectionShell, SectionHeader, FeatureCard } from '@/components/premium';
import { Magnetic } from '@/components/motion/magnetic';
import { SkillsHero } from './skills-hero';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Skills — the Arcanea open library',
  description:
    'Open, composable skills that teach your agents new craft. Install with one command in Claude Code, OpenCode, Cursor, and more. MIT-licensed, fork forever.',
  openGraph: {
    title: 'Skills — the Arcanea open library',
    description:
      'Open, composable skills for Claude Code, OpenCode, Cursor, and more. Install with one command.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skills — the Arcanea open library',
    description:
      'Open, composable skills for Claude Code, OpenCode, Cursor, and more.',
  },
  alternates: { canonical: '/skills' },
  robots: { index: true, follow: true },
};

export default async function SkillsMarketplacePage() {
  const skills = await getAllSkills();
  const categories = getCategories(skills);

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-white/90">
      {/* Hero */}
      <SkillsHero skillCount={skills.length} categoryCount={categories.length} />

      {/* Browse */}
      <SectionShell ambient="teal" size="compact">
        <div className="container-page max-w-6xl">
          <SectionHeader
            label="Browse the library"
            title="Find the craft you need"
            subtitle="Search by name or filter by domain. Every skill is a single markdown file with frontmatter — readable, auditable, and yours to fork."
          />
          {skills.length > 0 ? (
            <SkillSearch skills={skills} categories={categories} />
          ) : (
            <div className="text-center py-24">
              <p className="text-white/40 text-sm mb-3">
                No skills found in the open library yet.
              </p>
              <p className="text-white/25 text-xs">
                Skills live in{' '}
                <code className="text-[var(--arc-brand-atlantean-teal)]/60">oss/skills/arcanea/</code>
              </p>
            </div>
          )}
        </div>
      </SectionShell>

      {/* Contribute CTA */}
      <section className="container-page max-w-4xl pb-24">
        <FeatureCard glowColor="var(--arc-brand-atlantean-teal)" className="text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--arc-brand-atlantean-teal)]/70 mb-4">
            Open by design
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white/95 mb-3">
            Forge your own skill
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-7 text-sm leading-relaxed font-body">
            A skill is a markdown file with frontmatter — nothing more. Fork the
            repo, add yours, open a PR. Once it merges, it appears here for every
            creator in the multiverse.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Magnetic>
              <Link
                href="https://github.com/frankxai/arcanea/tree/main/skills/arcanea"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 min-h-[44px] rounded-xl bg-[var(--arc-brand-atlantean-teal)]/15 border border-[var(--arc-brand-atlantean-teal)]/30 text-[var(--arc-brand-atlantean-teal)] text-sm font-medium hover:bg-[var(--arc-brand-atlantean-teal)]/25 transition-colors"
              >
                View on GitHub →
              </Link>
            </Magnetic>
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 px-6 min-h-[44px] rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-sm font-medium hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              Read the skill guide
            </Link>
          </div>
        </FeatureCard>
      </section>
    </div>
  );
}
