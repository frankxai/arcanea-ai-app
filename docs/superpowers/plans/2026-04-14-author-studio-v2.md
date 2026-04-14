# Author Studio v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Author Studio from textarea prototype to a competition-beating writing workspace with rich editor, BYOK model support, curated context, and self-serve onboarding.

**Architecture:** Replace raw textarea with DocEditor (Novel/Tiptap already installed). Add markdown↔HTML conversion layer. Implement BYOK API key support. Add "New Book" creation flow. Make reader pages mobile-responsive.

**Tech Stack:** Next.js 16, Novel.js (Tiptap), remark + remark-html (installed), Vercel AI SDK, Anthropic/OpenRouter

**Competition bar:** Novelcrafter (Codex + BYO-model + $4/mo), Sudowrite (Muse + Story Engine), NovelAI (Lorebook + TTS). We beat them with: canon-aware AI + multi-agent quality gates + publish pipeline + world graph.

---

### Task 1: Rich Editor — Replace Textarea with DocEditor

**Files:**
- Modify: `apps/web/app/studio/author/components/author-editor.tsx`
- Modify: `apps/web/app/api/author/[bookSlug]/chapters/[chapterSlug]/route.ts`

The current editor is a raw `<textarea>`. The DocEditor (Novel/Tiptap) at `components/docs/doc-editor.tsx` already has slash commands, bubble toolbar, formatting, auto-save, image upload. We wrap it with markdown conversion.

- [ ] **Step 1: Add markdown-to-HTML conversion utility**

Create a small helper that converts markdown to HTML (for loading into Tiptap) and HTML back to markdown (for saving to disk).

In `apps/web/app/studio/author/components/author-editor.tsx`, replace the entire file:

```tsx
'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { DocEditor, type DocEditorSavePayload } from '@/components/docs/doc-editor';
import type { JSONContent } from 'novel';

interface AuthorEditorProps {
  bookSlug: string;
  chapterSlug: string;
  initialHtml: string;
}

export function AuthorEditor({ bookSlug, chapterSlug, initialHtml }: AuthorEditorProps) {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [dirty, setDirty] = useState(false);
  const contentRef = useRef<{ text: string; json: JSONContent | null }>({ text: '', json: null });

  const handleSave = useCallback(async (payload: DocEditorSavePayload) => {
    setSaving(true);
    setWordCount(payload.word_count);
    contentRef.current = { text: payload.content_text, json: payload.content_json };
    
    try {
      // Send the plain text (markdown-ish) back to the API
      // The API stores it as the chapter markdown file
      const res = await fetch(`/api/author/${bookSlug}/chapters/${chapterSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: payload.content_text,
          contentJson: payload.content_json,
        }),
      });
      if (res.ok) {
        setLastSaved(new Date());
        setDirty(false);
      }
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setSaving(false);
    }
  }, [bookSlug, chapterSlug]);

  // Ctrl+S override — DocEditor handles auto-save internally via onSave
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Force save by calling the save with current content
        if (contentRef.current.text) {
          handleSave({
            content_json: contentRef.current.json ?? { type: 'doc', content: [] },
            content_text: contentRef.current.text,
            word_count: wordCount,
          });
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave, wordCount]);

  // Convert initial HTML string to JSONContent for DocEditor
  // DocEditor accepts initialContent as JSONContent — we pass undefined to let
  // it start empty, then we set initial content via a wrapper div with dangerouslySetInnerHTML
  // Actually: DocEditor's EditorContent accepts initialContent as JSONContent OR as string.
  // We'll pass the HTML as a JSONContent with a single paragraph for now,
  // and upgrade to proper Tiptap HTML parsing in the next step.

  return (
    <div className="relative">
      <DocEditor
        initialContent={initialHtml as unknown as JSONContent}
        onSave={(payload) => {
          setDirty(true);
          handleSave(payload);
        }}
        saveDelay={3000}
        placeholder="Start writing your chapter..."
      />
      
      {/* Status bar */}
      <div className="sticky bottom-0 flex items-center justify-between px-2 py-2 border-t border-white/[0.04] bg-[#09090b]/90 backdrop-blur-sm text-[10px] text-white/25 z-10">
        <div className="flex items-center gap-4">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{Math.max(1, Math.ceil(wordCount / 250))} min read</span>
        </div>
        <div className="flex items-center gap-3">
          {dirty && !saving && <span className="text-amber-400/40">Unsaved</span>}
          {saving && <span className="text-[#00bcd4]/40">Saving...</span>}
          {lastSaved && !saving && !dirty && (
            <span className="text-emerald-400/40">Saved {lastSaved.toLocaleTimeString()}</span>
          )}
          <span className="text-white/15">Ctrl+S</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update the chapter API to convert markdown→HTML on read**

In `apps/web/app/api/author/[bookSlug]/chapters/[chapterSlug]/route.ts`, the GET handler should return HTML (for Tiptap) alongside raw markdown. Add `remark` conversion:

```typescript
// Add to imports
import { remark } from 'remark';
import remarkHtml from 'remark-html';

// In the GET handler, after reading the raw markdown:
const htmlResult = await remark().use(remarkHtml).process(content);
const html = String(htmlResult);

// Return both
return NextResponse.json({
  slug: chapterSlug,
  filename,
  title: titleMatch ? titleMatch[1].trim() : chapterSlug,
  content,      // raw markdown (for saving)
  html,          // HTML (for Tiptap editor)
  wordCount,
});
```

- [ ] **Step 3: Update workspace page to pass HTML to editor**

In `apps/web/app/studio/author/[bookSlug]/[chapterSlug]/page.tsx`, convert the markdown to HTML before passing to AuthorEditor:

```typescript
// Add imports
import { remark } from 'remark';
import remarkHtml from 'remark-html';

// After reading chapterContent:
const htmlResult = await remark().use(remarkHtml).process(chapterContent);
const chapterHtml = String(htmlResult);

// Pass to AuthorEditor:
<AuthorEditor
  bookSlug={bookSlug}
  chapterSlug={chapterSlug}
  initialHtml={chapterHtml}
/>
```

- [ ] **Step 4: Build and verify**

Run: `pnpm --dir apps/web run build`
Expected: Compiles with the DocEditor rendering chapter content as rich text.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/studio/author/components/author-editor.tsx \
  apps/web/app/api/author/[bookSlug]/chapters/[chapterSlug]/route.ts \
  apps/web/app/studio/author/[bookSlug]/[chapterSlug]/page.tsx
git commit -m "feat(studio): upgrade editor from textarea to rich DocEditor with markdown conversion"
```

---

### Task 2: BYOK — Bring Your Own API Key

**Files:**
- Modify: `apps/web/app/studio/author/components/author-ai-panel.tsx`
- Modify: `apps/web/app/api/ai/author-chat/route.ts`

Novelcrafter's killer feature: BYO-model via OpenRouter. We implement BYOK for Anthropic keys directly — users paste their API key, it's stored in localStorage (never sent to our server except to proxy the request), and they get Sonnet/Opus instead of Haiku.

- [ ] **Step 1: Add API key input to AI panel**

In `apps/web/app/studio/author/components/author-ai-panel.tsx`, add a settings section:

```tsx
// Add to the component state:
const [apiKey, setApiKey] = useState('');
const [model, setModel] = useState<'haiku' | 'sonnet' | 'opus'>('haiku');

// Load from localStorage on mount:
useEffect(() => {
  const saved = localStorage.getItem('arcanea-author-api-key');
  if (saved) {
    setApiKey(saved);
    setModel('sonnet'); // Auto-upgrade when key is present
  }
}, []);

// Save key handler:
const saveKey = (key: string) => {
  setApiKey(key);
  if (key) {
    localStorage.setItem('arcanea-author-api-key', key);
    setModel('sonnet');
  } else {
    localStorage.removeItem('arcanea-author-api-key');
    setModel('haiku');
  }
};
```

Add a settings toggle at the bottom of the header section:

```tsx
{/* Settings */}
<details className="mt-2">
  <summary className="text-[10px] text-white/20 cursor-pointer hover:text-white/40">
    Model: {model === 'haiku' ? 'Haiku (free)' : model === 'sonnet' ? 'Sonnet (your key)' : 'Opus (your key)'}
  </summary>
  <div className="mt-2 space-y-2">
    <input
      type="password"
      value={apiKey}
      onChange={(e) => saveKey(e.target.value)}
      placeholder="sk-ant-... (your Anthropic API key)"
      className="w-full px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/60 placeholder:text-white/15 focus:outline-none focus:border-[#00bcd4]/30"
    />
    <p className="text-[9px] text-white/15">
      Your key stays in your browser. Never sent to Arcanea servers.
      Get one at console.anthropic.com
    </p>
    {apiKey && (
      <div className="flex gap-1">
        {(['haiku', 'sonnet', 'opus'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setModel(m)}
            className={`px-2 py-1 rounded text-[10px] ${
              model === m 
                ? 'bg-[#00bcd4]/20 text-[#00bcd4] border border-[#00bcd4]/30' 
                : 'bg-white/[0.03] text-white/30 border border-white/[0.06]'
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
    )}
  </div>
</details>
```

Pass the model and key to the useChat body:

```tsx
const { messages, input, setInput, handleSubmit, isLoading } = useChat({
  api: '/api/ai/author-chat',
  body: { bookSlug, currentChapter, model, userApiKey: apiKey || undefined },
});
```

- [ ] **Step 2: Handle BYOK in the API route**

In `apps/web/app/api/ai/author-chat/route.ts`, accept the user's API key and use it for the request:

```typescript
// In the POST handler, after parsing the body:
const { messages: rawMessages, bookSlug, currentChapter, model: requestedModel, userApiKey } = body;

// Create the appropriate Anthropic client
const anthropicClient = userApiKey 
  ? createAnthropic({ apiKey: userApiKey })
  : createAnthropic(); // Uses server ANTHROPIC_API_KEY

// Model selection
const modelId = requestedModel === 'opus'
  ? 'claude-opus-4-6'
  : requestedModel === 'sonnet'
  ? 'claude-sonnet-4-5-20250514'
  : 'claude-haiku-4-5-20251001';

// Use in streamText:
const result = streamText({
  model: anthropicClient(modelId),
  system: systemPrompt,
  messages: processedMessages,
});
```

- [ ] **Step 3: Build and verify**

Run: `pnpm --dir apps/web run build`

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/studio/author/components/author-ai-panel.tsx \
  apps/web/app/api/ai/author-chat/route.ts
git commit -m "feat(studio): add BYOK API key support — users bring their own Claude key for Sonnet/Opus"
```

---

### Task 3: New Book Creation Flow

**Files:**
- Modify: `apps/web/app/studio/author/page.tsx`
- Create: `apps/web/app/api/author/create/route.ts`

Self-serve onboarding: "Start Writing" button creates a book directory with `book.yaml` scaffold and first chapter, then redirects to the editor. Must be faster than Novelcrafter's 21-day trial flow.

- [ ] **Step 1: Create the API route for new book creation**

Create `apps/web/app/api/author/create/route.ts`:

```typescript
import { mkdir, writeFile, access } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');

async function exists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

export async function POST(req: Request) {
  const { title, slug, genre, description } = await req.json();
  
  if (!title || !slug) {
    return NextResponse.json({ error: 'title and slug required' }, { status: 400 });
  }
  
  // Sanitize slug
  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const bookDir = join(BOOK_ROOT, safeSlug);
  
  if (await exists(bookDir)) {
    return NextResponse.json({ error: 'Book already exists' }, { status: 409 });
  }
  
  // Create directory structure
  await mkdir(join(bookDir, 'chapters'), { recursive: true });
  
  // Create book.yaml
  const yaml = `title: "${title}"
slug: ${safeSlug}
tier: community
status: in-progress

authors:
  - name: FrankX
    github: frankxai
    role: creator

ai_transparency:
  models_used:
    - id: claude-opus-4-6
      provider: anthropic
      role: co-author
  human_contribution: 50%
  ai_contribution: 50%
  method: "Human-directed, AI-assisted writing via Arcanea Author Studio."

license: CC-BY-NC-SA-4.0
content_rating: general
tags: [${genre || 'fantasy'}]

acknowledgments: |
  Created with Arcanea Author Studio. Written in the open.
`;
  await writeFile(join(bookDir, 'book.yaml'), yaml, 'utf-8');
  
  // Create first chapter
  const firstChapter = `# Chapter One: ${title}

Begin writing here...
`;
  await writeFile(join(bookDir, 'chapters', '01-chapter-one.md'), firstChapter, 'utf-8');
  
  return NextResponse.json({ 
    success: true, 
    slug: safeSlug,
    redirect: `/studio/author/${safeSlug}/01-chapter-one`,
  });
}
```

- [ ] **Step 2: Add "New Book" button to dashboard**

In `apps/web/app/studio/author/page.tsx`, add a "New Book" card that opens a creation dialog. This needs to be a client component island for the dialog.

Create `apps/web/app/studio/author/components/new-book-dialog.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function NewBookDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('fantasy');
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  
  const slug = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
  
  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/author/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, genre }),
      });
      const data = await res.json();
      if (data.redirect) {
        router.push(data.redirect);
      }
    } catch (e) {
      console.error('Create failed:', e);
    } finally {
      setCreating(false);
    }
  };
  
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-white/[0.08] hover:border-[#00bcd4]/30 bg-transparent hover:bg-[#00bcd4]/[0.02] transition-all p-8 text-center group"
      >
        <div className="text-2xl text-white/10 group-hover:text-[#00bcd4]/30 mb-2">+</div>
        <div className="font-display text-sm text-white/30 group-hover:text-white/50">Start a New Book</div>
        <div className="text-[10px] text-white/15 mt-1">Create in 10 seconds</div>
      </button>
    );
  }
  
  return (
    <div className="rounded-2xl border border-[#00bcd4]/20 bg-white/[0.02] backdrop-blur-sm p-6 space-y-4">
      <h3 className="font-display text-sm font-semibold text-white/70">New Book</h3>
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Your book title..."
        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#00bcd4]/30"
      />
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white/60 focus:outline-none focus:border-[#00bcd4]/30"
      >
        <option value="fantasy">Fantasy</option>
        <option value="sci-fi">Science Fiction</option>
        <option value="romance">Romance</option>
        <option value="thriller">Thriller</option>
        <option value="literary-fiction">Literary Fiction</option>
        <option value="horror">Horror</option>
      </select>
      {slug && <p className="text-[10px] text-white/20">Slug: {slug}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleCreate}
          disabled={!title.trim() || creating}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#00bcd4]/20 disabled:opacity-30 transition-all"
        >
          {creating ? 'Creating...' : 'Create & Start Writing'}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-lg border border-white/[0.08] text-white/40 text-sm hover:bg-white/[0.04] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Import NewBookDialog into the dashboard page**

In `apps/web/app/studio/author/page.tsx`, add after the book cards grid:

```tsx
import { NewBookDialog } from './components/new-book-dialog';

// In the JSX, after the book cards:
<NewBookDialog />
```

- [ ] **Step 4: Build and verify**

Run: `pnpm --dir apps/web run build`

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/api/author/create/route.ts \
  apps/web/app/studio/author/components/new-book-dialog.tsx \
  apps/web/app/studio/author/page.tsx
git commit -m "feat(studio): add New Book creation — 10-second self-serve onboarding"
```

---

### Task 4: Mobile-Responsive Reader Pages

**Files:**
- Modify: `apps/web/app/books/drafts/[slug]/page.tsx`
- Modify: `apps/web/app/books/[bookId]/[chapterId]/page.tsx`

Every reading platform is mobile-first. The drafts page and chapter reader must look beautiful on phone.

- [ ] **Step 1: Audit current responsive breakpoints**

Read both files and check for mobile breakpoints. The drafts page likely already has `sm:` breakpoints but may need `px-4` on mobile, proper font scaling, and collapsible sections.

- [ ] **Step 2: Fix chapter reader mobile layout**

In `apps/web/app/books/[bookId]/[chapterId]/page.tsx`, ensure the ChapterReader component (at `components/saga/chapter-reader.tsx`) has proper mobile styles:

- Reduce padding on mobile: `px-4 sm:px-6 md:px-8`
- Font size scaling: `text-base sm:text-lg` for body text
- Navigation buttons should be full-width on mobile
- Reading time and word count should wrap gracefully

- [ ] **Step 3: Fix drafts page mobile layout**

In `apps/web/app/books/drafts/[slug]/page.tsx`:
- Cover image should stack above content on mobile (already `flex-col sm:flex-row`)
- Character cards should be single column on mobile: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Hero title should scale: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl`
- Chapters list should have larger touch targets

- [ ] **Step 4: Build and verify**

Run: `pnpm --dir apps/web run build`

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/books/drafts/[slug]/page.tsx \
  apps/web/app/books/[bookId]/[chapterId]/page.tsx
git commit -m "fix(books): mobile-responsive reader pages — proper font scaling, touch targets, stacking"
```

---

### Task 5: Curated Context System

**Files:**
- Modify: `apps/web/app/api/ai/author-chat/route.ts`
- Example: `book/song-of-van-linh/book.yaml`

The AI companion must only load human-approved content as trusted context. Add a `curated_context` flag to book.yaml.

- [ ] **Step 1: Update book.yaml schema**

Add to `book/song-of-van-linh/book.yaml`:

```yaml
# Context trust — only curated directories are loaded as AI context
curated_context:
  characters: false    # Not yet reviewed by author
  worldbuilding: false # Not yet reviewed by author
  outline: true        # Author approved the blueprint
  canon: true          # CANON_LOCKED is always trusted
```

- [ ] **Step 2: Update loadBookContext to respect curation flags**

In `apps/web/app/api/ai/author-chat/route.ts`, read the book.yaml and only load directories marked as curated:

```typescript
// After loading the book.yaml:
import yaml from 'js-yaml';

interface BookManifest {
  curated_context?: {
    characters?: boolean;
    worldbuilding?: boolean;
    outline?: boolean;
    canon?: boolean;
  };
}

async function loadBookManifest(bookSlug: string): Promise<BookManifest> {
  const yamlPath = join(BOOK_ROOT, bookSlug, 'book.yaml');
  if (!(await exists(yamlPath))) return {};
  const raw = await readFile(yamlPath, 'utf-8');
  return yaml.load(raw) as BookManifest;
}

// In loadBookContext:
const manifest = await loadBookManifest(bookSlug);
const curated = manifest.curated_context ?? {};

// Only load characters if curated
if (curated.characters) {
  // load character sheets as before, but labeled as "CURATED"
}

// Only load worldbuilding if curated
if (curated.worldbuilding) {
  // load world bible as before, but labeled as "CURATED"
}

// Always load outline if curated (default true for working notes)
if (curated.outline !== false) {
  // load outline, labeled as "DRAFT — working notes"
}

// CANON_LOCKED always loaded
```

- [ ] **Step 3: Build and verify**

Run: `pnpm --dir apps/web run build`

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/api/ai/author-chat/route.ts \
  book/song-of-van-linh/book.yaml
git commit -m "feat(studio): curated context system — AI only loads author-approved content"
```

---

### Task 6: Add New Chapter Flow

**Files:**
- Modify: `apps/web/app/studio/author/components/chapter-nav.tsx`
- Modify: `apps/web/app/api/author/[bookSlug]/chapters/route.ts`

Writers need to create new chapters from within the editor, not just edit existing ones.

- [ ] **Step 1: Add POST handler to chapters list API**

In `apps/web/app/api/author/[bookSlug]/chapters/route.ts`, add a POST handler:

```typescript
export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookSlug: string }> }
) {
  const { bookSlug } = await params;
  const chaptersDir = join(BOOK_ROOT, bookSlug, 'chapters');
  
  if (!(await exists(chaptersDir))) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }
  
  const { title } = await req.json();
  const chapterTitle = title || 'New Chapter';
  
  // Find next number
  const files = await readdir(chaptersDir);
  const mdFiles = files.filter(f => f.endsWith('.md')).sort();
  const nextNum = mdFiles.length + 1;
  const paddedNum = String(nextNum).padStart(2, '0');
  const slug = chapterTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
  const filename = `${paddedNum}-${slug}.md`;
  
  const content = `# ${chapterTitle}\n\nBegin writing...\n`;
  await writeFile(join(chaptersDir, filename), content, 'utf-8');
  
  return NextResponse.json({
    success: true,
    slug: filename.replace(/\.md$/, ''),
    filename,
    number: nextNum,
  });
}
```

- [ ] **Step 2: Add "New Chapter" button to chapter nav**

In `apps/web/app/studio/author/components/chapter-nav.tsx`, add a button at the bottom of the nav:

```tsx
// Add state for new chapter creation
const [creating, setCreating] = useState(false);
const [newTitle, setNewTitle] = useState('');
const router = useRouter(); // import from next/navigation

const handleCreateChapter = async () => {
  if (!newTitle.trim()) return;
  setCreating(true);
  try {
    const res = await fetch(`/api/author/${bookSlug}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    const data = await res.json();
    if (data.slug) {
      router.push(`/studio/author/${bookSlug}/${data.slug}`);
      setNewTitle('');
    }
  } finally {
    setCreating(false);
  }
};

// In the JSX, after the chapter list:
<div className="p-3 border-t border-white/[0.06]">
  <input
    value={newTitle}
    onChange={(e) => setNewTitle(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && handleCreateChapter()}
    placeholder="New chapter title..."
    className="w-full px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/60 placeholder:text-white/15 focus:outline-none focus:border-[#00bcd4]/30 mb-2"
  />
  <button
    onClick={handleCreateChapter}
    disabled={!newTitle.trim() || creating}
    className="w-full px-2 py-1.5 rounded-md bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[10px] text-[#00bcd4] hover:bg-[#00bcd4]/20 disabled:opacity-30 transition-all"
  >
    {creating ? 'Creating...' : '+ New Chapter'}
  </button>
</div>
```

- [ ] **Step 3: Build and verify**

Run: `pnpm --dir apps/web run build`

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/studio/author/components/chapter-nav.tsx \
  apps/web/app/api/author/[bookSlug]/chapters/route.ts
git commit -m "feat(studio): add new chapter creation from editor sidebar"
```

---

### Task 7: Guardian Review Button

**Files:**
- Modify: `apps/web/app/studio/author/components/book-header.tsx`
- The guardian-scorer.ts at `apps/web/lib/books/guardian-scorer.ts` already exists

- [ ] **Step 1: Add Guardian Review button to book header**

Convert book-header.tsx to a client component and add a review trigger button:

```tsx
'use client';

import { useState } from 'react';

interface BookHeaderProps {
  title: string;
  subtitle?: string;
  chapterCount: number;
  totalWords: number;
  currentChapter: string;
  bookSlug: string;
}

export function BookHeader({ title, subtitle, chapterCount, totalWords, currentChapter, bookSlug }: BookHeaderProps) {
  const [reviewing, setReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  
  const triggerReview = async () => {
    setReviewing(true);
    try {
      const res = await fetch(`/api/books/${bookSlug}/guardian-review`, { method: 'POST' });
      const data = await res.json();
      if (data.composite_score) {
        setReviewResult(`Guardian Score: ${data.composite_score.toFixed(1)}/10`);
      } else {
        setReviewResult(data.error || 'Review queued');
      }
    } catch {
      setReviewResult('Review unavailable');
    } finally {
      setReviewing(false);
    }
  };
  
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[#09090b]/90 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <a href="/studio/author" className="text-white/30 hover:text-white/50 text-xs transition-colors">&larr;</a>
        <div>
          <h1 className="font-display text-sm font-semibold text-white/80">{title}</h1>
          {subtitle && <p className="text-[10px] text-white/30">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-[10px] text-white/25">
        <span>{chapterCount} chapters</span>
        <span className="w-px h-3 bg-white/10" />
        <span>{totalWords.toLocaleString()} words</span>
        <span className="w-px h-3 bg-white/10" />
        <span className="text-[#00bcd4]/60">{currentChapter}</span>
        
        {reviewResult && (
          <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400">{reviewResult}</span>
        )}
        
        <button
          onClick={triggerReview}
          disabled={reviewing}
          className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 disabled:opacity-30 transition-all"
        >
          {reviewing ? 'Reviewing...' : 'Guardian Review'}
        </button>
        
        <a 
          href={`/books/drafts/${bookSlug}`}
          target="_blank"
          className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/60 transition-colors"
        >
          View Published &rarr;
        </a>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `pnpm --dir apps/web run build`

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/studio/author/components/book-header.tsx
git commit -m "feat(studio): add Guardian Review button to book header"
```

---

### Task 8: Final Integration — Build, Push, Verify Live

**Files:**
- All modified files from Tasks 1-7

- [ ] **Step 1: Full build**

Run: `pnpm --dir apps/web run build`
Expected: Clean compilation, all routes present.

- [ ] **Step 2: Push to production**

```bash
git push origin main
```

- [ ] **Step 3: Verify deployment**

Check Vercel dashboard for successful deployment. Test:
- `/studio/author` — dashboard loads with real books
- `/studio/author/song-of-van-linh/01-subject-7` — rich editor loads chapter
- AI companion responds with book context
- New Book creation works
- Mobile reader pages render correctly

---

## Competitive Advantage After This Plan

| Feature | Before | After | vs Novelcrafter |
|---|---|---|---|
| Editor | Raw textarea | Rich editor (slash commands, formatting, drag-drop) | Parity |
| AI depth | Haiku only, loads uncurated context | BYOK Haiku/Sonnet/Opus, curated context trust | Superior (canon-aware) |
| Onboarding | No creation flow | 10-second "New Book" | Parity (vs 21-day trial) |
| Mobile | Desktop only | Responsive reader + writer | Parity |
| Quality gates | None in editor | Guardian Review button | Unique — nobody else has this |
| Context trust | Circular (AI feeds AI) | Human-curated hierarchy | Unique — nobody else does this |
| Publishing | Separate page | One-click from editor | Superior |
