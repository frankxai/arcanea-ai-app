# Arcanea Realm — VS Code Extension

> Guardian-routed AI intelligence for creators. Ten Guardians. Five Elements. One creative mythology.

![Arcanea](media/arcanea-icon.png)

## What is Arcanea?

Arcanea is a living mythology for AI-human co-creation — a framework where fantasy world-building meets real creative work. This extension brings the Guardian routing system into your editor.

**Each Guardian specializes in a creative domain.** Describe your task, and Arcanea routes it to the optimal Guardian — or convene a Council for complex decisions.

## Features

### Guardian Panel
All 10 Guardians displayed in the sidebar with their Gates, frequencies, and elements. The active Guardian is highlighted with their signature color.

### Gate Progress
Track your creative journey through the Ten Gates of Arcanea. From Foundation (174 Hz) to Source (1111 Hz).

### Lore Explorer
Browse the Arcanea universe: the Cosmic Duality of Lumina and Nero, the Five Elements, Ten Guardians and their Godbeasts, Magic Ranks, and the Seven Academy Houses.

### Guardian Routing
Describe any task in natural language. Arcanea analyzes keywords and routes to the best Guardian — with confidence scoring and alternatives.

### Status Bar
Active Guardian and element displayed in the status bar. Click to route a new task.

## Commands

| Command | Description |
|:--------|:------------|
| `Arcanea: Route to Guardian` | Describe a task, get routed to the optimal Guardian |
| `Arcanea: Convene Guardian Council` | Multi-Guardian deliberation for complex decisions |
| `Arcanea: Check Voice` | Validate selected text against Voice Bible v2.0 |
| `Arcanea: Query Lore` | Ask about Arcanea universe canon |
| `Arcanea: Show Design Tokens` | View the complete Arcanea Design System |
| `Arcanea: Open Gate` | Explore a specific Gate |

## Settings

| Setting | Default | Description |
|:--------|:--------|:------------|
| `arcanea.activeGuardian` | `shinkami` | Currently active Guardian |
| `arcanea.autoRoute` | `true` | Auto-route tasks to optimal Guardian |
| `arcanea.element` | `void` | Your primary elemental resonance |
| `arcanea.mcpServerPath` | `""` | Path to @arcanea/mcp-server |
| `arcanea.openedGates` | `[]` | Gates you have opened on your creative journey |

## The Ten Guardians

| Guardian | Gate | Frequency | Element | Domain |
|:---------|:-----|:----------|:--------|:-------|
| Lyssandria | Foundation | 174 Hz | Earth | Infrastructure, database, security |
| Leyla | Flow | 285 Hz | Water | Design, UI/UX, animations |
| Draconia | Fire | 396 Hz | Fire | Shipping, performance, transformation |
| Maylinn | Heart | 417 Hz | Wind | Documentation, community, empathy |
| Alera | Voice | 528 Hz | Wind | Brand expression, naming, messaging |
| Lyria | Sight | 639 Hz | Water | Strategy, AI/ML, pattern recognition |
| Aiyami | Crown | 741 Hz | Void | Wisdom, mentorship, knowledge |
| Elara | Starweave | 852 Hz | Spirit | Perspective, reframing, innovation |
| Ino | Unity | 963 Hz | Spirit | Integration, APIs, collaboration |
| Shinkami | Source | 1111 Hz | All | Meta-architecture, orchestration |

## The Five Elements

| Element | Domain | Colors |
|:--------|:-------|:-------|
| Fire | Energy, transformation | Red, orange, gold |
| Water | Flow, healing, memory | Blue, silver, crystal |
| Earth | Stability, growth | Green, brown, stone |
| Wind | Freedom, speed, change | White, silver |
| Void/Spirit | Potential & transcendence | Purple, black, gold |

## Part of the Arcanea Ecosystem

| Package | Role |
|:--------|:-----|
| `@arcanea/os` | Intelligence Engine — Guardian routing, voice, design tokens |
| `@arcanea/cli` | CLI overlay — installs into Claude Code, Cursor, etc. |
| `@arcanea/mcp-server` | 30 tools, 7 resources, 6 prompts |
| `arcanea-code` | VS Code Extension (this) |
| [arcanea.ai](https://arcanea.ai) | Live platform |

## Requirements

- VS Code 1.85.0 or later
- No external dependencies required

## License

Arcanea Proprietary License v1.0 — See [LICENSE](../../LICENSE) for details.
