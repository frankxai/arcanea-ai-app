---
title: "Centralizing project management across repos and development cycles"
uuid: 2f9446e0-4211-45ba-9cf8-94d32f66a3fb
created: 2026-02-24T01:21:28.642862Z
updated: 2026-02-24T18:25:29.956022Z
source: claude.ai export
---

# Centralizing project management across repos and development cycles

**Frank**:

do we have an index of all my github repos and development plans? can we create visually
    roadmap milestones and goals for each? maybe on frankx.ai somewhere or some other approach you recommend?
    And I think we want both right but also have acos plugins and how we manage all my projects, sprint plans, milestones, full list of all our repos and what
   we do how its connected? setup tooling like notion, github projects, Linear necessary? or can we do in this repo or on our
  site? suggest something genius and also that claude code from any site can update it for us. But also accessible on any device
   - sometimes I feel I need for all i want whiteboard maybe tldraw,but at same time just Notion style editor and subpage system
   enough but then when can I just all on website or what for what to have all repos indexed current action plan from you our
  github repo and update my visual MAP for what I do across all repos ll github orgs and current priorities and development
  cycles or so? or how to think about manage all this design, websites, githubs, systems , frameworks, local and repos and
  claude code plugins, marketplaces, npm, then design boilerplate i want to sell and other products we want to sell and our
  multiple multi-agents multi-swarm orchestration


Consider we had this convo couple times pull from all chats insights but also now this

**Claude**:

Let me search past conversations for relevant context about Frank's GitHub repos, development plans, and project management discussions.
```
This block is not supported on your current device yet.
```

Good, I have relevant context. Now let me search for more recent context about Claude Code, MCP, and the specific repos.
```
This block is not supported on your current device yet.
```

Good context. Now I have enough to give Frank a sharp, architecture-level answer. Let me synthesize this.

The core question is: how to have a living, visual, cross-device system that:
1. Indexes all GitHub repos across orgs
2. Has visual roadmap/milestones per repo/brand
3. Is accessible on any device
4. Can be updated by Claude Code from any site
5. Has whiteboard capability (tldraw) + Notion-style editor
6. Tracks sprints, milestones, ACOs plugins
7. Manages multi-agent/swarm orchestration context
8. Covers design boilerplates, npm packages, marketplaces


9. 
The real insight is that he needs an MDX-powered ops dashboard on frankx.ai that pulls directly from GitHub APIs and renders live—this gives him the single source of truth he's looking for while staying flexible enough for Claude Code to update from anywhere, without being locked into Linear or ClickUp. The key is to keep each tool focused on its strength—Linear for task tracking, Notion for knowledge, GitHub for code—and use MCPs to let Claude Code read and write across all three seamlessly, collapsing the fragmentation into a unified interface.Here's the architectural truth and the genius move, synthesized from all our past work on this.

**The problem you're describing is an information architecture problem, not a tooling problem.** You keep cycling between tools because there's no single authoritative schema for your projects — everything lives in Claude's context or partially in scattered repos. The fix is one `frankx-os` manifest repo as the nervous system, then every tool is a renderer of it.

---

## The Architecture: `frankx-os` as Source of Truth

```
frankx-os/
├── projects/
│   ├── arcanea.yaml          # brand, repos, status, milestones, agents
│   ├── frankx-ai.yaml
│   ├── starlight.yaml
│   ├── ai-music-academy.yaml
│   └── ai-architect-academy.yaml
├── repos/
│   ├── index.yaml            # all repos across all orgs, tagged, linked
│   └── orgs.yaml             # frankxai, arcanea-labs, etc.
├── sprints/
│   └── 2026-Q1.yaml          # current sprint, priorities, owners
├── products/
│   ├── npm-packages.yaml
│   ├── design-boilerplates.yaml
│   └── marketplaces.yaml
└── agents/
    └── swarms.yaml           # multi-agent orchestration topology
```

Claude Code, from **any machine, any Claude session**, can read and write to this repo. This is the update mechanism — not a dashboard, not a webhook, just `git commit`. Everything downstream re-renders from it.

---

## Three-Layer Stack (each layer has a job)

**Layer 1 — Live Visual Map: `/map` on frankx.ai**
Build a React Flow (or tldraw) canvas that reads `frankx-os` YAML at runtime via GitHub API. Nodes = repos/brands, edges = dependencies, color = status. This is your always-up-to-date constellation view. Deployed on Vercel, accessible on any device. tldraw is great for freeform whiteboarding but too manual to stay current — React Flow renders from data, which is what you actually need.

**Layer 2 — Sprint & Issue Tracking: Linear**
Linear has the best MCP in the space. Claude Code can create/update issues, move cycles, tag milestones without ever leaving the terminal. It's dev-native, syncs to GitHub, and the UI on mobile is genuinely usable. You configure `frankx-os` to auto-generate Linear projects from the YAML on push via a GitHub Action. One Linear team per brand, one project per major initiative.

**Layer 3 — Knowledge & Wiki: Notion** (you already have it, has MCP)
Notion handles the long-form: specs, lore docs, brand guidelines, ACO plugin documentation, multi-agent architecture writeups. Subpages per brand. Not for task tracking — only for content that needs prose and hierarchy.

---

## Claude Code MCP Config (the glue)

```json
{
  "mcpServers": {
    "github": { ... },       // read/write frankx-os + all repos
    "linear": { ... },       // sprint management
    "notion": { ... },       // docs
    "n8n": { ... }           // trigger automation workflows
  }
}
```

Any Claude Code session anywhere — local, SSH, cloud IDE — has full context on all repos, all sprints, all docs. This is your "update from any site" requirement fulfilled without a custom CMS.

---

## The `/map` Page on frankx.ai

This is the most valuable thing to build first. A `frankx.ai/map` route that:
- Fetches `frankx-os/repos/index.yaml` from GitHub API (no auth needed if public, or use a read-only token)
- Renders an interactive node graph: brands → repos → status → milestones
- Has a filter rail: by brand, by status (active/paused/shipped), by type (product/infra/content)
- Links each node to the Linear project + GitHub repo + Notion doc
- Updates on every commit to `frankx-os` via Vercel's edge cache invalidation

This is the single pane you open on any device to orient yourself. The whiteboard impulse is answered here because it's *generated* from data rather than manually drawn — which means it stays true.

---

## What to do in the next 48 hours

1. Create `frankx-os` repo under `frankxai` org, private
2. Write `repos/index.yaml` manually for your 10-15 most active repos (Claude Code can scaffold this from your GitHub org in one session)
3. Build the `/map` route on frankx.ai (React Flow + GitHub API, 2-3 hours)
4. Configure Linear with one team per brand, wire GitHub Actions to sync from `frankx-os`
5. Set MCP config on your machines once — then every Claude Code session is fully wired

The rest — npm packages, design boilerplates, multi-agent swarm docs — gets a YAML file each and a Notion subpage. Nothing needs a new tool.

Want me to generate the `frankx-os` YAML schemas and the `/map` React component now?

**Frank**:

We have so many repos more and subprojects can you map this out and index for me and build? https://github.com/frankxai?tab=repositories

**Claude**:

Let me fetch the GitHub repos page to get the full list.
```
This block is not supported on your current device yet.
```

78 repos, page 1 shows 30. Let me get page 2 as well.
```
This block is not supported on your current device yet.
```

Let me try fetching page 2 differently or just work with the 30 repos I have. I have the data from page 1 (30 repos) and 78 total. Let me now read the skill for frontend design and build the visual map as an artifact.

Actually, let me first read the frontend-design skill since I'm building a visual interactive map.
```
This block is not supported on your current device yet.
```

Now I have the page 1 data (30 repos) from the 78 total repos. Let me build a comprehensive interactive visual map of the repos and their connections. I'll build this as a React artifact since it needs to be interactive and could potentially be embedded in frankx.ai.

Here's what I have from page 1:
1. arcanea - Living intelligence for AI-native creation (HTML, updated Feb 24)
2. arcanea-ai-app - Creative intelligence infrastructure (TypeScript, Feb 24)
3. claude-arcanea - Bridge between Claude and Arcanea, npm package (JS, Feb 23)


4. acos-intelligence-system - ACOS v10 Autonomous Creative Operating System (JS, Feb 23)
5. knowledge-work-plugins - Fork of anthropics/knowledge-work-plugins (Python, Feb 23)
6. agentic-creator-os - Agentic Creator OS v10 with 75+ skills, 35+ commands, and 38 agents (Python, Feb 23)
7. frankx.ai-vercel-website - Personal site (TypeScript, Feb 23)
8. openclaw-acos-skills-railway-template - Fork with OpenClaw and ACOS skills (JS, Feb 23)
9. arcanea-vault - Chrome extension for exporting AI conversations (TypeScript, Feb 23)
10. oh-my-arcanea - Fork of oh-my-opencode (TypeScript, Feb 22)
11. arcanea-code - Fork of an opencode coding agent (TypeScript, Feb 22)
12. arcanea-onchain - Blockchain work spanning Solana NFTs, Base L2, ElizaOS, and Story Protocol (TypeScript, Feb 17)
13. arcanea-infogenius - MCP server that generates infographics using Gemini (JS, Feb 17)
14. Starlight-Intelligence-System - Five-layer cognitive architecture with seven agents and six memory vaults (TypeScript, Feb 17)
15. claude-code-music-production - Music production project (Feb 16)
16. ai-architect-academy - Enterprise-focused initiative (TypeScript, Feb 16)
17. arcanea-intelligence-os - Mythology-infused agentic orchestration system (TypeScript, Feb 14)
18. frankxai - Personal profile repository (Feb 13)
19. mcp-doctor - Tool for diagnosing and managing Claude Code MCP servers (TypeScript, Feb 8)
20. agentic-creator-skills - Fork of Anthropic's skills repository (Python, Feb 6)
21. claude-code-oracle-skills - Oracle-specific skills, since moved (Python, Feb 5)
22. arcanea-ecosystem - Master coordination repository using git submodules (Shell, Feb 5)
23. gemini-arcanea - Multi-model AI orchestration platform (TypeScript, Feb 5)
24. infogenius - Infographic generation tool (TypeScript, Feb 5)
25. codex-arcanea - Code indexing and management system (continuing through the repository list)

I've got 30 repos from the first page, with about 48 more across subsequent pages that I can't access. I'll work with what I have and create a React component that visualizes these repositories organized by their thematic clusters and brands, showing the relationships between them. ARCANEA** (Core): arcanea, arcanea-ai-app, arcanea-intelligence-os, arcanea-ecosystem
- **ARCANEA Tools**: arcanea-vault, arcanea-infogenius, arcanea-onchain, arcanea-mobile
- **ARCANEA Dev Tools**: arcanea-code, arcanea-opencode, oh-my-arcanea, codex-arcanea, gemini-arcanea
- **ACOS / Creator OS**: agentic-creator-os, acos-intelligence-system, agentic-creator-skills, openclaw-acos-skills-railway-template
- **Starlight / AI Infra**: Starlight-Intelligence-System, claude-arcanea, ai-ops
- **Claude / MCP**: knowledge-work-plugins, claude-code, oracle-skills, mcp-doctor, claude-code-music-production
- **Brands/Sites**: frankx.ai-vercel-website, ai-architect-academy, frankxai (profile)
- **Forks/Reference**: oci-open-webui, grok-imagine-favorites-manager

Now I'm building an interactive SVG visualization that organizes these repositories into cluster zones with clickable nodes, status indicators, and connection lines between related projects, plus a detail panel for exploration.78 repos, 30 visible on page 1. Building the full map now with what's scraped — I'll structure it so Claude Code can complete the index from the remaining pages.
```
This block is not supported on your current device yet.
```

Now building the visual map:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Here's what you have:

**Map component** — interactive constellation with 30 indexed repos across 7 clusters, filterable by cluster/status/search, click-to-inspect with dependency edges, priority-coded node sizes. Drop this as `frankx.ai/map`.

**Index YAML** — canonical `frankx-os/repos/index.yaml` with cluster taxonomy, status, priorities, and edge relationships. This is your source of truth.

**What's still needed — 48 more repos on pages 2+.** The fastest way to complete the index:

```bash
# Run this in Claude Code (one command, full inventory)
gh repo list frankxai --limit 100 --json name,description,url,updatedAt,primaryLanguage,isPrivate,isArchived,isTemplate | jq '.' > frankx-os-full-crawl.json

# Then hand it to Claude Code: "update frankx-os index from this JSON"
```

That single command + one Claude Code session will complete the map and get you to all 78.

**Three decisions before we go further:**

The map right now renders from hardcoded data. For it to be live on frankx.ai and auto-update from commits, you need either (a) GitHub API calls at render time with a read-only PAT stored as a Vercel env var, or (b) a GitHub Action that regenerates a static `map-data.json` on every push to `frankx-os`. Option (b) is cleaner — zero auth complexity at runtime, works on CDN edge, and Claude Code can trigger it.

Which do you want to resolve first: completing the 78-repo crawl, wiring the map to frankx.ai, or setting up `frankx-os` as the actual repo with the GitHub Action?

**Frank**:

Great. Excellent. Yeah. Some of the coding agent also already started with the map. And I think if it will be essential you lost the store in memory. I can be fully aware all of the GitHub repositories, all the links And even when I'm mobile or We can other environment that you can reference this properly. Hello. And then something that I considered if we I think there's something. Get some action or, like, a sink. This can always run. Which we can, Now all of the repository is always updated. As well as the action plans always within 1 GitHub repository specifically Let me do it. For Yeah. Of course, specifically this. Right? We're specifically for project planning that we have one central GitHub repo for that. Doesn't make sense. And, yeah, what is then the visual Connection. This is only live on our website. We need yeah. I'm getting a project to work. Notion or something else to visualize this properly and for you to use, yeah, and help me in the best possible way. Showing all of the goals, the milestones step by step, or linear. It was also a good good app for this. Right? Right. And then what I considered I'm currently taking massive action of building, design even form, which can help to execute better. On the design vision that I have, Something else that I wanted to configure. Is that we create automation agents. That we have a process We are probably is an ideal orchestrator for this. Since we can configure cloud code nodes there specifically And then interconnect this and build up so we could Create something can run every single day. Right, where we should have, like, a council I have dedicated development teams Oh, yeah. Each of the agents wants that you can define within AIC, the agentic creator OS. Which helps to automatically do research for me to update the website, create a blog articles, update the change log that we have create a content, and then a stream all their work to me via Slack with the MCP server, and for all of this to don't incur API costs. Would only run within the coding agents itself. Right? Maybe that's a good idea. Good. We can, of course, also have notes in the loop that can have API calls Where we can use free open router models. That are currently also quite quite good with GLM 5. Trinity large. And mini mux. 2.5. And I recently yesterday, I set up an NNM Hello, which can pick up skills from any GitHub repository. So maybe this is also something where NAM, agent workflow can utilize our skill. Properly in their we could also build, like, a central MCP repository if you think this is the best possible way because currently, I don't have anything automated with an event. We have everything move slash commands, everything within clawed code. And my local repositories and the GitHub sync. We have 2 repo We have 2 mo mobiles that I always use on the go for like, in the speech notes and stuff like this. But, yeah, I think, like, this whole content pipeline is also still missing. That is an interconnected, like, me doing a voice note that gets then processed into a podcast or doing a video office for YouTube. We have built the foundation, but not fully executed. To test it, Yep. And at the same time, Why there's, like, so many things already on the website and many arrows, many things that need to be refined, language improved, to ensure, yeah, also the public presence that we have. Stop now. And from there, To have some Sort of 2. So then it's not easily changed by the agents anymore. Since we Yeah. We just needed What to work here? With excellence. But, yeah, I need to get off your Strategic recommendation. What is the one thing that will make everything else easier. There's, like, multiple repos, multiple ideas that has multiple projects we are running it. Developing at the same time. And I think, like, this foundation work and the automation might be something that is essential. For us to scale this properly And ensure quality checks. I'm sure things logs. I'm sure Yeah. Test and excellence. Continuously for all that we are building. Right? So I did your recommendation. Okay. We get there and how we combine this with our map. I feel the agents too. Read and write Updated. And all the interconnected north what each other is doing. But the same stuff still be distinctive. Right? Because we shouldn't be mixing too much of the different brands with each others. They can reference the Yep. They are evolving as the only persistence, the own products that we are building up. And then also the difference between what design between 5 level up and I think content that will not man and then actually execution and what can be public, what needs to live private, Yeah. So really think hard about this. Make it well thought out and put a proposal plan

**Claude**:

Frank is asking for a strategic recommendation and architectural proposal that covers:

1. Central GitHub repo for project planning (frankx-os)
2. GitHub Actions for auto-sync/always-updated state
3. Visual project management (Notion/Linear)
4. Automated agent council in n8n - daily operations, research, content, changelog, Slack streaming
5. Free models (OpenRouter: GLM, Mistral, Qwen) to avoid API costs
6. n8n agent workflows using skills from GitHub repos
7. Central MCP repository
8. Content pipeline: voice note → podcast/video
9. Website refinement with quality locks
10. Map that agents can read/write


11. Brand separation
12. Public vs private distinction

The core insight is that Frank's real bottleneck isn't the tools or agents themselves—it's the lack of a shared, machine-readable state that everything can reference and update. With 78 repos scattered across multiple brands and no persistent source of truth, every operation requires manual coordination. If I solve for that one constraint—a central frankx-os repo that acts as the single source of truth, backed by GitHub Actions as the automation backbone—everything else becomes possible: the agent council can operate autonomously, the content pipeline flows without friction, and quality gates enforce consistency across brands.

Now I'm structuring this as a formal proposal document that makes the architectural case clear and actionable.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Memory is full. Let me just proceed with the main task - creating the architectural proposal document.Memory is at capacity — I'll capture the architecture in the deliverable itself so Claude Code can always reference it from the repo. Let me build the proposal.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

The full proposal is there. Here's the compressed version of what it says:

**The one thing that makes everything else easier: the daily heartbeat GitHub Action in `frankx-os`.**

Every problem you named — agents not knowing what each other is doing, no persistent context for Claude, stale map, no content pipeline, manual coordination — has the same root: no machine-readable source of truth that runs automatically. The heartbeat fixes that. Once it exists, everything else is just a renderer or a subscriber.

The architecture collapses to: frankx-os owns truth → heartbeat syncs it daily → five outputs flow out (Slack briefing, map-data.json, Linear sync, n8n agent triggers, quality report). You approve or reject via Slack buttons. Agents never touch `main` on any brand site without your click.

On brand separation: each brand gets a YAML file and an isolated n8n agent lane. They can reference shared infrastructure (Starlight, ACOS) but never each other's voice, copy, or audience context. Quality lock means staging branch only — agents are always proposing, never publishing.

On costs: Research Scout, Changelog Writer, and Sprint Watcher all run on free OpenRouter models (GLM-4-Flash, Qwen 2.5). Claude Code handles execution locally. The only paid calls are things you deliberately escalate.

The execution sequence in the proposal is ordered by dependency — don't skip to voice pipeline before the heartbeat is running. The heartbeat is the unlock. Everything else is 20-minute sessions.

Which do you want to build first in Claude Code: the frankx-os repo scaffold, or the full 78-repo crawl to complete the index?
