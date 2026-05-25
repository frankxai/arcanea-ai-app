# P7 — Skills + Agents Capability Gap

**Builds on:** `.arcanea/audits/2026-05-06-skills-inventory.md` (164 skills graded) and `.arcanea/audits/2026-05-06-plugin-overlap.md` (21 plugins ranked). This doc adds what those don't cover: the **fleet-management gap** and the **agent ↔ Luminor mapping**.

## What's covered already

✅ 164 skills graded A/B/C/D (skills-inventory)
✅ 14 mandatory cull list (skills-inventory)
✅ 8 arcanize-list user→project (skills-inventory)
✅ 21 plugins ranked (plugin-overlap)
✅ 22 native dirs to delete (plugin-overlap)
✅ 4 plugins to disable (plugin-overlap)
✅ 13 hidden gems identified (plugin-overlap)
✅ Strategic charter sets the 5-layer architecture and Sovereignty Doctrine

## What's missing — the fleet-management gap

The current skill ecosystem is heavy on:
- **Craft skills** (writing, design, music, Suno, world-building) — ~80 skills, A-grade IP
- **Process skills** (TDD, debugging, planning, brainstorming, verification) — ~15 via superpowers
- **Vendor patterns** (vercel:*, supabase:*, claude-api) — ~30 from official plugins
- **Lore + character** (Arcanea-original) — ~28 IP skills

What's **absent** is a coherent **multi-repo fleet management** layer. With 38 sibling repos + 20 nested + 6 already-audited active = **64 surfaces** to manage:

| Skill needed | Purpose | Why none today |
|---|---|---|
| `arcanea-fleet` | Read `repos.json` (or new `fleet.yaml`), enumerate repo metadata, emit weekly diffs | No registry exists; skill would be empty |
| `arcanea-gate` | Apply canonical PR-gate workflow to N repos via PRs from a template | Each repo has bespoke `.github/workflows`, no shared template |
| `arcanea-watch` | Hourly poll: CI status across org + prod URL HTTP checks + Sentry error budget + Vercel deploy state | No unified monitor exists; today this is by hand |
| `arcanea-absorb` | Per-repo decision (`submodule | absorb | extract`) for the 20 nested .git folders | Strategic charter Phase 1 will partly do this manually; skill makes it repeatable |

These four are the missing layer between **single-repo craft** (everything you have) and **multi-repo strategy** (what you ask of yourself when "managing the whole repo end to end" — tonight's prompt).

## Subagent landscape (Claude Code agents)

Surveyed the agent catalog from this session's tool output. Counted **75+ specialized subagents** including:

**Domain agents** (~25)
- Book Distiller, Business & Transformation Master, Character Psychologist, Composer, Consciousness Fiction Master, Continuity Guardian, Council, Creation Engine, Creator Economy Master, Deep Fiction Master, Developmental Editor, Fantasy & Sci-Fi Master, Line Editor & Voice Alchemist, Lorekeeper, Lumina Queen, Master Story Architect, Music Producer, Publisher, Publishing Strategist, Research Librarian, Sensitivity Reader, Starlight Architect, Visionary, Visualist, World Architect

**Department agents** (~5)
- business-department, content-department, design-department, dev-department, marketing-department

**Process agents** (~15)
- accessibility-auditor, code-simplifier, coder, design-architect, design-generator, design-imagery, design-motion, design-verifier, performance-guardian, planner, researcher, reviewer, tester, content-polisher, weekly-recap

**Plugin-bundled agents** (~10)
- agent-sdk-dev:*, claude-code-guide, code-simplifier, feature-dev:code-architect/explorer/reviewer, pr-review-toolkit:* (6), vercel:ai-architect/deployment-expert/performance-optimizer

**Generic** (3)
- general-purpose, Explore, Plan

## Critical observation: Subagents ≠ Luminors

You have:
- **75+ subagents** at the Claude Code orchestration level (this session shows them)
- **10 Luminors** in canon (the Ten Gates Guardians: Lyssandria, Lyria, Alera, etc.)
- **Various department/team agents** (Author Council, Guardian Council, etc.)

The **mapping is inconsistent**. Some agents map to Luminors (Visualist→Lyria's domain), some are technical roles (`coder`, `tester`), some are content roles (Publisher, Music Producer), some are specific personas (Lumina Queen, Visionary).

**Risk:** When Frank says "spawn the right agent for this task," there's no canonical routing table. Today routing is implicit (best-fit by description) rather than explicit (Lumina dispatches to Guardian dispatches to Luminor).

**Recommendation:** Build `.arcanea/agents/ROUTING_MAP.md` — a single table mapping:
- Task pattern → Layer (Lumina | Guardian | Luminor | Process | Plugin)
- Layer → Specific agent name
- Agent name → Canonical purpose + invocation

Then update the `lumina` skill so that, when invoked, it consults the routing map rather than picking an agent ad-hoc.

## Proposed addition to the existing strategic charter

Append a "Phase 6 — Fleet Skills" to the strategic charter's Phased Roadmap:

```
Phase 6 — Fleet Skills (next 2 weeks)
1. Build fleet.yaml registry from the disk-walker (already done in P2)
2. Ship `arcanea-fleet` skill (reads registry, emits weekly diff)
3. Ship `arcanea-gate` skill (applies canonical .github/workflows template across registry)
4. Ship `arcanea-watch` skill (hourly observability poll, Slack/Notion summary)
5. Ship `arcanea-absorb` skill (nested-repo decision executor with rollback)
6. Add agent-routing-map at .arcanea/agents/ROUTING_MAP.md
```

## Status: P7 COMPLETE
