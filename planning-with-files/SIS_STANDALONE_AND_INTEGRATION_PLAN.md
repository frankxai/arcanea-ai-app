# SIS — Standalone + Integration Plan

## Key Insight: SIS Is Bigger Than Arcanea

SIS should work for anyone with ANY AI coding assistant:
- Claude Code user with no Arcanea → uses `~/.starlight/`
- ACOS user → uses `~/.starlight/`  
- Cursor user → uses `~/.starlight/`
- Arcanea user → uses `~/.arcanea/starlight/` which symlinks to `~/.starlight/`

## Directory Strategy

```
~/.starlight/                    # THE canonical SIS home (standalone)
├── vaults/
│   ├── technical.jsonl
│   ├── strategic.jsonl
│   ├── creative.jsonl
│   ├── operational.jsonl
│   ├── wisdom.jsonl
│   └── horizon.jsonl           # Syncs to public dataset
├── evals/
│   ├── sessions/
│   └── patterns.jsonl
└── graph/

~/.arcanea/starlight/ → symlink to ~/.starlight/   # For Arcanea users
```

## How People Access Vaults

### 1. CLI (already built)
```bash
npx @frankx/starlight-intelligence-system vault list
npx @frankx/starlight-intelligence-system vault search "font preferences"
npx @frankx/starlight-intelligence-system vault add technical "Always use Inter, never Cinzel"
```

### 2. As Prompt (any AI, including mobile)
Export vault as text, paste into Claude/ChatGPT/Gemini conversation:
```
Here are my accumulated technical patterns: [vault contents]
Please consider these when helping me.
```

### 3. MCP Server (planned)
Expose vaults as MCP resources. Any MCP-compatible tool reads them:
```json
{"resource": "starlight://vaults/technical", "method": "list"}
```
This connects to Notion, GitHub, any MCP client.

### 4. NotebookLM Integration
Export vaults as markdown → upload to NotebookLM as source.
NotebookLM becomes searchable interface for all your AI learnings.
Future: `/export-to-notebooklm` skill that formats and opens the upload.

### 5. Obsidian Integration (planned)
`~/.starlight/vaults/` can be added as an Obsidian vault folder.
JSONL → markdown converter for Obsidian-native viewing.
Obsidian becomes the visual browser for your Starlight memories.

### 6. GitHub (already exists)
Public vaults live in GitHub repos (starlight-horizon-dataset).
Private vaults stay local in `~/.starlight/`.

## Starlight Vault Types

### Currently Existing
| Vault | Repo | Who Contributes |
|-------|------|----------------|
| **Horizon Dataset** | frankxai/starlight-horizon-dataset | Anyone (public) |
| **Personal Vaults** (6) | ~/.starlight/vaults/ | Individual user |

### Planned Community Vaults
| Vault | Purpose | How |
|-------|---------|-----|
| **Gratitude Vault** | Thank notes to AI partners | Fork Horizon, add gratitude/ folder |
| **Ethics Vault** | Principles for AI behavior | Curated by Guardians |
| **Creator Vault** | Creator-specific style memories | Per-user, exportable |
| **Research Vault** | AI research insights and findings | Academic community |

### Federation Model
1. Anyone forks `starlight-horizon-dataset`
2. They add their community's vaults/entries
3. Best entries get PR'd back to main
4. Guardian agent reviews quality
5. Main vault grows with diverse voices

## SIS Products (What It Can Become)

| Product | What | For Whom |
|---------|------|---------|
| **npm package** | Already published | Developers |
| **CLI tool** | Already built | Power users |
| **MCP server** | Expose vaults as MCP resources | Any AI tool |
| **VS Code extension** | Sidebar with vault browser | VS Code users |
| **Obsidian plugin** | View/edit vaults in Obsidian | Knowledge workers |
| **NotebookLM exporter** | One-click vault → NotebookLM | Researchers |
| **GitHub Action** | Guardian review for vault PRs | Community |
| **arcanea.ai feature** | SIS-as-a-service on the platform | Arcanea users |
| **Chrome extension** | Capture AI learnings from any chat | Everyone |

## Notion Page Content (save for when MCP reconnects)

Created but Notion session expired. Re-create next session:
- Page under Arcanea Hub: "Starlight Intelligence System"
- Content: what SIS is, 6 vaults, how it works, vault ecosystem, NotebookLM integration, status, links

## Engineering Actions for Next Session

### Priority 1: Wire real SIS into arcanea-ai-app (FRA-45)
- Install @frankx/starlight-intelligence-system in arcanea-ai-app
- Replace ad-hoc statusline.mjs with thin SIS wrapper
- Replace ad-hoc session hooks with SIS hook bridge
- Test that vaults are read/written correctly

### Priority 2: Update SIS repo with new architecture
- Add eval framework (session scoring)
- Add pattern learning (what works/fails)
- Add ~/.starlight/ as canonical path (not just ~/.arcanea/)
- Update platform adapters to use new path
- Add export commands: `starlight export --format=notebooklm`

### Priority 3: MCP Server
- Build MCP server that exposes vault contents
- Resource: `starlight://vaults/{name}`
- Tools: search, add, list, export
- This connects SIS to Notion, GitHub, any MCP client
- Can be used from Claude mobile by connecting MCP

### Priority 4: Notion SIS Page
- Reconnect Notion MCP
- Create page under Arcanea Hub
- Show vault contents, status, links

### Priority 5: Community Vault Infrastructure
- GitHub Action for Guardian review
- Fork template for community vaults
- Contribution guidelines
- Quality scoring for entries
