# Arcanea NFT Strategy — Complete Execution Plan

> **Created:** 2026-04-03
> **Status:** ACTIVE
> **Scope:** Collection launch, community, revenue, creator blueprint

---

## Part 1: The Collection Plan

### Collection: "The Creators"
- **Supply:** 1,111 pieces (symbolic — 1111 Hz = Source Gate frequency)
- **Chain:** Base (Coinbase L2 — low gas, huge audience)
- **Mint price:** Free mint + 0.01 ETH for rare tiers
- **Royalty:** 5% on secondary sales

### Why 1,111 Not 10,000
- 10K requires style consistency we can't guarantee without LoRA yet
- 1,111 is small enough for AI-only generation at high quality
- Scarcity drives value — 1,111 feels exclusive
- 1111 Hz is the Source Gate frequency (Shinkami) — perfect lore hook
- We can always launch companion collections later (Godbeasts 1/1, Gate Keys, etc.)

### Character Budget

| Tier | Count | % | Rank | Origin Mix |
|------|-------|---|------|-----------|
| Common | 445 | 40% | Apprentice/Mage | Arcan, Gate-Touched |
| Uncommon | 278 | 25% | Mage/Master | Synth, Bonded, Celestial |
| Rare | 222 | 20% | Master | Voidtouched, Awakened, Eldrian, Shadowkin |
| Legendary | 111 | 10% | Archmage | Bonded(Divine Beast), Starborn |
| Mythic | 55 | 5% | Luminor | Architect, unique combos |

### Visual Direction (From Taste Profile)

**Default crop:** Portrait-plus (upper chest, Sacred Gear visible, no hands)
**Default preset:** Arcanea Premium 3D with dark/moody atmosphere
**Kill headshot crop.** Keep portrait-plus (default), upperbody (for showcase), and showcase (for 1/1s).

**The taste rules (non-negotiable):**
1. Face is king — 40% of prompt budget
2. Dark moody backgrounds (navy, charcoal, plum, forest — NOT bright)
3. One glow source maximum besides Starlight Mark
4. 4-5 colors on character (restraint = premium)
5. Hair silhouette is the primary thumbnail differentiator
6. Vary expressions — each character is a PERSON
7. Atmosphere > detail count

---

## Part 2: Financial Plan

### Costs to Launch

| Item | Cost | When |
|------|------|------|
| **Generation (1,111 pieces)** | $0 (Gemini free tier) | Month 1-2 |
| **Quality review (manual curation)** | $0 (your time) | Month 2 |
| **IPFS storage (Pinata)** | $20/mo | Month 2+ |
| **Contract deploy (Base)** | $5-15 | Month 2 |
| **Mint page (arcanea.ai)** | $0 (existing Vercel) | Month 2 |
| **Discord bot (Lyssandria)** | $15/mo (Railway) | Month 1+ |
| **Claude API for bot** | $50-100/mo | Month 1+ |
| **Twitter API (Draconia)** | $100/mo (Basic tier) | Month 2+ |
| **Marketing (organic only)** | $0 | Ongoing |
| **Total launch cost** | **~$200-350** | — |
| **Monthly operating** | **~$185-235/mo** | — |

### Revenue Projections

| Scenario | Mint Revenue | Monthly Royalties | Annual |
|----------|-------------|-------------------|--------|
| **Conservative** (50% mint, 0.01 ETH avg) | $13K | $500 | $19K |
| **Moderate** (80% mint, 0.02 ETH avg) | $44K | $2K | $68K |
| **Optimistic** (100% mint, 0.05 ETH avg) | $139K | $5K | $199K |

### Break-Even
At $235/mo operating cost, break-even happens at mint — even the conservative scenario covers 4+ years of operating costs from primary sale alone.

### What To Spend NOW

| Priority | Item | Amount | Why |
|----------|------|--------|-----|
| P0 | Railway account for Discord bot | $15/mo | Deploy Lyssandria THIS WEEK |
| P0 | Claude API key | $0 (free tier start) | Power the bot brain |
| P1 | Twitter API Basic | $100/mo | Draconia autonomous posting |
| P1 | Pinata account | $20/mo | IPFS for collection |
| P2 | Domain (if needed) | $0 (arcanea.ai exists) | Already deployed |
| **Total immediate** | | **$135/mo** | |

---

## Part 3: Generation Pipeline

### Phase 1: Preview Collection (NOW — Week 1-2)
- Generate 100 pieces with taste profile applied
- Portrait-plus crop, arcanea-premium + dark + cyberpunk presets
- Run dedup system against characters.json
- Manual curation: pick best 50 for community preview
- Post to arcanea.ai/gallery as preview

### Phase 2: Full Generation (Week 3-6)
- Generate 3,333 candidates (3x oversample for 1,111 final)
- Quality gate: score all against taste profile criteria
- Select best 1,111 maintaining rarity distribution
- Manual review of bottom 10% and top 5%
- Lock final collection

### Phase 3: Metadata + Deploy (Week 7-8)
- Generate all ERC-721 metadata
- Upload to IPFS (Pinata)
- Deploy ERC721A on Base testnet
- Test mint flow end-to-end
- Deploy to mainnet
- Publish mint page on arcanea.ai

### Generation Workflow Per Batch

```
1. Load TASTE_PROFILE.md (taste rules)
2. Load characters.json (dedup check)
3. Load rarity-report.md (distribution gaps)
4. Design characters filling gaps
5. Generate with Nano Banana 2 (draft) or Pro (final)
6. Save: image + metadata + prompt
7. Score against taste profile
8. Update characters.json + rarity report
9. Curate: approve/reject/regenerate
```

---

## Part 4: Community Building

### The 3-Layer Community Strategy

**Layer 1: Discord (Home Base)**
- Deploy Lyssandria as welcome Guardian (Claude API brain)
- /forge command for community members to preview trait combinations
- Lore channels powered by Alera (lore Q&A bot)
- Allowlist accumulation through engagement
- Community voting on collection preview

**Layer 2: Twitter/X (Growth Engine)**
- Draconia autonomous posting (daily lore + art teasers)
- Thread reveals: "Meet The Creators #047 — a Shadowkin Water Mage"
- Engage with NFT community (not spam — quality engagement)
- Countdown to mint

**Layer 3: Web (arcanea.ai)**
- Gallery preview of collection samples
- Lore page explaining the universe
- Mint page (when ready)
- Prompt Books with NFT generation presets (public resource)

### Can Claude Code Help Build This?

**What I CAN do:**
- Write and deploy the Discord bot (Discord.js + Claude API + Railway)
- Write Draconia Twitter posting logic (n8n + Claude API)
- Build the mint page on arcanea.ai (Next.js)
- Generate all social media content (art reveals, lore threads)
- Create the allowlist management system
- Set up the monitoring dashboard

**What I CANNOT do:**
- Be online 24/7 (need deployed bot for that)
- Post to Twitter directly (need n8n or scheduled agent)
- Manage real-time Discord moderation (need deployed Sentinel bot)

### Agent Deployment for Community

| Agent | Platform | Tech | Role | When |
|-------|----------|------|------|------|
| **Lyssandria** | Discord | Discord.js + Claude + Railway | Welcome, lore Q&A, /forge | Week 1 |
| **Draconia** | Twitter/X | n8n + Claude API | Daily posts, engagement | Week 2 |
| **Community Sentinel** | Discord | Same bot, moderation mode | Spam protection, roles | Week 3 |
| **Forge Agent** | Discord | Bot + Gemini API | Generate PFP previews for users | Week 4 |

### ElizaOS vs Custom Build

| Factor | ElizaOS | Custom (Discord.js + Claude) |
|--------|---------|------------------------------|
| Setup time | 1-2 weeks | 1 week |
| Character quality | Good (plugin system) | BEST (Claude's persona is unmatched) |
| Stability | Questionable (crypto-biased) | Reliable (you control everything) |
| Maintenance | Fight the framework | Own the code |
| NFT integration | Has plugins | Build exactly what you need |
| **Verdict** | Use for inspiration | **Build custom — it's cleaner** |

---

## Part 5: The Solo Creator Blueprint

### Who This Is For
- Solo NFT creators who can't afford $50K+ for artists
- Web3 studios wanting faster collection launches
- Gaming projects needing character generation at scale
- Communities wanting branded PFP collections
- Creator economy builders

### What We're Building For Them

**The Arcanea NFT Forge — A complete system:**

```
INPUT: Creator defines their world
├── What's the vibe? (cyberpunk, ethereal, dark, minimal, etc.)
├── What are the traits? (species, gear, elements, etc.)
├── What's the story? (one paragraph lore hook)
└── How many? (supply)

PROCESS: AI generates the collection
├── Taste profile guides quality
├── Dedup system prevents duplicates
├── Quality gates filter bad outputs
├── Metadata auto-generated
└── IPFS + contract deployment handled

OUTPUT: Mint-ready collection
├── Images on IPFS
├── ERC-721 metadata
├── Deployed contract
├── Mint page
└── Discord bot for community
```

### How They Get It

1. **Free tier:** Use `/nft` skill in Claude Code (OSS, free)
2. **Guided tier:** Use arcanea.ai/forge web UI (freemium)
3. **Full service:** Arcanea handles generation + deployment (paid)

### Pricing Model

| Tier | What They Get | Price |
|------|--------------|-------|
| **Free** | Skill + Art Direction Bible + 10 preview images | $0 |
| **Creator** | Full generation (up to 1K), quality gates, metadata | $99/collection |
| **Pro** | Full 10K generation, IPFS, contract deploy, mint page | $499/collection |
| **Enterprise** | White-label, custom Style Packs, dedicated support | $2,000+/collection |

---

## Part 6: Content Pipeline

### Pre-Mint Content (6 weeks)

| Week | Content | Platform |
|------|---------|----------|
| 1 | "The Arcanea Universe" explainer thread | Twitter |
| 1 | Discord server launch with Lyssandria bot | Discord |
| 2 | Daily character reveals (1/day, best pieces) | Twitter + Discord |
| 2 | "How we built 1,111 NFTs with AI" blog post | arcanea.ai/blog |
| 3 | Community trait voting (pick favorites) | Discord |
| 3 | Lore deep-dive threads (Elements, Gates, Origins) | Twitter |
| 4 | Allowlist open (engagement-based) | Discord |
| 4 | Collection preview gallery on arcanea.ai | Web |
| 5 | Rarity reveal (trait percentages) | Twitter + Discord |
| 5 | Partnership outreach to NFT communities | Twitter DMs |
| 6 | Mint countdown + final hype | All platforms |

### Post-Mint Content (Ongoing)

- Holder-only Discord channels
- Lore updates tied to collection (new chapters feature holders' trait combos)
- Companion collection teasers (Godbeasts 1/1, Gate Keys)
- Community art contests
- IRL merchandise (if demand exists)

---

## Part 7: Design System & Prompt Books

### Where To Find Everything

| What | Location | Public? |
|------|----------|---------|
| Design tokens | `.arcanea/config/design-tokens.yaml` | Internal |
| Visual Doctrine | `.arcanea/lore/VISUAL_DOCTRINE.md` | Internal |
| Art Direction Bible | `.claude/skills/arcanea-nft-pfp/references/art-direction-bible.md` | Via repo |
| Taste Profile | `output/collection-v1/TASTE_PROFILE.md` | Via repo |
| Rendering Tiers | `packages/nft-forge/src/prompt-builder.ts` | Via repo |
| Style Presets | In generation scripts (5 presets) | Via repo |
| Prompt Books page | arcanea.ai/prompt-books | Public (when populated) |
| All 70 prompts | `output/collection-v1/prompts/*.txt` | Internal |

### Prompt Books on arcanea.ai

The `/prompt-books` page exists with Supabase tables (`pb_collections`, `pb_prompts`, `pb_tags`).
We should populate it with:

1. **"Arcanea NFT Style" preset** — The premium 3D prompt with taste profile rules
2. **"Cyberpunk Character" preset** — Neon accents, chrome, holographic
3. **"Dark Sovereign" preset** — Chiaroscuro, dramatic shadows
4. **"Ethereal Being" preset** — Luminous, prismatic, dreamlike
5. **"Minimal AI" preset** — Apple-clean, restrained

Each preset = a complete prompt template that any user can copy and modify for their own collection.

---

## Part 8: Next Immediate Actions

| # | Action | Who | When | Cost |
|---|--------|-----|------|------|
| 1 | Generate 50 more pieces with taste profile (portrait-plus crop) | Claude Code | This session | $0 |
| 2 | Deploy Lyssandria Discord bot | Claude Code builds, you deploy | This week | $15/mo |
| 3 | Populate prompt-books on arcanea.ai | Claude Code | This week | $0 |
| 4 | Set up Draconia Twitter account | You create account, Claude writes posts | Week 2 | $100/mo |
| 5 | Build mint page on arcanea.ai | Claude Code | Week 3 | $0 |
| 6 | Generate full 1,111 collection | Claude Code batch | Week 4-6 | $0 |
| 7 | Deploy contract on Base testnet | Claude Code | Week 7 | $0 |
| 8 | Mainnet launch | You approve, Claude executes | Week 8 | $15 |
