# Notes / Docs System Architecture — 2026-04-02

## Purpose

Define the Arcanea notes/docs system in a way that is:
- product-native
- graph-native
- BYOK-first compatible
- AI-ready
- collaboration-ready later
- commercially viable

This document is the system spec for Arcanea notes/docs.

## Product Goal

Arcanea notes/docs should become the place where users:
- think
- draft
- outline
- plan projects
- build world bibles
- store research
- maintain prompt books
- write longform content
- preserve canon and provenance

The system must feel like:
- Notion for clarity and structure
- Scrivener for longform/project organization
- Claude Projects for continuity
- Arcanea for graph-aware creative intelligence

## Core Product Principles

1. Docs are first-class graph objects.
2. Docs belong to projects by default, but can exist at workspace level.
3. AI should read, summarize, restructure, expand, and connect docs.
4. Docs should support versioning and provenance from day one.
5. Real-time collaboration is not phase one. Clean single-user graph power is.
6. The editor should be open enough for future Yjs collaboration, comments, and multiplayer.

## Recommendation

### Editor Choice

Use `Tiptap` as the notes/docs editor foundation.

Why:
- strong React/Next.js integration
- headless and customizable
- mature extension ecosystem
- collaboration path via Yjs/Hocuspocus if needed later
- JSON document model works well with graph-aware AI pipelines

Official references:
- Tiptap editor docs: https://tiptap.dev/docs
- Tiptap collaboration: https://tiptap.dev/docs/collaboration/getting-started/overview
- Tiptap collaboration extension + Yjs: https://tiptap.dev/docs/editor/extensions/functionality/collaboration

### Collaboration Path

Do not start with paid Tiptap cloud or full multiplayer.

Phase strategy:
- Phase 1: local + server-persisted document editing
- Phase 2: presence/comments/version diff
- Phase 3: Yjs collaboration using self-hosted Hocuspocus or Liveblocks if economics justify it

### Why Not BlockNote As Primary

BlockNote is strong and faster for Notion-like blocks, but its commercial story becomes more complex when you need XL features in closed-source apps.

Official reference:
- BlockNote pricing: https://www.blocknotejs.org/pricing

So the better long-term fit for Arcanea is:
- Tiptap as primary doc engine
- custom Arcanea block schema and graph semantics

## What Anthropic / Google / xAI Signal

### Anthropic

Anthropic’s current guidance points toward:
- context engineering over prompt bloat
- MCP as the connector standard
- subagents / isolated context windows for complex work
- code or structured outputs for durable operations

Official references:
- MCP docs: https://docs.anthropic.com/en/docs/mcp
- Context management: https://www.anthropic.com/news/context-management
- Claude Agent SDK article: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk/

Implication for Arcanea docs:
- docs should be chunkable and referenceable
- docs should be retrievable by section, not only whole-document
- doc operations should return structured results
- doc tooling should be MCP-friendly

### Google / Gemini

Google’s current guidance strongly supports:
- structured output
- long-context usage with disciplined prompt shape
- context caching to reduce repeated-context cost

Official references:
- Structured output: https://ai.google.dev/gemini-api/docs/structured-output
- Context caching: https://developers.googleblog.com/en/gemini-2-5-models-now-support-implicit-caching/
- Long context updates: https://developers.googleblog.com/en/new-features-for-the-gemini-api-and-google-ai-studio/

Implication for Arcanea docs:
- use JSON schema for doc transforms, summaries, extraction, and workflow actions
- keep stable system/project/doc prefixes for cache-friendly requests
- store summaries and chunks so the whole document is not resent every turn

### xAI / Grok

xAI’s docs emphasize:
- tools
- structured outputs
- collections search

Official references:
- xAI docs overview: https://docs.x.ai/
- Structured outputs: https://docs.x.ai/developers/model-capabilities/text/structured-outputs
- Docs MCP: https://docs.x.ai/developers/docs-mcp

Implication for Arcanea docs:
- docs should be indexable as project collections
- document transforms should support structured outputs
- retrieval should be tool-driven and project-scoped

## Arcanea Notes / Docs Object Model

## Primary Tables

### `project_docs`

Purpose:
- top-level document records

Fields:
- `id`
- `workspace_id`
- `project_id` nullable
- `user_id`
- `title`
- `slug`
- `icon`
- `cover_image_url`
- `status` (`draft`, `active`, `archived`, `published`)
- `doc_type` (`note`, `brief`, `outline`, `lore`, `research`, `prompt_book`, `spec`, `journal`)
- `source_thread_id` nullable
- `source_artifact_id` nullable
- `parent_doc_id` nullable
- `sort_order`
- `created_at`
- `updated_at`
- `last_edited_at`
- `last_ai_touched_at` nullable
- `metadata` jsonb

### `project_doc_content`

Purpose:
- current canonical editor state

Fields:
- `doc_id`
- `content_json` jsonb
- `content_text` text
- `word_count`
- `outline_json` jsonb
- `reading_time_minutes`
- `updated_at`

### `project_doc_versions`

Purpose:
- immutable history and AI provenance

Fields:
- `id`
- `doc_id`
- `version_number`
- `editor_type` (`human`, `ai`, `import`, `agent`)
- `author_user_id` nullable
- `author_agent_id` nullable
- `source_thread_id` nullable
- `content_json` jsonb
- `content_text` text
- `change_summary`
- `created_at`

### `project_doc_chunks`

Purpose:
- retrieval-ready semantic units

Fields:
- `id`
- `doc_id`
- `project_id`
- `user_id`
- `chunk_index`
- `heading_path`
- `text`
- `summary`
- `token_estimate`
- `embedding` vector
- `updated_at`

### `project_doc_links`

Purpose:
- graph edges between docs and other objects

Fields:
- `id`
- `project_id`
- `user_id`
- `source_type`
- `source_id`
- `target_type`
- `target_id`
- `relation`
- `metadata`
- `created_at`

### `project_doc_comments`

Purpose:
- future collaboration/comments

Fields:
- `id`
- `doc_id`
- `user_id`
- `anchor`
- `content`
- `resolved`
- `created_at`

### `project_doc_views`

Purpose:
- activity and ranking

Fields:
- `id`
- `doc_id`
- `user_id`
- `viewed_at`
- `source`

## Derived / Related Objects

Docs should connect to:
- `chat_sessions`
- `creations`
- `user_memories`
- `chat_projects`
- `project_graph_edges`
- `project_graph_summaries`

## Route Design

## Product Routes

### Project-Scoped

- `/projects/[id]/docs`
  - document index in project
- `/projects/[id]/docs/new`
  - create document
- `/projects/[id]/docs/[docId]`
  - editor view
- `/projects/[id]/docs/[docId]/history`
  - version timeline
- `/projects/[id]/docs/[docId]/outline`
  - structure view

### Workspace-Scoped

- `/docs`
  - all docs across workspace
- `/docs/[docId]`
  - canonical doc redirect / open
- `/docs/[docId]/history`
  - versions

### AI Surfaces

- `/projects/[id]/docs/[docId]/ask`
  - ask AI about this doc
- `/projects/[id]/docs/[docId]/rewrite`
  - structured rewrite tools

## API Routes

- `GET /api/projects/[id]/docs`
- `POST /api/projects/[id]/docs`
- `GET /api/projects/[id]/docs/[docId]`
- `PATCH /api/projects/[id]/docs/[docId]`
- `DELETE /api/projects/[id]/docs/[docId]`
- `POST /api/projects/[id]/docs/[docId]/save`
- `GET /api/projects/[id]/docs/[docId]/history`
- `POST /api/projects/[id]/docs/[docId]/restore`
- `POST /api/projects/[id]/docs/[docId]/summarize`
- `POST /api/projects/[id]/docs/[docId]/rewrite`
- `POST /api/projects/[id]/docs/[docId]/extract`
- `POST /api/projects/[id]/docs/[docId]/link`
- `POST /api/projects/[id]/docs/[docId]/comment`
- `GET /api/projects/[id]/docs/[docId]/graph`

## UX Design

### Phase 1 Experience

User can:
- create docs inside a project
- organize docs in a left sidebar
- see project-aware AI actions
- link docs to chats and creations
- ask AI to summarize, rewrite, extract facts, or convert to prompt book

The product should feel like:
- clean doc editor
- project-native, not generic note app
- AI actions in-context, not floating everywhere

### Phase 2 Experience

Add:
- comments
- version compare
- structure panel
- doc mentions / backlinks
- AI-generated outlines and doc-to-doc linking

### Phase 3 Experience

Add:
- real-time collaboration
- multiplayer presence
- review mode
- agent edits with approval flow

## Tech Stack

### Frontend

- Next.js App Router
- React 19
- Tiptap editor
- typed editor schema
- server actions or route handlers for saves depending on mutation shape

### Backend

- Supabase/Postgres
- pgvector for chunks
- activity log for traceability
- background jobs for chunking, summarization, and graph linking

### AI

- BYOK-first routing
- structured outputs for:
  - summary
  - outline
  - fact extraction
  - doc classification
  - doc links

### Later Collaboration

Choose one:
- self-hosted Yjs/Hocuspocus
- Liveblocks if speed outweighs infra cost

## Best-Practice Engineering Guidance

### Save Format

Store:
- canonical editor JSON
- plain text derivative
- outline derivative

Why:
- editor rendering
- retrieval
- exports
- diff/versioning

### Retrieval

Never retrieve whole docs blindly.

Retrieve:
- top matching chunks
- top headings
- doc summary
- selected facts

### Versioning

Every AI rewrite should create a version, not silently overwrite.

### Provenance

Each doc should optionally know:
- source project
- source thread
- source artifact
- source agent

### Graph Integration

Docs should create graph edges like:
- `belongs_to`
- `derived_from`
- `references`
- `expands`
- `supports`
- `canon_for`

## Phases

## Phase 1 — Notes/Docs MVP

Scope:
- project docs
- Tiptap editor
- project doc APIs
- save/load/version v1
- doc summary and chunk extraction
- project-aware chat can read docs

Expected build time:
- ~1.5 to 3 weeks of focused engineering

## Phase 2 — Graph-Aware Docs

Scope:
- doc chunks with embeddings
- backlinks
- doc graph view
- AI extraction pipelines
- doc provenance

Expected build time:
- ~1 to 2.5 weeks after Phase 1

## Phase 3 — Collaboration / Review

Scope:
- comments
- review mode
- realtime collaboration
- version compare

Expected build time:
- ~2 to 5 weeks depending on collaboration choice

## Production Cost

### Dev Cost

If built on current stack with Tiptap:
- moderate
- mostly feature and integration work, not research risk

If built from scratch editor:
- much higher
- worse velocity
- much higher maintenance burden

### Production Cost

Core docs system cost is low relative to media/generation.

Main costs:
- Postgres storage
- embeddings
- background summarization/extraction
- optional collaboration infra later

At scale:
- docs CRUD is cheap
- chunking/embeddings are manageable
- AI rewrite/summarize/extract becomes the main variable cost

This is why BYOK-first still works:
- user uses own provider for heavy generation
- Arcanea can use cheaper routing for chunking and extraction later

## Commercial Recommendation

Notes/docs should be included in the core subscription product layer.

Do not meter basic notes/docs usage.

Possible later monetization:
- advanced AI doc transforms
- premium exports
- team collaboration
- doc review workflows
- style-trained doc crews

## Recommendation For You

Build notes/docs before a serious whiteboard.

Why:
- higher immediate value
- lower cost
- stronger fit for Arcanea’s graph and memory system
- easier to connect to retrieval, provenance, and agent crews

Board/canvas should come after notes/docs are first-class.
