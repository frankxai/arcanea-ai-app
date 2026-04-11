import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  GitFork,
  GitPullRequest,
  Sparkles,
  Terminal,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { CopyableCommand } from '@/components/contribute/CopyableCommand';
import { StepCard } from '@/components/contribute/StepCard';
import { TierCard } from '@/components/contribute/TierCard';
import { FAQAccordion } from '@/components/contribute/FAQAccordion';
import { BookStarterWizard } from '@/components/contribute/BookStarterWizard';

export const metadata: Metadata = {
  title: 'Publish Your Book — Arcanea Open Library',
  description:
    'Write with AI. Keep the rights. Reach readers. Auto-publish to Arcanea in 5 steps.',
  openGraph: {
    title: 'Publish Your Book on Arcanea',
    description: 'Auto-publish via PR. No editors, no queues, no gatekeepers.',
  },
};

const TIERS = [
  {
    name: 'Community',
    tagline: 'Auto-published. Free forever.',
    description:
      'Ship via pull request. CI validates quality. Your book goes live within minutes. Community ratings surface the best.',
    glow: '#22c55e',
    accent: '#4ade80',
    badge: 'Open',
    href: '/books/drafts',
  },
  {
    name: 'Featured',
    tagline: 'Editor-curated. Revenue share.',
    description:
      'Graduated from Community. Guardian Intelligence ratings, editorial polish, and a 70/30 revenue split with subscribers.',
    glow: '#ffd700',
    accent: '#facc15',
    badge: 'Curated',
    href: '/books',
  },
  {
    name: 'Canon',
    tagline: 'Arcanea universe. Invitation.',
    description:
      'The core mythology — Lumina, Nero, the Ten Gates, the Arc. Written under the house voice. By invitation.',
    glow: '#ef4444',
    accent: '#f87171',
    badge: 'Canon',
    href: '/lore',
  },
];

const FAQ_ITEMS = [
  {
    id: 'code',
    question: 'Do I need to know how to code?',
    answer: (
      <>
        <p>
          You need two small things: a GitHub account and the ability to run a
          couple of commands in a terminal. That is it. No JavaScript, no build
          tooling, no database, no server.
        </p>
        <p className="mt-3">
          If you can copy and paste a command, you can publish. If you get
          stuck, open an issue on the repo and the community will help.
        </p>
      </>
    ),
  },
  {
    id: 'no-ai',
    question: 'Can I publish without using AI?',
    answer: (
      <>
        <p>
          Yes. Set{' '}
          <code className="rounded bg-white/[0.06] px-1 text-[12px] text-[#9befe8]">
            ai_contribution: 0
          </code>{' '}
          in your{' '}
          <code className="rounded bg-white/[0.06] px-1 text-[12px] text-[#9befe8]">
            book.yaml
          </code>
          . The AI transparency field is a contract with readers, not a
          requirement for publishing.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    question: 'What rights do I keep?',
    answer: (
      <>
        <p>
          All of them. You choose the license in your{' '}
          <code className="rounded bg-white/[0.06] px-1 text-[12px] text-[#9befe8]">
            book.yaml
          </code>{' '}
          — Creative Commons, MIT, or All Rights Reserved. Arcanea hosts and
          distributes; you own the words.
        </p>
        <p className="mt-3">
          Featured tier requires a license that permits subscriber
          redistribution, but you retain ownership either way.
        </p>
      </>
    ),
  },
  {
    id: 'revenue',
    question: 'How does the revenue split work?',
    answer: (
      <>
        <p>
          Community tier is free — no paywall, no split. Featured tier books
          earn a 70/30 revenue share from subscriber proceeds attributed to
          your book (70 to you, 30 to Arcanea for hosting and promotion).
        </p>
        <p className="mt-3">
          Canon books are free forever as part of the house universe.
        </p>
      </>
    ),
  },
  {
    id: 'unpublish',
    question: 'What if I want to unpublish later?',
    answer: (
      <>
        <p>
          Open a PR setting{' '}
          <code className="rounded bg-white/[0.06] px-1 text-[12px] text-[#9befe8]">
            status: archived
          </code>{' '}
          in your{' '}
          <code className="rounded bg-white/[0.06] px-1 text-[12px] text-[#9befe8]">
            book.yaml
          </code>
          , or delete the folder entirely. Your book is removed from the index
          on merge. Git history preserves your work in your own fork if you
          want it back.
        </p>
      </>
    ),
  },
  {
    id: 'review',
    question: 'Is there a human review process?',
    answer: (
      <>
        <p>
          Not for Community tier — CI runs the quality gate automatically and
          auto-merges on pass. No queues, no gatekeepers.
        </p>
        <p className="mt-3">
          Featured and Canon tiers do involve human curation because they
          carry a quality promise to subscribers and canon consistency to
          readers.
        </p>
      </>
    ),
  },
  {
    id: 'models',
    question: 'Can I use AI models other than Claude?',
    answer: (
      <>
        <p>
          Absolutely. Declare whatever you used in the{' '}
          <code className="rounded bg-white/[0.06] px-1 text-[12px] text-[#9befe8]">
            ai_transparency.models_used
          </code>{' '}
          block — GPT, Gemini, Grok, DeepSeek, Llama, local models, anything.
          Arcanea preferred tooling is Claude Code because it integrates
          cleanly with the{' '}
          <code className="rounded bg-white/[0.06] px-1 text-[12px] text-[#9befe8]">
            /arcanea-author
          </code>{' '}
          skill, but the library is model-agnostic.
        </p>
      </>
    ),
  },
];

const RESOURCES = [
  {
    title: 'Publishing Guide',
    description: 'The full reference — every field, every rule.',
    href: 'https://github.com/frankxai/arcanea-ai-app/blob/main/docs/community/publishing-guide.md',
    external: true,
  },
  {
    title: 'book.yaml Schema',
    description: 'Machine-readable schema for manifest validation.',
    href: 'https://github.com/frankxai/arcanea-ai-app/blob/main/oss/skills/SCHEMA.md',
    external: true,
  },
  {
    title: 'The Forge of Ruin',
    description: 'Featured example — dark fantasy, grimdark.',
    href: '/books/drafts/forge-of-ruin',
    external: false,
  },
  {
    title: 'Tides of Silence',
    description: 'Community example — literary fantasy.',
    href: '/books/drafts/tides-of-silence',
    external: false,
  },
  {
    title: 'Heart of Pyrathis',
    description: 'Community example — epic fantasy.',
    href: '/books/drafts/heart-of-pyrathis',
    external: false,
  },
  {
    title: 'Quality Gate CI',
    description: 'The workflow that validates every PR.',
    href: 'https://github.com/frankxai/arcanea-ai-app/blob/main/.github/workflows/book-quality-gate.yml',
    external: true,
  },
  {
    title: 'Arcanea Repository',
    description: 'Fork, star, clone — everything lives here.',
    href: 'https://github.com/frankxai/arcanea-ai-app',
    external: true,
  },
  {
    title: 'Community Discussions',
    description: 'Writers, worldbuilders, and feedback threads.',
    href: 'https://github.com/frankxai/arcanea-ai-app/discussions',
    external: true,
  },
] as const;

export default function ContributePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] overflow-hidden">
        <div className="absolute left-1/2 top-[-200px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#00bcd4]/15 via-[#0d47a1]/10 to-transparent blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-32 pt-16">
        {/* Hero */}
        <section className="relative mb-24 text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#00bcd4]">
            Arcanea Open Library
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-6xl">
            <span className="bg-gradient-to-r from-white via-white/95 to-[#00bcd4]/80 bg-clip-text text-transparent">
              Publish your book
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#00bcd4] via-[#4dd0e1] to-[#ffd700] bg-clip-text text-transparent">
              on Arcanea
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            Write with AI. Keep the rights. Reach readers.
            <br className="hidden md:block" /> No editors, no queues, no
            gatekeepers.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#step-1"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#00897b] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(0,188,212,0.3)] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/50"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Start your first book
            </a>
            <a
              href="https://github.com/frankxai/arcanea-ai-app/blob/main/docs/community/publishing-guide.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] px-6 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/[0.2] hover:text-white"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Read the full guide
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-white/35">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3 w-3" aria-hidden="true" /> You own the
              rights
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GitPullRequest className="h-3 w-3" aria-hidden="true" /> Auto-merge
              on CI pass
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Terminal className="h-3 w-3" aria-hidden="true" /> Claude Code
              native
            </span>
          </div>
        </section>

        {/* Three tiers */}
        <section className="mb-24">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold text-white/95">
                Three tiers, one library
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Start in Community. Good books graduate. Canon is the house.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TIERS.map((tier) => (
              <TierCard key={tier.name} {...tier} />
            ))}
          </div>
        </section>

        {/* 5 steps */}
        <section className="mb-24">
          <div className="mb-10">
            <h2 className="font-display text-3xl font-semibold text-white/95">
              The process, end to end
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Five steps from empty directory to live book page.
            </p>
          </div>

          <div className="space-y-5">
            <StepCard
              id="step-1"
              step={1}
              title="Install the tools"
              description="Claude Code is the editor. The Arcanea author skill teaches it how to build a book."
            >
              <p className="text-xs text-white/50">
                Download Claude Code from{' '}
                <a
                  href="https://claude.com/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00bcd4] hover:underline"
                >
                  claude.com/download
                </a>
                , then install the author skill.
              </p>
              <CopyableCommand
                command="npx arcanea install arcanea-author"
                label="Install the Arcanea author skill"
              />
            </StepCard>

            <StepCard
              step={2}
              title="Fork the repository"
              description="Every book is a PR. Start by forking the Arcanea monorepo and cloning it locally."
            >
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/frankxai/arcanea-ai-app/fork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-black transition-transform hover:-translate-y-0.5"
                >
                  <GitFork className="h-4 w-4" aria-hidden="true" />
                  Fork on GitHub
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
              <CopyableCommand
                command="git clone https://github.com/YOUR-USERNAME/arcanea-ai-app.git"
                label="Clone your fork"
              />
            </StepCard>

            <StepCard
              step={3}
              title="Write your book"
              description="Open Claude Code inside your fork, invoke /arcanea-author, and describe the book you want to write. The skill generates manifest, chapters, outline, characters, and worldbuilding."
            >
              <CopyableCommand
                command="/arcanea-author"
                label="Inside Claude Code"
                language="claude-code"
              />
              <p className="text-xs text-white/50">
                Your book lives at{' '}
                <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[12px] text-[#9befe8]">
                  book/your-slug/
                </code>
                . Iterate in the editor, in Claude Code, or both.
              </p>
            </StepCard>

            <StepCard
              step={4}
              title="Open a pull request"
              description="Branch named after your slug. Commit your folder. Push. Open a PR using the book contribution template."
            >
              <CopyableCommand
                multiline
                command={`git checkout -b book/your-slug
git add book/your-slug/
git commit -m "book(your-slug): initial draft"
git push origin book/your-slug`}
                label="From your fork"
              />
            </StepCard>

            <StepCard
              step={5}
              title="CI runs the quality gate"
              description="Schema validation. 500-word minimum per chapter. Anti-slop scan. If it passes, your book auto-merges to the Community tier and goes live at arcanea.ai/books/drafts/your-slug within minutes."
            >
              <div className="rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/[0.04] p-4">
                <p className="text-[12px] font-semibold text-[#4ade80]">
                  What the gate checks
                </p>
                <ul className="mt-2 space-y-1 text-[12px] text-white/55">
                  <li>- book.yaml schema and required fields</li>
                  <li>- Each chapter at least 500 words</li>
                  <li>- Anti-slop scan (purple prose, AI tells)</li>
                  <li>- License declared, author attributed</li>
                  <li>- No malicious content or canon violations</li>
                </ul>
              </div>
            </StepCard>
          </div>
        </section>

        {/* Wizard */}
        <section id="wizard" className="mb-24">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#ffd700]">
              Optional shortcut
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white/95">
              Generate your starter in the browser
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Skip the boilerplate. Fill out the form; download a
              ready-to-commit folder.
            </p>
          </div>
          <BookStarterWizard />
        </section>

        {/* FAQ */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold text-white/95">
              Questions, answered
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Everything readers and writers ask before their first PR.
            </p>
          </div>
          <FAQAccordion items={FAQ_ITEMS} />
        </section>

        {/* Resources */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold text-white/95">
              Resources
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Docs, examples, and places to ask for help.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((resource) => {
              const cardClass =
                'group flex flex-col gap-1 rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.035] to-white/[0.01] p-4 transition-all hover:border-[#00bcd4]/25 hover:shadow-[0_0_32px_rgba(0,188,212,0.06)]';
              const inner = (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/85 group-hover:text-white">
                      {resource.title}
                    </span>
                    {resource.external ? (
                      <ExternalLink
                        className="h-3.5 w-3.5 text-white/30 group-hover:text-white/70"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowRight
                        className="h-3.5 w-3.5 text-white/30 group-hover:text-white/70"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <span className="text-[12px] leading-relaxed text-white/45">
                    {resource.description}
                  </span>
                </>
              );
              return resource.external ? (
                <a
                  key={resource.title}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {inner}
                </a>
              ) : (
                <Link key={resource.title} href={resource.href} className={cardClass}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#00bcd4]/[0.08] via-[#0d47a1]/[0.04] to-[#ffd700]/[0.04] p-10 text-center">
          <h2 className="font-display text-3xl font-semibold text-white/95">
            The library is waiting
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/55">
            Every great book on Arcanea started as an empty folder and a
            decision. The hard part is choosing. The rest is five commands.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#wizard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#00897b] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_32px_rgba(0,188,212,0.3)] transition-transform hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Launch the wizard
            </a>
            <Link
              href="/books/drafts"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] px-6 py-3 text-sm font-medium text-white/80 transition-all hover:border-white/[0.25] hover:text-white"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Browse the library
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
