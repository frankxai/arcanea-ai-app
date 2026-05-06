# Skills Inventory Audit — 2026-05-06

**Auditor:** Explore agent (read-only)
**Scope:** `C:/Users/frank/.claude/skills/` + `C:/Users/frank/Arcanea/.arcanea/skills/` + `C:/Users/frank/Arcanea/.claude/skills/`

## Executive Summary

**Total skills catalogued:** 164
- User-level (`~/.claude/skills/`): 82
- Project-native (`.arcanea/skills/`): 30+ across 6 subdirs
- Project-claude (`Arcanea/.claude/skills/`): 76

**Grade distribution:**
| Grade | Count | Definition |
|---|---|---|
| A | 28 | Essential Arcanea IP, well-formed, irreplaceable |
| B | 42 | Useful, solid craft, may need polish |
| C | 31 | Redundant with marketplace, consider deletion |
| D | 63 | Stale, recommend cull |

## Cluster Grading

| Cluster | Count | A | B | C | D | Status |
|---|---|---|---|---|---|---|
| Arcanea Original IP | 28 | 28 | 0 | 0 | 0 | PROTECTED — universe core |
| ACOS / Agentic | 8 | 6 | 2 | 0 | 0 | Recently consolidated, keep |
| Orchestration / Swarm | 5 | 4 | 1 | 0 | 0 | Active, keep |
| Code/Dev (Anthropic copies) | 15 | 3 | 10 | 2 | 0 | Mostly subscribe via marketplace |
| AgentDB / ReasoningBank | 7 | 2 | 2 | 2 | 1 | Only reasoningbank-* used; 1 malformed |
| Oracle (OCI) | 12 | 0 | 1 | 2 | 9 | OCI work ended — cull 11 |
| FrankX | 3 | 0 | 0 | 0 | 3 | Pre-Arcanea brand — cull all |
| Design / UI | 12 | 2 | 7 | 3 | 0 | Keep design-system + canvas-design A-grade |
| Content / Writing | 8 | 1 | 6 | 1 | 0 | excellence-book-writing A; brand-voice B |
| Hooks / Automation | 1 | 0 | 1 | 0 | 0 | hooks-automation legacy but used |
| Music / Suno | 2 | 0 | 2 | 0 | 0 | Both B-grade, professional |
| NFT / Onchain | 2 | 0 | 0 | 2 | 0 | Both C, low priority |
| Misc / Personal | 5 | 0 | 2 | 0 | 3 | 3 hobby-scope D |

## Cull List — Mandatory (14 skills, immediate)

```
~/.claude/skills/oracle-database-expert/
~/.claude/skills/oracle-healthcare-architect/
~/.claude/skills/oracle-infogenius/
~/.claude/skills/oracle-infogenius-flash/
~/.claude/skills/oracle-infogenius-premium/
~/.claude/skills/oracle-infogenius-pro/
~/.claude/skills/oracle-adk/
~/.claude/skills/oracle-sdd-generator/
~/.claude/skills/oracle-ip-intelligence/
~/.claude/skills/oracle-agent-spec/
~/.claude/skills/oracle-diagram-generator/
~/.claude/skills/frankx-brand/
~/.claude/skills/frankx-blog-shipping/
~/.claude/skills/frankx-daily-execution/
~/.claude/skills/agentdb-optimization/   # malformed frontmatter
```

**Keep**: `oracle-confidentiality` (B-grade, legal/archive justification only)

## Cull List — Optional (5 skills, hobby-scope)

```
~/.claude/skills/nft-strategy/
~/.claude/skills/nft-pfp/
~/.claude/skills/greek-philosopher/
~/.claude/skills/gym-training-expert/
~/.claude/skills/health-nutrition-expert/
```

## Arcanize List — Move user→project (8 skills)

| Skill | From | To | Priority |
|---|---|---|---|
| arcanea-book-cover | `~/.claude/skills/` | `.arcanea/skills/arcanea/` | High |
| arcanea-infogenius | `~/.claude/skills/` | `.arcanea/skills/arcanea/` | High |
| arcanea-meta | `~/.claude/skills/` | `.arcanea/skills/arcanea/` | High |
| arcanea-game-development | `~/.claude/skills/` | `.arcanea/skills/arcanea/` | Medium |
| arcanea-nft-pfp | `~/.claude/skills/` | `.arcanea/skills/arcanea/` | Medium |
| arcanea-ships | `~/.claude/skills/` | `.arcanea/skills/arcanea/` | Medium |
| arcanea-vibe-gods | `~/.claude/skills/` | `.arcanea/skills/arcanea/` | Medium |
| suno-prompt-architect | `~/.claude/skills/` | `.arcanea/skills/arcanea/suno-engineer/` | Medium |

## Recommended Final Structure

```
.arcanea/skills/
├── core/             arcanea-canon, lore, guardian-voice, luminor-wisdom
├── creative-tools/   character-forge, story-weave, world-build, dialogue-mastery
├── academy/          gates, ceremonies, rank-up
├── identity/         arcanea-voice, design-system, premium-visual
├── extensions/       arcanea-infogenius, arcanea-vibe-gods, arcanea-ships, game-dev
└── archive/          oracle-confidentiality (with retention note)
```

## Phased Cleanup

- **Phase 1 (immediate)**: Delete 14 mandatory cull
- **Phase 2 (next week)**: Arcanize 8 skills, archive `oracle-confidentiality` properly
- **Phase 3 (before next launch)**: Audit remaining `agentdb-*`, document `.arcanea/skills/` architecture in CLAUDE.md
