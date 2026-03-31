# The World Graph — Technical Specification

> **The Invention**: A "World" as a first-class computational object.
> **Analogy**: Git repository for imagination.

---

## What a World Contains

A World is not a folder. It's a **graph** — a network of interconnected entities where changing one node ripples through the whole system.

```
World
├── Identity (name, slug, description, creator, visibility)
├── Ontology (rules, elements, magic/tech systems)
├── Atlas (regions, locations, maps)
├── Characters[] ──→ Agents (each character can be an AI)
├── Factions[] ──→ Characters, Territories
├── Timeline ──→ Events, Eras, Active Arcs
├── Creations[] (text, images, music, code — all linked to entities)
├── Aesthetic (palette, typography, mood, soundtrack)
├── Meta (forked_from, forks, collaborators, version, license)
└── Marketplace (price, downloads, reviews, revenue)
```

---

## Supabase Schema

### Core Tables

```sql
-- ═══════════════════════════════════════════════════════
-- THE WORLD
-- ═══════════════════════════════════════════════════════

CREATE TABLE worlds (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text,  -- one-line description
  description text,  -- rich description

  -- Ontology
  elements jsonb DEFAULT '[]',  -- [{name, domain, color, description}]
  laws jsonb DEFAULT '[]',  -- [{name, description}]
  systems jsonb DEFAULT '[]',  -- [{name, type: "magic"|"tech"|"hybrid", rules}]

  -- Aesthetic
  palette jsonb DEFAULT '{}',  -- {primary, secondary, accent, background}
  mood text,  -- "epic dark fantasy", "whimsical steampunk", etc.
  hero_image_url text,  -- primary world art

  -- Meta
  forked_from_id uuid REFERENCES worlds(id),
  version text DEFAULT '0.1.0',
  visibility text DEFAULT 'private' CHECK (visibility IN ('private', 'unlisted', 'public')),
  license text DEFAULT 'personal' CHECK (license IN ('personal', 'cc-by', 'commercial', 'open')),

  -- Marketplace
  marketplace_listed boolean DEFAULT false,
  marketplace_price integer,  -- in cents, null = free
  marketplace_downloads integer DEFAULT 0,

  -- Stats
  character_count integer DEFAULT 0,
  creation_count integer DEFAULT 0,
  star_count integer DEFAULT 0,
  fork_count integer DEFAULT 0,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════
-- CHARACTERS (each can become an AI agent)
-- ═══════════════════════════════════════════════════════

CREATE TABLE world_characters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,

  -- Identity
  name text NOT NULL,
  title text,  -- "The Void Walker", "Captain of the Ninth Flame"
  origin_class text,  -- links to Arcanea's 8 Origin Classes

  -- Personality
  personality jsonb NOT NULL DEFAULT '{}',
  -- {traits: [], voice_style: "", speaking_patterns: [], values: [], fears: []}
  backstory text,
  motivation text,

  -- Relationships
  faction_id uuid REFERENCES world_factions(id),
  relationships jsonb DEFAULT '[]',
  -- [{character_id, type: "ally"|"rival"|"mentor"|"lover"|"enemy", description}]

  -- Visuals & Audio
  portrait_url text,
  theme_music_url text,

  -- Agent Configuration
  is_agent boolean DEFAULT false,
  agent_model text DEFAULT 'gemini',  -- which AI model to use
  agent_system_prompt text,  -- auto-generated from personality + world context
  agent_memory_namespace text,  -- for persistent memory
  agent_conversation_count integer DEFAULT 0,

  -- Stats
  element text,  -- primary element alignment
  gate integer,  -- associated gate (1-10)

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════
-- FACTIONS
-- ═══════════════════════════════════════════════════════

CREATE TABLE world_factions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,

  name text NOT NULL,
  philosophy text,
  territory jsonb DEFAULT '{}',  -- {regions: [], capital: ""}
  history text,
  visual_identity jsonb DEFAULT '{}',  -- {colors: [], symbols: [], aesthetic: ""}

  created_at timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════
-- LOCATIONS
-- ═══════════════════════════════════════════════════════

CREATE TABLE world_locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,

  name text NOT NULL,
  region text,
  description text,
  significance text,  -- why this place matters
  image_url text,
  ambient_music_url text,
  coordinates jsonb,  -- for future map rendering

  created_at timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════
-- TIMELINE & EVENTS
-- ═══════════════════════════════════════════════════════

CREATE TABLE world_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,

  title text NOT NULL,
  description text,
  era text,  -- "Age of Dawn", "The Fracturing", etc.
  date_in_world text,  -- in-world dating system
  sort_order integer,  -- for timeline ordering

  -- Connections
  location_id uuid REFERENCES world_locations(id),
  characters_involved uuid[] DEFAULT '{}',
  consequences text,  -- what changed because of this event

  created_at timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════
-- CREATIONS (unified: text, image, music, code)
-- ═══════════════════════════════════════════════════════

CREATE TABLE world_creations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,
  creator_id uuid REFERENCES auth.users(id) NOT NULL,

  -- Type & Content
  type text NOT NULL CHECK (type IN ('text', 'image', 'music', 'code', 'document')),
  title text NOT NULL,
  content text,  -- for text/code/document types
  media_url text,  -- for image/music types
  thumbnail_url text,

  -- World Graph Links
  linked_characters uuid[] DEFAULT '{}',
  linked_locations uuid[] DEFAULT '{}',
  linked_events uuid[] DEFAULT '{}',
  linked_factions uuid[] DEFAULT '{}',

  -- Metadata
  prompt text,  -- the prompt used to generate this
  model text,  -- the AI model used
  style text,  -- for images: "cinematic", "anime", etc.

  -- Social
  likes integer DEFAULT 0,
  views integer DEFAULT 0,
  is_public boolean DEFAULT false,

  created_at timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════
-- SOCIAL: Stars, Forks, Collaborators
-- ═══════════════════════════════════════════════════════

CREATE TABLE world_stars (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, world_id)
);

CREATE TABLE world_forks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_world_id uuid REFERENCES worlds(id) ON DELETE SET NULL,
  forked_world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  forked_by uuid REFERENCES auth.users(id),
  changes_summary text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE world_collaborators (
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'editor' CHECK (role IN ('viewer', 'editor', 'admin')),
  invited_at timestamptz DEFAULT now(),
  PRIMARY KEY (world_id, user_id)
);

-- ═══════════════════════════════════════════════════════
-- CREDITS & PAYMENTS (LemonSqueezy pre-BV)
-- ═══════════════════════════════════════════════════════

CREATE TABLE user_credits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance integer DEFAULT 5 NOT NULL,
  total_purchased integer DEFAULT 0,
  total_spent integer DEFAULT 0,
  subscription_tier text DEFAULT 'free',
  lemonsqueezy_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE credit_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  type text NOT NULL CHECK (type IN ('purchase', 'subscription', 'daily_free', 'spend', 'refund', 'earn')),
  description text,
  payment_provider_id text,  -- LemonSqueezy or Stripe reference
  world_id uuid REFERENCES worlds(id),  -- if spend was on a world creation
  created_at timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════

ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_factions ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_creations ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_forks ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Public worlds are readable by everyone
CREATE POLICY "Public worlds are viewable" ON worlds
  FOR SELECT USING (visibility = 'public');

-- Creators can do everything with their own worlds
CREATE POLICY "Creators manage own worlds" ON worlds
  FOR ALL USING (auth.uid() = creator_id);

-- Collaborators can view/edit worlds they're invited to
CREATE POLICY "Collaborators can view" ON worlds
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM world_collaborators WHERE world_id = id AND user_id = auth.uid())
  );

-- Characters inherit world visibility
CREATE POLICY "Characters follow world visibility" ON world_characters
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM worlds WHERE id = world_id AND (visibility = 'public' OR creator_id = auth.uid()))
  );

-- Credit policies
CREATE POLICY "Users read own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users read own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);
```

---

## API Routes Needed

```
/api/worlds
  GET    — list public worlds + user's own worlds
  POST   — create a new world

/api/worlds/[slug]
  GET    — get world with characters, factions, locations
  PATCH  — update world
  DELETE — delete world

/api/worlds/[slug]/characters
  GET    — list characters
  POST   — create character

/api/worlds/[slug]/characters/[id]/chat
  POST   — chat with character agent (streaming)

/api/worlds/[slug]/fork
  POST   — fork a world into user's account

/api/worlds/[slug]/star
  POST   — star/unstar a world

/api/worlds/[slug]/creations
  GET    — list creations in this world
  POST   — create something (text/image/music/code)

/api/worlds/generate
  POST   — "describe your world" → AI generates full World object
```

---

## The "Describe Your World" Generation Pipeline

```typescript
// Input: "A world where music is magic and every person has a unique song"
// Output: Complete World object

async function generateWorld(description: string): Promise<World> {
  // Step 1: AI generates world structure
  const worldData = await generateWithAI({
    prompt: `Create a fantasy world based on: "${description}"

    Return JSON with:
    - name: creative world name
    - tagline: one-line hook
    - description: 2-3 paragraph rich description
    - elements: 3-5 fundamental forces/elements
    - laws: 3-5 rules of this world
    - systems: 1-2 magic/technology systems
    - mood: aesthetic description for art generation
    - palette: {primary, secondary, accent} hex colors
    - characters: 2-3 starter characters with name, title, personality, backstory
    - locations: 2-3 key locations with name, description
    - first_event: the founding event of this world`,
    model: 'gemini-2.0-flash'
  });

  // Step 2: Generate hero image (parallel)
  const heroImage = await generateImage({
    prompt: `${worldData.mood}. ${worldData.description}. Epic landscape, cinematic lighting.`,
    style: 'concept-art',
    aspectRatio: '16:9'
  });

  // Step 3: Generate character portraits (parallel)
  const portraits = await Promise.all(
    worldData.characters.map(char =>
      generateImage({
        prompt: `Portrait of ${char.name}: ${char.personality}. ${worldData.mood} style.`,
        style: 'character-portrait',
        aspectRatio: '1:1'
      })
    )
  );

  // Step 4: Save everything to Supabase
  const world = await createWorld(worldData, heroImage, portraits);

  return world;
}
```

---

*This is not a feature spec. This is the foundation of a creative civilization.*
