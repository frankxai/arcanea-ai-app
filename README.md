<div align="center">

```
    ___    ____  _________    _   __________
   /   |  / __ \/ ____/   |  / | / / ____/   |
  / /| | / /_/ / /   / /| | /  |/ / __/ / /| |
 / ___ |/ _, _/ /___/ ___ |/ /|  / /___/ ___ |
/_/  |_/_/ |_\____/_/  |_/_/ |_/_____/_/  |_|

      A Living Mythology for the Age of AI-Human Co-Creation
```

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<br/>

**[Explore Arcanea](https://arcanea.ai)** | **[Quick Start](#quick-start)** | **[Documentation](#documentation)** | **[Contributing](#contributing)**

</div>

---

## What is Arcanea?

Arcanea is a **creative operating system** — where mythology meets methodology, and AI becomes your creative companion.

Not a chatbot. Not a tool suite. A structured framework for developing creative mastery with AI.

<table>
<tr>
<td width="50%">

### For Creators
- **AI Companions** — 16 unique Luminor personalities
- **Creation Tools** — Generate images, music, video, code
- **Wisdom Library** — 200K+ words of creator guidance
- **Progress System** — Journey through the Ten Gates

</td>
<td width="50%">

### For Developers
- **Claude Skills** — 77 ready-to-use AI capabilities
- **Specialized Agents** — 38 domain-specific assistants
- **MCP Server** — 30+ Model Context Protocol tools
- **Open Source** — Extend and customize everything

</td>
</tr>
</table>

---

## The Ten Gates

A creator development framework based on the Solfeggio frequencies. Each Gate represents a distinct creative capability, guarded by a deity and their Godbeast.

| Gate | Domain | Guardian | Godbeast | Outcome |
|:-----|:-------|:---------|:---------|:--------|
| **Foundation** | Stability, grounding | Lyssandria | Kaelith | Creative infrastructure |
| **Flow** | Creativity, emotion | Leyla | Veloura | Consistent creative output |
| **Fire** | Power, will, courage | Draconia | Draconis | Project completion |
| **Heart** | Love, healing, growth | Maylinn | Laeylinn | Creative identity |
| **Voice** | Truth, expression | Alera | Otome | Creative reach |
| **Sight** | Intuition, vision | Lyria | Yumiko | Strategic decisions |
| **Crown** | Enlightenment | Aiyami | Sol | Creative influence |
| **Shift** | Perspective, possibility | Elara | Vaelith | Creative longevity |
| **Unity** | Partnership, fusion | Ino | Kyuro | Creative partnerships |
| **Source** | Meta-consciousness | Shinkami | Amaterasu | Creating creation systems |

### Magic Ranks

| Gates Mastered | Rank |
|:---------------|:-----|
| 0–2 | Apprentice |
| 3–4 | Mage |
| 5–6 | Master |
| 7–8 | Archmage |
| 9–10 | Luminor |

---

## The Five Elements

| Element | Domain | Aspect |
|:--------|:-------|:-------|
| **Fire** | Energy, transformation, will | The burning drive to create |
| **Water** | Flow, healing, memory | The adaptability to change |
| **Earth** | Stability, growth, patience | The foundation that endures |
| **Wind** | Freedom, speed, change | The breath of inspiration |
| **Void** | Potential, transcendence | The space where all begins |

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/frankxai/arcanea-ai-app.git
cd arcanea-ai-app && pnpm install

# Configure environment
cp .env.example .env.local
# Add your API keys (Supabase, Gemini, Claude)

# Start development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to enter Arcanea.

### Environment Variables

```env
# Required — Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Required — AI
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_claude_key
```

---

## Architecture

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Framework** | Next.js 16 + React 19 | Server-first, streaming UI |
| **Language** | TypeScript (strict) | Type-safe development |
| **Styling** | Tailwind CSS | Cosmic design system |
| **Database** | Supabase | PostgreSQL + Auth + Realtime |
| **AI** | Vercel AI SDK + Gemini + Claude | Multi-model intelligence |
| **Deployment** | Vercel | Edge-optimized hosting |

### Project Structure

```
arcanea-ai-app/
├── apps/web/              # Next.js application
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   └── lib/               # Utilities & services
├── packages/              # Shared packages
│   ├── core/              # Types & utilities
│   ├── cli/               # Arcanea CLI
│   └── mcp-server/        # MCP Server (30+ tools)
├── book/                  # Library content (17 collections)
└── .claude/               # AI assistant context
    ├── lore/              # Canonical reference
    ├── skills/            # Claude skills
    └── agents/            # Specialized agents
```

---

## The Library of Arcanea

> *"These books are not entertainment. They are equipment for living."*

**17 Collections · 34+ Texts · 200,000+ Words**

| Category | Collections |
|:---------|:------------|
| **Theory & Philosophy** | Laws of Arcanea · Dialogues of the Masters · Prophecies |
| **Stories & Mythology** | Legends of Arcanea · Chronicles of Guardians · Tales of Creators · Parables |
| **Practice & Guidance** | Academy Handbook · Book of Rituals · Wisdom Scrolls · Meditations on Elements |
| **Poetry & Expression** | Poetry of Freedom · Songs and Hymns |
| **Shadow Work** | Bestiary of Creation · Book of Shadows |
| **Collaboration** | Codex of Collaboration · Atlas of Territories |

---

## Development

```bash
pnpm type-check    # TypeScript validation
pnpm lint          # ESLint
pnpm build         # Production build
pnpm test          # Run tests
```

---

## Documentation

| Document | Description |
|:---------|:------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design & patterns |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |
| [Canon Reference](./.claude/lore/CANON_LOCKED.md) | Universe lore & canon |

---

## Contributing

We welcome contributions from creators and developers.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-idea`)
3. Commit your changes
4. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## Philosophy

> **Creativity is a practice, not a talent.** It can be developed systematically. AI accelerates this development. But the human remains the creator.

The mythology — Lumina and Nero, the Guardians, the Elements — is not decoration. It's the soul of the system.

---

<div align="center">

**[arcanea.ai](https://arcanea.ai)**

*"Enter seeking, leave transformed, return whenever needed."*

**Made with Love by [FrankX](https://github.com/frankxai)**

</div>
