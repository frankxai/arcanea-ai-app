import { Metadata } from "next";
import Link from "next/link";

// ─── Metadata ──────────────────────────────────────────────────────────────────

const TITLE = "The Arcanean Code of Agentic Engineering";
const DESCRIPTION =
  "Ten battle-tested principles for human-AI collaboration on production software. A manifesto for agentic engineering from the team that builds with agents every day.";
const SLUG = "arcanean-code-agentic-engineering";
const DATE = "2026-03-29";
const AUTHOR = "FrankX";
const READ_TIME = "14 min read";
const ACCENT = "#7fffd4";

export const metadata: Metadata = {
  title: `${TITLE} | Blog`,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    publishedTime: DATE,
    authors: [AUTHOR],
    url: `https://arcanea.ai/blog/${SLUG}`,
    images: [
      {
        url: "https://arcanea.ai/og/arcanean-code-agentic-engineering.png",
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["https://arcanea.ai/og/arcanean-code-agentic-engineering.png"],
  },
  alternates: {
    canonical: `https://arcanea.ai/blog/${SLUG}`,
  },
};

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────

type InlineSvgProps = { className?: string; style?: React.CSSProperties };
const Icons: Record<string, React.FC<InlineSvgProps>> = {
  ArrowLeft: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Tag: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Share2: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Bookmark: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  ThumbsUp: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  ),
  MessageCircle: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Principle Data ────────────────────────────────────────────────────────────

interface Principle {
  number: number;
  title: string;
  tagline: string;
  body: string[];
  code?: string;
}

const PRINCIPLES: Principle[] = [
  {
    number: 1,
    title: "Read Before Write",
    tagline: "Never modify code you haven't read.",
    body: [
      "The single most common failure mode in AI-assisted development is blind mutation. An agent receives an instruction — \"fix the auth middleware\" — and immediately begins generating code. It invents function signatures that don't match the existing codebase. It duplicates utilities that already exist three directories over. It introduces naming conventions that contradict every other file in the project. The fix compiles. The fix is also wrong, because the agent never understood what it was fixing.",
      "This principle is non-negotiable because it separates productive AI collaboration from expensive autocomplete. Before an agent touches a file, it reads that file. Before it refactors a module, it reads the modules that import it. Before it adds a dependency, it checks the lockfile. The cost of reading is measured in seconds. The cost of not reading is measured in hours of debugging code that was generated against a hallucinated version of your codebase.",
      "In practice, this means your agent configuration should enforce read-before-edit at the tooling level. Every edit command should require a preceding read of the target file. Every refactoring session should start with a scan of the affected dependency graph. The agent that reads first writes code that belongs in your project. The agent that writes first generates code that belongs in a tutorial.",
    ],
    code: `# Bad: Agent invents the interface
def update_user(user_id, data):
    db.users.update(user_id, data)  # Wrong — this project uses SQLAlchemy ORM

# Good: Agent reads first, matches the pattern
def update_user(user_id: str, data: UserUpdate) -> User:
    stmt = select(UserModel).where(UserModel.id == user_id)
    user = session.execute(stmt).scalar_one()
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    session.commit()
    return User.model_validate(user)`,
  },
  {
    number: 2,
    title: "Build Clean, Ship Clean",
    tagline: "Every commit must build. Every push must deploy.",
    body: [
      "A broken build is not a minor inconvenience. It is a full stop for every developer on the team and every agent in the swarm. When your CI pipeline goes red, the cost compounds: other agents can't verify their own work against main, human developers lose trust in the automated process, and the next person to pull will waste twenty minutes figuring out whether the failure is theirs or someone else's. One broken commit doesn't just break one thing — it breaks the entire feedback loop that makes continuous delivery possible.",
      "Agentic engineering makes this worse because agents work fast. A human developer who breaks the build will notice within minutes because they're watching the pipeline. An agent that breaks the build will cheerfully continue generating code on top of the broken state, compounding the damage with every subsequent commit. By the time a human notices, there are six commits of code built on a foundation that doesn't compile.",
      "The discipline is straightforward: run the build locally before committing. Run the test suite. Run the linter. If any of these fail, the agent fixes the failure before proceeding. This is not overhead — it is the minimum viable standard for participating in a shared codebase. An agent that ships broken code is not saving time. It is borrowing time from the future at predatory interest rates.",
    ],
    code: `# Enforce in your agent configuration:
# 1. Pre-commit: build + lint + type-check
npm run build && npm run lint && npm run typecheck

# 2. Pre-push: full test suite
npm test -- --coverage --bail

# 3. CI: the same checks, plus integration tests
# If any step fails, the commit does not land.`,
  },
  {
    number: 3,
    title: "Parallel by Default",
    tagline: "Independent operations run simultaneously.",
    body: [
      "Sequential execution is the default mode of most AI-assisted workflows, and it is a catastrophic waste of time. An agent reads a file, waits for the response, reads another file, waits again, then makes an edit. Three operations that could have completed in one round trip instead take three. Multiply this across a session with hundreds of tool calls and you've turned a ten-minute task into a forty-minute crawl.",
      "The principle is simple: if two operations don't depend on each other's output, they run at the same time. Reading five files? One batch call. Running the linter and the type checker? Parallel. Spawning three agents to handle frontend, backend, and documentation? All in the same message. The dependency graph dictates the execution order, not habit or laziness.",
      "This applies at every scale. Within a single agent session, batch independent tool calls. Within a multi-agent swarm, spawn all workers simultaneously and let each report back when finished. At the CI level, run test suites in parallel across shards. The teams that ship fastest are not the ones with the fastest agents — they're the ones that never run two things sequentially when they could run them concurrently.",
    ],
    code: `// Sequential (slow — each waits for the previous)
const config = await readFile('config.ts');
const schema = await readFile('schema.ts');
const types = await readFile('types.ts');

// Parallel (fast — all resolve together)
const [config, schema, types] = await Promise.all([
  readFile('config.ts'),
  readFile('schema.ts'),
  readFile('types.ts'),
]);`,
  },
  {
    number: 4,
    title: "Measure Everything",
    tagline: "No change without before/after metrics.",
    body: [
      "Performance optimization without measurement is superstition. An agent refactors a database query \"for performance\" and the team celebrates — until someone actually benchmarks it and discovers the new query is slower because it lost an index hint. An agent \"optimizes\" a React component by memoizing it, adding complexity without evidence that the component was ever re-rendering unnecessarily. Without numbers, you are guessing. Guessing at scale is how you ship regressions.",
      "The practice is this: before you change anything for performance, record the current state. Response time. Bundle size. Memory usage. Lighthouse score. Whatever metric motivated the change. Then make the change. Then measure again. If the number didn't improve, the change didn't work, and it should not land. This is not bureaucracy — it is the scientific method applied to engineering. You would not accept a drug that was never tested. Do not accept an optimization that was never measured.",
      "For AI agents, this principle must be encoded into the workflow. The agent captures baseline metrics before starting optimization work. It captures the same metrics after. It includes both numbers in its report. A human reviews the delta and decides whether to merge. This creates an audit trail of evidence-based decisions rather than a commit history of vibes-based refactoring.",
    ],
    code: `# Before: capture baseline
lighthouse http://localhost:3000 --output=json > baseline.json
# Result: Performance 72, FCP 1.8s, LCP 3.2s

# After: apply changes, measure again
lighthouse http://localhost:3000 --output=json > after.json
# Result: Performance 89, FCP 1.1s, LCP 2.1s

# Delta: +17 perf, -0.7s FCP, -1.1s LCP — merge it.
# If delta is zero or negative — revert it.`,
  },
  {
    number: 5,
    title: "Feedback is Gold",
    tagline: "Every correction is a pattern. Store it.",
    body: [
      "When a human developer reviews AI-generated code and says \"we don't use default exports in this project,\" that correction contains a rule. Not a suggestion, not a preference — a rule that applies to every future file the agent generates. If that rule lives only in the conversation where it was spoken, it will be violated again in the next session. The agent has no memory. The human has to correct the same mistake across dozens of conversations. Both sides waste energy on a problem that was solved the first time it was encountered.",
      "The fix is a persistent feedback system. Every correction gets stored as a pattern: the context that triggered the mistake, the correction that was applied, and the rule that prevents recurrence. This can be as simple as a CLAUDE.md file that accumulates project conventions, or as sophisticated as a vector database of past corrections that agents query before generating code. The mechanism matters less than the habit: every correction is captured, and every captured correction is consulted.",
      "Over time, this transforms the AI-human collaboration from a repetitive correction loop into a genuine learning system. The agent makes fewer mistakes because it checks the pattern bank before writing. The human spends less time reviewing because the common errors are already handled. The codebase converges on consistency not through enforcement, but through accumulated wisdom. This is the compound interest of good feedback hygiene.",
    ],
  },
  {
    number: 6,
    title: "Guard the Gates",
    tagline: "Security scan on every commit. Quality gate on every PR.",
    body: [
      "The speed of agentic development is both its greatest strength and its most dangerous liability. An agent can generate a complete API endpoint in thirty seconds — including the SQL injection vulnerability, the missing rate limiter, the hardcoded secret in the environment config, and the overly permissive CORS header. Speed without guardrails does not produce software faster. It produces vulnerabilities faster.",
      "Every commit passes through automated security scanning. Every pull request passes through a quality gate that checks test coverage, type safety, linting compliance, and dependency audit. These gates are not optional and they are not overridable. An agent that generates code which fails the security scan does not get to bypass the scan — it gets to fix the code. This is the same standard we hold human developers to, applied without exception to automated contributors.",
      "The gates must run automatically, and they must run fast. A security scan that takes twenty minutes will be skipped. A quality gate that requires manual approval for every PR will become a rubber stamp. The goal is a sub-sixty-second automated checkpoint that catches the obvious failures — leaked secrets, missing auth checks, known CVEs in dependencies — and flags the subtle ones for human review. Fast, automated, non-negotiable.",
    ],
    code: `# Pre-commit hook: fast automated checks
#!/bin/sh
# 1. No secrets in staged files
npx secretlint --staged
# 2. Type safety
npx tsc --noEmit
# 3. Lint
npx eslint --cache .
# 4. Dependency audit
npm audit --production --audit-level=high

# If any check fails, the commit is rejected.
# The agent fixes the issue and tries again.`,
  },
  {
    number: 7,
    title: "Document the Why",
    tagline: "Commit messages explain intent, not mechanics.",
    body: [
      "\"Updated file\" is not a commit message. \"Fixed bug\" is barely one. \"Refactored auth module to use middleware pattern because the previous inline approach couldn't support per-route permission checks\" — that is a commit message. The diff tells you what changed. The message tells you why it changed. Six months from now, when someone is debugging a regression and running git blame on the auth middleware, the diff will show them the code. Only the message will tell them the reasoning that produced it.",
      "AI agents are particularly prone to generating meaningless commit messages because most of them are prompted to \"commit after making changes\" without guidance on what a useful message contains. The result is a git history full of \"Updated auth.ts\" and \"Fixed issue\" — a wasteland of information-free noise that makes the project's history useless for archaeology.",
      "The standard is this: every commit message starts with what was done (fix, add, refactor, remove) and ends with why it was done. The body includes context that the diff cannot convey — the decision that led to this approach over alternatives, the ticket or conversation that motivated the change, the tradeoff that was accepted. Write commit messages for the developer who will read them at 2 AM while debugging production. That developer might be you.",
    ],
    code: `# Bad: describes the what (the diff already shows this)
git commit -m "Updated auth middleware"

# Good: describes the why
git commit -m "$(cat <<'EOF'
refactor(auth): migrate to middleware pattern for per-route permissions

The previous inline auth check in each route handler couldn't support
the new role-based access control requirements. Middleware pattern
allows declaring permissions at the route level and centralizes
token validation.

Closes #247
EOF
)"`,
  },
  {
    number: 8,
    title: "Respect the Canon",
    tagline: "Brand guidelines are not suggestions.",
    body: [
      "Every project has a canon — the accumulated set of decisions about naming conventions, architecture patterns, component structures, error handling approaches, and visual design that make the codebase coherent rather than a patchwork of individual preferences. In most projects, this canon is implicit, living in the heads of senior developers and enforced through code review. AI agents cannot read minds. If the canon is not written down, the agent will violate it constantly and confidently.",
      "This is why projects that succeed with agentic engineering invest heavily in explicit documentation of their conventions. A CLAUDE.md file that specifies \"we use named exports, never default exports\" prevents a thousand corrections. A design system document that defines color tokens prevents agents from hardcoding hex values. An architecture decision record that explains \"we chose server components by default, client components only when interactivity requires it\" prevents agents from wrapping everything in useState.",
      "Respecting the canon also means knowing when to challenge it. A convention that made sense six months ago may not make sense today. But the way to change a convention is to propose the change explicitly, update the documentation, and then write code that follows the new convention. The way to NOT change a convention is to ignore it and hope nobody notices. Agents that respect the canon produce code that belongs in the project. Agents that ignore it produce code that looks like it was pasted from Stack Overflow.",
    ],
  },
  {
    number: 9,
    title: "Ship > Perfect",
    tagline: "A deployed feature beats a perfect branch.",
    body: [
      "Perfectionism is the most expensive bug in software development, and AI agents make it worse by making iteration cheap. When generating code costs nothing, the temptation is to keep refining — one more abstraction, one more edge case, one more optimization pass. The branch grows. The diff becomes unreviewable. The feature that could have shipped on Tuesday is still in progress on Friday because someone (human or agent) decided the error messages needed to be more poetic.",
      "The discipline is: define what \"done\" means before you start, and stop when you reach it. A feature is done when it works correctly for the primary use case, handles errors gracefully, has test coverage for the critical path, and passes the quality gates. It does not need to handle every conceivable edge case on the first iteration. It does not need a custom animation. It does not need to be the most elegant implementation possible. It needs to be deployed where users can reach it.",
      "This is not an argument for sloppy work. It is an argument for iteration over perfection. Ship the working version. Collect feedback. Improve based on real usage data instead of imagined scenarios. The best code is not the code that anticipated every edge case in advance — it is the code that shipped early enough to learn from production. A feature behind a feature flag in production teaches you more in one day than a feature on a branch teaches you in a month.",
    ],
  },
  {
    number: 10,
    title: "The Arc Turns",
    tagline: "Every session leaves the codebase better.",
    body: [
      "This is the meta-principle that contains all the others. Every interaction with the codebase — whether a five-minute bug fix or a five-hour feature build — should leave the code in a better state than it was found. Not just the code you touched, but the code around it. If you're fixing a bug in a file with inconsistent formatting, format the file. If you're adding a feature next to dead code, remove the dead code. If you're reviewing a module with missing types, add the types.",
      "This is the Boy Scout Rule scaled to AI-assisted development, and it matters more when agents are involved because agents generate volume. A human developer might touch ten files in a day. An agent might touch a hundred. If each touch leaves the surrounding code slightly better — a clarified variable name, a removed TODO, an added type annotation — the compound effect over weeks is transformational. If each touch only addresses the immediate task and ignores the surrounding decay, the compound effect is a codebase that rots faster than anyone can maintain it.",
      "The Arc is the Arcanean concept of cyclical transformation: Potential becomes Manifestation becomes Experience becomes Dissolution becomes Evolved Potential. Applied to engineering, it means this: you inherit a codebase in some state. You do your work. You hand it back in a better state. The next person (or agent) inherits your improvements and builds on them. Over time, this is how a codebase evolves from a collection of files into a system with integrity. Not through grand rewrites, but through the accumulated discipline of every session leaving things better than it found them.",
    ],
  },
];

const TAGS = [
  "agentic-engineering",
  "ai-development",
  "manifesto",
  "best-practices",
  "software-engineering",
  "multi-agent",
  "devops",
  "thought-leadership",
];

// ─── Structured Data ───────────────────────────────────────────────────────────

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  datePublished: DATE,
  dateModified: DATE,
  author: { "@type": "Person", name: AUTHOR },
  publisher: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
    logo: {
      "@type": "ImageObject",
      url: "https://arcanea.ai/logo.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://arcanea.ai/blog/${SLUG}`,
  },
  image: "https://arcanea.ai/og/arcanean-code-agentic-engineering.png",
  keywords: TAGS.join(", "),
  wordCount: 2800,
  articleSection: "Technology",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is agentic engineering?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Agentic engineering is a discipline for building production software through structured human-AI collaboration. It defines principles, guardrails, and workflows that allow AI agents to contribute reliably to shared codebases alongside human developers.",
      },
    },
    {
      "@type": "Question",
      name: "Why should AI agents read code before editing it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI agents that modify code without reading it first will invent function signatures, duplicate existing utilities, and introduce inconsistent naming conventions. Reading the target file and its dependencies ensures the generated code matches the existing codebase patterns.",
      },
    },
    {
      "@type": "Question",
      name: "How do you enforce quality gates in AI-assisted development?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Automated pre-commit hooks run security scanning, type checking, linting, and dependency audits on every commit. Pre-push hooks run the full test suite. CI pipelines run integration tests. If any check fails, the agent fixes the issue before proceeding — no exceptions.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between shipping fast and shipping sloppy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shipping fast means defining done before you start, implementing the primary use case with proper error handling and test coverage, and deploying. Shipping sloppy means skipping tests, ignoring error cases, and bypassing quality gates. The Arcanean Code demands both speed and standards.",
      },
    },
    {
      "@type": "Question",
      name: "How do you store feedback from AI code review corrections?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every correction is captured as a pattern — the context that triggered the mistake, the correction applied, and the rule that prevents recurrence. This can live in a project conventions file (like CLAUDE.md), a linter rule, or a vector database of past corrections that agents query before generating code.",
      },
    },
  ],
};

// ─── Render Helpers ────────────────────────────────────────────────────────────

function renderInlineFormatting(text: string) {
  // Handle **bold**, `code`, and *italic*
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Check for inline code
    const codeMatch = remaining.match(/^(.*?)`([^`]+)`(.*)$/s);
    const boldMatch = remaining.match(/^(.*?)\*\*([^*]+)\*\*(.*)$/s);
    const italicMatch = remaining.match(/^(.*?)\*([^*]+)\*(.*)$/s);

    // Find earliest match
    type EarliestMatch = { type: string; index: number; match: RegExpMatchArray };
    let earliest: EarliestMatch | null = null;

    const isBefore = (idx: number) => earliest === null || idx < (earliest as EarliestMatch).index;

    if (codeMatch && codeMatch[1] !== undefined) {
      const idx = codeMatch[1].length;
      if (isBefore(idx)) {
        earliest = { type: "code", index: idx, match: codeMatch };
      }
    }
    if (boldMatch && boldMatch[1] !== undefined) {
      const idx = boldMatch[1].length;
      if (isBefore(idx)) {
        earliest = { type: "bold", index: idx, match: boldMatch };
      }
    }
    if (italicMatch && italicMatch[1] !== undefined && isBefore(italicMatch[1].length)) {
      const idx = italicMatch[1].length;
      if (isBefore(idx)) {
        earliest = { type: "italic", index: idx, match: italicMatch };
      }
    }

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    const m = earliest.match;
    if (m[1]) parts.push(m[1]);

    if (earliest.type === "code") {
      parts.push(
        <code key={keyIdx++} className="px-1.5 py-0.5 rounded bg-white/[0.06] text-atlantean-teal font-mono text-sm">
          {m[2]}
        </code>
      );
    } else if (earliest.type === "bold") {
      parts.push(
        <strong key={keyIdx++} className="text-white font-semibold">{m[2]}</strong>
      );
    } else {
      parts.push(<em key={keyIdx++}>{m[2]}</em>);
    }

    remaining = m[3] || "";
  }

  return parts;
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function ArcaneanCodeAgenticEngineeringPage() {
  return (
    <div className="relative min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
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
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-mono px-3 py-1 rounded-full border"
              style={{
                backgroundColor: `${ACCENT}20`,
                color: ACCENT,
                borderColor: `${ACCENT}40`,
              }}
            >
              Technology
            </span>
            <span
              className="text-xs font-mono px-3 py-1 rounded-full border border-brand-gold/40 bg-brand-gold/20 text-brand-gold"
            >
              Manifesto
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            {TITLE}
          </h1>

          <p className="text-xl text-text-secondary mb-6 max-w-2xl">
            Ten battle-tested principles for building production software with AI agents.
            Not theory. Not aspiration. The rules we enforce on every commit.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-2">
              <Icons.User />
              {AUTHOR}
            </span>
            <span className="flex items-center gap-2">
              <Icons.Calendar />
              {formatDate(DATE)}
            </span>
            <span className="flex items-center gap-2">
              <Icons.Clock />
              {READ_TIME}
            </span>
          </div>
        </header>

        {/* Article Content */}
        <article className="liquid-glass rounded-2xl p-6 sm:p-10 mb-10">
          <div className="prose prose-invert prose-lg max-w-none">
            {/* Introduction */}
            <p className="my-4 text-text-secondary leading-relaxed text-lg">
              Software engineering is being rewritten. Not by a new framework, not by a new language, but by a
              fundamental shift in <strong className="text-white font-semibold">who writes the code</strong>. AI agents
              are no longer autocomplete tools that suggest the next line. They are autonomous contributors that read
              codebases, make architectural decisions, spawn parallel workers, and ship pull requests. They operate at a
              speed and scale that human developers never could.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              This changes everything about how we build software — and most teams are getting it wrong. They hand an
              agent a vague instruction, accept whatever comes back, and wonder why their codebase is deteriorating. The
              problem is not the technology. The problem is the absence of engineering discipline adapted to this new
              reality.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              The Arcanean Code of Agentic Engineering is our answer. These ten principles emerged from building a
              production platform — <strong className="text-white font-semibold">Arcanea</strong> — where AI agents
              routinely generate thousands of lines of code per session across dozens of parallel workers. Every
              principle was learned the hard way: by shipping code that violated it and paying the cost.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              This is not a set of suggestions. It is a manifesto for engineering teams that use AI agents as first-class
              contributors to production codebases.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Principles */}
            {PRINCIPLES.map((principle) => (
              <section key={principle.number} className="mb-12">
                <h2 className="text-2xl font-display font-bold mt-8 mb-2 text-white flex items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-mono font-bold"
                    style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}
                  >
                    {principle.number}
                  </span>
                  {principle.title}
                </h2>

                <p className="text-atlantean-teal font-mono text-sm tracking-wide mb-4 italic">
                  {principle.tagline}
                </p>

                {principle.body.map((paragraph, i) => (
                  <p key={i} className="my-4 text-text-secondary leading-relaxed">
                    {renderInlineFormatting(paragraph)}
                  </p>
                ))}

                {principle.code && (
                  <div className="my-6 rounded-xl overflow-hidden border border-white/[0.06]">
                    <div className="bg-white/[0.03] px-4 py-2 border-b border-white/[0.06]">
                      <span className="text-xs font-mono text-text-muted">Example</span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                      <code className="text-text-secondary font-mono">{principle.code}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Closing */}
            <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white">
              The Code in Practice
            </h2>

            <p className="my-4 text-text-secondary leading-relaxed">
              These ten principles are not aspirational. They are the operational rules encoded into Arcanea's
              multi-agent development system. Every agent that contributes to our codebase is configured to follow them.
              Every human reviewer enforces them. They are checked automatically by pre-commit hooks, CI pipelines, and
              quality gates that run on every push.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              The result is a codebase where AI agents and human developers contribute side by side at production
              quality. Not because the agents are perfect — they are not — but because the system of principles,
              guardrails, and feedback loops catches mistakes before they reach users and converts every correction into
              a permanent improvement.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              Agentic engineering is not about replacing human developers. It is about establishing the discipline that
              allows human judgment and machine speed to compound rather than conflict. The teams that master this
              discipline will build at a pace that was previously impossible. The teams that don't will drown in the
              technical debt that undisciplined AI generates.
            </p>

            <p className="my-4 text-text-secondary leading-relaxed">
              The Arcanean Code is how we build. It is open for anyone to adopt, adapt, and improve.
            </p>

            <blockquote className="border-l-4 border-brand-primary pl-4 my-8 italic text-text-secondary text-lg">
              The Arc turns: Potential becomes Manifestation becomes Experience becomes Dissolution becomes Evolved
              Potential. Every session leaves the codebase better than it was found.
            </blockquote>
          </div>
        </article>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <span className="text-sm text-text-muted flex items-center gap-2">
            <Icons.Tag />
            Tags:
          </span>
          {TAGS.map((tag) => (
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
          <Link
            href="/blog/chronicles-of-arcanea"
            className="group flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center group-hover:bg-brand-primary/20 transition-all">
              <Icons.ArrowLeft />
            </div>
            <div>
              <span className="text-xs text-text-muted block">Previous</span>
              <span className="text-sm font-medium group-hover:text-crystal transition-colors">
                Chronicles of Arcanea
              </span>
            </div>
          </Link>
          <div />
        </nav>
      </main>
    </div>
  );
}
