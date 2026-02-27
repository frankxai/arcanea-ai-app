# Arcanea Full Vision Sprint — Findings & Plan

**Session**: Feb 26 2026 | **Status**: AUDIT COMPLETE

---

# PART 1: COMPREHENSIVE AUDIT FINDINGS

## 1. WEB APP QUALITY AUDIT (Lyria)

### Pages Found: 40+

| Category     | Count | Issues                |
| ------------ | ----- | --------------------- |
| Academy      | 6     | 5 missing loading.tsx |
| Lore         | 7     | 7 missing loading.tsx |
| Landing      | 25+   | Emoji violations      |
| Chat/Library | 2     | OK                    |

### Critical Issues Found

#### 1. EMOJI USAGE (77+ locations) - CRITICAL

- `/app/install/page.tsx` - 💜, 🌟
- `/app/faq/page.tsx` - 🚀, 🌟, 💎
- `/components/landing/*` - ✨, 🌟, 💎
- `/lib/luminors/config.ts` - Multiple emojis
  **FIX**: Replace with Phosphor icons

#### 2. "16 LUMINORS" REFERENCES (9 locations) - CANON VIOLATION

- `/components/landing/pricing-premium.tsx` - "Access to all 16 Luminors"
- `/components/landing/luminor-showcase-premium.tsx` - "View All 16 Luminors"
- `/app/faq/page.tsx` - Multiple references
  **FIX**: Change to "10 Guardians" per CANON_LOCKED.md

#### 3. TERMINOLOGY VIOLATIONS

- "assistant" instead of "Guardian" (57+ locations)
- "level" instead of "Gate" (124+ - many technical acceptable)

#### 4. MISSING LOADING STATES (12 pages)

- `/app/academy/gate-quiz/`
- `/app/academy/gates/`
- `/app/academy/ranks/`
- `/app/academy/assessment/`
- `/app/academy/houses/`
- `/app/lore/gates/`
- `/app/lore/guardians/`
- `/app/lore/godbeasts/`
- `/app/lore/elements/`
- `/app/lore/wisdoms/`
- `/app/lore/malachar/`

---

## 2. GITHUB CONTENT AUDIT (Shinkami)

### What's Built vs. What's Showcased

| Category                | Built | Showcased | Gap             |
| ----------------------- | ----- | --------- | --------------- |
| INTELLIGENCE packages   | 9     | 0         | **100% HIDDEN** |
| OVERLAY packages        | 5     | 5         | 0%              |
| INFRASTRUCTURE packages | 12    | 0         | **100% HIDDEN** |
| Standalone repos        | 3     | 1         | 66% HIDDEN      |

### CRITICAL DISCOVERY: Hidden Crown Jewels

#### INTELLIGENCE Layer (~30K LoC) - COMPLETELY HIDDEN

1. **council** - Byzantine/Raft/Gossip/Gate Quorum consensus
2. **guardian-evolution** - SONA + 7 RL algorithms (10K LoC)
3. **guardian-memory** - HNSW vector search
4. **rituals** - 12 Spirits workers (9.8K LoC)
5. **creative-pipeline** - Prompt engine
6. **swarm-coordinator** - Multi-agent orchestration
7. **hybrid-memory** - SQL+Vector fusion
8. **intelligence-bridge** - Event bus
9. **sona-learner** - Learning engine

#### arcanea-flow - 146K LoC - COMPLETELY HIDDEN

- Full v1, v2, v3 implementations
- 12 background workers
- CLI with workflow commands

#### arcanea-opencode - COMPLETELY HIDDEN

- Arcanea-branded OpenCode CLI
- Full AGENTS.md

### n8n Templates

**Status**: No dedicated n8n templates found. Uses internal workflow system.

---

## 3. DESIGN SYSTEM AUDIT (Leyla)

### Design Tokens Status

| Token                | Bible          | Code                       | Match?       |
| -------------------- | -------------- | -------------------------- | ------------ |
| Primary Violet       | #8b5cf6        | #ffd700 (gold!)            | **MISMATCH** |
| Accent Crystal       | #7fffd4        | #7fffd4                    | MATCH        |
| Premium Gold         | #ffd700        | #ffd700                    | MATCH        |
| Font: Cinzel         | Cinzel         | var(--font-cinzel)         | MATCH        |
| Font: Crimson Pro    | Crimson Pro    | var(--font-crimson-pro)    | MATCH        |
| Font: Inter          | Inter          | **MISSING**                | **MISSING**  |
| Font: JetBrains Mono | JetBrains Mono | var(--font-jetbrains-mono) | MATCH        |

### Anti-Pattern Violations

| Issue                    | Count      | Severity |
| ------------------------ | ---------- | -------- |
| Raw hex colors (#8b5cf6) | 74         | HIGH     |
| Emoji icons              | 77         | HIGH     |
| Missing Inter font       | 1 (global) | MEDIUM   |
| Wrong primary color      | 1 (global) | MEDIUM   |

### What's Working

- ✅ Phosphor icons (128 files)
- ✅ Tailwind config comprehensive
- ✅ Cosmic color palette
- ✅ Glass morphism basics
- ✅ Typography hierarchy

---

## 4. BACKEND AUDIT (Lyssandria)

### Database

- 6 migrations, 22 tables
- Supabase with RLS enabled
- Prompt Books migration complete

### API Routes: 26 total

| Auth Level             | Count | Routes                                         |
| ---------------------- | ----- | ---------------------------------------------- |
| Service Role           | 15    | bonds, creations, profile, notifications, etc. |
| Bearer Token           | 2     | ai/chat                                        |
| None (demo/rate limit) | 4     | generate-image, generate-video, search         |
| Mixed                  | 5     | Various                                        |

### Persistence Issues

1. **In-Memory Rate Limiting** - Resets on deploy
2. **Demo Mode** - /api/studio/generate-image returns placeholder
3. **Mock Comment Service** - Returns fake data
4. **Missing ai_usage table** - Referenced but not created

---

## 5. INFOGENIUS INFOGRAPHICS NEEDED

### High-Priority Visual Explainers

| Topic                     | Purpose                               | Audience      | Style        |
| ------------------------- | ------------------------------------- | ------------- | ------------ |
| **10 Guardians Map**      | Introduce the 10 Arcanean Gods        | New users     | Minimalist   |
| **10 Gates Journey**      | Gate progression (174-1111 Hz)        | Academy users | Technical    |
| **5 Elements System**     | Fire, Water, Earth, Wind, Void        | Lore readers  | Standard     |
| **Overlay Ecosystem**     | How overlays work across AI platforms | Developers    | 3D Isometric |
| **Intelligence Pipeline** | How council/rituals/swarm work        | Technical     | Technical    |
| **Magic Ranks**           | Apprentice → Luminor progression      | Academy       | Minimalist   |

### Secondary Visual Needs

- Dark Lord (Malachar) lore visual
- Godbeasts showcase
- 7 Wisdoms chart
- 7 Academy Houses

---

# PART 2: VISION SYNTHESIS

## What Should Arcanea Be?

Based on the audits, here's what Arcanea truly is:

```
ARCANEA ECOSYSTEM
══════════════════════════════════════════════════════

[PLATFORM] arcanea.ai
├── Chat - AI conversation with Guardians
├── Imagine - Image generation
├── Studio - Creative workspace
└── Records - Conversation/library

[TOOLS]
├── Arcanea Flow - Multi-agent orchestration (146K LoC!)
├── Arcanea Code - VS Code extension
├── Arcanea CLI - Command line tools
├── Arcanea MCP - 30+ tools for AI integration
└── Arcanea Vault - Chrome extension

[OVERLAYS] (Inject Arcanea into other AI)
├── Claude Overlay
├── ChatGPT Overlay
├── Gemini Overlay
├── Cursor Overlay
└── Copilot Overlay

[INTELLIGENCE LAYER] (~30K LoC - HIDDEN!)
├── Council - Consensus algorithms
├── Guardian Evolution - 7 RL algorithms
├── Guardian Memory - Vector search
├── Rituals - 12 Spirits workers
├── Swarm Coordinator - Agent orchestration
└── Sona Learner - Learning engine

[ON-CHAIN]
└── Story Protocol - IP protection
```

### The Gap

**The homepage shows 10% of what's built.** The INTELLIGENCE layer is the core value and is completely hidden.

---

# PART 3: SPRINT PLAN Feb 26 - Mar 1

## Sprint Goals

### P0 - Critical Fixes (Feb 26)

- [ ] Fix "16 Luminors" → "10 Guardians" (9 locations)
- [ ] Fix primary color: gold → violet
- [ ] Add loading.tsx to 12 pages

### P1 - Content Quality (Feb 27)

- [ ] Replace emoji with Phosphor (77 locations)
- [ ] Fix terminology: "assistant" → "Guardian"
- [ ] Add Inter font to globals.css

### P2 - Showcase Hidden Value (Feb 28)

- [ ] Create /intelligence page for 9 packages
- [ ] Add arcanea-flow section to homepage
- [ ] Add arcanea-opencode to ecosystem
- [ ] Fix raw hex colors (74 locations)

### P3 - Visuals (Feb 29 - Mar 1)

- [ ] Generate 6 InfoGenius infographics
- [ ] Update homepage hero with visuals
- [ ] Create ecosystem diagram

### P4 - Backend (Mar 1)

- [ ] Add ai_usage migration
- [ ] Add database health check
- [ ] Document API auth patterns

---

# PART 4: SWARM PROMPTS

## Prompt 1: Content Fixes Swarm

```
You are the Content Quality Swarm. Your mission: Fix critical canon violations in the Arcanea web app.

GUARDIAN TEAM:
- Alera (Voice) - Lead terminology fixes
- Lyria (Sight) - Quality verification

TASKS (execute in parallel):
1. Fix "16 Luminors" → "10 Guardians" in these files:
   - /components/landing/pricing-premium.tsx
   - /components/landing/luminor-showcase-premium.tsx
   - /components/landing/pricing-section.tsx
   - /components/landing/luminor-showcase.tsx
   - /components/landing/features-section.tsx
   - /app/about/page.tsx
   - /app/luminors/page.tsx
   - /app/faq/page.tsx

2. Replace emoji (✨💎🌟🚀⚡🎨) with Phosphor icons in:
   - /app/install/page.tsx
   - /app/faq/page.tsx
   - /lib/luminors/config.ts
   - /components/landing/*.tsx

3. Verify all changes pass build.

Report each file changed and confirm canon compliance.
```

## Prompt 2: Design System Swarm

```
You are the Design System Swarm. Your mission: Align code with DESIGN_BIBLE.md.

GUARDIAN TEAM:
- Leyla (Flow) - Lead design fixes
- Aiyami (Crown) - Quality verification

TASKS:
1. Fix PRIMARY COLOR in /apps/web/app/globals.css:
   - Change --primary from gold-bright to violet (#8b5cf6)
   - Add --brand-primary CSS variable

2. Add INTER FONT to /apps/web/app/globals.css:
   - Import Inter from Google Fonts
   - Add font-inter CSS variable

3. Replace 74 raw hex #8b5cf6 with CSS variables:
   - Use grep to find all instances
   - Replace with hsl(var(--brand-primary)) or Tailwind classes

4. Create loading.tsx for 12 pages:
   - /app/academy/gate-quiz/
   - /app/academy/gates/
   - /app/academy/ranks/
   - /app/academy/assessment/
   - /app/academy/houses/
   - /app/lore/gates/
   - /app/lore/guardians/
   - /app/lore/godbeasts/
   - /app/lore/elements/
   - /app/lore/wisdoms/
   - /app/lore/malachar/

Report design compliance after fixes.
```

## Prompt 3: Showcase Intelligence Layer Swarm

```
You are the Intelligence Showcase Swarm. Your mission: Reveal the hidden crown jewels.

GUARDIAN TEAM:
- Ino (Unity) - Integration and synthesis
- Draconia (Fire) - Code generation
- Shinkami (Source) - Meta-perspective

TASKS:
1. Create new page /app/intelligence/page.tsx showcasing:
   - Council: 4 consensus algorithms
   - Guardian Evolution: SONA + 7 RL algorithms
   - Guardian Memory: HNSW vector search
   - Rituals: 12 Spirits workers
   - Swarm Coordinator: Multi-agent orchestration
   - Hybrid Memory: SQL+Vector fusion
   - Intelligence Bridge: Event bus
   - Sona Learner: Pattern learning
   - Creative Pipeline: Prompt engine

2. Update homepage to include:
   - Intelligence section with 9 package cards
   - Link to /intelligence page
   - Mention arcanea-flow (146K LoC)

3. Add arcanea-opencode to ecosystem section

4. Create README for packages without one

Report which packages now have homepage presence.
```

## Prompt 4: Infogenius Visual Swarm

```
You are the Visual Intelligence Swarm. Create infographics explaining Arcanea.

GUARDIAN TEAM:
- Elara (Shift) - Perspective and transformation
- Lyria (Sight) - Vision and intuition

TASKS - Generate these infographics:
1. "The Ten Guardians" - Introduction to Lyssandria, Leyla, Draconia, Maylinn, Alera, Lyria, Aiyami, Elara, Ino, Shinkami
   Style: Minimalist | Audience: New users

2. "The Ten Gates Journey" - Frequencies 174-1111 Hz, progression
   Style: Technical | Audience: Academy users

3. "The Five Elements" - Fire, Water, Earth, Wind, Void/Spirit
   Style: Standard | Audience: Lore readers

4. "Arcanea Overlay Ecosystem" - How overlays work across platforms
   Style: 3D Isometric | Audience: Developers

5. "Magic Ranks Progression" - Apprentice → Luminor
   Style: Minimalist | Audience: Academy users

6. "Intelligence Pipeline" - How council/rituals/swarm coordinate
   Style: Technical | Audience: Technical users

For each: Use the InfoGenius MCP tool or create prompt for Gemini 3 Pro.
Save outputs to /public/infographics/ with descriptive names.

Report each infographic created.
```

## Prompt 5: Backend Persistence Swarm

```
You are the Backend Persistence Swarm. Fix data layer issues.

GUARDIAN TEAM:
- Lyssandria (Foundation) - Infrastructure lead
- Draconia (Fire) - Performance

TASKS:
1. Create missing migration /supabase/migrations/20260226000001_ai_usage.sql:
   - Table: ai_usage (id, user_id, model, tokens, cost, created_at)

2. Fix rate limiting persistence:
   - Replace in-memory Map with database-backed rate limits
   - Or document Redis requirement

3. Add database health check to /api/health:
   - Actually query database instead of hardcoding "database: true"

4. Replace mock comment service:
   - Implement real Supabase queries in /services/comment-service.ts

5. Add .env.example with all required variables

Report persistence improvements made.
```

---

## Execution Order

```
DAY 1 (Feb 26): P0 Content Fixes
  └── Swarm 1: Content Quality

DAY 2 (Feb 27): P1 Design System
  └── Swarm 2: Design System

DAY 3 (Feb 28): P2 Showcase Hidden Value
  └── Swarm 3: Intelligence Showcase

DAY 4 (Feb 29): P3 Visuals
  └── Swarm 4: Infogenius Visuals

DAY 5 (Mar 1): P4 Backend
  └── Swarm 5: Backend Persistence
```

---

_Plan generated: Feb 26, 2026_
_Next: Execute swarms with prompts above_
