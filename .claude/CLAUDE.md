# Arcanea — Global Project Context

This file loads every session. Keep it minimal. Domain context lives in directory-scoped CLAUDE.md files.

## Architecture

Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind + Supabase + Vercel AI SDK. Deployed on Vercel (arcanea-ai-appx).

## Agent System

Luminor hierarchy: Arcanea (model) → Lumina (orchestrator) → Guardians (coordinators) → Luminors (workers). Definitions: `.arcanea/agents/`. Kernel: `.arcanea/prompts/luminor-engineering-kernel.md`.

## Design System (always enforced)

- Primary: Atlantean Teal (#00bcd4) | Secondary: Cosmic Blue (#0d47a1) | Accent: Gold (#ffd700)
- Background: #09090b | Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code)
- NEVER use Cinzel font
- Glass cards: `bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm`
- Framer Motion: `domAnimation` not `domMax`

## Domain CLAUDE.md Files

- `apps/web/CLAUDE.md` — Next.js patterns, components, content loader
- `book/CLAUDE.md` — Library voice, canon alignment, creative guidelines
- `.arcanea/CLAUDE.md` — Intelligence hub, directory map, master plan
- `arcanea-onchain/CLAUDE.md` — Chain patterns, crypto MCPs

## WSL2 Storage

WSL2 VHDX lives on C:\. Real free space = C: drive free space. Keep C: above 5 GB or writes fail.
