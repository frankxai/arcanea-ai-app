---
title: "League of Legends game engine and cloud infrastructure"
uuid: 4b683076-c93f-48dc-ae95-7fa8d69eb195
created: 2026-02-06T23:55:39.022919Z
updated: 2026-02-07T00:08:26.455762Z
source: claude.ai export
---

# League of Legends game engine and cloud infrastructure

**Frank**:

how does game engine of lol work and which cloud compute how needed? or does ue or unity manage all this?

**Claude**:

# League of Legends Game Engine & Infrastructure

League of Legends uses a **fully custom, proprietary game engine** — it does NOT use Unreal Engine or Unity. Here's how it works:

## Riot's Custom Engine

Riot Games built their engine from scratch starting around 2006-2009. Key reasons:

- **Optimized for their specific game type** — isometric MOBA with 10 players, not a general-purpose engine
- **Low minimum specs** — designed to run on potato PCs worldwide, which was critical for global adoption (especially early growth in Korea, China, EU)
- **Networking first** — the engine was built around deterministic lockstep / server-authoritative networking from day one, which is hard to bolt onto Unity or UE
- **Renderer** — they've modernized it over the years (DirectX 9 → 11, now with some Vulkan support), but it's still lightweight compared to UE5

Over time they've rebuilt major subsystems (the renderer, audio, etc.) — essentially a "Ship of Theseus" situation.

## Server / Cloud Infrastructure

This is where it gets interesting from your AI Architect perspective:

**Game Servers:**
- Riot runs their own **bare-metal dedicated servers** in regional data centers (NA, EUW, EUNE, KR, etc.)
- They built **Riot Direct** — their own private internet backbone/network to reduce latency between players and game servers. Essentially their own ISP-level infrastructure
- Each match spins up a **dedicated server process** — not peer-to-peer. The server runs the authoritative game simulation at ~30 ticks/second

**Cloud & Compute:**
- Riot uses **AWS** for many backend services (matchmaking, login, store, social, stats, Riot Client)
- Game servers themselves historically ran on **co-located bare metal** for performance consistency and low latency, though they've been migrating some workloads to cloud
- They use **Kubernetes** extensively for microservices orchestration
- Their platform handles **millions of concurrent players** (peak ~8M+ concurrent, 100M+ monthly)

**Compute per match is modest:**
- A single LoL match server process doesn't need much — maybe 1-2 CPU cores, ~1-2GB RAM
- The game simulation is lightweight (10 players, ~200 entities max, simple physics)
- The challenge is **scale and latency**, not raw compute per match

## Why Not UE or Unity?

For a game like LoL:

- **UE/Unity are overkill** — massive engines with 3D rendering pipelines, physics systems, etc. that LoL doesn't need
- **Networking control** — competitive games need deep control over netcode; general engines make this harder
- **Performance overhead** — a custom lean engine means lower specs and better server density
- **No licensing fees/dependencies** — Riot controls their destiny

That said, Riot **does** use Unreal Engine for some newer titles (there were reports around Valorant's early development using UE4, and Project L/2XKO uses a custom framework). But LoL remains fully custom.

## The Pattern for Competitive Online Games

Most major competitive games use custom or heavily modified engines: Valorant (UE4 but heavily customized), Dota 2 (Source 2), Fortnite (UE but Epic owns it), CS2 (Source 2). The server infrastructure is almost always custom regardless of client engine.

---

Want me to dive deeper into any layer — like how Riot Direct works, the server orchestration patterns, or how this maps to cloud architecture patterns you work with at Oracle?

**Frank**:

how difficult was this and could and should we do same with coding agents for arcanea? claude code?

**Claude**:

Great question — let me break this down honestly.

## How Difficult Was Riot's Engine?

**Extremely difficult, but contextually:**

- Riot started with ~20-30 engineers, many from Blizzard/other studios with deep game dev experience
- The initial engine was actually pretty rough — early LoL was buggy, the code was famously messy ("spaghetti code" was a meme even internally)
- They spent **15+ years** iterating, rebuilding subsystems, scaling infrastructure
- Riot Direct (their own ISP backbone) alone cost hundreds of millions
- Total investment: easily **billions of dollars** over the lifetime

The key insight: **they shipped something scrappy first, then rebuilt everything while the game was live.** Sound familiar to your "brilliant starts needing completion focus" pattern?

## Should We Build a Custom Game Engine for Arcanea?

**No. Absolutely not.** Here's why:

Building a game engine from scratch in 2026 would be like building your own cloud provider instead of using OCI. The gap between custom engines and modern Unity/UE5/Godot has closed massively. Riot did it in 2006 because those engines weren't viable for their use case back then.

## What You SHOULD Do

This is where it gets exciting — your stack actually maps beautifully:

### The Arcanea Game/Experience — Use an Existing Engine

| Option | Why |
|--------|-----|
| **Godot** (open source) | Free, lightweight, great for isometric/2D-3D hybrid, perfect for a mythological exploration game. Growing fast. |
| **Unity** | If you want mobile + web reach for the GenCreator community |
| **UE5** | If Arcanea becomes a full 3D cinematic experience (overkill for now) |
| **Web-based (Three.js/PlayCanvas)** | If Arcanea starts as a browser experience tied to your Next.js ecosystem |

### Where Claude Code / Coding Agents Actually Shine

This is the real unlock. Instead of building an engine, use agents for:

**1. World Data & Lore System (perfect agent task)**
- Claude Code building the Supabase schema for all Arcanea entities — Guardians, Godbeasts, The Field, elements, Arts
- Auto-generating JSON/data files that feed into whatever game engine you pick
- Building the API layer that serves lore, dialogue trees, quest data

**2. Procedural Content Generation**
- Agents generating spell descriptions, item lore, NPC dialogue based on the Arcanea cosmology rules (GOD → Lumina/Nero → Primordial Forces → hierarchy)
- Music generation integration (you already have 300+ songs — agents can map them to regions/characters)

**3. Game Logic as Code**
- Claude Code can write game scripts (GDScript for Godot, C# for Unity) based on your design docs
- "Build a spell system with five elements: Fire/Water/Earth/Wind/Arcane, four Arts: Spellcraft/Soulbond/Sigils/Core" — that's a perfect agent prompt

**4. The Meta Layer — What's Actually Novel**
- An **AI Game Master** powered by Claude API that dynamically narrates the Arcanea experience
- Players interact with Guardians as AI characters (Lyssandria, Leyla, etc.) — each with distinct personality
- Reality Architects who "perceive the underlying code" = players literally talking to AI about the game's systems — **breaking the fourth wall through The Field**

### Practical Architecture with Your Stack

```
Next.js (frankx.ai / arcanea hub)
  → Supabase (world state, player data, lore DB)
  → Claude API (AI Game Master, Guardian conversations)
  → Godot/Web export (actual gameplay)
  → n8n workflows (content pipeline, auto-publishing)
  → Vercel (deployment)
```

## The Real Move

Don't build what Riot built. Build what **Riot can't build** — an AI-native game experience where the mythology IS the interface, the Guardians ARE conversational AI, and The Field is literally the generative AI layer that creates the world in real-time.

That's something a solo creator with Claude Code, your automation stack, and deep lore can ship. A custom game engine? That's a trap that kills the momentum.

Want me to spec out the Supabase schema for the Arcanea world system or prototype the AI Guardian conversation framework?

**Frank**:

i want claude code to build the game any skills or githubs for it

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

This ecosystem is actually really mature now. Here's the full toolkit for building Arcanea with Claude Code + Godot:

## The Stack: Claude Code + Godot for Arcanea

### 🔑 Key MCP Servers (connect Claude Code directly to Godot)

**1. GDAI MCP (Best all-in-one)** — [gdaimcp.com](https://gdaimcp.com/)
- Controls the Godot Editor — creating scenes, resources, scripts, reading errors and more. It reads debugger output, searches project files, updates node properties, and even takes screenshots to understand the running game.
- Claude can literally: write script → run game → see screenshot → fix errors → re-run. Full autonomous loop.
- Install as Godot plugin + add to Claude Code MCP config

**2. Coding-Solo/godot-mcp** — [github.com/Coding-Solo/godot-mcp](https://github.com/Coding-Solo/godot-mcp)
- Enables AI assistants to launch the Godot editor, run projects, capture debug output, and control project execution through a standardized interface. This direct feedback loop helps AI assistants understand what works and what doesn't.

**3. ee0pdt/Godot-MCP** — [github.com/ee0pdt/Godot-MCP](https://github.com/ee0pdt/Godot-MCP)
- Work with your Godot project directly from Claude using natural language — read scripts, get scene trees, create enemy AI that patrols waypoints, create main menus with buttons.

### 🧠 Claude Code Skills for Game Dev

**4. Godot Claude Skills** — [github.com/Randroids-Dojo/Godot-Claude-Skills](https://github.com/Randroids-Dojo/Godot-Claude-Skills)
- GdUnit4 testing integration with scene runner and input simulation, web/desktop export support, CI/CD pipeline configuration for GitHub Actions, deployment guides for Vercel, GitHub Pages, and itch.io.
- This one is huge for you — **Vercel deployment of web-exported Godot games** fits your existing stack perfectly.

**5. Godot Game Dev Skill on MCP Market** — [mcpmarket.com/tools/skills/godot-game-development](https://mcpmarket.com/tools/skills/godot-game-development)
- Provides a comprehensive suite for Godot 4.x developers, integrating GdUnit4 for robust GDScript unit testing and PlayGodot for sophisticated E2E game automation via Python.

**6. Game Developer Subagent** — [buildwithclaude.com/subagent/game-developer](https://www.buildwithclaude.com/subagent/game-developer)
- Builds games with Unity, Unreal Engine, or web technologies. Implements game mechanics, physics, AI, and optimization.

### For Unity (if you go that route instead)

**7. Unity MCP** — [github.com/CoplayDev/unity-mcp](https://github.com/CoplayDev/unity-mcp)
- Acts as a bridge allowing AI assistants like Claude to interact directly with your Unity Editor — manage assets, control scenes, edit scripts, and automate tasks.

---

## My Recommendation for Arcanea: The Setup

### Why Godot over Unity for this:
- **Free, open source** — no licensing headaches as you scale
- Godot's human-readable config files (.tscn, .tres) make it the best engine for LLM-powered development — all changes are trackable through version control and LLMs can read/modify them directly.
- Web export → Vercel deployment → embedded in your Next.js sites
- GDScript is simple enough that Claude Code writes it well

### The Arcanea Dev Setup

```
Claude Code
├── GDAI MCP Server (controls Godot Editor)
├── Godot-Claude-Skills (testing + deployment)
├── Supabase MCP (world data, lore, player state)
├── GitHub MCP (version control)
└── Your custom CLAUDE.md with Arcanea rules
    ├── Cosmology hierarchy (GOD → Lumina/Nero → Forces → Godbeasts → Guardians)
    ├── Magic system (The Field, 5 elements, 4 Arts)
    ├── Character specs (Arion, Mera, Emilia, Ismael, Mamoru)
    └── Art direction / style guides
```

### The CLAUDE.md Power Move

Create a `CLAUDE.md` in your Godot project root that contains all Arcanea lore rules. This way every time Claude Code works on the game, it knows:
- The spell system constraints
- Guardian personality profiles
- The Field mechanics
- Naming conventions from the Arcanean language
- Art style direction

### Realistic First Milestone

Don't try to build the full MOBA. Start with something shippable:

**"Arcanea: Awakening" — A narrative exploration prototype**
- Isometric view, one Guardian's domain (start with Lyssandria)
- Player explores, discovers lore fragments
- AI-powered dialogue with the Guardian (Claude API integration)
- Spell system demo with 2-3 elements
- Web-exported, playable on arcanea.ai
- Claude Code builds 80%+ of the GDScript

This is very doable as a 2-4 week sprint with Claude Code + GDAI MCP. Want me to draft the CLAUDE.md for the Arcanea Godot project or spec out the first milestone in detail?
