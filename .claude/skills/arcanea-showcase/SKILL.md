---
name: arcanea-showcase
description: Generate product showcase content at scale — demo outputs, marketing copy, social posts, and changelog entries from real MCP tool results
triggers:
  - showcase
  - demo
  - product marketing
  - content at scale
aliases:
  - /showcase-gen
  - /demo-gen
  - /content-engine
---

# Arcanea Showcase Engine

Generate product marketing content at scale from real MCP tool outputs.

## Modes

### 1. `demo` — Generate Live Demo Outputs

Fire MCP tools to capture real outputs for marketing:

```
/showcase demo [type]
```

Types: `character`, `location`, `creature`, `quest`, `artifact`, `magic`, `full-session` (all at once)

**Process:**
1. Fire the MCP tool(s) with interesting parameters
2. Capture the JSON output
3. Format as showcase card data
4. Optionally append to `/showcase` page

### 2. `content` — Generate Marketing Content

Transform MCP outputs into multi-platform content:

```
/showcase content [format]
```

Formats:
- `social` — Twitter/X thread, LinkedIn post, Instagram caption
- `blog` — Full blog post with embedded demos
- `changelog` — Formatted changelog entry
- `newsletter` — AI Architect newsletter section
- `thread` — Step-by-step creation thread (great for X)

### 3. `capture` — Screenshot & Visual Generation

```
/showcase capture [target]
```

Targets:
- `page` — Screenshot a page via Playwright
- `terminal` — Capture MCP tool JSON output formatted beautifully
- `comparison` — Before/after or input/output visual
- `infographic` — Stats visual via arcanea-infogenius

### 4. `batch` — Scale Content Generation

```
/showcase batch [count]
```

Generate N demo sessions with diverse parameters, collect all outputs, format for showcase page and social content. Each batch:
1. Random element + house + archetype combination
2. Full session: character → location → creature → artifact → quest
3. Faction analysis
4. Format all outputs
5. Generate social thread for the session

### 5. `update` — Refresh Showcase Page

```
/showcase update
```

Reads latest changelog, recent commits, and MCP tool capabilities. Updates:
- `apps/web/app/showcase/page.tsx` demo data
- Stats numbers
- Feature descriptions

## Output Locations

| Type | Path |
|------|------|
| Showcase page | `apps/web/app/showcase/page.tsx` |
| Blog posts | `apps/web/app/blog/posts/` |
| Social content | `docs/content/social/` |
| Captured screenshots | `docs/content/captures/` |
| Demo JSON | `docs/content/demos/` |

## Content Voice

Follow the Arcanea voice:
- **Not "AI tool"** — Creative Intelligence Platform
- **Not "generates"** — Creates, forges, weaves, conjures
- **Not "users"** — Creators, world-builders, makers
- **Show, don't tell** — Always include real output, never just describe what it could do
- **Connected narrative** — Emphasize how tools link creations together
- **Cost and consequence** — Highlight that Arcanea creates depth (flaws, secrets, costs), not just assets

## Social Templates

### Twitter/X Thread Template
```
1/ We just built a character, a temple, a creature, and a quest.

The AI auto-linked them into a story.

Here's what happened: 🧵

2/ Meet [NAME] — [RANK], [ELEMENT] [HOUSE]
[Key personality detail]
[Secret or flaw that makes them interesting]

3/ [LOCATION NAME] — [TYPE]
[Atmosphere detail]
[Secret that drives narrative]

4/ [CREATURE NAME] — [SIZE] [ELEMENT] [TEMPERAMENT]
[Distinctive feature]
[Lore connection]

5/ Then we asked for a quest.

The engine automatically linked all three:
"[QUEST HOOK]"

No manual connection. No editing. One session.

6/ This is @arcaneaai — 42 AI tools that create connected worlds.

Not assets. Worlds.

Try it: arcanea.ai/chat
```

### LinkedIn Template
```
We're building something different with AI.

Not a chatbot. Not a content generator. A world engine.

Today I generated [N] creations in one session. The AI didn't just make them — it connected them:
- [Character] needs to escort [Creature] to [Location]
- The quest auto-adapted to the power dynamics
- Faction analysis showed the political implications

[N] tools. One coherent universe. No manual editing.

This is Arcanea — Creative Intelligence for world-builders.

#AI #WorldBuilding #CreativeAI #Arcanea
```

## MCP Tools Available for Demos

| Tool | Best Demo Params |
|------|-----------------|
| `generate_character` | Mix elements + houses, vary gatesOpen 1-10 |
| `generate_location` | Try temple, forest, city, dungeon, void-rift |
| `generate_creature` | Vary size (tiny→massive) + temperament (hostile→sacred) |
| `generate_quest` | Best after 3+ creations in session |
| `generate_artifact` | legendary power + unusual types (mirror, key, seed) |
| `generate_magic` | High gate levels (7-10) with creative purposes |
| `generate_name` | Batch 10-20 names for flavor |
| `analyze_factions` | Best after diverse element creations |
| `generate_conflict` | After factions exist |
| `assess_world` | Full world health check |

## Quality Gates

Before publishing any showcase content:
1. All MCP outputs must be REAL (no fabricated JSON)
2. Highlight must be accurate to what the tool actually does
3. No private info (API keys, user data, internal paths)
4. Canon-consistent (check against CANON_LOCKED.md)
5. Voice-consistent (elevated, practical, not hype)
