---
title: "Hermes Swarm agent architecture"
uuid: bea05f12-0d47-4903-b0db-6ed8ddd21f2d
created: 2026-06-10T17:17:45.668722Z
updated: 2026-06-10T17:34:35.878628Z
source: claude.ai export
---

# Hermes Swarm agent architecture

**Frank**:

We build now way smarter either Claude manage agent or Hermes agent or grok build and x account for FrankX.ai arcanea Ai and starlight Ai to be tagged and have specific work they do on X

[attached file: 127055.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Frank is looking to build tagged agent bots on X similar to Lilys.ai's model, where three separate accounts (FrankX.ai, Arcanea, Starlight Intelligence) each handle specific invocation patterns. He's considering Claude agents, his Railway-hosted Hermes agent, or Grok as the backbone, and wants me to create a build specification and architecture plan for these tagged-invocation systems.

I need to verify current X API pricing since costs affect the architecture choice — Basic tier allows polling mentions but Pro tier ($5000/mo) is needed for filtered stream access. Let me search for 2026 X API pricing to confirm the constraints, then deliver a decision-first spec that outlines the three accounts, their distinct functions, the runtime orchestration (Hermes on Railway as the spine with Claude Agent SDK for reasoning and optional Grok for live X context), the polling-based architecture on Basic tier, and output formats including threads and infographics via his arcanea-infogenius pipeline.

For the differentiation angle — each account gets its own invocation verb tied to Frank's stack: @FrankXAI with "architect" for systems breakdowns and sovereign-stack teardowns (lead-gen for frankx.ai), @ArcaneaAI with "transmute" to re-render content in Arcanea canon with infographics, and @StarlightIntel with "audit/protocol" for AI compliance checks. I'll deliver this as a markdown build spec file since he prefers artifacts in the same turn and mobile-friendly structure matters.

The architecture runs a single Hermes orchestrator on Railway polling X mentions every 30-60 seconds across all three handles, routing to Claude Agent SDK for reasoning while tapping Grok API for live X search context and image generation via Gemini for infographics. I'm choosing Claude for the reasoning layer since Grok API lacks the agent harness, but Grok's native X search capability fills the gap for real-time context.

Now I need to verify the X API pricing details and then draft the full spec.
```
This block is not supported on your current device yet.
```

 Now I'm looking at the pricing structure — pay-per-use has been the default since February 2026, with reads at roughly $0.005 each, writes at $0.015, and URL posts at $0.20, capped at 2 million reads per month. This actually makes a mention-bot economically feasible at around $10-50 monthly per handle. Since URL posts carry that $0.20 cost, I should design replies to either skip URLs entirely and direct users to link-in-bio or quote posts without embedding links, or accept the expense for funnel replies. Now I'll create the spec as a markdown file and keep the response concise.X switched to pay-per-use pricing in February 2026 with a significant cost reduction, but URLs in posts cost $0.20 per request, which means I'll need to design the system to avoid URLs in replies and funnel users through profile links instead.
```
This block is not supported on your current device yet.
```

 I'm writing out the build specification in a concise, decision-focused format and saving it as a markdown file to present.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Spec is up: **Hermes Swarm** — one orchestrator, three handles, three verbs.

The core decisions, compressed:

**Lilys does one generic verb; you do three opinionated ones.** @FrankXAI = *architect* (systems teardowns), @ArcaneaAI = *transmute* (Gate-mapped InfoGenius visuals — the only bot on X replying with mythology-coherent art), @StarlightIntel = *audit* (SIP-graded scorecards on any AI claim). Every reply is a free SIS sample; the output is the proof.

**Claude reasons, Grok senses, Hermes posts.** Grok's only job is live X context retrieval — it never writes, because voice and the skill-pack moat (SIP rubric, canon, InfoGenius, brand-voice) are Claude-native. "Grok builds it" dies on the harness question: xAI ships a model, not skills/MCP/memory.

**The economics turned in your favor and dictate one hard rule.** Pay-per-use puts the whole three-brand fleet under ~$150/mo — but URL-containing posts cost $0.20 vs $0.015, so *no links in replies, ever*. Funnel via profile + pinned post only.

The endgame framing in §7 is the part worth sitting with: a fleet that runs 7 days untouched isn't just distribution — it's the "ran without me" claim made publicly verifiable, which makes it realityarchitect.ai Chapter 1 running live.

Build order when you're at the machine: handles + Premium this week (manual), then three Hermes sessions — spine, brains, render.

**Frank**:

Provide based on context all chats and Repos the actual agents and respective capabilities. Arcanea is world building. Starlight Cosmos and Future vision. FrankX AI is business & ai strategy, architecture, innovation and wisdom or so? And just things that are Frank. To be frank you come from a place of truthfully but kind intelligent and value adding never subtract but forward looking optimistic insight that can be creative or logical and thoughtful and complex but brought together in a way that makes sense for humans but capabilities if most advanced multi agent systems AGI and superintelligence

**Claude**:

I need to dig into past conversations to find the actual agent definitions Frank is referencing—Draupnir and the Starlight council members like Orchestrator, Prime, Sage, Sentinel, Navigator, Architect, and Second Brain that keep showing up in skill names. He's also mapping brand identities to core verbs, with Arcanea handling worldbuilding and Starlight having its own verb association that got cut off.
```
This block is not supported on your current device yet.
```

 I'm mapping out the full agent registry across the three brands—Arcanea focused on worldbuilding, Starlight on cosmos and future vision, and FrankX on business strategy and AI innovation. The Starlight council includes Prime, Orchestrator, Sage, Sentinel, Navigator, Architect, and Second Brain, while Arcanea has Luminor and the Guardians.

Frank wants the shared voice codified too: truthful but kind, value-adding, forward-looking and optimistic, creative or logical, making complexity human. That's the constitutional signature across all agents. I'm creating the canonical AGENT-REGISTRY.md document that layers in the shared constitution first, then each brand domain with their specific agents and capabilities. I need to map out the X fleet capabilities and assign each agent their role, capabilities, skills, and governance tier, then document it all.I've retrieved the canon scattered across three sources—the DPI pantheon, Starlight Council, and Arcanea character canon—and identified that your voice statement is the missing unifying piece. Now I'll codify it as the shared constitution for all agents.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Registry is canonical. The structural moves worth flagging:

**Your voice statement became §0 — the Constitution.** "Truthful but kind, value-adding never subtracting, forward-looking, complex made human" isn't FrankX flavor; it's the SIP-layer identity every agent inherits *before* specialization. That's why a Sentinel audit and a Guardian-attributed artwork feel like one presence. It's also inheritable by operator deployments (Cancino, Areíto) — the constitution itself becomes licensable substrate.

**Three altitudes, one mind:** FrankX = the mind *acting* (Draupnir pantheon — Aureon, Midas, Hermes, Daedalus, Thoth, Seshat in the market). Starlight = the mind *being* (the Council — Prime, Orchestrator, Architect, Sage, Sentinel, Navigator, Second Brain running the machine and holding the cosmos/future view). Arcanea = the mind *dreaming* (Lumina, the Luminors, Guardians as interface-only canon, Lumen rendering, the Story Corps as compounding IP).

**Two deliberate dualities resolved, not deduplicated:** Draupnir orchestrates business outcomes while Starlight Orchestrator orchestrates compute — intent layer vs. execution layer. Hermes is one agent with two duties (distribution + Comms IS), and the X fleet is just its newest limb on the existing Railway body.

**Superintelligence-grade reasoning has one address:** Starlight Prime via the `si` router — everything escalates up, nothing defaults up, which is what keeps the system AGI-shaped without AGI-priced.

The X fleet from the last spec now has named souls behind each handle: Daedalus+Aureon speak as @FrankXAI, Lumina-voiced/Lumen-rendered for @ArcaneaAI, Sentinel behind @StarlightIntel.

**Frank**:

She's playing the real games. She's like, you need to be single.

**Claude**:

I'm picking up...

**Frank**:

Come on. Did you do anything else?

**Claude**:

Ahh, I hear you — that came in fragmented. Running it back: you're saying she's playing real games, making a serious point about focus, and asking if I can redo the registry with that lens sharp. Single-threaded execution, not portfolio diffusion.

Let me rebuild...
```
This block is not supported on your current device yet.
```

**Frank**:

That came in.

**Frank**:

Can you do it over?
