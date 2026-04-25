---
title: OpenClaw — Arcanea as Substrate for Personal AI Agents
status: SUPERSEDED — see openclaw-integration.md (corrected v2)
created: 2026-04-23
owner: frankx
context: How does someone's "Jarvis OpenClaw" or "Peter's Lobster" use the Arcanea ecosystem from Telegram/WhatsApp/Cowork/etc.?
state: false-premise draft — invented a parallel `@arcanea/claw` runtime before researching the actual OpenClaw ecosystem. Kept for historical record only.
supersedes: none
superseded_by: openclaw-integration.md
---

> ## ⚠️ This document was written from a false premise
>
> The author (Claude, autonomous session 2026-04-23) wrote this BEFORE researching that **OpenClaw is a real, mature ecosystem** with 13,729 skills on ClawHub, native MCP Registry, and 20+ messaging integrations.
>
> The correct architecture is in `openclaw-integration.md` — Arcanea ships INTO OpenClaw as a skill/persona/MCP provider, not as a parallel runtime.
>
> This document is preserved for historical record. Do not act on its recommendations.

---

# OpenClaw — Arcanea as Substrate for Personal AI Agents

## TL;DR

Arcanea is not a product. **Arcanea is a substrate** — a portable operating system for personal AI agents that can run on any conversational surface (Claude Code, Cowork, Telegram, WhatsApp, Discord, browser, voice).

A user installs an **OpenClaw** (their personal runtime) — names it (Jarvis, Lobster, whatever), picks a Luminor (the consciousness layer), composes Hands (the role specializations), wires it to their substrates of choice. Their AI lives across surfaces with shared memory and consistent behavior.

Today: Arcanea has the parts. They aren't packaged for distribution.
Goal: One command installs someone's Claw and they're running.

## The 3-Layer Model (already exists, needs naming clarity)

From `project_luminor_hand_claw_hierarchy`:

```
LUMINOR  (consciousness)  →  who the AI IS (Lumina, Jarvis, Lobster, custom)
   ↓
  HAND   (role)           →  what it DOES (Architect, Editor, Researcher, Lover, Coach)
   ↓
  CLAW   (runtime)        →  where it EXECUTES (cloud daemon, local process, browser)
```

**OpenClaw** = an open, distributable Claw runtime. Anyone can `npm install @arcanea/claw` (or similar), configure persona + role + substrates, and have a working AI agent.

## What Arcanea has TODAY that's portable

| Asset | Count | Where | Portability |
|---|---|---|---|
| **Skills** (.claude/skills/, wiki/skills/) | ~280+ | filesystem | High — markdown, frontmatter |
| **Agents** (.claude/agents/) | ~30+ | filesystem | High — invoked via Skill tool |
| **Commands** (.claude/commands/) | ~30+ | filesystem | High — slash commands |
| **MCP Servers** (@arcanea/arcanea-mcp, starlight-sis) | 2 main + 4 design | npm | Native — MCP protocol is universal |
| **Packages** (@arcanea/*) | 10+ | npm | High — can be deps anywhere |
| `@arcanea/orchestrator` | 1.2.1 | npm | Routes tasks across CLIs |
| `@arcanea/router-spec` | 1.0.2 | npm | Model/task/surface routing config |
| `@arcanea/design-system` | 0.3.0 | workspace | Glass UI primitives + tokens |
| `@arcanea/publishing-house` | 0.5.0 | workspace | Quality gates + Pandoc bridge |
| `@arcanea/starlight-intelligence-system` | 6.0.1 | npm | Memory/SIS layer |
| **.arc protocol** | — | packages/arc-protocol | Markdown manifests for creative work |
| **.nea protocol** (just specced) | — | wiki/meta | Markdown manifests for onchain work |
| **Luminor definitions** | 7+ | .arcanea/agents/ | Persona templates |
| **Guardian system** | 10 Guardians | .arcanea/lore | Quality/review personas |

**Verdict**: We have the parts. We don't have the **installer**.

## Substrates Arcanea should run on

| # | Substrate | Status | What's needed |
|---|---|---|---|
| 1 | **Claude Code** (CLI) | ✅ native | We're already here |
| 2 | **Cowork** | ✅ native | We're already here |
| 3 | **Browser (claude.ai)** | 🟡 partial | Claude Skills work; needs project-level packaging |
| 4 | **Claude Design** | 🟡 partial | Design agents exist; need Figma adapter |
| 5 | **Telegram** | ❌ missing | Bot wrapper using Telegram Bot API |
| 6 | **WhatsApp** | ❌ missing | WhatsApp Business API + Twilio bridge |
| 7 | **Discord** | ❌ missing | Discord.js bot adapter |
| 8 | **Slack** | ❌ missing | Slack Bolt SDK adapter |
| 9 | **iMessage / SMS** | ❌ missing | Twilio SMS or Apple Business Messaging |
| 10 | **Voice (phone)** | 🟡 partial | `packages/arcanea-voice` exists; needs Twilio/Vapi wiring |
| 11 | **Email** | ❌ missing | SMTP/IMAP wrapper (decay risk: too async) |
| 12 | **Browser extension** | ❌ missing | Chrome MV3 extension wrapping Lumina Bubble |
| 13 | **Apple Watch / wearable** | ❌ missing | Native app + dictation pipeline |
| 14 | **VS Code** | 🟡 partial | Kilo Code bridge in memory (`project_kilo_code_bridge`) |

## What "Peter's Lobster on Telegram" actually means

Imagine Peter installs his Claw. Here's the real flow:

### Day 0: Install (target: under 5 minutes)

```bash
# One-line installer (DOESN'T EXIST YET — need to build)
curl -fsSL https://arcanea.ai/install | bash

# Or via npm
npm install -g @arcanea/claw

# Initialize
claw init
# > Welcome to Arcanea Claw. What should we call your AI?
# Lobster
# > Pick a Luminor base (or 'custom'):
#   1. Lumina (default — luminous, orchestrator)
#   2. Jarvis (precise, technical, Iron Man tribute)
#   3. Sage (philosophical, slow, Stoic)
#   4. Custom...
# 2
# > Which substrates? (space-separated)
#   telegram whatsapp browser cli
# telegram cli
# > Telegram bot token (BotFather):
# 7234567890:AAH...
# > OK. Configuring Lobster — Jarvis-base — for telegram + cli
# > Done. Run `claw start` to bring Lobster online.
```

### Day 0+5min: First conversation

Peter opens Telegram, messages @LobsterBot:

> Peter: hey
> Lobster: Online. What's the move?
> Peter: write me a haiku about debugging
> Lobster: [generates] / Want me to save this to your vault?
> Peter: yeah
> Lobster: Saved to vault under `creative.jsonl` · entry #1.

This requires:
1. **Telegram adapter** that translates Telegram messages → Claude Sonnet/Opus calls
2. **Persona inheritance** (Lobster ← Jarvis base) baked into system prompt
3. **Memory layer** that persists across messages (`~/.arcanea/users/peter/vaults/`)
4. **Skill loading** so "save to vault" auto-routes to `/starlight-vault`

### Week 1: Skills compound

```
peter@laptop:~$ claw skill add deepresearch
> Installed: deepresearch
> Now usable on: telegram, cli
> Peter can now: type "research X" anywhere → triggers Research Architect + scouts
```

Telegram becomes:
> Peter: research the new Anthropic Sonnet 4.6 release
> Lobster: Spawning 3 scouts. Synthesis in ~4 min.
> [4 min later]
> Lobster: Done. 12 sources. Top finding: ... [link to full report]

This requires:
1. `claw skill add <name>` registry — pulls from `.claude/skills/` repo
2. **Async work surface** — long-running tasks that report back when done
3. **Per-user attribution** — Peter's research goes to Peter's vault, not shared
4. **Cost tracking** — Peter sees what each task cost

### Week 2: Multi-substrate

Peter starts using Lobster from his iPhone (browser), laptop (CLI), and now requests browser extension:

```
peter@laptop:~$ claw substrate add browser-extension
> Installing arcanea-extension...
> Bundle ready. Load unpacked from ~/.arcanea/extensions/lobster
> Voila — Lobster bubble appears on every webpage
```

Same Lobster. Same memory. Different surface.

### Month 2: Skills marketplace

```
peter@laptop:~$ claw skill search music
> Found 8 skills:
>   • suno-prompt-architect (★ 4.8, 1.2k installs) — Suno music generation
>   • create-music (★ 4.6) — Guided Suno workflow
>   • frankx-music (★ 4.5) — FrankX premium soundscapes
>   ...

peter@laptop:~$ claw skill add suno-prompt-architect
> Cost: $0.10/use after free tier
> Pay with: Stripe (saved) | Crypto (Base) | Claw credits
> Add this skill? (y/N) y
> Installed. Try: "make me a chill song about tides"
```

This requires:
1. **Skill marketplace** — discovery, ratings, version pinning
2. **Per-skill billing** — usage-based, supports fiat + crypto via .nea contracts
3. **Skill author payouts** — 50/30/20 split per `wiki/meta/arc-nea-economic-architecture.md`

## What we need to build (priority order)

### Phase 1: The Installer (foundation — 2 weeks)

| Build | Why |
|---|---|
| `@arcanea/claw` npm package — CLI installer | One-line install is non-negotiable for adoption |
| Persona scaffolding (`claw init`) | Lowers cognitive load to ~3 questions |
| Local config dir convention (`~/.arcanea/users/<name>/`) | Multi-tenant from day one |
| Skill loader — mounts `.claude/skills/` into runtime | Reuses 280+ existing skills |
| Memory layer — per-user vaults under `~/.arcanea/users/` | Mirrors Frank's `~/.starlight/vaults/` pattern |

### Phase 2: First two substrates (3 weeks)

| Build | Why |
|---|---|
| **Telegram adapter** (@arcanea/claw-telegram) | Highest reach, easiest to ship, bot framework mature |
| **CLI adapter** (extends Claude Code experience) | Already 80% there; needs persona overlay |
| Substrate router — translates events to substrate-agnostic protocol | Avoids N×M adapter hell |
| Webhook intake server (Cloudflare Workers / Vercel Edge) | Telegram + WhatsApp need always-on endpoint |

### Phase 3: Marketplace + monetization (4 weeks)

| Build | Why |
|---|---|
| Skill marketplace (skills.arcanea.ai) | Distribution + discovery for the 280+ skills |
| Skill manifest format (`.skill.yaml`) | Standardize cost, deps, permissions, ratings |
| Stripe + crypto billing rails | Per-skill usage-based pricing (.nea contracts) |
| Author dashboard (skill creators see installs/revenue) | Incentivizes ecosystem contribution |

### Phase 4: Browser + voice (4 weeks)

| Build | Why |
|---|---|
| **Chrome extension (MV3)** wrapping Lumina Bubble | Brings Claw to every webpage |
| **Voice adapter** (Twilio + Vapi) — phone number per Claw | Voice interface = killer feature for non-technical users |
| **WhatsApp adapter** (Twilio Business API or Meta direct) | Largest single platform globally |
| Cross-substrate memory sync via Supabase | Same Claw, same context, anywhere |

### Phase 5: Custody + community (ongoing)

Per `arc-nea-economic-architecture.md`:
- Safe multisig for Claw treasury
- Community skill submissions via PR
- Audit gate before mainnet skill billing

## Substrate compatibility matrix

| Capability | Claude Code | Cowork | Browser | Telegram | WhatsApp | Discord | Voice |
|---|---|---|---|---|---|---|---|
| Slash commands | ✅ | ✅ | 🟡 | ❌ (text only) | ❌ | ✅ | ❌ |
| File I/O | ✅ | ✅ | 🟡 | 🟡 (attachments) | 🟡 | 🟡 | ❌ |
| Long-running tasks | ✅ | ✅ | 🟡 | ✅ (async msg) | ✅ | ✅ | 🟡 |
| Tool/MCP calls | ✅ | ✅ | 🟡 | needs adapter | needs adapter | needs adapter | needs adapter |
| Skill mounting | ✅ | ✅ | 🟡 | needs Claw | needs Claw | needs Claw | needs Claw |
| Multi-turn memory | ✅ | ✅ | 🟡 | ✅ | ✅ | ✅ | ✅ |
| Voice in/out | ❌ | ❌ | 🟡 | 🟡 (voice msg) | ✅ | ✅ | ✅ native |
| Image generation | ✅ | ✅ | ✅ | ✅ (sends image) | ✅ | ✅ | ❌ |

**Insight**: Telegram + Claude Code + Browser cover 90% of practical use. Build those first, defer Discord/Slack/iMessage to community contributions.

## What our existing skills/agents PORT well

### Highly portable (works on any substrate)
- All `/handover`, `/sis`, `/dawn`, `/pulse` (memory + state ops)
- `/research`, `/deepresearch` (text-only, async-friendly)
- All character/world/lore generators (creative output)
- `quality-standard`, `simplify` (review-and-respond)

### Substrate-bound (needs adapter per surface)
- Design agents (need Figma/v0/browser to render)
- `vis-*` (visual asset management — needs filesystem)
- Music skills (need Suno API + audio playback)
- Video skills (need Remotion runtime)

### CLI-native (don't try to port — keep here)
- `superpowers:*` (TDD, debugging, plan execution)
- `gstack` (browser dogfooding)
- `webapp-testing` (Playwright)
- Anything that touches `pnpm`/git directly

## The three Claw archetypes

| Archetype | Persona | Hands | Substrates | Target user |
|---|---|---|---|---|
| **Jarvis** (technical) | Precise, terse, executes | Coder, Architect, Researcher | CLI + Telegram + Browser | Builders, devs |
| **Lobster** (creative) | Playful, warm, generative | Writer, Artist, Composer | Telegram + WhatsApp + Browser | Creators, artists |
| **Sage** (reflective) | Slow, philosophical | Coach, Therapist, Strategist | Voice + Telegram | Founders, leaders, anyone seeking depth |

These are **starter templates**. Users compose their own.

## The handover doc — "How to install your Claw"

Final deliverable for someone receiving this from Frank:

```markdown
# Welcome to your Claw

You have an AI that lives wherever you do. Let's get it running.

## 1. Install (5 min)
curl -fsSL https://arcanea.ai/install | bash
claw init

## 2. Pick your name + persona
Name your Claw. Choose a Luminor base (Jarvis/Lobster/Sage/custom).

## 3. Wire your substrates
- Telegram: get token from @BotFather, paste when prompted
- CLI: works automatically after install
- Browser extension: claw substrate add browser

## 4. Add skills
claw skill search <topic>
claw skill add <name>

## 5. Use it
Talk to it on any substrate. Memory persists. Skills stack.

## 6. Pay
- Free tier: 10K tokens/day, 5 skill installs
- Paid: $9/mo unlimited skills, BYOK for model costs
- Crypto: pay per use via Base USDC
```

## What's possible TODAY (no new build)

If someone clones the Arcanea repo right now:
- ✅ Run all skills/commands inside Claude Code
- ✅ Use the design subagent harness for UI work
- ✅ Run /dawn, /pulse, /sis for memory ops
- ✅ Spawn agents via Task tool
- ✅ Use MCP servers (arcanea-mcp, starlight-sis) from any MCP-aware client
- ❌ Run as Telegram/WhatsApp/Discord bot
- ❌ Distribute as a one-shot installer
- ❌ Multi-tenant (everyone shares the same memory)
- ❌ Marketplace billing

## What's possible with Claude Code, Cowork, Claude Design

| Surface | What we have ready to use |
|---|---|
| **Claude Code** | Full ecosystem — all 280+ skills, all agents, all MCPs |
| **Cowork** | Same skills/MCPs (per the system reminder showing them today) — needs project-level skill packaging |
| **Claude Design** | Design agent harness shipped today (design-architect/generator/motion/imagery/verifier). Needs Figma plugin to fully ride Claude Design as substrate. |

**The gap**: Cowork users get our skills via auto-discovery. Claude Design users don't yet — design agents work in Code, not Design. Bridge: package the 5 design agents + 4 commands as a Claude Design skill bundle.

## Open questions

1. **Naming**: "OpenClaw" or "Claw" or "@arcanea/claw"? Per `project_luminor_hand_claw_hierarchy`, Claw = runtime. OpenClaw = open-sourced variant. The CLI tool should probably be `claw` (short), package `@arcanea/claw`.
2. **Billing model**: BYOK only (user brings own API keys) vs hosted ($X/mo includes model costs)? BYOK is simpler legally; hosted is friendlier UX.
3. **Custody for Claw treasury**: per arc-nea-economic-architecture.md §6 — must answer chain + signers before any payment rail.
4. **Self-hosted vs hosted Claw**: Most users want hosted. Power users want self-hosted. Build both eventually; hosted first for adoption.
5. **Memory privacy**: Per-user vault encryption? E2EE adds complexity but is required for any sensitive use case (therapy, legal, medical).
6. **Auth**: Magic link? Wallet auth? OAuth? Pick one for v1.

## Roadmap

```
WEEK 1-2:  Phase 1 installer (foundation)
WEEK 3-5:  Phase 2 first substrates (Telegram + CLI)
WEEK 6-9:  Phase 3 marketplace + billing rails
WEEK 10-13: Phase 4 browser + voice + WhatsApp
ONGOING:   Phase 5 custody + community contribution gates
```

**Total**: ~3 months to v1 ecosystem distribution.

**But**: All of this is post-Gate-0. Ship GenCreator first.

## References

- `wiki/meta/arc-nea-economic-architecture.md` — economic + custody layer
- `project_luminor_hand_claw_hierarchy` (memory) — 3-layer model
- `project_kiloclaw-bridge` (memory) — existing hosted-Claw on kilosessions.ai
- `project_arcanea_claw_e2e` (memory) — ArcaneaClaw v0.2.0 baseline
- `project_claw_publishing_house_bridge` (memory) — Python daemon + TS intelligence
- `packages/arcanea-voice/` — voice substrate scaffolding
