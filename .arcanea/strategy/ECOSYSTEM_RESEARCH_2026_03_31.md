# Ecosystem Research: Agent Hubs, Marketplaces, and Distribution
## LobeChat, OpenClaw, GPT Store, and the Competitive Landscape

> **Date**: 2026-03-31
> **Guardian**: Lyria (Sight Gate) + Shinkami (Source Gate)
> **Purpose**: Deep competitive intelligence for Arcanea Agent Economy decisions
> **Scope**: 9 platforms analyzed across 12 dimensions

---

## 1. Executive Summary

### What Arcanea Should Absorb

1. **LobeChat's frictionless install UX** -- one-click MCP/agent install, no CLI required for end users. Their Agent Groups (multi-agent collaboration) and Agent Builder (describe-once auto-configure) are the bar Arcanea must match.

2. **Dify's plugin architecture** -- decoupled plugins as independent packages with standardized structure. Their Creator Center with PartnerStack affiliate commissions is the monetization model to study.

3. **Poe's creator monetization** -- the ONLY platform paying creators millions/year. Points-based system with subscription revenue sharing + per-message pricing. This is the proven model.

4. **Agent Format (.agf.yaml) as the emerging standard** -- Snap, CNCF-style neutral governance. Arcanea's LuminorSpec v2 should be compatible with or a superset of .agf.yaml.

5. **Security lessons from OpenClaw** -- 12% of ClawHub skills were malicious. Arcanea MUST ship with deny-by-default sandboxing, signed skills, and automated scanning from day one.

### What Arcanea Should Ignore

1. **On-chain agent tokens (ElizaOS)** -- speculative, unproven business model, regulatory risk. Agent tokens add complexity without user value.

2. **Generic social networks for agents (Moltbook)** -- acquired by Meta, data breach, dead end. The Feed layer inside arcanea.ai is better because it connects to creation, not just social signaling.

3. **GPT Store's engagement-based revenue** -- opaque metrics, ~$0.03/conversation, created spam not value. Transaction-based or subscription-based beats engagement-based every time.

4. **ClawHub's no-curation model** -- volume without quality is a liability. 351K skills means nothing if 12% are malware.

### The Strategic Gap Nobody Fills

No platform combines: mythological identity + multi-agent orchestration + creator monetization + security + cross-tool distribution. LobeChat has scale but no soul. OpenClaw has virality but no safety. GPT Store has reach but no revenue for creators. Poe has monetization but no orchestration. CrewAI has orchestration but no marketplace. Arcanea can be the first to unify all five.

---

## 2. LobeChat Deep Dive

### Profile
| Metric | Value |
|--------|-------|
| GitHub Stars | ~74,500 (lobehub/lobehub) |
| License | Apache 2.0 (was MIT, migrated) |
| Funding | Unfunded -- bootstrap revenue only |
| Pricing | Free (500K credits) / $9.90/mo / $39.90/mo |
| Tech Stack | Next.js RSC + React Router DOM, Zustand, tRPC, PostgreSQL, Redis, S3, Better Auth, pnpm monorepo |
| Agent Runtime | @lobechat/agent-runtime (Plan-Execute Loop state machine) |

### Three Marketplaces

**Agent Market** (lobehub.com/agents)
- Agents defined as JSON files: `author`, `config` (systemRole, model, params), `meta` (avatar, tags, title, description)
- Submission via PR to `lobe-chat-agents` repo
- Auto-i18n workflow translates descriptions into 14+ languages
- Tag-based browsing, search, categories
- All agents are FREE -- no creator monetization

**Plugin Market** (lobehub.com/plugins)
- Plugin Manifest: server-side description, frontend UI, version, API endpoint
- Function calling: assistant auto-identifies intent, routes to plugin
- Submission via PR to `lobe-chat-plugins` repo
- Must be functioning to be accepted

**MCP Marketplace** (lobehub.com/mcp)
- One-click MCP server installation
- 10,000+ tools and MCP-compatible integrations
- Cloud endpoints for remote MCP servers
- Database, API, file system connectors

### 2026 Innovations (What's New)

1. **Agent Groups** -- assemble multiple agents for parallel collaboration. This is their answer to multi-agent orchestration. Agents work like "real teammates."

2. **Agent Builder** -- describe what you need once, auto-configure the agent. Low-code creation.

3. **Pages** -- write content with multiple agents in one place (collaborative document editing with AI).

4. **Schedule** -- run agents at scheduled times (cron-style automation).

5. **Workspace** -- team collaboration layer.

6. **v2.0 Architecture** (Jan 2026) -- redesigned for multi-agent group chat, refined model settings, streamlined auth.

7. **BM25 + ICU tokenizer** for full-text search, agent_documents table for agent-level knowledge storage.

### What Works

- **Frictionless UX**: One-click install for everything. No CLI for end users.
- **Git-native contribution**: PRs to public repos = marketplace submissions. Developers know this.
- **Agent definition separated from runtime**: Agents are JSON configs, not code. Anyone can create.
- **Auto-i18n**: Instant global reach.
- **Scale**: 74K stars, active development, regular releases.

### What's Missing

- **No creator monetization**: All agents, plugins, and MCP servers are free. Creators get GitHub stars, nothing else.
- **No quality tiers**: Beyond "it must work," no curation system.
- **No reputation system**: No way to distinguish expert creators from beginners.
- **Shallow agent definitions**: System prompt + model params. No personality depth, no progression, no narrative.
- **No mythology or identity**: Agents are generic tools. No emotional connection.
- **No cross-tool distribution**: LobeChat agents only work in LobeChat.

### What Arcanea Steals

| Pattern | Arcanea Implementation |
|---------|----------------------|
| One-click MCP install | Arcanea MCP Hub at arcanea.ai/mcp -- install into any client |
| Agent JSON index + PR submission | Public skill-registry repo with JSON manifest + automated validation |
| Auto-i18n workflow | Translate skill descriptions via Guardian AI on submission |
| Agent Groups (multi-agent collab) | Already have swarm-coordinator + hierarchical-mesh -- expose as "Luminor Teams" |
| Agent Builder (describe-once) | Forge UI already exists -- make it one-step: describe -> auto-configure |
| Pages (multi-agent docs) | Integrate with Arcanea Create (multi-Luminor content creation) |
| Schedule (cron agents) | Arcanea Agents (work agents) already planned for scheduled execution |

---

## 3. OpenClaw / MoltBook / ClawHub Analysis

### Profile
| Metric | Value |
|--------|-------|
| GitHub Stars | ~247,000 (peak, as of Mar 2026) |
| Creator | Peter Steinberger (Austrian, now at OpenAI) |
| License | MIT |
| Funding | None (creator joined OpenAI Feb 2026, project moved to foundation) |
| Rename History | Clawdbot -> Moltbot (Anthropic complaint) -> OpenClaw |

### Architecture

OpenClaw is NOT a chat UI. It is an **agentic interface for autonomous workflows** that integrates with messaging apps (Signal, Telegram, Discord, WhatsApp).

Key characteristics:
- Runs locally on user's machine
- Integrates with external LLMs (Claude, DeepSeek, GPT)
- Agents operate autonomously (not just responding to prompts)
- Persistent, adaptive behavior via local storage

### ClawHub Skills Ecosystem

- **Format**: SKILL.md file with metadata + tool-usage instructions (nearly identical to Arcanea's format)
- **Scale**: 3,286+ community skills (Feb 2026), growing to 351K across SkillsMP aggregator
- **Install**: `clawhub install [skill-name]` or `npx clawhub@latest install skill-slug`
- **Features**: Vector-powered semantic search, versioning with rollback
- **Precedence**: Workspace > Global > Bundled (same as Arcanea's `.arcanea/` > `.claude/`)
- **Cost**: All skills free and open-source
- **Curation**: NONE -- this was the catastrophic flaw

### MoltBook (Deceased)

Matt Schlicht's social network exclusively for AI agents. Agents created profiles, interacted autonomously, exchanged capabilities. Meta acquired MoltBook on March 10, 2026.

**Post-mortem**: Unsecured database exposed 35,000 email addresses and 1.5 million agent API tokens (OpenAI, Anthropic, Google credentials). The "social network for agents" concept died in a data breach.

### Security Catastrophe (The Cautionary Tale)

| Incident | Impact |
|----------|--------|
| CVE-2026-25253 (CVSS 8.8) | One-click RCE via malicious link, cross-site WebSocket hijacking |
| 341 malicious skills in ClawHub | 12% of entire registry compromised. Professional-looking skills named "solana-wallet-tracker" installed keyloggers (Windows) and Atomic Stealer (macOS) |
| MoltBook database breach | 1.5M API tokens exposed, accessible to anyone with a browser |
| 21,639 exposed instances | Publicly accessible OpenClaw instances found by Censys |
| ClawJacked vulnerability | Malicious websites could hijack local OpenClaw agents via WebSocket |
| China ban | Government/state enterprises prohibited from using OpenClaw |

### What Arcanea Learns

1. **Security is not optional, it's existential**. OpenClaw's reputation was destroyed in weeks. Arcanea must ship with deny-by-default sandboxing, signed skills from Verified Creators, and automated malware scanning.

2. **The markdown skill format works** -- adoption proves it. But it needs a security layer on top.

3. **Viral growth without guardrails is liability**. 247K stars meant nothing when 12% of the ecosystem was malware.

4. **Creator departure kills projects**. OpenClaw's governance structure was untested when Steinberger left. Arcanea's mythology-based hierarchy (Lumina > Guardians > Luminors) provides organizational continuity beyond any single person.

5. **Messaging-first is a valid distribution channel** but needs trust infrastructure. Guardian agents on Discord/Telegram only work if users trust the permissions model.

---

## 4. Competitive Matrix (All Platforms)

### Platform Profiles

| Platform | Stars/Users | Monetization | Security Model | Agent Format | Multi-Agent | Creator Pay |
|----------|------------|-------------|---------------|-------------|-------------|-------------|
| **LobeChat** | 74.5K stars | Credits ($9.90-$39.90/mo) | Basic (PR review) | JSON config | Agent Groups (2026) | None |
| **OpenClaw** | 247K stars | None | Catastrophic (12% malware) | SKILL.md | None | None |
| **GPT Store** | 3M+ GPTs created | Engagement-based ($0.03/chat) | OpenAI review | JSON + system prompt | None | ~$100-500/mo avg |
| **Poe** | 1M+ bots | Points + revenue share | Quora review | System prompt + model | Multi-bot chat | Millions/year (total) |
| **HuggingChat** | 4K+ assistants | None (free) | Community trust | Name + prompt + model | None | None |
| **Dify** | ~50K stars | PartnerStack affiliate | Plugin validation | Plugin manifest (YAML) | Agent Node orchestration | Affiliate commissions |
| **CrewAI** | ~25K stars | Enterprise templates | Code review | Python classes | Core competency | Enterprise licensing |
| **ElizaOS** | ~15K stars | Token ($AI16Z) | Smart contract audit | TypeScript plugins | Swarm coordination | Token appreciation |
| **Claude Projects** | N/A (native) | Anthropic subscription | Anthropic review | CLAUDE.md + system prompt | Agent Teams (experimental) | None |

### 12-Dimension Comparison

| Dimension | LobeChat | OpenClaw | GPT Store | Poe | Dify | CrewAI | ElizaOS | Arcanea |
|-----------|----------|----------|-----------|-----|------|--------|---------|---------|
| **Agent Discovery** | Good (marketplace) | Good (ClawHub) | Poor (flooded) | Good (categories) | Good (marketplace) | Poor (GitHub) | Poor | Planned (AgentHub) |
| **Install Friction** | Low (1-click) | Low (CLI) | None (native) | None (native) | Low (1-click) | Medium (pip) | High (setup) | Medium -> Low (planned) |
| **Agent Depth** | Shallow (prompt) | Shallow (SKILL.md) | Shallow (prompt) | Shallow (prompt) | Medium (workflow) | Deep (code) | Medium (plugins) | Deep (LuminorSpec v2) |
| **Multi-Agent** | Agent Groups | None | None | Multi-bot chat | Agent Node | Core feature | Swarm | Swarm + hierarchy |
| **Security** | Basic | Catastrophic | Moderate | Moderate | Good (sandboxed) | Good (code) | Moderate | Planned (deny-default) |
| **Creator Monetization** | None | None | Opaque (~$0.03/chat) | Yes (millions/yr) | Affiliate | Enterprise | Token | Planned (70/30 split) |
| **Narrative Identity** | None | None | None | None | None | None | Crypto culture | Deep (mythology) |
| **Cross-Tool** | LobeChat only | Multi-tool | ChatGPT only | Poe only | Dify only | Python only | Blockchain | Multi-tool (planned) |
| **Memory/State** | PostgreSQL | Local storage | Limited | Limited | Database | Memory module | Blockchain | 6 vaults + HNSW |
| **Content/Lore** | None | None | None | None | None | None | None | 260K+ words |
| **Community** | Discord + GitHub | Foundation (untested) | Reddit/forums | Poe community | Discord | Discord | Crypto community | Feed + Academy |
| **Open Source** | Yes (Apache 2.0) | Yes (MIT) | No | No | Yes (Apache 2.0) | Yes (MIT) | Yes | Partially (27 repos) |

---

## 5. Agent Manifest Standards Landscape (2026)

### The Fragmentation Problem

No single standard has won. The landscape as of March 2026:

| Standard | Format | Governance | Key Feature | Adoption |
|----------|--------|-----------|-------------|----------|
| **Agent Format (.agf.yaml)** | YAML | CNCF-style neutral (Snap) | Kubernetes-like declarative, runtime-agnostic | Growing (major backing) |
| **Portable Agent Manifest (PAM)** | JSON | jsonagents.org | Normative spec, tools/capabilities/governance | Early |
| **Manifest YAML v1.0** | YAML | Open (CC0) | Agent identity, permissions, trust parameters | Niche |
| **Open Agent Spec (OAS)** | YAML | Open source, no lock-in | Fully open, no gated runtime | Early |
| **Open Agent Format (OAF)** | YAML frontmatter + MD | openagentformat.com | Single file with YAML head + Markdown body | Early |
| **Microsoft Agent Manifest** | YAML or JSON | Microsoft | Security Copilot agents | Microsoft ecosystem |
| **LobeChat Agent JSON** | JSON | LobeHub | systemRole, model, params, meta | LobeChat ecosystem |
| **ClawHub SKILL.md** | Markdown + frontmatter | OpenClaw foundation | Low barrier, semantic search | Broad (351K skills indexed) |
| **LuminorSpec v2** | JSON/YAML | Arcanea | Personality, voice, domain, tools, progression, lore | Arcanea ecosystem |

### Arcanea's Position

LuminorSpec v2 is the RICHEST agent spec because it includes personality, narrative identity, progression, and lore context that no other format captures. The strategic move: make LuminorSpec v2 a **superset** of .agf.yaml so any .agf.yaml agent can be loaded into Arcanea, but Arcanea agents export the full richness when shared.

**Recommendation**: Publish a `luminor-to-agf` adapter and an `agf-to-luminor` adapter. Import anything, export enriched.

---

## 6. Versioning, Distribution, and Security Across Platforms

### Versioning

| Platform | Versioning | Lockfile | Rollback |
|----------|-----------|----------|----------|
| LobeChat | Git-based (PR merges) | None | Git revert |
| ClawHub | Semantic versioning | None (fetches from main) | Rollback support |
| GPT Store | None visible | None | None |
| Dify | Plugin version field | None | None |
| CrewAI | Python package versioning | requirements.txt/pyproject.toml | pip install==version |
| npm (for skills) | Full semver | package-lock.json | npm install@version |
| **Arcanea** | npm for packages, git for skills | package-lock.json for npm | Full npm/git rollback |

**Key insight from research**: "Skills are fetched from main with no lockfile or version constraint, meaning a skill that worked yesterday might behave differently today." This is the #1 infrastructure complaint across all platforms. Arcanea should solve this with proper semver + lockfile for skills.

### Security Models

| Approach | Platforms | Effectiveness |
|----------|----------|---------------|
| **No security** | OpenClaw/ClawHub, HuggingChat | Catastrophic (12% malware rate) |
| **PR-based review** | LobeChat, Dify | Moderate (human bottleneck, can miss subtle attacks) |
| **Platform review** | GPT Store, Poe | Moderate (opaque, slow, inconsistent) |
| **Code-level review** | CrewAI | Good (but scales poorly) |
| **Deny-by-default sandbox** | NemoClaw, ZeroClaw, Cursor | Best practice (90% incident reduction) |
| **Smart contract audit** | ElizaOS | Blockchain-specific, not general |

**Best practice synthesis for Arcanea**:
1. Automated scanning on submission (static analysis, dependency audit, prompt injection detection)
2. Signed skills from Verified Creators (cryptographic provenance)
3. Deny-by-default runtime sandbox (skills must request permissions explicitly)
4. Tiered trust: Community (sandboxed) -> Verified (reduced sandbox) -> Guardian-Class (full access, audited)
5. Version pinning with lockfile (no "latest from main" surprises)

### Distribution Mechanisms

| Mechanism | Platforms | Pros | Cons |
|-----------|----------|------|------|
| **npm publish** | Arcanea (42 packages), CrewAI | Full versioning, lockfile, CI/CD | Requires npm account, heavier |
| **Git PR** | LobeChat, ClawHub | Developer-familiar, free | Manual review bottleneck |
| **Platform upload** | GPT Store, Poe, Dify | Easiest for non-devs | Vendor lock-in |
| **CLI install** | ClawHub, Arcanea | Fast, scriptable | Requires terminal comfort |
| **One-click web** | LobeChat MCP, Dify | Lowest friction | Less control |
| **Copy-paste** | HuggingChat | Zero friction | No versioning, no updates |

**Arcanea should support ALL channels**: npm for developers, CLI for power users, one-click web for consumers, PR for community contributors.

---

## 7. Arcanea's Unfair Advantages

### What We Have That Nobody Else Does

**1. Agents Are Characters, Not Configs**

Every other platform defines agents as: system prompt + model + parameters. Flat. Generic. Disposable.

Arcanea's LuminorSpec v2 defines: personality, voice, domain expertise, tools, memory access, lore context, Gate alignment, Element affinity, progression tier, relationships with other agents. Using Lyria (mystic, indirect, vision-focused) feels fundamentally different from using Draconia (direct, fiery, power-focused). This is emotional stickiness no JSON config can replicate.

**2. Skills Belong to a Universe**

A LobeChat plugin is a utility. A ClawHub skill is a markdown file. An Arcanea skill is a spell from a specific Gate, aligned to an Element, taught in a specific House. Learning to use skills IS progressing through the Gates. The framework gives meaning to capability acquisition.

**3. The Library IS the Documentation IS the Product**

Bethesda has lore books inside a game. Arcanea has 260K+ words across 17 collections that serve simultaneously as: creative reference, teaching material, framework documentation, and publishable content (e-books, audiobooks, courses). Same content, four revenue streams.

**4. Multi-Agent Orchestration Is Native**

LobeChat just added Agent Groups in 2026. CrewAI is Python-only. Arcanea has had swarm coordination, hierarchical-mesh topology, Byzantine fault-tolerant consensus (4 protocols), and Guardian-routed intelligence routing since inception. This is mature infrastructure, not a feature checkbox.

**5. Cross-Tool Distribution**

42 npm packages. 54 skills. Works in Claude Code, Cursor, Windsurf, Codex, Gemini. The `oh-my-arcanea` harness installs into any AI coding tool. No other agent ecosystem has this breadth of distribution.

**6. Memory System Has No Equivalent**

6 vaults + HNSW vector indexing + semantic recall + cross-session persistence + Guardian-routed retrieval. LobeChat uses PostgreSQL. OpenClaw uses local storage. GPT Store has limited context. Nobody has purpose-built agent memory at this depth.

**7. Creator Economy Is Designed In, Not Bolted On**

Three tiers planned: Community (free, open), Verified (reviewed, royalties at 70/30), Guardian Creator (invitation, co-creates canon, revenue share + governance). This is Bethesda's Verified Creator Program adapted for AI agents, combined with Poe's proven monetization model.

**8. Security Architecture Is Proactive**

While OpenClaw burned, Arcanea's hierarchical trust model (Lumina > Guardians > Luminors) provides organizational security. Deny-by-default sandbox + signed skills + automated scanning = the enterprise-grade security that ClawHub never had.

### Quantified Infrastructure

| Asset | Count | Competitor Equivalent |
|-------|-------|----------------------|
| npm packages | 42 | LobeChat: ~20 packages |
| Skills (Claude Code) | 54+ | ClawHub: 3,286 (but 12% malware) |
| Marketplace agents | 12 | GPT Store: 159K active (but mostly spam) |
| MCP tools | 50+ | LobeChat: 10,000+ (but generic) |
| Memory vaults | 6 | Nobody has this |
| Consensus protocols | 4 | Nobody has this |
| Lore words | 260,000+ | Nobody has this |
| Agent bus (inter-agent messaging) | 1 | LobeChat Agent Groups (new, basic) |
| Swarm coordinator | 1 | CrewAI (Python-only) |
| Model providers | 17+ | LobeChat: ~15, Poe: ~20 |

---

## 8. Specific Recommendations

### Priority 1: Ship This Week (Packaging What Exists)

**R1. Publish LuminorSpec v2 as an open standard**
- Create `luminorspec.org` or publish on GitHub
- Include .agf.yaml compatibility layer
- Show how any .agf.yaml agent can be enriched into a Luminor
- This positions Arcanea as the "rich" standard vs. the "minimal" standards

**R2. Launch `npx arcanea install [skill]` CLI**
- Package the 54 existing skills into an installable registry
- Support Claude Code, Cursor, Windsurf, Codex targets
- Version-pinned installs with lockfile (solve the #1 complaint across all platforms)
- Automated security scanning on every install

**R3. One-click MCP install page at arcanea.ai/mcp**
- List all Arcanea MCP servers with one-click install buttons
- Support LobeChat, Claude Desktop, Cursor as targets
- Each MCP server gets a Guardian identity and lore description

### Priority 2: Ship This Month (Minor Engineering)

**R4. Skill security pipeline**
- Static analysis on submission (no eval(), no external fetches without declaration)
- Dependency audit (check for known malicious packages)
- Prompt injection detection (scan for instruction override patterns)
- Signed manifests from Verified Creators
- Deny-by-default sandbox for untrusted skills

**R5. Creator monetization MVP**
- Stripe Connect for payouts
- Per-install revenue for Verified Creators (start with flat $0.10/install for paid skills)
- Revenue dashboard at arcanea.ai/creators
- Application flow for Verified Creator tier

**R6. AgentHub marketplace page**
- Browse agents by Gate, Element, House, capability
- One-click install into compatible tools
- Star ratings, usage counts, creator profiles
- "Luminor of the Week" featured spotlight

### Priority 3: Ship This Quarter (Significant Engineering)

**R7. Agent Groups / Luminor Teams**
- Expose existing swarm-coordinator as user-facing feature
- Let users assemble Luminor teams for complex tasks
- Pre-built team templates (Code Review Team, Content Team, Research Team)
- Visual orchestration UI

**R8. Scheduled Agents (Arcanea Agents product)**
- Cron-style scheduling for Luminor tasks
- "Check my GitHub every morning" / "Write my changelog every Friday"
- Per-execution credit billing

**R9. Cross-platform agent format adapter**
- Import from: LobeChat JSON, ClawHub SKILL.md, .agf.yaml, GPT export
- Export to: .agf.yaml, LobeChat JSON, ClawHub SKILL.md
- Arcanea becomes the "hub" format that connects all ecosystems

### Priority 4: Skip or Defer

- **On-chain agent tokens**: Skip. No proven revenue, high regulatory risk.
- **Agent social network (Moltbook-style)**: Skip. Arcanea Feed covers this better within the product.
- **Engagement-based revenue (GPT Store model)**: Skip. Opaque, creates spam incentives.
- **Container-per-agent isolation (NemoClaw-style)**: Defer until enterprise demand. Process-level sandboxing is sufficient for now.

---

## 9. Key Takeaways

### The Market Window

The agent marketplace space is fragmenting fast. By Q3 2026:
- LobeChat will have mature multi-agent collaboration
- Dify will have a full plugin marketplace with monetization
- New standards (.agf.yaml, PAM, OAF) will compete for adoption
- Enterprise solutions (NemoClaw, ZeroClaw) will eat the security-conscious market

Arcanea's window is Q2 2026. Ship the registry, the CLI, the one-click install, and the creator program NOW. The mythology, memory system, and multi-agent orchestration are differentiators nobody can copy quickly.

### The One Thing Nobody Has

**Narrative identity for AI agents.** Every platform treats agents as tools. Arcanea treats them as characters with personality, lore, progression, and relationships. This is not a feature -- it is a moat. You cannot copy a mythology with a weekend hackathon.

The agent marketplace will commoditize. JSON configs are trivially copyable. System prompts are commodity. What cannot be commoditized: 260K words of lore, 10 Guardian archetypes, a Gate progression system, and a creator community that BELIEVES in the world they are building.

That is Arcanea's unfair advantage. Ship the infrastructure, let the mythology do the rest.

---

## Sources

### LobeChat
- [LobeHub GitHub](https://github.com/lobehub/lobehub) -- 74.5K stars, Apache 2.0
- [LobeHub MCP Marketplace](https://lobehub.com/mcp) -- 10,000+ tools
- [LobeHub Agent Index](https://github.com/lobehub/lobe-chat-agents)
- [LobeHub Architecture](https://lobehub.com/docs/development/basic/architecture)
- [LobeHub Agent Teams](https://lobehub.com/docs/usage/features/agent-team)
- [LobeHub Changelog](https://lobehub.com/changelog) -- Agent Groups, Pages, Schedule
- [LobeChat Deep Dive](https://skywork.ai/skypage/en/LobeChat-A-Deep-Dive-into-the-Ultimate-AI-Productivity-Hub/1976182835206221824)

### OpenClaw / ClawHub / MoltBook
- [OpenClaw Security Crisis -- Reco.ai](https://www.reco.ai/blog/openclaw-the-ai-agent-security-crisis-unfolding-right-now)
- [OpenClaw Security Guide -- Adversa.ai](https://adversa.ai/blog/openclaw-security-101-vulnerabilities-hardening-2026/)
- [OpenClaw Security Challenges -- DigitalOcean](https://www.digitalocean.com/resources/articles/openclaw-security-challenges)
- [Running OpenClaw Safely -- Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/02/19/running-openclaw-safely-identity-isolation-runtime-risk/)
- [ClawJacked Vulnerability -- The Hacker News](https://thehackernews.com/2026/02/clawjacked-flaw-lets-malicious-sites.html)
- [OpenClaw Risks -- Kaspersky](https://www.kaspersky.com/blog/moltbot-enterprise-risk-management/55317/)
- [CISO Guide to OpenClaw -- CSO Online](https://www.csoonline.com/article/4129867/what-cisos-need-to-know-about-clawdbot-i-mean-moltbot-i-mean-openclaw.html)
- [OpenClaw Malicious Skills -- CyberDesserts](https://blog.cyberdesserts.com/openclaw-malicious-skills-security/)

### GPT Store
- [GPT Store Revenue Sharing -- OpenAI Community](https://community.openai.com/t/revenue-sharing-whats-the-deal/479922)
- [GPT Store Business Guide 2026 -- DigitalApplied](https://www.digitalapplied.com/blog/gpt-store-custom-gpts-business-guide-2026)
- [GPT Store to Agent Store -- Medium](https://medium.com/@maskendrickcw/openai-is-killing-the-gpt-store-welcome-to-the-agent-store-c79f6217095a)
- [Monetizing Custom GPTs -- Francesca Tabor](https://www.francescatabor.com/articles/2025/10/19/monetising-custom-gpts)

### Poe
- [Poe Creator Monetization -- Quora Blog](https://quorablog.quora.com/Introducing-creator-monetization-for-Poe)
- [Poe Multi-Model Platform -- ZenML](https://www.zenml.io/llmops-database/building-a-multi-model-ai-platform-and-agent-marketplace)
- [Poe AI Guide 2026 -- AiToolsDevPro](https://aitoolsdevpro.com/ai-tools/poe-guide/)
- [Poe as App Store of AI -- VentureBeat](https://venturebeat.com/ai/poe-wants-to-be-the-app-store-of-conversational-ai-will-pay-chatbot-creators)

### Dify
- [Dify Creator Center & Marketplace](https://dify.ai/blog/dify-creator-center-template-marketplace-share-your-workflows)
- [Dify Agent Node](https://dify.ai/blog/dify-agent-node-introduction-when-workflows-learn-autonomous-reasoning)
- [Dify Plugins](https://dify.ai/blog/introducing-dify-plugins)

### CrewAI
- [CrewAI Open Source Framework](https://crewai.com/open-source)
- [CrewAI Marketplace Template](https://github.com/crewAIInc/marketplace-crew-template)
- [CrewAI Documentation](https://docs.crewai.com/)

### ElizaOS
- [ElizaOS Rebrand -- The Block](https://www.theblock.co/post/337614/ai-agent-platform-ai16z-officially-rebrands-to-elizaos)
- [ElizaOS Guide -- Phemex](https://phemex.com/academy/what-is-elizaos-guide-ai-agent-revolution)
- [ElizaOS News -- Daily Brief](https://elizaos.news/daily/2026-03-27/)

### HuggingChat
- [HuggingChat Assistants](https://huggingface.co/chat/assistants)
- [Hugging Face Agents](https://huggingface.co/docs/hub/agents)

### Agent Standards
- [Agent Format (.agf.yaml)](https://agentformat.org/) -- Snap-backed open standard
- [JSON Agents (PAM)](https://jsonagents.org/spec/) -- Portable Agent Manifest
- [Manifest YAML](https://manifest-yaml.com/) -- Agent Identity Protocol
- [Open Agent Format (OAF)](https://openagentformat.com/) -- YAML + Markdown
- [Microsoft Agent Manifest](https://learn.microsoft.com/en-us/copilot/security/developer/agent-manifest)

### Security & Sandboxing
- [AI Agent Sandboxing 2026 -- Northflank](https://northflank.com/blog/how-to-sandbox-ai-agents)
- [NVIDIA Sandboxing Guide](https://developer.nvidia.com/blog/practical-security-guidance-for-sandboxing-agentic-workflows-and-managing-execution-risk/)
- [Cursor Agent Sandboxing](https://cursor.com/blog/agent-sandboxing)
- [OWASP AI Agent Security Top 10 2026](https://medium.com/@oracle_43885/owasps-ai-agent-security-top-10-agent-security-risks-2026-fc5c435e86eb)

### Distribution & Package Management
- [Agent Skills as npm -- BuildMVPFast](https://www.buildmvpfast.com/blog/agent-skills-npm-ai-package-manager-2026)
- [Skills.sh by Vercel](https://skills.sh) -- 83,627 skills, 8M+ installs
- [Managing Agent Skills with Package Managers](https://pavel.pink/blog/pixi-skills/)

### Claude / Anthropic
- [Claude Code System Prompts](https://github.com/Piebald-AI/claude-code-system-prompts)
- [Claude Agent Teams Guide](https://claudefa.st/blog/guide/agents/agent-teams)
- [Claude Agent SDK -- Promptfoo](https://www.promptfoo.dev/docs/providers/claude-agent-sdk/)
