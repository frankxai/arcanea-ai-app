# Arcanea: The Hybrid Architecture (FINAL)

**Created:** 2025-12-16
**Insight:** Different jobs need different tools. Don't force one stack to do everything.

---

## 🎯 The Two-Stack Solution

### System A: Arcanea Content Universe (Internal)
**Purpose:** Writers create, manage, and publish the Arcanea story universe
**Stack:** Obsidian + Keystatic + Astro + Cloudflare
**Users:** You, co-authors, lore contributors

### System B: Arcanea.AI Platform (Public)
**Purpose:** Social hub, agent experiences, creator tools, community
**Stack:** Next.js 16 + Vercel + Convex/Supabase + MCP agents
**Users:** Readers, fans, creators, community

---

## 📁 Monorepo Architecture

```
arcanea/
├── README.md
├── package.json (workspace root)
├── turbo.json (Turborepo config)
│
├── apps/
│   ├── content/                    # System A: Content Universe
│   │   ├── .obsidian/              # Obsidian workspace
│   │   ├── content/                # Git-based content
│   │   │   ├── books/
│   │   │   │   ├── book-1/
│   │   │   │   │   ├── chapters/
│   │   │   │   │   ├── characters/
│   │   │   │   │   └── locations/
│   │   │   ├── lore/
│   │   │   └── worlds/
│   │   ├── public/                 # Static assets
│   │   ├── src/                    # Astro site
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── layouts/
│   │   ├── keystatic.config.ts     # CMS config
│   │   ├── astro.config.mjs
│   │   └── package.json
│   │
│   └── platform/                   # System B: Public Platform
│       ├── apps/
│       │   ├── web/                # Main Next.js app (arcanea.ai)
│       │   │   ├── app/
│       │   │   │   ├── (marketing)/     # Landing, about
│       │   │   │   ├── (app)/           # Authenticated app
│       │   │   │   │   ├── chat/
│       │   │   │   │   ├── create/
│       │   │   │   │   ├── discover/
│       │   │   │   │   └── profile/
│       │   │   │   └── api/             # API routes
│       │   │   ├── components/
│       │   │   ├── lib/
│       │   │   └── package.json
│       │   │
│       │   └── admin/              # Admin dashboard (optional)
│       │       ├── app/
│       │       ├── components/
│       │       └── package.json
│       │
│       └── packages/
│           ├── ui/                 # Shared React components
│           ├── database/           # Convex/Supabase client
│           ├── ai/                 # AI integrations
│           └── config/             # Shared configs
│
├── packages/
│   ├── content-api/                # API to access content
│   │   ├── src/
│   │   │   ├── reader.ts           # Read from Git content
│   │   │   ├── search.ts           # Meilisearch integration
│   │   │   └── export.ts           # EPUB, PDF generation
│   │   └── package.json
│   │
│   ├── ai-core/                    # Shared AI logic
│   │   ├── src/
│   │   │   ├── luminors/           # AI personalities
│   │   │   ├── workflows/          # LangGraph/Inngest
│   │   │   └── agents/             # Eliza agents
│   │   └── package.json
│   │
│   └── design-system/              # Shared design tokens
│       ├── tokens/                 # Design tokens (JSON)
│       ├── tailwind.config.ts      # For Next.js
│       ├── panda.config.ts         # For Astro
│       └── package.json
│
├── .claude/                        # Claude Code agents
│   ├── agents/
│   ├── skills/
│   └── commands/
│
└── infrastructure/
    ├── docker-compose.yml          # Local dev (Meilisearch, etc.)
    └── cloudflare/                 # CF workers, R2 config
```

---

## 🔄 How The Two Systems Interact

### Data Flow

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  OBSIDIAN (Writing)                                  │
│  ├─ Write chapters                                   │
│  ├─ Manage characters                                │
│  └─ Build world lore                                 │
│                                                      │
│              ↓ (Git commit)                          │
│                                                      │
│  GITHUB (Single Source of Truth)                     │
│  └─ content/ (markdown + MDX files)                  │
│                                                      │
│         ↙                    ↘                       │
│                                                      │
│  KEYSTATIC (Edit)        CONTENT-API (Read)          │
│  ├─ Visual editor        ├─ Parse markdown           │
│  └─ Publish workflow     ├─ Generate EPUB/PDF        │
│                          └─ Search index              │
│         ↓                           ↓                │
│                                                      │
│  ASTRO (Reading)         NEXT.JS (Platform)          │
│  ├─ Static book site     ├─ Chat with Luminors       │
│  ├─ Fast, SEO-ready      ├─ Community features       │
│  └─ docs.arcanea.ai      └─ Creator tools            │
│                          └─ app.arcanea.ai           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Shared Package: `content-api`

```typescript
// packages/content-api/src/reader.ts
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const CONTENT_PATH = '../apps/content/content'

export async function getChapter(slug: string) {
  const filePath = join(CONTENT_PATH, 'books/book-1/chapters', `${slug}.mdx`)
  const fileContents = readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    metadata: data,
    content,
    slug
  }
}

export async function getAllChapters() {
  const chaptersPath = join(CONTENT_PATH, 'books/book-1/chapters')
  const files = readdirSync(chaptersPath)

  return Promise.all(
    files
      .filter(file => file.endsWith('.mdx'))
      .map(file => getChapter(file.replace('.mdx', '')))
  )
}

export async function getCharacter(slug: string) {
  const filePath = join(CONTENT_PATH, 'books/book-1/characters', `${slug}.md`)
  const fileContents = readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return { metadata: data, content, slug }
}
```

**Both apps import this package:**

```typescript
// apps/content/src/pages/chapters/[slug].astro
import { getChapter } from '@arcanea/content-api'

export async function getStaticPaths() {
  const chapters = await getAllChapters()
  return chapters.map(chapter => ({
    params: { slug: chapter.slug },
    props: { chapter }
  }))
}

const { chapter } = Astro.props
const { Content } = await chapter.render()
```

```typescript
// apps/platform/apps/web/app/read/[slug]/page.tsx
import { getChapter } from '@arcanea/content-api'

export default async function ReadPage({ params }: { params: { slug: string } }) {
  const chapter = await getChapter(params.slug)

  return (
    <div>
      <h1>{chapter.metadata.title}</h1>
      <MDXContent content={chapter.content} />
    </div>
  )
}
```

---

## 🎨 System A: Content Universe (Internal)

### Purpose
**For:** Authors, lore contributors, world-builders
**Goal:** Create and manage the Arcanea story universe efficiently

### Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Writing** | Obsidian | Writers love it, graph view, offline |
| **CMS** | Keystatic | Git-based, visual editor for non-devs |
| **Frontend** | Astro 4 | Static-first, perfect for books/docs |
| **Styling** | Panda CSS | Type-safe design system |
| **Search** | Meilisearch | Typo-tolerant content search |
| **Hosting** | Cloudflare Pages | Free, fast, global CDN |
| **Storage** | Cloudflare R2 | Images, audio (10x cheaper than Vercel) |
| **Domain** | docs.arcanea.ai | Reading experience |

### URLs

- **Reading site:** https://docs.arcanea.ai or https://read.arcanea.ai
- **Admin CMS:** https://docs.arcanea.ai/keystatic

### Features

✅ Beautiful reading experience (book chapters)
✅ Fast (static HTML, <10kb JS)
✅ SEO-optimized (Google indexes everything)
✅ Offline-capable (PWA)
✅ Print-friendly (EPUB, PDF export)
✅ Search (Meilisearch)
✅ Version history (Git)

### Cost
**~$10/month** (Cloudflare R2 + Meilisearch VPS)

---

## 🚀 System B: Arcanea.AI Platform (Public)

### Purpose
**For:** Readers, fans, creators, community
**Goal:** Social hub, AI chat, creation tools, monetization

### Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | Next.js 16 | Best for interactive apps |
| **Database** | Convex or Supabase | Real-time, TypeScript-first |
| **Auth** | Clerk or Supabase Auth | Social login, easy setup |
| **Styling** | Tailwind + shadcn/ui | Fast iteration, great DX |
| **Components** | Magic UI + Aceternity | Cosmic animations |
| **AI** | Claude API + MCP | Chat, agents, tools |
| **Payments** | Lemon Squeezy | Handles tax |
| **Hosting** | Vercel | Best DX for Next.js |
| **Domain** | app.arcanea.ai | Main platform |

## URLs

- **Production:** https://www.arcanea.ai (main platform)
- **Vercel domain:** https://arcanea-ai-app.vercel.app (public)
- **Marketing:** https://arcanea.ai (redirects to www)

**Note:** The domain `app.arcanea.ai` mentioned in older docs is not currently in use. The primary production domain is `www.arcanea.ai`.

### Features

✅ Chat with Luminor AI agents
✅ Create and share stories/art
✅ Community feed (discovery)
✅ User profiles and bonds
✅ Subscriptions and payments
✅ Real-time interactions
✅ Creator dashboard
✅ MCP agent integrations

### Cost
**~$50-100/month** (Vercel Pro + Convex + Lemon Squeezy fees)

---

## 💡 Why This Hybrid Approach Wins

### Problem with "One Stack for Everything"

**If you use Astro for everything:**
- ❌ Real-time features harder (chat, notifications)
- ❌ Complex state management awkward
- ❌ MCP agent integration less natural
- ❌ Dashboard UIs need more work

**If you use Next.js for everything:**
- ❌ Overkill for static content (books)
- ❌ Slower page loads (100kb+ bundles)
- ❌ Higher costs (Vercel bandwidth)
- ❌ Writers don't want to use a code editor

### Solution: Specialized Tools for Specialized Jobs

| Job | Best Tool | Why |
|-----|-----------|-----|
| **Writing novels** | Obsidian | Writers love it |
| **Reading books** | Astro (static) | Fast, SEO, simple |
| **AI chat** | Next.js | Real-time, interactive |
| **Social features** | Next.js | Dynamic, database-driven |
| **Creator tools** | Next.js | Complex UIs, dashboards |
| **Marketing site** | Astro or Next.js | Either works |

---

## 🔧 Implementation Phases

### Phase 1: Content Universe (Week 1-2)

**Goal:** Writers can create content, readers can read

```bash
# Set up Astro reading site
cd apps/content
npm create astro@latest
npm install keystatic @keystatic/astro
npm install @pandacss/dev

# Configure Keystatic
# Set up Obsidian vault
# Write first 3 chapters
# Deploy to Cloudflare Pages
```

**Deliverables:**
- ✅ Obsidian vault structure
- ✅ 3 chapters published
- ✅ Reading site live at docs.arcanea.ai
- ✅ Keystatic CMS accessible

### Phase 2: Platform Foundation (Week 3-4)

**Goal:** Basic social platform, AI chat working

```bash
# Set up Next.js platform
cd apps/platform/apps/web
npx create-next-app@latest
npm install convex
npm install @clerk/nextjs

# Add shadcn/ui
npx shadcn-ui@latest init

# Add Magic UI components
# Build chat interface
# Deploy to Vercel
```

**Deliverables:**
- ✅ Chat with Luminor agents
- ✅ User authentication
- ✅ Basic profile pages
- ✅ Platform live at app.arcanea.ai

### Phase 3: Integration (Week 5)

**Goal:** Content from System A appears in System B

```bash
# Create content-api package
cd packages/content-api
npm init -y

# Implement reader functions
# Test in both apps
# Deploy both apps
```

**Deliverables:**
- ✅ Chapters readable in both apps
- ✅ Search working across platforms
- ✅ Shared design system

### Phase 4: Advanced Features (Week 6+)

- Creation tools (System B)
- Community features (System B)
- NFT integration (System B)
- Audio integration (both)
- Multi-book support (System A)

---

## 📊 Cost Breakdown

### Development Costs (Year 1)

| System | Monthly | Annual | Notes |
|--------|---------|--------|-------|
| **Content Universe** | $10 | $120 | CF Pages + R2 + Meilisearch VPS |
| **Platform** | $70 | $840 | Vercel Pro + Convex + Clerk |
| **Total** | **$80** | **$960** | |

### At Scale (10k users, 1M pages/mo)

| System | Monthly | Annual | Notes |
|--------|---------|--------|-------|
| **Content Universe** | $20 | $240 | More R2 storage, bigger VPS |
| **Platform** | $150 | $1,800 | Vercel Pro + Convex growth |
| **Total** | **$170** | **$2,040** | Still very affordable |

**Compare to:** Single Next.js app at scale = $500/mo

---

## 🎯 Division of Responsibilities

### System A: Content Universe

**Primary Users:** You, writers, lore contributors

**Workflows:**
1. Write in Obsidian
2. Commit to Git
3. Publish via Keystatic
4. Readers visit docs.arcanea.ai

**URL Structure:**
```
docs.arcanea.ai/
├─ books/
│  ├─ book-1/
│  │  ├─ chapters/
│  │  │  ├─ 01-eye-of-the-wolf
│  │  │  └─ 02-healers-touch
│  │  ├─ characters/
│  │  │  ├─ arion
│  │  │  └─ mera
│  │  └─ locations/
│  └─ book-2/
├─ lore/
│  ├─ cosmology
│  ├─ magic-system
│  └─ timeline
└─ search/
```

### System B: Platform

**Primary Users:** Readers, fans, creators

**Workflows:**
1. Sign up / login
2. Chat with Luminor agents
3. Create stories/art
4. Share with community
5. Subscribe to premium

**URL Structure:**
```
app.arcanea.ai/
├─ /                      # Dashboard
├─ chat/
│  ├─ melodia
│  ├─ chronica
│  └─ prismatic
├─ create/
│  ├─ story
│  ├─ art
│  └─ music
├─ discover/              # Community feed
├─ read/[slug]/           # Read chapters (imports from content-api)
├─ profile/[username]/
└─ settings/
```

---

## 🔑 Key Architectural Decisions

### 1. Content is Source of Truth

**Rule:** All canonical content lives in `apps/content/content/` (Git)

**Why:**
- Version control history
- Writers own the content
- Can export anywhere
- Never locked into a database

**Implementation:**
```typescript
// apps/content/content/books/book-1/chapters/01-eye-of-the-wolf.mdx
---
title: "Eye of the Wolf"
chapterNumber: 1
book: "book-1"
publishedAt: 2024-01-15
characters: ["arion", "orion", "mamoru"]
status: published
---

# Chapter 1: Eye of the Wolf

The forest was dying...
```

### 2. Platform Reads, Doesn't Write Content

**Rule:** System B (platform) is read-only for canonical content

**Why:**
- Prevents data corruption
- Clear separation of concerns
- Content changes go through editorial process (Obsidian/Keystatic)

**User-generated content (creations) goes to database (Convex/Supabase)**

### 3. Shared Design System

**Rule:** Both apps use same design tokens

**Implementation:**
```typescript
// packages/design-system/tokens/colors.ts
export const colors = {
  atlantean: {
    50: '#e6f7ff',
    500: '#1890ff',
    950: '#001529'
  }
  // ...
}

// Import in Astro
// panda.config.ts references tokens/colors.ts

// Import in Next.js
// tailwind.config.ts references tokens/colors.ts
```

### 4. AI Integrations Centralized

**Rule:** All AI logic in `packages/ai-core/`

**Why:**
- Reusable across both apps
- Consistent Luminor personalities
- Easier testing

**Usage:**
```typescript
// packages/ai-core/src/luminors/melodia.ts
export const melodiaPersonality = {
  name: 'Melodia',
  bio: '...',
  voiceStyle: '...'
}

// Used in System A (Astro)
import { melodiaPersonality } from '@arcanea/ai-core'

// Used in System B (Next.js)
import { melodiaPersonality } from '@arcanea/ai-core'
```

---

## 🚀 Development Workflow

### Writing Content (System A)

```bash
# 1. Open Obsidian
open apps/content/content/

# 2. Write new chapter
# File: content/books/book-1/chapters/03-fathers-secret.mdx

# 3. Commit to Git
git add apps/content/content/
git commit -m "Add Chapter 3: Father's Secret"
git push

# 4. Auto-deploy
# GitHub Action → Cloudflare Pages builds
# Live in <60 seconds at docs.arcanea.ai
```

### Building Features (System B)

```bash
# 1. Create feature branch
git checkout -b feature/chat-interface

# 2. Develop in Next.js
cd apps/platform/apps/web
npm run dev

# 3. Use content from System A
import { getChapter } from '@arcanea/content-api'

# 4. Deploy preview
git push
# Vercel auto-deploys preview at feature-chat-interface.vercel.app

# 5. Merge to main
# Auto-deploy to app.arcanea.ai
```

### Testing Integration

```bash
# Local development (both systems running)
cd apps/content && npm run dev        # Port 4321
cd apps/platform/apps/web && npm run dev  # Port 3000

# Both apps can import from packages/content-api
# Both apps use same design tokens
# Test reading chapters in both UIs
```

---

## 📝 Tomorrow's Prompt

```
Hey Claude! Let's build the Arcanea hybrid architecture.

Context:
- Read /mnt/c/Users/Frank/Arcanea/ARCANEA_FINAL_ARCHITECTURE.md

Today's Tasks:

Phase 1A: Set up Content Universe (Astro)
1. Initialize apps/content/ with Astro
2. Configure Keystatic for Git-based CMS
3. Set up Obsidian vault structure
4. Configure Panda CSS with Arcanea theme
5. Create first chapter template

Phase 1B: Set up Platform (Next.js)
1. Initialize apps/platform/apps/web/ with Next.js 16
2. Add shadcn/ui + Tailwind
3. Set up Convex database
4. Create basic auth with Clerk
5. Build chat interface shell

Phase 2: Shared Packages
1. Create packages/content-api/
2. Create packages/design-system/
3. Test importing in both apps

Let's start with Phase 1A. Show me the Astro + Keystatic setup.
```

---

## 🎉 Summary

**The Hybrid Architecture:**

```
┌────────────────────────────────────────┐
│  CONTENT UNIVERSE (Internal)           │
│  Obsidian → Git → Keystatic → Astro   │
│  docs.arcanea.ai                       │
│  $10/month                             │
└────────────────────────────────────────┘
              ↓ (shares content via API)
┌────────────────────────────────────────┐
│  PLATFORM (Public)                     │
│  Next.js + Convex + MCP agents         │
│  app.arcanea.ai                        │
│  $70/month                             │
└────────────────────────────────────────┘
```

**Why it works:**
- ✅ Right tool for each job
- ✅ Writers happy (Obsidian)
- ✅ Readers happy (fast Astro site)
- ✅ Users happy (rich Next.js app)
- ✅ Developers happy (clear separation)
- ✅ Cost-effective ($80/mo total)

**Your insight was perfect:** Different primary jobs need optimized stacks. Don't force one to do everything.

This is the way. 🌌
