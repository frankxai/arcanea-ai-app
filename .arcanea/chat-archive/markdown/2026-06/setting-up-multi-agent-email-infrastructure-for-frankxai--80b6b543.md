---
title: "Setting up multi-agent email infrastructure for frankx.ai"
uuid: 80b6b543-b2e8-4231-9ca7-9b656d98daae
created: 2026-06-02T01:05:56.789496Z
updated: 2026-06-02T01:13:28.303635Z
source: claude.ai export
---

# Setting up multi-agent email infrastructure for frankx.ai

**Frank**:

I set up a Google Workspace and you email Frank@frankx.ai ? And I would like you to suggest and propose how do we, um, expand this? Like, I need support@frankx.ai . I need info at frank x dot a i, maybe, you know, startups at frank x dot a i, investors at blah blah blah. Um, Yeah. All of these, uh, different types of emails. I'm not sure if I need to pay for each new one to Google Workspace, how we manage all of these, like, each one should have its own agent. I'm not sure if this should be Hermes' agent or something else that you can search just... what do we need in ecosystem of a complete team? Each one of my neuro agents having their own email that I can send stuff to, but also that my community can reach out to, uh, who has in the background maybe their own computer or has their own, um, specific setup, specific way of doing things, specific, you know, constraints, as well as capabilities that they can help me to operate at scale. Uh, extremely smart, extremely well done.

**Claude**:

Frank wants to set up multiple role-based email addresses (support@, info@, startups@, investors@) under frankx.ai, each potentially connected to different neuro-agents with their own capabilities and constraints, and he's asking about Google Workspace costs, management, and how to route these addresses to his agents like Hermes.

I need to verify the actual Google Workspace mechanics — specifically whether aliases cost extra (they don't, up to 30 per user) and how groups work — then build out the full architecture showing which addresses should be aliases versus dedicated mailboxes versus groups, how to route incoming mail to the right agent, and how each agent's "computer" and constraints map to its inbox.
```
This block is not supported on your current device yet.
```

 I'm mapping out the key distinctions between email management options in Google Workspace: aliases are free and unlimited up to 30 per user, letting you send and receive from alternate addresses without extra licensing, while Google Groups provide free shared inboxes that can include external members and serve as automation integration points—neither consumes additional licenses.

The critical insight for his multi-agent setup is that he doesn't need a separate paid seat per agent. Instead, the architecture should separate the identity layer (the email address itself—free via aliases or groups), the operational layer (where messages route and get processed), and the login/storage layer (only paid when an agent genuinely needs independent mailbox access). This means most agents can live as aliases or group addresses, with licensing only for agents that truly need their own distinct login and storage. I'm mapping out the remaining email addresses—press, partners, community, legal, billing—and considering whether to use alias domains for brand separation since those are free, though it might be cleaner to keep them consolidated. The core decision comes down to paid seats: one for frank@ with the Hermes orchestrator, and a second dedicated agent service account that handles the group inboxes.

Now I'm thinking through how to assign each role address to a specific neuro-agent with defined constraints and tool scope, starting with Hermes for the core messaging orchestration and building out a roster of named agents for each function. ain, Hz anchor (he has frequency mappings), runtime/"computer" (container + MCP tool scope), constraints (what it may/may not do autonomously — draft vs send), escalation path to Frank.

I should respect his canon: Guardians are *interface layer only*. So the email agents aren't Guardians — they're operational agents (ACOS agents / "neuro agents"). Hermes-style naming. I'll keep them as an operational tier, possibly mapped under SIS Creator IS / a "Comms IS." Actually the cleanest: this is a **Comms Intelligence System** — a new SIS module, or sits under Creator IS + Personal Knowledge & Action IS. I'll frame it as "Comms IS / the Hermes layer."

Now I'm mapping out the email routing: external senders hit the role@ group inbox, which archives and threads messages while simultaneously forwarding them to an ops@ service mailbox under a labeled namespace. The agent runtime authenticates via Gmail API, monitors its label, triages incoming mail, drafts responses using the role@ send-as identity, files conversations, extracts actionable items to Notion, and escalates to Frank based on configured constraints. Each agent gets its own container with specific capabilities and autonomy rules. I'm leaning toward a markdown spec document as the artifact—something self-contained he can drop straight into Notion as a reference guide. It'll cover the email setup, seat allocation, agent roster, routing logic, and autonomy matrix all in one place, which fits how he works.

For the chat response itself, I'll lead with the three core decisions that actually answer his question (cost, seat count, topology), then point him to the artifact for the full canonical spec. That way he gets the insight density upfront without burying the key takeaways.

Now I'm thinking through the agent naming scheme. Since he's got this neuro-agent architecture with Hermes as the comms layer, I'll make Hermes the orchestrator—the chief of staff that owns triage, routing, and escalation policy. Then I'll name the sub-agents with operational titles that fit his aesthetic of magical framing over internal architecture.

I'm proposing role-to-agent mappings that he can rename to match his existing roster: Vesta for tier-1 support (highest autonomy, the hearth), Iris for general inbound and routing, Prometheus for founder/builder intake, and Janus as the gatekeeper for capital relations. I'll frame these as assignable slots rather than fixed canon so he can map them to whatever agents he's already built.

For the remaining channels—Mercury handling deals and business development, Echo amplifying PR and media, and community roles split between Hestia or Orpheus—I'm keeping the Greek messenger theme coherent and operationally distinct from Arcanea's Guardian canon. Legal and billing can either alias to Frank and Thijs or stay draft-only under Themis if needed.

Now I'm mapping out the autonomy tiers: support and info run fully automated within allowlists, the mid-tier channels like startups and press get drafted then approved same-day, while investor and legal communications always escalate for human review. The implementation uses two base seats with role addresses as collaborative Groups that also route to ops under labels, then sets up send-as identities so the agent runtime can authenticate and dispatch from each role address.

Each agent gets its own container with scoped MCP tools, memory namespace, and autonomy tier, all orchestrated by Hermes with escalations back to frank@. I'm also noting that SPF/DKIM/DMARC are already required, and he can add alias domains like arcanea@ for free if needed. For the search question he raised—whether this should be a Hermes agent or something searchable—I'm thinking through how to position that in the spec.

Writing the markdown spec... I'm settling on the spec format — clean architectural prose rather than Frank's conversational voice, since this is a technical document. I'll skip the markdown skill check since it's not in the available list, and just write the markdown directly. Now I'll structure the response: start with the pricing clarity to address his uncertainty, then move into the artifact. I'm structuring this as a Comms IS module within the broader SIS framework, positioning it alongside his existing systems like Creator IS and Family IS, then drafting the full artifact specification.Three decisions collapse this whole question. Take them first, then the spec.

**1. You are not paying per address.** Aliases are free — up to 30 per user, and group addresses like support@ don't count as users at all. You only pay for user licenses; aliases and Google Groups are free and require no additional seats. The unit you pay for is a *mailbox that needs its own login + storage*, not an identity people email. Pricing: Business Starter is $7/user/month and Business Standard $14.40/user/month, with month-to-month carrying a 20% premium over annual. So the entire constellation below costs you **two seats**, not ten.

**2. The mistake to refuse: one agent ≠ one seat.** You're conflating three layers that must stay decoupled:

- **Identity** (the address) → free. Groups + aliases.
- **Mailbox** (where mail physically lands, storage, login) → paid, minimize to 2.
- **Agent** (the autonomous worker) → lives on *your* substrate (ACOS/MCP), not in Workspace. Its "own computer / own constraints / own setup" is a runtime container + Hz system prompt + scoped MCP toolset + memory namespace. The email is just the *channel it owns* — not its body.

Bind the agent's environment to a Workspace seat and you've built something expensive and rigid. Bind it to a *label inside one service mailbox* and you scale to 50 role-agents on one paid seat.

**3. Two seats. `frank@` (you + Hermes orchestrator) and `ops@` (the shared agent service mailbox).** Every role address is a Group that also drops into `ops@` under a label. One agent watches each label, drafts/acts within its sandbox, and replies *send-as* its role address. Hermes sits over the top as switchboard and escalation target. This is a **Comms IS** — the Hermes Layer — a sibling to your existing SIS modules. These are operational agents, explicitly *not* Guardians (interface layer stays untouched).

Full spec — drop it into the Command Center:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

The leverage point: scale role-agents against **labels in one mailbox**, not seats. That's the line between a $14/mo nervous system and a $200/mo one that does the same thing worse.

Two things to position now, not later: which addresses go **Tier A (auto-send)** — I'd cap that at `support@` and `info@` until the KB is dense enough to trust — and whether you want `ops@` to be a true service account from day one (cleaner credential boundary than agents authenticating as you, and it isolates blast radius if a tool scope leaks).

When you're ready I can generate the ACOS agent manifests (one YAML per role from the §4 schema) and the Gmail-routing + send-as setup as an executable runbook.

**Frank**:

not sure you got me right and this then also explain better we have all these emails but all come together under ops or all still each inbox and the hermes agent is actual oss product right i considered

**Claude**:

Frank is pointing out two things I need to clarify: first, whether all these email addresses funnel into a single consolidated ops inbox or if each one maintains its own separate inbox, and second, that Hermes isn't just an internal tool but an actual open-source product he's considering building, so I should reframe it as a productizable solution rather than just a switchboard.

For the inbox topology, I realize both models can coexist at different layers—there's physical convergence at the mailbox level (everything routes to ops@) but logical separation where each address keeps its own identity, threading, and send-as capability. I should present this as an actual decision tree with real alternatives rather than a single predetermined path. And reframing Hermes as OSS changes everything: it shouldn't be locked to his specific workspace setup but instead be a generic email-agent orchestration layer that anyone can deploy against their own inboxes, with his frankx.ai instance serving as the reference implementation and dogfood. That aligns perfectly with how he builds—protocols and platforms, not proprietary products. strong move.

Let me address the topology question first because that's the literal confusion, then the Hermes-OSS reframe which is the bigger architectural pivot.

**Topology: "all come together under ops" or "each its own inbox"?**

The confusion is real and I created it by being terse. There are actually three candidate topologies, and I picked one without naming the alternatives.

**Topology A — Converged:** one physical mailbox (`ops@`) with N logical addresses separated by labels. Each address keeps its own identity for sending and its own thread record in the Group archive, but there's one agent runtime and one place to watch. They come together physically but stay separate logically.

**Topology B — Federated:** each address is a real mailbox with its own login, storage, and everything—closest to the "each has their own computer" mental model, but expensive since it requires one paid seat per address.

**Topology C — Hybrid:** converge most roles under `ops@` but give sensitive inboxes like investors or legal their own seat for isolation and compliance.

The real insight Frank might be missing: "each agent has its own computer" doesn't require "each address has its own mailbox." The agent's isolation actually lives in its runtime container, tool scope, and memory namespace—that's where the real boundaries are. The mailbox is just transport, so you get isolation where it matters without the cost overhead.

But here's where the OSS angle changes everything: if Hermes is a product others deploy, the cleanest abstraction is "Hermes connects to one or more inboxes and routes by rule." It should support both topologies as configuration, not bake in one assumption. Frank's own setup can be converged; a customer with compliance needs runs federated.

If Hermes is the actual product, the architecture flips — it becomes an open-source email-agent orchestration layer running on SIP that anyone can point at their Gmail, Workspace, or any IMAP provider. Agent definitions become portable manifests with role-based scoping, autonomy tiers, and MCP-native tool integration, while frankx.ai serves as the reference deployment (like how SIP has a spec and a canonical instance). This makes the story much stronger: not "I set up email aliases," but "I'm building the open comms-agent runtime; my own inboxes are instance zero."

The product boundary then becomes: Hermes core (OSS) includes the ingest adapters, router, agent manifest schema, autonomy/governance engine, MCP tool-scoping, memory namespacing, and escalation bus. Connectors for Gmail, Workspace, IMAP, Slack, etc. are separate. The moat and monetization sit in the hosted runtime, the agent library/catalog, premium connectors, SIP-native skills, and managed deployment — essentially a Stripe-like model where the core is open but the ecosystem and cloud offering drive revenue.

For licensing, Apache-2.0 makes more sense than MIT for infrastructure that companies will embed and that touches email, since it provides explicit patent protection. That said, SIP uses MIT, so there's a consistency argument. I should note the choice briefly without overanalyzing.

On naming: if Hermes is the product (the runtime), then the orchestrator-of-agents needs clarity — whether the role-agents like Vesta, Iris, and Janus sit inside Hermes or are separate entities in the ecosystem.

Actually, thinking through this more carefully: Frank's-inbox is a deployment of Hermes, and the role-agents are agents defined within it. So Hermes is the engine itself, the named agents are manifests running on top of it. That's cleaner than framing Hermes as "the chief-of-staff agent" — it's the substrate. Though he's been calling it "the Hermes agent," so I should gently clarify that while Hermes can function as an orchestrator agent, the better abstraction for an OSS product is Hermes as the runtime layer, with the chief-of-staff behavior as the default orchestrator agent it ships with.

One thing worth flagging: Hermes is a crowded name in OSS — Facebook's JS engine, various messaging systems. He cares about trademarks based on his earlier notes, so he might want to consider namespacing it for discoverability. I'll do a quick search on "Hermes" to check for naming collisions in the agent and OSS space, especially since React Native's Hermes engine is already well-established in dev tooling. Then I'll structure the response around three things: clarifying the topology confusion and the key distinction between agent isolation and mailbox isolation, pivoting to the OSS reframe, and what changes with that shift.

For the response itself, I'm leaning toward a dense chat answer with maybe a compact table or diagram rather than a full artifact update—he needs clarity and confirmation on the OSS direction more than a new spec right now, though I can offer to fold this into the existing one afterward. produce the manifest schema + product-boundary doc next. Don't over-produce; he's still resolving the model. Producing the OSS product-boundary as an artifact would be valuable though — it's a standalone reference. 

Given his "PRODUCE FIRST" preference, but also that this turn is genuinely a conceptual fork he's still deciding, I'll lead with the crisp explanation and a decision, and produce a focused artifact: the revised topology + Hermes-as-OSS product boundary, since that's a canonical thing he'll want in Notion. Actually — let me not bloat. I'll give the dense answer inline with a clear diagram, surface the naming fact, force the two decisions, and offer the artifact (manifest schema + open-core spec) as the next concrete build. He just got a spec; piling another doc when he's still clarifying the model risks getting ahead of his decision. The two open decisions (topology choice, open-core line) should be HIS to set before I canonize. That matches "questions that collapse the option space and force positioning."

There's tension between his founder preference for production over questions and the fact that he's still deciding on the model. I'll resolve this by leading with my recommended defaults and the explanation, state them as the path forward, and surface the one genuine fork that changes the product—the open-core line—as a positioning question. I'll keep the visual tight and inline rather than a full artifact since clarity is what matters this turn, and offer to canonize once he confirms the topology.

Now I'm doing a name search to check what's available.
```
This block is not supported on your current device yet.
```

 I'm discovering that Hermes Agent by Nous Research has become a major open-source player with over 135,000 GitHub stars since its February 2026 release, and it's MIT licensed with multi-platform capabilities including email integration — essentially implementing the exact architecture Frank is proposing with a unified gateway, multiple platform connections, and autonomous subagents.

The naming collision is total and unrecoverable — "Hermes" is now owned by Nous Research in the agent space. But more critically, the strategic question shifts from building a runtime to adopting Hermes Agent as the foundation and layering differentiated capabilities on top: SIP-native agent manifests, Arcanea governance, the Comms IS persona library, and the autonomy spine would all sit above Hermes's substrate rather than requiring a custom runtime from scratch.

This is the real redirect — he considered building Hermes as an OSS product, but the OSS product already exists with massive adoption (135k stars). The smarter play is building the SIP layer that runs on top of Hermes, which gets him to differentiated value faster while avoiding infrastructure maintenance. I should address the topology question first since that's what he directly asked, then hit him with the Hermes reality that reframes the entire product thesis.

For topology, the confusion resolves to this: physically the converged design puts all role inboxes in one mailbox with labels, but logically each address keeps its own identity, thread record, and agent. The isolation he's imagining isn't in the mailbox — it's in the agent runtime (container, tool scope, memory). I'd recommend the converged model for the first instance (one mailbox, multiple labels, multiple agents), though there are also federated and hybrid options depending on data boundary needs.

With Hermes as the substrate, this becomes cleaner: one gateway watches a single inbox with label routing, and the subagent isolation is already handled at the runtime layer rather than requiring separate mailboxes. So the topology question actually settles itself — converge the mail, isolate the agents through execution environments.

On naming though, "Hermes" is already taken by a major project with significant adoption, so that direction needs to shift.

The real path forward is either adopting Hermes as the gateway runtime and building the SIP-native comms layer on top of it as an OSS skill pack, or renaming the orchestration concept entirely so the comms module has its own identity separate from the runtime.

The strategic insight is that building a competing email-agent runtime against Hermes in 2026 doesn't make sense—the moat is in the SIP protocol, Arcanea integration, persona governance, and Notion-as-intent-authority, none of which Hermes owns. The move is to build that layer on top of Hermes's substrate, which already supports email adapters and isolated subagent execution environments anyway. Own the protocol, not the product.

Before I generate more spec work, I need to force the adopt-versus-build decision here, because if he commits to Hermes as the runtime, the entire framing of what we're building shifts. I'll keep this dense and conversational rather than artifact-heavy.

Wait—re-reading his phrasing more carefully. He's asking whether Hermes is an actual open-source product he'd considered, not proposing to name his thing Hermes. That's Nous's Hermes Agent, and the search confirms it exists. So he's asking whether to build on top of it rather than build from scratch. That's the real decision point I need to surface before we lock in the spec. ing Hermes; he's asking: is Hermes (Nous) the OSS product I should use as the agent substrate here?

That reframes my response: he already has Hermes (Nous) in mind as the substrate. So I should confirm yes, and slot it correctly into the architecture: Hermes Agent = the runtime/gateway layer; your role-agents = Hermes subagents; ops@ = the email adapter target; your differentiation = SIP persona/governance layer. And the naming collision concern is moot for *his internal use* but matters only if he tries to productize under that name — quick flag.

Either reading converges on the same answer: Hermes (Nous) is the substrate, build your layer on top, don't reinvent it. Good. I'll confirm the product is real, place it in the stack, and answer topology. Now I'm structuring the response: confirm Hermes is the right choice (it's real, from Nous, has email adapters and isolated subagent execution), place it as the runtime layer between workspace identity and the SIP governance layer, and clarify that the key decision is building the persona/governance layer on top rather than rebuilding the runtime itself. I'm ready to write this out.Two things, and the second one changes the build.

## Topology — resolve the confusion

I gave you one design without naming the fork. There are three, and the criterion between them is single:

**Does this inbox need its own data boundary / independent login / separate human owner?** No → it's a label. Yes → it's a seat.

- **Converged (recommended):** all role addresses physically land in **one mailbox (`ops@`)**, separated by labels. They *come together* in storage but stay *separate* in identity — each keeps its own send-as address and its own Group thread record. One place to watch, one credential.
- **Federated:** each address is its own real mailbox = its own seat. Maximum isolation, maximum cost. Only justified for hard boundaries (legal, a co-owned brand).
- **Hybrid:** converge everything, peel `investors@` / `legal@` into their own seats.

The reframe that dissolves your "each one should have its own computer" instinct: **that isolation is real, but it does not live in the mailbox. It lives in the agent runtime** — the container + tool scope + memory namespace. Mailbox = transport. Agent sandbox = the "computer." So you get full per-agent isolation *without* paying for per-address mailboxes. Converge the mail; isolate the agents.

## Hermes — yes, it's real, and it's your substrate (not your build)

You're right to have it in mind. Hermes Agent is an MIT-licensed open-source autonomous agent from Nous Research, launched February 2026, that runs on your own infrastructure, connects 20+ messaging platforms through a single gateway, and crossed 135,000 GitHub stars in three months. Critically for your exact ask: its gateway already includes an Email adapter, and it can spawn isolated subagents that each get their own context and execution environment, with results aggregated back to the parent. It runs on backends from local Docker to SSH to serverless sandboxes that hibernate when idle, so a 24/7 agent costs almost nothing.

That *is* "each neuro-agent with its own computer, own setup, own constraints." It already exists. So the stack resolves cleanly:

```
Workspace        identity + transport        role@ Groups → ops@ (one mailbox, labels)
   │
Hermes (Nous)    runtime + email gateway      one gateway on ops@; each role = a subagent
   │                                          with its own execution env + tool scope
SIP layer (YOU)  personas + governance        role manifests, autonomy spine,
                                               Notion = intent authority, Arcanea Hz
```

**The decision this forces:** you are not building the runtime. Building a competing email-agent engine against a 135k-star MIT incumbent that already ships the email adapter and the isolated-subagent model is a losing allocation. Your moat is the layer Hermes *doesn't* have — SIP, the Arcanea persona/Hz library, the autonomy/governance tiers, Notion-as-intent-authority. **Adopt the substrate, own the protocol.** That's literally your own doctrine: catalogs and ecosystems, protocols not products, ride the gravity.

One naming flag: if any of this ever goes public, "Hermes" is gone — it now means Nous's agent in the entire ecosystem. Your comms layer needs a name from your own canon, not the Greek pantheon. Call the module **Comms IS** and give its conductor an Arcanean name.

Want me to rewrite the spec around Hermes-as-substrate — your nine role-agents as Hermes subagent manifests (Hz + tool scope + autonomy tier each), pointed at `ops@`, with the Notion task-emit and escalation bus as the SIP layer you actually build?
