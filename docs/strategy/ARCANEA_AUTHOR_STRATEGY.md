# Arcanea Author — Product & System Strategy

> The complete strategy for building Arcanea Author as a product vertical,
> upgrading the `/arcanea-author` command, and wiring semantic memory for authors.

---

## 1. What Arcanea Author IS

Arcanea Author is a **AI-native book production system** — not a writing assistant,
but a complete publishing pipeline that turns the Arcanea framework into
an author's operating system.

**The promise**: Authors use Arcanea's world-building framework, AI orchestration,
and semantic memory to produce books faster, with deeper consistency, and
publish across formats — while building a connected creative universe.

### Three Product Tiers

| Tier | Name | What It Does | Revenue Model |
|------|------|-------------|---------------|
| **1** | Author Command | `/arcanea-author` in Claude Code — orchestrates all writing agents | Free (OSS skill) |
| **2** | Author Toolkit | `arcanea-author` npm package — CLI + MCP for any coding agent | Freemium package |
| **3** | Author Studio | Web UI at arcanea.ai/studio/author — visual pipeline | Subscription |

### How It Fits the Six Layers

- **Chat/Imagine** — Brainstorm with AI writing partners, generate concept art
- **Worlds** — Use Gates/Elements/Archetypes as narrative architecture
- **Feed** — Share excerpts, get feedback, discover other authors' worlds
- **OSS** — Fork the author toolkit, contribute writing skills
- **Community** — Co-writing circles, beta reading, world-sharing
- **Academy** — Learn craft through the Ten Gates of authorship

---

## 2. Memory Architecture — Why memsearch

### Current Problem

| System | What It Does | What's Missing |
|--------|-------------|----------------|
| AgentDB | SQLite key-value vault (935 entries, 929 session logs) | No vector search, no embeddings, no semantic retrieval |
| arcanea-memory MCP | vault_remember/vault_recall | Text-only matching, no similarity search |
| Claude auto-memory | `~/.claude/projects/*/memory/` markdown files | No cross-file search, manual index |
| `.arcanea/lore/` | Canon files, world docs | Not indexed, no chunking |

**An author writing book 3 of a series needs**: "What did Character X say about the artifact in chapter 12 of book 1?"
None of our current systems can answer this.

### Solution: memsearch + AgentDB Hybrid

```
┌─────────────────────────────────────────────────────────┐
│                 AUTHOR MEMORY STACK                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: memsearch (Vector Search)                      │
│  ├── Indexes: book/, content/, .arcanea/lore/            │
│  ├── Hybrid: dense vectors + BM25 + reciprocal rank      │
│  ├── Backend: Milvus Lite (~/.memsearch/milvus.db)       │
│  ├── Embedding: bge-m3 ONNX (local, no API key)         │
│  └── Auto-sync: file watcher on manuscript dirs          │
│                                                          │
│  Layer 2: AgentDB (Structured Memory)                    │
│  ├── Character sheets, plot outlines, world facts        │
│  ├── Session history, agent coordination state           │
│  └── HNSW index (when enabled) for agent routing         │
│                                                          │
│  Layer 3: arcanea-memory MCP (Narrative Memory)          │
│  ├── vault_remember: Store creative insights             │
│  ├── vault_recall: Retrieve by category                  │
│  ├── horizon_append: Long-term vision tracking           │
│  └── Feeds INTO memsearch via markdown export            │
│                                                          │
│  Layer 4: Claude auto-memory (Session Persistence)       │
│  ├── User preferences, feedback, project context         │
│  └── Cross-session continuity                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Installation Plan

**Option A: memsearch + Milvus** (native Linux / Docker)
```bash
pip install memsearch[google]
memsearch config set embedding.provider google
memsearch index ./book/ ./.arcanea/lore/ ./content/
```

**Option B: SQLite Vector Search** (WSL2 — recommended for current setup)
```bash
# Uses Gemini API for embeddings, SQLite for storage
# No Milvus needed — pure SQLite with cosine similarity
python3 scripts/memsearch-sqlite.py index ./book/ ./.arcanea/lore/
python3 scripts/memsearch-sqlite.py search "Gate of Heart"
python3 scripts/memsearch-sqlite.py status
```

**Option C: Grep Fallback** (always works, no embeddings)
```bash
# Built into /arcanea-author memory mode
# Uses Grep tool for keyword-based search across manuscripts
```

### Backend Decision Matrix

| Backend | Semantic Search | WSL2 | Setup Cost | Dependencies |
|---------|----------------|------|------------|-------------|
| memsearch + Milvus | Hybrid (dense + BM25) | Docker only | Medium | pip + Milvus |
| SQLite + Gemini | Cosine similarity | Works | Low | Python + GEMINI_API_KEY |
| AgentDB + HNSW | HNSW index | Works | Medium | sqlite-vec extension |
| Grep | Keyword only | Works | Zero | None |

**Current recommendation**: SQLite + Gemini embeddings for WSL2. Upgrade to
memsearch when on native Linux or Docker is available.

### memsearch Claude Plugin Decision

**Recommendation: Install the Claude plugin** when Milvus is available.
The forked subagent approach is BETTER than MCP tools for author work —
it prevents lore search results from filling the conversation window.

For WSL2, the SQLite search script provides equivalent functionality
without the Milvus dependency.

---

## 3. The `/arcanea-author` Command — Unified Orchestrator

The current command is fragmented across 4 separate skills. The new version
unifies them into a single orchestrator with modes.

### Architecture

```
/arcanea-author
├── MODE: inception     → creative-master Architect Mode
├── MODE: write         → ultrawrite parallel agents
├── MODE: story         → create-story pipeline
├── MODE: revise        → Seven-Pass revision ritual
├── MODE: lore          → arcanea-lore expansion
├── MODE: publish       → Format + export pipeline
├── MODE: memory        → memsearch query + vault operations
├── MODE: council       → Invoke writing council (3-5 advisors)
└── MODE: series        → Multi-book continuity management
```

### Agent Coordination

```
┌─────────────────────────────────────────┐
│          ARCANEA AUTHOR                  │
│     (Queen Coordinator)                  │
├─────────────────────────────────────────┤
│                                          │
│  Tier 0: Orchestration                   │
│  └── Story Master (you, the command)     │
│                                          │
│  Tier 1: Creation Agents (parallel)      │
│  ├── Master Story Architect              │
│  ├── Character Psychologist              │
│  ├── World Architect                     │
│  └── Arcanea Lore Master                 │
│                                          │
│  Tier 2: Craft Agents (on-demand)        │
│  ├── Line Editor & Voice Alchemist       │
│  ├── Developmental Editor                │
│  ├── Research Librarian                  │
│  ├── Continuity Guardian                 │
│  └── Sensitivity Reader                  │
│                                          │
│  Tier 3: Production Agents (on-demand)   │
│  ├── Publishing Strategist               │
│  ├── Explore (canon search)              │
│  └── nano-banana (illustrations)         │
│                                          │
│  Memory Layer                            │
│  ├── memsearch (vector search)           │
│  ├── AgentDB (structured data)           │
│  └── arcanea-memory MCP (narrative)      │
│                                          │
└─────────────────────────────────────────┘
```

---

## 4. `frankxai/arcanea-author` Repo Strategy

### What Goes In the Repo

```
arcanea-author/
├── README.md                    # Product landing + quick start
├── LICENSE                      # Arcanea Proprietary
├── package.json                 # npm package: @arcanea/author
│
├── cli/                         # CLI entry point
│   ├── index.ts                 # arcanea-author CLI
│   └── commands/                # CLI subcommands
│       ├── init.ts              # Initialize author project
│       ├── write.ts             # Start writing session
│       ├── search.ts            # Semantic search across manuscripts
│       ├── outline.ts           # Generate/manage outlines
│       ├── characters.ts        # Character sheet management
│       └── publish.ts           # Export to formats
│
├── skills/                      # Claude Code skills (portable)
│   ├── arcanea-author.md        # Main orchestrator command
│   ├── story-pipeline.md        # Vision → Draft → Polish
│   ├── revision-ritual.md       # Seven-Pass system
│   ├── character-forge.md       # Character development
│   ├── world-build.md           # World architecture
│   └── voice-alchemy.md         # Voice consistency
│
├── agents/                      # Agent definitions
│   ├── story-architect.md       # Story structure specialist
│   ├── character-psychologist.md # Character depth agent
│   ├── lore-master.md           # Canon keeper
│   ├── line-editor.md           # Prose polish agent
│   ├── continuity-guardian.md   # Cross-book consistency
│   └── series-coordinator.md    # Multi-book management
│
├── templates/                   # Project templates
│   ├── novel/                   # Novel project scaffold
│   │   ├── outline.md
│   │   ├── characters/
│   │   ├── worldbuilding/
│   │   └── chapters/
│   ├── series/                  # Multi-book series scaffold
│   ├── short-story/             # Short fiction scaffold
│   └── arcanea-universe/        # Arcanea-canon fiction scaffold
│
├── memory/                      # Memory configuration
│   ├── memsearch.toml           # memsearch config for author projects
│   ├── schemas/                 # Structured memory schemas
│   │   ├── character-sheet.json
│   │   ├── plot-thread.json
│   │   ├── world-fact.json
│   │   └── continuity-note.json
│   └── hooks/                   # Memory lifecycle hooks
│
├── prompts/                     # Reusable prompt templates
│   ├── inception.md             # Project kickoff
│   ├── scene-craft.md           # Scene writing
│   ├── dialogue.md              # Dialogue generation
│   ├── revision-passes/         # Each of the 7 passes
│   └── quality-gates/           # Checklists
│
├── integrations/                # External tool configs
│   ├── mcp-servers.json         # Recommended MCP setup
│   ├── memsearch-config.toml    # Vector search config
│   └── export/                  # Publishing integrations
│       ├── kindle.ts            # KDP format
│       ├── epub.ts              # Standard epub
│       ├── pdf.ts               # Print-ready PDF
│       └── web.ts               # arcanea.ai Library format
│
└── docs/                        # Documentation
    ├── QUICK_START.md
    ├── ARCHITECTURE.md
    ├── MEMORY_SYSTEM.md
    ├── AGENT_COORDINATION.md
    └── PUBLISHING_GUIDE.md
```

### Not a Repo — Use the Main Arcanea Monorepo

**Decision point**: Should `arcanea-author` be a separate repo or part of the monorepo?

**Recommendation: BOTH**
- The **command** (`/arcanea-author`) lives in the monorepo at `.claude/commands/arcanea-author.md`
- The **package** (`@arcanea/author`) lives in `frankxai/arcanea-author` as a standalone tool
  that ANY author can install without needing the full Arcanea ecosystem
- The package pulls skills/agents from the monorepo via publish pipeline

### npm Package Design

```json
{
  "name": "@arcanea/author",
  "version": "0.1.0",
  "description": "AI-native book production system — from concept to published book",
  "bin": {
    "arcanea-author": "./dist/cli/index.js"
  },
  "keywords": ["ai", "writing", "author", "book", "claude-code", "mcp"],
  "license": "SEE LICENSE IN LICENSE",
  "peerDependencies": {
    "memsearch": ">=0.1.0"
  }
}
```

---

## 5. Coordination Strategy

### When to Use What

| Need | Command | Why |
|------|---------|-----|
| Write a single story/chapter | `/arcanea-author write` | Direct, focused, single pipeline |
| Strategic decisions about the book | `/arcanea-council` | 3-5 advisors debating approach |
| Maximum parallel creation power | `/arcanea-author` + `/superintelligence` | Full agent swarm on a complex task |
| Cross-book consistency audit | `/arcanea-author series` | Continuity Guardian + memsearch |
| Research + world-building deep dive | `/arcanea-author lore` | Lore Master + Research Librarian |

### Swarm Patterns for Author Work

**Pattern 1: Chapter Sprint** (use `/swarm-advanced`)
```
Queen: Story Master
Workers:
  - Agent 1: Write scenes 1-3 (parallel)
  - Agent 2: Write scenes 4-6 (parallel)
  - Agent 3: Character voice audit
  - Agent 4: Canon consistency check
Consensus: Queen merges, resolves conflicts
```

**Pattern 2: Revision Sprint**
```
Queen: Developmental Editor
Workers:
  - Agent 1: Structural pass
  - Agent 2: Character pass
  - Agent 3: Continuity pass (memsearch-powered)
  - Agent 4: Prose pass (Line Editor)
Consensus: Sequential merge, each pass builds on previous
```

**Pattern 3: World-Building Sprint**
```
Queen: World Architect
Workers:
  - Agent 1: Geography + locations
  - Agent 2: Magic systems + rules
  - Agent 3: Culture + languages
  - Agent 4: History + timeline
  - Agent 5: Canon validation
Consensus: Cross-reference all outputs for consistency
```

---

## 6. Implementation Roadmap

### Phase 1: Foundation (This Week)

- [x] Strategy document (this file)
- [ ] Install memsearch on this machine
- [ ] Index existing book/ and .arcanea/lore/ content
- [ ] Build unified `/arcanea-author` command (replaces 4 fragmented commands)
- [ ] Update `frankxai/arcanea-author` repo with README + architecture

### Phase 2: Memory Integration (Week 2)

- [ ] Configure memsearch Claude plugin with author-specific hooks
- [ ] Build memory schemas for character sheets, plot threads, world facts
- [ ] Wire memsearch search into the `/arcanea-author` command
- [ ] Test semantic search across 200K+ words of Library content

### Phase 3: Agent Orchestration (Week 3)

- [ ] Build agent definitions for all Tier 1-3 agents
- [ ] Implement swarm patterns (Chapter Sprint, Revision Sprint, World-Building)
- [ ] Wire `/arcanea-council` integration for strategic decisions
- [ ] Test full pipeline: concept → outline → draft → revise → publish

### Phase 4: Package & Publish (Week 4)

- [ ] Build `@arcanea/author` npm package
- [ ] CLI: init, write, search, outline, characters, publish
- [ ] Export integrations: epub, PDF, Kindle, web
- [ ] Documentation: quick start, architecture, memory system
- [ ] Publish to npm, update arcanea.ai/tools

---

## 7. Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Vector search | memsearch | Markdown-first, git-friendly, local embeddings, no API key |
| Memory backend | Milvus Lite | Zero-config, single file, hybrid search |
| Embedding model | bge-m3 ONNX | Local CPU, multilingual, no vendor lock-in |
| Agent coordination | Hierarchical with Queen | Author needs coherent narrative, not consensus |
| Separate repo? | Yes, lightweight package | Authors shouldn't need full Arcanea monorepo |
| MCP vs Claude plugin | Claude plugin (forked subagent) | Keeps context window clean for writing |
| Publishing formats | epub + PDF + Kindle + web | Cover 95% of author needs |

---

## 8. Revenue Model

| Product | Price | What Authors Get |
|---------|-------|-----------------|
| **Author Skill** (OSS) | Free | `/arcanea-author` command, basic templates |
| **Author Toolkit** (npm) | $19/mo | CLI, all agents, memsearch integration, export |
| **Author Studio** (web) | $49/mo | Visual UI, collaboration, cloud storage, publishing |
| **World License** | $99/mo | Build YOUR universe with Arcanea framework |

The Author vertical is the first proof that Arcanea's framework works
for ANY creative domain — not just Arcanea's own mythology.
