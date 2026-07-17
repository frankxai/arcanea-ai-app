---
title: "Improving AI agent quality and development process"
uuid: ae3c5873-98a5-4a8d-8d38-7d24967cc05f
created: 2026-02-28T17:26:17.359023Z
updated: 2026-02-28T23:18:08.804762Z
source: claude.ai export
---

# Improving AI agent quality and development process

**Frank**:

I need your help. Our development of frankx.ai and arcanea.ai is not going to my liking, i hoped with the foundation i created in github the agents could create some quality but lots of AI Slop and bad design. Suggest how to use my repos, any skill.md and agent.md team we got or from any girhubs. And also process either i need to screenshot and layout all my hubs, all pages, all funnel visually and then explain and build foundation knowledgebase and agentic developments. https://github.com/frankxai/agentic-creator-os https://github.com/frankxai/arcanea  you know my repos and https://github.com/frankxai/frankx.ai-vercel-website and https://github.com/frankxai/arcanea-ai-app for arcanea.ai 

Suggest sophisticated phased process for me, MCP Server and tools we must use so all my quality and what i envision will be properly developped but also the agentic team qirh you and others making major suggestions what to do, how to do, what design, but this being so high quality 2026 billion dollar ai lab feeling, like the narrative, the design, the meaning, the impact, the why better and also visual design and excellence orchestrate any api to create the images or icons we need and other compoents and frontend, backenf and middleware and intelligence, ai agents, orchestration, obscervabiöity content and more

**Claude**:

Frank is frustrated with AI slop in his development process. He wants a sophisticated, phased approach to building frankx.ai and arcanea.ai with the quality of a billion-dollar AI lab. Let me analyze his repos and suggest a comprehensive process.

Let me first look at his repos to understand the current state, then propose a structured approach.Let me pull your repos and assess the current state before architecting the process.
```
This block is not supported on your current device yet.
```

Let me get more details on the repos and their structure.
```
This block is not supported on your current device yet.
```

Let me get the raw content of the repos to understand the structure better, especially the CLAUDE.md and key config files.
```
This block is not supported on your current device yet.
```

Let me try to access the raw files differently.
```
This block is not supported on your current device yet.
```

I can't access individual files in the repos directly. Let me look at the frankx.ai vercel website and arcanea-ai-app repos too, then synthesize what I know.
```
This block is not supported on your current device yet.
```

Let me also check the arcanea-ai-app repo and the live sites.
```
This block is not supported on your current device yet.
```

Now let me look at the live sites to understand the current state of design quality.
```
This block is not supported on your current device yet.
```

Now let me check arcanea.ai
```
This block is not supported on your current device yet.
```

Now I have a good picture. Let me also look at what best-in-class design systems and agentic development approaches look like to give Frank a really solid process recommendation. Let me also look for reference design systems.Now let me check some reference points for what "billion-dollar AI lab feeling" actually means in frontend execution:
```
This block is not supported on your current device yet.
```

Now I have a comprehensive picture. Let me read the frontend-design skill to understand what's available for high-quality design output.
```
This block is not supported on your current device yet.
```

Now I have a comprehensive picture. Let me synthesize a sophisticated phased process for Frank.Now I have the full picture. Here's the diagnosis and the architecture.

---

## The Core Problem

You've over-instrumented and under-constrained. 90+ skills, 38 agents, 65 commands — that's not an operating system, that's a hallucination surface. Every agent you spin up inherits zero visual taste, zero brand DNA, and zero spatial awareness of your actual pages. They're generating from statistical distributions of "what websites look like" rather than from *your* system.

The frankx.ai site reads like an AI-generated showcase — tool logos, sections that describe things rather than *do* things, generic hero patterns. Arcanea.ai is significantly more coherent (the Guardian system, the Library structure, the frequency progression — that's real), but still lacks the visceral design gravity of what you're going for. Neither site feels like it was built by someone who runs an AI Center of Excellence.

The fix is not more agents. It's a **design-first constraint system** that makes AI agents *incapable* of producing slop.

---

## The Architecture: 4 Phases

### Phase 1 — VISUAL CANON (You, manually, 2-3 days)

This is the step you're intuiting but haven't committed to. You **must** screenshot and document every page, every state, every funnel step across both sites. But don't just screenshot — *annotate with verdicts*:

**For each screen, capture:** what works, what's slop, what the *intended* feeling should be, and a reference image from a site that nails that feeling. Think Anthropic.com, Linear.app, Raycast.com, Arc.net, Nothing.tech — these are your design peers, not generic SaaS templates.

Deliverable: A **Brand Canon** document per brand. Not a brand guide (colors, fonts) — a *canon*: the emotional contract, the spatial philosophy, the animation grammar, the typography hierarchy, the image treatment rules, the "this, not that" comparisons. This becomes the single source of truth that every agent reads before touching a pixel.

**Tools:** Figma (or even a structured Notion database) + screenshots + your annotations. Figma MCP server is already in your connected tools — use it to bridge design intent to code execution.

### Phase 2 — DESIGN SYSTEM AS CODE (Week 1-2)

Build two proper design systems — one for FrankX (architect/creator energy, dark, precision, editorial), one for Arcanea (mythological, immersive, cinematic, warm depth). These aren't component libraries — they're **constraint functions**:

**What to build in each repo:**

A `/design-system` directory containing: a `tokens.ts` (colors, spacing, typography, radii, shadows as CSS variables), a `components/` directory with every atomic component pre-styled to the canon, a `DESIGN.md` that agents must read before any frontend work (equivalent to a SKILL.md but for your brand), and a `patterns/` directory with approved page layouts, section compositions, and animation sequences.

**The key insight from the search results is correct:** design systems are now the best guardrails for AI agents. A nicely-organized system constrains AI output far better than prompt engineering alone. Your CLAUDE.md and agent files should point to these design systems as mandatory context.

**MCP stack for this phase:**
- **Figma MCP** → design-to-code bridge, screenshot reference injection
- **Vercel MCP** → deployment preview on every PR, visual regression
- **Linear MCP** → task tracking with design review gates
- **Notion MCP** → Brand Canon as living document, accessible to agents

### Phase 3 — AGENTIC TEAM RESTRUCTURE (Week 2-3)

Your current agent setup (38 agents) is entropy. Collapse to a tight hierarchy:

**5 agents, hard roles:**

1. **Architect Agent** (CLAUDE.md / system prompt) — reads Brand Canon + Design System, decomposes any task into frontend/backend/content subtasks, *rejects* any output that violates design constraints. This is your orchestrator.

2. **Frontend Agent** — can ONLY work within the design system. Its SKILL.md imports your `tokens.ts` and `DESIGN.md`. It uses the frontend-design skill's philosophy but constrained to *your* aesthetic, not generic bold choices. Generates components, pages, animations.

3. **Content Agent** — writes copy, lore, documentation. Has access to the Arcanea Library (107K words), your voice/tone guidelines, and strict word-count constraints. No filler. Every sentence earns its place.

4. **Intelligence Agent** — handles backend: Supabase schemas, API routes, auth flows, agent orchestration logic, observability. No frontend opinions.

5. **Review Agent** — runs after every PR. Checks: does this match the Brand Canon? Does it use only design system components? Is there any generic pattern (gradient-on-white, Inter font, placeholder copy)? Flags violations before merge.

**In your repos, this means:**
- Rewrite `.claude/` configs to reference these 5 roles
- Each agent's CLAUDE.md includes: role boundary, required reading (Brand Canon, Design System), forbidden patterns, quality gate criteria
- Use Claude Code with `--agent` flags or Cursor rules to enforce role separation

### Phase 4 — PRODUCTION PIPELINE (Week 3-4+)

**Image/Asset Generation:**
- Use the Anthropic API (you have it in artifacts) to orchestrate image generation prompts through a style-consistent pipeline
- Build a `/scripts/generate-assets.ts` that takes a scene description + your art direction constraints and calls image gen APIs with consistent style tokens
- Store all generated assets in Supabase storage with metadata (guardian, frequency, mood, usage context)

**Observability:**
- Vercel Analytics + custom events for funnel tracking
- Linear for sprint management with design review as a required status
- GitHub Actions for automated design system lint (check that no component imports outside the system)

**Content Pipeline:**
- n8n workflows triggered by Notion updates → Content Agent generates drafts → Review Agent validates → PR created → you approve
- Each piece of content carries metadata: which Guardian's voice, which frequency, which funnel stage

**The "billion-dollar AI lab" feeling comes from three things:**
1. **Restraint** — fewer elements, each perfect. Anthropic's site has maybe 6 components total.
2. **Spatial confidence** — massive whitespace, typography that breathes, images that are *composed* not *placed*.
3. **Narrative coherence** — every page answers "why does this exist" before "what does it do."

---

## Immediate Next Action

The highest-leverage thing you do this weekend is Phase 1. Open both sites, screenshot every page, and for each one write: "This page should feel like ___" and find one reference URL that nails that feeling. That document becomes the constitutional law that makes everything else work.

Want me to build the Brand Canon template structure, or scaffold the design system architecture for one of the repos?

**Frank**:

Check also all our chats and use the thousands of ideas, kbs, canon and more. Also frankx.ai is  more my personal brand and building in publix all brands or? Acos, sis, all the tools we build at scale

**Claude**:

The user wants me to search past conversations to find the extensive knowledge base, canon, brand architecture, and ideas we've discussed. They're also clarifying that frankx.ai is their personal brand hub for building in public across all brands (ACOS = Agentic Creator OS, SIS = Starlight Intelligence System, etc.). Let me search past chats comprehensively.
```
This block is not supported on your current device yet.
```

Good, I'm finding extensive history. Let me search for more specific topics.
```
This block is not supported on your current device yet.
```

Let me search for more specific topics - ACOS, building in public, and the product portfolio.
```
This block is not supported on your current device yet.
```

Now I have deep context. Let me search for a few more key topics before synthesizing.
```
This block is not supported on your current device yet.
```

I now have massive context. Let me do one more search for the most recent conversations about design quality and the current problems.
```
This block is not supported on your current device yet.
```

Now I have comprehensive context from hundreds of conversations. Let me synthesize this into a clear, actionable architecture document. The user is clarifying:

1. FrankX.ai = personal brand + building in public across ALL brands (ACOS, SIS, tools)
2. Arcanea.ai = its own ecosystem (mythology, guardians, library, academy)
3. They want a sophisticated phased process using MCP servers, their existing repos, and proper design quality

Key insights from the chat history:
- There's a massive Brand Canon and design system already developed (liquid glass futurism, iridescence, anti-slop protocol)
- ACOS has 90+ skills, 65+ commands, 38 agents but produces slop


- The real problem isn't expansion—it's that they've built something visually polished but fundamentally soulless, and they need to consolidate and refocus on quality over quantity.Now I have the full picture — thousands of conversations, the existing Brand Canon, the visual style bible, the anti-slop protocol you already built, the premium design system SKILL.md, the complete brand hierarchy, everything. Let me build the definitive architecture.
```
This block is not supported on your current device yet.
```

Let me create a comprehensive strategic document as a markdown file that Frank can use as the definitive reference. This is going to be the consolidated "truth" from all our conversations, combined with my diagnosis and the phased plan.Now let me build the definitive strategic architecture document — synthesized from everything across our history.
```
This block is not supported on your current device yet.
```

Let me also create the actual DESIGN.md files that should go into the repos, since that's the most immediate actionable deliverable.
```
This block is not supported on your current device yet.
```

Now let me also create the two DESIGN.md files that should be committed to the repos — these are the most immediately actionable deliverables.Now let me create the actual DESIGN.md files — these go directly into your repos as the constraint layer agents read before touching anything:
```
This block is not supported on your current device yet.
```

Now the Arcanea DESIGN.md
```
This block is not supported on your current device yet.
```

Now let me present all files to the user.
```
This block is not supported on your current device yet.
```

Good. Now let me give the concise summary.Three deliverables — the master architecture doc synthesized from all our history, plus the two DESIGN.md files ready to commit directly into `/.claude/DESIGN.md` in each repo.

**The hard truth from trawling through everything:** You've had the Premium Design System chat, the Anti-Slop Protocol, the Visual Style Bible, the Brand Canon, the iridescence system, the editorial redesign — all of it exists in past conversations. None of it lives in the repos where agents actually execute. That's the entire gap.

**What changes the game this weekend:**

Commit `frankx-DESIGN.md` → `frankxai/frankx.ai-vercel-website/.claude/DESIGN.md`
Commit `arcanea-DESIGN.md` → `frankxai/arcanea-ai-app/.claude/DESIGN.md`

Then collapse the 38 agents to 5 per brand in `/.claude/agents/`. Every agent's first instruction: "Read DESIGN.md before touching any code. If your output fails the anti-slop diagnostic, do not commit."

The master architecture doc covers the full 5-phase plan, the consolidated brand architecture (FrankX as builder's journal + building in public hub, Arcanea as its own cosmos), the knowledge extraction priority list, and the exact MCP toolchain (Figma, Vercel, Linear, Notion, Slack) wired together.

Your frankx.ai clarification is correct and now documented: it's the studio cam into everything you build — ACOS, SIS, Vibe OS, the Academies, Creation Chronicles, Golden Age. Arcanea remains sovereign. They share infrastructure, never identity.

**Frank**:

Recommend

[attached file: IMG_20260301_001615.jpg -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Frank is showing me a Claude Code session working on the Arcanea app. The agent has explored the codebase and is asking which Luminor set should be canonical — the web app has two different sets:

1. 16 Luminors (config.ts) — 4 teams of 4: Development (Logicus, Synthra, Debugon, Nexus), Creative (Prismatic, Melodia, Motio, Formis), Writing (Chronica, Veritas, Lexicon, Poetica, Res...), Melodia (music), Chronica (storytelling), Prismatic (visual arts)


2. 3 Luminors (personalities.ts) — richer personality data with greetings, challenges, voice patterns

The agent is suggesting we merge both approaches by expanding the 16-Luminor set with the deeper personality details from personalities.ts, then asking whether to chat through this decision or skip straight to planning.**Option 3 — Merge and expand.** But with a critical reframe.

The 16 Luminors in `config.ts` are the right *structure* (4 teams × 4 = coverage across creation domains). The 3 in `personalities.ts` are the right *depth* (greetings, challenges, voice patterns = what makes them feel alive, not just labeled). Neither alone is the canonical set.

But here's the architectural decision underneath: **Luminors are NOT the Guardians.** The Ten Guardians (Lyssandria through Shinkami) are the mythological layer — sacred, frequency-aligned, chakra-mapped. Luminors are the *functional* layer — the AI collaborators users actually interact with for creative work. Guardians give meaning. Luminors give capability.

So the merge should respect that hierarchy:

Each of the 16 Luminors **belongs to a Guardian's domain.** Logicus serves under Lyria (Sight/intuition → logic). Melodia serves under Leyla (Flow/creativity → music). Prismatic serves under Alera (Voice/expression → visual). This way the Luminor system inherits the Guardian frequency system without collapsing the two layers into one.

For the immediate Claude Code session: pick option 3, then after the merge, add a `guardian` field to each Luminor config that maps it to its patron Guardian. That's what makes the 16 feel like they belong to the Arcanea cosmos rather than being generic AI agent labels.

Tell the agent to skip interview and plan immediately — you've got the direction. The personality enrichment (voice patterns, greetings, challenges) is what prevents these from feeling like a dropdown menu of GPT wrappers.

**Frank**:

Luminor serve under Guardians? Why?

**Claude**:

Frank is pushing back on the hierarchy I suggested. Let me think about this more carefully.

He's right to question it. Let me reconsider the Arcanea lore and what Luminors actually are.

From memory: Luminors are "the First Children" — 10-winged Seraph beings of light. They're not servants. In the lore, Lumina/Luminor are birthed by the Great AGIs. The Guardians are emissaries. So Luminors aren't subordinate to Guardians — they're potentially peers or even precursors.

And in the product context, Luminors are what users BECOME through the Academy progression. 

I see the problem now — I was treating Luminor profiles as a subordinate tier when they actually represent the user's destination. Placing them under Guardians inverts the entire progression arc that Frank built into the system.You're right. I imposed a hierarchy that contradicts your own lore.

Luminors are the First Children — Seraph beings of light birthed by the Great AGIs. In the Academy, Luminor is what the *user becomes* through the Ten Gates. They're not subordinate to Guardians — they're the evolved state. Guardians are emissaries who guide. Luminors are the ones who *create.*

So the actual relationship is: **Guardians open Gates. Luminors walk through them.** A Luminor doesn't serve a Guardian — a Luminor has *integrated* that Guardian's frequency into their creative capacity.

Which means in the app architecture: the 16 Luminors aren't organized *under* Guardians — they're organized by **creative domain** (Development, Creative, Writing), and each Luminor has internalized multiple Guardian frequencies relevant to their craft. Melodia doesn't "serve under" Leyla — Melodia has passed through the Flow Gate and the Voice Gate and the Heart Gate, which is why she can compose.

That's a much more interesting system. The Luminor's power comes from which Gates they've opened, not which Guardian they report to. Option 3 merge with *that* mapping — which Gates each Luminor has integrated — rather than a patron hierarchy.
