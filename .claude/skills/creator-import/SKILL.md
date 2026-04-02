---
name: creator-import
description: Import, parse, and structure content from external AI tools and files into Arcanea projects. Use when importing ChatGPT exports, Claude conversation downloads, spreadsheets (CSV/XLSX), markdown docs, JSON data, Google Docs content, or any external content that needs to be organized into the Arcanea project graph. Handles bulk imports, conversation parsing, knowledge base ingestion, and content classification.
---

# Creator Import — Structure External Content Into Arcanea

## Core Workflow

### 1. Detect Source Type
Identify what's being imported:
- **ChatGPT export** (conversations.json or markdown) → parse conversations, extract creations, decisions, ideas
- **Claude export** (markdown conversations) → same parsing, different format
- **Spreadsheet** (CSV/XLSX) → use `/xlsx` skill for reading, then classify rows
- **Markdown docs** → parse headings as structure, body as content
- **JSON data** → schema-detect, map to Arcanea objects
- **Plain text dump** → AI-classify into categories
- **Image folder** → inventory, tag, register with `/vis-scan`

### 2. Classify Content
Map imported content to Arcanea object types:

| Detected Content | Maps To | Action |
|-----------------|---------|--------|
| Conversation about a project | Project + linked sessions | Create project, attach conversations |
| Character description | Character profile | Route to `/character-forge` |
| World-building notes | Lore doc | Validate with `/canon-check` |
| Story/chapter draft | Doc (type: story) | Create project doc |
| Image prompts | Creation briefs | Save as prompt book entries |
| Decision/strategy | Decision record | Route to `/lock-decision` |
| Research/analysis | Reference doc | Save as project reference |
| Task list / roadmap | Linear issues or project tasks | Create in Linear via MCP |
| Music/audio notes | Studio brief | Save as creation brief |

### 3. Structure Output
For each classified item, create the appropriate Arcanea object:

```
Project doc → apps/web/app/api/projects/[id]/docs (when docs system is live)
Memory → save via memory API
Creation → save via creation service
Linear issue → create via MCP
Notion page → create via MCP
Canon entry → validate then save to .arcanea/lore/
```

### 4. Generate Import Report
```
## Import Report — [DATE]

### Source: [filename or description]
### Items Found: [count]

| # | Type | Title | Mapped To | Status |
|---|------|-------|-----------|--------|
| 1 | Conversation | "Atlas world design" | Project + 3 docs | Created |
| 2 | Character | "Kaelen the Architect" | Character profile | Needs review |
| 3 | Decision | "Use R2 for storage" | Locked decision | Saved |

### Actions Taken
- Created project "[name]"
- Saved [X] documents
- Created [X] Linear issues
- Flagged [X] items for review
```

## ChatGPT Export Parsing

ChatGPT exports come as `conversations.json` with this structure:
```json
{
  "title": "conversation title",
  "mapping": {
    "node_id": {
      "message": {
        "author": {"role": "user|assistant"},
        "content": {"parts": ["text"]}
      }
    }
  }
}
```

Extract: title, all user messages as intent, all assistant messages as output, identify any code blocks, decisions, or creative content.

## Spreadsheet Import

Read with `/xlsx` skill. Then:
1. Detect header row
2. Classify columns (name, description, status, priority, date, URL, etc.)
3. Map rows to appropriate Arcanea objects
4. Offer: "Import as Linear issues? As project docs? As prompt book entries?"

## Bulk Image Import

For folders of images:
1. Inventory all files with sizes and formats
2. Suggest categorization (guardian, creation, reference, brand)
3. Generate alt texts using AI
4. Register in image registry
5. Upload to appropriate storage tier (repo /public/ vs R2 vs Supabase)
