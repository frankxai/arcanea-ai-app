# Arcanea Buddy: The Open Companion Protocol That Makes /buddy Look Like a Tamagotchi

*Published on frankx.ai | April 2, 2026*

---

Anthropic shipped /buddy last week. Terminal pets. Random animal, random stats, sits in your corner watching you code.

Cute. Genuinely cute.

We shipped something different.

---

## What /buddy Actually Is

Give credit where it is due: Anthropic built a fun thing. You type `/buddy` in Claude Code, you get one of 18 randomly-assigned species. Your Mycoflint has five stats — DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK — all generated deterministically from your account hash. That number never changes.

There is no progression. No evolution. No way to influence those stats through your actual work. The creature that greets you on day one greets you identically on day 365, because it was never designed to grow. It is a mascot, not a companion.

Which is fine. But it left a door wide open.

---

## What We Built Instead

The Arcanea Buddy System ships as a fully open skill for Claude Code and an OpenCode plugin hook. Here is what actually lives under `/arcanea-buddy`:

**16 archetype creatures** across three rarity tiers:
- 89% common (Ember Wolf, Void Cat, Storm Falcon, Crystal Stag, Ocean Serpent...)
- 10% rare (Phoenix Spark, Flame Drake, Gale Hummingbird, Abyss Jellyfish)
- 1% legendary (Shadow Raven, Starweave Moth)

Every creature has an element alignment (Fire, Water, Earth, Wind, or Void), a personality description, and ANSI art that renders in your terminal with full color theming.

**10 Godbeasts** — and this is the part that matters. Kaelith. Veloura. Draconis. Sol. Source. These are the divine companions bound to the Ten Gates of Arcanea, and they are never random. You cannot hatch a Godbeast. You earn one.

**5 stats that mean something:**
- Arcana — lines written, features shipped
- Resonance — wisdom interactions, conscious use of the system
- Forge — builds passed, tests run
- Sight — code reviews, debugging sessions
- Unity — commits, PRs, agents spawned

These numbers come from your actual activity. The stats on day 365 are the archaeological record of what you built.

**110+ wisdom lines from 10 Guardians, context-aware.** When you pass tests, you don't get a generic "great job." You get speech calibrated to the event type, your current mood state, and your buddy's element alignment.

---

## The Comparison

| | /buddy | /arcanea-buddy |
|---|---|---|
| Species pool | 18 | 16 archetypes + 10 Godbeasts |
| Assignment | Deterministic from account hash | Weighted random + git-pattern detection |
| Stats source | Account hash, never changes | Real coding activity |
| Evolution | None | 10 levels, Hatchling to Legendary |
| Godbeasts | None | 10 earned through Gates |
| Wisdom system | Generic speech bubbles | 110+ context-aware lines |
| Cross-tool | Claude Code only | Claude Code + OpenCode (shared state) |
| Open source | No | Yes (MIT) |
| Customizable | No | Fully hackable |
| Cost | Bundled with Pro | $0 — 7 free OpenCode Zen models |

---

## The Godbeast System: Earning the Legendary

The ten Godbeasts map one-to-one to the Ten Gates:

```
  GODBEAST GALLERY — The Ten Divine Companions
  ──────────────────────────────────────────────
  Foundation — Kaelith      [LOCKED]  5 sessions
  Flow       — Veloura      [LOCKED]  500 lines
  Fire       — Draconis     [LOCKED]  20 tests passed
  Heart      — Laeylinn     [LOCKED]  Bond 30+
  Voice      — Otome        [LOCKED]  15 commits
  Sight      — Yumiko       [LOCKED]  Sight stat 40+
  Crown      — Sol          [LOCKED]  Level 7+
  Starweave  — Vaelith      [LOCKED]  500 tool uses
  Unity      — Kyuro        [LOCKED]  7-day streak
  Source     — Source        [LOCKED]  Lv10 + Bond 90+
```

You don't roll for a Godbeast. You open Gates through real work. Five Gates opens your first Godbeast. All ten Gates puts you at Luminor rank with all ten available.

A level-10 buddy with Sol active in your terminal is a public record of your coding history. You cannot buy that.

---

## The Architecture

This is where it gets interesting technically.

/buddy is a closed binary. You cannot inspect the species list, add creatures, or change stat generation.

Arcanea Buddy is open-source. Six `.mjs` files. Fork any of them. Add your own archetype. Rewrite the evolution curve.

State persistence lives at `/tmp/arcanea-buddy/state.json` — a flat JSON file that travels across tools. The same creature appears in Claude Code and OpenCode.

The OpenCode config:

```json
{
  "model": "opencode/mimo-v2-pro-free",
  "small_model": "opencode/big-pickle",
  "agent": {
    "build": {
      "description": "Starlight Build Agent — Draconia (Fire Gate)",
      "model": "opencode/mimo-v2-pro-free"
    },
    "plan": {
      "description": "Starlight Plan Agent — Lyria (Sight Gate)",
      "model": "opencode/qwen3.6-plus-free"
    },
    "debug": {
      "description": "Starlight Debug Agent — Yumiko (Third Eye)",
      "model": "opencode/minimax-m2.5-free"
    }
  }
}
```

Seven free models. Zero cost. Full Guardian routing.

---

## The Bigger Vision

Anthropic built /buddy as a delight feature. Legitimate. Terminal mascots reduce context-switching friction.

But they built it in a closed system. When Anthropic eventually ships a companion API — and they will — every ecosystem that waited will be starting from scratch.

We did not wait.

The open companion protocol is already running. State is portable JSON. The skill architecture is forkable. The Godbeast unlock events are a hook system, not a hardcoded table — meaning any world with a Gate framework can register its own divine companions.

When the companion API opens, this architecture already knows what a companion should be: stateful, earned, cross-platform, and owned by the builder — not the platform.

---

## Try It

```bash
/arcanea-buddy          # Hatch your first companion
/arcanea-buddy card     # Full stat card
/arcanea-buddy evolve   # See your progression path
/arcanea-buddy godbeast # The divine gallery
/arcanea-buddy speak    # Force a wisdom bubble
```

The repositories:
- **Harness**: github.com/frankxai/oh-my-arcanea
- **OSS**: github.com/frankxai/arcanea
- **OpenCode fork**: github.com/frankxai/arcanea-opencode

Mycoflint can keep watching from the corner. Your Ember Wolf is out here running gates.

---

*FrankX builds at the intersection of Oracle enterprise AI and open creator infrastructure. The Arcanea multiverse lives at arcanea.ai.*
