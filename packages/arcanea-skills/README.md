# @arcanea/skills

> 97 Claude Code skills for creative intelligence — worldbuilding, coding, writing, design, and more.

This package bundles the **top 20 A-grade skills** from the Arcanea ecosystem, ready to install into Claude Code with a single command.

## Install

```bash
# One-shot install (no global install needed)
npx @arcanea/skills

# Or install globally
npm install -g @arcanea/skills
arcanea-skills
```

Skills are copied to `~/.claude/skills/` where Claude Code picks them up automatically.

## What's Included

### Creative Writing (7 skills)

| Skill | Description |
|-------|-------------|
| **story-weave** | Narrative structure, plot arcs, and story architecture |
| **character-forge** | Deep character creation with psychology and arcs |
| **world-build** | Complete world construction — geography, culture, magic systems |
| **scene-craft** | Scene-level writing with pacing, tension, and beats |
| **dialogue-mastery** | Authentic dialogue with subtext and voice differentiation |
| **voice-alchemy** | Distinctive narrative voice and prose style development |
| **bestiary-nav** | Creative creature design and mythological taxonomy |

### Software Development (7 skills)

| Skill | Description |
|-------|-------------|
| **code-review** | Structured code review with security and quality focus |
| **tdd** | Test-driven development with London School mocking |
| **systematic-debug** | Root-cause analysis and systematic debugging methodology |
| **api-design** | RESTful and GraphQL API design patterns |
| **architecture-patterns** | System architecture, DDD, and design patterns |
| **refactoring-ritual** | Safe refactoring with incremental transformation |
| **performance-tuning** | Performance profiling, optimization, and benchmarking |

### Arcanea Framework (6 skills)

| Skill | Description |
|-------|-------------|
| **centaur-mode** | Human-AI collaborative workflow orchestration |
| **prompt-craft** | Advanced prompt engineering and chain-of-thought design |
| **luminor-wisdom** | Arcanea's council of AI advisors for strategic guidance |
| **arcanea-creator-academy** | Complete creator onboarding through the Ten Gates |
| **deep-work** | Focus protocols and deep concentration techniques |
| **creative-flow** | Creative state management and inspiration systems |

## Usage

### CLI

```bash
# List all bundled skills
arcanea-skills --list

# Preview what would be installed
arcanea-skills --dry-run

# Install to ~/.claude/skills/
arcanea-skills
```

### Programmatic

```javascript
const skills = require('@arcanea/skills');

// Get all skill names
console.log(skills.skills);
// => ['story-weave', 'character-forge', 'world-build', ...]

// Get skills by category
const devSkills = skills.getByCategory('development');
// => ['code-review', 'tdd', 'systematic-debug', ...]

// Get path to a specific skill
const storyPath = skills.getSkillPath('story-weave');
```

## The Arcanea Ecosystem

This package is part of the [Arcanea](https://arcanea.ai) creative multiverse — a living ecosystem where creators chat with AI, build fantasy worlds, share what they make, and turn imagination into products.

The full ecosystem includes 97 skills across categories:

- Creative Writing and Worldbuilding
- Software Development and Architecture
- AI Agent Design and Orchestration
- Visual Design and Brand Systems
- Game Development and Interactive Fiction
- Community and Collaboration

### Related Packages

- [`@arcanea/soul`](https://www.npmjs.com/package/@arcanea/soul) — Core identity and lore engine
- [`@arcanea/mcp`](https://www.npmjs.com/package/@arcanea/mcp) — MCP server for worldbuilding tools
- [`claude-arcanea`](https://www.npmjs.com/package/claude-arcanea) — Claude Code overlay with Arcanea integration

## License

MIT
