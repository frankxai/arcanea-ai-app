import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

// ─── Metadata ──────────────────────────────────────────────────────────────────

const TITLE = "Building the Open Library: How Arcanea Turns AI + Human Creativity into Published Books";
const SUBTITLE = "From Claude Code session to published book. The full pipeline.";
const DESCRIPTION =
  "A builder's journal: multi-agent writing, NB2 image generation, Git-native publishing, Guardian intelligence ratings, and AI transparency — the complete Arcanea publishing ecosystem.";
const SLUG = "arcanea-publishing";
const DATE = "2026-04-09";
const AUTHOR = "FrankX";
const READ_TIME = "14 min read";
const ACCENT = "#ef4444";
const TAGS = [
  "publishing",
  "ai-writing",
  "open-library",
  "author-tools",
  "guardian-ratings",
  "ai-transparency",
  "infogenius",
  "nano-banana",
];

export const metadata: Metadata = {
  title: `${TITLE} | Blog`,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    publishedTime: DATE,
    authors: [AUTHOR],
    url: `https://arcanea.ai/blog/${SLUG}`,
  },
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
  wordCount: 3500,
  articleSection: "Technology",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function Img({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="my-8 rounded-xl overflow-hidden border border-white/[0.06]">
      <Image src={src} alt={alt} width={1200} height={675} className="w-full h-auto" />
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl sm:text-3xl font-display font-bold text-white/90 mt-16 mb-6">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-white/60 leading-[1.8] mb-5">{children}</p>;
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-red-500/30 pl-5 my-8 text-white/50 italic leading-relaxed">
      {children}
    </blockquote>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="my-6 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/60 overflow-x-auto font-mono leading-relaxed">
      {children}
    </pre>
  );
}

function Badge({ children, color = "white" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-md bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 mr-2 mb-1`}>
      {children}
    </span>
  );
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function ArcaneaPublishingPage() {
  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url(/images/blog/publishing/10-ecosystem-overview.png)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/70 via-[#09090b]/85 to-[#09090b]" />

        <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-16">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors mb-10">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            All Articles
          </Link>

          <div className="flex flex-wrap gap-2 mb-6">
            {TAGS.slice(0, 5).map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400/70">
                {t}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white/95 leading-[1.15] mb-4">
            {TITLE}
          </h1>
          <p className="text-lg text-white/40 font-serif italic mb-8">{SUBTITLE}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/25">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {AUTHOR}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {formatDate(DATE)}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {READ_TIME}
            </span>
            <span className="text-red-400/40 border border-red-500/20 px-2 py-0.5 rounded text-[10px]">Internal Preview</span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-6 pb-32">

        <Img src="/images/blog/publishing/01-author-writing-ai.png" alt="Author writing with AI assistance" />

        <H2>1. The Vision</H2>

        <P>Publishing has a deployment problem.</P>

        <P>
          Code has CI/CD. Design has Figma-to-production pipelines. But books? Books still live in
          Word documents, emailed manuscript files, and six-month publisher queues. Even after AI
          made generating 10,000 words trivially fast, the gap between &quot;wrote something good&quot;
          and &quot;that good thing is on the web with proper attribution and a reading interface&quot;
          remained enormous.
        </P>

        <P>
          We kept running into it ourselves. A Claude Code session would end with 40,000 words of
          strong fiction. Then what? Paste into Notion? Zip the markdown files? The craft got done,
          but the publishing infrastructure didn&apos;t exist.
        </P>

        <P>
          So we built it. The Arcanea Publishing Ecosystem is a full-stack pipeline from first concept
          to published, readable book on arcanea.ai. It includes a multi-agent writing system, image
          generation for covers and character art, a Git-native publishing workflow with quality gates,
          AI transparency declarations, and a five-Guardian rating system.
        </P>

        <H2>2. How It Actually Works &mdash; The Forge of Ruin</H2>

        <P>
          The clearest way to explain the system is to walk through the project that stress-tested it.
          We wanted to write a dark fantasy novel. Not a sample. Not a proof of concept. A real one &mdash;
          complete chapters, a developed world, a bestiary, battle choreography. We wanted it in one session.
        </P>

        <Img src="/images/blog/publishing/02-publishing-pipeline.png" alt="Publishing pipeline visualization" />

        <P>
          <strong className="text-white/80">Concept phase (30 minutes):</strong> We defined the world,
          the central conflict, and the protagonist arc. A berserker named Erivar Skaldson whose rage
          is a parasitic entity bonded to his bloodline. Each time he surrenders to the Fury, he loses
          a piece of who he was.
        </P>

        <P>
          <strong className="text-white/80">Architecture sprint (90 minutes):</strong> We spawned a
          parallel agent swarm before writing a single scene. The Master Story Architect defined the
          structure &mdash; five acts, 28 scenes. The World Architect built the geography, the Holdfast,
          the Scarlands, the Deep Wild. The Character Psychologist constructed five hero journeys in
          parallel.
        </P>

        <P>
          <strong className="text-white/80">Parallel drafting:</strong> Four specialized Fiction Masters
          drafted chapters simultaneously. The 11-creature bestiary and 5 battle choreographies were
          generated in parallel, not sequentially.
        </P>

        <P>
          The output: <strong className="text-white/70">45,000+ words</strong>, 4 polished chapters,
          28 scenes outlined, 5 hero journeys, 11 monsters designed, 5 epic battles choreographed.
        </P>

        <Quote>
          &ldquo;The ritual began the way it always began. Erivar sat cross-legged on the stone,
          wrists resting on his knees, chains pooled in his lap like sleeping iron snakes.&rdquo;
        </Quote>

        <P>
          That opening came from the first Fiction Master. Unchanged from first draft. The constraint
          was simple: ground the mystical in the physical, start in action. The agent understood.
        </P>

        <Code>{`Session start → Story Architect defines 28-scene structure
             ↓
    ┌─────────────────────────────────────────┐
    │  Character Psychologist (5 hero arcs)   │
    │  World Architect (geography + magic)    │
    │  Fiction Master A (Ch.1 — Erivar)       │
    │  Fiction Master B (Ch.2 — Ashe)         │
    │  Fiction Master C (Ch.3 — Halla)        │
    │  Fiction Master D (Prologue — Odre)     │
    │  Bestiary Generator (11 creatures)      │
    │  Battle Choreographer (5 sequences)     │
    └─────────────────────────────────────────┘
             ↓
    Assembled manuscript → Published to /books/drafts/`}</Code>

        <P>Ten agents, running in parallel, producing a coherent manuscript. Total session time: under 8 hours.</P>

        <H2>3. The Visual Pipeline</H2>

        <P>
          A book without a cover is an orphan. We knew that from the start, and we couldn&apos;t rely
          on human designers for every title in what we&apos;re building &mdash; a community library
          with dozens or eventually hundreds of works.
        </P>

        <Img src="/images/blog/publishing/05-book-cover-gen.png" alt="Book cover generation pipeline" />

        <P>
          The image generation pipeline runs through <strong className="text-white/70">InfoGenius</strong>,
          our visual production system. For the Forge of Ruin cover, we tested three models side by side:
        </P>

        <div className="my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 pr-4 text-white/40 font-medium">Model</th>
                <th className="text-left py-3 pr-4 text-white/40 font-medium">Cost</th>
                <th className="text-left py-3 pr-4 text-white/40 font-medium">Speed</th>
                <th className="text-left py-3 text-white/40 font-medium">Verdict</th>
              </tr>
            </thead>
            <tbody className="text-white/50">
              <tr className="border-b border-white/[0.04]">
                <td className="py-3 pr-4">NB Pro</td>
                <td className="py-3 pr-4">$0.04</td>
                <td className="py-3 pr-4">~12s</td>
                <td className="py-3">Painterly, good quality</td>
              </tr>
              <tr className="border-b border-white/[0.04]">
                <td className="py-3 pr-4">NB (2.5 Flash)</td>
                <td className="py-3 pr-4">$0.02</td>
                <td className="py-3 pr-4">~7s</td>
                <td className="py-3">Sharper, bolder</td>
              </tr>
              <tr className="border-b border-white/[0.04]">
                <td className="py-3 pr-4 text-red-400/70 font-medium">NB2 (3.1 Flash)</td>
                <td className="py-3 pr-4 text-red-400/70">$0.02</td>
                <td className="py-3 pr-4">~13s</td>
                <td className="py-3 text-red-400/70 font-medium">Best: portrait ratio, typography, detail</td>
              </tr>
            </tbody>
          </table>
        </div>

        <P>
          NB2 won. It naturally chose portrait ratio for the book cover, the Mawfather face was more
          defined, the title typography was the most polished, and the ember veins on the arm matched
          exactly what we wrote in Chapter 1. Half the cost of NB Pro, better results.
        </P>

        <H2>4. The Publishing Architecture</H2>

        <P>Most AI content pipelines stop at generation. Ours starts there.</P>

        <Img src="/images/blog/publishing/08-multi-author.png" alt="Multi-author collaboration" />

        <P>The publishing infrastructure has three tiers:</P>

        <div className="my-6 space-y-3">
          {[
            { name: "Community", color: "emerald", desc: "Auto-merge after CI quality gate. No editorial review. Anyone can publish." },
            { name: "Featured", color: "amber", desc: "Editor-curated. Guardian Intelligence Ratings. First 3 chapters free, subscriber access for full book." },
            { name: "Canon", color: "red", desc: "Flagship content. Integrated into lore, referenced by MCP tools. Always free." },
          ].map((t) => (
            <div key={t.name} className={`flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-${t.color}-500/10`}>
              <span className={`text-${t.color}-400 font-display font-bold text-sm w-24 flex-shrink-0`}>{t.name}</span>
              <span className="text-white/50 text-sm">{t.desc}</span>
            </div>
          ))}
        </div>

        <P>
          The Git workflow: Author writes in Claude Code, commits to a branch, opens a PR. CI runs
          the quality gate &mdash; valid book.yaml manifest, anti-slop scan, AI metadata present,
          license set. Community works auto-merge on pass. Featured and Canon go through human review.
        </P>

        <Code>{`# book.yaml — every published work requires this
title: "The Forge of Ruin"
tier: featured
status: in-progress

authors:
  - name: Frank
    role: creator
  - name: Logan
    role: co-author

ai_transparency:
  models_used: [claude-opus-4-6]
  human_contribution: 30%
  ai_contribution: 70%
  method: "Human direction + AI prose, human curation"

license: CC-BY-NC-SA-4.0`}</Code>

        <H2>5. AI Transparency &mdash; Built In, Not Bolted On</H2>

        <Img src="/images/blog/publishing/07-ai-transparency.png" alt="AI transparency dashboard" />

        <P>
          Every book declares which models were used, the human/AI contribution split, and the method.
          This isn&apos;t optional &mdash; CI rejects works without it. The transparency requirement
          is not a checkbox. It&apos;s a contract with readers.
        </P>

        <P>
          The short reason: the US Copyright Office and EU AI Act both have evolving positions on
          AI-generated content disclosure. &quot;We disclosed everything clearly&quot; is a much better
          legal position than &quot;we weren&apos;t sure what to say.&quot;
        </P>

        <P>
          The longer reason: readers deserve to know what they&apos;re reading. We&apos;re not hiding
          the AI involvement or minimizing it. But we&apos;re also not pretending the human author
          isn&apos;t real. Frank wrote the Forge of Ruin the way a director makes a film &mdash;
          creative direction, structural decisions, character psychology, editorial judgment. The
          Fiction Masters wrote the sentences. Both things are true.
        </P>

        <H2>6. Guardian Intelligence Ratings</H2>

        <Img src="/images/blog/publishing/03-guardian-ratings.png" alt="Guardian ratings council" />

        <P>
          Five Guardians, each assessing one dimension of the work. Community votes give you
          popularity, not quality. Traditional editorial review doesn&apos;t scale. Our answer
          is a hybrid: expert AI scoring plus crowd wisdom.
        </P>

        <div className="my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 pr-4 text-white/40 font-medium">Guardian</th>
                <th className="text-left py-3 pr-4 text-white/40 font-medium">Dimension</th>
                <th className="text-left py-3 text-white/40 font-medium">What They Score</th>
              </tr>
            </thead>
            <tbody className="text-white/50">
              <tr className="border-b border-white/[0.04]"><td className="py-2 pr-4 text-cyan-400/70">Alera</td><td className="py-2 pr-4">Voice</td><td className="py-2">Authenticity, no AI slop, distinct characters</td></tr>
              <tr className="border-b border-white/[0.04]"><td className="py-2 pr-4 text-red-400/70">Draconia</td><td className="py-2 pr-4">Craft</td><td className="py-2">Structure, pacing, scene construction</td></tr>
              <tr className="border-b border-white/[0.04]"><td className="py-2 pr-4 text-purple-400/70">Lyria</td><td className="py-2 pr-4">Originality</td><td className="py-2">Fresh concepts, avoids tropes</td></tr>
              <tr className="border-b border-white/[0.04]"><td className="py-2 pr-4 text-emerald-400/70">Lyssandria</td><td className="py-2 pr-4">Depth</td><td className="py-2">Thematic weight, earned emotion</td></tr>
              <tr><td className="py-2 pr-4 text-amber-400/70">Maylinn</td><td className="py-2 pr-4">Resonance</td><td className="py-2">Reader impact, memorability</td></tr>
            </tbody>
          </table>
        </div>

        <P>
          Badges: <strong className="text-amber-400/70">Luminor Grade</strong> (8.0+),{" "}
          <strong className="text-white/60">Master Grade</strong> (6.0+),{" "}
          <strong className="text-white/40">Apprentice Grade</strong> (4.0+).
          Community star ratings layer on top. Both signals display in the reader.
        </P>

        <H2>7. The Complete Toolchain</H2>

        <Img src="/images/blog/publishing/04-character-forge.png" alt="Character visualization forge" />

        <div className="my-6 space-y-4">
          {[
            { label: "Writing", tools: "Claude Code + /arcanea-author (inception, write, revise, ultra modes)", icon: "pen" },
            { label: "Visualization", tools: "InfoGenius + NB2 (covers, characters, architecture, infographics)", icon: "image" },
            { label: "Characters", tools: "Character Psychologist agent + NFT Forge for PFP generation", icon: "users" },
            { label: "Reading", tools: "ChapterReader with 4 themes, font controls, progress, bookmarks", icon: "book" },
            { label: "Publishing", tools: "Git PR → CI quality gate → auto-deploy to arcanea.ai", icon: "upload" },
            { label: "Community", tools: "Star ratings, written reviews, reading progress, bookmarks", icon: "star" },
          ].map((item) => (
            <div key={item.label} className="flex gap-4 items-start">
              <span className="w-28 flex-shrink-0 text-xs font-display font-semibold text-red-400/60 uppercase tracking-wider pt-0.5">
                {item.label}
              </span>
              <span className="text-sm text-white/50">{item.tools}</span>
            </div>
          ))}
        </div>

        <Img src="/images/blog/publishing/09-nft-gallery.png" alt="NFT character gallery" />

        <H2>8. What&apos;s Next</H2>

        <Img src="/images/blog/publishing/06-community-library.png" alt="Community library visualization" />

        <P>
          What&apos;s working now: the writing pipeline, the visual pipeline, the Git workflow,
          the ChapterReader, the manifest format, and the AI transparency system. These are in
          production and have been used to produce real work.
        </P>

        <P>What&apos;s in progress:</P>

        <ul className="list-none space-y-2 my-4 text-white/50 text-sm">
          {[
            "Supabase migration for books, authors, ratings tables",
            "Guardian rating automation pipeline (currently semi-manual)",
            "Revenue: subscriber access for featured books, 70/30 author split",
            "Video generation for book trailers (Veo 3.1 is in the model list)",
            "The open invitation: anyone can write, anyone can publish",
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-red-400/40 flex-shrink-0">&#x2192;</span>
              {item}
            </li>
          ))}
        </ul>

        <P>
          The library has 17 collections and most of them are not full. The Bestiary of Creation
          has room for hundreds more creatures. The Atlas of Territories covers maybe a tenth of
          the world. We built the infrastructure. The stories are yours to write.
        </P>

        <Img src="/images/blog/publishing/10-ecosystem-overview.png" alt="Complete Arcanea ecosystem" />

        {/* AI Transparency Footer */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <p className="text-[10px] uppercase tracking-widest text-white/20 mb-3">AI Transparency</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/35">Claude Opus 4.6 (article)</span>
            <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/35">NB2 / Gemini 3.1 Flash Image (10 visuals)</span>
            <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/35">Human: direction + editorial</span>
            <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/35">AI: prose + images</span>
          </div>
          <p className="text-xs text-white/25 leading-relaxed">
            This article was written using the Arcanea Author System. All images generated
            with Nano Banana 2 (Gemini 3.1 Flash Image Preview). The publishing ecosystem
            described here is live at arcanea.ai.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex justify-between">
          <Link href="/blog" className="text-sm text-white/30 hover:text-white/50 transition-colors">
            &larr; All Articles
          </Link>
          <Link href="/books/drafts" className="text-sm text-red-400/60 hover:text-red-400 transition-colors">
            Read The Forge of Ruin &rarr;
          </Link>
        </div>
      </article>
    </div>
  );
}
