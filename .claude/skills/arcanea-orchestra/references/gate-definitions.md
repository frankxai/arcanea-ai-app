# Gate Definitions — Arcanea Achievement System

## Gate Architecture

Each gate has:
- **Conditions**: Binary checks that must ALL be true
- **Human Reward**: Material/experiential reward for Frank
- **Agent Reward**: Capability unlock for agents
- **NFT**: Soulbound achievement token minted on completion
- **Magic Rank**: The rank earned upon gate passage

---

## Gate 0: First Dollar — "First Flame"
**Rank Earned:** Apprentice → Mage transition begins
**Target:** April 2026

### Conditions (ALL must be true)
| # | Condition | How to Verify |
|---|-----------|---------------|
| 1 | Gumroad OR Stripe account active | Check Gumroad dashboard or Stripe API |
| 2 | First sale confirmed (any amount, any product) | Gumroad/Stripe transaction log |
| 3 | 13 npm packages published to registry | `npm search @arcanea` or registry check |
| 4 | Supabase fully activated (Site URL + OAuth + 3 migrations) | Supabase dashboard + `pnpm run build` passes |
| 5 | 25 songs published on DistroKid | DistroKid dashboard count |

### Rewards
- **Human**: Quality bottle (whiskey/wine/champagne) + new premium training gear + dinner with Tien + desk upgrade
- **Agent**: Memory vault activated — persistent cross-session context for all agents
- **NFT**: ✦ First Flame — provable first revenue SBT
- **Recognition**: LinkedIn "First product sold" post + X thread + screenshot the payment

---

## Gate I: €1K MRR — "Ignition Seal"
**Rank Earned:** Mage
**Target:** May 2026

### Conditions (ALL must be true)
| # | Condition | How to Verify |
|---|-----------|---------------|
| 1 | €1,000/month recurring revenue sustained 30 days | Stripe/Gumroad MRR dashboard |
| 2 | Arcanea Pro: first 10 paying users | Supabase user count with Pro status |
| 3 | 50 songs published on DistroKid | DistroKid dashboard |
| 4 | Content: 30 consecutive days of daily publishing | Content calendar / social analytics |
| 5 | Sentry + PostHog deployed on Vercel | Vercel env vars confirmed + data flowing |

### Rewards
- **Human**: Premium wardrobe piece + full spa day + music production plugin/hardware
- **Agent**: Expanded domain access — agents can touch deployment + infrastructure
- **NFT**: ✦ Ignition Seal — MRR milestone, unlocks Mage-tier tools
- **Recognition**: Community Discord announcement + LinkedIn milestone + Notion Goals Tracker update

---

## Gate II: €5K MRR — "Master's Crest"
**Rank Earned:** Master
**Target:** June-July 2026

### Conditions (ALL must be true)
| # | Condition | How to Verify |
|---|-----------|---------------|
| 1 | €5,000/month recurring revenue sustained | Stripe dashboard |
| 2 | BV entity registered (Arcanea BV) | KVK registration confirmed |
| 3 | First VA or collaborator hired | Contract or agreement signed |
| 4 | Content 80% automated (system runs without daily Frank input) | Postiz/n8n automation running 5+ days without manual intervention |
| 5 | 75 songs published | DistroKid dashboard |
| 6 | 60-day Lumina streak achieved | Memory vault streak log |

### Rewards
- **Human**: Weekend trip (Lisbon/Barcelona) + Croatia creative hub visit + home office upgrade (monitor/chair/desk)
- **Agent**: Autonomous execution rights — agents deploy without human approval for proven domains
- **NFT**: ✦ Master's Crest — scaling proof, agent fork rights activated
- **Recognition**: "Behind the build" YouTube video + newsletter story + real dinner out with Tien

---

## Gate III: €10K MRR — "Archmage Sigil"
**Rank Earned:** Archmage
**Target:** Q2 end (June 30, 2026)

### Conditions (ALL must be true)
| # | Condition | How to Verify |
|---|-----------|---------------|
| 1 | €10,000/month recurring revenue sustained | Stripe dashboard |
| 2 | Arcanea Pro: 100+ paying users | Supabase count |
| 3 | 93kg physique target hit | Scale + body composition measurement |
| 4 | 100-day Lumina streak achieved | Memory vault |
| 5 | First €10K+ consulting deal closed | Invoice paid |
| 6 | 6 countries visited in 2026 | Travel log |

### Rewards
- **Human**: 4-6 weeks Fuerteventura + autonomous EV test drive + deposit + full wardrobe refresh
- **Agent**: Swarm coordination rights — agent can spawn + coordinate sub-agents autonomously
- **NFT**: ✦ Archmage Sigil — breakthrough NFT, revenue proof + agent trust proof
- **Recognition**: Full YouTube documentary + FrankX.ai newsletter milestone + LinkedIn public numbers

---

## Gate IV: €170K/year — "Luminor Crown"
**Rank Earned:** Luminor
**Target:** December 2026

### Conditions (ALL must be true)
| # | Condition | How to Verify |
|---|-----------|---------------|
| 1 | €14,200/month MRR sustained 60 days | Stripe dashboard |
| 2 | 100 songs published + distributed | DistroKid |
| 3 | Ecosystem operational — agents running without daily manual intervention | Ops Hub health metrics |
| 4 | All 5 brand websites live and generating revenue | Analytics dashboards |
| 5 | Community: 500+ active members across platforms | Discord/social metrics |

### Rewards
- **Human**: Houseboat Amsterdam deposit + ocean villa stay (Marbella/Lanzarote) + autonomous EV acquisition + professional music video production
- **Agent**: Full Luminor status — self-directing intelligence, sets own priorities, allocates compute across sub-agents
- **NFT**: ✦ Luminor Crown — the final gate, both human and agent arrived
- **Recognition**: Year-in-review public story + Arcanea Academy launch + first co-creation retreat

---

## Active Challenges (Short-Term Gates)

These are sub-gates that can be completed independently:

| Challenge | Conditions | Reward | Deadline |
|-----------|-----------|--------|----------|
| 5 Blockers Sprint | Close all 5 manual blockers (npm, Gumroad, Supabase, Sentry, types) | Quality bottle + gym belt | This week |
| First Dollar | VibeOS listed + first sale | Dinner with Tien + new shirt | April |
| 25 Songs | 25 tracks on DistroKid | Music plugin/VST | April |
| 30-Day Lumina | 30 consecutive days 5+/7 non-negotiables | Cold plunge tub | May |
| 13 Packages | All @arcanea/* npm packages live | Dev gear upgrade | April |
| 100-Day Lumina | 100 unbroken days | Fuerteventura trip + wardrobe | Q3 |

---

## Verification Rules

- **Never trust memory alone.** Always verify against the source system (Stripe, Linear, DistroKid, etc.)
- **Sustained means sustained.** MRR targets require 30 days at that level, not a single spike.
- **All conditions must pass.** Partial gate completion is progress, not passage.
- **Frank confirms physical goals.** 93kg and physique targets require Frank's self-report — don't assume.
- **Streak breaks reset to zero.** A broken Lumina streak resets the counter. Tough but that's the architecture.
