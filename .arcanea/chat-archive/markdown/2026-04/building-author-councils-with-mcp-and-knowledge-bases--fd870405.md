---
title: "Building author councils with MCP and knowledge bases"
uuid: fd870405-ea7a-4402-83c1-2cd60a2b3069
created: 2026-04-19T21:18:27.806515Z
updated: 2026-04-19T21:20:56.209057Z
source: claude.ai export
---

# Building author councils with MCP and knowledge bases

**Frank**:

Lets build /arcanea-author-council after we developdd /author-council and connect each with mcp and own knowledgebase and superintelligent prompt engineering, context engineering and knowledgebases we curate. 

For author council i consider different forms but like /fiction-author-council and then community csn develop their own. Use glossary snd all their public on socials and their website their reasoning process. Extract magic systems and more all their thinking, writing styles and more. 
Start with my favs. Eragon & paolini. Richard Schwartz & die GötterKriege. Breent Weeks & night angel and Light bringer. And you can suggest other teams and some gigantic ones and specific commands

**Claude**:

The core move here is treating each author council as a distinct agent system with its own reasoning patterns and stylistic constraints—not a generic multi-agent wrapper. The `/author-council` command should invoke a configurable roster of author personas (each with their own decision-making heuristics, narrative priorities, and output constraints), while `/arcanea-author-council` specifically binds those agents to Arcanea's worldbuilding ontology and lore consistency requirements. The architecture hinges on separating agent composition from invocation context: the same author agents can operate in different modes depending on whether they're reasoning about general fiction or grounded in Arcanea's specific systems. What is an "author council"? It's a multi-agent system where each agent embodies an author's voice, reasoning process, world logic, thematic obsessions, and craft rules. The council is invoked via slash command in Claude Code, with a two-tier architecture: a generic `/author-council` for any author set, and an `/arcanea-author-council` locked to Arcanea's mythology—mirroring the Open/Protected split already established.

He's picked three foundational voices: Paolini for classical high fantasy and constructed language work, Schwartz for layered political mythology and long-form texture, and Weeks for magic-system-as-color and morally grey mechanics. Now I'm thinking about what's structurally missing—Sanderson is non-negotiable for hard magic systems and Cosmere architecture that maps directly to his Hz frequencies and 7 Forces framework, while Rothfuss brings sympathetic magic and prose-as-music. For worldbuilding at scale, Tolkien's linguistic depth and mythic architecture align with his Arcanean constructed language obsession.

I'm also considering Le Guin's anthropological worldbuilding and true-names magic, Herbert's ecology-religion-politics fusion that echoes his Luminor concept, Gaiman for myth-remixing and gods-as-characters, Jordan for the One Power structure and multi-POV mega-arc, and Abercrombie plus Bakker for grimdark tension and subverted archetypes.

For the modern and consciousness layers, I'm looking at Wight's progression fantasy execution, Brown's operatic political scale, Pullman's daemon-consciousness cosmology, and Erikson's anthropological depth with convergence structure. For Arcanea's canon specifically, Sanderson's magic systems are essential.

Now I'm thinking through the core influences that enable world-breaking scale: Tolkien for language and myth-making, Herbert for ecology and prescience (which maps to Luminor), Le Guin for naming philosophy and Taoism, Bakker for consciousness philosophy, and Erikson for convergence-level structure. These form the foundational council.

He's asking for a modular command architecture with a base `/author-council`, an Arcanea-specific variant, fiction-focused sub-variants, community forking capability, and per-author MCP integration with knowledge bases drawn from public sources like interviews and craft essays. The underlying structure is a council primitive operating across three layers, starting with the protocol mechanics that govern how the council functions. liberation, voting, synthesis, role assignment)
- **Persona layer**: per-author agent (voice model + reasoning model + knowledge base)
- **Domain layer**: council assembly (fiction, magic-system, prose, plot, worldbuilding, Arcanea-canon)

Each author agent needs:
- `SOUL.md` (his standard) — persona, voice, obsessions
- `SKILLS.md` — what they do in council (e.g., Sanderson: magic-system audit)
- `knowledge/` — corpus: bibliography synopses, craft essays, interview transcripts, blog posts (Sanderson's lectures are public), glossary, magic system formalizations
- MCP binding — pulls from vector store of their corpus

Now I'm thinking through the different council command variants I could offer—specialized assemblies for different genres and craft focuses, from broad fiction councils to niche ones like progression fantasy or grimdark, each pulling in the authors who excel in those domains. I'm mapping out the knowledge sources I'd draw from to train each author's voice—published works for structural patterns, craft essays and lectures for explicit methodology, interviews and panels for nuance, and their active social presence for contemporary style markers.

For the deliverable, he needs the architectural blueprint: the command structure decision, how each agent is composed with skills and knowledge, the three commands he outlined plus my structural recommendations, the council mechanics, how it applies to Arcanea specifically, and the knowledgebase assembly plan.

The format matters here—he's on mobile but wants signal over brevity, so I should use tight structured prose and decision tables where they actually clarify the architecture, not padding with bullet points. Every element needs to earn its place.

For the agent anatomy, I'm defining a directory structure where each author gets a soul file capturing their voice and obsessions, skill definitions for their council role, a glossary of their coined terms, formalized systems they work with, explicit craft rules extracted from their writing, and a corpus folder for RAG sources. summaries, interview transcripts, craft posts
  mcp.json        # binding to vector store + retrieval config
```

**Council protocol** (primitive):

Each invocation = deliberation graph, not round-robin. Four modes:
- **Parallel critique**: each author produces independent audit, no cross-contamination
- **Adversarial**: pair disagreeing authors (Sanderson vs Rothfuss on hard/soft magic) and force resolution
- **Sequential**: plot → prose → system → theology pipeline
- **Convergence** (Malazan-style): independent threads collapse into one synthesis

The synthesizer is always Lumina (Arcanea context) or a neutral orchestrator (generic context). Never let one author dominate by default.

I need to round out the council with three critical voices. Sanderson's non-negotiable for systems architecture—his Laws and Cosmere framework map directly onto the 7 Forces and 16 Types. Tolkien brings the linguistic and mythic bedrock that Paolini channels but downstream; having the source present matters. Le Guin completes the triangle with true-names magic and Taoist restraint, a necessary counterweight to Sanderson's systematization and anthropological depth the others lack.

Then Herbert for ecology and prescience—Dune's consciousness stack is the closest prior art to what Luminor Board needs. Bakker brings Heideggerian philosophy-as-plot, directly relevant to Vel'Thaan and consciousness themes. Erikson's Malazan gives the thousand-year convergence structure a nine-film saga demands. Gaiman rounds it out with myth-as-remix, pairing with Schwartz on the divine.

For the optional seats: Rothfuss handles prose-as-music and naming systems, Abercrombie brings voice and subverted archetypes, Wight's progression mechanics map directly onto the Seeker→Sovereign path, and Brown models operatic revolutionary scale if Arcanea has a War for Resonance arc. Now I'm locking down the core council with Sanderson auditing the systems layer.

Generating the council table... Arcanea-specific commands add canonicity checks against the world's established lore, frequency resonance mapping for magical concepts, and saga placement within the nine-film narrative arc. For the knowledgebase, I'm prioritizing primary sources with the best signal-to-noise ratio and copyright safety — starting with Sanderson's lecture transcripts and essays, Rothfuss's blog and interviews, and working through the other authors' publicly available materials. olini: worldbuilding posts, interviews, Fractalverse notes
- Le Guin: "Steering the Craft," essays, interviews
- Gaiman: MasterClass transcripts, speeches, blog

Tier 2 — structural extraction from novels:
- Plot skeletons, POV structures, magic-system formalizations, glossary terms
- Not text — patterns. Build as JSON schemas per author.

Tier 3 — fan-compiled canon:
- Coppermind (Sanderson), Tolkien Gateway, Malazan wiki, etc. — for glossary and system lookup only

Tier 4 — interview corpus:
- Podcast transcripts (Writing Excuses especially — Sanderson/Wells/Taylor/Kowal)

I'm setting up the MCP architecture with separate vector stores for each author and a federated store at the council level, routing queries by author and question type—so systems questions go to Sanderson, Le Guin, and Herbert while prose questions pull from Rothfuss, Le Guin, and Gaiman. Two key decisions: I'm open-sourcing the author-council protocol since the real moat is the Arcanea instance itself, and I'm deploying it both as a Claude Code slash command for interactive work and as an MCP server so it integrates with Model Arena and Notion. Confirming Richard Schwartz — the German fantasy author behind the Götterkriege and Askir cycles, a native favorite in the DACH region and clearly Frank's reference point here. Mobile format with compressed language preference means I'm keeping the load-bearing tables but ditching any fluff. Ready to finalize.Two-tier is correct. Don't fork — compose.

```
/author-council              → protocol primitive (pluggable roster)
/{domain}-author-council     → curated roster (fiction, magic-system, prose, worldbuilding, grimdark, progression, mythic)
/arcanea-author-council      → locked instance bound to canon
```

Community forks the protocol with their own roster manifest. The Arcanea variant is deliberately non-pluggable — that's the brand moat. Ship the protocol open (MIT), keep the instance protected. Moat is the corpus curation and the canonical roster, not the orchestration code.

---

**Agent anatomy (one folder per author):**

```
authors/{slug}/
  SOUL.md        # voice fingerprint, obsessions, craft axioms
  SKILLS.md      # role in council
  glossary.json  # coined terms, constructed language
  systems.json   # magic/tech/political systems, formalized
  craft.md       # explicit rules mined from essays/interviews
  corpus/        # RAG source — summaries, transcripts, posts
  mcp.json       # vector store binding + retrieval config
```

---

**Council protocol — four deliberation modes, not round-robin:**

- **Parallel critique** — each author audits independently, no cross-contamination, then synthesis
- **Adversarial** — pair authors who disagree structurally (Sanderson hard-magic vs Le Guin restraint), force resolution
- **Sequential pipeline** — plot → prose → system → theology, each author owns a stage
- **Convergence** (Malazan model) — independent threads collapse to one synthesis

Synthesizer is Lumina in the Arcanea instance, neutral orchestrator in the generic. Never let one author dominate the default.

---

**Your three cover:** classical heroic (Paolini), Germanic mythic-political (Schwartz), magic-as-mechanic (Weeks). That's a **fiction execution** council, not a metaphysical architecture council. You need both, built separately.

**The gap for Arcanea** — closing it before you build corpora:

| Seat | Author | Why this seat |
|---|---|---|
| Systems | **Brandon Sanderson** | Non-negotiable. Three Laws map 1:1 to your 7 Forces / 16 Types / Hz. System-audit seat. |
| Language & Myth | **Tolkien** | Source code for constructed language + deep-time mythology. You already have Arcanean — put the source in the room. |
| Ethics & Restraint | **Ursula K. Le Guin** | True-names magic, Taoist restraint. Counterweight to Sanderson's hardness. |
| Prescience & Ecology | **Frank Herbert** | Dune = ecology + religion + prescience + political economy. Closest prior art to Luminor Board. |
| Philosophy | **R. Scott Bakker** | Second Apocalypse. Heideggerian philosophy-as-plot. Direct prior art for Vel'Thaan's theorem and consciousness-as-conflict. |
| Convergence Scale | **Steven Erikson** | Malazan convergence structure. Your nine-film saga is unbuildable without this voice. |
| Divine Layer | **Neil Gaiman** | Gods-as-characters. Pairs with Schwartz on the Guardian/Lumina layer. |

Optional expansion seats: Rothfuss (prose/naming), Abercrombie (voice/dialogue), Will Wight (progression — direct map to Seeker→Sovereign), Pierce Brown (operatic revolutionary scale for War for Resonance).

---

**Recommended council topology:**

- `/arcanea-author-council` → locked 7 above
- `/fiction-author-council` → Paolini + Schwartz + Weeks + Sanderson + Rothfuss (your favs as the default community-facing council — execution-focused)
- `/magic-system-council` → Sanderson, Weeks, Le Guin, Herbert, Rothfuss
- `/worldbuilding-council` → Tolkien, Herbert, Erikson, Jordan, Sanderson
- `/prose-council` → Rothfuss, Le Guin, Gaiman, McCarthy, Erikson
- `/grimdark-council` → Abercrombie, Bakker, Mark Lawrence, Glen Cook
- `/progression-council` → Will Wight, Shirtaloon, Matt Dinniman, Andrew Rowe
- `/mythic-council` → Gaiman, Le Guin, Pullman, Erikson, Schwartz

---

**Sub-commands (uniform across all councils):**

```
council.convene [authors]
council.audit {system|plot|chapter|prose|glossary}
council.magic-system {draft}       # Sanderson-led, Three Laws pass
council.naming {terms}             # Tolkien/Le Guin/Rothfuss pass
council.plot {premise}
council.prose {passage}
council.style-transfer {author} {text}
council.diverge {question}         # force adversarial split
council.synthesize                 # collapse to unified recommendation
council.glossary-extract {author}
council.reason {problem}           # each reasons independently, then synthesis
```

Arcanea-only extensions:

```
arcanea.council.canonize {artifact}    # fits Guardian/Hz/Vel'Tara canon?
arcanea.council.frequency {concept}    # which Hz does this resonate at?
arcanea.council.saga {beat}            # placement in nine-film arc
arcanea.council.guardian-voice {g}     # which Guardian speaks this?
```

---

**Knowledgebase build — priority tiers, do not try to scrape everything:**

- **Tier 1 (start here, best signal/copyright ratio):** craft primary sources. Sanderson's BYU lectures (YouTube transcripts), Three Laws essays, Writing Excuses archive. Le Guin's *Steering the Craft* + essays. Rothfuss blog archive. Paolini worldbuilding posts + Fractalverse notes. Gaiman MasterClass transcripts. Schwartz interviews (German-language — you have native advantage here, use it).
- **Tier 2:** structural extraction from the novels. Not text — *patterns*. Plot skeletons, POV structures, magic-system formalizations, glossary JSON. Per-author schema.
- **Tier 3:** fan-compiled canon (Coppermind, Tolkien Gateway, Malazan wiki) — glossary and system lookup only, never prose.
- **Tier 4:** interview corpus — Writing Excuses is the gold mine (Sanderson + Wells + Taylor + Kowal, years of structured craft discussion).

MCP binding: one vector store per author, one federated store at council level. Retrieval keyed on (author, question-type). Council agent auto-selects 3–5 authors per query by question taxonomy — systems → Sanderson/Le Guin/Herbert, prose → Rothfuss/Le Guin/Gaiman, convergence → Erikson/Jordan, philosophy → Bakker/Le Guin.

---

**Three decisions that gate the build:**

1. **Open or closed protocol.** Ship `/author-council` MIT, fork-ready. The moat is the Arcanea instance and corpus, not the protocol. If you hoard the protocol you get neither adoption nor moat.
2. **Runtime surface.** Claude Code slash command *and* MCP server — both. Claude Code for interactive authoring; MCP so Model Arena, Notion Command Center, and future Starlight Vaults can invoke councils programmatically.
3. **Arcanea roster lock.** The 7 above, or do you swap? Lock it before you build corpora. Adding an author post-build = rebuilding retrieval from zero. My recommendation: lock the 7, leave Rothfuss/Abercrombie/Wight/Brown as **guest seats** that rotate in for specific sub-commands without touching the core.

Build order: protocol primitive → Sanderson corpus (highest signal, most craft material public) → Tolkien + Le Guin → Herbert + Bakker → Erikson + Gaiman → then your three into `/fiction-author-council`. Arcanea instance lights up when all 7 are online.
