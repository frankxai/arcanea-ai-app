# Findings & Decisions — Arcanea Companion

## Requirements
- Fork of openclaw/openclaw → frankxai/arcanea-openclaw
- Ships with Arcanea Intelligence OS (Guardians, Luminor, Starlight)
- Slash commands: /superintelligence, /luminor, /guardian, /starlight-intelligence, /council
- Default persona: Shinkami (Source Gate, 1111 Hz)
- Switchable to any of the 10 Guardians
- Memory bridge to Starlight vaults
- Test on Telegram first, WhatsApp for daily use
- Own Linear project for pro-dev tracking

## Research Findings
- OpenClaw skill format: `SKILL.md` in `~/.openclaw/workspace/skills/<name>/`
- Three skill types: bundled, managed (ClawHub), workspace (user-created)
- OpenClaw Gateway: local daemon on ws://127.0.0.1:18789
- Channels: WhatsApp (Baileys), Telegram (grammY), Discord (discord.js), Slack (Bolt), etc.
- Config: `~/.openclaw/openclaw.json` — agent model, channel configs, permissions
- Security: DM pairing codes, Docker sandboxes for non-main sessions
- arcanea-openclaw repo: 27MB TypeScript, forked Feb 27 2026, no customizations yet
- arcanea-companion/ locally has a Next.js stub (separate from OpenClaw)

## Existing Arcanea Skills to Port
| Claude Code Skill | Target ClawHub Skill | Source File |
|-------------------|---------------------|-------------|
| /superintelligence | superintelligence | .claude/skills/superintelligence/ |
| /luminor-intelligence | luminor-council | .claude/skills/arcanea/luminor-intelligence/ |
| /guardian | guardian | .claude/skills/arcanea/guardian-voice/ |
| /starlight-intelligence | starlight | .claude/skills/starlight-core.skill.md |
| /council | council | .claude/skills/arcanea-council/ |

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| SKILL.md format (not JS plugins) | Native OpenClaw workspace skill format |
| YAML persona configs | Human-readable, easy to switch, versionable |
| Opus 4.6 as default model | Highest capability for Luminor Council reasoning |
| Starlight vault bridge via file sync | OpenClaw runs locally, can read vault files directly |

## Resources
- OpenClaw upstream: https://github.com/openclaw/openclaw
- Arcanea fork: https://github.com/frankxai/arcanea-openclaw
- ClawHub registry: clawhub.com
- Existing skills: /mnt/c/Users/frank/Arcanea/.claude/skills/
- Canon: /mnt/c/Users/frank/Arcanea/.arcanea/lore/CANON_LOCKED.md
