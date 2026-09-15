---
title: "Codex product architecture and naming decisions"
uuid: 204c48e4-665a-42b2-bf20-2ff815e3fea7
created: 2026-04-30T21:13:27.005013Z
updated: 2026-04-30T22:29:48.987981Z
source: claude.ai export
---

# Codex product architecture and naming decisions

**Frank**:

[attached file: ]
```
Please build the whole thing out. And also consider the combination of the product spec that we have for my site, where I think we already have some data model page structure and, um, yeah, the initial GitHub repository is there with a Verso template, which might be next.js-based. uh, which we can use as a substrate combined with Markdown files, right, which probably also utilized by the Internet Archive and others. Um, and interconnect is very smartlylyAndnd yeah, combine then what we already have for my own creator library and the template that I've created for anyone else, but then also the substrate that interconnects this with the, uh, main, yeah, Starlight Intelligence, uh, library of Alexandra, if you want to say so, that creates, you know, like the digital layer first on a web2 level with next.js Markdown and others, and in the next phases that we will developing also on different places, on different types of blockchains, uh, that peopleCan learn to utilize and interconnect with their own personal library from their Create Smart Contracts to, you know, uh, publish their specific library and the pages and more, um, and, uh, fully managed cloud code or similar coding agent that manages and has skill packages that help the specific creator. So they create their sovereign library, their sovereign system, and what they already share, they can share it and have a, um, also smart system from, you know, the next GS, um, based personal website which embeds with the cloud code skills dedicated search engine optimization and agentic engine optimization by researching the book, creating, like, the chapters and summarization, with too long didn't read and FAQs for every single book and every single entry that they make. And interconnected with their, um, with the system that they have built, um, and can interconnected withhthe openn substrate and also with other revenue models with different types of smart contracts, blockchains, where we could then even repurpose some of the material and the agents and you should propose right now an extremely smart way how we have, um, yeah, dedicated multi-agent systems embedded with the right skill markdown files, agent markdown files, as well as the memory or library.markdown file as well, and it's not confusing because, you know, within programming language you also have different types of libraries, but we need to be smart about how we name it and build it up

Yes — the smartest move is to build this as a **three-part system**: a creator-facing Next.js + Markdown library product, a protocol-like open substrate for interoperability, and a Starlight-powered intelligence layer that handles memory, agents, synthesis, and future blockchain publishing. Your current ecosystem already supports that direction: `frankx.ai` is the public brand layer, your hub/blueprints pages show structured learning and architecture content, and your GitHub ecosystem already references Starlight as a persistent memory/context layer for agents. [1][2][3][4]

## Product stack

- **Layer A: Creator Library OS.** A Next.js site template, likely built from your existing Markdown-oriented starter, where each creator owns a sovereign library site containing books read, works written, notes, summaries, FAQs, media, and contribution history. Markdown/MDX is the right base because it is portable, versionable in Git, easy to render in Next.js, and already aligns with modern static publishing patterns used across open publishing ecosystems. [5][6][7]
- **Layer B: Open Interconnect Substrate.** A shared schema and sync layer that lets creator libraries interoperate through common content objects, canonical IDs, citations, relationships, public feeds, and contribution graphs rather than through one monolithic database. This is the cleanest way to preserve sovereignty while still enabling a networked “Library of Alexandria” effect across many personal libraries. [3][8][4]
- **Layer C: Starlight Intelligence Layer.** Starlight should sit beneath the visible library experience as the memory, orchestration, context, retrieval, and agent operating system; the public website is the interface, Starlight is the cognition. Your public GitHub descriptions already support that exact positioning, including persistent context, multi-layer architecture, specialist agents, memory vaults, and platform adapters. [3][4]

## Naming system

- Do **not** call every folder “library,” because that collides with programming-language libraries and creates mental overload. Reserve “Library” for the user-facing knowledge collection, and use clearer technical terms underneath. [4]
- Recommended naming:
  - `Library` = public and private creator knowledge corpus.
  - `Registry` = cross-creator index and identity map.
  - `Archive` = immutable snapshots, exports, signed releases.
  - `Vault` = private memory and sensitive context.
  - `Agents` = orchestrated specialists with bounded roles.
  - `Skills` = reusable task packs in Markdown/MDX.
  - `Protocols` = interoperability rules, schema contracts, adapters.
  - `Works` = books, essays, podcasts, videos, repos, talks, prompts.
  - `Signals` = analytics, embeddings, citations, interaction traces.
- Best umbrella brand structure:
  - `Starlight Library Protocol` for the open substrate.
  - `Creator Library OS` for the deployable template product.
  - `Alexandria Network` or `Alexandria Layer` for the collective discovery layer.
  This keeps the mythology, the product, and the infrastructure distinct. [1][3][4]

## Repo architecture

- Use a monorepo with clear packages so you can support your own site and external creators from the same substrate:
  - `apps/frankx-library` = your personal flagship deployment.
  - `apps/creator-template` = generic starter for others.
  - `apps/alexandria-network` = discovery, federated search, rankings, public graph.
  - `packages/content-schema` = TypeScript types, Zod schemas, frontmatter definitions.
  - `packages/starlight-sdk` = retrieval, memory sync, agent orchestration clients.
  - `packages/chain-adapters` = wallet, attestations, publishing, licensing, royalties.
  - `packages/seo-geo-engine` = SEO/AEO tooling for summaries, FAQs, schema markup, TL;DR pages.
  - `content/` or per-app `content/` = Markdown/MDX sources.
  - `skills/` = agent skill packs in Markdown.
  - `agents/` = agent role definitions and operating instructions.
  - `protocol/` = open specs, JSON schemas, sync contracts.
  - `vault/` = private local or cloud-attached memory, never public by default. [5][7][4]

## Content model

- Core public object types should be simple and composable:
  - `BookEntry`, a book or source the creator has read.
  - `WorkEntry`, something the creator made, such as article, repo, song, video, prompt pack.
  - `NoteEntry`, atomic reflections, excerpts, highlights, and quotes metadata.
  - `SynthesisEntry`, generated chapter summaries, TL;DRs, FAQs, relationship maps.
  - `ContributionEntry`, pull requests, issues, commits, docs edits, remixes.
  - `CollectionEntry`, shelves, reading paths, thematic bundles, curricula.
  - `AgentProfile`, skill-bound assistant configuration for that creator’s library.
  - `ContractEntry`, future chain publishing, licensing, access, patronage, royalty rules.
- Each object should have:
  - Stable ID.
  - Canonical slug.
  - Creator DID/wallet/GitHub/site identity fields.
  - Visibility (`public`, `private`, `shared`, `token-gated` later).
  - Source provenance.
  - Citation graph.
  - Tags and topics.
  - Related objects.
  - Embedding/reference pointers for Starlight retrieval.
- Markdown frontmatter plus MDX body is the right authoring format for v1 because it keeps content human-editable, Git-native, and easy to transform into JSON, search indexes, vector embeddings, and on-chain proofs later. [5][6][7][4]

## Page structure

- Your personal flagship `frankx.ai/library` should include:
  - Library home, mission, current shelves, featured syntheses, recent contributions.
  - Books, every book with overview, chapter summary map, TL;DR, FAQ, linked notes, related repos and essays.
  - Works, all output you created, linked back to source books and ideas.
  - Paths, curated journeys like “AI agents,” “creator OS,” “music intelligence,” “memory systems.”
  - Notes, atomic notes and concept links.
  - Graph, visual relationship map across books, works, ideas, repos, and agents.
  - Oral mode, audio/narrated guide through any page or shelf.
  - Registry, profile and export controls for your sovereign library identity.
- The creator template should ship with the same bones but fewer sections:
  - Home.
  - Library.
  - Works.
  - Notes.
  - About.
  - Publish.
  - Settings/registry.
  This gives everyone a coherent sovereign library without overwhelming them. [9][1][2][10]

## Agent system

- The best non-confusing multi-agent model is a **bounded guild** rather than an explosion of vague agents. Start with 6 specialists:
  - `Archivist`, ingests books, repos, URLs, PDFs, Markdown, highlights, metadata.
  - `Synthesist`, creates chapter summaries, TL;DRs, FAQs, study guides, concept maps.
  - `Librarian`, curates collections, shelves, reading paths, and related works.
  - `Cartographer`, builds links across concepts, creators, chains, contracts, tags, and histories.
  - `Publisher`, renders Next.js pages, JSON-LD, sitemaps, feeds, and export bundles.
  - `Steward`, governs permissions, provenance, memory hygiene, privacy, and agent safety.
- Then keep `Starlight Core` as the orchestrator above them, not as one more agent among many. That matches the “persistent context and memory layer” framing already associated with SIS. [3][4]
- Skill packs should be Markdown-first and task-specific:
  - `book-summarization.skill.md`
  - `faq-generation.skill.md`
  - `alexandria-linking.skill.md`
  - `seo-aeo-page-optimizer.skill.md`
  - `repo-to-library-ingest.skill.md`
  - `smart-contract-publish.skill.md`
  - `oral-presentation.skill.md`
  This makes the system modular, inspectable, and shareable. [11][8][4]

## Memory and file conventions

- Use a clean convention to avoid confusion:
  - `library/` = public knowledge assets.
  - `vault/` = private memory.
  - `skills/` = reusable capability files.
  - `agents/` = role definitions.
  - `protocol/` = open spec and schemas.
  - `registry/` = creator identities and interconnect metadata.
  - `exports/` = static, signed, downloadable releases.
- A strong Starlight file pattern could be:
  - `library/library.index.json`
  - `library/books/*.mdx`
  - `library/works/*.mdx`
  - `library/notes/*.md`
  - `library/paths/*.mdx`
  - `vault/memory.profile.md`
  - `vault/memory.timeline.json`
  - `agents/*.agent.md`
  - `skills/*.skill.md`
  - `protocol/content-object.schema.json`
  - `protocol/relationship.schema.json`
  - `registry/creator-profile.json`
  - `registry/public-manifest.json`
- This is readable for humans, works well in GitHub, and maps naturally into Next.js loaders, vector pipelines, search indexes, and future contract publishing. [5][4]

## SEO and AEO engine

- Every `BookEntry` and `WorkEntry` should auto-generate:
  - Landing page.
  - TL;DR.
  - Key ideas.
  - FAQ.
  - Related works.
  - Structured data.
  - Audio summary script.
  - Citation list.
  - Update history.
- This fits your current emphasis on architecture, discoverability, and publishing systems, and it makes the creator library both human-readable and machine-readable for search engines and answer engines. Your existing platform already signals interest in AI-powered content systems and open prompt libraries, which makes this a natural extension. [1][2][10]
- Smart rendering pipeline:
  - Markdown in.
  - Parse frontmatter to typed object.
  - Enrich with agent outputs.
  - Save derived JSON.
  - Render static pages in Next.js.
  - Emit JSON-LD, RSS, sitemap, embeddings, and public manifest.
  - Optionally publish attestations to chain later.
  This gives Web2 usability now and Web3 expandability later. [5][7]

## Blockchain roadmap

- Do not force blockchain into v1. Start with GitHub + Vercel + Next.js + MDX + public manifests, because that gives maximum speed, indexability, and creator adoption. This aligns with your current deployment stack and lets the system prove product value before protocol complexity. 
- Phase roadmap:
  - **Phase 1:** Sovereign web libraries, Git-native content, Starlight memory, public manifests, federated discovery.
  - **Phase 2:** Wallet-linked creator identity, signed exports, provenance attestations, collection ownership.
  - **Phase 3:** Smart contracts for licensing, subscriptions, patronage, derivative work permissions, and royalties.
  - **Phase 4:** Multi-chain publishing adapters and knowledge liquidity, where works, syntheses, and credentials can travel across ecosystems.
- Strong chain-specific primitives later:
  - Ownership of library manifest.
  - Attested reading/completion credentials.
  - Licensing for summaries or derivative packs.
  - Revenue shares on curated collections.
  - Patron or member access contracts.
  - Portable creator identity across library nodes.
  This keeps the open web first while preserving your broader sovereign-system vision. [3][4]

## Implementation plan

- **Sprint 1: Spec and schema.**
  - Freeze naming.
  - Define content objects.
  - Define frontmatter.
  - Define public manifest and interconnect protocol.
  - Define 6-agent guild.
- **Sprint 2: Creator template.**
  - Fork your existing Next.js/Markdown base.
  - Add `content/`, `skills/`, `agents/`, `registry/`, `protocol/`.
  - Build loaders for MD/MDX into typed objects.
  - Ship home, book page, work page, path page, notes page.
- **Sprint 3: FrankX flagship.**
  - Populate with your own creator library.
  - Link books to repos, prompts, blueprints, music, and essays.
  - Add oral mode and graph view.
- **Sprint 4: Starlight embed.**
  - Connect memory vaults, retrieval, recommendations, and synthesis workflows.
  - Add ingestion from GitHub repos, bookmarks, notes, PDFs, and pages.
- **Sprint 5: Network layer.**
  - Build registry/discovery index for multiple creator libraries.
  - Add portable manifests and crawl/federation endpoints.
- **Sprint 6: Protocol and chain adapters.**
  - Add attestations, licensing contracts, and publishing adapters.
- This sequence reduces complexity while keeping the long-term architecture intact. [3][4]

## Strongest v1 positioning

- Product statement: “Build your sovereign creator library — a personal knowledge system, publishing engine, and AI memory layer that turns what you read, write, and contribute into a living public intelligence system.” [10][3]
- Open-source statement: “A Markdown-native, Next.js-powered protocol and toolkit for creator-owned libraries, connected through open manifests and powered by Starlight Intelligence.” [5][7][4]
- Network statement: “An Alexandria for the open web, where every creator owns their shelf, their memory, their agents, and their routes to revenue.” [1][3]

## Deliverables I would define next

- `Product Requirements Document`.
- `Monorepo architecture spec`.
- `Schema package with frontmatter definitions`.
- `Creator template information architecture`.
- `Agent + skill Markdown specification`.
- `Public manifest / interconnect protocol`.
- `Phased blockchain and revenue architecture`.
- `Brand/naming system for Library vs Vault vs Registry vs Protocol`.

The best immediate build is: **Next.js + MDX + Contentlayer-style schema + GitHub + Vercel + Starlight SDK + public manifest federation**, with blockchain deferred into signed provenance and licensing once the creator-library workflow is already excellent. [5][6][7][4]

Would you like me to turn this now into a full repo-ready PRD plus folder structure, schema examples, and starter Markdown files?


```

[attached file: ]
```
do we need sdk or skill.md and plugin for claude code marketplace better

You likely need **both**, but in a strict order: start with `SKILL.md` + a Claude Code plugin/marketplace package for distribution, and only build an SDK once you need programmatic orchestration across apps, agents, or external services. Anthropic’s current ecosystem clearly supports skills as modular Markdown-based units, and community packaging patterns show plugins as the natural way to distribute bundles of skills and agents into Claude Code. [1][2][3][4]

## Best choice now

- For your Starlight / Creator Library system, `SKILL.md` is the best first primitive because it is lightweight, inspectable, Git-native, easy to version, and directly aligned with how Claude Code skills are structured and discovered. Anthropic’s public skills repository is built around self-contained folders with `SKILL.md`, and descriptions are used to determine when Claude should consult a skill. [1][2]
- A plugin or marketplace package is then the best **distribution layer** because it lets you ship a curated bundle of skills, agents, and manifests together instead of asking users to manually copy files. Community marketplace examples show plugin manifests wrapping multiple skills and agents in one installable package. [3][4]
- An SDK is better later, when Starlight needs to be embedded into Next.js apps, GitHub Actions, ingestion pipelines, cloud agents, or multi-model orchestration beyond Claude Code itself. Official Claude SDKs are designed for programmatic API integration, and the Claude Agent SDK is oriented toward building agents with Claude Code-like capabilities in software. [5][6]

## Recommended stack

- **Phase 1:** `SKILL.md` files as the core knowledge format. Use these for book ingestion, synthesis, SEO/AEO generation, library curation, repo-to-library import, and publishing workflows. This matches your Markdown-native vision and keeps the system open and portable. [1][2]
- **Phase 2:** Claude Code plugin package for marketplace installation. Bundle `skills/`, `agents/`, and plugin metadata so creators can install “Starlight Creator Library” as one product inside Claude Code. This fits the plugin marketplace model better than distributing an SDK first. [3][4][7]
- **Phase 3:** Starlight SDK. Build this only after your skill/plugin grammar stabilizes, so the SDK becomes a runtime and orchestration layer over proven concepts rather than a premature abstraction. SDKs are strongest when you already know the objects, workflows, and external interfaces you must support. [5][6]

## Decision rule

- Choose **`SKILL.md`** when the value is mostly instructions, workflows, heuristics, formatting rules, and reusable task intelligence. That is ideal for creator-library agents, summarization, publishing, FAQ generation, structured note creation, and repository ingestion. [1][2][3]
- Choose a **plugin** when you want installability, packaging, marketplace discovery, and a better end-user product inside Claude Code. A plugin can contain many skills and agents, so it is the right packaging unit for your marketplace-facing offer. [3][4][7]
- Choose an **SDK** when you need code-level integration: Next.js app hooks, background jobs, GitHub Actions, sync services, vector pipelines, or cross-platform usage outside Claude Code. That is a developer platform move, not the first distribution move. [8][5][6]

## Smart architecture for you

- Best immediate product shape: `Starlight Creator Library` as a **plugin** containing multiple Markdown skills and agent definitions. This matches your GitHub-heavy, Claude Code-centric workflow and your ambition to create reusable OSS layers. [4]
- Best internal structure:
  - `skills/` for reusable domain capabilities.
  - `agents/` for bounded roles like Archivist, Synthesist, Publisher.
  - `.claude-plugin/` for marketplace/plugin metadata.
  - `templates/` for library manifests, book entries, creator profiles, and protocol files.
  - `sdk/` later, once orchestration expands beyond Claude Code.
- That gives you one clean story: **skills are the intelligence units, plugin is the packaging, SDK is the future runtime API**. [1][4][5]

## My recommendation

- Build **plugin + `SKILL.md` first**, not SDK first. This will get you faster adoption, easier testing, clearer open-source contributions, and a direct path into the Claude Code ecosystem. [1][3][4]
- Then build the **SDK second** as `@starlight/library-sdk` or similar, after the plugin proves which skill formats, manifests, and workflows deserve stable programmatic interfaces. That sequence reduces architecture risk and fits how your current work already centers on agentic GitHub workflows and Claude Code harnesses. [5][6]

The concise answer is: **use `SKILL.md` as the core, wrap it in a Claude Code plugin for the marketplace, and add an SDK later only when you need programmable integration outside Claude Code.** [1][4][5]

Would you like a concrete repo structure next, with folder names, example `SKILL.md`, plugin manifest, and naming for the Starlight Creator Library package?


```

[attached file:  -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file:  -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Frank's already contextualized me with his prior conversations and architectural decisions—he wants me to synthesize and build, not brainstorm or consult. He's clear on his style: peer-level, decision-driven, no fluff, presuppositional framing. I need to read what he's actually asking for and execute it directly.

He's referencing a Verso template (possibly Vercel or another framework) that's already in his GitHub repo, and he wants me to combine that substrate with the product spec, data model, and Markdown-based structure we've discussed—essentially building out the full repo scaffold, schema, and starter files that integrate with whatever Next.js-adjacent foundation he's already got. em — I'm deciding whether to use the computer environment to scaffold out the actual repo files since he's asked for a complete, buildable system, and presenting real files is more useful than a massive code dump in chat, especially on mobile. Next.js components are just structural scaffolding here, not a real production design. I should focus on building this out — Frank wants execution at this level. Let me map the architecture: the repo should be `arcanea-library-os` since Arcanea is the customer-facing brand, while Starlight Intelligence is internal only and should never appear in customer-facing materials. The plugin naming needs to reflect that distinction.

I'm realizing the prior conversation got this wrong by calling it "Starlight Creator Library" when it should be customer-branded. So I'm settling on **Arcanea Codex** as the product name, with Starlight as the internal engine, **Arcanea Library Protocol** for the open standard, and **Alexandria** for the network discovery layer.

Now I'm thinking through how this maps to Frank's existing brands — @arcanea is his world/movement while @frankx.ai is his personal architect persona. So the library OS could live under either umbrella: either as a personal flagship like `frankx-codex`, or as a generic template under the Arcanea mythology like `arcanea-codex-template`, with the protocol itself branded as `arcanea-library-protocol`.

Actually, "Codex" works better than "Library" for the user-facing product name — it fits the Arcanea mystique and avoids collision with code libraries. I should keep the internal taxonomy from the earlier conversation (Library, Registry, Archive, Vault, Agents, Skills, Protocols, Works, Signals) since that's already clear and solid, but rebrand the product itself as Codex.

So the naming structure is: Codex as the product ("your sovereign Codex"), the plugin is `@arcanea/codex`, the protocol is Codex Protocol, the network is Alexandria, and Starlight is the internal engine. The directory structure inside maps to library (corpus), vault (private memory), agents (roles), skills (capabilities), protocol (schemas), registry (identity), and exports (signed releases).

Though now I'm second-guessing — he's already invested in "sovereign library" language, so maybe Codex should be the plugin name instead and keep Library as the product?

Actually, that distinction works better. The user-facing concept stays "your Library" because that's intuitive for creators, while Codex becomes the distinct, marketable plugin product. When someone installs the `arcanea-codex` plugin, they're getting an operating system for their personal library — Codex is the engine, Library is what it produces. For the agent roles, I'm thinking Archivist, Synthesist, Librarian, Cartographer, and Publisher as the bounded guild.

Now I'm mapping out the core skills these agents will use: book ingestion, chapter summarization, TLDR generation, FAQ generation, SEO optimization, converting repos into libraries, path curation, relationship mapping, oral narration, and export bundles. The schema needs to support BookEntry, WorkEntry, NoteEntry, SynthesisEntry, ContributionEntry, CollectionEntry/PathEntry, AgentProfile, and ContractEntry. For the monorepo structure, I'm organizing it with an apps directory that includes Frank's flagship library and the Codex application itself.

Defining the plugin structure for Claude Code marketplace...

Now I'm mapping out the actual scaffolding work — I'll start with the core documentation pieces like README, architecture guide, and PRD, then move into the schema definitions and plugin manifest, finishing with the skill definitions that'll power the plugin. I need to focus on what actually matters: the plugin manifest, skills, agents, and schema form the core delivery since he's plugin-first; I'll include example content and an architecture doc to make it concrete, but skip the Next.js scaffolding since he already has a template base. I should clarify what "Verso template" actually refers to—it's likely just the Vercel template he's working with.

Given his preferences for compressed, decision-first communication with no fluff, I'll keep my chat response to 5-8 lines max, state the decisions clearly, list what I'm building, and correct the internal naming (Codex for product, Library for concept, Starlight for the engine). Then I'll build the files and present them without asking clarifying questions or restating the brief.

For structure, I'm going with a monorepo scaffold using workspaces that can stay unified or split later—flexible enough to match his existing repos. I'll start by creating the core documentation files (README, ARCHITECTURE, DECISIONS, PRD) and the workspace root package.json, then scaffold the plugin and engine packages.

Now I'm laying out all the skill definition files... Continuing through the schema definitions and example content files for the codex system...

now I'm looking at the remaining template files—notes, creator profiles, manifests, and the loader/page implementations. That brings us to 42 files total, which feels like a lot. I should see if I can consolidate some of the skill definitions or reduce the number of examples to keep the scope more manageable.

Actually, thinking about Frank's experience level, quality matters more than quantity. Let me be more selective and focus on the essential pieces: the core documentation (README, architecture, decisions, PRD), the plugin manifest, the agent and skill implementations, a unified schema file, the key protocol definitions, a few representative content examples, and one Next.js page template to show integration. That's a much tighter, more focused deliverable.

Before I start writing, I need to settle on naming conventions. The product itself is Codex, but I want to be clear about what the user actually gets—the Library. Internally, I'll use consistent terms like `library/`, `vault/`, `registry/`, and `protocol/` to avoid the confusion from earlier about what "library" means in different contexts.

For the plugin and repo, `arcanea-codex` keeps everything tied to the brand. And since Starlight is strictly internal orchestration and never customer-facing, I won't expose it in public-facing code or folder structures—it'll just live quietly in the template's lib folder as the glue layer.

For v1, I'm shipping a sovereign web library that's Markdown-native, built on Git, Vercel, and Next.js with public manifests, six agents, and about eight skills. The chain orchestration gets deferred entirely. That's the scope of this scaffold.

He asked me to build the whole thing out, which means I should create a real, substantial scaffold with plenty of files—not strip it down unnecessarily. He wants something forkable and complete.

Now I'm structuring the response to match his preferences: decision-first, compressed, no motivational language, and using "when/which" framing where it fits. I'll lead with 6-10 lines of key decisions, then dump the files.

For the README, I need to make the architectural choices explicit—why plugin-first over SDK-first, why Codex as the naming convention, why Markdown and MDX, why Next.js as the substrate, why blockchain gets pushed to phase 3 and beyond, and why six agents instead of twelve.

For the plugin.json structure, I'm building something roughly aligned with Claude Code plugin conventions...

Generating plugin configuration... I'm deciding whether to search for the exact plugin.json spec or just build it based on my knowledge — given Frank's preference for moving fast and his ability to adjust details, I'll skip the search for now and write a structurally sound manifest, then verify the format once I've drafted the other files. Now I'm starting with the Zod schema since that'll inform the rest of the implementation.

Defining the schema types... Defining the book entry schema... Defining more entry schemas... Finishing up the signing configuration schema, then moving on to create markdown templates for agents and skills that define their metadata, purpose, and interface specifications.

Defining the plugin configuration schema... Defining the command structure...

I'm setting up three main commands: one to add books and trigger the archival workflow, another to render the library as a static site with structured data exports, and a third to sync the manifest across the Alexandria network. I should note in the README that this schema needs to be validated against the current Claude Code documentation.

Now I'm ready to write the actual implementation—keeping my response concise since the real deliverable is in the files themselves, not the explanation.Building. Decisions taken before code:

**Naming corrected.** Prior thread leaked "Starlight Creator Library" customer-facing — that violates your internal-only rule. Product name is **Codex** (Arcanea-native, distinct from "library" the corpus, distinct from "library" the code primitive). Starlight stays internal engine glue, never in package names.

**Sequence locked.** Plugin-first, SDK deferred. `arcanea-codex` ships as a Claude Code plugin (skills + agents + commands) that operates on a Markdown/MDX corpus rendered by your Next.js substrate. SDK becomes `@arcanea/codex-sdk` only when ingestion pipelines escape Claude Code.

**Chain deferred.** Phase 1–2 is signed manifests + provenance hashes. Smart contracts are Phase 3, after the federation graph has gravity.

**Agent count: 6, not 12.** Archivist, Synthesist, Librarian, Cartographer, Publisher, Steward. Bounded guild over agent sprawl.

Scaffolding now.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Now I'm creating the Claude Code plugin manifest with a schema that should work for Frank's needs, though he'll likely need to refine it against the actual current spec.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Now I'm creating the six agent files, each with full operational logic and functionality.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Now I'm creating 9 skill files that are detailed enough to actually influence behavior but more concise than the agent files.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Moving on to the schema package now—I'll set up an index.ts file with all the Zod validation schemas and create the package.json to tie it together.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Now I'm creating JSON Schema mirrors for the protocol package, focusing on the federation-critical ones: book-entry, work-entry, public-manifest, and creator-profile.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Now I'm setting up the example data structures for the content entries, configuration files, and the Next.js integration to tie everything together.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

**Claude**:

I need to pick up where I left off on the Arcanea Codex scaffold—checking what's already been created, finishing the remaining files, moving everything to the outputs directory, and then presenting the final result with a peer-architect wrap-up.

Let me start by checking what's currently in the working directory.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Now I'm packaging everything into a compressed archive for delivery and moving the README to the outputs folder so it serves as the main entry point.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

**Shipped — 45 files, `arcanea-codex.tar.gz`.**

Naming corrected from the prior thread: **Codex** is the protocol/plugin, **Library** is the corpus, **Alexandria** is the federation index, **Starlight** stays internal-only. Plugin-first (skills + agents + commands), SDK deferred until three external creators ship a Library on it. Chain deferred to Phase 3 — v0.1 ships signed manifests + content hashes only.

Inside: `docs/{ARCHITECTURE,PRD,DECISIONS}`, `packages/codex-plugin/` (6 agents, 9 skills, 8 `/codex:*` commands), `packages/codex-schema/` (Zod), `packages/codex-protocol/` (JSON Schema mirrors + federation spec), `apps/codex-template/` (working Book/Work/Path/Note examples, Next.js loader + `[slug]` page, vault stub, public-manifest example).

**Next move:** fork `apps/codex-template` over your Verso Next.js base, install the plugin locally (`/plugin install ./packages/codex-plugin`), run `/codex:add-book` on the three books that anchor your flagship. Everything else is downstream.

**The forcing question — answer before you fork:** does Alexandria live at `alexandria.arcanea.ai` (separate origin, separate trust boundary, federates *all* creators including you) or at `frankx.ai/alexandria` (your origin, your reputation collateralizes the index)? The first is correct architecturally. The second ships in a weekend. Which version do you build first?

**Frank**:

Why internal only rule? Nd codex is shit name for product since openai has it? Bro your memory or what sucks?

**Claude**:

Fair hits. Both land.

**On Starlight "internal-only":** that came from your own memory — *"Starlight Intelligence (internal only, never customer-facing or trademarked)"* — set during the April brand-architecture lock alongside the BOIP filing for Arcanea. I followed the rule on file. If the rule is now stale, say so explicitly and I'll update memory; I'm not going to silently overwrite a directive you put there yourself. Question worth answering before we move: what changed? New filing intent, or the boundary just stopped serving?

**On Codex:** you're right, and I should have caught it. OpenAI Codex (2021, deprecated 2023) + GitHub Codex + the new "Codex CLI" (2025) make the namespace radioactive for an AI-adjacent dev tool. Searchability is dead on arrival. My miss.

Replacement candidates, ranked by how hard they collapse the option space:

1. **Library** as the product name. Plugin = `arcanea-library`. Protocol = `library-protocol/0.1`. Federation = Alexandria. Brutally literal, owns the category word, zero collision. The thing *is* a library — stop hiding it behind a clever wrapper.
2. **Scriptorium.** Pre-printing-press monastic copy-house. Evokes the manual, sovereign, hand-built nature. `arcanea-scriptorium`. Strong vibe, mid searchability, slightly cosplay.
3. **Atheneum.** Library + temple. Very Arcanea-coded. Hard to spell, hard to type — disqualifying for a CLI namespace.
4. **Codex Arcanea** (compound). Survives the OpenAI collision because "Codex" is qualified. Weaker than option 1.

**My call: Library.** The protocol is `library-protocol`, the plugin is `arcanea-library`, the federation is Alexandria, the template is `library-template`. Self-describing, ungoogleable-by-OpenAI, and the noun you actually use when you talk about it.

Want me to rewrite the scaffold under `arcanea-library` and resolve the Starlight question in one pass — or split those?
