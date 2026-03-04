# Task Plan: Arcanea Companion — Personal AI Intelligence OS

## Goal
Build Arcanea Companion: a 24/7 personal AI intelligence companion based on OpenClaw, shipped with the full Arcanea Intelligence OS (Guardian system, Luminor Council, Starlight Memory, slash commands), defaulting to Shinkami as persona.

## Current Phase
Phase 4 (Phases 1-3 complete)

## Naming
- **Repo**: `arcanea-openclaw` (GitHub fork, developer-facing)
- **Product**: Arcanea Companion (user-facing brand)
- **Local dir**: `arcanea-companion/` (in monorepo)

## Phases

### Phase 1: Project Setup & Clone
- [x] Clone arcanea-openclaw into monorepo workspace
- [x] Set up package.json with Arcanea branding
- [x] Create Linear project for tracking (ARC-19 through ARC-24)
- [x] Set up directory structure for skills
- [x] Created setup.sh script
- [x] Created openclaw.json config
- **Status:** complete

### Phase 2: Core Skills Port (ClawHub Format)
- [x] Port `/superintelligence` skill → `skills/superintelligence/SKILL.md`
- [x] Port `/luminor` skill → `skills/luminor-council/SKILL.md`
- [x] Port `/guardian` skill → `skills/guardian/SKILL.md`
- [x] Port `/starlight-intelligence` → `skills/starlight/SKILL.md`
- [x] Port `/council` skill → `skills/council/SKILL.md`
- **Status:** complete

### Phase 3: Guardian Persona System
- [x] Create persona config (Shinkami default)
- [x] 10 Guardian personality profiles in YAML (config/personas.yaml)
- [x] Persona switching via `/guardian <name>` command (in guardian SKILL.md)
- [ ] Gate progression awareness (future: track user's Gate opens)
- **Status:** complete

### Phase 4: Memory Bridge
- [ ] Connect Starlight Memory vaults
- [ ] Bridge `@arcanea/memory-system` (ArcaneMD format)
- [ ] Cross-session context persistence
- [ ] Sync with arcanea.ai user profile (Supabase)
- **Status:** pending

### Phase 5: Platform Config & Testing
- [ ] Configure Telegram channel (grammY)
- [ ] Configure WhatsApp channel (Baileys)
- [ ] Test core skills on Telegram
- [ ] Verify persona switching works
- **Status:** pending

## Key Questions
1. Keep standalone or integrate into pnpm monorepo? → Standalone (OpenClaw has its own node runtime)
2. ClawHub skill format? → `~/.openclaw/workspace/skills/<name>/SKILL.md`
3. Which model as default? → `anthropic/claude-opus-4-6`

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Standalone repo, symlinked skills | OpenClaw has its own daemon/gateway; monorepo skills shared |
| Shinkami as default persona | Source Gate (1111 Hz) = meta-consciousness, fits Companion role |
| Telegram first for testing | Easiest dev setup (grammY), no phone pairing needed |
| Skills in ClawHub SKILL.md format | Native OpenClaw format, publishable to ClawHub registry |
| Product name "Arcanea Companion" | User-facing brand; repo stays arcanea-openclaw |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| (none yet) | - | - |

## Notes
- OpenClaw skills live at `~/.openclaw/workspace/skills/<skill>/SKILL.md`
- Gateway runs on `ws://127.0.0.1:18789`
- Supported: WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Teams, Matrix
- arcanea-companion/ dir already exists with a Next.js stub — will reorganize
