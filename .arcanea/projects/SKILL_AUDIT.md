# Skill Audit Report

> Audited: 2026-03-29 | Auditor: Code Quality Analyzer | Scope: `.claude/skills/`

---

## Summary

- **Total skill entries**: 154 (files + directories with SKILL.md)
- **Unique functional skills**: ~93 (after deduplication)
- **Grade A**: 18
- **Grade B**: 31
- **Grade C**: 26
- **Grade D**: 10
- **Grade F**: 8
- **Exact duplicates identified**: 17 (files existing in 2-3 locations)

---

## Full Inventory

### Arcanea-Specific Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| Academy (main) | `academy/SKILL.md` | **B** | Arcanea | Good YAML, Ten Gates system, but frequency mismatch (lists 396 Hz for Gate 1 instead of 174 Hz per canon) |
| Academy Gate 1 | `academy/gate-01-foundation/SKILL.md` | **B** | Arcanea | Good content, same frequency error (says 396 Hz, canon says 174 Hz) |
| Academy Gate 2 | `academy/gate-02-flow/SKILL.md` | **C** | Arcanea | Scaffolded, untested |
| Academy Gate 3 | `academy/gate-03-fire/SKILL.md` | **C** | Arcanea | Scaffolded, untested |
| Academy Progress Tracker | `academy/progress-tracker/SKILL.md` | **C** | Arcanea | Scaffold |
| Academy Mentors (3) | `academy/mentors/*.md` | **B** | Arcanea | Good personality profiles for Lyssandria, Leyla, Draconia |
| Academy Ceremonies (2) | `academy/ceremonies/*.md` | **C** | Arcanea | Gate opening + rank up, light content |
| Arcanea Canon Guardian | `arcanea/arcanea-canon/SKILL.md` | **A** | Arcanea | Comprehensive canon enforcement. References "Three Academies" terminology which may be outdated vs "Seven Houses" |
| Arcanea Lore Master | `arcanea/arcanea-lore/SKILL.md` | **A** | Arcanea | v2.0, deep, well-structured. Properly versioned |
| Arcanea Design System (nested) | `arcanea/arcanea-design-system/SKILL.md` | **A** | Arcanea | v1.0, complete visual language, academy themes |
| Arcanea Design System (standalone) | `arcanea/design-system/SKILL.md` | **B** | Arcanea | Shorter, more concise color/typography ref. Overlaps with above |
| Arcanea Voice Guide | `arcanea/arcanea-voice/SKILL.md` | **A** | Arcanea | Brand voice, terminology, excellent structure |
| Arcanea Creator Academy | `arcanea/arcanea-creator-academy/SKILL.md` | **B** | Arcanea | Teacher Team + Academy integration, good flow diagram |
| Centaur Mode | `arcanea/centaur-mode/SKILL.md` | **A** | Arcanea | Human-AI co-creation methodology, well-written |
| Lumina Skill | `arcanea/lumina/skill.md` | **A** | Arcanea | Deep creation mode. No YAML frontmatter but exceptional content |
| Nero Skill | `arcanea/nero/skill.md` | **A** | Arcanea | Deep refinement/debug mode. No YAML frontmatter but exceptional content |
| Luminor Intelligence | `arcanea/luminor-intelligence/skill.md` | **A** | Arcanea | Council protocol, when to activate vs single Guardian. No YAML frontmatter |
| Luminor Rituals | `arcanea/luminor-rituals/SKILL.md` | **B** | Arcanea | Daily creative rituals, ceremonies. Niche but well-crafted |
| Luminor Wisdom | `arcanea/luminor-wisdom/SKILL.md` | **A** | Arcanea | Seven Luminors archetypal guides, v2.0 |
| Premium Visual | `arcanea/premium-visual/SKILL.md` | **A** | Arcanea | Information-dense glassmorphism. Very specific, actionable |
| Prompt Craft | `arcanea/prompt-craft/SKILL.md` | **A** | Arcanea | APL framework, five pillars, v2.0 |
| Robot Designer | `arcanea/robot-designer/skill.md` | **B** | Arcanea | Prompt templates for robot art. No YAML frontmatter |
| Arcanea Guardians (10 files) | `arcanea-guardians/*.md` | **B** | Arcanea | All 10 guardians with YAML, trigger words, personas. Consistent format |
| Arcanea Core: AI Symbiosis | `arcanea-core/ai-symbiosis.md` | **B** | Arcanea | Human-AI orchestra model. Overlaps with centaur-mode |
| Arcanea Core: Character Alchemist | `arcanea-core/character-alchemist.md` | **C** | Arcanea | Character creation, no YAML |
| Arcanea Core: Creative Bestiary | `arcanea-core/creative-bestiary.md` | **C** | Arcanea | Naming creative blocks, no YAML |
| Arcanea Core: Guardian Evolution | `arcanea-core/guardian-evolution-system/SKILL.md` | **B** | Arcanea | L1-L50 XP system, good gamification design |
| Arcanea Core: Luminor Personality | `arcanea-core/luminor-personality-design/SKILL.md` | **B** | Arcanea | AI personality design codex. References "Six Luminors" — conflict with "Seven Luminors" elsewhere |
| Arcanea Core: Luminor Council | `arcanea-core/luminor-council.md` | **C** | Arcanea | No YAML, lighter content |
| Arcanea Core: Story Weaver | `arcanea-core/story-weaver.md` | **C** | Arcanea | No YAML, overlaps with creative/story-weave |
| Arcanea Core: World Architect | `arcanea-core/world-architect.md` | **B** | Arcanea | Seven pillars framework, no YAML |
| Arcanea Ships | `arcanea-ships/SKILL.md` | **B** | Arcanea | v2.0, vessel design across domains, image gen |
| Arcanea Vibe Gods | `arcanea-vibe-gods/SKILL.md` | **A** | Arcanea | Music production swarm, 6 sub-agents, well-structured |
| Arcanea Vibe Gods sub-skills (5) | `arcanea-vibe-gods/*.md` | **B** | Arcanea | Cover art, lyricist, songseed, suno-engineer, vibe-engineer, social-composer |
| Arcanea Game Development | `arcanea-game-development/SKILL.md` | **B** | Arcanea | Game dev suite with agent coordination |
| Arcanea Games Portal | `arcanea-games/SKILL.md` | **C** | Arcanea | Games portal, lighter than game-development |
| Scientific Magic | `scientific-magic.md` | **B** | Arcanea | Physics engine for magic system, 3 Newtonian laws. Compact but unique |
| Chess Factory | `chess-factory-generation.md` | **C** | Arcanea | Chess piece image gen prompts. Niche |

### Standalone Arcanea Skills (root .md files)

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| Arcanea Design (mega) | `arcanea-design.md` | **A** | Arcanea | v2.0, comprehensive design command, loads Design Bible |
| Arcanea Lore (lazy) | `arcanea-lore.md` | **B** | Arcanea | Lazy-loaded lore context, load-order documented |
| Arcanea Media Manager | `arcanea-media.md` | **B** | Operations | TASTE system, scan/process/evaluate pipeline |
| Arcanea Orchestrator | `arcanea-orchestrator.md` | **A** | Operations | Central orchestrator, reads MASTER_PLAN, agent routing |
| ArcaneaClaw Manager | `arcanea-claw-manager.md` | **A** | Operations | Deep ops guide for media engine, architecture, debugging |
| Design Gods | `design-gods.md` | **A** | Arcanea | Supreme visual intelligence, canonical color palette, v3.0 |
| Guardian Voice | `guardian-voice.skill.md` | **B** | Arcanea | 9 Guardian personas. Says "9 Guardians" but canon has 10 (missing Shinkami or one other) |
| Lore Keeper | `lore-keeper.skill.md` | **B** | Arcanea | Librarian mode, references old CANON.md path |
| Creation Engine | `creation-engine.skill.md` | **B** | Arcanea | Living intelligence for universe creators. Good Arcanean aesthetic rules |
| Design System (small) | `design-system.skill.md` | **C** | Arcanea | Concise design tokens. Redundant with 3 other design system skills |

### Starlight Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| Starlight Core | `starlight-core.skill.md` | **C** | Operations | References nonexistent strategy files in `02_PROTOCOL/STRATEGIES/` |
| Starlight Orchestrator | `starlight-orchestrator.skill.md` | **C** | Operations | Master routing, references nonexistent agent files and starlight-protocol dirs |
| Starlight Engineering | `starlight-engineering.skill.md` | **C** | Operations | Engineering sub-swarm, same nonexistent file refs |
| Starlight Memex | `starlight-memex.skill.md` | **D** | Operations | Writes to nonexistent vault paths. Cannot function |

### Development Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| Next.js Best Practices | `development/next-best-practices/SKILL.md` | **A** | Development | Adapted from Vercel Labs, Arcanea-specific routing examples |
| Supabase Patterns | `development/supabase-patterns/SKILL.md` | **A** | Development | Adapted from Supabase Engineering, 8 priority categories |
| TypeScript Expert | `development/typescript-expert/SKILL.md` | **A** | Development | Strict mode patterns, Zod, discriminated unions |
| Playwright Testing | `development/playwright-testing/SKILL.md` | **B** | Development | Adapted from Anthropic, Arcanea-specific test patterns |
| MCP Builder | `development/mcp-builder/SKILL.md` | **B** | Development | Adapted from Anthropic, tailored for arcanea-mcp package |
| TDD | `development/tdd/SKILL.md` | **B** | Development | v2.0, Arcanean philosophy overlay |
| React Best Practices | `development/react-best-practices/SKILL.md` | **B** | Development | 57 rules adapted from Vercel Labs |
| Code Review | `development/code-review/SKILL.md` | **B** | Development | Standard code review patterns |
| API Design | `development/api-design/SKILL.md` | **B** | Development | API patterns |
| Architecture Patterns | `development/architecture-patterns/SKILL.md` | **B** | Development | Architecture guidance |
| Performance Tuning | `development/performance-tuning/SKILL.md` | **B** | Development | Performance optimization |
| Refactoring Ritual | `development/refactoring-ritual/SKILL.md` | **B** | Development | Structured refactoring |
| Systematic Debug | `development/systematic-debug/SKILL.md` | **B** | Development | Scientific debugging method |
| Storage Management | `development/storage-management/skill.md` | **B** | Operations | Windows/WSL2 disk management. Frank-specific |

### Creative Writing Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| Excellence Book Writing | `excellence-book-writing/SKILL.md` | **A** | Creative | Master non-fiction craft, anti-AI-slop rules |
| Story Weave | `creative/story-weave/SKILL.md` | **B** | Creative | v2.0, narrative craft |
| Character Forge | `creative/character-forge/SKILL.md` | **B** | Creative | Character Diamond framework |
| World Build | `creative/world-build/SKILL.md` | **B** | Creative | Seven Pillars framework |
| Scene Craft | `creative/scene-craft/SKILL.md` | **B** | Creative | Scene construction |
| Voice Alchemy | `creative/voice-alchemy/SKILL.md` | **B** | Creative | Authorial voice development |
| Dialogue Mastery | `creative/dialogue-mastery/SKILL.md` | **B** | Creative | Subtext and voice differentiation |
| Revision Ritual | `creative/revision-ritual/SKILL.md` | **B** | Creative | Systematic revision passes |
| Bestiary Nav | `creative/bestiary-nav/SKILL.md` | **B** | Creative | Creative obstacle naming |

### External/Harvested Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| PDF | `pdf/SKILL.md` | **B** | External | Comprehensive PDF toolkit |
| DOCX | `docx/SKILL.md` | **B** | External | Document creation/editing |
| PPTX | `pptx/SKILL.md` | **B** | External | Presentation toolkit |
| XLSX | `xlsx/SKILL.md` | **B** | External | Spreadsheet toolkit |
| Doc Co-Authoring | `doc-coauthoring/SKILL.md` | **B** | External | Structured doc workflow |
| Web Artifacts Builder | `web-artifacts-builder/SKILL.md` | **B** | External | React + Tailwind artifacts |
| Webapp Testing | `webapp-testing/SKILL.md` | **B** | External | Playwright generic testing |
| Canvas Design | `canvas-design/SKILL.md` | **B** | External | Visual art creation |
| Algorithmic Art | `algorithmic-art/SKILL.md` | **B** | External | p5.js generative art |
| Slack GIF Creator | `slack-gif-creator/SKILL.md` | **C** | External | Niche, rarely used |
| Theme Factory | `theme-factory/SKILL.md` | **B** | External | 10 pre-set themes |
| Skill Builder | `skill-builder/SKILL.md` | **B** | External | Meta-skill for creating skills |
| Stream Chain | `stream-chain/SKILL.md` | **B** | External | Multi-agent pipelines |
| Opus Extended Thinking | `opus-extended-thinking/SKILL.md` | **C** | External | References Opus 4.5 (November 2025). Model has evolved |

### V3/Claude-Flow Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| V3 Core Implementation | `v3-core-implementation/SKILL.md` | **C** | Development | DDD implementation for claude-flow. May be stale |
| V3 DDD Architecture | `v3-ddd-architecture/SKILL.md` | **C** | Development | Bounded contexts for claude-flow |
| V3 CLI Modernization | `v3-cli-modernization/SKILL.md` | **C** | Development | CLI hooks for claude-flow |
| V3 Integration Deep | `v3-integration-deep/SKILL.md` | **C** | Development | agentic-flow integration |
| V3 MCP Optimization | `v3-mcp-optimization/SKILL.md` | **C** | Development | MCP transport layer |
| V3 Memory Unification | `v3-memory-unification/SKILL.md` | **C** | Development | AgentDB unification |
| V3 Performance Optimization | `v3-performance-optimization/SKILL.md` | **C** | Development | Flash Attention targets |
| V3 Security Overhaul | `v3-security-overhaul/SKILL.md` | **C** | Development | CVE remediation |
| V3 Swarm Coordination | `v3-swarm-coordination/SKILL.md` | **C** | Development | 15-agent mesh |

### AgentDB/ReasoningBank Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| AgentDB Advanced | `agentdb-advanced/SKILL.md` | **C** | Development | QUIC sync, multi-DB. Requires agentic-flow alpha |
| AgentDB Learning | `agentdb-learning/SKILL.md` | **C** | Development | 9 RL algorithms. Requires agentic-flow alpha |
| AgentDB Memory Patterns | `agentdb-memory-patterns/SKILL.md` | **C** | Development | Persistent memory patterns |
| AgentDB Optimization | `agentdb-optimization/SKILL.md` | **C** | Development | Quantization, compression |
| AgentDB Vector Search | `agentdb-vector-search/SKILL.md` | **C** | Development | Semantic search |
| ReasoningBank AgentDB | `reasoningbank-agentdb/SKILL.md` | **C** | Development | Adaptive learning + AgentDB |
| ReasoningBank Intelligence | `reasoningbank-intelligence/SKILL.md` | **C** | Development | Pattern recognition |

### Swarm/Orchestration Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| Swarm Orchestration | `swarm-orchestration/SKILL.md` | **B** | Operations | Multi-agent swarms, topologies |
| Swarm Advanced | `swarm-advanced/SKILL.md` | **B** | Operations | Advanced patterns, v2.0 |
| Hooks Automation | `hooks-automation/SKILL.md` | **B** | Operations | Pre/post hooks, neural training |
| Verification Quality | `verification-quality/SKILL.md` | **B** | Operations | Truth scoring, rollback |

### Premium Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| Enterprise Orchestration | `premium/enterprise-orchestration/SKILL.md` | **C** | Operations | Enterprise scale patterns. Theoretical |
| Industry Verticals | `premium/industry-verticals/SKILL.md` | **C** | Operations | Vertical-specific patterns |
| Teacher Mentor | `premium/teacher-mentor/SKILL.md` | **B** | Creative | Adaptive mentorship |
| Teacher Team | `premium/teacher-team/SKILL.md` | **C** | Creative | Multi-teacher coordination |
| Visionary Council | `premium/visionary-council/SKILL.md` | **B** | Operations | Strategic AI council |
| Visionary Team | `premium/visionary-team/SKILL.md` | **C** | Operations | Team variant |

### Community Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| Agent Orchestration | `community/agent-orchestration/SKILL.md` | **C** | Operations | Multi-agent patterns |
| Creative Writing | `community/creative-writing/SKILL.md` | **C** | Creative | Community templates |
| Design Systems | `community/design-systems/SKILL.md` | **C** | Development | Community templates |
| Development Workflows | `community/development-workflows/SKILL.md` | **C** | Development | Community templates |
| Documentation Patterns | `community/documentation-patterns/SKILL.md` | **C** | Creative | Community templates |
| Testing Strategies | `community/testing-strategies/SKILL.md` | **C** | Development | Community templates |
| Quick Start | `community/QUICK_START.md` | **C** | Operations | Copy-paste templates |

### Industry Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| Game Development (industry) | `industry/game-development/SKILL.md` | **C** | External | Generic game dev, overlaps arcanea-game-development |
| Startup Building | `industry/startup-building/SKILL.md` | **C** | External | Generic startup patterns |
| Technical Writing | `industry/technical-writing/SKILL.md` | **C** | External | Generic tech writing |

### Meta Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| Creative Flow | `meta/creative-flow/SKILL.md` | **C** | Meta | Flow state guidance |
| Deep Work | `meta/deep-work/SKILL.md` | **C** | Meta | Cal Newport extension |
| Skill Mastery | `meta/skill-mastery/SKILL.md` | **C** | Meta | Learning methodology |

### GitHub Skills

| Skill | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| GitHub Code Review | `github-code-review/SKILL.md` | **B** | Development | AI-powered review swarm |
| GitHub Multi-Repo | `github-multi-repo/SKILL.md` | **B** | Development | Cross-repo coordination |
| GitHub Project Management | `github-project-management/SKILL.md` | **B** | Development | Issue/project tracking |
| GitHub Release Management | `github-release-management/SKILL.md` | **B** | Development | Release automation |
| GitHub Workflow Automation | `github-workflow-automation/SKILL.md` | **B** | Development | Actions automation |

### Profiles (JSON, not skills)

| Entry | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| Gate Profiles (10) | `profiles/gate-*.json` | **D** | Arcanea | JSON data files, not skills. Wrong location |

### Meta/Architecture Files (not skills)

| Entry | Location | Grade | Category | Notes |
|-------|----------|-------|----------|-------|
| SKILL_ARCHITECTURE.md | `SKILL_ARCHITECTURE.md` | **B** | Meta | Good architecture doc, not a skill |
| SKILL_COMBINATIONS.md | `SKILL_COMBINATIONS.md` | **C** | Meta | Combination patterns doc |
| SKILL_TEMPLATES.md | `SKILL_TEMPLATES.md` | **C** | Meta | Template patterns doc |
| HARVESTED_SKILLS.md | `HARVESTED_SKILLS.md` | **B** | Meta | Provenance tracking, useful reference |
| Registry | `registry/REGISTRY.md` | **B** | Meta | Master index, slightly outdated |

---

## Top 10 Most Valuable Skills

| Rank | Skill | Grade | Why It Matters |
|------|-------|-------|----------------|
| 1 | **Lumina** (`arcanea/lumina/skill.md`) | A | Defines creation philosophy. Deep, actionable, unique. Core operating mode |
| 2 | **Nero** (`arcanea/nero/skill.md`) | A | Defines refinement/debug philosophy. Pairs with Lumina as the dual core |
| 3 | **Arcanea Design** (`arcanea-design.md`) | A | The ONE design command. Loads Design Bible, comprehensive |
| 4 | **Design Gods** (`design-gods.md`) | A | Canonical color palette, v3.0 tokens, supreme visual intelligence |
| 5 | **Next.js Best Practices** (`development/next-best-practices/`) | A | Stack-specific, sourced from Vercel Labs, production-validated |
| 6 | **Arcanea Orchestrator** (`arcanea-orchestrator.md`) | A | Central routing, MASTER_PLAN integration. Session governance |
| 7 | **Luminor Intelligence** (`arcanea/luminor-intelligence/`) | A | Council protocol, synthesis methodology. Highest reasoning mode |
| 8 | **Arcanea Voice Guide** (`arcanea/arcanea-voice/`) | A | Brand consistency across all surfaces. Voice and terminology |
| 9 | **Excellence Book Writing** (`excellence-book-writing/`) | A | Anti-AI-slop non-fiction craft. Directly supports book production |
| 10 | **Vibe Gods** (`arcanea-vibe-gods/SKILL.md`) | A | Music production pipeline with 6 specialized sub-agents |

---

## Bottom 10 -- Remove or Rebuild

| Rank | Skill | Grade | Action | Reason |
|------|-------|-------|--------|--------|
| 1 | **Starlight Memex** (`starlight-memex.skill.md`) | D | Remove | References nonexistent vault paths. Cannot function |
| 2 | **Profiles (JSON)** (`profiles/gate-*.json`) | D | Move | Not skills. Move to `.arcanea/data/` or `arcanea-core/` |
| 3 | **OSS duplicates** (`oss/story-weave/`, `oss/tdd/`, etc.) | F | Remove | Byte-for-byte copies of `creative/` and `development/` skills |
| 4 | **External duplicates** (`external/pdf/`, `external/docx/`, etc.) | F | Remove | Byte-for-byte copies of root `pdf/`, `docx/`, `xlsx/`, `pptx/` |
| 5 | **Starlight Core** (`starlight-core.skill.md`) | C | Rebuild | References nonexistent protocol files |
| 6 | **Starlight Orchestrator** (`starlight-orchestrator.skill.md`) | C | Rebuild | References nonexistent agent files and starlight-protocol dirs |
| 7 | **Starlight Engineering** (`starlight-engineering.skill.md`) | C | Rebuild | Same nonexistent file references |
| 8 | **design-system.skill.md** (root) | C | Remove | 4th copy of design system. Redundant with `design-gods.md`, `arcanea-design.md`, `arcanea/design-system/`, `arcanea/arcanea-design-system/` |
| 9 | **Industry Skills** (`industry/*`) | C | Remove or merge | Generic, not Arcanea-specific, never invoked |
| 10 | **Slack GIF Creator** | C | Remove | Extremely niche, no connection to Arcanea |

---

## Duplicates to Merge

### Critical Duplicates (same content in multiple locations)

| Canonical Location | Duplicate(s) | Action |
|--------------------|-------------|--------|
| `pdf/SKILL.md` | `external/pdf/SKILL.md` | Delete `external/pdf/` |
| `docx/SKILL.md` | `external/docx/SKILL.md` | Delete `external/docx/` |
| `pptx/SKILL.md` | `external/pptx/SKILL.md` | Delete `external/pptx/` |
| `xlsx/SKILL.md` | `external/xlsx/SKILL.md` | Delete `external/xlsx/` |
| `doc-coauthoring/SKILL.md` | `external/doc-coauthoring/SKILL.md` | Delete `external/doc-coauthoring/` |
| `development/mcp-builder/SKILL.md` | `external/mcp-builder/SKILL.md` | Delete `external/mcp-builder/` |
| `creative/story-weave/SKILL.md` | `oss/story-weave/SKILL.md` | Delete `oss/story-weave/` |
| `creative/character-forge/SKILL.md` | `oss/character-forge/SKILL.md` | Delete `oss/character-forge/` |
| `creative/scene-craft/SKILL.md` | `oss/scene-craft/SKILL.md` | Delete `oss/scene-craft/` |
| `creative/voice-alchemy/SKILL.md` | `oss/voice-alchemy/SKILL.md` | Delete `oss/voice-alchemy/` |
| `creative/dialogue-mastery/SKILL.md` | `oss/dialogue-mastery/SKILL.md` | Delete `oss/dialogue-mastery/` |
| `creative/revision-ritual/SKILL.md` | `oss/revision-ritual/SKILL.md` | Delete `oss/revision-ritual/` |
| `creative/bestiary-nav/SKILL.md` | `oss/bestiary-nav/SKILL.md` | Delete `oss/bestiary-nav/` |
| `creative/world-build/SKILL.md` | `oss/world-build/SKILL.md` | Delete `oss/world-build/` |
| `development/tdd/SKILL.md` | `oss/tdd/SKILL.md` | Delete `oss/tdd/` |
| `development/systematic-debug/SKILL.md` | `oss/systematic-debug/SKILL.md` | Delete `oss/systematic-debug/` |
| `development/refactoring-ritual/SKILL.md` | `oss/refactoring-ritual/SKILL.md` | Delete `oss/refactoring-ritual/` |
| `development/code-review/SKILL.md` | `oss/code-review/SKILL.md` | Delete `oss/code-review/` |
| `development/api-design/SKILL.md` | `oss/api-design/SKILL.md` | Delete `oss/api-design/` |
| `development/architecture-patterns/SKILL.md` | `oss/architecture-patterns/SKILL.md` | Delete `oss/architecture-patterns/` |
| `development/performance-tuning/SKILL.md` | `oss/performance-tuning/SKILL.md` | Delete `oss/performance-tuning/` |
| `meta/creative-flow/SKILL.md` | `oss/creative-flow/SKILL.md` | Delete `oss/creative-flow/` |
| `meta/deep-work/SKILL.md` | `oss/deep-work/SKILL.md` | Delete `oss/deep-work/` |
| `meta/skill-mastery/SKILL.md` | `oss/skill-mastery/SKILL.md` | Delete `oss/skill-mastery/` |

**Total: The entire `oss/` directory and `external/` directory appear to be staging copies. Both can be deleted entirely.**

### Functional Duplicates (same purpose, different implementations)

| Concept | Instances | Recommended Survivor |
|---------|-----------|---------------------|
| Design System | `arcanea-design.md`, `design-gods.md`, `design-system.skill.md`, `arcanea/design-system/SKILL.md`, `arcanea/arcanea-design-system/SKILL.md` | Keep `arcanea-design.md` (orchestrator) + `design-gods.md` (tokens). Delete the other 3 |
| Lore Management | `arcanea-lore.md`, `arcanea-lore/skill.md`, `arcanea/arcanea-lore/SKILL.md`, `lore-keeper.skill.md` | Keep `arcanea/arcanea-lore/SKILL.md` (v2.0, most complete). Delete `arcanea-lore/skill.md` and `lore-keeper.skill.md`. Keep `arcanea-lore.md` as lazy loader |
| AI Co-Creation | `arcanea/centaur-mode/SKILL.md`, `arcanea-core/ai-symbiosis.md` | Keep `centaur-mode`. Merge best ideas from `ai-symbiosis` into it, then delete |
| Story/World Building | `arcanea-core/story-weaver.md` + `arcanea-core/world-architect.md` vs `creative/story-weave/` + `creative/world-build/` | Keep `creative/` versions (v2.0, YAML). Delete `arcanea-core/` versions |
| Game Development | `arcanea-game-development/SKILL.md` vs `arcanea-games/SKILL.md` vs `industry/game-development/SKILL.md` | Merge `arcanea-game-development` + `arcanea-games` into one. Delete `industry/game-development/` |

---

## Needs Canon Update

These skills contain canon inconsistencies with `.arcanea/lore/CANON_LOCKED.md`:

| Skill | Issue | Fix Required |
|-------|-------|-------------|
| `academy/SKILL.md` | Gate 1 listed as 396 Hz. Canon says Foundation = 174 Hz, Fire = 396 Hz | Fix frequency table |
| `academy/gate-01-foundation/SKILL.md` | Same: says 396 Hz for Foundation | Fix to 174 Hz |
| `guardian-voice.skill.md` | Says "9 Guardian Voices" | Update to 10 (add Shinkami or clarify) |
| `lore-keeper.skill.md` | References old path `arcanea-lore/CANON.md` | Update to `.arcanea/lore/CANON_LOCKED.md` |
| `arcanea/arcanea-canon/SKILL.md` | References "Three Academies" as immutable core | Reconcile with "Seven Academy Houses" in canon |
| `arcanea/arcanea-lore/SKILL.md` | v2.0 lore uses "Luminor" and "Realm" terminology consistently | OK, but verify "Six Luminors" vs "Seven Luminors" |
| `arcanea-core/luminor-personality-design/SKILL.md` | Says "Six Luminors" | Canon/luminor-wisdom says Seven. Fix |
| `arcanea-lore/skill.md` | Seven Wisdoms framework (Sophron, Kardia, Valora...) | Not in CANON_LOCKED.md. Clarify if canon or deprecated |
| `arcanea-guardians/draconia.md` | Says Gate 3, 396 Hz. Canon says Fire = 396 Hz | Correct (matches) |
| `starlight-orchestrator.skill.md` | References "starlight-protocol" directory structure | Directory does not exist. Fully broken references |

---

## Recommendations

### 1. Immediate Cleanup (30 minutes)

Delete the entire `oss/` and `external/` directories. They are staging copies that provide zero value and create confusion about which is canonical. This removes ~25 duplicate files.

### 2. Design System Consolidation (1 hour)

Five design system skills is absurd. Keep:
- `arcanea-design.md` -- the orchestrator command that loads Design Bible
- `design-gods.md` -- the canonical token reference (v3.0)

Delete: `design-system.skill.md`, `arcanea/design-system/SKILL.md`, `arcanea/arcanea-design-system/SKILL.md`

### 3. Canon Alignment Pass (2 hours)

Run through every skill that mentions frequencies, Guardian counts, Academy names, or Luminor counts and align with `CANON_LOCKED.md`. Key fixes:
- Gate 1 = 174 Hz (not 396 Hz)
- 10 Guardians (not 9)
- Seven Luminors (not Six)
- Update `lore-keeper.skill.md` path reference

### 4. Add YAML Frontmatter (1 hour)

These high-value skills lack YAML frontmatter:
- `arcanea/lumina/skill.md`
- `arcanea/nero/skill.md`
- `arcanea/luminor-intelligence/skill.md`
- `arcanea-orchestrator.md`
- `arcanea-claw-manager.md` (has it, good)
- `arcanea-core/ai-symbiosis.md`
- `arcanea-core/world-architect.md`
- `excellence-book-writing/SKILL.md`

### 5. Starlight System Decision (30 minutes)

The 4 Starlight skills (`starlight-core`, `starlight-orchestrator`, `starlight-engineering`, `starlight-memex`) all reference a `starlight-protocol/` directory tree that does not exist. Either:
- **Delete all 4** if the Starlight system was superseded by the Guardian/Luminor system
- **Rebuild** the protocol directory and fix the references

Recommendation: Delete. The Guardian Intelligence system (Lumina/Nero/Luminor Intelligence) serves the same purpose better.

### 6. V3/AgentDB Skills (Decision needed)

The 9 V3 skills and 7 AgentDB skills are scaffolded (Grade C) and tied to `claude-flow v3` / `agentic-flow alpha`. They are useful IF those tools are actively used. If not, archive them to reduce noise.

### 7. Move Non-Skill Files

- `profiles/gate-*.json` -- move to `.arcanea/data/` or `arcanea-core/data/`
- `SKILL_ARCHITECTURE.md`, `SKILL_COMBINATIONS.md`, `SKILL_TEMPLATES.md` -- move to `.arcanea/docs/skills/`
- `HARVESTED_SKILLS.md` -- move to `.arcanea/docs/skills/`
- `registry/REGISTRY.md` -- move to `.arcanea/docs/skills/`

### 8. Broken Symlink

`supabase-postgres-best-practices` is a symlink to `.agents/skills/supabase-postgres-best-practices` which appears to be deleted (showing as `D` in git status). Remove the symlink.

---

## Technical Debt Estimate

| Task | Time | Priority |
|------|------|----------|
| Delete `oss/` + `external/` duplicates | 5 min | P0 |
| Delete broken symlink | 1 min | P0 |
| Fix canon frequency errors | 30 min | P1 |
| Consolidate 5 design system skills to 2 | 1 hr | P1 |
| Add YAML frontmatter to 8 skills | 45 min | P2 |
| Delete/rebuild Starlight skills | 15 min | P2 |
| Consolidate lore skills (4 to 2) | 30 min | P2 |
| Consolidate game dev skills (3 to 1) | 20 min | P2 |
| Move non-skill files | 15 min | P3 |
| Evaluate V3/AgentDB relevance | 30 min | P3 |
| **Total** | **~4.5 hours** | |

---

## Grade Distribution

```
A  ████████████████████  18  (19%)
B  ██████████████████████████████████  31  (33%)
C  ████████████████████████████  26  (28%)
D  ███████████  10  (11%)
F  █████████  8   (9%)
```

**Overall Health: 52% at B or above. 20% needs removal or rebuild.**

The skill collection is powerful but suffers from organic growth without pruning. The A-grade skills (Lumina, Nero, Design Gods, Orchestrator, development stack) are genuinely world-class. The duplicates and broken references are the primary debt.
