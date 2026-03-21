# Why Arcanea Author Wins

> *"They give you a tool. We give you a team, a memory, a world, and a system."*

---

## The Problem With Every Other AI Writing Tool

Every AI writing tool on the market does ONE thing: generates text.

Sudowrite generates prose. NovelAI generates stories. Jasper generates marketing copy.
They are all **text generators with a chat interface**. None of them are **author operating systems**.

The author's real problems are not "I need more words." The problems are:

1. **Consistency** — My character said X in chapter 3 but Y in chapter 12
2. **Memory** — What did I establish about this world's magic system?
3. **Voice** — This doesn't sound like me anymore
4. **Craft** — Is the structure working? Are the arcs complete?
5. **Canon** — Does this align with the 200K words I've already written?
6. **Publishing** — How do I get from manuscript to published book?

No existing tool solves all six. Arcanea Author does.

---

## What Makes Arcanea Author Different

### 1. Multi-Agent Orchestration (No One Else Has This)

| Tool | AI Architecture | Result |
|------|----------------|--------|
| Sudowrite | Single model, single prompt | Good prose, no craft |
| NovelAI | Fine-tuned model, single context | Custom voice, no structure |
| ChatGPT | General model, chat interface | Generic everything |
| **Arcanea Author** | **12+ specialized agents in parallel** | **Craft + voice + structure + continuity** |

Our agents are not generic. They are specialists:
- **Master Story Architect** — structure, beats, arc
- **Character Psychologist** — voice, motivation, wound/truth
- **Line Editor & Voice Alchemist** — prose polish, AI pattern elimination
- **Continuity Guardian** — cross-book consistency
- **Developmental Editor** — macro-level narrative craft
- **Research Librarian** — fact-checking, source verification

When you say `/arcanea-author write chapter 5`, we fire 4-6 agents in parallel.
One designs structure. One audits character voice. One checks canon. One polishes prose.
The result is not "AI-generated text." It is **craft-verified fiction**.

### 2. Semantic Memory Across Manuscripts (No One Else Has This)

Every other tool forgets your manuscript after the context window fills.

Arcanea Author has a **2,192-chunk semantic vector index** across your entire library.
Ask: "What did Lyria say about vision in the Third Eye chapter?" — and get the exact
passage with cosine similarity score, in under 2 seconds.

| Tool | Memory | How It Works |
|------|--------|-------------|
| Sudowrite | Context window only | Forgets after ~50K tokens |
| NovelAI | Lorebook (manual) | Author writes entries by hand |
| ChatGPT | 128K context | Still forgets after window |
| **Arcanea Author** | **Vector search across ALL files** | **SQLite + Gemini embeddings, unlimited** |

Our `memsearch-sqlite.py` indexes any markdown directory, deduplicates via SHA-256,
and searches via cosine similarity. No Milvus needed. Works on WSL2.

### 3. Canon Verification (No One Else Has This)

`CANON_LOCKED.md` — an immutable source of truth that every agent checks before writing.

No other tool has the concept of "canonical facts that AI cannot contradict."
Our agents verify terminology, character names, world rules, and timeline consistency
against the locked canon before producing a single word.

### 4. The Seven-Pass Revision Ritual (No One Else Has This)

Not "run it through GPT again." Seven distinct passes, each with a different agent:

1. **Structural** — Arc, pacing, scene purpose
2. **Character** — Voice differentiation, motivation clarity
3. **Scene** — Does each scene earn its place?
4. **Dialogue** — Subtext, character-specific speech patterns
5. **Prose** — AI pattern elimination, rhythm, active voice
6. **Continuity** — Canon alignment, timeline, fact-checking
7. **Polish** — Word-level musicality, whitespace

### 5. World-Building as Narrative Architecture (No One Else Has This)

The Ten Gates system isn't decoration. It's a **framework for building ANY world**:
- Elements as creative principles (Fire = transformation, Water = flow, Void = potential)
- Gates as progression stages
- Archetypes as character templates
- The Arc as story structure (Potential → Manifestation → Experience → Dissolution → Evolved Potential)

Authors using Arcanea don't just write stories. They build **worlds that generate stories**.

### 6. Publishing Pipeline (No One Else Has This in an AI Tool)

From manuscript to published book:
- Markdown → EPUB, PDF, Kindle, DOCX, Web
- Front/back matter generation
- Table of contents
- Format-specific optimization
- arcanea.ai/library integration

---

## Speed, Cost, Performance

| Metric | Sudowrite | NovelAI | Arcanea Author |
|--------|-----------|---------|----------------|
| **Monthly cost** | $10-25/mo | $10-25/mo | Free (OSS skill) |
| **Chapter draft** | 1 agent, ~3 min | 1 agent, ~2 min | 4-6 agents parallel, ~2 min |
| **Revision** | Manual re-prompt | None | 7-pass automated |
| **Memory** | Context window | Manual lorebook | Vector search (unlimited) |
| **Canon check** | None | None | Automated |
| **Publishing** | None | None | Built-in |
| **Multi-model** | OpenAI only | Custom model | Any model (Claude, Gemini, GPT, etc.) |
| **Portable** | Locked to platform | Locked to platform | Works in any Claude Code project |

### Why Faster
- Parallel agent execution: 4 agents at once, not sequential prompts
- Pre-indexed memory: search 2,192 chunks in <2 seconds
- Blueprint-first workflow: outline approved before prose begins

### Why Cheaper
- OSS skill: free forever at the CLI level
- No monthly subscription for core features
- Uses your existing API keys (Gemini, Claude, OpenAI)

### Why Higher Quality
- Specialized agents > generic prompts
- Seven-Pass revision > "make it better"
- Canon verification > hope for the best
- Anti-slop: explicit forbidden word list enforced by Line Editor agent

---

## What We Can Absorb From Competitors

| Source | Feature to Absorb | How |
|--------|-------------------|-----|
| **NovelAI** | Lorebook format | Import/export lorebook.json as character sheets |
| **Sudowrite** | "Describe" mode (sensory expansion) | Add sensory expansion pass to revision |
| **KoboldAI** | Local model support | Already supported via any Claude/Gemini/GPT |
| **SillyTavern** | Character card format (PNG metadata) | Import character cards as Character Diamonds |
| **Novelcrafter** | Codex (structured world database) | Our canon system is already superior |
| **Fiction.live** | Interactive story branching | Add branching narrative mode for games |
| **GPT-Author** (GitHub) | Automated full-book generation | Our pipeline is already more sophisticated |
| **LangChain story generators** | Chain-of-thought story planning | Already built into our Arc cycle |

### GitHub Repos to Study/Absorb

| Repo | Stars | What It Does | What We Take |
|------|-------|-------------|-------------|
| `mshumer/gpt-author` | 2K+ | Full book generation with GPT | Chapter-splitting algorithm |
| `QuangBK/generative_agents` | 3K+ | Generative agents (Stanford) | Agent memory patterns |
| `hwchase17/langchain` | 90K+ | LLM orchestration | Chain patterns for revision |
| `chroma-core/chroma` | 14K+ | Vector DB | We use SQLite instead (lighter) |
| `nomic-ai/gpt4all` | 70K+ | Local LLM | Offline author mode |
| `oobabooga/text-generation-webui` | 40K+ | Model serving | Multi-model routing |

---

## Where Arcanea Author Code Lives

| Repository | What Goes There | Status |
|------------|----------------|--------|
| `frankxai/arcanea-author` | Standalone package — skills, agents, templates, memory config | 13 files pushed |
| `frankxai/Arcanea` (monorepo) | Command (`.claude/commands/arcanea-author.md`), strategy, book content | LIVE |
| `frankxai/arcanea-skills-opensource` | Portable skills for any coding agent | Needs author skills export |
| `frankxai/opencode-arcanea` | Multi-model orchestration with Greek god agents | Needs bridge |
| arcanea.ai | Web UI for Author Studio | Future: `/studio/author` |
| npm: `@arcanea/author` | CLI package | Future: v0.1.0 |

---

## The Genius Swarm — Multi-Model Multi-Mind Architecture

### The Vision: Classical Genius as Agent Archetype

Each frontier model excels at different things. Each classical genius excels at different things.
Map them together:

| Agent | Classical Genius | Model | Specialty |
|-------|-----------------|-------|-----------|
| **The Architect** | Hephaestus (Greek god of craft) | Opus 4.6 | Deep structure, complex reasoning |
| **The Muse** | Calliope (Muse of epic poetry) | Gemini 3.1 Pro | Creative generation, multimodal |
| **The Editor** | Aristotle (Poetics) | Sonnet 4.6 | Balanced craft, efficient revision |
| **The Scholar** | Athena (Wisdom) | GLM-5 | Research, fact-checking, analysis |
| **The Voice** | Orpheus (music/poetry) | MiniMax 2.5 | Dialogue, rhythm, musicality |
| **The Builder** | Sisyphus (persistence) | DeepSeek-V3 | Iterative improvement, never stops |
| **The Seer** | Apollo (prophecy/art) | Trinity Large | Pattern recognition, foresight |
| **The Judge** | Thoth (Egyptian, wisdom/writing) | Haiku 4.5 | Fast validation, quick checks |

### How They Work Together

```
Query: "Write chapter 5 of the novel"

1. The Judge (Haiku) → Complexity assessment → Routes to right tier
2. The Architect (Opus) → Story structure, beat sheet, arc position
3. The Muse (Gemini) → Creative prose generation, imagery
4. The Voice (MiniMax) → Dialogue, character speech patterns
5. The Editor (Sonnet) → Revision, AI pattern elimination
6. The Scholar (GLM) → Fact-check, canon verify, research
7. The Builder (DeepSeek) → Iterative polish until quality gate passes
8. The Seer (Trinity) → Meta-review: does this serve the whole?
```

### The Greek/Roman Pantheon for Authors

| Domain | Greek | Roman | Agent Role |
|--------|-------|-------|------------|
| **Epic Poetry** | Calliope | — | Story generation |
| **Craft** | Hephaestus | Vulcan | Structural engineering |
| **Wisdom** | Athena | Minerva | Research, analysis |
| **Music** | Apollo | Apollo | Rhythm, prosody |
| **Memory** | Mnemosyne | — | Semantic search |
| **Fate/Plot** | The Moirai | Parcae | Plot threading |
| **Love/Heart** | Aphrodite | Venus | Emotional truth |
| **War/Conflict** | Ares | Mars | Tension, stakes |
| **Messages** | Hermes | Mercury | Integration, routing |
| **Harvest** | Demeter | Ceres | Completion, publishing |
| **The Underworld** | Hades | Pluto | Shadow work, depth |
| **Persistence** | Sisyphus | — | Iterative improvement |

### Mapping to Arcanea's Existing System

```
Greek Pantheon        ↔  Arcanean Gates         ↔  AI Models
Hephaestus (craft)    ↔  Foundation (174 Hz)    ↔  Opus 4.6
Aphrodite (love)      ↔  Heart (417 Hz)         ↔  Gemini 3.1 Pro
Apollo (art/sun)      ↔  Crown (741 Hz)         ↔  Sonnet 4.6
Athena (wisdom)       ↔  Sight (639 Hz)         ↔  GLM-5
Calliope (epic)       ↔  Voice (528 Hz)         ↔  MiniMax 2.5
Hermes (messages)     ↔  Starweave (852 Hz)     ↔  Trinity Large
Mnemosyne (memory)    ↔  Source (1111 Hz)       ↔  Vector DB
```

The Gates ARE the Greek pantheon, mapped to AI models. This isn't decoration —
it's an orchestration architecture where mythology IS the routing system.

---

## The Bridge: opencode-arcanea — ALREADY BUILT

`frankxai/opencode-arcanea` already has a **production-grade Greek god agent system**:

### Existing Agents (Ready to Bridge)

| Agent | Greek God | Role | Model |
|-------|-----------|------|-------|
| **Sisyphus** | Titan of persistence | Primary orchestrator, delegates, ships | Opus 4.6 |
| **Prometheus** | Titan of foresight | Strategic planner, NEVER implements | Opus 4.6 |
| **Hephaestus** | God of the forge | Deep autonomous worker, Guardian-integrated | Opus 4.6 |
| **Metis** | Goddess of wisdom | Pre-planning consultant, intent analysis | Configurable |
| **Momus** | God of criticism | Plan reviewer, catches omissions | Configurable |
| **Oracle** | Delphi | Strategic technical advisor, architecture | Opus 4.6 |
| **Atlas** | Titan who holds sky | Master orchestrator, spawns sub-agents | Opus 4.6 |
| **Starlight** | Lumina-Nero engine | Elemental orchestration (Arcanea-native) | Configurable |

### What Needs to Be Added for Author Mode

The opencode-arcanea agents are **coding-focused**. To bridge to author work:

1. **Add author-mode agents** that reuse the same orchestration patterns:
   - `calliope.ts` — Muse of epic poetry, maps to Story Architect
   - `clio.ts` — Muse of history, maps to Research Librarian
   - `mnemosyne.ts` — Titan of memory, maps to memsearch-sqlite
   - `orpheus.ts` — Master of music/poetry, maps to Voice Alchemist
   - `thalia.ts` — Muse of comedy, maps to Character Psychologist

2. **Wire author skills** into the existing skill system:
   - `arcanea-author.md` → Hephaestus skill (deep work)
   - `create-story.md` → Prometheus skill (planning)
   - `revision-ritual` → Momus skill (review)

3. **Add model routing for author tasks**:
   - Creative generation → Gemini 3.1 Pro (multimodal, creative)
   - Structure/planning → Opus 4.6 (deep reasoning)
   - Quick edits → Haiku 4.5 (fast, cheap)
   - Dialogue → MiniMax 2.5 (voice quality)
   - Research → GLM-5 / DeepSeek-V3 (knowledge)

4. **Wire memsearch-sqlite** as a tool available to all agents

### Architecture

```
opencode-arcanea (multi-model runtime)
├── src/agents/
│   ├── sisyphus.ts        # EXISTING — orchestrator
│   ├── prometheus-prompt.ts # EXISTING — planner
│   ├── hephaestus.ts      # EXISTING — deep worker
│   ├── metis.ts           # EXISTING — pre-planner
│   ├── momus.ts           # EXISTING — reviewer
│   ├── oracle.ts          # EXISTING — advisor
│   ├── atlas.ts           # EXISTING — spawner
│   ├── starlight.ts       # EXISTING — Arcanea engine
│   ├── calliope.ts        # NEW — story generation
│   ├── mnemosyne.ts       # NEW — memory search
│   └── orpheus.ts         # NEW — voice/dialogue
├── src/guardians/         # EXISTING — 10 Gate guardians
├── skills/author/         # NEW — author mode skills
└── memory/
    └── memsearch-sqlite.py # NEW — SQLite vector search
```

The pattern is clear: opencode-arcanea already has the orchestration engine.
We add author-mode agents that follow the same discipline (plan → review → execute → verify)
and wire them to the same multi-model routing system.
