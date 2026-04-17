# Sprint: Export Intelligence & System of Record

> **Date**: 2026-04-05
> **Goal**: Build the complete Arcanea Export Intelligence System — capture every AI conversation, artifact, image, and video from all platforms, classify it, and feed it into the content production pipeline.
> **Duration**: Full day sprint
> **Priority**: P0 — This is core infrastructure for every Arcanean creator

---

## The Vision

Every creator accumulates thousands of conversations, images, code snippets, and ideas across ChatGPT, Claude, Perplexity, Grok, Gemini, and browser tabs. **99% of it is lost.** The Export Intelligence System makes loss impossible:

```
CAPTURE → EXPORT → CLASSIFY → PROCESS → PUBLISH
  ↑                                         |
  └─────────── feedback loop ───────────────┘
```

This is not just a tool — it's the **System of Record** for creative intelligence.

---

## What Already Exists (Inventory)

### Built & Working
| Asset | Location | Status |
|-------|----------|--------|
| `@arcanea/extension-core` | `packages/extension-core/` | Published, Guardian routing + voice + tiers |
| Grok Media Extension | `packages/grok-media/` | Phase 1 complete, 27 files |
| 5 Overlay Packages | `packages/overlay-{claude,chatgpt,gemini,copilot,cursor}/` | Scaffolded |
| `/creator-import` skill | `.claude/skills/creator-import/SKILL.md` | Complete — parses ChatGPT JSON |
| `/classify-content` command | `agentic/agentic-creator-os/.claude/commands/` | Complete — A-D grading |
| `/harvest` command | `.claude/commands/harvest.md` | Complete — prompt harvesting |
| ArcaneaClaw pipeline | `~/arcanea-claw/` + `oss/commands/arcanea-claw.md` | 8-skill pipeline, TASTE scoring |
| Multi-Extension Strategy | `docs/MULTI_EXTENSION_STRATEGY.md` | Full 5-product plan |
| Chrome Extension Spec | `docs/CHROME_EXTENSION_SPEC.md` | 16K token spec |
| arcanea-vault | GitHub repo | Cross-AI capture, pending Chrome publish |

### Planned but Not Built
| Asset | Source | Notes |
|-------|--------|-------|
| ChatGPT Export Extension | `grok-media/task_plan.md` line 289 | Listed as future extension |
| Perplexity Exporter | — | Not started |
| Unified Arcanea Media Hub | `grok-media/task_plan.md` | All extensions feed single library |
| Local MD Classification System | — | Not started |

---

## Sprint Blocks (Execute in Order)

### Block 0: Research & Chrome Plugin Audit (45 min)
> **Goal**: Test Frank's 10+ Chrome plugins, find the best exporters, document findings

**Tasks:**
1. **Inventory all installed Chrome plugins** — screenshot/list every extension currently installed
2. **Research best chat export extensions** (WebSearch for latest 2026 versions):
   - ChatGPT exporters: `chatgpt-exporter`, `SaveGPT`, `ChatGPT to Markdown`, `SuperPower ChatGPT`
   - Claude exporters: `Claude Export`, any Anthropic-endorsed tools
   - Perplexity: check if Comet handles export natively, or needs plugin
   - Multi-platform: `TypingMind`, `ChatHub`, `MarkdownDown`
   - Grok: our own `grok-media` + the 6 repos we already catalogued
3. **Test top 5 candidates** — export a real conversation from each platform, check:
   - Format quality (MD, JSON, HTML?)
   - Image/artifact export support
   - Video/file attachment handling
   - Metadata preservation (timestamps, model used, token count)
   - Bulk export capability
4. **Score and rank** — create comparison matrix
5. **Document findings** → `docs/research/CHROME_EXPORT_PLUGINS_AUDIT.md`

**Chrome plugins to specifically evaluate:**
- SideTab Pro (already installed — tab management)
- Auto Tab Discard (already installed — performance)
- Perplexity Comet (already in stack — research companion)
- Any export plugins currently installed

### Block 1: GitHub Repo Fork & Audit (30 min)
> **Goal**: Fork the best open-source exporters into our ecosystem

**Repos to fork/clone (from our grok-media research + new finds):**

```bash
# Grok tools (already catalogued)
gh repo fork brndnsmth/grok-imagine-favorites-manager --clone
gh repo fork josephmqiu/grok-imagine-favorites-downloader --clone
gh repo fork The-Degen-Dev/grok-powertools --clone

# ChatGPT exporters (research in Block 0 to find latest)
# Candidates:
# - chatgpt-exporter (pioneer-dev/chatgpt-exporter or similar)
# - chatgpt-to-markdown
# - openai-chat-exporter

# Claude exporters
# - claude-export (if exists)

# Multi-platform
# - any unified AI chat exporter repos
```

**Actions:**
1. Fork top 3-5 repos into `frankxai` org
2. Clone locally to `~/repos/forked-exporters/`
3. Audit each: what works, what's broken, what we can absorb
4. Document in `docs/research/FORKED_EXPORTERS_AUDIT.md`

### Block 2: Local MD System Architecture (1 hour)
> **Goal**: Design and build the local markdown system of record

**Directory Structure:**
```
~/arcanea-vault/          # The System of Record
├── inbox/                # Raw imports land here
│   ├── chatgpt/          # ChatGPT exports (conversations.json + images)
│   ├── claude/           # Claude exports
│   ├── perplexity/       # Perplexity exports
│   ├── grok/             # Grok media + conversations
│   ├── gemini/           # Gemini exports
│   ├── tabs/             # Saved tab sessions (URLs + metadata)
│   └── misc/             # Manual drops
├── classified/           # After /classify-content processing
│   ├── articles/         # Blog-ready content
│   ├── research/         # Research notes and findings
│   ├── code/             # Code snippets and solutions
│   ├── creative/         # Stories, lore, world-building
│   ├── images/           # Extracted images with metadata
│   ├── videos/           # Extracted videos
│   ├── prompts/          # Reusable prompts (feeds /harvest)
│   └── ideas/            # Raw ideas and brainstorms
├── processed/            # After skill processing
│   ├── blog-ready/       # Through /polish-content
│   ├── social-ready/     # Through /generate-social
│   ├── book-chapters/    # Through /excellence-book-writing
│   ├── showcase-ready/   # Through /arcanea-showcase
│   └── nft-candidates/   # Through /arcanea-nft-pfp
├── published/            # Final published versions
│   ├── website/          # Live on arcanea.ai
│   ├── social/           # Posted to platforms
│   └── products/         # In product pipeline
├── registry.json         # Master index of all items
└── README.md             # System documentation
```

**Each classified item gets YAML frontmatter:**
```yaml
---
id: exp-2026-04-05-001
source: chatgpt
source_model: gpt-4o
exported_at: 2026-04-05T10:30:00Z
classified_at: 2026-04-05T10:35:00Z
type: research
theme: ai-architecture
quality_grade: B
tags: [mcp, agent-design, arcanea]
title: "MCP Server Design Patterns Discussion"
word_count: 2847
has_images: true
has_code: true
processing_status: classified
next_skill: /polish-content
destination: blog
---
```

**Implementation:**
1. Create the directory structure
2. Build `scripts/export-processor.ts` — CLI tool that:
   - Watches `inbox/` for new files
   - Auto-detects source format (ChatGPT JSON, Claude MD, Perplexity, etc.)
   - Calls `/creator-import` logic for parsing
   - Calls `/classify-content` logic for routing
   - Adds frontmatter and moves to `classified/`
   - Updates `registry.json`
3. Build `scripts/batch-process.ts` — processes classified items through skills
4. Connect to ArcaneaClaw for media processing (images → TASTE scoring)

### Block 3: Tab Session Exporter (45 min)
> **Goal**: Build a system to capture and archive all open browser tabs

**Approach:**
1. Build a lightweight script/extension that captures:
   - All open tab URLs, titles, favicons
   - Tab groups and window organization
   - Session timestamp
   - Reading progress / scroll position if possible
2. Export format: `tabs/session-YYYY-MM-DD-HHmm.json`
3. Auto-classify tabs by domain:
   - AI chats → queue for conversation export
   - Research articles → queue for /creator-import
   - GitHub repos → queue for /harvest
   - Docs/tutorials → queue for reference library
4. Integration with SideTab Pro if API available

### Block 4: Unified Export Extension Engineering (2-3 hours)
> **Goal**: Design the ONE deeply-engineered Arcanea extension that handles ALL exports

**Name**: **Arcanea Vault** (upgrade the existing repo)

**Core Features:**
1. **Universal Chat Export** — one-click export from ANY AI platform:
   - ChatGPT: conversations, DALL-E images, canvas artifacts, code blocks
   - Claude: conversations, artifacts (code, documents, SVGs), images
   - Perplexity: searches, citations, Pro Search threads
   - Grok: conversations + imagine gallery (absorb grok-media)
   - Gemini: conversations, generated images, Gems
2. **Tab Intelligence** — session capture, auto-classify, smart bookmarking
3. **Media Capture** — images, videos, PDFs from any page
4. **Local-First Storage** — IndexedDB + optional sync to Supabase
5. **Arcanea Pipeline Integration** — one-click send to:
   - ArcaneaClaw for media processing
   - `/creator-import` for content parsing
   - `/classify-content` for routing
   - Direct to blog/showcase/social pipelines
6. **Bulk Operations** — export ALL conversations from a platform at once
7. **Search & Browse** — full-text search across all exported content

**Architecture:**
```
arcanea-vault/
├── src/
│   ├── core/                    # @arcanea/extension-core
│   ├── platforms/               # Platform-specific extractors
│   │   ├── chatgpt/
│   │   │   ├── extractor.ts     # DOM parsing + API hooks
│   │   │   ├── image-capture.ts # DALL-E image extraction
│   │   │   └── selectors.ts     # CSS selectors (isolated)
│   │   ├── claude/
│   │   │   ├── extractor.ts
│   │   │   ├── artifact-capture.ts
│   │   │   └── selectors.ts
│   │   ├── perplexity/
│   │   │   ├── extractor.ts
│   │   │   ├── citation-parser.ts
│   │   │   └── selectors.ts
│   │   ├── grok/                # Absorb grok-media
│   │   │   ├── extractor.ts
│   │   │   ├── media-capture.ts
│   │   │   └── selectors.ts
│   │   └── gemini/
│   │       ├── extractor.ts
│   │       └── selectors.ts
│   ├── storage/
│   │   ├── indexeddb.ts         # Dexie.js local store
│   │   ├── filesystem.ts       # Save to local MD vault
│   │   └── supabase-sync.ts    # Optional cloud sync
│   ├── pipeline/
│   │   ├── classifier.ts       # Auto-classify content
│   │   ├── tagger.ts           # Auto-tag with Guardian/element
│   │   ├── formatter.ts        # Convert to MD with frontmatter
│   │   └── exporter.ts         # Batch export to vault
│   ├── ui/
│   │   ├── sidepanel/          # Main interface
│   │   ├── popup/              # Quick actions
│   │   └── content-overlay/    # In-page export buttons
│   └── background/
│       ├── service-worker.ts
│       ├── tab-monitor.ts      # Track open tabs
│       └── auto-save.ts        # Auto-capture sessions
├── manifest.json
└── package.json
```

**Key Design Decisions:**
- Uses `@arcanea/extension-core` for Guardian routing
- Platform extractors are isolated — each can break independently
- Selectors files are separate so DOM changes are easy to fix
- Local-first: works fully offline, Supabase sync is optional
- Absorbs grok-media functionality (don't maintain two extensions)

### Block 5: Processing Pipeline Integration (1 hour)
> **Goal**: Wire the vault into the full Arcanea content production pipeline

**Pipeline Map:**
```
Arcanea Vault (capture)
    ↓
~/arcanea-vault/inbox/ (raw files)
    ↓
/creator-import (parse + extract)
    ↓
/classify-content (route + grade)
    ↓
~/arcanea-vault/classified/ (tagged MD files)
    ↓ (based on classification)
    ├── /polish-content → blog articles → arcanea.ai/blog
    ├── /generate-social → social posts → Twitter/LinkedIn/IG
    ├── /arcanea-showcase → showcase items → arcanea.ai/showcase
    ├── /excellence-book-writing → book chapters → publishing pipeline
    ├── /arcanea-nft-pfp → NFT candidates → NFT Forge
    ├── /arcanea-research → research synthesis → research library
    ├── ArcaneaClaw → media processing → TASTE scored assets
    └── /harvest → prompt library → skill improvement
```

**Automation:**
- `scripts/watch-inbox.ts` — file watcher that auto-triggers pipeline
- `scripts/daily-digest.ts` — summarize what was captured today
- `scripts/content-radar.ts` — identify highest-value content for publishing
- Cron: run nightly to process any backlog

### Block 6: Chrome Plugin Testing & Selection (30 min)
> **Goal**: From Block 0 research, decide which plugins stay and which we replace

**Decision Framework:**
| Plugin | Keep? | Why |
|--------|-------|-----|
| SideTab Pro | YES | Tab management, complements our tab capture |
| Auto Tab Discard | YES | Performance, saves RAM |
| Perplexity Comet | YES | Part of our research stack |
| [Export plugin 1] | EVALUATE | Compare to Arcanea Vault |
| [Export plugin 2] | EVALUATE | Compare to Arcanea Vault |
| ... | ... | ... |

**Rule**: If Arcanea Vault can do what a plugin does, remove the plugin. Fewer extensions = better performance.

---

## Skill Routing Map

These existing skills power the pipeline:

| Skill | Role in Pipeline | Trigger |
|-------|-----------------|---------|
| `/creator-import` | Parse raw exports into structured content | New file in inbox/ |
| `/classify-content` | Route + grade content by type and quality | After import |
| `/polish-content` | Transform to publish-ready articles | B+ grade articles |
| `/generate-social` | Create platform-optimized social posts | Any publishable content |
| `/arcanea-showcase` | Generate showcase entries | A-grade creative work |
| `/harvest` | Extract reusable prompts | Conversations with good prompts |
| `/arcanea-claw` | Media processing + TASTE scoring | Images and videos |
| `/arcanea-nft-pfp` | NFT candidate processing | High-quality generated images |
| `/frankx-ai-content-pipeline` | Full FrankX brand pipeline | Brand content |
| `/arcanea-research` | Research synthesis | Research conversations |
| `/excellence-book-writing` | Book chapter processing | Long-form creative content |

---

## GitHub Repos Strategy

### New Repos to Create
| Repo | Purpose |
|------|---------|
| `frankxai/arcanea-vault` | The unified Chrome extension (upgrade existing) |
| `frankxai/arcanea-vault-cli` | CLI tool for local vault management |

### Repos to Fork (Best of Breed)
| Source Repo | Why |
|-------------|-----|
| Top ChatGPT exporter | Absorb parsing logic |
| Top Claude exporter | Absorb artifact extraction |
| `brndnsmth/grok-imagine-favorites-manager` | Already catalogued, absorb into vault |
| `The-Degen-Dev/grok-powertools` | MIT license, useful utilities |
| Any Perplexity export tool | If exists |

### Existing Repos to Connect
| Repo | Role |
|------|------|
| `arcanea` (OSS) | Skills live here |
| `arcanea-ai-app` | Website — blog, showcase, products |
| `arcanea-claw` | Media pipeline |
| `arcanea-mcp` | MCP tools for AI integration |

---

## Success Criteria (End of Sprint)

- [ ] Chrome plugin audit complete with comparison matrix
- [ ] Top exporter repos forked and audited
- [ ] Local vault directory structure created and documented
- [ ] `export-processor.ts` CLI tool working (at minimum ChatGPT + Claude parsing)
- [ ] Arcanea Vault extension architecture designed and scaffolded
- [ ] At least one full pipeline test: export → import → classify → process
- [ ] All existing ChatGPT/Claude/Perplexity conversations exported to vault
- [ ] Tab session capture working
- [ ] Processing pipeline wired to existing skills
- [ ] Sprint results documented

---

## Execution Order (Optimized)

```
09:00 - Block 0: Research Chrome plugins (WebSearch + testing)
09:45 - Block 1: Fork GitHub repos (parallel with Block 0 tail)
10:15 - Block 2: Build local MD vault system
11:15 - Block 3: Tab session exporter
12:00 - LUNCH + let exports run (bulk export all conversations)
13:00 - Block 4: Arcanea Vault extension engineering
16:00 - Block 5: Pipeline integration
17:00 - Block 6: Final plugin selection + cleanup
17:30 - Document everything, commit, push
```

---

## Notes

- **Perplexity Comet** is already part of our stack as a research companion. Check if it has export API or if we need to build extraction separately.
- **SideTab Pro** vertical tabs + Auto Tab Discard are keepers — they handle tab UX, we handle tab intelligence.
- The Arcanea Vault extension should be the ONE extension that replaces 5+ individual export plugins.
- Every Arcanean creator will want this — it's a product, not just a tool.
- This connects directly to the content production pipeline that powers arcanea.ai.
