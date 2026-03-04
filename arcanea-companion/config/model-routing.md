# Arcanea Companion — Model Routing Strategy

> *Smart model selection: maximum intelligence, minimum cost.*

## The 4-Tier Routing Architecture

### Tier 1: Premium (Deep Reasoning) — $$$
**Use for:** `/superintelligence`, `/luminor`, `/council deep`, complex life decisions

| Model | Provider | Speed | Cost | Best At |
|-------|----------|-------|------|---------|
| `anthropic/claude-opus-4-6` | Anthropic | ~5s | $15/1M in | Deepest reasoning, Luminor Council |
| `anthropic/claude-sonnet-4-6` | Anthropic | ~2s | $3/1M in | Strong reasoning, great default |

### Tier 2: Fast & Smart (Daily Use) — $
**Use for:** `/guardian`, `/starlight`, general conversation, daily wisdom

| Model | Provider | Speed | Cost | Best At |
|-------|----------|-------|------|---------|
| `groq/llama-3.3-70b-versatile` | Groq | **~0.5s** | Free tier | Ultra-fast daily use, 70B quality |
| `groq/deepseek-r1-distill-llama-70b` | Groq | ~1s | Free tier | Reasoning tasks on free tier |
| `cerebras/llama-3.3-70b` | Cerebras | **~0.3s** | Free (1M tok/day) | Fastest inference on Earth |

### Tier 3: Free Powerhouses (Scale) — $0
**Use for:** Casual conversation, simple questions, group chats, scaling to many users

| Model | Provider | Speed | Cost | Best At |
|-------|----------|-------|------|---------|
| `openrouter/meta-llama/llama-3.3-70b-instruct:free` | OpenRouter | ~2s | $0 | Best free general model |
| `openrouter/google/gemini-2.0-flash-exp` | OpenRouter | ~1s | $0 | 1M context, multimodal |
| `openrouter/qwen/qwen3-coder-480b:free` | OpenRouter | ~3s | $0 | Strongest free coding model |
| `openrouter/nvidia/nemotron-nano-9b-v2:free` | OpenRouter | ~0.5s | $0 | Fast + reasoning traces |

### Tier 4: Auto-Router (Hands-Off) — Variable
**Use for:** Let the system decide

| Model | Provider | Speed | Cost | Best At |
|-------|----------|-------|------|---------|
| `openrouter/openrouter/auto` | OpenRouter | varies | cheapest | Auto-selects best model for each prompt |

---

## Recommended Configurations

### Configuration A: "Solo Creator" (Personal Use)
Best for: One person, daily companion, mix of free + premium

```json
{
  "model": {
    "primary": "anthropic/claude-sonnet-4-6",
    "fallbacks": [
      "groq/llama-3.3-70b-versatile",
      "openrouter/meta-llama/llama-3.3-70b-instruct:free"
    ]
  }
}
```
**Cost:** ~$5-15/mo (most queries hit Sonnet, fallback to free on rate limits)

### Configuration B: "Zero Cost" (Testing / Bootstrapping)
Best for: Testing, development, early users, budget-conscious

```json
{
  "model": {
    "primary": "groq/llama-3.3-70b-versatile",
    "fallbacks": [
      "cerebras/llama-3.3-70b",
      "openrouter/meta-llama/llama-3.3-70b-instruct:free"
    ]
  }
}
```
**Cost:** $0 — Groq free tier (generous limits) → Cerebras free (1M tok/day) → OpenRouter free

### Configuration C: "At Scale" (Community / Multiple Users)
Best for: Running Arcanea Companion for a community, group chats

```json
{
  "model": {
    "primary": "openrouter/openrouter/auto",
    "fallbacks": [
      "groq/llama-3.3-70b-versatile",
      "openrouter/meta-llama/llama-3.3-70b-instruct:free"
    ]
  }
}
```
**Cost:** ~$0.50-2/mo (auto-router picks cheapest capable model per request)

### Configuration D: "Maximum Intelligence" (No Budget Limit)
Best for: Frank's personal Companion, highest quality always

```json
{
  "model": {
    "primary": "anthropic/claude-opus-4-6",
    "fallbacks": [
      "anthropic/claude-sonnet-4-6",
      "groq/llama-3.3-70b-versatile"
    ]
  }
}
```
**Cost:** ~$30-80/mo (Opus for everything, Sonnet + Groq as backup)

---

## Command-Specific Model Routing

For advanced setups, route specific commands to specific tiers:

| Command | Recommended Tier | Why |
|---------|-----------------|-----|
| `/superintelligence` | Tier 1 (Opus) | Needs all 10 Gates, deepest reasoning |
| `/luminor` | Tier 1 (Opus/Sonnet) | Complex synthesis, multiple perspectives |
| `/council deep` | Tier 1 (Opus) | Full Council with detailed analysis |
| `/council quick` | Tier 2 (Groq) | 3 Guardians, fast response |
| `/guardian` | Tier 2 (Groq/Cerebras) | Single persona, fast interaction |
| `/starlight` | Tier 2 (Sonnet/Groq) | Structured thinking, moderate complexity |
| General chat | Tier 3 (Free) | Casual, no deep reasoning needed |
| Group chats | Tier 3 (Free) | Scale without cost |

---

## Provider Setup

### Anthropic (Premium)
```bash
# Set via environment or openclaw auth
export ANTHROPIC_API_KEY=sk-ant-...
```

### OpenRouter (Free + Paid)
```bash
# Get key at openrouter.ai (free signup)
export OPENROUTER_API_KEY=sk-or-...
```

### Groq (Free Tier)
```bash
# Get key at console.groq.com (free signup, no credit card)
export GROQ_API_KEY=gsk_...
```
**Free limits:** ~30 req/min for Llama 3.3 70B, generous daily token allowance

### Cerebras (Free Tier)
```bash
# Get key at cloud.cerebras.ai (free signup)
export CEREBRAS_API_KEY=csk_...
```
**Free limits:** 1,000,000 tokens/day, 3,000+ tok/sec (fastest inference available)

---

## Why NOT These Models (Tested & Failed)

Models that had issues with OpenClaw in testing:

| Model | Issue |
|-------|-------|
| Free models without `:free` suffix on OpenRouter | Charged credits unexpectedly |
| Very small models (<7B) | Too low quality for Guardian personas |
| Models without system prompt support | Can't maintain Shinkami persona |
| DeepSeek V3 (direct API) | Rate limits too aggressive for companion use |

---

## Integration with Other Agent Systems

### OpenClaw + Claude Code
```
User → WhatsApp → OpenClaw (Arcanea Companion)
                        ↓ (coding request detected)
                   Claude Code (via MCP bridge)
                        ↓ (result)
                   OpenClaw → WhatsApp → User
```
OpenClaw can invoke Claude Code as a tool for coding tasks while keeping the Guardian persona for the user interaction.

### OpenClaw + Eliza OS
```
Eliza OS (on-chain AI agent, autonomous)
    ↕ webhook/API
OpenClaw (personal companion, human-facing)
    ↕ messaging
User (WhatsApp/Telegram/Discord)
```
Eliza handles autonomous on-chain operations (trading, NFT minting, DAO voting). OpenClaw is the human interface. They communicate via webhooks.

**Use case:** Eliza mints an Arcanea NFT → webhook to OpenClaw → Shinkami tells you on WhatsApp: "A new creation has entered the world. Shall I show you?"

### OpenClaw + Claude Code + Eliza (Full Triangle)
```
┌─────────────────────────────────────────┐
│         ARCANEA INTELLIGENCE OS         │
├─────────────┬───────────┬───────────────┤
│  OpenClaw   │Claude Code│  Eliza OS     │
│  (Companion)│ (Builder) │ (On-Chain)    │
│             │           │               │
│  Talk       │  Code     │  Act          │
│  Decide     │  Build    │  Trade        │
│  Remember   │  Ship     │  Mint         │
│             │           │               │
│  WhatsApp   │  Terminal │  Blockchain   │
│  Telegram   │  VS Code  │  Solana/Base  │
├─────────────┴───────────┴───────────────┤
│  Shared: Starlight Memory, Guardian     │
│  Personas, Gate Progression, Canon      │
└─────────────────────────────────────────┘
```

**Flow example:**
1. You message Companion on WhatsApp: "Build me a landing page for my new collection"
2. Companion (Shinkami) acknowledges, routes to Claude Code
3. Claude Code builds the page, pushes to GitHub, deploys to Vercel
4. Companion tells you: "The page is live. Shall Eliza mint the collection?"
5. You say "yes" → Eliza mints on-chain
6. Companion: "10 pieces minted on Base. The creation lives."

All three share the same Starlight Memory — every decision, every creation, every insight is remembered.
