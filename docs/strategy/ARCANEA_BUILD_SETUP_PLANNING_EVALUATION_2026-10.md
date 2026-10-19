# Arcanea Build and setup-planning hypothesis evaluation

Status: evaluation proposal for GitHub Issue #527.
Document commit reference: 94b5e0a1dc7b47b09df9f5410d0f92ae7def7e95
Draft review reference: Pull Request #526
Owner: Principal Design Technologist & Frontend Architect (@impeccable)

## Executive summary

This document evaluates the founder's 5-6 October discussion regarding the "Arcanea Build" setup-planning hypothesis in relation to the main Arcanea creative platform. All product naming, tiering, and organizational proposals from that discussion remain non-binding recommendations.

The objective of this bounded evaluation is to:

1. Preserve and analyze the 5-6 October setup-planning proposals.
2. Select a single, concrete intended user outcome.
3. Compare a serious existing market alternative on the same task.
4. Resolve functional overlap across accepted Arcanea core products.
5. Define strict schemas for useful output and measurable recovery acceptance criteria.

---

## Evaluation of founder discussion (5-6 October)

### Preserved core concepts

The 5-6 October discussion proposed separating environment/project setup and architecture planning ("Arcanea Build") from creative worldbuilding and manuscript composition ("Arcanea Creative Platform").

Key proposals from that session included:

- **Build / setup-planning harness**: A dedicated local and CLI environment for project bootstrapping, toolchain installation, model provider configuration, and structural project planning.
- **Agent-guided initialization**: Automated setup of world rules, entity schemas, and memory indices prior to creative writing.
- **Platform division**: Splitting developer/setup workflows from authoring workflows into separate client experiences or repositories.

### Analysis and architectural alignment

1. **Naming and direction remain proposals**: "Arcanea Build" and "Setup-Planning" are conceptual proposals. Creating a separate repository, standalone product, or duplicated agent framework for setup-planning is explicitly rejected to avoid platform fragmentation.
2. **Unified core operations**: Setup, project initialization, world context loading, and manuscript editing share the same underlying domain contracts, Supabase schema, and MCP tool definitions (`@arcanea/mcp-server`).
3. **Setup as a capability, not a product**: Setup and planning belong inside the existing local harness adapters (CLI, MCP, Web workspace onboarding) rather than a distinct, standalone application.

---

## Intended user outcome

### Chosen primary user outcome

**Independent author project initialization, contextual drafting, and session recovery**:

An independent creator or worldbuilder initializes a private setting with pre-populated lore rules and character entities, drafts a story chapter using selected source-linked context, suffers an intentional mid-session client disruption or network disconnection, reopens the project on a secondary client, and resumes editing without data loss or unresolvable state drift.

### Core steps in the outcome workflow

1. **Initialize**: Creator sets up a world project with foundational rules (magic system, geography, character rosters).
2. **Select context**: Creator selects exact entities and prior chapter summaries as active writing context.
3. **Draft chapter**: Creator writes and receives continuity-checked editorial suggestions.
4. **Disrupt and recover**: Session abruptly terminates (browser closure, network drop, or CLI restart).
5. **Resume and export**: State is restored with source revision lineage and exported as a standardized JSON/Markdown manifest.

---

## Comparative analysis against existing alternative

### Alternative selected: Novelcrafter

[Novelcrafter](https://www.novelcrafter.com/) is a leading dedicated authoring platform offering a structured codex (series bible), BYOK model integration, and manuscript planning tools.

### Task-by-task comparison matrix

| Task / Dimension                         | Novelcrafter                                                       | Arcanea Creative Platform                                                                               | Arcanea Advantage / Tradeoff                                                            |
| :--------------------------------------- | :----------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------- |
| **Project initialization & codex setup** | Manual entry of codex entries, tags, and custom prompts.           | Automated lore/entity import via local markdown, MCP tools, and pre-built canon templates.              | Arcanea reduces manual setup time through native local harness and MCP integration.     |
| **Model context binding**                | Explicit manual snippet tagging (@mentions) in manuscript editor.  | Automated context retrieval via World Context Gateway (`@arcanea/mcp-server`) with exact source hashes. | Arcanea guarantees deterministic context boundaries with SHA-256 revision provenance.   |
| **Session recovery & state safety**      | Cloud autosave to proprietary backend. Local offline mode limited. | Local-first outbox with Postgres revision truth and atomic ledger settlement.                           | Arcanea guarantees zero-loss offline recovery and conflict-aware revision merging.      |
| **Extensibility & tool access**          | Closed web app; limited external IDE or terminal integrations.     | Open MCP protocol server callable from Claude Code, Cursor, Codex, and Web UI.                          | Arcanea supports multi-client continuity across local terminal, IDE, and web workspace. |

---

## Overlap resolution with accepted products

To prevent duplicate code, parallel databases, or orphaned abstractions, the responsibilities of each accepted product layer are strictly bounded:

```
                  +-----------------------------------+
                  |        Arcanea Web Workspace       |
                  |  (Primary visual authoring UI)    |
                  +-----------------+-----------------+
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|                     @arcanea/mcp-server & CLI                         |
|   - Setup and planning operations                                     |
|   - Local filesystem bridge & World Context Gateway                   |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|               Creation Engine & AI Gateway (Vercel)                   |
|   - Model routing (BYOK & managed multi-provider)                     |
|   - Atomic credit ledger & reservation runtime                        |
|   - Private asset store (Vercel Blob / R2)                            |
+-----------------------------------------------------------------------+
```

1. **Web workspace (`apps/web`)**: Owns the visual authoring UI, chapter editor, world manager, and account settings.
2. **MCP server (`packages/arcanea-mcp`)**: Owns local setup-planning tools, world persistence, context gateway, and IDE/harness integration.
3. **Creation Engine & AI Gateway**: Owns provider routing, atomic credit debits, asset storage, and background workflows.
4. **Setup-planning capability**: Embedded inside `@arcanea/mcp-server` and CLI tools; no separate "Arcanea Build" application is instantiated.

---

## Output schema and recovery acceptance criteria

### Standardized project output schema

Exported project outputs must conform to the following JSON structure:

```json
{
  "$schema": "https://arcanea.ai/schemas/world-manifest.v1.json",
  "projectId": "string (UUID v4)",
  "title": "string",
  "version": "1.0.0",
  "revisionHash": "string (SHA-256)",
  "entities": [
    {
      "id": "string",
      "name": "string",
      "type": "character | location | item | lore_rule",
      "summary": "string"
    }
  ],
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "sourceRevisions": ["string (SHA-256)"]
    }
  ],
  "exportedAt": "string (ISO-8601)"
}
```

### Recovery acceptance criteria

1. **Offline and network disruption recovery**:
   - Local edits created during a network drop must be saved in an indexed local outbox.
   - Upon reconnection, edits sync atomically without overwriting newer server revisions.
2. **Concurrent conflict resolution**:
   - If a revision conflict occurs, both revisions are retained as explicit branches.
   - The UI/CLI must present a side-by-side diff rather than silently applying a last-write-wins rule.
3. **Multi-client process restart**:
   - Killing the local CLI, MCP server, or browser process during active drafting must preserve all uncommitted drafts.
   - Re-opening the project on a secondary client restores the exact cursor position, entity selection, and unsaved revision state.
