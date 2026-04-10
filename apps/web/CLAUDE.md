# Arcanea Web App — apps/web/

## Stack

Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind CSS + Supabase + Vercel AI SDK (Google Gemini, Anthropic Claude).

## Code Standards

- Server Components by default; Client Components only when needed (`'use client'`)
- Strict TypeScript — no `any` unless absolutely necessary
- Typed interfaces for all public APIs; input validation at system boundaries
- State: React hooks, Context API, or Zustand
- Testing: Playwright (E2E), Jest (unit)
- Keep files under 500 lines

## Design System

- Primary: Atlantean Teal (#00bcd4) | Secondary: Cosmic Blue (#0d47a1) | Accent: Gold (#ffd700)
- Background: #09090b
- Fonts: Space Grotesk (display), Inter (body/UI), JetBrains Mono (code) — NEVER Cinzel
- Glass cards: `bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm`
- Effects: Glass morphism, aurora gradients, cosmic glows
- Framer Motion: use `domAnimation` not `domMax`

## Content Loader

```typescript
import { getCollections, getText, getTextsForSituation } from '@/lib/content';
```

Library lives in `/book/` (17 collections). Use `lib/content/` for programmatic access.

## Key Paths

- Components: `components/ui/`
- Design tokens: `styles/themes/arcanean-colors.css`
- Content types: `lib/content/types.ts`
- AI services: `lib/services/ai/`
- Supabase client: `lib/supabase.ts`

## Build

```bash
pnpm --dir apps/web run build
pnpm --dir apps/web run dev
```

## Feature Building

Every feature belongs to one or more of the six layers: Chat/Imagine, Worlds, Feed, OSS, Community, Academy. Features should showcase the framework's power — arcanea.ai is both a product and a reference implementation.
