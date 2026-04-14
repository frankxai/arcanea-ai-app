# Author Studio — Design Spec

**Date:** 2026-04-14
**Status:** Approved (build tonight)
**Route:** `/studio/author`

## What We're Building

A book-first writing workspace where the AI sidebar has read your entire universe. Replace the existing mockup at `/studio/author` with a real, production writing environment built on the DocEditor (Novel/Tiptap) already in the codebase.

## Architecture

```
/studio/author
├── page.tsx                         # Dashboard: book selector with real data from disk
├── [bookSlug]/
│   ├── page.tsx                     # Redirects to first chapter
│   └── [chapterSlug]/
│       └── page.tsx                 # The workspace: editor + AI sidebar + chapter nav
└── components/
    ├── author-editor.tsx            # DocEditor adapted for markdown chapters
    ├── chapter-nav.tsx              # Left sidebar: chapter list, word counts, add new
    ├── author-ai-panel.tsx          # Right sidebar: AI companion with book context
    ├── character-tracker.tsx         # Characters detected in current chapter
    └── book-header.tsx              # Book title, status, word count, guardian score
```

## Phase 1: The Editor (Core)

### 1.1 Dashboard (`/studio/author/page.tsx`)
- Server component, loads books from disk using existing saga loader patterns
- Scans `book/` for directories with `book.yaml` manifests
- Shows: title, chapter count, word count, last modified, cover image
- "Continue Writing" → links to `/studio/author/[bookSlug]/[lastChapter]`
- "New Book" → creates directory + book.yaml scaffold
- Reuse the existing Card component from the mockup

### 1.2 Book Workspace (`/studio/author/[bookSlug]/[chapterSlug]/page.tsx`)
- Three-column layout: chapter nav (left) | editor (center) | AI companion (right)
- Collapsible sidebars for focused writing mode
- Chapter nav loads from `book/[slug]/chapters/*.md`
- Editor loads chapter markdown, renders in DocEditor
- Save writes markdown back to disk via API route

### 1.3 Chapter Loading & Saving
- **Read API:** `GET /api/author/[bookSlug]/chapters/[chapterSlug]`
  - Reads markdown from `book/[bookSlug]/chapters/[file].md`
  - Returns: `{ content: string, wordCount: number, title: string }`
- **Save API:** `POST /api/author/[bookSlug]/chapters/[chapterSlug]`
  - Writes markdown to disk
  - Returns: `{ success: true, wordCount: number }`
- **List API:** `GET /api/author/[bookSlug]/chapters`
  - Lists all chapters with metadata (word count, title, order)

### 1.4 Author Editor Component
- Wraps existing DocEditor with markdown conversion
- Input: raw markdown string
- Output: on save, converts Tiptap JSON back to markdown
- Auto-save with debounce (existing DocEditor already has this)
- Word count display in footer
- Markdown export: use a simple Tiptap-to-markdown serializer

## Phase 2: The Intelligence Layer

### 2.1 AI Companion (`/api/ai/author-chat`)
- Streaming endpoint using Vercel AI SDK (existing pattern)
- System prompt = arcanea-author rules (voice standards, canon rules, anti-slop list)
- Context injection:
  - Current chapter content (truncated to fit)
  - Character sheets from `book/[slug]/characters/*.md`
  - World bible from `book/[slug]/worldbuilding/*.md`
  - Story blueprint from `book/[slug]/outline/*.md`
- Model routing:
  - Default: Haiku (fast, cheap — site operator cost)
  - "Deep mode" toggle: Sonnet (user's own key via BYOK, or site key)
- Suggested prompts: "Review this scene", "Is this consistent with Ch.2?", "Suggest what happens next"

### 2.2 Character Tracker
- Scans current chapter for character names (matched against character sheet filenames)
- Shows: name, role, one-line description
- Click to expand full character diamond
- Static render, no AI needed — just string matching

### 2.3 Guardian Review Button
- "Request Guardian Review" button in the book header
- Triggers existing `guardian-scorer.ts` (already built and working)
- Shows results inline: composite score, per-guardian breakdown
- Rate limited: 1 per book per 24 hours (existing logic)

## Phase 3: Dashboard Wiring

### 3.1 Real Data
- Replace PROJECTS mock data with actual books from disk scan
- Replace AGENTS mock data with Guardian agent definitions
- Replace PIPELINE_BOOKS with actual book statuses from book.yaml
- Replace RECENT_ACTIONS with git log for the book directories

## Tech Decisions

| Decision | Choice | Reason |
|---|---|---|
| Editor | Existing DocEditor (Novel/Tiptap) | Already production-ready, installed, 415 lines |
| Markdown conversion | turndown + marked | Simple, well-tested, no new deps needed |
| AI streaming | Vercel AI SDK | Already used throughout the app |
| Storage | Filesystem (git-backed) | Git IS the version history — no DB needed for content |
| Book metadata | book.yaml | Already the standard for drafts system |
| State management | React hooks + URL state | Chapter selection in URL for shareable links |

## File Changes Summary

### New Files
- `app/studio/author/[bookSlug]/[chapterSlug]/page.tsx` — workspace
- `app/studio/author/components/author-editor.tsx` — editor wrapper
- `app/studio/author/components/chapter-nav.tsx` — chapter sidebar
- `app/studio/author/components/author-ai-panel.tsx` — AI companion
- `app/studio/author/components/character-tracker.tsx` — character detection
- `app/studio/author/components/book-header.tsx` — book status bar
- `app/api/author/[bookSlug]/chapters/route.ts` — list chapters
- `app/api/author/[bookSlug]/chapters/[chapterSlug]/route.ts` — read/write chapter
- `app/api/ai/author-chat/route.ts` — book-aware AI streaming

### Modified Files
- `app/studio/author/page.tsx` — replace mock data with real disk scan

## What Makes This Unique

1. The AI companion has read your character sheets, world bible, and previous chapters
2. Guardian reviews are from specialized literary agents, not generic grammar checking
3. Git-backed — every save is versioned, branch for experiments, full history
4. Canon-aware — the system knows CANON_LOCKED and can warn about contradictions
5. Publish pipeline — one click from editor to arcanea.ai/books/drafts/[slug]
