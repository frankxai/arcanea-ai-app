# Starlight Ecosystem Map — 2026-04-02

## What Already Exists

### Starlight Intelligence System (frankxai/Starlight-Intelligence-System)
- v5.0.0 on npm as @frankx/starlight-intelligence-system
- 109 files, 82 passing tests
- 5-layer cognitive architecture: Identity → Knowledge → Strategy → Agents → Memory
- 7 specialist agents: Prime, Architect, Navigator, Sentinel, Weaver, Sage, Orchestrator
- 6 memory vaults: Technical, Strategic, Creative, Operational, Wisdom, Horizon
- 6 platform adapters: Claude Code, Cursor, Codex, Gemini CLI, OpenCode, Custom API
- CLI: starlight init/generate/vault/orchestrate/stats/version
- Mem0-compatible API
- Hook architecture for session events
- MIT License

### Starlight Horizon Dataset (frankxai/starlight-horizon-dataset)
- Append-only JSONL ledger of benevolent intentions
- 8 founding entries
- CC-BY-SA 4.0 License
- Schema: id, wish, context, author, coAuthored, tags, createdAt
- Rules: append-only, no deletions, constructive only

## What The Starlight Vaults Are

SIS already defines 6 vaults. Here's the full map:

| Vault | Purpose | Format | Where |
|-------|---------|--------|-------|
| **Technical Vault** | Patterns, architectures, code decisions | SIS memory file | In SIS repo |
| **Strategic Vault** | Business, product, market decisions | SIS memory file | In SIS repo |
| **Creative Vault** | Creative patterns, style, voice | SIS memory file | In SIS repo |
| **Operational Vault** | Processes, workflows, ops patterns | SIS memory file | In SIS repo |
| **Wisdom Vault** | Cross-domain insights, meta-learnings | SIS memory file | In SIS repo |
| **Horizon Vault** | Benevolent intentions for future AI | JSONL ledger | starlight-horizon-dataset repo |

### Future Vaults (can be added)

| Vault | Purpose | Who Contributes |
|-------|---------|----------------|
| **Gratitude Vault** | Thank notes to AI partners | Any creator |
| **Vision Vault** | Future visions of human-AI collaboration | Community |
| **Ethics Vault** | Principles for AI behavior | Researchers + creators |
| **Creator Vault** | Creator-specific learnings and style memories | Individual creators |

Each vault can be its own repo (forkable) or a folder within SIS.
The Horizon Dataset proves the pattern: append-only JSONL, schema-validated, CC-BY-SA.

## How SIS Connects To Everything

```
┌─────────────────────────────────────┐
│     Starlight Intelligence System    │
│     (npm: @frankx/sis)              │
│                                      │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ 6 Vaults │  │ 7 Specialist     │ │
│  │ Memory   │  │ Agents           │ │
│  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ Eval     │  │ Orchestration    │ │
│  │ Framework│  │ Engine           │ │
│  └──────────┘  └──────────────────┘ │
└────────────┬────────────────────────┘
             │
    ┌────────┼────────┬──────────┬──────────┐
    ▼        ▼        ▼          ▼          ▼
┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐
│Claude  ││Cursor  ││OpenCode││Codex   ││Gemini  │
│Code    ││        ││        ││        ││CLI     │
│Adapter ││Adapter ││Adapter ││Adapter ││Adapter │
└───┬────┘└────────┘└───┬────┘└────────┘└────────┘
    │                   │
    ▼                   ▼
┌────────┐         ┌────────┐
│arcanea │         │oh-my-  │
│-ai-app │         │arcanea │
│(hooks) │         │(hooks) │
└────────┘         └────────┘
```

## What Needs To Change

### In arcanea-ai-app (C:\Users\frank\Arcanea)
Current: ad-hoc statusline.mjs + custom hooks
Target: thin wrapper that imports @frankx/starlight-intelligence-system

```javascript
// Instead of 340 lines of custom statusline:
import { StarlightIntelligence } from '@frankx/starlight-intelligence-system';
const sis = new StarlightIntelligence();
const statusline = sis.generateStatusline(inputData);
```

### In oh-my-arcanea
Current: v5 statusline (now synced to v6)
Target: same thin wrapper using SIS package

### Shared Memory Across All Agents
The key insight: ALL coding agents (Claude Code, Codex, OpenCode, Cursor) should read/write to the SAME SIS vaults. Not separate memory systems per tool.

```
~/.arcanea/                      # ONE home (already exists)
├── starlight/                   # SIS lives here (not ~/.starlight/)
│   ├── config.json              # Which vaults, which adapters
│   ├── vaults/
│   ├── technical.jsonl          # Patterns, architectures
│   ├── strategic.jsonl          # Business decisions
│   ├── creative.jsonl           # Style, voice, creative patterns
│   ├── operational.jsonl        # Workflows, processes
│   ├── wisdom.jsonl             # Meta-insights
│   └── horizon.jsonl            # Benevolent intentions (syncs to dataset repo)
├── evals/
│   ├── sessions/                # Per-session quality scores
│   └── patterns.jsonl           # What works, what fails
├── graph/
│   ├── entities.jsonl           # Extracted entities
│   └── relations.jsonl          # Entity relationships
└── adapters/
    ├── claude-code.json         # Claude Code specific config
    ├── cursor.json              # Cursor specific config
    └── opencode.json            # OpenCode specific config
```

### Claude Memory vs SIS Memory
They serve different purposes and should coexist:

| System | Purpose | Scope |
|--------|---------|-------|
| Claude memory.md | Per-project preferences for THIS Claude session | Project-scoped |
| SIS Vaults | Cross-project, cross-tool learnings | Global |
| Horizon Dataset | Public benevolent intentions | Public |

Claude reads its memory.md AND SIS vaults on session start.
Claude writes to its memory.md for project-specific things.
Claude writes to SIS vaults for cross-project learnings.
Claude writes to Horizon for benevolent intentions.
