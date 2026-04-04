# Strategic Specification: BYOK Architecture + Custom Companions + OpenRouter

> Date: 2026-03-11 | Status: PROPOSAL | Author: Claude + Frank

---

## Executive Summary

Arcanea currently has **16 hardcoded companions** and **3 direct provider integrations** (Google, Anthropic, OpenAI). This is a foundation, not a destination. The competitive landscape shows that the winning BYOK apps (TypingMind $1M revenue, LobeChat 50K+ GitHub stars, SillyTavern 300+ contributors) all share three traits:

1. **Users create their own agents** (not just choose from a fixed set)
2. **OpenRouter as unified gateway** (300+ models via one key, not 3 hardcoded providers)
3. **Community marketplace** for sharing creations (network effects = moat)

Arcanea has an irreproducible asset none of them have: **a living mythology** (Ten Gates, Five Elements, Guardians, the Library). The strategic move is to make this mythology the *framework* within which users create — not the content they consume passively.

---

## Part 1: Honest Assessment — What We Have vs What Wins

### Current State (March 2026)

| Component | Status | Quality | Competitive Position |
|-----------|--------|---------|---------------------|
| Chat UI | Built | Good (code blocks, markdown, retry) | Matches LobeChat baseline |
| 16 Companions | Hardcoded | Good system prompts | Weaker than LobeChat agents or SillyTavern cards |
| Companion Forge | Built | UI-only, zero persistence | **Non-functional** — ephemeral state, refresh = gone |
| Provider Settings | Built | Google/Anthropic/OpenAI | Missing 297+ models (no OpenRouter) |
| Council System | Built + DB | Strong (9 advisors, persistence) | Unique — no competitor has this |
| Library | Built | 17 collections, 34+ texts | Unique — irreproducible IP |
| Academy/Courses | Built | 5 courses, 20+ lessons | Unique |
| Pricing Page | Built | 3 tiers designed | Zero enforcement, zero billing |
| Auth | 90% | Supabase configured | Blocked on OAuth dashboard setup |
| Custom Companions | Not built | — | Critical gap vs every competitor |
| OpenRouter | Not built | — | Missing 2.5M user discovery channel |
| Community/Marketplace | Not built | — | No network effects |
| Chat History | Not built | — | Users lose all conversations |
| Knowledge Base/RAG | Not built | — | No persistent context |
| Usage Tracking | Not built | — | No message limits, no tier enforcement |

### What Top Competitors Offer That We Don't

| Feature | SillyTavern | LobeChat | TypingMind | Arcanea |
|---------|-------------|----------|------------|---------|
| Custom agent creation | ✓ Character cards (V2 PNG+JSON) | ✓ JSON agent definitions | ✓ Custom personas | ✗ Forge is ephemeral |
| Models available | 20+ via OpenRouter | 50+ via multi-provider | 10+ direct | 3 hardcoded providers |
| OpenRouter | ✓ Native | ✓ Native | ✓ | ✗ |
| Community sharing | ✓ Chub.ai (1000s of cards) | ✓ Agent marketplace | ✓ Template sharing | ✗ |
| Chat history | ✓ Local filesystem | ✓ IndexedDB/Server | ✓ Local storage | ✗ Lost on refresh |
| Knowledge base | ✓ World Info | ✓ RAG | ✓ Projects | ✗ |
| Plugin/MCP | ✓ Extensions | ✓ MCP marketplace | ✓ Plugins | ✗ (MCP server exists, not in app) |
| Mythology framework | ✗ | ✗ | ✗ | ✓ **Unique moat** |
| Structured progression | ✗ | ✗ | ✗ | ✓ **Unique moat** |
| Curated wisdom library | ✗ | ✗ | ✗ | ✓ **Unique moat** |

### Verdict

**We're competing on Layer 2 (UI) when we should be competing on Layers 4-6 (Community, Workflows, Knowledge).** Our mythology IS the moat — but only if users can build WITH it, not just look AT it.

---

## Part 2: The Strategic Pivot — From "Choose a Companion" to "Build Your Universe"

### Current Model (Broken)

```
User → picks 1 of 16 hardcoded companions → chats → session ends → everything gone
```

### Target Model (Winning)

```
User → creates custom companions using Arcanea's mythology framework
     → assigns elements, gates, personality DNA, knowledge bases
     → companions persist, evolve, accumulate context
     → shares best companions to marketplace
     → discovers other creators' companions
     → builds teams of companions for different workflows
```

### Why Custom > Hardcoded

1. **Ownership**: Users invest in what they create. A forged companion with their name, their traits, their knowledge base creates switching costs no hardcoded list can match.

2. **Infinite variety**: 16 is limiting. The framework (5 Elements × 10 Gates × 44 traits × custom prompts) enables thousands of unique combinations.

3. **Community network effects**: Every custom companion shared to the marketplace makes Arcanea more valuable. SillyTavern's character card ecosystem is its #1 retention driver.

4. **Monetization clarity**: Free users get basic chat + 3 starter companions. Paying users get unlimited custom creation, persistence, marketplace access. The value is obvious.

5. **The Arcanea advantage**: No competitor offers a mythology-informed creation framework. Creating a companion on LobeChat is filling out a form. Creating one on Arcanea is a ritual — choose your element, align to a gate, define your companion's nature. Same output, radically different experience.

---

## Part 3: OpenRouter Integration — Why and How

### Why OpenRouter Over Direct Provider Keys

| Factor | Direct Keys (Current) | OpenRouter |
|--------|----------------------|------------|
| Models available | 3 (Gemini, Claude, GPT-4o) | 300+ |
| Setup friction | 3 accounts, 3 keys, 3 billing | 1 account, 1 key |
| New models | Requires code changes | Automatic |
| Cost optimization | Manual provider selection | Automatic cheapest routing |
| Fallback | None | Automatic failover |
| Discovery | None | App listed on openrouter.ai/apps |
| User base exposure | 0 | 2.5M OpenRouter users |
| Implementation | 3 SDK imports, 3 create functions | 1 OpenAI-compatible call + headers |

### OpenRouter App Identity

```typescript
// All it takes to be listed on OpenRouter
headers: {
  "HTTP-Referer": "https://arcanea.ai",
  "X-Title": "Arcanea",
  "X-OpenRouter-Categories": "chat,creative"
}
```

### Architecture: Both, Not Either/Or

Keep direct provider support (Google, Anthropic, OpenAI) AND add OpenRouter as a fourth option. Users who already have direct keys keep using them. Users who want 300+ models use OpenRouter. Default new users to OpenRouter for simplicity.

```
Provider Settings:
┌─────────────────────────────────────────────┐
│  [✓] OpenRouter  (300+ models, 1 key)       │  ← NEW DEFAULT
│  [ ] Google      (Gemini 2.0 Flash)         │
│  [ ] Anthropic   (Claude Sonnet 4)          │
│  [ ] OpenAI      (GPT-4o)                   │
│  [ ] Local       (Ollama, coming soon)       │  ← FUTURE
└─────────────────────────────────────────────┘
```

### Model Selection (OpenRouter enables this)

When OpenRouter is selected, show a model picker in chat:

```
┌─ Model ──────────────────────────────────────┐
│  ▾ Claude Sonnet 4        ~$3/1M tokens      │
│    Claude Opus 4.6        ~$15/1M tokens     │
│    GPT-4o                 ~$2.5/1M tokens    │
│    Gemini 2.0 Flash       ~$0.15/1M tokens   │
│    DeepSeek V3            ~$0.27/1M tokens   │
│    Llama 3.3 70B          ~$0.40/1M tokens   │
│    Mistral Large          ~$2/1M tokens      │
│    ... 293 more                              │
└──────────────────────────────────────────────┘
```

---

## Part 4: BYOK Status — Current vs Full

### Current BYOK Implementation

- **Provider keys**: localStorage only (never sent to server unless needed for API call)
- **Server priority**: Server env vars override client keys (good for managed tier)
- **Privacy**: Keys displayed masked, deletable from settings
- **Gap**: No OpenRouter, no model selection, no cost tracking

### Full BYOK Requirements (Industry Standard)

| Requirement | Current | Needed |
|-------------|---------|--------|
| User provides own API key | ✓ | ✓ |
| Keys never stored server-side | ✓ (localStorage) | ✓ |
| Multiple providers | ✓ (3) | ✓ (4+ with OpenRouter) |
| Model selection | ✗ (hardcoded defaults) | Per-chat model picker |
| Cost tracking | ✗ | Token count + estimated cost per message |
| Usage dashboard | ✗ | Monthly usage summary |
| OpenRouter OAuth PKCE | ✗ | Let users auth via OpenRouter account |
| Rate limiting (free tier) | ✗ | 100 messages/month for Spark |
| Key validation | ✗ | Test connection before saving |

### Would Arcanea Show as an OpenRouter App?

**Yes**, if we add the `HTTP-Referer: https://arcanea.ai` and `X-Title: Arcanea` headers to OpenRouter API calls. We'd appear on openrouter.ai/apps leaderboard, gaining exposure to 2.5M users. This is free marketing.

### Is This Connected to Monetization?

**Both.** BYOK is the value delivery mechanism. Monetization charges for:
- The experience layer (custom companions, mythology framework)
- The persistence layer (chat history, knowledge bases, companion evolution)
- The community layer (marketplace, sharing, discovery)

NOT for the AI tokens (user pays their provider directly).

---

## Part 5: The Arcanea Companion Architecture (Custom Creation System)

### Design Philosophy

> "Every companion is born at a Gate, shaped by an Element, and evolved through use."

### Companion DNA Schema

```typescript
interface CompanionDNA {
  // Identity
  id: string;
  name: string;
  creatorId: string;

  // Arcanea Framework (what makes us unique)
  element: 'fire' | 'water' | 'earth' | 'wind' | 'void';
  gate: number; // 1-10, determines base frequency
  archetype: string; // from 16 archetypes (optional starting point)

  // Personality
  traits: string[]; // 3-7 from the 44-trait pool
  voice: 'analytical' | 'poetic' | 'narrative' | 'visual' | 'grounded' | 'custom';
  customSystemPrompt?: string; // advanced users write their own

  // Knowledge
  knowledgeBases: string[]; // attached documents/RAG sources
  libraryTexts: string[]; // linked Arcanea Library texts

  // Model Preferences
  preferredModel?: string; // e.g., "anthropic/claude-sonnet-4"
  temperature?: number;
  maxTokens?: number;

  // Evolution (earned through use)
  level: number;
  xp: number;
  bondStrength: number;
  conversationCount: number;

  // Sharing
  isPublic: boolean;
  likes: number;
  forks: number;

  // Metadata
  createdAt: string;
  updatedAt: string;
  version: number;
}
```

### Creation Flow (The Forge Ritual)

**Step 1: Choose Your Foundation**
- Pick an archetype (16 creature types) OR start from blank
- Select primary element (affects visual theme + personality tendencies)
- Align to a Gate (optional, determines Hz frequency and domain)

**Step 2: Shape the Mind**
- Name your companion
- Select 3-7 personality traits from the 44-trait pool
- Choose a voice style (analytical, poetic, narrative, visual, grounded)
- OR write a custom system prompt (advanced mode)

**Step 3: Feed Knowledge** (Creator+ tier)
- Attach documents (PDF, MD, TXT) for RAG
- Link Library of Arcanea texts (e.g., "Laws of Arcanea: The Law of Iteration")
- Connect external knowledge sources

**Step 4: Choose the Voice** (model selection)
- Pick preferred AI model (from OpenRouter's 300+ or direct providers)
- Set temperature and response length preferences

**Step 5: Forge**
- Companion is created and persisted to database
- Visual animation of the forging ritual
- Companion appears in the user's collection

### Starter Companions (Replace Hardcoded 16)

The current 16 become **Starter Companions** — pre-forged companions available to all users as templates. Users can:
- Chat with them directly (current behavior)
- Fork them to create custom versions
- Use them as starting points in the Forge

This preserves existing work while opening the system to infinite customization.

### Database Schema

```sql
-- Custom companions table
CREATE TABLE companions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  element TEXT NOT NULL CHECK (element IN ('fire', 'water', 'earth', 'wind', 'void')),
  gate INTEGER CHECK (gate BETWEEN 1 AND 10),
  archetype TEXT,
  traits TEXT[] NOT NULL DEFAULT '{}',
  voice TEXT NOT NULL DEFAULT 'grounded',
  system_prompt TEXT,
  preferred_model TEXT,
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 8192,
  is_public BOOLEAN DEFAULT false,
  is_starter BOOLEAN DEFAULT false, -- for the original 16
  likes INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  fork_of UUID REFERENCES companions(id),
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  bond_strength INTEGER DEFAULT 0,
  conversation_count INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat history (persistent conversations)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  companion_id UUID REFERENCES companions(id),
  title TEXT,
  model_used TEXT,
  message_count INTEGER DEFAULT 0,
  token_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Companion knowledge bases
CREATE TABLE companion_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  companion_id UUID REFERENCES companions(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('document', 'library_text', 'url')),
  source_ref TEXT NOT NULL, -- file path, library text slug, or URL
  content_hash TEXT, -- for dedup
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE companion_knowledge ENABLE ROW LEVEL SECURITY;

-- Users can read their own + public companions
CREATE POLICY "companions_select" ON companions FOR SELECT
  USING (creator_id = auth.uid() OR is_public = true OR is_starter = true);

-- Users can only modify their own
CREATE POLICY "companions_insert" ON companions FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "companions_update" ON companions FOR UPDATE
  USING (creator_id = auth.uid());

-- Chat: users see only their own
CREATE POLICY "sessions_select" ON chat_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "messages_select" ON chat_messages FOR SELECT
  USING (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()));
```

---

## Part 6: Monetization Architecture

### Revenue Model: Charge for the Mythology, Not the Model

```
┌─────────────────────────────────────────────────────────────┐
│                    WHAT USERS PAY FOR                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: AI Tokens       → USER PAYS THEIR PROVIDER       │
│  Layer 2: Chat UI         → FREE (table stakes)            │
│  Layer 3: Companions      → FREE basic, PAID custom        │
│  Layer 4: Persistence     → PAID (history, knowledge)      │
│  Layer 5: Community       → PAID (marketplace, sharing)    │
│  Layer 6: Mythology       → PAID (Academy, Library, Gates) │
│                                                             │
│  Arcanea charges for: Layers 3-6                            │
│  User pays provider for: Layer 1                            │
│  Layer 2 is free to attract users                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Revised Pricing Tiers

| Feature | Spark (Free) | Creator ($19/mo) | Studio ($49/mo) |
|---------|-------------|------------------|-----------------|
| Chat with starter companions | 3 of 16 | All 16 | All 16 |
| Custom companion creation | ✗ | 10 companions | Unlimited |
| Companion persistence | ✗ | ✓ | ✓ |
| Chat history | 7 days | Unlimited | Unlimited + export |
| Library access | 5 sample texts | Full (34+ texts) | Full |
| Academy courses | Gate 1-2 | All 10 Gates | All + certificates |
| Council advisors | 3 sessions/mo | Unlimited | Unlimited + custom |
| Knowledge bases | ✗ | 3 bases, 10MB each | Unlimited |
| Marketplace browsing | ✓ | ✓ | ✓ |
| Marketplace publishing | ✗ | ✓ | ✓ + featured |
| Team collaboration | ✗ | ✗ | 5 seats |
| API access | ✗ | ✗ | ✓ |
| AI providers | BYOK required | BYOK required | BYOK + managed option |

### One-Time Purchase Option (TypingMind Model)

In addition to subscription, offer:
- **Lifetime Creator**: $149 one-time (includes everything in Creator tier forever)
- This captures users who resist subscriptions and generates upfront cash

---

## Part 7: Implementation Roadmap

### Phase 1: OpenRouter + Model Picker (1-2 sessions)
**Impact: Immediate competitive parity**

1. Add `openrouter` as 4th provider in `/api/ai/chat/route.ts`
2. Add OpenRouter to `/settings/providers/page.tsx`
3. Add model picker dropdown in chat (fetches available models from OpenRouter)
4. Add `HTTP-Referer` and `X-Title` headers (appear on openrouter.ai/apps)
5. Show estimated cost per message

### Phase 2: Companion Persistence (1-2 sessions)
**Impact: The Forge actually works**

1. Create `companions` + `companion_knowledge` tables in Supabase
2. Wire Forge "Save" button to persist custom companions
3. Add companion collection page (user's created companions)
4. Migrate 16 hardcoded companions to `is_starter = true` DB entries
5. Fork functionality (create custom version of any public/starter companion)

### Phase 3: Chat History (1 session)
**Impact: Users don't lose conversations**

1. Create `chat_sessions` + `chat_messages` tables
2. Auto-save messages to DB during streaming
3. Session list sidebar in chat
4. Resume previous conversations

### Phase 4: Companion Marketplace (2-3 sessions)
**Impact: Network effects begin**

1. Public companion gallery (browse, search, filter by element/gate)
2. Like + Fork mechanics
3. Featured companions section (curated by editorial)
4. Import/export in JSON format (interoperable with LobeChat agent format)

### Phase 5: Knowledge Bases (2-3 sessions)
**Impact: True RAG-powered companions**

1. Document upload (PDF, MD, TXT) → vector embeddings
2. Library text linking (companion draws from Arcanea's 34+ texts)
3. Contextual injection during chat (similarity search → system prompt augmentation)

### Phase 6: Billing + Tier Enforcement (2-3 sessions)
**Impact: Revenue**

1. Stripe/LemonSqueezy integration
2. Usage tracking middleware (message counts, companion counts)
3. Feature gating by tier
4. Checkout flow
5. Billing dashboard in settings

---

## Part 8: Competitive Positioning After Implementation

### Before (Now)

Arcanea = Pretty chat app with 16 hardcoded companions and 3 AI providers

### After (Phases 1-6)

Arcanea = The only BYOK creative platform where AI companions are:
- **Born from mythology** (element + gate + archetype framework)
- **Evolved through use** (XP, levels, bond strength)
- **Fed by a unique knowledge system** (Library of Arcanea + user documents)
- **Shared in a creator economy** (marketplace with likes + forks)
- **Powered by any model** (300+ via OpenRouter + 3 direct)

### What No Competitor Can Copy

1. **The Ten Gates progression** — companions aligned to frequencies, users advance through gates
2. **The Library of Arcanea** — 17 collections of curated wisdom that feed companion intelligence
3. **The Forge Ritual** — companion creation as meaningful creative act, not form-filling
4. **The Academy** — structured learning that deepens both user skill and companion capability
5. **The Council** — stateful advisory sessions (not just chat) with progression tracking

### Projected OpenRouter Ranking

With OpenRouter integration + unique companion system + Arcanea's visual identity:
- **Week 1**: Listed on openrouter.ai/apps in "creative" category
- **Month 1**: Top 50 creative apps (novel mythology angle drives curiosity)
- **Month 3**: Top 20 (companion marketplace creates retention)
- **Month 6**: Top 10 creative (if community flywheel activates)

---

## Decision Required

**Q1**: Do we proceed with this architecture? The shift from "16 hardcoded companions" to "custom creation platform" is a strategic pivot, not a feature add.

**Q2**: Phase 1 (OpenRouter) can ship in 1 session. Should we start immediately?

**Q3**: Pricing: Keep $19/$49 or adjust based on competitive analysis? (TypingMind charges $39-149 one-time for less functionality.)

---

## Appendix: The 16 Starter Companions (Preserved, Not Removed)

The existing 16 become templates. They are not deleted — they are elevated to "official Arcanea companions" that users can fork and customize:

| Name | Team | Element Alignment | Gate |
|------|------|-------------------|------|
| Logicus | Development | Earth | Foundation (174 Hz) |
| Prismatic | Creative | Fire | Fire (396 Hz) |
| Chronica | Writing | Water | Flow (285 Hz) |
| Melodia | Creative | Wind | Voice (528 Hz) |
| Oracle | Research | Void | Sight (639 Hz) |
| ... (11 more) | ... | ... | ... |

Each starter companion gets a proper element + gate alignment, making them part of the mythology rather than floating outside it.
