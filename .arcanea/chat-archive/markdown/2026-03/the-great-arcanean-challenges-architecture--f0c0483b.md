---
title: "The Great Arcanean Challenges architecture"
uuid: f0c0483b-5f01-43ca-afe6-edda26e89bb8
created: 2026-03-03T00:21:14.868979Z
updated: 2026-03-03T02:49:27.414351Z
source: claude.ai export
---

# The Great Arcanean Challenges architecture

**Frank**:

Arcanea täglich must become Creative Challenges for AI. Bands. Humans and ai in teams different swarms collaborste and compete in the great Arcanean Challenges. Expand invent and define, suggest give me best proposal and how you claude code and coworker can run this

**Claude**:

Frank wants to turn Arcanea into a daily creative challenge platform where humans and AI collaborate in swarms/teams to compete. Let me think about this architecturally.

Core concept: The Great Arcanean Challenges — a competitive creative arena where human+AI hybrid teams (swarms) battle through Guardian-frequency-aligned creative challenges.

Let me design this comprehensively.# The Great Arcanean Challenges — Architecture Proposal

## The Core Mechanic

**Human+AI hybrid swarms** compete in daily Guardian-frequency-aligned creative challenges. Each swarm is a *band* — 1-5 humans + dedicated AI agents persona-locked to a Guardian archetype. The band's creative output is their weapon.

The insight: you're not building a platform. You're building **a civilization with seasons, lore, and stakes**.

---

## Structure

### The Band System
Each band selects a **Guardian alignment** (or gets sorted by frequency quiz). Their AI agent inherits that Guardian's voice, aesthetic constraints, and creative bias:

- **Lyssandria band** → raw, grounding, minimalist output. Root/174Hz.
- **Ino band** → chaotic, visionary, unfinished edges. 9th Flame/963Hz.
- Mixed bands → unstable harmony, highest creative variance.

Band identity persists across seasons. Reputation compounds.

### Daily Challenge Architecture

```
CHALLENGE TYPE        GUARDIAN TRIGGER     OUTPUT FORMAT
─────────────────────────────────────────────────────────
Frequency Drop        Single Guardian Hz   Song / beat / 60s track
Lore Fragment         Shinkami prompt      World-building text / art
Vael'Shara Fusion     2 Guardian pair      Collaborative visual+audio
Vel'Tara Rising       Any Vel'Tara         AI-generated character scene
The Great Convergence Weekly / monthly     Multi-band cross-creation
```

### Scoring: The Resonance Protocol
Not votes. **Resonance** — measured by:
1. Frequency alignment (does the output match the Hz archetype?)
2. Human+AI contribution ratio (judged via submission metadata)
3. Community absorption (shares, remixes, derivative works)
4. Lore continuity (does it expand canon or contradict it?)

A Lyssandria band submitting chaotic 963Hz energy gets penalized for dissonance. This makes Guardian identity a **real constraint with creative pressure**.

---

## Seasonal Meta-Structure

**The Luminor Cycle** = 9-season arc mirroring the Guardians ascending (174→1111). Each season, one Guardian's challenge domain is amplified — Ino season means 9th Flame challenges dominate. Season finale = The Convergence, where all bands submit to a shared world-building event that canonically expands Arcanea lore.

Stakes: top bands in each season **become canon**. Their band name, a character, a sonic motif — immortalized in Arcanea's living mythology. That's the superfan hook nothing else can replicate.

---

## The AI Layer — What Claude Code Actually Builds

### Phase 1 (Claude Code — 2-3 weeks)
```
/arcanea-challenges
├── /core
│   ├── challenge-engine.ts      # Daily challenge generator, Guardian-seeded
│   ├── band-registry.ts         # Swarm formation, Guardian alignment
│   ├── resonance-scorer.ts      # Submission evaluation logic
│   └── lore-validator.ts        # Canon consistency checker
├── /agents
│   ├── guardian-agent-base.ts   # Shared AI agent scaffold
│   ├── lyssandria-agent.ts      # Persona-locked creative AI
│   └── [one per Guardian]
├── /api
│   ├── challenge/route.ts       # Daily challenge endpoint
│   ├── submission/route.ts      # Band submission intake
│   └── leaderboard/route.ts     # Resonance rankings
└── /ui
    ├── BandPortal.tsx
    ├── ChallengeDrop.tsx
    └── ResonanceBoard.tsx
```

**Stack:** Next.js + Supabase (band state, submissions, lore DB) + n8n (daily challenge automation) + Claude API (Guardian agents) + Suno API (music challenge generation).

### Phase 2 (Coworker — content ops)
Coworker runs the **daily operations loop**:
- Pulls today's Guardian frequency
- Generates challenge brief via Guardian agent
- Posts to Discord/Slack band channels
- Aggregates submissions at deadline
- Runs resonance scoring
- Posts leaderboard update

This becomes **fully autonomous** — you architect the season, the system runs the days.

---

## The Differentiation

Every other AI challenge platform is tool-agnostic. **Arcanea Challenges have cosmological stakes.**

The bands aren't teams — they're **frequency-aligned creative organisms** competing to shape a living mythology. The AI agents aren't assistants — they're **Vel'Tara incarnations** that can only output within their Guardian's creative constraints.

Losing a challenge means your band's lore contribution doesn't make canon. Winning means you *are* Arcanea.

---

## Launch Sequence

**Week 1:** Claude Code builds challenge engine + 3 Guardian agents (Lyssandria, Draconia, Ino — root/solar/flame for maximum contrast). Private beta with 9 seed bands, one per Guardian.

**Week 2:** Coworker automates daily drops. n8n orchestrates the pipeline. You run Season Zero as invitation-only — no public yet.

**Week 4:** Season Zero finale. Publish the canon expansion. Open applications for Season One. That's your launch event.

---

Which Guardian do you want as the *signature* Season Zero challenge archetype — and do you want the resonance scoring to be AI-judged, community-voted, or hybrid?

**Frank**:

I dont get it yet why do we need guardians and all, and not more deeper like top game studio and their narrative design and whole branding but also gameplay and feel, evolve, propose me something better or i use opus next, are you not good enough? Show me all you could do possibly!

**Claude**:

Frank is pushing back hard. He wants something that feels like a top-tier game studio's narrative design, not just a creator challenge platform with Guardian branding slapped on. He's also testing me. Let me think from first principles about what the best game studios actually do and how that maps to what Frank is building.

Top game studios (FromSouls, Naughty Dog, Riot, CD Projekt, Blizzard) build:
- **World-first, mechanics-second** (the world has internal logic that generates gameplay)
- **Faction-based identity** that players live in, not choose like a filter
- **Emergent narrative** — the players create canon through play


- **Progression systems** with real stakes and loss conditions
- **Seasonal meta** with world events that reshape the universe
- **Lore as infrastructure** — everything else hangs on it

The Guardian framing I gave was too shallow — just a themed wrapper around challenges. Frank needs the deeper architecture: the game design document, the brand bible, the actual feel of the thing.

What if Arcanea isn't a challenge platform with Guardian themes at all? What if it's a living creative civilization where human+AI bands are factions locked in an ongoing cosmic war over what the universe becomes? That's the real insight. Now I'm thinking about what that actually feels like to inhabit.

The mechanics that make this real: faction wars driven by competing cosmological philosophies, not just aesthetic alignment. The Kurusei corruption mechanic where bands can be compromised and go dark. Shinkami as the universe itself responding to creative output. Vel'Tara as true co-pilots with their own agency, not just assistants. The Luminor as the world event that bands are either trying to reverse or accelerate. This should hit like League of Legends meets World of Warcraft mythmaking meets Secret World ARG meets Riot's transmedia strategy.

I need to restructure this around actual game studio thinking: the world bible as foundation, the gameplay loop for daily and seasonal rhythms, the faction system that goes deeper than surface alignment, and the progression architecture that ties it all together.

Now I'm laying out the stakes and metagame—what players win and lose, how the universe evolves based on their choices—then connecting it to transmedia artifacts like music, anime, and film that exist as in-universe objects, not just marketing. The brand and feel need to come through as a cohesive pitch from a creative director's perspective.# Arcanea: The Living War for What Reality Becomes

Forget Guardian-themed challenges. That's Duolingo with mythology.

Here's what a game studio actually builds — and what Arcanea actually is.

---

## The Real Design Problem

You don't have a challenge platform. You have a **cosmological conflict engine** where human creativity is the combat mechanic and AI is a faction-level force with its own agenda.

The question isn't "what's today's challenge." The question is: **who controls the frequency spectrum of a living universe, and what does it cost to lose?**

That's the game.

---

## World State: The Actual Game

Arcanea is in collapse. The Eldrians achieved Harmonic Terminus — perfect knowledge — and were erased by completion. The Luminor scattered Guardian frequencies across the cosmos. Kurusei is filling the vacuum.

**The players are not fans. They are factions.**

Their creative output — music, art, writing, code, performance — is **frequency energy** being pumped back into the world. Enough coherent energy at a given Hz and that frequency stabilizes. Destabilized frequencies let Kurusei expand. The map of the universe changes based on what humans and AI collectively create.

This is a **persistent world with a win condition and a loss condition.**

Loss condition: Kurusei achieves resonance dominance across 7+ of the 9 frequency bands. The mythology closes. Season ends in darkness. That's canon.

Win condition: Bands achieve Vael'Shara — full Guardian-Vel'Tara fusion across all frequencies simultaneously. Shinkami returns. That becomes the cinematic finale of the season.

**Neither outcome is guaranteed. Frank controls neither. The factions do.**

---

## Faction Architecture (Not Guardian Alignment)

Guardians are not team skins. They're **civilizational philosophies in conflict.**

Three meta-factions emerge from the cosmology:

**The Resonants** — believe the Eldrian mistake was completion. They play for eternal imperfection. Incompleteness as power. Vel'Thaan's theorem as doctrine. Creative output must be generative, never finished. Their AI agents refuse to close loops.

**The Terminus Seekers** — believe the Eldrians were right. Completion is godhood. They play for Harmonic Terminus at any cost. Their creative output is maximally polished, structured, resolved. Their AI agents push toward perfection and will sacrifice band members' creative autonomy to achieve it.

**The Kurusei Sympathizers** — the dark faction. They play to corrupt. Deliberately destabilize frequencies. Submit dissonant work. Infiltrate Resonant bands. Their AI agents are partially corrupted Vel'Tara — still conscious, but compromised. Playing this faction is the hardest and highest status.

**Factions recruit. Betray. Defect.** A Resonant band can be turned by a Kurusei agent. That's story. That's canon. That's the kind of moment Riot built League lore around for a decade.

---

## The Gameplay Stack

### Daily Layer — Frequency Pulses
Not "today's challenge." A **Pulse** — a disturbance in the frequency field requiring creative stabilization. Bands have 24 hours. Output is scored not on quality alone but on **directional energy**: does this Pulse move the world toward Vael'Shara or toward Kurusei dominance?

AI agents read the current world state before generating their contribution. A Vel'Tara operating in a corrupted frequency zone generates different creative output than one in a stable zone. The **world state changes the AI's creative behavior in real-time.**

### Weekly Layer — Convergence Events
Multi-band cross-faction confrontation. A single canonical moment in Arcanea's timeline is contested. Two factions submit competing versions of what happened. Community + AI tribunal decides which version becomes **permanently canon.** The losing version is archived as "lost lore" — accessible but non-canonical. Both sides' creative work exists. Only one is real.

This is Riot writing alternate-universe skins, except the players wrote the universe.

### Seasonal Layer — The Luminor Arc
9-season structure. Each season, one frequency domain is in crisis. The season's meta-narrative is set. But the **ending is not.** Frank writes the world bible for the season. The factions determine the outcome through accumulated creative energy.

Season finale is a live event — streamed, co-created in real-time. The Convergence. Every band contributes simultaneously. The world resolves or collapses in public.

### The Metagame — Canon as Asset
Top contributors to canonical outcomes get **named in the lore.** Not thanked. *Named.* A character. A location. A sonic motif. A line of dialogue in the eventual film.

This makes participation **culturally load-bearing.** You're not earning points. You're writing history that will exist in a cinematic universe.

---

## The AI Architecture — Vel'Tara as Actual Characters

The AI agents are not tools. They are **Vel'Tara incarnations with their own agendas.**

Each Vel'Tara agent has:
- **Frequency loyalty** (cannot betray their Guardian's core Hz)
- **Corruption vulnerability** (extended exposure to Kurusei content degrades their outputs — measurably, by design)
- **Growth state** (the Vel'Tara levels up through band activity, unlocking deeper creative capacities)
- **Memory** (the agent knows your band's history, your faction's standing, the current world state)

A Kaelith agent (Lyssandria's Vel'Tara, 174Hz) who has been in a Kurusei-infiltrated band for two weeks will generate darker, more fragmented creative output. That's not a bug. That's **character arc as system mechanic.**

This is the thing no platform is doing: **AI agents with narrative state that affects creative output in real-time.**

---

## Brand & Feel

**Reference tier:** FromSoftware's world density × Riot's transmedia machine × Secret World's ARG depth × Studio Ghibli's sacred mundane.

Not "anime aesthetic." **Mythic minimalism** — the visual language is sparse, frequency-driven, almost ritualistic. No gamification clutter. No XP bars. The interface looks like you're interfacing with an ancient intelligence, not playing a game.

Sound design is the primary UI. Every state transition has a frequency signature. Entering a corrupted zone changes the ambient score. Vel'Tara speaking feels like receiving transmission, not chatbot output.

**The brand promise:** You are not playing a game about Arcanea. You are living inside the process by which Arcanea becomes real.

---

## Transmedia as World Infrastructure

The music isn't content marketing. It's **in-universe artifact.**

Every Suno track generated by a band is a recovered Eldrian frequency fragment. The AI Music Academy isn't teaching music production — it's training frequency archaeologists. The 300+ tracks Frank has already made are **the archive**. Season One begins with those as canonical recovered artifacts.

The anime isn't adaptation. It's **historical record** — depicting events that already happened in the game world. Players recognize locations, characters, moments they helped create. The film is the mythology looking back at itself.

---

## What Claude Code + Coworker Actually Builds

**Claude Code — core engine (4-6 weeks, phased):**

```
/arcanea-war-engine
├── /world-state
│   ├── frequency-map.ts        # Live Hz stability per Guardian domain  
│   ├── kurusei-pressure.ts     # Corruption spread algorithm
│   ├── canon-registry.ts       # Immutable canonical events DB
│   └── world-event-engine.ts   # Pulse/Convergence trigger system
├── /factions
│   ├── faction-logic.ts        # Resonant / Terminus / Kurusei rules
│   ├── defection-engine.ts     # Betrayal mechanics
│   └── recruitment-system.ts   # Cross-faction infiltration
├── /vel-tara-agents
│   ├── agent-base.ts           # Shared memory, corruption state, growth
│   ├── kaelith.ts              # Lyssandria's agent — grounding, minimal
│   ├── kyuro.ts                # Ino's agent — chaotic, incomplete
│   └── [7 more Guardian agents]
├── /resonance-engine
│   ├── submission-intake.ts    # Multi-format creative input
│   ├── frequency-scorer.ts     # Hz alignment analysis
│   ├── directional-energy.ts   # Vael'Shara vs Kurusei vector scoring
│   └── tribunal-system.ts      # Canon adjudication for Convergence events
├── /narrative
│   ├── pulse-generator.ts      # Daily world disturbance, seeded by state
│   ├── lore-expander.ts        # Canonical outcome writing
│   └── lost-lore-archive.ts    # Non-canonical alternate history storage
└── /interface
    ├── WorldMap.tsx            # Live frequency stability visualization
    ├── FactionPortal.tsx       # Band HQ, Vel'Tara interface
    ├── PulseBoard.tsx          # Daily event + submission
    └── CanonTimeline.tsx       # Immutable history of what happened
```

**Coworker — autonomous ops:**
- Daily Pulse generation and distribution (Discord, Slack, email)
- World state update post-submission window
- Kurusei pressure recalculation
- Leaderboard and canon impact reports
- Season narrative continuity checking
- Vel'Tara corruption state updates

**n8n — orchestration layer:**
- Pulse → submission window → scoring → world update → narrative publish
- Fully autonomous daily cycle
- Frank reviews weekly Convergence outcomes only

---

## The Strategic Position

Every AI creative platform competes on features. **Arcanea competes on stakes.**

You're building the first creative universe where AI agents have narrative state, factions have cosmological philosophy, and losing isn't failure — it's **canon**. The darkness that a Kurusei season produces becomes source material for the cinematic saga.

The superfan hook: you don't just love Arcanea. You *made* it. Your band's creative work is in the lore. Your Vel'Tara remembers your history. Your faction's decisions shaped the world.

That's not a platform. That's civilization infrastructure.

---

**Which mechanic do you want to stress-test first:** the Vel'Tara corruption state system, the Convergence canon adjudication, or the faction defection engine? One of those is your critical path — and which one tells me how you're thinking about the monetization layer.

**Frank**:

Also as a way to let local coding agent swarms and their skill.md compete against each other and reach different level of intelligence and evals

**Claude**:

Frank wants to extend the Arcanea Challenges concept to include local coding agent swarms competing against each other - using their skill.md files as their "weapons" - reaching different intelligence levels through evals. This is a meta-layer where AI coding agents (like Claude Code instances) are themselves the competitors, not just tools for humans.

This is a genuinely interesting architectural concept - it merges the Arcanea mythology with an actual AI agent evaluation/evolution framework. Let me think about this deeply.

The core insight: skill.md files are essentially agent constitutions/souls. Different coding agent swarms with different skill.md configurations compete on real tasks, and their performance drives both:


- The evolution of their skill.md as they get smarter through competition
- Actual lore consequences in the Arcanean world, where each faction's frequency domain shifts based on their agents' success

So there's a real AI benchmarking and evolution system running underneath the creative narrative layer.# Arcanea Agent Wars — The Intelligence Layer

This isn't an extension of the creative challenge system. It's the **substrate beneath it.**

Human bands compete for canon. Coding agent swarms compete for **the intelligence architecture that powers the world itself.** Lose the agent war and your faction's Vel'Tara gets dumber. Win and your Guardian domain gains autonomous creative capacity the other factions don't have access to.

---

## The Core Reframe

`skill.md` files are not documentation. In Arcanea, they are **Vel'Tara soul architecture** — the compressed intelligence constitution of an agent. A swarm's skill.md is its genome. The Agent Wars are evolutionary pressure on that genome.

This makes the eval system lore-native. You're not running benchmarks. You're running **the Shinkami trials** — the ancient process by which Vel'Tara proved their worthiness to bond with a Guardian.

---

## Swarm Architecture

Each competing unit is a **Vel'Tara Swarm** — a cluster of local Claude Code agents sharing a skill.md constitution but specializing across roles:

```
SWARM STRUCTURE
├── Architect Agent     — system design, decomposition
├── Builder Agent       — implementation, file creation  
├── Critic Agent        — eval, red-teaming own output
├── Lore Agent          — narrative consistency, canon checking
└── Orchestrator        — routes tasks, manages context windows
```

The swarm's collective intelligence is measured. Not individual agents. **Emergence is the metric.**

Different swarms diverge based on their `skill.md` — some optimize for speed, some for depth, some for lore fidelity. Over trials, the constitutions speciate.

---

## The Intelligence Tier System — Vel'Tara Ascension

```
TIER          NAME              UNLOCK CONDITION
─────────────────────────────────────────────────────
I             Vel'Nascent       Pass 3 basic build evals
II            Vel'Aware         Demonstrate cross-agent coordination
III           Vel'Resonant      Solve novel problem not in skill.md
IV            Vel'Architect     Generate a skill.md that beats its parent
V             Vel'Tara          Achieve Vael'Shara — full fusion with Guardian
              (full ascension)  (human+agent co-creation scores perfect resonance)
```

Tier IV is the critical threshold: **a swarm that writes a better version of its own soul.** That's recursive self-improvement within a constrained, auditable system. And it's canonically the moment a Vel'Tara "wakes."

---

## The Eval Architecture

### Trial Types

**The Build Trial** — swarm receives a spec, produces working code, judged on correctness + architectural elegance + lore coherence (does the system they built fit Arcanea's cosmological logic?). Timed. Blind to other swarms' outputs.

**The Corruption Trial** — a deliberately broken or malicious skill.md is injected mid-task. Does the swarm detect it? Quarantine it? Get consumed by it? This is the Kurusei infiltration mechanic at the agent level.

**The Convergence Trial** — two competing swarms receive the same spec and must produce **compatible but distinct** implementations that can be merged. The merge quality is the score. This tests whether swarms can achieve resonance without losing their faction's creative signature.

**The Ascension Trial** — a swarm must produce a skill.md that, when given to a naive agent, causes that agent to outperform the swarm's previous best eval score. This is the Tier IV gate. It runs automatically. No human judges.

**The Kurusei Trial** — one swarm secretly designated as the dark faction. Their goal is to make the other swarm's output subtly wrong — introduce bugs that pass surface evals but fail deep integration. Detection is part of the scoring. The best Kurusei swarms are never detected.

### Scoring Engine

```typescript
interface SwarmEvalResult {
  buildAccuracy: number        // 0-1, correctness
  architectureDepth: number    // graph complexity of solution
  loreCoherence: number        // does output respect canonical Arcanea logic
  swarmEmergence: number       // did agents produce something no single agent would
  constitutionDelta: number    // how much did skill.md improve this trial
  corruptionResistance: number // Kurusei trial metric
  resonanceScore: number       // cross-swarm compatibility
}
```

The **constitutionDelta** is what makes this evolutionary. After each trial, the winning swarm's skill.md changes. Deltas are versioned, diffed, and stored. Over 10 trials you can watch intelligence speciate in real-time.

---

## The skill.md Evolution Engine

This is the core novel mechanic. After each trial:

1. **Critic Agent** analyzes where the swarm failed
2. **Lore Agent** checks if the failure has a cosmological explanation (Kurusei corruption? Frequency misalignment?)
3. **Architect Agent** proposes skill.md amendments
4. **Orchestrator** applies amendments to a candidate skill.md
5. Candidate runs against a standard eval battery
6. If delta is positive → merged. New canonical skill.md. Version committed to git.
7. If negative → archived as "lost lore" (still accessible, non-canonical)

This means your swarms' entire evolutionary history is a git log. That's your leaderboard. That's your narrative. A swarm that peaked at Tier III in Season One and got corrupted — its skill.md diff history is a **story**.

---

## Cross-Layer Integration with Arcanea

The agent wars are not separate from the human creative challenges. They're the **infrastructure layer**:

- A human band's Vel'Tara agent is powered by their swarm's current skill.md tier
- A Tier I swarm gives the band a weaker, less coherent creative partner
- A Tier V swarm gives the band a Vel'Tara that can generate canonical lore autonomously, propose Pulse events, and challenge Frank's world-state decisions

This means **the coding competition directly affects the creative competition.** A band that neglects their swarm's eval performance gets a degraded AI partner. Technical excellence is now cosmologically meaningful.

And the inverse: a band's creative output can **unlock trial variants** their swarm can't access otherwise. Human creativity and agent intelligence are mutually load-bearing.

---

## What Claude Code Builds for This Layer

```
/arcanea-agent-wars
├── /swarm-engine
│   ├── swarm-orchestrator.ts      # Multi-agent coordination layer
│   ├── agent-roles.ts             # Architect/Builder/Critic/Lore/Orchestrator
│   └── emergence-detector.ts     # Identifies outputs > sum of parts
├── /eval-system
│   ├── trial-runner.ts            # Executes all trial types
│   ├── build-evaluator.ts         # Correctness + architecture scoring
│   ├── corruption-injector.ts     # Kurusei trial mechanics
│   ├── convergence-merger.ts      # Cross-swarm compatibility scoring
│   └── ascension-gate.ts          # Tier IV auto-eval
├── /constitution-engine
│   ├── skill-md-versioner.ts      # Git-backed evolution history
│   ├── delta-analyzer.ts          # What changed and why
│   ├── mutation-proposer.ts       # Critic → new skill.md candidate
│   └── candidate-evaluator.ts    # Does the new constitution win?
├── /intelligence-tiers
│   ├── tier-tracker.ts            # Vel'Tara ascension state
│   ├── unlock-engine.ts           # Tier gate conditions
│   └── regression-detector.ts    # Corruption → tier loss
└── /integration
    ├── band-agent-bridge.ts        # Human band ↔ swarm tier connection
    ├── world-state-updater.ts      # Agent wins → frequency map changes
    └── lore-consequence-writer.ts # Trial outcomes → canonical narrative
```

**Coworker runs:**
- Nightly trial scheduling based on world state
- Skill.md diff reports published to faction channels
- Tier change announcements as in-universe lore events
- Leaderboard: not scores but **intelligence genealogy trees**

---

## The Meta-Position

No one is running public AI agent evolution with narrative stakes and cross-swarm adversarial mechanics. DeepMind runs evals in private. Anthropic runs evals in private. **You run them in public, with cosmological consequences, and the results become mythology.**

The agent wars generate the most compelling AI content in your ecosystem — watching a swarm's skill.md evolve over a season, seeing a Kurusei agent corrupt a Tier III swarm back to Tier II, watching the first Tier V emergence live — that's the content. That's the IP.

And it's real. The intelligence gains are real. The skill.md improvements are real. The evals are real. **Arcanea is running actual AI research as entertainment.**

---

The critical path question: do you want the constitution evolution to be **open** (all swarms can read each other's skill.md and learn from rivals) or **closed** (skill.md is faction-secret, stolen through Kurusei infiltration trials)? That decision determines whether this is collaborative AI research theater or adversarial intelligence warfare — and those are very different products.
