# The FrankX Ecosystem — How Everything Connects

> *"It's not 27 repos. It's one intelligence system with 27 organs."*

---

## The Big Picture

```
                    ┌─────────────────────┐
                    │     THE CREATOR      │
                    │   (You, the Author)  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │    ACOS / SIS        │
                    │  Agentic Creator OS  │
                    │  + Starlight Intel   │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                     │
   ┌──────▼──────┐    ┌───────▼──────┐    ┌────────▼───────┐
   │  AUTHOR OS   │    │  ARCANEA.AI  │    │   FRANKX.AI    │
   │  Write books │    │  Create worlds│    │  Personal hub  │
   └──────┬──────┘    └───────┬──────┘    └────────┬───────┘
          │                    │                     │
   ┌──────▼──────┐    ┌───────▼──────┐    ┌────────▼───────┐
   │ PUBLISHING   │    │  COMMUNITY   │    │   MONETIZE     │
   │ epub/pdf/web │    │  Feed, share │    │ courses, Web3  │
   └─────────────┘    └──────────────┘    └────────────────┘
```

---

## Layer 1: The Operating System (ACOS + SIS)

**What**: Agentic Creator OS + Starlight Intelligence System
**Where**: `/intelligence-os/`, `/starlight-intelligence-system/`, `/starlight-protocol/`
**Why**: This is the BRAIN. Everything else is an organ.

ACOS routes your intent to the right system:
- "Write a chapter" → AuthorOS
- "Build a landing page" → frankx-best-website
- "Create music" → Suno/frankx-music
- "Deploy to production" → arcanea-deploy

SIS provides:
- 5-layer cognitive architecture (Identity → Intellect → Protocol → Agency → Arcana)
- 7 Starlight agents (Orchestrator, Prime, Architect, Navigator, Sentinel, Weaver, Sage)
- 6 memory vaults (Strategic, Technical, Creative, Operational, Wisdom, Horizon)
- Cross-session persistence via Starlight Vaults

**How they connect to AuthorOS**:
```
ACOS → detects "author" intent → routes to AuthorOS
SIS → provides memory vaults → feeds into memsearch-sqlite
Starlight Vaults → persistent author context → survives session restarts
```

---

## Layer 2: The Author System

### AuthorOS (Universal Core)
**Repo**: `frankxai/author-os`
**License**: MIT

The foundation that any author installs. No mythology, no lore — pure craft.

### AuthorOS Skills (Marketplace)
**Repo**: `frankxai/author-os-skills`

Adapters for every coding agent:
- `claude-code/` — Claude Code commands
- `opencode/` — OpenCode TypeScript agents
- `codex/` — OpenAI Codex format
- `gemini/` — Gemini CLI format
- `arcanea/` — Arcanea extension skills

### Arcanean AuthorOS (Extension)
**Repo**: `frankxai/arcanea-author`

AuthorOS + mythology = superpowers:
- Ten Gates = author progression
- Five Elements = writing modes
- Guardians = domain expertise
- Web3 = creator economy
- Multiverse = world licensing

### Multi-Model Runtime
**Repo**: `frankxai/opencode-arcanea`

11 Greek god agents (TypeScript):
Sisyphus, Prometheus, Hephaestus, Metis, Momus, Oracle, Atlas, Starlight + Calliope, Mnemosyne, Orpheus

### Claude Integration
**Repo**: `frankxai/claude-arcanea`

Claude Code specific: skills, commands, hooks, memory integration.

---

## Layer 3: The Platform

### arcanea.ai
**Where**: `apps/web/` in Arcanea monorepo
**Stack**: Next.js 16, React 19, Supabase, Vercel

The web platform where creators:
- Chat with Luminors (AI creative partners)
- Browse the Library (200K+ words)
- Forge companions and luminors
- Take Academy courses (Ten Gates curriculum)
- Join the community (Feed, share, discover)

**AuthorOS connection**: Published books appear in the Library. Author Studio (future) provides visual UI for AuthorOS.

### frankx.ai
**Where**: Separate deployment
**Purpose**: Personal hub, blog, portfolio, thought leadership

**AuthorOS connection**: Blog manifesto ("The AI-Augmented Author") published here. Creator economy content. Speaking/teaching.

---

## Layer 4: Memory & Intelligence

### memsearch-sqlite.py
**Where**: `scripts/memsearch-sqlite.py` (monorepo), `memory/` in author-os
**Purpose**: Semantic vector search across manuscripts

2,200 chunks, 121 files, 29 MB. SQLite + Gemini embeddings. Works on WSL2. Shared across all coding agents via file-based SQLite.

### AgentDB
**Where**: `~/.arcanea/agentdb.sqlite3`
**Purpose**: Structured agent memory (agents, tasks, sessions, vault entries)

935 entries. Ready for vector extension (embedding_hash column exists).

### arcanea-memory MCP
**Where**: `packages/memory-mcp/`
**Purpose**: Narrative memory (vault_remember, vault_recall, horizon)

Feeds into the broader memory system. Starlight Vaults for long-term creative context.

### CANON_LOCKED.md
**Where**: `.arcanea/lore/CANON_LOCKED.md`
**Purpose**: Immutable truth source. AI cannot contradict locked canon.

---

## Layer 5: Content & Lore

### Library of Arcanea
**Where**: `book/` (17 collections, 200K+ words)
**Purpose**: The reference implementation of AuthorOS output

This IS the proof. Every piece was written using the system:
- Legends of Arcanea (founding myths)
- Chronicles of the Guardians (character studies)
- Meditations on the Elements (practice guides)
- Tales of Creators (author journey stories)
- Academy Handbook (complete guide)

### Canon System
**Where**: `.arcanea/lore/`
**Purpose**: Guardians, Godbeasts, Gates, Elements, magic system, world rules

All indexed in memsearch-sqlite. Searchable. Verifiable. Immutable (locked sections).

---

## Layer 6: Automation & Workflows

### n8n Workflows
**Where**: `.arcanea/n8n/`
**Purpose**: Publishing automation

Planned workflows:
- Manuscript → epub/pdf/kindle (on commit)
- New chapter → newsletter (via Substack/Ghost API)
- Cover art → social media posts (via Canva)
- Quality gate → Slack notification

### Claude Code Hooks
**Where**: `.arcanea/hooks/`, hooks in `.claude/settings.json`
**Purpose**: Auto-session-capture, quality gates, memory sync

Current hooks:
- SessionStart: resume context, init AgentDB
- UserPromptSubmit: model recommendation, Guardian routing
- Post-edit: auto-format, quality check

### MCP Servers
**Where**: `.mcp.json` (local), `packages/arcanea-mcp/`, `packages/memory-mcp/`
**Purpose**: Extend AI capabilities with tools

Active servers:
- arcanea-mcp (worldbuilding, canon, creative orchestration)
- arcanea-memory (vault, horizon)
- github, notion, linear, supabase, figma, playwright

---

## How an Author's Journey Works

### Day 1: Install AuthorOS
```bash
# Copy skills to any coding agent
cp author-os-skills/claude-code/*.md .claude/commands/
```
They now have: story architect, character psychologist, line editor, memory search, publishing.

### Week 1: Write a Book
```bash
/author inception "A healer discovering ancient powers"
/author write chapter 1
/author revise
```
AuthorOS handles structure, character consistency, prose quality, continuity.

### Month 1: Add Memory
```bash
python3 memsearch-sqlite.py index ./chapters/ ./worldbuilding/
/author memory "What did the healer learn in chapter 3?"
```
Semantic search across their entire manuscript. Never forget canon.

### Month 3: Go Arcanean
```bash
cp author-os-skills/arcanea/*.md .claude/commands/
/arcanea-author inception "A Creator's journey through the Gate of Sight"
```
Now they have: Ten Gates progression, Five Elements modes, Guardian assistance, canon verification.

### Month 6: Build Their Universe
The author doesn't just write books — they build a WORLD:
- Multiple books in the same universe
- Series Bible for continuity
- World licenses for other creators
- Game dev bridge (world → Godot/Unity)
- Story NFTs for collectors

### Year 1: Teach Others
Gate 10 (Source) — the author becomes a teacher:
- Courses on their world-building system
- Community of creators in their universe
- Revenue from world licenses, courses, Web3

---

## What We Still Must Build

### Critical Path (Next)
| Item | Where | Why |
|------|-------|-----|
| Publishing automation (n8n) | `.arcanea/n8n/` | Authors need one-click publish |
| Visual outline editor | arcanea.ai/studio | Authors think spatially |
| Real-time Codex linking | Author Studio | Auto-surface canon as you type |
| Lorebook import/export | author-os | Standard format for character/world data |
| Multi-agent terminal orchestrator | New tool/repo | Run Claude+OpenCode+Codex together |

### Medium Term
| Item | Where | Why |
|------|-------|-----|
| Audio pipeline | author-os | ElevenLabs + Suno integration |
| Video pipeline | author-os | Book trailers, social content |
| Game dev bridge | arcanea-author | World → Godot/Unity |
| Translation pipeline | author-os | Multi-language publishing |
| Community marketplace | arcanea.ai | Sell/share world templates |

### Long Term
| Item | Where | Why |
|------|-------|-----|
| VR/AR authoring | arcanea-author | Immersive world experiences |
| Fine-tuned fiction model | Training pipeline | Own the prose quality layer |
| Multi-agent terminal | New tool | Central orchestrator for all agents |
| Author analytics dashboard | arcanea.ai | Track progress, velocity, quality |

---

## Why This Is Genius

1. **Mythology IS architecture**. The Ten Gates aren't decoration — they're a routing table mapping cognitive domains to AI models. When you invoke "Gate of Heart," the system knows to use emotional intelligence, character psychology, and dialogue craft. No other system maps creative domains to AI capabilities through narrative.

2. **Two-layer separation**. AuthorOS is MIT and universal. Arcanea extends it with mythology. This means: the universal system grows the user base, the Arcanea extension captures value. WordPress (free) + WooCommerce (paid). Same pattern.

3. **Memory as competitive moat**. memsearch-sqlite.py is simple, but it's also the only author tool with semantic search across manuscripts. When an author has 200K words indexed and searchable in <2 seconds, they can't leave. The memory IS the moat.

4. **Content cascade multiplies value**. One chapter becomes: blog post, newsletter, social thread, audiobook section, illustration, video, game scene, NFT. Each output is a revenue stream. AuthorOS makes the chapter. The ecosystem makes everything else.

5. **Authors become world-builders**. Not just "write books" — build universes that other people create in. The Arcanea framework (Gates, Elements, Archetypes) is itself a template for building frameworks. Meta-creation. The system that builds systems.

6. **Open source builds trust, proprietary captures value**. author-os (MIT) proves the approach works. arcanea-author (proprietary) captures revenue. author-os-skills (MIT) grows adoption. The ecosystem feeds itself.
