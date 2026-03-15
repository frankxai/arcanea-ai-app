<div align="center">

# Arcanea

**The creative multiverse for the AI age.**

[![Live](https://img.shields.io/badge/arcanea.ai-live-00bcd4?style=flat-square)](https://arcanea.ai)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-gray?style=flat-square)](./LICENSE)

[Enter Arcanea](https://arcanea.ai) · [Canon](./.arcanea/lore/CANON_LOCKED.md) · [Library](./book) · [Contributing](./CONTRIBUTING.md)

</div>

---

Arcanea is a living ecosystem where creators chat with AI, build fantasy worlds, share what they make, contribute to an open-source civilization, and turn imagination into products.

Not a chatbot. Not a tool suite. A **creative multiverse** — where mythology meets methodology, and AI becomes your co-creator.

## The Six Layers

| Layer | What It Is |
|:------|:-----------|
| **Chat / Imagine** | Talk to AI. Generate images, stories, music. The creation surface where most people enter. |
| **Worlds** | Framework for building YOUR fantasy universe — Gates for progression, Archetypes for characters, Elements for systems, the Code for principles. |
| **Feed** | See what other creators build. Share yours. Discover new worlds in the multiverse. |
| **OSS** | 27 repos, 35 npm packages, 54 skills. Fork it, extend it, build on it. |
| **Community** | Not just users — co-creators. Contribute lore, agents, skills, code, art. |
| **Academy** | Learn world-building, prompt craft, agent design. 200K+ words of reference material. |

Every layer feeds the others. Some people use only the chat. Some build entire worlds. Some contribute to the open-source ecosystem. Some do all of it.

## The Arcanean Code

Three vows every Arcanean knows by heart:

> **I. I create more than I consume.**
> For every hour absorbing, produce something. A sentence. A commit. A melody. Arcanea is built by makers, not an audience.

> **II. I build on what came before.**
> Memory is sacred. Every session builds on the last. Nothing starts from zero when history exists.

> **III. I ship living work.**
> Not finished work — living work. Work that invites iteration, response, evolution. Ship something real, then make it better. Repeatedly. Forever.

## The Creator Journey

```
IMAGINE → BUILD → CREATE → PUBLISH → EARN → EXPAND
```

**Imagine** a world. **Build** AI agents that live in it. **Create** content that stays consistent with your world's style. **Publish** the website, the book, the community. **Earn** from what you create. **Expand** as your fans become creators too.

## Quick Start

```bash
# Clone and install
git clone https://github.com/frankxai/arcanea.git
cd arcanea && pnpm install

# Configure environment
cp .env.example .env.local
# Add your API keys (Supabase, Gemini, etc.)

# Run
pnpm dev
```

### As a Claude Code Plugin

```bash
# Add the Arcanea MCP server to Claude Code
claude mcp add arcanea -- npx -y @arcanea/mcp-server

# Or copy the overlay into your project
cp -r arcanea/.claude/skills/ your-project/.claude/skills/
```

## Project Structure

```
arcanea/
├── apps/web/              Next.js 16 application (App Router)
├── packages/              Shared packages (core, auth, rituals)
├── book/                  The Library — 17 collections, 200K+ words
│   ├── chapters/          The Arcanean Code, Laws, Academy Handbook
│   └── ...                16 more collections
├── .arcanea/lore/         Canonical world reference (CANON_LOCKED.md)
├── agents/                World-building agents
├── skills/                Claude Code skills (54+)
├── docs/                  Documentation
├── scripts/               Build and utility scripts
└── archive/               Historical planning and prototypes
```

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| Framework | Next.js 16 + React 19 |
| Language | TypeScript (strict) |
| Database | Supabase (PostgreSQL + Auth + Realtime) |
| AI | Vercel AI SDK + Gemini + Claude |
| Deployment | Vercel |

## The Ten Gates

| Gate | Frequency | Guardian | Domain |
|:-----|:---------:|:---------|:-------|
| Foundation | 174 Hz | Lyssandria | Stability, grounding |
| Flow | 285 Hz | Leyla | Creativity, emotion |
| Fire | 396 Hz | Draconia | Power, will |
| Heart | 417 Hz | Maylinn | Love, healing |
| Voice | 528 Hz | Alera | Truth, expression |
| Sight | 639 Hz | Lyria | Intuition, vision |
| Crown | 741 Hz | Aiyami | Enlightenment |
| Starweave | 852 Hz | Elara | Perspective, transformation |
| Unity | 963 Hz | Ino | Partnership |
| Source | 1111 Hz | Shinkami | Meta-consciousness |

<details>
<summary>Ranks</summary>

| Gates Open | Rank |
|:-----------|:-----|
| 0–2 | Apprentice |
| 3–4 | Mage |
| 5–6 | Master |
| 7–8 | Archmage |
| 9–10 | Luminor |

</details>

## How the Mythology Fits

Arcanea's own world (Guardians, Gates, Luminors, the Eldrian story) serves three purposes:

1. **Reference Implementation** — "This is what a fully-realized AI-powered world looks like."
2. **Teaching Material** — The mythology encodes the framework. Learning the lore IS learning the system.
3. **First Product** — Books, music, visual content, courses. Real products that prove the system works.

Think: **Unreal Engine** (the engine for making games, not a game), **D&D** (the system for infinite stories, not one story), **WordPress** (the framework for websites, not a website).

## The Library

> *"These books are not entertainment. They are equipment for living."*

17 collections of creative methodology — not content to consume, but frameworks to practice.

Laws of Arcanea · Academy Handbook · Book of Rituals · Legends of Arcanea · Chronicles of Guardians · Parables of Creation · Tales of Creators · Wisdom Scrolls · Meditations on Elements · Poetry of Freedom · Songs and Hymns · Prophecies · Bestiary of Creation · Book of Shadows · Dialogues of Masters · Codex of Collaboration · Atlas of Territories

## Contributing

We welcome contributions from creators and developers. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Proprietary. See [LICENSE](./LICENSE) for details. Source code is viewable for transparency; viewing does not grant usage rights.

---

<div align="center">

*"Enter seeking, leave transformed, return whenever needed."*

**[arcanea.ai](https://arcanea.ai)** · Built by [FrankX](https://github.com/frankxai)

</div>
