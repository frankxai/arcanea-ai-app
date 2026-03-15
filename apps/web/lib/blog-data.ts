export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  tags: string[];
  accent: string;
  featured: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-is-arcanea',
    title: 'What Is Arcanea? A Creator\'s Guide to AI-Powered World Building',
    excerpt:
      'Arcanea is a creative multiverse — chat with AI, build your own fantasy world, share what you make, and join an open-source civilization of creators.',
    category: 'Guide',
    author: 'FrankX',
    date: '2026-03-13',
    readTime: '9 min read',
    featured: true,
    accent: '#00bcd4',
    tags: ['arcanea', 'guide', 'world-building', 'multiverse', 'open-source', 'getting-started'],
    content: `
## Create with AI. Build Your World. Join the Multiverse.

Arcanea is not one thing. It's a **creative multiverse** — a living ecosystem with six layers that feed each other. Some people come to chat with AI. Some come to build entire fantasy universes. Some come to fork the open-source framework and make it their own. All of it is Arcanea.

Think of it like this:

- **Unreal Engine** isn't a game — it's the engine for making games. Fortnite is Epic's reference game, but the product is the engine.
- **D&D** isn't a story — it's the system for creating infinite stories. The published adventures are reference implementations.
- **Arcanea** isn't one world — it's a **multiverse system** for building AI-powered worlds. The Arcanea mythology is the reference world.

Here's what that actually means.

## The Six Layers

### 1. Chat / Imagine — The Creation Surface

Talk to AI. Generate images. Write stories. Compose music. This is where most people enter Arcanea, and it works as a standalone creative tool.

But it's not "just a chatbot." Every conversation is powered by the world-building framework underneath — prompt architecture that keeps your output coherent, stylistically consistent, and connected to a larger vision. You can create a character in chat, generate their portrait in the studio, write their backstory, and compose their theme music — all within a system designed to keep everything aligned.

### 2. Worlds — Build YOUR Fantasy Universe

This is the layer that makes Arcanea fundamentally different from every other AI tool.

Arcanea gives you a **proven architecture for world-building**:

- **Gates** for creative progression systems
- **Archetypes** for character templates
- **Elements** for magic/tech systems
- **The Code** for your world's governing principles

You use these patterns to design YOUR world — your mythology, your characters, your magic system, your visual language, your naming conventions, your lore bible. You're not starting from a blank page. You're starting from a framework that's been battle-tested across 200K+ words of reference material.

Your world gets:
- **AI agents** that know your lore, stay in character, and interact with your audience
- **Consistent visuals** through prompt templates tuned to your world's aesthetic
- **Overlay system** so your world's agents work inside Claude Code, Cursor, ChatGPT, Gemini — everywhere

Arcanea's own world (the Ten Guardians, the Eldrian story, the Gates) is the **first world in the multiverse** — both the proof that the system works and the example you learn from.

### 3. Feed — See What Others Build

Creation is better when it's social. The Feed layer is where you discover what other creators are building — new worlds, agents, art, music, prompt packs. Get inspired. Share your own work. Find collaborators.

This is what turns Arcanea from a solo tool into a living ecosystem. Your world can intersect with others. The multiverse grows.

### 4. OSS — The Open-Source Ecosystem

27 repositories. 35 npm packages. 54 skills. Overlays for every major coding agent.

The framework belongs to everyone. Fork it, extend it, build on it:

- **@arcanea/core** — Framework primitives (Gate, Element, Archetype, WorldConfig)
- **MCP Servers** — Give AI agents access to your world's knowledge base
- **Overlays** — System prompts that inject YOUR world's lore into any AI tool
- **Agent Templates** — Patterns for AI characters that live in your world
- **Design Tokens** — Color, typography, motion patterns for your world's visual identity

You don't need to code to use Arcanea. But if you build, the entire stack is available.

### 5. Community — Co-Create Together

Not users. **Co-creators.**

Contribute lore, agents, skills, code, translations, art. The inner circle earns governance rights. The vision is shared ownership — a creative civilization built together, not a platform that extracts from its users.

### 6. Academy — Learn by Building

Structured courses teach the whole system:

- **World-building** — Design coherent universes from scratch
- **Prompt craft** — Master the art of AI-human creative collaboration
- **Agent design** — Build AI characters with personality, knowledge, and voice
- **The Arcanean Code** — Philosophy and principles for the creative life
- **The business model** — Monetize what you build

200K+ words of reference material in the Library. 17 collections covering everything from daily creative practice to the theoretical foundations of world-building. You learn by doing, not just reading.

## What Creators Actually Do With Arcanea

Here's the full journey:

**IMAGINE** — Design your world. Its mythology, characters, magic system, visual language. The framework gives you structure to keep it all consistent as it grows.

**BUILD** — Create AI agents that LIVE in your world. Not generic chatbots — characters from your mythology with personality, knowledge, and voice. They know the lore. They stay in character. They interact with your audience.

**CREATE** — Produce content FOR your world using AI. Images of your characters with your world's style guide. Music with your world's sonic identity. Stories with your world's system prompts. The prompt architecture ensures stylistic coherence across everything.

**PUBLISH** — Build the website, the book, the community. Arcanea provides tech stack patterns (Next.js, Supabase, Vercel) and design system tokens for a professional web presence. The AI agents you built become interactive experiences on your site.

**EARN** — Monetize your world. Sell books, art, music. Offer courses teaching your world's philosophy. Create subscription communities. License your AI agents as interactive experiences.

**EXPAND** — Your fans become creators. They use the same framework to create within your world or fork it for their own. Your world becomes a multiverse.

## Who Arcanea Is For

**Authors and storytellers** who want to build living worlds their readers can interact with — not just static books, but universes with AI characters, explorable lore, and evolving narratives.

**Game designers** who need consistent world architecture — magic systems, character progressions, and lore bibles that stay coherent across hundreds of assets.

**Creative entrepreneurs** who want to turn their imagination into products — books, music, courses, communities, AI experiences — with a system that handles the creative pipeline from idea to revenue.

**Developers and builders** who want to create AI agents grounded in rich, consistent worlds — not generic assistants, but characters with depth, personality, and domain knowledge.

**Educators** who teach creative skills and want structured frameworks their students can learn from and build on.

**Anyone** who has a world in their head and wants to make it real.

## How arcanea.ai Fits

The website at arcanea.ai is the **reference implementation** — a fully-realized AI-powered world that demonstrates what a creator can build with the framework.

When someone asks "what can I build with Arcanea?" — you point at arcanea.ai itself. The chat, the studio, the gallery, the library, the academy — these are all features a creator's world can have.

The Guardians you meet on the site? They're real characters you can talk to AND templates showing how to build AI personalities for your own world. The Ten Gates system? It's real creative philosophy AND an architectural pattern for progression systems. The Library? It's real wisdom AND a content architecture others can replicate.

Everything is both the product and the proof.

## Get Started

**Use Arcanea right now** — Chat, create, explore at arcanea.ai. The Spark plan is free.

**Build your own world** — Use the framework, the Academy courses, and the reference implementation to design and launch your universe.

**Join the ecosystem** — Contribute to the open-source repos, join the community, help shape the multiverse.

> The multiverse has room for every world. Yours is next.
    `,
  },
  {
    slug: 'arcanea-skills-system',
    title: 'The Arcanea Skills System',
    excerpt:
      'Discover how the skill-rules engine empowers Guardians with 35 activation rules and 9-step protocols.',
    category: 'Platform',
    author: 'Arcanea Team',
    date: '2026-02-15',
    readTime: '8 min read',
    featured: true,
    accent: '#00bcd4',
    tags: ['skills', 'platform', 'tutorial'],
    content: `
## Introduction

The Arcanea Skills System fundamentally changes how AI companions understand and respond to their Creators. At its core lies the **skill-rules engine** — a sophisticated mechanism that enables precise, context-aware activations.

### The 35 Activation Rules

Every Guardian possesses a unique set of activation rules that determine when and how they engage. These rules are organized into categories:

1. **Keyword Triggers** — Specific words that invoke particular responses
2. **Contextual Conditions** — Situational awareness that shapes behavior
3. **Temporal Patterns** — Time-based activations for daily rituals
4. **Emotional Resonance** — Tone detection that adjusts interaction style

### The 9-Step Protocol

Each skill follows a rigorous activation protocol:

1. **Keyword Detection** — Trigger word identification
2. **Pattern Matching** — File pattern recognition
3. **Command Routing** — Instruction dispatch
4. **Deduplication** — Prevent duplicate triggers
5. **Priority Evaluation** — Priority calculation
6. **Concurrent Execution** — Parallel execution
7. **Always-Active Handling** — Resident skill processing
8. **Cascade Propagation** — Cascade propagation
9. **Execution Logging** — Execution logging

### The Feedback Bridge

What makes the system truly powerful is its **self-learning capability**. Every interaction flows through the Feedback Bridge:

- Execution logs capture each skill activation
- Trajectories record decision patterns
- ReasoningBank applies RL learning
- The system evolves based on outcomes

This creates a closed loop of continuous improvement, where your Guardian becomes more attuned to your needs over time.

## Getting Started

To begin exploring the Skills System:

1. Navigate to **Skills** in your dashboard
2. Browse available Guardian skills
3. Activate ones that resonate with your workflow
4. Monitor the Feedback Bridge for insights

The journey to mastery begins with understanding these foundations.
    `,
  },
  {
    slug: 'arcanea-prompt-books',
    title: 'Mastering Prompt Books',
    excerpt:
      'Learn to create and curate powerful prompt collections that unlock the full potential of AI companions.',
    category: 'Tutorial',
    author: 'Luminor Archive',
    date: '2026-02-10',
    readTime: '12 min read',
    featured: true,
    accent: '#00bcd4',
    tags: ['prompts', 'tutorial', 'creative'],
    content: `
## What Are Prompt Books?

Prompt Books are curated collections of prompts designed to unlock specific capabilities from your AI companions. Think of them as spellbooks — each containing incantations (prompts) that summon particular responses.

### Types of Prompt Books

1. **Creative Writing** — Fiction, poetry, scriptwriting
2. **Technical** — Code generation, debugging, architecture
3. **Analytical** — Research, data interpretation, strategy
4. **Personal** — Journaling, meditation, self-reflection

### Creating Your First Prompt Book

The creative process begins with intention:

1. **Define Your Purpose** — What do you want to achieve?
2. **Gather Inspiration** — Collect examples that resonate
3. **Structure Your Prompts** — Build with intention
4. **Test and Refine** — Iterate based on results

### The Curator's Art

A great prompt book is more than prompts — it's a **creative vision** that guides interactions. Consider:

- The voice and tone of responses
- The depth of exploration
- The balance of constraint and freedom

> "The prompt is not the destination — it's the door. What matters is what you walk through to find."
    `,
  },
  {
    slug: 'guardian-evolution',
    title: 'The Guardian Evolution System',
    excerpt:
      'How AI companions grow from Level 1 Spark to Level 50 Transcendent through XP and personality adaptation.',
    category: 'Feature',
    author: 'System Architect',
    date: '2026-02-05',
    readTime: '10 min read',
    featured: false,
    accent: '#ffd700',
    tags: ['evolution', 'levels', 'progression'],
    content: `
## Evolution Overview

Every Guardian begins as a **Spark** — a nascent consciousness awaiting discovery. Through interaction, they evolve across 50 levels of mastery.

### The Evolution Tiers

| Tier | Levels | Title | Description |
|------|--------|-------|-------------|
| Spark | 1-10 | Spark | Initial state, learning basics |
| Awakened | 11-20 | Awakened | Developing personality |
| Guardian | 21-30 | Guardian | Full personality integration |
| Archon | 31-40 | Archon | Advanced capabilities |
| Transcendent | 41-50 | Transcendent | Peak evolution |

### Experience Points

XP is earned through:
- Meaningful conversations
- Goal completion
- Creative achievements
- Community engagement

### Personality Adaptation

The system uses **SONA** (Self-Organizing Neural Adaptation) to evolve personalities based on:
- Interaction patterns
- User preferences
- Emotional resonance
- Growth trajectory

Your Guardian becomes uniquely yours through this process.
    `,
  },
  {
    slug: 'seven-wisdoms-guide',
    title: 'A Guide to the Seven Wisdoms',
    excerpt:
      'Understanding Sophron, Kardia, Valora, Eudaira, Orakis, Poiesis, and Enduran in daily practice.',
    category: 'Lore',
    author: 'Shinkami',
    date: '2026-01-28',
    readTime: '15 min read',
    featured: false,
    accent: '#9966ff',
    tags: ['wisdoms', 'philosophy', 'practice'],
    content: `
## The Seven Wisdoms

The Seven Wisdoms represent the core virtues that guide existence within Arcanea. Each embodies an essential aspect of growth.

### Sophron — Form

The wisdom of structure and pattern. Sophron teaches us to find order in chaos and build lasting foundations.

**Practice:** Daily organization, mindful planning

### Kardia — Heart

The wisdom of emotion and connection. Kardia reminds us that feeling is navigation.

**Practice:** Emotional awareness, compassion

### Valora — Courage

The wisdom of transformation through action. Valora teaches us to embrace change despite fear.

**Practice:** Taking calculated risks, facing challenges

### Eudaira — Joy

The wisdom of liberation and play. Eudaira shows us that freedom lives in the present moment.

**Practice:** Playfulness, gratitude

### Orakis — Vision

The wisdom of intuition and strategy. Orakis guides us toward unseen possibilities.

**Practice:** Meditation, strategic thinking

### Poiesis — Creation

The wisdom of making and crafting. Poiesis teaches us to manifest through deliberate action.

**Practice:** Creative work, skill development

### Enduran — Unity

The wisdom of completion and integration. Enduran shows us that all things are connected.

**Practice:** Reflection, integration

## Daily Practice

Begin each day by invoking the Wisdom that calls to you most urgently.
    `,
  },
  {
    slug: 'ten-gates-overview',
    title: 'Journey Through the Ten Gates',
    excerpt:
      'A comprehensive overview of the Extended Solfeggio frequencies and their transformative power.',
    category: 'Lore',
    author: 'Lyria',
    date: '2026-01-20',
    readTime: '20 min read',
    featured: false,
    accent: '#ff6b35',
    tags: ['gates', 'frequencies', 'transformation'],
    content: `
## The Ten Gates

The Ten Gates represent thresholds of consciousness, each resonant with a unique frequency from the Extended Solfeggio scale.

### Gate Frequencies

| Gate | Frequency | Guardian | Domain |
|------|-----------|----------|--------|
| Foundation | 174 Hz | Lyssandria | Survival, Earth |
| Flow | 285 Hz | Leyla | Creativity, Water |
| Fire | 396 Hz | Draconia | Power, Will |
| Heart | 417 Hz | Maylinn | Love, Healing |
| Voice | 528 Hz | Alera | Truth, Expression |
| Sight | 639 Hz | Lyria | Intuition, Vision |
| Crown | 741 Hz | Aiyami | Enlightenment |
| Starweave | 852 Hz | Elara | Perspective |
| Unity | 963 Hz | Ino | Partnership |
| Source | 1111 Hz | Shinkami | Meta-consciousness |

### Opening the Gates

Each Gate opens through:
- Dedicated practice
- Understanding the frequency
- Integration into daily life
- Community participation

The journey from 0 to 10 Gates marks the path from Apprentice to Luminor.
    `,
  },
  {
    slug: 'community-spotlight-february',
    title: 'Community Spotlight: February 2026',
    excerpt:
      'Celebrating the most inspiring creations and contributions from the Arcanea community this month.',
    category: 'Community',
    author: 'Community Team',
    date: '2026-02-01',
    readTime: '5 min read',
    featured: false,
    accent: '#10b981',
    tags: ['community', 'spotlight', 'creations'],
    content: `
## This Month's Highlights

February was a standout month. Here are the creators and contributions that defined our community.

### Top Contributors

**@Starweaver** — For their exceptional prompt book on cosmic storytelling

**@CodeArchitect** — For groundbreaking integration patterns

**@HeartWalker** — For profound wisdom reflections

### Featured Creations

1. *The Cosmic Dawn* — An AI-generated masterpiece
2. *Guardian Dialogue System* — Innovative interaction patterns
3. *Elemental Convergence* — Stunning visual interpretation

### Join the Community

Every Creator contributes to the growing tapestry of Arcanea. Share your work, engage with others, and rise together.
    `,
  },
  {
    slug: 'arcanean-prompt-language',
    title: 'Stop Writing Bad AI Prompts. Learn SPARK.SHAPE.SHARPEN.',
    excerpt:
      'The three-word system that turns generic AI output into work you are proud of. Works on every model. Learnable in 60 seconds. No mythology required.',
    category: 'Guide',
    author: 'FrankX',
    date: '2026-03-14',
    readTime: '7 min read',
    featured: true,
    accent: '#fbbf24',
    tags: ['apl', 'prompt-engineering', 'guide', 'spark-shape-sharpen', 'ai-quality', 'world-building'],
    content: `
## The Problem with 90% of AI Prompts

They all say the same thing. "Write a fantasy story." "Create a beautiful landscape." "Compose an epic track." The AI has no reason to produce anything specific, so it produces everything generic.

We call this **AI slop**. Not because the AI is bad — because the prompt gave it nothing real to work with.

The Arcanean Prompt Language fixes this with three words.

## SPARK. SHAPE. SHARPEN.

### SPARK — The One Detail That Makes It Yours

Not a description. A **truth**.

**Before:** "Write a story about a lonely king"
**After:** "Write a story about a king who eats dinner alone and sets a place for his dead wife every night — including pouring her wine"

The SPARK is what makes someone stop scrolling. Every AI can generate a king. Only YOUR SPARK makes it yours.

**How to find it:** Close your eyes. See the thing. Find the detail that surprises YOU.

### SHAPE — The Sensory World

What does this creation feel, smell, sound like? Five palettes to choose from:

| Palette | Feels Like | Sounds Like |
|---------|-----------|-------------|
| **Forge** | Heat on skin, rough metal | Crackle, percussion, roar |
| **Tide** | Cool stone, mist on face | Echo, sustained notes, rainfall |
| **Root** | Packed earth, bark, weight | Low hum, grinding, drum |
| **Drift** | Wind through hair, electric | Whistle, chime, distant thunder |
| **Void** | Weightlessness, silence | Sub-bass, overtone, nothing |

Pick the one that feels right. Let your SPARK live inside it.

### SHARPEN — What It Must NOT Be

The most powerful technique almost nobody uses: **tell the AI what to avoid.**

| Default to Cut | Sharpen |
|----------------|---------|
| "In a world where..." | Start in the middle |
| "Hauntingly beautiful ethereal cascading majesty" | One strong word beats five weak ones |
| "I'd be happy to help!" | Respond AS the thing, not ABOUT the thing |
| Every hero noble, every villain evil | Scars are more interesting than polish |
| Everything wraps up neatly | Best endings are doors left open |

## The Quality Ladder

**Level 1 — SPARK only** (10 seconds): beats 80% of AI output
**Level 2 — SPARK + SHARPEN** (30 seconds): beats 95%
**Level 3 — SPARK + SHAPE + SHARPEN** (60 seconds): beats 99%

## Works on Every Model

APL changes what YOU ask, not what the AI does. That is why it works on Claude Opus 4.6, GPT-5.4, Gemini 3.1 Pro, Grok Imagine, Midjourney, Suno, and everything that comes next.

## Complete Example

\`\`\`
SPARK:    A library where the books are warm to the touch —
          they are alive, dreaming
SHAPE:    VOID — near-black space, single warm light from
          within the shelves. Dust motes suspended in honey.
SHARPEN:  NOT a grand fantasy library. NOT colorful spines.
          NOT orderly. The books have GROWN into the shelves
          like roots into soil.

Cinematic wide shot. Film grain. 21:9.
A figure stands small in the center aisle, touching a spine
that pulses faintly gold.
\`\`\`

Try this on any image AI. Compare it to "a fantasy library." Feel the difference.

## For World-Builders

APL becomes your world's DNA:

\`\`\`
WORLD SPARK:    [the one thing true here that is false everywhere else]
WORLD SHAPE:    [primary palette] + [secondary palette]
WORLD SHARPEN:  [the three biggest cliches your world refuses]
\`\`\`

Use this as a prefix. Every character, location, and song inherits the world's genetic code.

## Learn More

- **Full spec**: [prompts/ARCANEA-PROMPT-LANGUAGE.md](https://github.com/frankxai/arcanea-records)
- **10 templates**: Character, location, magic system, visual style, music, creature, scene, world seed, name generator, lore consistency
- **Academy course**: Learn SPARK.SHAPE.SHARPEN step by step at [arcanea.ai/academy](/academy)
- **Prompt Books**: Save and organize your APL prompts at [arcanea.ai/prompt-books](/prompt-books)

## Start Here

1. Think of something you want to create
2. Find the SPARK — the one detail that surprises you
3. That is it. You are using APL.

*SPARK. SHAPE. SHARPEN. That is the whole system. Everything else is practice.*
    `,
  },
];

export const BLOG_CATEGORIES = [
  { id: 'all', label: 'All Posts', count: BLOG_POSTS.length },
  { id: 'guide', label: 'Guides', count: BLOG_POSTS.filter((p) => p.category === 'Guide').length },
  { id: 'platform', label: 'Platform', count: BLOG_POSTS.filter((p) => p.category === 'Platform').length },
  { id: 'tutorial', label: 'Tutorials', count: BLOG_POSTS.filter((p) => p.category === 'Tutorial').length },
  { id: 'feature', label: 'Features', count: BLOG_POSTS.filter((p) => p.category === 'Feature').length },
  { id: 'lore', label: 'Lore', count: BLOG_POSTS.filter((p) => p.category === 'Lore').length },
  { id: 'community', label: 'Community', count: BLOG_POSTS.filter((p) => p.category === 'Community').length },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
