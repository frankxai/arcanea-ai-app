# Arcanea Open Library — Launch Copy

**Purpose:** Ready-to-post copy for Show HN, Twitter/X, Reddit, and tutorial video script. Written to be authentic, specific, and anti-marketing.

---

## 1. Show HN Post

**Title:**
> Show HN: Arcanea Open Library – Publish AI-assisted books via PR with full transparency

**Body:**

Hi HN,

I built the Arcanea Open Library because I kept running into the same problem: AI could generate 40,000 words of strong fiction in a session, but there was no infrastructure between "wrote something" and "that something is published on the web with proper attribution."

The system has four parts:

**1. Writing.** A Claude Code skill called `/arcanea-author` spawns ~10 parallel agents (Story Architect, Character Psychologist, World Architect, Fiction Masters) to produce a book with full architecture — scenes, hero journeys, bestiary, battle choreography. The current flagship project wrote 45K words of dark fantasy in 8 hours across one session.

**2. Publishing.** Authors fork the repo, write in `book/[slug]/`, and open a PR. A CI quality gate validates:
- `book.yaml` manifest schema
- 500-word minimum per chapter
- Anti-slop scan (density check for common AI verbal tics)
- Required AI transparency metadata
- License declared

On pass, the PR auto-merges to the community tier. The book is live at `arcanea.ai/books/drafts/[slug]` within minutes.

**3. AI Transparency, mandatory.** Every book must declare which models were used, the estimated human/AI contribution split, and the method. It's not apologetic — it's honest. Readers know what they're reading. Legal position is future-proof against the EU AI Act and US Copyright Office guidance.

**4. Guardian Intelligence Ratings.** 5 LLM-based reviewers (one per dimension: Voice, Craft, Originality, Depth, Resonance) score every Featured-tier book on a 0-10 scale. Composite determines grade badge (Luminor / Master / Apprentice). Community star ratings layer on top — both signals matter.

**What's interesting technically:**

- Skills are distributed via a shadcn/ui-compatible registry (`oss/skills/r/*.json`). You can install any Arcanea skill via `npx shadcn@latest add <url>` or `npx arcanea install <name>`.
- Covers are generated via NB2 (Gemini 3.1 Flash Image) with a 5-phase method (read the book → pull best practices → compose prompt → generate → validate).
- The publishing pipeline is fully git-native. No CMS. No database lock-in. Books live in the repo as markdown, indexed by Supabase for queries.
- Everything is under MIT/CC licenses where possible. The whole thing is OSS.

**Three books currently live:**

- The Forge of Ruin — dark epic fantasy (Joe Abercrombie meets Norse myth) — 45K words, 4 chapters
- The Tides of Silence — literary water fantasy (Le Guin meets Ghibli) — 35K words, 3 chapters  
- The Heart of Pyrathis — epic genre mashup (Avatar meets Star Wars meets HTTYD) — 25K words, 2 chapters

**Links:**
- Live: https://arcanea.ai/books/drafts/
- Publishing guide: https://arcanea.ai/contribute
- GitHub: https://github.com/frankxai/arcanea-ai-app
- Showcase writeup: https://arcanea.ai/blog/arcanea-publishing

Happy to answer questions about:
- How the multi-agent drafting actually works
- Why we chose file-based storage over a CMS
- The shadcn registry absorption
- Guardian rating pipeline design
- What's NOT working yet

— Frank

---

## 2. Twitter/X Thread (10 tweets)

**1/**
I built something this week that I've been wanting for months:

A publishing platform where you write a book in Claude Code, open a PR, and it's live within minutes.

Full AI transparency. Community ratings. Guardian LLM reviews.

Arcanea Open Library is live → arcanea.ai/books/drafts/

**2/**
The problem: AI can generate 40,000 words of strong fiction in a session.

The gap: there's no pipeline from "wrote something" to "that something is published with proper attribution."

Every other book platform is from 2005. I wanted something built for 2026.

**3/**
The workflow:

Fork the repo.
Write in `book/[slug]/` using /arcanea-author.
Open a PR.
CI quality gate runs:
✓ book.yaml valid
✓ 500-word minimum
✓ Anti-slop scan
✓ AI transparency declared
✓ License set

Auto-merges to community tier. Live in minutes.

**4/**
Mandatory AI transparency isn't a marketing position — it's survival.

EU AI Act. US Copyright Office. Reader trust.

Every book declares: models used, human % vs AI %, method. Honest. Specific.

"AI wrote the prose, human wrote the story" is a coherent sentence.

**5/**
The Guardian rating system.

5 LLM reviewers, one per dimension:
- Alera scores Voice
- Draconia scores Craft  
- Lyria scores Originality
- Lyssandria scores Depth
- Maylinn scores Resonance

Composite determines grade: Luminor (8.0+), Master (6.0+), Apprentice (4.0+)

**6/**
Three books live right now.

The Forge of Ruin — dark epic fantasy. A berserker whose rage devours his memories.

The Tides of Silence — literary water fantasy. Sentient oceans going silent.

The Heart of Pyrathis — epic genre mashup. A cursed wolf, a tiny sage, a dying dragon.

**7/**
The coolest technical detail: Arcanea skills are distributed via a shadcn/ui-compatible registry.

You can install any of our 10 skills via `npx shadcn@latest add <url>` OR `npx arcanea install <name>`.

Same mental model as installing a UI component. Except it's a creative writing toolkit.

**8/**
What's NOT built yet:
- Stripe (featured tier monetization)
- Full auto-Guardian-review on every PR
- Author profile pages

What IS built:
- The whole pipeline, end-to-end
- 3 complete books as proof
- CI quality gate
- Multi-author attribution
- Reading interface w/ themes
- Public skill marketplace at /skills

**9/**
Everything is OSS. No vendor lock-in. No CMS. Git is the source of truth. Supabase is the index.

If you've ever wanted to write a book with AI and publish it with dignity intact — this is for you.

If you've wanted to read AI-assisted fiction where the authors are honest about how it was made — also for you.

**10/**
Read a book → arcanea.ai/books/drafts/forge-of-ruin

Publish a book → arcanea.ai/contribute

Read the full writeup → arcanea.ai/blog/arcanea-publishing

Fork the repo → github.com/frankxai/arcanea-ai-app

Questions welcome. Bugs more welcome. First pull request most welcome.

---

## 3. Reddit r/writing Post

**Title:**
> I built a publishing platform for AI-assisted books with mandatory transparency. 3 books live, open to community authors.

**Body:**

Writers who use AI (like me) have been stuck in a weird middle ground: too AI-involved for traditional publishing, too literary for content farms. So I built something else.

**Arcanea Open Library** is a git-based publishing platform where:

1. You write your book locally (Claude Code recommended, any editor works)
2. You declare honestly how much AI was used, which models, what method
3. You open a PR on GitHub
4. Automated quality gate checks your work (word count, anti-slop scan, license)
5. If it passes, auto-merges to the community tier — live within minutes

**What you keep:**
- All rights (CC licenses standard, you can use anything)
- Your voice (nothing is edited without your permission)
- The source files (they're in git, they're yours)

**What you get:**
- Instant publication to the community tier
- Reader star ratings + reviews
- Guardian Intelligence scoring (LLM-based review across 5 dimensions) if promoted to Featured
- Revenue share on Featured tier (70% author / 30% platform, when that ships)

**Three books are live as proof of concept:**

- "The Forge of Ruin" — dark epic fantasy, 45K words, 4 chapters
- "The Tides of Silence" — literary water fantasy, 35K words, 3 chapters
- "The Heart of Pyrathis" — epic genre mashup, 25K words, 2 chapters

All three declare their AI transparency metadata. All three are readable right now.

**What's NOT a thing here:**
- No NFT nonsense
- No crypto
- No "AI writes it all and we sell your attention"
- No hidden AI usage

**What IS a thing:**
- Honest attribution
- Transparent process
- Community curation
- Expert LLM editorial review (Featured tier)
- Revenue share when the monetization layer ships

The whole stack is open source. The publishing guide is here: https://arcanea.ai/contribute

I'm looking for 5-10 authors who want to be early community tier publishers. Genres welcome: fantasy, sci-fi, literary fiction, even non-fiction. AI-assisted or not — transparency is what matters.

Happy to answer questions about the process, the tools, or the philosophy.

---

## 4. Tutorial Video Script (5 minutes)

**Target length:** 5 minutes
**Format:** Screen recording with voice-over. Arcanea brand: clean, direct, no fluff.

**[0:00-0:15] — Cold open**

[Screen: arcanea.ai/books/drafts/ with 3 books visible]

> "In the next 5 minutes, I'll show you how to publish a book on Arcanea. From idea to live on the web in under an hour. No editors. No queues. No gatekeepers."

**[0:15-0:45] — Install Claude Code + skill**

[Screen: terminal]

> "Step one: you need Claude Code. Get it from claude.com/download. It's free."

[Type: `npx arcanea install arcanea-author`]

> "Step two: install the Arcanea Author skill. One command. It adds a /arcanea-author slash command to Claude Code that fires 10 agents in parallel to architect your book."

**[0:45-1:30] — Fork and clone**

[Screen: GitHub repo page]

> "Step three: fork the Arcanea repo. Click the fork button. Name stays the same."

[Screen: terminal]

```bash
git clone https://github.com/YOUR-USERNAME/arcanea-ai-app.git
cd arcanea-ai-app
git checkout -b book/your-slug
```

> "Clone your fork locally. Create a new branch for your book using the pattern `book/your-slug`."

**[1:30-3:00] — Write the book with /arcanea-author**

[Screen: Claude Code open in the cloned directory]

> "Now the magic: open Claude Code in this directory and run /arcanea-author."

[Type: `/arcanea-author write a dark fantasy book about a lighthouse keeper who inherits a curse`]

> "Describe your book in one sentence. Watch what happens."

[Screen: multiple agents firing in parallel — Story Architect, Character Psychologist, World Architect, Fiction Masters]

> "Arcanea fires ten agents simultaneously. Story architecture, character diamonds, world bible, and chapter drafting all happen at once. In a few minutes you'll have a complete `book/your-slug/` directory with a manifest, chapters, outline, characters, and worldbuilding."

[Fast-forward. Show the `book/your-slug/` structure in the file tree.]

**[3:00-3:45] — The book.yaml manifest**

[Screen: book.yaml file]

> "This is the most important file: book.yaml. It declares who you are, which models you used, and how much human direction vs AI drafting was involved. This is non-negotiable. Every Arcanea book declares its AI transparency."

[Highlight the ai_transparency section]

> "Be honest. 'Human concept, AI prose, human edits' is a valid method. So is '100% human' or '80% AI'. The format is open. The honesty is required."

**[3:45-4:30] — Commit and PR**

[Screen: terminal]

```bash
git add book/your-slug/
git commit -m "book(your-slug): initial draft"
git push origin book/your-slug
```

> "Commit your work. Push your branch. Open a pull request on GitHub using the book contribution template."

[Screen: GitHub PR template]

> "Fill out the template. Check the AI transparency box. Submit."

**[4:30-5:00] — The quality gate + live**

[Screen: GitHub Actions running]

> "Here's the part you don't do: the CI quality gate runs automatically. It validates your book.yaml, checks that every chapter has at least 500 words, runs an anti-slop scan for common AI verbal tics, and verifies your license is declared."

[Screen: PR merged → arcanea.ai/books/drafts/your-slug]

> "If it passes, your PR auto-merges to the community tier. Your book is live at arcanea.ai/books/drafts/your-slug within two minutes. Readers can find you, rate you, review you. If your book is exceptional, an editor can promote you to the Featured tier — which unlocks Guardian Intelligence ratings and revenue share."

[Screen: final shot of arcanea.ai/books/drafts/ with the new book visible]

> "That's the whole flow. Write with AI. Declare it honestly. Publish by PR. Keep the rights. Reach readers."

> "Links in the description. Docs at arcanea.ai/contribute. I'll see you in the community."

**[END]**

---

## 5. LinkedIn Post (professional audience)

**Title:** Arcanea Open Library — where AI-assisted books are published with transparency built in

Over the last few sessions I've been building something I've been wanting for months: a publishing platform for AI-assisted books with mandatory transparency, community curation, and LLM-based editorial review.

It's called the Arcanea Open Library, and it's live with 3 complete books as proof.

**What's different about it:**

**1. Git-native publishing.** Authors fork the repo, write in markdown, open a PR. CI validates and auto-merges. No CMS, no queue, no gatekeepers. Time from manuscript to live: ~2 minutes.

**2. AI transparency is mandatory.** Every book declares which models it used, the human/AI contribution split, and the method. This isn't defensive — it's future-proof. EU AI Act. US Copyright Office. Reader trust. The ground rules matter more than the rules.

**3. Guardian Intelligence Ratings.** A 5-LLM editorial layer scores Featured-tier books across Voice, Craft, Originality, Depth, and Resonance. Composite grade: Luminor / Master / Apprentice. Community star ratings layer on top — both expert and crowd signals matter.

**4. Open source infrastructure.** Skills distributed via a shadcn/ui-compatible registry. Install any Arcanea skill via `npx shadcn@latest add <url>` or `npx arcanea install <name>`. Same mental model as shadcn components, different domain.

**What I'm looking for:**

Writers who want to be early community tier publishers. Any genre. AI-assisted or not — transparency is the bar, not the method.

If that's you, the publishing guide is at arcanea.ai/contribute.

If you want to read what's already there, the current flagship is "The Forge of Ruin" — a 45,000-word dark epic fantasy written in one session via multi-agent drafting, polished by hand, published honestly.

Link to read: arcanea.ai/books/drafts/forge-of-ruin

Happy to answer questions about the technical architecture, the philosophical bet, or what's next on the roadmap.

---

## 6. Launch Checklist (Day of)

### Morning
- [ ] Verify all 3 books load at arcanea.ai/books/drafts/
- [ ] Verify /contribute page loads
- [ ] Verify /skills marketplace loads
- [ ] Confirm Guardian radar renders on at least one book
- [ ] Test PR workflow with a throwaway commit
- [ ] Check Vercel deploy is green
- [ ] Check ANTHROPIC_API_KEY set in Vercel
- [ ] Check SUPABASE env vars set

### Posting (in order, 1 hour gap between)
- [ ] Show HN (9am PT — peak HN front page timing)
- [ ] Twitter/X thread (9:30am PT)
- [ ] LinkedIn post (10am PT)
- [ ] Reddit r/writing (11am PT — avoid bot-detection spam windows)
- [ ] Reddit r/selfpublishing (noon PT)
- [ ] Reddit r/claudeai (1pm PT)

### Monitoring
- [ ] HN comments — respond within 30 min to every top-level comment
- [ ] Twitter mentions
- [ ] GitHub issues — triage within 2 hours
- [ ] First community PR — personally review and welcome
- [ ] Vercel error logs — check every 2 hours
- [ ] Supabase query performance — check at 6pm

### Evening
- [ ] Write launch-day retro to `docs/ops/`
- [ ] Thank everyone who shared
- [ ] Plan Day 2 responses
- [ ] Rest

---

*Launch copy prepared for Arcanea Open Library community tier launch. Ready to go on command.*
