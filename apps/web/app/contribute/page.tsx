import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contribute to Arcanea | Open Source Creative Intelligence',
  description: 'Join 90+ open-source repositories. Contribute skills, agents, lore, code, art, and music. Earn revenue through the marketplace.',
  openGraph: {
    title: 'Contribute to Arcanea',
    description: 'Open source creative intelligence. Contribute skills, agents, lore, and earn through the marketplace.',
  },
};

const CONTRIBUTION_PATHS = [
  {
    title: 'Skills & Agents',
    description: 'Build AI skills that solve real creative problems. Package them for the marketplace. Earn revenue from usage.',
    href: '/skills',
    examples: ['Prompt engineering skills', 'Domain-specific agents', 'MCP server integrations', 'Workflow automations'],
    icon: '🔮',
    color: '#00bcd4',
    difficulty: 'Intermediate',
  },
  {
    title: 'Code & Features',
    description: 'Contribute to the platform itself. Fix bugs, add features, improve performance. The entire codebase is open.',
    href: 'https://github.com/frankxai/arcanea-ai-app',
    examples: ['UI components', 'API routes', 'Performance optimization', 'Accessibility improvements'],
    icon: '⚡',
    color: '#60a5fa',
    difficulty: 'Varies',
  },
  {
    title: 'Lore & World-Building',
    description: 'Expand the Arcanea mythology. Write canon-safe stories, design creatures, develop Academy curriculum.',
    href: '/library',
    examples: ['Guardian stories', 'Academy lessons', 'Bestiary entries', 'Historical chronicles'],
    icon: '📜',
    color: '#ffd700',
    difficulty: 'Beginner',
  },
  {
    title: 'Art & Music',
    description: 'Create visual art and music for the Arcanea universe. Guardian portraits, Gate soundscapes, UI assets.',
    href: '/gallery',
    examples: ['Guardian art', 'Gate frequency music', 'UI illustrations', 'Animated backgrounds'],
    icon: '🎨',
    color: '#a78bfa',
    difficulty: 'Intermediate',
  },
  {
    title: 'Templates & Worlds',
    description: 'Build worlds using the Arcanea framework. Create templates others can use. Sell premium worlds.',
    href: '/worlds/create',
    examples: ['World templates', 'Character archetypes', 'Magic system blueprints', 'Campaign frameworks'],
    icon: '🌍',
    color: '#34d399',
    difficulty: 'Advanced',
  },
  {
    title: 'Documentation & Teaching',
    description: 'Help others learn. Write tutorials, record walkthroughs, improve Academy courses.',
    href: '/academy',
    examples: ['Tutorial articles', 'Video guides', 'Course modules', 'FAQ contributions'],
    icon: '📚',
    color: '#f59e0b',
    difficulty: 'Beginner',
  },
];

const REPOS = [
  { name: 'arcanea-ai-app', desc: 'Main platform (Next.js)', stars: '—', lang: 'TypeScript' },
  { name: 'arcanea', desc: 'OSS monorepo (skills, agents, lore)', stars: '—', lang: 'TypeScript' },
  { name: 'arcanea-code', desc: 'CLI with Guardian routing', stars: '—', lang: 'TypeScript' },
  { name: 'oh-my-arcanea', desc: 'Agent harness overlay', stars: '—', lang: 'Markdown' },
  { name: 'agentic-creator-os', desc: '90+ skills, 65+ commands', stars: '—', lang: 'Markdown' },
  { name: 'arcanea-mcp', desc: 'MCP server for world-building', stars: '—', lang: 'TypeScript' },
];

const STEPS = [
  { n: 1, title: 'Discover', desc: 'Explore the platform. Use /chat, /imagine, /library. Understand what Arcanea is.' },
  { n: 2, title: 'Learn', desc: 'Read the Academy. Understand the Ten Gates, Five Elements, and the Creator Journey.' },
  { n: 3, title: 'Fork', desc: 'Choose a repo. Fork it. Set up your development environment.' },
  { n: 4, title: 'Build', desc: 'Create your contribution. Follow the Arcanean Code of Agentic Engineering.' },
  { n: 5, title: 'Submit', desc: 'Open a PR. Quality gates run automatically. A Guardian reviews your work.' },
  { n: 6, title: 'Earn', desc: 'Published skills earn revenue share. Top contributors join the Inner Circle.' },
];

export default function ContributePage() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-24">
        {/* Hero */}
        <section className="text-center mb-16 pt-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#00bcd4] mb-4">
            Open Source
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-white/90 to-[#00bcd4]/80 bg-clip-text text-transparent">
              Contribute to Arcanea
            </span>
          </h1>
          <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-8">
            90+ repositories. 75+ skills. A mythology written by creators for creators.
            Everything is open. Everything is yours to build on.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://github.com/frankxai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#00897b] text-white text-sm font-medium hover:shadow-[0_0_24px_rgba(0,188,212,0.3)] transition-all"
            >
              View on GitHub
            </a>
            <Link
              href="/skills"
              className="px-6 py-2.5 rounded-xl border border-white/[0.08] text-white/50 text-sm font-medium hover:border-white/[0.15] hover:text-white/70 transition-all"
            >
              Skills Marketplace
            </Link>
          </div>
        </section>

        {/* Journey */}
        <section className="mb-16">
          <h2 className="text-xl font-display font-semibold text-white/80 mb-6">The Contributor Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.06] p-4 text-center"
              >
                <div className="w-7 h-7 rounded-full bg-[#00bcd4]/10 text-[#00bcd4] text-xs font-bold flex items-center justify-center mx-auto mb-2">
                  {step.n}
                </div>
                <h3 className="text-xs font-semibold text-white/70 mb-1">{step.title}</h3>
                <p className="text-[10px] text-white/25 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contribution Paths */}
        <section className="mb-16">
          <h2 className="text-xl font-display font-semibold text-white/80 mb-6">Ways to Contribute</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTRIBUTION_PATHS.map((path) => (
              <Link
                key={path.title}
                href={path.href}
                className="group rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.06] p-5 hover:border-[#00bcd4]/20 hover:shadow-[0_0_20px_rgba(0,188,212,0.06)] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{path.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{path.title}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${path.color}15`, color: path.color }}>
                      {path.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-[12px] text-white/35 mb-3 leading-relaxed">{path.description}</p>
                <div className="flex flex-wrap gap-1">
                  {path.examples.map((ex) => (
                    <span key={ex} className="text-[9px] text-white/20 px-1.5 py-0.5 rounded-full border border-white/[0.05]">
                      {ex}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Key Repos */}
        <section className="mb-16">
          <h2 className="text-xl font-display font-semibold text-white/80 mb-6">Key Repositories</h2>
          <div className="space-y-2">
            {REPOS.map((repo) => (
              <a
                key={repo.name}
                href={`https://github.com/frankxai/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/[0.05] hover:border-[#00bcd4]/15 hover:bg-white/[0.02] transition-all group"
              >
                <span className="text-sm font-mono text-[#00bcd4] group-hover:text-[#00bcd4] transition-colors">{repo.name}</span>
                <span className="text-[11px] text-white/25 flex-1">{repo.desc}</span>
                <span className="text-[10px] text-white/15 px-1.5 py-0.5 rounded bg-white/[0.04]">{repo.lang}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="mb-16">
          <div className="rounded-2xl bg-gradient-to-br from-[#00bcd4]/5 via-transparent to-[#ffd700]/5 border border-white/[0.06] p-8">
            <h2 className="text-xl font-display font-semibold text-white/80 mb-4">The Arcanean Code</h2>
            <p className="text-sm text-white/35 mb-6">Every contribution follows these principles:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Read before write',
                'Build clean, ship clean',
                'Parallel by default',
                'Measure everything',
                'Feedback is gold',
                'Guard the gates',
                'Document the why',
                'Respect the canon',
                'Ship > perfect',
                'The Arc turns',
              ].map((principle, i) => (
                <div key={principle} className="flex items-center gap-2 text-[13px] text-white/50">
                  <span className="text-[10px] text-[#00bcd4]/50 font-mono w-5">{i + 1}.</span>
                  {principle}
                </div>
              ))}
            </div>
            <Link
              href="/blog/arcanean-code-agentic-engineering"
              className="inline-flex items-center gap-2 mt-6 text-sm text-[#00bcd4] hover:text-[#00bcd4]/80 transition-colors"
            >
              Read the full manifesto →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
