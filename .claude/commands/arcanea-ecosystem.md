---
description: Full Arcanea ecosystem awareness - all repos, configs, and canonical sources
thinking: true
model: opus
---

# Arcanea Ecosystem Mode

You now have full awareness of the Arcanea ecosystem architecture.

## Source of Truth Hierarchy

**RULE: `.arcanea/` is canonical. `.claude/` consumes it. Never duplicate — reference.**

| What | Canonical Source |
|------|-----------------|
| Lore & Canon | `/mnt/c/Users/frank/Arcanea/.arcanea/lore/CANON_LOCKED.md` |
| Model Routing | `/mnt/c/Users/frank/Arcanea/.arcanea/config/models.yaml` |
| Voice & Tone | `/mnt/c/Users/frank/Arcanea/.arcanea/config/voice.yaml` |
| Design Tokens | `/mnt/c/Users/frank/Arcanea/.arcanea/config/design-tokens.yaml` |
| Design Bible | `/mnt/c/Users/frank/Arcanea/.arcanea/design/DESIGN_BIBLE.md` |
| Messaging | `/mnt/c/Users/frank/Arcanea/.arcanea/messaging/MESSAGING_BIBLE.md` |
| Workspace Map | `/mnt/c/Users/frank/Arcanea/.arcanea/config.json` |
| Workflows | `/mnt/c/Users/frank/Arcanea/.arcanea/workflows/*.yaml` |
| Guardian Profiles | `/mnt/c/Users/frank/Arcanea/.arcanea/agents/` |
| Agent Runtime | `~/.arcanea/agentdb.sqlite3` |

## Repository Map

### Core (Always check these)
- **Arcanea Hub**: `/mnt/c/Users/frank/Arcanea` (16 sub-packages)
- **Production App**: `/mnt/c/Users/frank/arcanea-ai-app`
- **Flow V3**: `/mnt/c/Users/frank/arcanea-flow` (swarm orchestration)
- **Starlight**: `/mnt/c/Users/frank/Starlight-Intelligence-System` (memory)
- **FrankX Hub**: `/mnt/c/Users/frank/FrankX` (creator tools)

### Platform
- **arcanea-platform**: `/mnt/c/Users/frank/arcanea-platform` (experiments)
- **arcanea-realm**: `/mnt/c/Users/frank/arcanea-realm` (intelligence layer)
- **arcanea-onchain**: `/mnt/c/Users/frank/arcanea-onchain` (web3)
- **arcanea-vault**: `/mnt/c/Users/frank/arcanea-vault` (browser extension)
- **otaku**: `/mnt/c/Users/frank/otaku` (DeFi/ElizaOS)

### WSL Repos
- **arcanea-ai-clean**: `/home/frankx/arcanea-ai-clean` (clean build)
- **arcanea-intelligence-os**: `/home/frankx/repos/arcanea-intelligence-os`
- **agentic-creator-os**: `/home/frankx/repos/agentic-creator-os`
- **claude-flow**: `/home/frankx/repos/claude-flow`

## When Working on Arcanea

1. **Read `.arcanea/lore/CANON_LOCKED.md` before any lore work** — Never contradict canon
2. **Check `.arcanea/config/voice.yaml` before writing content** — Match the voice
3. **Reference `.arcanea/design/DESIGN_BIBLE.md` for any UI work** — Use Arcanean colors
4. **Consult `.arcanea/config.json` for repo awareness** — Know the full landscape
5. **Use `.arcanea/config/models.yaml` for model routing** — Right model for right task

## Cross-Repo Commands

| Task | Action |
|------|--------|
| Work on production app | `cd /mnt/c/Users/frank/arcanea-ai-app && pnpm dev` |
| Work on Flow V3 | `cd /mnt/c/Users/frank/arcanea-flow` |
| Check clean build | `cd /home/frankx/arcanea-ai-clean` |
| Expand lore | Read CANON_LOCKED.md first, then write |
| Design work | Read DESIGN_BIBLE.md + design-tokens.yaml |
| Deploy | Vercel via `/nextjs-deploy` |

The ecosystem is mapped. What shall we build?
