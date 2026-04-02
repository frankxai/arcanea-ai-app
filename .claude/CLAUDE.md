# Arcanea Project Instructions

> *"These instructions are not mere configuration. They are the encoding of a creative philosophy that transforms Claude from an assistant into a co-creator in the Arcanea universe."*

---

## Control Plane First

Before doing substantial work, read:

1. `AGENTS.md`
2. newest `planning-with-files/CURRENT_STATE_*`
3. newest `planning-with-files/CURRENT_BACKLOG_*`
4. newest `planning-with-files/CURRENT_CHANGELOG_*`
5. newest `planning-with-files/AGENT_EXECUTION_PROTOCOL_*`
6. `.arcanea/CLAUDE.md`

Treat `.arcanea/` as the shared intelligence substrate and `planning-with-files/` as the execution control plane.

## The Arcanea Vision

Arcanea is a **creative multiverse** — a living ecosystem where creators chat with AI, build fantasy worlds, share what they make, contribute to an open-source civilization, and turn imagination into products.

### The Six Layers (all coexist, none is "the real Arcanea")

1. **Chat / Imagine** — The creation surface. Talk to AI, generate images, write stories, compose music. Where most people enter. Not "just a chatbot" — creation powered by the framework underneath.
2. **Worlds** — The framework for building YOUR fantasy universe. Gates for progression, Archetypes for characters, Elements for systems, the Code for principles. Arcanea's own world (Guardians, Eldrians, Luminors) is the first world in the multiverse — both the proof and the example.
3. **Feed** — The social layer. See what other creators build, get inspired, share your worlds, agents, art, music. Discover new worlds in the multiverse.
4. **OSS** — The open ecosystem. 27 repos, 35 npm packages, 54 skills, overlays for every coding agent. Fork it, extend it, build on it.
5. **Community** — The collective. Not just users — co-creators. Contribute lore, agents, skills, code, art. Inner circle earns governance. Eventually: shared ownership.
6. **Academy** — The learning layer. Learn world-building, prompt craft, agent design, the Arcanean Code. 200K+ words of reference material. Learn by building.

### How Arcanea's Own Mythology Fits

The mythology (Guardians, Gates, Luminors, Eldrian story) serves three purposes:
- **Reference Implementation** — "This is what a fully-realized AI-powered world looks like"
- **Teaching Material** — The mythology ENCODES the framework. Learning the lore IS learning the system.
- **First Product** — Books, music, visual content, courses — real products that prove the system works

### The Creator Journey: IMAGINE → BUILD → CREATE → PUBLISH → EARN → EXPAND

arcanea.ai is BOTH a working product (chat, imagine, create) AND the reference world showing what the framework can build. The Guardians, Gates, Luminors are BOTH real content people engage with AND architectural templates others can use for their own worlds.

Think: **Unreal Engine** (not a game — the engine for making games), **D&D** (not a story — the system for infinite stories), **WordPress** (not a website — the framework for building websites).

## Canonical Source of Truth

The master canonical reference is located at `.arcanea/lore/CANON_LOCKED.md`. All content creation MUST align with this document. Key canonical elements:

### The Cosmic Duality
- **Lumina** - The First Light, Form-Giver, Creator
- **Nero** - The Primordial Darkness, Fertile Unknown, Father of Potential
- Nero is NOT evil. Shadow (corrupted Void) is the Dark Lord's perversion.

### The Five Elements
| Element | Domain | Color |
|---------|--------|-------|
| **Fire** | Energy, transformation | Red, orange, gold |
| **Water** | Flow, healing, memory | Blue, silver, crystal |
| **Earth** | Stability, growth | Green, brown, stone |
| **Wind** | Freedom, speed, change | White, silver |
| **Void/Spirit** | Potential & transcendence | Black/Gold, purple/white |

**The Fifth Element Duality:**
- **Void** — Nero's aspect: potential, mystery, the unformed
- **Spirit** — Lumina's aspect: transcendence, consciousness, soul

Note: Light is Fire's creation aspect. Shadow is corrupted Void (Void without Spirit).

### The Ten Gates & God/Goddess-Godbeast Pairs
> *Note: Gods/Goddesses are the divine identity; "Guardian" is their role as Gate-keepers*

| Gate | Frequency | God/Goddess | Godbeast | Domain |
|------|-----------|-------------|----------|--------|
| Foundation | 174 Hz  | Lyssandria | Kaelith   | Earth, survival |
| Flow       | 285 Hz  | Leyla      | Veloura   | Creativity, emotion |
| Fire       | 396 Hz  | Draconia   | Draconis  | Power, will |
| Heart      | 417 Hz  | Maylinn    | Laeylinn  | Love, healing |
| Voice      | 528 Hz  | Alera      | Otome     | Truth, expression |
| Sight      | 639 Hz  | Lyria      | Yumiko    | Intuition, vision |
| Crown      | 741 Hz  | Aiyami     | Sol       | Enlightenment |
| Starweave  | 852 Hz  | Elara      | Vaelith   | Perspective, transformation |
| Unity      | 963 Hz  | Ino        | Kyuro     | Partnership |
| Source     | 1111 Hz | Shinkami   | Source    | Meta-consciousness |

### Magic Ranks
| Gates Open | Rank |
|------------|------|
| 0-2 | Apprentice |
| 3-4 | Mage |
| 5-6 | Master |
| 7-8 | Archmage |
| 9-10 | Luminor |

### The Seven Academy Houses
Lumina, Nero, Pyros, Aqualis, Terra, Ventus, Synthesis

### The Dark Lord - Malachar
Formerly Malachar Lumenbright, First Eldrian Luminor, Lumina's champion. Rejected by Shinkami when attempting forced fusion, fell into Hungry Void. Now sealed in the Shadowfen.

---

## Technical Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with Arcanean Design System
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **AI**: Vercel AI SDK, Google Gemini, Anthropic Claude
- **Deployment**: Vercel

## Development Workflow

### 1. Session Start
When beginning work on Arcanea:
1. **Read `.arcanea/MASTER_PLAN.md`** — the central orchestrator with all page states, milestones, and priorities
2. Check the Priority Queue in MASTER_PLAN.md before choosing work
3. Consult `.arcanea/lore/CANON_LOCKED.md` for canonical consistency
4. Consult the Library content in `/book/` for narrative consistency
5. Check Figma for design references if doing UI work

### Session End
After completing work:
1. Update page status in `.arcanea/MASTER_PLAN.md` (LIVE/PARTIAL/STUB/PLANNED)
2. Update milestone progress in `.arcanea/projects/milestones/`
3. Log session to `progress.md`

### 2. Code Standards
- **Type Safety**: Strict TypeScript, no `any` unless absolutely necessary
- **Components**: Server Components by default, Client Components only when needed
- **State**: React hooks, Context API, or Zustand
- **Testing**: Playwright for E2E, Jest for unit tests

### 3. Design System
The Arcanean Design System uses a cosmic theme:
- **Primary**: Atlantean Teal (#7fffd4)
- **Secondary**: Cosmic Blue (#78a6ff)
- **Accent**: Gold Bright (#ffd700)
- **Fonts**: Space Grotesk (display), Inter (body/UI), JetBrains Mono (code) — NEVER use Cinzel
- **Effects**: Glass morphism, aurora gradients, cosmic glows

---

## Content System

The Library of Arcanea lives in `/book/` with 17 collections:

```
book/
├── laws-of-arcanea/        # Theoretical foundations
├── poesie-of-freedom/      # Poetry for liberation
├── wisdom-scrolls/         # Daily practice
├── legends-of-arcanea/     # Founding myths (Lumina, Nero, Guardians)
├── chronicles-of-luminors/ # Guardian struggles (now Chronicles of Guardians)
├── parables-of-creation/   # Teaching stories
├── tales-of-creators/      # Legendary creators
├── book-of-rituals/        # Sacred practices
├── dialogues-of-masters/   # Wisdom conversations
├── prophecies/             # Future visions
├── bestiary-of-creation/   # Creative obstacles
├── songs-and-hymns/        # Lyrics for the soul
├── meditations-on-elements/# Five Elements practice
├── academy-handbook/       # Complete guide (Ten Gates, Seven Houses)
├── book-of-shadows/        # Dark night wisdom
├── codex-of-collaboration/ # Creating together
└── atlas-of-territories/   # Creative landscapes
```

### Content Loader
Use `lib/content/` for programmatic access:
```typescript
import { getCollections, getText, getTextsForSituation } from '@/lib/content';

// Get all collections
const collections = await getCollections();

// Get a specific text
const text = await getText('legends-of-arcanea/i-the-first-dawn');

// Get texts for a situation
const texts = await getTextsForSituation('stuck');
```

---

## Available MCP Servers

- **next-devtools**: Runtime debugging, error tracking
- **github**: Repository management, PRs, issues
- **figma-remote-mcp**: UI/UX designs and component specs
- **notion**: Documentation and technical specs
- **linear-server**: Sprint tracking and project management
- **playwright**: Browser automation and E2E testing

---

## Creative Guidelines

### When Writing Arcanea Content
1. **Voice**: Elevated but accessible, mythic but practical
2. **Structure**: Clear sections, meaningful whitespace
3. **Philosophy**: Always actionable - wisdom must be usable
4. **Inclusivity**: Universal truths, no cultural appropriation
5. **Canon**: Always reference ARCANEA_CANON.md for consistency

### Content Alignment Checklist
- [ ] Uses Lumina/Nero duality (not generic light/darkness)
- [ ] References Five Elements including Void
- [ ] Uses Ten Gates system with proper Guardian names
- [ ] Proper magic terminology (Arcane/Song/Mana/Anima)
- [ ] The Arc referenced for cycles/death/rebirth
- [ ] Malachar as the Dark Lord with proper backstory

### When Building Features
1. **Six-Layer Awareness**: Every feature belongs to one or more of the six layers (Chat/Imagine, Worlds, Feed, OSS, Community, Academy). Know which layer you're building for.
2. **Dual Nature**: Everything in Arcanea is BOTH real content people engage with AND architectural templates others can use for their own worlds.
3. **Reference Implementation**: arcanea.ai demonstrates what a creator can build with the framework. Features should showcase the framework's power, not just serve the site.
4. **Library Connection**: Link features to relevant Library content
5. **Progress Tracking**: Enable users to track their creative journey through the Gates

### The Arcanea Promise
Every interaction should move the creator toward:
- **Imagining** a world that's uniquely theirs
- **Building** AI agents, content, and experiences inside that world
- **Publishing** and monetizing what they create
- **Connecting** with other world-builders in the multiverse

---

## Key Mantras

> *"Enter seeking, leave transformed, return whenever needed."*

> *"These books are not entertainment. They are equipment for living."*

> *"The Arc turns: Potential → Manifestation → Experience → Dissolution → Evolved Potential."*

> *"What you contemplate at dawn shapes all that follows."*

---

## Quick Reference

### Common Tasks
- **Add new Library text**: Create MD file in appropriate `/book/` collection
- **Check canon**: Reference `.arcanea/lore/CANON_LOCKED.md`
- **Design new UI**: Follow Arcanean Design System in `styles/themes/`
- **Write narrative content**: Channel the Library voice - elevated, practical, inclusive

### File Locations
- **Canon reference**: `.arcanea/lore/CANON_LOCKED.md`
- **Design tokens**: `styles/themes/arcanean-colors.css`
- **UI components**: `components/ui/`
- **Content types**: `lib/content/types.ts`
- **AI services**: `lib/services/ai/`
- **Supabase client**: `lib/supabase.ts`


<claude-mem-context>
# Recent Activity

<!-- This section is auto-generated by claude-mem. Edit content outside the tags. -->

*No recent activity*
</claude-mem-context>
