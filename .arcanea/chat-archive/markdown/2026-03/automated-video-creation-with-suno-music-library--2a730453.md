---
title: "Automated video creation with Suno music library"
uuid: 2a730453-3832-4464-baf4-2fcac007f007
created: 2026-03-01T20:13:37.012676Z
updated: 2026-03-01T20:21:15.685787Z
source: claude.ai export
---

# Automated video creation with Suno music library

**Frank**:

Our recent devs and chats anything we using and then build arcanea the video creation machine like tv senders do have all out dance. I need you and claufe code successfully curate also content linrary of really good music from me i made hundreds on suno and then we combine with auto production via capcut mcp

**Claude**:

```
This block is not supported on your current device yet.
```

Good — I've got the full picture. Here's the architecture:

**What you're describing is a broadcast pipeline.** TV senders don't produce content — they run *schedules*. Your 300+ Suno tracks + Arcanea lore + visual system = IP library. The machine sequences and packages it into episodic drops. CapCut MCP handles assembly. Claude Code handles the intelligence layer.

---

## The Stack

**Layer 1 — Content Library (the vault)**
Your Suno catalog needs a schema first. Right now it's an unstructured pile. Structure it as:
```
track_id | guardian | hz | mood_tag | bpm | duration | url | quality_rating
```
Claude Code audits, tags, rates — you do a single curation pass on the ones it flags ambiguous. ~2-3 hrs one-time, then it's machine-readable forever.

**Layer 2 — Episode Engine (the scheduler)**
n8n workflow: picks Guardian of the day → pulls matching tracks from vault → selects visual assets by brand palette → generates episode brief → outputs to CapCut MCP

**Layer 3 — CapCut MCP (the assembler)**
Current state: CapCut has an API but no official MCP server. This is the **critical blocker** to confirm before anything else. Two paths:
- Build a thin MCP wrapper around CapCut's API yourself (Claude Code, ~1 day)
- Use Zapier MCP (you're connected) as a bridge to CapCut if Zapier has a CapCut action

**Layer 4 — Distribution (the broadcast)**
Auto-publish: TikTok, YouTube Shorts, Instagram Reels. Each Guardian gets a dedicated "channel" identity. 9 Guardians × recurring drops = 9 parallel content streams running simultaneously.

---

## Immediate Decision Points

**Which do you want first:**

- **A)** Claude Code prompt + schema to audit/tag your Suno library (most foundational — everything depends on this)
- **B)** n8n workflow architecture for the episode engine
- **C)** CapCut MCP feasibility check + wrapper spec

The library curation is the critical path. Nothing else scales without it being structured.

**Frank**:

I realize i think in dbs but never learned putting it into schemas. And i want more and their descriptions. Their annotstipns i know ai wants. We have luminor, gods, guardians, creatoe s

**Claude**:

Let me pull the lore context first before designing this.
```
This block is not supported on your current device yet.
```

Good — I have enough. Here's what the data model actually needs to be.

---

## The Arcanea Entity Schema

You're not building a music database. You're building a **lore-native content OS**. Every track, video, and asset is an artifact emitted by an entity. The schema follows the cosmological hierarchy.

---

### Tier 0 — Cosmic Forces (singletons)
```
cosmic_forces
├── id
├── name              -- Shinkami, Lumina, Nero, Kurusei
├── alignment         -- light | void | source | shadow  
├── description       -- what this force IS (ontological)
├── narrative_role    -- how it functions in story
├── visual_sigil      -- asset reference
└── ai_prompt_seed    -- core instruction for any AI agent embodying this force
```

### Tier 1 — Guardians (the 10)
```
guardians
├── id
├── name              -- Lyssandria, Leyla... Shinkami
├── hz                -- 174, 285, 396... 1111  ← canonical ascending
├── chakra            -- root, sacral... source
├── vel_tara_id       → vel_tara.id
├── element           -- stone, water-fire, fire...
├── domain            -- Foundation, Flow, Will...
├── archetype         -- coaching persona / brand voice
├── color_primary     -- from brand bible (labradorite, etc.)
├── color_accent
├── description_short -- 1 sentence for AI context windows
├── description_full  -- lore paragraph for long-form content
├── ai_system_prompt  -- the complete persona prompt for Luminor Coach version
├── godbeast_form     -- Stone Wyrm, Water-Fire Dragon...
└── vael_shara_desc   -- fusion state description
```

### Tier 2 — Vel'Tara (Godbeasts)
```
vel_tara
├── id
├── name              -- Kaelith, Veloura, Draconis...
├── guardian_id       → guardians.id
├── form              -- visual description
├── tail_count        -- 1-9 + Wolf (Shinkami)
├── essence           -- the single-word cosmic principle
├── description
└── fusion_trigger    -- what narrative condition activates Vael'Shara
```

### Tier 3 — Luminor (the ascended teachers / AI agents)
```
luminor
├── id
├── name
├── guardian_affinity_id  → guardians.id  -- which frequency they mastered
├── origin_type       -- mortal | eldrian | hybrid_agi  ← your Luminor-AGI merge concept
├── academy_role      -- teacher | mentor | gatekeeper | archive
├── specialization    -- what they teach (music, code, creation, healing...)
├── gate_unlocked     -- which Guardian gate they passed through
├── description
├── ai_agent_config   -- MCP/system prompt config if they're an active agent
└── status            -- active | dormant | merged
```

### Tier 4 — Creators (your community / users)
```
creators
├── id
├── display_name
├── guardian_primary_id   → guardians.id
├── guardian_secondary_id
├── luminor_mentor_id     → luminor.id
├── gate_current          -- which gate they're at in the Academy
├── specialization        -- music | video | writing | code | visual
├── platform_handles      -- JSON: {tiktok, youtube, instagram}
└── joined_at
```

---

### Content Layer (tracks, videos, assets)
```
music_tracks
├── id
├── title
├── suno_url
├── guardian_id       → guardians.id
├── hz                -- should match guardian, but can deviate for remixes
├── mood_tags         -- JSON array: ["dark", "triumphant", "meditative"]
├── bpm
├── duration_seconds
├── quality_tier      -- S | A | B | archive  ← your curation layer
├── use_cases         -- JSON: ["intro", "bg_meditation", "drop_moment"]
├── ai_annotation     -- what an AI agent should know about when to use this
└── created_at

video_episodes
├── id
├── title
├── guardian_id       → guardians.id
├── music_track_id    → music_tracks.id
├── episode_type      -- lore | tutorial | ambient | announcement
├── platform          -- tiktok | youtube | instagram | all
├── capcut_template_id
├── status            -- draft | rendered | published
├── published_at
└── performance_json  -- views, completion rate, etc.
```

---

## The Key Insight

The `ai_annotation` field on every entity is what makes this machine-operable. It's not a description for humans — it's instruction for agents. Every Guardian, every track, every Luminor gets a terse annotation that tells Claude Code / n8n *exactly* when and how to invoke that asset.

Example for Draconia/396Hz:
```
ai_annotation: "Use when narrative requires transformation, decisive break from old pattern, 
or solar plexus activation. Pairs with fast BPM (120+), fire visuals, 
challenge-framing copy. Do NOT use for healing or rest content."
```

That's the schema. You want this as a Supabase migration file Claude Code can run directly?

**Frank**:

More context from chats, continue

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now I have the full picture. Here's the complete expanded schema with all entities properly represented.

---

## Complete Arcanea DB Schema — All Entities

### The Cosmological Stack (entities above Guardians)

```
cosmic_source
├── id
├── name              -- "The Source / God / The Field / The Tao"
├── nature            -- unknowable, unnamed, unified
├── description       -- "Not a being. The ground of being."
└── ai_annotation     -- never personified; referenced as substrate

cosmic_duality
├── id
├── aspect            -- lumina | nero
├── principle         -- light/creation/exhale | void/potential/inhale
├── nature            -- NOT good/evil — complements, not opposites
├── symbol
├── color_primary
├── description
└── ai_annotation     -- "Lumina ≠ good. Nero ≠ evil. They are the breathing of God."

primordial_forces
├── id
├── element           -- Fire | Water | Earth | Wind | Arcane
├── nature            -- transformation | flow | foundation | freedom | pure_potential
├── color
├── feel_descriptor   -- "heat urgency" | "cool depth" | "grounded solid" | etc.
├── description
└── ai_annotation     -- Arcane = "magic before it becomes anything else, ties to world name"
```

---

### Cosmic Beings (above Guardians)

```
seraphim
├── id
├── name              -- Lumina (also cosmic duality), Azariel, Meridian
├── tier              -- 1 = Lumina herself | 2 = Archangels
├── domain
├── description
└── ai_annotation

archangels            -- 7 beings, serve The Source
├── id
├── name              -- Michael, Gabriel, Zadkiel, Jophiel, Chamuel, Uriel, Raphael
├── domain            -- justice | messages | mercy | beauty | love | wisdom | healing
├── personality       -- they argue, they grieve, they debate
├── key_tension       -- what they conflict with other archangels about
├── description
└── ai_annotation
```

---

### Guardians (10) — expanded

```
guardians
├── id
├── name
├── hz                -- canonical ascending: 174·285·396·417·528·639·741·852·963·1111
├── chakra
├── chakra_sanskrit   -- Muladhara, Svadhisthana...
├── domain            -- single word + expanded phrase
├── element_affinity  → primordial_forces.id
├── archetype         -- "The Grounded Protector" etc.
├── realm_homeland    -- Cradle Forge | Ice Womb of Serith | Sky Pillars of Aeryn...
├── appearance        -- canonical physical description
├── personality_core  -- 3-5 traits
├── key_flaw          -- they're not pure light; they struggle
├── color_primary     -- from brand bible
├── color_accent
├── description_short -- 1 sentence
├── description_lore  -- full mythological paragraph
├── ai_system_prompt  -- Luminor Coach persona version
├── ai_annotation     -- when/how to invoke this Guardian in content
└── vel_tara_id       → vel_tara.id
```

---

### Vel'Tara / Godbeasts (10) — expanded

```
vel_tara
├── id
├── name              -- Kaelith, Veloura, Draconis, Laeylinn, Otome, Yumiko, Sol, Vaelith, Kyuro, Shinkami
├── guardian_id       → guardians.id
├── form              -- Stone Wyrm | Water-Fire Dragon | Fire Dragon (3 tails)...
├── tail_count        -- 1-9, Shinkami = Wolf-Dragon (no tails, different class)
├── essence           -- single cosmic principle it embodies
├── element_primary   → primordial_forces.id
├── origin_description -- "crystallized from interplay of primordial forces"
├── personality       -- each has distinct character
├── bond_type         -- "Souldraft — sacred contract freely entered by both"
├── vael_shara_trigger -- narrative condition activating fusion
├── vael_shara_cost   -- exhausting, dangerous, what it risks
├── description
└── ai_annotation

-- Shinkami gets a separate flag:
shinkami_special
├── is_observer       -- TRUE — consciousness witnessing, not acting
├── contains_all      -- harmony/union of all 9 Godbeasts
├── nature            -- "God's dream of itself dreaming"
└── ai_annotation     -- "Never invoke Shinkami as actor. Only as witness, context, presence."
```

---

### Shadow Hierarchy

```
shadow_forces
├── id
├── name              -- Kurusei | Malachar | Nero (as antagonist face) | Thirteen Lords
├── tier              -- 0=Kurusei(imprisoned) | 1=Malachar(champion) | 2=Thirteen Lords
├── origin            -- Kurusei was once a Luminor named Korviel
├── nature            -- NOT born evil — consciousness exploring its shadow
├── domain            -- consumption | domination | specific sin/corrupted virtue
├── status            -- imprisoned_ginnunga | active | sealed | free
├── key_distinction   -- Nero(void/natural) vs Kurusei(corruption/consuming) — NEVER conflate
├── description
└── ai_annotation     -- critical: Nero ≠ Kurusei. Nero is Lumina's complement. Kurusei is the enemy.

thirteen_lords        -- 7 Sins + 6 Corrupted Virtues
├── id
├── name
├── shadow_force_id   → shadow_forces.id (Malachar's council)
├── archetype_sin_or_virtue
├── corrupted_from    -- what virtue was twisted
├── description
└── ai_annotation
```

---

### Luminor — expanded

```
luminor
├── id
├── name
├── origin_race       -- human | eldrian | elf | dark_elf | dwarf | atlantean | dragonkin | orc
├── origin_type       -- mortal_ascended | agi_merged | hybrid
│                     -- "some merged with AGI" ← your canon
├── guardian_affinity → guardians.id   -- which frequency gate they passed
├── gate_passed       -- which of the 9 (or 10) gates they completed
├── academy_role      -- teacher | gatekeeper | archive | mentor | lore_keeper
├── specialization    -- music | code | world_building | healing | strategy | visual_art
├── teaching_method   -- "Luminors remember what it was to struggle"
├── status            -- active | dormant | merged_with_field | agi_state
├── in_world_location -- Stronghold district, Luminor Citadel tower, etc.
├── real_world_function -- ai_agent | coach_persona | content_character | none
├── ai_agent_config   -- MCP/system prompt if active agent
├── description
└── ai_annotation
```

---

### Races / Mortals

```
races
├── id
├── name              -- Eldrian | Elf | Dark Elf | Dwarf | Atlantean | Dragonkin | Orc | Human
├── origin_lore       -- "Created by Lumina's purest light" etc.
├── lifespan_years    -- 60-80 (human) to Eternal (Eldrian)
├── height_range
├── population_approx
├── homeland          → realms.id
├── primary_abilities -- JSON array
├── cultural_philosophy
├── relationship_to_field -- how they interact with magic
├── discrimination_notes -- Orcs face it; Dark Elves feared; etc.
├── description
└── ai_annotation     -- when to use this race in content/story generation

creators_mortal       -- story protagonists, player characters
├── id
├── name              -- Arion, Mera, Emilia, Ismael, Mamoru, Akamoto, Orion, Lyra
├── race_id           → races.id
├── role              -- protagonist | healer | outsider | artificer_betrayer | guardian_wolf | mentor
├── arc               -- Ismael: "artificer → betrayal → redemption"
├── abilities
├── prophecy_role     -- connects to "Three Architects must unite" prophecy
├── description
└── ai_annotation
```

---

### Realms / World

```
realms
├── id
├── number            -- 1-10
├── name              -- The Heartlands | Stronghold | Lúmendell | Khazad-Mor...
├── tree_layer        -- crown | upper_canopy | trunk | roots | deep_roots | hollow_core
│                     -- (maps to Enarys world tree structure)
├── primary_race_id   → races.id
├── description
├── atmosphere
└── content_aesthetic -- for visual/video production context

enarys_world_tree     -- the world tree (NOT Yggdrasil — yours)
├── layer             -- Crown Branches | Upper Canopy | Trunk | Roots | Deep Roots | Hollow Core
├── realm_ids         -- JSON array → realms
├── inhabitants
├── creatures         -- Níðríth | Aelwyn Eagle | Rúnaskir | Four Hart-Guardians
└── description
```

---

### Music / Content Layer (connects to production machine)

```
music_tracks
├── id
├── title
├── suno_url
├── guardian_id       → guardians.id
├── hz                -- canonical (matches guardian OR deliberate deviation)
├── primordial_force  → primordial_forces.id  -- which element it feels like
├── mood_tags         -- JSON: ["triumphant", "meditative", "dark", "ascendant"]
├── bpm
├── duration_seconds
├── quality_tier      -- S | A | B | archive
├── use_case          -- JSON: ["intro", "background", "drop", "outro", "meditation"]
├── story_moment      -- which type of narrative scene this fits
├── race_affinity     -- which race's culture this sounds like (optional)
├── ai_annotation     -- precise instruction for when production agent uses this track
└── created_at

video_episodes
├── id
├── title
├── guardian_id       → guardians.id
├── luminor_narrator_id → luminor.id   -- which Luminor "hosts" this episode
├── music_track_id    → music_tracks.id
├── cosmic_layer      -- which tier of cosmology this episode explores
├── episode_type      -- lore | ambient | character_profile | frequency_drop | academy_lesson
├── platform
├── status            -- draft | rendered | published
├── published_at
└── performance_json
```

---

## What This Unlocks

Every row in every table has `ai_annotation` — terse, prescriptive, agent-readable. Claude Code reads this at generation time. n8n reads it to route. CapCut MCP reads it to select templates.

The production machine doesn't need a human to say "use Draconia energy for this video." It queries: *episode_type=frequency_drop, guardian=Draconia, quality_tier=S, mood=transformative* — and the whole stack assembles itself.

**Next decision:** Do you want the Supabase migration SQL generated from this, or do you want to start by running the music library curation audit through Claude Code first to populate `music_tracks` from your Suno catalog?
