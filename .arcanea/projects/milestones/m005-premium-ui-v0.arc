---
id: M005
title: Premium UI Overhaul (v0)
guardian: Leyla
gate: Flow
priority: P0
status: active
progress: 5
created: 2026-03-01
target: 2026-03-15
tags: [ui, v0, design, premium]
---

# M005: Premium UI Overhaul via v0

> Replace STUB/PARTIAL pages with v0-generated premium components, then wire to backend.

## Strategy

Use v0 MCP (`mcp__v0__createChat` + `mcp__v0__sendChatMessage`) to generate production-quality
React + Tailwind components, then adapt to Arcanea's stack (Phosphor icons, Supabase hooks,
Arcanea design tokens). v0 handles layout/animation/polish; Claude Code handles wiring/types/API.

## Tasks

### T1: Studio Creation Interface — IN PROGRESS
- [x] Generate v0 premium Studio UI (chat: kAvqGXxPRym)
- [ ] Extract and adapt component to apps/web/app/studio/
- [ ] Wire to /api/creations POST (creation-service.ts)
- [ ] Wire AI generation to /api/ai/generate-image, generate-video
- [ ] Add generation progress states with streaming
- [ ] Test save → Supabase → gallery flow

### T2: Settings & Profile Page — IN PROGRESS
- [x] Generate v0 Settings UI (async)
- [ ] Extract and replace apps/web/app/settings/page.tsx
- [ ] Wire to Supabase profiles table (avatar, preferences)
- [ ] Add Guardian progress visualization (gates_open, magic_rank)
- [ ] Wire notification preferences to metadata JSONB

### T3: Onboarding Wizard — IN PROGRESS
- [x] Generate v0 Onboarding flow (async)
- [ ] Extract to apps/web/app/onboarding/
- [ ] Wire creator-type to profiles.creator_types
- [ ] Wire Guardian quiz to profiles.guardian assignment
- [ ] Wire first creation to /api/creations
- [ ] Set gates_open = 1 on completion

### T4: Gallery Redesign — IN PROGRESS
- [x] Generate v0 Gallery UI (async)
- [ ] Extract and replace apps/web/app/gallery/page.tsx
- [ ] Wire infinite scroll to /api/gallery with cursor pagination
- [ ] Wire likes to like-service.ts
- [ ] Wire bookmarks to collections
- [ ] Add detail modal with related creations

### T5: Chat Interface Polish
- [ ] Generate v0 premium chat UI (iterate on existing chats)
- [ ] Streaming message bubbles with typing indicator
- [ ] Session sidebar with history
- [ ] Guardian avatar + personality indicators
- [ ] Voice input button (future)

### T6: Academy Course Pages
- [ ] Generate v0 course listing page
- [ ] Generate v0 course detail page (lessons, progress)
- [ ] Generate v0 lesson viewer (content + exercises)
- [ ] Wire to course data model (new Supabase tables)

### T7: Community Hub
- [ ] Generate v0 community feed/forums
- [ ] Generate v0 creator profiles grid
- [ ] Wire to follows + activity_log
- [ ] Add real-time presence indicators

### T8: Pricing Page Premium
- [ ] Generate v0 premium pricing with tier comparison
- [ ] Add animated feature highlights
- [ ] Wire to Stripe checkout (future)

## v0 Integration Workflow

1. Generate in v0 (async, v0-1.5-lg model with thinking)
2. Review demo URL → iterate with sendChatMessage if needed
3. Extract JSX/TSX from v0 chat
4. Adapt: replace v0 icons → Phosphor, v0 colors → Arcanea tokens
5. Wire: add Supabase hooks, API calls, auth checks
6. Test: build passes, Lighthouse 90+, mobile responsive

## Existing v0 Chats (reusable)

| Chat | ID | Use For |
|------|----|---------|
| Premium AI Chat | hgiud0bsPUc | Chat interface reference |
| Arcanea Studio design | lMysc6koxd2 | Studio layout reference |
| Arcanea Imagine Interface | rjiUbIIuDx0 | Image gen UI reference |
| Gate progress rings | dhRVHcaKsef | Settings gate visualization |
| Guardian Frequency Visualizer | kOHnm5xfWSE | Onboarding guardian match |
| Community Hub page | eCYweJC6UTl | Community redesign |
| Academy landing page | kmqMZu6QQHA | Academy polish |
| Inner Circle membership | tZ41YuKQJoo | Pricing reference |
| Soulbook landing page | qlakULoe76B | Library polish |
| Music Lab Page | r9XYZI8P0Mv | Studio music tab |
