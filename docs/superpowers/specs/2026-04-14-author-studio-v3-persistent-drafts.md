# Author Studio v3 — Persistent Drafts via Supabase

**Date:** 2026-04-14
**Status:** Planned (not yet implemented)
**Priority:** v3 — after Song of Van Linh reaches 10K+ words and Frank validates the workflow

## Problem

The v2 Author Studio saves to Vercel's ephemeral filesystem. Edits are lost on next deploy. Options considered:

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| Commit-on-save | Git is source of truth | Every save = rebuild; 1000s of commits; API rate limits; security | REJECTED |
| Supabase drafts | Fast, persistent, RLS | Two sources of truth, sync complexity | CHOSEN |
| Vercel Blob | Fast, purpose-built | Yet another dependency, same sync problem | Not needed |
| Local-only | Simplest | Kills Open Library vision | Acceptable for v2 (shipped) |

## v2 (Shipped): Honest Read-Only in Production

- API routes return 423 Locked when `VERCEL=1` or `NODE_ENV=production`
- Editor shows amber "Read-only preview" banner on lock response
- Local dev (`pnpm dev`) still has full save capability
- Claude Code with `/arcanea-author` remains the canonical write path

## v3 (Planned): Persistent Online Editing

### Architecture

```
Studio edit → POST /api/author/[book]/chapters/[chapter] → Supabase book_chapter_drafts
                                                                    ↓
Studio load ← GET same endpoint ← checks Supabase first, falls back to git file
                                                                    ↓
"Publish to Git" button → POST /api/author/[book]/publish → Commits draft to git
                                                          → Via GitHub API (not filesystem)
                                                          → Vercel redeploys
                                                          → Draft row cleared
```

### Database Schema

```sql
CREATE TABLE public.book_chapter_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_slug TEXT NOT NULL,
  chapter_slug TEXT NOT NULL,
  author_user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  content_json JSONB,
  word_count INT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (book_slug, chapter_slug, author_user_id)
);

-- RLS: only author can read/write their own drafts
ALTER TABLE book_chapter_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authors_own_drafts" ON book_chapter_drafts
  FOR ALL USING (auth.uid() = author_user_id);
```

### API Changes

**GET `/api/author/[bookSlug]/chapters/[chapterSlug]`**
1. Check Supabase for draft matching (book, chapter, authenticated user)
2. If draft exists and is newer than git file mtime, return draft
3. Otherwise return git file
4. Include `source: 'draft' | 'published'` in response

**POST `/api/author/[bookSlug]/chapters/[chapterSlug]`**
1. Require authenticated user (Supabase auth)
2. Verify user is an author of this book (via `book_authors` table)
3. UPSERT into `book_chapter_drafts`
4. No filesystem write

**POST `/api/author/[bookSlug]/publish`** (new)
1. Require authenticated author
2. Load current draft from Supabase
3. Use GitHub API (Octokit) to create a commit on `main` branch
4. Delete draft row on success
5. Return commit SHA

### Environment Variables

```
GITHUB_TOKEN=ghp_... (fine-grained, scoped to content-only writes in arcanea-ai-app)
GITHUB_REPO=frankxai/arcanea-ai-app
SUPABASE_SERVICE_ROLE_KEY=... (for draft CRUD)
```

### Why GitHub API (not git CLI)

- Vercel serverless functions can't run `git` (no binary, no .git directory)
- Octokit creates commits via REST API — works from any environment
- Scoped fine-grained token = minimum-privilege security

### Conflict Resolution

Last-write-wins per (book, chapter, user) pair. If Frank edits in CC and pushes to git while online draft exists, the git mtime comparison in GET surfaces the newer version. If both are recent, prefer git (canonical).

For true multi-user editing later: Yjs CRDT + Liveblocks or PartyKit. Out of scope for v3.

## Tasks for v3 Implementation

1. Create `book_chapter_drafts` migration with RLS
2. Update chapter GET to check drafts first
3. Update chapter POST to write to Supabase instead of filesystem
4. Create `/api/author/[bookSlug]/publish` with Octokit
5. Add "Publish to Git" button in book header
6. Update editor to show draft status (`Draft (unsaved)`, `Draft (saved)`, `Published`)
7. Remove the 423 locks from production
8. Document the flow in the workflow guide

## Success Criteria

- [ ] Frank edits a chapter in online Studio on his phone
- [ ] Edit persists across Vercel redeploys
- [ ] Frank hits "Publish to Git" → commit appears in GitHub within 10 seconds
- [ ] Vercel auto-redeploys with the new content
- [ ] Opening Claude Code and running `git pull` gets the edit
- [ ] Multi-device editing works (same account, different devices see same draft)

## Decision Log

**Why defer to v3:**
- v2 ships the Studio as a read-and-preview tool + local writing environment + AI companion
- Frank primarily writes in Claude Code right now (faster, deeper, filesystem-native)
- Supabase draft storage is 4-6 hours of proper work with migration, RLS, auth gates, Octokit integration
- Better to validate the workflow with the v2 shape before committing to the v3 architecture
- When Frank or another creator wants to write on mobile, that's the trigger for v3
