# Author Intelligence System — Technical Specification

> *"Every author is a world-builder. Every world needs an operating system."*

---

## 1. Product Definition

### AuthorOS (Universal)
**Repo**: `frankxai/author-os`
**License**: MIT
**Target**: Any author using any coding agent

An open-source author operating system that provides:
- Multi-agent orchestration (12+ specialized agents)
- Semantic memory across manuscripts (SQLite + Gemini embeddings)
- Seven-Pass structured revision methodology
- Character Diamond framework
- Publishing pipeline (epub/pdf/kindle/docx/web)
- Multi-modal content generation (image/audio/video)
- Multi-coding-agent support (Claude Code, OpenCode, Codex, Gemini CLI)

### Arcanean AuthorOS (Extended)
**Repo**: `frankxai/arcanea-author`
**License**: Arcanea Proprietary
**Target**: Arcanea creators and mythology-enhanced authoring

Everything in AuthorOS PLUS:
- Ten Gates author progression system
- Five Elements writing modes
- Guardian-assisted craft (Maylinn for Heart work, Lyria for Sight, etc.)
- Canon verification against CANON_LOCKED.md
- Web3 integration (story NFTs, world licenses, remix tokens)
- Multiverse framework (build YOUR universe using the Gates/Elements system)
- Game development bridge (world → Godot/Unity)
- VR/AR experience authoring

---

## 2. The Ten Gates of Authorship

Each Gate represents a stage of mastery. Authors progress through them.
The system tracks which Gates they've "opened" based on their work.

| Gate | Hz | Mastery Level | Author Skill | Unlocked Capabilities |
|------|-----|---------------|-------------|----------------------|
| **Foundation** | 174 | Apprentice | Structure, outline, research | `story-architect`, `draft-zero` |
| **Flow** | 285 | Apprentice | First draft, finding voice | `describe`, free-writing mode |
| **Fire** | 396 | Mage | Revision, cutting, strengthening | `line-editor`, Seven-Pass |
| **Heart** | 417 | Mage | Emotional truth, vulnerability | `character-psych`, deep dialogue |
| **Voice** | 528 | Master | Unique voice, dialogue mastery | Voice fingerprinting, anti-slop |
| **Sight** | 639 | Master | Theme, symbolism, subtext | Thematic analysis, beta reader sim |
| **Crown** | 741 | Archmage | Genre mastery, market awareness | Publishing strategy, positioning |
| **Starweave** | 852 | Archmage | Multi-perspective, transformation | POV switching, unreliable narrator |
| **Unity** | 963 | Luminor | Series cohesion, universe building | Series Bible, cross-book continuity |
| **Source** | 1111 | Luminor | Meta-authorship, teaching others | Course creation, world licensing |

### Progression Tracking

```json
{
  "author": "frank",
  "gates_open": 6,
  "rank": "Master",
  "skills_unlocked": ["story-architect", "draft-zero", "describe", "line-editor", "seven-pass", "character-psych", "deep-dialogue", "voice-fingerprint", "anti-slop"],
  "current_gate": "sight",
  "books_completed": 3,
  "words_written": 245000,
  "revision_passes_completed": 21,
  "canon_coverage": 0.78
}
```

---

## 3. Five Elements Writing Modes

Each Element is a writing mode with distinct characteristics.

| Element | Mode | Temperature | Speed | Best For |
|---------|------|-------------|-------|----------|
| **Fire** | Fast Draft | 0.9 | High | Burn through blocks, raw energy, first pass |
| **Water** | Flow State | 0.7 | Medium | Intuitive writing, emotional scenes, dialogue |
| **Earth** | Structure | 0.3 | Low | Outlines, research, world-building, planning |
| **Wind** | Freedom | 0.8 | High | Dialogue, quick scenes, brainstorming, play |
| **Void** | Reflection | 0.1 | Slow | Theme work, revision, depth, cutting |

### Mode Switching

```bash
/author write --mode fire "chapter 7"     # Fast, raw, energetic
/author write --mode water "love scene"    # Emotional, flowing
/author write --mode earth "magic system"  # Structured, precise
/author write --mode wind "dialogue"       # Quick, free, playful
/author write --mode void "theme pass"     # Deep, reflective, cutting
```

---

## 4. Multi-Modal Content Pipeline

### Text → Everything

```
MANUSCRIPT (markdown)
├── → EPUB (pandoc)
├── → PDF (LaTeX/puppeteer)
├── → KINDLE (KindleGen)
├── → DOCX (pandoc)
├── → WEB (arcanea.ai/library)
├── → BLOG (Ghost/Substack serial)
├── → IMAGE (scene illustrations via Imagen/DALL-E)
├── → AUDIO (narration via ElevenLabs, soundtrack via Suno)
├── → VIDEO (trailer via Kling/Runway, social via Canva)
├── → GAME (world → Godot/Unity export)
├── → VR/AR (immersive world via WebXR)
└── → WEB3 (chapter NFTs, world licenses, remix tokens)
```

### Image Generation Integration

| Use Case | Model | Trigger |
|----------|-------|---------|
| Character portraits | Gemini Imagen / DALL-E | From Character Diamond description |
| Scene illustrations | Nano Banana / Midjourney | From scene description in manuscript |
| Cover art | DALL-E / Ideogram | From genre + theme + Character Diamond |
| Maps | Custom pipeline | From geography.md world doc |
| Social media cards | Canva MCP | From key quotes and scenes |

### Audio Pipeline

| Use Case | Model | Input |
|----------|-------|-------|
| Chapter narration | ElevenLabs | Manuscript text |
| Per-chapter soundtrack | Suno AI | Scene mood + genre + tempo |
| Full audiobook | ElevenLabs + Suno | Combined narration + music |
| Podcast episodes | TTS + editing | Chapter excerpts + commentary |

### Video Pipeline

| Use Case | Model | Input |
|----------|-------|-------|
| Book trailer | Kling / Runway | Key scenes + character art |
| Lore videos | Kling + narration | World-building docs |
| Social reels | Canva + TTS | Key quotes, 15-60 seconds |
| Behind-the-scenes | Screen recording | Writing process |

---

## 5. Web3 Integration (Arcanean AuthorOS)

### Story NFTs
- Each chapter can be minted as a collectible
- Holders get early access, voting rights on plot decisions
- On-chain provenance for original content

### World Licenses
- Other creators can build in your universe (licensed)
- Revenue sharing via smart contracts
- Canon verification ensures licensed works stay consistent

### Remix Tokens
- Collaborative world-building with attribution
- Fork a world, extend it, share back
- On-chain creative genealogy

### Creator Royalties
- Perpetual royalties on all derivative works
- Transparent on-chain tracking
- Automatic distribution via smart contracts

---

## 6. Game Development Bridge

### World → Game Export

```
worldbuilding/
├── geography.md      → Game map/level design
├── magic-system.md   → Game mechanics/abilities
├── characters/       → NPCs, party members
│   └── [name].md     → Stats, dialogue trees
├── factions.md       → Reputation system
├── quests.md         → Quest lines from plot threads
└── items.md          → Equipment, artifacts
```

### Target Engines
- **Godot** — GDScript export, scene definitions
- **Unity** — C# scriptable objects
- **Unreal** — Blueprint-compatible data
- **Twine** — Interactive fiction export
- **Ink** — Narrative scripting language
- **ChoiceScript** — Choice-based game format

---

## 7. Multi-Coding-Agent Orchestration

### The Dream Setup

```
┌──────────────────────────────────────────────────────┐
│                 AUTHOR'S DESKTOP                      │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Terminal 1: Claude Code (Opus)                       │
│  └── Deep structure, complex revision, canon work     │
│                                                       │
│  Terminal 2: OpenCode (Gemini + MiniMax)               │
│  └── Creative drafting, dialogue, multimodal           │
│                                                       │
│  Terminal 3: Codex (GPT)                               │
│  └── Research, cultural references, broad knowledge    │
│                                                       │
│  Terminal 4: Gemini CLI                                │
│  └── Image generation, visual world-building           │
│                                                       │
│  SHARED: ~/.memsearch/vectors.db (SQLite)              │
│  └── All agents read/write same semantic index         │
│                                                       │
│  SHARED: ./manuscript/ (filesystem)                    │
│  └── All agents read/write same chapter files          │
│                                                       │
│  SHARED: ./tasks/ (markdown task files)                │
│  └── Central orchestrator delegates via task files      │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Why SQLite is the Key

SQLite is a **file**, not a server. This means:
- Any process can read it (all coding agents)
- WAL mode allows concurrent reads
- No installation, no configuration, no ports
- Portable across OS, shareable via filesystem
- The same vectors.db works for Claude Code, OpenCode, Codex, and Gemini CLI

### Task Delegation Pattern

```markdown
# tasks/current.md

## Active Tasks

- [ ] CLAUDE: Revise chapter 5 (structural pass) @priority:high
- [ ] OPENCODE: Draft chapter 6 scenes 1-3 @priority:medium
- [ ] CODEX: Research medieval siege warfare for chapter 7 @priority:low
- [ ] GEMINI: Generate character portrait for Kael @priority:low

## Completed
- [x] CLAUDE: Story blueprint approved
- [x] OPENCODE: Chapter 4 first draft
```

Each agent checks `tasks/current.md` for its assignments.
The human author is the orchestrator — assigning tasks to the right agent.

---

## 8. Publishing Intelligence

### Content Cascade

One piece of content, many outputs:

```
IDEA
 └── Blog Post (1,000 words)
      ├── Twitter Thread (10 tweets)
      ├── LinkedIn Post (300 words)
      └── Newsletter Section (500 words)
           └── Chapter Draft (3,000 words)
                ├── Revised Chapter (3,000 words)
                │    └── Book (60,000 words)
                │         ├── EPUB
                │         ├── PDF
                │         ├── Kindle
                │         ├── Audiobook
                │         └── Web3 NFT
                ├── Scene Illustration
                ├── Character Portrait
                └── Social Reel (30s video)
```

### Platform Adapters

| Platform | Format | Automation |
|----------|--------|------------|
| Amazon KDP | epub + cover + metadata | `publish/kindle.sh` |
| Apple Books | epub | `publish/epub.sh` |
| Google Play Books | epub | Same |
| IngramSpark | PDF (print) | `publish/pdf.sh` |
| Kobo | epub | Same |
| arcanea.ai | Markdown → web | `publish/web.sh` |
| Substack | Markdown → email | `publish/newsletter.sh` |
| Ghost | Markdown → blog | API integration |

---

## 9. Quality Assurance

### The Nine-Point Quality Gate

Every piece of content must pass:

1. **Voice authentic** — sounds like the author, not AI
2. **No AI verbal tics** — zero instances of banned words
3. **Active voice dominant** — passive voice < 15%
4. **Character voices distinct** — each character sounds different
5. **Concrete imagery** — specific over abstract
6. **Emotional truth earned** — shown, not stated
7. **Canon consistent** — verified against lorebook/canon
8. **Continuity verified** — no contradictions
9. **Scene purpose clear** — each scene advances plot AND reveals character

### Measurement

```bash
# Run quality check
/author quality-check chapter-5.md

# Output:
# Voice: PASS (0 AI tics detected)
# Active voice: PASS (87% active)
# Canon: PASS (12 entities verified)
# Continuity: WARNING (Character age inconsistency in paragraph 4)
# Overall: 8/9 PASS — fix continuity before publishing
```

---

## 10. The Why

Authors don't need another chatbot. They need a system that:

1. **Remembers everything** — every character, every plot thread, every world rule
2. **Brings expertise** — structure, character psychology, prose craft, publishing
3. **Maintains quality** — catches AI patterns, enforces standards, verifies canon
4. **Scales** — from blog post to book series to multimedia franchise
5. **Respects the author** — the human leads, the system supports

This is not about replacing authors. It's about giving authors the same kind of tooling that software engineers have had for decades: version control, CI/CD, linting, testing, deployment pipelines. But for books.

**AuthorOS is CI/CD for books.**
**Arcanean AuthorOS is CI/CD for universes.**
