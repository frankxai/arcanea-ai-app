# Arcanea Deep Architecture — Invention, Foundations, Genius

> **Date**: 2026-03-31
> **Voice**: Starlight Architect + Lumina
> **Scope**: Beyond features. This is about what Arcanea INVENTS.
> **Pre-BV Note**: LemonSqueezy for payments until June. Stripe after BV.

---

## Part 1: What the Live Site Actually Reveals

I tested every major page on arcanea.ai. Here's the honest picture from a stranger's eyes.

### The Homepage Problem (Clarity: 4/10)

The headline "What will you create?" is great. But the subtitle — "Not a chatbot. A creative superintelligence that thinks in systems, creates with passion, and evolves with you" — is marketing speak that means nothing to a first-time visitor.

**What a YC partner sees in 5 seconds**: Beautiful dark design. Something about AI creativity. Not sure what I'm supposed to DO. No screenshot of the product. No evidence it works. Eight nav items.

**What Midjourney's homepage does**: Shows you generated images. Immediately. You see the OUTPUT before you understand the tool. The product sells itself through results.

**What Character.ai does**: Shows characters. You click one. You're chatting in 3 seconds. Zero explanation needed.

**Arcanea's homepage explains. It should SHOW.**

### What's Actually Impressive (When You Dig)

| Page | What I Found | Quality |
|------|-------------|---------|
| **/imagine** | Working image generation with 8 styles, 10 models, 5 aspect ratios, enhance toggle, gallery | Genuinely good — B+ |
| **/library** | 20 collections, 190K+ words, organized by situation ("read when stuck"), philosophical depth | Unique. Nothing like this exists elsewhere — A |
| **/lore** | Full cosmology: 10 Guardians, 10 Godbeasts, 5 Elements, The Arc, Malachar | Franchise-grade IP — A+ |
| **/agents** | 12 specialized agents (Quillblade, Soulforge, Cosmograph...), credit-based, usage counts | Good concept, needs depth — B |
| **/agents/hub** | Skyrim-style skill tree with 50 abilities across 10 Gates, star-map visualization | Genuinely novel UI — A |
| **/factions** | 8 Origin Classes with distinct power sources, visual doctrine | Strong identity system — A- |
| **/quiz** | 8-question personality quiz matching to Origin Class | Viral potential — B+ |
| **/living-lore** | Serialized interactive fiction, 7 crew members, multi-perspective episodes | Unique format — B+ |
| **/gallery** | 18 curated pieces, element filters, type tabs. No social features visible | Needs community — C+ |
| **/academy** | Ten Gates framework, rank progression, courses exist behind auth | More decorative than educational — C |

### The Gap Between What Exists and What's Perceived

Arcanea has built **far more than visitors discover**. The Agents Hub skill tree is genuinely novel — nobody else has a Skyrim-style AI capability tree. The Library is a genuine intellectual moat. The Lore is franchise-grade. But visitors see: "pretty dark website, something about AI, not sure what to do."

**The architecture is extraordinary. The front door is confusing.**

---

## Part 2: The Invention — What Arcanea Creates That Nobody Else Has

### Background: What Exists in the Market (March 2026)

Every AI creative platform is a **single-medium tool**:
- Character.ai = chat with characters
- Midjourney = generate images
- Suno = generate music
- NovelAI = write stories
- World Anvil = build worlds (manually, no AI)

Every creator platform is a **payment layer** without creation tools:
- Patreon, Gumroad, Ko-fi = sell but don't make

Every agent platform is **technically powerful but soulless**:
- OpenAI GPTs = system prompts without worlds
- Claude Artifacts = ephemeral, no persistence

**Nobody is building: AI-native multi-modal world-building with creator economics and mythological progression.**

### The Arcanea Invention: The Living World

Here is what Arcanea should invent — the concept that doesn't exist anywhere:

**A "World" as a first-class computational object.**

Not a folder of files. Not a wiki. Not a database. A **Living World** — a structured, AI-powered, forkable, shareable, monetizable entity that has:

1. **Ontology** — Rules, physics, magic systems, elements, laws
2. **Geography** — Locations, maps, territories, boundaries
3. **Characters** — Each with personality, backstory, relationships, and a conversational AI agent
4. **History** — Timeline of events, eras, turning points
5. **Culture** — Languages, factions, religions, art forms, music
6. **Economy** — Resources, trade, currencies, power structures
7. **Narrative** — Active storylines, quests, arcs that can be played through
8. **Aesthetic** — Visual style, color palette, typography, mood
9. **Soundtrack** — Ambient music, character themes, location scores
10. **Code** — Programmatic rules, game mechanics, AI behavior

**A World is like a git repository for imagination.** You can:
- **Fork** it (take someone's world and make your own version)
- **Branch** it (explore "what if" alternate timelines)
- **Merge** it (combine two worlds into a crossover)
- **Diff** it (see what changed between versions)
- **Star** it (discover and follow worlds you love)
- **PR** into it (propose additions to someone else's world)

This is the invention. Not "AI chat" or "image generation" — those are features. The invention is: **the world as a living, computational, shareable, forkable object that contains characters, stories, art, music, rules, and AI agents, all interconnected.**

Nobody has built this. World Anvil has wikis. Roblox has games. D&D has character sheets. But nobody has built a WORLD as a first-class entity with these properties.

### Why This Is a $1B Idea

Because every creative person wants a WORLD. Writers want a world for their novels. Game designers want a world for their games. DMs want a world for their campaigns. Kids want a world for their imagination. Companies want worlds for their brands. Educators want worlds for their curricula.

And currently, building a world means: Google Docs for lore + Midjourney for art + Suno for music + World Anvil for maps + Discord for community + Patreon for monetization. Six tools, none talking to each other.

Arcanea is: **ONE PLACE where all six live together, powered by AI, and the world itself is the product.**

---

## Part 3: The Core Data Model — The World Graph

### The Ideal Architecture

```
WORLD (root entity)
├── Ontology
│   ├── Elements[] (magic/physics system)
│   ├── Laws[] (rules of the world)
│   └── Systems[] (magic, technology, economy)
│
├── Atlas
│   ├── Regions[]
│   ├── Locations[]
│   └── Maps[] (2D/3D representations)
│
├── Characters[]
│   ├── Personality (traits, voice, style)
│   ├── Backstory (origin, key events)
│   ├── Relationships[] → other Characters
│   ├── Faction → Faction
│   ├── Agent (conversational AI configuration)
│   └── Media[] (portraits, theme music)
│
├── Factions[]
│   ├── Members[] → Characters
│   ├── Territory[] → Regions
│   ├── Philosophy (values, goals)
│   └── History[]
│
├── Timeline
│   ├── Eras[]
│   ├── Events[]
│   └── ActiveArcs[] (ongoing storylines)
│
├── Creations[]
│   ├── Stories[] (text narratives)
│   ├── Images[] (generated art)
│   ├── Music[] (composed tracks)
│   ├── Code[] (game mechanics, tools)
│   └── Documents[] (lore entries, wikis)
│
├── Aesthetic
│   ├── ColorPalette
│   ├── Typography
│   ├── Mood (visual tone)
│   └── Soundtrack[] → Music
│
├── Meta
│   ├── Creator → User
│   ├── Collaborators[] → Users
│   ├── ForkedFrom? → World
│   ├── Forks[] → Worlds
│   ├── Version (semver)
│   ├── License (open/commercial/restricted)
│   └── MarketplaceListing?
│
└── Agents[]
    ├── Character-linked agents
    ├── Utility agents (lore checker, consistency enforcer)
    └── Narrative agents (DM, storyteller)
```

### The Key Insight: Everything is Connected

A Character has a Faction which controls a Region which has Events in the Timeline which produced Creations which use the Aesthetic. Change one thing and the ripples flow through the entire graph.

This is why it's called a **World Graph** — not a collection of documents, but a graph database where every node is connected to every relevant other node.

### Supabase Implementation Path

```sql
-- Core tables
worlds (id, creator_id, name, slug, description, ontology_json, aesthetic_json,
        forked_from_id, version, license, visibility, marketplace_price)

world_characters (id, world_id, name, personality_json, backstory,
                  agent_config_json, faction_id, portrait_url, theme_music_url)

world_factions (id, world_id, name, philosophy, territory_json, history_json)

world_locations (id, world_id, name, region, description, coordinates_json)

world_events (id, world_id, title, era, description, date_in_world,
              characters_involved[])

world_creations (id, world_id, creator_id, type, content, media_url,
                 linked_characters[], linked_locations[], linked_events[])

world_agents (id, world_id, character_id, system_prompt, model,
              memory_namespace, conversation_count)

-- Social/marketplace
world_forks (parent_id, fork_id, forked_at, changes_summary)
world_stars (user_id, world_id)
world_collaborators (world_id, user_id, role)
marketplace_listings (world_id, price, currency, downloads, revenue)
```

---

## Part 4: The Experience Architecture — Why Someone Opens Arcanea Daily

### The Daily Habits of Sticky Products

| Product | Why People Return Daily | Arcanea Equivalent |
|---------|------------------------|-------------------|
| **Minecraft** | "My world is there. I'm always building." | Your Arcanea world grows every day. New AI-generated content. Characters evolve. |
| **Instagram** | "My feed has new stuff. I want to see what others made." | Gallery feed: what did other world-builders create today? |
| **D&D** | "My character has a story. The story continues." | Living Lore: your crew's journey continues. New episodes. |
| **Notion** | "My work lives here. It's how I think." | Your creative workspace. Prompt books, worlds, agents — all in one place. |
| **Duolingo** | "My streak! I don't want to lose it." | Gate progression: daily practice toward next rank. |

### The Arcanea Daily Loop

```
MORNING: Open Arcanea
├── See what's new in your world (AI-generated overnight content)
├── Check Gallery feed (new creations from followed worlds)
├── Read today's Library passage (daily wisdom, <5 min)
└── Quick creation challenge (generate 1 thing, earn 1 progression point)

THROUGHOUT DAY: Create
├── Chat with a character from your world
├── Generate an image for a new location
├── Write a scene between two characters
└── Compose ambient music for a region

EVENING: Discover
├── Browse trending worlds
├── Fork something interesting
├── Leave feedback on someone else's creation
└── Update your world's timeline with today's events
```

### The Key Retention Insight

**Your world accumulates value over time.** After 30 days, you have 50+ creations, 10+ characters, a timeline, a soundtrack, and an active story. Leaving means abandoning something you built. This is the Minecraft effect applied to imagination.

**But** — this only works if the world is ALIVE. The AI must generate content autonomously, characters must remember conversations, the timeline must advance. A static wiki is not sticky. A living world is.

---

## Part 5: The Agent Architecture — Deep Intelligence

### Beyond "Chat with a Character"

Current agent platforms (GPT Store, Character.ai) are shallow: system prompt + conversation. Arcanea agents should be **deeply embedded in worlds**:

#### Level 1: Character Agents (What Exists)
- Chat with a character from a world
- Character has personality, backstory, voice
- Conversations persist

#### Level 2: World-Aware Agents (What Should Exist)
- Agent knows EVERYTHING about the world it lives in
- "Tell me about the Northern Reaches" → Agent responds with consistent geography
- "What happened after the Battle of Ashenmoor?" → Agent responds with timeline-accurate history
- Agent can reference other characters, events, locations

#### Level 3: Creative Agents (The Invention)
- Agent can CREATE new content for the world
- "Write the next chapter of Ren's story" → Agent writes consistent narrative
- "Generate a portrait of the new character" → Agent triggers image generation
- "Compose a theme song for the villain" → Agent triggers music generation
- All new content is automatically linked to the World Graph

#### Level 4: Autonomous Agents (The Vision)
- Agents that CREATE without being asked
- Your world grows overnight — new events, new characters, new stories
- Morning notification: "Vesper discovered a hidden cave in the Northern Reaches. Read the story?"
- The world becomes a living garden that grows while you sleep

#### Level 5: Cross-World Agents (The Network Effect)
- Your villain meets another creator's hero
- Two worlds' timelines intersect for a crossover event
- Agents from different worlds can interact
- This creates organic discovery: "I found your world because my character wandered into it"

### Agent Technical Architecture

```typescript
interface ArcaneanAgent {
  // Identity
  id: string;
  worldId: string;
  characterId?: string;
  name: string;
  role: 'character' | 'narrator' | 'creator' | 'utility';

  // Intelligence
  systemPrompt: string;           // Generated from character + world context
  worldContext: WorldGraph;        // Full world knowledge
  memoryNamespace: string;        // Persistent memory per user-agent pair
  model: 'gemini' | 'claude' | 'gpt';  // Configurable

  // Capabilities
  canCreate: boolean;             // Can generate new content
  canModifyWorld: boolean;        // Can add to World Graph
  creationTypes: ('text' | 'image' | 'music' | 'code')[];

  // Cross-world
  visibility: 'private' | 'world' | 'public';
  canInteract: boolean;           // Can interact with agents from other worlds

  // Marketplace
  price?: number;                 // If sellable
  uses: number;                   // Usage count
  rating: number;                 // User rating
}
```

---

## Part 6: Naming & Taste Audit — The Honest Assessment

### Names That Are Genius

| Name | Why It Works | Would a 22-year-old love it? |
|------|-------------|---------------------------|
| **Arcanea** | Unique, memorable, evokes mystery + mastery. The .ai domain is perfect. | Yes — sounds like a game world, an AI platform, and a secret society |
| **Lumina** | The First Light. Simple, elegant, immediately evocative. | Yes — soft, approachable, beautiful |
| **Nero** | The Primordial Darkness. NOT evil — fertile potential. Bold subversion. | Yes — cool, edgy, deep |
| **The Forge** | Where creation happens. Industrial + magical. Perfect for $29/mo tier. | Yes — action word, powerful |
| **The Library** | For free tier. Knowledge is free. Creation costs. Perfect metaphor. | Yes — warm, inviting, non-threatening |
| **Stellaris** | Companion creature. Franchise mascot potential. | Yes — sounds premium, cosmic |
| **Origin Classes** | Better than "factions" — your ORIGIN, not your team. | Yes — identity-first language |
| **Voidtouched** | Shadow corruption as power source. Dark, compelling. | Absolutely — this goes in an Instagram bio |
| **Gate-Touched** | Spontaneous awakening. Mysterious. | Yes — implies something happened TO you |

### Names That Need Work

| Name | Problem | Suggestion |
|------|---------|-----------|
| **Luminors** | Great for deep lore but confusing as a first-contact label. "What's a Luminor?" | Keep for rank system, don't use in nav or marketing |
| **Living Lore** | Cool concept, unclear as nav item. "Is this documentation?" | Rename to **Chronicles** or **Stories** in nav |
| **Prompt Books** | Functional, not exciting. | **Spellbooks** — prompts ARE spells in this universe |
| **ACOS / SIS / Arcanea OS** | Internal product names leaking to users. Alphabet soup. | NEVER show these to users. Internal only. |
| **Quillblade / Soulforge / Cosmograph** | Agent names are excellent individually but feel like they came from a fantasy name generator | Keep them — they're actually good. Just ensure consistency |
| **Dawnsworn** | Flagship team name. Feels generic fantasy. | Need testing. Compare: "Avengers" is also generic but works because of characters |
| **Arcans** | Too close to "Arcanea." Confusing. | Consider **Magekind** or **The Attuned** |

### Names Where Taste Matters

**The Ten Gates**: Perfect. Not "levels" or "stages" — GATES. You pass through them. Physical metaphor for spiritual/creative progress.

**The Five Elements**: Fire, Water, Earth, Wind, Void/Spirit. The dual fifth element (Void = Nero's aspect, Spirit = Lumina's aspect) is a genuinely brilliant touch that adds philosophical depth without complexity.

**Guardian vs. God/Goddess**: The distinction that "Guardian" is a role, not an identity, is sophisticated. This is Marvel-level character architecture.

**Ranks (Apprentice → Luminor)**: Perfect progression naming. Each rank MEANS something. Not arbitrary numbers (Level 1-50) but named states of mastery.

### The Taste Verdict

The naming system is **A-tier** with a few B-tier exceptions. The internal complexity (ACOS, SIS, Arcanea OS, Arcanea Code, Arcanea Vault, Arcanea Records) should NEVER touch user-facing surfaces. Externally, there is ONE product: **Arcanea**. Everything else is a feature within it.

---

## Part 7: The Payment Architecture (LemonSqueezy Until June)

### Why LemonSqueezy Pre-BV

LemonSqueezy acts as Merchant of Record — they handle VAT, sales tax, and compliance. You don't need a BV. They take ~5-8% but handle everything.

### LemonSqueezy Integration Plan

```
Products to create in LemonSqueezy:

CREDIT PACKS (one-time):
├── 50 credits — $5 (€4.50)
├── 250 credits — $19 (€17.50)
└── 750 credits — $49 (€45)

SUBSCRIPTIONS:
├── Forge Monthly — $29/mo (€27/mo)
└── Forge Annual — $290/yr (€265/yr) — 2 months free

PREMIUM PRODUCTS:
├── The Grimoire (personalized universe) — $197
├── Guardian Session (1:1 creative session) — $47
└── Advanced Courses — $49-199 each
```

### Integration Architecture

```typescript
// apps/web/lib/lemonsqueezy.ts
// LemonSqueezy checkout URL generation
// Webhook handler for payment events
// Credit ledger updates on successful payment

// Key difference from Stripe:
// - Use LemonSqueezy Checkout Overlay (JS embed)
// - Webhook format is different
// - They handle all tax/VAT/compliance
// - Migrate to Stripe post-BV (June) if desired
```

### The 5+8% Fee Reality

On a $29/mo Forge subscription:
- LemonSqueezy fee: ~$2.30 (5% + payment processing)
- You receive: ~$26.70
- At 100 subscribers: $2,670/mo net

This is fine for the first 3 months. When BV arrives, evaluate Stripe (2.9% + 30¢) vs LemonSqueezy (5% + processing).

---

## Part 8: The Deeper Architecture — What Makes This a 10-Year Platform

### The Three Layers of Arcanea (Clarified)

```
┌─────────────────────────────────────────────┐
│  LAYER 3: MARKETPLACE                       │
│  Worlds, Agents, Templates, Content         │
│  (Network effects — the moat gets deeper)   │
├─────────────────────────────────────────────┤
│  LAYER 2: CREATION ENGINE                   │
│  Chat, Imagine, Music, Code, World-Building │
│  (AI-powered multi-modal creation)          │
├─────────────────────────────────────────────┤
│  LAYER 1: THE WORLD GRAPH                   │
│  Ontology, Characters, Timeline, Aesthetic  │
│  (The invention — worlds as objects)        │
└─────────────────────────────────────────────┘
```

**Layer 1** is the invention. Nobody else has it.
**Layer 2** is the product. Every AI tool has parts of this.
**Layer 3** is the business. This is where compound growth happens.

Most AI startups build Layer 2 only. Arcanea's advantage is that it has Layer 1 (the mythology IS the architecture) and is designed for Layer 3 (worlds are shareable, forkable, sellable).

### The Compound Growth Model

```
Year 1: Build the creation engine. Get 1,000 world-builders.
Year 2: Launch the marketplace. Creators sell to each other. 10,000 worlds.
Year 3: API and white-label. Game studios license the engine. 100,000 worlds.
Year 4: The multiverse. Worlds interact. Cross-world events. 1M+ worlds.
Year 5: The standard. "Built with Arcanea" becomes what "Powered by WordPress" was.
```

---

## Part 9: What to Build This Week (Foundations, Not Features)

### The Shift: From "Ship Features" to "Build Foundations"

Frank is right. Stop chasing quick monetization. Build the foundations that make everything else possible.

### Week 14 Sprint: Foundation Architecture

#### Monday: The World Object (4 hours)
Define and implement the World data model in Supabase:
- `worlds` table with full schema
- `world_characters` table
- `world_factions` table
- `world_creations` table (unified: text, image, music, code)
- RLS policies for creator ownership
- API routes: create, read, update, fork

This is THE foundation. Everything else builds on this.

#### Tuesday: World Creation Flow (6 hours)
The "Zero to World in 60 Seconds" experience:
- Input: "Describe your world in one sentence"
- AI generates: name, concept art, opening lore, 2 characters, element alignment
- Output: A beautiful World Card showing everything
- Saved as a real World object in the database

This replaces the current abstract homepage with something CONCRETE.

#### Wednesday: Character-as-Agent (6 hours)
Every World Character becomes a conversational agent:
- Character personality derived from World Graph context
- Agent remembers conversations per user
- Agent knows about their world (locations, events, other characters)
- "Talk to this character" button on every character

This is the retention hook that makes people return daily.

#### Thursday: World Discovery (4 hours)
- `/worlds` page: browse public worlds
- World Cards with preview (image, name, creator, character count)
- Fork button: copy a world to your account
- Star/follow a world
- Feed: latest creations from worlds you follow

#### Friday: LemonSqueezy Integration (4 hours)
- Create products in LemonSqueezy dashboard
- Implement checkout overlay
- Webhook handler for payment events
- Credit ledger in Supabase
- Wire credit spending to AI generation

#### Saturday (Optional): Navigation Surgery + Dead Page Cleanup
- 8→5 nav items
- noindex on stub pages
- Redirect dead routes

### What This Week Achieves

By Sunday, Arcanea has:
1. **A World data model** — the foundational architecture for everything
2. **A "describe your world" flow** — the killer first experience
3. **Character agents** — the daily retention hook
4. **World discovery** — the social/network layer
5. **Payments** — via LemonSqueezy, pre-BV

This is not "shipping features." This is **building the engine**.

---

## Part 10: The Autonomous Income Architecture (6-18 Months)

### The Full Stack of Autonomous Revenue

```
SELF-SERVICE (Zero Human Touch):
├── Signup → LemonSqueezy → Credits added → AI generates
├── World creation → Content saved → Appears in gallery
├── Marketplace listing → Buyer purchases → Creator paid → Arcanea earns 20%
├── API calls → Metered billing → Auto-invoicing
└── Course purchases → Instant access → No fulfillment needed

AI-MANAGED (Agent Touch Only):
├── Content moderation → AI reviews, human escalation for edge cases
├── Creator onboarding → Personalized AI welcome sequence
├── Marketplace curation → AI recommends featured worlds
├── SEO → AI generates blog posts from popular worlds
└── Customer support → AI handles FAQ, escalates complex issues

HUMAN-REQUIRED (Frank Only):
├── Vision and strategy
├── Key partnerships
├── Major feature direction
└── Brand and voice decisions
```

### Revenue Timeline

| Timeframe | Revenue Streams | Target MRR |
|-----------|---------------|------------|
| Month 1-2 | Credits + Forge (LemonSqueezy) | $500-1,000 |
| Month 3-4 | + Premium Courses + API beta | $2,000-5,000 |
| Month 5-6 | + Marketplace v1 + BV/Stripe migration | $5,000-15,000 |
| Month 7-9 | + Agent Marketplace + Enterprise tier | $15,000-30,000 |
| Month 10-12 | + White-label + Creator Fund | $30,000-50,000 |
| Month 13-18 | + API at scale + Physical products | $50,000-100,000 |

### What Makes It Truly Passive

The marketplace is the key. Once creators are selling worlds, agents, and templates to each other:
- **Frank creates zero content** — creators create everything
- **Frank handles zero transactions** — LemonSqueezy/Stripe handles everything
- **Frank does zero moderation** — AI agents handle everything
- **Frank does zero support** — AI agents handle FAQ
- **Frank does zero marketing** — creators sharing their worlds IS marketing

The platform becomes a **creative economy that runs itself**. Frank's role shifts from builder to visionary.

---

## Appendix: The Genius Test

### Would a YC Partner Fund This?

**Yes, if:**
- The "World as first-class object" concept is demonstrated (not just described)
- There are 10+ worlds created by real users
- There's at least $1K MRR proving willingness to pay
- The open source packages have GitHub stars/usage
- The pitch is: "We're building the Unreal Engine for imagination"

**Not yet, because:**
- The homepage doesn't clearly communicate what the product IS
- No payment processing
- No evidence of real user traction
- Too many pages, not enough depth in the core flow

### Would a 22-Year-Old Creative Choose Arcanea Over Character.ai?

**Yes, if:**
- They can create a world in 60 seconds (not just chat)
- Their world has art, music, characters, and a story (not just text)
- They can share a beautiful World Card on social media
- They can sell their creations
- The community is alive and inspiring

**Not yet, because:**
- Character.ai is instant (3 seconds to first chat)
- Arcanea requires understanding what "Guardians" and "Gates" are
- The gallery has 18 items (Character.ai has millions of conversations)
- There's no mobile app

### Would Someone Put Their Origin Class in Their Instagram Bio?

**"Voidtouched" or "Gate-Touched"?** Yes, absolutely. These have the right energy.
**"Arcan"?** No — too close to "Arcanea," sounds like a typo.
**"Architect"?** Too generic.
**"Celestial"?** Too common (already used in many fantasy contexts).

The identity system is 75% there. The strong names are very strong. The weak names need iteration.

---

*This document is not a feature list. It's the blueprint for a creative civilization.*
*The world is the product. The product is the world.*
*Build the world. Everything else follows.*
