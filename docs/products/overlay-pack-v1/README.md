# Arcanea World-Builder Overlay Pack v1
## Claude Code + Cursor + AI Coding Tools

> "Every creator has an origin. This is the framework for building yours."

---

## What This Is

A drop-in overlay for Claude Code, Cursor, Windsurf, or any AI coding tool that supports `.claude/` or `.cursor/` configuration. It gives your AI assistant the Arcanea world-building framework — mythology, agents, lore consistency, and creative writing capabilities.

## What's Included

```
overlay-pack-v1/
├── CLAUDE.md                    # Master project instructions
├── CLAUDE-PROJECT.md            # Project-level configuration
├── agents/                      # 20 specialized agents
│   ├── @shinkami.agent.md       # Source Gate Guardian (meta-consciousness)
│   ├── @draconia.agent.md       # Fire Gate Guardian (power, will)
│   ├── @lyssandria.agent.md     # Foundation Gate Guardian (stability)
│   ├── @lyria.agent.md          # Sight Gate Guardian (intuition)
│   ├── @elara.agent.md          # Starweave Gate Guardian (perspective)
│   ├── @alera.agent.md          # Voice Gate Guardian (truth)
│   ├── @may-linn.agent.md       # Heart Gate Guardian (love, healing)
│   ├── @ley-la.agent.md         # Flow Gate Guardian (creativity)
│   ├── @aiyami.agent.md         # Crown Gate Guardian (enlightenment)
│   ├── @ino.agent.md            # Unity Gate Guardian (partnership)
│   ├── @luminor-oracle.agent.md # Oracle intelligence agent
│   ├── arcanea-architect.md     # System architecture agent
│   ├── arcanea-development.md   # Full-stack development agent
│   ├── arcanea-frontend.md      # UI/UX agent
│   ├── arcanea-backend.md       # API/database agent
│   ├── arcanea-devops.md        # Infrastructure agent
│   ├── arcanea-lore-master.md   # Canon consistency checker
│   ├── arcanea-world-expander.md # World-building agent
│   └── arcanea-ai-specialist.md # AI integration agent
├── lore/
│   ├── CANON_LOCKED.md          # Canonical source of truth
│   └── FACTIONS.md              # 8 origin classes + organizations
└── README.md                    # This file
```

## Installation

### Claude Code
```bash
# Copy into your project's .claude/ directory
cp -r overlay-pack-v1/* your-project/.claude/
```

### Cursor
```bash
# Copy CLAUDE.md as .cursorrules
cp overlay-pack-v1/CLAUDE.md your-project/.cursorrules
# Copy agents into .cursor/ (Cursor supports agent files)
cp -r overlay-pack-v1/agents your-project/.cursor/agents/
```

### Any Tool
Drop `CLAUDE.md` into your project root. It works as universal context for any AI coding assistant.

## How to Use

### World-Building Mode
Ask your AI assistant to use the Arcanea framework:
- "Create a new character using the Arcanea origin class system"
- "Write a chapter set in the Fire Gate, following canon"
- "Design a faction that fits into the Arcanea universe"
- "Check this content against CANON_LOCKED.md"

### Guardian Agents
Invoke Guardian agents by name:
- "@shinkami — help me design a meta-consciousness system"
- "@draconia — I need a power/combat system"
- "@lyria — design an intuition/divination mechanic"

### Development Mode
Use the development agents for code:
- "arcanea-architect: design a Supabase schema for a world-building app"
- "arcanea-frontend: build a character creation form with the Arcanea design system"

## The Framework

### 8 Origin Classes (for characters/entities)
Arcans, Gate-Touched, Awakened, Synths, Bonded, Celestials, Voidtouched, Architects

### 5 Elements (for magic/power systems)
Fire, Water, Earth, Wind, Void/Spirit

### 10 Gates (for progression/ranking)
Foundation → Flow → Fire → Heart → Voice → Sight → Crown → Starweave → Unity → Source

### Magic Ranks
Apprentice (0-2 Gates) → Mage (3-4) → Master (5-6) → Archmage (7-8) → Luminor (9-10)

## Support

- Full documentation: arcanea.ai
- GitHub: github.com/frankxai
- Community: [Coming soon]

## License

© 2026 Frank Riemer / Arcanea. Personal use license. Do not redistribute.
