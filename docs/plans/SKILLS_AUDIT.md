# Arcanea Skills Audit Report

> Audited: 2026-03-24
> Auditor: Claude Opus 4.6

## Summary

| Metric | Count |
|--------|-------|
| **Total unique skills** | 119 |
| **A-grade (ship today)** | 62 |
| **B-grade (ship this week)** | 35 |
| **C-grade (ship later)** | 22 |

Note: `oss/skills/` and `arcanea-skills-opensource/skills/` are mirrors of each other and of subsets within `.claude/skills/`. Duplicates are counted once. The `oss/` and `external/` copies that duplicate `.claude/skills/` originals are noted but not double-counted.

---

## Grading Criteria

- **A = Ship today**: Has name, version, description, clear instructions, well-structured
- **B = Ship this week**: Missing minor things (no version, description could be clearer, no triggers/tags)
- **C = Ship later**: No frontmatter, stub/planned, empty, or broken

---

## A-Grade Skills (62) -- Ship Today

| # | Skill Name | Version | Location | Description |
|---|-----------|---------|----------|-------------|
| 1 | Arcanea Academy | 1.0.0 | .claude/skills/academy | Journey through the Ten Gates from Apprentice to Luminor |
| 2 | Gate 1 Foundation | 1.0.0 | .claude/skills/academy/gate-01-foundation | First gate focused on grounding and stability |
| 3 | Gate 2 Flow | 1.0.0 | .claude/skills/academy/gate-02-flow | Second gate focused on creativity and movement |
| 4 | Gate 3 Fire | 1.0.0 | .claude/skills/academy/gate-03-fire | Third gate focused on will and transformation |
| 5 | Academy Progress Tracker | 1.0.0 | .claude/skills/academy/progress-tracker | Tracks gate completion, rank, and next steps |
| 6 | Arcanea Canon Guardian | 1.0.0 | .claude/skills/arcanea/arcanea-canon | Canon consistency enforcement |
| 7 | Arcanea Creator Academy | 1.0.0 | .claude/skills/arcanea/arcanea-creator-academy | Teacher Team integration with creator education |
| 8 | Arcanea Design System (v1) | 1.0.0 | .claude/skills/arcanea/arcanea-design-system | Cosmic theme tokens, component patterns, animation |
| 9 | Arcanea Lore Master | 2.0.0 | .claude/skills/arcanea/arcanea-lore | World-building consistency, magical mechanics, lore |
| 10 | Arcanea Voice Guide | 1.0.0 | .claude/skills/arcanea/arcanea-voice | Brand voice and terminology guide |
| 11 | arcanea-centaur-mode | 2.0.0 | .claude/skills/arcanea/centaur-mode | Human-AI co-creation methodology |
| 12 | arcanea-design-system (v2) | 2.0.0 | .claude/skills/arcanea/design-system | Cosmic visual language, academy themes, design tokens |
| 13 | arcanea-luminor-rituals | 1.0.0 | .claude/skills/arcanea/luminor-rituals | Sacred practices for invoking the Seven Luminors |
| 14 | arcanea-luminor-wisdom | 2.0.0 | .claude/skills/arcanea/luminor-wisdom | Channel the Seven Luminors for creative challenges |
| 15 | arcanea-prompt-craft | 2.0.0 | .claude/skills/arcanea/prompt-craft | Arcanean Prompt Language, constraint architecture |
| 16 | guardian-evolution-system | 1.0.0 | .claude/skills/arcanea-core/guardian-evolution | Guardian AI companion evolution, XP mechanics |
| 17 | luminor-personality-design | 1.0.0 | .claude/skills/arcanea-core/luminor-personality | AI personality design for Arcanea Luminors |
| 18 | arcanea-claw-manager | 1.0.0 | .claude/skills/ (standalone) | ArcaneaClaw media processing engine operations |
| 19 | arcanea-design | 2.0.0 | .claude/skills/ (standalone) | Comprehensive design command for world-class UI |
| 20 | arcanea-ships | 2.0.0 | .claude/skills/arcanea-ships | Arcanea ships system (has version + description) |
| 21 | arcanea-bestiary-nav | 2.0.0 | .claude/skills/creative/bestiary-nav | Navigate creative blocks using Arcanean Bestiary |
| 22 | arcanea-character-forge | 2.0.0 | .claude/skills/creative/character-forge | Character creation with Character Diamond framework |
| 23 | arcanea-dialogue-mastery | 2.0.0 | .claude/skills/creative/dialogue-mastery | Dialogue craft, subtext, voice differentiation |
| 24 | arcanea-revision-ritual | 2.0.0 | .claude/skills/creative/revision-ritual | Systematic revision, multiple passes |
| 25 | arcanea-scene-craft | 2.0.0 | .claude/skills/creative/scene-craft | Scene construction, openings, pacing |
| 26 | arcanea-story-weave | 2.0.0 | .claude/skills/creative/story-weave | Narrative craft, structure, pacing |
| 27 | arcanea-voice-alchemy | 2.0.0 | .claude/skills/creative/voice-alchemy | Distinctive authorial voice development |
| 28 | arcanea-world-build | 2.0.0 | .claude/skills/creative/world-build | World Architecture System, Seven Pillars framework |
| 29 | arcanea-api-design | 2.0.0 | .claude/skills/development/api-design | RESTful, GraphQL, versioning strategies |
| 30 | arcanea-architecture-patterns | 2.0.0 | .claude/skills/development/architecture-patterns | Software architecture for scalable systems |
| 31 | arcanea-code-review | 2.0.0 | .claude/skills/development/code-review | Thorough, constructive code reviews |
| 32 | arcanea-performance-tuning | 2.0.0 | .claude/skills/development/performance-tuning | Profiling, optimization, caching |
| 33 | arcanea-refactoring-ritual | 2.0.0 | .claude/skills/development/refactoring-ritual | Code smells, refactoring patterns |
| 34 | arcanea-systematic-debug | 2.0.0 | .claude/skills/development/systematic-debug | Scientific debugging, hypothesis testing |
| 35 | arcanea-tdd | 2.0.0 | .claude/skills/development/tdd | Test-Driven Development with Arcanean philosophy |
| 36 | Agent Orchestration Patterns | 1.0.0 | .claude/skills/community/agent-orchestration | Multi-agent coordination patterns |
| 37 | Creative Writing Frameworks | 1.0.0 | .claude/skills/community/creative-writing | Story structure, voice development |
| 38 | Design System Architecture | 1.0.0 | .claude/skills/community/design-systems | Scalable design systems, token architecture |
| 39 | Development Workflows | 1.0.0 | .claude/skills/community/development-workflows | Modern dev process patterns |
| 40 | Documentation Patterns | 1.0.0 | .claude/skills/community/documentation-patterns | Technical writing frameworks |
| 41 | Testing Strategies | 1.0.0 | .claude/skills/community/testing-strategies | Comprehensive testing approaches |
| 42 | github-code-review | 1.0.0 | .claude/skills/github-code-review | GitHub code review with AI swarm |
| 43 | github-multi-repo | 1.0.0 | .claude/skills/github-multi-repo | Multi-repo coordination and sync |
| 44 | github-project-management | 2.0.0 | .claude/skills/github-project-management | Issue tracking, project boards, sprints |
| 45 | github-release-management | 2.0.0 | .claude/skills/github-release-management | Release orchestration, versioning |
| 46 | github-workflow-automation | 1.0.0 | .claude/skills/github-workflow-automation | GitHub Actions, CI/CD pipelines |
| 47 | stream-chain | 1.0.0 | .claude/skills/stream-chain | Stream-JSON chaining for multi-agent pipelines |
| 48 | swarm-advanced | 2.0.0 | .claude/skills/swarm-advanced | Advanced swarm orchestration patterns |
| 49 | Verification & Quality Assurance | 2.0.0 | .claude/skills/verification-quality | Truth scoring, code quality, auto-rollback |
| 50 | Enterprise Orchestration | 1.0.0 | .claude/skills/premium/enterprise-orchestration | Multi-agent coordination at scale |
| 51 | Industry Verticals | 1.0.0 | .claude/skills/premium/industry-verticals | Specialized agent configs for industries |
| 52 | arcanea-teacher-mentor | 2.0.0 | .claude/skills/premium/teacher-mentor | Personalized AI mentorship |
| 53 | Teacher Team | 1.0.0 | .claude/skills/premium/teacher-team | Educational AI system, adaptive mentorship |
| 54 | arcanea-visionary-council | 2.0.0 | .claude/skills/premium/visionary-council | Strategic AI council for product vision |
| 55 | Visionary Team | 1.0.0 | .claude/skills/premium/visionary-team | Strategic AI council, innovation |
| 56 | arcanea-game-development | 1.0.0 | .claude/skills/industry/game-development | Game dev mastery, GDD to systems programming |
| 57 | arcanea-startup-building | 1.0.0 | .claude/skills/industry/startup-building | Idea validation to product-market fit |
| 58 | arcanea-technical-writing | 1.0.0 | .claude/skills/industry/technical-writing | Documentation, API references, guides |
| 59 | arcanea-creative-flow | 1.0.0 | .claude/skills/meta/creative-flow | Creative process mastery |
| 60 | arcanea-deep-work | 1.0.0 | .claude/skills/meta/deep-work | Focused, distraction-free work |
| 61 | arcanea-skill-mastery | 1.0.0 | .claude/skills/meta/skill-mastery | Meta-skill of using skills effectively |
| 62 | opus-extended-thinking | 1.0.0 | .claude/skills/opus-extended-thinking | Claude Opus extended thinking for deep reasoning |

---

## B-Grade Skills (35) -- Ship This Week

| # | Skill Name | Version | Location | Issues |
|---|-----------|---------|----------|--------|
| 1 | AgentDB Advanced Features | -- | .claude/skills/agentdb-advanced | No version |
| 2 | AgentDB Learning Plugins | -- | .claude/skills/agentdb-learning | No version |
| 3 | AgentDB Memory Patterns | -- | .claude/skills/agentdb-memory-patterns | No version |
| 4 | AgentDB Performance Optimization | -- | .claude/skills/agentdb-optimization | No version |
| 5 | AgentDB Vector Search | -- | .claude/skills/agentdb-vector-search | No version |
| 6 | algorithmic-art | -- | .claude/skills/algorithmic-art | No version |
| 7 | canvas-design | -- | .claude/skills/canvas-design | No version |
| 8 | creation-engine | -- | .claude/skills/ (standalone) | No version |
| 9 | design-gods | -- | .claude/skills/ (standalone) | No version |
| 10 | arcanea-design-system (skill.md) | -- | .claude/skills/ (standalone) | No version, duplicate of arcanea/design-system |
| 11 | guardian-voice | -- | .claude/skills/ (standalone) | No version |
| 12 | lore-keeper | -- | .claude/skills/ (standalone) | No version |
| 13 | starlight-core | -- | .claude/skills/ (standalone) | No version |
| 14 | starlight-engineering | -- | .claude/skills/ (standalone) | No version |
| 15 | starlight-memex | -- | .claude/skills/ (standalone) | No version |
| 16 | starlight-orchestrator | -- | .claude/skills/ (standalone) | No version, no frontmatter delimiters |
| 17 | doc-coauthoring | -- | .claude/skills/doc-coauthoring | No version |
| 18 | docx | -- | .claude/skills/docx | No version |
| 19 | pdf | -- | .claude/skills/pdf | No version |
| 20 | pptx | -- | .claude/skills/pptx | No version |
| 21 | xlsx | -- | .claude/skills/xlsx | No version |
| 22 | mcp-builder (external) | -- | .claude/skills/external/mcp-builder | No version |
| 23 | doc-coauthoring (external dup) | -- | .claude/skills/external/doc-coauthoring | No version, duplicate |
| 24 | docx (external dup) | -- | .claude/skills/external/docx | No version, duplicate |
| 25 | pdf (external dup) | -- | .claude/skills/external/pdf | No version, duplicate |
| 26 | pptx (external dup) | -- | .claude/skills/external/pptx | No version, duplicate |
| 27 | xlsx (external dup) | -- | .claude/skills/external/xlsx | No version, duplicate |
| 28 | Swarm Orchestration | -- | .claude/skills/swarm-orchestration | No version |
| 29 | Hooks Automation | -- | .claude/skills/hooks-automation | No version |
| 30 | Skill Builder | -- | .claude/skills/skill-builder | No version |
| 31 | slack-gif-creator | -- | .claude/skills/slack-gif-creator | No version |
| 32 | web-artifacts-builder | -- | .claude/skills/web-artifacts-builder | No version |
| 33 | webapp-testing | -- | .claude/skills/webapp-testing | No version |
| 34 | ReasoningBank with AgentDB | -- | .claude/skills/reasoningbank-agentdb | No version |
| 35 | ReasoningBank Intelligence | -- | .claude/skills/reasoningbank-intelligence | No version |
| | supabase-postgres-best-practices | 1.1.0 | .agents/skills/ (symlink) | Has version via metadata field, non-standard frontmatter format |

Note: The 10 Guardian persona skills (aiyami, alera, draconia, elara, ino, leyla, lyria, lyssandria, maylinn, shinkami) in `.claude/skills/arcanea-guardians/` have name, description, and triggers but no version. They are B-grade individually but function as a cohesive set.

---

## C-Grade Skills (22) -- Ship Later

| # | Skill Name | Location | Issues |
|---|-----------|----------|--------|
| 1 | arcanea-lore (standalone) | .claude/skills/arcanea-lore.md | No name, no version, old-format frontmatter |
| 2 | arcanea-media | .claude/skills/arcanea-media.md | No frontmatter at all |
| 3 | arcanea-orchestrator | .claude/skills/arcanea-orchestrator.md | No frontmatter at all |
| 4 | scientific-magic | .claude/skills/scientific-magic.md | No name, no version, old-format frontmatter |
| 5 | chess-factory-generation | .claude/skills/chess-factory-generation.md | No name, no version |
| 6 | arcanea-game-development (dir) | .claude/skills/arcanea-game-development | No frontmatter, just markdown heading |
| 7 | arcanea-games | .claude/skills/arcanea-games | No frontmatter, just markdown heading |
| 8 | arcanea-lore (dir) | .claude/skills/arcanea-lore/skill.md | No frontmatter, just markdown heading |
| 9 | arcanea-vibe-gods (dir) | .claude/skills/arcanea-vibe-gods/SKILL.md | No frontmatter, just markdown heading |
| 10 | excellence-book-writing | .claude/skills/excellence-book-writing | No frontmatter, just markdown heading |
| 11 | arcanea/lumina | .claude/skills/arcanea/lumina/skill.md | No frontmatter, no name/version |
| 12 | arcanea/luminor-intelligence | .claude/skills/arcanea/luminor-intelligence/skill.md | No frontmatter, no name/version |
| 13 | arcanea/nero | .claude/skills/arcanea/nero/skill.md | No frontmatter, no name/version |
| 14 | arcanea/premium-visual | .claude/skills/arcanea/premium-visual/SKILL.md | No frontmatter, no name/version |
| 15 | arcanea/robot-designer | .claude/skills/arcanea/robot-designer/skill.md | No frontmatter, no name/version |
| 16 | external/ai-agents-architect | .claude/skills/external/ai-engineering/ai-agents-architect | Stub: "Status: Planned" |
| 17 | external/ai-engineer | .claude/skills/external/ai-engineering/ai-engineer | Stub: "Status: Planned" |
| 18 | external/api-design-principles | .claude/skills/external/architecture/api-design-principles | Stub: "Status: Planned" |
| 19 | external/react-patterns | .claude/skills/external/development/react-patterns | Stub: "Status: Planned" |
| 20 | external/tailwind-patterns | .claude/skills/external/development/tailwind-patterns | Stub: "Status: Planned" |
| 21 | external/api-security-best-practices | .claude/skills/external/security/api-security-best-practices | Stub: "Status: Planned" |
| 22 | V3 skills (9 total) | .claude/skills/v3-* | No versions; internal claude-flow v3 implementation skills, not user-facing |

Note: The V3 skills (v3-cli-modernization, v3-core-implementation, v3-ddd-architecture, v3-integration-deep, v3-mcp-optimization, v3-memory-unification, v3-performance-optimization, v3-security-overhaul, v3-swarm-coordination) are internal implementation guides for the claude-flow v3 rewrite. They have names and descriptions but no versions and are not intended for external distribution.

---

## OSS / Community Skills (Not Double-Counted)

The `oss/skills/` and `arcanea-skills-opensource/skills/` directories are mirrors of each other. They contain:

**With SKILL.md (proper frontmatter)** -- these are copies of `.claude/skills/` originals:
- arcanea-canon, arcanea-creator-academy, arcanea-design-system, arcanea-lore, arcanea-voice, centaur-mode, design-system, luminor-wisdom, prompt-craft (Arcanea category)
- bestiary-nav, character-forge, story-weave, world-build (Creative category)
- code-review, systematic-debug, tdd (Development category)

**Standalone .md (no frontmatter)** -- content-rich but not skill-spec-compliant:
- ai-symbiosis.md, character-alchemist.md, creative-bestiary.md, luminor-council.md, story-weaver.md, world-architect.md
- arcanea-anti-trope.md (naming protocol, reference material)

These standalone files are rich content but have no YAML frontmatter (no name, version, description). They need skill wrappers to be shippable.

---

## Vibe Gods Sub-Skills (6)

Located in `.claude/skills/arcanea-vibe-gods/`. These are agent definitions, not standalone skills. They have identity/purpose but no YAML frontmatter:
- cover-art.md, lyricist.md, social-composer.md, songseed.md, suno-engineer.md, vibe-engineer.md

Grade: B as a bundled set under the arcanea-vibe-gods parent skill.

---

## Guardian Profiles (10)

Located in `.claude/skills/profiles/`. JSON configuration files (gate-*.json), not skills. Used by the Academy system. Not graded as skills.

---

## Top 20 Recommended for First Bundle

These skills are the strongest combination of readiness, usefulness, and uniqueness:

### Tier 1: Flagship (ship immediately)
| # | Skill | Why |
|---|-------|-----|
| 1 | **arcanea-story-weave** | Core creative skill, v2.0, polished |
| 2 | **arcanea-character-forge** | Core creative skill, v2.0, unique framework |
| 3 | **arcanea-world-build** | Core creative skill, v2.0, Seven Pillars |
| 4 | **arcanea-code-review** | Core dev skill, v2.0, practical |
| 5 | **arcanea-tdd** | Core dev skill, v2.0, universal value |
| 6 | **arcanea-systematic-debug** | Core dev skill, v2.0, scientific method |
| 7 | **Arcanea Academy** | Flagship product, complete gate system |
| 8 | **arcanea-centaur-mode** | Unique differentiator, human-AI co-creation |

### Tier 2: High Value (ship within days)
| # | Skill | Why |
|---|-------|-----|
| 9 | **arcanea-prompt-craft** | Prompt engineering with mythological framework |
| 10 | **arcanea-bestiary-nav** | Creative blocks taxonomy, unique IP |
| 11 | **arcanea-scene-craft** | Practical writing skill, v2.0 |
| 12 | **arcanea-dialogue-mastery** | Practical writing skill, v2.0 |
| 13 | **arcanea-voice-alchemy** | Distinctive voice development |
| 14 | **arcanea-luminor-wisdom** | Channel the Seven Luminors |
| 15 | **arcanea-api-design** | Dev utility, v2.0 |
| 16 | **arcanea-architecture-patterns** | Dev utility, v2.0 |

### Tier 3: Ecosystem (ship with bundle)
| # | Skill | Why |
|---|-------|-----|
| 17 | **arcanea-refactoring-ritual** | Dev utility, v2.0 |
| 18 | **arcanea-performance-tuning** | Dev utility, v2.0 |
| 19 | **arcanea-deep-work** | Meta/productivity, broad appeal |
| 20 | **arcanea-creative-flow** | Meta/productivity, broad appeal |

---

## Recommendations

### Quick Wins (do this week)
1. **Add version numbers** to all B-grade skills -- most just need `version: 1.0.0` in frontmatter
2. **Add YAML frontmatter** to the 6 C-grade skills that have real content (lumina, nero, luminor-intelligence, premium-visual, robot-designer, excellence-book-writing)
3. **Deduplicate** external/ copies -- they are identical to originals in development/ and root

### Medium Term
4. **Wrap OSS standalone .md files** (ai-symbiosis, character-alchemist, etc.) with proper SKILL.md frontmatter
5. **Consolidate design system skills** -- currently 3 versions (standalone, arcanea/arcanea-design-system v1, arcanea/design-system v2)
6. **Bundle Vibe Gods** sub-skills properly under the parent SKILL.md with frontmatter

### Remove or Archive
7. **Delete 6 planned stubs** in external/ that add no value
8. **Archive V3 skills** separately -- they are internal implementation docs, not distributable skills
9. **Clean up arcanea-lore duplication** -- exists in 3 locations with different formats
