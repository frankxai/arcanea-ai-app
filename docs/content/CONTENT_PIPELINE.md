# Arcanea Content Pipeline — How We Scale Content Through Development

> The product IS the marketing. The dev process IS the content pipeline.

## The Pipeline: Dev → Showcase → Blog → Social → AEO

```
┌─────────────────────────────────────────────────────────┐
│  1. BUILD FEATURE                                       │
│     /arcanea-dev → code → commit → push → deploy        │
│                                                         │
│  2. CAPTURE OUTPUT                                      │
│     /arcanea-showcase demo → fire MCP tools → save JSON  │
│                                                         │
│  3. GENERATE CONTENT                                    │
│     /arcanea-showcase content social → thread + LinkedIn │
│     /arcanea-showcase content blog → SEO post            │
│     /arcanea-showcase update → refresh showcase page     │
│                                                         │
│  4. PUBLISH                                             │
│     Blog post → /blog/{slug}/page.tsx                   │
│     Changelog → /changelog (human) + AGENT_CHANGELOG    │
│     Social → docs/content/social/ → post manually       │
│     AEO → llms.txt + llms-full.txt auto-update          │
│                                                         │
│  5. FEEDBACK LOOP                                       │
│     Analytics → what content performs → build more of it │
└─────────────────────────────────────────────────────────┘
```

## Content Types Generated Per Feature

| Type | Audience | Format | Location |
|------|----------|--------|----------|
| **Showcase card** | Humans + Agents | Live demo with real output | /showcase |
| **Changelog entry** | Humans | Narrative, benefit-focused | /changelog |
| **Agent changelog** | AI crawlers | File paths, schemas, breaking changes | docs/ops/AGENT_CHANGELOG_*.md |
| **Blog post** | SEO + humans | Full article with structured data | /blog/{slug} |
| **Twitter thread** | Social growth | 6-8 tweets with demos | docs/content/social/ |
| **LinkedIn post** | Professional | Business-focused | docs/content/social/ |
| **llms.txt update** | AI crawlers | Tool schemas, API refs | /llms.txt, /llms-full.txt |
| **Demo JSON** | Programmatic | Structured MCP outputs | docs/content/demos/ |

## Skills Used at Each Stage

### Stage 1: Build
- `/arcanea-dev` — Full dev team activation
- `/arcanea-build` — Build verification
- `/arcanea-deploy` — Deploy workflow

### Stage 2: Capture
- `/arcanea-showcase demo` — Fire MCP tools, capture outputs
- `/arcanea-showcase demo full-session` — Character + location + creature + quest + artifact + magic

### Stage 3: Generate
- `/arcanea-showcase content social` — Twitter thread + LinkedIn
- `/arcanea-showcase content blog` — Full blog post
- `/arcanea-showcase batch 5` — 5 complete demo sessions

### Stage 4: Publish
- `/arcanea-showcase update` — Refresh showcase page data
- Manual: post social, commit blog, push

### Stage 5: Analyze
- `/ao status` — Check deploy state
- Vercel analytics — page views, engagement
- PostHog (when configured) — user behavior

## Dual Audience Strategy

### For Humans (Creators)
- **Show output, not tools** — "Look what we created" not "We have 42 tools"
- **Tell stories** — Pyrlyn the rebel strategist, not JSON schemas
- **Visual** — Cards, demos, galleries
- **Benefit-focused** — "Connected worlds from one prompt"

### For Agents (AI Crawlers, Developer Tools)
- **Structured data** — JSON-LD, llms.txt, tool schemas
- **Machine-readable** — Agent changelog with exact file paths
- **API-first** — REST bridge docs, curl examples
- **Discoverable** — robots.txt allowing GPTBot, Anthropic-ai, PerplexityBot

## Replication: How Anyone Can Use This Pipeline

This pipeline is generalizable to ANY AI-powered platform:

1. **Build a feature** that generates interesting output
2. **Capture the output** as structured data (JSON)
3. **Create a showcase page** with real outputs, not mockups
4. **Write llms.txt** describing what your platform does for AI crawlers
5. **Generate social content** from the same data
6. **Dual changelog** — human narrative + agent-readable technical

The key insight: **your product's outputs ARE your marketing content**.
Every MCP tool call is a potential tweet. Every world generated is a blog post.
Every quest created is a showcase card.

## Skill Commands Reference

```
/arcanea-showcase demo              → Full session (all tool types)
/arcanea-showcase demo character    → Single character gen + capture
/arcanea-showcase content social    → Twitter + LinkedIn from latest demos
/arcanea-showcase content blog      → Full blog post from demos
/arcanea-showcase batch 5           → 5 complete sessions at scale
/arcanea-showcase update            → Refresh showcase page
/arcanea-showcase capture page      → Screenshot via Playwright
```
