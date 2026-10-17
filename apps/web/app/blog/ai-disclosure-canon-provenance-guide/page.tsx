import { Metadata } from "next";
import Link from "next/link";

// ─── Metadata ──────────────────────────────────────────────────────────────────

const TITLE = "AI Disclosure & Canon Provenance Guide for Novelists and Game Developers";
const SUBTITLE = "Navigating Steam, Amazon KDP, and US Copyright Office compliance with cryptographic lineage and canon state.";
const DESCRIPTION = "The definitive guide for authors and game developers on declaring AI usage across Steam, KDP, and the Copyright Office, complete with a worked canon-state workflow.";
const SLUG = "ai-disclosure-canon-provenance-guide";
const DATE = "2026-04-18";
const AUTHOR = "FrankX";
const READ_TIME = "12 min read";
const ACCENT = "var(--arc-brand-atlantean-teal)";
const TAGS = [
  "ai-disclosure",
  "canon-provenance",
  "steam-compliance",
  "kdp-compliance",
  "copyright-office",
  "game-development",
  "novelists",
  "author-tools",
];

export const metadata: Metadata = {
  title: `${TITLE} | Arcanea Intelligence`,
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
        url: `https://arcanea.ai/og/${SLUG}.png`,
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
    images: [`https://arcanea.ai/og/${SLUG}.png`],
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
  ExternalLink: () => (
    <svg className="w-3.5 h-3.5 inline-block ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

// ─── Structured Data ───────────────────────────────────────────────────────────

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: TITLE,
  description: DESCRIPTION,
  author: { "@type": "Person", name: AUTHOR, url: "https://arcanea.ai" },
  publisher: { "@type": "Organization", name: "Arcanea", url: "https://arcanea.ai" },
  datePublished: DATE,
  dateModified: DATE,
  mainEntityOfPage: { "@type": "WebPage", "@id": `https://arcanea.ai/blog/${SLUG}` },
  keywords: TAGS.join(", "),
  articleSection: "Guides",
};

// ─── Platform Rule Interfaces ──────────────────────────────────────────────────

interface PlatformRule {
  platform: string;
  sourceTitle: string;
  sourceUrl: string;
  date: string;
  summary: string;
  keyRequirements: string[];
}

const PLATFORM_RULES: PlatformRule[] = [
  {
    platform: "Valve / Steam",
    sourceTitle: "Updated Policy on AI Content on Steam",
    sourceUrl: "https://store.steampowered.com/news/group/4145017/view/3862463747997849618",
    date: "January 9, 2024",
    summary: "Steam requires developers to submit an AI disclosure survey during app build configuration and divides AI usage into Pre-generated vs. Live-generated categories.",
    keyRequirements: [
      "Pre-generated AI: Disclose code, artwork, audio, or text generated using AI tools during development; promise non-infringement.",
      "Live-generated AI: Disclose real-time AI generation in-game, including guardrails against illegal or adult output.",
      "Steam Store Disclosure: Disclosures are published directly on your game's Steam store page for players to review.",
      "In-game Reporting: Live-generated AI games must include a player reporting overlay for problematic generated content.",
    ],
  },
  {
    platform: "Amazon KDP",
    sourceTitle: "KDP Content Guidelines: AI-Generated Content",
    sourceUrl: "https://kdp.amazon.com/en_US/help/topic/G200672390",
    date: "September 2023 (Updated 2024)",
    summary: "Amazon requires publishers to declare whether content published on KDP is AI-generated (text, images, or translations) vs AI-assisted during book submission.",
    keyRequirements: [
      "AI-Generated vs. AI-Assisted: Content created by an AI tool from prompts must be declared as AI-generated; human editing/refining determines AI-assisted status.",
      "Cover & Interior Visuals: Disclose any AI-generated artwork, icons, or illustrations included inside or on the book cover.",
      "Metadata Declaration: Declarations occur during title setup on KDP, recording prompt-based asset provenance.",
      "Non-Infringement & Accuracy: Publisher remains 100% legally liable for copyright compliance and accurate labeling.",
    ],
  },
  {
    platform: "US Copyright Office",
    sourceTitle: "Copyright Registration Guidance: Works Containing Material Generated by Artificial Intelligence (37 CFR Part 202)",
    sourceUrl: "https://www.copyright.gov/ai/",
    date: "March 16, 2023 (Updated 2024)",
    summary: "The US Copyright Office requires explicit disclaimers for un-human AI-generated elements in registration applications, protecting human creative selection and arrangement.",
    keyRequirements: [
      "Human Authorship Threshold: Only human creative contributions (prose, arrangements, character selection, manual edits) are copyrightable.",
      "Explicit Disclaimers: Applicants must exclude purely machine-generated text or images in the 'Limitation of Claim' section.",
      "Duty to Disclose: Failure to disclose known AI-generated content can invalidate a copyright registration certificate in court.",
      "Canon Lineage Evidence: Detailed prompt chains, revision histories, and author draft logs help prove human creative direction.",
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function AIDisclosureCanonProvenancePage() {
  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,rgba(0,188,212,0.15),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(156,39,176,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50 rounded-md p-1 min-h-[44px] min-w-[44px]"
          >
            <Icons.ArrowLeft />
            Back to Blog
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-mono px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300"
            >
              Guide
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300">
              Pillar Guide 2
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-3 text-white leading-tight">
            {TITLE}
          </h1>

          <p className="text-xl font-mono mb-4 text-teal-300/90">
            {SUBTITLE}
          </p>

          <p className="text-lg text-text-secondary mb-6 max-w-2xl leading-relaxed">
            {DESCRIPTION}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary border-y border-white/10 py-3">
            <span className="flex items-center gap-2"><Icons.User />{AUTHOR}</span>
            <span className="flex items-center gap-2"><Icons.Calendar />{formatDate(DATE)}</span>
            <span className="flex items-center gap-2"><Icons.Clock />{READ_TIME}</span>
          </div>
        </header>

        {/* Article Body */}
        <article className="liquid-glass rounded-2xl p-6 sm:p-10 mb-10 border border-white/10">
          <div className="prose prose-invert prose-lg max-w-none">

            {/* Section 1: The Regulatory Landscape */}
            <section aria-labelledby="section-landscape">
              <h2 id="section-landscape" className="text-2xl font-display font-bold mt-2 mb-4 text-white">
                1. The Regulatory Landscape for AI Creators
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                As novelists, game developers, and worldbuilders integrate AI agents into their creative pipelines, the platforms that distribute work — and the legal frameworks that protect it — have instituted strict rules around mandatory disclosure, non-infringement guarantees, and provenance tracking.
              </p>
              <p className="text-text-secondary leading-relaxed mb-6">
                Publishing an unverified AI manuscript on Amazon KDP or distributing a game with live LLM dialogue on Steam without explicit metadata now risks permanent store bans or legal vulnerability. Below are the official current positions of the three major governing bodies.
              </p>

              {/* Sourced Platform Rules Grid */}
              <div className="space-y-6 not-prose my-8">
                {PLATFORM_RULES.map((rule) => (
                  <div
                    key={rule.platform}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Icons.ShieldCheck />
                        <h3 className="text-lg font-display font-bold text-white">{rule.platform}</h3>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-teal-300">
                        Effective {rule.date}
                      </span>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed mb-4">
                      {rule.summary}
                    </p>

                    <div className="bg-black/30 rounded-lg p-4 border border-white/5 mb-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-text-muted block mb-2">Key Mandates:</span>
                      <ul className="space-y-2 text-xs text-text-secondary">
                        {rule.keyRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-teal-400 font-bold">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs">
                      <span className="text-text-muted">Official Source: </span>
                      <a
                        href={rule.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-300 hover:text-teal-200 underline inline-flex items-center focus:outline-none focus:ring-1 focus:ring-teal-400 rounded"
                      >
                        {rule.sourceTitle}
                        <Icons.ExternalLink />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 2: Why Prompt Hash Lineage Matters */}
            <section aria-labelledby="section-lineage">
              <h2 id="section-lineage" className="text-2xl font-display font-bold mt-8 mb-4 text-white">
                2. Why Cryptographic Lineage Beats Post-Hoc Declarations
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Most creators treat AI disclosures as an afterthought — filling out store surveys from memory months after a project is finished. This creates two critical failure modes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-6">
                <li><strong className="text-white">Over-declaration or Under-declaration:</strong> Inability to distinguish between human-authored canon, AI-assisted drafts, and raw model completions.</li>
                <li><strong className="text-white">Legal Unprotection:</strong> When registering copyright for a 100,000-word manuscript, the US Copyright Office requires you to disclaim non-human text. Without a commit log showing author revisions versus raw prompt outputs, you risk invalidating your entire claim.</li>
              </ul>
              <p className="text-text-secondary leading-relaxed">
                The solution is <strong>Canon Provenance</strong>: embedding cryptographic parent-child links (a Prompt DAG) directly into your book manifest (<code className="text-teal-300 font-mono text-sm">book.yaml</code>) or game manifest (<code className="text-teal-300 font-mono text-sm">game.manifest.json</code>).
              </p>
            </section>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 3: Worked Example */}
            <section aria-labelledby="section-worked-example">
              <h2 id="section-worked-example" className="text-2xl font-display font-bold mt-8 mb-4 text-white">
                3. Worked Example: The Canon-State Workflow
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Here is a step-by-step walk-through of a novelist and game developer using Arcanea&apos;s canon-state workflow to maintain continuous provenance from first draft to public platform submission.
              </p>

              {/* Step 1 */}
              <div className="my-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-lg font-display font-semibold text-teal-300 mb-2">
                  Step 1: Define the Locked Canon Foundation (<code className="font-mono text-sm text-white">CANON_LOCKED.md</code>)
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  Before launching AI agent swarms, declare human-authored lore and world laws in your project repository. All AI agents consult this file before generating text or assets.
                </p>
                <div className="bg-black/50 p-4 rounded-lg border border-white/5 font-mono text-xs text-text-secondary overflow-x-auto">
                  <pre>{`# CANON_LOCKED.md — Sovereign Depths World Laws
sha256: 8f3d10a62412e84bc910a34b22c19a28b4950e12
human_authorship: 100%

## Universal Invariants
1. The Glassroot Hunger is non-humanoid and colonial (marine bio inspiration).
2. Magic follows strict thermodynamic energy conservation (no free creation).`}</pre>
                </div>
              </div>

              {/* Step 2 */}
              <div className="my-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-lg font-display font-semibold text-teal-300 mb-2">
                  Step 2: Generate Drafts with Provenance Headers
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  When Arcanea authoring agents draft chapters or dialog trees, each artifact embeds a <code className="font-mono text-xs text-white">provenance</code> block tracking the parent prompt, model ID, and human contribution percentage.
                </p>
                <div className="bg-black/50 p-4 rounded-lg border border-white/5 font-mono text-xs text-text-secondary overflow-x-auto">
                  <pre>{`# book.yaml — Chapter 04 Manifest
title: "The Glassroot Vault"
slug: "ch04-glassroot-vault"

provenance:
  canon_ref: "CANON_LOCKED.md#8f3d10a"
  models_used: ["claude-3-7-sonnet", "qwen-3.6-plus"]
  human_contribution: 45%  # Structural direction, editing, final prose
  ai_contribution: 55%     # First-pass dialogue expansion, environment details
  prompt_dag_hash: "70251688563097605017c2dfcad33144711d"

ai_transparency:
  kdp_category: "AI-Assisted (Human Directed & Refined)"
  steam_category: "Pre-generated Text & Environmental Dialogue"
  copyright_disclaimer_required: true`}</pre>
                </div>
              </div>

              {/* Step 3 */}
              <div className="my-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-lg font-display font-semibold text-teal-300 mb-2">
                  Step 3: Generate Compliance Package for KDP & Steam
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  With the manifest complete, Arcanea automatically compiles exact, audit-ready submissions for Amazon KDP title setup, Steam Store survey fields, and US Copyright Office Form TX disclaimers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                  <div className="p-4 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <span className="font-mono text-amber-400 font-bold block mb-1">Amazon KDP Submission Data</span>
                    <p className="text-text-secondary mb-2">• <strong>Text:</strong> AI-Assisted (Extensive human editing & structural direction)</p>
                    <p className="text-text-secondary mb-2">• <strong>Images:</strong> AI-Generated (Cover line-art generated via Nano Banana 2, prompt logged)</p>
                    <p className="text-text-secondary">• <strong>Audit Hash:</strong> <code className="font-mono text-[10px] text-teal-300">sha256:c0f9e35432b...</code></p>
                  </div>

                  <div className="p-4 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <span className="font-mono text-cyan-400 font-bold block mb-1">Steam Store AI Survey Data</span>
                    <p className="text-text-secondary mb-2">• <strong>Pre-generated Content:</strong> Background lore codex & NPC dialogue trees</p>
                    <p className="text-text-secondary mb-2">• <strong>Live Generated:</strong> None (all narrative branching locked at compile time)</p>
                    <p className="text-text-secondary">• <strong>Non-infringement guarantee:</strong> Verified against <code className="font-mono text-[10px] text-teal-300">CANON_LOCKED.md</code></p>
                  </div>
                </div>
              </div>
            </section>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Section 4: Capture & Action */}
            <section aria-labelledby="section-capture" className="not-prose">
              <div className="relative rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-black to-purple-500/10 p-8 sm:p-10 text-center overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 mb-4">
                    <Icons.ShieldCheck />
                  </div>
                  <h2 id="section-capture" className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
                    Automate Canon Provenance for Your Next Release
                  </h2>
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
                    Stop guessing your AI disclosure percentages. Build your next novel or game inside Arcanea Studio and track prompt DAGs, manifest hashes, and platform compliance automatically.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                      href="/studio/author?utm_source=blog&utm_medium=guide&utm_campaign=ai-disclosure-canon-provenance"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-400 text-black font-semibold hover:bg-teal-300 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[44px] shadow-lg shadow-teal-500/20"
                    >
                      Open Studio Author
                      <Icons.ArrowRight />
                    </Link>
                    <Link
                      href="/claw?utm_source=blog&utm_medium=guide&utm_campaign=ai-disclosure-canon-provenance"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/40 min-h-[44px]"
                    >
                      Explore Claw Provenance Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </section>

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
              className="text-xs font-mono px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-text-secondary"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-white/10 pt-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-white/50 rounded p-1 min-h-[44px]"
          >
            <Icons.ArrowLeft />
            Back to Blog
          </Link>
          <Link
            href="/studio/author?utm_source=blog&utm_medium=guide&utm_campaign=ai-disclosure-canon-provenance"
            className="text-xs font-mono text-teal-300 hover:text-teal-200 underline focus:outline-none focus:ring-1 focus:ring-teal-400 rounded p-1"
          >
            Launch Provenance Workflow &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
