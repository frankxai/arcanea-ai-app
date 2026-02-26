# Arcanea Records — Complete Specification

> _"Music is the bridge between worlds — and Arcanea Records is where sonic universes are born."_

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Platform Architecture](#platform-architecture)
3. [Core Agents](#core-agents)
4. [Data Models](#data-models)
5. [Style Learning System](#style-learning-system)
6. [Persona System](#persona-system)
7. [Web App Pages](#web-app-pages)
8. [Claude Code Skills](#claude-code-skills)
9. [OpenCode Skills](#opencode-skills)
10. [n8n Integration](#n8n-integration)
11. [File Structure](#file-structure)

---

## Philosophy

Arcanea Records is not just a music production tool — it's a **Living Music Intelligence** that:

1. **Learns** your style over time (what lyrics you write, what music you generate, what vibes you prefer)
2. **Adapts** to your workflow (some days you want full automation, others you want just prompts)
3. **Orchestrates** across platforms (web for community, Claude Code for local, OpenCode for workflows)
4. **Evolves** with you (the more you use it, the better it understands you)

---

## Platform Architecture

### The Three Pillars

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ARCANEA RECORDS                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│   │  WEB APP    │    │CLAUDE CODE  │    │  OPENCODE   │         │
│   │  arcanea.ai │    │ .claude/    │    │ .opencode/  │         │
│   ├─────────────┤    ├─────────────┤    ├─────────────┤         │
│   │ Community   │    │ Local Agent │    │ Workflows   │         │
│   │ Gallery     │    │ Execution   │    │ Automation  │         │
│   │ Visual UI   │    │ Skills      │    │ Skills      │         │
│   │ Public      │    │ Private     │    │ n8n         │         │
│   │ Profiles    │    │ Sessions    │    │ Triggers    │         │
│   └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                      │
│   ═══════════════════════════════════════════════════════════════   │
│                         SHARED LAYER                                 │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Arcanea Soul (The Brain)                                  │   │
│   │  • Style Learning (AgentDB)                                │   │
│   │  • Persona Tracking                                        │   │
│   │  • Workflow Orchestration                                  │   │
│   │  • Cross-Platform Sync                                     │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Platform Differences

| Feature         | Web App                              | Claude Code             | OpenCode                |
| --------------- | ------------------------------------ | ----------------------- | ----------------------- |
| **Primary Use** | Community, discovery, public gallery | Local creative sessions | Workflow automation     |
| **Storage**     | Cloud (Supabase)                     | Local + Cloud sync      | Local files, cloud sync |
| **API Keys**    | User-configured in app               | Environment variables   | Config files            |
| **Best For**    | Exploring, sharing, collaborating    | Deep creative work      | Batch processing, n8n   |
| **Visibility**  | Public + Private                     | Private                 | Private + Shared        |

---

## Core Agents

### The Creation Trinity

| Agent            | Role              | Gate       | Input                | Output                        |
| ---------------- | ----------------- | ---------- | -------------------- | ----------------------------- |
| **Songseed**     | Concept Generator | Foundation | Theme, mood, genre   | 3-5 song concepts             |
| **Lyricist**     | Lyric Writer      | Voice      | Concept, style, mood | Full lyrics + structure       |
| **SunoEngineer** | Prompt Optimizer  | Sight      | Lyrics, concept      | 40-word Suno-optimized prompt |

### The Enhancement Quartet

| Agent              | Role                 | Gate  | Input              | Output                               |
| ------------------ | -------------------- | ----- | ------------------ | ------------------------------------ |
| **VibeEngineer**   | Radio-Ready Producer | Crown | Raw track          | Production notes, mixing suggestions |
| **CoverArt**       | Album Cover Designer | Crown | Theme, mood, genre | 4 cover art options                  |
| **SocialComposer** | Content Creator      | Voice | Song details       | TikTok/Reels/Instagram content       |
| **VideoDirector**  | Music Video Concepts | Sight | Song + theme       | Video concept boards                 |

### The Guardian Mapping

| Guardian       | Agent Role | Specialty                          |
| -------------- | ---------- | ---------------------------------- |
| **Lyssandria** | Foundation | Project setup, file management     |
| **Leyla**      | Flow       | Emotional direction, melody flow   |
| **Draconia**   | Fire       | Energy, drops, rock/metal          |
| **Maylinn**    | Heart      | Ballads, acoustic, emotional depth |
| **Alera**      | Voice      | Lyrics, hooks, vocal production    |
| **Lyria**      | Sight      | Album vision, artwork direction    |
| **Aiyami**     | Crown      | Master releases, milestones        |
| **Elara**      | Shift      | Genre-bending, experimental        |
| **Ino**        | Unity      | Collaboration, features            |
| **Shinkami**   | Source     | Meta-production, the "why"         |

---

## Data Models

### Song

```typescript
interface Song {
  id: string;
  userId: string;

  // Core
  title: string;
  concept: string;
  theme: string;
  mood: string;
  genre: string;

  // Lyrics
  lyrics?: string;
  lyricsPersona?: string;

  // Production
  sunoPrompt?: string;
  bpm?: number;
  key?: string;
  duration?: number;
  instruments?: string[];
  productionNotes?: string;

  // Audio
  audioUrl?: string;
  audioSource?: "suno" | "minimax" | "musicgen" | "manual";

  // Visual
  coverArtUrl?: string;
  coverArtPrompt?: string;

  // Social
  socialPosts?: SocialPost[];

  // Meta
  status: "idea" | "lyrics" | "prompt" | "generated" | "released";
  tags: string[];
  styleProfileId?: string;

  // Learning
  styleEmbedding?: number[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Style Profile

```typescript
interface StyleProfile {
  id: string;
  userId: string;
  name: string;

  // Music Style
  genres: string[];
  bpmRange: { min: number; max: number };
  keys: string[];
  instruments: string[];
  productionStyle: string;
  vibe: string;

  // Visual Style
  visualAesthetic: string;
  colorPalette: string[];
  coverArtStyle: string;

  // Learning
  embedding: number[];
  songsCount: number;
  lastUpdated: Date;
}
```

### Persona

```typescript
interface Persona {
  id: string;
  userId: string;
  name: string;
  description: string;

  // Writing Style
  lyricStyle: string;
  themes: string[];
  vocabulary: string[];
  rhymeScheme?: string;

  // Voice Characteristics
  tone: string;
  emotionalRange: string[];

  // Learning
  embedding: number[];
  songsWritten: number;

  // AI Personality
  systemPrompt?: string;
  traits: string[];
}
```

### Workflow

```typescript
interface Workflow {
  id: string;
  userId: string;
  name: string;
  description: string;

  // Steps
  steps: WorkflowStep[];

  // Integrations
  integrations: {
    suno?: { enabled: boolean; apiKey?: string };
    minimax?: { enabled: boolean; apiKey?: string };
    musicgen?: { enabled: boolean; apiKey?: string };
    n8n?: { enabled: boolean; webhookUrl?: string };
    googleDrive?: { enabled: boolean; folderId?: string };
  };

  // Storage
  storagePreference: "local" | "cloud" | "google-drive";

  // Active
  isActive: boolean;
}
```

### Swarm Configuration

```typescript
interface SwarmConfig {
  id: string;
  userId: string;
  name: string;

  // Active Agents
  agents: {
    songseed: boolean;
    lyricist: boolean;
    sunoEngineer: boolean;
    vibeEngineer: boolean;
    coverArt: boolean;
    socialComposer: boolean;
    videoDirector: boolean;
  };

  // Service Configuration
  services: {
    audio: "suno" | "minimax" | "musicgen" | "manual";
    image: "infogenius" | "dalle" | "manual";
    storage: "local" | "cloud" | "google-drive";
  };

  // n8n Integration
  n8n?: {
    enabled: boolean;
    webhookUrl?: string;
    triggers?: string[];
  };
}
```

---

## Style Learning System

### How It Works

1. **Capture** — Every song, lyric, prompt, and choice is captured
2. **Embed** — Style attributes are converted to vector embeddings
3. **Learn** — AgentDB learns patterns over time
4. **Suggest** — System recommends based on learned preferences

### Learning Triggers

```typescript
interface LearningEvent {
  type:
    | "song_created"
    | "lyrics_written"
    | "prompt_used"
    | "style_selected"
    | "vibe_adjusted"
    | "cover_liked"
    | "social_engaged";

  data: {
    songId?: string;
    genre?: string;
    mood?: string;
    bpm?: number;
    instruments?: string[];
    lyrics?: string;
    prompt?: string;
    vibeNotes?: string;
  };

  embedding: number[];
  timestamp: Date;
}
```

### Style Suggestions

When user starts a new song, the system:

1. Queries their style embedding
2. Finds similar past songs
3. Suggests: genre, bpm range, instruments, mood, themes

---

## Persona System

### AI Persona Creation

```typescript
interface PersonaCreation {
  name: string;
  description: string;

  // Example lyrics (for learning style)
  sampleLyrics?: string[];

  // Or direct configuration
  tone?: string;
  themes?: string[];
  vocabulary?: string[];
  rhymeScheme?: string;
}
```

### Lyricist Selection

When generating lyrics, user can:

1. **Use Default** — Arcanea's general lyricist
2. **Select Persona** — Choose from their created personas
3. **Auto-Suggest** — System picks based on song theme/mood

---

## Web App Pages

### `/records` — The Hub

```
┌─────────────────────────────────────────────────────────────┐
│  ARCANEA RECORDS                                            │
├─────────────────────────────────────────────────────────────┤
│  [🎵 Create] [🎤 My Songs] [👥 Community] [⚙️ Settings]     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           🆕 START NEW SESSION                        │  │
│  │                                                      │  │
│  │  What would you like to create?                      │  │
│  │  [🎵 Song Idea] [📀 Album] [🎨 Cover] [📱 Content]  │  │
│  │                                                      │  │
│  │  Theme: [________________]                           │  │
│  │  Mood:  [dropdown________________]                   │  │
│  │  Genre: [dropdown________________]                   │  │
│  │                                                      │  │
│  │  [🚀 CREATE WITH MY SWARM]                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────┐ ┌────────────────────┐              │
│  │ Recent Songs       │ │ Style Insights     │              │
│  │ 🎵 Ocean Dreams    │ │ Pop: 12 songs     │              │
│  │ 🎵 Midnight City   │ │ Rock: 5 songs     │              │
│  │ 🎵 Electric Heart  │ │ Avg BPM: 128      │              │
│  └────────────────────┘ └────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### `/create-song` — Full Creation Flow

- Step 1: Concept → Songseed generates 3-5 concepts
- Step 2: Lyrics → Lyricist writes (optionally using persona)
- Step 3: Audio → Suno Engineer optimizes prompt OR generates
- Step 4: Cover → Cover Art agent generates options
- Step 5: Social → Social Composer creates posts
- Step 6: Save → Save to library + optional community share

---

## Claude Code Skills

### `.claude/skills/arcanea-records/SKILL.md`

```markdown
# Arcanea Records - Claude Code Skill

Use this skill when the user wants to:

- Generate song concepts and ideas
- Write lyrics in specific styles
- Optimize prompts for Suno/Minimax/MusicGen
- Get radio-ready production advice
- Generate album cover art concepts
- Create social media content for music
- Analyze and learn from user's music style

## Commands

- `/song <theme>` — Generate song concept
- `/lyrics <concept>` — Write lyrics
- `/suno-prompt <lyrics>` — Optimize for Suno
- `/vibe-check <track>` — Get production notes
- `/cover <theme>` — Generate cover concepts
- `/social <song>` — Create social posts
- `/style` — Show my style profile
- `/persona <name>` — Switch lyricist persona

## Agent Definitions

### Songseed Agent

- Gate: Foundation
- Role: Generate 3-5 song concepts from theme/mood
- Output: Concept names, descriptions, suggested moods

### Lyricist Agent

- Gate: Voice
- Role: Write full lyrics in selected persona's style
- Input: Concept, mood, genre, persona
- Output: Verses, chorus, bridge, hook

### SunoEngineer Agent

- Gate: Sight
- Role: Convert lyrics to 40-word optimized prompt
- Input: Lyrics, genre, mood, instruments
- Output: Suno-ready prompt string

### VibeEngineer Agent

- Gate: Crown
- Role: Analyze track, suggest production improvements
- Input: Audio reference or description
- Output: Mixing notes, EQ suggestions, structure advice

### CoverArt Agent

- Gate: Crown
- Role: Generate cover art concepts
- Input: Album/song theme, mood, genre
- Output: 4 detailed image prompts

### SocialComposer Agent

- Gate: Voice
- Role: Create social media content
- Input: Song details, platform
- Output: Captions, hashtags, hook scripts

## Style Learning

When generating content, ALWAYS:

1. Check user's style profile via `/style`
2. Use learned preferences (genre, bpm, mood)
3. Ask about new preferences if unclear

## API Keys

For audio generation, set environment variables:

- `SUNO_API_KEY` — For Suno API
- `MINIMAX_API_KEY` — For Minimax
- `GOOGLE_MUSIC_GEN_KEY` — For Google MusicGen
```

---

## OpenCode Skills

### `.opencode/skills/arcanea-records/`

Similar structure to Claude Code but optimized for:

- File management
- Batch processing
- n8n webhook triggers
- Local storage

---

## n8n Integration

### Webhook Events

```typescript
interface N8nWebhookPayload {
  event:
    | "song.created"
    | "lyrics.generated"
    | "audio.generated"
    | "cover.created"
    | "social.posted"
    | "album.released";

  data: {
    songId: string;
    userId: string;
    type: string;
    // ... event-specific data
  };

  actions: {
    uploadToDistrokit?: boolean;
    postToSpotify?: boolean;
    notifyCommunity?: boolean;
  };
}
```

### Sample n8n Workflows

1. **Auto-Release** — Generate → Upload to DistroKit → Post to social
2. **Backup** — Song created → Save to Google Drive → Archive
3. **Community** — Song released → Post to Arcanea community → Notify followers

---

## Implementation Priority

### Phase 1: Core (This Session)

1. ✅ SPEC.md (this file)
2. Web app: `/records` hub page
3. Web app: `/create-song` basic flow
4. Claude Code skill: Songseed, Lyricist, SunoEngineer

### Phase 2: Enhancement (Next)

1. VibeEngineer agent
2. Cover Art integration (reuse Infogenius)
3. Style learning basic implementation

### Phase 3: Social & Community

1. Social Composer agent
2. Community gallery
3. Basic sharing

### Phase 4: Advanced

1. Full style learning (AgentDB)
2. Persona management
3. n8n integration
4. Distribution automation

---

## The Vision

> _"Let worlds through music arise."_

Arcanea Records is more than a tool — it's a **living creative partner** that:

- Knows your style better than you know it yourself
- Adapts to how YOU want to work (not the other way around)
- Connects you with a community of creators
- Helps you build a legacy through music

Every song you create makes the system smarter.
Every lyric you write refines your persona.
Every vibe you choose trains your style profile.

**Welcome to Arcanea Records — where your sonic universe begins.**

---

_Last Updated: February 2026_
_Version: 1.0_
_Status: Building_
